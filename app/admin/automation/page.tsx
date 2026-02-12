"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageContainer from '@/components/admin/AdminPageContainer';
import AutomationControls from '@/components/admin/AutomationControls';
import { 
    CheckCircle2, XCircle, Clock, Zap, Rss, Play, 
    FileText, Calendar, BarChart3, Sparkles, Flame 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { StatCard, ContentSection } from '@/components/admin/AdminUIKit';
import Link from 'next/link';
import { ADMIN_THEME } from '@/lib/admin/theme';
import { cn } from '@/lib/utils';
import { ActionButton } from '@/components/admin/AdminUIKit';

export default function AutomationPage() {
    const { data: pipelineStatus = { completed: 0, failed: 0, lastRun: null } } = useQuery({
        queryKey: ['pipeline-status-summary'],
        queryFn: async () => {
            const response = await fetch('/api/pipeline/runs?limit=100');
            if (!response.ok) return { completed: 0, failed: 0 };
            const data = await response.json();
            const runs = data.runs || [];
            return {
                completed: runs.filter((r: any) => r.status === 'completed').length,
                failed: runs.filter((r: any) => r.status === 'failed').length,
                lastRun: runs[0]?.started_at
            };
        },
        refetchInterval: 30000
    });

    return (
        <AdminLayout>
            <div className="p-8 space-y-8 max-w-7xl mx-auto">
                {/* Hero / Header Section */}
                <div 
                    className="relative overflow-hidden shadow-2xl transition-all duration-500"
                    style={{ 
                        borderRadius: ADMIN_THEME.radius.xl,
                        padding: ADMIN_THEME.spacing[8],
                        background: `linear-gradient(135deg, ${ADMIN_THEME.colors.primary[900]} 0%, ${ADMIN_THEME.colors.primary[800]} 100%)`,
                        border: `1px solid ${ADMIN_THEME.colors.primary[700]}`
                    }}
                >
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full blur-3xl opacity-20" style={{ backgroundColor: ADMIN_THEME.colors.accent.default }} />
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="p-4 rounded-2xl bg-wt-gold/10 border border-wt-gold/20">
                                <Zap className="w-10 h-10 text-wt-gold shadow-glow" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Automation Hub</h1>
                                <p className="text-wt-text-muted/80 max-w-md">Orchestrate and monitor your AI-driven content engine from a central command center.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Link href="/admin/content-factory">
                                <ActionButton variant="primary" icon={Play}>
                                    Run Content Factory
                                </ActionButton>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Status Command Center */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard 
                        label="Success Rate" 
                        value={`${pipelineStatus.completed > 0 ? Math.round((pipelineStatus.completed / (pipelineStatus.completed + pipelineStatus.failed)) * 100) : 0}%`}
                        icon={CheckCircle2} 
                        color="teal" 
                        changeType="positive"
                    />
                    <StatCard 
                        label="Failed Ops" 
                        value={pipelineStatus.failed} 
                        icon={XCircle} 
                        color="rose" 
                        changeType="negative"
                    />
                    <StatCard 
                        label="System Uptime" 
                        value="99.9%" 
                        icon={Zap} 
                        color="amber" 
                    />
                     <StatCard 
                        label="Last Activity" 
                        value={pipelineStatus.lastRun ? new Date(pipelineStatus.lastRun).toLocaleTimeString() : 'Idle'} 
                        icon={Clock} 
                        color="blue" 
                    />
                </div>

                {/* Command Deck */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Primary Generation Deck */}
                    <div className="space-y-6">
                        <ContentSection title="Content Factory" subtitle="AI Mass Production">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <ActionCard 
                                    title="Bulk Engine" 
                                    desc="Queue hundreds of topics"
                                    href="/admin/content-factory"
                                    icon={Flame}
                                    color="orange"
                                />
                                <ActionCard 
                                    title="Evergreen Sync" 
                                    desc="Update existing content"
                                    href="/admin/automation/evergreen"
                                    icon={Rss}
                                    color="teal"
                                />
                            </div>
                        </ContentSection>

                        <ContentSection title="Infrastructure" subtitle="System Control">
                            <AutomationControls />
                        </ContentSection>
                    </div>

                    {/* Operational Flow Deck */}
                    <div className="space-y-6">
                        <ContentSection title="Workflow Management" subtitle="Pipeline Routing">
                            <div className="space-y-3">
                                <ActionRow 
                                    title="Editorial Queue" 
                                    desc="Pending human verification" 
                                    count={12} 
                                    href="/admin/review-queue"
                                    icon={FileText}
                                />
                                <ActionRow 
                                    title="Publishing Schedule" 
                                    desc="Time-optimized distribution" 
                                    count={pipelineStatus.completed} 
                                    href="/admin/content-calendar"
                                    icon={Calendar}
                                />
                                <ActionRow 
                                    title="Node Monitor" 
                                    desc="Active scraping & NLP nodes" 
                                    count={4} 
                                    href="/admin/automation/monitor"
                                    icon={BarChart3}
                                />
                            </div>
                        </ContentSection>
                        
                        <div className="p-6 bg-wt-gold-subtle/30 rounded-2xl border border-wt-gold/20 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Sparkles className="w-6 h-6 text-wt-gold anim-pulse" />
                                <div>
                                    <h4 className="font-semibold text-wt-text">AI Pilot Mode</h4>
                                    <p className="text-xs text-wt-text-muted">Currently operating at Level 4 Autonomy</p>
                                </div>
                            </div>
                            <button className="px-3 py-1.5 bg-wt-gold text-wt-navy-950 rounded-lg text-xs font-bold uppercase tracking-wider">
                                Active
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

// Internal Landing components for cleaner layout
function ActionCard({ title, desc, href, icon: Icon, color }: any) {
    return (
        <Link href={href}>
            <div className="group p-5 bg-wt-card border border-wt-border rounded-2xl hover:border-wt-gold/50 hover:bg-wt-surface-hover transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                    color === 'orange' ? 'bg-orange-500/10 text-orange-500' : 'bg-teal-500/10 text-teal-500'
                )}>
                    <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-wt-text mb-1">{title}</h4>
                <p className="text-xs text-wt-text-muted leading-relaxed">{desc}</p>
            </div>
        </Link>
    );
}

function ActionRow({ title, desc, count, href, icon: Icon }: any) {
    return (
        <Link href={href}>
            <div className="flex items-center justify-between p-4 bg-wt-card border border-wt-border rounded-xl hover:bg-wt-surface-hover transition-colors group">
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-wt-surface/50 group-hover:bg-wt-gold/10 transition-colors">
                        <Icon className="w-4 h-4 text-wt-text-muted group-hover:text-wt-gold" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-wt-text">{title}</h4>
                        <p className="text-xs text-wt-text-muted">{desc}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2 py-0.5 bg-wt-surface rounded-full border border-wt-border">{count}</span>
                    <Play className="w-3 h-3 text-wt-text-muted group-hover:text-wt-gold opacity-0 group-hover:opacity-100 transition-all" />
                </div>
            </div>
        </Link>
    );
}
