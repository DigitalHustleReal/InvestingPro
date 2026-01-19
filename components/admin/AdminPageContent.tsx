"use client";

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AdminPageContentProps {
    children: ReactNode;
    className?: string;
    /**
     * Whether to apply standard max-width container
     * @default true
     */
    container?: boolean;
}

/**
 * AdminPageContent - Standardized content wrapper for admin pages
 * 
 * Provides consistent spacing and layout for all admin page content.
 * This ensures all pages have the same visual hierarchy and spacing.
 */
export default function AdminPageContent({ 
    children, 
    className,
    container = true 
}: AdminPageContentProps) {
    return (
        <div className={cn(
            // Standard page padding
            "px-6 py-8",
            // Apply max-width container if enabled
            container && "max-w-7xl mx-auto w-full",
            className
        )}>
            {children}
        </div>
    );
}
