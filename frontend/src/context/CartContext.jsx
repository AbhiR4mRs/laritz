import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const CART_STORAGE_KEY = 'la-ritz-cart'

function readStoredCart() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function toCartItem(product, quantity) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: Number(product.price),
    image: product.image,
    image_alt: product.image_alt,
    category: product.category || null,
    quantity,
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (!isCartOpen) {
      document.body.classList.remove('no-scroll')
      return
    }

    document.body.classList.add('no-scroll')

    return () => {
      document.body.classList.remove('no-scroll')
    }
  }, [isCartOpen])

  const addItem = (product, quantity = 1, options = {}) => {
    const normalizedQuantity = Math.max(1, Number(quantity) || 1)
    const shouldOpenDrawer = options.openDrawer !== false

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id)

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + normalizedQuantity }
            : item
        )
      }

      return [...currentItems, toCartItem(product, normalizedQuantity)]
    })

    if (shouldOpenDrawer) {
      setIsCartOpen(true)
    }
  }

  const updateQuantity = (productId, quantity) => {
    setItems((currentItems) => {
      const normalizedQuantity = Number(quantity)

      if (!Number.isFinite(normalizedQuantity) || normalizedQuantity <= 0) {
        return currentItems.filter((item) => item.id !== productId)
      }

      return currentItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: normalizedQuantity }
          : item
      )
    })
  }

  const incrementItem = (productId) => {
    const currentItem = items.find((item) => item.id === productId)
    if (!currentItem) {
      return
    }

    updateQuantity(productId, currentItem.quantity + 1)
  }

  const decrementItem = (productId) => {
    const currentItem = items.find((item) => item.id === productId)
    if (!currentItem) {
      return
    }

    updateQuantity(productId, currentItem.quantity - 1)
  }

  const removeItem = (productId) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId))
  }

  const clearCart = () => {
    setItems([])
  }

  const openCart = () => {
    setIsCartOpen(true)
  }

  const closeCart = () => {
    setIsCartOpen(false)
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        itemCount,
        subtotal,
        addItem,
        updateQuantity,
        incrementItem,
        decrementItem,
        removeItem,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}
