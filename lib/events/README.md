# Event System

Event-driven architecture for asynchronous communication between system components.

## Quick Start

### 1. Initialize Event System

```typescript
import { initializeEventSystem } from '@/lib/events/setup';

// Call once during app startup (e.g., in middleware or server component)
initializeEventSystem();
```

### 2. Publish Events

```typescript
import { eventPublisher, EventType } from '@/lib/events';

// Publish a single event
await eventPublisher.publish({
    type: EventType.ARTICLE_PUBLISHED,
    source: 'ArticleService',
    payload: {
        articleId: '123',
        slug: 'article-slug'
    }
});
```

### 3. Subscribe to Events

```typescript
import { createSubscriber, EventType } from '@/lib/events';

const subscriber = createSubscriber();

subscriber.on(EventType.ARTICLE_PUBLISHED, async (event) => {
    console.log('Article published:', event.payload);
});

// Don't forget to unsubscribe when done
// subscriber.unsubscribe();
```

## Event Types

See `lib/events/types.ts` for all available event types:
- Content events (article created, updated, published, archived)
- Product events (created, updated)
- AI Agent events (generation started, completed, failed)
- Analytics events (page viewed, product viewed, affiliate clicked)
- User events (registered, bookmarked, subscribed)
- System events (cache invalidated, error occurred)

## Architecture

- **Publisher**: Publishes events to the bus
- **Subscriber**: Subscribes to events
- **Handlers**: Process events (cache invalidation, analytics, etc.)
- **Persistence**: Events stored in `system_events` table

## Database

Events are persisted to `system_events` table. Run migration:
```bash
supabase migration up
```

See `supabase/migrations/20260113_system_events.sql` for schema.
