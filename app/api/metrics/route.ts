/**
 * Prometheus Metrics Endpoint
 * Exposes metrics in Prometheus format for scraping
 * 
 * Access: GET /api/metrics
 * Format: Prometheus text format
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMetrics } from '@/lib/metrics/prometheus';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
    try {
        // Optional: Add basic auth or IP whitelist for production
        // For now, allow access (you can add auth later)
        
        const metrics = await getMetrics();
        
        return new NextResponse(metrics, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });
    } catch (error) {
        logger.error('Failed to get metrics', error as Error);
        return NextResponse.json(
            { error: 'Failed to retrieve metrics' },
            { status: 500 }
        );
    }
}
