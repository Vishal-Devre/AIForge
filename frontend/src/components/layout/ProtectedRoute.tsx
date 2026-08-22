import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Loader } from '@/components/shared/Loader'
import type { ReactNode } from 'react'
import './ProtectedRoute.css'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading, hasSession, backendAvailable, refreshAuth } = useAuth()

  if (loading) {
    return (
      <div className="protected-route-container">
        <Loader />
      </div>
    )
  }

  // Valid Supabase session but the API is unreachable — don't bounce the user
  // to /login; offer a retry so they resume seamlessly when the backend is back.
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
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
