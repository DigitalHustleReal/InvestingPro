/**
 * Cache Invalidation Handler
 * Handles cache invalidation events
 */
import { EventType, type CacheInvalidatedEvent } from '../types';
import { createSubscriber, type EventHandler } from '../subscriber';
import { logger } from '@/lib/logger';
import { invalidatePattern } from '@/lib/cache/redis-service';

/**
 * Handle cache invalidation events
 */
export const handleCacheInvalidation: EventHandler<CacheInvalidatedEvent> = async (event) => {
    try {
        if (event.type === EventType.CACHE_INVALIDATED) {
            const { cacheKey, reason } = event.payload;
            
            logger.debug('Cache invalidation event received', { cacheKey, reason });
            
            // Invalidate cache by pattern
            if (cacheKey.includes('*')) {
                const count = await invalidatePattern(cacheKey);
                logger.info('Cache invalidated by pattern', { pattern: cacheKey, count });
            } else {
                // Single key invalidation would need cacheDelete
                const { cacheDelete } = await import('@/lib/cache/redis-service');
                await cacheDelete(cacheKey);
                logger.info('Cache invalidated', { cacheKey });
            }
        }
    } catch (error) {
        logger.error('Cache invalidation handler error', error instanceof Error ? error : new Error(String(error)));
    }
};

/**
 * Setup cache invalidation subscriber
 */
export function setupCacheInvalidationHandler(): () => void {
    const subscriber = createSubscriber();
    subscriber.on(EventType.CACHE_INVALIDATED, handleCacheInvalidation);
    
    return () => subscriber.unsubscribe();
}
