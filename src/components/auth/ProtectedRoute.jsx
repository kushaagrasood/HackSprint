import { Navigate } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'
import { ROUTES } from '@utils/constants'

/**
 * ProtectedRoute Component
 * Wrapper component that protects routes requiring authentication
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  // Render children if authenticated
  return children
}

export default ProtectedRoute

// Made with Bob