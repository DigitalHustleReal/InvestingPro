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
                "bg-white border-r border-slate-200 flex flex-col transition-all duration-300",
                collapsed ? 'w-16' : 'w-64'
            )}
            style={{ minHeight: 'calc(100vh - 140px)' }}
        >
            {/* Header */}
            {title && (
                <div className="h-16 border-b border-slate-200 flex items-center justify-between px-4">
                    {!collapsed && (
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                            {title}
                        </h3>
                    )}
                    {onToggle && (
                        <button
                            onClick={onToggle}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
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
            <nav className="flex-1 overflow-y-auto py-4">
                <div className="space-y-1">
                    {items.map((item) => {
                        const active = activeItem === item.id;
                        const Icon = item.icon;
                        
                        return (
                            <button
                                key={item.id}
                                onClick={() => onItemChange(item.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors text-left",
                                    active
                                        ? 'bg-teal-50 text-teal-700 font-medium'
                                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                )}
                                title={collapsed ? item.label : undefined}
                            >
                                {Icon && (
                                    <Icon className={cn(
                                        "w-5 h-5 flex-shrink-0",
                                        active ? 'text-teal-600' : 'text-slate-500'
                                    )} />
                                )}
                                {!collapsed && (
                                    <>
                                        <span className="flex-1 truncate">{item.label}</span>
                                        {item.badge !== undefined && item.badge > 0 && (
                                            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
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








