# Database Schema Execution Order

## ⚠️ IMPORTANT: Execute in this exact order!

### Step 1: Run `SCHEMA_FIXES_REQUIRED.sql`
**What it fixes:**
- ✅ Adds `update_updated_at_column()` function
- ✅ Removes dangerous RLS policies
- ✅ Adds secure RLS policies for articles
- ✅ Adds missing columns to articles table
- ✅ Adds missing indexes
- ✅ Fixes foreign key constraints

**Status after Step 1:**
- ✅ Security issues fixed
- ✅ Articles table complete
- ❌ CMS automation tables still missing

---

### Step 2: Run `ADD_CMS_AUTOMATION_TABLES.sql`
**What it adds:**
- ✅ Keyword research tables
- ✅ RSS import tables
- ✅ SEO integration tables
- ✅ Social media automation tables
- ✅ Visual content generation tables
- ✅ Pipeline runs table
- ✅ Content distributions table
- ✅ All RLS policies and triggers

**Status after Step 2:**
- ✅ All security issues fixed
- ✅ Articles table complete
- ✅ All CMS automation tables added
- ✅ **ALL ISSUES FIXED!** 🎉

---

## Summary

**Question:** Will running `SCHEMA_FIXES_REQUIRED.sql` fix all issues?

**Answer:** **NO** - It fixes security and articles table issues, but you MUST also run `ADD_CMS_AUTOMATION_TABLES.sql` to add all missing CMS automation tables.

**To fix everything:**
1. Run `SCHEMA_FIXES_REQUIRED.sql` first
2. Then run `ADD_CMS_AUTOMATION_TABLES.sql`
3. ✅ All issues will be fixed!

---

## What Each Script Does

### `SCHEMA_FIXES_REQUIRED.sql`
- Security fixes (RLS policies)
- Articles table enhancements
- Missing columns and indexes
- Function definitions

### `ADD_CMS_AUTOMATION_TABLES.sql`
- All CMS automation tables
- Keyword research infrastructure
- RSS import system
- SEO integrations
- Social media automation
- Visual content generation
- Pipeline tracking

---

## Verification

After running both scripts, verify by checking:
```sql
-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'keyword_research', 'rss_feeds', 'seo_service_integrations',
    'social_scheduler_integrations', 'brand_color_palette', 'pipeline_runs'
);

-- Should return 6 rows
```

---

## Notes

- Both scripts use `IF NOT EXISTS` so they're safe to run multiple times
- Scripts are idempotent (can be re-run safely)
- All foreign key constraints are properly defined
- All indexes are optimized for performance
- RLS policies are secure and role-based



