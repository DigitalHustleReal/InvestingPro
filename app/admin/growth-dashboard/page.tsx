"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { 
    TrendingUp, 
    TrendingDown, 
    Users, 
    DollarSign,
    MousePointerClick,
    BarChart3,
    PieChart,
    RefreshCw,
    Calendar
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface GrowthMetrics {
    acquisition: {
        totalVisitors: number;
        newVisitors: number;
        returningVisitors: number;
        trafficSources: Array<{ source: string; count: number; percentage: number }>;
    };
    retention: {
        returningUsers: number;
        retentionRate: number;
        averageSessions: number;
    };
    revenue: {
        totalRevenue: number;
        revenuePerUser: number;
        conversionRate: number;
        averageOrderValue: number;
    };
    trends: {
        daily: Array<{ date: string; visitors: number; revenue: number }>;
        weekly: Array<{ week: string; visitors: number; revenue: number }>;
        monthly: Array<{ month: string; visitors: number; revenue: number }>;
    };
}

export default function GrowthDashboard() {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

    // Fetch growth metrics
    const { data: metrics, isLoading, refetch } = useQuery<GrowthMetrics>({
        queryKey: ['growth-metrics', timeRange],
        queryFn: async () => {
            const response = await fetch(`/api/growth/metrics?range=${timeRange}`);
            if (!response.ok) throw new Error('Failed to fetch growth metrics');
            return response.json();
        },
        refetchInterval: 60000 // Refetch every minute
    });

    const getTrendIcon = (value: number) => {
        if (value > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
        if (value < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
        return null;
    };

    const getTrendColor = (value: number) => {
        if (value > 0) return 'text-green-600';
        if (value < 0) return 'text-red-600';
        return 'text-muted-foreground/70 dark:text-muted-foreground/70';
    };

    return (
        <AdminLayout>
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground dark:text-foreground">Growth Dashboard</h1>
                        <p className="text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground mt-1">
                            Track acquisition, retention, and revenue metrics
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
                        <p className="mt-4 text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground">Loading growth metrics...</p>
                    </div>
                ) : metrics ? (
                    <>
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metrics.acquisition.totalVisitors.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                                        {metrics.acquisition.newVisitors} new, {metrics.acquisition.returningVisitors} returning
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metrics.retention.retentionRate.toFixed(1)}%</div>
                                    <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                                        {metrics.retention.returningUsers} returning users
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">₹{metrics.revenue.totalRevenue.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                                        ₹{metrics.revenue.revenuePerUser.toFixed(2)} per user
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metrics.revenue.conversionRate.toFixed(2)}%</div>
                                    <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                                        Avg order: ₹{metrics.revenue.averageOrderValue.toLocaleString()}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Traffic Sources */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChart className="w-5 h-5" />
                                    Traffic Sources
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {metrics.acquisition.trafficSources.map((source, idx) => (
                                        <div key={source.source} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-3 h-3 rounded-full",
                                                    idx === 0 ? "bg-primary-600" :
                                                    idx === 1 ? "bg-secondary-600" :
                                                    idx === 2 ? "bg-success-600" :
                                                    "bg-gray-400"
                                                )} />
                                                <span className="font-medium capitalize">{source.source}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground">
                                                    {source.count.toLocaleString()} ({source.percentage.toFixed(1)}%)
                                                </span>
                                                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className={cn(
                                                            "h-2 rounded-full",
                                                            idx === 0 ? "bg-primary-600" :
                                                            idx === 1 ? "bg-secondary-600" :
                                                            idx === 2 ? "bg-success-600" :
                                                            "bg-gray-400"
                                                        )}
                                                        style={{ width: `${source.percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Growth Trends */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5" />
                                        Visitor Trends
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {metrics.trends.daily.slice(-7).map((day, idx) => (
                                            <div key={day.date} className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground">
                                                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-medium">{day.visitors.toLocaleString()}</span>
                                                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                        <div
                                                            className="bg-primary-600 h-2 rounded-full"
                                                            style={{ 
                                                                width: `${(day.visitors / Math.max(...metrics.trends.daily.map(d => d.visitors))) * 100}%` 
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="w-5 h-5" />
                                        Revenue Trends
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {metrics.trends.daily.slice(-7).map((day, idx) => (
                                            <div key={day.date} className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground">
                                                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-medium">₹{day.revenue.toLocaleString()}</span>
                                                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                        <div
                                                            className="bg-success-600 h-2 rounded-full"
                                                            style={{ 
                                                                width: `${(day.revenue / Math.max(...metrics.trends.daily.map(d => d.revenue), 1)) * 100}%` 
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-40" />
                        <p className="text-muted-foreground/70 dark:text-muted-foreground/70">No growth data available</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
