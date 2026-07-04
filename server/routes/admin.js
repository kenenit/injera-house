import express from 'express'
import db from '../db/knex.js'
import { requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// All routes below require a valid admin JWT
router.use(requireAdmin)

// GET /api/admin/orders — all orders, newest first
router.get('/orders', async (req, res, next) => {
  try {
    const { status } = req.query
    let query = db('orders').orderBy('created_at', 'desc')
    if (status) query = query.where({ status })
    const orders = await query

    // Attach items to each order
    const ordersWithItems = await Promise.all(
      orders.map(async (o) => ({
        ...o,
        items: await db('order_items').where({ order_id: o.id }),
      }))
    )
    res.json(ordersWithItems)
  } catch (err) { next(err) }
})

// PATCH /api/admin/orders/:id/status — update order status
router.patch('/orders/:id/status', async (req, res, next) => {
  try {
    const VALID = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']
    const { status } = req.body
    if (!VALID.includes(status))
      return res.status(400).json({ error: `Status must be one of: ${VALID.join(', ')}` })

    const [updated] = await db('orders')
      .where({ id: req.params.id })
      .update({ status, updated_at: db.fn.now() })
      .returning('*')

    if (!updated) return res.status(404).json({ error: 'Order not found' })
    res.json(updated)
  } catch (err) { next(err) }
})

// GET /api/admin/stats — dashboard numbers


router.get('/stats', async (_req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0]

    const [{ count: totalOrders }]       = await db('orders').count('id as count')
    const [{ count: pendingOrders }]     = await db('orders').where({ status: 'pending' }).count('id as count')
    const [{ total: revenue }]           = await db('orders').whereNotIn('status', ['cancelled']).sum('total as total')
    const [{ count: menuItems }]         = await db('menu_items').where({ is_available: true }).count('id as count')
    const [{ count: totalReservations }] = await db('reservations').count('id as count')
    const [{ count: todayReservations }] = await db('reservations').where({ date: today }).count('id as count')

    res.json({
      total_orders:       Number(totalOrders),
      pending_orders:     Number(pendingOrders),
      total_revenue:      Number(revenue) || 0,
      menu_items:         Number(menuItems),
      total_reservations: Number(totalReservations),
      today_reservations: Number(todayReservations),
    })
  } catch (err) { next(err) }
})

export default router
