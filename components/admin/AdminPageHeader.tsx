"use client";

import React, { ReactNode } from 'react';
import { AdminBreadcrumb } from './AdminBreadcrumb';
import { cn } from '@/lib/utils';

interface AdminPageHeaderProps {
    /**
     * Page title (optional - can use breadcrumbs instead)
     */
    title?: string;
    /**
     * Action buttons or controls to display on the right
     */
    actions?: ReactNode;
    /**
     * Whether to show breadcrumbs (layout already shows one; set true only if no layout breadcrumb)
     * @default false
     */
    showBreadcrumbs?: boolean;
    /**
     * Additional header content
     */
    children?: ReactNode;
    className?: string;
}

/**
 * AdminPageHeader - Standardized page header for admin pages
 * 
 * Combines breadcrumbs, title, and action buttons in a consistent layout.
 * Integrates breadcrumbs seamlessly without separate container borders.
 * 
 * Usage:
 * ```tsx
 * <AdminPageHeader 
 *   title="Articles" 
 *   actions={<Button>New Article</Button>}
 * />
 * ```
 */
export default function AdminPageHeader({
    title,
    actions,
    showBreadcrumbs = false,
    children,
    className
}: AdminPageHeaderProps) {
    return (
        <div className={cn(
            "pb-6 border-b border-border/50 dark:border-border/50 mb-6",
            className
        )}>
            {/* Breadcrumbs */}
            {showBreadcrumbs && (
                <div className="mb-4">
                    <AdminBreadcrumb />
                </div>
            )}
            
            {/* Title and Actions Row */}
            {(title || actions) && (
                <div className="flex items-center justify-between gap-4">
                    {title && (
                        <h1 className="text-2xl font-bold text-foreground dark:text-foreground">
                            {title}
                        </h1>
                    )}
                    {actions && (
                        <div className="flex items-center gap-2">
                            {actions}
                        </div>
                    )}
                </div>
            )}
            
            {/* Additional header content */}
            {children}
        </div>
    );
}
