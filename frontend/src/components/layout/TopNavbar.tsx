import { useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/lib/ui/button'
import { Breadcrumb } from './Breadcrumb'

export function TopNavbar() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="app-top-navbar sticky top-0 z-30 h-14 border-b">
      <div className="flex items-center justify-between h-full pl-14 pr-4 md:px-6">
        {/* Left: Breadcrumb */}
        <Breadcrumb />

        {/* Right: Login button only */}
        <div className="flex items-center gap-2 shrink-0">
          {!isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
              className="h-8 text-xs"
            >
              <LogIn className="h-3.5 w-3.5 mr-1.5" />
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
