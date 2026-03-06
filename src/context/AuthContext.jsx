import { createContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  getUsers,
  saveUser,
  saveSession,
  getSession,
  clearSession,
  isSessionValid,
  updateUser,
  getUserByEmail,
  updateSessionUser,
} from '../utils/localStorage'

export const AuthContext = createContext(null)

// Demo user that is seeded if no users exist
const DEMO_USER = {
  name: 'Demo User',
  email: 'demo@shopvault.com',
  password: 'demo1234',
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Initialize: seed demo user + restore session
  useEffect(() => {
    // Seed demo user if no users exist
    const users = getUsers()
    if (users.length === 0) {
      saveUser(DEMO_USER)
    }

    // Restore session if valid
    if (isSessionValid()) {
      const session = getSession()
      if (session?.user) {
        setCurrentUser(session.user)
      }
    } else {
      clearSession()
    }
    setLoading(false)
  }, [])

  // Auto-logout exactly when session expires
  useEffect(() => {
    if (!currentUser) return

    const session = getSession()
    if (!session) return

    const remaining = session.expiresAt - Date.now()

    if (remaining <= 0) {
      // Already expired
      setCurrentUser(null)
      clearSession()
      toast.error('Session expired. Please login again.')
      navigate('/login', { replace: true })
      return
    }

    // Set a precise timeout that fires at exactly the expiry moment
    const timeout = setTimeout(() => {
      setCurrentUser(null)
      clearSession()
      toast.error('Session expired. Please login again.')
      navigate('/login', { replace: true })
    }, remaining)

    return () => clearTimeout(timeout)
  }, [currentUser, navigate])

  const login = useCallback((email, password) => {
    const users = getUsers()
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (found) {
      const userData = { name: found.name, email: found.email }
      saveSession(userData)
      setCurrentUser(userData)
      return { success: true }
    }

    return { success: false, message: 'Invalid email or password' }
  }, [])

  const register = useCallback((name, email, password) => {
    const users = getUsers()
    const exists = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    )

    if (exists) {
      return { success: false, message: 'Email already registered' }
    }

    saveUser({ name, email, password })
    return { success: true }
  }, [])

  const updateProfile = useCallback((updates, currentPassword) => {
    if (!currentUser) return { success: false, message: 'Not logged in' }

    // Verify current password
    const storedUser = getUserByEmail(currentUser.email)
    if (!storedUser) return { success: false, message: 'User not found' }
    if (currentPassword && storedUser.password !== currentPassword) {
      return { success: false, message: 'Current password is incorrect' }
    }

    // Build updates object
    const userUpdates = {}
    if (updates.name) userUpdates.name = updates.name
    if (updates.email) userUpdates.email = updates.email
    if (updates.newPassword) userUpdates.password = updates.newPassword

    // Update in localStorage
    const success = updateUser(currentUser.email, userUpdates)
    if (!success) return { success: false, message: 'Failed to update profile' }

    // Update session user data WITHOUT resetting the TTL
    const updatedUser = {
      name: updates.name || currentUser.name,
      email: updates.email || currentUser.email,
    }
    updateSessionUser(updatedUser)
    setCurrentUser(updatedUser)

    return { success: true }
  }, [currentUser])

  const logout = useCallback(() => {
    clearSession()
    setCurrentUser(null)
    navigate('/login', { replace: true })
  }, [navigate])

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
