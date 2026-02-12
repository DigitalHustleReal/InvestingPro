"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ActionButton, StatusBadge } from './AdminUIKit';
import { ADMIN_THEME } from '@/lib/admin/theme';
import { 
    RefreshCw, 
    Play, 
    Pause,
    Activity,
    Database,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Clock,
    Zap,
    History
} from 'lucide-react';

import { formatDistanceToNow } from 'date-fns';

/**
 * Scraper Dashboard
 * 
 * Monitor and manage all scrapers
 */
export default function ScraperDashboard() {
    const queryClient = useQueryClient();
    
    // Get all scrapers
    const { data: scrapersData, isLoading } = useQuery({
        queryKey: ['scrapers'],
        queryFn: async () => {
            const response = await fetch('/api/cms/scrapers?action=list');
            if (!response.ok) throw new Error('Failed to fetch scrapers');
            const data = await response.json();
            return data.scrapers || [];
        },
        refetchInterval: 30000 // Refresh every 30 seconds
    });
    
    // Execute scraper mutation
    const executeScraper = useMutation({
        mutationFn: async (scraperId: string) => {
            const response = await fetch('/api/cms/scrapers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'execute',
                    scraperId
                })
            });
            if (!response.ok) throw new Error('Failed to execute scraper');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scrapers'] });
        }
    });
    
    const scrapers = scrapersData || [];
    
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-wt-border pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-wt-navy-900 tracking-tight">Data Scrapers</h1>
                    <p className="text-sm font-medium text-wt-navy-500 mt-1">
                        Monitor real-time data ingestion pipelines
                    </p>
                </div>
                <ActionButton
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['scrapers'] })}
                    variant="secondary"
                    icon={RefreshCw}
                >
                    Refresh Status
                </ActionButton>
            </div>
            
            {/* Scrapers List */}
            <div className="grid gap-6">
                {isLoading ? (
                    <div className="text-center py-12 text-wt-text-muted/50 dark:text-wt-text-muted/50">Loading scrapers...</div>
                ) : scrapers.length === 0 ? (
                    <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl">
                        <CardContent className="text-center py-12">
                            <Database className="w-12 h-12 mx-auto mb-4 text-wt-text-muted/50 dark:text-wt-text-muted/50" />
                            <p className="text-wt-text-muted dark:text-wt-text-muted">No scrapers registered yet</p>
                        </CardContent>
                    </Card>
                ) : (
                    scrapers.map((scraper: any) => (
                        <ScraperCard
                            key={scraper.id}
                            scraper={scraper}
                            onExecute={() => executeScraper.mutate(scraper.id)}
                            isExecuting={executeScraper.isPending}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function ScraperCard({ scraper, onExecute, isExecuting }: any) {
    const [showRuns, setShowRuns] = useState(false);
    
    // Get scraper runs
    const { data: runsData } = useQuery({
        queryKey: ['scraper-runs', scraper.id],
        queryFn: async () => {
            const response = await fetch(`/api/cms/scrapers?action=runs&scraperId=${scraper.id}`);
            if (!response.ok) throw new Error('Failed to fetch runs');
            const data = await response.json();
            return data.runs || [];
        },
        enabled: showRuns
    });
    
    const runs = runsData || [];
    const lastRun = runs[0];
    
    const getStatusType = (status: string) => {
        switch (status) {
            case 'completed': return 'completed';
            case 'failed': return 'error';
            case 'running': return 'processing';
            default: return 'neutral';
        }
    };
    
    return (
        <div className="bg-white border border-wt-border-subtle rounded-2xl overflow-hidden hover:shadow-cardHover hover:border-wt-gold/20 transition-all duration-300 group">
            <div className="px-8 py-6 border-b border-wt-border-subtle bg-wt-bg-hover/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-wt-border-subtle group-hover:border-wt-gold/30 transition-colors">
                            <Database className="w-6 h-6 text-wt-gold" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-wt-navy-900 leading-tight">
                                {scraper.display_name || scraper.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-wt-gold bg-wt-gold/5 px-2 py-0.5 rounded">
                                    {scraper.category}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-wt-navy-400">
                                    {scraper.source_type}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <StatusBadge 
                            status={scraper.is_active ? 'completed' : 'neutral'} 
                            label={scraper.is_active ? 'Operational' : 'Paused'} 
                        />
                        <ActionButton
                            onClick={onExecute}
                            isLoading={isExecuting}
                            disabled={!scraper.is_active}
                            variant="primary"
                            icon={Play}
                        >
                            Execute
                        </ActionButton>
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="grid grid-cols-4 gap-8">
                    <div className="space-y-1">
                        <p className="text-[10px] font-extrabold uppercase tracking-tight text-wt-navy-400">Snapshot Status</p>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                                lastRun?.status === 'completed' ? 'bg-wt-green' : 
                                lastRun?.status === 'failed' ? 'bg-wt-danger' : 
                                lastRun?.status === 'running' ? 'bg-wt-gold animate-pulse' : 'bg-wt-navy-200'
                            }`} />
                            <p className="text-sm font-bold text-wt-navy-900 capitalize">
                                {lastRun?.status || 'Never Analyzed'}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-1 text-center md:text-left">
                        <p className="text-[10px] font-extrabold uppercase tracking-tight text-wt-navy-400">Items Scraped</p>
                        <p className="text-lg font-extrabold text-wt-navy-900">{lastRun?.items_scraped || 0}</p>
                    </div>
                    <div className="space-y-1 text-center md:text-left">
                        <p className="text-[10px] font-extrabold uppercase tracking-tight text-wt-navy-400">Updates</p>
                        <p className="text-lg font-extrabold text-wt-navy-900">{lastRun?.items_updated || 0}</p>
                    </div>
                    <div className="space-y-1 text-center md:text-left">
                        <p className="text-[10px] font-extrabold uppercase tracking-tight text-wt-navy-400">Latency</p>
                        <p className="text-lg font-extrabold text-wt-navy-900">
                            {lastRun?.execution_time_ms 
                                ? `${(lastRun.execution_time_ms / 1000).toFixed(1)}s`
                                : '--'
                            }
                        </p>
                    </div>
                </div>
                
                <div className="mt-8 flex items-center justify-between border-t border-wt-border-subtle pt-6">
                    <div className="flex items-center gap-6">
                        <ActionButton
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowRuns(!showRuns)}
                            icon={History}
                        >
                            {showRuns ? 'Hide' : 'View'} Execution History
                        </ActionButton>
                        {scraper.next_run_at && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-wt-bg-hover rounded-lg">
                                <Clock className="w-3.5 h-3.5 text-wt-navy-400" />
                                <span className="text-[10px] font-bold text-wt-navy-600">
                                    Next Run: {new Date(scraper.next_run_at).toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>
                    {lastRun?.started_at && (
                        <p className="text-[10px] font-bold text-wt-navy-400 uppercase tracking-widest">
                            Last Analyzed: {formatDistanceToNow(new Date(lastRun.started_at), { addSuffix: true })}
                        </p>
                    )}
                </div>
                
                {showRuns && (
                    <div className="mt-8 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-wt-navy-400 mb-4 px-1">Recent Executions</h4>
                        {runs.length === 0 ? (
                            <div className="p-8 text-center bg-wt-bg-hover rounded-xl border border-dashed border-wt-border-subtle">
                                <p className="text-sm text-wt-navy-400">No telemetry data available for this scraper.</p>
                            </div>
                        ) : (
                            runs.slice(0, 5).map((run: any) => (
                                <div key={run.id} className="flex items-center justify-between p-4 bg-wt-bg-hover/30 hover:bg-white border border-wt-border-subtle rounded-xl transition-all group/run">
                                    <div className="flex items-center gap-4">
                                        <StatusBadge 
                                            status={getStatusType(run.status)} 
                                            size="sm"
                                        />
                                        <span className="text-sm font-bold text-wt-navy-700">
                                            {formatDistanceToNow(new Date(run.started_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-tight text-wt-navy-400">
                                        <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-wt-gold" /> {run.items_scraped}</span>
                                        <span className="flex items-center gap-1.5"><RefreshCw className="w-3 h-3 text-wt-navy-300" /> {run.items_updated}</span>
                                        {run.execution_time_ms && (
                                            <span>{(run.execution_time_ms / 1000).toFixed(1)}s</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
