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
    Activity,
    Zap,
    Flame,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
            case 'draft': return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
            case 'failed': return 'bg-danger-500/20 text-danger-400 border-danger-500/30';
            default: return 'bg-muted/20 text-muted-foreground border-muted/30';
        }
    };

    const maxDailyCount = Math.max(...dailyCounts.map(d => d.count), 1);

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 font-sans">
            <div className="p-8 space-y-10 max-w-7xl mx-auto">
                {/* Header Section */}
                <div 
                    className="relative overflow-hidden shadow-2xl bg-gradient-to-br from-background via-card to-background rounded-[24px] p-8 border border-primary/20"
                >
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full blur-3xl opacity-10 bg-primary" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                                <Activity className="w-10 h-10 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Pipeline Health</h1>
                                <p className="text-muted-foreground max-w-md">Real-time status tracking and quality assurance for our AI content engine.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Badge className="bg-success/10 text-success border border-success/20 px-4 py-1.5 rounded-full flex gap-2 items-center">
                                <ShieldCheck className="w-4 h-4" />
                                System Optimal
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <HealthStatCard 
                        label="Draft Queue" 
                        value={isLoading ? '...' : stats?.draft} 
                        icon={FileText} 
                        desc="Awaiting review" 
                        color="amber"
                    />
                    <HealthStatCard 
                        label="In Review" 
                        value={isLoading ? '...' : stats?.review} 
                        icon={Clock} 
                        desc="Quality audit" 
                        color="blue"
                    />
                    <HealthStatCard 
                        label="Live Content" 
                        value={isLoading ? '...' : stats?.published} 
                        icon={CheckCircle2} 
                        desc="Live on site" 
                        color="emerald"
                    />
                    <HealthStatCard 
                        label="Failure Rate" 
                        value={isLoading ? '...' : `${stats?.failureRate}%`} 
                        icon={XCircle} 
                        desc="System health" 
                        color="rose"
                    />
                </div>

                {/* Daily Production Chart & Recent Articles */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Daily Counts Chart */}
                    <Card className="bg-card/40 border-border backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl">
                        <CardHeader className="border-b border-border pb-4">
                            <CardTitle className="text-foreground flex items-center gap-2 text-lg">
                                <BarChart3 className="w-5 h-5 text-primary" />
                                Content Velocity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex items-end justify-between h-48 gap-3">
                                {dailyCounts.map((day, i) => (
                                    <div key={i} className="flex flex-col items-center flex-1 group">
                                        <div className="w-full bg-muted rounded-t-lg relative flex-1 flex items-end overflow-hidden">
                                            <div 
                                                className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all duration-700 group-hover:opacity-80"
                                                style={{ height: `${(day.count / maxDailyCount) * 100}%`, minHeight: day.count > 0 ? '8px' : '0px' }}
                                            />
                                        </div>
                                        <div className="text-xs font-bold text-white mt-3">{day.count}</div>
                                        <div className="text-[10px] uppercase tracking-tighter text-slate-500 mt-1">{day.date}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-border flex justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    <span className="text-muted-foreground">Today: </span>
                                    <span className="font-bold text-foreground">{stats?.todayCount || 0}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                                    <span className="text-muted-foreground">7d Volume: </span>
                                    <span className="font-bold text-foreground">{stats?.weekCount || 0}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Articles */}
                    <Card className="bg-[#111827]/40 border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <CardTitle className="text-white flex items-center gap-2 text-lg">
                                <Calendar className="w-5 h-5 text-blue-400" />
                                Activity Feed
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto custom-scrollbar">
                                {recentArticles.map((article: any) => (
                                    <div 
                                        key={article.id} 
                                        className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0 mr-4">
                                            <p className="text-sm font-bold text-white truncate group-hover:text-[#c49e48]">
                                                {article.title || 'Untitled'}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">
                                                {new Date(article.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Badge className={cn("border-none px-2", getStatusColor(article.status))}>
                                            {article.status}
                                        </Badge>
                                    </div>
                                ))}
                                {recentArticles.length === 0 && (
                                    <p className="text-center text-slate-500 py-12">
                                        No recent telemetry data
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Summary Stats */}
                <Card className="bg-card/40 border-border backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl">
                    <CardHeader className="border-b border-border pb-4">
                        <CardTitle className="text-foreground flex items-center gap-2 text-lg">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Performance Metadata
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-foreground mb-2">{stats?.total || 0}</div>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Asset Count</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-success mb-2">
                                    {stats?.total ? Math.round((stats.published / stats.total) * 100) : 0}%
                                </div>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Publication Efficiency</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-warning mb-2">
                                    {(stats?.draft || 0) + (stats?.review || 0)}
                                </div>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Nodes In-Flight</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary mb-2">
                                    {Math.round((stats?.weekCount || 0) / 7 * 10) / 10}
                                </div>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Daily Delta</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                </div>
            </div>
        </AdminLayout>
    );
}

function HealthStatCard({ label, value, icon: Icon, desc, color }: any) {
    const colors: Record<string, string> = {
        amber: 'text-warning bg-warning/10 border-warning/20',
        blue: 'text-info bg-info/10 border-info/20',
        emerald: 'text-success bg-success/10 border-success/20',
        rose: 'text-error bg-error/10 border-error/20'
    };

    return (
        <Card className="bg-card/40 border-border backdrop-blur-sm p-6 rounded-2xl group hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg", colors[color])}>
                    <Icon className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-[10px] border-border text-muted-foreground uppercase tracking-widest">{label}</Badge>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{value}</div>
            <p className="text-xs text-muted-foreground font-medium">{desc}</p>
        </Card>
    );
}

