/**
 * SERP Tracker
 * Tracks keyword rankings over time for SEO monitoring
 * 
 * Features:
 * - Track rankings for target keywords
 * - Monitor competitor rankings
 * - Alert on ranking drops
 * - Historical ranking data
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export interface KeywordRanking {
    keyword: string;
    position: number | null; // null if not in top 100
    url?: string; // URL ranking for this keyword
    date: string;
    change?: number; // Position change from previous check (+2, -5, etc.)
}

export interface SERPTrackingResult {
    keyword: string;
    currentRanking: number | null;
    previousRanking: number | null;
    change: number | null;
    trend: 'up' | 'down' | 'stable' | 'new' | 'lost';
    trackedAt: string;
}

/**
 * Track keyword ranking (simplified - using cached SERP data or manual entry)
 * 
 * NOTE: For production, you'd use:
 * - SerpApi (paid) for accurate rankings
 * - Google Search Console API (free) for your own domain
 * - Manual tracking via browser extensions
 */
export async function trackKeywordRanking(
    keyword: string,
    targetUrl?: string
): Promise<SERPTrackingResult> {
    try {
        // Get previous ranking
        const { data: previousRanking } = await supabase
            .from('serp_tracking')
            .select('position, tracked_at')
            .eq('keyword', keyword.toLowerCase())
            .order('tracked_at', { ascending: false })
            .limit(1)
            .single();

        // For now, we'll use SerpApi or manual entry
        // In production, you'd call SerpApi or Google Search Console API
        const currentPosition = await getCurrentRanking(keyword, targetUrl);

        // Determine trend
        const previousPosition = previousRanking?.position || null;
        let trend: SERPTrackingResult['trend'] = 'stable';
        let change: number | null = null;

        if (currentPosition === null && previousPosition === null) {
            trend = 'stable';
        } else if (currentPosition === null && previousPosition !== null) {
            trend = 'lost';
            change = -100; // Fell out of top 100
        } else if (currentPosition !== null && previousPosition === null) {
            trend = 'new';
            change = currentPosition;
        } else if (currentPosition !== null && previousPosition !== null) {
            change = previousPosition - currentPosition; // Positive = moved up
            if (change > 0) {
                trend = 'up';
            } else if (change < 0) {
                trend = 'down';
            } else {
                trend = 'stable';
            }
        }

        // Save to database
        const { error: insertError } = await supabase
            .from('serp_tracking')
            .insert({
                keyword: keyword.toLowerCase(),
                position: currentPosition,
                url: targetUrl || process.env.NEXT_PUBLIC_APP_URL,
                tracked_at: new Date().toISOString()
            });

        if (insertError) {
            logger.error('Failed to save SERP tracking data', insertError);
        }

        return {
            keyword,
            currentRanking: currentPosition,
            previousRanking: previousPosition,
            change,
            trend,
            trackedAt: new Date().toISOString()
        };

    } catch (error) {
        logger.error('Error tracking keyword ranking', error, { keyword });
        throw error;
    }
}

/**
 * Get current ranking for a keyword
 * 
 * Options:
 * 1. Use SerpApi (paid, accurate)
 * 2. Use Google Search Console API (free, but only for your domain)
 * 3. Use cached data
 * 4. Manual entry (for now)
 */
async function getCurrentRanking(keyword: string, targetUrl?: string): Promise<number | null> {
    const url = targetUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://investingpro.in';

    // Option 1: Use SerpApi if configured
    if (process.env.SERPAPI_API_KEY) {
        try {
            return await getRankingViaSerpApi(keyword, url);
        } catch (error) {
            logger.warn('SerpApi failed, falling back to manual', error);
        }
    }

    // Option 2: Use Google Search Console API (if configured)
    if (process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_ID) {
        try {
            return await getRankingViaGSC(keyword, url);
        } catch (error) {
            logger.warn('Google Search Console failed', error);
        }
    }

    // Option 3: Return null (manual tracking required)
    logger.info('No SERP tracking API configured, using manual tracking', { keyword });
    return null;
}

/**
 * Get ranking via SerpApi
 */
async function getRankingViaSerpApi(keyword: string, targetUrl: string): Promise<number | null> {
    const apiKey = process.env.SERPAPI_API_KEY!;
    const url = `https://serpapi.com/search.json?api_key=${apiKey}&q=${encodeURIComponent(keyword)}&location=India&google_domain=google.co.in&num=100`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.organic_results) {
            for (let i = 0; i < data.organic_results.length; i++) {
                const result = data.organic_results[i];
                if (result.link && result.link.includes(new URL(targetUrl).hostname)) {
                    return i + 1; // Position (1-indexed)
                }
            }
        }

        return null; // Not in top 100
    } catch (error) {
        logger.error('SerpApi error', error);
        throw error;
    }
}

/**
 * Get ranking via Google Search Console API
 * Note: This only works for your own domain and requires OAuth setup
 */
async function getRankingViaGSC(keyword: string, targetUrl: string): Promise<number | null> {
    // TODO: Implement Google Search Console API integration
    // This requires OAuth 2.0 setup and is more complex
    logger.warn('Google Search Console API not yet implemented');
    return null;
}

/**
 * Track multiple keywords
 */
export async function trackMultipleKeywords(
    keywords: string[],
    targetUrl?: string
): Promise<SERPTrackingResult[]> {
    const results: SERPTrackingResult[] = [];

    for (const keyword of keywords) {
        try {
            const result = await trackKeywordRanking(keyword, targetUrl);
            results.push(result);
            
            // Rate limiting (1 second between requests)
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            logger.error('Failed to track keyword', error, { keyword });
            results.push({
                keyword,
                currentRanking: null,
                previousRanking: null,
                change: null,
                trend: 'stable',
                trackedAt: new Date().toISOString()
            });
        }
    }

    return results;
}

/**
 * Get ranking history for a keyword
 */
export async function getRankingHistory(
    keyword: string,
    days: number = 30
): Promise<KeywordRanking[]> {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data, error } = await supabase
            .from('serp_tracking')
            .select('keyword, position, url, tracked_at')
            .eq('keyword', keyword.toLowerCase())
            .gte('tracked_at', startDate.toISOString())
            .order('tracked_at', { ascending: true });

        if (error) {
            throw error;
        }

        const rankings: KeywordRanking[] = (data || []).map((row, index, array) => {
            const previousRow = index > 0 ? array[index - 1] : null;
            const change = previousRow && previousRow.position && row.position
                ? previousRow.position - row.position
                : undefined;

            return {
                keyword: row.keyword,
                position: row.position,
                url: row.url,
                date: row.tracked_at,
                change
            };
        });

        return rankings;

    } catch (error) {
        logger.error('Error getting ranking history', error, { keyword });
        throw error;
    }
}

/**
 * Get all tracked keywords with current rankings
 */
export async function getAllTrackedKeywords(): Promise<Array<{
    keyword: string;
    currentPosition: number | null;
    previousPosition: number | null;
    change: number | null;
    trend: string;
    lastTracked: string;
}>> {
    try {
        // Get latest ranking for each keyword
        const { data, error } = await supabase
            .from('serp_tracking')
            .select('keyword, position, tracked_at')
            .order('tracked_at', { ascending: false });

        if (error) {
            throw error;
        }

        // Group by keyword and get latest + previous
        const keywordMap = new Map<string, { current: number | null; previous: number | null; date: string }>();

        data?.forEach(row => {
            const keyword = row.keyword.toLowerCase();
            
            if (!keywordMap.has(keyword)) {
                keywordMap.set(keyword, {
                    current: row.position,
                    previous: null,
                    date: row.tracked_at
                });
            } else {
                const existing = keywordMap.get(keyword)!;
                if (existing.previous === null && existing.current !== row.position) {
                    existing.previous = row.position;
                }
            }
        });

        // Convert to array
        const results = Array.from(keywordMap.entries()).map(([keyword, data]) => {
            const change = data.current !== null && data.previous !== null
                ? data.previous - data.current
                : null;

            let trend = 'stable';
            if (change !== null) {
                if (change > 0) trend = 'up';
                else if (change < 0) trend = 'down';
            } else if (data.current !== null && data.previous === null) {
                trend = 'new';
            } else if (data.current === null && data.previous !== null) {
                trend = 'lost';
            }

            return {
                keyword,
                currentPosition: data.current,
                previousPosition: data.previous,
                change,
                trend,
                lastTracked: data.date
            };
        });

        return results;

    } catch (error) {
        logger.error('Error getting all tracked keywords', error);
        throw error;
    }
}
