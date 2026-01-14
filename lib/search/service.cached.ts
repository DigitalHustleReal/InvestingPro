/**
 * Cached Search Service
 * Adds Redis caching layer to search service
 */
import { searchService, type SearchResponse, type SearchOptions } from './service';
import { cacheService, cacheKeys, cacheTags } from '@/lib/cache';
import { logger } from '@/lib/logger';
import { withPerformanceTracking } from '@/lib/performance/performance-monitor';

const CACHE_TTL = 300; // 5 minutes for search results
const TRENDING_CACHE_TTL = 600; // 10 minutes for trending
const SUGGESTIONS_CACHE_TTL = 3600; // 1 hour for suggestions

class CachedSearchService {
  /**
   * Search with caching
   */
  async search(query: string, options: SearchOptions = {}): Promise<SearchResponse> {
    return withPerformanceTracking('search.query', async () => {
      const cacheKey = cacheKeys.search(`${query}:${JSON.stringify(options)}`);
      
      // Try cache first
      const cached = await cacheService.get<SearchResponse>(cacheKey, 'search');
      if (cached !== null) {
        logger.debug('Search cache hit', { query, cacheKey });
        return cached;
      }

      // Cache miss - fetch from service
      const result = await searchService.search(query, options);
      
      // Cache the result
      await cacheService.set(cacheKey, result, {
        ttl: CACHE_TTL,
        tags: [cacheTags.articles, 'search'],
      });

      return result;
    });
  }

  /**
   * Get related articles with caching
   */
  async getRelatedArticles(articleId: string, limit: number = 5): Promise<import('./service').SearchResult[]> {
    return withPerformanceTracking('search.related', async () => {
      const cacheKey = `search:related:${articleId}:${limit}`;
      
      const cached = await cacheService.get<import('./service').SearchResult[]>(cacheKey, 'search');
      if (cached !== null) {
        return cached;
      }

      const result = await searchService.getRelatedArticles(articleId, limit);
      
      await cacheService.set(cacheKey, result, {
        ttl: CACHE_TTL,
        tags: [cacheTags.article(articleId), 'search'],
      });

      return result;
    });
  }

  /**
   * Get trending with caching
   */
  async getTrending(limit: number = 10): Promise<import('./service').SearchResult[]> {
    return withPerformanceTracking('search.trending', async () => {
      const cacheKey = `search:trending:${limit}`;
      
      const cached = await cacheService.get<import('./service').SearchResult[]>(cacheKey, 'search');
      if (cached !== null) {
        return cached;
      }

      const result = await searchService.getTrending(limit);
      
      await cacheService.set(cacheKey, result, {
        ttl: TRENDING_CACHE_TTL,
        tags: ['search', 'trending'],
      });

      return result;
    });
  }

  /**
   * Get suggestions with caching
   */
  async getSuggestions(query?: string): Promise<string[]> {
    return withPerformanceTracking('search.suggestions', async () => {
      const cacheKey = query 
        ? `search:suggestions:${query}`
        : 'search:suggestions:default';
      
      const cached = await cacheService.get<string[]>(cacheKey, 'search');
      if (cached !== null) {
        return cached;
      }

      const result = await searchService.getSuggestions();
      
      await cacheService.set(cacheKey, result, {
        ttl: SUGGESTIONS_CACHE_TTL,
        tags: ['search', 'suggestions'],
      });

      return result;
    });
  }

  /**
   * Invalidate search cache
   */
  async invalidateCache(query?: string): Promise<void> {
    try {
      if (query) {
        const cacheKey = cacheKeys.search(query);
        await cacheService.delete(cacheKey);
      } else {
        // Invalidate all search cache
        await cacheService.invalidateTag('search');
      }
    } catch (error) {
      logger.error('Failed to invalidate search cache', error instanceof Error ? error : new Error(String(error)));
    }
  }
}

// Export singleton instance
export const cachedSearchService = new CachedSearchService();
