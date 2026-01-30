"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { CATEGORIES, getActiveCategory } from '@/lib/admin/navigation-config';

/**
 * Header Nav (Layer 1): Main groups – Content, Automation, Pipeline, Insights, etc.
 * Always visible below the top bar. Drives which sections appear in the contextual sidebar.
 */
export default function AdminHeaderNav() {
    const pathname = usePathname();
    const activeCategory = getActiveCategory(pathname);

    return (
        <nav
            className="sticky top-14 z-30 flex w-full border-b border-admin-pro-border bg-admin-pro-bg/95 backdrop-blur supports-[backdrop-filter]:bg-admin-pro-bg/80"
            aria-label="Main navigation"
        >
            <div className="mx-auto flex w-full max-w-[1600px] items-center gap-0.5 px-4 py-2.5 sm:px-6 lg:px-8">
                {CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    const isActive = activeCategory === category.id;
                    return (
                        <Link
                            key={category.id}
                            href={category.defaultPath}
                            className={cn(
                                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                                isActive
                                    ? "bg-admin-pro-accent-subtle text-admin-pro-accent"
                                    : "text-admin-pro-text-muted hover:text-admin-pro-text hover:bg-admin-pro-surface"
                            )}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span>{category.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
