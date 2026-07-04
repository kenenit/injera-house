import express from 'express'
import db from '../db/knex.js'

const router = express.Router()

// ── Helpers ───────────────────────────────────────────────────────────────

// Generates a human-readable tracking code e.g. IH-20260001
async function generateTrackingCode() {
  const year  = new Date().getFullYear()
  const count = await db('orders').count('id as n').first()
  const seq   = String(Number(count.n) + 1).padStart(4, '0')
  return `IH-${year}${seq}`
}

// ── POST /api/orders — place a new order ──────────────────────────────────
// Accepts guest orders (no login required)
// NEVER trusts client-sent prices — always fetches from DB
router.post('/', async (req, res, next) => {
  const trx = await db.transaction()
  try {
    const {
      customerName,
      phone,
      email,
      address,
      orderType = 'delivery',
      notes,
      items, // [{ id: menu_item_id, quantity }]
    } = req.body

    // ── Validate required fields ────────────────────────────────────────
    if (!customerName || !phone)
      return res.status(400).json({ error: 'Name and phone are required' })

    if (!items || items.length === 0)
      return res.status(400).json({ error: 'At least one item is required' })

    if (orderType === 'delivery' && !address)
      return res.status(400).json({ error: 'Delivery address is required' })

    // ── Fetch real prices from DB (never trust client) ─────────────────
    const itemIds   = items.map((i) => i.id)
    const menuItems = await trx('menu_items').whereIn('id', itemIds)
    const menuMap   = Object.fromEntries(menuItems.map((m) => [m.id, m]))

    // Check every item exists and is available
    for (const { id } of items) {
      const m = menuMap[id]
      if (!m)              return res.status(400).json({ error: `Menu item ${id} not found` })
      if (!m.is_available) return res.status(400).json({ error: `"${m.name}" is currently unavailable` })
    }

    // ── Calculate totals ───────────────────────────────────────────────
    const DELIVERY_FEE = orderType === 'delivery'
      ? Number(process.env.DELIVERY_FEE || 50)
      : 0

    let subtotal = 0
    const orderItemsData = items.map(({ id, quantity }) => {
      const m          = menuMap[id]
      const qty        = Math.max(1, Number(quantity))
      const line_total = Number(m.price) * qty
      subtotal        += line_total
      return {
        menu_item_id: m.id,
        item_name:    m.name,
        item_price:   m.price,
        quantity:     qty,
        line_total,
      }
    })

    const total          = subtotal + DELIVERY_FEE
    const tracking_code  = await generateTrackingCode()

    // ── Insert order ───────────────────────────────────────────────────
    const [order] = await trx('orders')
      .insert({
        customer_name:    customerName,
        customer_phone:   phone,
        customer_email:   email || null,
        order_type:       orderType,
        delivery_address: orderType === 'delivery' ? address : null,
        notes:            notes || null,
        subtotal,
        delivery_fee:     DELIVERY_FEE,
        total,
        tracking_code,
        status:           'pending',
      })
      .returning('*')

    // ── Insert order items ─────────────────────────────────────────────
    await trx('order_items').insert(
      orderItemsData.map((oi) => ({ ...oi, order_id: order.id }))
    )

    await trx.commit()

    res.status(201).json({
      message:       'Order placed successfully!',
      tracking_code: order.tracking_code,
      order: {
        ...order,
        items: orderItemsData,
      },
    })
  } catch (err) {
    await trx.rollback()
    next(err)
  }
})

// ── GET /api/orders/track/:code — public order tracking ──────────────────
router.get('/track/:code', async (req, res, next) => {
  try {
    const order = await db('orders')
      .where({ tracking_code: req.params.code.toUpperCase() })
      .first()

    if (!order) return res.status(404).json({ error: 'Order not found. Check your tracking code.' })

    const items = await db('order_items').where({ order_id: order.id })

    // Strip sensitive fields for public tracking
    const { customer_email, user_id, ...publicOrder } = order
    res.json({ ...publicOrder, items })
  } catch (err) { next(err) }
})

// ── GET /api/orders/:id — get single order by ID ─────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const order = await db('orders').where({ id: req.params.id }).first()
    if (!order) return res.status(404).json({ error: 'Order not found' })

    const items = await db('order_items').where({ order_id: order.id })
    res.json({ ...order, items })
  } catch (err) { next(err) }
})

export default router