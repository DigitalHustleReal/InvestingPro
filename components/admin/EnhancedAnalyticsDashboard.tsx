"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { 
    TrendingUp, 
    Eye, 
    FileText, 
    BarChart3, 
    Download,
    Calendar,
    Users,
    MousePointerClick,
    DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

type DateRange = 'today' | '7d' | '30d' | '90d' | 'all';

interface AnalyticsData {
    overview: {
        totalArticles: number;
        totalViews: number;
        totalUsers: number;
        totalClicks: number;
        totalRevenue: number;
    };
    timeSeries: {
        date: string;
        views: number;
        users: number;
        clicks: number;
    }[];
    topContent: {
        id: string;
        title: string;
        slug: string;
        views: number;
        category: string;
    }[];
    categoryBreakdown: {
        category: string;
        articleCount: number;
        totalViews: number;
    }[];
    conversionFunnel: {
        stage: string;
        users: number;
        conversionRate: number;
    }[];
}

/**
 * Enhanced Analytics Dashboard
 * 
 * Advanced analytics with:
 * - Date range filtering
 * - Interactive charts
 * - Export functionality
 * - Real-time metrics
 * - Funnel analysis
 */
export default function EnhancedAnalyticsDashboard() {
    const [dateRange, setDateRange] = useState<DateRange>('30d');

    const { data: analytics, isLoading } = useQuery<AnalyticsData>({
        queryKey: ['analytics', dateRange],
        queryFn: async () => {
            const response = await fetch(`/api/analytics/enhanced?range=${dateRange}`);
            if (!response.ok) throw new Error('Failed to fetch analytics');
            return response.json();
        },
        refetchInterval: 60000 // Refresh every minute
    });

    const exportData = () => {
        if (!analytics) return;
        
        // Convert to CSV
        const csv = convertToCSV(analytics);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-wt-surface/50 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-wt-text">
                        Analytics Dashboard
                    </h2>
                    <p className="text-sm text-wt-text-muted mt-1">
                        Comprehensive platform analytics and insights
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Date Range Selector */}
                    <div className="flex items-center gap-2 bg-wt-card rounded-lg p-1">
                        {(['today', '7d', '30d', '90d', 'all'] as DateRange[]).map((range) => (
                            <button
                                key={range}
                                onClick={() => setDateRange(range)}
                                className={cn(
                                    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                                    dateRange === range
                                        ? "bg-wt-surface text-wt-gold shadow-sm"
                                        : "text-wt-text-muted hover:text-wt-text"
                                )}
                            >
                                {range === 'today' ? 'Today' : 
                                 range === '7d' ? '7 Days' :
                                 range === '30d' ? '30 Days' :
                                 range === '90d' ? '90 Days' : 'All Time'}
                            </button>
                        ))}
                    </div>
                    <Button onClick={exportData} variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-5 gap-4">
                <MetricCard
                    label="Total Views"
                    value={analytics?.overview.totalViews || 0}
                    icon={Eye}
                    color="primary"
                />
                <MetricCard
                    label="Unique Users"
                    value={analytics?.overview.totalUsers || 0}
                    icon={Users}
                    color="accent"
                />
                <MetricCard
                    label="Total Articles"
                    value={analytics?.overview.totalArticles || 0}
                    icon={FileText}
                    color="primary"
                />
                <MetricCard
                    label="Total Clicks"
                    value={analytics?.overview.totalClicks || 0}
                    icon={MousePointerClick}
                    color="success"
                />
                <MetricCard
                    label="Revenue"
                    value={`₹${(analytics?.overview.totalRevenue || 0).toLocaleString()}`}
                    icon={DollarSign}
                    color="accent"
                    isRevenue
                />
            </div>

            {/* Time Series Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-wt-gold" />
                        Traffic Trends
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <TimeSeriesChart data={analytics?.timeSeries || []} />
                </CardContent>
            </Card>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6">
                {/* Top Content */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-wt-gold" />
                            Top Performing Content
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TopContentList content={analytics?.topContent || []} />
                    </CardContent>
                </Card>

                {/* Category Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-wt-gold" />
                            Category Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CategoryBreakdown categories={analytics?.categoryBreakdown || []} />
                    </CardContent>
                </Card>
            </div>

            {/* Conversion Funnel */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-wt-gold" />
                        Conversion Funnel
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ConversionFunnel funnel={analytics?.conversionFunnel || []} />
                </CardContent>
            </Card>
        </div>
    );
}

function MetricCard({ 
    label, 
    value, 
    icon: Icon, 
    color,
    isRevenue = false
}: { 
    label: string; 
    value: number | string; 
    icon: any; 
    color: 'primary' | 'accent' | 'success';
    isRevenue?: boolean;
}) {
    const colorClasses = {
        primary: 'bg-wt-gold-subtle text-wt-gold',
        accent: 'bg-wt-gold-subtle text-wt-gold',
        success: 'bg-wt-green-subtle text-wt-green'
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colorClasses[color])}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="secondary" className="text-[9px]">
                        Live
                    </Badge>
                </div>
                <div className="text-3xl font-bold text-wt-text">
                    {typeof value === 'number' && !isRevenue ? value.toLocaleString() : value}
                </div>
                <div className="text-xs text-wt-text-muted mt-1">
                    {label}
                </div>
            </CardContent>
        </Card>
    );
}

function TimeSeriesChart({ data }: { data: any[] }) {
    if (data.length === 0) {
        return <div className="text-center py-8 text-wt-text-muted">No data available</div>;
    }

    const maxViews = Math.max(...data.map(d => d.views));

    return (
        <div className="space-y-4">
            <div className="h-64 flex items-end gap-2">
                {data.map((point, idx) => {
                    const height = (point.views / maxViews) * 100;
                    return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-wt-card rounded-t-lg relative group">
                                <div 
                                    className="w-full bg-gradient-to-t from-wt-gold to-wt-gold-hover rounded-t-lg transition-all duration-300"
                                    style={{ height: `${height}%`, minHeight: '4px' }}
                                />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-wt-nav text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {point.views.toLocaleString()} views
                                </div>
                            </div>
                            <div className="text-[10px] text-wt-text-muted">
                                {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function TopContentList({ content }: { content: any[] }) {
    return (
        <div className="space-y-3">
            {content.slice(0, 5).map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-wt-surface-hover transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                        <div className={cn(
                            "w-6 h-6 rounded flex items-center justify-center text-xs font-bold",
                            idx === 0 ? "bg-wt-gold-subtle text-wt-gold" :
                            "bg-wt-card text-wt-text-muted"
                        )}>
                            {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-wt-text truncate">
                                {item.title}
                            </div>
                            <div className="text-xs text-wt-text-muted capitalize">
                                {item.category?.replace(/-/g, ' ')}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-wt-text">
                        <Eye className="w-4 h-4 text-wt-text-dim" />
                        {item.views.toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
}

function CategoryBreakdown({ categories }: { categories: any[] }) {
    const maxViews = Math.max(...categories.map(c => c.totalViews));

    return (
        <div className="space-y-4">
            {categories.slice(0, 5).map((cat) => {
                const percentage = maxViews > 0 ? (cat.totalViews / maxViews) * 100 : 0;
                
                return (
                    <div key={cat.category} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-wt-text capitalize font-medium">
                                {cat.category?.replace(/-/g, ' ') || 'Uncategorized'}
                            </span>
                            <span className="text-wt-text-muted">
                                {cat.totalViews.toLocaleString()} views
                            </span>
                        </div>
                        <div className="h-2 bg-wt-card rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-wt-gold to-wt-gold-hover rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ConversionFunnel({ funnel }: { funnel: any[] }) {
    return (
        <div className="space-y-4">
            {funnel.map((stage, idx) => {
                const isFirst = idx === 0;
                const width = isFirst ? 100 : stage.conversionRate;
                
                return (
                    <div key={stage.stage} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-wt-text font-medium">
                                {stage.stage}
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="text-wt-text-muted">
                                    {stage.users.toLocaleString()} users
                                </span>
                                {!isFirst && (
                                    <Badge variant="secondary">
                                        {stage.conversionRate.toFixed(1)}%
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="h-12 bg-wt-card rounded-lg overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-wt-gold to-wt-gold-hover flex items-center justify-center text-white font-semibold text-sm transition-all duration-500"
                                style={{ width: `${width}%` }}
                            >
                                {stage.users.toLocaleString()}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function convertToCSV(data: AnalyticsData): string {
    const headers = ['Date', 'Views', 'Users', 'Clicks'];
    const rows = data.timeSeries.map(point => [
        point.date,
        point.views,
        point.users,
        point.clicks
    ]);
    
    return [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
}
