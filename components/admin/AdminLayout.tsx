"use client";

import React, { ReactNode, useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeaderNav from './AdminHeaderNav';
import KeyboardShortcuts from './KeyboardShortcuts';
import { AdminBreadcrumb } from './AdminBreadcrumb';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
            <div className="admin-pro-app min-h-screen bg-admin-pro-bg text-admin-pro-text flex flex-col antialiased">
                {/* Mobile menu button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden fixed top-24 left-4 z-50 p-2.5 bg-admin-pro-surface border border-admin-pro-border rounded-lg text-admin-pro-text hover:bg-admin-pro-surface-hover transition-colors"
                    aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMobileMenuOpen}
                >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                {isMobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setIsMobileMenuOpen(false)} aria-hidden="true" />
                )}

                {/* Layer 1: Header Nav – main groups */}
                <AdminHeaderNav />

                {/* Breadcrumb bar below header nav */}
                <div className="sticky top-24 z-20 border-b border-admin-pro-border bg-admin-pro-bg shrink-0">
                    <div className="max-w-[1600px] mx-auto px-4 py-2.5 sm:px-6 lg:px-8">
                        <AdminBreadcrumb />
                    </div>
                </div>

                <div className="grid grid-cols-[auto_1fr] flex-1 overflow-hidden relative z-10">
                    <aside
                        className={cn(
                            'bg-admin-pro-sidebar border-r border-admin-pro-border w-[240px] flex-shrink-0',
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
                        <div className="flex-1 flex overflow-hidden">
                            {contextualSidebar && (
                                <aside className="flex-shrink-0 w-[200px] border-r border-admin-pro-border bg-admin-pro-sidebar/50 overflow-y-auto">
                                    {contextualSidebar}
                                </aside>
                            )}
                            <main className="flex-1 overflow-y-auto bg-admin-pro-bg">
                                <div className="min-h-full">
                                    {children}
                                </div>
                            </main>
                            {showInspector && inspectorContent && (
                                <aside className="w-80 flex-shrink-0 border-l border-admin-pro-border bg-admin-pro-surface overflow-y-auto">
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
