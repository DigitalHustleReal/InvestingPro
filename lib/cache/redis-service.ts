/**
 * Upstash Redis Service
 * 
 * Free tier: 10,000 commands/day
 * Use for: API caching, rate limiting, session storage
 * 
 * Setup:
 * 1. Create account at upstash.com
 * 2. Create a Redis database
 * 3. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env.local
 */

import { Redis } from '@upstash/redis';

// Initialize Redis client (works in Edge, Serverless, and Node.js)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const isConfigured = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

/**
 * Cache a value with optional TTL
 */
export async function cacheSet<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
  if (!isConfigured) {
    console.warn('[REDIS] Not configured, skipping cache set');
    return false;
  }

  try {
    if (ttlSeconds) {
      await redis.setex(key, ttlSeconds, JSON.stringify(value));
    } else {
      await redis.set(key, JSON.stringify(value));
    }
    return true;
  } catch (error) {
    console.error('[REDIS] Cache set error:', error);
    return false;
  }
}

/**
 * Get a cached value
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!isConfigured) {
    return null;
  }

  try {
    const data = await redis.get(key);
    if (data === null) return null;
    return typeof data === 'string' ? JSON.parse(data) : data as T;
  } catch (error) {
    console.error('[REDIS] Cache get error:', error);
    return null;
  }
}

/**
 * Delete a cached value
 */
export async function cacheDelete(key: string): Promise<boolean> {
  if (!isConfigured) return false;

  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('[REDIS] Cache delete error:', error);
    return false;
  }
}

/**
 * Rate limiting - check if request is allowed
 */
export async function rateLimit(
  identifier: string,
  limit: number = 10,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  if (!isConfigured) {
    return { allowed: true, remaining: limit, reset: 0 };
  }

  const key = `ratelimit:${identifier}`;
  
  try {
    const current = await redis.incr(key);
    
    if (current === 1) {
      // First request in window, set expiry
      await redis.expire(key, windowSeconds);
    }

    const ttl = await redis.ttl(key);
    
    return {
      allowed: current <= limit,
      remaining: Math.max(0, limit - current),
      reset: ttl > 0 ? Date.now() + (ttl * 1000) : Date.now() + (windowSeconds * 1000),
    };
  } catch (error) {
    console.error('[REDIS] Rate limit error:', error);
    return { allowed: true, remaining: limit, reset: 0 };
  }
}

/**
 * Cache-aside pattern helper
 */
export async function cachedFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = 300 // 5 minutes default
): Promise<T> {
  // Try cache first
  const cached = await cacheGet<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetchFn();
  
  // Cache for next time (don't await, fire and forget)
  cacheSet(key, data, ttlSeconds);
  
  return data;
}

/**
 * Invalidate cache by pattern (e.g., all article caches)
 */
export async function invalidatePattern(pattern: string): Promise<number> {
  if (!isConfigured) return 0;

  try {
    const keys = await redis.keys(pattern);
    if (keys.length === 0) return 0;
    
    await redis.del(...keys);
    return keys.length;
  } catch (error) {
    console.error('[REDIS] Invalidate pattern error:', error);
    return 0;
  }
}

export default {
  cacheSet,
  cacheGet,
  cacheDelete,
  rateLimit,
  cachedFetch,
  invalidatePattern,
  client: redis,
  isConfigured,
};
