'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Admin page content wrapper: consistent max-width, padding, and section spacing.
 * Use on every admin page for standalone SaaS consistency.
 */
const ADMIN_PAGE_PADDING = 'px-4 sm:px-6 lg:px-8';
const ADMIN_PAGE_PADDING_Y = 'py-6 lg:py-8';
const ADMIN_PAGE_MAX_W = 'max-w-[1600px]';
const ADMIN_PAGE_GAP = 'space-y-8';

interface AdminPageContainerProps {
    children: ReactNode;
    /** Remove vertical padding (e.g. when page has its own header strip) */
    noPaddingY?: boolean;
    /** Tighter section spacing */
    compact?: boolean;
    className?: string;
}

export function AdminPageContainer({
    children,
    noPaddingY = false,
    compact = false,
    className,
}: AdminPageContainerProps) {
    return (
        <div
            className={cn(
                ADMIN_PAGE_MAX_W,
                'mx-auto w-full min-h-0',
                ADMIN_PAGE_PADDING,
                !noPaddingY && ADMIN_PAGE_PADDING_Y,
                compact ? 'space-y-6' : ADMIN_PAGE_GAP,
                className
            )}
        >
            {children}
        </div>
    );
}

/** Horizontal padding only (for full-bleed headers with same inset as content) */
export const adminPagePaddingX = ADMIN_PAGE_PADDING;
export const adminPageMaxW = ADMIN_PAGE_MAX_W;

export default AdminPageContainer;
