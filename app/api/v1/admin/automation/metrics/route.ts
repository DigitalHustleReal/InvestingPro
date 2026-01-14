/**
 * Automation Metrics API
 * Phase 1: Critical Security & Stability
 */

import { NextRequest, NextResponse } from 'next/server';
import { withApiVersioning } from '@/lib/middleware/api-versioning';
import { getAutomationMetrics } from '@/lib/automation/control-center';
import { logger } from '@/lib/logger';

export const GET = withApiVersioning(async (
    request: NextRequest,
    version: string
) => {
    try {
        const days = parseInt(request.nextUrl.searchParams.get('days') || '7');
        const metrics = await getAutomationMetrics(days);
        
        return NextResponse.json({
            metrics,
            period: `${days} days`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Failed to get automation metrics', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            {
                error: {
                    code: 'AUTOMATION_METRICS_ERROR',
                    message: 'Failed to get automation metrics'
                }
            },
            { status: 500 }
        );
    }
});
