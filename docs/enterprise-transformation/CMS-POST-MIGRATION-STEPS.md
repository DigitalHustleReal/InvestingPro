# CMS Post-Migration Steps
**After Migration - What's Next?**

---

## ✅ Migration Complete!

**Tables Created:**
- ✅ `content_costs`
- ✅ `content_economics`
- ✅ `daily_budgets`
- ✅ `content_risk_scores`
- ✅ `content_diversity`

**Functions Created:**
- ✅ `calculate_content_roi()`
- ✅ `check_daily_budget()`
- ✅ `record_content_cost()`

---

## 🚀 Next Steps

### Step 1: Verify Migration ✅

**Option A: Via Supabase Dashboard**
1. Go to "Table Editor"
2. Verify these tables exist:
   - `content_costs`
   - `content_economics`
   - `daily_budgets`
   - `content_risk_scores`
   - `content_diversity`

**Option B: Via Script**
```bash
npm run cms:verify
```

---

### Step 2: Initialize CMS ✅

**This will:**
- Set default budget (1M tokens, 100 images, $50/day)
- Check system health
- Verify all agents

**Run:**
```bash
npm run cms:init
```

**Or manually set budget:**
```bash
curl -X POST http://localhost:3000/api/cms/budget \
  -H "Content-Type: application/json" \
  -d '{
    "maxTokensPerDay": 1000000,
    "maxImagesPerDay": 100,
    "maxCostPerDay": 50.00
  }'
```

---

### Step 3: Start Dev Server ✅

```bash
npm run dev
```

Server will start at: `http://localhost:3000`

---

### Step 4: Test System ✅

#### Test 1: Health Check
```bash
curl http://localhost:3000/api/cms/health
```

**Expected:**
```json
{
  "success": true,
  "health": {
    "overall": "healthy",
    "agents": [...],
    "budget": {...}
  }
}
```

#### Test 2: Budget Status
```bash
curl http://localhost:3000/api/cms/budget
```

**Expected:**
```json
{
  "success": true,
  "budget": {
    "maxTokensPerDay": 1000000,
    "maxImagesPerDay": 100,
    "maxCostPerDay": 50.00,
    "status": "active"
  }
}
```

#### Test 3: Canary Test (Recommended First)
```bash
curl -X POST http://localhost:3000/api/cms/orchestrator/canary \
  -H "Content-Type: application/json" \
  -d '{
    "goals": {
      "quality": 80
    }
  }'
```

**What it does:**
- Generates 1 article
- Limits budget to $5
- Tests full pipeline
- Safe test before full execution

---

### Step 5: Full Execution ✅

Once canary test passes:

```bash
curl -X POST http://localhost:3000/api/cms/orchestrator/execute \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "fully-automated",
    "goals": {
      "volume": 10,
      "quality": 80,
      "revenue": 1000
    }
  }'
```

---

## 📊 Monitoring

### Real-Time Monitoring

**Health:**
```bash
curl http://localhost:3000/api/cms/health
```

**Budget:**
```bash
curl http://localhost:3000/api/cms/budget
```

**Recent Cycles:**
```bash
curl http://localhost:3000/api/cms/orchestrator/execute
```

---

## 🎯 Quick Reference

**All Commands:**
```bash
# Verify
npm run cms:verify

# Initialize
npm run cms:init

# Start Server
npm run dev

# Test Canary
curl -X POST http://localhost:3000/api/cms/orchestrator/canary ...

# Full Execution
curl -X POST http://localhost:3000/api/cms/orchestrator/execute ...
```

---

## ✅ Checklist

- [x] Migration completed
- [ ] Migration verified
- [ ] CMS initialized
- [ ] Dev server started
- [ ] Health check passed
- [ ] Budget status checked
- [ ] Canary test passed
- [ ] Ready for full execution

---

**Status:** ✅ Migration Complete
**Next:** Initialize CMS and test
