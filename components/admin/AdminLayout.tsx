"use client";

import React, { ReactNode, useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import KeyboardShortcuts from './KeyboardShortcuts';
import { AdminBreadcrumb } from './AdminBreadcrumb';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
    children: ReactNode;
    contextualSidebar?: ReactNode;
    showInspector?: boolean;
    inspectorContent?: ReactNode;
    onInspectorClose?: () => void;
}

/**
 * AdminLayout - Two-layer navigation:
 * - Layer 1: Header Nav (main groups) â€“ Content, Automation, Pipeline, Insights, etc.
 * - Layer 2: Contextual sidebar â€“ sections/links for the active group only.
 * Optional: right contextual sidebar (e.g. "On this page") and inspector panel.
 */
export default function AdminLayout({ 
    children, 
    contextualSidebar,
    showInspector = false,
    inspectorContent,
    onInspectorClose
}: AdminLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Resizable Inspector State
    const [inspectorWidth, setInspectorWidth] = useState(380); // Default to slightly wider for better density
    const [isResizing, setIsResizing] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Initial mobile check and listener
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024); // lg breakpoint
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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

    // Load persisted width
    useEffect(() => {
        const savedWidth = localStorage.getItem('admin_inspector_width');
        if (savedWidth) setInspectorWidth(Number(savedWidth));
    }, []);

    // Resize handlers
    const startResizing = React.useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    }, []);

    const stopResizing = React.useCallback(() => {
        setIsResizing(false);
        localStorage.setItem('admin_inspector_width', String(inspectorWidth));
    }, [inspectorWidth]);

    const resize = React.useCallback((e: MouseEvent) => {
        if (isResizing) {
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth > 280 && newWidth < 800) { // Min 280px, Max 800px
                setInspectorWidth(newWidth);
            }
        }
    }, [isResizing]);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResizing);
        } else {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        }
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isResizing, resize, stopResizing]);

    return (
        <>
            <KeyboardShortcuts />
            <div className={`min-h-screen flex flex-col antialiased bg-background text-foreground font-sans selection:bg-primary/30 ${isResizing ? 'cursor-col-resize select-none' : ''}`}>
                {/* Mobile menu button â€“ Wealth & Trust */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden fixed top-[3.25rem] left-4 z-50 p-3 rounded-lg transition-colors shadow-sm bg-card/90 border border-border text-foreground backdrop-blur-md active:scale-95 touch-none"
                    aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMobileMenuOpen}
                >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                {isMobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
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
                        <div className="sticky top-14 z-20 shrink-0 border-b border-border bg-card/80 backdrop-blur-md">
                            <div className="max-w-[1600px] mx-auto px-4 py-3 sm:px-6 lg:px-8">
                                <AdminBreadcrumb />
                            </div>
                        </div>
                        <div className="flex-1 flex overflow-hidden relative">
                            {contextualSidebar && (
                                <aside className="flex-shrink-0 w-[200px] overflow-y-auto border-r border-border bg-card/50 backdrop-blur-sm hidden xl:block">
                                    {contextualSidebar}
                                </aside>
                            )}
                            <main className="flex-1 overflow-y-auto bg-transparent min-w-0">
                                <div className="min-h-full">
                                    {children}
                                </div>
                            </main>
                            
                            {/* Resize Handle (Desktop Only) */}
                            {showInspector && inspectorContent && !isMobile && (
                                <div
                                    className={cn(
                                        "w-1 cursor-col-resize hover:bg-info/50 transition-colors z-20 flex-shrink-0",
                                        isResizing ? "bg-info" : "bg-transparent"
                                    )}
                                    onMouseDown={startResizing}
                                />
                            )}
                            
                            {/* Overlay Backdrop for Mobile */}
                            {showInspector && isMobile && (
                                <div 
                                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                                    onClick={onInspectorClose}
                                />
                            )}

                            {/* Inspector Panel */}
                            {showInspector && inspectorContent && (
                                <aside 
                                    style={{ width: isMobile ? '85%' : `${inspectorWidth}px` }}
                                    className={cn(
                                        "flex-shrink-0 overflow-y-auto border-l border-border bg-card transition-all duration-75",
                                        isMobile ? "fixed inset-y-0 right-0 z-50 bg-card shadow-2xl" : "relative"
                                    )}
                                >
                                    {isMobile && onInspectorClose && (
                                        <button 
                                            onClick={onInspectorClose}
                                            className="absolute top-4 right-4 z-50 p-2 text-muted-foreground hover:text-foreground bg-muted rounded-full"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
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
