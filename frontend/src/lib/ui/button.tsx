import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-[var(--accent)] text-[var(--text-on-accent)] hover:bg-[var(--accent-hover)] shadow-[var(--shadow-accent)] hover:shadow-[var(--shadow-lg)] hover:scale-[1.02] active:scale-[0.98]',
        destructive: 'bg-[var(--error)] text-[var(--text-on-accent)] hover:bg-[var(--error-hover)] shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] hover:scale-[1.02] active:scale-[0.98]',
        outline: 'border border-[var(--border-accent)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--accent-light)] hover:border-[var(--border-focus)] hover:text-[var(--text-primary)] active:scale-[0.98]',
        secondary: 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-primary)] border border-[var(--border-primary)] hover:border-[var(--border-strong)] active:scale-[0.98]',
        ghost: 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] active:scale-[0.98]',
        link: 'text-[var(--text-accent)] underline-offset-4 hover:underline hover:text-[var(--accent-hover)]',
      },
      size: {
        default: 'h-10 px-5 py-2.5',
        sm: 'h-8 rounded-md px-3.5 text-xs',
        lg: 'h-12 rounded-xl px-7 text-base',
        xl: 'h-14 rounded-xl px-8 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
