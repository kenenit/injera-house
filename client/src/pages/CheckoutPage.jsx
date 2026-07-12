import { useMemo, useState } from 'react'
import { Minus, Plus, CheckCircle2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import Reveal from '../components/Reveal'
import api from '../api/index.js'

export default function CheckoutPage() {
  const { items, updateQuantity, clearCart } = useCart()
  const { showToast } = useToast()
  const [trackingCode, setTrackingCode]      = useState(null)
  const [loading, setLoading]                = useState(false)
  const [error, setError]                    = useState('')
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', orderType: 'delivery', notes: '',
  })

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )
  const deliveryFee = form.orderType === 'delivery' ? 200 : 0
  const total       = subtotal + deliveryFee

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.post('/orders', {
        customerName: form.name,
        phone:        form.phone,
        email:        form.email,
        address:      form.address,
        orderType:    form.orderType,
        notes:        form.notes,
        items: items.map(({ id, quantity }) => ({ id, quantity })),
      })

      clearCart()
      setTrackingCode(res.data.tracking_code)
      showToast('Order placed! Save your tracking code.', 'success')
    } catch (err) {
      const message = err.response?.data?.error || 'Something went wrong. Please try again.'
      setError(message)
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (trackingCode) {
    return (
      <Reveal type="scale" as="div" className="confirmation-card" role="status">
        <CheckCircle2 size={44} />
        <h2>Order placed successfully!</h2>
        <p>Your meal is being prepared. Use the code below to track your order anytime.</p>
        <div style={{
          margin: '1.5rem auto',
          padding: '1rem 2rem',
          border: '2px solid var(--gold)',
          borderRadius: 8,
          display: 'inline-block',
        }}>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Your tracking code</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', margin: 0 }}>
            {trackingCode}
          </p>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>
          Save this code — go to the <strong>Track</strong> page and enter it to see your order status.
        </p>
      </Reveal>
    )
  }

  return (
    <div className="checkout-grid">
      <section className="cart-panel">
        <h2>Your order</h2>
        {items.length === 0 ? (
          <p className="empty-state">Your cart is empty. Add dishes from the menu to begin.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="cart-item">
              <div>
                <h3>{item.name}</h3>
                <p>ETB {Number(item.price).toLocaleString()} each</p>
              </div>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Remove one ${item.name}`}>
                  <Minus size={14} />
                </button>
                <span aria-live="polite">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Add one more ${item.name}`}>
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))
        )}

        <div className="cart-total">
          <span>Subtotal</span>
          <span>ETB {subtotal.toLocaleString()}</span>
        </div>
        {form.orderType === 'delivery' && (
          <div className="cart-total" style={{ fontSize: 13, color: 'var(--muted)' }}>
            <span>Delivery fee</span>
            <span>ETB 200</span>
          </div>
        )}
        <div className="cart-total" style={{ borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 4 }}>
          <span><strong>Total</strong></span>
          <strong>ETB {total.toLocaleString()}</strong>
        </div>
      </section>

      <section className="checkout-panel">
        <h2>Delivery details</h2>
        {error && (
          <p style={{ color: '#DC2626', fontSize: 14, marginBottom: '1rem' }}>{error}</p>
        )}
        <form onSubmit={handleSubmit} className="checkout-form">
          <label>
            Full name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Phone
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </label>
          <label>
            Email (optional)
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label>
            Order type
            <select
              value={form.orderType}
              onChange={(e) => setForm({ ...form, orderType: e.target.value })}
              style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 4, background: 'transparent', marginTop: 4, width: '100%' }}
            >
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>
          </label>
          {form.orderType === 'delivery' && (
            <label>
              Delivery address
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
              />
            </label>
          )}
          <label>
            Special instructions (optional)
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Allergies, spice level, etc."
            />
          </label>
          <button
            className="primary-btn"
            type="submit"
            disabled={loading || items.length === 0}
          >
            {loading ? 'Placing order...' : 'Place order'}
          </button>
        </form>
      </section>
    </div>
  )
}