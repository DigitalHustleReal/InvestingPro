import React from 'react';
import { StatCard, ContentSection, TableRow, TableCell } from './AdminUIKit';
import { Eye, FileText, BarChart3, TrendingUp, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { ADMIN_THEME } from '@/lib/admin/theme';

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-white rounded-xl animate-pulse shadow-sm border border-wt-border-light" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    label="Total Articles"
                    value={analytics?.totalArticles || 0}
                    icon={FileText}
                    change="29 published this month"
                    changeType="neutral"
                    color="blue"
                />
                <StatCard 
                    label="Total Views"
                    value={analytics?.totalViews?.toLocaleString() || 0}
                    icon={Eye}
                    change="+12.5% vs last month"
                    changeType="positive"
                    color="purple"
                />
                <StatCard 
                    label="Avg. Views/Article"
                    value={analytics?.avgViewsPerArticle || 0}
                    icon={BarChart3}
                    color="amber"
                />
            </div>

            {/* Top Performers */}
            <ContentSection 
                title="Top Performing Content" 
                subtitle="Articles dengan engagement tertinggi 30 hari terakhir"
                actions={
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                }
            >
                {analytics?.topPerformers && analytics.topPerformers.length > 0 ? (
                    <div className="divide-y divide-white/5">
                        {analytics.topPerformers.map((article, idx) => (
                            <div key={article.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 hover:bg-white/5 rounded-lg px-2 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm backdrop-blur-sm border",
                                        idx === 0 ? "bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.2)]" : "bg-slate-800/50 border-white/5 text-slate-300"
                                    )}>
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-200 line-clamp-1 group-hover:text-white transition-colors">
                                            {article.title}
                                        </div>
                                        <div className="text-xs text-slate-500 capitalize">
                                            {article.category?.replace(/-/g, ' ')}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-wt-navy-300" />
                                    <span className="text-sm font-extrabold text-wt-navy-900">
                                        {article.views.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center text-wt-text-muted">
                        <Sparkles className="w-8 h-8 mx-auto mb-3 text-wt-text-light/50" />
                        <p className="text-sm font-medium">No published articles yet</p>
                    </div>
                )}
            </ContentSection>

            {/* Category Breakdown */}
            <ContentSection 
                title="Category Performance" 
                subtitle="Distribusi views berdasarkan kategori utama"
            >
                {analytics?.categoryBreakdown && analytics.categoryBreakdown.length > 0 ? (
                    <div className="space-y-6">
                        {analytics.categoryBreakdown.slice(0, 5).map((cat) => {
                            const maxViews = Math.max(...analytics.categoryBreakdown.map(c => c.totalViews));
                            const percentage = maxViews > 0 ? (cat.totalViews / maxViews) * 100 : 0;
                            
                            return (
                                <div key={cat.category} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-wt-navy-800 capitalize font-bold">
                                            {cat.category?.replace(/-/g, ' ') || 'Uncategorized'}
                                        </span>
                                        <span className="text-wt-navy-500 font-medium">
                                            {cat.articleCount} Articles • {cat.totalViews.toLocaleString()} Views
                                        </span>
                                    </div>
                                    <div className="h-2.5 bg-wt-bg-hover rounded-full overflow-hidden border border-wt-border-subtle">
                                        <div 
                                            className="h-full bg-gradient-to-r from-wt-navy-800 to-wt-navy-600 rounded-full transition-all duration-700 ease-out"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-wt-text-muted py-8 font-medium">
                        No category data available
                    </div>
                )}
            </ContentSection>
        </div>
    );
}
