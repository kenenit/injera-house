import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { ShoppingBag, Clock3, Sparkles, UtensilsCrossed } from 'lucide-react'
import { CartProvider, useCart } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import CheckoutPage from './pages/CheckoutPage'
import TrackPage from './pages/TrackPage'
import AdminPage from './pages/AdminPage'
import ReservationPage from './pages/ReservationPage'
import AboutPage from './pages/AboutPage'
import './App.css'

function CartButton() {
  const { items } = useCart()
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  return (
    <NavLink to="/checkout" className="nav-pill">
      <ShoppingBag size={16} />
      <span>Cart ({count})</span>
    </NavLink>
  )
}

function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <UtensilsCrossed size={20} />
           Injera House
        </NavLink>
        <nav className="main-nav">
          <NavLink to="/"         end className={({ isActive }) => 'nav-pill' + (isActive ? ' active' : '')}>Home</NavLink>
          <NavLink to="/menu"     className={({ isActive }) => 'nav-pill' + (isActive ? ' active' : '')}>Menu</NavLink>
          <NavLink to="/track"    className={({ isActive }) => 'nav-pill' + (isActive ? ' active' : '')}>Track</NavLink>
          <NavLink to="/admin"    className={({ isActive }) => 'nav-pill' + (isActive ? ' active' : '')}>Admin</NavLink>
          <NavLink to="/reserve" className={({ isActive }) => 'nav-pill' + (isActive ? ' active' : '')}>Reserve</NavLink>
          <NavLink to="/about" className={({ isActive }) => 'nav-pill' + (isActive ? ' active' : '')}>About</NavLink>
          <CartButton />
        </nav>
      </header>

      <main className="page">
        <Routes>
          <Route path="/"         element={<HomePage />} />
          <Route path="/menu"     element={<MenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/track"    element={<TrackPage />} />
          <Route path="/admin"    element={<AdminPage />} />
          <Route path="/reserve" element={<ReservationPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <div><Sparkles size={16} /><span>Fresh injera, slow-cooked stews, and warm hospitality.</span></div>
        <div><Clock3 size={16} /><span>Open daily · 11:00 AM – 10:00 PM</span></div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}