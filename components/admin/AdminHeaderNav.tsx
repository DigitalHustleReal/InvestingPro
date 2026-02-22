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
            className="flex items-center gap-1 overflow-x-auto max-w-full no-scrollbar px-2"
            aria-label="Main navigation"
        >
            {CATEGORIES.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                return (
                    <Link
                        key={category.id}
                        href={category.defaultPath}
                        className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-all whitespace-nowrap",
                            isActive
                                ? "bg-primary/10 text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{category.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
