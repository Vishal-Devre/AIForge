import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

export function timeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 7) return date.toLocaleDateString()
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'running':
    case 'active':
    case 'healthy':
    case 'success':
    case 'deployed':
      return 'text-[var(--success)]'
    case 'pending':
    case 'deploying':
    case 'building':
    case 'warning':
      return 'text-[var(--warning)]'
    case 'error':
    case 'failed':
    case 'critical':
    case 'stopped':
      return 'text-[var(--error)]'
    case 'idle':
    case 'paused':
      return 'text-[var(--text-tertiary)]'
    default:
      return 'text-[var(--text-tertiary)]'
  }
}

export function getStatusBg(status: string): string {
  switch (status.toLowerCase()) {
    case 'running':
    case 'active':
    case 'healthy':
    case 'success':
    case 'deployed':
      return 'bg-[var(--success-light)]'
    case 'pending':
    case 'deploying':
    case 'building':
    case 'warning':
      return 'bg-[var(--warning-light)]'
    case 'error':
    case 'failed':
    case 'critical':
    case 'stopped':
      return 'bg-[var(--error-light)]'
    case 'idle':
    case 'paused':
      return 'bg-[var(--info-light)]'
    default:
      return 'bg-[var(--info-light)]'
  }
}
