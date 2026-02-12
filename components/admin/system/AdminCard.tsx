import React from 'react';
import { cn } from '@/lib/utils';

interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
  hoverEffect?: boolean;
  className?: string;
}

export const AdminCard: React.FC<AdminCardProps> = ({ 
  children, 
  noPadding = false, 
  hoverEffect = false,
  className,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm shadow-lg transition-all duration-300",
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
