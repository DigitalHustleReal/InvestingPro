"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { 
    Gauge, 
    Zap,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    RefreshCw,
    BarChart3
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface WebVitals {
    lcp: number;
    fid: number;
    cls: number;
    fcp: number;
    ttfb: number;
}

interface PerformanceMetrics {
    webVitals: {
        average: WebVitals;
        p75: WebVitals;
        p95: WebVitals;
        good: number;
        needsImprovement: number;
        poor: number;
    };
    bundle: {
        totalSize: number;
        gzippedSize: number;
        meetsBudget: boolean;
    };
    lighthouse: {
        performance: number;
        accessibility: number;
        bestPractices: number;
        seo: number;
    };
}

export default function PerformanceDashboard() {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

    // Fetch performance metrics
    const { data: metrics, isLoading, refetch } = useQuery<PerformanceMetrics>({
        queryKey: ['performance-metrics', timeRange],
        queryFn: async () => {
            const response = await fetch(`/api/performance/metrics?range=${timeRange}`);
            if (!response.ok) throw new Error('Failed to fetch performance metrics');
            return response.json();
        }
    });

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBadge = (score: number) => {
        if (score >= 90) return <Badge className="bg-green-500">Good</Badge>;
        if (score >= 50) return <Badge className="bg-yellow-500">Needs Improvement</Badge>;
        return <Badge className="bg-red-500">Poor</Badge>;
    };

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <AdminLayout>
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-foreground dark:text-foreground">Performance Dashboard</h1>
                        <p className="text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground mt-1">
                            Monitor Core Web Vitals, bundle size, and Lighthouse scores
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            {(['7d', '30d', '90d'] as const).map((range) => (
                                <Button
                                    key={range}
                                    variant={timeRange === range ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setTimeRange(range)}
                                >
                                    {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                                </Button>
                            ))}
                        </div>
                        <Button
                            onClick={() => refetch()}
                            variant="outline"
                            size="sm"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary-600" />
                        <p className="mt-4 text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground">Loading performance metrics...</p>
                    </div>
                ) : metrics ? (
                    <>
                        {/* Lighthouse Scores */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Performance</CardTitle>
                                    <Zap className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-2xl font-bold ${getScoreColor(metrics.lighthouse.performance)}`}>
                                        {metrics.lighthouse.performance}
                                    </div>
                                    <div className="mt-2">{getScoreBadge(metrics.lighthouse.performance)}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Accessibility</CardTitle>
                                    <Gauge className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-2xl font-bold ${getScoreColor(metrics.lighthouse.accessibility)}`}>
                                        {metrics.lighthouse.accessibility}
                                    </div>
                                    <div className="mt-2">{getScoreBadge(metrics.lighthouse.accessibility)}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Best Practices</CardTitle>
                                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-2xl font-bold ${getScoreColor(metrics.lighthouse.bestPractices)}`}>
                                        {metrics.lighthouse.bestPractices}
                                    </div>
                                    <div className="mt-2">{getScoreBadge(metrics.lighthouse.bestPractices)}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">SEO</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-2xl font-bold ${getScoreColor(metrics.lighthouse.seo)}`}>
                                        {metrics.lighthouse.seo}
                                    </div>
                                    <div className="mt-2">{getScoreBadge(metrics.lighthouse.seo)}</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Web Vitals */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5" />
                                    Core Web Vitals
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground mb-1">LCP (avg)</div>
                                        <div className="text-2xl font-bold">{metrics.webVitals.average.lcp}ms</div>
                                        <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                                            P75: {metrics.webVitals.p75.lcp}ms
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground mb-1">FID (avg)</div>
                                        <div className="text-2xl font-bold">{metrics.webVitals.average.fid}ms</div>
                                        <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                                            P75: {metrics.webVitals.p75.fid}ms
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground mb-1">CLS (avg)</div>
                                        <div className="text-2xl font-bold">{metrics.webVitals.average.cls.toFixed(3)}</div>
                                        <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                                            P75: {metrics.webVitals.p75.cls.toFixed(3)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground mb-1">FCP (avg)</div>
                                        <div className="text-2xl font-bold">{metrics.webVitals.average.fcp}ms</div>
                                        <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                                            P75: {metrics.webVitals.p75.fcp}ms
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground mb-1">TTFB (avg)</div>
                                        <div className="text-2xl font-bold">{metrics.webVitals.average.ttfb}ms</div>
                                        <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                                            P75: {metrics.webVitals.p75.ttfb}ms
                                        </div>
                                    </div>
                                </div>

                                {/* Web Vitals Distribution */}
                                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                                    <div className="text-sm font-semibold mb-3">Web Vitals Distribution</div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm text-green-600">Good</span>
                                                <span className="text-sm font-semibold">{metrics.webVitals.good}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full"
                                                    style={{ width: `${metrics.webVitals.good}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm text-yellow-600">Needs Improvement</span>
                                                <span className="text-sm font-semibold">{metrics.webVitals.needsImprovement}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <div
                                                    className="bg-yellow-600 h-2 rounded-full"
                                                    style={{ width: `${metrics.webVitals.needsImprovement}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm text-red-600">Poor</span>
                                                <span className="text-sm font-semibold">{metrics.webVitals.poor}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <div
                                                    className="bg-red-600 h-2 rounded-full"
                                                    style={{ width: `${metrics.webVitals.poor}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bundle Size */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    Bundle Size
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground mb-1">Total Size</div>
                                        <div className="text-2xl font-bold">{formatBytes(metrics.bundle.totalSize)}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground mb-1">Gzipped Size</div>
                                        <div className="text-2xl font-bold">{formatBytes(metrics.bundle.gzippedSize)}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground mb-1">Budget Status</div>
                                        <div className="mt-2">
                                            {metrics.bundle.meetsBudget ? (
                                                <Badge className="bg-green-500">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Within Budget
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-red-500">
                                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                                    Exceeds Budget
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <Gauge className="w-12 h-12 mx-auto mb-3 opacity-40" />
                        <p className="text-muted-foreground/70 dark:text-muted-foreground/70">No performance data available</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
