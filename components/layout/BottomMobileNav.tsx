"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Calculator, BookOpen, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
    exact: true,
  },
  {
    label: 'Compare',
    href: '/credit-cards',
    icon: Search,
    exact: false,
    matchPaths: ['/credit-cards', '/loans', '/mutual-funds', '/demat-accounts', '/fixed-deposits', '/insurance'],
  },
  {
    label: 'Tools',
    href: '/calculators',
    icon: Calculator,
    exact: false,
  },
  {
    label: 'Learn',
    href: '/blog',
    icon: BookOpen,
    exact: false,
  },
  {
    label: 'Account',
    href: '/profile',
    icon: User,
    exact: false,
    matchPaths: ['/profile', '/login', '/signup'],
  },
] as const;

export default function BottomMobileNav() {
  const pathname = usePathname();

  // Hide on admin pages and auth pages that have their own nav
  if (pathname?.startsWith('/admin')) return null;

  function isActive(item: (typeof NAV_ITEMS)[number]) {
    if (item.exact) return pathname === item.href;
    if ('matchPaths' in item && item.matchPaths) {
      return item.matchPaths.some((p) => pathname?.startsWith(p));
    }
    return pathname?.startsWith(item.href) ?? false;
  }

  return (
    <nav
      className={cn(
        // Only visible on mobile, hidden on md+
        "fixed bottom-0 inset-x-0 z-50 md:hidden",
        // Safe area for notched phones
        "pb-safe",
        // Light mode surface
        "bg-white/95 backdrop-blur-xl border-t border-slate-200",
        // Dark mode surface
        "dark:bg-[#0A1F14]/95 dark:border-green-900/40"
      )}
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full",
                "text-xs font-medium transition-colors duration-200",
                "min-w-0 rounded-xl py-1",
                active
                  ? "text-primary dark:text-green-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              )}
              aria-current={active ? 'page' : undefined}
            >
              <div
                className={cn(
                  "relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200",
                  active
                    ? "bg-primary-pale dark:bg-green-900/50"
                    : "bg-transparent"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    active ? "scale-110" : "scale-100"
                  )}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                {/* Active dot indicator */}
                {active && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary dark:bg-green-400" />
                )}
              </div>
              <span className={cn("truncate", active ? "font-semibold" : "font-normal")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
