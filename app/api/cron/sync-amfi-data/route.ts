/**
 * Cron Job: Sync AMFI Mutual Fund Data
 * 
 * Runs daily to fetch and update AMFI NAV data
 * Called by Vercel Cron: /api/cron/sync-amfi-data
 * 
 * Schedule: Daily at 5 AM IST (11:30 PM UTC previous day)
 */

import { NextRequest, NextResponse } from 'next/server';
import { syncAMFIDataToDatabase } from '@/lib/data-sources/amfi-api';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/cron/sync-amfi-data
 * Syncs AMFI mutual fund data to database
 */
export async function GET(request: NextRequest) {
    try {
        // Verify cron secret (if set)
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;
        
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            logger.warn('Unauthorized AMFI sync attempt');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        logger.info('Starting AMFI data sync...');

        const result = await syncAMFIDataToDatabase();

        if (result.errors === 0 || result.synced > 0) {
            logger.info('AMFI data sync completed', result);
            return NextResponse.json({
                success: true,
                message: 'AMFI data synced',
                synced: result.synced,
                errors: result.errors,
                timestamp: new Date().toISOString()
            });
        } else {
            logger.error('AMFI sync failed completely');
            return NextResponse.json(
                { error: 'AMFI sync failed', ...result },
                { status: 500 }
            );
        }
    } catch (error) {
        logger.error('Error syncing AMFI data', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
