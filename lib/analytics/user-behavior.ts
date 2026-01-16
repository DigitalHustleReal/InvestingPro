/**
 * User Behavior Analytics
 * Tracks user paths, engagement, and segments
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export interface UserPath {
    sessionId: string;
    userId?: string;
    path: string[];
    pages: string[];
    timeOnPage: number[];
    scrollDepth: number[];
    referrer?: string;
    userAgent?: string;
    startTime: string;
    endTime: string;
    duration: number; // seconds
}

export interface UserSegment {
    segment: 'new' | 'returning' | 'high-intent' | 'browsing';
    count: number;
    percentage: number;
}

export interface EngagementMetrics {
    averageTimeOnPage: number; // seconds
    averageScrollDepth: number; // percentage
    bounceRate: number; // percentage
    pagesPerSession: number;
    sessions: number;
}

export interface PopularContent {
    path: string;
    title: string;
    views: number;
    uniqueVisitors: number;
    averageTimeOnPage: number;
    bounceRate: number;
}

/**
 * Track user page view
 * Call this from client-side when user visits a page
 */
export async function trackPageView(data: {
    path: string;
    title: string;
    referrer?: string;
    userAgent?: string;
    sessionId?: string;
    userId?: string;
}): Promise<void> {
    try {
        // In production, you'd store this in analytics_events table
        // For now, we'll use a simplified approach with existing data
        
        // This would typically insert into analytics_events table
        // await supabase.from('analytics_events').insert({
        //     event_type: 'page_view',
        //     path: data.path,
        //     title: data.title,
        //     referrer: data.referrer,
        //     user_agent: data.userAgent,
        //     session_id: data.sessionId,
        //     user_id: data.userId,
        //     created_at: new Date().toISOString()
        // });

        logger.info('Page view tracked', { path: data.path });
    } catch (error) {
        logger.error('Error tracking page view', error);
        // Don't throw - analytics failures shouldn't break the app
    }
}

/**
 * Track user engagement (time on page, scroll depth)
 */
export async function trackEngagement(data: {
    path: string;
    timeOnPage: number; // seconds
    scrollDepth: number; // percentage 0-100
    sessionId?: string;
    userId?: string;
}): Promise<void> {
    try {
        // In production, store in analytics_events table
        // await supabase.from('analytics_events').insert({
        //     event_type: 'engagement',
        //     path: data.path,
        //     time_on_page: data.timeOnPage,
        //     scroll_depth: data.scrollDepth,
        //     session_id: data.sessionId,
        //     user_id: data.userId,
        //     created_at: new Date().toISOString()
        // });

        logger.info('Engagement tracked', { path: data.path, timeOnPage: data.timeOnPage, scrollDepth: data.scrollDepth });
    } catch (error) {
        logger.error('Error tracking engagement', error);
    }
}

/**
 * Get user paths for a date range
 * Returns paths users took through the site
 */
export async function getUserPaths(
    startDate: string,
    endDate: string,
    limit: number = 100
): Promise<UserPath[]> {
    try {
        // In production, query analytics_events table grouped by session_id
        // For now, we'll use affiliate_clicks as a proxy for user paths
        
        const { data: clicks } = await supabase
            .from('affiliate_clicks')
            .select('id, article_id, referrer, user_agent, created_at')
            .gte('created_at', startDate)
            .lte('created_at', endDate)
            .order('created_at', { ascending: false })
            .limit(limit);

        // Build paths from clicks (simplified - in production would use session tracking)
        const paths: UserPath[] = (clicks || []).map((click, index) => {
            // Get article slug if available
            let articlePath = '/articles/unknown';
            if (click.article_id) {
                // Would need to join with articles table to get slug
                articlePath = `/articles/${click.article_id}`;
            }

            return {
                sessionId: `session-${click.id}`,
                path: [articlePath, '/products'],
                pages: [articlePath, '/products'],
                timeOnPage: [30, 20], // Placeholder
                scrollDepth: [75, 50], // Placeholder
                referrer: click.referrer || undefined,
                userAgent: click.user_agent || undefined,
                startTime: click.created_at,
                endTime: new Date(new Date(click.created_at).getTime() + 50 * 1000).toISOString(),
                duration: 50 // seconds
            };
        });

        return paths;

    } catch (error) {
        logger.error('Error getting user paths', error);
        throw error;
    }
}

/**
 * Get popular content (most viewed pages)
 */
export async function getPopularContent(
    startDate: string,
    endDate: string,
    limit: number = 20
): Promise<PopularContent[]> {
    try {
        // Get articles with views
        const { data: articles } = await supabase
            .from('articles')
            .select('id, title, slug, views, published_date')
            .eq('status', 'published')
            .gte('published_date', startDate)
            .lte('published_date', endDate)
            .order('views', { ascending: false })
            .limit(limit);

        const popularContent: PopularContent[] = (articles || []).map(article => ({
            path: `/articles/${article.slug}`,
            title: article.title,
            views: article.views || 0,
            uniqueVisitors: Math.floor((article.views || 0) * 0.7), // Estimate: 70% unique
            averageTimeOnPage: 120, // Placeholder: 2 minutes
            bounceRate: 45 // Placeholder: 45% bounce rate
        }));

        return popularContent;

    } catch (error) {
        logger.error('Error getting popular content', error);
        throw error;
    }
}

/**
 * Get user segments
 * Identifies new vs returning, high-intent vs browsing
 */
export async function getUserSegments(
    startDate: string,
    endDate: string
): Promise<UserSegment[]> {
    try {
        // Get clicks to analyze user behavior
        const { data: clicks } = await supabase
            .from('affiliate_clicks')
            .select('user_ip, created_at, converted')
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        // Count unique IPs (new vs returning)
        const ipCounts = new Map<string, number>();
        clicks?.forEach(click => {
            if (click.user_ip) {
                ipCounts.set(click.user_ip, (ipCounts.get(click.user_ip) || 0) + 1);
            }
        });

        const newUsers = Array.from(ipCounts.values()).filter(count => count === 1).length;
        const returningUsers = Array.from(ipCounts.values()).filter(count => count > 1).length;

        // High-intent: users who clicked affiliate links
        const highIntentUsers = clicks?.filter(click => click.converted).length || 0;
        const browsingUsers = (clicks?.length || 0) - highIntentUsers;

        const totalUsers = clicks?.length || 1;

        return [
            {
                segment: 'new',
                count: newUsers,
                percentage: (newUsers / totalUsers) * 100
            },
            {
                segment: 'returning',
                count: returningUsers,
                percentage: (returningUsers / totalUsers) * 100
            },
            {
                segment: 'high-intent',
                count: highIntentUsers,
                percentage: (highIntentUsers / totalUsers) * 100
            },
            {
                segment: 'browsing',
                count: browsingUsers,
                percentage: (browsingUsers / totalUsers) * 100
            }
        ];

    } catch (error) {
        logger.error('Error getting user segments', error);
        throw error;
    }
}

/**
 * Get engagement metrics
 */
export async function getEngagementMetrics(
    startDate: string,
    endDate: string
): Promise<EngagementMetrics> {
    try {
        // Get article views
        const { data: articles } = await supabase
            .from('articles')
            .select('views')
            .gte('published_date', startDate)
            .lte('published_date', endDate);

        const totalViews = articles?.reduce((sum, a) => sum + (a.views || 0), 0) || 0;
        const articleCount = articles?.length || 1;

        // Get clicks (sessions)
        const { data: clicks } = await supabase
            .from('affiliate_clicks')
            .select('id')
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        const sessions = clicks?.length || 0;

        // Calculate metrics (using placeholders for time/scroll data)
        return {
            averageTimeOnPage: 120, // 2 minutes (placeholder)
            averageScrollDepth: 65, // 65% (placeholder)
            bounceRate: 45, // 45% (placeholder)
            pagesPerSession: totalViews > 0 && sessions > 0 ? totalViews / sessions : 1.5,
            sessions
        };

    } catch (error) {
        logger.error('Error getting engagement metrics', error);
        throw error;
    }
}

/**
 * Get traffic sources
 */
export async function getTrafficSources(
    startDate: string,
    endDate: string
): Promise<Array<{ source: string; count: number; percentage: number }>> {
    try {
        // Get clicks with referrers
        const { data: clicks } = await supabase
            .from('affiliate_clicks')
            .select('referrer')
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        // Categorize referrers
        const sourceCounts = new Map<string, number>();
        
        clicks?.forEach(click => {
            const referrer = click.referrer || 'direct';
            let source = 'direct';

            if (referrer.includes('google') || referrer.includes('bing')) {
                source = 'search';
            } else if (referrer.includes('facebook') || referrer.includes('twitter') || referrer.includes('linkedin')) {
                source = 'social';
            } else if (referrer.includes('investingpro.in')) {
                source = 'internal';
            } else if (referrer !== 'direct') {
                source = 'referral';
            }

            sourceCounts.set(source, (sourceCounts.get(source) || 0) + 1);
        });

        const total = clicks?.length || 1;
        const sources = Array.from(sourceCounts.entries()).map(([source, count]) => ({
            source,
            count,
            percentage: (count / total) * 100
        }));

        return sources.sort((a, b) => b.count - a.count);

    } catch (error) {
        logger.error('Error getting traffic sources', error);
        throw error;
    }
}
