"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ExternalLink, Settings, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { CATEGORIES, getActiveCategory } from '@/lib/admin/navigation-config';
import Logo from '@/components/common/Logo';
import { cn } from '@/lib/utils';

export default function AdminTopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const activeCategory = getActiveCategory(pathname);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <header
      data-admin-header
      role="banner"
      className="sticky top-0 z-50 w-full h-14 flex items-center border-b border-white/10 bg-slate-900/95 backdrop-blur-md shadow-lg"
    >
      <div className="relative flex items-center justify-between w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo + full site title + CMS badge */}
        <div className="flex items-center gap-2.5 shrink-0 min-w-0">
          <Logo href="/admin" variant="dark" size="md" showText={false} />
          <span className="text-base font-semibold text-slate-900 tracking-tight whitespace-nowrap">
            InvestingPro
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider shrink-0 bg-amber-500/20 text-amber-700 border border-amber-600/40">
            CMS
          </span>
        </div>

        {/* Main navigation – center-aligned */}
        <nav
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 overflow-x-auto scrollbar-none max-w-[60%] py-1"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-1">
            {CATEGORIES.map((category) => (
              <TopNavLink 
                key={category.id} 
                href={category.defaultPath} 
                active={activeCategory === category.id}
                label={category.label}
              />
            ))}
          </div>
        </nav>

        {/* View site + Account */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200/50 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">View site</span>
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-700 border-none cursor-pointer transition-colors",
                userMenuOpen ? "bg-slate-200/70" : "bg-transparent hover:bg-slate-200/50"
              )}
              aria-expanded={userMenuOpen}
            >
              <span className="hidden sm:inline">Account</span>
              <Settings className="h-4 w-4" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-[200px] bg-slate-900/95 backdrop-blur-md rounded-md shadow-xl border border-white/10 p-1 z-[100]">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 bg-transparent hover:bg-rose-100 border-none rounded-sm cursor-pointer text-left transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Helper component for navigation links
function TopNavLink({ href, active, label }: { href: string, active: boolean, label: string }) {
    return (
        <Link
            href={href}
            className={cn(
                "inline-flex items-center px-3 py-2 rounded-md text-sm whitespace-nowrap transition-all no-underline",
                active 
                    ? "font-semibold text-amber-700 bg-amber-500/20" 
                    : "font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200/50"
            )}
        >
            {label}
        </Link>
    );
}
