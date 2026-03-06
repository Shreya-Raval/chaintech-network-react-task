import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { isSessionValid } from '../../utils/localStorage'

/**
 * ProtectedRoute component
 * Checks for a valid session before rendering children.
 * If the session is expired or missing → redirect to /login.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, logout } = useAuth()

  // Show spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Validate session TTL
  if (!isAuthenticated || !isSessionValid()) {
    if (isAuthenticated) {
      logout()
    }
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
