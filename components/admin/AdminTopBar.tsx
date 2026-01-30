"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, ExternalLink, Settings, LogOut, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

/**
 * Product name: integrated = site name; standalone = env or "Pro CMS".
 * NEXT_PUBLIC_CMS_PRODUCT_NAME = CMS-only; NEXT_PUBLIC_APP_NAME = site name.
 */
const ADMIN_PRODUCT_NAME =
  (typeof process.env.NEXT_PUBLIC_CMS_PRODUCT_NAME === 'string' && process.env.NEXT_PUBLIC_CMS_PRODUCT_NAME) ||
  (typeof process.env.NEXT_PUBLIC_APP_NAME === 'string' && process.env.NEXT_PUBLIC_APP_NAME) ||
  'InvestingPro';

export default function AdminTopBar() {
  const router = useRouter();
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
      className="sticky top-0 z-50 w-full h-14 flex items-center border-b border-admin-pro-border bg-admin-pro-sidebar px-4 sm:px-6 lg:px-8"
      role="banner"
    >
      <div className="flex flex-1 items-center justify-between">
        {/* Logo + product name → Dashboard */}
        <Link
          href="/admin"
          className="flex items-center gap-3 text-admin-pro-text hover:text-admin-pro-text no-underline"
          aria-label={`${ADMIN_PRODUCT_NAME} – Dashboard`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-admin-pro-accent text-white">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span className="font-semibold text-sm tracking-tight hidden sm:inline">{ADMIN_PRODUCT_NAME}</span>
          <span className="text-xs text-admin-pro-text-muted hidden md:inline">CMS</span>
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-admin-pro-text-muted hover:text-admin-pro-text hover:bg-admin-pro-surface transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">View site</span>
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-admin-pro-text-muted hover:text-admin-pro-text hover:bg-admin-pro-surface transition-colors"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              aria-label="User menu"
            >
              <span className="hidden sm:inline">Account</span>
              <ChevronDown className={cn('h-4 w-4 transition-transform', userMenuOpen && 'rotate-180')} />
            </button>

            {userMenuOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-admin-pro-border bg-admin-pro-surface py-1 shadow-xl z-50"
                role="menu"
              >
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-admin-pro-text hover:bg-admin-pro-surface-hover"
                  role="menuitem"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-admin-pro-text hover:bg-admin-pro-surface-hover text-left"
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
