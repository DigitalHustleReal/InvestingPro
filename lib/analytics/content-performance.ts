/**
 * Content Performance Tracking
 * Tracks views, engagement, revenue per article
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export interface ContentPerformance {
    articleId: string;
    articleTitle: string;
    articleSlug: string;
    category: string;
    views: number;
    uniqueVisitors: number;
    averageTimeOnPage: number; // seconds
    bounceRate: number; // percentage
    revenue: number;
    conversions: number;
    conversionRate: number; // percentage
    revenuePerView: number;
    publishedDate: string;
    lastUpdated: string;
}

export interface TopPerformingContent {
    articleId: string;
    title: string;
    slug: string;
    category: string;
    performanceScore: number; // 0-100
    views: number;
    revenue: number;
    conversionRate: number;
}

/**
 * Get content performance for a date range
 */
export async function getContentPerformance(
    startDate: string,
    endDate: string,
    limit: number = 50
): Promise<ContentPerformance[]> {
    try {
        // Get articles with views
        const { data: articles, error: articlesError } = await supabase
            .from('articles')
            .select('id, title, slug, category, views, published_date, updated_at')
            .eq('status', 'published')
            .gte('published_date', startDate)
            .lte('published_date', endDate)
            .order('views', { ascending: false })
            .limit(limit);

        if (articlesError) {
            throw articlesError;
        }

        // Get revenue for each article
        const articleIds = articles?.map(a => a.id) || [];
        
        const { data: conversions } = await supabase
            .from('affiliate_clicks')
            .select('article_id, commission_earned, converted')
            .in('article_id', articleIds)
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        // Calculate revenue per article
        const articleRevenueMap = new Map<string, { revenue: number; conversions: number }>();
        conversions?.forEach(conv => {
            if (conv.article_id) {
                const revenue = Number(conv.commission_earned) || 0;
                const existing = articleRevenueMap.get(conv.article_id) || { revenue: 0, conversions: 0 };
                articleRevenueMap.set(conv.article_id, {
                    revenue: existing.revenue + revenue,
                    conversions: existing.conversions + (conv.converted ? 1 : 0)
                });
            }
        });

        // Build performance data
        const performance: ContentPerformance[] = (articles || []).map(article => {
            const revenueData = articleRevenueMap.get(article.id) || { revenue: 0, conversions: 0 };
            const views = article.views || 0;
            const revenue = revenueData.revenue;
            const conversions = revenueData.conversions;

            return {
                articleId: article.id,
                articleTitle: article.title,
                articleSlug: article.slug,
                category: article.category,
                views,
                uniqueVisitors: Math.floor(views * 0.7), // Estimate: 70% unique
                averageTimeOnPage: 120, // Placeholder: 2 minutes
                bounceRate: 45, // Placeholder: 45% bounce rate
                revenue,
                conversions,
                conversionRate: views > 0 ? (conversions / views) * 100 : 0,
                revenuePerView: views > 0 ? revenue / views : 0,
                publishedDate: article.published_date,
                lastUpdated: article.updated_at
            };
        });

        return performance;

    } catch (error) {
        logger.error('Error getting content performance', error);
        throw error;
    }
}

/**
 * Get top performing content
 */
export async function getTopPerformingContent(
    startDate: string,
    endDate: string,
    limit: number = 20
): Promise<TopPerformingContent[]> {
    try {
        const performance = await getContentPerformance(startDate, endDate, limit * 2);

        // Calculate performance score (weighted: views 40%, revenue 40%, conversion rate 20%)
        const scored = performance.map(item => {
            const viewsScore = Math.min(100, (item.views / 10000) * 100); // Normalize to 100
            const revenueScore = Math.min(100, (item.revenue / 10000) * 100); // Normalize to 100
            const conversionScore = Math.min(100, item.conversionRate * 10); // 10% conversion = 100 points

            const performanceScore = (viewsScore * 0.4) + (revenueScore * 0.4) + (conversionScore * 0.2);

            return {
                articleId: item.articleId,
                title: item.articleTitle,
                slug: item.articleSlug,
                category: item.category,
                performanceScore: Number(performanceScore.toFixed(2)),
                views: item.views,
                revenue: item.revenue,
                conversionRate: item.conversionRate
            };
        });

        // Sort by performance score and return top N
        return scored
            .sort((a, b) => b.performanceScore - a.performanceScore)
            .slice(0, limit);

    } catch (error) {
        logger.error('Error getting top performing content', error);
        throw error;
    }
}

/**
 * Get content gap analysis
 * Identifies missing topics based on search trends and competitor content
 */
export async function getContentGaps(category?: string): Promise<Array<{
    keyword: string;
    searchVolume: number;
    difficulty: number;
    opportunityScore: number;
    reason: string;
}>> {
    try {
        // Get existing article topics
        const { data: articles } = await supabase
            .from('articles')
            .select('title, category, tags')
            .eq('status', 'published')
            .limit(1000);

        const existingTopics = new Set<string>();
        articles?.forEach(article => {
            // Extract keywords from titles
            const words = article.title.toLowerCase().split(/\s+/).filter((w: any) => w.length > 3);
            words.forEach((word: any) => existingTopics.add(word));
            
            // Add tags
            if (article.tags) {
                article.tags.forEach((tag: string) => existingTopics.add(tag.toLowerCase()));
            }
        });

        // Define high-opportunity keywords (would come from keyword research API)
        const highOpportunityKeywords = [
            { keyword: 'best credit card for online shopping 2026', searchVolume: 5000, difficulty: 35 },
            { keyword: 'sip vs lump sum investment', searchVolume: 3000, difficulty: 40 },
            { keyword: 'tax saving mutual funds 2026', searchVolume: 8000, difficulty: 45 },
            { keyword: 'credit card rewards calculator', searchVolume: 2000, difficulty: 30 },
            { keyword: 'mutual fund expense ratio explained', searchVolume: 4000, difficulty: 35 }
        ];

        // Filter out keywords we already have content for
        const gaps = highOpportunityKeywords
            .filter(kw => {
                const keywordWords = kw.keyword.toLowerCase().split(/\s+/);
                return !keywordWords.some(word => existingTopics.has(word));
            })
            .map(kw => ({
                keyword: kw.keyword,
                searchVolume: kw.searchVolume,
                difficulty: kw.difficulty,
                opportunityScore: (kw.searchVolume / 100) * (100 - kw.difficulty), // Higher volume + lower difficulty = better
                reason: `High search volume (${kw.searchVolume}/month) with low difficulty (${kw.difficulty})`
            }))
            .sort((a, b) => b.opportunityScore - a.opportunityScore);

        return gaps;

    } catch (error) {
        logger.error('Error getting content gaps', error);
        throw error;
    }
}

/**
 * Get content recommendations based on performance
 */
export async function getContentRecommendations(
    articleId: string
): Promise<Array<{
    type: 'refresh' | 'expand' | 'repurpose' | 'promote';
    reason: string;
    priority: 'high' | 'medium' | 'low';
    action: string;
}>> {
    try {
        // Get article performance
        const { data: article } = await supabase
            .from('articles')
            .select('id, title, views, published_date, updated_at, content')
            .eq('id', articleId)
            .single();

        if (!article) {
            return [];
        }

        const recommendations: Array<{
            type: 'refresh' | 'expand' | 'repurpose' | 'promote';
            reason: string;
            priority: 'high' | 'medium' | 'low';
            action: string;
        }> = [];

        // Check if article is old (>6 months)
        const publishedDate = new Date(article.published_date);
        const monthsOld = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
        
        if (monthsOld > 6) {
            recommendations.push({
                type: 'refresh',
                reason: `Article is ${monthsOld.toFixed(1)} months old`,
                priority: 'high',
                action: 'Update statistics, rates, and product data'
            });
        }

        // Check if article has low views but high potential
        if (article.views < 100 && monthsOld < 3) {
            recommendations.push({
                type: 'promote',
                reason: 'Low views but recent content',
                priority: 'medium',
                action: 'Promote on social media and email newsletter'
            });
        }

        // Check content length
        const wordCount = (article.content || '').split(/\s+/).length;
        if (wordCount < 1000) {
            recommendations.push({
                type: 'expand',
                reason: `Content is only ${wordCount} words`,
                priority: 'medium',
                action: 'Expand to 2000+ words for better SEO'
            });
        }

        // Always recommend repurposing
        recommendations.push({
            type: 'repurpose',
            reason: 'Repurpose for social media and email',
            priority: 'low',
            action: 'Create Twitter thread, LinkedIn post, and email newsletter'
        });

        return recommendations;

    } catch (error) {
        logger.error('Error getting content recommendations', error);
        throw error;
    }
}
