/**
 * Security & Trust Badge Components - Week 2, Task 2.2
 * Purpose: Display trust signals for fintech platform
 */

import { cn } from "@/lib/utils";
import { Lock, ShieldCheck, Award } from "lucide-react";

export type BadgeType = 'ssl' | 'privacy' | 'compliance' | 'verified';

interface SecurityBadgeProps {
  type: BadgeType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const badgeConfig = {
  ssl: {
    icon: Lock,
    iconColor: 'text-success-600',
    bgColor: 'bg-success-50',
    borderColor: 'border-success-200',
    text: 'Secure Connection',
    subtext: '256-bit SSL Encryption',
  },
  privacy: {
    icon: ShieldCheck,
    iconColor: 'text-primary-600',
    bgColor: 'bg-primary-50',
    borderColor: 'border-primary-200',
    text: 'Data Protected',
    subtext: 'We never share your data',
  },
  compliance: {
    icon: Award,
    iconColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    text: 'RBI Guidelines',
    subtext: 'Compliant Platform',
  },
  verified: {
    icon: ShieldCheck,
    iconColor: 'text-success-600',
    bgColor: 'bg-success-50',
    borderColor: 'border-success-200',
    text: 'Verified',
    subtext: 'Expert-reviewed content',
  },
};

const sizeConfig = {
  sm: {
    container: 'px-2 py-1.5',
    icon: 'w-3 h-3',
    text: 'text-[10px]',
    subtext: 'text-[8px]',
  },
  md: {
    container: 'px-3 py-2',
    icon: 'w-4 h-4',
    text: 'text-xs',
    subtext: 'text-[10px]',
  },
  lg: {
    container: 'px-4 py-3',
    icon: 'w-5 h-5',
    text: 'text-sm',
    subtext: 'text-xs',
  },
};

export function SecurityBadge({ 
  type, 
  size = 'md',
  className 
}: SecurityBadgeProps) {
  const config = badgeConfig[type];
  const sizes = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border",
        config.bgColor,
        config.borderColor,
        sizes.container,
        className
      )}
      role="img"
      aria-label={`${config.text}: ${config.subtext}`}
    >
      <Icon 
        className={cn(sizes.icon, config.iconColor)} 
        aria-hidden="true"
      />
      <div className="flex flex-col">
        <span className={cn(
          "font-semibold leading-tight",
          config.iconColor.replace('text-', 'text-'),
          sizes.text
        )}>
          {config.text}
        </span>
        <span className={cn(
          "leading-tight opacity-75",
          config.iconColor.replace('600', '700'),
          sizes.subtext
        )}>
          {config.subtext}
        </span>
      </div>
    </div>
  );
}

/**
 * Badge group for footer/form pages
 */
export function SecurityBadgeGroup({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <SecurityBadge type="ssl" size="sm" />
      <SecurityBadge type="privacy" size="sm" />
      <SecurityBadge type="compliance" size="sm" />
    </div>
  );
}

/**
 * Verified content badge (for articles/reviews)
 */
export function VerifiedBadge({ className }: { className?: string }) {
  return <SecurityBadge type="verified" size="sm" className={className} />;
}
