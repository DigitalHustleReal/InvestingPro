import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Standardized status badge component with semantic colors
 * Maps common status values to consistent color variants
 */

type StatusValue = 
    | 'operational' | 'active' | 'live' | 'published' | 'completed'
    | 'pending' | 'idle' | 'draft' | 'scheduled' | 'review'
    | 'failed' | 'error' | 'rejected' | 'deleted'
    | 'info' | 'processing' | 'running';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

interface StatusBadgeProps {
    status: StatusValue | string;
    className?: string;
    children?: React.ReactNode;
}

/**
 * Status to variant mapping
 * - Success (Green/Teal): Operational, active, completed states
 * - Warning (Orange): Pending, idle, needs attention states
 * - Error (Red): Failed, error, rejected states
 * - Info (Cyan): Informational, processing states
 */
const statusMap: Record<string, { variant: BadgeVariant; label?: string }> = {
    // Success states
    operational: { variant: 'success', label: 'OPERATIONAL' },
    active: { variant: 'success', label: 'ACTIVE' },
    live: { variant: 'success', label: 'LIVE' },
    published: { variant: 'success', label: 'PUBLISHED' },
    completed: { variant: 'success', label: 'COMPLETED' },
    
    // Warning states
    pending: { variant: 'warning', label: 'PENDING' },
    idle: { variant: 'warning', label: 'IDLE' },
    draft: { variant: 'warning', label: 'DRAFT' },
    scheduled: { variant: 'warning', label: 'SCHEDULED' },
    review: { variant: 'warning', label: 'PENDING REVIEW' },
    
    // Error states
    failed: { variant: 'error', label: 'FAILED' },
    error: { variant: 'error', label: 'ERROR' },
    rejected: { variant: 'error', label: 'REJECTED' },
    deleted: { variant: 'error', label: 'DELETED' },
    
    // Info states
    info: { variant: 'info', label: 'INFO' },
    processing: { variant: 'info', label: 'PROCESSING' },
    running: { variant: 'info', label: 'RUNNING' },
};

export function StatusBadge({ status, className, children }: StatusBadgeProps) {
    const normalizedStatus = status.toLowerCase().trim();
    const config = statusMap[normalizedStatus] || { variant: 'default' as BadgeVariant };
    
    // Use children if provided, otherwise use mapped label or original status
    const displayText = children || config.label || status.toUpperCase();
    
    return (
        <Badge variant={config.variant} className={cn("uppercase tracking-wide", className)}>
            {displayText}
        </Badge>
    );
}

/**
 * Utility function to get variant for a status without rendering
 */
export function getStatusVariant(status: string): BadgeVariant {
    const normalizedStatus = status.toLowerCase().trim();
    return statusMap[normalizedStatus]?.variant || 'default';
}

export default StatusBadge;
