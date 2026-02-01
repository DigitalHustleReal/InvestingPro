"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ExternalLink, Settings, LogOut, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { CATEGORIES, getActiveCategory } from '@/lib/admin/navigation-config';
import Logo from '@/components/common/Logo';

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
      className="sticky top-0 z-50 w-full h-14 flex items-center border-b border-white/10 bg-wt-nav shadow-md"
      role="banner"
    >
      <div className="relative flex items-center justify-between w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo + full site title + CMS badge – Wealth & Trust */}
        <div className="flex items-center gap-2.5 shrink-0 min-w-0">
          <Logo href="/admin" variant="dark" size="md" showText={false} />
          <span className="text-base font-semibold text-white tracking-tight whitespace-nowrap">
            InvestingPro
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-wt-gold/25 text-wt-gold border border-wt-gold/40 shrink-0">
            CMS
          </span>
        </div>

        {/* Main navigation – center-aligned, text only, gold active */}
        <nav
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 overflow-x-auto scrollbar-none max-w-[60%] py-1"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-0.5">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <Link
                  key={category.id}
                  href={category.defaultPath}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0",
                    isActive
                      ? "bg-wt-gold-subtle text-wt-gold font-semibold"
                      : "text-white/85 hover:text-white hover:bg-white/10"
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {category.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* View site + Account */}
        <div className="flex items-center gap-1 shrink-0">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white/85 hover:text-wt-gold hover:bg-white/10 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">View site</span>
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/85 hover:text-white hover:bg-white/10 transition-colors"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              aria-label="User menu"
            >
              <span className="hidden sm:inline">Account</span>
              <ChevronDown className={cn('h-4 w-4 transition-transform', userMenuOpen && 'rotate-180')} />
            </button>

            {userMenuOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-wt-border bg-wt-surface py-1.5 shadow-lg z-50"
                role="menu"
              >
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-wt-text hover:bg-wt-surface-hover hover:text-wt-nav transition-colors"
                  role="menuitem"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-wt-text hover:bg-wt-surface-hover hover:text-wt-danger transition-colors text-left"
                  role="menuitem"
                  onClick={handleSignOut}
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
