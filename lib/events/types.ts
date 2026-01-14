/**
 * Event Types
 * Defines all event types in the system
 */

export enum EventType {
    // Content Events
    ARTICLE_CREATED = 'article.created',
    ARTICLE_UPDATED = 'article.updated',
    ARTICLE_PUBLISHED = 'article.published',
    ARTICLE_ARCHIVED = 'article.archived',
    
    // Product Events
    PRODUCT_CREATED = 'product.created',
    PRODUCT_UPDATED = 'product.updated',
    
    // AI Agent Events
    CONTENT_GENERATION_STARTED = 'content.generation.started',
    CONTENT_GENERATION_COMPLETED = 'content.generation.completed',
    CONTENT_GENERATION_FAILED = 'content.generation.failed',
    
    // Analytics Events
    PAGE_VIEWED = 'analytics.page.viewed',
    PRODUCT_VIEWED = 'analytics.product.viewed',
    AFFILIATE_CLICKED = 'analytics.affiliate.clicked',
    
    // User Events
    USER_REGISTERED = 'user.registered',
    USER_BOOKMARKED = 'user.bookmarked',
    USER_SUBSCRIBED = 'user.subscribed',
    
    // System Events
    CACHE_INVALIDATED = 'system.cache.invalidated',
    ERROR_OCCURRED = 'system.error.occurred'
}

export interface BaseEvent {
    id: string;
    type: EventType;
    timestamp: string;
    source: string;
    metadata?: Record<string, any>;
}

export interface ArticleCreatedEvent extends BaseEvent {
    type: EventType.ARTICLE_CREATED;
    payload: {
        articleId: string;
        title: string;
        slug: string;
        authorId?: string;
    };
}

export interface ArticlePublishedEvent extends BaseEvent {
    type: EventType.ARTICLE_PUBLISHED;
    payload: {
        articleId: string;
        slug: string;
        publishedAt: string;
    };
}

export interface ContentGenerationStartedEvent extends BaseEvent {
    type: EventType.CONTENT_GENERATION_STARTED;
    payload: {
        topic: string;
        agentId: string;
        cycleId?: string;
    };
}

export interface ContentGenerationCompletedEvent extends BaseEvent {
    type: EventType.CONTENT_GENERATION_COMPLETED;
    payload: {
        articleId: string;
        topic: string;
        agentId: string;
        cycleId?: string;
        duration: number;
    };
}

export interface ContentGenerationFailedEvent extends BaseEvent {
    type: EventType.CONTENT_GENERATION_FAILED;
    payload: {
        topic: string;
        agentId: string;
        cycleId?: string;
        error: string;
    };
}

export interface CacheInvalidatedEvent extends BaseEvent {
    type: EventType.CACHE_INVALIDATED;
    payload: {
        cacheKey: string;
        reason: string;
    };
}

export type SystemEvent = 
    | ArticleCreatedEvent
    | ArticlePublishedEvent
    | ContentGenerationStartedEvent
    | ContentGenerationCompletedEvent
    | ContentGenerationFailedEvent
    | CacheInvalidatedEvent
    | BaseEvent;
