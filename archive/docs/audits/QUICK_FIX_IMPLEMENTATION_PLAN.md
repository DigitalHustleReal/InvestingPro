# 🚀 Quick Fix Implementation Plan

## Immediate Actions (Today)

### 1. Fix Widget Mock Data (30 minutes)
**Impact:** HIGH - Users will see real data immediately

**Files to Update:**
- `components/rates/RatesWidget.tsx`
- `components/news/ContextualNewsWidget.tsx`

**Action:** Create API endpoints and connect widgets

### 2. Fix Article Visibility (15 minutes)
**Impact:** HIGH - Articles will show on pages

**Action:** Run SQL to fix published_at and submission_status

### 3. Create Missing API Endpoints (1 hour)
**Impact:** HIGH - Enables real data in widgets

**Files to Create:**
- `app/api/rates/[category]/route.ts`
- `app/api/news/[category]/route.ts`

---

## Implementation Order

1. ✅ Fix article visibility (SQL fix)
2. ✅ Create rates API endpoint
3. ✅ Create news API endpoint  
4. ✅ Update RatesWidget to use API
5. ✅ Update ContextualNewsWidget to use API
6. ⏳ Set up basic scraper for rates (later)
7. ⏳ Set up RSS feed for news (later)

---

## Quick SQL Fixes

Run these in Supabase SQL Editor:

```sql
-- Fix published_at for published articles
UPDATE articles 
SET published_at = COALESCE(published_at, published_date, created_at)
WHERE status = 'published' AND published_at IS NULL;

-- Fix submission_status for published articles
UPDATE articles 
SET submission_status = 'approved' 
WHERE status = 'published' AND (submission_status IS NULL OR submission_status != 'approved');
```

---

## Next Steps After Quick Fixes

1. Implement real scrapers
2. Set up cron jobs
3. Add article widgets to category pages
4. Implement content density features
