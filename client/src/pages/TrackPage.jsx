import { useState } from 'react'
import { Search, Package, ChefHat, CheckCircle2, Clock, XCircle, Bike } from 'lucide-react'
import api from '../api/index.js'

const STATUS_CONFIG = {
  pending:   { label: 'Order received',   icon: Clock,         color: '#854F0B', step: 1 },
  confirmed: { label: 'Order confirmed',  icon: CheckCircle2,  color: '#1D4ED8', step: 2 },
  preparing: { label: 'Being prepared',   icon: ChefHat,       color: '#7C3AED', step: 3 },
  ready:     { label: 'Ready for pickup', icon: Package,       color: '#059669', step: 4 },
  delivered: { label: 'Delivered!',       icon: Bike,          color: '#374151', step: 5 },
  cancelled: { label: 'Cancelled',        icon: XCircle,       color: '#DC2626', step: 0 },
}

const STEPS = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']

export default function TrackPage() {
  const [code, setCode]     = useState('')
  const [order, setOrder]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setOrder(null)
    setLoading(true)

    try {
      const res = await api.get(`/orders/track/${code.trim().toUpperCase()}`)
      setOrder(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Order not found. Check your tracking code.')
    } finally {
      setLoading(false)
    }
  }

  const config  = order ? STATUS_CONFIG[order.status] : null
  const Icon    = config?.icon
  const curStep = config?.step || 0

  return (
    <div className="track-page">
      <section className="track-card">
        <p className="eyebrow">Track your meal</p>
        <h2>Enter your tracking code</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: 14 }}>
          Your tracking code was shown after placing your order — it looks like <strong>IH-20260001</strong>
        </p>

        <form onSubmit={handleSubmit} className="track-form">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. IH-20260001"
            required
            style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
          />
          <button className="primary-btn" type="submit" disabled={loading}>
            <Search size={16} /> {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <p style={{ color: '#DC2626', marginTop: '1rem', fontSize: 14 }}>{error}</p>
        )}

        {/* Order result */}
        {order && config && (
          <div className="status-box" style={{ marginTop: '2rem' }}>

            {/* Status badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: config.color + '18',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={24} color={config.color} />
              </div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>#{order.tracking_code}</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: config.color, margin: 0 }}>
                  {config.label}
                </p>
              </div>
            </div>

            {/* Progress bar — only for non-cancelled orders */}
            {order.status !== 'cancelled' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  {STEPS.map((step, i) => {
                    const s      = STATUS_CONFIG[step]
                    const StepIcon = s.icon
                    const done   = curStep > i + 1
                    const active = curStep === i + 1
                    return (
                      <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: done || active ? config.color : 'var(--border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'background 0.3s',
                        }}>
                          <StepIcon size={14} color={done || active ? '#fff' : 'var(--muted)'} />
                        </div>
                        <span style={{ fontSize: 10, color: active ? config.color : 'var(--muted)', textAlign: 'center', lineHeight: 1.3 }}>
                          {s.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Order details */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--muted)' }}>Customer</span>
                <span>{order.customer_name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--muted)' }}>Phone</span>
                <span>{order.customer_phone}</span>
              </div>
              {order.delivery_address && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--muted)' }}>Delivery to</span>
                  <span style={{ textAlign: 'right', maxWidth: '60%' }}>{order.delivery_address}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--muted)' }}>Order type</span>
                <span style={{ textTransform: 'capitalize' }}>{order.order_type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 4 }}>
                <span style={{ color: 'var(--muted)' }}>Total paid</span>
                <strong style={{ color: 'var(--gold)' }}>${Number(order.total).toFixed(2)}</strong>
              </div>
            </div>

            {/* Items */}
            {order.items?.length > 0 && (
              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>ITEMS ORDERED</p>
                {order.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 }}>
                    <span>{item.item_name} × {item.quantity}</span>
                    <span>${Number(item.line_total).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
