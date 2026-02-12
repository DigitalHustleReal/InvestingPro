"use client";

import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataFreshnessIndicatorProps {
    /** The date/time when the data was last updated */
    lastUpdated: Date | string | null | undefined;
    /** Custom label (default: "Data updated") */
    label?: string;
    /** Show icon (default: true) */
    showIcon?: boolean;
    /** Threshold in hours for "fresh" data (default: 24) */
    freshThresholdHours?: number;
    /** Threshold in hours for "stale" data (default: 72) */
    staleThresholdHours?: number;
    /** Additional CSS classes */
    className?: string;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
}

/**
 * DataFreshnessIndicator Component
 * 
 * Displays when data was last updated with visual indicators for freshness.
 * - Green: Data updated within freshThresholdHours
 * - Yellow: Data updated within staleThresholdHours
 * - Red: Data older than staleThresholdHours
 * 
 * @example
 * <DataFreshnessIndicator lastUpdated={new Date()} />
 * <DataFreshnessIndicator lastUpdated="2024-01-15T10:30:00Z" label="Prices updated" />
 */
export default function DataFreshnessIndicator({
    lastUpdated,
    label = "Data updated",
    showIcon = true,
    freshThresholdHours = 24,
    staleThresholdHours = 72,
    className,
    size = 'sm',
}: DataFreshnessIndicatorProps) {
    if (!lastUpdated) {
        return null;
    }

    const updatedDate = typeof lastUpdated === 'string' ? new Date(lastUpdated) : lastUpdated;
    
    // Handle invalid dates
    if (isNaN(updatedDate.getTime())) {
        return null;
    }

    const now = new Date();
    const diffMs = now.getTime() - updatedDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = Math.floor(diffHours / 24);

    // Determine freshness status
    const isFresh = diffHours < freshThresholdHours;
    const isStale = diffHours >= staleThresholdHours;
    const isWarning = !isFresh && !isStale;

    // Get human-readable time ago
    const getTimeAgo = (): string => {
        if (diffHours < 1) {
            const diffMins = Math.floor(diffMs / (1000 * 60));
            if (diffMins < 1) return 'just now';
            return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        }
        if (diffHours < 24) {
            const hours = Math.floor(diffHours);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        }
        if (diffDays === 1) {
            return 'yesterday';
        }
        if (diffDays < 7) {
            return `${diffDays} days ago`;
        }
        if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
        }
        return updatedDate.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: updatedDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    // Get appropriate icon and colors
    const getStatusStyles = () => {
        if (isFresh) {
            return {
                icon: CheckCircle2,
                textColor: 'text-success-600 dark:text-success-400',
                bgColor: 'bg-success-50 dark:bg-success-900/20',
                borderColor: 'border-success-200 dark:border-success-800',
            };
        }
        if (isWarning) {
            return {
                icon: Clock,
                textColor: 'text-warning-600 dark:text-warning-400',
                bgColor: 'bg-warning-50 dark:bg-warning-900/20',
                borderColor: 'border-warning-200 dark:border-warning-800',
            };
        }
        return {
            icon: AlertCircle,
            textColor: 'text-danger-600 dark:text-danger-400',
            bgColor: 'bg-danger-50 dark:bg-danger-900/20',
            borderColor: 'border-danger-200 dark:border-danger-800',
        };
    };

    const { icon: Icon, textColor, bgColor, borderColor } = getStatusStyles();
    const timeAgo = getTimeAgo();

    const sizeStyles = {
        sm: {
            container: 'text-xs px-2 py-1 gap-1',
            icon: 'w-3 h-3',
        },
        md: {
            container: 'text-sm px-3 py-1.5 gap-1.5',
            icon: 'w-4 h-4',
        },
        lg: {
            container: 'text-base px-4 py-2 gap-2',
            icon: 'w-5 h-5',
        },
    };

    const currentSize = sizeStyles[size];

    return (
        <div 
            className={cn(
                "inline-flex items-center rounded-full border",
                bgColor,
                borderColor,
                currentSize.container,
                className
            )}
            title={`Last updated: ${updatedDate.toLocaleString('en-IN')}`}
        >
            {showIcon && (
                <Icon className={cn(currentSize.icon, textColor)} />
            )}
            <span className={cn("font-medium", textColor)}>
                {label} {timeAgo}
            </span>
        </div>
    );
}

/**
 * Compact version for inline use
 */
export function DataFreshnessText({
    lastUpdated,
    className,
}: {
    lastUpdated: Date | string | null | undefined;
    className?: string;
}) {
    if (!lastUpdated) return null;

    const updatedDate = typeof lastUpdated === 'string' ? new Date(lastUpdated) : lastUpdated;
    if (isNaN(updatedDate.getTime())) return null;

    const now = new Date();
    const diffMs = now.getTime() - updatedDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    const getTimeAgo = (): string => {
        if (diffHours < 1) {
            const diffMins = Math.floor(diffMs / (1000 * 60));
            if (diffMins < 1) return 'just now';
            return `${diffMins}m ago`;
        }
        if (diffHours < 24) {
            return `${Math.floor(diffHours)}h ago`;
        }
        const days = Math.floor(diffHours / 24);
        return `${days}d ago`;
    };

    return (
        <span 
            className={cn("text-slate-500 dark:text-slate-600", className)}
            title={updatedDate.toLocaleString('en-IN')}
        >
            Updated {getTimeAgo()}
        </span>
    );
}
