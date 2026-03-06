import { useContext } from 'react'
import { CartContext } from '../context/CartContext'

/**
 * Custom hook to access the Cart context
 * @returns {object} Cart context value (cartItems, cartTotal, cartCount, addToCart, removeFromCart, updateQuantity, clearCart)
 */
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
