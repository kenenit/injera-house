import { useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard, ClipboardList, UtensilsCrossed, LogOut, Search,
  Plus, Pencil, Trash2, Eye, EyeOff, X, TrendingUp, DollarSign,
  ShoppingBag, Clock, CheckCircle2, XCircle, ChefHat,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { BarChart, LineChart } from '../components/charts/SimpleCharts'
import EmptyState from '../components/EmptyState'
import { TableRowSkeleton } from '../components/Skeleton'
import api from '../api/index.js'

const STATUS_COLORS = {
  pending:   '#854F0B',
  confirmed: '#1D4ED8',
  preparing: '#7C3AED',
  ready:     '#059669',
  delivered: '#374151',
  cancelled: '#DC2626',
}
const ALL_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']

function fmtMoney(n) { return `ETB ${Number(n || 0).toLocaleString()}` }

// ── Login form ────────────────────────────────────────────────────────────
function LoginForm() {
  const { login } = useAuth()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-card" style={{ maxWidth: 400, margin: '4rem auto' }}>
      <p className="eyebrow">Admin access</p>
      <h2>Sign in</h2>
      <p style={{ marginBottom: '1.5rem', color: 'var(--muted)' }}>
        Only authorized staff can access this page.
      </p>
      {error && (
        <p style={{ color: '#DC2626', marginBottom: '1rem', fontSize: 14 }} role="alert">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="checkout-form">
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="admin@injerahouse.com"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        <button className="primary-btn btn-block" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

// ── Analytics tab ───────────────────────────────────────────────────────
function AnalyticsTab() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="stat-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="stat-card"><div className="skeleton" style={{ height: 40 }} /></div>
        ))}
      </div>
    )
  }
  if (!stats) return <EmptyState icon={TrendingUp} title="No data yet" message="Analytics will appear once orders start coming in." />

  const cards = [
    { label: 'Orders today',        value: stats.orders_today,               icon: ShoppingBag },
    { label: 'Orders this week',    value: stats.orders_this_week,           icon: TrendingUp },
    { label: 'Total orders',        value: stats.total_orders,               icon: ClipboardList },
    { label: 'Revenue today',       value: fmtMoney(stats.revenue_today),    icon: DollarSign },
    { label: 'Revenue this month',  value: fmtMoney(stats.revenue_this_month), icon: DollarSign },
    { label: 'Pending orders',      value: stats.pending_orders,             icon: Clock },
    { label: 'In progress',         value: stats.preparing_orders,           icon: ChefHat },
    { label: 'Cancelled orders',    value: stats.cancelled_orders,           icon: XCircle },
  ]

  return (
    <>
      <div className="stat-grid reveal-stagger">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="stat-card">
            <Icon size={18} color="var(--gold)" style={{ marginBottom: 8 }} />
            <div className="stat-card-value">{value}</div>
            <div className="stat-card-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Orders per day (last 7 days)</h3>
          <BarChart
            data={stats.orders_per_day.map((d) => ({ label: new Date(d.day).toLocaleDateString('en-US', { weekday: 'short' }), value: d.count }))}
            valueKey="value" labelKey="label"
          />
        </div>
        <div className="chart-card">
          <h3>Popular categories</h3>
          <BarChart
            data={stats.popular_categories.slice(0, 5).map((c) => ({ label: c.name, value: c.qty }))}
            color="var(--clay-light)"
          />
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Sales per week (ETB)</h3>
          <LineChart
            data={stats.sales_per_week.map((w) => ({ label: new Date(w.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: w.total }))}
            formatValue={(v) => `ETB ${v.toLocaleString()}`}
          />
        </div>
        <div className="chart-card">
          <h3>Best &amp; least selling</h3>
          <p className="text-caption" style={{ marginBottom: 8, fontWeight: 700, color: 'var(--muted)' }}>TOP SELLERS</p>
          {stats.best_selling.length === 0 && <p className="text-caption">No sales yet.</p>}
          {stats.best_selling.map((item) => (
            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
              <span>{item.name}</span><strong>{item.qty} sold</strong>
            </div>
          ))}
          {stats.least_selling.length > 0 && (
            <>
              <p className="text-caption" style={{ margin: '12px 0 8px', fontWeight: 700, color: 'var(--muted)' }}>NEEDS ATTENTION</p>
              {stats.least_selling.map((item) => (
                <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0', color: 'var(--muted)' }}>
                  <span>{item.name}</span><span>{item.qty} sold</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  )
}

// ── Orders tab ──────────────────────────────────────────────────────────
function OrdersTab() {
  const { showToast } = useToast()
  const [orders, setOrders]     = useState([])
  const [filter, setFilter]     = useState('all')
  const [search, setSearch]     = useState('')
  const [sort, setSort]         = useState('newest')
  const [loading, setLoading]   = useState(true)
  const [updating, setUpdating] = useState(null)

  const fetchOrders = () => {
    setLoading(true)
    const params = { sort }
    if (filter !== 'all') params.status = filter
    if (search.trim()) params.search = search.trim()
    api.get('/admin/orders', { params })
      .then((res) => setOrders(res.data))
      .catch((err) => {
        const notFound = err.response?.status === 404
        showToast(notFound ? 'Orders API not found — check the backend deployment.' : 'Failed to load orders', 'error')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const t = setTimeout(fetchOrders, 300) // debounce search
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, search, sort])

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId)
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status })
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
      showToast('Order status updated', 'success')
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update status', 'error')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <>
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or tracking code..."
            aria-label="Search orders"
          />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-med)' }}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="total_desc">Total: high to low</option>
          <option value="total_asc">Total: low to high</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', ...ALL_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="chip"
            style={{
              background: filter === s ? 'var(--clay-dark)' : 'transparent',
              color: filter === s ? '#fff' : 'inherit',
              borderColor: filter === s ? 'var(--clay-dark)' : undefined,
              textTransform: 'capitalize',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-list">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="admin-item"><div className="skeleton" style={{ height: 60 }} /></div>)}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No orders found" message="Try adjusting your filters or search terms." />
      ) : (
        <div className="admin-list">
          {orders.map((order) => (
            <div key={order.id} className="admin-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0 }}>#{order.tracking_code}</h3>
                    <span className="badge" style={{ background: STATUS_COLORS[order.status] + '22', color: STATUS_COLORS[order.status] }}>
                      {order.status}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 2px', fontSize: 14 }}>{order.customer_name} · {order.customer_phone}</p>
                  <p style={{ margin: '0 0 2px', fontSize: 13, color: 'var(--muted)' }}>
                    {order.order_type === 'delivery' ? `Delivery to ${order.delivery_address}` : 'Pickup'}
                  </p>
                  <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--muted)' }}>{new Date(order.created_at).toLocaleString()}</p>
                  <div style={{ fontSize: 13 }}>
                    {order.items?.map((item) => (
                      <span key={item.id} style={{ marginRight: 12, color: 'var(--muted)' }}>{item.item_name} × {item.quantity}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 170 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gold)', marginBottom: 8 }}>{fmtMoney(order.total)}</div>
                  <label style={{ display: 'block' }}>
                    <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>Update status for order {order.tracking_code}</span>
                    <select
                      value={order.status}
                      disabled={updating === order.id}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      style={{ fontSize: 12, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 4, background: 'var(--surface)', cursor: 'pointer', width: '100%' }}
                    >
                      {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

// ── Menu management tab ────────────────────────────────────────────────
const EMPTY_ITEM = { name: '', description: '', price: '', image_url: '', category_id: '', is_vegetarian: false, is_spicy: false, is_available: true, is_featured: false }

function MenuItemModal({ item, categories, onClose, onSaved }) {
  const { showToast } = useToast()
  const [form, setForm] = useState(item ? { ...item, image_url: item.image_url ?? item.image ?? '', category_id: item.category_id || '' } : EMPTY_ITEM)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, price: Number(form.price), category_id: form.category_id || null }
      if (item?.id) {
        await api.put(`/admin/menu/${item.id}`, payload)
        showToast('Menu item updated', 'success')
      } else {
        await api.post('/admin/menu', payload)
        showToast('Menu item created', 'success')
      }
      onSaved()
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save item', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="admin-modal" role="dialog" aria-modal="true" aria-label={item ? 'Edit menu item' : 'Add menu item'}>
        <div className="admin-modal-header">
          <h2 style={{ margin: 0 }}>{item ? 'Edit menu item' : 'Add menu item'}</h2>
          <button className="ghost-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="admin-form-grid">
            <label className="full-span">
              Name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              Price (ETB)
              <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </label>
            <label>
              Category
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} style={{ padding: '10px 14px', border: '1px solid var(--border-med)', borderRadius: 'var(--radius-sm)' }}>
                <option value="">Uncategorized</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label className="full-span">
              Description
              <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </label>
            <label className="full-span">
              Image URL
              <input value={form.image_url || ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="/images/dish.jpg" />
            </label>
            <div className="full-span admin-checkbox-row">
              <label className="admin-checkbox">
                <input type="checkbox" checked={!!form.is_vegetarian} onChange={(e) => setForm({ ...form, is_vegetarian: e.target.checked })} /> Vegetarian
              </label>
              <label className="admin-checkbox">
                <input type="checkbox" checked={!!form.is_spicy} onChange={(e) => setForm({ ...form, is_spicy: e.target.checked })} /> Spicy
              </label>
              <label className="admin-checkbox">
                <input type="checkbox" checked={!!form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured
              </label>
              <label className="admin-checkbox">
                <input type="checkbox" checked={!!form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} /> Available
              </label>
            </div>
          </div>
          <button className="primary-btn btn-block" type="submit" disabled={saving}>
            {saving ? 'Saving...' : item ? 'Save changes' : 'Create item'}
          </button>
        </form>
      </div>
    </div>
  )
}

function MenuTab() {
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)     // item being edited, or {} for new
  const [confirmDelete, setConfirmDelete] = useState(null)

  const fetchAll = () => {
    setLoading(true)
    Promise.all([api.get('/admin/menu'), api.get('/admin/categories')])
      .then(([menuRes, catRes]) => { setItems(menuRes.data); setCategories(catRes.data) })
      .catch((err) => {
        const notFound = err.response?.status === 404
        showToast(
          notFound
            ? 'Menu management API not found on this server — make sure the backend has been redeployed with the latest routes.'
            : 'Failed to load menu',
          'error',
          6000,
        )
      })
      .finally(() => setLoading(false))
  }

  useEffect(fetchAll, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    if (!search.trim()) return items
    const q = search.toLowerCase()
    return items.filter((i) => i.name.toLowerCase().includes(q) || (i.category || '').toLowerCase().includes(q))
  }, [items, search])

  const toggleAvailability = async (item) => {
    try {
      await api.patch(`/admin/menu/${item.id}/availability`, { is_available: !item.is_available })
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_available: !i.is_available } : i)))
      showToast(item.is_available ? 'Item hidden from menu' : 'Item is now visible', 'success')
    } catch {
      showToast('Failed to update availability', 'error')
    }
  }

  const handleDelete = async (item) => {
    try {
      await api.delete(`/admin/menu/${item.id}`)
      setItems((prev) => prev.filter((i) => i.id !== item.id))
      showToast('Menu item deleted', 'success')
    } catch {
      showToast('Failed to delete item', 'error')
    } finally {
      setConfirmDelete(null)
    }
  }

  return (
    <>
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search menu items..." aria-label="Search menu" />
        </div>
        <button className="primary-btn" onClick={() => setEditing({})}>
          <Plus size={16} /> Add menu item
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Item</th><th>Category</th><th>Price</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={5} />)}
            {!loading && filtered.map((item) => (
              <tr key={item.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={item.image || '/images/placeholder.jpg'} alt="" className="menu-thumb" />
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                  </div>
                </td>
                <td>{item.category || '—'}</td>
                <td>{fmtMoney(item.price)}</td>
                <td>
                  <span className="badge" style={{ background: item.is_available ? '#05966922' : '#DC262622', color: item.is_available ? '#059669' : '#DC2626' }}>
                    {item.is_available ? 'Visible' : 'Hidden'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button className="ghost-btn btn-sm" onClick={() => toggleAvailability(item)} aria-label={item.is_available ? `Hide ${item.name}` : `Show ${item.name}`}>
                      {item.is_available ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button className="ghost-btn btn-sm" onClick={() => setEditing(item)} aria-label={`Edit ${item.name}`}>
                      <Pencil size={14} />
                    </button>
                    <button className="ghost-btn btn-sm" onClick={() => setConfirmDelete(item)} aria-label={`Delete ${item.name}`} style={{ color: '#DC2626' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <EmptyState icon={UtensilsCrossed} title="No menu items" message="Add your first dish to get started." />
        )}
      </div>

      {editing !== null && (
        <MenuItemModal
          item={editing.id ? editing : null}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); fetchAll() }}
        />
      )}

      {confirmDelete && (
        <div className="admin-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setConfirmDelete(null) }}>
          <div className="admin-modal" style={{ maxWidth: 400 }} role="alertdialog" aria-modal="true">
            <h2 style={{ marginBottom: 12 }}>Delete "{confirmDelete.name}"?</h2>
            <p style={{ color: 'var(--muted)', marginBottom: 20 }}>This can't be undone. The item will be permanently removed from your menu.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="ghost-btn" style={{ flex: 1 }} onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="primary-btn btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleDelete(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Dashboard shell ────────────────────────────────────────────────────
function Dashboard() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('analytics')

  const TABS = [
    { id: 'analytics', label: 'Analytics', icon: LayoutDashboard },
    { id: 'orders',    label: 'Orders',    icon: ClipboardList },
    { id: 'menu',      label: 'Menu',      icon: UtensilsCrossed },
  ]

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h2 style={{ margin: 0 }}>Welcome back, {user.name}</h2>
        </div>
        <button className="ghost-btn" onClick={logout}>
          <LogOut size={16} /> Sign out
        </button>
      </div>

      <div className="admin-tabs" role="tablist">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            className={`admin-tab ${tab === id ? 'active' : ''}`}
            onClick={() => setTab(id)}
          >
            <Icon size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
            {label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {tab === 'analytics' && <AnalyticsTab />}
        {tab === 'orders' && <OrdersTab />}
        {tab === 'menu' && <MenuTab />}
      </div>
    </div>
  )
}

// ── Main export — shows login or dashboard based on auth state ────────────
export default function AdminPage() {
  const { user } = useAuth()
  if (!user || user.role !== 'admin') return <LoginForm />
  return <Dashboard />
}
