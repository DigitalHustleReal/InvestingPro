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
    Rss,
    File,
    BarChart3,
    Activity,
    Package
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
            { label: 'Pages', href: '/admin/pages', icon: File },
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
            { label: 'Content Factory', href: '/admin/content-factory', icon: Zap },
            { label: 'RSS Feeds', href: '/admin/rss-feeds', icon: Rss },
            { label: 'Review Queue', href: '/admin/review-queue', icon: CheckSquare },
        ],
    },
    {
        title: 'INSIGHTS',
        items: [
            { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
            { label: 'SEO Health', href: '/admin/seo', icon: Activity },
        ],
    },
    {
        title: 'MONETIZATION',
        items: [
            { label: 'Product Catalog', href: '/admin/products', icon: Package },
            { label: 'Affiliates', href: '/admin/affiliates', icon: DollarSign },
            { label: 'Ads', href: '/admin/ads', icon: Megaphone },
        ],
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-slate-950 text-slate-100 h-screen flex flex-col border-r border-white/5 relative z-50">
            {/* Logo/Brand Area */}
            <div className="p-6 mb-2">
                <Link href="/admin" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                        <Zap className="w-6 h-6 text-white fill-white/20" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg leading-tight tracking-tight">InvestingPro</h2>
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest opacity-80">Authority CMS</p>
                    </div>
                </Link>
            </div>

            {/* Search Bar - Glassmorphic */}
            <div className="px-4 mb-6">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Quick search..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 transition-all duration-300"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 bg-white/5 border border-white/10 rounded-md">
                            ⌘K
                        </kbd>
                    </div>
                </div>
            </div>

            {/* Navigation Sections */}
            <nav className="flex-1 overflow-y-auto px-4 pb-6 space-y-8 no-scrollbar">
                {navSections.map((section) => (
                    <div key={section.title} className="animate-in fade-in slide-in-from-left-2 duration-500">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-3">
                            {section.title}
                        </h3>
                        <ul className="space-y-1.5">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                                
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
                                                isActive
                                                    ? "bg-indigo-600/10 text-white shadow-[inset_0_0_20px_rgba(79,70,229,0.1)] border border-indigo-500/20"
                                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            {/* Active Glow Indicator */}
                                            {isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_10px_#6366f1]" />
                                            )}
                                            
                                            <Icon className={cn(
                                                "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                                                isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                                            )} />
                                            <span className="flex-1">{item.label}</span>
                                            
                                            {item.badge !== undefined && item.badge > 0 && (
                                                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/30 animate-pulse">
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

            {/* Bottom Profile Area */}
            <div className="p-4 border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center text-slate-300 text-sm font-bold shadow-inner group-hover:border-indigo-500/50 transition-colors">
                        JD
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">John Doe</p>
                        <p className="text-[10px] text-slate-500 truncate font-medium uppercase tracking-wider">Super Admin</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_#10b981]" />
                </div>
            </div>
        </div>
    );
}
