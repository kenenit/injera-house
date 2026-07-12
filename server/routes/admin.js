import express from 'express'
import db from '../db/knex.js'
import { requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// All routes below require a valid admin JWT
router.use(requireAdmin)

const VALID_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']

// ── ORDERS ──────────────────────────────────────────────────────────────

// GET /api/admin/orders — all orders, newest first, with search/filter/sort
router.get('/orders', async (req, res, next) => {
  try {
    const { status, search, sort = 'newest' } = req.query
    let query = db('orders')

    if (status && status !== 'all') query = query.where({ status })

    if (search) {
      const term = `%${search.trim().toLowerCase()}%`
      query = query.where((qb) => {
        qb.whereRaw('LOWER(customer_name) LIKE ?', [term])
          .orWhereRaw('LOWER(tracking_code) LIKE ?', [term])
          .orWhereRaw('LOWER(customer_phone) LIKE ?', [term])
      })
    }

    switch (sort) {
      case 'oldest':      query = query.orderBy('created_at', 'asc'); break
      case 'total_desc':  query = query.orderBy('total', 'desc'); break
      case 'total_asc':   query = query.orderBy('total', 'asc'); break
      default:             query = query.orderBy('created_at', 'desc')
    }

    const orders = await query

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
    const { status } = req.body
    if (!VALID_STATUSES.includes(status))
      return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(', ')}` })

    const [updated] = await db('orders')
      .where({ id: req.params.id })
      .update({ status, updated_at: db.fn.now() })
      .returning('*')

    if (!updated) return res.status(404).json({ error: 'Order not found' })
    res.json(updated)
  } catch (err) { next(err) }
})

// ── ANALYTICS ───────────────────────────────────────────────────────────

// GET /api/admin/stats — dashboard analytics
router.get('/stats', async (_req, res, next) => {
  try {
    const startOfToday = db.raw("date_trunc('day', now())")
    const startOfWeek   = db.raw("date_trunc('week', now())")
    const startOfMonth  = db.raw("date_trunc('month', now())")

    const [
      { count: totalOrders },
      { count: ordersToday },
      { count: ordersThisWeek },
      { total: revenueToday },
      { total: revenueThisMonth },
      { total: totalRevenue },
      { count: menuItemsCount },
      { count: pendingCount },
      { count: preparingCount },
      { count: completedCount },
      { count: cancelledCount },
    ] = await Promise.all([
      db('orders').count('id as count').first(),
      db('orders').where('created_at', '>=', startOfToday).count('id as count').first(),
      db('orders').where('created_at', '>=', startOfWeek).count('id as count').first(),
      db('orders').where('created_at', '>=', startOfToday).whereNotIn('status', ['cancelled']).sum('total as total').first(),
      db('orders').where('created_at', '>=', startOfMonth).whereNotIn('status', ['cancelled']).sum('total as total').first(),
      db('orders').whereNotIn('status', ['cancelled']).sum('total as total').first(),
      db('menu_items').count('id as count').first(),
      db('orders').where({ status: 'pending' }).count('id as count').first(),
      db('orders').whereIn('status', ['confirmed', 'preparing', 'ready']).count('id as count').first(),
      db('orders').where({ status: 'delivered' }).count('id as count').first(),
      db('orders').where({ status: 'cancelled' }).count('id as count').first(),
    ])

    // Best & least selling items (by quantity sold, excluding cancelled orders)
    const salesByItem = await db('order_items as oi')
      .join('orders as o', 'oi.order_id', 'o.id')
      .whereNot('o.status', 'cancelled')
      .select('oi.item_name')
      .sum('oi.quantity as total_qty')
      .groupBy('oi.item_name')
      .orderBy('total_qty', 'desc')

    const bestSelling  = salesByItem.slice(0, 5)
    const leastSelling = salesByItem.slice(-5).reverse()

    // Orders per day — last 7 days
    const ordersPerDay = await db('orders')
      .select(db.raw("to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day"))
      .count('id as count')
      .where('created_at', '>=', db.raw("now() - interval '6 days'"))
      .groupByRaw("date_trunc('day', created_at)")
      .orderByRaw("date_trunc('day', created_at)")

    // Sales per week — last 6 weeks
    const salesPerWeek = await db('orders')
      .select(db.raw("to_char(date_trunc('week', created_at), 'YYYY-MM-DD') as week"))
      .whereNot('status', 'cancelled')
      .sum('total as total')
      .where('created_at', '>=', db.raw("now() - interval '6 weeks'"))
      .groupByRaw("date_trunc('week', created_at)")
      .orderByRaw("date_trunc('week', created_at)")

    // Popular categories (by quantity sold)
    const popularCategories = await db('order_items as oi')
      .join('orders as o', 'oi.order_id', 'o.id')
      .join('menu_items as m', 'oi.menu_item_id', 'm.id')
      .join('categories as c', 'm.category_id', 'c.id')
      .whereNot('o.status', 'cancelled')
      .select('c.name')
      .sum('oi.quantity as total_qty')
      .groupBy('c.name')
      .orderBy('total_qty', 'desc')

    res.json({
      total_orders:        Number(totalOrders),
      orders_today:         Number(ordersToday),
      orders_this_week:     Number(ordersThisWeek),
      revenue_today:        Number(revenueToday) || 0,
      revenue_this_month:   Number(revenueThisMonth) || 0,
      total_revenue:        Number(totalRevenue) || 0,
      menu_items:           Number(menuItemsCount),
      pending_orders:       Number(pendingCount),
      preparing_orders:     Number(preparingCount),
      completed_orders:     Number(completedCount),
      cancelled_orders:     Number(cancelledCount),
      best_selling:         bestSelling.map(r => ({ name: r.item_name, qty: Number(r.total_qty) })),
      least_selling:        leastSelling.map(r => ({ name: r.item_name, qty: Number(r.total_qty) })),
      orders_per_day:       ordersPerDay.map(r => ({ day: r.day, count: Number(r.count) })),
      sales_per_week:       salesPerWeek.map(r => ({ week: r.week, total: Number(r.total) || 0 })),
      popular_categories:   popularCategories.map(r => ({ name: r.name, qty: Number(r.total_qty) })),
    })
  } catch (err) { next(err) }
})

// ── CATEGORIES ──────────────────────────────────────────────────────────

router.get('/categories', async (_req, res, next) => {
  try {
    const categories = await db('categories').orderBy('display_order')
    res.json(categories)
  } catch (err) { next(err) }
})

router.post('/categories', async (req, res, next) => {
  try {
    const { name, description, display_order, is_active } = req.body
    if (!name) return res.status(400).json({ error: 'Category name is required' })
    const [category] = await db('categories')
      .insert({ name, description: description || null, display_order: display_order || 0, is_active: is_active ?? true })
      .returning('*')
    res.status(201).json(category)
  } catch (err) { next(err) }
})

router.put('/categories/:id', async (req, res, next) => {
  try {
    const { name, description, display_order, is_active } = req.body
    const [updated] = await db('categories')
      .where({ id: req.params.id })
      .update({ name, description, display_order, is_active, updated_at: db.fn.now() })
      .returning('*')
    if (!updated) return res.status(404).json({ error: 'Category not found' })
    res.json(updated)
  } catch (err) { next(err) }
})

router.delete('/categories/:id', async (req, res, next) => {
  try {
    const inUse = await db('menu_items').where({ category_id: req.params.id }).count('id as count').first()
    if (Number(inUse.count) > 0)
      return res.status(400).json({ error: 'Cannot delete a category that still has menu items. Move or delete those items first.' })
    const deleted = await db('categories').where({ id: req.params.id }).del()
    if (!deleted) return res.status(404).json({ error: 'Category not found' })
    res.status(204).send()
  } catch (err) { next(err) }
})

// ── MENU ITEMS (full CRUD) ──────────────────────────────────────────────

// GET /api/admin/menu — all items regardless of availability, for management UI
router.get('/menu', async (_req, res, next) => {
  try {
    const items = await db('menu_items as m')
      .leftJoin('categories as c', 'm.category_id', 'c.id')
      .select(
        'm.id', 'm.name', 'm.description', 'm.price', 'm.image_url as image',
        'm.is_vegetarian', 'm.is_spicy', 'm.is_featured', 'm.is_available',
        'm.category_id', 'c.name as category', 'm.created_at', 'm.updated_at'
      )
      .orderBy(['c.display_order', 'm.name'])
    res.json(items)
  } catch (err) { next(err) }
})

// POST /api/admin/menu — create a menu item
router.post('/menu', async (req, res, next) => {
  try {
    const { name, description, price, image_url, category_id, is_vegetarian, is_spicy, is_available, is_featured } = req.body
    if (!name || price === undefined || price === null)
      return res.status(400).json({ error: 'Name and price are required' })

    const [item] = await db('menu_items')
      .insert({
        name,
        description: description || null,
        price,
        image_url: image_url || null,
        category_id: category_id || null,
        is_vegetarian: !!is_vegetarian,
        is_spicy: !!is_spicy,
        is_available: is_available ?? true,
        is_featured: !!is_featured,
      })
      .returning('*')
    res.status(201).json(item)
  } catch (err) { next(err) }
})

// PUT /api/admin/menu/:id — update any field of a menu item (name, price,
// description, category, image, availability, etc.)
router.put('/menu/:id', async (req, res, next) => {
  try {
    const fields = ['name', 'description', 'price', 'image_url', 'category_id', 'is_vegetarian', 'is_spicy', 'is_available', 'is_featured']
    const update = {}
    for (const f of fields) if (req.body[f] !== undefined) update[f] = req.body[f]
    update.updated_at = db.fn.now()

    const [updated] = await db('menu_items').where({ id: req.params.id }).update(update).returning('*')
    if (!updated) return res.status(404).json({ error: 'Menu item not found' })
    res.json(updated)
  } catch (err) { next(err) }
})

// PATCH /api/admin/menu/:id/availability — quick hide/show toggle
router.patch('/menu/:id/availability', async (req, res, next) => {
  try {
    const { is_available } = req.body
    const [updated] = await db('menu_items')
      .where({ id: req.params.id })
      .update({ is_available: !!is_available, updated_at: db.fn.now() })
      .returning('*')
    if (!updated) return res.status(404).json({ error: 'Menu item not found' })
    res.json(updated)
  } catch (err) { next(err) }
})

// DELETE /api/admin/menu/:id
router.delete('/menu/:id', async (req, res, next) => {
  try {
    const deleted = await db('menu_items').where({ id: req.params.id }).del()
    if (!deleted) return res.status(404).json({ error: 'Menu item not found' })
    res.status(204).send()
  } catch (err) { next(err) }
})

export default router
