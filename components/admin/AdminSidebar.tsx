"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getCategorySections, getActiveCategory } from '@/lib/admin/navigation-config';

/**
 * Contextual sidebar (Layer 2): Shows sections for the active main group from Header Nav.
 */
export default function AdminSidebar() {
    const pathname = usePathname();
    const activeCategory = getActiveCategory(pathname);
    const navSections = getCategorySections(activeCategory);

    return (
        <div className="h-full flex flex-col py-5">
            <nav className="flex-1 overflow-y-auto px-3 space-y-7" aria-label="Main navigation">
                {navSections.map((section, sectionIndex) => (
                    <div key={section.title}>
                        {sectionIndex > 0 && (
                            <div className="mb-3 mt-1 border-t border-wt-border" aria-hidden="true" />
                        )}
                        <h3 className="text-[11px] font-semibold text-wt-text-muted uppercase tracking-wider mb-2.5 px-3">
                            {section.title}
                        </h3>
                        <ul className="space-y-0.5">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-wt-gold-subtle text-wt-nav border-l-2 border-wt-gold -ml-px pl-[11px]"
                                                    : "text-wt-text-muted hover:text-wt-text hover:bg-wt-surface-hover"
                                            )}
                                            aria-label={item.label}
                                            aria-current={isActive ? 'page' : undefined}
                                        >
                                            <Icon className="w-4 h-4 shrink-0" />
                                            <span className="truncate">{item.label}</span>
                                            {item.badge !== undefined && item.badge > 0 && (
                                                <span className="ml-auto text-xs font-medium text-wt-text-muted tabular-nums">{item.badge}</span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>
            <div className="mt-auto border-t border-wt-border pt-4 px-3 pb-2">
                <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-wt-card border border-wt-border">
                    <div className="w-9 h-9 rounded-lg bg-wt-nav flex items-center justify-center text-white text-xs font-semibold shrink-0">
                        DH
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-wt-text truncate">Digital Hustle</p>
                        <p className="text-[11px] text-wt-text-muted truncate">Super Admin</p>
                    </div>
                </div>
            </div>
        </div>
    );

}
