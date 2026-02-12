import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ariaLabel?: string; // Explicitly encourage aria-label
}

/**
 * Accessible Button Component
 * ✅ WCAG 2.1 AA Compliant
 * ✅ Keyboard accessible
 * ✅ Screen reader friendly
 * ✅ Focus indicators
 * ✅ Loading states
 */
export function AccessibleButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ariaLabel,
  ...props
}: AccessibleButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-600",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-500 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
    outline: "border border-slate-200 bg-transparent hover:bg-slate-100 focus-visible:ring-slate-500 dark:border-slate-800 dark:hover:bg-slate-800",
    ghost: "hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-50",
    danger: "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-600",
  };
  
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-8 text-lg",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}
