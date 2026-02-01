"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sparkles, Wallet, PlayCircle, HeartPulse, Rss } from 'lucide-react';

interface CMSTab {
    id: string;
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
}

const CMS_TABS: CMSTab[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/admin/cms',
        icon: Sparkles,
        description: 'Overview & quick links'
    },
    {
        id: 'budget',
        label: 'Budget',
        href: '/admin/cms/budget',
        icon: Wallet,
        description: 'Spending limits & controls'
    },
    {
        id: 'generation',
        label: 'Generation',
        href: '/admin/cms/generation',
        icon: PlayCircle,
        description: 'AI content generation'
    },
    {
        id: 'health',
        label: 'Health',
        href: '/admin/cms/health',
        icon: HeartPulse,
        description: 'System diagnostics'
    },
    {
        id: 'scrapers',
        label: 'Scrapers',
        href: '/admin/cms/scrapers',
        icon: Rss,
        description: 'Data scraper management'
    }
];

export default function CMSSubNavigation() {
    const pathname = usePathname();

    return (
        <div className="sticky top-[128px] z-20 bg-surface-darkest/95 dark:bg-surface-darkest/95 backdrop-blur-lg border-b border-wt-border dark:border-wt-border">
            <div className="max-w-[1920px] mx-auto px-8">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    {CMS_TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = pathname === tab.href;
                        
                        return (
                            <Link
                                key={tab.id}
                                href={tab.href}
                                className={cn(
                                    "group relative flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap",
                                    "border-b-2 -mb-[2px]",
                                    isActive
                                        ? "text-wt-gold border-wt-gold"
                                        : "text-wt-text-muted dark:text-wt-text-muted border-transparent hover:text-wt-text dark:text-wt-text hover:border-wt-border/80 dark:border-wt-border/80"
                                )}
                            >
                                <Icon className={cn(
                                    "w-4 h-4 transition-transform",
                                    isActive && "scale-110"
                                )} />
                                <div className="flex flex-col items-start">
                                    <span className="font-bold">{tab.label}</span>
                                    <span className={cn(
                                        "text-[10px] uppercase tracking-wider transition-opacity",
                                        isActive ? "text-wt-gold/70" : "text-wt-text-muted/70 dark:text-wt-text-muted/70 group-hover:text-wt-text-muted dark:text-wt-text-muted"
                                    )}>
                                        {tab.description}
                                    </span>
                                </div>
                                
                                {/* Active indicator glow */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-primary-500/5 rounded-t-lg" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
