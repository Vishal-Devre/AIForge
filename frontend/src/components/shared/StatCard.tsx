import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/lib/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: { value: number; positive: boolean }
  description?: string
  className?: string
}

export function StatCard({ title, value, icon, trend, description, className }: StatCardProps) {
  return (
    <Card className={cn('group hover:border-[var(--border-accent)] transition-all duration-300', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">{value}</p>
            {trend && (
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  'text-xs font-medium',
                  trend.positive ? 'text-[var(--success)]' : 'text-[var(--error)]'
                )}>
                  {trend.positive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">vs last week</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-[var(--text-tertiary)]">{description}</p>
            )}
          </div>
          <div className="h-10 w-10 rounded-xl bg-[var(--accent-light)] border border-[var(--border-accent)] flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent-medium)] group-hover:border-[var(--border-focus)] transition-all duration-300">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
