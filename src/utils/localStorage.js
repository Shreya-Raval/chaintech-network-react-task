/**
 * localStorage helper functions for user session management
 */

const USER_KEY = 'ecommerce_user'
const SESSION_KEY = 'ecommerce_session'
const CART_KEY = 'ecommerce_cart'

/** Save user data to localStorage */
export const saveUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/** Get user data from localStorage */
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

/** Remove user data from localStorage */
export const removeUser = () => {
  localStorage.removeItem(USER_KEY)
}

/** Save session data to localStorage */
export const saveSession = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

/** Get session data from localStorage */
export const getSession = () => {
  const session = localStorage.getItem(SESSION_KEY)
  return session ? JSON.parse(session) : null
}

/** Remove session data from localStorage */
export const removeSession = () => {
  localStorage.removeItem(SESSION_KEY)
}

/** Save cart data to localStorage */
export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

/** Get cart data from localStorage */
export const getCart = () => {
  const cart = localStorage.getItem(CART_KEY)
  return cart ? JSON.parse(cart) : []
}

/** Remove cart data from localStorage */
export const removeCart = () => {
  localStorage.removeItem(CART_KEY)
}

/** Clear all session-related data (user + session + cart) */
export const clearSession = () => {
  removeUser()
  removeSession()
  removeCart()
}

/** Get all registered users from localStorage */
export const getRegisteredUsers = () => {
  const users = localStorage.getItem('ecommerce_registered_users')
  return users ? JSON.parse(users) : []
}

/** Save a new registered user to localStorage */
export const saveRegisteredUser = (user) => {
  const users = getRegisteredUsers()
  users.push(user)
  localStorage.setItem('ecommerce_registered_users', JSON.stringify(users))
}
