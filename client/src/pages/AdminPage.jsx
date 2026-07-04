import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/index.js'

const STATUS_COLORS = {
  pending:   '#854F0B',
  confirmed: '#1D4ED8',
  preparing: '#7C3AED',
  ready:     '#059669',
  delivered: '#374151',
  cancelled: '#DC2626',
}

const ALL_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']

// ── Login form ────────────────────────────────────────────────────────────
function LoginForm() {
  const { login } = useAuth()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-card" style={{ maxWidth: 400, margin: '4rem auto' }}>
      <p className="eyebrow">Admin access</p>
      <h2>Sign in</h2>
      <p style={{ marginBottom: '1.5rem', color: 'var(--muted)' }}>
        Only authorized staff can access this page.
      </p>
      {error && (
        <p style={{ color: '#DC2626', marginBottom: '1rem', fontSize: 14 }}>{error}</p>
      )}
      <form onSubmit={handleSubmit} className="checkout-form">
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="admin@injerahouse.com"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
function ReservationsSection() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading]           = useState(true)
  const [updating, setUpdating]         = useState(null)

  useEffect(() => {
    api.get('/reservations')
      .then(res => setReservations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    setUpdating(id)
    try {
      await api.patch(`/reservations/${id}/status`, { status })
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    } catch (err) {
      alert('Failed to update')
    } finally {
      setUpdating(null)
    }
  }

  const STATUS_COLOR = {
    pending:   '#854F0B',
    confirmed: '#059669',
    cancelled: '#DC2626',
  }

  return (
    <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>Reservations</h3>
      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading...</p>
      ) : reservations.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>No reservations yet.</p>
      ) : (
        <div className="admin-list">
          {reservations.map(r => (
            <div key={r.id} className="admin-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <strong>{r.customer_name}</strong>
                    <span style={{
                      fontSize: 11, padding: '2px 10px', borderRadius: 20,
                      background: STATUS_COLOR[r.status] + '22',
                      color: STATUS_COLOR[r.status],
                      textTransform: 'capitalize', fontWeight: 600,
                    }}>{r.status}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
  📅 {new Date(r.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} · 🕐 {r.time} · 👥 {r.guests} guests
</p>
<p style={{ fontSize: 13, color: 'var(--muted)', margin: '2px 0 0' }}>
  📞 {r.customer_phone}
  {r.notes && r.notes !== 'no' && ` · 📝 ${r.notes}`}
</p>
                </div>
                <select
                  value={r.status}
                  disabled={updating === r.id}
                  onChange={e => updateStatus(r.id, e.target.value)}
                  style={{
                    fontSize: 12, padding: '6px 10px',
                    border: '1px solid var(--border)',
                    borderRadius: 4, background: 'var(--surface)',
                    cursor: 'pointer', minWidth: 130,
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Admin dashboard ───────────────────────────────────────────────────────
function Dashboard() {
  const { user, logout }          = useAuth()
  const [orders, setOrders]       = useState([])
  const [stats, setStats]         = useState(null)
  const [filter, setFilter]       = useState('all')
  const [loading, setLoading]     = useState(true)
  const [updating, setUpdating]   = useState(null)

  const fetchOrders = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const res    = await api.get('/admin/orders', { params })
      setOrders(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats')
      setStats(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchOrders(), fetchStats()]).finally(() => setLoading(false))
  }, [filter])

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId)
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status })
      await fetchOrders()
      await fetchStats()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="admin-card">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h2 style={{ margin: 0 }}>Incoming orders</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Signed in as {user.name}</span>
          <button onClick={logout} style={{ fontSize: 12, padding: '6px 14px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', borderRadius: 4 }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: '2rem' }}>
        {[
      { label: 'Total orders',       value: stats.total_orders },
      { label: 'Pending orders',     value: stats.pending_orders },
      { label: 'Total revenue',      value: `ETB ${Number(stats.total_revenue).toLocaleString()}` },
      { label: 'Menu items',         value: stats.menu_items },
      { label: 'Total reservations', value: stats.total_reservations },
      { label: 'Today\'s tables',    value: stats.today_reservations },
    ].map(({ label, value }) => (
      <div key={label} style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: 8 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--gold)' }}>{value}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{label}</div>
      </div>
    ))}

   
  </div>
)}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', ...ALL_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              fontSize: 12,
              padding: '5px 14px',
              border: '1px solid var(--border)',
              borderRadius: 20,
              cursor: 'pointer',
              background: filter === s ? 'var(--gold)' : 'transparent',
              color: filter === s ? '#1C1208' : 'inherit',
              textTransform: 'capitalize',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>No orders found.</p>
      ) : (
        <div className="admin-list">
          {orders.map((order) => (
            <div key={order.id} className="admin-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <h3 style={{ margin: 0 }}>#{order.tracking_code}</h3>
                    <span style={{
                      fontSize: 11,
                      padding: '2px 10px',
                      borderRadius: 20,
                      background: STATUS_COLORS[order.status] + '22',
                      color: STATUS_COLORS[order.status],
                      textTransform: 'capitalize',
                      fontWeight: 600,
                    }}>
                      {order.status}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 2px', fontSize: 14 }}>
                    {order.customer_name} · {order.customer_phone}
                  </p>
                  <p style={{ margin: '0 0 2px', fontSize: 13, color: 'var(--muted)' }}>
                    {order.order_type === 'delivery' ? `📦 ${order.delivery_address}` : '🏠 Pickup'}
                  </p>
                  <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--muted)' }}>
                    {new Date(order.created_at).toLocaleString()}
                  </p>

                  {/* Items */}
                  <div style={{ fontSize: 13 }}>
                    {order.items?.map((item) => (
                      <span key={item.id} style={{ marginRight: 12, color: 'var(--muted)' }}>
                        {item.item_name} × {item.quantity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right side: total + status updater */}
                <div style={{ textAlign: 'right', minWidth: 160 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gold)', marginBottom: 8 }}>
                    ${Number(order.total).toFixed(2)}
                  </div>
                  <select
                    value={order.status}
                    disabled={updating === order.id}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    style={{
                      fontSize: 12,
                      padding: '6px 10px',
                      border: '1px solid var(--border)',
                      borderRadius: 4,
                      background: 'var(--surface)',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    {ALL_STATUSES.map((s) => (
                      <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}  {/* Reservations section */}
<ReservationsSection />
    </div>
  )
}

// ── Main export — shows login or dashboard based on auth state ────────────
export default function AdminPage() {
  const { user } = useAuth()
  if (!user || user.role !== 'admin') return <LoginForm />
  return <Dashboard />
}
