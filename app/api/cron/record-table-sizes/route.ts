/**
 * Cron Job Endpoint for Recording Table Sizes
 * 
 * Records table sizes daily for growth tracking
 * Protected by CRON_SECRET environment variable
 */

import { NextRequest, NextResponse } from 'next/server';
import { databaseMonitor } from '@/lib/monitoring/database-monitor';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        logger.warn('Unauthorized cron job attempt', {
            ip: request.headers.get('x-forwarded-for'),
        });
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        logger.info('Starting table size recording job');

        const tableSizes = await databaseMonitor.recordTableSizes();
        const tableGrowth = await databaseMonitor.getTableSizeGrowth();

        logger.info('Table size recording completed', {
            tablesRecorded: tableSizes.length,
            tablesWithGrowth: tableGrowth.length,
        });

        return NextResponse.json({
            success: true,
            message: 'Table sizes recorded successfully',
            tablesRecorded: tableSizes.length,
            tablesWithGrowth: tableGrowth.length,
            data: {
                tableSizes,
                tableGrowth,
            },
        });
    } catch (error) {
        logger.error('Table size recording failed', error instanceof Error ? error : new Error(String(error)));

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

// Also support POST for webhook-style triggers
export const POST = GET;
