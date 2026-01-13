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
            case 'unhealthy': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
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
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <Activity className="w-8 h-8 text-primary-400" />
                            System Health Monitor
                        </h1>
                        <p className="text-slate-400">Monitor CMS system health and diagnostics</p>
                    </div>
                    <Button
                        onClick={() => queryClient.invalidateQueries({ queryKey: ['cms-health'] })}
                        variant="outline"
                        className="bg-white/5 border-white/10 hover:bg-white/10"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>

                {/* Overall Status */}
                <Card className="bg-white/[0.03] border-white/5">
                    <CardHeader className="border-b border-white/5">
                        <CardTitle className="text-lg font-bold text-white flex items-center gap-3">
                            <HealthIcon className={cn(
                                "w-5 h-5",
                                health.overall === 'healthy' ? 'text-primary-400' :
                                health.overall === 'degraded' ? 'text-accent-400' :
                                health.overall === 'unhealthy' ? 'text-rose-400' :
                                'text-slate-400'
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
                                    <p className="text-sm text-slate-400 mt-2">{health.message}</p>
                                )}
                            </div>
                            {isLoading && (
                                <RefreshCw className="w-5 h-5 text-slate-400 animate-spin" />
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Health Details */}
                {health.agents && (
                    <Card className="bg-white/[0.03] border-white/5">
                        <CardHeader className="border-b border-white/5">
                            <CardTitle className="text-lg font-bold text-white">Agent Health</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(health.agents || {}).map(([agent, status]: [string, any]) => (
                                    <div key={agent} className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-white">{agent}</span>
                                            <Badge className={getHealthColor(status.status || 'unknown')}>
                                                {status.status || 'unknown'}
                                            </Badge>
                                        </div>
                                        {status.message && (
                                            <p className="text-xs text-slate-400 mt-1">{status.message}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* System Metrics */}
                {health.metrics && (
                    <Card className="bg-white/[0.03] border-white/5">
                        <CardHeader className="border-b border-white/5">
                            <CardTitle className="text-lg font-bold text-white">System Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {Object.entries(health.metrics || {}).map(([metric, value]: [string, any]) => (
                                    <div key={metric} className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-sm font-medium text-slate-400 mb-1">{metric}</p>
                                        <p className="text-2xl font-bold text-white">{value}</p>
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
                            <CardTitle className="text-lg font-bold text-rose-400 flex items-center gap-3">
                                <XCircle className="w-5 h-5" />
                                System Errors
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="text-sm text-rose-300">{health.error}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
