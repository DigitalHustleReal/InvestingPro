"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { 
    Share2, 
    TrendingUp,
    MousePointerClick,
    MessageSquare,
    RefreshCw,
    Twitter,
    Linkedin,
    Send
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface SocialMediaMetrics {
    platform: 'twitter' | 'linkedin' | 'telegram' | 'whatsapp';
    posts: number;
    impressions: number;
    engagement: {
        likes: number;
        shares: number;
        comments: number;
        clicks: number;
    };
    engagementRate: number;
    clickThroughRate: number;
    conversions: number;
    conversionRate: number;
}

export default function SocialDashboard() {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

    // Fetch social media metrics
    const { data: metrics, isLoading, refetch } = useQuery<SocialMediaMetrics[]>({
        queryKey: ['social-metrics', timeRange],
        queryFn: async () => {
            const response = await fetch(`/api/social/analytics?range=${timeRange}`);
            if (!response.ok) throw new Error('Failed to fetch social metrics');
            const data = await response.json();
            return data.metrics || [];
        }
    });

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'twitter':
                return <Twitter className="w-5 h-5" />;
            case 'linkedin':
                return <Linkedin className="w-5 h-5" />;
            case 'telegram':
                return <Send className="w-5 h-5" />;
            case 'whatsapp':
                return <MessageSquare className="w-5 h-5" />;
            default:
                return <Share2 className="w-5 h-5" />;
        }
    };

    const totalPosts = metrics?.reduce((sum, m) => sum + m.posts, 0) || 0;
    const totalImpressions = metrics?.reduce((sum, m) => sum + m.impressions, 0) || 0;
    const totalEngagement = metrics?.reduce((sum, m) => 
        sum + m.engagement.likes + m.engagement.shares + m.engagement.comments + m.engagement.clicks, 0
    ) || 0;
    const totalClicks = metrics?.reduce((sum, m) => sum + m.engagement.clicks, 0) || 0;
    const avgEngagementRate = metrics && metrics.length > 0
        ? metrics.reduce((sum, m) => sum + m.engagementRate, 0) / metrics.length
        : 0;

    return (
        <AdminLayout>
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground dark:text-foreground">Social Media Dashboard</h1>
                        <p className="text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground mt-1">
                            Track social media performance and engagement
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
                        <p className="mt-4 text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground">Loading social metrics...</p>
                    </div>
                ) : metrics && metrics.length > 0 ? (
                    <>
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                                    <Share2 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalPosts}</div>
                                    <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                                        Across all platforms
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                                        {totalEngagement.toLocaleString()} total engagement
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{avgEngagementRate.toFixed(2)}%</div>
                                    <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                                        Average across platforms
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                                        To website
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Platform Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {metrics.map((platformMetrics) => (
                                <Card key={platformMetrics.platform}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 capitalize">
                                            {getPlatformIcon(platformMetrics.platform)}
                                            {platformMetrics.platform}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground">Posts</span>
                                                <span className="font-semibold">{platformMetrics.posts}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground">Impressions</span>
                                                <span className="font-semibold">{platformMetrics.impressions.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground">Engagement Rate</span>
                                                <span className="font-semibold">{platformMetrics.engagementRate.toFixed(2)}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground">Clicks</span>
                                                <span className="font-semibold">{platformMetrics.engagement.clicks.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground">CTR</span>
                                                <span className="font-semibold">{platformMetrics.clickThroughRate.toFixed(2)}%</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <Share2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
                        <p className="text-muted-foreground/70 dark:text-muted-foreground/70">No social media data available</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
