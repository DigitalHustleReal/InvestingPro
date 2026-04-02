import React from 'react';
import { cn } from '@/lib/utils';

interface AdminBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

const STATUS_CLASSES = {
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  error: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  neutral: 'bg-gray-500/10 text-gray-300 border-gray-500/20',
};

export const AdminBadge: React.FC<AdminBadgeProps> = ({ status, children, className }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border backdrop-blur-sm",
        STATUS_CLASSES[status],
        className
      )}
    >
      {children}
    </span>
  );
};
