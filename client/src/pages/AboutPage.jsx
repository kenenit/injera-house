import { Link } from 'react-router-dom'
import { UtensilsCrossed, Heart, Leaf, Award } from 'lucide-react'

const TEAM = [
  { name: 'Almaz Tadesse',  role: 'Head Chef & Founder',     bio: 'With over 20 years in the kitchen, Almaz learned to cook from her grandmother in Gondar. Every recipe carries that heritage.' },
  { name: 'Dawit Bekele',   role: 'Restaurant Manager',       bio: 'Dawit ensures every guest feels at home. His warmth and attention to detail define the Injera House experience.' },
  { name: 'Sara Haile',     role: 'Coffee Ceremony Specialist', bio: 'Sara has performed the traditional coffee ceremony for thousands of guests, keeping the ritual alive and authentic.' },
]

const VALUES = [
  { icon: Heart,           title: 'Hospitality first',    desc: 'In Ethiopian culture, a guest is a gift from God. We treat every customer like family — with warmth, generosity and care.' },
  { icon: Leaf,            title: 'Fresh every day',      desc: 'Our injera is made fresh each morning. Spices are ground daily. We never compromise on freshness.' },
  { icon: UtensilsCrossed, title: 'Authentic recipes',    desc: 'Every dish follows traditional recipes passed down through generations — no shortcuts, no substitutions.' },
  { icon: Award,           title: '16 years of trust',    desc: 'Since 2008, thousands of families have shared meals at our table. That trust drives everything we do.' },
]

export default function AboutPage() {
  return (
    <div>

      {/* Hero */}
      <section style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        minHeight: 420, background: 'var(--clay-dark)', position: 'relative', overflow: 'hidden',
      }}>
        {/* Pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='%23C8922A' stroke-width='0.6' opacity='0.15'/%3E%3C/svg%3E\")",
          backgroundSize: '60px 60px', pointerEvents: 'none',
        }} />
        <div style={{ padding: '64px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <p className="eyebrow">Our story</p>
          <h1 style={{ color: 'var(--cream)', marginBottom: 16 }}>More than a restaurant</h1>
          <p style={{ color: 'var(--parchment)', lineHeight: 1.9, fontSize: '1.05rem', marginBottom: 24 }}>
            Injera House began in 2008 as a small compound kitchen in Kazanchis, Addis Ababa. What started as Sunday meals for neighbors became something the city couldn't stop talking about.
          </p>
          <p style={{ color: 'var(--parchment)', lineHeight: 1.9, fontSize: '1.05rem' }}>
            Today we serve hundreds of guests daily — but the spirit is the same. Pull up a mesob, tear the injera, and share.
          </p>
        </div>
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: 300 }}>
          <img
            src="/images/family-meat-combo.jpg"
            alt="Injera House food"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />
        </div>
      </section>

      {/* Pattern strip */}
      <div className="pattern-strip" />

      {/* Values */}
      <section style={{ padding: '64px 48px', background: 'var(--cream)' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p className="eyebrow">What we stand for</p>
          <h2>Our values</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '28px 24px', borderTop: '3px solid var(--gold)' }}>
              <Icon size={28} color="var(--gold)" style={{ marginBottom: 14 }} />
              <h3 style={{ marginBottom: 10 }}>{title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="eth-divider">
        <div className="eth-divider-line" />
        <span className="eth-divider-symbol">✦ ✦ ✦</span>
        <div className="eth-divider-line" />
      </div>

      {/* Coffee ceremony image section */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 360 }}>
        <div style={{ background: 'var(--cream-2)', padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p className="eyebrow">The experience</p>
          <h2 style={{ marginBottom: 16 }}>Come as a guest, leave as family</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.9, marginBottom: 16 }}>
            Ethiopian dining is a communal experience. The injera is a shared plate — everyone eats from the same surface. It's an act of trust, of togetherness.
          </p>
          <p style={{ color: 'var(--muted)', lineHeight: 1.9, marginBottom: 28 }}>
            We source our teff directly from Gojjam, our berbere from a spice vendor we've worked with for 16 years, and our coffee from farms in Yirgacheffe.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/menu" className="primary-btn">View our menu</Link>
            <Link to="/reserve" className="secondary-btn">Book a table</Link>
          </div>
        </div>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src="/images/coffee-ceremony.jpg"
            alt="Coffee ceremony"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '64px 48px', background: 'var(--cream)' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p className="eyebrow">The people behind the food</p>
          <h2>Meet our team</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 900, margin: '0 auto' }}>
          {TEAM.map(({ name, role, bio }) => (
            <div key={name} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '32px 24px', textAlign: 'center' }}>
              {/* Avatar placeholder */}
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'var(--clay-dark)', margin: '0 auto 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, color: 'var(--gold)', fontFamily: 'var(--font-display)',
              }}>
                {name.charAt(0)}
              </div>
              <h3 style={{ marginBottom: 4 }}>{name}</h3>
              <p style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{role}</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>{bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <div className="mini-banner" style={{ justifyContent: 'center', gap: 24, padding: '28px 48px' }}>
        <span style={{ fontSize: '1rem' }}>Ready to experience Injera House?</span>
        <Link to="/menu" className="primary-btn" style={{ background: 'var(--gold)', color: 'var(--clay-dark)' }}>
          Order now
        </Link>
        <Link to="/reserve" className="primary-btn" style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)' }}>
          Reserve a table
        </Link>
      </div>

    </div>
  )
}