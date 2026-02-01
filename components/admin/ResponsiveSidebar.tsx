/**
 * Responsive Admin Sidebar Wrapper
 * 
 * Makes AdminSidebar responsive with hamburger menu for mobile
 */

'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ResponsiveSidebarProps {
    children: React.ReactNode;
}

export function MobileMenuButton({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="md:hidden fixed top-4 left-4 z-50 p-2 bg-surface-darker dark:bg-surface-darker border border-wt-border dark:border-wt-border rounded-lg text-wt-text dark:text-wt-text hover:bg-muted dark:bg-muted transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
        >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
    );
}

export function MobileMenuOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;

    return (
        <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
            aria-hidden="true"
        />
    );
}

/**
 * Responsive wrapper that adds mobile menu to existing layout
 * Use this to wrap AdminLayout content
 */
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
            {/* Mobile Menu Button */}
            <MobileMenuButton
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />

            {/* Mobile Overlay */}
            <MobileMenuOverlay
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            {/* Inject mobile menu toggle into children via context or render prop */}
            {React.cloneElement(children as React.ReactElement, {
                mobileMenuOpen: isMobileMenuOpen,
                onMobileMenuToggle: () => setIsMobileMenuOpen(!isMobileMenuOpen),
            })}
        </>
    );
}
