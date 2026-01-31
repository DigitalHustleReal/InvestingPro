"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageContainer from '@/components/admin/AdminPageContainer';
import AutomationControls from '@/components/admin/AutomationControls';
import { CheckCircle2, XCircle, Clock, Zap, Rss, Play } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AdminPageHeader, StatCard, ContentSection } from '@/components/admin/AdminUIKit';
import Link from 'next/link';

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
            <AdminPageContainer>
            <div className="p-8 space-y-8">
                <AdminPageHeader
                    title="Automation Hub"
                    subtitle="Control and monitor the AI-driven content generation pipeline"
                    icon={Zap}
                    iconColor="amber"
                    actions={
                        <Link href="/admin/content-factory">
                            <button className="px-4 py-2.5 bg-gradient-to-r from-accent-500 to-orange-500 text-foreground dark:text-foreground rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 transition-shadow">
                                <Play className="w-4 h-4" /> Open Content Factory
                            </button>
                        </Link>
                    }
                />

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard 
                        label="Successful Jobs" 
                        value={pipelineStatus.completed} 
                        icon={CheckCircle2} 
                        color="teal" 
                    />
                    <StatCard 
                        label="Failed Jobs" 
                        value={pipelineStatus.failed} 
                        icon={XCircle} 
                        color="rose" 
                    />
                    <StatCard 
                        label="Last Activity" 
                        value={pipelineStatus.lastRun ? new Date(pipelineStatus.lastRun).toLocaleTimeString() : 'Never'} 
                        icon={Clock} 
                        color="blue" 
                    />
                    <StatCard 
                        label="Active Pipelines" 
                        value="0" 
                        icon={Rss} 
                        color="purple" 
                    />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ContentSection title="Content Factory" subtitle="AI-powered bulk generation">
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground dark:text-muted-foreground">Generate multiple articles at once using AI with real-time progress tracking.</p>
                            <Link href="/admin/content-factory">
                                <button className="w-full px-4 py-3 bg-gradient-to-r from-secondary-500/20 to-pink-500/20 hover:from-secondary-500/30 hover:to-pink-500/30 text-secondary-400 rounded-xl text-sm font-medium border border-secondary-500/30 transition-colors">
                                    Open Content Factory →
                                </button>
                            </Link>
                        </div>
                    </ContentSection>

                    <ContentSection title="Scheduled Publishing" subtitle="Automate your content calendar">
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground dark:text-muted-foreground">Schedule articles to publish automatically at optimal times.</p>
                            <Link href="/admin/content-calendar">
                                <button className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-foreground dark:text-foreground rounded-xl text-sm font-medium border border-border dark:border-border transition-colors">
                                    View Calendar →
                                </button>
                            </Link>
                        </div>
                    </ContentSection>

                    <ContentSection title="Review Queue" subtitle="Pending editorial approval">
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground dark:text-muted-foreground">Review and approve articles waiting for publication.</p>
                            <Link href="/admin/review-queue">
                                <button className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-foreground dark:text-foreground rounded-xl text-sm font-medium border border-border dark:border-border transition-colors">
                                    View Queue →
                                </button>
                            </Link>
                        </div>
                    </ContentSection>

                    <ContentSection title="Workflows" subtitle="Configure automation workflows">
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground dark:text-muted-foreground">Create and manage workflow triggers, actions, and schedules.</p>
                            <Link href="/admin/workflows">
                                <button className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-foreground dark:text-foreground rounded-xl text-sm font-medium border border-border dark:border-border transition-colors">
                                    Open Workflows →
                                </button>
                            </Link>
                        </div>
                    </ContentSection>
                </div>

                {/* Automation Controls */}
                <ContentSection title="Pipeline Controls" subtitle="Manage automation triggers and schedules">
                    <AutomationControls />
                </ContentSection>
            </div>
            </AdminPageContainer>
        </AdminLayout>
    );
}
