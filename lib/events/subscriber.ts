/**
 * Event Subscriber
 * Helper utilities for subscribing to events
 */
import { EventPublisherImpl, eventPublisher } from './publisher';
import { EventType, type BaseEvent } from './types';
import { logger } from '@/lib/logger';

export interface EventHandler<T extends BaseEvent = BaseEvent> {
    (event: T): Promise<void>;
}

export class EventSubscriber {
    private publisher: EventPublisherImpl;
    private unsubscribers: Array<() => void> = [];

    constructor(publisher: EventPublisherImpl = eventPublisher) {
        this.publisher = publisher;
    }

    /**
     * Subscribe to a specific event type
     */
    on<T extends BaseEvent>(eventType: EventType, handler: EventHandler<T>): this {
        const unsubscribe = this.publisher.subscribe(eventType, handler as EventHandler);
        this.unsubscribers.push(unsubscribe);
        return this;
    }

    /**
     * Subscribe to multiple event types
     */
    onMany<T extends BaseEvent>(eventTypes: EventType[], handler: EventHandler<T>): this {
        eventTypes.forEach(type => this.on(type, handler));
        return this;
    }

    /**
     * Subscribe to all events (wildcard)
     */
    onAll(handler: EventHandler<BaseEvent>): this {
        return this.on(EventType.ERROR_OCCURRED, handler); // Using ERROR_OCCURRED as wildcard for now
    }

    /**
     * Unsubscribe from all events
     */
    unsubscribe(): void {
        this.unsubscribers.forEach(unsub => unsub());
        this.unsubscribers = [];
    }
}

/**
 * Create a new event subscriber
 */
export function createSubscriber(): EventSubscriber {
    return new EventSubscriber();
}
