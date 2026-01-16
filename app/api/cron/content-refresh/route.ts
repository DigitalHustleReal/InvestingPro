/**
 * Content Refresh Cron Job
 * Automatically refreshes old articles (>6 months) with updated data
 * 
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/content-refresh",
 *     "schedule": "0 2 * * 0" // Weekly on Sunday 2 AM
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { refreshOldArticles } from '@/lib/automation/content-refresh';
import { logger } from '@/lib/logger';

// Verify cron secret (for Vercel Cron Jobs)
function verifyCronSecret(request: NextRequest): boolean {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret) {
        return true; // Allow if no secret configured (for local development)
    }

    return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
    try {
        // Verify cron secret
        if (!verifyCronSecret(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        logger.info('Content refresh cron started');

        // Refresh old articles
        const result = await refreshOldArticles();

        return NextResponse.json({
            success: true,
            message: `Refreshed ${result.refreshed} article(s)`,
            refreshed: result.refreshed,
            skipped: result.skipped,
            failed: result.failed,
            results: result.results,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        logger.error('Error in content refresh cron', error);
        
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to refresh content',
                message: error.message
            },
            { status: 500 }
        );
    }
}
