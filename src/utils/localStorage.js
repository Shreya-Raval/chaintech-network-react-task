/**
 * localStorage helper functions for ShopVault
 * Keys: shopvault_users, shopvault_session, shopvault_cart_{userId}
 */

const USERS_KEY = 'shopvault_users'
const SESSION_KEY = 'shopvault_session'
const CART_PREFIX = 'shopvault_cart_'

const SESSION_TTL = 5 * 60 * 1000 // 5 minutes

// ─── User Helpers ─────────────────────────────────────────

/** Save a new user to the registered users array */
export const saveUser = (userData) => {
  const users = getUsers()
  users.push({ ...userData, createdAt: userData.createdAt || Date.now() })
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

/** Get all registered users */
export const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

/** Update an existing user by email (match case-insensitive) */
export const updateUser = (email, updates) => {
  const users = getUsers()
  const idx = users.findIndex(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  )
  if (idx === -1) return false
  users[idx] = { ...users[idx], ...updates }
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return true
}

/** Get a single user by email */
export const getUserByEmail = (email) => {
  const users = getUsers()
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
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

/** Update user data in the session WITHOUT resetting the TTL */
export const updateSessionUser = (updatedUser) => {
  const session = getSession()
  if (!session) return false
  session.user = { ...session.user, ...updatedUser }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return true
}

// ─── Cart Helpers (per-user) ──────────────────────────────

/** Get the cart key for a specific user */
const getCartKey = (userEmail) => {
  return `${CART_PREFIX}${(userEmail || 'guest').toLowerCase()}`
}

/** Save cart data for a user */
export const saveCart = (cart, userEmail) => {
  localStorage.setItem(getCartKey(userEmail), JSON.stringify(cart))
}

/** Get cart data for a user */
export const getCart = (userEmail) => {
  const cart = localStorage.getItem(getCartKey(userEmail))
  return cart ? JSON.parse(cart) : []
}

/** Remove cart data for a user */
export const removeCart = (userEmail) => {
  localStorage.removeItem(getCartKey(userEmail))
}
