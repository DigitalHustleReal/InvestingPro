import React from 'react';
import { Loader2, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: LucideIcon;
  className?: string;
}

export const AdminButton: React.FC<AdminButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  icon: Icon,
  className,
  disabled,
  ...props 
}) => {
  
  const baseClasses = "inline-flex items-center justify-center rounded-md font-semibold transition-all outline-none border";
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantClasses = {
    primary: "bg-slate-800 hover:bg-slate-700 text-white border-transparent shadow-md hover:shadow-lg",
    secondary: "bg-amber-500 hover:bg-amber-400 text-slate-900 border-transparent shadow-md hover:shadow-lg font-bold",
    outline: "bg-transparent hover:bg-white/10 text-slate-200 border-white/10 hover:border-white/20",
    ghost: "bg-transparent hover:bg-white/10 text-slate-300 hover:text-slate-200 border-transparent",
    danger: "bg-rose-600 hover:bg-rose-700 text-white border-transparent shadow-md hover:shadow-lg",
  };

  const disabledClasses = "opacity-70 cursor-not-allowed";

  return (
    <button
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        (disabled || isLoading) && disabledClasses,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin mr-2 h-4 w-4" />
      ) : Icon ? (
        <Icon className="mr-2 h-4 w-4" />
      ) : null}
      {children}
    </button>
  );
};
