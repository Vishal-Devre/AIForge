import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import './input.css'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, wrapperClassName, type, placeholder, ...props }, ref) => {
    return (
      <div className={cn("uiverse-input-container", wrapperClassName)}>
        <input
          type={type}
          className={cn(
            'transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          placeholder=" " /* Empty space required for :placeholder-shown trick */
          {...props}
        />
        {placeholder && (
          <label className="floating-label">{placeholder}</label>
        )}
        <div className="underline"></div>
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
