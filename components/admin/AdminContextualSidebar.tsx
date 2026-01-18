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
    activeTab: string;
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

export default function AdminContextualSidebar({ activeTab, onNavigate }: ContextualSidebarProps) {
    const sections = SIDEBAR_SECTIONS[activeTab as keyof typeof SIDEBAR_SECTIONS] || [];
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
        <div className="sticky top-[120px] h-[calc(100vh-120px)] overflow-y-auto bg-slate-950/50 border-r border-white/5 p-6">
            <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
                    {activeTab} Sections
                </div>
                {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    
                    return (
                        <button
                            key={section.id}
                            onClick={() => handleNavigate(section.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                                isActive
                                    ? "bg-primary-500/10 text-primary-400 border border-primary-500/20"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{section.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
