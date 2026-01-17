"use client";

import React, { ReactNode, useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import GlobalSearch from './GlobalSearch';
import KeyboardShortcuts from './KeyboardShortcuts';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
 * - Left: CMS Navigation Sidebar (AdminSidebar) - Responsive with mobile menu
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
            {/* Global Search (Cmd+K) */}
            <GlobalSearch />
            
            {/* Keyboard Shortcuts Handler */}
            <KeyboardShortcuts />
            
            <div className="min-h-screen bg-surface-darkest flex overflow-hidden relative">
                {/* Background Mesh Gradients for Premium feel */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/5 blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/5 blur-[120px]" />
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 border border-white/10 rounded-lg text-white hover:bg-slate-800 transition-colors"
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

                {/* CMS Navigation Sidebar (Left) - Responsive */}
                <aside
                    className={cn(
                        'fixed md:relative z-40 h-screen transform transition-transform duration-300 ease-in-out',
                        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    )}
                    aria-label="Main navigation"
                >
                    <AdminSidebar />
                </aside>

                {/* Middle + Content + Inspector Area */}
                <div className="flex-1 flex overflow-hidden relative z-10 md:ml-0">
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
        </>
    );
}
