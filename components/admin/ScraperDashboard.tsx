"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    Zap
} from 'lucide-react';

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Scraper Management</h1>
                    <p className="text-slate-400 mt-1">Monitor and manage all data scrapers</p>
                </div>
                <Button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['scrapers'] })}
                    variant="outline"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>
            
            {/* Scrapers List */}
            <div className="grid gap-6">
                {isLoading ? (
                    <div className="text-center py-12 text-slate-600">Loading scrapers...</div>
                ) : scrapers.length === 0 ? (
                    <Card className="bg-white/[0.03] border-white/5 rounded-2xl">
                        <CardContent className="text-center py-12">
                            <Database className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                            <p className="text-slate-400">No scrapers registered yet</p>
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
    
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-success-500';
            case 'failed': return 'bg-danger-500';
            case 'running': return 'bg-yellow-500 animate-pulse';
            default: return 'bg-slate-500';
        }
    };
    
    return (
        <Card className="bg-white/[0.03] border-white/5 rounded-2xl">
            <CardHeader className="border-b border-white/5 px-8 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(lastRun?.status || 'unknown')}`} />
                        <div>
                            <CardTitle className="text-lg font-bold text-white">
                                {scraper.display_name || scraper.name}
                            </CardTitle>
                            <p className="text-sm text-slate-500 mt-1">
                                {scraper.category} • {scraper.source_type}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant={scraper.is_active ? "default" : "outline"}>
                            {scraper.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                            onClick={onExecute}
                            disabled={isExecuting || !scraper.is_active}
                            size="sm"
                            className="bg-primary-600 hover:bg-primary-700"
                        >
                            {isExecuting ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Running...
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
            </CardHeader>
            <CardContent className="p-8">
                <div className="grid grid-cols-4 gap-6 mb-6">
                    <div>
                        <p className="text-sm text-slate-500 mb-1">Last Run</p>
                        <p className="text-white font-medium">
                            {lastRun?.started_at 
                                ? new Date(lastRun.started_at).toLocaleString()
                                : 'Never'
                            }
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 mb-1">Items Scraped</p>
                        <p className="text-white font-medium">
                            {lastRun?.items_scraped || 0}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 mb-1">Items Updated</p>
                        <p className="text-white font-medium">
                            {lastRun?.items_updated || 0}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 mb-1">Execution Time</p>
                        <p className="text-white font-medium">
                            {lastRun?.execution_time_ms 
                                ? `${(lastRun.execution_time_ms / 1000).toFixed(1)}s`
                                : '-'
                            }
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowRuns(!showRuns)}
                    >
                        {showRuns ? 'Hide' : 'Show'} Runs
                    </Button>
                    {scraper.next_run_at && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="w-4 h-4" />
                            Next run: {new Date(scraper.next_run_at).toLocaleString()}
                        </div>
                    )}
                </div>
                
                {showRuns && (
                    <div className="mt-6 space-y-2">
                        <h4 className="text-sm font-semibold text-white mb-3">Recent Runs</h4>
                        {runs.length === 0 ? (
                            <p className="text-sm text-slate-500">No runs yet</p>
                        ) : (
                            runs.slice(0, 5).map((run: any) => (
                                <div key={run.id} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${getStatusColor(run.status)}`} />
                                        <span className="text-sm text-white">
                                            {new Date(run.started_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <span>{run.items_scraped} scraped</span>
                                        <span>{run.items_updated} updated</span>
                                        {run.execution_time_ms && (
                                            <span>{(run.execution_time_ms / 1000).toFixed(1)}s</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
