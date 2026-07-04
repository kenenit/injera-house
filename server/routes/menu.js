import express from 'express'
import db from '../db/knex.js'

const router = express.Router()

// GET /api/menu/categories — all active categories (for filter chips in UI)
router.get('/categories', async (_req, res, next) => {
  try {
    const categories = await db('categories')
      .where({ is_active: true })
      .orderBy('display_order')
    res.json(categories)
  } catch (err) { next(err) }
})

// GET /api/menu — all available items, optional filters via query params
// ?category_id=1  &featured=true  &vegetarian=true
router.get('/', async (req, res, next) => {
  try {
    const { category_id, featured, vegetarian } = req.query

    let query = db('menu_items as m')
      .join('categories as c', 'm.category_id', 'c.id')
      .select(
        'm.id',
        'm.name',
        'm.description',
        'm.price',
        'm.image_url as image',
        'm.is_vegetarian',
        'm.is_spicy',
        'm.is_featured',
        'm.is_available',
        'c.id as category_id',
        'c.name as category',
        'c.display_order as category_order'
      )
      .where('m.is_available', true)
      .orderBy(['c.display_order', 'm.name'])

    if (category_id)            query = query.where('m.category_id', category_id)
    if (featured === 'true')    query = query.where('m.is_featured', true)
    if (vegetarian === 'true')  query = query.where('m.is_vegetarian', true)

    const items = await query
    res.json(items)
  } catch (err) { next(err) }
})

// GET /api/menu/:id — single menu item
router.get('/:id', async (req, res, next) => {
  try {
    const item = await db('menu_items as m')
      .join('categories as c', 'm.category_id', 'c.id')
      .select(
        'm.*',
        'm.image_url as image',
        'c.name as category'
      )
      .where('m.id', req.params.id)
      .first()

    if (!item) return res.status(404).json({ error: 'Item not found' })
    res.json(item)
  } catch (err) { next(err) }
})

export default router
