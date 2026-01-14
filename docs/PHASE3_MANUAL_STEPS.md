# 🔧 Phase 3: Manual Steps Required

**Date:** January 14, 2026  
**Status:** Action Required

---

## ✅ Quick Checklist

- [ ] **1. Apply Database Migration** (REQUIRED)
- [ ] **2. Verify Inngest Setup** (Already Done ✅)
- [ ] **3. Test Workflow System** (OPTIONAL but Recommended)
- [ ] **4. Restart Dev Server** (If needed)

---

## 📋 Step-by-Step Instructions

### Step 1: Apply Database Migration (REQUIRED)

**Why:** The workflow system needs database tables to function.

**How to Apply:**

#### Option A: Using Supabase CLI (Recommended)
```bash
# Navigate to project root
cd c:\Users\shivp\Desktop\InvestingPro_App

# Apply migration
supabase migration up

# Or if using local Supabase
supabase db push
```

#### Option B: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open file: `supabase/migrations/20260114_workflow_schema.sql`
4. Copy entire contents
5. Paste into SQL Editor
6. Click **Run**

#### Option C: Using psql (Direct)
```bash
psql -h your-db-host -U postgres -d your-db-name -f supabase/migrations/20260114_workflow_schema.sql
```

**Verification:**
```sql
-- Check if tables exist
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

**Expected Result:** Should return 4 rows (one for each table)

---

### Step 2: Verify Inngest Setup (Already Done ✅)

**Status:** ✅ Already configured (from Phase 2)

**Environment Variables (Check):**
```bash
# In your .env.local file, verify these exist:
INNGEST_EVENT_KEY=your-event-key
INNGEST_SIGNING_KEY=your-signing-key
```

**If Missing:**
- Keys were provided earlier: `EJhfpQ-6Vc60U3ziqwd1O4QsAQ13BGelG_F93VPSZjmpIesnhsx6cmXeRk9ndpgChp7jI-7svdgXVqBr51Yq1g` (event key)
- Signing key: `signkey-prod-87bbb2bb3a6f761c51cedfb5491a239e754b363f1ca7c8fb5bdfc33a0bd03f29`

---

### Step 3: Test Workflow System (OPTIONAL but Recommended)

**Why:** Verify everything works before using in production.

**Run Test Script:**
```bash
# From project root
npx tsx scripts/test-workflow-system.ts
```

**Expected Output:**
```
🧪 Testing Workflow System...

📝 Test 1: Starting Article Publishing Workflow...
✅ Workflow started: <instance-id>
   State: running
   Workflow: <workflow-id>

📊 Test 2: Getting Workflow Status...
✅ Status retrieved:
   State: running
   Completed Steps: 0
   Failed Steps: 0

... (more tests)

✅ All tests completed successfully!
🎉 Workflow system test complete!
```

**If Tests Fail:**
- Check database migration was applied
- Check Inngest keys are set
- Check server logs for errors

---

### Step 4: Restart Dev Server (If Needed)

**When:** If you added environment variables or made configuration changes.

**How:**
```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

**Why:** Next.js needs to reload environment variables and new code.

---

## 🚨 Common Issues & Solutions

### Issue: "Table does not exist"

**Solution:**
```bash
# Apply migration
supabase migration up

# Or manually via SQL Editor
```

### Issue: "Workflow definition not found"

**Solution:**
- Check workflow name matches registry (`article-publishing` or `content-generation`)
- Verify workflow registry is loaded (check server logs)

### Issue: "Inngest job not executing"

**Solution:**
- Verify Inngest keys in `.env.local`
- Restart dev server after adding keys
- Check Inngest dashboard: https://app.inngest.com

### Issue: "Permission denied" or RLS errors

**Solution:**
- Check RLS policies are created (part of migration)
- Verify user is authenticated
- Check admin role if needed

---

## ✅ Verification Checklist

After completing manual steps, verify:

- [ ] Database tables exist (4 tables)
- [ ] Can start workflow via API
- [ ] Can get workflow status
- [ ] Can view execution history
- [ ] State transitions work
- [ ] Monitoring endpoints work

---

## 🎯 What Happens After Manual Steps

Once migration is applied:

1. **Workflow System Operational**
   - Can start workflows
   - Can track execution
   - Can monitor metrics

2. **API Endpoints Active**
   - `/api/workflows/start` - Start workflows
   - `/api/workflows/[id]/status` - Get status
   - `/api/workflows/metrics` - Get metrics
   - `/api/workflows/[id]/debug` - Debug workflows

3. **Ready for Integration**
   - Can integrate with article service
   - Can use workflow hooks
   - Can monitor production workflows

---

## 📞 Need Help?

**Check Documentation:**
- [Phase 3 Next Steps](./PHASE3_NEXT_STEPS.md)
- [Phase 3 Complete](./PHASE3_COMPLETE.md)
- [Workflow README](../lib/workflows/README.md)

**Common Commands:**
```bash
# Check migration status
supabase migration list

# Check database connection
supabase db ping

# View migration history
supabase migration list --db-url your-connection-string
```

---

## ⚡ Quick Start (TL;DR)

**Minimum Required:**
```bash
# 1. Apply migration
supabase migration up

# 2. Verify (optional)
npx tsx scripts/test-workflow-system.ts
```

**That's it!** The workflow system will be operational.

---

**Manual Steps Guide - January 14, 2026**

*Complete these steps to activate Phase 3*
