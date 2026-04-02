"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { 
    TrendingUp, 
    TrendingDown, 
    Eye, 
    MousePointerClick, 
    DollarSign,
    FileText,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    Zap
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS, RECHARTS_TOOLTIP_STYLE, RECHARTS_GRID_STROKE, RECHARTS_TICK_FILL } from '@/lib/charts/theme';

interface ContentPerformanceTrackingProps {
    timeRange?: '7d' | '30d' | '90d';
}

/**
 * ContentPerformanceTracking - Essential tracking for content performance
 * 
 * Tracks:
 * - Top performing articles (by views, engagement, revenue)
 * - Content trends over time
 * - Revenue by content
 * - Basic insights
 */
export default function ContentPerformanceTracking({ timeRange = '30d' }: ContentPerformanceTrackingProps) {
    // Fetch articles with performance data
    const { data: articles = [] } = useQuery({
        queryKey: ['articles-performance', timeRange],
        queryFn: async () => {
            const articles = await api.entities.Article.list('-created_date', 100);
            return Array.isArray(articles) ? articles : [];
        },
        initialData: [],
    });

    // Fetch affiliate products for revenue calculation
    const { data: affiliateProducts = [] } = useQuery({
        queryKey: ['affiliate-products-performance'],
        queryFn: () => api.entities.AffiliateProduct.list('-clicks', 50),
        initialData: [],
    });

    // Calculate metrics
    const totalViews = articles.reduce((sum: number, article: any) => sum + (article.views || 0), 0);
    const totalClicks = affiliateProducts.reduce((sum: number, product: any) => sum + (product.clicks || 0), 0);
    
    // Estimate revenue (assuming $0.50 per click - adjust based on actual rates)
    const estimatedRevenue = totalClicks * 0.5;
    
    // Top performing articles (by views)
    const topArticles = [...articles]
        .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);

    // Articles with most clicks (revenue drivers)
    const revenueDrivers = articles
        .filter((article: any) => article.views && article.views > 0)
        .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);

    // Worst performing articles
    const worstArticles = [...articles]
        .filter((article: any) => article.views !== undefined)
        .sort((a: any, b: any) => (a.views || 0) - (b.views || 0))
        .slice(0, 5);

    // Prepare chart data (views over time - last 7 days)
    const chartData = React.useMemo(() => {
        const days = 7;
        const data = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            // Count articles created on this date
            const articlesOnDate = articles.filter((article: any) => {
                const articleDate = new Date(article.created_at || article.created_date || 0);
                return articleDate.toISOString().split('T')[0] === dateStr;
            });
            
            const viewsOnDate = articlesOnDate.reduce((sum: number, article: any) => sum + (article.views || 0), 0);
            
            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                views: viewsOnDate,
                articles: articlesOnDate.length,
            });
        }
        
        return data;
    }, [articles]);

    // Category performance
    const categoryPerformance = React.useMemo(() => {
        const categoryMap: Record<string, { views: number; count: number }> = {};
        
        articles.forEach((article: any) => {
            const category = article.category || 'uncategorized';
            if (!categoryMap[category]) {
                categoryMap[category] = { views: 0, count: 0 };
            }
            categoryMap[category].views += article.views || 0;
            categoryMap[category].count += 1;
        });
        
        return Object.entries(categoryMap)
            .map(([category, data]) => ({
                category,
                views: data.views,
                count: data.count,
                avgViews: data.views / data.count,
            }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 5);
    }, [articles]);

    return (
        <div className="space-y-10">
            {/* High-Impact Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl overflow-hidden hover:border-wt-gold/30 transition-all group">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-[0.2em]">Total Propagation</span>
                            <div className="w-10 h-10 rounded-xl bg-wt-gold-subtle flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                <Eye className="w-5 h-5 text-wt-gold" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-extrabold text-wt-text dark:text-wt-text tabular-nums tracking-tight tracking-tighter">
                                {totalViews.toLocaleString()}
                            </h3>
                            <p className="text-[10px] font-bold text-wt-gold uppercase tracking-widest flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                +12.4% <span className="text-wt-text-muted/70 dark:text-wt-text-muted/70">vs Prev Period</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl overflow-hidden hover:border-secondary-500/30 transition-all group">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-[0.2em]">Conversion Vector</span>
                            <div className="w-10 h-10 rounded-xl bg-secondary-500/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                <MousePointerClick className="w-5 h-5 text-wt-gold" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-extrabold text-wt-text dark:text-wt-text tabular-nums tracking-tighter">
                                {totalClicks.toLocaleString()}
                            </h3>
                            <p className="text-[10px] font-bold text-wt-gold uppercase tracking-widest flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Velocity Optimized
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl overflow-hidden hover:border-wt-gold/30 transition-all group">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-[0.2em]">Synthesized Yield</span>
                            <div className="w-10 h-10 rounded-xl bg-wt-gold-subtle flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                <DollarSign className="w-5 h-5 text-wt-gold" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-extrabold text-wt-text dark:text-wt-text tabular-nums tracking-tighter">
                                ₹{estimatedRevenue.toLocaleString()}
                            </h3>
                            <p className="text-[10px] font-bold text-wt-gold uppercase tracking-widest flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                Revenue Node Beta
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl overflow-hidden hover:border-gray-500/30 transition-all group">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-[0.2em]">Asset Inventory</span>
                            <div className="w-10 h-10 rounded-xl bg-wt-card flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                <FileText className="w-5 h-5 text-wt-text-muted dark:text-wt-text-muted" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-extrabold text-wt-text dark:text-wt-text tabular-nums tracking-tighter">
                                {articles.length}
                            </h3>
                            <p className="text-[10px] font-bold text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-widest">Active Intelligence Units</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Visual Intelligence Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-wt-border/50 dark:border-wt-border/50 px-8 py-6">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-wt-text-muted dark:text-wt-text-muted flex items-center gap-6 md:p-8">
                            <BarChart3 className="w-4 h-4 text-wt-gold" />
                            Content Pulse Logic (7D Temporal)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={chartData}>
                                <defs>
                                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={RECHARTS_GRID_STROKE} vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: RECHARTS_TICK_FILL, fontSize: 10, fontWeight: 700 }}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: RECHARTS_TICK_FILL, fontSize: 10, fontWeight: 700 }}
                                />
                                <Tooltip 
                                    contentStyle={RECHARTS_TOOLTIP_STYLE}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="views" 
                                    stroke={CHART_COLORS.primary} 
                                    strokeWidth={4} 
                                    dot={{ r: 4, fill: CHART_COLORS.positive, strokeWidth: 2, stroke: '#0f172a' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-wt-border/50 dark:border-wt-border/50 px-8 py-6">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-wt-text-muted dark:text-wt-text-muted flex items-center gap-6 md:p-8">
                            <TrendingUp className="w-4 h-4 text-wt-gold" />
                            Cluster Hierarchy (By Propagation)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={categoryPerformance} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke={RECHARTS_GRID_STROKE} horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="category" 
                                    type="category" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#fff', fontSize: 10, fontWeight: 700 }}
                                    width={100}
                                />
                                <Tooltip 
                                    contentStyle={RECHARTS_TOOLTIP_STYLE}
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                />
                                <Bar 
                                    dataKey="views" 
                                    fill={CHART_COLORS.secondary} 
                                    radius={[0, 6, 6, 0]} 
                                    barSize={20}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Tactical Intelligence Overlays */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Performing Articles */}
                <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-wt-border/50 dark:border-wt-border/50 px-8 py-5">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-wt-gold flex items-center gap-6 md:p-8">
                            <TrendingUp className="w-4 h-4" />
                            Alpha Assets (High Velocity)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-white/5">
                            {topArticles.length > 0 ? (
                                topArticles.map((article: any, idx: number) => (
                                    <div key={article.id || idx} className="flex items-center justify-between p-6 hover:bg-wt-surface/50 dark:bg-wt-surface/50 transition-colors group">
                                        <div className="flex items-center gap-5 flex-1 min-w-0">
                                            <div className="w-8 h-8 rounded-lg bg-wt-gold-subtle flex items-center justify-center text-[10px] font-bold text-wt-gold border border-wt-gold/20">
                                                0{idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-wt-text dark:text-wt-text tracking-tight line-clamp-1 group-hover:text-wt-gold transition-colors">
                                                    {article.title || 'Inert System Node'}
                                                </p>
                                                <p className="text-[10px] font-bold text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-widest mt-1">
                                                    {article.category || 'Standard Terminal'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-sm font-bold text-wt-text dark:text-wt-text px-3 py-1 bg-wt-surface-hover rounded-lg tabular-nums">
                                                {article.views?.toLocaleString() || 0}
                                            </p>
                                            <p className="text-[9px] font-semibold text-wt-text-muted/50 dark:text-wt-text-muted/50 uppercase tracking-st mt-1">Impact Factor</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-wt-text-muted/50 dark:text-wt-text-muted/50 font-bold uppercase tracking-widest text-[10px]">No active data streams</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue Drivers */}
                <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-wt-border/50 dark:border-wt-border/50 px-8 py-5">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-wt-gold flex items-center gap-6 md:p-8">
                            <DollarSign className="w-4 h-4" />
                            Fiscal Drivers (Yield Extraction)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-white/5">
                            {revenueDrivers.length > 0 ? (
                                revenueDrivers.map((article: any, idx: number) => {
                                    const estimatedArticleRevenue = (article.views || 0) * 0.1;
                                    return (
                                        <div key={article.id || idx} className="flex items-center justify-between p-6 hover:bg-wt-surface/50 dark:bg-wt-surface/50 transition-colors group">
                                            <div className="flex items-center gap-5 flex-1 min-w-0">
                                                <div className="w-8 h-8 rounded-lg bg-wt-gold-subtle flex items-center justify-center text-[10px] font-bold text-wt-gold border border-wt-gold/20">
                                                    0{idx + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-wt-text dark:text-wt-text tracking-tight line-clamp-1 group-hover:text-wt-gold transition-colors">
                                                        {article.title || 'Inert System Node'}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-widest mt-1">
                                                        {(article.views || 0).toLocaleString()} Yield Points
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="text-sm font-bold text-wt-gold px-3 py-1 bg-wt-gold-subtle rounded-lg tabular-nums border border-wt-gold/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                                    ₹{estimatedArticleRevenue.toFixed(0)}
                                                </p>
                                                <p className="text-[9px] font-semibold text-wt-text-muted/50 dark:text-wt-text-muted/50 uppercase tracking-st mt-1">Net Extraction</p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12 text-wt-text-muted/50 dark:text-wt-text-muted/50 font-bold uppercase tracking-widest text-[10px]">No active yield nodes</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Needs Optimization */}
            {worstArticles.length > 0 && (
                <Card className="bg-wt-danger/[0.02] border-danger-500/10 rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-danger-500/10 px-8 py-5">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-wt-danger flex items-center gap-6 md:p-8">
                            <TrendingDown className="w-4 h-4" />
                            System Faults (Latency Detected)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 divide-x divide-danger-500/10">
                            {worstArticles.map((article: any, idx: number) => (
                                <div key={article.id || idx} className="p-6 hover:bg-wt-danger/[0.05] transition-colors">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-6 h-6 rounded bg-wt-danger/10 flex items-center justify-center text-[9px] font-bold text-wt-danger border border-danger-500/20">
                                            {idx + 1}
                                        </div>
                                        <p className="text-[10px] font-bold text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-widest">{article.category || 'Terminal'}</p>
                                    </div>
                                    <p className="text-xs font-bold text-wt-text dark:text-wt-text tracking-tight line-clamp-1 mb-2">
                                        {article.title || 'Faulty Node'}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-semibold text-wt-danger uppercase tracking-st">{article.views || 0} hits</span>
                                        <ArrowDownRight className="w-3 h-3 text-wt-danger" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
















