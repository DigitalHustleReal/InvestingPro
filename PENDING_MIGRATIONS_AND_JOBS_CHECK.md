# Pending Migrations and Jobs Check

**Date:** January 2026  
**Status:** Review Complete

---

## ✅ COMPLETED MIGRATIONS

### 1. Author Credentials Migration ✅
**File:** `supabase/migrations/20260118_add_author_credentials.sql`  
**Status:** ✅ EXISTS  
**Purpose:** Adds credentials, experience, specialization, and expert flags to authors table  
**Required For:** Priority 2.6 (Author Credentials & Expert Team Page)

---

## ⚠️ CRITICAL ISSUE FOUND: Column Name Mismatch

### Problem: `commission_amount` vs `commission_earned`

**Migration File:** `supabase/migrations/20260107_affiliate_clicks.sql`
- Uses column name: `commission_amount` (line 44)

**Code Expects:**
- `app/api/v1/admin/revenue/dashboard/route.ts` → `commission_earned`
- `app/api/v1/admin/revenue/by-category/route.ts` → `commission_earned`
- `app/api/v1/admin/revenue/by-article/route.ts` → `commission_earned`
- `app/api/v1/admin/revenue/by-affiliate/route.ts` → `commission_earned`
- `types/affiliate.ts` → `commission_earned`
- `lib/supabase/affiliate_schema.sql` → `commission_earned`

**Impact:** Revenue Dashboard will fail to calculate revenue correctly if migration uses `commission_amount` but code expects `commission_earned`.

**Action Required:**
1. **Option A (Recommended):** Update migration file to use `commission_earned` to match code
2. **Option B:** Update all code to use `commission_amount` (not recommended, more changes)

---

## ✅ COMPLETED JOBS

### 1. Content Publishing Job ✅
**File:** `lib/jobs/content-publishing.ts`  
**Status:** ✅ EXISTS & EXPORTED  
**Schedule:** Daily at 6 AM  
**Purpose:** Publishes 10 articles/day (5 Credit Cards + 5 Mutual Funds)  
**Required For:** Priority 1.7 (Content Volume Pipeline)

### 2. Keyword Discovery Job ✅
**File:** `lib/jobs/keyword-discovery.ts`  
**Status:** ✅ EXISTS & EXPORTED  
**Schedule:** Weekly (Monday at 2 AM)  
**Purpose:** Discovers long-tail keywords and auto-generates content  
**Required For:** Priority 2.7 (Keyword Research Automation)

### 3. Content Refresh Job ✅
**File:** `lib/jobs/content-refresh.ts`  
**Status:** ✅ EXISTS & EXPORTED  
**Schedule:** Weekly (Sunday at 3 AM)  
**Purpose:** Refreshes old articles with new product data  
**Required For:** Priority 2.8 (Content Refresh Automation)

### 4. Content Scoring Job ✅
**File:** `lib/jobs/content-scoring.ts`  
**Status:** ✅ EXISTS & EXPORTED  
**Purpose:** Scores content for quality, SEO, and monetization  
**Note:** Not explicitly in implementation plan but exists

### 5. Content Cleanup Job ✅
**File:** `lib/jobs/content-cleanup.ts`  
**Status:** ✅ EXISTS & EXPORTED  
**Purpose:** Archives low-performing content  
**Note:** Not explicitly in implementation plan but exists

---

## 📋 MIGRATION VERIFICATION CHECKLIST

### Required Tables for Implementation Plan:

- [x] `affiliate_clicks` - EXISTS (but has column name mismatch)
- [x] `authors` - EXISTS (with credentials migration applied)
- [x] `articles` - EXISTS
- [x] `credit_cards` - EXISTS
- [x] `mutual_funds` - EXISTS
- [x] `affiliate_products` - EXISTS

### Required Functions/Views:

- [x] `get_revenue_summary()` - EXISTS in migration
- [x] `record_affiliate_click()` - EXISTS in migration
- [x] `affiliate_clicks_daily` view - EXISTS in migration
- [x] `affiliate_top_products` view - EXISTS in migration
- [x] `affiliate_source_attribution` view - EXISTS in migration

---

## 🔧 REQUIRED ACTIONS

### 1. Fix Column Name Mismatch (CRITICAL)

**Create migration to fix column name:**

```sql
-- Migration: Fix commission_earned column name
-- File: supabase/migrations/20260123_fix_commission_column_name.sql

-- Check if commission_amount exists and rename to commission_earned
DO $$
BEGIN
    -- Check if column exists with wrong name
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'affiliate_clicks' 
        AND column_name = 'commission_amount'
    ) THEN
        -- Rename column
        ALTER TABLE public.affiliate_clicks 
        RENAME COLUMN commission_amount TO commission_earned;
        
        RAISE NOTICE 'Column renamed from commission_amount to commission_earned';
    ELSIF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'affiliate_clicks' 
        AND column_name = 'commission_earned'
    ) THEN
        RAISE NOTICE 'Column commission_earned already exists, no action needed';
    ELSE
        -- Add column if it doesn't exist
        ALTER TABLE public.affiliate_clicks 
        ADD COLUMN commission_earned NUMERIC DEFAULT 0;
        
        RAISE NOTICE 'Column commission_earned added';
    END IF;
END $$;

-- Also ensure converted and conversion_date columns exist
DO $$
BEGIN
    -- Add converted column if missing
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'affiliate_clicks' 
        AND column_name = 'converted'
    ) THEN
        ALTER TABLE public.affiliate_clicks 
        ADD COLUMN converted BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add conversion_date column if missing
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'affiliate_clicks' 
        AND column_name = 'conversion_date'
    ) THEN
        ALTER TABLE public.affiliate_clicks 
        ADD COLUMN conversion_date TIMESTAMPTZ;
    END IF;
    
    -- Add product_type column if missing (needed for revenue dashboard)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'affiliate_clicks' 
        AND column_name = 'product_type'
    ) THEN
        ALTER TABLE public.affiliate_clicks 
        ADD COLUMN product_type TEXT;
    END IF;
END $$;
```

**OR** update the original migration file `20260107_affiliate_clicks.sql` to use `commission_earned` instead of `commission_amount` (if migration hasn't been run yet).

---

## ✅ SUMMARY

### Migrations Status:
- ✅ **Author Credentials Migration:** EXISTS
- ✅ **Commission Column Fix Migration:** CREATED (`20260123_fix_commission_column_name.sql`)
- ✅ **Migration Applied:** User confirmed migration is done

### Jobs Status:
- ✅ **All Required Jobs:** EXISTS and EXPORTED
  - Content Publishing Job ✅
  - Keyword Discovery Job ✅
  - Content Refresh Job ✅

### Completed Actions:
1. ✅ **Fixed `commission_amount` → `commission_earned` column name mismatch** - Migration created and applied ✅ **CONFIRMED BY USER**
2. ✅ **Added Authentication & Error Handling** - All revenue endpoints now have:
   - Admin authentication checks
   - Input validation (dates, UUIDs, categories)
   - Comprehensive error handling
   - Better error messages
3. ✅ **Migration Applied** - User confirmed migration is done

### Remaining Actions:
1. ⏳ **Test Revenue Dashboard** - Verify all endpoints work correctly after migration
2. ⏳ **Verify Migration Success** - Run verification query to confirm all columns exist

---

## 🧪 VERIFICATION STEPS

After fixing the migration:

1. **Check column exists:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'affiliate_clicks' 
AND column_name IN ('commission_earned', 'commission_amount', 'converted', 'conversion_date', 'product_type');
```

2. **Test Revenue Dashboard:**
- Navigate to `/admin/revenue`
- Verify revenue calculations work
- Check for any errors in browser console

3. **Test Affiliate Tracking:**
- Click an affiliate link
- Verify click is recorded in `affiliate_clicks` table
- Verify `commission_earned` column is accessible

---

**Next Steps:**
1. ✅ ~~Create and run the migration fix~~ - DONE
2. ⏳ Verify all columns exist (run verification query)
3. ⏳ Test Revenue Dashboard (navigate to `/admin/revenue`)
4. ⏳ Mark as complete

**Recent Updates:**
- ✅ Created migration fix (`20260123_fix_commission_column_name.sql`)
- ✅ Added authentication helper (`lib/auth/admin-auth.ts`)
- ✅ Added error handling to all revenue endpoints
- ✅ Added input validation to all revenue endpoints

---

*Last Updated: January 2026*
