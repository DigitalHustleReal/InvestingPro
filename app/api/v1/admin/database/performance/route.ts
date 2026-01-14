/**
 * Database Performance Dashboard API
 * 
 * Returns database performance metrics for admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { databaseMonitor } from '@/lib/monitoring/database-monitor';
import { withErrorHandler } from '@/lib/errors/handler';
import { withTracing } from '@/lib/middleware/tracing';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = withErrorHandler(
    withTracing(async (request: NextRequest) => {
        try {
            const summary = await databaseMonitor.getPerformanceSummary();

            return NextResponse.json({
                success: true,
                data: summary,
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            logger.error('Failed to get database performance summary', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }, 'database-performance')
);
