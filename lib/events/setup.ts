/**
 * Event System Setup
 * Initialize event handlers and setup event system
 */
import { setupAllHandlers } from './handlers';
import { logger } from '@/lib/logger';

let handlersInitialized = false;

/**
 * Initialize event system
 * Call this once during app startup
 */
export function initializeEventSystem(): void {
    if (handlersInitialized) {
        // In development, Fast Refresh can cause multiple initializations
        // This is expected and safe - just return silently
        if (process.env.NODE_ENV === 'development') {
            return; // Silent in dev mode
        }
        logger.warn('Event system already initialized');
        return;
    }

    try {
        // Setup all event handlers
        setupAllHandlers();
        
        handlersInitialized = true;
        logger.info('Event system initialized successfully');
    } catch (error) {
        logger.error('Failed to initialize event system', error instanceof Error ? error : new Error(String(error)));
        throw error;
    }
}

/**
 * Check if event system is initialized
 */
export function isEventSystemInitialized(): boolean {
    return handlersInitialized;
}
