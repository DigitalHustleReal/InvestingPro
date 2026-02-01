"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient as api } from '@/lib/api-client';
// Removed articleService import - use api.entities.Article instead (client-safe)
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
    FileText,
    DollarSign,
    Eye,
    MousePointerClick,
    Star,
    Rss,
    Share2,
    Activity,
    Database,
    Zap,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    Play,
    AlertCircle,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import AdvancedMetricsTable from "@/components/admin/AdvancedMetricsTable";
import { cn } from "@/lib/utils";

export default function AdminPage() {
    const router = useRouter();
    const [timeRange, setTimeRange] = useState('30d');
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [reviewToReject, setReviewToReject] = useState<string | null>(null);
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

    return (
        <AdminLayout>
            <AdminPageContainer noPaddingY className="h-full flex flex-col">
                <div className="pb-6 border-b border-wt-border">
                    {(scraperStatus.status === 'idle' || pipelineStatus.failed > 3) && (
                        <div id="alerts" className="mb-6 p-4 bg-wt-danger-subtle border border-wt-danger/30 rounded-lg flex items-center gap-4">
                            <AlertCircle className="w-5 h-5 text-wt-danger shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-wt-text text-sm">System health alert</p>
                                <p className="text-xs text-wt-text-muted mt-0.5">
                                    {scraperStatus.status === 'idle' && 'Data sources idle. '}
                                    {pipelineStatus.failed > 3 && `${pipelineStatus.failed} pipeline failures detected.`}
                                </p>
                            </div>
                            <Button size="sm" className="shrink-0 rounded-md bg-wt-gold hover:bg-wt-gold-hover text-white font-medium border-0" onClick={() => router.push(pipelineStatus.failed > 3 ? '/admin/pipeline-monitor' : '/admin/cms/health')}>
                                View details
                            </Button>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-wt-text tracking-tight">Dashboard</h1>
                            <p className="text-sm text-wt-text-muted mt-0.5">Key metrics and system status.</p>
                        </div>
                        <Button
                            size="sm"
                            onClick={() => { queryClient.invalidateQueries(); toast.success('Metrics refreshed.'); }}
                            className="rounded-md border border-wt-border bg-wt-surface text-wt-text hover:bg-wt-surface-hover font-medium"
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
                            <div key={index} className="rounded-xl border border-wt-border bg-wt-surface p-5 transition-colors hover:border-wt-border-light">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-wt-border flex items-center justify-center shrink-0">
                                        <stat.icon className="w-5 h-5 text-wt-text-muted" />
                                    </div>
                                    {stat.trend != null && (
                                        <span className={cn(
                                            "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium",
                                            stat.trend === 'up' ? "bg-wt-gold-subtle text-wt-gold" : "bg-wt-danger-subtle text-wt-danger"
                                        )}>
                                            {stat.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                            {stat.trend === 'up' ? 'Growth' : 'Alert'}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] font-medium text-wt-text-muted uppercase tracking-wider mt-4 mb-1">{stat.label}</p>
                                <p className="text-2xl font-semibold text-wt-text tabular-nums">{stat.value}</p>
                                <p className="text-xs text-wt-text-muted mt-1">{stat.change}</p>
                            </div>
                        ))}
                    </div>

                    <div id="system-health" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="rounded-xl border border-wt-border bg-wt-surface overflow-hidden">
                            <div className="px-5 py-4 border-b border-wt-border flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-wt-border flex items-center justify-center">
                                    <Database className="w-4 h-4 text-wt-text-muted" />
                                </div>
                                <span className="text-sm font-medium text-wt-text">Data sources</span>
                            </div>
                            <div className="p-5">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-wt-text-muted">Status</span>
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
                                            scraperStatus.status === 'running' ? "bg-wt-gold-subtle text-wt-gold" : "bg-wt-border text-wt-text-muted"
                                        )}>
                                            <span className={cn("w-1.5 h-1.5 rounded-full", scraperStatus.status === 'running' ? "bg-wt-gold animate-pulse" : "bg-wt-text-dim")} />
                                            {scraperStatus.status === 'running' ? 'Running' : 'Idle'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-wt-text-muted">Accuracy</span>
                                        <span className="font-medium text-wt-text tabular-nums">{scraperStatus.successRate || 0}%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-wt-text-muted">Last run</span>
                                        <span className="text-wt-text text-xs tabular-nums">{scraperStatus.lastRun ? new Date(scraperStatus.lastRun).toLocaleTimeString() : 'No data'}</span>
                                    </div>
                                    {scraperStatus.productsScraped != null && (
                                        <div className="pt-4 border-t border-wt-border grid grid-cols-3 gap-2 text-center">
                                            <div className="p-2 rounded-lg bg-wt-bg"><span className="text-[10px] text-wt-text-muted block">Assets</span><span className="text-sm font-medium text-wt-text tabular-nums">{scraperStatus.productsScraped}</span></div>
                                            <div className="p-2 rounded-lg bg-wt-bg"><span className="text-[10px] text-wt-text-muted block">Feed</span><span className="text-sm font-medium text-wt-text tabular-nums">{scraperStatus.reviewsScraped}</span></div>
                                            <div className="p-2 rounded-lg bg-wt-bg"><span className="text-[10px] text-wt-text-muted block">Rates</span><span className="text-sm font-medium text-wt-text tabular-nums">{scraperStatus.ratesScraped}</span></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-wt-border bg-wt-surface overflow-hidden">
                            <div className="px-5 py-4 border-b border-wt-border flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-wt-gold-subtle flex items-center justify-center">
                                    <Zap className="w-4 h-4 text-wt-gold" />
                                </div>
                                <span className="text-sm font-medium text-wt-text">Content pipeline</span>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-wt-text-muted">Active jobs</span>
                                    <span className="font-medium text-wt-text tabular-nums">{pipelineStatus.active || 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-wt-text-muted">Completed</span>
                                    <span className="font-medium text-wt-text tabular-nums">{pipelineStatus.completed || 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-wt-text-muted">Failed</span>
                                    <span className="font-medium text-wt-danger tabular-nums">{pipelineStatus.failed || 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-wt-text-muted">Avg. run time</span>
                                    <span className="text-wt-text text-xs tabular-nums">{pipelineStatus.avgTime || '—'}</span>
                                </div>
                                <Button size="sm" className="w-full bg-wt-gold hover:bg-wt-gold-hover text-white rounded-md h-9 font-medium" onClick={() => router.push('/admin/content-factory')}>
                                    <Play className="w-4 h-4 mr-2 fill-white" />
                                    Start content run
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-xl border border-wt-border bg-wt-surface overflow-hidden">
                            <div className="px-5 py-4 border-b border-wt-border flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-wt-border flex items-center justify-center">
                                    <Rss className="w-4 h-4 text-wt-text-muted" />
                                </div>
                                <span className="text-sm font-medium text-wt-text">RSS feeds</span>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-wt-text-muted">Feeds connected</span>
                                    <span className="font-medium text-wt-text tabular-nums">{Array.isArray(rssFeeds) ? rssFeeds.filter((f: any) => f?.status === 'active').length : 0}</span>
                                </div>
                                <div className="space-y-2">
                                    {Array.isArray(rssFeeds) && rssFeeds.slice(0, 3).map((feed: any) => (
                                        <div key={feed.id} className="flex items-center justify-between py-2 px-3 rounded-md bg-wt-bg text-sm">
                                            <span className="text-wt-text truncate flex-1">{feed.name}</span>
                                            <span className="text-wt-text-muted text-xs tabular-nums ml-2">{feed.itemsCount || 0}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button size="sm" className="w-full rounded-md h-9 font-medium border border-wt-border bg-wt-surface text-wt-text hover:bg-wt-surface-hover">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Sync feeds
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Dashboard overview */}
                    <div className="space-y-8">
                        {/* Section: Omnichannel & Intelligence */}
                        <div className="space-y-6">
                            <h2 className="text-xs font-semibold text-wt-text-muted uppercase tracking-wider">Channels & intelligence</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Social / Omnichannel */}
                                <div className="rounded-xl border border-wt-border bg-wt-surface overflow-hidden">
                                    <div className="px-5 py-4 border-b border-wt-border flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-wt-border flex items-center justify-center">
                                            <Share2 className="w-4 h-4 text-wt-text-muted" />
                                        </div>
                                        <span className="text-sm font-medium text-wt-text">Omnichannel presence</span>
                                    </div>
                                    <div className="p-5">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {socialMetrics.facebook && (
                                                <div className="text-center p-4 rounded-lg bg-wt-bg border border-wt-border/50">
                                                    <Facebook className="w-5 h-5 text-wt-text-muted mx-auto mb-2" />
                                                    <div className="text-lg font-semibold text-wt-text tabular-nums">{(socialMetrics.facebook?.followers ?? 0).toLocaleString()}</div>
                                                    <div className="text-[10px] font-medium text-wt-text-muted uppercase tracking-wider">Followers</div>
                                                </div>
                                            )}
                                            {socialMetrics.twitter && (
                                                <div className="text-center p-4 rounded-lg bg-wt-bg border border-wt-border/50">
                                                    <Twitter className="w-5 h-5 text-wt-text-muted mx-auto mb-2" />
                                                    <div className="text-lg font-semibold text-wt-text tabular-nums">{(socialMetrics.twitter?.followers ?? 0).toLocaleString()}</div>
                                                    <div className="text-[10px] font-medium text-wt-text-muted uppercase tracking-wider">Followers</div>
                                                </div>
                                            )}
                                            {socialMetrics.linkedin && (
                                                <div className="text-center p-4 rounded-lg bg-wt-bg border border-wt-border/50">
                                                    <Linkedin className="w-5 h-5 text-wt-text-muted mx-auto mb-2" />
                                                    <div className="text-lg font-semibold text-wt-text tabular-nums">{(socialMetrics.linkedin?.followers ?? 0).toLocaleString()}</div>
                                                    <div className="text-[10px] font-medium text-wt-text-muted uppercase tracking-wider">Followers</div>
                                                </div>
                                            )}
                                            {socialMetrics.instagram && (
                                                <div className="text-center p-4 rounded-lg bg-wt-bg border border-wt-border/50">
                                                    <Instagram className="w-5 h-5 text-wt-text-muted mx-auto mb-2" />
                                                    <div className="text-lg font-semibold text-wt-text tabular-nums">{(socialMetrics.instagram?.followers ?? 0).toLocaleString()}</div>
                                                    <div className="text-[10px] font-medium text-wt-text-muted uppercase tracking-wider">Followers</div>
                                                </div>
                                            )}
                                            {socialMetrics.youtube && (
                                                <div className="text-center p-4 rounded-lg bg-wt-bg border border-wt-border/50">
                                                    <Youtube className="w-5 h-5 text-wt-text-muted mx-auto mb-2" />
                                                    <div className="text-lg font-semibold text-wt-text tabular-nums">{(socialMetrics.youtube?.subscribers ?? 0).toLocaleString()}</div>
                                                    <div className="text-[10px] font-medium text-wt-text-muted uppercase tracking-wider">Subscribers</div>
                                                </div>
                                            )}
                                            {!socialMetrics.facebook && !socialMetrics.twitter && !socialMetrics.linkedin && !socialMetrics.instagram && !socialMetrics.youtube && (
                                                <div className="col-span-2 sm:col-span-3 text-center py-6 text-sm text-wt-text-muted">Connect channels in Settings</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Trends / Intelligence Vectors */}
                                <div className="rounded-xl border border-wt-border bg-wt-surface overflow-hidden">
                                    <div className="px-5 py-4 border-b border-wt-border flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-wt-gold-subtle flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 text-wt-gold" />
                                        </div>
                                        <span className="text-sm font-medium text-wt-text">Intelligence vectors</span>
                                    </div>
                                    <div className="p-5">
                                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                            {Array.isArray(trends) && trends.length > 0 ? trends.slice(0, 6).map((trend: any, index: number) => (
                                                <div key={index} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-wt-bg border border-wt-border/50">
                                                    <span className="font-medium text-wt-text truncate">{trend.keyword}</span>
                                                    <span className={cn(
                                                        "text-sm font-medium tabular-nums shrink-0 ml-2",
                                                        trend.trend === 'up' ? 'text-wt-gold' : 'text-wt-danger'
                                                    )}>
                                                        {trend.trend === 'up' ? '+' : ''}{trend.change}%
                                                    </span>
                                                </div>
                                            )) : (
                                                <div className="text-center py-8 text-sm text-wt-text-muted">No trend data yet</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Content snapshot */}
                        <div className="space-y-4">
                            <h2 className="text-xs font-semibold text-wt-text-muted uppercase tracking-wider">Content snapshot</h2>
                            <div id="recent-activity" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="rounded-xl border border-wt-border bg-wt-surface p-5 text-center">
                                    <div className="text-2xl font-semibold text-wt-text tabular-nums">{statsData?.total_articles ?? 0}</div>
                                    <div className="text-[10px] font-medium text-wt-text-muted uppercase tracking-wider mt-1">Total articles</div>
                                    <div className="text-xs text-wt-text-muted mt-1">{statsData?.published_articles ?? 0} published</div>
                                </div>
                                <div className="rounded-xl border border-wt-border bg-wt-surface p-5 text-center">
                                    <div className="text-2xl font-semibold text-wt-text tabular-nums">{Number(totalViews ?? 0).toLocaleString()}</div>
                                    <div className="text-[10px] font-medium text-wt-text-muted uppercase tracking-wider mt-1">Total views</div>
                                </div>
                                <div className="rounded-xl border border-wt-border bg-wt-surface p-5 text-center">
                                    <div className="text-2xl font-semibold text-wt-text tabular-nums">{statsData?.ai_generated_articles ?? 0}</div>
                                    <div className="text-[10px] font-medium text-wt-text-muted uppercase tracking-wider mt-1">AI drafts</div>
                                </div>
                                <div className="rounded-xl border border-wt-border bg-wt-surface p-5 text-center">
                                    <div className="text-2xl font-semibold text-wt-gold tabular-nums">{pendingArticlesCount ?? 0}</div>
                                    <div className="text-[10px] font-medium text-wt-text-muted uppercase tracking-wider mt-1">Pending review</div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Metrics & pipeline */}
                        <div className="space-y-4">
                            <h2 className="text-xs font-semibold text-wt-text-muted uppercase tracking-wider">Metrics & pipeline</h2>
                            <AdvancedMetricsTable timeRange={timeRange as '7d' | '30d' | '90d'} />
                        </div>

                        {/* Section: Revenue & performance */}
                        <div className="space-y-6">
                            <h2 className="text-xs font-semibold text-wt-text-muted uppercase tracking-wider">Revenue & performance</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Top content by revenue */}
                                <div className="rounded-xl border border-wt-border bg-wt-surface overflow-hidden">
                                    <div className="px-5 py-4 border-b border-wt-border flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-wt-gold-subtle flex items-center justify-center">
                                            <DollarSign className="w-4 h-4 text-wt-gold" />
                                        </div>
                                        <span className="text-sm font-medium text-wt-text">Top revenue content</span>
                                    </div>
                                    <div className="p-5">
                                        <div className="space-y-2">
                                            {recentArticles.slice(0, 5).map((article: any, index: number) => (
                                                <div key={article.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-wt-bg border border-wt-border/50">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-medium bg-wt-border text-wt-text-muted shrink-0">
                                                            {index + 1}
                                                        </span>
                                                        <span className="font-medium text-wt-text truncate">{article.title}</span>
                                                    </div>
                                                    <span className="text-xs text-wt-text-muted shrink-0 ml-2">{(article.views ?? 0).toLocaleString()} views</span>
                                                </div>
                                            ))}
                                            {recentArticles.length === 0 && (
                                                <div className="text-center py-8 text-sm text-wt-text-muted">Connect analytics for revenue data</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Performance indicators */}
                                <div className="rounded-xl border border-wt-border bg-wt-surface overflow-hidden">
                                    <div className="px-5 py-4 border-b border-wt-border flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-wt-border flex items-center justify-center">
                                            <Activity className="w-4 h-4 text-wt-text-muted" />
                                        </div>
                                        <span className="text-sm font-medium text-wt-text">Performance</span>
                                    </div>
                                    <div className="p-5">
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="p-4 rounded-lg bg-wt-bg border border-wt-border/50 text-center">
                                                <div className="text-xl font-semibold text-wt-text tabular-nums">{statsData?.articles_this_month ?? 0}</div>
                                                <div className="text-[10px] font-medium text-wt-text-muted uppercase tracking-wider mt-1">This month</div>
                                            </div>
                                            <div className="p-4 rounded-lg bg-wt-bg border border-wt-border/50 text-center">
                                                <div className="text-xl font-semibold text-wt-text tabular-nums">{pendingReviewsCount ?? 0}</div>
                                                <div className="text-[10px] font-medium text-wt-text-muted uppercase tracking-wider mt-1">Pending reviews</div>
                                            </div>
                                            <div className="p-4 rounded-lg bg-wt-bg border border-wt-border/50 text-center">
                                                <div className="text-xl font-semibold text-wt-text tabular-nums">{(totalClicks ?? 0).toLocaleString()}</div>
                                                <div className="text-[10px] font-medium text-wt-text-muted uppercase tracking-wider mt-1">{conversionRate ?? 0}% conv.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
