"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import {
    Activity,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    Clock,
    Zap,
    BarChart3,
    RefreshCw,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface MetricsData {
    totalRequests: number;
    totalErrors: number;
    averageLatency: number;
    p50Latency: number;
    p95Latency: number;
    p99Latency: number;
    errorRate: string;
    throughput: string;
    requestsByStatus: Record<number, number>;
    requestsByPath: Record<string, number>;
    lastUpdated: string;
}

export default function MetricsDashboard() {
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState(5000); // 5 seconds

    const { data: metrics, isLoading, refetch } = useQuery<{ success: boolean; metrics: MetricsData }>({
        queryKey: ['api-metrics'],
        queryFn: async () => {
            const response = await fetch('/api/metrics');
            if (!response.ok) throw new Error('Failed to fetch metrics');
            return response.json();
        },
        refetchInterval: autoRefresh ? refreshInterval : false,
    });

    const { data: recentMetrics } = useQuery<{ success: boolean; metrics: any[] }>({
        queryKey: ['api-metrics-recent'],
        queryFn: async () => {
            const response = await fetch('/api/metrics/recent?limit=50');
            if (!response.ok) throw new Error('Failed to fetch recent metrics');
            return response.json();
        },
        refetchInterval: autoRefresh ? refreshInterval : false,
    });

    const metricsData = metrics?.metrics;
    const recent = recentMetrics?.metrics || [];

    const stats = [
        {
            label: 'Total Requests',
            value: metricsData?.totalRequests || 0,
            icon: Activity,
            color: 'bg-blue-500',
            trend: null,
        },
        {
            label: 'Error Rate',
            value: metricsData?.errorRate || '0%',
            icon: AlertCircle,
            color: 'bg-red-500',
            trend: parseFloat(metricsData?.errorRate || '0') > 5 ? 'up' : 'down',
        },
        {
            label: 'Avg Latency',
            value: `${Math.round(metricsData?.averageLatency || 0)}ms`,
            icon: Clock,
            color: 'bg-green-500',
            trend: (metricsData?.averageLatency || 0) > 500 ? 'up' : 'down',
        },
        {
            label: 'Throughput',
            value: metricsData?.throughput || '0 req/s',
            icon: Zap,
            color: 'bg-purple-500',
            trend: null,
        },
    ];

    const latencyStats = [
        { label: 'P50', value: `${Math.round(metricsData?.p50Latency || 0)}ms`, color: 'text-green-600' },
        { label: 'P95', value: `${Math.round(metricsData?.p95Latency || 0)}ms`, color: 'text-yellow-600' },
        { label: 'P99', value: `${Math.round(metricsData?.p99Latency || 0)}ms`, color: 'text-red-600' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            API Metrics Dashboard
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Real-time API performance and health metrics
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={autoRefresh ? 'bg-primary-50' : ''}
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
                        </Button>
                        <Button variant="outline" onClick={() => refetch()}>
                            Refresh Now
                        </Button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    {stat.label}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color.replace('bg-', 'text-')}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                {stat.trend && (
                                    <div className="flex items-center text-xs text-slate-500 mt-1">
                                        {stat.trend === 'up' ? (
                                            <TrendingUp className="w-3 h-3 mr-1 text-red-500" />
                                        ) : (
                                            <TrendingDown className="w-3 h-3 mr-1 text-green-500" />
                                        )}
                                        {stat.trend === 'up' ? 'Increasing' : 'Decreasing'}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Latency Percentiles */}
                <Card>
                    <CardHeader>
                        <CardTitle>Latency Percentiles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            {latencyStats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className={`text-2xl font-bold ${stat.color}`}>
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Requests by Status */}
                {metricsData?.requestsByStatus && Object.keys(metricsData.requestsByStatus).length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Requests by Status Code</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {Object.entries(metricsData.requestsByStatus)
                                    .sort(([a], [b]) => parseInt(b) - parseInt(a))
                                    .map(([status, count]) => (
                                        <div key={status} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={
                                                        parseInt(status) >= 500
                                                            ? 'destructive'
                                                            : parseInt(status) >= 400
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {status}
                                                </Badge>
                                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                                    {parseInt(status) >= 500
                                                        ? 'Server Error'
                                                        : parseInt(status) >= 400
                                                        ? 'Client Error'
                                                        : 'Success'}
                                                </span>
                                            </div>
                                            <span className="font-semibold">{count as number}</span>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Top Endpoints */}
                {metricsData?.requestsByPath && Object.keys(metricsData.requestsByPath).length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Endpoints</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {Object.entries(metricsData.requestsByPath)
                                    .sort(([, a], [, b]) => (b as number) - (a as number))
                                    .slice(0, 10)
                                    .map(([path, count]) => (
                                        <div key={path} className="flex items-center justify-between">
                                            <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                {path}
                                            </code>
                                            <span className="font-semibold">{count as number}</span>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Recent Requests */}
                {recent.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Requests (Last 50)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1 max-h-96 overflow-y-auto">
                                {recent.slice(-20).reverse().map((metric: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between text-sm py-1 border-b border-slate-200 dark:border-slate-700 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                variant={
                                                    metric.statusCode >= 500
                                                        ? 'destructive'
                                                        : metric.statusCode >= 400
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                                className="w-12 text-center"
                                            >
                                                {metric.statusCode}
                                            </Badge>
                                            <code className="text-xs">{metric.method}</code>
                                            <span className="text-slate-600 dark:text-slate-400">
                                                {metric.path}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-slate-500">
                                                {metric.duration}ms
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {new Date(metric.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Loading State */}
                {isLoading && (
                    <Card>
                        <CardContent className="py-8 text-center">
                            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-slate-400" />
                            <p className="text-slate-600 dark:text-slate-400 mt-2">Loading metrics...</p>
                        </CardContent>
                    </Card>
                )}

                {/* Last Updated */}
                {metricsData?.lastUpdated && (
                    <div className="text-xs text-slate-500 text-center">
                        Last updated: {new Date(metricsData.lastUpdated).toLocaleString()}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
