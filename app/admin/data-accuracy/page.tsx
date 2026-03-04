"use client";

import React from 'react';
import { logger } from '@/lib/logger';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { 
    Database, 
    CheckCircle2, 
    XCircle,
    AlertTriangle,
    Clock,
    RefreshCw,
    Activity,
    TrendingUp,
    Calendar,
    BarChart3
} from 'lucide-react';
interface ScraperRun {
    id: string;
    scraper_id: string;
    scraper_name: string;
    status: 'running' | 'completed' | 'failed' | 'idle';
    started_at: string;
    completed_at: string | null;
    duration_ms: number | null;
    items_scraped: number;
    errors: any[];
}

interface ScraperStats {
    scraperId: string;
    scraperName: string;
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    successRate: number;
    lastRun: string | null;
    avgDuration: number;
    totalItemsScraped: number;
    isStale: boolean;
}

export default function DataAccuracyPage() {
    const supabase = createClient();

    // Fetch scraper runs
    const { data: scraperRuns = [], isLoading, refetch } = useQuery({
        queryKey: ['scraper-runs'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('scraper_runs')
                .select('*')
                .order('started_at', { ascending: false })
                .limit(100);
            
            if (error) {
                logger.error('Error fetching scraper runs:', error);
                return [];
            }
            return data || [];
        },
        refetchInterval: 30000,
    });

    // Calculate scraper statistics
    const scraperStats: ScraperStats[] = React.useMemo(() => {
        if (!scraperRuns.length) return [];

        const statsMap = new Map<string, {
            runs: ScraperRun[];
            name: string;
        }>();

        scraperRuns.forEach((run: ScraperRun) => {
            if (!statsMap.has(run.scraper_id)) {
                statsMap.set(run.scraper_id, {
                    runs: [],
                    name: run.scraper_name,
                });
            }
            statsMap.get(run.scraper_id)!.runs.push(run);
        });

        const now = new Date();
        const staleThresholdMs = 24 * 60 * 60 * 1000; // 24 hours

        return Array.from(statsMap.entries()).map(([scraperId, { runs, name }]) => {
            const successfulRuns = runs.filter(r => r.status === 'completed');
            const failedRuns = runs.filter(r => r.status === 'failed');
            const lastRun = runs[0];
            const totalDuration = successfulRuns.reduce((sum, r) => sum + (r.duration_ms || 0), 0);
            const totalItems = successfulRuns.reduce((sum, r) => sum + (r.items_scraped || 0), 0);
            
            const lastRunDate = lastRun?.started_at ? new Date(lastRun.started_at) : null;
            const isStale = lastRunDate ? (now.getTime() - lastRunDate.getTime()) > staleThresholdMs : true;

            return {
                scraperId,
                scraperName: name,
                totalRuns: runs.length,
                successfulRuns: successfulRuns.length,
                failedRuns: failedRuns.length,
                successRate: runs.length > 0 
                    ? Math.round((successfulRuns.length / runs.length) * 100) 
                    : 0,
                lastRun: lastRun?.started_at || null,
                avgDuration: successfulRuns.length > 0 
                    ? Math.round(totalDuration / successfulRuns.length) 
                    : 0,
                totalItemsScraped: totalItems,
                isStale,
            };
        });
    }, [scraperRuns]);

    // Overall statistics
    const overallStats = React.useMemo(() => {
        const totalRuns = scraperRuns.length;
        const successfulRuns = scraperRuns.filter((r: ScraperRun) => r.status === 'completed').length;
        const failedRuns = scraperRuns.filter((r: ScraperRun) => r.status === 'failed').length;
        const runningRuns = scraperRuns.filter((r: ScraperRun) => r.status === 'running').length;
        const staleScrapers = scraperStats.filter(s => s.isStale).length;

        return {
            totalRuns,
            successfulRuns,
            failedRuns,
            runningRuns,
            successRate: totalRuns > 0 ? Math.round((successfulRuns / totalRuns) * 100) : 0,
            staleScrapers,
            totalScrapers: scraperStats.length,
        };
    }, [scraperRuns, scraperStats]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-success-500/20 text-success-400 border-success-500/30';
            case 'running': return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
            case 'failed': return 'bg-danger-500/20 text-danger-400 border-danger-500/30';
            default: return 'bg-muted/20 text-muted-foreground border-muted/30';
        }
    };

    const formatDuration = (ms: number) => {
        if (ms < 1000) return `${ms}ms`;
        if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
        return `${(ms / 60000).toFixed(1)}m`;
    };

    const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        return `${diffDays}d ago`;
    };

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 font-sans">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-700 shadow-lg shadow-secondary-500/25 flex items-center justify-center">
                            <Database className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                                Data Accuracy Monitor
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Track scraper performance, data freshness, and accuracy
                            </p>
                        </div>
                    </div>
                    <Button onClick={() => refetch()} variant="outline" className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </Button>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-success-500/10 to-success-600/5 border-success-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <CheckCircle2 className="w-5 h-5 text-success-400" />
                                <Badge variant="outline" className="text-xs">Success Rate</Badge>
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">
                                {isLoading ? '...' : `${overallStats.successRate}%`}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {overallStats.successfulRuns} of {overallStats.totalRuns} runs
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-danger-500/10 to-danger-600/5 border-danger-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <XCircle className="w-5 h-5 text-danger-400" />
                                <Badge variant="outline" className="text-xs">Failed</Badge>
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">
                                {isLoading ? '...' : overallStats.failedRuns}
                            </div>
                            <p className="text-xs text-muted-foreground">Failed runs</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-warning-500/10 to-warning-600/5 border-warning-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <AlertTriangle className="w-5 h-5 text-warning-400" />
                                <Badge variant="outline" className="text-xs">Stale</Badge>
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">
                                {isLoading ? '...' : overallStats.staleScrapers}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Scrapers &gt; 24h old
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-primary-500/10 to-primary-600/5 border-primary-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Activity className="w-5 h-5 text-primary-400" />
                                <Badge variant="outline" className="text-xs">Running</Badge>
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">
                                {isLoading ? '...' : overallStats.runningRuns}
                            </div>
                            <p className="text-xs text-muted-foreground">Active scrapers</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Scraper Status Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Scraper Performance */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-primary-400" />
                                Scraper Performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {scraperStats.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No scraper runs recorded yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {scraperStats.map(stat => (
                                        <div 
                                            key={stat.scraperId}
                                            className={`p-4 rounded-lg border ${
                                                stat.isStale 
                                                    ? 'bg-warning-500/5 border-warning-500/30' 
                                                    : 'bg-muted/10 border-border/50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold text-foreground">
                                                        {stat.scraperName}
                                                    </span>
                                                    {stat.isStale && (
                                                        <Badge className="bg-warning-500/20 text-warning-400 border-warning-500/30">
                                                            Stale
                                                        </Badge>
                                                    )}
                                                </div>
                                                <span className={`font-bold ${
                                                    stat.successRate >= 90 
                                                        ? 'text-success-400' 
                                                        : stat.successRate >= 70 
                                                            ? 'text-warning-400' 
                                                            : 'text-danger-400'
                                                }`}>
                                                    {stat.successRate}%
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground">Runs</p>
                                                    <p className="font-medium text-foreground">{stat.totalRuns}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Items</p>
                                                    <p className="font-medium text-foreground">{stat.totalItemsScraped}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Avg Time</p>
                                                    <p className="font-medium text-foreground">{formatDuration(stat.avgDuration)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Last Run</p>
                                                    <p className="font-medium text-foreground">
                                                        {stat.lastRun ? formatTimeAgo(stat.lastRun) : 'Never'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Runs */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-secondary-400" />
                                Recent Scraper Runs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                {scraperRuns.slice(0, 15).map((run: ScraperRun) => (
                                    <div 
                                        key={run.id}
                                        className="flex items-center justify-between p-3 bg-muted/10 rounded-lg hover:bg-muted/20 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0 mr-4">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {run.scraper_name}
                                            </p>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span>{formatTimeAgo(run.started_at)}</span>
                                                {run.duration_ms && (
                                                    <span>• {formatDuration(run.duration_ms)}</span>
                                                )}
                                                {run.items_scraped > 0 && (
                                                    <span>• {run.items_scraped} items</span>
                                                )}
                                            </div>
                                        </div>
                                        <Badge className={getStatusColor(run.status)}>
                                            {run.status}
                                        </Badge>
                                    </div>
                                ))}
                                {scraperRuns.length === 0 && (
                                    <p className="text-center text-muted-foreground py-8">
                                        No scraper runs recorded
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Stale Data Alert */}
                {overallStats.staleScrapers > 0 && (
                    <Card className="bg-warning-500/10 border-warning-500/30 mb-8">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <AlertTriangle className="w-6 h-6 text-warning-400 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-foreground mb-1">Stale Data Detected</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {overallStats.staleScrapers} scraper(s) haven't run in over 24 hours. 
                                        Data may be outdated.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {scraperStats.filter(s => s.isStale).map(stat => (
                                            <Badge 
                                                key={stat.scraperId} 
                                                className="bg-warning-500/20 text-warning-400 border-warning-500/30"
                                            >
                                                {stat.scraperName}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Data Freshness Summary */}
                <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-accent-400" />
                            Data Freshness Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center p-4 bg-muted/10 rounded-xl">
                                <div className="text-3xl font-bold text-foreground mb-1">
                                    {scraperStats.length}
                                </div>
                                <p className="text-sm text-muted-foreground">Total Scrapers</p>
                            </div>
                            <div className="text-center p-4 bg-muted/10 rounded-xl">
                                <div className="text-3xl font-bold text-success-400 mb-1">
                                    {scraperStats.filter(s => !s.isStale).length}
                                </div>
                                <p className="text-sm text-muted-foreground">Fresh (&lt; 24h)</p>
                            </div>
                            <div className="text-center p-4 bg-muted/10 rounded-xl">
                                <div className="text-3xl font-bold text-warning-400 mb-1">
                                    {overallStats.staleScrapers}
                                </div>
                                <p className="text-sm text-muted-foreground">Stale (&gt; 24h)</p>
                            </div>
                            <div className="text-center p-4 bg-muted/10 rounded-xl">
                                <div className="text-3xl font-bold text-foreground mb-1">
                                    {scraperStats.reduce((sum, s) => sum + s.totalItemsScraped, 0).toLocaleString()}
                                </div>
                                <p className="text-sm text-muted-foreground">Total Items</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
