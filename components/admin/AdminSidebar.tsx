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
    Zap,
    CheckSquare,
    DollarSign,
    Megaphone,
    Search,
    Rss,
    File,
    BarChart3,
    Activity,
    Package,
    Factory, // Added Factory icon
    FlaskConical,
    Shield,
    Users,
    Sparkles,
    Wallet,
    PlayCircle,
    HeartPulse
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
            { label: 'Pillar Pages', href: '/admin/pillar-pages', icon: File },
            { label: 'Authors', href: '/admin/authors', icon: Users },
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
            { label: 'Content Factory', href: '/admin/content-factory', icon: Factory },
            { label: 'Automation Hub', href: '/admin/automation', icon: Rss },
            { label: 'AI Personas', href: '/admin/ai-personas', icon: Users },
            { label: 'Pipeline Monitor', href: '/admin/pipeline-monitor', icon: Activity },
            { label: 'Review Queue', href: '/admin/review-queue', icon: CheckSquare },
        ],
    },
    {
        title: 'CMS',
        items: [
            { label: 'CMS Dashboard', href: '/admin/cms', icon: Sparkles },
            { label: 'Budget', href: '/admin/cms/budget', icon: Wallet },
            { label: 'Generation', href: '/admin/cms/generation', icon: PlayCircle },
            { label: 'Health', href: '/admin/cms/health', icon: HeartPulse },
            { label: 'Scrapers', href: '/admin/cms/scrapers', icon: Rss },
        ],
    },
    {
        title: 'INSIGHTS',
        items: [
            { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
            { label: 'Metrics', href: '/admin/metrics', icon: Activity },
            { label: 'SEO Health', href: '/admin/seo', icon: Activity },
            { label: 'Experiments', href: '/admin/seo/experiments', icon: FlaskConical },
        ],
    },
    {
        title: 'MONETIZATION',
        items: [
            { label: 'Revenue Dashboard', href: '/admin/revenue', icon: DollarSign },
            { label: 'Product Catalog', href: '/admin/products', icon: Package },
            { label: 'Product Analytics', href: '/admin/product-analytics', icon: BarChart3 },
            { label: 'Affiliates', href: '/admin/affiliates', icon: DollarSign },
            { label: 'Ads', href: '/admin/ads', icon: Megaphone },
        ],
    },
    {
        title: 'SETTINGS',
        items: [
            { label: 'Secure Vault', href: '/admin/settings/vault', icon: Shield },
            { label: 'User Guide', href: '/admin/guide', icon: FileText },
        ],
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <div 
            className={cn(
                "bg-slate-950 text-slate-100 h-screen flex flex-col border-r border-white/5 relative z-50 transition-all duration-300 ease-in-out",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo/Brand Area */}
            <div className={cn("flex items-center gap-3 mb-2 transition-all duration-300", isCollapsed ? "p-4 justify-center" : "p-6")}>
                <Link href="/admin" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 min-w-[40px] rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
                        <Zap className="w-6 h-6 text-white fill-white/20" />
                    </div>
                    <div className={cn("transition-all duration-300 overflow-hidden whitespace-nowrap", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                        <h2 className="font-bold text-lg leading-tight tracking-tight">InvestingP₹o</h2>
                        <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest opacity-80">Authority CMS</p>
                    </div>
                </Link>
            </div>

            {/* Search Bar - Glassmorphic */}
            <div className={cn("mb-6 transition-all duration-300", isCollapsed ? "px-2" : "px-4")}>
                <div className="relative group">
                    <Search className={cn(
                        "absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-400 transition-colors",
                        isCollapsed ? "left-1/2 -translate-x-1/2" : "left-3"
                    )} aria-hidden="true" />
                    <input
                        type="text"
                        placeholder="Quick search..."
                        aria-label="Quick search (Press ⌘K to open global search)"
                        className={cn(
                            "w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-white/10 transition-all duration-300",
                            isCollapsed ? "pl-2 pr-2 text-transparent placeholder-transparent pointer-events-none" : "pl-10 pr-4"
                        )}
                    />
                    {!isCollapsed && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 bg-white/5 border border-white/10 rounded-md">
                                ⌘K
                            </kbd>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Sections */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-6 space-y-8 no-scrollbar" aria-label="Main navigation">
                {navSections.map((section) => (
                    <div key={section.title} className="animate-in fade-in slide-in-from-left-2 duration-500">
                        {!isCollapsed && (
                             <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-3 whitespace-nowrap">
                                {section.title}
                            </h3>
                        )}
                        {/* Divider for collapsed mode */}
                        {isCollapsed && <div className="h-px bg-white/5 my-4 mx-2" />}

                        <ul className="space-y-1.5">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                                
                                return (
                                    <li key={item.href} className="relative group/item">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "group flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500/50",
                                                isCollapsed ? "justify-center px-2" : "px-3",
                                                isActive
                                                    ? "bg-primary-600/10 text-white shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] border border-primary-500/20"
                                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                            )}
                                            aria-label={item.label}
                                            aria-current={isActive ? 'page' : undefined}
                                        >
                                            {/* Active Glow Indicator */}
                                            {isActive && (
                                                <div className={cn("absolute top-1/2 -translate-y-1/2 bg-primary-500 rounded-r-full shadow-[0_0_10px_#10b981]", isCollapsed ? "left-0 w-1 h-2" : "left-0 w-1 h-6")} />
                                            )}
                                            
                                            <Icon className={cn(
                                                "w-5 h-5 transition-transform duration-300 group-hover:scale-110 flex-shrink-0",
                                                isActive ? "text-primary-400" : "text-slate-500 group-hover:text-slate-300"
                                            )} />
                                            
                                            <span className={cn("transition-all duration-300 overflow-hidden whitespace-nowrap", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 flex-1")}>
                                                {item.label}
                                            </span>
                                            
                                            {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                                                <span className="px-2 py-0.5 text-[10px] font-bold bg-primary-500 text-white rounded-full shadow-lg shadow-primary-500/30 animate-pulse">
                                                    {item.badge}
                                                </span>
                                            )}

                                            {/* Tooltip for Collapsed State */}
                                            {isCollapsed && (
                                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover/item:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-[60] shadow-xl border border-white/10">
                                                    {item.label}
                                                </div>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Collapse Toggle Button */}
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="mx-4 mb-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex items-center justify-center border border-white/5 shadow-sm"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
               {isCollapsed ? (
                   <span className="text-xs font-bold">»</span> 
               ) : (
                   <span className="flex items-center gap-2 text-xs font-medium w-full justify-center">
                       « <span className="text-[10px] uppercase tracking-wider">Collapse Sidebar</span>
                   </span>
               )}
            </button>


            {/* Bottom Profile Area */}
            <div className={cn("border-t border-white/5 bg-slate-900/50 backdrop-blur-md transition-all duration-300", isCollapsed ? "p-2" : "p-4")}>
                <div className={cn("flex items-center gap-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group", isCollapsed ? "justify-center p-1" : "p-2")}>
                    <div className="w-10 h-10 min-w-[40px] rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center text-slate-300 text-sm font-bold shadow-inner group-hover:border-primary-500/50 transition-colors">
                        DH
                    </div>
                    <div className={cn("transition-all duration-300 overflow-hidden whitespace-nowrap", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 flex-1")}>
                        <p className="text-sm font-bold text-white truncate">Digital Hustle</p>
                        <p className="text-[10px] text-slate-500 truncate font-medium uppercase tracking-wider">Super Admin</p>
                    </div>
                    {!isCollapsed && <div className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_#10b981]" />}
                </div>
            </div>
        </div>
    );

}
