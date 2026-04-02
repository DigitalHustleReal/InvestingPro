/**
 * Cache Service
 * Centralized caching layer using Upstash Redis
 * 
 * Provides:
 * - API response caching
 * - Database query caching
 * - Cache invalidation
 * - Cache monitoring
 * 
 * SERVER-ONLY: Uses server-only metrics and Redis
 */
import 'server-only'; // Mark as server-only module

import { Redis } from '@upstash/redis';
import { logger } from '@/lib/logger';
import { cacheMonitor } from './cache-monitor';
// Lazy import prometheus metrics to avoid server/client boundary issues
// import { recordCacheHit, recordCacheMiss } from '@/lib/metrics/prometheus';

// Initialize Redis client
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
  force?: boolean; // Force cache refresh
  staleWhileRevalidate?: number; // Serve stale content while revalidating (seconds)
}

// In-memory mutex for stampede protection
const inFlightRequests: Map<string, Promise<any>> = new Map();

export class CacheService {
  private static instance: CacheService;
  private redis: Redis | null;
  private enabled: boolean;

  private constructor() {
    this.redis = redis;
    this.enabled = !!redis;
    
    if (!this.enabled) {
      logger.warn('Cache service disabled - Redis not configured');
    }
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string, category: string = 'default'): Promise<T | null> {
    if (!this.enabled || !this.redis) {
      cacheMonitor.recordMiss(key, category);
      return null;
    }

    try {
      const value = await this.redis.get<T>(key);
      if (value !== null) {
        cacheMonitor.recordHit(key, category);
        // Record Prometheus metric
        if (typeof window === 'undefined') {
          try {
            // Lazy import to avoid server/client boundary issues
            try {
                if (typeof window === 'undefined') {
                    const { recordCacheHit } = await import('@/lib/metrics/prometheus');
                    recordCacheHit(category);
                }
            } catch {
                // Metrics not available - skip silently
            }
          } catch (e) {
            // Ignore metrics errors
          }
        }
      } else {
        cacheMonitor.recordMiss(key, category);
        // Record Prometheus metric
        if (typeof window === 'undefined') {
          try {
            // Lazy import to avoid server/client boundary issues
            try {
                if (typeof window === 'undefined') {
                    const { recordCacheMiss } = await import('@/lib/metrics/prometheus');
                    recordCacheMiss(category);
                }
            } catch {
                // Metrics not available - skip silently
            }
          } catch (e) {
            // Ignore metrics errors
          }
        }
      }
      return value;
    } catch (error) {
      logger.error('Cache get error', error instanceof Error ? error : new Error(String(error)), { key });
      cacheMonitor.recordMiss(key, category);
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, options?: CacheOptions): Promise<boolean> {
    if (!this.enabled || !this.redis) {
      return false;
    }

    try {
      const ttl = options?.ttl || 3600; // Default 1 hour
      
      if (options?.tags && options.tags.length > 0) {
        // Store tags for invalidation
        await this.redis.sadd(`cache:tags:${key}`, ...(options.tags as [string, ...string[]]));
      }

      await this.redis.setex(key, ttl, value);
      cacheMonitor.recordSet(key, options?.tags?.[0] || 'default');
      return true;
    } catch (error) {
      logger.error('Cache set error', error instanceof Error ? error : new Error(String(error)), { key });
      return false;
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string, category: string = 'default'): Promise<boolean> {
    if (!this.enabled || !this.redis) {
      return false;
    }

    try {
      await this.redis.del(key);
      cacheMonitor.recordDelete(key, category);
      return true;
    } catch (error) {
      logger.error('Cache delete error', error instanceof Error ? error : new Error(String(error)), { key });
      return false;
    }
  }

  /**
   * Invalidate cache by tag
   */
  async invalidateTag(tag: string): Promise<number> {
    if (!this.enabled || !this.redis) {
      return 0;
    }

    try {
      // Get all keys with this tag
      const pattern = `cache:tags:*`;
      const keys = await this.redis.keys(pattern);
      
      let invalidated = 0;
      for (const tagKey of keys) {
        const hasTag = await this.redis.sismember(tagKey, tag);
        if (hasTag) {
          const cacheKey = tagKey.replace('cache:tags:', '');
          await this.delete(cacheKey);
          await this.redis.del(tagKey);
          invalidated++;
        }
      }

      return invalidated;
    } catch (error) {
      logger.error('Cache tag invalidation error', error instanceof Error ? error : new Error(String(error)), { tag });
      return 0;
    }
  }

  /**
   * Invalidate multiple tags
   */
  async invalidateTags(tags: string[]): Promise<number> {
    let total = 0;
    for (const tag of tags) {
      total += await this.invalidateTag(tag);
    }
    return total;
  }

  /**
   * Get or set with cache (with stampede protection)
   * 
   * Features:
   * - Mutex lock to prevent cache stampede
   * - Stale-while-revalidate support
   * - Only one request fetches data, others wait
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    const category = options?.tags?.[0] || 'default';
    
    // Check cache first (unless force refresh)
    if (!options?.force) {
      const cached = await this.get<T>(key, category);
      if (cached !== null) {
        // If stale-while-revalidate is enabled, check if we should refresh in background
        if (options?.staleWhileRevalidate) {
          this.maybeRevalidateInBackground(key, fetcher, options);
        }
        return cached;
      }
    }

    // Stampede protection: Check if another request is already fetching
    const inFlight = inFlightRequests.get(key);
    if (inFlight) {
      logger.debug('Cache stampede prevented - waiting for in-flight request', { key });
      return inFlight;
    }

    // Create the fetch promise with mutex
    const fetchPromise = this.fetchWithMutex(key, fetcher, options);
    
    // Store in-flight request
    inFlightRequests.set(key, fetchPromise);
    
    try {
      const value = await fetchPromise;
      return value;
    } finally {
      // Clean up in-flight request
      inFlightRequests.delete(key);
    }
  }

  /**
   * Fetch with mutex lock (for stampede protection)
   */
  private async fetchWithMutex<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    try {
      // Fetch fresh data
      const value = await fetcher();
      
      // Cache the result
      await this.set(key, value, options);
      
      // If stale-while-revalidate, also store the timestamp
      if (options?.staleWhileRevalidate && this.redis) {
        await this.redis.set(`${key}:fetched_at`, Date.now(), { ex: (options.ttl || 3600) + options.staleWhileRevalidate });
      }
      
      return value;
    } catch (error) {
      logger.error('Cache fetch error', error instanceof Error ? error : new Error(String(error)), { key });
      throw error;
    }
  }

  /**
   * Maybe revalidate in background (stale-while-revalidate)
   */
  private async maybeRevalidateInBackground<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions
  ): Promise<void> {
    if (!this.redis || !options.staleWhileRevalidate) return;
    
    try {
      const fetchedAt = await this.redis.get<number>(`${key}:fetched_at`);
      if (!fetchedAt) return;
      
      const age = Date.now() - fetchedAt;
      const ttlMs = (options.ttl || 3600) * 1000;
      
      // If past TTL but within stale window, revalidate in background
      if (age > ttlMs) {
        // Check if already revalidating
        if (inFlightRequests.has(key)) return;
        
        logger.debug('Stale-while-revalidate: refreshing in background', { key, age, ttl: ttlMs });
        
        // Fire and forget - don't await
        this.fetchWithMutex(key, fetcher, options).catch(err => {
          logger.warn('Background revalidation failed', err instanceof Error ? err : new Error(String(err)));
        });
      }
    } catch (error) {
      // Ignore errors in background revalidation check
    }
  }

  /**
   * Clear all cache (use with caution)
   */
  async clear(): Promise<boolean> {
    if (!this.enabled || !this.redis) {
      return false;
    }

    try {
      await this.redis.flushdb();
      return true;
    } catch (error) {
      logger.error('Cache clear error', error instanceof Error ? error : new Error(String(error)));
      return false;
    }
  }

  /**
   * Alias for clear() - for compatibility
   */
  async clearAll(): Promise<boolean> {
    return this.clear();
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    enabled: boolean;
    keys?: number;
  }> {
    if (!this.enabled || !this.redis) {
      return { enabled: false };
    }

    try {
      const keys = await this.redis.dbsize();
      return {
        enabled: true,
        keys,
      };
    } catch (error) {
      logger.error('Cache stats error', error instanceof Error ? error : new Error(String(error)));
      return { enabled: true };
    }
  }
}

// Export singleton instance
export const cacheService = CacheService.getInstance();

// Cache key generators
export const cacheKeys = {
  article: (id: string) => `article:${id}`,
  articleBySlug: (slug: string) => `article:slug:${slug}`,
  articles: (query: string) => `articles:${query}`,
  product: (type: string, id: string) => `product:${type}:${id}`,
  products: (type: string, query: string) => `products:${type}:${query}`,
  search: (query: string) => `search:${query}`,
  api: (endpoint: string, params?: string) => `api:${endpoint}${params ? `:${params}` : ''}`,
};

// Cache tags
export const cacheTags = {
  articles: 'articles',
  article: (id: string) => `article:${id}`,
  products: 'products',
  product: (type: string, id: string) => `product:${type}:${id}`,
};
