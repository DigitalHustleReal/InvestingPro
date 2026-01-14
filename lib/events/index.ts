/**
 * Events Module
 * Central export for event system
 */
export { EventType, type BaseEvent, type SystemEvent } from './types';
export { eventPublisher, type EventPublisher } from './publisher';
export { EventSubscriber, createSubscriber, type EventHandler } from './subscriber';

// Re-export specific event types for convenience
export type {
    ArticleCreatedEvent,
    ArticlePublishedEvent,
    ContentGenerationStartedEvent,
    ContentGenerationCompletedEvent,
    ContentGenerationFailedEvent,
    CacheInvalidatedEvent
} from './types';
