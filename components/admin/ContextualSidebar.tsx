"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ContextualSidebarItem {
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    badge?: number;
}

interface ContextualSidebarProps {
    items: ContextualSidebarItem[];
    activeItem: string;
    onItemChange: (id: string) => void;
    title?: string;
    collapsed?: boolean;
    onToggle?: () => void;
}

/**
 * ContextualSidebar - Page-specific navigation sidebar
 * 
 * Used for pages with multiple tabs/sections that should be
 * displayed as vertical navigation instead of horizontal tabs.
 * 
 * Example usage:
 * - Dashboard: Overview, Performance, Content Stats, etc.
 * - AI Generator: One-Click, Templates, Prompts, etc.
 * - Media Library: My Media, Stock Images
 */
export default function ContextualSidebar({
    items,
    activeItem,
    onItemChange,
    title = "Navigation",
    collapsed = false,
    onToggle
}: ContextualSidebarProps) {
    return (
        <div
            className={cn(
                "bg-surface-darker border-r border-border/50 dark:border-border/50 flex flex-col transition-all duration-300 relative z-30",
                collapsed ? 'w-20' : 'w-64'
            )}
            style={{ height: 'calc(100vh)' }}
        >
            {/* Header */}
            {title && (
                <div className="h-20 border-b border-border/50 dark:border-border/50 flex items-center justify-between px-6">
                    {!collapsed && (
                        <h3 className="text-[10px] font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-[0.2em]">
                            {title}
                        </h3>
                    )}
                    {onToggle && (
                        <button
                            onClick={onToggle}
                            className="p-2 rounded-xl bg-white/5 border border-border dark:border-border hover:bg-white/10 text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:text-foreground transition-all duration-300"
                            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {collapsed ? (
                                <ChevronRight className="w-4 h-4" />
                            ) : (
                                <ChevronLeft className="w-4 h-4" />
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 no-scrollbar">
                <div className="space-y-1.5">
                    {items.map((item) => {
                        const active = activeItem === item.id;
                        const Icon = item.icon;
                        
                        return (
                            <button
                                key={item.id}
                                onClick={() => onItemChange(item.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left relative group",
                                    active
                                        ? 'bg-primary-600/10 text-foreground dark:text-foreground shadow-[inset_0_0_20px_rgba(79,70,229,0.05)] border border-primary-500/20'
                                        : 'text-muted-foreground/70 dark:text-muted-foreground/70 hover:bg-white/5 hover:text-foreground/80 dark:text-foreground/80'
                                )}
                                title={collapsed ? item.label : undefined}
                            >
                                {active && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary-500 rounded-r-full shadow-[0_0_8px_#6366f1]" />
                                )}

                                {Icon && (
                                    <Icon className={cn(
                                        "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110",
                                        active ? 'text-primary-400' : 'text-muted-foreground/70 dark:text-muted-foreground/70'
                                    )} />
                                )}
                                {!collapsed && (
                                    <>
                                        <span className="flex-1 truncate text-sm font-medium">{item.label}</span>
                                        {item.badge !== undefined && item.badge > 0 && (
                                            <span className="px-2 py-0.5 text-[10px] font-bold bg-primary-500/20 text-primary-400 border border-primary-500/30 rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
















