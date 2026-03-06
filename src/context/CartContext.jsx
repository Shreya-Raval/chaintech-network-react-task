import { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import { getCart, saveCart, removeCart } from '../utils/localStorage'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const userEmail = currentUser?.email || ''
  const [cartItems, setCartItems] = useState([])
  const [initialized, setInitialized] = useState(false)

  // Load cart from localStorage when user changes
  useEffect(() => {
    if (userEmail) {
      const storedCart = getCart(userEmail)
      setCartItems(storedCart)
    } else {
      setCartItems([])
    }
    setInitialized(true)
  }, [userEmail])

  // Persist cart to localStorage whenever it changes (after init)
  useEffect(() => {
    if (initialized && userEmail) {
      saveCart(cartItems, userEmail)
    }
  }, [cartItems, initialized, userEmail])

  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    toast.success('Added to cart!')
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
    toast.success('Removed from cart')
  }, [])

  const updateQuantity = useCallback((productId, delta) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.id === productId)
      if (!item) return prev
      const newQty = item.quantity + delta
      if (newQty <= 0) {
        return prev.filter((i) => i.id !== productId)
      }
      return prev.map((i) =>
        i.id === productId ? { ...i, quantity: newQty } : i
      )
    })
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
    if (userEmail) removeCart(userEmail)
    toast.success('Cart cleared')
  }, [userEmail])

  const isInCart = useCallback(
    (productId) => cartItems.some((item) => item.id === productId),
    [cartItems]
  )

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  )

  const cartCount = useMemo(
    () => cartItems.reduce((count, item) => count + item.quantity, 0),
    [cartItems]
  )

  const value = useMemo(
    () => ({
      cartItems,
      cartTotal,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
    }),
    [cartItems, cartTotal, cartCount, addToCart, removeFromCart, updateQuantity, clearCart, isInCart]
  )

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
