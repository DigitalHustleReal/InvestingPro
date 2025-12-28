"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
    BarChart3,
    FileText,
    DollarSign,
    Users,
    TrendingUp,
    Eye,
    MousePointerClick,
    Star,
    Sparkles,
    CheckCircle2,
    XCircle,
    Rss,
    Share2,
    Activity,
    Database,
    Zap,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    Play,
    Pause,
    AlertCircle,
    CheckCircle,
    Clock,
    Globe,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    LayoutDashboard
} from "lucide-react";
import ArticleModeration from "@/components/admin/ArticleModeration";
import AdminLayout from "@/components/admin/AdminLayout";
import ContextualSidebar from "@/components/admin/ContextualSidebar";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ContentPerformanceTracking from "@/components/admin/ContentPerformanceTracking";

export default function AdminPage() {
    const [timeRange, setTimeRange] = useState('30d');
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [reviewToReject, setReviewToReject] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [contextualSidebarCollapsed, setContextualSidebarCollapsed] = useState(false);
    const queryClient = useQueryClient();

    // Content Data
    const { data: articles = [] } = useQuery({
        queryKey: ['articles'],
        queryFn: () => api.entities.Article.list('-created_date', 100),
        initialData: []
    });

    // Monetization Data
    const { data: affiliateProducts = [] } = useQuery({
        queryKey: ['affiliateProducts'],
        queryFn: () => api.entities.AffiliateProduct.list('-clicks', 50),
        initialData: []
    });

    const { data: reviews = [] } = useQuery({
        queryKey: ['reviews-all'],
        queryFn: () => api.entities.Review.list('-created_date', 100),
        initialData: []
    });

    const { data: pendingArticles = [] } = useQuery({
        queryKey: ['pending-articles'],
        queryFn: async () => {
            const articles = await api.entities.Article.filter({
                is_user_submission: true,
                submission_status: 'pending'
            });
            return articles.sort((a: any, b: any) => {
                const dateA = new Date(a.created_date || a.created_at || 0).getTime();
                const dateB = new Date(b.created_date || b.created_at || 0).getTime();
                return dateB - dateA;
            });
        },
        initialData: []
    });

    const { data: adPlacements = [] } = useQuery({
        queryKey: ['adPlacements'],
        queryFn: () => api.entities.AdPlacement.list(),
        initialData: []
    });

    // Scraper Status - Real API
    const { data: scraperStatus = { status: 'idle', lastRun: null, successRate: 0 } } = useQuery({
        queryKey: ['scraper-status'],
        queryFn: async () => {
            try {
                // Get last pipeline run as scraper status
                const response = await fetch('/api/pipeline/runs?limit=1');
                if (!response.ok) return { status: 'idle', lastRun: null, successRate: 0 };
                const data = await response.json();
                const lastRun = data.runs?.[0];
                if (!lastRun) return { status: 'idle', lastRun: null, successRate: 0 };
                return {
                    status: lastRun.status === 'completed' ? 'success' : lastRun.status === 'failed' ? 'error' : 'running',
                    lastRun: lastRun.started_at ? new Date(lastRun.started_at) : null,
                    successRate: lastRun.status === 'completed' ? 100 : 0,
                    productsScraped: lastRun.rss_items_scraped || 0,
                    reviewsScraped: 0,
                    ratesScraped: 0
                };
            } catch (error) {
                console.error('Failed to fetch scraper status:', error);
                return { status: 'idle', lastRun: null, successRate: 0 };
            }
        },
        refetchInterval: 30000
    });

    // RSS Feeds - Real API
    const { data: rssFeedsData } = useQuery({
        queryKey: ['rss-feeds'],
        queryFn: async () => {
            try {
                const response = await fetch('/api/rss-feeds/scrape', { method: 'POST' });
                if (!response.ok) return [];
                const data = await response.json();
                return data.results || [];
            } catch (error) {
                console.error('Failed to fetch RSS feeds:', error);
                return [];
            }
        }
    });
    const rssFeeds = Array.isArray(rssFeedsData) ? rssFeedsData : [];

    // Social Media Metrics - Real API
    const { data: socialMetrics = {} } = useQuery({
        queryKey: ['social-metrics'],
        queryFn: async () => {
            try {
                const response = await fetch('/api/social-media/metrics');
                if (!response.ok) return {};
                const data = await response.json();
                return data.metrics || {};
            } catch (error) {
                console.error('Failed to fetch social media metrics:', error);
                return {};
            }
        }
    });

    // Content Pipeline Status - Real API
    const { data: pipelineStatus = {} } = useQuery({
        queryKey: ['pipeline-status'],
        queryFn: async () => {
            try {
                const response = await fetch('/api/pipeline/runs?limit=100');
                if (!response.ok) return { completed: 0, failed: 0, pending: 0 };
                const data = await response.json();
                const runs = data.runs || [];
                const completed = runs.filter((r: any) => r.status === 'completed').length;
                const failed = runs.filter((r: any) => r.status === 'failed').length;
                const lastRun = runs[0]?.started_at ? new Date(runs[0].started_at) : null;
                const avgTime = runs.length > 0 
                    ? `${(runs.reduce((sum: number, r: any) => sum + (r.duration_ms || 0), 0) / runs.length / 1000 / 60).toFixed(1)} min`
                    : '0 min';
                return {
                    active: 0,
                    completed,
                    failed,
                    pending: 0,
                    lastRun,
                    avgTime
                };
            } catch (error) {
                console.error('Failed to fetch pipeline status:', error);
                return { completed: 0, failed: 0, pending: 0 };
            }
        },
        refetchInterval: 30000 // Refresh every 30 seconds
    });

    // Trends Data - Real API
    const { data: trendsData } = useQuery({
        queryKey: ['trends'],
        queryFn: async () => {
            try {
                const response = await fetch('/api/scraper/trending');
                if (!response.ok) return [];
                const data = await response.json();
                return data.topics || [];
            } catch (error) {
                console.error('Failed to fetch trends:', error);
                return [];
            }
        },
        refetchInterval: 60000 // Refresh every minute
    });
    const trends = Array.isArray(trendsData) ? trendsData : [];

    // Calculate metrics
    const totalViews = Array.isArray(articles) ? articles.reduce((sum: number, a: any) => sum + (a.views || 0), 0) : 0;
    const totalClicks = Array.isArray(affiliateProducts) ? affiliateProducts.reduce((sum: number, p: any) => sum + (p.clicks || 0), 0) : 0;
    const totalConversions = Array.isArray(affiliateProducts) ? affiliateProducts.reduce((sum: number, p: any) => sum + (p.conversions || 0), 0) : 0;
    const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : 0;
    const pendingReviews = Array.isArray(reviews) ? reviews.filter((r: any) => r.status === 'pending') : [];
    const pendingReviewsCount = pendingReviews.length;
    const pendingArticlesCount = pendingArticles.length;

    const stats = [
        {
            label: 'Total Articles',
            value: articles.length,
            icon: FileText,
            color: 'bg-blue-500',
            change: '+12 this month',
            trend: 'up'
        },
        {
            label: 'Total Views',
            value: totalViews.toLocaleString(),
            icon: Eye,
            color: 'bg-purple-500',
            change: '+23% vs last month',
            trend: 'up'
        },
        {
            label: 'Affiliate Clicks',
            value: totalClicks.toLocaleString(),
            icon: MousePointerClick,
            color: 'bg-emerald-500',
            change: `${conversionRate}% conversion`,
            trend: 'up'
        },
        {
            label: 'Pending Reviews',
            value: pendingReviewsCount,
            icon: Star,
            color: 'bg-amber-500',
            change: 'Needs moderation',
            trend: pendingReviewsCount > 0 ? 'down' : 'up'
        },
    ];

    const alertStats = [];
    if (pendingArticlesCount > 0) {
        alertStats.push({
            label: 'Pending Articles',
            value: pendingArticlesCount,
            icon: FileText,
            color: 'bg-rose-500',
            change: 'User submissions',
            trend: 'down'
        });
    }

    // Contextual sidebar items for Analyze page
    const contextualSidebarItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'performance', label: 'Performance', icon: BarChart3 },
        { id: 'content', label: 'Content Stats', icon: FileText },
        { id: 'automation', label: 'Automation', icon: Zap },
        { id: 'social', label: 'Social Analytics', icon: Share2 },
        { id: 'trends', label: 'Trends', icon: TrendingUp },
    ];

    return (
        <AdminLayout
            contextualSidebar={
                <ContextualSidebar
                    items={contextualSidebarItems}
                    activeItem={activeTab}
                    onItemChange={setActiveTab}
                    title="Analyze"
                    collapsed={contextualSidebarCollapsed}
                    onToggle={() => setContextualSidebarCollapsed(!contextualSidebarCollapsed)}
                />
            }
        >
            <div className="h-full flex flex-col bg-slate-50">
                <div className="bg-white border-b border-slate-200 px-8 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Analyze</h1>
                            <p className="text-sm text-slate-600">Track content performance, reviews, social media metrics, and platform analytics</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries()}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh All
                            </Button>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto px-8 py-6 max-w-7xl mx-auto w-full">
                    {/* Horizontal Tabs Navigation */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                        <TabsList className="bg-white border border-slate-200 rounded-lg p-1 h-auto">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="performance" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Performance
                            </TabsTrigger>
                            <TabsTrigger value="content" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                                <FileText className="w-4 h-4 mr-2" />
                                Content Stats
                            </TabsTrigger>
                            <TabsTrigger value="automation" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                                <Zap className="w-4 h-4 mr-2" />
                                Automation
                            </TabsTrigger>
                            <TabsTrigger value="social" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                                <Share2 className="w-4 h-4 mr-2" />
                                Social Analytics
                            </TabsTrigger>
                            <TabsTrigger value="trends" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Trends
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Main Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[...stats, ...alertStats].slice(0, 4).map((stat, index) => (
                            <Card key={index}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center shadow-lg`}>
                                            <stat.icon className="w-6 h-6 text-white" />
                                        </div>
                                        {stat.trend && (
                                            <div className={`flex items-center gap-1 text-xs font-semibold ${
                                                stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                                            }`}>
                                                {stat.trend === 'up' ? (
                                                    <ArrowUpRight className="w-4 h-4" />
                                                ) : (
                                                    <ArrowDownRight className="w-4 h-4" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                                    <p className="text-xs text-slate-400 font-medium">{stat.change}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* System Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Scraper Status */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Database className="w-5 h-5 text-blue-600" />
                                    Scraper Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Status</span>
                                        <Badge className={scraperStatus.status === 'running' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                                            {scraperStatus.status === 'running' ? (
                                                <>
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Running
                                                </>
                                            ) : (
                                                <>
                                                    <Pause className="w-3 h-3 mr-1" />
                                                    Paused
                                                </>
                                            )}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Success Rate</span>
                                        <span className="text-sm font-semibold text-slate-900">{scraperStatus.successRate || 0}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Last Run</span>
                                        <span className="text-xs text-slate-500">
                                            {scraperStatus.lastRun ? new Date(scraperStatus.lastRun).toLocaleTimeString() : 'Never'}
                                        </span>
                                    </div>
                                    {scraperStatus.productsScraped && (
                                        <div className="pt-2 border-t">
                                            <div className="grid grid-cols-3 gap-2 text-xs">
                                                <div>
                                                    <div className="text-slate-500">Products</div>
                                                    <div className="font-semibold">{scraperStatus.productsScraped}</div>
                                                </div>
                                                <div>
                                                    <div className="text-slate-500">Reviews</div>
                                                    <div className="font-semibold">{scraperStatus.reviewsScraped}</div>
                                                </div>
                                                <div>
                                                    <div className="text-slate-500">Rates</div>
                                                    <div className="font-semibold">{scraperStatus.ratesScraped}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Content Pipeline */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-purple-600" />
                                    Content Pipeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Active Jobs</span>
                                        <Badge className="bg-blue-100 text-blue-700">{pipelineStatus.active || 0}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Completed</span>
                                        <span className="text-sm font-semibold text-slate-900">{pipelineStatus.completed || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Failed</span>
                                        <span className="text-sm font-semibold text-rose-600">{pipelineStatus.failed || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Avg Time</span>
                                        <span className="text-xs text-slate-500">{pipelineStatus.avgTime || 'N/A'}</span>
                                    </div>
                                    <div className="pt-2 border-t">
                                        <Button size="sm" variant="outline" className="w-full">
                                            <Play className="w-4 h-4 mr-2" />
                                            Run Pipeline
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* RSS Feeds */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Rss className="w-5 h-5 text-orange-600" />
                                    RSS Feeds
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Active Feeds</span>
                                        <Badge className="bg-emerald-100 text-emerald-700">
                                            {Array.isArray(rssFeeds) ? rssFeeds.filter((f: any) => f?.status === 'active').length : 0}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        {Array.isArray(rssFeeds) && rssFeeds.slice(0, 3).map((feed: any) => (
                                            <div key={feed.id} className="flex items-center justify-between text-xs">
                                                <span className="text-slate-600 truncate flex-1">{feed.name}</span>
                                                <Badge variant="outline" className="ml-2">{feed.itemsCount || 0}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-2 border-t">
                                        <Button size="sm" variant="outline" className="w-full">
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Refresh All
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Social Media Metrics */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Share2 className="w-5 h-5 text-blue-600" />
                                Social Media Metrics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {socialMetrics.facebook && (
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <Facebook className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-slate-900">{socialMetrics.facebook.followers?.toLocaleString()}</div>
                                        <div className="text-xs text-slate-600">Followers</div>
                                        <div className="text-xs text-emerald-600 mt-1">+{socialMetrics.facebook.engagement}% engagement</div>
                                    </div>
                                )}
                                {socialMetrics.twitter && (
                                    <div className="text-center p-4 bg-sky-50 rounded-lg">
                                        <Twitter className="w-6 h-6 text-sky-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-slate-900">{socialMetrics.twitter.followers?.toLocaleString()}</div>
                                        <div className="text-xs text-slate-600">Followers</div>
                                        <div className="text-xs text-emerald-600 mt-1">+{socialMetrics.twitter.engagement}% engagement</div>
                                    </div>
                                )}
                                {socialMetrics.linkedin && (
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <Linkedin className="w-6 h-6 text-blue-700 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-slate-900">{socialMetrics.linkedin.followers?.toLocaleString()}</div>
                                        <div className="text-xs text-slate-600">Followers</div>
                                        <div className="text-xs text-emerald-600 mt-1">+{socialMetrics.linkedin.engagement}% engagement</div>
                                    </div>
                                )}
                                {socialMetrics.instagram && (
                                    <div className="text-center p-4 bg-pink-50 rounded-lg">
                                        <Instagram className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-slate-900">{socialMetrics.instagram.followers?.toLocaleString()}</div>
                                        <div className="text-xs text-slate-600">Followers</div>
                                        <div className="text-xs text-emerald-600 mt-1">+{socialMetrics.instagram.engagement}% engagement</div>
                                    </div>
                                )}
                                {socialMetrics.youtube && (
                                    <div className="text-center p-4 bg-red-50 rounded-lg">
                                        <Youtube className="w-6 h-6 text-red-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-slate-900">{socialMetrics.youtube.subscribers?.toLocaleString()}</div>
                                        <div className="text-xs text-slate-600">Subscribers</div>
                                        <div className="text-xs text-slate-600 mt-1">{socialMetrics.youtube.views?.toLocaleString()} views</div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Trends */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                                Trending Keywords
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {Array.isArray(trends) && trends.map((trend: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex-1">
                                            <div className="font-semibold text-slate-900">{trend.keyword}</div>
                                            <div className="text-xs text-slate-500">Volume: {trend.volume?.toLocaleString()}</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`text-sm font-semibold ${
                                                trend.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                                            }`}>
                                                {trend.trend === 'up' ? '+' : ''}{trend.change}%
                                            </div>
                                            {trend.trend === 'up' ? (
                                                <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                                            ) : (
                                                <ArrowDownRight className="w-5 h-5 text-rose-600" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content - Tabs controlled by horizontal tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

                        {/* Overview Tab - Key Metrics */}
                        <TabsContent value="overview">
                            <div className="space-y-6">
                                {/* Content Overview */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Content Overview</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                                <div className="text-2xl font-bold text-blue-600">{articles.length}</div>
                                                <div className="text-sm text-slate-600">Total Articles</div>
                                                <div className="text-xs text-slate-500 mt-1">
                                                    {Array.isArray(articles) ? articles.filter((a: any) => a.status === 'published').length : 0} published
                                                </div>
                                            </div>
                                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                                <div className="text-2xl font-bold text-purple-600">{totalViews.toLocaleString()}</div>
                                                <div className="text-sm text-slate-600">Total Views</div>
                                                <div className="text-xs text-slate-500 mt-1">All time</div>
                                            </div>
                                            <div className="text-center p-4 bg-emerald-50 rounded-lg">
                                                <div className="text-2xl font-bold text-emerald-600">{Array.isArray(articles) ? articles.filter((a: any) => a.ai_generated).length : 0}</div>
                                                <div className="text-sm text-slate-600">AI Generated</div>
                                                <div className="text-xs text-slate-500 mt-1">Articles</div>
                                            </div>
                                            <div className="text-center p-4 bg-amber-50 rounded-lg">
                                                <div className="text-2xl font-bold text-amber-600">{pendingArticlesCount}</div>
                                                <div className="text-sm text-slate-600">Pending</div>
                                                <div className="text-xs text-slate-500 mt-1">Submissions</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Platform Performance */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Platform Performance</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="p-4 bg-slate-50 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-semibold text-slate-700">Articles Published</span>
                                                    <FileText className="w-4 h-4 text-slate-500" />
                                                </div>
                                                <div className="text-2xl font-bold text-slate-900">
                                                    {Array.isArray(articles) ? articles.filter((a: any) => a.status === 'published').length : 0}
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1">This month</div>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-semibold text-slate-700">Reviews Received</span>
                                                    <Star className="w-4 h-4 text-slate-500" />
                                                </div>
                                                <div className="text-2xl font-bold text-slate-900">{reviews.length}</div>
                                                <div className="text-xs text-slate-500 mt-1">
                                                    {pendingReviewsCount} pending approval
                                                </div>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-semibold text-slate-700">Affiliate Clicks</span>
                                                    <MousePointerClick className="w-4 h-4 text-slate-500" />
                                                </div>
                                                <div className="text-2xl font-bold text-slate-900">{totalClicks.toLocaleString()}</div>
                                                <div className="text-xs text-slate-500 mt-1">{conversionRate}% conversion rate</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Moderation - REMOVED (Use sidebar "Review Queue" instead) */}

                        {/* Performance Tracking */}
                        <TabsContent value="performance">
                            <ContentPerformanceTracking timeRange={timeRange as '7d' | '30d' | '90d'} />
                        </TabsContent>

                        {/* Content Stats - Tracking Only */}
                        <TabsContent value="content">
                            <div className="space-y-6">
                                {/* Content Statistics */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Content Statistics</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                            <div className="text-center p-6 bg-blue-50 rounded-lg">
                                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                                    {Array.isArray(articles) ? articles.filter((a: any) => a.status === 'published').length : 0}
                                                </div>
                                                <div className="text-sm font-semibold text-slate-700 mb-1">Published Articles</div>
                                                <div className="text-xs text-slate-500">
                                                    {Array.isArray(articles) ? articles.filter((a: any) => a.status === 'draft').length : 0} drafts
                                                </div>
                                            </div>
                                            <div className="text-center p-6 bg-purple-50 rounded-lg">
                                                <div className="text-3xl font-bold text-purple-600 mb-2">
                                                    {Array.isArray(articles) ? articles.filter((a: any) => a.ai_generated).length : 0}
                                                </div>
                                                <div className="text-sm font-semibold text-slate-700 mb-1">AI Generated</div>
                                                <div className="text-xs text-slate-500">Articles created with AI</div>
                                            </div>
                                            <div className="text-center p-6 bg-emerald-50 rounded-lg">
                                                <div className="text-3xl font-bold text-emerald-600 mb-2">
                                                    {Array.isArray(articles) ? articles.reduce((sum: number, a: any) => sum + (a.views || 0), 0).toLocaleString() : 0}
                                                </div>
                                                <div className="text-sm font-semibold text-slate-700 mb-1">Total Views</div>
                                                <div className="text-xs text-slate-500">Across all articles</div>
                                            </div>
                                        </div>

                                        {/* Articles by Category */}
                                        <div className="mt-6">
                                            <h4 className="text-sm font-semibold text-slate-700 mb-3">Articles by Category</h4>
                                            <div className="space-y-2">
                                                {['mutual-funds', 'stocks', 'insurance', 'loans', 'credit-cards', 'tax-planning', 'retirement', 'investing-basics'].map((cat) => {
                                                    const count = Array.isArray(articles) ? articles.filter((a: any) => a.category === cat).length : 0;
                                                    if (count === 0) return null;
                                                    return (
                                                        <div key={cat} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                            <span className="text-sm text-slate-700 capitalize">{cat.replace(/-/g, ' ')}</span>
                                                            <Badge variant="outline" className="font-semibold">{count}</Badge>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Recent Articles - View Only */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Articles</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {articles.slice(0, 10).map((article: any) => (
                                                <div
                                                    key={article.id}
                                                    className="flex items-center justify-between p-4 bg-slate-50 border border-transparent hover:border-slate-200 rounded-xl transition-all"
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-semibold text-slate-900">{article.title}</h4>
                                                            {article.ai_generated && (
                                                                <Badge className="bg-purple-100 text-purple-700 border-0 text-[10px]">
                                                                    <Sparkles className="w-3 h-3 mr-1" />
                                                                    AI
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                                                            <span className="capitalize">{article.category?.replace(/-/g, ' ')}</span>
                                                            <span className="flex items-center gap-1">
                                                                <Eye className="w-3 h-3" />
                                                                {article.views || 0} views
                                                            </span>
                                                            <Badge className={`text-[10px] border-0 ${article.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                                                                article.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                                                                    'bg-slate-200 text-slate-700'
                                                                }`}>
                                                                {article.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Automation - Consolidated (Pipeline, RSS, Scrapers) */}
                        <TabsContent value="automation">
                            <div className="space-y-6">
                                {/* Pipeline Section */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle>Content Pipeline</CardTitle>
                                            <Button size="sm">
                                                <Play className="w-4 h-4 mr-2" />
                                                Run Pipeline
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                                <div className="text-2xl font-bold text-blue-600">{pipelineStatus.active || 0}</div>
                                                <div className="text-sm text-slate-600">Active</div>
                                            </div>
                                            <div className="text-center p-4 bg-emerald-50 rounded-lg">
                                                <div className="text-2xl font-bold text-emerald-600">{pipelineStatus.completed || 0}</div>
                                                <div className="text-sm text-slate-600">Completed</div>
                                            </div>
                                            <div className="text-center p-4 bg-rose-50 rounded-lg">
                                                <div className="text-2xl font-bold text-rose-600">{pipelineStatus.failed || 0}</div>
                                                <div className="text-sm text-slate-600">Failed</div>
                                            </div>
                                            <div className="text-center p-4 bg-amber-50 rounded-lg">
                                                <div className="text-2xl font-bold text-amber-600">{pipelineStatus.pending || 0}</div>
                                                <div className="text-sm text-slate-600">Pending</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-600">Last Run</span>
                                                <span className="font-medium">
                                                    {pipelineStatus.lastRun ? new Date(pipelineStatus.lastRun).toLocaleString() : 'Never'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-600">Average Time</span>
                                                <span className="font-medium">{pipelineStatus.avgTime || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* RSS Feeds Section */}
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle>RSS Feed Management</CardTitle>
                                        <Button size="sm">Add Feed</Button>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {Array.isArray(rssFeeds) && rssFeeds.map((feed: any) => (
                                                <div key={feed.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Rss className="w-4 h-4 text-orange-600" />
                                                            <h4 className="font-semibold text-slate-900">{feed.name}</h4>
                                                            <Badge className={feed.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
                                                                {feed.status}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-slate-600 truncate">{feed.url}</p>
                                                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                Last fetch: {feed.lastFetch ? new Date(feed.lastFetch).toLocaleString() : 'Never'}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <FileText className="w-3 h-3" />
                                                                {feed.itemsCount || 0} items
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm">
                                                            <RefreshCw className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="outline" size="sm">Edit</Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Scrapers Section */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle>Scraper Management</CardTitle>
                                            <Button size="sm">
                                                <Play className="w-4 h-4 mr-2" />
                                                Run All Scrapers
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <Card className="bg-blue-50">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-semibold text-slate-900">Product Scraper</span>
                                                            <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                                                        </div>
                                                        <div className="text-2xl font-bold text-slate-900 mb-1">{scraperStatus.productsScraped || 0}</div>
                                                        <div className="text-xs text-slate-600">Products scraped</div>
                                                        <Button size="sm" variant="outline" className="w-full mt-3">
                                                            <Play className="w-3 h-3 mr-2" />
                                                            Run Now
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                                <Card className="bg-purple-50">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-semibold text-slate-900">Review Scraper</span>
                                                            <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                                                        </div>
                                                        <div className="text-2xl font-bold text-slate-900 mb-1">{scraperStatus.reviewsScraped || 0}</div>
                                                        <div className="text-xs text-slate-600">Reviews scraped</div>
                                                        <Button size="sm" variant="outline" className="w-full mt-3">
                                                            <Play className="w-3 h-3 mr-2" />
                                                            Run Now
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                                <Card className="bg-emerald-50">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-semibold text-slate-900">Rate Scraper</span>
                                                            <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                                                        </div>
                                                        <div className="text-2xl font-bold text-slate-900 mb-1">{scraperStatus.ratesScraped || 0}</div>
                                                        <div className="text-xs text-slate-600">Rates scraped</div>
                                                        <Button size="sm" variant="outline" className="w-full mt-3">
                                                            <Play className="w-3 h-3 mr-2" />
                                                            Run Now
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-lg">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm font-semibold text-slate-900">Overall Status</span>
                                                    <Badge className={scraperStatus.status === 'running' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                                                        {scraperStatus.status === 'running' ? 'Running' : 'Paused'}
                                                    </Badge>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-slate-600">Success Rate:</span>
                                                        <span className="font-semibold ml-2">{scraperStatus.successRate || 0}%</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-600">Last Run:</span>
                                                        <span className="font-semibold ml-2">
                                                            {scraperStatus.lastRun ? new Date(scraperStatus.lastRun).toLocaleString() : 'Never'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* OLD: Content Pipeline - REMOVED (now part of automation) */}
                        <TabsContent value="pipeline" style={{ display: 'none' }}>
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle>Pipeline Status</CardTitle>
                                            <Button size="sm">
                                                <Play className="w-4 h-4 mr-2" />
                                                Run Pipeline
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                                <div className="text-2xl font-bold text-blue-600">{pipelineStatus.active || 0}</div>
                                                <div className="text-sm text-slate-600">Active</div>
                                            </div>
                                            <div className="text-center p-4 bg-emerald-50 rounded-lg">
                                                <div className="text-2xl font-bold text-emerald-600">{pipelineStatus.completed || 0}</div>
                                                <div className="text-sm text-slate-600">Completed</div>
                                            </div>
                                            <div className="text-center p-4 bg-rose-50 rounded-lg">
                                                <div className="text-2xl font-bold text-rose-600">{pipelineStatus.failed || 0}</div>
                                                <div className="text-sm text-slate-600">Failed</div>
                                            </div>
                                            <div className="text-center p-4 bg-amber-50 rounded-lg">
                                                <div className="text-2xl font-bold text-amber-600">{pipelineStatus.pending || 0}</div>
                                                <div className="text-sm text-slate-600">Pending</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-600">Last Run</span>
                                                <span className="font-medium">
                                                    {pipelineStatus.lastRun ? new Date(pipelineStatus.lastRun).toLocaleString() : 'Never'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-600">Average Time</span>
                                                <span className="font-medium">{pipelineStatus.avgTime || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Pipeline Runs</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                                                        <div>
                                                            <div className="font-medium text-slate-900">Content Generation Run #{i}</div>
                                                            <div className="text-xs text-slate-500">2 minutes ago • 45 articles generated</div>
                                                        </div>
                                                    </div>
                                                    <Badge className="bg-emerald-100 text-emerald-700">Success</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* OLD: RSS Feeds - REMOVED (now part of automation) */}
                        <TabsContent value="rss" style={{ display: 'none' }}>
                            <div />
                        </TabsContent>

                        {/* OLD: Social Accounts Management - REMOVED (integrated into social analytics) */}
                        <TabsContent value="social-accounts" style={{ display: 'none' }}>
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Share2 className="w-5 h-5 text-blue-600" />
                                            Connected Social Accounts
                                        </CardTitle>
                                        <p className="text-sm text-slate-600 mt-2">
                                            Manage your social media account connections and API keys
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {/* Facebook */}
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <Facebook className="w-6 h-6 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-900">Facebook</h4>
                                                        <p className="text-sm text-slate-600">
                                                            {socialMetrics.facebook ? 'Connected' : 'Not connected'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant={socialMetrics.facebook ? "outline" : "default"}>
                                                    {socialMetrics.facebook ? 'Disconnect' : 'Connect'}
                                                </Button>
                                            </div>

                                            {/* Twitter */}
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                                                        <Twitter className="w-6 h-6 text-sky-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-900">Twitter</h4>
                                                        <p className="text-sm text-slate-600">
                                                            {socialMetrics.twitter ? 'Connected' : 'Not connected'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant={socialMetrics.twitter ? "outline" : "default"}>
                                                    {socialMetrics.twitter ? 'Disconnect' : 'Connect'}
                                                </Button>
                                            </div>

                                            {/* LinkedIn */}
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <Linkedin className="w-6 h-6 text-blue-700" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-900">LinkedIn</h4>
                                                        <p className="text-sm text-slate-600">
                                                            {socialMetrics.linkedin ? 'Connected' : 'Not connected'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant={socialMetrics.linkedin ? "outline" : "default"}>
                                                    {socialMetrics.linkedin ? 'Disconnect' : 'Connect'}
                                                </Button>
                                            </div>

                                            {/* Instagram */}
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                                                        <Instagram className="w-6 h-6 text-pink-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-900">Instagram</h4>
                                                        <p className="text-sm text-slate-600">
                                                            {socialMetrics.instagram ? 'Connected' : 'Not connected'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant={socialMetrics.instagram ? "outline" : "default"}>
                                                    {socialMetrics.instagram ? 'Disconnect' : 'Connect'}
                                                </Button>
                                            </div>

                                            {/* YouTube */}
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                                        <Youtube className="w-6 h-6 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-900">YouTube</h4>
                                                        <p className="text-sm text-slate-600">
                                                            {socialMetrics.youtube ? 'Connected' : 'Not connected'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant={socialMetrics.youtube ? "outline" : "default"}>
                                                    {socialMetrics.youtube ? 'Disconnect' : 'Connect'}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <p className="text-sm text-blue-900">
                                                <strong>Note:</strong> Connect your social media accounts to track metrics and automate posting. 
                                                API keys and tokens are securely stored.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Social Media Analytics */}
                        <TabsContent value="social">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {socialMetrics.facebook && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Facebook className="w-5 h-5 text-blue-600" />
                                                    Facebook
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="text-3xl font-bold text-slate-900">{socialMetrics.facebook.followers?.toLocaleString()}</div>
                                                        <div className="text-sm text-slate-600">Followers</div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <div className="text-lg font-semibold text-slate-900">{socialMetrics.facebook.engagement}%</div>
                                                            <div className="text-xs text-slate-600">Engagement</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-semibold text-slate-900">{socialMetrics.facebook.posts}</div>
                                                            <div className="text-xs text-slate-600">Posts</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                    {socialMetrics.twitter && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Twitter className="w-5 h-5 text-sky-600" />
                                                    Twitter
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="text-3xl font-bold text-slate-900">{socialMetrics.twitter.followers?.toLocaleString()}</div>
                                                        <div className="text-sm text-slate-600">Followers</div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <div className="text-lg font-semibold text-slate-900">{socialMetrics.twitter.engagement}%</div>
                                                            <div className="text-xs text-slate-600">Engagement</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-semibold text-slate-900">{socialMetrics.twitter.posts}</div>
                                                            <div className="text-xs text-slate-600">Posts</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                    {socialMetrics.linkedin && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Linkedin className="w-5 h-5 text-blue-700" />
                                                    LinkedIn
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="text-3xl font-bold text-slate-900">{socialMetrics.linkedin.followers?.toLocaleString()}</div>
                                                        <div className="text-sm text-slate-600">Followers</div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <div className="text-lg font-semibold text-slate-900">{socialMetrics.linkedin.engagement}%</div>
                                                            <div className="text-xs text-slate-600">Engagement</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-semibold text-slate-900">{socialMetrics.linkedin.posts}</div>
                                                            <div className="text-xs text-slate-600">Posts</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                    {socialMetrics.instagram && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Instagram className="w-5 h-5 text-pink-600" />
                                                    Instagram
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="text-3xl font-bold text-slate-900">{socialMetrics.instagram.followers?.toLocaleString()}</div>
                                                        <div className="text-sm text-slate-600">Followers</div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <div className="text-lg font-semibold text-slate-900">{socialMetrics.instagram.engagement}%</div>
                                                            <div className="text-xs text-slate-600">Engagement</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-semibold text-slate-900">{socialMetrics.instagram.posts}</div>
                                                            <div className="text-xs text-slate-600">Posts</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                    {socialMetrics.youtube && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Youtube className="w-5 h-5 text-red-600" />
                                                    YouTube
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="text-3xl font-bold text-slate-900">{socialMetrics.youtube.subscribers?.toLocaleString()}</div>
                                                        <div className="text-sm text-slate-600">Subscribers</div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <div className="text-lg font-semibold text-slate-900">{socialMetrics.youtube.views?.toLocaleString()}</div>
                                                            <div className="text-xs text-slate-600">Total Views</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-semibold text-slate-900">{socialMetrics.youtube.videos}</div>
                                                            <div className="text-xs text-slate-600">Videos</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* OLD: Scrapers - REMOVED (now part of automation) */}
                        <TabsContent value="scrapers" style={{ display: 'none' }}>
                            <div />
                        </TabsContent>

                        {/* Trends */}
                        <TabsContent value="trends">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Keyword Trends & Analytics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {Array.isArray(trends) && trends.map((trend: any, index: number) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-slate-900 mb-1">{trend.keyword}</div>
                                                    <div className="text-xs text-slate-500">Search Volume: {trend.volume?.toLocaleString()}</div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div className={`text-lg font-bold ${
                                                            trend.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                                                        }`}>
                                                            {trend.trend === 'up' ? '+' : ''}{trend.change}%
                                                        </div>
                                                        <div className="text-xs text-slate-500">Change</div>
                                                    </div>
                                                    {trend.trend === 'up' ? (
                                                        <ArrowUpRight className="w-6 h-6 text-emerald-600" />
                                                    ) : (
                                                        <ArrowDownRight className="w-6 h-6 text-rose-600" />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* OLD: Reviews - REMOVED (Use sidebar "Review Queue" instead) */}
                        <TabsContent value="reviews" style={{ display: 'none' }}>
                            <div />
                        </TabsContent>

                    </Tabs>
                </div>
            </div>
            
            {/* Confirm Dialog for Rejecting Reviews */}
            <ConfirmDialog
                open={rejectDialogOpen}
                onOpenChange={setRejectDialogOpen}
                onConfirm={async () => {
                    if (reviewToReject) {
                        await api.entities.Review.update(reviewToReject, { status: 'rejected' });
                        queryClient.invalidateQueries({ queryKey: ['reviews-all'] });
                        toast.success('Review rejected');
                        setReviewToReject(null);
                    }
                }}
                title="Reject Review"
                description="Are you sure you want to reject this review? This action cannot be undone."
                confirmText="Reject"
                cancelText="Cancel"
                variant="destructive"
            />
        </AdminLayout>
    );
}
