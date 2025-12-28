"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    FileText,
    Tag,
    Image as ImageIcon,
    LayoutDashboard,
    Calendar,
    Lightbulb,
    Zap,
    CheckSquare,
    DollarSign,
    Megaphone,
    Search,
    Target,
    Rss
} from 'lucide-react';

interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

const navSections: NavSection[] = [
    {
        title: 'CONTENT',
        items: [
            { label: 'Articles', href: '/admin/articles', icon: FileText },
            { label: 'Pillar Pages', href: '/admin/pillar-pages', icon: Target },
            { label: 'Categories', href: '/admin/categories', icon: Tag },
            { label: 'Tags', href: '/admin/tags', icon: Tag },
            { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
        ],
    },
    {
        title: 'PLANNING',
        items: [
            { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
            { label: 'Content Calendar', href: '/admin/content-calendar', icon: Calendar },
        ],
    },
    {
        title: 'AUTOMATION',
        items: [
            { label: 'AI Generator', href: '/admin/ai-generator', icon: Zap },
            { label: 'RSS Feeds', href: '/admin/rss-feeds', icon: Rss },
            { label: 'Review Queue', href: '/admin/review-queue', icon: CheckSquare },
        ],
    },
    {
        title: 'MONETIZATION',
        items: [
            { label: 'Affiliates', href: '/admin/affiliates', icon: DollarSign },
            { label: 'Ads', href: '/admin/ads', icon: Megaphone },
        ],
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-slate-900 text-slate-100 h-screen flex flex-col border-r border-slate-800">
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-800">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <kbd className="px-1.5 py-0.5 text-xs font-semibold text-slate-400 bg-slate-700 border border-slate-600 rounded">
                            ⌘K
                        </kbd>
                    </div>
                </div>
            </div>

            {/* Navigation Sections */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {navSections.map((section) => (
                    <div key={section.title}>
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                            {section.title}
                        </h3>
                        <ul className="space-y-1">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                                
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-teal-600 text-white"
                                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                            )}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="flex-1">{item.label}</span>
                                            {item.badge !== undefined && item.badge > 0 && (
                                                <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Bottom Icon */}
            <div className="p-4 border-t border-slate-800">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-lg font-semibold">
                    N
                </div>
            </div>
        </div>
    );
}
