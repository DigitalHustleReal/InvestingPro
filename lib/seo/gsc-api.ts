/**
 * Google Search Console API Integration
 * 
 * Free API for tracking keyword rankings on your own domain
 * Requires OAuth 2.0 setup with Google Cloud Console
 * 
 * Documentation: https://developers.google.com/webmaster-tools/search-console-api-original/v1
 */

import { logger } from '@/lib/logger';

export interface GSCRankingData {
    keyword: string;
    position: number | null; // Average position
    clicks: number;
    impressions: number;
    ctr: number; // Click-through rate
    date: string;
    page?: string; // URL of the page ranking
}

/**
 * Get rankings from Google Search Console API
 * 
 * Requires:
 * - GOOGLE_SEARCH_CONSOLE_CLIENT_ID
 * - GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET
 * - GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN (from OAuth flow)
 * - GOOGLE_SEARCH_CONSOLE_SITE_URL (e.g., https://investingpro.in)
 */
export async function getGSCRankings(
    keywords: string[],
    startDate?: Date,
    endDate?: Date
): Promise<GSCRankingData[]> {
    const clientId = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN;
    const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;

    if (!clientId || !clientSecret || !refreshToken || !siteUrl) {
        logger.warn('Google Search Console API credentials not configured');
        return [];
    }

    try {
        // Step 1: Get access token from refresh token
        const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);
        if (!accessToken) {
            logger.error('Failed to get GSC access token');
            return [];
        }

        // Step 2: Fetch search analytics data
        const end = endDate || new Date();
        const start = startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // Last 90 days

        const rankings: GSCRankingData[] = [];

        // GSC API returns data for queries, we need to filter for our keywords
        const response = await fetch(
            `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    startDate: start.toISOString().split('T')[0],
                    endDate: end.toISOString().split('T')[0],
                    dimensions: ['query', 'page'],
                    rowLimit: 10000
                })
            }
        );

        if (!response.ok) {
            const error = await response.text();
            logger.error('GSC API error', new Error(error));
            return [];
        }

        const data = await response.json();

        if (data.rows) {
            // Filter for our target keywords
            const keywordLower = keywords.map(k => k.toLowerCase());
            
            for (const row of data.rows) {
                const query = row.keys[0]?.toLowerCase() || '';
                const page = row.keys[1] || '';
                
                // Check if this query matches any of our keywords
                const matchingKeyword = keywordLower.find(k => 
                    query.includes(k) || k.includes(query)
                );
                
                if (matchingKeyword) {
                    rankings.push({
                        keyword: matchingKeyword,
                        position: Math.round(row.position || 0) || null,
                        clicks: row.clicks || 0,
                        impressions: row.impressions || 0,
                        ctr: row.ctr || 0,
                        date: end.toISOString().split('T')[0],
                        page: page
                    });
                }
            }
        }

        return rankings;

    } catch (error) {
        logger.error('GSC API integration error', error as Error);
        return [];
    }
}

/**
 * Get access token from refresh token
 */
async function getAccessToken(
    clientId: string,
    clientSecret: string,
    refreshToken: string
): Promise<string | null> {
    try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
            })
        });

        if (!response.ok) {
            const error = await response.text();
            logger.error('Failed to refresh GSC token', new Error(error));
            return null;
        }

        const data = await response.json();
        return data.access_token || null;

    } catch (error) {
        logger.error('GSC token refresh error', error as Error);
        return null;
    }
}

/**
 * Sync GSC rankings to database
 */
export async function syncGSCRankingsToDatabase(
    keywords: string[]
): Promise<void> {
    try {
        const rankings = await getGSCRankings(keywords);
        
        // Import supabase client
        const { createClient } = await import('@supabase/supabase-js');
        const { env } = await import('@/lib/env');
        const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

        // Save rankings to database
        for (const ranking of rankings) {
            await supabase
                .from('serp_tracking')
                .upsert({
                    keyword: ranking.keyword.toLowerCase(),
                    position: ranking.position,
                    url: ranking.page || process.env.NEXT_PUBLIC_APP_URL,
                    tracked_at: ranking.date
                }, {
                    onConflict: 'keyword,tracked_at'
                });
        }

        logger.info(`Synced ${rankings.length} GSC rankings to database`);

    } catch (error) {
        logger.error('Failed to sync GSC rankings', error as Error);
        throw error;
    }
}
