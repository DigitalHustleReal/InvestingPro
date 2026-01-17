/**
 * Cron Job: Publish Scheduled Articles
 * 
 * Runs every 15 minutes to publish articles scheduled for that time
 * Called by Vercel Cron: /api/cron/publish-scheduled
 * 
 * Schedule: Every 15 minutes
 */

import { NextRequest, NextResponse } from 'next/server';
import { publishScheduledArticles } from '@/lib/automation/scheduler';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/cron/publish-scheduled
 * Publish scheduled articles that are due
 */
export async function GET(request: NextRequest) {
    try {
        // Verify cron secret (if set)
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;
        
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            logger.warn('Unauthorized scheduled publish attempt');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        logger.info('Starting scheduled articles publishing job...');

        const result = await publishScheduledArticles();

        if (result.errors.length > 0) {
            logger.warn('Scheduled publishing completed with errors', result);
        } else {
            logger.info('Scheduled publishing completed successfully', result);
        }

        return NextResponse.json({
            success: true,
            message: 'Scheduled articles publishing completed',
            ...result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Error publishing scheduled articles', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
