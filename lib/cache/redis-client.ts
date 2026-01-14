/**
 * Redis Cache Client
 * Provides caching layer using Upstash Redis
 */

import { Redis } from '@upstash/redis';
import { logger } from '@/lib/logger';

let redisClient: Redis | null = null;

/**
 * Get Redis client instance
 */
export function getRedisClient(): Redis | null {
  if (typeof window !== 'undefined') {
    // Redis is server-side only
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    logger.warn('Redis credentials not found. Caching disabled.');
    return null;
  }

  try {
    redisClient = new Redis({
      url,
      token,
    });
    logger.info('Redis client initialized');
    return redisClient;
  } catch (error) {
    logger.error('Failed to initialize Redis client', error instanceof Error ? error : new Error(String(error)));
    return null;
  }
}

/**
 * Cache interface
 */
export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
}

/**
 * Get value from cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client) {
    return null;
  }

  try {
    const value = await client.get<T>(key);
    return value;
  } catch (error) {
    logger.error('Cache get error', error instanceof Error ? error : new Error(String(error)), { key });
    return null;
  }
}

/**
 * Set value in cache
 */
export async function setCache<T>(
  key: string,
  value: T,
  options?: CacheOptions
): Promise<boolean> {
  const client = getRedisClient();
  if (!client) {
    return false;
  }

  try {
    const ttl = options?.ttl || 3600; // Default 1 hour
    
    if (options?.tags && options.tags.length > 0) {
      // Store tags for invalidation
      await Promise.all(
        options.tags.map(tag => 
          client.sadd(`cache:tag:${tag}`, key)
        )
      );
    }

    await client.setex(key, ttl, value);
    return true;
  } catch (error) {
    logger.error('Cache set error', error instanceof Error ? error : new Error(String(error)), { key });
    return false;
  }
}

/**
 * Delete value from cache
 */
export async function deleteCache(key: string): Promise<boolean> {
  const client = getRedisClient();
  if (!client) {
    return false;
  }

  try {
    await client.del(key);
    return true;
  } catch (error) {
    logger.error('Cache delete error', error instanceof Error ? error : new Error(String(error)), { key });
    return false;
  }
}

/**
 * Invalidate cache by tag
 */
export async function invalidateByTag(tag: string): Promise<number> {
  const client = getRedisClient();
  if (!client) {
    return 0;
  }

  try {
    const keys = await client.smembers<string[]>(`cache:tag:${tag}`);
    if (keys.length === 0) {
      return 0;
    }

    const deleted = await client.del(...keys);
    await client.del(`cache:tag:${tag}`);
    return deleted;
  } catch (error) {
    logger.error('Cache invalidation error', error instanceof Error ? error : new Error(String(error)), { tag });
    return 0;
  }
}

/**
 * Clear all cache (use with caution)
 */
export async function clearCache(): Promise<boolean> {
  const client = getRedisClient();
  if (!client) {
    return false;
  }

  try {
    await client.flushdb();
    logger.warn('Cache cleared');
    return true;
  } catch (error) {
    logger.error('Cache clear error', error instanceof Error ? error : new Error(String(error)));
    return false;
  }
}

/**
 * Generate cache key
 */
export function cacheKey(prefix: string, ...parts: (string | number)[]): string {
  return `${prefix}:${parts.join(':')}`;
}
