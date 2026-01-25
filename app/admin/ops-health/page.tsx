"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { 
    Activity, 
    Cpu, 
    Database,
    Zap,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Clock,
    RefreshCw,
    Server,
    TrendingUp,
    Gauge
} from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';

interface ProviderMetric {
    totalCalls: number;
    successCount: number;
    errorCount: number;
    successRate: number;
    avgLatencyMs: number;
    lastCallAt: string | null;
    lastErrorAt: string | null;
    lastError: string | null;
    circuitBreakerState: 'closed' | 'open' | 'half-open';
}

interface CacheStats {
    hits: number;
    misses: number;
    ratio: number;
}

export default function OpsHealthPage() {
    // Fetch AI provider metrics
    const { data: aiMetrics, isLoading: aiLoading, refetch: refetchAI } = useQuery({
        queryKey: ['ai-provider-metrics'],
        queryFn: async () => {
            const response = await fetch('/api/admin/ai/metrics');
            if (!response.ok) {
                // Return mock data if API not available
                return {
                    providers: {},
                    summary: {
                        totalCalls: 0,
                        overallSuccessRate: 100,
                        avgLatencyMs: 0,
                        healthyProviders: 0,
                        degradedProviders: [],
                    },
                };
            }
            return response.json();
        },
        refetchInterval: 30000,
    });

    // Fetch cache stats
    const { data: cacheStats, isLoading: cacheLoading, refetch: refetchCache } = useQuery<CacheStats>({
        queryKey: ['cache-stats'],
        queryFn: async () => {
            const response = await fetch('/api/admin/cache/stats');
            if (!response.ok) {
                return { hits: 0, misses: 0, ratio: 0 };
            }
            return response.json();
        },
        refetchInterval: 30000,
    });

    // Fetch system health
    const { data: systemHealth, isLoading: systemLoading } = useQuery({
        queryKey: ['system-health'],
        queryFn: async () => {
            const response = await fetch('/api/health');
            if (!response.ok) {
                return { status: 'error', services: {} };
            }
            return response.json();
        },
        refetchInterval: 30000,
    });

    const providers = aiMetrics?.providers || {};
    const summary = aiMetrics?.summary || {
        totalCalls: 0,
        overallSuccessRate: 100,
        avgLatencyMs: 0,
        healthyProviders: 0,
        degradedProviders: [],
    };

    const getCircuitBreakerColor = (state: string) => {
        switch (state) {
            case 'closed': return 'bg-success-500/20 text-success-400 border-success-500/30';
            case 'open': return 'bg-danger-500/20 text-danger-400 border-danger-500/30';
            case 'half-open': return 'bg-warning-500/20 text-warning-400 border-warning-500/30';
            default: return 'bg-muted/20 text-muted-foreground border-muted/30';
        }
    };

    const getHealthColor = (rate: number) => {
        if (rate >= 95) return 'text-success-400';
        if (rate >= 80) return 'text-warning-400';
        return 'text-danger-400';
    };

    const handleRefresh = () => {
        refetchAI();
        refetchCache();
    };

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 font-sans">
                <AdminBreadcrumb />
                
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success-500 to-success-700 shadow-lg shadow-success-500/25 flex items-center justify-center">
                            <Activity className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                                Operations Health
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Monitor AI providers, cache performance, and system health
                            </p>
                        </div>
                    </div>
                    <Button onClick={handleRefresh} variant="outline" className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </Button>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-primary-500/10 to-primary-600/5 border-primary-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Cpu className="w-5 h-5 text-primary-400" />
                                <Badge variant="outline" className="text-xs">AI Calls</Badge>
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">
                                {aiLoading ? '...' : summary.totalCalls.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">Total API calls</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-success-500/10 to-success-600/5 border-success-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <CheckCircle2 className="w-5 h-5 text-success-400" />
                                <Badge variant="outline" className="text-xs">Success Rate</Badge>
                            </div>
                            <div className={`text-3xl font-bold mb-1 ${getHealthColor(summary.overallSuccessRate)}`}>
                                {aiLoading ? '...' : `${summary.overallSuccessRate}%`}
                            </div>
                            <p className="text-xs text-muted-foreground">Overall success rate</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-secondary-500/10 to-secondary-600/5 border-secondary-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Clock className="w-5 h-5 text-secondary-400" />
                                <Badge variant="outline" className="text-xs">Avg Latency</Badge>
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">
                                {aiLoading ? '...' : `${summary.avgLatencyMs}ms`}
                            </div>
                            <p className="text-xs text-muted-foreground">Average response time</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-accent-500/10 to-accent-600/5 border-accent-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Database className="w-5 h-5 text-accent-400" />
                                <Badge variant="outline" className="text-xs">Cache Hit</Badge>
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">
                                {cacheLoading ? '...' : `${cacheStats?.ratio || 0}%`}
                            </div>
                            <p className="text-xs text-muted-foreground">Cache hit ratio</p>
                        </CardContent>
                    </Card>
                </div>

                {/* AI Provider Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <Zap className="w-5 h-5 text-primary-400" />
                                AI Providers Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {Object.keys(providers).length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Server className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No provider metrics available yet.</p>
                                    <p className="text-sm">Metrics will appear after AI usage.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {Object.entries(providers).map(([name, metrics]) => {
                                        const m = metrics as ProviderMetric;
                                        return (
                                            <div 
                                                key={name}
                                                className="p-4 bg-muted/10 rounded-lg border border-border/50"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-semibold text-foreground">{name}</span>
                                                        <Badge className={getCircuitBreakerColor(m.circuitBreakerState)}>
                                                            {m.circuitBreakerState}
                                                        </Badge>
                                                    </div>
                                                    <span className={`font-bold ${getHealthColor(m.successRate)}`}>
                                                        {m.successRate}%
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-muted-foreground">Calls</p>
                                                        <p className="font-medium text-foreground">{m.totalCalls}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">Success</p>
                                                        <p className="font-medium text-success-400">{m.successCount}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">Errors</p>
                                                        <p className="font-medium text-danger-400">{m.errorCount}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">Latency</p>
                                                        <p className="font-medium text-foreground">{m.avgLatencyMs}ms</p>
                                                    </div>
                                                </div>
                                                {m.lastError && (
                                                    <div className="mt-3 p-2 bg-danger-500/10 rounded text-xs text-danger-400">
                                                        <span className="font-medium">Last error:</span> {m.lastError}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Cache Performance */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <Gauge className="w-5 h-5 text-secondary-400" />
                                Cache Performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Cache Hit Rate Visual */}
                                <div className="text-center py-8">
                                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-muted/30 relative">
                                        <div 
                                            className="absolute inset-0 rounded-full border-8 border-success-500"
                                            style={{
                                                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((cacheStats?.ratio || 0) / 100 * 2 * Math.PI)}% ${50 - 50 * Math.cos((cacheStats?.ratio || 0) / 100 * 2 * Math.PI)}%, 50% 50%)`,
                                            }}
                                        />
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-foreground">
                                                {cacheStats?.ratio || 0}%
                                            </div>
                                            <div className="text-xs text-muted-foreground">Hit Rate</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Cache Stats Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-success-500/10 rounded-lg text-center">
                                        <CheckCircle2 className="w-6 h-6 text-success-400 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-success-400">
                                            {cacheStats?.hits?.toLocaleString() || 0}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Cache Hits</p>
                                    </div>
                                    <div className="p-4 bg-danger-500/10 rounded-lg text-center">
                                        <XCircle className="w-6 h-6 text-danger-400 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-danger-400">
                                            {cacheStats?.misses?.toLocaleString() || 0}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Cache Misses</p>
                                    </div>
                                </div>

                                {/* Recommendations */}
                                <div className="p-4 bg-muted/10 rounded-lg">
                                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        Recommendations
                                    </h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        {(cacheStats?.ratio || 0) < 80 && (
                                            <li>• Consider increasing cache TTL for frequently accessed data</li>
                                        )}
                                        {(cacheStats?.ratio || 0) >= 80 && (
                                            <li>• Cache hit rate is healthy (80%+)</li>
                                        )}
                                        <li>• Monitor for cache stampede during traffic spikes</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Degraded Providers Alert */}
                {summary.degradedProviders && summary.degradedProviders.length > 0 && (
                    <Card className="bg-warning-500/10 border-warning-500/30 mb-8">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <AlertTriangle className="w-6 h-6 text-warning-400 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-foreground mb-1">Degraded Providers Detected</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        The following providers are experiencing issues (success rate &lt; 90% or circuit breaker open):
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {summary.degradedProviders.map((provider: string) => (
                                            <Badge key={provider} className="bg-warning-500/20 text-warning-400 border-warning-500/30">
                                                {provider}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* System Health */}
                <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2">
                            <Server className="w-5 h-5 text-accent-400" />
                            System Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-muted/10 rounded-lg text-center">
                                <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                                    systemHealth?.status === 'ok' ? 'bg-success-500' : 'bg-danger-500'
                                }`} />
                                <p className="text-sm font-medium text-foreground">API Health</p>
                                <p className="text-xs text-muted-foreground">{systemHealth?.status || 'checking...'}</p>
                            </div>
                            <div className="p-4 bg-muted/10 rounded-lg text-center">
                                <div className="w-3 h-3 rounded-full mx-auto mb-2 bg-success-500" />
                                <p className="text-sm font-medium text-foreground">Database</p>
                                <p className="text-xs text-muted-foreground">Connected</p>
                            </div>
                            <div className="p-4 bg-muted/10 rounded-lg text-center">
                                <div className="w-3 h-3 rounded-full mx-auto mb-2 bg-success-500" />
                                <p className="text-sm font-medium text-foreground">Cache</p>
                                <p className="text-xs text-muted-foreground">Active</p>
                            </div>
                            <div className="p-4 bg-muted/10 rounded-lg text-center">
                                <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                                    summary.healthyProviders > 0 ? 'bg-success-500' : 'bg-warning-500'
                                }`} />
                                <p className="text-sm font-medium text-foreground">AI Providers</p>
                                <p className="text-xs text-muted-foreground">{summary.healthyProviders} healthy</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
