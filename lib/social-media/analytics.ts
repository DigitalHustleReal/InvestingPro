/**
 * Social Media Analytics
 * Tracks engagement, clicks, conversions from social media
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export interface SocialMediaMetrics {
    platform: 'twitter' | 'linkedin' | 'telegram' | 'whatsapp';
    posts: number;
    impressions: number;
    engagement: {
        likes: number;
        shares: number;
        comments: number;
        clicks: number;
    };
    engagementRate: number; // percentage
    clickThroughRate: number; // percentage
    conversions: number;
    conversionRate: number; // percentage
}

export interface SocialMediaCampaign {
    id: string;
    platform: string;
    postId: string;
    content: string;
    postedAt: string;
    impressions: number;
    engagement: number;
    clicks: number;
    conversions: number;
}

/**
 * Track social media post
 */
export async function trackSocialPost(params: {
    platform: 'twitter' | 'linkedin' | 'telegram' | 'whatsapp';
    postId: string;
    content: string;
    articleId?: string;
    url?: string;
}): Promise<void> {
    try {
        await supabase.from('social_posts').insert({
            platform: params.platform,
            post_id: params.postId,
            content: params.content,
            article_id: params.articleId,
            url: params.url,
            status: 'published',
            posted_at: new Date().toISOString()
        });

        logger.info('Social post tracked', { platform: params.platform, postId: params.postId });

    } catch (error) {
        logger.error('Error tracking social post', error as Error);
    }
}

/**
 * Track social media engagement (likes, shares, comments)
 */
export async function trackSocialEngagement(params: {
    postId: string;
    platform: string;
    type: 'like' | 'share' | 'comment' | 'click';
}): Promise<void> {
    try {
        // Update social_posts table with engagement
        // In production, you'd have a separate engagement tracking table
        await supabase
            .from('social_posts')
            .update({
                updated_at: new Date().toISOString()
                // Could add engagement_count field
            })
            .eq('post_id', params.postId)
            .eq('platform', params.platform);

        logger.info('Social engagement tracked', { postId: params.postId, type: params.type });

    } catch (error) {
        logger.error('Error tracking social engagement', error as Error);
    }
}

/**
 * Get social media metrics for a date range
 */
export async function getSocialMediaMetrics(
    startDate: string,
    endDate: string,
    platform?: 'twitter' | 'linkedin' | 'telegram' | 'whatsapp'
): Promise<SocialMediaMetrics[]> {
    try {
        // Get social posts in date range
        let query = supabase
            .from('social_posts')
            .select('*')
            .eq('status', 'published')
            .gte('posted_at', startDate)
            .lte('posted_at', endDate);

        if (platform) {
            query = query.eq('platform', platform);
        }

        const { data: posts } = await query;

        // Group by platform
        const platformMetrics = new Map<string, SocialMediaMetrics>();

        posts?.forEach(post => {
            const platform = post.platform as 'twitter' | 'linkedin' | 'telegram' | 'whatsapp';
            
            if (!platformMetrics.has(platform)) {
                platformMetrics.set(platform, {
                    platform,
                    posts: 0,
                    impressions: 0,
                    engagement: {
                        likes: 0,
                        shares: 0,
                        comments: 0,
                        clicks: 0
                    },
                    engagementRate: 0,
                    clickThroughRate: 0,
                    conversions: 0,
                    conversionRate: 0
                });
            }

            const metrics = platformMetrics.get(platform)!;
            metrics.posts++;
            metrics.impressions += post.impressions || 0;
            // Engagement would come from API/webhooks
            // For now, use placeholder
            metrics.engagement.clicks += post.clicks || 0;
        });

        // Calculate rates
        Array.from(platformMetrics.values()).forEach(metrics => {
            const totalEngagement = metrics.engagement.likes + metrics.engagement.shares + 
                                  metrics.engagement.comments + metrics.engagement.clicks;
            metrics.engagementRate = metrics.impressions > 0 
                ? (totalEngagement / metrics.impressions) * 100 
                : 0;
            metrics.clickThroughRate = metrics.impressions > 0 
                ? (metrics.engagement.clicks / metrics.impressions) * 100 
                : 0;
            metrics.conversionRate = metrics.engagement.clicks > 0 
                ? (metrics.conversions / metrics.engagement.clicks) * 100 
                : 0;
        });

        return Array.from(platformMetrics.values());

    } catch (error) {
        logger.error('Error getting social media metrics', error as Error);
        throw error;
    }
}

/**
 * Get social media campaigns
 */
export async function getSocialMediaCampaigns(
    startDate: string,
    endDate: string
): Promise<SocialMediaCampaign[]> {
    try {
        const { data: posts } = await supabase
            .from('social_posts')
            .select('*')
            .eq('status', 'published')
            .gte('posted_at', startDate)
            .lte('posted_at', endDate)
            .order('posted_at', { ascending: false })
            .limit(100);

        const campaigns: SocialMediaCampaign[] = (posts || []).map(post => ({
            id: post.id,
            platform: post.platform,
            postId: post.post_id,
            content: post.content?.substring(0, 100) + '...' || '',
            postedAt: post.posted_at,
            impressions: post.impressions || 0,
            engagement: (post.likes || 0) + (post.shares || 0) + (post.comments || 0),
            clicks: post.clicks || 0,
            conversions: post.conversions || 0
        }));

        return campaigns;

    } catch (error) {
        logger.error('Error getting social media campaigns', error as Error);
        throw error;
    }
}
