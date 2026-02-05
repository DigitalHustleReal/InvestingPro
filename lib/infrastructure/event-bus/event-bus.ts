/**
 * Event Bus - Core Infrastructure for Autonomous Platform
 * 
 * Purpose: Enable event-driven architecture where systems react autonomously
 * to changes without manual triggers.
 */

export enum SystemEvent {
  // Data Events - Product/Rate Changes
  PRODUCT_DATA_CHANGED = 'product.data.changed',
  RATE_UPDATED = 'rate.updated',
  NEW_PRODUCT_DETECTED = 'product.new.detected',
  PRODUCT_DISCONTINUED = 'product.discontinued',
  
  // Content Events - Article Lifecycle
  ARTICLE_PUBLISHED = 'article.published',
  CONTENT_QUALITY_LOW = 'content.quality.low',
  CONTENT_OUTDATED = 'content.outdated',
  CONTENT_UPDATED = 'content.updated',
  
  // User Events - Behavior Signals
  TRENDING_SEARCH = 'user.search.trending',
  HIGH_BOUNCE_RATE = 'user.bounce.high',
  CONVERSION_COMPLETED = 'user.conversion.completed',
  CALCULATOR_USED = 'user.calculator.used',
  
  // System Events - Health Monitoring
  SCRAPER_FAILED = 'scraper.failed',
  SCRAPER_SUCCESS = 'scraper.success',
  AI_PROVIDER_DOWN = 'ai.provider.down',
  AI_PROVIDER_RECOVERED = 'ai.provider.recovered',
  
  // Intelligence Events - Autonomous Decisions
  CONTENT_CREATION_TRIGGERED = 'intelligence.content.create',
  CONTENT_UPDATE_TRIGGERED = 'intelligence.content.update',
  SCRAPE_SCHEDULED = 'intelligence.scrape.scheduled',
  NOTIFICATION = 'system.notification'
}

export interface EventPayload {
  event: SystemEvent;
  data: any;
  timestamp: number;
  source: string;
  metadata?: Record<string, any>;
}

type EventHandler = (payload: EventPayload) => Promise<void> | void;

class EventBus {
  private subscribers: Map<SystemEvent, Set<EventHandler>> = new Map();
  private eventLog: EventPayload[] = [];
  private maxLogSize = 1000;

  /**
   * Subscribe to an event
   */
  subscribe(event: SystemEvent, handler: EventHandler): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    
    this.subscribers.get(event)!.add(handler);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.get(event)?.delete(handler);
    };
  }

  /**
   * Publish an event to all subscribers
   */
  async publish(event: SystemEvent, data: any, source: string, metadata?: Record<string, any>): Promise<void> {
    const payload: EventPayload = {
      event,
      data,
      timestamp: Date.now(),
      source,
      metadata
    };

    // Log event for debugging and analytics
    this.logEvent(payload);

    // Notify all subscribers
    const handlers = this.subscribers.get(event);
    if (handlers) {
      const promises = Array.from(handlers).map(handler => 
        Promise.resolve(handler(payload)).catch(error => {
          console.error(`Error in event handler for ${event}:`, error);
        })
      );
      
      await Promise.all(promises);
    }
  }

  /**
   * Log event for debugging and analytics
   */
  private logEvent(payload: EventPayload): void {
    this.eventLog.push(payload);
    
    // Keep log size manageable
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog.shift();
    }

    // In production, send to analytics
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(payload);
    }
  }

  /**
   * Send event to analytics for monitoring
   */
  private async sendToAnalytics(payload: EventPayload): Promise<void> {
    try {
      // Send to PostHog or your analytics service
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('system_event', {
          event_type: payload.event,
          source: payload.source,
          ...payload.metadata
        });
      }
    } catch (error) {
      console.error('Failed to send event to analytics:', error);
    }
  }

  /**
   * Get recent events for debugging
   */
  getRecentEvents(limit: number = 100): EventPayload[] {
    return this.eventLog.slice(-limit);
  }

  /**
   * Get events by type
   */
  getEventsByType(event: SystemEvent, limit: number = 100): EventPayload[] {
    return this.eventLog
      .filter(e => e.event === event)
      .slice(-limit);
  }
}

// Singleton instance
export const eventBus = new EventBus();

/**
 * Helper function to publish events with type safety
 */
export async function publishEvent(
  event: SystemEvent,
  data: any,
  source: string,
  metadata?: Record<string, any>
): Promise<void> {
  await eventBus.publish(event, data, source, metadata);
}

/**
 * Helper function to subscribe to events
 */
export function subscribeToEvent(
  event: SystemEvent,
  handler: EventHandler
): () => void {
  return eventBus.subscribe(event, handler);
}
