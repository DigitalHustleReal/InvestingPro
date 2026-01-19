"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { apiClient as api } from '@/lib/api-client';
import { 
    Search,
    FileText,
    Eye,
    TrendingUp,
    DollarSign,
    ArrowRight,
    CheckCircle2,
    Clock,
    BarChart3,
    MousePointerClick,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Advanced Metrics Table
 * 
 * Shows complete content lifecycle sequence:
 * 1. RESEARCH - Keyword discovery, trends, opportunities
 * 2. PUBLISH - Articles created, published, scheduled
 * 3. TRACKING - Views, engagement, rankings, clicks
 * 4. INCOME - Revenue, conversions, attribution
 */
export default function AdvancedMetricsTable({ timeRange = '30d' }: { timeRange?: '7d' | '30d' | '90d' }) {
    // Fetch articles for all lifecycle stages
    const { data: articles = [] } = useQuery({
        queryKey: ['articles-metrics', timeRange],
        queryFn: async () => {
            const articles = await api.entities.Article.list('-created_date', 500);
            return Array.isArray(articles) ? articles : [];
        },
        initialData: [],
    });

    // Fetch keyword research data
    const { data: keywordData = { totalKeywords: 0, activeKeywords: 0, trendingKeywords: [] } } = useQuery({
        queryKey: ['keyword-metrics', timeRange],
        queryFn: async () => {
            try {
                // Fetch keyword research stats
                const response = await fetch(`/api/admin/keywords/stats?timeRange=${timeRange}`);
                if (!response.ok) return { totalKeywords: 0, activeKeywords: 0, trendingKeywords: [] };
                return response.json();
            } catch {
                return { totalKeywords: 0, activeKeywords: 0, trendingKeywords: [] };
            }
        },
    });

    // Fetch affiliate products for income tracking
    const { data: affiliateProducts = [] } = useQuery({
        queryKey: ['affiliate-products-metrics'],
        queryFn: () => api.entities.AffiliateProduct.list('-clicks', 100),
        initialData: [],
    });

    // Calculate RESEARCH metrics
    const researchMetrics = {
        keywordsResearched: keywordData.totalKeywords || 0,
        activeKeywords: keywordData.activeKeywords || 0,
        trendingKeywords: keywordData.trendingKeywords?.length || 0,
        keywordOpportunities: articles.filter((a: any) => a.primary_keyword).length,
    };

    // Calculate PUBLISH metrics
    const publishMetrics = {
        totalCreated: articles.length,
        published: articles.filter((a: any) => a.status === 'published').length,
        scheduled: articles.filter((a: any) => a.status === 'scheduled').length,
        drafts: articles.filter((a: any) => a.status === 'draft').length,
        publishedThisPeriod: articles.filter((a: any) => {
            if (a.status !== 'published') return false;
            const publishedDate = new Date(a.published_date || a.created_date || 0);
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90));
            return publishedDate >= cutoff;
        }).length,
    };

    // Calculate TRACKING metrics
    const trackingMetrics = {
        totalViews: articles.reduce((sum: number, a: any) => sum + (a.views || 0), 0),
        avgViewsPerArticle: publishMetrics.published > 0 
            ? Math.round(articles.filter((a: any) => a.status === 'published').reduce((sum: number, a: any) => sum + (a.views || 0), 0) / publishMetrics.published)
            : 0,
        totalClicks: affiliateProducts.reduce((sum: number, p: any) => sum + (p.clicks || 0), 0),
        conversionRate: affiliateProducts.length > 0
            ? ((affiliateProducts.reduce((sum: number, p: any) => sum + (p.conversions || 0), 0) / 
                affiliateProducts.reduce((sum: number, p: any) => sum + (p.clicks || 0), 1)) * 100).toFixed(1)
            : '0.0',
        topPerforming: articles
            .filter((a: any) => a.status === 'published')
            .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
            .slice(0, 5),
    };

    // Calculate INCOME metrics
    const incomeMetrics = {
        estimatedRevenue: affiliateProducts.reduce((sum: number, p: any) => {
            // Assume $0.50 per click (adjust based on actual rates)
            return sum + ((p.clicks || 0) * 0.5);
        }, 0),
        totalConversions: affiliateProducts.reduce((sum: number, p: any) => sum + (p.conversions || 0), 0),
        revenuePerArticle: publishMetrics.published > 0
            ? (affiliateProducts.reduce((sum: number, p: any) => sum + ((p.clicks || 0) * 0.5), 0) / publishMetrics.published)
            : 0,
        topRevenueArticles: articles
            .map((a: any) => {
                // Estimate revenue per article based on views
                const articleViews = a.views || 0;
                const estimatedRevenue = articleViews * 0.1; // $0.10 per view estimate
                return { ...a, estimatedRevenue };
            })
            .sort((a: any, b: any) => b.estimatedRevenue - a.estimatedRevenue)
            .slice(0, 5),
    };

    const stages = [
        {
            id: 'research',
            name: 'RESEARCH',
            icon: Search,
            color: 'text-primary-400',
            bgColor: 'bg-primary-500/10',
            borderColor: 'border-primary-500/20',
            metrics: researchMetrics,
            labels: {
                keywordsResearched: 'Keywords Researched',
                activeKeywords: 'Active Keywords',
                trendingKeywords: 'Trending Now',
                keywordOpportunities: 'Opportunities',
            },
        },
        {
            id: 'publish',
            name: 'PUBLISH',
            icon: FileText,
            color: 'text-secondary-400',
            bgColor: 'bg-secondary-500/10',
            borderColor: 'border-secondary-500/20',
            metrics: publishMetrics,
            labels: {
                totalCreated: 'Total Created',
                published: 'Published',
                scheduled: 'Scheduled',
                drafts: 'Drafts',
                publishedThisPeriod: `Published (${timeRange})`,
            },
        },
        {
            id: 'tracking',
            name: 'TRACKING',
            icon: Eye,
            color: 'text-accent-400',
            bgColor: 'bg-accent-500/10',
            borderColor: 'border-accent-500/20',
            metrics: trackingMetrics,
            labels: {
                totalViews: 'Total Views',
                avgViewsPerArticle: 'Avg Views/Article',
                totalClicks: 'Total Clicks',
                conversionRate: 'Conversion Rate',
                topPerforming: 'Top Performers',
            },
        },
        {
            id: 'income',
            name: 'INCOME',
            icon: DollarSign,
            color: 'text-success-400',
            bgColor: 'bg-success-500/10',
            borderColor: 'border-success-500/20',
            metrics: incomeMetrics,
            labels: {
                estimatedRevenue: 'Est. Revenue',
                totalConversions: 'Conversions',
                revenuePerArticle: 'Revenue/Article',
                topRevenueArticles: 'Top Revenue',
            },
        },
    ];

    return (
        <div className="space-y-6">
            <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-border/50 dark:border-border/50 px-8 py-6">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground dark:text-muted-foreground flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="w-5 h-5 text-primary-400" />
                            <span>Advanced Metrics - Content Lifecycle Sequence</span>
                        </div>
                        <Badge className="bg-primary-500/20 text-primary-400 border-primary-500/30">
                            {timeRange.toUpperCase()}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    {/* Lifecycle Flow Visualization */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
                        {stages.map((stage, index) => (
                            <React.Fragment key={stage.id}>
                                <div className={cn(
                                    "p-6 rounded-2xl border-2 transition-all hover:scale-105",
                                    stage.bgColor,
                                    stage.borderColor
                                )}>
                                    {/* Stage Header */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stage.bgColor)}>
                                            <stage.icon className={cn("w-5 h-5", stage.color)} />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground dark:text-muted-foreground">
                                                STAGE {index + 1}
                                            </h3>
                                            <h4 className={cn("text-lg font-extrabold", stage.color)}>
                                                {stage.name}
                                            </h4>
                                        </div>
                                    </div>

                                    {/* Stage Metrics */}
                                    <div className="space-y-4">
                                        {Object.entries(stage.metrics).map(([key, value]) => {
                                            if (key === 'topPerforming' || key === 'topRevenueArticles') return null;
                                            
                                            const label = stage.labels[key as keyof typeof stage.labels];
                                            const displayValue = typeof value === 'number' 
                                                ? value.toLocaleString() 
                                                : value;

                                            return (
                                                <div key={key} className="flex items-center justify-between">
                                                    <span className="text-xs font-medium text-muted-foreground dark:text-muted-foreground">
                                                        {label}
                                                    </span>
                                                    <span className={cn("text-sm font-bold tabular-nums", stage.color)}>
                                                        {displayValue}
                                                        {key === 'conversionRate' && '%'}
                                                        {key === 'estimatedRevenue' && ' ₹'}
                                                        {key === 'revenuePerArticle' && ' ₹'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Progress Indicator */}
                                    <div className="mt-6 pt-6 border-t border-border/50 dark:border-border/50">
                                        <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-widest">
                                            <span>Status</span>
                                            <Badge className={cn(
                                                "bg-white/10 border-0 text-xs",
                                                index === 0 ? 'text-primary-400' :
                                                index === 1 ? 'text-secondary-400' :
                                                index === 2 ? 'text-accent-400' :
                                                'text-success-400'
                                            )}>
                                                {index === 0 && 'Active'}
                                                {index === 1 && publishMetrics.published > 0 ? 'Active' : 'Pending'}
                                                {index === 2 && trackingMetrics.totalViews > 0 ? 'Active' : 'Pending'}
                                                {index === 3 && incomeMetrics.estimatedRevenue > 0 ? 'Active' : 'Pending'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Arrow between stages */}
                                {index < stages.length - 1 && (
                                    <div className="hidden lg:flex items-center justify-center">
                                        <ArrowRight className="w-6 h-6 text-muted-foreground/50 dark:text-muted-foreground/50" />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Summary Row - All Stages Combined */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border/50 dark:border-border/50">
                        <div className="text-center p-4 bg-card/50 dark:bg-card/50 rounded-xl border border-border/50 dark:border-border/50">
                            <div className="text-2xl font-extrabold text-primary-400 mb-1">
                                {researchMetrics.keywordsResearched}
                            </div>
                            <div className="text-[10px] font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-widest">
                                Keywords Found
                            </div>
                        </div>
                        <div className="text-center p-4 bg-card/50 dark:bg-card/50 rounded-xl border border-border/50 dark:border-border/50">
                            <div className="text-2xl font-extrabold text-secondary-400 mb-1">
                                {publishMetrics.publishedThisPeriod}
                            </div>
                            <div className="text-[10px] font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-widest">
                                Published ({timeRange})
                            </div>
                        </div>
                        <div className="text-center p-4 bg-card/50 dark:bg-card/50 rounded-xl border border-border/50 dark:border-border/50">
                            <div className="text-2xl font-extrabold text-accent-400 mb-1">
                                {trackingMetrics.totalViews.toLocaleString()}
                            </div>
                            <div className="text-[10px] font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-widest">
                                Total Views
                            </div>
                        </div>
                        <div className="text-center p-4 bg-card/50 dark:bg-card/50 rounded-xl border border-border/50 dark:border-border/50">
                            <div className="text-2xl font-extrabold text-success-400 mb-1">
                                ₹{Math.round(incomeMetrics.estimatedRevenue).toLocaleString()}
                            </div>
                            <div className="text-[10px] font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-widest">
                                Est. Revenue
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
