import { useState, useCallback, createContext, useContext, type ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7)
    setToasts(prev => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colors = {
  success: 'border-[var(--success-border)] bg-[var(--success-light)]',
  error: 'border-[var(--error-border)] bg-[var(--error-light)]',
  warning: 'border-[var(--warning-border)] bg-[var(--warning-light)]',
  info: 'border-[var(--info-border)] bg-[var(--info-light)]',
}

const iconColors = {
  success: 'text-[var(--success)]',
  error: 'text-[var(--error)]',
  warning: 'text-[var(--warning)]',
  info: 'text-[var(--info)]',
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const Icon = icons[toast.type]
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-xl animate-slide-up',
        colors[toast.type],
      )}
    >
      <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', iconColors[toast.type])} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)]">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{toast.message}</p>
        )}
      </div>
      <button onClick={onClose} className="shrink-0 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
