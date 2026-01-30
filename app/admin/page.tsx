"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient as api } from '@/lib/api-client';
// Removed articleService import - use api.entities.Article instead (client-safe)
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
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
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import AdminContextualSidebar from "@/components/admin/AdminContextualSidebar";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import AdvancedMetricsTable from "@/components/admin/AdvancedMetricsTable";
import { cn } from "@/lib/utils";

export default function AdminPage() {
    const router = useRouter();
    const [timeRange, setTimeRange] = useState('30d');
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [reviewToReject, setReviewToReject] = useState<string | null>(null);
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
        queryFn: () => api.entities.Article.list(undefined, 10), // Use client-safe API, fetch 10
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
        queryFn: async () => {
            // Fetch all reviews for admin dashboard
            const supabase = createClient();
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);
            if (error) {
                console.error('Error fetching reviews:', error);
                return [];
            }
            return data || [];
        },
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

    const articlesThisMonth = statsData?.articles_this_month ?? 0;
    const stats = [
        {
            label: 'Total Articles',
            value: statsData?.total_articles ?? 0,
            icon: FileText,
            color: 'bg-secondary-600',
            change: `${articlesThisMonth >= 0 ? '+' : ''}${articlesThisMonth} this month`,
            trend: articlesThisMonth > 0 ? 'up' : null
        },
        {
            label: 'Total Views',
            value: Number(statsData?.total_views ?? 0).toLocaleString(),
            icon: Eye,
            color: 'bg-secondary-500',
            change: 'Lifetime views',
            trend: null
        },
        {
            label: 'Affiliate Clicks',
            value: (totalClicks ?? 0).toLocaleString(),
            icon: MousePointerClick,
            color: 'bg-primary-500',
            change: `${conversionRate ?? 0}% conversion`,
            trend: null
        },
        {
            label: 'Pending Reviews',
            value: pendingReviewsCount ?? 0,
            icon: Star,
            color: 'bg-accent-500',
            change: 'Needs moderation',
            trend: (pendingReviewsCount ?? 0) > 0 ? 'down' : null
        },
    ];

    const alertStats = [];
    if (pendingArticlesCount > 0) {
        alertStats.push({
            label: 'Pending Articles',
            value: pendingArticlesCount,
            icon: FileText,
            color: 'bg-danger-500',
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
        { id: 'trends', label: 'Trends', icon: TrendingUp },
    ];

    return (
        <AdminLayout
            contextualSidebar={
                <AdminContextualSidebar activeTab="overview" />
            }
        >
            <AdminPageContainer noPaddingY className="h-full flex flex-col">
                <div className="pb-6 border-b border-admin-pro-border">
                    {(scraperStatus.status === 'idle' || pipelineStatus.failed > 3) && (
                        <div id="alerts" className="mb-6 p-4 bg-admin-pro-danger-subtle border border-admin-pro-danger/30 rounded-lg flex items-center gap-4">
                            <AlertCircle className="w-5 h-5 text-admin-pro-danger shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-admin-pro-text text-sm">System health alert</p>
                                <p className="text-xs text-admin-pro-text-muted mt-0.5">
                                    {scraperStatus.status === 'idle' && 'Data sources idle. '}
                                    {pipelineStatus.failed > 3 && `${pipelineStatus.failed} pipeline failures detected.`}
                                </p>
                            </div>
                            <Button size="sm" variant="outline" className="border-admin-pro-danger/50 text-admin-pro-danger hover:bg-admin-pro-danger-subtle shrink-0 rounded-md" onClick={() => router.push(pipelineStatus.failed > 3 ? '/admin/pipeline-monitor' : '/admin/cms/health')}>
                                View details
                            </Button>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-admin-pro-text tracking-tight">Dashboard</h1>
                            <p className="text-sm text-admin-pro-text-muted mt-0.5">Key metrics and system status.</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { queryClient.invalidateQueries(); toast.success('Metrics refreshed.'); }}
                            className="border-admin-pro-border text-admin-pro-text-muted hover:bg-admin-pro-surface hover:text-admin-pro-text rounded-md"
                            aria-label="Refresh metrics"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh metrics
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pt-8">
                    <div id="quick-stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[...stats, ...alertStats].slice(0, 4).map((stat, index) => (
                            <div key={index} className="rounded-xl border border-admin-pro-border bg-admin-pro-surface p-5 transition-colors hover:border-admin-pro-border-light">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-admin-pro-border flex items-center justify-center shrink-0">
                                        <stat.icon className="w-5 h-5 text-admin-pro-text-muted" />
                                    </div>
                                    {stat.trend != null && (
                                        <span className={cn(
                                            "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium",
                                            stat.trend === 'up' ? "bg-admin-pro-accent-subtle text-admin-pro-accent" : "bg-admin-pro-danger-subtle text-admin-pro-danger"
                                        )}>
                                            {stat.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                            {stat.trend === 'up' ? 'Growth' : 'Alert'}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] font-medium text-admin-pro-text-muted uppercase tracking-wider mt-4 mb-1">{stat.label}</p>
                                <p className="text-2xl font-semibold text-admin-pro-text tabular-nums">{stat.value}</p>
                                <p className="text-xs text-admin-pro-text-muted mt-1">{stat.change}</p>
                            </div>
                        ))}
                    </div>

                    <div id="system-health" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="rounded-xl border border-admin-pro-border bg-admin-pro-surface overflow-hidden">
                            <div className="px-5 py-4 border-b border-admin-pro-border flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-admin-pro-border flex items-center justify-center">
                                    <Database className="w-4 h-4 text-admin-pro-text-muted" />
                                </div>
                                <span className="text-sm font-medium text-admin-pro-text">Data sources</span>
                            </div>
                            <div className="p-5">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-admin-pro-text-muted">Status</span>
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
                                            scraperStatus.status === 'running' ? "bg-admin-pro-accent-subtle text-admin-pro-accent" : "bg-admin-pro-border text-admin-pro-text-muted"
                                        )}>
                                            <span className={cn("w-1.5 h-1.5 rounded-full", scraperStatus.status === 'running' ? "bg-admin-pro-accent animate-pulse" : "bg-admin-pro-text-dim")} />
                                            {scraperStatus.status === 'running' ? 'Running' : 'Idle'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-admin-pro-text-muted">Accuracy</span>
                                        <span className="font-medium text-admin-pro-text tabular-nums">{scraperStatus.successRate || 0}%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-admin-pro-text-muted">Last run</span>
                                        <span className="text-admin-pro-text text-xs tabular-nums">{scraperStatus.lastRun ? new Date(scraperStatus.lastRun).toLocaleTimeString() : 'No data'}</span>
                                    </div>
                                    {scraperStatus.productsScraped != null && (
                                        <div className="pt-4 border-t border-admin-pro-border grid grid-cols-3 gap-2 text-center">
                                            <div className="p-2 rounded-lg bg-admin-pro-bg"><span className="text-[10px] text-admin-pro-text-muted block">Assets</span><span className="text-sm font-medium text-admin-pro-text tabular-nums">{scraperStatus.productsScraped}</span></div>
                                            <div className="p-2 rounded-lg bg-admin-pro-bg"><span className="text-[10px] text-admin-pro-text-muted block">Feed</span><span className="text-sm font-medium text-admin-pro-text tabular-nums">{scraperStatus.reviewsScraped}</span></div>
                                            <div className="p-2 rounded-lg bg-admin-pro-bg"><span className="text-[10px] text-admin-pro-text-muted block">Rates</span><span className="text-sm font-medium text-admin-pro-text tabular-nums">{scraperStatus.ratesScraped}</span></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-admin-pro-border bg-admin-pro-surface overflow-hidden">
                            <div className="px-5 py-4 border-b border-admin-pro-border flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-admin-pro-accent-subtle flex items-center justify-center">
                                    <Zap className="w-4 h-4 text-admin-pro-accent" />
                                </div>
                                <span className="text-sm font-medium text-admin-pro-text">Content pipeline</span>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-admin-pro-text-muted">Active jobs</span>
                                    <span className="font-medium text-admin-pro-text tabular-nums">{pipelineStatus.active || 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-admin-pro-text-muted">Completed</span>
                                    <span className="font-medium text-admin-pro-text tabular-nums">{pipelineStatus.completed || 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-admin-pro-text-muted">Failed</span>
                                    <span className="font-medium text-admin-pro-danger tabular-nums">{pipelineStatus.failed || 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-admin-pro-text-muted">Avg. run time</span>
                                    <span className="text-admin-pro-text text-xs tabular-nums">{pipelineStatus.avgTime || '—'}</span>
                                </div>
                                <Button size="sm" className="w-full bg-admin-pro-accent hover:bg-admin-pro-accent-hover text-white rounded-md h-9 font-medium" onClick={() => router.push('/admin/content-factory')}>
                                    <Play className="w-4 h-4 mr-2 fill-white" />
                                    Start content run
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-xl border border-admin-pro-border bg-admin-pro-surface overflow-hidden">
                            <div className="px-5 py-4 border-b border-admin-pro-border flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-admin-pro-border flex items-center justify-center">
                                    <Rss className="w-4 h-4 text-admin-pro-text-muted" />
                                </div>
                                <span className="text-sm font-medium text-admin-pro-text">RSS feeds</span>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-admin-pro-text-muted">Feeds connected</span>
                                    <span className="font-medium text-admin-pro-text tabular-nums">{Array.isArray(rssFeeds) ? rssFeeds.filter((f: any) => f?.status === 'active').length : 0}</span>
                                </div>
                                <div className="space-y-2">
                                    {Array.isArray(rssFeeds) && rssFeeds.slice(0, 3).map((feed: any) => (
                                        <div key={feed.id} className="flex items-center justify-between py-2 px-3 rounded-md bg-admin-pro-bg text-sm">
                                            <span className="text-admin-pro-text truncate flex-1">{feed.name}</span>
                                            <span className="text-admin-pro-text-muted text-xs tabular-nums ml-2">{feed.itemsCount || 0}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button size="sm" variant="outline" className="w-full border-admin-pro-border text-admin-pro-text-muted hover:bg-admin-pro-surface-hover hover:text-admin-pro-text rounded-md h-9 font-medium">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Sync feeds
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Dashboard overview */}
                    <div className="space-y-6">
                        <div className="space-y-6">
                                {/* Social Media Metrics */}
                                <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50 rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-border/50 dark:border-border/50 px-8 py-6">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground dark:text-muted-foreground flex items-center gap-6 md:p-8">
                                <div className="w-8 h-8 rounded-lg bg-secondary-500/10 flex items-center justify-center">
                                    <Share2 className="w-4 h-4 text-secondary-400" />
                                </div>
                                Omnichannel Presence
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {socialMetrics.facebook && (
                                    <div className="text-center p-6 bg-card dark:bg-card border border-border/50 dark:border-border/50 rounded-2xl hover:bg-accent/5 dark:bg-accent/5 transition-colors group">
                                        <Facebook className="w-6 h-6 text-secondary-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                        <div className="text-2xl font-bold text-foreground dark:text-foreground tabular-nums mb-1">{(socialMetrics.facebook?.followers ?? 0).toLocaleString()}</div>
                                        <div className="text-[10px] font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-wider mb-2">Followers</div>
                                        <div className="text-[10px] font-bold text-primary-400 bg-primary-400/10 px-2 py-0.5 rounded-full inline-block">
                                            +{socialMetrics.facebook.engagement}% Engagement
                                        </div>
                                    </div>
                                )}
                                {socialMetrics.twitter && (
                                    <div className="text-center p-6 bg-card dark:bg-card border border-border/50 dark:border-border/50 rounded-2xl hover:bg-accent/5 dark:bg-accent/5 transition-colors group">
                                        <Twitter className="w-6 h-6 text-secondary-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                        <div className="text-2xl font-bold text-foreground dark:text-foreground tabular-nums mb-1">{(socialMetrics.twitter?.followers ?? 0).toLocaleString()}</div>
                                        <div className="text-[10px] font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-wider mb-2">Followers</div>
                                        <div className="text-[10px] font-bold text-primary-400 bg-primary-400/10 px-2 py-0.5 rounded-full inline-block">
                                            +{socialMetrics.twitter.engagement}% Engagement
                                        </div>
                                    </div>
                                )}
                                {socialMetrics.linkedin && (
                                    <div className="text-center p-6 bg-card dark:bg-card border border-border/50 dark:border-border/50 rounded-2xl hover:bg-accent/5 dark:bg-accent/5 transition-colors group">
                                        <Linkedin className="w-6 h-6 text-secondary-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                        <div className="text-2xl font-bold text-foreground dark:text-foreground tabular-nums mb-1">{(socialMetrics.linkedin?.followers ?? 0).toLocaleString()}</div>
                                        <div className="text-[10px] font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-wider mb-2">Followers</div>
                                        <div className="text-[10px] font-bold text-primary-400 bg-primary-400/10 px-2 py-0.5 rounded-full inline-block">
                                            +{socialMetrics.linkedin.engagement}% Engagement
                                        </div>
                                    </div>
                                )}
                                {socialMetrics.instagram && (
                                    <div className="text-center p-6 bg-card dark:bg-card border border-border/50 dark:border-border/50 rounded-2xl hover:bg-accent/5 dark:bg-accent/5 transition-colors group">
                                        <Instagram className="w-6 h-6 text-danger-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                        <div className="text-2xl font-bold text-foreground dark:text-foreground tabular-nums mb-1">{(socialMetrics.instagram?.followers ?? 0).toLocaleString()}</div>
                                        <div className="text-[10px] font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-wider mb-2">Followers</div>
                                        <div className="text-[10px] font-bold text-primary-400 bg-primary-400/10 px-2 py-0.5 rounded-full inline-block">
                                            +{socialMetrics.instagram.engagement}% Engagement
                                        </div>
                                    </div>
                                )}
                                {socialMetrics.youtube && (
                                    <div className="text-center p-6 bg-card dark:bg-card border border-border/50 dark:border-border/50 rounded-2xl hover:bg-accent/5 dark:bg-accent/5 transition-colors group">
                                        <Youtube className="w-6 h-6 text-danger-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                        <div className="text-2xl font-bold text-foreground dark:text-foreground tabular-nums mb-1">{(socialMetrics.youtube?.subscribers ?? 0).toLocaleString()}</div>
                                        <div className="text-[10px] font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-wider mb-2">Subscribers</div>
                                        <div className="text-[10px] font-bold text-foreground/80 dark:text-foreground/80 bg-white/5 px-2 py-0.5 rounded-full inline-block">
                                            {(socialMetrics.youtube?.views ?? 0).toLocaleString()} Views
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Trends */}
                    <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50 rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-border/50 dark:border-border/50 px-8 py-6">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground dark:text-muted-foreground flex items-center gap-6 md:p-8">
                                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-primary-400" />
                                </div>
                                Intelligence Vectors
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.isArray(trends) && trends.map((trend: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-5 bg-card dark:bg-card border border-border/50 dark:border-border/50 rounded-2xl hover:border-primary-500/30 transition-all group">
                                        <div className="flex-1">
                                            <div className="font-bold text-foreground dark:text-foreground mb-1 group-hover:text-primary-400 transition-colors">{trend.keyword}</div>
                                            <div className="text-[10px] font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-widest">Velocity: {(trend.volume ?? 0).toLocaleString()}</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`text-sm font-bold tabular-nums ${
                                                trend.trend === 'up' ? 'text-primary-400' : 'text-danger-400'
                                            }`}>
                                                {trend.trend === 'up' ? '+' : ''}{trend.change}%
                                            </div>
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                                trend.trend === 'up' ? 'bg-primary-500/10' : 'bg-danger-500/10'
                                            )}>
                                                {trend.trend === 'up' ? (
                                                    <ArrowUpRight className="w-4 h-4 text-primary-400" />
                                                ) : (
                                                    <ArrowDownRight className="w-4 h-4 text-danger-400" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Snapshot */}
                                <Card id="recent-activity" className="bg-card dark:bg-card border-border/50 dark:border-border/50 rounded-2xl overflow-hidden">
                                    <CardHeader className="border-b border-border/50 dark:border-border/50 px-8 py-5">
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground dark:text-muted-foreground">Content Snapshot</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            <div className="p-6 bg-card dark:bg-card rounded-2xl border border-border/50 dark:border-border/50 text-center">
                                                <div className="text-3xl font-extrabold text-foreground dark:text-foreground mb-1">{statsData?.total_articles ?? 0}</div>
                                                <div className="text-[10px] font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-widest">Grand Total</div>
                                                <div className="mt-3 text-[10px] font-bold text-secondary-400">
                                                    {statsData?.published_articles ?? 0} Published
                                                </div>
                                            </div>
                                            <div className="p-6 bg-card dark:bg-card rounded-2xl border border-border/50 dark:border-border/50 text-center">
                                                <div className="text-3xl font-extrabold text-foreground dark:text-foreground mb-1">{Number(totalViews ?? 0).toLocaleString()}</div>
                                                <div className="text-[10px] font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-widest">Total Impact</div>
                                                <div className="mt-3 text-[10px] font-bold text-primary-400">
                                                    Aggregate Views
                                                </div>
                                            </div>
                                            <div className="p-6 bg-card dark:bg-card rounded-2xl border border-border/50 dark:border-border/50 text-center">
                                                <div className="text-3xl font-extrabold text-foreground dark:text-foreground mb-1">{statsData?.ai_generated_articles ?? 0}</div>
                                                <div className="text-[10px] font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-widest">AI Synthesis</div>
                                                <div className="mt-3 text-[10px] font-bold text-primary-400">
                                                    Automated Drafts
                                                </div>
                                            </div>
                                            <div className="p-6 bg-card dark:bg-card rounded-2xl border border-border/50 dark:border-border/50 text-center">
                                                <div className="text-3xl font-extrabold text-accent-500 mb-1">{pendingArticlesCount ?? 0}</div>
                                                <div className="text-[10px] font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-widest">Moderation</div>
                                                <div className="mt-3 text-[10px] font-bold text-accent-500/80">
                                                    Pending Review
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Advanced Metrics Table - Research → Publish → Tracking → Income */}
                                <AdvancedMetricsTable timeRange={timeRange as '7d' | '30d' | '90d'} />

                                {/* Revenue Attribution - Top Money-Making Articles */}
                                <Card className="bg-gradient-to-br from-success-500/5 to-success-600/5 border-success-500/20 rounded-2xl overflow-hidden">
                                    <CardHeader className="border-b border-success-500/10 px-8 py-5">
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-success-400 flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4" />
                                                Top Revenue-Generating Content
                                            </span>
                                            <Badge className="bg-success-500/20 text-success-400 border-success-500/30">
                                                High Impact
                                            </Badge>
                                        </CardTitle>
                                </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="space-y-4">
                                            {/* Top 5 Articles by Revenue */}
                                            {recentArticles.slice(0, 5).map((article: any, index: number) => (
                                                <div key={article.id} className="flex items-center justify-between p-5 bg-card dark:bg-card border border-border/50 dark:border-border/50 rounded-xl hover:border-success-500/30 transition-all group">
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-foreground dark:text-foreground ${
                                                            index === 0 ? 'bg-success-500' : 
                                                            index === 1 ? 'bg-success-600' : 
                                                            'bg-white/10'
                                                        }`}>
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-foreground dark:text-foreground group-hover:text-success-400 transition-colors truncate max-w-md">
                                                                {article.title}
                                                            </div>
                                                            <div className="flex items-center gap-4 mt-1">
                                                                <span className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70">
                                                                    {(article.views ?? 0).toLocaleString()} views
                                                                </span>
                                                                <Badge variant="outline" className="text-[10px] border-border/70 dark:border-border/70 text-muted-foreground dark:text-muted-foreground capitalize">
                                                                    {article.category || 'general'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-success-400 tabular-nums">
                                                            —
                                                        </div>
                                                        <div className="text-[10px] font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-wider">
                                                            Revenue (connect analytics)
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            {recentArticles.length === 0 && (
                                                <div className="text-center py-12">
                                                    <DollarSign className="w-12 h-12 text-muted-foreground/50 dark:text-muted-foreground/50 mx-auto mb-4" />
                                                    <p className="text-muted-foreground dark:text-muted-foreground">No revenue data available yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* System Performance Indicators */}
                                <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50 rounded-2xl overflow-hidden">
                                    <CardHeader className="border-b border-border/50 dark:border-border/50 px-8 py-5">
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground dark:text-muted-foreground">System Performance Indicators</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="p-6 bg-card dark:bg-card rounded-2xl border border-border/50 dark:border-border/50 group hover:border-primary-500/30 transition-all">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-xs font-bold text-muted-foreground dark:text-muted-foreground uppercase tracking-widest">Publication Rate</span>
                                                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                                                        <FileText className="w-4 h-4 text-primary-400" />
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-extrabold text-foreground dark:text-foreground mb-1">
                                                    {statsData?.articles_this_month ?? 0}
                                                </div>
                                                <div className="text-[10px] font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-widest">Articles this cycle</div>
                                            </div>
                                            <div className="p-6 bg-card dark:bg-card rounded-2xl border border-border/50 dark:border-border/50 group hover:border-primary-500/30 transition-all">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-xs font-bold text-muted-foreground dark:text-muted-foreground uppercase tracking-widest">Sentiment Stream</span>
                                                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                                                        <Star className="w-4 h-4 text-primary-400" />
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-extrabold text-foreground dark:text-foreground mb-1">{reviews?.length ?? 0}</div>
                                                <div className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">
                                                    {pendingReviewsCount ?? 0} Pending Node Analysis
                                                </div>
                                            </div>
                                            <div className="p-6 bg-card dark:bg-card rounded-2xl border border-border/50 dark:border-border/50 group hover:border-primary-500/30 transition-all">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-xs font-bold text-muted-foreground dark:text-muted-foreground uppercase tracking-widest">Monetization Velocity</span>
                                                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                                                        <MousePointerClick className="w-4 h-4 text-primary-400" />
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-extrabold text-foreground dark:text-foreground mb-1">{(totalClicks ?? 0).toLocaleString()}</div>
                                                <div className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">{conversionRate ?? 0}% Conversion Efficiency</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                    </div>
                </div>
            </AdminPageContainer>
            
            {/* Confirm Dialog for Rejecting Reviews */}
            <ConfirmDialog
                open={rejectDialogOpen}
                onOpenChange={setRejectDialogOpen}
                onConfirm={async () => {
                    if (reviewToReject) {
                        const supabase = createClient();
                        await supabase
                            .from('reviews')
                            .update({ status: 'rejected' })
                            .eq('id', reviewToReject);
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
