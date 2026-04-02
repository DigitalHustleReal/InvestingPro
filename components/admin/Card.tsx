import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  noPadding?: boolean;
  variant?: 'default' | 'glass' | 'bordered';
}

export function Card({
  children,
  className,
  title,
  description,
  actions,
  noPadding = false,
  variant = 'default',
}: CardProps) {
  const variantClasses = {
    default: "bg-white/5 border-white/5",
    glass: "bg-white/10 backdrop-blur-md border-white/10",
    bordered: "bg-gray-900/50 border-white/20",
  };

  return (
    <div className={cn(
      "rounded-xl border shadow-lg transition-all duration-200",
      variantClasses[variant],
      className
    )}>
      {/* Header */}
      {(title || description || actions) && (
        <div className={cn(
          "px-6 py-4 border-b border-white/5",
          "flex items-center justify-between gap-4"
        )}>
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-gray-200 font-inter">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-600 font-inter">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}
      
      {/* Content */}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
}

// Card Section - for organizing content within cards
export interface CardSectionProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function CardSection({ children, title, className }: CardSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider font-inter">
          {title}
        </h4>
      )}
      {children}
    </div>
  );
}
