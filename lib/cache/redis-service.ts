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
import { logger } from '@/lib/logger';

const isConfigured = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

// Lazy initialization - prevents errors during module load when env vars are missing
let _redis: Redis | null = null;

function getRedisClient(): Redis | null {
  if (!isConfigured) return null;
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return _redis;
}

/**
 * Cache a value with optional TTL
 */
export async function cacheSet<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
  const client = getRedisClient();
  if (!client) {
    // Silently skip when not configured
    return false;
  }

  try {
    if (ttlSeconds) {
      await client.setex(key, ttlSeconds, JSON.stringify(value));
    } else {
      await client.set(key, JSON.stringify(value));
    }
    return true;
  } catch (error) {
    logger.error('[REDIS] Cache set error:', error);
    return false;
  }
}

/**
 * Get a cached value
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client) {
    return null;
  }

  try {
    const data = await client.get(key);
    if (data === null) return null;
    return typeof data === 'string' ? JSON.parse(data) : data as T;
  } catch (error) {
    logger.error('[REDIS] Cache get error:', error);
    return null;
  }
}

/**
 * Delete a cached value
 */
export async function cacheDelete(key: string): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.del(key);
    return true;
  } catch (error) {
    logger.error('[REDIS] Cache delete error:', error);
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
  const client = getRedisClient();
  if (!client) {
    return { allowed: true, remaining: limit, reset: 0 };
  }

  const key = `ratelimit:${identifier}`;
  
  try {
    const current = await client.incr(key);
    
    if (current === 1) {
      // First request in window, set expiry
      await client.expire(key, windowSeconds);
    }

    const ttl = await client.ttl(key);
    
    return {
      allowed: current <= limit,
      remaining: Math.max(0, limit - current),
      reset: ttl > 0 ? Date.now() + (ttl * 1000) : Date.now() + (windowSeconds * 1000),
    };
  } catch (error) {
    logger.error('[REDIS] Rate limit error:', error);
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
  const client = getRedisClient();
  if (!client) return 0;

  try {
    const keys = await client.keys(pattern);
    if (keys.length === 0) return 0;
    
    await client.del(...keys);
    return keys.length;
  } catch (error) {
    logger.error('[REDIS] Invalidate pattern error:', error);
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
  get client() { return getRedisClient(); },
  isConfigured,
};
