import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db/knex.js'

const router = express.Router()

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required' })

    const exists = await db('users').where({ email }).first()
    if (exists) return res.status(409).json({ error: 'Email already registered' })

    const password_hash = await bcrypt.hash(password, 10)
    const [user] = await db('users')
      .insert({ name, email, password_hash, phone, role: 'customer' })
      .returning(['id', 'name', 'email', 'role', 'phone'])

    res.status(201).json({ token: signToken(user), user })
  } catch (err) { next(err) }
})

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' })

    const user = await db('users').where({ email }).first()
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

    const { password_hash, ...safeUser } = user
    res.json({ token: signToken(user), user: safeUser })
  } catch (err) { next(err) }
})

export default router
