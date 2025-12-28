"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Play, RefreshCw, Zap, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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

    // Trigger pipeline run
    const handleTriggerPipeline = async () => {
        setTriggering('pipeline');
        try {
            const response = await fetch('/api/pipeline/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pipeline_type: 'scrape_and_generate' }),
            });

            if (!response.ok) {
                throw new Error('Failed to trigger pipeline');
            }

            const data = await response.json();
            toast.success('Pipeline triggered successfully');
            queryClient.invalidateQueries({ queryKey: ['pipeline-runs'] });
            queryClient.invalidateQueries({ queryKey: ['pipeline-status'] });
        } catch (error: any) {
            toast.error(`Failed to trigger pipeline: ${error.message}`);
        } finally {
            setTriggering(null);
        }
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
        <div className={className}>
            <div className="space-y-6">
                {/* Scraper Triggers */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-purple-600" />
                            Scraper Triggers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-semibold text-slate-900">Product Scraper</span>
                                    <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => handleTriggerScraper('products')}
                                    disabled={triggering === 'scraper-products'}
                                >
                                    {triggering === 'scraper-products' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Triggering...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4 mr-2" />
                                            Run Now
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-semibold text-slate-900">Review Scraper</span>
                                    <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => handleTriggerScraper('reviews')}
                                    disabled={triggering === 'scraper-reviews'}
                                >
                                    {triggering === 'scraper-reviews' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Triggering...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4 mr-2" />
                                            Run Now
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-semibold text-slate-900">Rate Scraper</span>
                                    <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => handleTriggerScraper('rates')}
                                    disabled={triggering === 'scraper-rates'}
                                >
                                    {triggering === 'scraper-rates' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Triggering...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4 mr-2" />
                                            Run Now
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pipeline Controls */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-blue-600" />
                            Pipeline Controls
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-1">Scrape & Generate Pipeline</h4>
                                    <p className="text-sm text-slate-600">
                                        Runs scrapers and generates content automatically
                                    </p>
                                </div>
                                <Button
                                    onClick={handleTriggerPipeline}
                                    disabled={triggering === 'pipeline'}
                                >
                                    {triggering === 'pipeline' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Triggering...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4 mr-2" />
                                            Run Pipeline
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Pipeline Runs */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <RefreshCw className="w-5 h-5 text-slate-600" />
                            Recent Pipeline Runs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pipelineRuns.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                No pipeline runs yet. Trigger a scraper or pipeline to see runs here.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {pipelineRuns.map((run: any) => {
                                    const statusBadge = getStatusBadge(run.status);
                                    const StatusIcon = statusBadge.icon;
                                    return (
                                        <div
                                            key={run.id}
                                            className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <Badge className={`${statusBadge.bg} ${statusBadge.text}`}>
                                                        <StatusIcon className={`w-3 h-3 mr-1 ${run.status === 'running' ? 'animate-spin' : ''}`} />
                                                        {run.status}
                                                    </Badge>
                                                    <span className="font-medium text-slate-900">
                                                        {run.pipeline_type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-slate-600">
                                                    {run.triggered_at && (
                                                        <span>
                                                            {new Date(run.triggered_at).toLocaleString()}
                                                        </span>
                                                    )}
                                                    {run.completed_at && (
                                                        <span className="text-green-600">
                                                            Completed
                                                        </span>
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
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <RefreshCw className="w-5 h-5 text-teal-600" />
                            Content Refresh
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-1">Refresh Articles</h4>
                                    <p className="text-sm text-slate-600">
                                        Trigger content refresh for all articles
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => handleContentRefresh('article')}
                                    disabled={triggering === 'refresh-article'}
                                >
                                    {triggering === 'refresh-article' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Refreshing...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Refresh
                                        </>
                                    )}
                                </Button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-1">Refresh Pillar Pages</h4>
                                    <p className="text-sm text-slate-600">
                                        Trigger content refresh for pillar pages
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => handleContentRefresh('pillar')}
                                    disabled={triggering === 'refresh-pillar'}
                                >
                                    {triggering === 'refresh-pillar' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Refreshing...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Refresh
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

