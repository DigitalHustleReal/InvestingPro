"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    FileText,
    Zap,
    BarChart3,
    DollarSign,
    Settings,
    LayoutDashboard
} from 'lucide-react';

interface Category {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    paths: string[]; // URL paths that belong to this category
}

const CATEGORIES: Category[] = [
    {
        id: 'content',
        label: 'Content',
        icon: FileText,
        paths: [
            '/admin/articles',
            '/admin/pillar-pages',
            '/admin/authors',
            '/admin/categories',
            '/admin/tags',
            '/admin/media',
            '/admin/content-calendar'
        ]
    },
    {
        id: 'automation',
        label: 'Automation',
        icon: Zap,
        paths: [
            '/admin/content-factory',
            '/admin/automation',
            '/admin/ai-personas',
            '/admin/pipeline-monitor',
            '/admin/review-queue'
        ]
    },
    {
        id: 'insights',
        label: 'Insights',
        icon: BarChart3,
        paths: [
            '/admin/analytics',
            '/admin/metrics',
            '/admin/seo',
            '/admin/seo/experiments',
            '/admin/seo/rankings'
        ]
    },
    {
        id: 'monetization',
        label: 'Monetization',
        icon: DollarSign,
        paths: [
            '/admin/revenue',
            '/admin/products',
            '/admin/product-analytics',
            '/admin/affiliates',
            '/admin/ads'
        ]
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        paths: [
            '/admin/settings',
            '/admin/settings/vault',
            '/admin/guide'
        ]
    }
];

/**
 * Gets the active category based on current pathname
 */
function getActiveCategory(pathname: string | null): string {
    if (!pathname) return 'content';
    
    // Dashboard (root) defaults to 'content'
    if (pathname === '/admin' || pathname === '/admin/') {
        return 'content';
    }
    
    // Check each category's paths
    for (const category of CATEGORIES) {
        if (category.paths.some(path => pathname.startsWith(path))) {
            return category.id;
        }
    }
    
    // Default to content if no match
    return 'content';
}

interface AdminCategoryHeaderNavProps {
    activeCategory?: string;
    onCategoryChange?: (categoryId: string) => void;
}

export default function AdminCategoryHeaderNav({ 
    activeCategory,
    onCategoryChange 
}: AdminCategoryHeaderNavProps) {
    const pathname = usePathname();
    const currentCategory = activeCategory || getActiveCategory(pathname);
    
    const handleCategoryClick = (categoryId: string) => {
        if (onCategoryChange) {
            onCategoryChange(categoryId);
        }
        // If category has a default path, navigate to it
        const category = CATEGORIES.find(c => c.id === categoryId);
        if (category && category.paths.length > 0) {
            // Navigate to first path in category
            window.location.href = category.paths[0];
        }
    };

    return (
        <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-lg border-b border-white/10">
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
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
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
