import express from 'express'
import db from '../db/knex.js'
import { requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// POST /api/reservations — make a reservation
router.post('/', async (req, res, next) => {
  try {
    const { name, phone, email, date, time, guests, notes } = req.body
    if (!name || !phone || !date || !time || !guests)
      return res.status(400).json({ error: 'Name, phone, date, time and guests are required' })

    const [reservation] = await db('reservations')
      .insert({
        customer_name:  name,
        customer_phone: phone,
        customer_email: email || null,
        date,
        time,
        guests,
        notes: notes || null,
        status: 'pending',
      })
      .returning('*')

    res.status(201).json({ message: 'Reservation confirmed!', reservation })
  } catch (err) { next(err) }
})

// GET /api/reservations — admin only
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const { date } = req.query
    let query = db('reservations').orderBy('date').orderBy('time')
    if (date) query = query.where({ date })
    const reservations = await query
    res.json(reservations)
  } catch (err) { next(err) }
})

// PATCH /api/reservations/:id/status — admin update status
router.patch('/:id/status', requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body
    const VALID = ['pending', 'confirmed', 'cancelled']
    if (!VALID.includes(status))
      return res.status(400).json({ error: 'Invalid status' })

    const [updated] = await db('reservations')
      .where({ id: req.params.id })
      .update({ status })
      .returning('*')

    res.json(updated)
  } catch (err) { next(err) }
})

export default router