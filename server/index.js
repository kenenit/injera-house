import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

import menuRoutes  from './routes/menu.js'
import orderRoutes from './routes/orders.js'
import authRoutes  from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import reservationRoutes from './routes/reservations.js'

dotenv.config()

const app  = express()
const port = process.env.PORT || 4000

// ── Middleware ────────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }))
app.use(morgan('dev'))
app.use(express.json())

// ── Routes ────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', restaurant: 'Injera House 🍲' }))
app.use('/api/menu',   menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auth',   authRoutes)
app.use('/api/admin',  adminRoutes)
app.use('/api/reservations', reservationRoutes)

// ── Global error handler ──────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.message)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

app.listen(port, () => {
  console.log(`🚀  Injera House API running on http://localhost:${port}`)
})