"use client";

import React, { useState } from 'react';
import { logger } from '@/lib/logger';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { 
    User, 
    FileText, 
    DollarSign, 
    TrendingUp, 
    Award,
    Eye,
    Target,
    Zap,
    Edit,
    BookOpen,
    BarChart3
} from 'lucide-react';
interface AIPersona {
    id: string;
    author: {
        id: string;
        name: string;
        bio: string;
        expertise: string[];
        avatar_url?: string;
        profile_image?: string;
    };
    total_articles_written: number;
    total_articles_published: number;
    total_revenue: number;
    total_views: number;
    total_affiliate_clicks: number;
    avg_seo_score: number;
    avg_quality_score: number;
    revenue_rank: number;
    article_count_rank: number;
    quality_rank: number;
    overall_rank: number;
    prompts_used: any[];
    specialization: string[];
    first_article_date: string;
    last_article_date: string;
}

export default function AIPersonaDashboard() {
    const [sortBy, setSortBy] = useState<'revenue' | 'articles' | 'quality' | 'overall'>('overall');
    const supabase = createClient();

    // Fetch AI Personas with performance data
    const { data: personas = [], isLoading } = useQuery({
        queryKey: ['ai-personas', sortBy],
        queryFn: async () => {
            const { data: performanceData, error: perfError } = await supabase
                .from('ai_persona_performance')
                .select(`
                    *,
                    author:authors (
                        id,
                        name,
                        bio,
                        expertise,
                        avatar_url,
                        profile_image
                    )
                `)
                .eq('active_status', true)
                .order(
                    sortBy === 'revenue' ? 'revenue_rank' :
                    sortBy === 'articles' ? 'article_count_rank' :
                    sortBy === 'quality' ? 'quality_rank' :
                    'overall_rank'
                );

            if (perfError) {
                logger.error('Error fetching personas:', perfError);
                return [];
            }

            return performanceData || [];
        },
        initialData: []
    });

    // Calculate aggregate stats
    const totalArticles = personas.reduce((sum: number, p: AIPersona) => sum + p.total_articles_published, 0);
    const totalRevenue = personas.reduce((sum: number, p: AIPersona) => sum + (p.total_revenue || 0), 0);
    const totalViews = personas.reduce((sum: number, p: AIPersona) => sum + (p.total_views || 0), 0);
    const avgQuality = personas.length > 0 
        ? personas.reduce((sum: number, p: AIPersona) => sum + p.avg_quality_score, 0) / personas.length 
        : 0;

    const getRankBadgeColor = (rank: number) => {
        if (rank === 1) return 'bg-success-500/20 text-success-400 border-success-500/50';
        if (rank === 2) return 'bg-primary-500/20 text-primary-400 border-primary-500/50';
        if (rank === 3) return 'bg-accent-500/20 text-accent-400 border-accent-500/50';
        return 'bg-gray-500/20 text-muted-foreground dark:text-muted-foreground border-gray-500/50';
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return '#1';
        if (rank === 2) return '#2';
        if (rank === 3) return '#3';
        return `#${rank}`;
    };

    return (
        <AdminLayout>
            <div className="h-full flex flex-col px-10 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-border/50 dark:border-border/50 pb-8 mt-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-foreground dark:text-foreground tracking-tight mb-2 flex items-center gap-3">
                            <Award className="w-8 h-8 text-primary-500" />
                            Author Performance
                        </h1>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground font-medium tracking-wide">
                            20 content authors competing for dominance
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-4 py-2 bg-white/5 border border-border dark:border-border rounded-xl text-foreground dark:text-foreground text-sm h-11"
                        >
                            <option value="overall" className="bg-surface-darker dark:bg-surface-darker">Overall Rank</option>
                            <option value="revenue" className="bg-surface-darker dark:bg-surface-darker">Revenue</option>
                            <option value="articles" className="bg-surface-darker dark:bg-surface-darker">Article Count</option>
                            <option value="quality" className="bg-surface-darker dark:bg-surface-darker">Quality Score</option>
                        </select>
                        <Button className="bg-primary-500 hover:bg-primary-600">
                            <Zap className="w-4 h-4 mr-2" />
                            Recalculate Rankings
                        </Button>
                    </div>
                </div>

                {/* Aggregate Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Articles', val: totalArticles, icon: FileText, color: 'text-primary-400', bg: 'bg-primary-500' },
                        { label: 'Total Revenue', val: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-success-400', bg: 'bg-success-500' },
                        { label: 'Total Views', val: totalViews.toLocaleString(), icon: Eye, color: 'text-accent-400', bg: 'bg-accent-500' },
                        { label: 'Avg Quality', val: avgQuality.toFixed(1), icon: Target, color: 'text-primary-400', bg: 'bg-primary-500' },
                    ].map((stat, i) => (
                        <Card key={i} className="bg-card dark:bg-card border-border/50 dark:border-border/50 hover:border-primary-500/30 transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                        <stat.icon className="w-6 h-6 text-foreground dark:text-foreground" />
                                    </div>
                                </div>
                                <p className="text-xs font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-3xl font-extrabold text-foreground dark:text-foreground">{stat.val}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* AI Personas Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="col-span-full p-20 text-center text-muted-foreground dark:text-muted-foreground">Loading authors...</div>
                    ) : personas.length === 0 ? (
                        <div className="col-span-full p-20 text-center">
                            <User className="w-12 h-12 text-muted-foreground/50 dark:text-muted-foreground/50 mx-auto mb-4" />
                            <p className="text-muted-foreground dark:text-muted-foreground">No authors found</p>
                        </div>
                    ) : (
                        personas.map((persona: AIPersona) => (
                            <Card key={persona.id} className="bg-card dark:bg-card border-border/50 dark:border-border/50 hover:border-primary-500/30 transition-all group">
                                <CardHeader className="border-b border-border/50 dark:border-border/50 pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500/20 to-success-500/20 flex items-center justify-center">
                                                {persona.author?.avatar_url ? (
                                                    <img 
                                                        src={persona.author.avatar_url} 
                                                        alt={persona.author.name}
                                                        className="w-full h-full rounded-xl object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-8 h-8 text-primary-400" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-foreground dark:text-foreground text-lg tracking-tight">
                                                    {persona.author?.name || 'Unknown'}
                                                </h3>
                                                <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-0.5">
                                                    AI Writer #{persona.id.slice(0, 8)}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className={`${getRankBadgeColor(persona.overall_rank)} border font-bold px-3 py-1`}>
                                            {getRankIcon(persona.overall_rank)}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6 space-y-4">
                                    {/* Bio */}
                                    <div>
                                        <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 font-bold uppercase tracking-wider mb-2">Bio</p>
                                        <p className="text-sm text-foreground/80 dark:text-foreground/80 line-clamp-2">
                                            {persona.author?.bio || 'No bio available'}
                                        </p>
                                    </div>

                                    {/* Specialization */}
                                    <div>
                                        <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 font-bold uppercase tracking-wider mb-2">Specialization</p>
                                        <div className="flex flex-wrap gap-2">
                                            {persona.specialization?.slice(0, 3).map((spec: string, i: number) => (
                                                <Badge key={i} variant="outline" className="text-xs border-primary-500/50 text-primary-400 capitalize">
                                                    {spec}
                                                </Badge>
                                            )) || <span className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70">No specialization</span>}
                                        </div>
                                    </div>

                                    {/* Performance Metrics */}
                                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50 dark:border-border/50">
                                        <div className="text-center p-3 bg-card/50 dark:bg-card/50 rounded-xl">
                                            <div className="text-2xl font-bold text-foreground dark:text-foreground">{persona.total_articles_published}</div>
                                            <div className="text-[10px] text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-wider mt-1">Published</div>
                                        </div>
                                        <div className="text-center p-3 bg-card/50 dark:bg-card/50 rounded-xl">
                                            <div className="text-2xl font-bold text-success-400">₹{persona.total_revenue?.toLocaleString() || 0}</div>
                                            <div className="text-[10px] text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-wider mt-1">Revenue</div>
                                        </div>
                                        <div className="text-center p-3 bg-card/50 dark:bg-card/50 rounded-xl">
                                            <div className="text-lg font-bold text-primary-400">{persona.avg_quality_score?.toFixed(1) || 0}</div>
                                            <div className="text-[10px] text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-wider mt-1">Quality</div>
                                        </div>
                                        <div className="text-center p-3 bg-card/50 dark:bg-card/50 rounded-xl">
                                            <div className="text-lg font-bold text-accent-400">{persona.avg_seo_score?.toFixed(1) || 0}</div>
                                            <div className="text-[10px] text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-wider mt-1">SEO</div>
                                        </div>
                                    </div>

                                    {/* Rankings */}
                                    <div className="flex items-center justify-between pt-4 border-t border-border/50 dark:border-border/50">
                                        <div className="text-center">
                                            <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-wider mb-1">Revenue</div>
                                            <div className="text-sm font-bold text-foreground dark:text-foreground">#{persona.revenue_rank}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-wider mb-1">Articles</div>
                                            <div className="text-sm font-bold text-foreground dark:text-foreground">#{persona.article_count_rank}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-wider mb-1">Quality</div>
                                            <div className="text-sm font-bold text-foreground dark:text-foreground">#{persona.quality_rank}</div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4">
                                        <Button size="sm" variant="outline" className="flex-1 border-border dark:border-border hover:bg-white/5">
                                            <BookOpen className="w-4 h-4 mr-1" />
                                            View Prompts
                                        </Button>
                                        <Button size="sm" variant="outline" className="flex-1 border-border dark:border-border hover:bg-white/5">
                                            <BarChart3 className="w-4 h-4 mr-1" />
                                            Analytics
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
