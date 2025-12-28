"use client";

import React, { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
    children: ReactNode;
    contextualSidebar?: ReactNode;
    showInspector?: boolean;
    inspectorContent?: ReactNode;
}

/**
 * AdminLayout - Main layout component for admin pages
 * 
 * Provides a layout with:
 * - Left: CMS Navigation Sidebar (AdminSidebar)
 * - Middle: Contextual sidebar (optional, for Analyze dashboard)
 * - Center: Main content area
 * - Right: Inspector panel (optional, for entity editing)
 */
export default function AdminLayout({ 
    children, 
    contextualSidebar,
    showInspector = false,
    inspectorContent 
}: AdminLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* CMS Navigation Sidebar (Left) */}
            <AdminSidebar />

            {/* Middle + Content + Inspector Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Contextual Sidebar (Middle - for Analyze dashboard) */}
                {contextualSidebar && (
                    <aside className="flex-shrink-0">
                        {contextualSidebar}
                    </aside>
                )}

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>

                {/* Inspector Panel (Right - for entity editing) */}
                {showInspector && inspectorContent && (
                    <aside className="w-80 border-l border-slate-200 bg-white flex-shrink-0 overflow-y-auto">
                        {inspectorContent}
                    </aside>
                )}
            </div>
        </div>
    );
}
