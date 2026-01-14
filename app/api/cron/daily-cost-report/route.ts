/**
 * Daily Cost Report Cron Job
 * 
 * GET/POST /api/cron/daily-cost-report
 * 
 * Generates and sends daily cost report
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateDailyCostReport } from '@/lib/notifications/cost-alerts';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    return handleRequest(request);
}

export const POST = GET;

async function handleRequest(request: NextRequest) {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        logger.info('Generating daily cost report...');
        
        await generateDailyCostReport();
        
        return NextResponse.json({
            success: true,
            message: 'Daily cost report generated and sent',
        });
    } catch (error) {
        logger.error('Failed to generate daily cost report', error as Error);
        
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
