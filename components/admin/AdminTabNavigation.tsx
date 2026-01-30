import React from 'react';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    FileText,
    BarChart3,
    Zap,
    Settings,
    Database,
    TrendingUp,
    Users,
    DollarSign,
    Activity
} from 'lucide-react';

interface Tab {
    id: string;
    label: string;
    icon: React.ElementType;
    description: string;
}

const ADMIN_TABS: Tab[] = [
    {
        id: 'overview',
        label: 'Overview',
        icon: LayoutDashboard,
        description: 'System health & key metrics'
    },
    {
        id: 'content',
        label: 'Content',
        icon: FileText,
        description: 'Articles, drafts & publishing'
    },
    {
        id: 'analytics',
        label: 'Analytics',
        icon: BarChart3,
        description: 'Traffic, engagement & revenue'
    },
    {
        id: 'automation',
        label: 'Automation',
        icon: Zap,
        description: 'Scrapers, AI & workflows'
    }
];

interface AdminTabNavigationProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export default function AdminTabNavigation({ activeTab, onTabChange }: AdminTabNavigationProps) {
    return (
        <div className="border-b border-admin-pro-border bg-admin-pro-bg">
            <div className="max-w-[1600px] mx-auto px-6">
                <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide py-2">
                    {ADMIN_TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={cn(
                                    "flex items-center gap-2.5 px-4 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                                    isActive ? "bg-admin-pro-accent-subtle text-admin-pro-accent" : "text-admin-pro-text-muted hover:text-admin-pro-text hover:bg-admin-pro-surface"
                                )}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
