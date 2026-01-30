import React from 'react';
import { cn } from '@/lib/utils';
import {
    Activity,
    TrendingUp,
    AlertCircle,
    Database,
    FileText,
    Clock,
    CheckCircle,
    BarChart3,
    DollarSign,
    Users,
    Zap,
    Play,
    Settings
} from 'lucide-react';

interface ContextualSidebarProps {
    activeTab?: string;
    onNavigate?: (section: string) => void;
}

const SIDEBAR_SECTIONS = {
    overview: [
        { id: 'quick-stats', label: 'Quick Stats', icon: Activity },
        { id: 'system-health', label: 'System Health', icon: AlertCircle },
        { id: 'recent-activity', label: 'Recent Activity', icon: Clock },
        { id: 'alerts', label: 'Alerts', icon: AlertCircle }
    ],
    content: [
        { id: 'all-articles', label: 'All Articles', icon: FileText },
        { id: 'drafts', label: 'Drafts', icon: Clock },
        { id: 'scheduled', label: 'Scheduled', icon: Clock },
        { id: 'published', label: 'Published', icon: CheckCircle },
        { id: 'archived', label: 'Archived', icon: Database }
    ],
    analytics: [
        { id: 'traffic', label: 'Traffic Overview', icon: TrendingUp },
        { id: 'engagement', label: 'Engagement', icon: Users },
        { id: 'revenue', label: 'Revenue', icon: DollarSign },
        { id: 'seo', label: 'SEO Performance', icon: BarChart3 },
        { id: 'social', label: 'Social Metrics', icon: Users }
    ],
    automation: [
        { id: 'scrapers', label: 'Data Scrapers', icon: Database },
        { id: 'ai-tasks', label: 'AI Tasks', icon: Zap },
        { id: 'cron-jobs', label: 'Cron Jobs', icon: Clock },
        { id: 'workflows', label: 'Workflows', icon: Play },
        { id: 'settings', label: 'Settings', icon: Settings }
    ]
};

export default function AdminContextualSidebar({ activeTab = 'overview', onNavigate }: ContextualSidebarProps) {
    const sections = SIDEBAR_SECTIONS[activeTab as keyof typeof SIDEBAR_SECTIONS] || SIDEBAR_SECTIONS.overview;
    const [activeSection, setActiveSection] = React.useState(sections[0]?.id);

    const handleNavigate = (sectionId: string) => {
        setActiveSection(sectionId);
        onNavigate?.(sectionId);
        
        // Scroll to section
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="h-full overflow-y-auto py-4 px-3 border-r border-admin-pro-border bg-admin-pro-sidebar/50">
            <p className="text-[11px] font-medium text-admin-pro-text-muted uppercase tracking-wider mb-3 px-2">
                On this page
            </p>
            <div className="space-y-0.5">
                {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                        <button
                            key={section.id}
                            onClick={() => handleNavigate(section.id)}
                            className={cn(
                                "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left",
                                isActive ? "bg-admin-pro-accent-subtle text-admin-pro-accent" : "text-admin-pro-text-muted hover:text-admin-pro-text hover:bg-admin-pro-surface"
                            )}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{section.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
