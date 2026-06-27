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
    <Card className={cn('group hover:border-primary-500/20 transition-all duration-300', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
            {trend && (
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  'text-xs font-medium',
                  trend.positive ? 'text-emerald-400' : 'text-red-400'
                )}>
                  {trend.positive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-xs text-slate-500">vs last week</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-slate-500">{description}</p>
            )}
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all duration-300">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
