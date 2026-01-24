/**
 * Rate Limiting Middleware
 * Uses Upstash Redis for distributed rate limiting
 * 
 * SECURITY: Fail-closed mode - blocks requests when Redis unavailable
 * This prevents abuse during infrastructure issues
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

// Configuration for fail-closed behavior
export interface RateLimitConfig {
    failClosed?: boolean; // If true, block requests when Redis unavailable (default: true in production)
    allowedWithoutRedis?: number; // Requests allowed per minute when Redis down (emergency fallback)
}

// In-memory fallback counter for emergency situations
const emergencyFallback: Map<string, { count: number; resetAt: number }> = new Map();
const EMERGENCY_LIMIT = 10; // Very restrictive when Redis is down
const EMERGENCY_WINDOW_MS = 60000; // 1 minute

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
 * Check emergency fallback rate limit (in-memory, very restrictive)
 */
function checkEmergencyFallback(identifier: string): { success: boolean; remaining: number } {
    const now = Date.now();
    const entry = emergencyFallback.get(identifier);
    
    // Reset if window expired
    if (!entry || now > entry.resetAt) {
        emergencyFallback.set(identifier, { count: 1, resetAt: now + EMERGENCY_WINDOW_MS });
        return { success: true, remaining: EMERGENCY_LIMIT - 1 };
    }
    
    // Increment and check
    entry.count++;
    const remaining = Math.max(0, EMERGENCY_LIMIT - entry.count);
    
    if (entry.count > EMERGENCY_LIMIT) {
        return { success: false, remaining: 0 };
    }
    
    return { success: true, remaining };
}

/**
 * Rate limit middleware
 * 
 * SECURITY: Fail-closed by default in production
 * When Redis is unavailable:
 * - Production: Use emergency fallback (very restrictive)
 * - Development: Allow requests with warning
 */
export async function rateLimit(
    request: NextRequest,
    type: 'public' | 'authenticated' | 'admin' | 'ai' = 'public',
    config: RateLimitConfig = {}
): Promise<{ success: boolean; limit: number; remaining: number; reset: number } | null> {
    const isProduction = process.env.NODE_ENV === 'production';
    const failClosed = config.failClosed ?? isProduction; // Default to fail-closed in production
    
    // Check if Redis is available
    const redisAvailable = Ratelimit && getRedis();
    
    // Handle Redis unavailable
    if (!redisAvailable) {
        if (failClosed) {
            // FAIL-CLOSED: Use emergency in-memory fallback
            const identifier = getIdentifier(request);
            const fallbackResult = checkEmergencyFallback(identifier);
            
            logger.warn('Rate limiting using emergency fallback - Redis unavailable', {
                identifier,
                type,
                success: fallbackResult.success,
            });
            
            return {
                success: fallbackResult.success,
                limit: EMERGENCY_LIMIT,
                remaining: fallbackResult.remaining,
                reset: Date.now() + EMERGENCY_WINDOW_MS,
            };
        } else {
            // Development: Allow with warning
            logger.debug('Rate limiting skipped - Upstash packages not installed or Redis not configured');
            return null;
        }
    }

    try {
        const identifier = getIdentifier(request);
        const limiter = getRateLimiter(type);

        if (!limiter) {
            // If limiter creation failed but Redis is configured, fail-closed
            if (failClosed) {
                logger.error('Rate limiter creation failed - blocking request');
                return {
                    success: false,
                    limit: 0,
                    remaining: 0,
                    reset: Date.now() + 60000,
                };
            }
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
        
        if (failClosed) {
            // FAIL-CLOSED: Block request on error
            const identifier = getIdentifier(request);
            const fallbackResult = checkEmergencyFallback(identifier);
            
            logger.warn('Rate limiting error - using emergency fallback', { identifier, type });
            
            return {
                success: fallbackResult.success,
                limit: EMERGENCY_LIMIT,
                remaining: fallbackResult.remaining,
                reset: Date.now() + EMERGENCY_WINDOW_MS,
            };
        }
        
        // Development: Allow request on error
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
