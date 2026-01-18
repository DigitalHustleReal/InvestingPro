import { NextRequest, NextResponse } from 'next/server';
import { checkDataChanges, processRefreshTriggers } from '@/lib/automation/auto-refresh-triggers';
import { logger } from '@/lib/logger';

/**
 * Cron job to check for data changes and trigger content refresh
 * 
 * Runs daily at 4 AM UTC (after RBI/AMFI sync)
 * Detects changes in:
 * - RBI policy rates
 * - AMFI NAV data
 * - Product data (credit cards, loans)
 */
export async function GET(request: NextRequest) {
    // Verify cron secret (if configured)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        logger.info('Starting data changes check');

        // Check for data changes
        const triggers = await checkDataChanges();

        if (triggers.length === 0) {
            logger.info('No data changes detected');
            return NextResponse.json({
                message: 'No data changes detected',
                triggers: 0,
                refreshed: 0
            });
        }

        logger.info(`Found ${triggers.length} data changes, processing refresh triggers`);

        // Process triggers and refresh articles
        const processed = await processRefreshTriggers(triggers);

        logger.info(`Data changes check complete`, {
            triggers: processed.processed,
            refreshed: processed.refreshed,
            failed: processed.failed
        });

        return NextResponse.json({
            message: 'Data changes check complete',
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
        logger.error('Error in data changes check cron job', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
