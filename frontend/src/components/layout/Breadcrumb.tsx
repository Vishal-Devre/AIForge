import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { getBreadcrumbs } from '@/data/breadcrumbs'

export function Breadcrumb() {
  const location = useLocation()
  const navigate = useNavigate()
  const crumbs = getBreadcrumbs(location.pathname)

  return (
    <nav className="flex items-center gap-2 text-sm min-w-0">
      <button
        onClick={() => navigate('/')}
        className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors font-medium shrink-0 cursor-pointer"
      >
        AIForge
      </button>
      {crumbs.map((crumb, i) => (
        <span key={crumb.path} className="flex items-center gap-2 min-w-0">
          <ChevronRight className="h-3.5 w-3.5 text-[var(--text-tertiary)] shrink-0" />
          {i === crumbs.length - 1 ? (
            <span className="text-[var(--text-primary)] font-medium truncate">
              {crumb.label}
            </span>
          ) : (
            <button
              onClick={() => navigate(crumb.path)}
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors font-medium shrink-0 cursor-pointer truncate"
            >
              {crumb.label}
            </button>
          )}
        </span>
      ))}
    </nav>
  )
}
