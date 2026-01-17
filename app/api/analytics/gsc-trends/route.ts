/**
 * Google Search Console Trends API
 * 
 * GET /api/analytics/gsc-trends
 * - Get trending queries from Google Search Console
 * - Analyze content opportunities
 * - Track keyword rankings
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { fetchGSCTrendingQueries, analyzeGSCOpportunities, getContentOpportunities } from '@/lib/analytics/gsc-trends';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/analytics/gsc-trends
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const action = searchParams.get('action') || 'trending'; // 'trending' | 'opportunities' | 'content-ideas'
        const days = parseInt(searchParams.get('days') || '30');
        const minImpressions = parseInt(searchParams.get('minImpressions') || '100');

        switch (action) {
            case 'trending':
                const trendingQueries = await fetchGSCTrendingQueries({ days, maxResults: 100 });
                return NextResponse.json({
                    success: true,
                    queries: trendingQueries,
                    count: trendingQueries.length
                });

            case 'opportunities':
                const opportunities = await analyzeGSCOpportunities({ days, minImpressions });
                return NextResponse.json({
                    success: true,
                    ...opportunities
                });

            case 'content-ideas':
                const contentIdeas = await getContentOpportunities({ days, minImpressions });
                return NextResponse.json({
                    success: true,
                    ideas: contentIdeas,
                    count: contentIdeas.length
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action. Use: trending, opportunities, or content-ideas' },
                    { status: 400 }
                );
        }
    } catch (error) {
        logger.error('Error fetching GSC trends', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
