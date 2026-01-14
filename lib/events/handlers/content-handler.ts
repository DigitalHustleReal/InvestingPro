/**
 * Content Event Handler
 * Handles content-related events (articles, products)
 */
import { EventType, type ArticleCreatedEvent, type ArticlePublishedEvent } from '../types';
import { createSubscriber, type EventHandler } from '../subscriber';
import { logger } from '@/lib/logger';
// Import cached repositories for cache invalidation
// Using dynamic import to avoid circular dependencies

/**
 * Handle article created event
 */
export const handleArticleCreated: EventHandler<ArticleCreatedEvent> = async (event) => {
    try {
        if (event.type === EventType.ARTICLE_CREATED) {
            const { articleId, slug } = event.payload;
            
            logger.debug('Article created event received', { articleId, slug });
            
            // Invalidate cache for this article
            const { CachedArticleRepository } = await import('@/lib/services/articles/article.repository.cached');
            const cachedRepo = new CachedArticleRepository();
            await cachedRepo.invalidateCache(articleId, slug);
            
            logger.info('Article cache invalidated after creation', { articleId, slug });
        }
    } catch (error) {
        logger.error('Article created handler error', error instanceof Error ? error : new Error(String(error)));
    }
};

/**
 * Handle article published event
 */
export const handleArticlePublished: EventHandler<ArticlePublishedEvent> = async (event) => {
    try {
        if (event.type === EventType.ARTICLE_PUBLISHED) {
            const { articleId, slug } = event.payload;
            
            logger.debug('Article published event received', { articleId, slug });
            
            // Invalidate cache for this article
            const { CachedArticleRepository } = await import('@/lib/services/articles/article.repository.cached');
            const cachedRepo = new CachedArticleRepository();
            await cachedRepo.invalidateCache(articleId, slug);
            
            // Invalidate all article query caches (since published articles list changed)
            // Note: This is a simple approach. In production, you might want pattern-based invalidation
            logger.info('Article cache invalidated after publication', { articleId, slug });
        }
    } catch (error) {
        logger.error('Article published handler error', error instanceof Error ? error : new Error(String(error)));
    }
};

/**
 * Setup content event subscriber
 */
export function setupContentHandler(): () => void {
    const subscriber = createSubscriber();
    subscriber.on(EventType.ARTICLE_CREATED, handleArticleCreated);
    subscriber.on(EventType.ARTICLE_PUBLISHED, handleArticlePublished);
    
    return () => subscriber.unsubscribe();
}
