'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Calculator, BookOpen, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ITEMS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Compare', href: '/compare', icon: Search },
  { label: 'Tools', href: '/calculators', icon: Calculator },
  { label: 'Learn', href: '/articles', icon: BookOpen },
  { label: 'Account', href: '/profile', icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-200 z-50 flex pb-[env(safe-area-inset-bottom)]"
      role="navigation"
      aria-label="Mobile navigation"
    >
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[9px] font-medium transition-colors ${
              isActive ? 'text-green-600 font-semibold' : 'text-gray-400'
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
