/**
 * Cron Job Endpoint for Data Archival
 * 
 * This endpoint runs the archival script on a schedule.
 * Configure in Vercel cron jobs or similar.
 * 
 * Protected by CRON_SECRET environment variable
 */

import { NextRequest, NextResponse } from 'next/server';
import { runArchival } from '@/scripts/archive-old-data';
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
        logger.info('Starting scheduled archival job');

        const result = await runArchival();

        if (result.success) {
            logger.info('Archival job completed successfully', {
                summary: result.summary,
            });

            return NextResponse.json({
                success: true,
                message: 'Archival completed successfully',
                summary: result.summary,
                results: result.results.map(r => ({
                    table: r.table,
                    action: r.action,
                    count: r.count,
                    hasErrors: r.errors.length > 0,
                })),
            });
        } else {
            logger.error('Archival job completed with errors', {
                summary: result.summary,
                errors: result.results.flatMap(r => r.errors),
            });

            return NextResponse.json(
                {
                    success: false,
                    message: 'Archival completed with errors',
                    summary: result.summary,
                    results: result.results,
                },
                { status: 500 }
            );
        }
    } catch (error) {
        logger.error('Archival job failed', error instanceof Error ? error : new Error(String(error)));

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
