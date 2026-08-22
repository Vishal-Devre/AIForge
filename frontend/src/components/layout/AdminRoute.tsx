import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useIsAdmin } from '@/hooks/useRole'
import { Loader } from '@/components/shared/Loader'
import type { ReactNode } from 'react'
import './ProtectedRoute.css'

export function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading, hasSession, backendAvailable, refreshAuth } = useAuth()
  const isAdmin = useIsAdmin()
  const location = useLocation()

  if (loading) {
    return (
      <div className="protected-route-container">
        <Loader />
      </div>
    )
  }

  if (!isAuthenticated && hasSession && !backendAvailable) {
    return (
      <div className="protected-route-container">
        <div className="auth-service-error" role="alert">
          <h2>Can&apos;t reach AIForge services</h2>
          <p>
            You are signed in, but our servers are unreachable right now.
            Check your connection and try again.
          </p>
          <button
            type="button"
            className="auth-service-retry"
            onClick={() => void refreshAuth()}
          >
            Retry now
          </button>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!isAdmin) {
    // Redirect non-admins trying to access admin routes to the dashboard
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
