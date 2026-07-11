import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useIsAdmin } from '@/hooks/useRole'
import type { ReactNode } from 'react'
import './ProtectedRoute.css' // We can reuse the spinner styles

export function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const isAdmin = useIsAdmin()
  const location = useLocation()

  if (loading) {
    return (
      <div className="protected-route-container">
        <div className="protected-route-spinner" />
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
