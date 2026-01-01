
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

export interface ArticleAnalytics {
    articleId: string;
    views: number;
    uniqueVisitors: number;
    avgReadTime: number;
    bounceRate: number;
    socialShares: number;
    searchImpressions?: number;
    clickThroughRate?: number;
}

export interface ContentPerformance {
    totalArticles: number;
    totalViews: number;
    avgViewsPerArticle: number;
    topPerformers: ArticlePerformanceSummary[];
    recentTrending: ArticlePerformanceSummary[];
    categoryBreakdown: CategoryStats[];
}

export interface ArticlePerformanceSummary {
    id: string;
    title: string;
    slug: string;
    views: number;
    published_at: string;
    category: string;
    growth?: number; // % change vs previous period
}

export interface CategoryStats {
    category: string;
    articleCount: number;
    totalViews: number;
    avgViews: number;
}

class AnalyticsService {
    private supabase = createClient();

    /**
     * Record a page view for an article
     */
    async recordView(articleId: string, metadata?: {
        referrer?: string;
        duration?: number;
        userId?: string;
    }): Promise<void> {
        try {
            // Increment view count on articles table
            const { error } = await this.supabase.rpc('increment_article_views', {
                article_id: articleId
            });

            if (error) {
                // Fallback: direct update if RPC doesn't exist
                await this.supabase
                    .from('articles')
                    .update({ views: this.supabase.rpc('coalesce', { col: 'views', default_val: 0 }) })
                    .eq('id', articleId);
            }

            // Log to analytics table if exists
            await this.supabase.from('article_analytics').insert({
                article_id: articleId,
                event_type: 'view',
                referrer: metadata?.referrer,
                read_duration: metadata?.duration,
                user_id: metadata?.userId,
                created_at: new Date().toISOString()
            }).then(() => {}).catch(() => {
                // Analytics table might not exist, that's ok
            });

        } catch (error) {
            logger.warn('Failed to record view', { articleId, error: (error as Error).message });
        }
    }

    /**
     * Get performance overview for the content dashboard
     */
    async getPerformanceOverview(): Promise<ContentPerformance> {
        try {
            // Get all published articles with their views
            const { data: articles, error } = await this.supabase
                .from('articles')
                .select('id, title, slug, views, category, published_at, created_at')
                .eq('status', 'published')
                .order('views', { ascending: false });

            if (error || !articles) {
                return this.getEmptyPerformance();
            }

            const totalArticles = articles.length;
            const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
            const avgViewsPerArticle = totalArticles > 0 ? Math.round(totalViews / totalArticles) : 0;

            // Top 5 performers
            const topPerformers = articles.slice(0, 5).map(a => ({
                id: a.id,
                title: a.title,
                slug: a.slug,
                views: a.views || 0,
                published_at: a.published_at,
                category: a.category
            }));

            // Recent trending (last 7 days, sorted by views)
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const recentArticles = articles
                .filter(a => a.published_at && new Date(a.published_at) > weekAgo)
                .slice(0, 5)
                .map(a => ({
                    id: a.id,
                    title: a.title,
                    slug: a.slug,
                    views: a.views || 0,
                    published_at: a.published_at,
                    category: a.category
                }));

            // Category breakdown
            const categoryMap = new Map<string, { count: number; views: number }>();
            articles.forEach(a => {
                const cat = a.category || 'uncategorized';
                const existing = categoryMap.get(cat) || { count: 0, views: 0 };
                categoryMap.set(cat, {
                    count: existing.count + 1,
                    views: existing.views + (a.views || 0)
                });
            });

            const categoryBreakdown = Array.from(categoryMap.entries())
                .map(([category, stats]) => ({
                    category,
                    articleCount: stats.count,
                    totalViews: stats.views,
                    avgViews: Math.round(stats.views / stats.count)
                }))
                .sort((a, b) => b.totalViews - a.totalViews);

            return {
                totalArticles,
                totalViews,
                avgViewsPerArticle,
                topPerformers,
                recentTrending: recentArticles,
                categoryBreakdown
            };

        } catch (error) {
            logger.error('Failed to get performance overview', error as Error);
            return this.getEmptyPerformance();
        }
    }

    /**
     * Get analytics for a specific article
     */
    async getArticleAnalytics(articleId: string): Promise<ArticleAnalytics | null> {
        try {
            const { data: article, error } = await this.supabase
                .from('articles')
                .select('id, views')
                .eq('id', articleId)
                .single();

            if (error || !article) return null;

            // For now, return basic metrics
            // In production, you'd query a dedicated analytics table
            return {
                articleId: article.id,
                views: article.views || 0,
                uniqueVisitors: Math.round((article.views || 0) * 0.7), // Estimate
                avgReadTime: 180, // 3 min placeholder
                bounceRate: 45, // % placeholder
                socialShares: 0
            };

        } catch (error) {
            logger.error('Failed to get article analytics', error as Error);
            return null;
        }
    }

    private getEmptyPerformance(): ContentPerformance {
        return {
            totalArticles: 0,
            totalViews: 0,
            avgViewsPerArticle: 0,
            topPerformers: [],
            recentTrending: [],
            categoryBreakdown: []
        };
    }
}

export const analyticsService = new AnalyticsService();
