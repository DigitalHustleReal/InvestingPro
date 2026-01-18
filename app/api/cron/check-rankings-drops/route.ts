import { NextRequest, NextResponse } from 'next/server';
import { checkRankingDrops, processRefreshTriggers } from '@/lib/automation/auto-refresh-triggers';
import { logger } from '@/lib/logger';

/**
 * Cron job to check for ranking drops and trigger content refresh
 * 
 * Runs daily at 3 AM UTC (after rankings sync at 2 AM)
 * Detects articles with ranking drops >3 positions
 */
export async function GET(request: NextRequest) {
    // Verify cron secret (if configured)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        logger.info('Starting ranking drops check');

        // Check for ranking drops
        const triggers = await checkRankingDrops();

        if (triggers.length === 0) {
            logger.info('No ranking drops detected');
            return NextResponse.json({
                message: 'No ranking drops detected',
                triggers: 0,
                refreshed: 0
            });
        }

        logger.info(`Found ${triggers.length} ranking drops, processing refresh triggers`);

        // Process triggers and refresh articles
        const processed = await processRefreshTriggers(triggers);

        logger.info(`Ranking drops check complete`, {
            triggers: processed.processed,
            refreshed: processed.refreshed,
            failed: processed.failed
        });

        return NextResponse.json({
            message: 'Ranking drops check complete',
            triggers: processed.processed,
            refreshed: processed.refreshed,
            failed: processed.failed,
            results: processed.results.map(r => ({
                articleId: r.articleId,
                articleTitle: r.articleTitle,
                triggerType: r.triggerType,
                reason: r.reason,
                severity: r.severity,
                refreshed: r.refreshResult?.refreshed || false
            }))
        });

    } catch (error) {
        logger.error('Error in ranking drops check cron job', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
