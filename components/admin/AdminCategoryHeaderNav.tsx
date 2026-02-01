"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { CATEGORIES, getActiveCategory } from '@/lib/admin/navigation-config';

interface AdminCategoryHeaderNavProps {
    activeCategory?: string;
    onCategoryChange?: (categoryId: string) => void;
}

export default function AdminCategoryHeaderNav({ 
    activeCategory,
    onCategoryChange 
}: AdminCategoryHeaderNavProps) {
    const pathname = usePathname();
    const router = useRouter();
    const currentCategory = activeCategory || getActiveCategory(pathname);
    
    const handleCategoryClick = (categoryId: string) => {
        if (onCategoryChange) {
            onCategoryChange(categoryId);
        }
        // Navigate to category's default path using Next.js router (SPA navigation)
        const category = CATEGORIES.find(c => c.id === categoryId);
        if (category) {
            router.push(category.defaultPath);
        }
    };

    return (
        <div className="border-b border-wt-border bg-wt-bg">
            <div className="max-w-[1600px] mx-auto px-4">
                <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide py-2" aria-label="Sections">
                    {CATEGORIES.map((category) => {
                        const Icon = category.icon;
                        const isActive = currentCategory === category.id;
                        return (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                                    isActive
                                        ? "bg-wt-gold-subtle text-wt-gold"
                                        : "text-wt-text-muted hover:text-wt-text hover:bg-wt-surface"
                                )}
                                aria-label={category.label}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                <span>{category.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}

// Export function to get category from path (for use in other components)
export function getCategoryFromPath(pathname: string | null): string {
    return getActiveCategory(pathname);
}
