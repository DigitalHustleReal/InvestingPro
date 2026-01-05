"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Eye, FileText, BarChart3, ArrowUpRight, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface ContentPerformance {
    totalArticles: number;
    totalViews: number;
    avgViewsPerArticle: number;
    topPerformers: {
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
}

export default function AnalyticsDashboard() {
    const { data: analytics, isLoading } = useQuery<ContentPerformance>({
        queryKey: ['analytics-overview'],
        queryFn: async () => {
            const response = await fetch('/api/admin/analytics?type=overview');
            if (!response.ok) throw new Error('Failed to fetch analytics');
            return response.json();
        },
        refetchInterval: 60000 // Refresh every minute
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-white/[0.02] rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    const stats = [
        {
            label: 'Total Articles',
            value: analytics?.totalArticles || 0,
            icon: FileText,
            color: 'text-primary-400',
            bg: 'bg-primary-500/10'
        },
        {
            label: 'Total Views',
            value: analytics?.totalViews || 0,
            icon: Eye,
            color: 'text-emerald-400',
            bg: 'bg-primary-500/10'
        },
        {
            label: 'Avg. Views/Article',
            value: analytics?.avgViewsPerArticle || 0,
            icon: BarChart3,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                                </div>
                                <Badge className="bg-primary-500/10 text-emerald-400 border-emerald-500/20 text-[9px]">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    Live
                                </Badge>
                            </div>
                            <div className="text-3xl font-extrabold text-white tracking-tight">
                                {stat.value.toLocaleString()}
                            </div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                                {stat.label}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Top Performers */}
            <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 px-6 py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-6 md:p-8">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        Top Performing Content
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {analytics?.topPerformers && analytics.topPerformers.length > 0 ? (
                        <div className="divide-y divide-white/5">
                            {analytics.topPerformers.map((article, idx) => (
                                <div key={article.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                                            idx === 0 ? "bg-amber-500/20 text-amber-400" :
                                            idx === 1 ? "bg-slate-500/20 text-slate-400" :
                                            idx === 2 ? "bg-orange-500/20 text-orange-400" :
                                            "bg-white/5 text-slate-500"
                                        )}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-white line-clamp-1">
                                                {article.title}
                                            </div>
                                            <div className="text-xs text-slate-500 capitalize">
                                                {article.category?.replace(/-/g, ' ')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-slate-500" />
                                        <span className="text-sm font-bold text-white">
                                            {article.views.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-slate-500">
                            <Sparkles className="w-8 h-8 mx-auto mb-3 text-slate-600" />
                            <p className="text-sm font-medium">No published articles yet</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 px-6 py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-6 md:p-8">
                        <BarChart3 className="w-4 h-4 text-primary-400" />
                        Category Performance
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {analytics?.categoryBreakdown && analytics.categoryBreakdown.length > 0 ? (
                        <div className="space-y-4">
                            {analytics.categoryBreakdown.slice(0, 5).map((cat) => {
                                const maxViews = Math.max(...analytics.categoryBreakdown.map(c => c.totalViews));
                                const percentage = maxViews > 0 ? (cat.totalViews / maxViews) * 100 : 0;
                                
                                return (
                                    <div key={cat.category} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-300 capitalize font-medium">
                                                {cat.category?.replace(/-/g, ' ') || 'Uncategorized'}
                                            </span>
                                            <span className="text-slate-500">
                                                {cat.articleCount} articles • {cat.totalViews.toLocaleString()} views
                                            </span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center text-slate-500 py-8">
                            No category data available
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
