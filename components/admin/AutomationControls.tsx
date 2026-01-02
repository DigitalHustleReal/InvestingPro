"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Play, RefreshCw, Zap, Loader2, CheckCircle2, XCircle, Clock, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePipeline } from '@/hooks/usePipeline';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

/**
 * AutomationControls - UI component for triggering automation actions
 * 
 * Provides controls for:
 * - Scraper triggers
 * - Pipeline runs
 * - Content refresh
 * - Article regeneration
 */
interface AutomationControlsProps {
    className?: string;
}

export default function AutomationControls({ className = "" }: AutomationControlsProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [triggering, setTriggering] = useState<string | null>(null);

    // Fetch pipeline runs status
    const { data: pipelineRuns = [] } = useQuery({
        queryKey: ['pipeline-runs'],
        queryFn: async () => {
            try {
                const response = await fetch('/api/pipeline/runs?limit=10');
                if (!response.ok) return [];
                const data = await response.json();
                return data.runs || [];
            } catch (error) {
                console.error('Failed to fetch pipeline runs:', error);
                return [];
            }
        },
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    // Trigger scraper
    const handleTriggerScraper = async (scraperType: string) => {
        setTriggering(`scraper-${scraperType}`);
        try {
            const response = await fetch('/api/automation/scraper/trigger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scraper_type: scraperType }),
            });

            if (!response.ok) {
                throw new Error('Failed to trigger scraper');
            }

            const data = await response.json();
            toast.success(`Scraper '${scraperType}' triggered successfully`);
            queryClient.invalidateQueries({ queryKey: ['pipeline-runs'] });
            queryClient.invalidateQueries({ queryKey: ['scraper-status'] });
        } catch (error: any) {
            toast.error(`Failed to trigger scraper: ${error.message}`);
        } finally {
            setTriggering(null);
        }
    };

    // Use standardized pipeline hook
    const { triggerPipeline, isTriggering } = usePipeline();

    // Trigger pipeline run
    const handleTriggerPipeline = async () => {
        toast.promise(triggerPipeline('scrape_and_generate'), {
            loading: 'Initializing Content Factory: Scanning for high-authority trends...',
            success: 'Pipeline active! AI is now drafting content from real-time signals.',
            error: 'Factory initialization failed. Check system logs.'
        });
    };

    // Trigger content refresh
    const handleContentRefresh = async (contentType: string, contentId?: string) => {
        setTriggering(`refresh-${contentType}`);
        try {
            const response = await fetch('/api/automation/content-refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    content_type: contentType,
                    content_id: contentId 
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to trigger content refresh');
            }

            const data = await response.json();
            toast.success(`Content refresh for '${contentType}' triggered successfully`);
            queryClient.invalidateQueries({ queryKey: ['pipeline-runs'] });
        } catch (error: any) {
            toast.error(`Failed to trigger content refresh: ${error.message}`);
        } finally {
            setTriggering(null);
        }
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        const variants: Record<string, { bg: string; text: string; icon: any }> = {
            completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
            running: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Loader2 },
            failed: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
            triggered: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
        };
        return variants[status] || variants.triggered;
    };

    return (
        <div className={cn("space-y-8", className)}>
            {/* Scraper Triggers */}
            <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 px-8 py-6">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-6 md:p-8">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-indigo-400" />
                        </div>
                        Content Extraction Nodes
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Asset Crawler</span>
                                <Badge className="bg-primary-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-wider px-2">Ready</Badge>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="w-full h-10 bg-white/5 text-white hover:bg-white/10 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                                onClick={() => handleTriggerScraper('products')}
                                disabled={triggering === 'scraper-products'}
                            >
                                {triggering === 'scraper-products' ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin text-indigo-400" />
                                        Syncing
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-3.5 h-3.5 mr-2 text-indigo-400" />
                                        Execute
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-purple-500/30 transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sentiment Crawler</span>
                                <Badge className="bg-primary-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-wider px-2">Ready</Badge>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="w-full h-10 bg-white/5 text-white hover:bg-white/10 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                                onClick={() => handleTriggerScraper('reviews')}
                                disabled={triggering === 'scraper-reviews'}
                            >
                                {triggering === 'scraper-reviews' ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin text-purple-400" />
                                        Syncing
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-3.5 h-3.5 mr-2 text-purple-400" />
                                        Execute
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Market Feed Crawler</span>
                                <Badge className="bg-primary-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-wider px-2">Ready</Badge>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="w-full h-10 bg-white/5 text-white hover:bg-white/10 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                                onClick={() => handleTriggerScraper('rates')}
                                disabled={triggering === 'scraper-rates'}
                            >
                                {triggering === 'scraper-rates' ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin text-emerald-400" />
                                        Syncing
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-3.5 h-3.5 mr-2 text-emerald-400" />
                                        Execute
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pipeline Controls */}
            <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 px-8 py-6">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-6 md:p-8">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Activity className="w-4 h-4 text-blue-400" />
                        </div>
                        Synthesis Engine
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-2xl group hover:border-indigo-500/30 transition-all">
                        <div className="mb-4 md:mb-0">
                            <h4 className="font-bold text-white tracking-tight text-lg mb-1">Content Factory Pipeline</h4>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                Automated analysis and distribution sequence
                            </p>
                        </div>
                        <Button
                            size="lg"
                            className="h-12 px-8 rounded-xl font-extrabold uppercase tracking-widest text-[11px] bg-indigo-500 text-white hover:bg-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all active:scale-95"
                            onClick={handleTriggerPipeline}
                            disabled={isTriggering === 'scrape_and_generate'}
                        >
                            {isTriggering === 'scrape_and_generate' ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    Synthesizing...
                                </>
                            ) : (
                                <>
                                    <Play className="w-5 h-5 mr-3 fill-current" />
                                    Initialize Reactor
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

           {/* Manual Content Factory */}
            <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 px-8 py-6">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-6 md:p-8">
                        <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-pink-400" />
                        </div>
                        Proactive Generation
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-2xl group hover:border-pink-500/30 transition-all">
                        <div className="mb-4 md:mb-0">
                            <h4 className="font-bold text-white tracking-tight text-lg mb-1">Writer Workspace</h4>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                Manually trigger AI content generation for specific topics
                            </p>
                        </div>
                        <Button
                            size="lg"
                            className="h-12 px-8 rounded-xl font-extrabold uppercase tracking-widest text-[11px] bg-pink-500 text-white hover:bg-pink-600 shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all active:scale-95 border-0"
                            onClick={() => router.push('/admin/content-factory')}
                        >
                            <Play className="w-5 h-5 mr-3 fill-current" />
                            Launch Workspace
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Pipeline Runs */}
            <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 px-8 py-6 bg-white/[0.01]">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-6 md:p-8">
                        <div className="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-slate-400" />
                        </div>
                        Execution History Ledger
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {(!pipelineRuns || pipelineRuns.length === 0) ? (
                        <div className="text-center py-16 text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                            No system operations logged
                        </div>
                    ) : (
                        <div className="">
                            {Array.isArray(pipelineRuns) && pipelineRuns.map((run: any) => {
                                const statusBadge = getStatusBadge(run.status);
                                const StatusIcon = statusBadge.icon;
                                return (
                                    <div
                                        key={run.id}
                                        className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors p-8"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-4">
                                                    <span className="font-extrabold text-white tracking-widest uppercase text-xs">
                                                        {run.pipeline_type.replace(/_/g, ' ')}
                                                    </span>
                                                    <div className={cn(
                                                        "flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-white/5 shadow-sm",
                                                        run.status === 'completed' ? 'bg-primary-500/10 text-emerald-400' :
                                                        run.status === 'failed' ? 'bg-rose-500/10 text-rose-400' :
                                                        'bg-amber-500/10 text-amber-400'
                                                    )}>
                                                        <StatusIcon className={cn("w-3 h-3", run.status === 'running' ? 'animate-spin' : '')} />
                                                        {run.status}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-slate-300 font-medium tracking-tight">
                                                    {run.params?.topic || run.result?.processed_trend || 'Internal System Task'}
                                                </div>
                                                <div className="flex items-center gap-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                                    <span className="flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {run.triggered_at ? new Date(run.triggered_at).toLocaleTimeString() : 'N/A'}
                                                    </span>
                                                    {run.completed_at && (
                                                        <span className="text-emerald-500/80">
                                                            Operation Success
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4">
                                                {run.error_message && (
                                                    <div className="max-w-[200px] text-right">
                                                        <p className="text-[10px] text-rose-400 font-bold tracking-tight uppercase leading-relaxed">
                                                            System Fault: {run.error_message}
                                                        </p>
                                                    </div>
                                                )}
                                                
                                                {run.result?.article_id && (
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        className="h-10 px-6 bg-white/5 text-white hover:bg-white/10 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                                                        onClick={() => window.open(`/admin/articles/edit/${run.result.article_id}`, '_blank')}
                                                    >
                                                        Review Output →
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Content Refresh Controls */}
            <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 px-8 py-6">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-6 md:p-8">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                            <RefreshCw className="w-4 h-4 text-teal-400" />
                        </div>
                        Cache Maintenance
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-2xl group hover:border-teal-500/30 transition-all">
                            <div>
                                <h4 className="font-bold text-white mb-1">Articles Buffer</h4>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    Refresh all article indices
                                </p>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-10 px-6 bg-white/5 text-teal-400 hover:bg-teal-500 hover:text-white rounded-xl font-bold uppercase tracking-widest text-[10px]"
                                onClick={() => handleContentRefresh('article')}
                                disabled={triggering === 'refresh-article'}
                            >
                                {triggering === 'refresh-article' ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                        <div className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-2xl group hover:border-teal-500/30 transition-all">
                            <div>
                                <h4 className="font-bold text-white mb-1">Pillar Page Index</h4>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    Synchronize cornerstone content
                                </p>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-10 px-6 bg-white/5 text-teal-400 hover:bg-teal-500 hover:text-white rounded-xl font-bold uppercase tracking-widest text-[10px]"
                                onClick={() => handleContentRefresh('pillar')}
                                disabled={triggering === 'refresh-pillar'}
                            >
                                {triggering === 'refresh-pillar' ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

