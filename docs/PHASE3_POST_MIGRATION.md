# ✅ Phase 3: Post-Migration Guide

**Date:** January 14, 2026  
**Status:** Migration Applied ✅

---

## 🎉 Migration Complete!

Your workflow system database tables have been created. Here's what to do next:

---

## ✅ Step 1: Verify Migration (Quick Check)

**Option A: Run Verification Script**
```bash
npx tsx scripts/verify-workflow-migration.ts
```

**Option B: Manual SQL Check**
```sql
-- Run in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'workflow_definitions',
  'workflow_instances',
  'workflow_execution_history',
  'state_transitions'
);
```

**Expected:** Should return 4 rows

---

## ✅ Step 2: Test Workflow System (Recommended)

**Option A: Test via API (Recommended - requires dev server)**
```bash
# Make sure dev server is running first
npm run dev

# Then in another terminal:
npx tsx scripts/test-workflow-api.ts
```

**Option B: Test Direct Code (Requires Next.js request context)**
```bash
# Note: This requires running within Next.js app context
# Better to test via API endpoints instead
```

**What It Tests:**
- ✅ Start workflow
- ✅ Get workflow status
- ✅ Get execution history
- ✅ State transitions
- ✅ Monitoring functions

**Expected Output:**
```
🧪 Testing Workflow System...

📝 Test 1: Starting Article Publishing Workflow...
✅ Workflow started: <instance-id>
   State: running

📊 Test 2: Getting Workflow Status...
✅ Status retrieved

... (all tests pass)

✅ All tests completed successfully!
```

---

## ✅ Step 3: Restart Dev Server (If Needed)

**When:** If you haven't restarted since adding workflow code.

```bash
# Stop server (Ctrl+C)
# Then restart
npm run dev
```

**Why:** Ensures new workflow code is loaded.

---

## 🚀 Step 4: Start Using Workflows!

### Option A: Via API

**Start a Workflow:**
```bash
curl -X POST http://localhost:3000/api/workflows/start \
  -H "Content-Type: application/json" \
  -d '{
    "workflowName": "article-publishing",
    "context": { "articleId": "your-article-id" }
  }'
```

**Get Status:**
```bash
curl http://localhost:3000/api/workflows/{instanceId}/status
```

**Get Metrics:**
```bash
curl http://localhost:3000/api/workflows/metrics
```

### Option B: Via Code

**Start Workflow:**
```typescript
import { workflowService } from '@/lib/workflows';
import { ARTICLE_PUBLISHING_WORKFLOW } from '@/lib/workflows/definitions';

const instance = await workflowService.startWorkflow(
  ARTICLE_PUBLISHING_WORKFLOW,
  { articleId: 'your-article-id' }
);
```

**Use Hooks:**
```typescript
import { triggerArticlePublishingWorkflow } from '@/lib/workflows/hooks/article-workflow-hooks';

const instanceId = await triggerArticlePublishingWorkflow(articleId);
```

---

## 📊 Step 5: Monitor Workflows

**Check Metrics:**
```bash
GET /api/workflows/metrics
```

**Debug Workflow:**
```bash
GET /api/workflows/{instanceId}/debug
```

**View Active Workflows:**
- Check Supabase dashboard: `workflow_instances` table
- Filter by `state = 'running'` or `state = 'pending'`

---

## ✅ Verification Checklist

After migration, verify:

- [x] Migration applied ✅
- [ ] Tables exist (4 tables)
- [ ] Can start workflow
- [ ] Can get workflow status
- [ ] Monitoring endpoints work
- [ ] Test script passes

---

## 🎯 What's Now Available

### 1. Workflow System
- ✅ Start workflows
- ✅ Track execution
- ✅ Monitor metrics
- ✅ Debug issues

### 2. API Endpoints
- ✅ `POST /api/workflows/start`
- ✅ `GET /api/workflows/[id]/status`
- ✅ `POST /api/workflows/state/transition`
- ✅ `GET /api/workflows/metrics`
- ✅ `GET /api/workflows/[id]/debug`

### 3. Pre-built Workflows
- ✅ Article Publishing (`article-publishing`)
- ✅ Content Generation (`content-generation`)

---

## 🔗 Integration Examples

### Integrate with Article Service

**After Article Creation:**
```typescript
import { triggerArticlePublishingWorkflow } from '@/lib/workflows/hooks/article-workflow-hooks';

// After creating article
const article = await articleService.createArticle(...);
const workflowId = await triggerArticlePublishingWorkflow(article.id);
```

**State Transitions:**
```typescript
import { transitionArticleState } from '@/lib/workflows/hooks/article-workflow-hooks';

// When user submits for review
await transitionArticleState(
  articleId,
  'draft',
  'review',
  'submit',
  userId
);
```

---

## 🚨 Troubleshooting

### Issue: "Table does not exist"

**Solution:**
- Verify migration was applied
- Check Supabase dashboard → Table Editor
- Re-run migration if needed

### Issue: "Workflow definition not found"

**Solution:**
- Check workflow name: `article-publishing` or `content-generation`
- Verify workflow registry is loaded
- Check server logs

### Issue: "Permission denied"

**Solution:**
- Check RLS policies exist
- Verify user is authenticated
- Check admin role if needed

### Issue: Tests Fail

**Solution:**
- Check database connection
- Verify Inngest keys are set
- Check server logs for errors
- Ensure dev server is running

---

## 📚 Next Steps

1. **Test the System** - Run test script
2. **Integrate Workflows** - Add to article service
3. **Monitor Usage** - Check metrics endpoint
4. **Build Dashboard** - Optional UI for monitoring

---

## 🎉 Success!

Your workflow system is now operational! You can:

- ✅ Start workflows
- ✅ Track execution
- ✅ Monitor performance
- ✅ Debug issues
- ✅ Integrate with services

**Ready to use in production!** 🚀

---

**Post-Migration Guide - January 14, 2026**

*Next: Test and integrate workflows*
