"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCategorySections, getActiveCategory, type NavItem } from '@/lib/admin/navigation-config';
import { cn } from '@/lib/utils';

/**
 * Contextual sidebar (Layer 2): Shows sections for the active main group from Header Nav.
 * Modernized with Glassmorphism.
 */
export default function AdminSidebar() {
    const pathname = usePathname();
    const activeCategory = getActiveCategory(pathname);
    const navSections = getCategorySections(activeCategory);

    return (
        <div className="h-full flex flex-col pt-5 pb-5 backdrop-blur-xl bg-slate-900/95 border-r border-white/5 transition-all duration-300">
            <nav className="flex-1 overflow-y-auto px-3" aria-label="Main navigation">
                {navSections.map((section, sectionIndex) => (
                    <div key={section.title} className="mb-6">
                        {sectionIndex > 0 && (
                            <div className="mb-3 mt-1 border-t border-white/5" aria-hidden="true" />
                        )}
                        <h3 className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2.5 pl-3 font-inter">
                            {section.title}
                        </h3>
                        <ul className="flex flex-col gap-0.5">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                                return (
                                    <li key={item.href}>
                                        <SidebarLink 
                                            item={item} 
                                            isActive={isActive} 
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>
            <div className="mt-auto border-t border-white/5 pt-4 px-3 pb-2">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-all font-inter">
                        DH
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-200 m-0 font-inter group-hover:text-white transition-colors">
                            Digital Hustle
                        </p>
                        <p className="text-[11px] text-slate-300 m-0 font-inter">
                            Super Admin
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Separate component for hover state handling
function SidebarLink({ item, isActive }: { item: NavItem, isActive: boolean }) {
    const Icon = item.icon;
    return (
        <Link 
            href={item.href}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative font-inter",
                isActive 
                    ? "text-white bg-gradient-to-r from-blue-600/20 to-blue-600/5 border-l-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]" 
                    : "text-slate-300 hover:text-slate-100 hover:bg-white/5 hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]"
            )}
        >
            {isActive && (
                <div className="absolute inset-0 bg-blue-500/5 rounded-lg blur-xl opacity-50" />
            )}
            <Icon className={cn(
                "w-4 h-4 transition-colors relative z-10",
                isActive ? "text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]" : "text-slate-400 group-hover:text-slate-300"
            )} />
            <span className="relative z-10">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
                <span className={cn(
                    "ml-auto text-[10px] px-1.5 py-0.5 rounded-full relative z-10 transition-colors",
                    isActive ? "bg-blue-500/20 text-blue-300" : "bg-slate-800 text-slate-300"
                )}>
                    {item.badge}
                </span>
            )}
        </Link>
    );
}
