import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UtensilsCrossed, Clock3, MapPin, Star, Phone, Search, ArrowRight } from 'lucide-react'
import Reveal from '../components/Reveal'
import api from '../api/index.js'

const GALLERY = [
  { src: '/images/meat-combo.jpg',       alt: 'Meat Combination' },
  { src: '/images/coffee-ceremony.jpg',  alt: 'Coffee Ceremony' },
  { src: '/images/beyaynetu.jpg',        alt: 'Beyaynetu' },
  { src: '/images/kitfo.jpg',            alt: 'Kitfo' },
  { src: '/images/doro-wat.jpg',         alt: 'Doro Wot' },
]

function HomeTrackWidget() {
  const [code, setCode] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!code.trim()) return
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

  return (
    <section className="track-widget">
      <Reveal type="fade-up" className="track-widget-inner">
        <p className="eyebrow" style={{ justifyContent: 'center' }}>Already ordered?</p>
        <h2>Track your order in seconds</h2>
        <p className="track-widget-sub">Enter the tracking code you received after checkout to see live status.</p>

        <form className="track-widget-form" onSubmit={handleSubmit}>
          <label htmlFor="home-track-code" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>Tracking code</label>
          <input
            id="home-track-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. IH-20260001"
            aria-label="Tracking code"
          />
          <button className="primary-btn" type="submit" disabled={loading} style={{ background: 'var(--gold)', color: 'var(--clay-dark)' }}>
            <Search size={16} /> {loading ? 'Searching…' : 'Track'}
          </button>
        </form>

        {error && <p style={{ color: '#F87171', marginTop: 16, fontSize: 14 }}>{error}</p>}

        {order && (
          <div className="track-widget-result">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <strong>#{order.tracking_code}</strong>
              <span className="badge" style={{ background: 'var(--gold)', color: 'var(--clay-dark)' }}>{order.status}</span>
            </div>
            <p style={{ color: 'var(--parchment)', fontSize: 14 }}>
              {order.customer_name} · {order.order_type === 'delivery' ? 'Delivery' : 'Pickup'} · Total ETB {Number(order.total).toLocaleString()}
            </p>
            <Link to="/track" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, color: 'var(--gold)', fontWeight: 600, fontSize: 14 }}>
              See full status timeline <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </Reveal>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="home-page">

      {/* Hero */}
      <section className="hero-card">
        <Reveal type="fade-up" style={{ position: 'relative', zIndex: 1 }}>
          <p className="eyebrow">Est. 2008 · Addis Ababa</p>
          <h1>Where every meal<br />begins with<br /><em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>injera</em></h1>
          <p className="hero-copy">
            Slow-cooked stews, freshly ground spices, and teff injera made
            each morning. Gathered around a single platter — the way it was
            always meant to be.
          </p>
          <div className="hero-actions">
            <Link to="/menu" className="primary-btn" style={{ background: 'var(--gold)', color: 'var(--clay-dark)' }}>
              <UtensilsCrossed size={18} /> Order now
            </Link>
            <Link to="/track" className="secondary-btn" style={{ background: 'transparent', color: 'var(--parchment)', borderColor: 'rgba(200,146,42,0.4)' }}>
              Track my order
            </Link>
          </div>
        </Reveal>

        <Reveal type="scale" as="div" className="hero-visual" style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', minHeight: 320 }}>
          <img
            src="/images/family-meat-combo.jpg"
            alt="Ethiopian food platter"
            loading="eager"
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />
          <div className="hero-card-mini" style={{ backdropFilter: 'blur(8px)' }}>
            <h3>Fresh today</h3>
            <p>Doro Wot · Beyaynetu · Kitfo · Coffee Ceremony</p>
          </div>
        </Reveal>
      </section>

      <div className="pattern-strip" />

      {/* Info cards */}
      <div className="highlights-grid reveal-stagger">
        <Reveal type="fade-up" as="div" className="info-card">
          <Clock3 size={28} />
          <h3>Open daily</h3>
          <p>Monday to Thursday 11am–10pm · Friday & Saturday 11am–11:30pm · Sunday 12pm–9pm</p>
        </Reveal>
        <Reveal type="fade-up" as="div" className="info-card">
          <Star size={28} />
          <h3>16 years of service</h3>
          <p>Born in a small compound kitchen in Kazanchis. Still sourcing teff from Gojjam and spices from the same market stall.</p>
        </Reveal>
        <Reveal type="fade-up" as="div" className="info-card">
          <MapPin size={28} />
          <h3>Find us</h3>
          <p>Kazanchis, Addis Ababa · Behind the main roundabout · Free parking available · +251 911 234 567</p>
        </Reveal>
      </div>

      {/* Track order — highly visible on the homepage */}
      <HomeTrackWidget />

      {/* About Us preview */}
      <section className="about-preview">
        <Reveal type="slide-right">
          <p className="eyebrow">Our story</p>
          <h2 style={{ marginBottom: 16 }}>More than a restaurant — it's family</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.9, marginBottom: 8 }}>
            Injera House began in 2008 as Sunday meals shared with neighbors in a small
            compound kitchen. Today we serve hundreds of guests daily, but the mission
            hasn't changed: authentic recipes, fresh ingredients, and the kind of
            hospitality that makes every guest feel like family.
          </p>
          <div className="about-preview-stats">
            <div className="about-preview-stat"><strong>16+</strong><span>Years serving Addis</span></div>
            <div className="about-preview-stat"><strong>50+</strong><span>Dishes on the menu</span></div>
            <div className="about-preview-stat"><strong>1000s</strong><span>Happy guests</span></div>
          </div>
          <Link to="/about" className="secondary-btn">
            Read our full story <ArrowRight size={16} />
          </Link>
        </Reveal>
        <Reveal type="slide-left" as="div" className="about-preview-media img-zoom">
          <img src="/images/coffee-ceremony.jpg" alt="Traditional Ethiopian coffee ceremony" loading="lazy" />
        </Reveal>
      </section>

      <div className="eth-divider">
        <div className="eth-divider-line" />
        <span className="eth-divider-symbol">✦ ✦ ✦</span>
        <div className="eth-divider-line" />
      </div>

      {/* Gallery section */}
      <section className="gallery-section">
        <Reveal type="fade-up" className="gallery-header">
          <p className="eyebrow">A taste of what awaits</p>
          <h2>From our kitchen</h2>
          <p className="gallery-sub">Every dish made fresh — from slow-cooked stews to hand-ground spices and teff injera baked each morning.</p>
        </Reveal>
        <div className="gallery-grid reveal-stagger">
          {GALLERY.map((item, i) => (
            <Reveal type="scale" key={i} as="div" className={`gallery-item img-zoom ${i === 0 ? 'gallery-large' : ''}`}>
              <img src={item.src} alt={item.alt} loading="lazy" />
              <div className="gallery-overlay">
                <span>{item.alt}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/menu" className="primary-btn">
            <UtensilsCrossed size={16} /> See full menu
          </Link>
        </div>
      </section>

      <div className="eth-divider">
        <div className="eth-divider-line" />
        <span className="eth-divider-symbol">✦ ✦ ✦</span>
        <div className="eth-divider-line" />
      </div>

      {/* Coffee ceremony section */}
      <section className="coffee-section">
        <Reveal type="slide-right" as="div" style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src="/images/hero-coffee.jpg"
            alt="Ethiopian coffee ceremony"
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Reveal>
        <Reveal type="slide-left" as="div" style={{ background: 'var(--clay-dark)', padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='%23C8922A' stroke-width='0.6' opacity='0.15'/%3E%3C/svg%3E\")",
            backgroundSize: '60px 60px', pointerEvents: 'none',
          }} />
          <p className="eyebrow" style={{ position: 'relative', zIndex: 1 }}>Ethiopian tradition</p>
          <h2 style={{ color: 'var(--cream)', marginBottom: 16, position: 'relative', zIndex: 1 }}>The coffee ceremony</h2>
          <p style={{ color: 'var(--parchment)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: 24, position: 'relative', zIndex: 1 }}>
            No Ethiopian meal is complete without the coffee ceremony. Green beans roasted fresh, ground by hand, brewed in a jebena — served with popcorn and incense. A ritual of hospitality passed down through generations.
          </p>
          <Link to="/menu" className="primary-btn" style={{ background: 'var(--gold)', color: 'var(--clay-dark)', width: 'fit-content', position: 'relative', zIndex: 1 }}>
            View our menu
          </Link>
        </Reveal>
      </section>

      {/* Mini banner */}
      <div className="mini-banner">
        <Phone size={20} />
        <span>Catering available for events · Groups of 10 or more, please call ahead · Delivery within Addis Ababa · <strong>+251 911 234 567</strong></span>
      </div>

    </div>
  )
}
