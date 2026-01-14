/**
 * API Metrics Middleware
 * Wraps API routes to automatically track metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { recordAPIMetrics, APIMetrics } from './metrics';
import { getCorrelationId, getRequestId, getUserId } from './request-context';
import { logger } from '@/lib/logger';

/**
 * Wrap API route handler with metrics tracking
 */
export function withMetrics<T extends (...args: any[]) => Promise<NextResponse>>(
    handler: T,
    routePath: string
): T {
    return (async (...args: Parameters<T>) => {
        const startTime = Date.now();
        const request = args[0] as NextRequest;
        
        let statusCode = 200;
        let error: string | undefined;

        try {
            const response = await handler(...args);
            statusCode = response.status;
            return response;
        } catch (err: any) {
            statusCode = err.status || 500;
            error = err.message || 'Unknown error';
            // Don't re-throw - let API wrapper handle it
            return NextResponse.json(
                { success: false, error: error },
                { status: statusCode }
            );
        } finally {
            const duration = Date.now() - startTime;
            
            const metrics: APIMetrics = {
                method: request.method,
                path: routePath,
                statusCode,
                duration,
                timestamp: new Date().toISOString(),
                correlationId: getCorrelationId(),
                userId: getUserId(),
                error,
            };

            recordAPIMetrics(metrics);
        }
    }) as T;
}

/**
 * Create metrics middleware for API routes
 */
export function createMetricsMiddleware(routePath: string) {
    return function metricsMiddleware(
        handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>
    ) {
        return withMetrics(handler, routePath);
    };
}
