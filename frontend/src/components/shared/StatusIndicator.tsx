import { cn } from '@/lib/utils'

interface StatusIndicatorProps {
  status: string
  className?: string
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const colorMap: Record<string, string> = {
    running: 'bg-emerald-400 shadow-emerald-400/50',
    active: 'bg-emerald-400 shadow-emerald-400/50',
    healthy: 'bg-emerald-400 shadow-emerald-400/50',
    success: 'bg-emerald-400 shadow-emerald-400/50',
    deployed: 'bg-emerald-400 shadow-emerald-400/50',
    pending: 'bg-amber-400 shadow-amber-400/50',
    deploying: 'bg-amber-400 shadow-amber-400/50',
    building: 'bg-amber-400 shadow-amber-400/50',
    warning: 'bg-amber-400 shadow-amber-400/50',
    error: 'bg-red-400 shadow-red-400/50',
    failed: 'bg-red-400 shadow-red-400/50',
    critical: 'bg-red-400 shadow-red-400/50',
    stopped: 'bg-red-400 shadow-red-400/50',
    idle: 'bg-slate-400 shadow-slate-400/30',
    paused: 'bg-slate-400 shadow-slate-400/30',
    provisioning: 'bg-blue-400 shadow-blue-400/50',
  }

  return (
    <span className={cn('relative flex h-2 w-2', className)}>
      <span className={cn(
        'absolute inline-flex h-full w-full rounded-full',
        colorMap[status.toLowerCase()] || 'bg-slate-400'
      )} />
      <span className={cn(
        'absolute inline-flex h-full w-full rounded-full animate-ping opacity-30',
        colorMap[status.toLowerCase()] || 'bg-slate-400'
      )} />
    </span>
  )
}
