import React from 'react';
import { cn } from '@/lib/utils';

interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
  hoverEffect?: boolean;
  glass?: boolean;
  className?: string;
}

export const AdminCard: React.FC<AdminCardProps> = ({ 
  children, 
  noPadding = false, 
  hoverEffect = false,
  glass = false,
  className,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "rounded-xl border border-white/10 transition-all duration-300",
        glass ? "glass-card" : "bg-white/10 backdrop-blur-sm shadow-lg",
        hoverEffect && "hover:-translate-y-1 hover:bg-white/15 hover:border-white/15 hover:shadow-2xl",
        className
      )}
      {...props}
    >
      <div className={noPadding ? "" : "p-6"}>
        {children}
      </div>
    </div>
  );
};
