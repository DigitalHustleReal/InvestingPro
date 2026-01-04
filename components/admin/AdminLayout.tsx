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
        <div className="min-h-screen bg-[#0a0c10] flex overflow-hidden">
            {/* Background Mesh Gradients for Premium feel */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/5 blur-[120px]" />
            </div>

            {/* CMS Navigation Sidebar (Left) */}
            <AdminSidebar />

            {/* Middle + Content + Inspector Area */}
            <div className="flex-1 flex overflow-hidden relative z-10">
                {/* Contextual Sidebar (Middle - for Analyze dashboard) */}
                {contextualSidebar && (
                    <aside className="flex-shrink-0 border-r border-white/5">
                        {contextualSidebar}
                    </aside>
                )}

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto no-scrollbar bg-transparent">
                    <div className="min-h-full">
                        {children}
                    </div>
                </main>

                {/* Inspector Panel (Right - for entity editing) */}
                {showInspector && inspectorContent && (
                    <aside className="w-80 border-l border-white/5 bg-slate-900/50 backdrop-blur-xl flex-shrink-0 overflow-y-auto no-scrollbar">
                        {inspectorContent}
                    </aside>
                )}
            </div>
        </div>
    );
}
