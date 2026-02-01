'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbs } from '@/lib/admin/navigation-config';

export function AdminBreadcrumb() {
    const pathname = usePathname();
    
    if (!pathname) return null;
    
    const items = generateBreadcrumbs(pathname);

    if (items.length <= 1) return null;

    return (
        <nav className="flex items-center gap-2 text-sm text-wt-text-muted" aria-label="Breadcrumb">
            <Link href="/admin" className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-wt-surface-hover hover:text-wt-nav transition-colors" aria-label="Dashboard">
                <Home className="w-4 h-4" />
            </Link>
            {items.slice(1).map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-wt-text-dim shrink-0" aria-hidden />
                    {item.href ? (
                        <Link href={item.href} className="hover:text-wt-nav transition-colors truncate max-w-[180px] sm:max-w-none">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-wt-text font-medium truncate max-w-[180px] sm:max-w-none">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
