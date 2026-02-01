/**
 * EmptyState Component
 * Displays when admin pages have no data
 * Provides clear messaging and action buttons
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 px-4 ${className}`}>
      {Icon && (
        <div className="w-20 h-20 rounded-full bg-wt-card dark:bg-wt-card flex items-center justify-center mb-6">
          <Icon className="w-10 h-10 text-wt-text-muted/70 dark:text-wt-text-muted/70" />
        </div>
      )}
      
      <h3 className="text-2xl font-bold text-wt-text dark:text-wt-text mb-3 text-center">
        {title}
      </h3>
      
      <p className="text-wt-text-muted dark:text-wt-text-muted text-center max-w-md mb-8 leading-relaxed">
        {description}
      </p>
      
      {action && (
        action.href ? (
          <Button asChild className="bg-primary-500 hover:bg-wt-gold">
            <a href={action.href}>
              {action.label}
            </a>
          </Button>
        ) : (
          <Button 
            onClick={action.onClick}
            className="bg-primary-500 hover:bg-wt-gold"
          >
            {action.label}
          </Button>
        )
      )}
    </div>
  );
}

export default EmptyState;
