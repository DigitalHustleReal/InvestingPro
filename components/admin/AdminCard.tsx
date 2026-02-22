/**
 * AdminCard - Standardized Card Component for CMS
 * Ensures design consistency across all admin pages
 * 
 * Standard Pattern (Wealth & Trust):
 * - Background: ADMIN_THEME.colors.bg.surface (#FFFFFF)
 * - Border: ADMIN_THEME.colors.border.default
 * - Shadow: ADMIN_THEME.shadows.card
 * - Hover: ADMIN_THEME.shadows.cardHover, border-accent
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AdminCardProps extends Omit<React.ComponentProps<typeof Card>, 'className'> {
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
  style,
  ...props 
}: AdminCardProps) {
  return (
    <Card
      style={style}
      className={cn(
        // Standard background and border
        'bg-card border-border',
        // Rounded corners
        'rounded-xl',
        // Shadow (shadow-md used as base for dark mode depth)
        'shadow-md',
        // Hover effects if enabled
        hoverable && 'hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5',
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
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 group-hover:bg-primary transition-colors opacity-20" />
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
