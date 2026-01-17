/**
 * Rankings Tracker
 * 
 * Tracks keyword rankings over time using Google Search Console API
 * Monitors position changes and triggers alerts for significant drops
 */

import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

export interface RankingData {
    keyword: string;
    position: number | null; // 1-100, null if not in top 100
    url: string;
    trackedAt: string;
    previousPosition?: number | null;
    change?: number; // Position change (negative = dropped, positive = improved)
    dataSource: 'gsc' | 'serpapi' | 'manual';
}

export interface RankingAlert {
    keyword: string;
    url: string;
    currentPosition: number | null;
    previousPosition: number;
    change: number;
    severity: 'critical' | 'warning' | 'info';
    message: string;
}

/**
 * Get Supabase client for rankings tracking
 */
function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Supabase credentials not configured');
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

/**
 * Track keyword ranking (store in database)
 */
export async function trackRanking(
    keyword: string,
    position: number | null,
    url: string,
    dataSource: 'gsc' | 'serpapi' | 'manual' = 'gsc'
): Promise<void> {
    try {
        const supabase = getSupabaseClient();

        // Get previous position
        const { data: previousData } = await supabase
            .from('serp_tracking')
            .select('position')
            .eq('keyword', keyword)
            .order('tracked_at', { ascending: false })
            .limit(1)
            .single();

        const previousPosition = previousData?.position || null;

        // Insert new ranking
        const { error } = await supabase
            .from('serp_tracking')
            .insert({
                keyword,
                position,
                url,
                data_source: dataSource,
                previous_position: previousPosition,
                tracked_at: new Date().toISOString()
            });

        if (error) {
            throw error;
        }

        logger.info('Ranking tracked', { keyword, position, url, dataSource });

    } catch (error) {
        logger.error('Failed to track ranking', error as Error, { keyword, position, url });
        throw error;
    }
}

/**
 * Get latest ranking for a keyword
 */
export async function getLatestRanking(keyword: string): Promise<RankingData | null> {
    try {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('serp_tracking')
            .select('*')
            .eq('keyword', keyword)
            .order('tracked_at', { ascending: false })
            .limit(1)
            .single();

        if (error || !data) {
            return null;
        }

        const change = data.previous_position !== null && data.position !== null
            ? data.previous_position - data.position // Positive = improved, negative = dropped
            : undefined;

        return {
            keyword: data.keyword,
            position: data.position,
            url: data.url,
            trackedAt: data.tracked_at,
            previousPosition: data.previous_position,
            change,
            dataSource: data.data_source
        };

    } catch (error) {
        logger.error('Failed to get latest ranking', error as Error, { keyword });
        return null;
    }
}

/**
 * Get ranking history for a keyword
 */
export async function getRankingHistory(
    keyword: string,
    days: number = 30
): Promise<RankingData[]> {
    try {
        const supabase = getSupabaseClient();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data, error } = await supabase
            .from('serp_tracking')
            .select('*')
            .eq('keyword', keyword)
            .gte('tracked_at', startDate.toISOString())
            .order('tracked_at', { ascending: false });

        if (error || !data) {
            return [];
        }

        return data.map(item => ({
            keyword: item.keyword,
            position: item.position,
            url: item.url,
            trackedAt: item.tracked_at,
            previousPosition: item.previous_position,
            change: item.previous_position !== null && item.position !== null
                ? item.previous_position - item.position
                : undefined,
            dataSource: item.data_source
        }));

    } catch (error) {
        logger.error('Failed to get ranking history', error as Error, { keyword });
        return [];
    }
}

/**
 * Check for ranking drops (positions dropped > threshold)
 */
export async function checkRankingDrops(threshold: number = 3): Promise<RankingAlert[]> {
    try {
        const supabase = getSupabaseClient();

        // Get all keywords with recent tracking data
        const { data, error } = await supabase
            .from('serp_tracking')
            .select('keyword, position, previous_position, url')
            .not('previous_position', 'is', null)
            .not('position', 'is', null)
            .gte('tracked_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
            .order('tracked_at', { ascending: false });

        if (error || !data) {
            return [];
        }

        const alerts: RankingAlert[] = [];

        // Group by keyword and get latest
        const keywordMap = new Map<string, any>();
        data.forEach(item => {
            if (!keywordMap.has(item.keyword)) {
                keywordMap.set(item.keyword, item);
            }
        });

        keywordMap.forEach((item, keyword) => {
            const previousPosition = item.previous_position;
            const currentPosition = item.position;
            const change = previousPosition - currentPosition; // Negative = dropped

            if (change > threshold) {
                // Position dropped significantly
                const severity = change > 10 ? 'critical' : change > 5 ? 'warning' : 'info';
                alerts.push({
                    keyword,
                    url: item.url,
                    currentPosition,
                    previousPosition,
                    change: -change, // Positive for dropped
                    severity,
                    message: `Ranking dropped from position ${previousPosition} to ${currentPosition} (${-change} positions)`
                });
            }
        });

        return alerts;

    } catch (error) {
        logger.error('Failed to check ranking drops', error as Error);
        return [];
    }
}

/**
 * Sync rankings from Google Search Console (requires GSC API integration)
 * TODO: Implement GSC API integration
 */
export async function syncRankingsFromGSC(
    keywords: string[],
    siteUrl: string
): Promise<void> {
    const gscApiKey = process.env.GSC_API_KEY;
    if (!gscApiKey) {
        logger.warn('Google Search Console API key not configured, skipping sync');
        return;
    }

    // TODO: Implement Google Search Console API integration
    // Example: https://developers.google.com/webmaster-tools/search-console-api-original
    // For now, log that it's not implemented
    logger.info('GSC rankings sync not yet implemented', { keywords, siteUrl });

    // Placeholder: Manual tracking can still be used
    logger.warn('Using manual ranking tracking. GSC API integration required for automation.');
}

/**
 * Check if ranking tracking is configured
 */
export function isRankingTrackingConfigured(): boolean {
    return !!(
        process.env.GSC_API_KEY ||
        process.env.SERPAPI_API_KEY
    );
}
