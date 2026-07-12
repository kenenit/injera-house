import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'
import './theme.css'

// Route-level code splitting — each page loads on demand
const HomePage     = lazy(() => import('./pages/HomePage'))
const MenuPage     = lazy(() => import('./pages/MenuPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const TrackPage    = lazy(() => import('./pages/TrackPage'))
const AboutPage    = lazy(() => import('./pages/AboutPage'))
const ContactPage  = lazy(() => import('./pages/ContactPage'))
const AdminPage    = lazy(() => import('./pages/AdminPage'))

function RouteFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: 'var(--muted)' }}>
      <Loader2 size={28} className="spin-icon" aria-hidden="true" />
      <span className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>Loading page…</span>
    </div>
  )
}

function AppShell() {
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar />

      <main className="page" id="main-content">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/"         element={<HomePage />} />
            <Route path="/menu"     element={<MenuPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/track"    element={<TrackPage />} />
            <Route path="/about"    element={<AboutPage />} />
            <Route path="/contact"  element={<ContactPage />} />
            {/* Admin is intentionally not linked from public navigation —
                only reachable by typing the URL directly, gated by login */}
            <Route path="/admin"    element={<AdminPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
