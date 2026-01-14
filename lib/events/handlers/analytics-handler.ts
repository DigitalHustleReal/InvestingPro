/**
 * Analytics Event Handler
 * Handles analytics events for tracking
 */
import { EventType, type BaseEvent } from '../types';
import { createSubscriber, type EventHandler } from '../subscriber';
import { logger } from '@/lib/logger';
import { analyticsService } from '@/lib/services';

/**
 * Handle analytics events
 */
export const handleAnalyticsEvent: EventHandler<BaseEvent> = async (event) => {
    try {
        // Track different event types
        switch (event.type) {
            case EventType.PAGE_VIEWED:
            case EventType.PRODUCT_VIEWED:
            case EventType.AFFILIATE_CLICKED:
                // These are already tracked via direct API calls
                // This handler can be used for additional processing
                logger.debug('Analytics event received', { type: event.type });
                break;
            
            case EventType.ARTICLE_PUBLISHED:
                // Track article publication
                if (event.metadata?.articleId) {
                    // Could trigger additional analytics tracking
                    logger.debug('Article published event', { articleId: event.metadata.articleId });
                }
                break;
            
            default:
                // Other events don't need analytics tracking
                break;
        }
    } catch (error) {
        logger.error('Analytics handler error', error instanceof Error ? error : new Error(String(error)));
    }
};

/**
 * Setup analytics event subscriber
 */
export function setupAnalyticsHandler(): () => void {
    const subscriber = createSubscriber();
    subscriber.onMany([
        EventType.PAGE_VIEWED,
        EventType.PRODUCT_VIEWED,
        EventType.AFFILIATE_CLICKED,
        EventType.ARTICLE_PUBLISHED
    ], handleAnalyticsEvent);
    
    return () => subscriber.unsubscribe();
}
