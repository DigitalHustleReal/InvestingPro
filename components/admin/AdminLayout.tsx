"use client";

import React, { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
    children: ReactNode;
    contextualSidebar?: ReactNode;
}

/**
 * AdminLayout - Main layout component for admin pages
 * 
 * Provides a layout with:
 * - Left: CMS Navigation Sidebar (AdminSidebar)
 * - Middle: Contextual sidebar (optional, for Analyze dashboard)
 * - Right: Main content area
 */
export default function AdminLayout({ children, contextualSidebar }: AdminLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* CMS Navigation Sidebar (Left) */}
            <AdminSidebar />

            {/* Middle + Content Area */}
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
            </div>
        </div>
    );
}
