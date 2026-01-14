/**
 * Idempotency Middleware
 * Phase 1: Critical Security & Stability
 * 
 * Ensures duplicate requests return cached responses
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { getRedisClient } from '@/lib/cache/redis-client';

const IDEMPOTENCY_KEY_HEADER = 'Idempotency-Key';
const IDEMPOTENCY_TTL = 3600; // 1 hour

/**
 * Get idempotency key from request
 */
function getIdempotencyKey(request: NextRequest): string | null {
    return request.headers.get(IDEMPOTENCY_KEY_HEADER);
}

/**
 * Generate cache key for idempotency
 */
function getIdempotencyCacheKey(key: string, path: string): string {
    return `idempotency:${path}:${key}`;
}

/**
 * Wrapper for API route handlers with idempotency
 */
export function withIdempotency(
    handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>,
    options: {
        ttl?: number;
        methods?: string[];
    } = {}
) {
    const { ttl = IDEMPOTENCY_TTL, methods = ['POST', 'PUT', 'PATCH'] } = options;
    
    return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
        // Only apply to specified methods
        if (!methods.includes(request.method)) {
            return handler(request, ...args);
        }
        
        const idempotencyKey = getIdempotencyKey(request);
        
        // If no idempotency key, proceed normally
        if (!idempotencyKey) {
            return handler(request, ...args);
        }
        
        // Validate idempotency key format (UUID or similar)
        if (!/^[a-zA-Z0-9_-]{1,255}$/.test(idempotencyKey)) {
            return NextResponse.json(
                {
                    error: {
                        code: 'INVALID_IDEMPOTENCY_KEY',
                        message: 'Idempotency-Key must be 1-255 alphanumeric characters, hyphens, or underscores'
                    }
                },
                { status: 400 }
            );
        }
        
        const redis = getRedisClient();
        if (!redis) {
            // If Redis not available, log warning and proceed
            logger.warn('Redis not available for idempotency, proceeding without caching');
            return handler(request, ...args);
        }
        
        const cacheKey = getIdempotencyCacheKey(idempotencyKey, request.nextUrl.pathname);
        
        try {
            // Check for cached response
            const cached = await redis.get<string>(cacheKey);
            if (cached) {
                logger.info('Idempotent request - returning cached response', {
                    key: idempotencyKey,
                    path: request.nextUrl.pathname
                });
                
                const cachedResponse = JSON.parse(cached);
                const response = NextResponse.json(cachedResponse.body, {
                    status: cachedResponse.status,
                    headers: {
                        ...cachedResponse.headers,
                        'X-Idempotent-Replayed': 'true',
                        'X-Idempotency-Key': idempotencyKey
                    }
                });
                
                return response;
            }
            
            // Execute handler
            const response = await handler(request, ...args);
            
            // Cache successful responses (2xx, 3xx)
            if (response.status >= 200 && response.status < 400) {
                const responseBody = await response.clone().json().catch(() => null);
                
                if (responseBody) {
                    const cacheData = {
                        status: response.status,
                        headers: Object.fromEntries(response.headers.entries()),
                        body: responseBody
                    };
                    
                    await redis.setex(cacheKey, ttl, JSON.stringify(cacheData));
                    
                    logger.info('Cached idempotent response', {
                        key: idempotencyKey,
                        path: request.nextUrl.pathname,
                        ttl
                    });
                }
            }
            
            // Add idempotency headers
            response.headers.set('X-Idempotency-Key', idempotencyKey);
            
            return response;
            
        } catch (error) {
            logger.error('Idempotency check failed', error instanceof Error ? error : new Error(String(error)), {
                key: idempotencyKey,
                path: request.nextUrl.pathname
            });
            
            // Fail open - allow request if idempotency check fails
            return handler(request, ...args);
        }
    };
}

/**
 * Generate idempotency key (for client use)
 */
export function generateIdempotencyKey(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}
