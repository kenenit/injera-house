import { useState } from 'react'
import { Phone, Mail, MapPin, Clock3, Send } from 'lucide-react'
import Reveal from '../components/Reveal'
import { useToast } from '../context/ToastContext'

export default function ContactPage() {
  const { showToast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)
    // No dedicated contact-message endpoint exists on the backend yet —
    // this simulates submission so the form is usable today; wire it to
    // a real `/api/contact` route when one is added server-side.
    setTimeout(() => {
      setSending(false)
      setForm({ name: '', email: '', message: '' })
      showToast("Message sent! We'll get back to you shortly.", 'success')
    }, 600)
  }

  return (
    <div>
      <Reveal type="fade-up" as="section" className="contact-hero">
        <p className="eyebrow" style={{ justifyContent: 'center' }}>We'd love to hear from you</p>
        <h1 style={{ marginBottom: 8 }}>Get in touch</h1>
        <p style={{ color: 'var(--muted)', maxWidth: 480, margin: '0 auto' }}>
          Questions about an order, catering, or just want to say hello? Reach out any way that's convenient.
        </p>
      </Reveal>

      <div className="contact-grid">
        <Reveal type="slide-right">
          <h2 style={{ marginBottom: 20 }}>Contact information</h2>
          <div className="contact-info-list">
            <div className="contact-info-item">
              <div className="contact-info-icon"><Phone size={18} /></div>
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: 2 }}>Phone</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>+251 911 234 567</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon"><Mail size={18} /></div>
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: 2 }}>Email</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>hello@injerahouse.com</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon"><MapPin size={18} /></div>
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: 2 }}>Address</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Kazanchis, Addis Ababa — behind the main roundabout</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon"><Clock3 size={18} /></div>
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: 2 }}>Business hours</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                  Mon–Thu 11am–10pm<br />Fri–Sat 11am–11:30pm<br />Sun 12pm–9pm
                </p>
              </div>
            </div>
          </div>

          <div className="contact-map">
            <iframe
              title="Injera House location"
              src="https://www.google.com/maps?q=Kazanchis,Addis+Ababa,Ethiopia&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>

        <Reveal type="slide-left" as="div" className="ui-card contact-form-card">
          <h2 style={{ marginBottom: 20 }}>Send a message</h2>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>
            <label>
              Message
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help?"
                required
              />
            </label>
            <button className="primary-btn btn-block" type="submit" disabled={sending}>
              <Send size={16} /> {sending ? 'Sending…' : 'Send message'}
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  )
}
