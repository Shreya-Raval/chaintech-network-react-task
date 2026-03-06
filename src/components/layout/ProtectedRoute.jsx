import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { validateSession } from '../../utils/session'

/**
 * ProtectedRoute component
 * Checks for a valid session before rendering children.
 * If the session is expired or missing, redirects to /login.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, logout } = useAuth()

  // Show nothing while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Validate session TTL
  if (!isAuthenticated || !validateSession()) {
    // If session expired, clean up auth state
    if (isAuthenticated) {
      logout()
    }
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
