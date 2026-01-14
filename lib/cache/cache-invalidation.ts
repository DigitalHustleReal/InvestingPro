/**
 * Cache Invalidation Utilities
 * Helper functions to invalidate cache when data changes
 */

import { cacheService, cacheTags } from './cache-service';
import { logger } from '@/lib/logger';

/**
 * Invalidate article cache
 */
export async function invalidateArticleCache(articleId: string): Promise<void> {
  try {
    // Invalidate by article ID tag
    await cacheService.invalidateTag(cacheTags.article(articleId));
    
    // Also invalidate articles list cache
    await cacheService.invalidateTag(cacheTags.articles);
    
    logger.info('Article cache invalidated', { articleId });
  } catch (error) {
    logger.error('Failed to invalidate article cache', error instanceof Error ? error : new Error(String(error)), { articleId });
  }
}

/**
 * Invalidate all articles cache
 */
export async function invalidateAllArticlesCache(): Promise<void> {
  try {
    await cacheService.invalidateTag(cacheTags.articles);
    logger.info('All articles cache invalidated');
  } catch (error) {
    logger.error('Failed to invalidate all articles cache', error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Invalidate product cache
 */
export async function invalidateProductCache(type: string, productId: string): Promise<void> {
  try {
    await cacheService.invalidateTag(cacheTags.product(type, productId));
    await cacheService.invalidateTag(cacheTags.products);
    logger.info('Product cache invalidated', { type, productId });
  } catch (error) {
    logger.error('Failed to invalidate product cache', error instanceof Error ? error : new Error(String(error)), { type, productId });
  }
}
