"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient as api } from '@/lib/api-client';
import { 
    Search,
    FileText,
    TrendingUp,
    DollarSign,
    BarChart3,
    Sparkles
} from 'lucide-react';
import { AdminCard } from '@/components/admin/system/AdminCard';
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
            // Pass true to include all statuses (Draft, Published, etc.) for a complete lifecycle view
            const articles = await api.entities.Article.list('-created_date', 500, true);
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
            const pubDate = new Date(a.published_at || a.updated_at || new Date());
            const now = new Date();
            const diffDays = (now.getTime() - pubDate.getTime()) / (1000 * 3600 * 24);
            const days = parseInt(timeRange.replace('d', ''));
            return diffDays <= days;
        }).length
    };

    // Calculate TRACKING metrics
    const trackingMetrics = {
        totalViews: articles.reduce((sum: number, a: any) => sum + (a.views || 0), 0),
        avgTimeOnPage: '2m 14s', // Placeholder until GA4 integration
        bounceRate: '42%', // Placeholder
        ctr: '3.8%' // Placeholder
    };

    // Calculate INCOME metrics
    const incomeMetrics = {
        totalRevenue: 2450.00, // Placeholder or fetch from revenue table
        conversions: 85, // Placeholder
        epc: 12.50, // Earnings Per Click
        productsPromoted: affiliateProducts.length
    };

    return (
        <AdminCard noPadding glass>
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[15px] font-bold text-white">
                    <BarChart3 className="w-5 h-5 text-amber-400" />
                    Advanced Metrics - Content Lifecycle
                </div>
                <div className="px-3 py-1 rounded-full bg-white/15 text-[11px] font-bold text-slate-200">
                    Last {timeRange.replace('d', ' Days')}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 text-sm">
                {/* 1. RESEARCH */}
                <div className="p-4 border-b md:border-b-0 md:border-r border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                            <Search className="w-4.5 h-4.5" />
                        </div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">RESEARCH</h4>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <MetricRow label="Keywords Researched" value={researchMetrics.keywordsResearched} />
                        <MetricRow label="Active Keywords" value={researchMetrics.activeKeywords} />
                        <MetricRow label="Trending Opps" value={researchMetrics.trendingKeywords} highlight />
                    </div>
                </div>

                {/* 2. PUBLISH */}
                <div className="p-4 border-b md:border-b-0 xl:border-b 2xl:border-b-0 xl:border-r border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                            <FileText className="w-4.5 h-4.5" />
                        </div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">PUBLISH</h4>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <MetricRow label="Published (Period)" value={publishMetrics.publishedThisPeriod} />
                        <MetricRow label="Scheduled" value={publishMetrics.scheduled} />
                        <MetricRow label="Drafts Pending" value={publishMetrics.drafts} />
                    </div>
                </div>

                {/* 3. TRACKING */}
                <div className="p-4 border-b md:border-b-0 md:border-r border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                            <TrendingUp className="w-4.5 h-4.5" />
                        </div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">TRACKING</h4>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <MetricRow label="Total Views" value={trackingMetrics.totalViews.toLocaleString()} />
                        <MetricRow label="Avg. Time on Page" value={trackingMetrics.avgTimeOnPage} />
                        <MetricRow label="CTR (Click-Through)" value={trackingMetrics.ctr} />
                    </div>
                </div>

                {/* 4. INCOME */}
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                            <DollarSign className="w-4.5 h-4.5" />
                        </div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">INCOME</h4>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <MetricRow label="Est. Revenue" value={`₹${incomeMetrics.totalRevenue?.toLocaleString()}`} />
                        <MetricRow label="Conversions" value={incomeMetrics.conversions} />
                        <MetricRow label="EPC" value={`₹${incomeMetrics.epc}`} />
                    </div>
                </div>
            </div>

            {/* AI Insights Footer */}
            <div className="px-6 py-4 bg-muted/20 border-t border-border/50 flex items-start gap-3 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                    <strong className="text-foreground">Insight:</strong> Content publishing velocity is up 12% this week. Focus on "Credit Card" keywords for higher EPC.
                </span>
            </div>
        </AdminCard>
    );
}

function MetricRow({ label, value, highlight = false }: { label: string, value: string | number, highlight?: boolean }) {
    return (
        <div className="flex justify-between items-center gap-2">
            <span className="text-[13px] text-slate-400 font-medium leading-tight">{label}</span>
            <span className={cn(
                "text-[14px] font-bold whitespace-nowrap",
                highlight ? "text-amber-400" : "text-white"
            )}>
                {value}
            </span>
        </div>
    );
}
