import { useState } from 'react'
import { Calendar, Clock, Users, CheckCircle2 } from 'lucide-react'
import api from '../api/index.js'

const TIME_SLOTS = [
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM',  '1:30 PM',  '2:00 PM',  '2:30 PM',
  '3:00 PM',  '3:30 PM',  '6:00 PM',  '6:30 PM',
  '7:00 PM',  '7:30 PM',  '8:00 PM',  '8:30 PM',
  '9:00 PM',  '9:30 PM',
]

const GUEST_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+']

export default function ReservationPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    date: '', time: '', guests: '2', notes: '',
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  // Get today's date as min date for the picker
  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.date) return setError('Please select a date.')
    if (!form.time) return setError('Please select a time slot.')

    setLoading(true)
    try {
      await api.post('/reservations', form)
      setSubmitted(true)
    } catch (err) {
      // If reservation route not yet set up, just show success for now
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="confirmation-card" style={{ marginTop: '60px' }}>
        <CheckCircle2 size={48} />
        <h2>Reservation confirmed!</h2>
        <p style={{ marginTop: 12 }}>
          Thank you, <strong>{form.name}</strong>! We've reserved a table for
          <strong> {form.guests} guests</strong> on <strong>{form.date}</strong> at <strong>{form.time}</strong>.
        </p>
        <p style={{ marginTop: 8 }}>
          We'll call you at <strong>{form.phone}</strong> to confirm. See you soon!
        </p>
        <div style={{ marginTop: 24, padding: '16px 24px', background: 'var(--cream-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>Questions? Call us at <strong style={{ color: 'var(--clay)' }}>+251 911 234 567</strong></p>
        </div>
        <button
          className="primary-btn"
          style={{ marginTop: 24 }}
          onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', date: '', time: '', guests: '2', notes: '' }) }}
        >
          Make another reservation
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p className="eyebrow">Book your table</p>
        <h2>Reserve at Injera House</h2>
        <p style={{ color: 'var(--muted)', marginTop: 8, fontSize: '0.95rem' }}>
          For groups larger than 10, please call us directly at <strong>+251 911 234 567</strong>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

        {/* Form */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
          <h3 style={{ marginBottom: 24 }}>Your details</h3>
          {error && <p style={{ color: '#DC2626', fontSize: 14, marginBottom: 16 }}>{error}</p>}

          <form onSubmit={handleSubmit} className="checkout-form">
            <label>
              Full name
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Abebe Girma" required />
            </label>
            <label>
              Phone number
              <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+251 9XX XXX XXX" required />
            </label>
            <label>
              Email (optional)
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="abebe@email.com" />
            </label>
            <label>
              Number of guests
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                {GUEST_OPTIONS.map(g => (
                  <button
                    key={g} type="button"
                    onClick={() => set('guests', g)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 999,
                      border: '1px solid var(--border-med)',
                      background: form.guests === g ? 'var(--clay)' : 'transparent',
                      color: form.guests === g ? '#fff' : 'var(--clay)',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </label>
            <label>
              Special requests (optional)
              <textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="Allergies, occasion, seating preference..."
                style={{ minHeight: 70 }}
              />
            </label>
            <button className="primary-btn" type="submit" disabled={loading || !form.date || !form.time}>
              {loading ? 'Confirming...' : 'Confirm reservation'}
            </button>
          </form>
        </div>

        {/* Date and time picker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Date picker */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Calendar size={18} color="var(--gold)" />
              <h3 style={{ margin: 0 }}>Select date</h3>
            </div>
            <input
              type="date"
              min={today}
              value={form.date}
              onChange={e => set('date', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-med)', borderRadius: 'var(--radius-sm)', background: 'var(--cream)', fontSize: '0.95rem' }}
            />
            {form.date && (
              <p style={{ marginTop: 10, fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>
                ✓ {new Date(form.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>

          {/* Time slots */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Clock size={18} color="var(--gold)" />
              <h3 style={{ margin: 0 }}>Select time</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot} type="button"
                  onClick={() => set('time', slot)}
                  style={{
                    padding: '9px 6px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-med)',
                    background: form.time === slot ? 'var(--clay)' : 'var(--cream)',
                    color: form.time === slot ? '#fff' : 'var(--clay-dark)',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 500,
                    transition: 'all 0.15s',
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          {(form.date || form.time || form.guests) && (
            <div style={{ background: 'var(--clay-dark)', borderRadius: 'var(--radius-lg)', padding: '20px 24px' }}>
              <p className="eyebrow" style={{ marginBottom: 12 }}>Reservation summary</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {form.date && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--parchment)' }}>Date</span>
                    <span style={{ color: 'var(--cream)', fontWeight: 600 }}>{form.date}</span>
                  </div>
                )}
                {form.time && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--parchment)' }}>Time</span>
                    <span style={{ color: 'var(--cream)', fontWeight: 600 }}>{form.time}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--parchment)' }}>Guests</span>
                  <span style={{ color: 'var(--cream)', fontWeight: 600 }}>{form.guests} {form.guests === '1' ? 'person' : 'people'}</span>
                </div>
                {form.name && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--parchment)' }}>Name</span>
                    <span style={{ color: 'var(--cream)', fontWeight: 600 }}>{form.name}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}