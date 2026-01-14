/**
 * Check Cost Alerts Cron Job
 * 
 * GET/POST /api/cron/check-cost-alerts
 * 
 * Checks budget thresholds and triggers alerts
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkCostAlerts } from '@/lib/notifications/cost-alerts';
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
        logger.info('Checking cost alerts...');
        
        const alertsTriggered = await checkCostAlerts();
        
        return NextResponse.json({
            success: true,
            alerts_triggered: alertsTriggered,
            message: `Checked cost alerts, ${alertsTriggered} alerts triggered`,
        });
    } catch (error) {
        logger.error('Failed to check cost alerts', error as Error);
        
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
