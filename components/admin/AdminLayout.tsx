"use client";

import React, { ReactNode, useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import KeyboardShortcuts from './KeyboardShortcuts';
import { AdminBreadcrumb } from './AdminBreadcrumb';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ADMIN_THEME } from '@/lib/admin/theme';

interface AdminLayoutProps {
    children: ReactNode;
    contextualSidebar?: ReactNode;
    showInspector?: boolean;
    inspectorContent?: ReactNode;
}

/**
 * AdminLayout - Two-layer navigation:
 * - Layer 1: Header Nav (main groups) – Content, Automation, Pipeline, Insights, etc.
 * - Layer 2: Contextual sidebar – sections/links for the active group only.
 * Optional: right contextual sidebar (e.g. "On this page") and inspector panel.
 */
export default function AdminLayout({ 
    children, 
    contextualSidebar,
    showInspector = false,
    inspectorContent
}: AdminLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on window resize (desktop)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    return (
        <>
            <KeyboardShortcuts />
            <div className="min-h-screen flex flex-col antialiased bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
                {/* Mobile menu button – Wealth & Trust */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden fixed top-[3.25rem] left-4 z-50 p-2.5 rounded-lg transition-colors shadow-sm bg-slate-900/90 border border-white/10 text-slate-200 backdrop-blur-md"
                    aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMobileMenuOpen}
                >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                {isMobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)} 
                        aria-hidden="true" 
                    />
                )}

                {/* Main nav is now part of AdminTopBar (single header) */}
                <div className="grid grid-cols-[auto_1fr] flex-1 overflow-hidden relative z-10">
                    <aside
                        className={cn(
                            'w-[240px] flex-shrink-0 shadow-xl',
                            'fixed md:relative z-40 md:z-0',
                            'transition-transform duration-200 ease-out md:transition-none',
                            'h-[calc(100vh-3.5rem)] md:h-full',
                            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                        )}
                        aria-label="Main navigation"
                    >
                        <AdminSidebar />
                    </aside>

                    <div className="col-span-1 flex flex-col overflow-hidden min-w-0">
                        {/* Breadcrumb only in main content area */}
                        <div className="sticky top-14 z-20 shrink-0 border-b border-white/5 bg-slate-900/80 backdrop-blur-md">
                            <div className="max-w-[1600px] mx-auto px-4 py-3 sm:px-6 lg:px-8">
                                <AdminBreadcrumb />
                            </div>
                        </div>
                        <div className="flex-1 flex overflow-hidden">
                            {contextualSidebar && (
                                <aside className="flex-shrink-0 w-[200px] overflow-y-auto border-r border-white/5 bg-slate-900/50 backdrop-blur-sm">
                                    {contextualSidebar}
                                </aside>
                            )}
                            <main className="flex-1 overflow-y-auto bg-transparent">
                                <div className="min-h-full">
                                    {children}
                                </div>
                            </main>
                            {showInspector && inspectorContent && (
                                <aside className="w-80 flex-shrink-0 overflow-y-auto border-l border-white/5 bg-slate-900/50 backdrop-blur-sm">
                                    {inspectorContent}
                                </aside>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
