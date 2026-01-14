/**
 * Event Handlers
 * Central export for all event handlers
 */

// Import handlers - use explicit imports to ensure they're loaded
import * as cacheHandler from './cache-handler';
import * as analyticsHandler from './analytics-handler';
import * as contentHandler from './content-handler';

/**
 * Setup all event handlers
 */
export function setupAllHandlers(): () => void {
    const unsubscribers: Array<() => void> = [];
    
    // Setup cache invalidation handler
    if (typeof cacheHandler.setupCacheInvalidationHandler === 'function') {
        unsubscribers.push(cacheHandler.setupCacheInvalidationHandler());
    } else {
        throw new Error('setupCacheInvalidationHandler is not exported from cache-handler');
    }
    
    // Setup analytics handler
    if (typeof analyticsHandler.setupAnalyticsHandler === 'function') {
        unsubscribers.push(analyticsHandler.setupAnalyticsHandler());
    } else {
        throw new Error('setupAnalyticsHandler is not exported from analytics-handler');
    }
    
    // Setup content handler
    if (typeof contentHandler.setupContentHandler === 'function') {
        unsubscribers.push(contentHandler.setupContentHandler());
    } else {
        throw new Error('setupContentHandler is not exported from content-handler');
    }
    
    // Return function to unsubscribe all
    return () => {
        unsubscribers.forEach(unsub => unsub());
    };
}

// Export handlers for direct use (if needed)
export { handleCacheInvalidation, setupCacheInvalidationHandler } from './cache-handler';
export { handleAnalyticsEvent, setupAnalyticsHandler } from './analytics-handler';
export { handleArticleCreated, handleArticlePublished, setupContentHandler } from './content-handler';
