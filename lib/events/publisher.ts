/**
 * Event Publisher
 * Publishes events to the event bus
 * 
 * SERVER-ONLY: This module uses server-only APIs (next/headers)
 * Do not import in client components
 */
import 'server-only'; // Mark as server-only module

import { randomUUID } from 'crypto';
import { SystemEvent, EventType, type BaseEvent } from './types';
import { logger } from '@/lib/logger';

export interface EventPublisher {
    publish<T extends BaseEvent>(event: Omit<T, 'id' | 'timestamp'>): Promise<T>;
    publishMany(events: Array<Omit<BaseEvent, 'id' | 'timestamp'>>): Promise<BaseEvent[]>;
}

class EventPublisherImpl implements EventPublisher {
    private subscribers: Map<EventType, Array<(event: BaseEvent) => Promise<void>>> = new Map();
    private persistEvents: boolean = true;

    /**
     * Subscribe to events of a specific type
     */
    subscribe(eventType: EventType, handler: (event: BaseEvent) => Promise<void>): () => void {
        if (!this.subscribers.has(eventType)) {
            this.subscribers.set(eventType, []);
        }
        
        const handlers = this.subscribers.get(eventType)!;
        handlers.push(handler);

        // Return unsubscribe function
        return () => {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        };
    }

    /**
     * Publish a single event
     */
    async publish<T extends BaseEvent>(event: Omit<T, 'id' | 'timestamp'>): Promise<T> {
        const fullEvent: T = {
            ...event,
            id: randomUUID(),
            timestamp: new Date().toISOString(),
        } as T;

        try {
            // Persist event to database if enabled
            if (this.persistEvents) {
                await this.persistEvent(fullEvent);
            }

            // Notify subscribers
            await this.notifySubscribers(fullEvent);

            logger.debug('Event published', { 
                type: fullEvent.type, 
                id: fullEvent.id,
                source: fullEvent.source 
            });

            return fullEvent;
        } catch (error) {
            logger.error('Event publish error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    /**
     * Publish multiple events
     */
    async publishMany(events: Array<Omit<BaseEvent, 'id' | 'timestamp'>>): Promise<BaseEvent[]> {
        const results: BaseEvent[] = [];

        for (const event of events) {
            try {
                const published = await this.publish(event);
                results.push(published);
            } catch (error) {
                logger.error('Event publish error in batch', error instanceof Error ? error : new Error(String(error)));
                // Continue with other events
            }
        }

        return results;
    }

    /**
     * Notify all subscribers of an event
     */
    private async notifySubscribers(event: BaseEvent): Promise<void> {
        const handlers = this.subscribers.get(event.type) || [];
        const allHandlers = this.subscribers.get(EventType.ERROR_OCCURRED) || []; // Wildcard for all events

        const allSubscribers = [...handlers, ...allHandlers];

        // Execute all handlers in parallel
        await Promise.allSettled(
            allSubscribers.map(async (handler) => {
                try {
                    await handler(event);
                } catch (error) {
                    logger.error('Event subscriber error', error instanceof Error ? error : new Error(String(error)));
                }
            })
        );
    }

    /**
     * Persist event to database
     */
    private async persistEvent(event: BaseEvent): Promise<void> {
        try {
            // Lazy import to avoid server/client boundary issues
            const { createClient } = await import('@/lib/supabase/server');
            const supabase = await createClient();
            
            // Try to insert into events table if it exists
            const { error } = await supabase
                .from('system_events')
                .insert({
                    id: event.id,
                    event_type: event.type,
                    source: event.source,
                    payload: {
                        ...(event as any).payload || {},
                        ...(event.metadata || {})
                    },
                    timestamp: event.timestamp,
                    created_at: new Date().toISOString(),
                    metadata: event.metadata || {}
                });

            if (error) {
                // Table might not exist yet, that's ok
                logger.debug('Event persistence skipped (table may not exist)', { error: error.message });
            }
        } catch (error) {
            // Don't fail event publishing if persistence fails
            // Also catch server-only import errors gracefully
            if (error instanceof Error && error.message.includes('next/headers')) {
                // Running in client context - skip persistence
                logger.debug('Event persistence skipped (client context)');
                return;
            }
            logger.warn('Event persistence error', error instanceof Error ? error : new Error(String(error)));
        }
    }

    /**
     * Enable/disable event persistence
     */
    setPersistence(enabled: boolean): void {
        this.persistEvents = enabled;
    }
}

// Export singleton instance
export const eventPublisher = new EventPublisherImpl();
