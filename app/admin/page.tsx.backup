"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { articleService } from '@/lib/cms/article-service';
import { createClient } from '@/lib/supabase/client';
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
import { cn } from "@/lib/utils";
import AutomationControls from "@/components/admin/AutomationControls";

export default function AdminPage() {
    const [timeRange, setTimeRange] = useState('30d');
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [reviewToReject, setReviewToReject] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [contextualSidebarCollapsed, setContextualSidebarCollapsed] = useState(false);
    const queryClient = useQueryClient();

    // Optimized: Fetch aggregated stats via RPC
    const { data: dashboardStats } = useQuery({
        queryKey: ['admin-dashboard-stats'],
        queryFn: async () => {
             const supabase = createClient();
             const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
             if (error) {
                 console.error('Error fetching dashboard stats:', error);
                 return null;
             }
             return data;
        },
        refetchInterval: 30000
    });

    // Fallback constants if RPC is null (loading/error)
    const statsData = dashboardStats || {
        total_articles: 0,
        published_articles: 0,
        draft_articles: 0,
        total_views: 0,
        articles_this_month: 0,
        ai_generated_articles: 0,
        recent_activity: [],
        category_stats: []
    };

    // Articles data for lists (only fetch small subset now)
    const { data: recentArticles = [] } = useQuery({
        queryKey: ['recent-articles'],
        queryFn: () => articleService.listArticles(10), // Only fetch 10
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
                const response = await fetch('/api/rss/feeds', { method: 'GET' });
                if (!response.ok) return [];
                const data = await response.json();
                return data.feeds || [];
            } catch (error) {
                console.error('Failed to fetch RSS feeds:', error);
                return [];
            }
        }
    });
    const rssFeeds = Array.isArray(rssFeedsData) ? rssFeedsData : [];

    // Social Media Metrics - Real API (using schedulers endpoint)
    const { data: socialMetrics = {} } = useQuery<{
        facebook?: { followers: number, engagement: number, posts: number } | null;
        twitter?: { followers: number, engagement: number, posts: number } | null;
        linkedin?: { followers: number, engagement: number, posts: number } | null;
        instagram?: { followers: number, engagement: number, posts: number } | null;
        youtube?: { subscribers: number, views: number, videos: number } | null;
    }>({
        queryKey: ['social-metrics'],
        queryFn: async () => {
            try {
                const response = await fetch('/api/social/schedulers');
                if (!response.ok) return {};
                const data = await response.json();
                // Transform schedulers data to metrics format
                const schedulers = data.schedulers || [];
                const hasScheduler = (platform: string) => schedulers.length > 0; // Simplified for now
                
                // Return objects with metrics if connected, otherwise null
                return {
                    facebook: hasScheduler('facebook') ? { followers: 0, engagement: 0, posts: 0 } : null,
                    twitter: hasScheduler('twitter') ? { followers: 0, engagement: 0, posts: 0 } : null,
                    linkedin: hasScheduler('linkedin') ? { followers: 0, engagement: 0, posts: 0 } : null,
                    instagram: hasScheduler('instagram') ? { followers: 0, engagement: 0, posts: 0 } : null,
                    youtube: hasScheduler('youtube') ? { subscribers: 0, views: 0, videos: 0 } : null
                };
            } catch (error) {
                console.error('Failed to fetch social media metrics:', error);
                return {};
            }
        }
    });

    // Content Pipeline Status - Real API
    const { data: pipelineStatus = { active: 0, completed: 0, failed: 0, pending: 0, lastRun: null, avgTime: '0 min' } } = useQuery({
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
                const response = await fetch('/api/trends');
                if (!response.ok) return [];
                const data = await response.json();
                return data.trends || [];
            } catch (error) {
                console.error('Failed to fetch trends:', error);
                return [];
            }
        },
        refetchInterval: 300000 // 5 minutes
    });
    const trends = Array.isArray(trendsData) ? trendsData : [];

    // Calculate metrics
    const totalViews = statsData?.total_views ?? 0;
    const totalClicks = Array.isArray(affiliateProducts) ? affiliateProducts.reduce((sum: number, p: any) => sum + (p.clicks || 0), 0) : 0;
    const totalConversions = Array.isArray(affiliateProducts) ? affiliateProducts.reduce((sum: number, p: any) => sum + (p.conversions || 0), 0) : 0;
    const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0';
    const pendingReviews = Array.isArray(reviews) ? reviews.filter((r: any) => r.status === 'pending') : [];
    const pendingReviewsCount = pendingReviews.length;
    const pendingArticlesCount = pendingArticles.length;

    const stats = [
        {
            label: 'Total Articles',
            value: statsData?.total_articles ?? 0,
            icon: FileText,
            color: 'bg-blue-500',
            change: `+${statsData?.articles_this_month ?? 0} this month`,
            trend: 'up'
        },
        {
            label: 'Total Views',
            value: Number(statsData?.total_views ?? 0).toLocaleString(),
            icon: Eye,
            color: 'bg-purple-500',
            change: 'Lifetime views',
            trend: 'up'
        },
        {
            label: 'Affiliate Clicks',
            value: (totalClicks ?? 0).toLocaleString(),
            icon: MousePointerClick,
            color: 'bg-emerald-500',
            change: `${conversionRate ?? 0}% conversion`,
            trend: 'up'
        },
        {
            label: 'Pending Reviews',
            value: pendingReviewsCount ?? 0,
            icon: Star,
            color: 'bg-amber-500',
            change: 'Needs moderation',
            trend: (pendingReviewsCount ?? 0) > 0 ? 'down' : 'up'
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
            <div className="h-full flex flex-col">
                <div className="px-10 py-8 border-b border-white/5 bg-white/[0.02] backdrop-blur-md">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Analyze</h1>
                            <p className="text-sm text-slate-400 font-medium tracking-wide">Orchestrating growth through data-driven precision.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                    queryClient.invalidateQueries();
                                    toast.success('Analyzing latest data vectors...');
                                }}
                                className="bg-white/5 border-white/10 hover:bg-white/10 text-slate-300 rounded-xl px-5"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Re-sync Metrics
                            </Button>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto px-10 py-10 max-w-[1600px] mx-auto w-full no-scrollbar">

                    {/* Main Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {[...stats, ...alertStats].slice(0, 4).map((stat, index) => (
                            <Card key={index} className="bg-white/[0.03] border-white/5 hover:border-indigo-500/30 transition-all duration-500 group relative overflow-hidden overflow-hidden rounded-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />
                                <CardContent className="p-7 relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center shadow-2xl shadow-black/20 group-hover:scale-110 transition-transform duration-500`}>
                                            <stat.icon className="w-7 h-7 text-white" />
                                        </div>
                                        {stat.trend && (
                                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                                                stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                            }`}>
                                                {stat.trend === 'up' ? (
                                                    <ArrowUpRight className="w-4 h-4" />
                                                ) : (
                                                    <ArrowDownRight className="w-4 h-4" />
                                                )}
                                                {stat.trend === 'up' ? 'Growth' : 'Alert'}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-4xl font-extrabold text-white mb-2 tabular-nums tracking-tight">{stat.value}</p>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                        {stat.change}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* Scraper Status */}
                        <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                            <CardHeader className="pb-4 border-b border-white/5 px-7">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <Database className="w-4 h-4 text-blue-400" />
                                    </div>
                                    Scraper Network
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-7">
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-400">Cluster Status</span>
                                        <div className={cn(
                                            "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            scraperStatus.status === 'running' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                        )}>
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full animate-pulse",
                                                scraperStatus.status === 'running' ? 'bg-emerald-500' : 'bg-amber-500'
                                            )} />
                                            {scraperStatus.status === 'running' ? 'Operational' : 'Idle'}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-400">Accuracy</span>
                                        <span className="text-sm font-bold text-white tabular-nums">{scraperStatus.successRate || 0}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-400">Last Telemetry</span>
                                        <span className="text-xs font-bold text-slate-300">
                                            {scraperStatus.lastRun ? new Date(scraperStatus.lastRun).toLocaleTimeString() : 'No Data'}
                                        </span>
                                    </div>
                                    {scraperStatus.productsScraped && (
                                        <div className="pt-5 border-t border-white/5">
                                            <div className="grid grid-cols-3 gap-4 text-center">
                                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Assets</div>
                                                    <div className="text-sm font-bold text-white tabular-nums">{scraperStatus.productsScraped}</div>
                                                </div>
                                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Feed</div>
                                                    <div className="text-sm font-bold text-white tabular-nums">{scraperStatus.reviewsScraped}</div>
                                                </div>
                                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Rates</div>
                                                    <div className="text-sm font-bold text-white tabular-nums">{scraperStatus.ratesScraped}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Content Pipeline */}
                        <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                            <CardHeader className="pb-4 border-b border-white/5 px-7">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-purple-400" />
                                    </div>
                                    AI Content Factory
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-7">
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-400">Parallel Jobs</span>
                                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded-full border border-indigo-500/20">
                                            {pipelineStatus.active || 0} ACTIVE
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-400">Total Outputs</span>
                                        <span className="text-sm font-bold text-white tabular-nums">{pipelineStatus.completed || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-400">Drop Rate</span>
                                        <span className="text-sm font-bold text-rose-400 tabular-nums">{pipelineStatus.failed || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-400">Avg. Cycle</span>
                                        <span className="text-xs font-bold text-slate-300 tabular-nums">{pipelineStatus.avgTime || 'N/A'}</span>
                                    </div>
                                    <div className="pt-2">
                                        <Button 
                                            size="sm" 
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 font-bold shadow-lg shadow-indigo-600/20 transition-all border-0"
                                        >
                                            <Play className="w-4 h-4 mr-2 fill-white" />
                                            Ignite Factory
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* RSS Dynamics */}
                        <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                            <CardHeader className="pb-4 border-b border-white/5 px-7">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                        <Rss className="w-4 h-4 text-orange-400" />
                                    </div>
                                    RSS Dynamics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-7">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-slate-400">Sync Channels</span>
                                        <span className="text-sm font-bold text-emerald-400">
                                            {Array.isArray(rssFeeds) ? rssFeeds.filter((f: any) => f?.status === 'active').length : 0} LIVE
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {Array.isArray(rssFeeds) && rssFeeds.slice(0, 3).map((feed: any) => (
                                            <div key={feed.id} className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/5">
                                                <span className="text-xs font-bold text-slate-300 truncate flex-1">{feed.name}</span>
                                                <Badge className="bg-white/10 text-white border-0 text-[10px] ml-2 font-bold">{feed.itemsCount || 0}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-2">
                                        <Button size="sm" variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-slate-300 rounded-xl h-10 font-bold">
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Synchronize
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Social Media Metrics */}
                    <Card className="mb-10 bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-white/5 px-8 py-6">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Share2 className="w-4 h-4 text-blue-400" />
                                </div>
                                Omnichannel Presence
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {socialMetrics.facebook && (
                                    <div className="text-center p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-colors group">
                                        <Facebook className="w-6 h-6 text-blue-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                        <div className="text-2xl font-bold text-white tabular-nums mb-1">{socialMetrics.facebook.followers?.toLocaleString()}</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Followers</div>
                                        <div className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full inline-block">
                                            +{socialMetrics.facebook.engagement}% Engagement
                                        </div>
                                    </div>
                                )}
                                {socialMetrics.twitter && (
                                    <div className="text-center p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-colors group">
                                        <Twitter className="w-6 h-6 text-sky-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                        <div className="text-2xl font-bold text-white tabular-nums mb-1">{socialMetrics.twitter.followers?.toLocaleString()}</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Followers</div>
                                        <div className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full inline-block">
                                            +{socialMetrics.twitter.engagement}% Engagement
                                        </div>
                                    </div>
                                )}
                                {socialMetrics.linkedin && (
                                    <div className="text-center p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-colors group">
                                        <Linkedin className="w-6 h-6 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                        <div className="text-2xl font-bold text-white tabular-nums mb-1">{socialMetrics.linkedin.followers?.toLocaleString()}</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Followers</div>
                                        <div className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full inline-block">
                                            +{socialMetrics.linkedin.engagement}% Engagement
                                        </div>
                                    </div>
                                )}
                                {socialMetrics.instagram && (
                                    <div className="text-center p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-colors group">
                                        <Instagram className="w-6 h-6 text-pink-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                        <div className="text-2xl font-bold text-white tabular-nums mb-1">{socialMetrics.instagram.followers?.toLocaleString()}</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Followers</div>
                                        <div className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full inline-block">
                                            +{socialMetrics.instagram.engagement}% Engagement
                                        </div>
                                    </div>
                                )}
                                {socialMetrics.youtube && (
                                    <div className="text-center p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-colors group">
                                        <Youtube className="w-6 h-6 text-red-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                        <div className="text-2xl font-bold text-white tabular-nums mb-1">{socialMetrics.youtube.subscribers?.toLocaleString()}</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Subscribers</div>
                                        <div className="text-[10px] font-bold text-slate-300 bg-white/5 px-2 py-0.5 rounded-full inline-block">
                                            {socialMetrics.youtube.views?.toLocaleString()} Views
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Trends */}
                    <Card className="mb-10 bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-white/5 px-8 py-6">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                </div>
                                Intelligence Vectors
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.isArray(trends) && trends.map((trend: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all group">
                                        <div className="flex-1">
                                            <div className="font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{trend.keyword}</div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Velocity: {trend.volume?.toLocaleString()}</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`text-sm font-bold tabular-nums ${
                                                trend.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'
                                            }`}>
                                                {trend.trend === 'up' ? '+' : ''}{trend.change}%
                                            </div>
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                                trend.trend === 'up' ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                                            )}>
                                                {trend.trend === 'up' ? (
                                                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                                                ) : (
                                                    <ArrowDownRight className="w-4 h-4 text-rose-400" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content - Controlled by ContextualSidebar */}
                    <div className="space-y-6">
                        {/* Overview Tab - Key Metrics */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Content Snapshot */}
                                <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                                    <CardHeader className="border-b border-white/5 px-8 py-5">
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Content Snapshot</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5 text-center">
                                                <div className="text-3xl font-extrabold text-white mb-1">{statsData?.total_articles ?? 0}</div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Grand Total</div>
                                                <div className="mt-3 text-[10px] font-bold text-indigo-400">
                                                    {statsData?.published_articles ?? 0} Published
                                                </div>
                                            </div>
                                            <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5 text-center">
                                                <div className="text-3xl font-extrabold text-white mb-1">{Number(totalViews ?? 0).toLocaleString()}</div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Impact</div>
                                                <div className="mt-3 text-[10px] font-bold text-purple-400">
                                                    Aggregate Views
                                                </div>
                                            </div>
                                            <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5 text-center">
                                                <div className="text-3xl font-extrabold text-white mb-1">{statsData?.ai_generated_articles ?? 0}</div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Synthesis</div>
                                                <div className="mt-3 text-[10px] font-bold text-emerald-400">
                                                    Automated Drafts
                                                </div>
                                            </div>
                                            <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5 text-center">
                                                <div className="text-3xl font-extrabold text-amber-500 mb-1">{pendingArticlesCount ?? 0}</div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Moderation</div>
                                                <div className="mt-3 text-[10px] font-bold text-amber-500/80">
                                                    Pending Review
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* System Performance Indicators */}
                                <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                                    <CardHeader className="border-b border-white/5 px-8 py-5">
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">System Performance Indicators</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Publication Rate</span>
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                                        <FileText className="w-4 h-4 text-indigo-400" />
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-extrabold text-white mb-1">
                                                    {statsData?.articles_this_month ?? 0}
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Articles this cycle</div>
                                            </div>
                                            <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5 group hover:border-emerald-500/30 transition-all">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sentiment Stream</span>
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                        <Star className="w-4 h-4 text-emerald-400" />
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-extrabold text-white mb-1">{reviews?.length ?? 0}</div>
                                                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                                                    {pendingReviewsCount ?? 0} Pending Node Analysis
                                                </div>
                                            </div>
                                            <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5 group hover:border-purple-500/30 transition-all">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Monetization Velocity</span>
                                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                                        <MousePointerClick className="w-4 h-4 text-purple-400" />
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-extrabold text-white mb-1">{(totalClicks ?? 0).toLocaleString()}</div>
                                                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{conversionRate ?? 0}% Conversion Efficiency</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Performance Tracking */}
                        {activeTab === 'performance' && (
                            <ContentPerformanceTracking timeRange={timeRange as '7d' | '30d' | '90d'} />
                        )}

                        {/* Content Stats - Tracking Only */}
                        {activeTab === 'content' && (
                            <div className="space-y-6">
                                {/* Content Statistics */}
                                <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                                    <CardHeader className="border-b border-white/5 px-8 py-5">
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 font-bold uppercase tracking-widest text-slate-400">Content Statistics</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                            <div className="text-center p-6 bg-white/[0.03] rounded-2xl border border-white/5">
                                                <div className="text-3xl font-extrabold text-blue-400 mb-2 tabular-nums">
                                                    {statsData.published_articles}
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Live Articles</div>
                                                <div className="text-[10px] text-slate-500 italic">
                                                    {statsData.draft_articles} Drafts staged
                                                </div>
                                            </div>
                                            <div className="text-center p-6 bg-white/[0.03] rounded-2xl border border-white/5">
                                                <div className="text-3xl font-extrabold text-purple-400 mb-2 tabular-nums">
                                                    {statsData.ai_generated_articles || 0}
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">AI Synthesis</div>
                                                <div className="text-[10px] text-slate-500 italic">Synthetic Content Yield</div>
                                            </div>
                                            <div className="text-center p-6 bg-white/[0.03] rounded-2xl border border-white/5">
                                                <div className="text-3xl font-extrabold text-emerald-400 mb-2 tabular-nums">
                                                    {Number(statsData.total_views).toLocaleString()}
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Global Views</div>
                                                <div className="text-[10px] text-slate-500 italic">Aggregate Impression Feed</div>
                                            </div>
                                        </div>

                                        {/* Articles by Category */}
                                        <div className="mt-8">
                                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Distribution by Category</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {statsData.category_stats && Array.isArray(statsData.category_stats) && statsData.category_stats.length > 0 ? (
                                                    statsData.category_stats.map((cat: any) => (
                                                        <div key={cat.category} className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/5 rounded-xl">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                                                                <span className="capitalize text-sm font-medium text-slate-300">{cat.category?.replace(/-/g, ' ')}</span>
                                                            </div>
                                                            <span className="text-sm font-bold text-white tabular-nums">{cat.count}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-slate-500 italic">Categorization feed empty...</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Recent Articles - View Only */}
                                <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                                    <CardHeader className="border-b border-white/5 px-8 py-5">
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Ledger of Recent Assets</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="space-y-3">
                                            {recentArticles.map((article: any) => (
                                                <div
                                                    key={article.id}
                                                    className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 rounded-2xl transition-all group"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-1.5">
                                                            <h4 className="font-bold text-white tracking-tight truncate group-hover:text-indigo-400 transition-colors">{article.title}</h4>
                                                            {article.ai_generated && (
                                                                <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold uppercase tracking-wider px-2">
                                                                    <Sparkles className="w-3 h-3 mr-1" />
                                                                    AI
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                                            <span className="text-slate-400">{article.category?.replace(/-/g, ' ')}</span>
                                                            <span className="flex items-center gap-1.5">
                                                                <Eye className="w-3.5 h-3.5" />
                                                                {article.views || 0}
                                                            </span>
                                                            <div className={cn(
                                                                "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px]",
                                                                article.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' :
                                                                article.status === 'draft' ? 'bg-amber-500/10 text-amber-400' :
                                                                'bg-slate-500/10 text-slate-400'
                                                            )}>
                                                                <div className={cn("w-1 h-1 rounded-full",
                                                                    article.status === 'published' ? 'bg-emerald-400' :
                                                                    article.status === 'draft' ? 'bg-amber-400' :
                                                                    'bg-slate-400'
                                                                )} />
                                                                {article.status}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white hover:bg-white/5 ml-4">
                                                        <ArrowUpRight className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Automation - Using AutomationControls Component */}
                        {activeTab === 'automation' && (
                            <AutomationControls />
                        )}

                        {/* Social Media Analytics */}
                        {activeTab === 'social' && (
                            <div className="space-y-6">
                                <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                                    <CardHeader className="border-b border-white/5 px-8 py-6">
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                <Share2 className="w-4 h-4 text-blue-400" />
                                            </div>
                                            Asset Distribution Channels
                                        </CardTitle>
                                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-3">
                                            Interface nodes for omnichannel data propagation
                                        </p>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="space-y-4">
                                            {/* Facebook */}
                                            <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all group">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                                        <Facebook className="w-6 h-6 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white tracking-tight">Facebook Interface</h4>
                                                        <p className={cn(
                                                            "text-[10px] font-bold uppercase tracking-widest mt-1",
                                                            socialMetrics.facebook ? 'text-emerald-400' : 'text-rose-400'
                                                        )}>
                                                            {socialMetrics.facebook ? 'Node Active / Syncing' : 'Link Offline'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="ghost" className={cn(
                                                    "h-10 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all",
                                                    socialMetrics.facebook ? "bg-white/5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400" : "bg-blue-500 text-white hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                                )}>
                                                    {socialMetrics.facebook ? 'Terminate' : 'Initialize'}
                                                </Button>
                                            </div>

                                            {/* Twitter */}
                                            <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-sky-500/30 transition-all group">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 bg-sky-500/10 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                                        <Twitter className="w-6 h-6 text-sky-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white tracking-tight">Twitter Stream</h4>
                                                        <p className={cn(
                                                            "text-[10px] font-bold uppercase tracking-widest mt-1",
                                                            socialMetrics.twitter ? 'text-emerald-400' : 'text-rose-400'
                                                        )}>
                                                            {socialMetrics.twitter ? 'Node Active / Syncing' : 'Link Offline'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="ghost" className={cn(
                                                    "h-10 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all",
                                                    socialMetrics.twitter ? "bg-white/5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400" : "bg-sky-500 text-white hover:bg-sky-600 shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                                                )}>
                                                    {socialMetrics.twitter ? 'Terminate' : 'Initialize'}
                                                </Button>
                                            </div>

                                            {/* LinkedIn */}
                                            <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-blue-700/30 transition-all group">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                                        <Linkedin className="w-6 h-6 text-indigo-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white tracking-tight">LinkedIn Authority</h4>
                                                        <p className={cn(
                                                            "text-[10px] font-bold uppercase tracking-widest mt-1",
                                                            socialMetrics.linkedin ? 'text-emerald-400' : 'text-rose-400'
                                                        )}>
                                                            {socialMetrics.linkedin ? 'Node Active / Syncing' : 'Link Offline'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="ghost" className={cn(
                                                    "h-10 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all",
                                                    socialMetrics.linkedin ? "bg-white/5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                                                )}>
                                                    {socialMetrics.linkedin ? 'Terminate' : 'Initialize'}
                                                </Button>
                                            </div>

                                            {/* Instagram */}
                                            <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-pink-500/30 transition-all group">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 bg-pink-500/10 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                                        <Instagram className="w-6 h-6 text-pink-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white tracking-tight">Instagram Visuals</h4>
                                                        <p className={cn(
                                                            "text-[10px] font-bold uppercase tracking-widest mt-1",
                                                            socialMetrics.instagram ? 'text-emerald-400' : 'text-rose-400'
                                                        )}>
                                                            {socialMetrics.instagram ? 'Node Active / Syncing' : 'Link Offline'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="ghost" className={cn(
                                                    "h-10 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all",
                                                    socialMetrics.instagram ? "bg-white/5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400" : "bg-pink-600 text-white hover:bg-pink-700 shadow-[0_0_15px_rgba(219,39,119,0.3)]"
                                                )}>
                                                    {socialMetrics.instagram ? 'Terminate' : 'Initialize'}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="mt-8 p-6 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                            <div className="flex items-start gap-4">
                                                <Zap className="w-5 h-5 text-indigo-400 mt-0.5" />
                                                <p className="text-[11px] font-bold text-indigo-300/80 leading-relaxed uppercase tracking-wider">
                                                    Strategic Node Linkage: <span className="text-white">Active accounts automate content distribution logic and aggregate real-time engagement vectors.</span>
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                    {socialMetrics.facebook && (
                                        <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                                            <CardHeader className="border-b border-white/5 px-8 py-5">
                                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-3">
                                                    <Facebook className="w-4 h-4 text-blue-400" />
                                                    Facebook Node Analysis
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div>
                                                        <div className="text-4xl font-extrabold text-white mb-1 tabular-nums">{socialMetrics.facebook.followers?.toLocaleString()}</div>
                                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aggregate Followers</div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                                                            <div className="text-lg font-bold text-emerald-400 mb-1 tabular-nums">{socialMetrics.facebook.engagement}%</div>
                                                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Velocity</div>
                                                        </div>
                                                        <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                                                            <div className="text-lg font-bold text-indigo-400 mb-1 tabular-nums">{socialMetrics.facebook.posts}</div>
                                                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Staged Posts</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                    {socialMetrics.twitter && (
                                        <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                                            <CardHeader className="border-b border-white/5 px-8 py-5">
                                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-3">
                                                    <Twitter className="w-4 h-4 text-sky-400" />
                                                    Twitter Stream Pulse
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div>
                                                        <div className="text-4xl font-extrabold text-white mb-1 tabular-nums">{socialMetrics.twitter.followers?.toLocaleString()}</div>
                                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Reach</div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                                                            <div className="text-lg font-bold text-emerald-400 mb-1 tabular-nums">{socialMetrics.twitter.engagement}%</div>
                                                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Impact</div>
                                                        </div>
                                                        <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                                                            <div className="text-lg font-bold text-sky-400 mb-1 tabular-nums">{socialMetrics.twitter.posts}</div>
                                                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Broadcasts</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                    {socialMetrics.linkedin && (
                                        <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                                            <CardHeader className="border-b border-white/5 px-8 py-5">
                                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-3">
                                                    <Linkedin className="w-4 h-4 text-indigo-400" />
                                                    LinkedIn Authority Vector
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div>
                                                        <div className="text-4xl font-extrabold text-white mb-1 tabular-nums">{socialMetrics.linkedin.followers?.toLocaleString()}</div>
                                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Professional Network</div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                                                            <div className="text-lg font-bold text-emerald-400 mb-1 tabular-nums">{socialMetrics.linkedin.engagement}%</div>
                                                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Efficiency</div>
                                                        </div>
                                                        <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                                                            <div className="text-lg font-bold text-indigo-400 mb-1 tabular-nums">{socialMetrics.linkedin.posts}</div>
                                                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Placements</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                    {socialMetrics.instagram && (
                                        <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                                            <CardHeader className="border-b border-white/5 px-8 py-5">
                                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-3">
                                                    <Instagram className="w-4 h-4 text-pink-400" />
                                                    Instagram Visual Feed
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div>
                                                        <div className="text-4xl font-extrabold text-white mb-1 tabular-nums">{socialMetrics.instagram.followers?.toLocaleString()}</div>
                                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Visual Impact</div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                                                            <div className="text-lg font-bold text-emerald-400 mb-1 tabular-nums">{socialMetrics.instagram.engagement}%</div>
                                                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Resonance</div>
                                                        </div>
                                                        <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                                                            <div className="text-lg font-bold text-pink-400 mb-1 tabular-nums">{socialMetrics.instagram.posts}</div>
                                                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Interactions</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                    {socialMetrics.youtube && (
                                        <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                                            <CardHeader className="border-b border-white/5 px-8 py-5">
                                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-3">
                                                    <Youtube className="w-4 h-4 text-red-400" />
                                                    YouTube Broadcast Stream
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div>
                                                        <div className="text-4xl font-extrabold text-white mb-1 tabular-nums">{socialMetrics.youtube.subscribers?.toLocaleString()}</div>
                                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Base Subscribers</div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                                                            <div className="text-lg font-bold text-emerald-400 mb-1 tabular-nums">{socialMetrics.youtube.views?.toLocaleString()}</div>
                                                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Playback Yield</div>
                                                        </div>
                                                        <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                                                            <div className="text-lg font-bold text-red-400 mb-1 tabular-nums">{socialMetrics.youtube.videos}</div>
                                                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Video Nodes</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                            </div>
                        )}

                        {/* Trends */}
                        {activeTab === 'trends' && (
                                <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                                    <CardHeader className="border-b border-white/5 px-8 py-6">
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Keyword Analytics Ledger</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="space-y-4">
                                            {Array.isArray(trends) && trends.map((trend: any, index: number) => (
                                                <div key={index} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 rounded-2xl transition-all group">
                                                    <div className="flex-1">
                                                        <div className="font-bold text-white text-lg tracking-tight mb-1 group-hover:text-indigo-400 transition-colors">{trend.keyword}</div>
                                                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Global Search Intensity: {trend.volume?.toLocaleString()}</div>
                                                    </div>
                                                    <div className="flex items-center gap-8">
                                                        <div className="text-right">
                                                            <div className={`text-xl font-extrabold tabular-nums ${
                                                                trend.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'
                                                            }`}>
                                                                {trend.trend === 'up' ? '+' : ''}{trend.change}%
                                                            </div>
                                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Momentum</div>
                                                        </div>
                                                        <div className={cn(
                                                            "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                                                            trend.trend === 'up' ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                                                        )}>
                                                            {trend.trend === 'up' ? (
                                                                <ArrowUpRight className="w-6 h-6 text-emerald-400" />
                                                            ) : (
                                                                <ArrowDownRight className="w-6 h-6 text-rose-400" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                        )}
                    </div>
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
