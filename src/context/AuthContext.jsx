import { createContext, useState, useEffect, useCallback } from 'react'
import { getUser, saveUser, removeUser } from '../utils/localStorage'
import { createSession, validateSession, destroySession, refreshSession } from '../utils/session'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check for existing valid session on mount
  useEffect(() => {
    const storedUser = getUser()
    if (storedUser && validateSession()) {
      setUser(storedUser)
      setIsAuthenticated(true)
    } else {
      destroySession()
    }
    setLoading(false)
  }, [])

  const login = useCallback((userData) => {
    saveUser(userData)
    createSession(userData)
    setUser(userData)
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    destroySession()
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  const refresh = useCallback(() => {
    const session = refreshSession()
    if (!session) {
      setUser(null)
      setIsAuthenticated(false)
      return false
    }
    return true
  }, [])

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    refresh,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
