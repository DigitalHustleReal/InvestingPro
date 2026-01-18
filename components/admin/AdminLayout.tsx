"use client";

import React, { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import AdminCategoryHeaderNav, { getCategoryFromPath } from './AdminCategoryHeaderNav';
import KeyboardShortcuts from './KeyboardShortcuts';
import { AdminBreadcrumb } from './AdminBreadcrumb';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
    children: ReactNode;
    contextualSidebar?: ReactNode;
    showInspector?: boolean;
    inspectorContent?: ReactNode;
    showCategoryNav?: boolean; // Show main category header nav (default: true)
}

/**
 * AdminLayout - Main layout component for admin pages
 * 
 * Provides a layout with:
 * - Left: CMS Navigation Sidebar (AdminSidebar) - Responsive with mobile menu
 * - Middle: Contextual sidebar (optional, for Analyze dashboard)
 * - Center: Main content area
 * - Right: Inspector panel (optional, for entity editing)
 */
export default function AdminLayout({ 
    children, 
    contextualSidebar,
    showInspector = false,
    inspectorContent,
    showCategoryNav = true
}: AdminLayoutProps) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const activeCategory = getCategoryFromPath(pathname);

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
            {/* Keyboard Shortcuts Handler */}
            <KeyboardShortcuts />
            
            <div className="min-h-screen bg-surface-darkest flex flex-col">
                {/* Background Mesh Gradients for Premium feel */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/5 blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/5 blur-[120px]" />
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden fixed top-20 left-4 z-50 p-2 bg-slate-900 border border-white/10 rounded-lg text-white hover:bg-slate-800 transition-colors"
                    aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMobileMenuOpen}
                >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                {/* Mobile Overlay */}
                {isMobileMenuOpen && (
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-hidden="true"
                    />
                )}

                {/* Main Category Header Navigation - Top of admin area */}
                {showCategoryNav && (
                    <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-lg border-b border-white/10 relative">
                        <AdminCategoryHeaderNav activeCategory={activeCategory} />
                    </div>
                )}

                {/* Main Layout: Sidebar + Content - Using CSS Grid for predictable layout */}
                <div className="grid grid-cols-[auto_1fr] flex-1 overflow-hidden relative z-10">
                    {/* CMS Navigation Sidebar (Left) - Starts below header nav - Thin & Collapsible */}
                    <aside
                        className={cn(
                            'bg-slate-950 border-r border-white/5',
                            // Mobile: fixed overlay
                            'fixed md:relative z-40',
                            // Mobile transform
                            'transition-all duration-300 ease-in-out md:transition-none',
                            'h-[calc(100vh-64px)] md:h-full',
                            // Grid column size: auto (sized by content)
                            'col-span-1',
                            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                        )}
                        aria-label="Main navigation"
                    >
                        <AdminSidebar activeCategory={activeCategory} />
                    </aside>

                    {/* Content Area with Inspector */}
                    <div className="col-span-1 flex flex-col overflow-hidden min-w-0">
                        {/* Content Area with Contextual Sidebar */}
                        <div className="flex-1 flex overflow-hidden">
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
                </div>
            </div>
        </>
    );
}
