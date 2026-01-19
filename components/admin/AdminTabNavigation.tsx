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
        <div className="sticky top-0 z-40 bg-surface-darkest/95 dark:bg-surface-darkest/95 backdrop-blur-lg border-b border-border dark:border-border">
            <div className="max-w-[1920px] mx-auto px-8">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    {ADMIN_TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={cn(
                                    "group relative flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap",
                                    "border-b-2 -mb-[2px]",
                                    isActive
                                        ? "text-primary-400 border-primary-500"
                                        : "text-muted-foreground dark:text-muted-foreground border-transparent hover:text-foreground dark:text-foreground hover:border-border/80 dark:border-border/80"
                                )}
                            >
                                <Icon className={cn(
                                    "w-4 h-4 transition-transform",
                                    isActive && "scale-110"
                                )} />
                                <div className="flex flex-col items-start">
                                    <span className="font-bold">{tab.label}</span>
                                    <span className={cn(
                                        "text-[10px] uppercase tracking-wider transition-opacity",
                                        isActive ? "text-primary-400/70" : "text-muted-foreground/70 dark:text-muted-foreground/70 group-hover:text-muted-foreground dark:text-muted-foreground"
                                    )}>
                                        {tab.description}
                                    </span>
                                </div>
                                
                                {/* Active indicator glow */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-primary-500/5 rounded-t-lg" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
