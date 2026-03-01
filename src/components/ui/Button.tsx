import { cn } from '../../lib/utils'
import { forwardRef, type ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'default' | 'lg'
}

const buttonStyles = {
  primary: 'bg-primary text-white hover:bg-primary-hover hover:scale-105 shadow-md',
  secondary: 'bg-surface-elevated text-text-primary hover:bg-primary/50 hover:scale-105 shadow-sm',
  ghost: 'hover:bg-primary/20 hover:scale-105 text-text-primary',
  outline: 'border border-border bg-transparent hover:bg-primary/20 hover:scale-105 text-text-primary',
}

const sizeStyles = {
  sm: 'h-8 rounded-md px-3 text-xs',
  default: 'h-9 px-4 py-2 rounded-xl',
  lg: 'h-10 rounded-xl px-8',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium',
          'transition-all active:scale-105',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          'disabled:pointer-events-none disabled:opacity-50',
          buttonStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
