import { cn } from '@/lib/utils'

interface StatusIndicatorProps {
  status: string
  className?: string
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const colorMap: Record<string, string> = {
    running: 'bg-[var(--success)] shadow-[var(--success)]',
    active: 'bg-[var(--success)] shadow-[var(--success)]',
    healthy: 'bg-[var(--success)] shadow-[var(--success)]',
    success: 'bg-[var(--success)] shadow-[var(--success)]',
    deployed: 'bg-[var(--success)] shadow-[var(--success)]',
    pending: 'bg-[var(--warning)] shadow-[var(--warning)]',
    deploying: 'bg-[var(--warning)] shadow-[var(--warning)]',
    building: 'bg-[var(--warning)] shadow-[var(--warning)]',
    warning: 'bg-[var(--warning)] shadow-[var(--warning)]',
    error: 'bg-[var(--error)] shadow-[var(--error)]',
    failed: 'bg-[var(--error)] shadow-[var(--error)]',
    critical: 'bg-[var(--error)] shadow-[var(--error)]',
    stopped: 'bg-[var(--error)] shadow-[var(--error)]',
    idle: 'bg-[var(--text-tertiary)] shadow-[var(--text-tertiary)]',
    paused: 'bg-[var(--text-tertiary)] shadow-[var(--text-tertiary)]',
    provisioning: 'bg-[var(--info)] shadow-[var(--info)]',
  }

  return (
    <span className={cn('relative flex h-2 w-2', className)}>
      <span className={cn(
        'absolute inline-flex h-full w-full rounded-full',
        colorMap[status.toLowerCase()] || 'bg-[var(--text-tertiary)]'
      )} />
      <span className={cn(
        'absolute inline-flex h-full w-full rounded-full animate-ping opacity-30',
        colorMap[status.toLowerCase()] || 'bg-[var(--text-tertiary)]'
      )} />
    </span>
  )
}
