# 🔄 Phase 2: API Route Migration to Queue Guide

**Purpose:** Step-by-step guide for migrating API routes to use Inngest message queue

---

## 📋 Migration Pattern

### Before (Synchronous)

```typescript
// app/api/articles/generate-comprehensive/route.ts
export const POST = async (request: NextRequest) => {
    const body = await request.json();
    
    // Long-running operation blocks response
    const result = await generateArticleCore(topic, logFn, options);
    
    return NextResponse.json(result);
};
```

**Problems:**
- ❌ API timeout (10s Hobby, 60s Pro)
- ❌ User waits for entire operation
- ❌ No retry mechanism
- ❌ No job status tracking

---

### After (Queue-based)

```typescript
// app/api/articles/generate-comprehensive/route.ts
import { inngest } from '@/lib/queue/inngest-client';

export const POST = async (request: NextRequest) => {
    const body = await request.json();
    
    // Send to queue - returns immediately
    const eventId = await inngest.send({
        name: 'article/generate',
        data: {
            topic: body.topic,
            options: body.options,
        },
    });
    
    // Return immediately with job ID
    return NextResponse.json({ 
        success: true, 
        message: 'Article generation queued',
        jobId: eventId.ids[0] // Inngest returns event IDs
    });
};
```

**Benefits:**
- ✅ Immediate response
- ✅ No timeouts
- ✅ Automatic retries
- ✅ Job status tracking

---

## 🎯 Migration Steps

### Step 1: Identify Long-Running Routes

**Routes to Migrate:**
1. ✅ `/api/articles/generate-comprehensive` - Article generation (30-120s)
2. ✅ `/api/cms/bulk-generate` - Bulk generation (5-30min)
3. ✅ `/api/products/generate-image` - Image generation (10-30s)
4. `/api/batch/process` - Batch operations
5. `/api/automation/content-refresh` - Content refresh

---

### Step 2: Update Route to Use Queue

**Example: Article Generation Route**

```typescript
// app/api/articles/generate-comprehensive/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/lib/queue/inngest-client';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { withValidation } from '@/lib/middleware/validation';
import { articleGenerateSchema } from '@/lib/validation/schemas';
import { logger } from '@/lib/logger';

export const POST = createAPIWrapper('/api/articles/generate-comprehensive', {
    rateLimitType: 'ai',
    trackMetrics: true,
})(
    withValidation(articleGenerateSchema, undefined)(
        async (request: NextRequest, body: any, _query: unknown) => {
            try {
                // Send to queue
                const result = await inngest.send({
                    name: 'article/generate',
                    data: {
                        topic: body.topic,
                        category: body.category,
                        targetKeywords: body.targetKeywords,
                        targetAudience: body.targetAudience,
                        contentLength: body.contentLength,
                        wordCount: body.wordCount,
                        prompt: body.prompt,
                        options: {
                            authorId: body.authorId,
                            cycleId: body.cycleId,
                        }
                    },
                });

                logger.info('Article generation queued', { 
                    eventIds: result.ids,
                    topic: body.topic 
                });

                return NextResponse.json({
                    success: true,
                    message: 'Article generation queued',
                    jobId: result.ids[0],
                    status: 'queued'
                });
            } catch (error) {
                logger.error('Queue send error', error instanceof Error ? error : new Error(String(error)));
                throw error;
            }
        }
    )
);
```

---

### Step 3: Add Job Status Endpoint (Optional)

```typescript
// app/api/jobs/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    
    // Query Inngest API for job status
    // Or query your database if you store job status
    
    return NextResponse.json({
        jobId: id,
        status: 'processing', // or 'completed', 'failed'
        // ... other status info
    });
}
```

---

### Step 4: Update Frontend

**Before:**
```typescript
const response = await fetch('/api/articles/generate-comprehensive', {
    method: 'POST',
    body: JSON.stringify({ topic, category })
});

const result = await response.json();
// Wait for completion
```

**After:**
```typescript
const response = await fetch('/api/articles/generate-comprehensive', {
    method: 'POST',
    body: JSON.stringify({ topic, category })
});

const { jobId, status } = await response.json();

// Poll for status
const pollStatus = async () => {
    const statusResponse = await fetch(`/api/jobs/${jobId}/status`);
    const statusData = await statusResponse.json();
    
    if (statusData.status === 'completed') {
        // Handle completion
    } else if (statusData.status === 'failed') {
        // Handle failure
    } else {
        // Poll again
        setTimeout(pollStatus, 2000);
    }
};

pollStatus();
```

---

## 📊 Migration Checklist

### For Each Route:

- [ ] Identify route as long-running (>10 seconds)
- [ ] Create or verify job definition exists
- [ ] Update route to use `inngest.send()`
- [ ] Update response to return job ID
- [ ] Add error handling
- [ ] Update frontend to handle async response
- [ ] Add job status endpoint (optional)
- [ ] Test end-to-end
- [ ] Monitor in Inngest dashboard

---

## 🎯 Priority Routes

### High Priority (Migrate First)

1. **`/api/articles/generate-comprehensive`**
   - **Current:** Synchronous, 30-120s
   - **Impact:** High (frequent use)
   - **Job:** `generateArticleJob` ✅ Created

2. **`/api/cms/bulk-generate`**
   - **Current:** Synchronous, 5-30min
   - **Impact:** High (timeout risk)
   - **Job:** `bulkGenerateJob` ✅ Created

3. **`/api/products/generate-image`**
   - **Current:** Synchronous, 10-30s
   - **Impact:** Medium
   - **Job:** `imageGenerationJob` ✅ Created

### Medium Priority

4. **`/api/batch/process`**
   - **Current:** Synchronous
   - **Impact:** Medium
   - **Job:** Create `batchProcessJob`

5. **`/api/automation/content-refresh`**
   - **Current:** Synchronous
   - **Impact:** Medium
   - **Job:** Create `contentRefreshJob`

---

## 🔧 Testing Migration

### 1. Test Queue Sending

```bash
curl -X POST http://localhost:3000/api/articles/generate-comprehensive \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Test Article",
    "category": "mutual-funds"
  }'
```

**Expected:**
```json
{
  "success": true,
  "message": "Article generation queued",
  "jobId": "event-id-here",
  "status": "queued"
}
```

### 2. Verify Job Execution

- Check Inngest Dashboard → Functions
- Should see job executing
- Check logs for completion

### 3. Test Error Handling

- Send invalid data
- Verify error response
- Check error logging

---

## 📝 Notes

- **Backward Compatibility:** Keep old route temporarily for rollback
- **Gradual Migration:** Migrate one route at a time
- **Monitoring:** Watch error rates after migration
- **Rollback Plan:** Keep old implementation for 1-2 weeks

---

*API Migration Guide - January 13, 2026*
