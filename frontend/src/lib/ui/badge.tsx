import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)]',
        success: 'bg-[var(--success-light)] text-[var(--success)] border border-[var(--success-border)]',
        warning: 'bg-[var(--warning-light)] text-[var(--warning)] border border-[var(--warning-border)]',
        danger: 'bg-[var(--error-light)] text-[var(--error)] border border-[var(--error-border)]',
        info: 'bg-[var(--info-light)] text-[var(--info)] border border-[var(--info-border)]',
        primary: 'bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--border-accent)]',
        outline: 'border border-[var(--border-strong)] text-[var(--text-tertiary)]',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export { Badge, badgeVariants }
