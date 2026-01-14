/**
 * API Route Wrapper
 * Combines metrics, rate limiting, and error handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { withMetrics } from './api-metrics';
import { withRateLimit } from './rate-limit';
import { logger } from '@/lib/logger';

export type RateLimitType = 'public' | 'authenticated' | 'admin' | 'ai';

export interface APIWrapperOptions {
    rateLimitType?: RateLimitType;
    requireAuth?: boolean;
    trackMetrics?: boolean;
}

/**
 * Wrap API route with metrics, rate limiting, and error handling
 */
export function createAPIWrapper(
    routePath: string,
    options: APIWrapperOptions = {}
) {
    const {
        rateLimitType = 'public',
        requireAuth = false,
        trackMetrics = true,
    } = options;

    return function wrapHandler(
        handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>
    ) {
        // Apply rate limiting
        let wrappedHandler = withRateLimit(handler, rateLimitType);

        // Apply metrics tracking (before rate limiting to track all attempts)
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
 * export const GET = createAPIWrapper('/api/articles/public', {
 *   rateLimitType: 'public',
 *   trackMetrics: true,
 * })(async (request: NextRequest) => {
 *   // Your handler code
 * });
 */
