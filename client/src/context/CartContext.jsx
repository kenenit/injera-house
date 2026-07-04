import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addToCart = (item) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.id === item.id)
      if (existing) {
        return current.map((entry) =>
          entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
        )
      }
      return [...current, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (id, quantity) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((entry) => entry.id !== id)
        : current.map((entry) => (entry.id === id ? { ...entry, quantity } : entry)),
    )
  }

  const clearCart = () => setItems([])

  const value = useMemo(
    () => ({ items, addToCart, updateQuantity, clearCart }),
    [items],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
