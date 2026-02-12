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
    { label: 'Settings',         icon: Settings,    href: '/admin/settings',         color: 'text-slate-300' },
];

export default function QuickActions() {
    const router = useRouter();

    return (
        <AdminCard noPadding>
            <div className="px-6 pt-5 pb-3 text-[15px] font-bold text-slate-200">
                Quick Actions
            </div>

            <div className="grid grid-cols-2 gap-2 px-4 pb-4">
                {ACTIONS.map(({ label, icon: Icon, href, color }) => (
                    <button
                        key={href}
                        onClick={() => router.push(href)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-md border border-transparent bg-transparent hover:bg-white/10 hover:border-white/15 cursor-pointer transition-all text-left text-[13px] font-medium text-slate-200"
                    >
                        <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${color}`} />
                        {label}
                    </button>
                ))}
            </div>
        </AdminCard>
    );
}
