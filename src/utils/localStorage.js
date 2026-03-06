/**
 * localStorage helper functions for ShopVault
 * Keys: shopvault_users, shopvault_session, shopvault_cart
 */

const USERS_KEY = 'shopvault_users'
const SESSION_KEY = 'shopvault_session'
const CART_KEY = 'shopvault_cart'

const SESSION_TTL = 5 * 60 * 1000 // 5 minutes

// ─── User Helpers ─────────────────────────────────────────

/** Save a new user to the registered users array */
export const saveUser = (userData) => {
  const users = getUsers()
  users.push(userData)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

/** Get all registered users */
export const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

// ─── Session Helpers ──────────────────────────────────────

/** Create and save a session for the given user (5-min TTL) */
export const saveSession = (user) => {
  const session = {
    user,
    expiresAt: Date.now() + SESSION_TTL,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

/** Get the current session object, or null */
export const getSession = () => {
  const session = localStorage.getItem(SESSION_KEY)
  return session ? JSON.parse(session) : null
}

/** Remove the current session */
export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY)
}

/** Check if a valid (non-expired) session exists */
export const isSessionValid = () => {
  const session = getSession()
  if (!session) return false
  if (Date.now() > session.expiresAt) {
    clearSession()
    return false
  }
  return true
}

/** Get remaining session time in milliseconds */
export const getSessionTimeRemaining = () => {
  const session = getSession()
  if (!session) return 0
  const remaining = session.expiresAt - Date.now()
  return remaining > 0 ? remaining : 0
}

// ─── Cart Helpers ─────────────────────────────────────────

/** Save cart data */
export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

/** Get cart data */
export const getCart = () => {
  const cart = localStorage.getItem(CART_KEY)
  return cart ? JSON.parse(cart) : []
}

/** Remove cart data */
export const removeCart = () => {
  localStorage.removeItem(CART_KEY)
}
