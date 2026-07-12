import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X, UtensilsCrossed } from 'lucide-react'
import { useCart } from '../context/CartContext'

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu' },
  { to: '/track', label: 'Track Order' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const panelRef = useRef(null)
  const location = useLocation()
  const { items } = useCart()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  // Scroll background effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setMenuOpen(false)
    }
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <NavLink to="/" className="navbar-brand" aria-label="Injera House home">
        <UtensilsCrossed size={20} />
        Injera House
      </NavLink>

      <nav className="navbar-links" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')}
          >
            {item.label}
          </NavLink>
        ))}
        <NavLink to="/checkout" className="navbar-cart" aria-label={`Cart, ${cartCount} items`}>
          <ShoppingBag size={16} />
          Cart{cartCount > 0 ? ` (${cartCount})` : ''}
        </NavLink>
      </nav>

      <button
        className="navbar-toggle"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
        aria-expanded={menuOpen}
      >
        <Menu size={20} />
      </button>

      {menuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-panel" ref={panelRef} role="dialog" aria-modal="true" aria-label="Navigation menu">
            <button className="mobile-menu-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X size={22} />
            </button>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => 'mobile-menu-link' + (isActive ? ' active' : '')}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/checkout" className="mobile-menu-link" style={{ marginTop: 8, background: 'var(--gold)', color: 'var(--clay-dark)', fontWeight: 700 }}>
              <ShoppingBag size={18} /> Cart{cartCount > 0 ? ` (${cartCount})` : ''}
            </NavLink>
          </div>
        </div>
      )}
    </header>
  )
}
