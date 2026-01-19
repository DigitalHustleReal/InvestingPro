/**
 * Rate Limiting Middleware
 * Uses Upstash Redis for distributed rate limiting
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

// Rate limiting using Upstash Redis
// Note: @upstash/ratelimit and @upstash/redis should be installed
// If not available, rate limiting will be skipped gracefully

let Ratelimit: any = null;
let Redis: any = null;

// Lazy load to avoid errors if packages not installed
try {
    const upstashRatelimit = require('@upstash/ratelimit');
    const upstashRedis = require('@upstash/redis');
    Ratelimit = upstashRatelimit.Ratelimit;
    Redis = upstashRedis.Redis;
} catch (e) {
    // Packages not installed - rate limiting will be disabled
    logger.debug('Rate limiting packages not installed. Install @upstash/ratelimit and @upstash/redis to enable.');
}

/**
 * Get Redis client
 */
function getRedis(): any {
    if (!Redis) return null;
    
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        return new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
    }
    return null;
}

// Rate limiters by endpoint type (lazy initialization)
const rateLimiters: Record<string, any> = {};

/**
 * Get rate limiter for endpoint type
 */
function getRateLimiter(type: 'public' | 'authenticated' | 'admin' | 'ai'): any {
    if (rateLimiters[type]) return rateLimiters[type];
    if (!Ratelimit) return null;

    const redis = getRedis();
    if (!redis) return null;

    const limits = {
        public: { limit: 100, window: '1 m' },
        authenticated: { limit: 1000, window: '1 m' },
        admin: { limit: 5000, window: '1 m' },
        ai: { limit: 100, window: '1 m' }, // Increased from 10 to 100 to prevent rapid failures
    };

    const config = limits[type];
    rateLimiters[type] = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(config.limit, config.window),
        analytics: true,
    });

    return rateLimiters[type];
}

/**
 * Get identifier for rate limiting (IP or user ID)
 */
function getIdentifier(request: NextRequest): string {
    // Try to get user ID from auth
    // For now, use IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    return ip;
}

/**
 * Rate limit middleware
 */
export async function rateLimit(
    request: NextRequest,
    type: 'public' | 'authenticated' | 'admin' | 'ai' = 'public'
): Promise<{ success: boolean; limit: number; remaining: number; reset: number } | null> {
    // Skip rate limiting if packages not installed or Redis not configured
    if (!Ratelimit || !getRedis()) {
        logger.debug('Rate limiting skipped - Upstash packages not installed or Redis not configured');
        return null;
    }

    try {
        const identifier = getIdentifier(request);
        const limiter = getRateLimiter(type);

        if (!limiter) {
            return null;
        }

        const result = await limiter.limit(identifier);

        // Log if rate limited
        if (!result.success) {
            logger.warn('Rate limit exceeded', {
                identifier,
                type,
                limit: result.limit,
                remaining: result.remaining,
            });
        }

        return {
            success: result.success,
            limit: result.limit,
            remaining: result.remaining,
            reset: result.reset,
        };
    } catch (error: unknown) {
        logger.error('Rate limit check failed', error instanceof Error ? error : new Error(String(error)));
        // Fail open - allow request if rate limiting fails
        return null;
    }
}

/**
 * Create rate limit middleware wrapper
 */
export function withRateLimit(
    handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>,
    type: 'public' | 'authenticated' | 'admin' | 'ai' = 'public'
) {
    return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
        const rateLimitResult = await rateLimit(request, type);

        if (rateLimitResult && !rateLimitResult.success) {
            const retryAfterSeconds = Math.ceil((rateLimitResult.reset - Date.now()) / 1000);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Rate limit exceeded. Please try again later.',
                    message: `Too many requests. Limit: ${rateLimitResult.limit} per minute. Retry after ${retryAfterSeconds} seconds.`,
                    retryAfter: rateLimitResult.reset,
                    limit: rateLimitResult.limit,
                    remaining: rateLimitResult.remaining,
                },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                        'X-RateLimit-Reset': rateLimitResult.reset.toString(),
                        'Retry-After': retryAfterSeconds.toString(),
                    },
                }
            );
        }

        // Add rate limit headers to response
        const response = await handler(request, ...args);
        
        if (rateLimitResult) {
            response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
            response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
            response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());
        }

        return response;
    };
}
