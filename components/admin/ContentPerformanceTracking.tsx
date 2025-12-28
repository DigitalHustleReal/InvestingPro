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
    BarChart3
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Total Views</p>
                                <p className="text-2xl font-bold text-slate-900">{totalViews.toLocaleString()}</p>
                            </div>
                            <Eye className="w-8 h-8 text-teal-600" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Total Clicks</p>
                                <p className="text-2xl font-bold text-slate-900">{totalClicks.toLocaleString()}</p>
                            </div>
                            <MousePointerClick className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Est. Revenue</p>
                                <p className="text-2xl font-bold text-slate-900">₹{estimatedRevenue.toLocaleString()}</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-emerald-600" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Total Articles</p>
                                <p className="text-2xl font-bold text-slate-900">{articles.length}</p>
                            </div>
                            <FileText className="w-8 h-8 text-slate-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Views Over Time */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Views Over Time (Last 7 Days)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="views" stroke="#10b981" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Category Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Categories by Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoryPerformance}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="views" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Top Performing Articles */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        Top Performing Articles
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {topArticles.length > 0 ? (
                            topArticles.map((article: any, idx: number) => (
                                <div key={article.id || idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3 flex-1">
                                        <Badge className="bg-emerald-100 text-emerald-700 border-0">
                                            #{idx + 1}
                                        </Badge>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900 line-clamp-1">
                                                {article.title || 'Untitled'}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {article.category || 'Uncategorized'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-slate-900">
                                                {article.views?.toLocaleString() || 0}
                                            </p>
                                            <p className="text-xs text-slate-500">views</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-4">No articles yet</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Revenue Drivers */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        Revenue Drivers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {revenueDrivers.length > 0 ? (
                            revenueDrivers.map((article: any, idx: number) => {
                                const estimatedArticleRevenue = (article.views || 0) * 0.1; // Rough estimate
                                return (
                                    <div key={article.id || idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-3 flex-1">
                                            <Badge className="bg-emerald-100 text-emerald-700 border-0">
                                                #{idx + 1}
                                            </Badge>
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-900 line-clamp-1">
                                                    {article.title || 'Untitled'}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {article.views?.toLocaleString() || 0} views
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-emerald-600">
                                                ₹{estimatedArticleRevenue.toFixed(0)}
                                            </p>
                                            <p className="text-xs text-slate-500">est. revenue</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-4">No revenue data yet</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Worst Performing Articles */}
            {worstArticles.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingDown className="w-5 h-5 text-rose-600" />
                            Needs Optimization
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {worstArticles.map((article: any, idx: number) => (
                                <div key={article.id || idx} className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
                                    <div className="flex items-center gap-3 flex-1">
                                        <Badge className="bg-rose-100 text-rose-700 border-0">
                                            #{idx + 1}
                                        </Badge>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900 line-clamp-1">
                                                {article.title || 'Untitled'}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {article.category || 'Uncategorized'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-rose-600">
                                            {article.views?.toLocaleString() || 0}
                                        </p>
                                        <p className="text-xs text-slate-500">views</p>
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










