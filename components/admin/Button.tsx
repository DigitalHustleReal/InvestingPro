import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Loader2, LucideIcon } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon: Icon,
      iconPosition = 'left',
      fullWidth = false,
      className,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          // Base styles - ALWAYS APPLIED
          'inline-flex items-center justify-center gap-2',
          'font-medium rounded-lg',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'select-none',
          
          // Size variants
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
          },
          
          // Full width
          fullWidth && 'w-full',
          
          // Color variants - WCAG AA COMPLIANT
          {
            // Primary: Brand color, high contrast
            primary: [
              'bg-primary text-white',
              'hover:bg-primary-hover',
              'focus:ring-primary',
              'shadow-sm',
            ].join(' '),
            
            // Secondary: Subtle, still visible
            secondary: [
              'bg-surface text-text-primary',
              'border border-border',
              'hover:bg-surface-hover',
              'focus:ring-primary',
            ].join(' '),
            
            // Outline: Just border
            outline: [
              'bg-transparent text-text-primary',
              'border border-border',
              'hover:bg-surface',
              'focus:ring-primary',
            ].join(' '),
            
            // Ghost: No border, subtle
            ghost: [
              'bg-transparent text-text-primary',
              'hover:bg-surface',
              'focus:ring-primary',
            ].join(' '),
            
            // Danger: Destructive actions
            danger: [
              'bg-error text-white',
              'hover:bg-error-dark',
              'focus:ring-error',
              'shadow-sm',
            ].join(' '),
          }[variant],
          
          className
        )}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        
        {/* Left icon */}
        {!isLoading && Icon && iconPosition === 'left' && (
          <Icon className="h-4 w-4" />
        )}
        
        {/* Button text */}
        {children}
        
        {/* Right icon */}
        {!isLoading && Icon && iconPosition === 'right' && (
          <Icon className="h-4 w-4" />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
