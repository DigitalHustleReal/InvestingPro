import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const iconSizes: Record<IconSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  className?: string;
  strokeWidth?: number;
  'aria-label'?: string;
}

/**
 * Standardized Icon Component
 * 
 * Ensures consistent icon sizing and stroke widths across the platform.
 * 
 * @param icon - Lucide React icon component
 * @param size - Predefined size token (xs/sm/md/lg/xl)
 * @param strokeWidth - Default is 2 for consistency
 * @param className - Additional Tailwind classes for colors, etc.
 * 
 * @example
 * ```tsx
 * import { Icon } from '@/components/ui/Icon';
 * import { TrendingUp } from 'lucide-react';
 * 
 * <Icon icon={TrendingUp} size="md" className="text-primary-500" />
 * ```
 */
export function Icon({ 
  icon: IconComponent, 
  size = 'md', 
  className,
  strokeWidth = 2, // GLOBAL STANDARD: All icons use 2px stroke
  ...props
}: IconProps) {
  return (
    <IconComponent 
      className={cn(iconSizes[size], className)} 
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}

// Export size mapping for use in other components
export { iconSizes };
