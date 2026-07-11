import { cn } from '@/lib/utils'
import { Progress } from '@/lib/ui/progress'

interface MetricBarProps {
  label: string
  value: number
  max?: number
  unit?: string
  className?: string
}

export function MetricBar({ label, value, max = 100, unit = '%', className }: MetricBarProps) {
  const percentage = Math.round((value / max) * 100)
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--text-tertiary)]">{label}</span>
        <span className="text-xs font-medium text-[var(--text-secondary)]">{value}{unit}</span>
      </div>
      <Progress value={percentage} className="h-1.5" />
    </div>
  )
}
