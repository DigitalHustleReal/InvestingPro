# Message Queue (Inngest)

Background job processing for long-running tasks using Inngest.

## Setup

1. **Install Dependencies**
   ```bash
   npm install inngest
   ```

2. **Create Inngest Account**
   - Sign up at https://www.inngest.com
   - Create a new app
   - Get your Event Key and Signing Key

3. **Environment Variables**
   ```env
   INNGEST_EVENT_KEY=your_event_key
   INNGEST_SIGNING_KEY=your_signing_key
   ```

4. **Deploy**
   - Deploy to Vercel
   - Inngest will automatically discover your functions via `/api/inngest`

## Usage

### Sending Jobs to Queue

```typescript
import { inngest } from '@/lib/queue/inngest-client';

// Send article generation job
await inngest.send({
  name: 'article/generate',
  data: {
    topic: 'SIP vs SWP',
    options: {
      authorId: 'user-id',
      cycleId: 'cycle-id'
    }
  },
});

// Send bulk generation job
await inngest.send({
  name: 'content/bulk-generate',
  data: {
    topics: ['Topic 1', 'Topic 2', 'Topic 3'],
    options: {}
  },
});
```

## Available Jobs

### 1. Article Generation (`article/generate`)
- Generates a single article
- Retries: 3 times
- Timeout: Handled by Inngest

**Event Data:**
```typescript
{
  topic: string;
  options?: {
    dryRun?: boolean;
    authorId?: string;
    cycleId?: string;
  };
}
```

### 2. Bulk Generation (`content/bulk-generate`)
- Generates multiple articles sequentially
- Retries: 2 times
- Processes topics one by one to avoid rate limits

**Event Data:**
```typescript
{
  topics: string[];
  options?: {
    dryRun?: boolean;
    authorId?: string;
    cycleId?: string;
  };
}
```

### 3. Image Generation (`image/generate`)
- Generates images for articles
- Retries: 2 times
- TODO: Integrate with actual image service

**Event Data:**
```typescript
{
  articleId: string;
  slug: string;
  prompt?: string;
  options?: Record<string, any>;
}
```

## Monitoring

- View jobs in Inngest Dashboard: https://app.inngest.com
- Check job status, retries, and errors
- Monitor performance metrics

## Integration with Event Bus

Jobs can be triggered via Event Bus:

```typescript
// In event handler
import { inngest } from '@/lib/queue/inngest-client';

subscriber.on(EventType.CONTENT_GENERATION_STARTED, async (event) => {
  await inngest.send({
    name: 'article/generate',
    data: event.payload,
  });
});
```

## Migration Strategy

1. **Phase 1**: Keep existing synchronous routes
2. **Phase 2**: Add queue-based routes in parallel
3. **Phase 3**: Migrate frontend to use queue endpoints
4. **Phase 4**: Remove synchronous implementations
