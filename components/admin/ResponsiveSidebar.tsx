/**
 * Responsive Admin Sidebar
 * 
 * Mobile-friendly sidebar with hamburger menu
 */

'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { Button } from '@/components/ui/Button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ResponsiveSidebarProps {
    children: React.ReactNode;
}

export default function ResponsiveSidebar({ children }: ResponsiveSidebarProps) {
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
        <div className="flex h-screen overflow-hidden">
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

            {/* Sidebar - Hidden on mobile, shown on desktop */}
            <aside
                className={cn(
                    'fixed md:relative z-40 h-screen transform transition-transform duration-300 ease-in-out',
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                )}
                aria-label="Main navigation"
            >
                <AdminSidebar />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden md:ml-0">
                {children}
            </main>
        </div>
    );
}
