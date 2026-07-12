import { Link } from 'react-router-dom'
import { UtensilsCrossed, Phone, Mail, MapPin, Clock3, Facebook, Instagram, Twitter, Send } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { useState } from 'react'

export default function Footer() {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')

  const handleNewsletter = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    showToast('Thanks for subscribing! Watch your inbox for offers.', 'success')
    setEmail('')
  }

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {/* Brand */}
        <div>
          <div className="footer-brand">
            <UtensilsCrossed size={20} />
            Injera House
          </div>
          <p className="footer-tagline">
            Fresh injera, slow-cooked stews, and warm Ethiopian hospitality — serving Addis Ababa since 2008.
          </p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={16} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={16} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><Twitter size={16} /></a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <p className="footer-heading">Quick links</p>
          <nav className="footer-links" aria-label="Footer">
            <Link to="/menu">Menu</Link>
            <Link to="/about">About</Link>
            <Link to="/track">Track Order</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>

        {/* Legal */}
        <div>
          <p className="footer-heading">Legal</p>
          <nav className="footer-links" aria-label="Legal">
            <Link to="/contact">Privacy Policy</Link>
            <Link to="/contact">Terms of Service</Link>
          </nav>
        </div>

        {/* Contact */}
        <div>
          <p className="footer-heading">Visit us</p>
          <div className="footer-contact">
            <div className="footer-contact-row"><Phone size={15} /><span>+251 911 234 567</span></div>
            <div className="footer-contact-row"><Mail size={15} /><span>hello@injerahouse.com</span></div>
            <div className="footer-contact-row"><MapPin size={15} /><span>Kazanchis, Addis Ababa · Behind the main roundabout</span></div>
            <div className="footer-contact-row"><Clock3 size={15} /><span>Mon–Thu 11am–10pm · Fri–Sat 11am–11:30pm · Sun 12pm–9pm</span></div>
          </div>
          <form className="footer-newsletter" onSubmit={handleNewsletter}>
            <label htmlFor="newsletter-email" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>Email address</label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" aria-label="Subscribe to newsletter"><Send size={14} /></button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Injera House. All rights reserved.</span>
        <div className="footer-bottom-links">
          <Link to="/contact">Privacy Policy</Link>
          <Link to="/contact">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
