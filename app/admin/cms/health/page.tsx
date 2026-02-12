"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Activity, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

export default function CMSHealthPage() {
    const queryClient = useQueryClient();

    // Get health status
    const { data: healthData, isLoading } = useQuery({
        queryKey: ['cms-health'],
        queryFn: async () => {
            const response = await fetch('/api/cms/health');
            if (!response.ok) return null;
            const data = await response.json();
            return data.health;
        },
        refetchInterval: 30000
    });

    const health = healthData || { overall: 'unknown' };

    const getHealthColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'bg-primary-500/10 text-primary-400 border-primary-500/20';
            case 'degraded': return 'bg-accent-500/10 text-accent-400 border-accent-500/20';
            case 'unhealthy': return 'bg-danger-500/10 text-danger-400 border-danger-500/20';
            default: return 'bg-slate-500/10 text-muted-foreground dark:text-muted-foreground border-slate-500/20';
        }
    };

    const getHealthIcon = (status: string) => {
        switch (status) {
            case 'healthy': return CheckCircle;
            case 'degraded': return AlertCircle;
            case 'unhealthy': return XCircle;
            default: return Activity;
        }
    };

    const HealthIcon = getHealthIcon(health.overall);

    return (
        <AdminLayout>
            <div className="p-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground dark:text-foreground mb-2 flex items-center gap-3">
                            <Activity className="w-8 h-8 text-primary-400" />
                            System Health Monitor
                        </h1>
                        <p className="text-muted-foreground dark:text-muted-foreground">Monitor CMS system health and diagnostics</p>
                    </div>
                    <Button
                        onClick={() => queryClient.invalidateQueries({ queryKey: ['cms-health'] })}
                        variant="outline"
                        className="bg-white/5 border-border dark:border-border hover:bg-white/10"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>

                {/* Overall Status */}
                <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50">
                    <CardHeader className="border-b border-border/50 dark:border-border/50">
                        <CardTitle className="text-lg font-bold text-foreground dark:text-foreground flex items-center gap-3">
                            <HealthIcon className={cn(
                                "w-5 h-5",
                                health.overall === 'healthy' ? 'text-primary-400' :
                                health.overall === 'degraded' ? 'text-accent-400' :
                                health.overall === 'unhealthy' ? 'text-danger-400' :
                                'text-muted-foreground dark:text-muted-foreground'
                            )} />
                            Overall System Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <Badge className={cn("text-lg px-4 py-2", getHealthColor(health.overall))}>
                                    {health.overall?.toUpperCase() || 'UNKNOWN'}
                                </Badge>
                                {health.message && (
                                    <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-2">{health.message}</p>
                                )}
                            </div>
                            {isLoading && (
                                <RefreshCw className="w-5 h-5 text-muted-foreground dark:text-muted-foreground animate-spin" />
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Health Details */}
                {health.agents && (
                    <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50">
                        <CardHeader className="border-b border-border/50 dark:border-border/50">
                            <CardTitle className="text-lg font-bold text-foreground dark:text-foreground">Agent Health</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(health.agents || {}).map(([agent, status]: [string, any]) => (
                                    <div key={agent} className="p-4 bg-white/5 rounded-xl border border-border/50 dark:border-border/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-foreground dark:text-foreground">{agent}</span>
                                            <Badge className={getHealthColor(status.status || 'unknown')}>
                                                {status.status || 'unknown'}
                                            </Badge>
                                        </div>
                                        {status.message && (
                                            <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">{status.message}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* System Metrics */}
                {health.metrics && (
                    <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50">
                        <CardHeader className="border-b border-border/50 dark:border-border/50">
                            <CardTitle className="text-lg font-bold text-foreground dark:text-foreground">System Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {Object.entries(health.metrics || {}).map(([metric, value]: [string, any]) => (
                                    <div key={metric} className="p-4 bg-white/5 rounded-xl border border-border/50 dark:border-border/50">
                                        <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground mb-1">{metric}</p>
                                        <p className="text-2xl font-bold text-foreground dark:text-foreground">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Error Details */}
                {health.error && (
                    <Card className="bg-rose-500/10 border-rose-500/20">
                        <CardHeader className="border-b border-rose-500/20">
                            <CardTitle className="text-lg font-bold text-danger-400 flex items-center gap-3">
                                <XCircle className="w-5 h-5" />
                                System Errors
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="text-sm text-danger-300">{health.error}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
