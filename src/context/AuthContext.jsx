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

  // Check session validity every 30 seconds
  useEffect(() => {
    if (!currentUser) return

    const interval = setInterval(() => {
      if (!isSessionValid()) {
        setCurrentUser(null)
        clearSession()
        toast.error('Session expired. Please login again.')
        navigate('/login', { replace: true })
      }
    }, 30 * 1000)

    return () => clearInterval(interval)
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
    isAuthenticated: !!currentUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
