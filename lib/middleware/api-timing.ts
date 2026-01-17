/**
 * API Timing Middleware
 * 
 * Tracks API response times and logs slow endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

const SLOW_THRESHOLD_MS = 2000; // 2 seconds
const VERY_SLOW_THRESHOLD_MS = 5000; // 5 seconds

interface TimingInfo {
    method: string;
    path: string;
    duration: number;
    status: number;
    timestamp: number;
}

/**
 * Send timing metric to analytics endpoint
 */
async function sendTimingMetric(info: TimingInfo) {
    try {
        await fetch('/api/analytics/api-timing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(info),
        }).catch(() => {
            // Silent fail - don't block API response
        });
    } catch (error) {
        // Silent fail
    }
}

/**
 * API timing middleware
 * Wraps a Next.js API route handler to track response times
 */
export function withTiming(
    handler: (request: NextRequest, context: any) => Promise<Response>,
    routeName?: string
) {
    return async (request: NextRequest, context: any): Promise<Response> => {
        const startTime = Date.now();
        const method = request.method;
        const path = routeName || request.nextUrl.pathname;

        try {
            // Execute handler
            const response = await handler(request, context);

            // Calculate duration
            const duration = Date.now() - startTime;
            const status = response.status;

            // Create timing info
            const timingInfo: TimingInfo = {
                method,
                path,
                duration,
                status,
                timestamp: startTime,
            };

            // Log slow endpoints
            if (duration >= VERY_SLOW_THRESHOLD_MS) {
                logger.error('VERY SLOW API endpoint', new Error(`Very slow endpoint: ${method} ${path}`), {
                    duration,
                    status,
                    threshold: VERY_SLOW_THRESHOLD_MS,
                });
            } else if (duration >= SLOW_THRESHOLD_MS) {
                logger.warn('Slow API endpoint', {
                    method,
                    path,
                    duration,
                    status,
                    threshold: SLOW_THRESHOLD_MS,
                });
            }

            // Send timing metric (async, don't block response)
            sendTimingMetric(timingInfo).catch(() => {
                // Silent fail
            });

            // Add timing header for debugging
            response.headers.set('X-Response-Time', `${duration}ms`);

            return response;
        } catch (error) {
            const duration = Date.now() - startTime;
            const status = 500;

            // Log error timing
            logger.error('API endpoint error', error as Error, {
                method,
                path,
                duration,
            });

            // Send timing metric even for errors
            sendTimingMetric({
                method,
                path,
                duration,
                status,
                timestamp: startTime,
            }).catch(() => {
                // Silent fail
            });

            // Re-throw error
            throw error;
        }
    };
}

/**
 * Track timing for a specific operation
 */
export function trackTiming<T>(
    operationName: string,
    operation: () => Promise<T>
): Promise<T> {
    const startTime = Date.now();
    return operation().then(
        (result) => {
            const duration = Date.now() - startTime;
            if (duration >= SLOW_THRESHOLD_MS) {
                logger.warn('Slow operation', {
                    operation: operationName,
                    duration,
                });
            }
            return result;
        },
        (error) => {
            const duration = Date.now() - startTime;
            logger.error('Operation error', error as Error, {
                operation: operationName,
                duration,
            });
            throw error;
        }
    );
}
