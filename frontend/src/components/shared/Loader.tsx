import { cn } from '@/lib/utils'
import './Loader.css'

interface LoaderProps {
  className?: string
  label?: string
}

export function Loader({ className, label = 'Loading' }: LoaderProps) {
  return (
    <div className={cn('loader', className)} role="status" aria-label={label}>
      <div className="circle" />
      <div className="circle" />
      <div className="circle" />
      <div className="circle" />
    </div>
  )
}
