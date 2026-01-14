# 🔄 Phase 2: Migration Examples & Frontend Integration

**Purpose:** Complete examples for migrating routes to queue and updating frontend

---

## 📋 Migration Examples

### 1. Article Generation Route Migration

**Before (Synchronous):**
```typescript
// app/api/articles/generate-comprehensive/route.ts
export const POST = async (request: NextRequest) => {
    const body = await request.json();
    const result = await generateArticleContent(body);
    return NextResponse.json({ success: true, article: result });
};
```

**After (Queue-based):**
See: `app/api/articles/generate-comprehensive/route.migrated.example.ts`

**Key Changes:**
- ✅ Uses `inngest.send()` instead of direct processing
- ✅ Returns immediately with `jobId`
- ✅ Provides `statusUrl` for polling

---

### 2. Bulk Generation Route Migration

**Before (Synchronous):**
```typescript
// app/api/cms/bulk-generate/route.ts
export const POST = async (request: NextRequest) => {
    const body = await request.json();
    const results = await Promise.all(
        body.topics.map(topic => generateArticle(topic))
    );
    return NextResponse.json({ success: true, results });
};
```

**After (Queue-based):**
See: `app/api/cms/bulk-generate/route.migrated.example.ts`

**Key Changes:**
- ✅ Queues all topics in single job
- ✅ Returns immediately with `jobId`
- ✅ Job handles sequential processing

---

## 🎨 Frontend Integration

### Option 1: Using React Hook (Recommended)

```typescript
// components/admin/AIContentGenerator.tsx
import { useJobStatus } from '@/lib/hooks/useJobStatus';
import { queueArticleGeneration } from '@/lib/utils/job-queue';

export default function AIContentGenerator() {
    const [jobId, setJobId] = useState<string | null>(null);
    
    const { status, data, isLoading, error } = useJobStatus({
        jobId,
        pollInterval: 2000,
        onComplete: (result) => {
            // Handle completed article
            setGeneratedContent(result);
            toast.success('Article generated successfully!');
        },
        onError: (error) => {
            toast.error(`Generation failed: ${error}`);
        }
    });

    const handleGenerate = async () => {
        try {
            const response = await queueArticleGeneration({
                topic,
                category: categoryStr,
                targetKeywords: keywords.split(',').map(k => k.trim()),
                targetAudience: 'general',
                contentLength: 'comprehensive',
                wordCount: 1500,
            });

            setJobId(response.jobId);
            toast.info('Article generation started...');
        } catch (error) {
            toast.error(`Failed to queue: ${error.message}`);
        }
    };

    return (
        <div>
            <button onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Article'}
            </button>
            
            {status && (
                <div>
                    Status: {status}
                    {status === 'running' && <Spinner />}
                </div>
            )}
        </div>
    );
}
```

---

### Option 2: Using Utility Functions

```typescript
// components/admin/AIContentGenerator.tsx
import { queueArticleGeneration, pollJobStatus } from '@/lib/utils/job-queue';

const handleGenerate = async () => {
    try {
        // Queue the job
        const { jobId } = await queueArticleGeneration({
            topic,
            category: categoryStr,
            // ... other params
        });

        toast.info('Article generation started...');

        // Poll for completion
        const result = await pollJobStatus(jobId, {
            interval: 2000,
            timeout: 5 * 60 * 1000, // 5 minutes
            onProgress: (status) => {
                console.log(`Job status: ${status}`);
            }
        });

        // Handle result
        setGeneratedContent(result);
        toast.success('Article generated successfully!');
    } catch (error) {
        toast.error(`Generation failed: ${error.message}`);
    }
};
```

---

## 📊 Job Status Tracking

### Database Schema

The `job_status` table is optional but recommended for easier querying:

```sql
-- See: supabase/migrations/20260113_job_status.sql
CREATE TABLE job_status (
    id UUID PRIMARY KEY,
    job_id TEXT UNIQUE, -- Inngest event ID
    status TEXT, -- 'queued', 'running', 'completed', 'failed'
    job_type TEXT, -- 'article-generation', etc.
    metadata JSONB,
    result JSONB,
    error TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    completed_at TIMESTAMP
);
```

### Updating Job Status in Jobs

Update your Inngest jobs to store status:

```typescript
// lib/queue/jobs/article-generation-comprehensive.ts
import { storeJobStatus } from '@/lib/queue/job-status';

export const generateComprehensiveArticleJob = inngest.createFunction(
  // ... config
  async ({ event, step }) => {
    const { jobId } = event; // Inngest provides event ID
    
    // Store initial status
    await storeJobStatus(jobId, 'queued', event.data, 'article-generation');
    
    try {
      // Update to running
      await storeJobStatus(jobId, 'running');
      
      // Generate article
      const result = await step.run('generate', async () => {
        // ... generation logic
      });
      
      // Store completed status
      await storeJobStatus(jobId, 'completed', null, 'article-generation', result);
      
      return result;
    } catch (error) {
      // Store failed status
      await storeJobStatus(
        jobId, 
        'failed', 
        null, 
        'article-generation', 
        null, 
        error.message
      );
      throw error;
    }
  }
);
```

---

## 🔧 Migration Steps

### Step 1: Backup Current Routes
```bash
cp app/api/articles/generate-comprehensive/route.ts app/api/articles/generate-comprehensive/route.backup.ts
cp app/api/cms/bulk-generate/route.ts app/api/cms/bulk-generate/route.backup.ts
```

### Step 2: Apply Migrated Versions
```bash
cp app/api/articles/generate-comprehensive/route.migrated.example.ts app/api/articles/generate-comprehensive/route.ts
cp app/api/cms/bulk-generate/route.migrated.example.ts app/api/cms/bulk-generate/route.ts
```

### Step 3: Run Database Migration (Optional)
```bash
# Apply job_status table migration
supabase migration up
# Or use Supabase dashboard
```

### Step 4: Update Frontend Components
- Replace synchronous API calls with queue utilities
- Add job status polling
- Update UI to show progress

### Step 5: Test
```bash
# Test article generation
curl -X POST http://localhost:3000/api/articles/generate-comprehensive \
  -H "Content-Type: application/json" \
  -d '{"topic": "Test Article", "category": "investing-basics"}'

# Check job status
curl http://localhost:3000/api/jobs/{job-id}/status
```

---

## 📝 Frontend Component Example

### Complete Example with Progress Indicator

```typescript
'use client';

import { useState } from 'react';
import { useJobStatus } from '@/lib/hooks/useJobStatus';
import { queueArticleGeneration } from '@/lib/utils/job-queue';
import { toast } from 'sonner';

export default function ArticleGenerator() {
    const [topic, setTopic] = useState('');
    const [jobId, setJobId] = useState<string | null>(null);
    
    const { status, data, isLoading } = useJobStatus({
        jobId,
        pollInterval: 2000,
        onComplete: (result) => {
            toast.success('Article generated!');
            // Handle result...
        },
        onError: (error) => {
            toast.error(`Failed: ${error}`);
        }
    });

    const handleGenerate = async () => {
        try {
            const response = await queueArticleGeneration({
                topic,
                category: 'investing-basics',
                wordCount: 1500,
            });
            
            setJobId(response.jobId);
            toast.info('Generation started...');
        } catch (error) {
            toast.error('Failed to start generation');
        }
    };

    return (
        <div>
            <input 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Article topic"
            />
            <button onClick={handleGenerate} disabled={isLoading}>
                Generate
            </button>
            
            {status && (
                <div>
                    <p>Status: {status}</p>
                    {status === 'running' && <div>Processing...</div>}
                    {status === 'completed' && <div>✅ Complete!</div>}
                    {status === 'failed' && <div>❌ Failed</div>}
                </div>
            )}
        </div>
    );
}
```

---

## 🎯 Benefits

### Before Migration
- ❌ API timeouts (10-60s limits)
- ❌ User waits for entire operation
- ❌ No retry mechanism
- ❌ No progress tracking

### After Migration
- ✅ Immediate response
- ✅ No timeouts
- ✅ Automatic retries
- ✅ Progress tracking
- ✅ Better UX with status updates

---

*Migration Examples - January 13, 2026*
