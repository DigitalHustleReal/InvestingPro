"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
    ShoppingBag,
    BarChart3,
    Settings,
    FileText,
    Wand2,
    Users,
    type LucideIcon,
} from 'lucide-react';
import { AdminCard } from '@/components/admin/system/AdminCard';
import { cn } from '@/lib/utils';

interface QuickAction {
    label: string;
    icon: LucideIcon;
    href: string;
    color: string;
}

const ACTIONS: QuickAction[] = [
    { label: 'Manage Products',  icon: ShoppingBag, href: '/admin/products',        color: 'text-blue-400' },
    { label: 'Analytics',        icon: BarChart3,   href: '/admin/analytics',        color: 'text-emerald-400' },
    { label: 'Content Factory',  icon: Wand2,       href: '/admin/content-factory',  color: 'text-amber-400' },
    { label: 'Authors',          icon: Users,        href: '/admin/authors',          color: 'text-purple-400' },
    { label: 'Articles',         icon: FileText,    href: '/admin/articles',         color: 'text-orange-400' },
    { label: 'Settings',         icon: Settings,    href: '/admin/settings',         color: 'text-gray-300' },
];

export default function QuickActions() {
    const router = useRouter();

    return (
        <AdminCard noPadding glass className="h-full animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
            <div className="px-6 pt-5 pb-3 text-[15px] font-bold text-white uppercase tracking-wider">
                Quick Actions
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-3 px-4 pb-6">
                {ACTIONS.map(({ label, icon: Icon, href, color }) => (
                    <button
                        key={href}
                        onClick={() => router.push(href)}
                        className="flex items-center gap-3 px-4 py-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-primary/5 transition-all text-left group/btn"
                    >
                        <div className={cn(
                            "p-2.5 rounded-lg bg-white/5 group-hover/btn:scale-110 transition-transform flex-shrink-0",
                            color.replace('text-', 'bg-').replace('-400', '-500/10')
                        )}>
                            <Icon className={cn("w-5 h-5", color)} />
                        </div>
                        <span className="text-[14px] font-bold text-gray-200 group-hover/btn:text-white transition-colors truncate">
                            {label}
                        </span>
                    </button>
                ))}
            </div>
        </AdminCard>
    );
}
