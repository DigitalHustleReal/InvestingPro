"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { 
    FileText, 
    Clock, 
    CheckCircle2, 
    AlertCircle,
    TrendingUp,
    XCircle,
    Calendar,
    BarChart3,
    Activity
} from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';

interface ArticleStats {
    draft: number;
    review: number;
    published: number;
    archived: number;
    total: number;
    todayCount: number;
    weekCount: number;
    failureRate: number;
}

export default function PipelineHealthPage() {
    const supabase = createClient();

    // Fetch article statistics by status
    const { data: stats, isLoading } = useQuery<ArticleStats>({
        queryKey: ['pipeline-health-stats'],
        queryFn: async () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);

            // Get counts by status
            const [draftRes, reviewRes, publishedRes, archivedRes, todayRes, weekRes, failedRes, totalRes] = await Promise.all([
                supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
                supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'review'),
                supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'published'),
                supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'archived'),
                supabase.from('articles').select('id', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
                supabase.from('articles').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo.toISOString()),
                supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'failed'),
                supabase.from('articles').select('id', { count: 'exact', head: true }),
            ]);

            const totalCount = totalRes.count || 0;
            const failedCount = failedRes.count || 0;

            return {
                draft: draftRes.count || 0,
                review: reviewRes.count || 0,
                published: publishedRes.count || 0,
                archived: archivedRes.count || 0,
                total: totalCount,
                todayCount: todayRes.count || 0,
                weekCount: weekRes.count || 0,
                failureRate: totalCount > 0 ? Math.round((failedCount / totalCount) * 100 * 10) / 10 : 0,
            };
        },
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    // Fetch recent articles
    const { data: recentArticles = [] } = useQuery({
        queryKey: ['pipeline-recent-articles'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('articles')
                .select('id, title, status, created_at, updated_at')
                .order('created_at', { ascending: false })
                .limit(10);
            if (error) throw error;
            return data || [];
        },
        refetchInterval: 30000,
    });

    // Fetch daily counts for the last 7 days
    const { data: dailyCounts = [] } = useQuery({
        queryKey: ['pipeline-daily-counts'],
        queryFn: async () => {
            const days = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                date.setHours(0, 0, 0, 0);
                const nextDate = new Date(date);
                nextDate.setDate(nextDate.getDate() + 1);
                
                const { count } = await supabase
                    .from('articles')
                    .select('id', { count: 'exact', head: true })
                    .gte('created_at', date.toISOString())
                    .lt('created_at', nextDate.toISOString());
                
                days.push({
                    date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    count: count || 0,
                });
            }
            return days;
        },
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-success-500/20 text-success-400 border-success-500/30';
            case 'review': return 'bg-warning-500/20 text-warning-400 border-warning-500/30';
            case 'draft': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
            case 'failed': return 'bg-danger-500/20 text-danger-400 border-danger-500/30';
            default: return 'bg-muted/20 text-muted-foreground border-muted/30';
        }
    };

    const maxDailyCount = Math.max(...dailyCounts.map(d => d.count), 1);

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 font-sans">
                <AdminBreadcrumb />
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25 flex items-center justify-center">
                        <Activity className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                            Pipeline Health Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Monitor article status, daily production, and failure rates
                        </p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-slate-500/10 to-slate-600/5 border-slate-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <FileText className="w-5 h-5 text-slate-400" />
                                <Badge variant="outline" className="text-xs">Draft</Badge>
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">
                                {isLoading ? '...' : stats?.draft}
                            </div>
                            <p className="text-xs text-muted-foreground">Awaiting review</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-warning-500/10 to-warning-600/5 border-warning-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Clock className="w-5 h-5 text-warning-400" />
                                <Badge variant="outline" className="text-xs">In Review</Badge>
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">
                                {isLoading ? '...' : stats?.review}
                            </div>
                            <p className="text-xs text-muted-foreground">Being reviewed</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-success-500/10 to-success-600/5 border-success-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <CheckCircle2 className="w-5 h-5 text-success-400" />
                                <Badge variant="outline" className="text-xs">Published</Badge>
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">
                                {isLoading ? '...' : stats?.published}
                            </div>
                            <p className="text-xs text-muted-foreground">Live on site</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-danger-500/10 to-danger-600/5 border-danger-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <XCircle className="w-5 h-5 text-danger-400" />
                                <Badge variant="outline" className="text-xs">Failure Rate</Badge>
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">
                                {isLoading ? '...' : `${stats?.failureRate}%`}
                            </div>
                            <p className="text-xs text-muted-foreground">Of all articles</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Daily Production Chart & Recent Articles */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Daily Counts Chart */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-primary-400" />
                                Daily Production (Last 7 Days)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between h-48 gap-2">
                                {dailyCounts.map((day, i) => (
                                    <div key={i} className="flex flex-col items-center flex-1">
                                        <div className="w-full bg-muted/30 rounded-t-lg relative flex-1 flex items-end">
                                            <div 
                                                className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg transition-all duration-500"
                                                style={{ height: `${(day.count / maxDailyCount) * 100}%`, minHeight: day.count > 0 ? '8px' : '0px' }}
                                            />
                                        </div>
                                        <div className="text-xs font-bold text-foreground mt-2">{day.count}</div>
                                        <div className="text-xs text-muted-foreground">{day.date}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t border-border/50 flex justify-between text-sm">
                                <div>
                                    <span className="text-muted-foreground">Today: </span>
                                    <span className="font-bold text-foreground">{stats?.todayCount || 0} articles</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">This week: </span>
                                    <span className="font-bold text-foreground">{stats?.weekCount || 0} articles</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Articles */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-secondary-400" />
                                Recent Articles
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                {recentArticles.map((article: any) => (
                                    <div 
                                        key={article.id} 
                                        className="flex items-center justify-between p-3 bg-muted/10 rounded-lg hover:bg-muted/20 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0 mr-4">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {article.title || 'Untitled'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(article.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Badge className={getStatusColor(article.status)}>
                                            {article.status}
                                        </Badge>
                                    </div>
                                ))}
                                {recentArticles.length === 0 && (
                                    <p className="text-center text-muted-foreground py-8">
                                        No articles found
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Summary Stats */}
                <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-accent-400" />
                            Pipeline Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center p-4 bg-muted/10 rounded-xl">
                                <div className="text-3xl font-bold text-foreground mb-1">{stats?.total || 0}</div>
                                <p className="text-sm text-muted-foreground">Total Articles</p>
                            </div>
                            <div className="text-center p-4 bg-muted/10 rounded-xl">
                                <div className="text-3xl font-bold text-success-400 mb-1">
                                    {stats?.total ? Math.round((stats.published / stats.total) * 100) : 0}%
                                </div>
                                <p className="text-sm text-muted-foreground">Published Rate</p>
                            </div>
                            <div className="text-center p-4 bg-muted/10 rounded-xl">
                                <div className="text-3xl font-bold text-warning-400 mb-1">
                                    {(stats?.draft || 0) + (stats?.review || 0)}
                                </div>
                                <p className="text-sm text-muted-foreground">In Progress</p>
                            </div>
                            <div className="text-center p-4 bg-muted/10 rounded-xl">
                                <div className="text-3xl font-bold text-primary-400 mb-1">
                                    {Math.round((stats?.weekCount || 0) / 7 * 10) / 10}
                                </div>
                                <p className="text-sm text-muted-foreground">Daily Avg (7d)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
