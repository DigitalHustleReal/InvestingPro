/**
 * API Route Wrapper
 * Combines metrics, rate limiting, idempotency, and error handling
 * Production Safety: Now includes idempotency support
 */

import { NextRequest, NextResponse } from 'next/server';
import { withMetrics } from './api-metrics';
import { withRateLimit } from './rate-limit';
import { withIdempotency } from './idempotency';
import { logger } from '@/lib/logger';

export type RateLimitType = 'public' | 'authenticated' | 'admin' | 'ai';

export interface APIWrapperOptions {
    rateLimitType?: RateLimitType;
    requireAuth?: boolean;
    trackMetrics?: boolean;
    idempotent?: boolean; // NEW: Enable idempotency
    idempotencyTTL?: number; // NEW: Cache TTL in seconds (default: 3600)
}

/**
 * Wrap API route with metrics, rate limiting, idempotency, and error handling
 */
export function createAPIWrapper(
    routePath: string,
    options: APIWrapperOptions = {}
) {
    const {
        rateLimitType = 'public',
        requireAuth = false,
        trackMetrics = true,
        idempotent = false,
        idempotencyTTL = 3600, // 1 hour default
    } = options;

    return function wrapHandler(
        handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>
    ) {
        let wrappedHandler = handler;

        // Apply idempotency (innermost - closest to handler)
        if (idempotent) {
            wrappedHandler = withIdempotency(wrappedHandler, {
                ttl: idempotencyTTL,
                methods: ['POST', 'PUT', 'PATCH']
            });
        }

        // Apply rate limiting
        wrappedHandler = withRateLimit(wrappedHandler, rateLimitType);

        // Apply metrics tracking (outermost - tracks all attempts)
        if (trackMetrics) {
            wrappedHandler = withMetrics(wrappedHandler, routePath);
        }

        // Add error handling
        return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
            try {
                // TODO: Add auth check if requireAuth is true
                // if (requireAuth) {
                //     const user = await getAuthenticatedUser(request);
                //     if (!user) {
                //         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                //     }
                // }

                return await wrappedHandler(request, ...args);
            } catch (error: unknown) {
                logger.error('API route error', error instanceof Error ? error : new Error(String(error)), {
                    path: routePath,
                    method: request.method,
                });

                return NextResponse.json(
                    {
                        success: false,
                        error: error instanceof Error ? error.message : 'Internal server error',
                    },
                    { status: 500 }
                );
            }
        };
    };
}

/**
 * Example usage:
 * 
 * // Without idempotency
 * export const GET = createAPIWrapper('/api/articles/public', {
 *   rateLimitType: 'public',
 *   trackMetrics: true,
 * })(async (request: NextRequest) => {
 *   // Your handler code
 * });
 * 
 * // With idempotency (for critical operations)
 * export const POST = createAPIWrapper('/api/articles/generate', {
 *   rateLimitType: 'ai',
 *   trackMetrics: true,
 *   idempotent: true,
 *   idempotencyTTL: 86400, // 24 hours
 * })(async (request: NextRequest) => {
 *   // Your handler code - duplicate requests will return cached response
 * });
 */
