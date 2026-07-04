import { useEffect, useState, useMemo } from 'react'
import { Plus, Minus, Flame, Leaf, Loader2, Search, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import api from '../api/index.js'

export default function MenuPage() {
  const [items, setItems]           = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery]       = useState('')
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const { addToCart, items: cartItems, updateQuantity } = useCart()

  useEffect(() => {
    api.get('/menu/categories')
      .then((res) => setCategories(res.data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    setError('')
    const params = {}
    if (activeCategory !== 'All') {
      const cat = categories.find((c) => c.name === activeCategory)
      if (cat) params.category_id = cat.id
    }
    api.get('/menu', { params })
      .then((res) => setItems(res.data))
      .catch(() => setError('Could not load the menu. Please try again.'))
      .finally(() => setLoading(false))
  }, [activeCategory, categories])

  // Filter by search query client-side
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items
    const q = searchQuery.toLowerCase()
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    )
  }, [items, searchQuery])

  const cartQty = (itemId) => {
    const entry = cartItems.find((i) => i.id === itemId)
    return entry ? entry.quantity : 0
  }

  const allCategories = ['All', ...categories.map((c) => c.name)]

  return (
    <div className="menu-page">

      {/* Header + search + filters */}
      <section className="section-heading">
        <div>
          <p className="eyebrow">Freshly prepared</p>
          <h2>Choose your next comfort meal</h2>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 320 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes..."
            style={{
              width: '100%',
              padding: '10px 40px 10px 38px',
              border: '1px solid var(--border-med)',
              borderRadius: 999,
              background: '#fff',
              fontSize: '0.875rem',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </section>

      {/* Category chips — hidden when searching */}
      {!searchQuery && (
        <div style={{ padding: '12px 48px', borderBottom: '1px solid var(--border)', background: 'var(--cream)', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {allCategories.map((cat) => (
            <button
              key={cat}
              className={`chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Search result header */}
      {searchQuery && (
        <div style={{ padding: '12px 48px', background: 'var(--cream-2)', borderBottom: '1px solid var(--border)', fontSize: 14, color: 'var(--muted)' }}>
          {filteredItems.length === 0
            ? `No dishes found for "${searchQuery}"`
            : `${filteredItems.length} dish${filteredItems.length > 1 ? 'es' : ''} found for "${searchQuery}"`}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: 'var(--muted)' }}>
          <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <p style={{ textAlign: 'center', color: '#DC2626', padding: '2rem' }}>{error}</p>
      )}

      {/* Menu grid */}
      {!loading && !error && (
        <section className="menu-grid">
          {filteredItems.map((item) => {
            const qty = cartQty(item.id)
            return (
              <article key={item.id} className="menu-card">
                <div style={{ position: 'relative' }}>
                  <img src={item.image} alt={item.name} />
                  <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
                    {item.is_spicy && (
                      <span style={{ background: '#DC2626', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Flame size={11} /> Spicy
                      </span>
                    )}
                    {item.is_vegetarian && (
                      <span style={{ background: '#059669', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Leaf size={11} /> Vegan
                      </span>
                    )}
                  </div>
                </div>
                <div className="menu-card-body">
                  <div className="menu-card-top">
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                    </div>
                    <span className="price">ETB {Number(item.price).toLocaleString()}</span>
                  </div>
                  {qty === 0 ? (
                    <button className="primary-btn" onClick={() => addToCart(item)}>
                      <Plus size={16} /> Add to cart
                    </button>
                  ) : (
                    <div className="quantity-controls" style={{ justifyContent: 'space-between', width: '100%' }}>
                      <button onClick={() => updateQuantity(item.id, qty - 1)}>
                        <Minus size={14} />
                      </button>
                      <span style={{ fontWeight: 600 }}>{qty} in cart</span>
                      <button onClick={() => addToCart(item)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            )
          })}

          {filteredItems.length === 0 && !loading && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--muted)', marginBottom: 12 }}>No dishes found.</p>
              {searchQuery && (
                <button className="primary-btn" onClick={() => setSearchQuery('')}>
                  Clear search
                </button>
              )}
            </div>
          )}
        </section>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}