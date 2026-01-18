import { NextRequest, NextResponse } from 'next/server';
import { syncGSCRankingsToDatabase } from '@/lib/seo/gsc-api';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * Cron job to sync Google Search Console rankings daily
 * 
 * Runs daily at 2 AM UTC
 * Syncs rankings for all published articles' primary keywords
 */
export async function GET(request: NextRequest) {
    // Verify cron secret (if configured)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const supabase = await createClient();

        // Get all primary keywords from published articles
        const { data: articles, error } = await supabase
            .from('articles')
            .select('primary_keyword')
            .not('primary_keyword', 'is', null)
            .eq('status', 'published');

        if (error) {
            logger.error('Failed to fetch articles for ranking sync', error);
            return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
        }

        const keywords = Array.from(
            new Set(
                (articles || [])
                    .map(a => a.primary_keyword)
                    .filter(Boolean) as string[]
            )
        );

        if (keywords.length === 0) {
            logger.info('No keywords to sync for rankings');
            return NextResponse.json({ 
                message: 'No keywords to sync',
                synced: 0
            });
        }

        logger.info(`Starting GSC rankings sync for ${keywords.length} keywords`);

        // Sync rankings
        await syncGSCRankingsToDatabase(keywords);

        logger.info(`Successfully synced ${keywords.length} keyword rankings from GSC`);

        return NextResponse.json({
            message: 'Rankings synced successfully',
            keywords: keywords.length,
            synced: keywords.length
        });

    } catch (error) {
        logger.error('Error in rankings sync cron job', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
