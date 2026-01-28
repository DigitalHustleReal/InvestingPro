import React from 'react';
import { ShieldCheck, CheckCircle2, BadgeCheck, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

type BadgeType = 'verified' | 'fact-checked' | 'secure' | 'independent';

interface TrustBadgeProps {
  type: BadgeType;
  className?: string;
  showIcon?: boolean;
}

const badgeConfig = {
  verified: {
    label: 'Verified Review',
    icon: ShieldCheck,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800',
  },
  'fact-checked': {
    label: 'Fact-Checked',
    icon: CheckCircle2,
    color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800',
  },
  secure: {
    label: 'Secure Application',
    icon: Lock,
    color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800',
  },
  independent: {
    label: '100% Independent',
    icon: BadgeCheck,
    color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800',
  }
};

export default function TrustBadge({ type, className, showIcon = true }: TrustBadgeProps) {
  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      config.color,
      className
    )}>
      {showIcon && <Icon className="w-3 h-3" />}
      <span>{config.label}</span>
    </div>
  );
}
