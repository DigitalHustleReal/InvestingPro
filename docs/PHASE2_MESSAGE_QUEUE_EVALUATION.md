# 📋 Phase 2: Message Queue Evaluation & Implementation Plan

**Date:** January 13, 2026  
**Status:** 🚧 **IMPLEMENTATION IN PROGRESS (20%)**

---

## 🎯 Requirements Analysis

### Long-Running Tasks Identified

**Content Generation:**
- ✅ Article generation (`generateArticleCore`) - 30-120 seconds
- ✅ Bulk article generation (`bulk-generate`) - 5-30 minutes
- ✅ Image generation - 10-30 seconds
- ✅ Social media post generation - 5-15 seconds

**Batch Operations:**
- ✅ Content refresh pipeline
- ✅ Data scraping operations
- ✅ SEO optimization batch jobs
- ✅ Analytics aggregation

**Current Issues:**
- ❌ API routes timeout on Vercel (10s Hobby, 60s Pro)
- ❌ No retry mechanism for failed jobs
- ❌ No job monitoring/status tracking
- ❌ No priority queue support
- ❌ Synchronous execution blocks API responses

---

## 🔍 Solution Comparison

### 1. BullMQ (Redis-based)

**Pros:**
- ✅ Mature, battle-tested
- ✅ Rich feature set (priorities, delays, retries)
- ✅ Good performance
- ✅ Active community

**Cons:**
- ❌ **Not compatible with Vercel serverless** (requires long-lived workers)
- ❌ Requires separate infrastructure (Redis + worker processes)
- ❌ Complex setup for serverless environments
- ❌ Additional infrastructure costs

**Verdict:** ❌ **Not suitable for Vercel deployment**

---

### 2. Vercel Queue (Community)

**Pros:**
- ✅ Designed for Vercel
- ✅ Serverless-compatible
- ✅ No additional infrastructure

**Cons:**
- ❌ Community-driven (less support)
- ❌ Limited features compared to alternatives
- ❌ Less mature
- ❌ Uncertain long-term maintenance

**Verdict:** ⚠️ **Risky for production**

---

### 3. Inngest (Recommended) ✅

**Pros:**
- ✅ **Designed for serverless** (perfect for Vercel)
- ✅ **Event-driven architecture** (fits our Event Bus)
- ✅ Seamless Next.js integration
- ✅ Built-in retries, delays, parallel execution
- ✅ Built-in observability/dashboard
- ✅ Generous free tier
- ✅ TypeScript-first
- ✅ Step functions for complex workflows

**Cons:**
- ⚠️ Vendor lock-in (but acceptable for serverless)
- ⚠️ Costs scale with usage (but reasonable)

**Verdict:** ✅ **RECOMMENDED**

---

## 🎯 Decision: Inngest

**Rationale:**
1. **Serverless-First**: Built specifically for Vercel/serverless
2. **Event-Driven**: Aligns with our Event Bus architecture
3. **Developer Experience**: Excellent DX with TypeScript support
4. **Observability**: Built-in dashboard for monitoring
5. **Reliability**: Production-ready with retries and error handling

---

## 📦 Implementation Plan

### Phase 1: Setup & Configuration (Day 1)

**1. Install Dependencies**
```bash
npm install inngest
```

**2. Create Inngest Client**
```typescript
// lib/queue/inngest-client.ts
import { Inngest } from 'inngest';

export const inngest = new Inngest({ 
  id: 'investingpro',
  name: 'InvestingPro Queue'
});
```

**3. Create Inngest API Route**
```typescript
// app/api/inngest/route.ts
import { serve } from 'inngest/next';
import { inngest } from '@/lib/queue/inngest-client';
import { generateArticleJob, bulkGenerateJob, imageGenerationJob } from '@/lib/queue/jobs';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateArticleJob,
    bulkGenerateJob,
    imageGenerationJob,
  ],
});
```

**4. Environment Variables**
```env
INNGEST_EVENT_KEY=your_event_key
INNGEST_SIGNING_KEY=your_signing_key
```

---

### Phase 2: Job Definitions (Day 1-2)

**1. Article Generation Job**
```typescript
// lib/queue/jobs/article-generation.ts
import { inngest } from '../inngest-client';
import { generateArticleCore } from '@/lib/automation/article-generator';

export const generateArticleJob = inngest.createFunction(
  { id: 'generate-article' },
  { event: 'article/generate' },
  async ({ event, step }) => {
    const { topic, options } = event.data;
    
    return await step.run('generate-article', async () => {
      return await generateArticleCore(topic, console.log, options);
    });
  }
);
```

**2. Bulk Generation Job**
```typescript
// lib/queue/jobs/bulk-generation.ts
export const bulkGenerateJob = inngest.createFunction(
  { id: 'bulk-generate' },
  { event: 'content/bulk-generate' },
  async ({ event, step }) => {
    const { topics, options } = event.data;
    
    // Process in parallel with concurrency limit
    const results = await step.run('generate-all', async () => {
      return await Promise.all(
        topics.map(topic => 
          generateArticleCore(topic, console.log, options)
        )
      );
    });
    
    return results;
  }
);
```

**3. Image Generation Job**
```typescript
// lib/queue/jobs/image-generation.ts
export const imageGenerationJob = inngest.createFunction(
  { id: 'generate-image' },
  { event: 'image/generate' },
  async ({ event, step }) => {
    // Image generation logic
  }
);
```

---

### Phase 3: Integration (Day 2)

**1. Update API Routes to Use Queue**

**Before (Synchronous):**
```typescript
// app/api/articles/generate-comprehensive/route.ts
export async function POST(request: NextRequest) {
  const result = await generateArticleCore(topic, logFn, options);
  return NextResponse.json(result);
}
```

**After (Queue-based):**
```typescript
// app/api/articles/generate-comprehensive/route.ts
import { inngest } from '@/lib/queue/inngest-client';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Send to queue
  await inngest.send({
    name: 'article/generate',
    data: {
      topic: body.topic,
      options: body.options,
    },
  });
  
  // Return immediately
  return NextResponse.json({ 
    success: true, 
    message: 'Article generation queued',
    jobId: 'pending' // Inngest provides event ID
  });
}
```

**2. Add Job Status Endpoint**
```typescript
// app/api/jobs/[id]/status/route.ts
// Query Inngest API for job status
```

---

### Phase 4: Event Bus Integration (Day 2-3)

**Connect Event Bus to Inngest:**

```typescript
// lib/events/handlers/queue-handler.ts
import { eventPublisher, EventType } from '@/lib/events';
import { inngest } from '@/lib/queue/inngest-client';

export function setupQueueHandler(): () => void {
  const subscriber = createSubscriber();
  
  // When content generation is requested, queue it
  subscriber.on(EventType.CONTENT_GENERATION_STARTED, async (event) => {
    await inngest.send({
      name: 'article/generate',
      data: event.payload,
    });
  });
  
  return () => subscriber.unsubscribe();
}
```

---

## 📊 Migration Strategy

### Step 1: Parallel Implementation
- Keep existing synchronous routes
- Add new queue-based routes
- Test both in parallel

### Step 2: Gradual Migration
- Migrate one route at a time
- Monitor for issues
- Roll back if needed

### Step 3: Full Migration
- Remove synchronous implementations
- All long-running tasks use queue
- Update frontend to poll for status

---

## 🎯 Priority Routes to Migrate

**High Priority:**
1. ✅ `/api/articles/generate-comprehensive` - Article generation
2. ✅ `/api/cms/bulk-generate` - Bulk generation
3. ✅ `/api/products/generate-image` - Image generation

**Medium Priority:**
4. `/api/batch/process` - Batch operations
5. `/api/automation/content-refresh` - Content refresh
6. `/api/cron/content-strategy` - Strategy generation

**Low Priority:**
7. `/api/social/generate` - Social media posts
8. `/api/admin/generate-social` - Admin social generation

---

## 📈 Benefits

**Performance:**
- ✅ No API timeouts
- ✅ Better user experience (immediate response)
- ✅ Parallel processing
- ✅ Retry on failure

**Reliability:**
- ✅ Automatic retries
- ✅ Error handling
- ✅ Job status tracking
- ✅ Dead letter queue

**Observability:**
- ✅ Inngest dashboard
- ✅ Job history
- ✅ Performance metrics
- ✅ Error tracking

**Scalability:**
- ✅ Handle high load
- ✅ Priority queues
- ✅ Rate limiting
- ✅ Concurrency control

---

## ✅ Implementation Status

### Phase 1: Setup & Configuration ✅

- ✅ **Inngest Client Created** - `lib/queue/inngest-client.ts`
- ✅ **API Route Created** - `app/api/inngest/route.ts`
- ✅ **Job Definitions Created**:
  - ✅ Article generation job (`lib/queue/jobs/article-generation.ts`)
  - ✅ Bulk generation job (`lib/queue/jobs/bulk-generation.ts`)
  - ✅ Image generation job (`lib/queue/jobs/image-generation.ts`)
- ✅ **Documentation Created** - `lib/queue/README.md`

### Phase 2: Remaining Tasks

- [ ] **Install Inngest** - `npm install inngest`
- [ ] **Create Inngest account** - Get API keys
- [ ] **Add environment variables** - `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`
- [ ] **Update API routes** - Migrate to use queue
- [ ] **Test end-to-end** - Verify queue works
- [ ] **Migrate remaining routes** - Gradual migration

## 🚀 Next Steps

1. **Install Inngest** - `npm install inngest`
2. **Create Inngest account** - Get API keys
3. **Add environment variables** - Update `.env.local`
4. **Deploy to Vercel** - Inngest will auto-discover functions
5. **Test first job** - Send test event
6. **Migrate API routes** - Update to use queue
7. **Monitor in dashboard** - Verify jobs execute

---

## 📝 Notes

- **Free Tier**: 25,000 function runs/month
- **Pricing**: $20/month for 100k runs
- **Setup Time**: ~2-4 hours
- **Migration Time**: ~1-2 days

---

*Message Queue Evaluation Complete - January 13, 2026*
