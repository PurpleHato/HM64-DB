import { cn } from '../../lib/utils'
import { forwardRef } from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  electric?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, electric, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-border/20 bg-surface text-text-primary shadow-sm holographic-card',
          'transition-all duration-200 hover:scale-[1.02] hover:shadow-lg',
          electric && 'electric-border',
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'
