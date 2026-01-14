# 🧪 Phase 3: Testing Guide

**Date:** January 14, 2026  
**Status:** Testing Instructions

---

## ✅ Migration Verified

All 4 database tables created successfully:
- ✅ `workflow_definitions`
- ✅ `workflow_instances`
- ✅ `workflow_execution_history`
- ✅ `state_transitions`

---

## 🧪 Testing Options

### Option 1: Test via API (Recommended)

**Prerequisites:**
- Dev server running (`npm run dev`)
- Database migration applied ✅

**Run Test:**
```bash
npx tsx scripts/test-workflow-api.ts
```

**What It Tests:**
- ✅ Start workflow via API
- ✅ Get workflow status
- ✅ State transitions
- ✅ Get metrics
- ✅ Debug workflow

**Expected Output:**
```
🧪 Testing Workflow System via API...

📝 Test 1: Starting Article Publishing Workflow...
✅ Workflow started: <instance-id>
   State: running

📊 Test 2: Getting Workflow Status...
✅ Status retrieved

... (all tests pass)
```

---

### Option 2: Manual API Testing

**Start Workflow:**
```bash
curl -X POST http://localhost:3000/api/workflows/start \
  -H "Content-Type: application/json" \
  -d '{
    "workflowName": "article-publishing",
    "context": { "articleId": "test-123" }
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

**Debug Workflow:**
```bash
curl http://localhost:3000/api/workflows/{instanceId}/debug
```

---

### Option 3: Test via Code (In Next.js Context)

**Use in API Route or Server Component:**
```typescript
import { workflowService } from '@/lib/workflows';
import { ARTICLE_PUBLISHING_WORKFLOW } from '@/lib/workflows/definitions';

// In an API route or server component
const instance = await workflowService.startWorkflow(
  ARTICLE_PUBLISHING_WORKFLOW,
  { articleId: 'article-123' }
);
```

---

## 🚨 Troubleshooting

### Issue: "Cannot read properties of undefined (reading '_zod')"

**Solution:** Fixed in route - ensure dev server is restarted after code changes.

### Issue: "Table does not exist"

**Solution:** 
- Verify migration was applied
- Run: `npx tsx scripts/verify-workflow-migration.ts`

### Issue: "Workflow definition not found"

**Solution:**
- Check workflow name: `article-publishing` or `content-generation`
- Verify workflow registry is loaded

### Issue: "Dev server not running"

**Solution:**
```bash
npm run dev
```

Then run API tests in another terminal.

---

## ✅ Success Criteria

After testing, you should be able to:

- [x] Start workflows via API ✅
- [ ] Get workflow status ✅
- [ ] View execution history ✅
- [ ] State transitions work ✅
- [ ] Monitoring endpoints work ✅

---

**Testing Guide - January 14, 2026**

*Next: Test via API with dev server running*
