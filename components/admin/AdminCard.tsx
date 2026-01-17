/**
 * AdminCard - Standardized Card Component for CMS
 * Ensures design consistency across all admin pages
 * 
 * Standard Pattern:
 * - Background: bg-slate-900/50
 * - Border: border-slate-800
 * - Hover: hover:border-primary-500/30
 * - Transition: transition-all duration-300
 */

import React from 'react';
import { Card, CardProps } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AdminCardProps extends Omit<CardProps, 'className'> {
  /** Additional custom classes (merged with standard styling) */
  className?: string;
  /** Enable hover effect (border glow) */
  hoverable?: boolean;
  /** Add subtle glow effect */
  glowEffect?: boolean;
}

/**
 * Standardized admin card component
 * Use this instead of raw Card to ensure consistency
 */
export function AdminCard({ 
  children, 
  className, 
  hoverable = false,
  glowEffect = false,
  ...props 
}: AdminCardProps) {
  return (
    <Card
      className={cn(
        // Standard background and border
        'bg-slate-900/50 border-slate-800',
        // Rounded corners
        'rounded-2xl',
        // Hover effects if enabled
        hoverable && 'hover:border-primary-500/30 hover:shadow-xl hover:-translate-y-0.5',
        // Transitions
        'transition-all duration-300',
        // Glow effect
        glowEffect && 'relative overflow-hidden',
        // Custom classes
        className
      )}
      {...props}
    >
      {/* Optional glow effect */}
      {glowEffect && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors" />
      )}
      
      {/* Content with z-index if glow is enabled */}
      {glowEffect ? (
        <div className="relative z-10">{children}</div>
      ) : (
        children
      )}
    </Card>
  );
}

export default AdminCard;
