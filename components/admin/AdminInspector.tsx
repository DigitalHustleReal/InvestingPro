"use client";

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, X } from 'lucide-react';

interface AdminInspectorProps {
    children: ReactNode;
    collapsed: boolean;
    onToggle: () => void;
}

/**
 * AdminInspector - Right-side panel for article metadata and settings
 * 
 * Used in article editor for:
 * - Publish settings
 * - SEO metadata
 * - Categories and tags
 * - Featured image
 */
export default function AdminInspector({ children, collapsed, onToggle }: AdminInspectorProps) {
    return (
        <aside
            className={cn(
                "bg-card border-l border-border flex flex-col transition-all duration-300 relative",
                collapsed ? "w-0 overflow-hidden" : "w-80"
            )}
        >
            {!collapsed && (
                <>
                    {/* Header */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-border flex-shrink-0">
                        <h2 className="text-sm font-semibold text-foreground">Settings</h2>
                        <button
                            onClick={onToggle}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Collapse inspector"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto min-h-0">
                        {children}
                    </div>
                </>
            )}

            {/* Collapsed Toggle Button - only show when collapsed */}
            {collapsed && (
                <button
                    onClick={onToggle}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full bg-muted border border-border rounded-r-lg p-2 shadow-sm hover:bg-muted/80 transition-colors z-10"
                    aria-label="Expand inspector"
                >
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
            )}
        </aside>
    );
}

