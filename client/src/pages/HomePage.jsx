import { Link } from 'react-router-dom'
import { UtensilsCrossed, Clock3, MapPin, Star, Phone } from 'lucide-react'

const GALLERY = [
  { src: '/images/meat-combo.jpg',       alt: 'Meat Combination' },
  { src: '/images/coffee-ceremony.jpg',  alt: 'Coffee Ceremony' },
  { src: '/images/beyaynetu.jpg',        alt: 'Beyaynetu' },
  { src: '/images/kitfo.jpg',            alt: 'Kitfo' },
  { src: '/images/doro-wat.jpg',         alt: 'Doro Wot' }
]

export default function HomePage() {
  return (
    <div className="home-page">

      {/* Hero */}
      <section className="hero-card">
        <div style={{ position: 'relative', zIndex: 1 }}>
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
        </div>

        {/* Hero image */}
        <div className="hero-visual" style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', minHeight: 320 }}>
          <img
            src="/images/family-meat-combo.jpg"
            alt="Ethiopian food platter"
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />
          <div className="hero-card-mini" style={{ backdropFilter: 'blur(8px)' }}>
            <h3>Fresh today</h3>
            <p>Doro Wot · Beyaynetu · Kitfo · Coffee Ceremony</p>
          </div>
        </div>
      </section>

      {/* Pattern strip */}
      <div className="pattern-strip" />

      {/* Info cards */}
      <div className="highlights-grid">
        <div className="info-card">
          <Clock3 size={28} />
          <h3>Open daily</h3>
          <p>Monday to Thursday 11am–10pm · Friday & Saturday 11am–11:30pm · Sunday 12pm–9pm</p>
        </div>
        <div className="info-card">
          <Star size={28} />
          <h3>16 years of service</h3>
          <p>Born in a small compound kitchen in Kazanchis. Still sourcing teff from Gojjam and spices from the same market stall.</p>
        </div>
        <div className="info-card">
          <MapPin size={28} />
          <h3>Find us</h3>
          <p>Kazanchis, Addis Ababa · Behind the main roundabout · Free parking available · +251 911 234 567</p>
        </div>
      </div>

      {/* Divider */}
      <div className="eth-divider">
        <div className="eth-divider-line" />
        <span className="eth-divider-symbol">✦ ✦ ✦</span>
        <div className="eth-divider-line" />
      </div>

      {/* Gallery section */}
      <section className="gallery-section">
        <div className="gallery-header">
          <p className="eyebrow">A taste of what awaits</p>
          <h2>From our kitchen</h2>
          <p className="gallery-sub">Every dish made fresh — from slow-cooked stews to hand-ground spices and teff injera baked each morning.</p>
        </div>
        <div className="gallery-grid">
          {GALLERY.map((item, i) => (
            <div key={i} className={`gallery-item ${i === 0 ? 'gallery-large' : ''}`}>
              <img src={item.src} alt={item.alt} />
              <div className="gallery-overlay">
                <span>{item.alt}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/menu" className="primary-btn">
            <UtensilsCrossed size={16} /> See full menu
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="eth-divider">
        <div className="eth-divider-line" />
        <span className="eth-divider-symbol">✦ ✦ ✦</span>
        <div className="eth-divider-line" />
      </div>

      {/* Coffee ceremony section */}
      <section className="coffee-section">
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src="/images/hero-coffee.jpg"
            alt="Ethiopian coffee ceremony"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ background: 'var(--clay-dark)', padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='%23C8922A' stroke-width='0.6' opacity='0.15'/%3E%3C/svg%3E\")",
            backgroundSize: '60px 60px', pointerEvents: 'none'
          }} />
          <p className="eyebrow" style={{ position: 'relative', zIndex: 1 }}>Ethiopian tradition</p>
          <h2 style={{ color: 'var(--cream)', marginBottom: 16, position: 'relative', zIndex: 1 }}>The coffee ceremony</h2>
          <p style={{ color: 'var(--parchment)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: 24, position: 'relative', zIndex: 1 }}>
            No Ethiopian meal is complete without the coffee ceremony. Green beans roasted fresh, ground by hand, brewed in a jebena — served with popcorn and incense. A ritual of hospitality passed down through generations.
          </p>
          <Link to="/menu" className="primary-btn" style={{ background: 'var(--gold)', color: 'var(--clay-dark)', width: 'fit-content', position: 'relative', zIndex: 1 }}>
            View our menu
          </Link>
        </div>
      </section>

      {/* Mini banner */}
      <div className="mini-banner">
        <Phone size={20} />
        <span>Catering available for events · Groups of 10 or more, please call ahead · Delivery within Addis Ababa · <strong>+251 911 234 567</strong></span>
      </div>

    </div>
  )
}