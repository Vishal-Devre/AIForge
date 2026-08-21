import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8', className)}>
      <div>
        <h1 className="page-header-title text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="page-header-description text-sm mt-1 max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="page-header-actions flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}
