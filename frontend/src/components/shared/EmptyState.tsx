import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="h-16 w-16 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-tertiary)] mb-5">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1.5">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-6">{description}</p>
      {action}
    </div>
  )
}
