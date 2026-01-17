import { NextRequest, NextResponse } from 'next/server';
import { syncRankingsFromGSC, trackRanking } from '@/lib/analytics/rankings-tracker';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/analytics/rankings/sync
 * Sync rankings from Google Search Console (or manual tracking)
 */
export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            // Allow service role for cron jobs
            const authHeader = request.headers.get('authorization');
            const serviceKey = process.env.CRON_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
            
            if (!authHeader || !serviceKey || authHeader !== `Bearer ${serviceKey}`) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const body = await request.json();
        const { keywords, siteUrl, manualRankings } = body;

        let synced = 0;
        let errors = 0;

        // Option 1: Sync from GSC (if API configured)
        if (keywords && siteUrl && !manualRankings) {
            try {
                await syncRankingsFromGSC(keywords, siteUrl);
                synced = keywords.length;
            } catch (error) {
                logger.error('GSC sync failed', error as Error);
                errors++;
            }
        }

        // Option 2: Manual ranking tracking
        if (manualRankings && Array.isArray(manualRankings)) {
            for (const ranking of manualRankings) {
                try {
                    await trackRanking(
                        ranking.keyword,
                        ranking.position,
                        ranking.url,
                        ranking.dataSource || 'manual'
                    );
                    synced++;
                } catch (error) {
                    errors++;
                    logger.error('Failed to track ranking', error as Error, { ranking });
                }
            }
        }

        return NextResponse.json({
            success: true,
            synced,
            errors,
            syncedAt: new Date().toISOString()
        });

    } catch (error) {
        logger.error('Error syncing rankings', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/analytics/rankings/sync
 * Get sync status and configuration
 */
export async function GET(request: NextRequest) {
    try {
        const isConfigured = !!(
            process.env.GSC_API_KEY ||
            process.env.SERPAPI_API_KEY
        );

        return NextResponse.json({
            configured: isConfigured,
            providers: {
                gsc: !!process.env.GSC_API_KEY,
                serpapi: !!process.env.SERPAPI_API_KEY
            },
            siteUrl: process.env.GSC_SITE_URL || null
        });

    } catch (error) {
        logger.error('Error getting rankings sync status', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
