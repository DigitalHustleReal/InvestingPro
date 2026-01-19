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
        <div className="sticky top-0 z-30 bg-surface-darkest/95 dark:bg-surface-darkest/95 backdrop-blur-lg border-b border-border dark:border-border">
            <div className="max-w-[1920px] mx-auto px-6">
                <div className="flex items-center justify-end md:justify-center gap-1 overflow-x-auto scrollbar-hide py-3">
                    {CATEGORIES.map((category) => {
                        const Icon = category.icon;
                        const isActive = currentCategory === category.id;
                        
                        return (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className={cn(
                                    "group relative flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                                    isActive
                                        ? "bg-primary-500/10 text-primary-400 border border-primary-500/20"
                                        : "text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:text-foreground hover:bg-white/5"
                                )}
                                aria-label={category.label}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <Icon className={cn(
                                    "w-4 h-4 transition-transform",
                                    isActive && "scale-110"
                                )} />
                                <span className="font-semibold">{category.label}</span>
                                
                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500 shadow-[0_0_8px_#10b981]" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// Export function to get category from path (for use in other components)
export function getCategoryFromPath(pathname: string | null): string {
    return getActiveCategory(pathname);
}
