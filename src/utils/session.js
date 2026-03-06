/**
 * Session management utilities
 * Sessions have a 5-minute TTL (Time To Live)
 */

import { saveSession, getSession, removeSession, removeUser, removeCart } from './localStorage'

const SESSION_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds

/**
 * Create a new session for the given user
 * @param {object} user - The user object
 * @returns {object} The created session
 */
export const createSession = (user) => {
  const session = {
    userId: user.email,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL,
  }
  saveSession(session)
  return session
}

/**
 * Validate the current session
 * @returns {boolean} Whether the session is valid and not expired
 */
export const validateSession = () => {
  const session = getSession()
  if (!session) return false
  if (Date.now() > session.expiresAt) {
    destroySession()
    return false
  }
  return true
}

/**
 * Refresh the session TTL (extend expiry by another 5 minutes from now)
 * @returns {object|null} The refreshed session or null if no valid session
 */
export const refreshSession = () => {
  const session = getSession()
  if (!session) return null
  if (Date.now() > session.expiresAt) {
    destroySession()
    return null
  }
  session.expiresAt = Date.now() + SESSION_TTL
  saveSession(session)
  return session
}

/**
 * Destroy the current session and clear all user data
 */
export const destroySession = () => {
  removeSession()
  removeUser()
  removeCart()
}

/**
 * Get the remaining time on the session in milliseconds
 * @returns {number} Remaining time in ms, or 0 if expired/no session
 */
export const getSessionTimeRemaining = () => {
  const session = getSession()
  if (!session) return 0
  const remaining = session.expiresAt - Date.now()
  return remaining > 0 ? remaining : 0
}
