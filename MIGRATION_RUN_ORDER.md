# Migration Run Order - Phase 1
## Execute in this exact sequence

**⚠️ IMPORTANT:** Run these migrations in Supabase SQL Editor in the exact order shown below.

---

## Step 0: Cleanup (Optional but Recommended)

**File:** `supabase/migrations/20260115_cleanup_before_rls_fix.sql`

**Purpose:** Drops any existing conflicting functions/policies

**When to run:** 
- If you're getting function conflicts
- If migrations have been partially run before
- First time setup (safe to skip if clean)

```sql
-- Run this first to clean up any conflicts
```

---

## Step 1: Fix RLS Policies

**File:** `supabase/migrations/20260115_fix_rls_policies.sql`

**What it does:**
- Creates `user_roles` table
- Creates `get_user_role()`, `is_admin()`, `is_editor()` functions
- Creates proper RLS policies for articles

**After running:**
```sql
-- Assign yourself admin role
INSERT INTO user_roles (user_id, role)
VALUES (auth.uid(), 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Verify it worked
SELECT get_user_role(); -- Should return 'admin'
SELECT is_admin(); -- Should return true
```

---

## Step 2: State Machine Enforcement

**File:** `supabase/migrations/20260116_state_machine_enforcement.sql`

**What it does:**
- Creates `article_status_history` table
- Creates `validate_article_status_transition()` function
- Creates trigger to enforce valid transitions

**Dependencies:** Requires `get_user_role()` from Step 1

**After running:**
```sql
-- Test state transition validation
-- This should work (if you're admin):
UPDATE articles SET status = 'published' WHERE id = 'some-id' AND status = 'draft';
```

---

## Step 3: System Settings & Workflow Ownership

**File:** `supabase/migrations/20260117_system_settings_and_workflow_ownership.sql`

**What it does:**
- Creates `system_settings` table
- Adds workflow assignment columns
- Creates `assign_workflow()` and `resolve_workflow()` functions

**Dependencies:** Requires `get_user_role()` from Step 1

**After running:**
```sql
-- Verify settings table exists
SELECT * FROM system_settings;

-- Should see default settings:
-- automation_paused: false
-- automation_cycle_interval_minutes: 1440
-- etc.
```

---

## ✅ Verification Checklist

After all migrations:

- [ ] `user_roles` table exists
- [ ] `get_user_role()` function works
- [ ] `is_admin()` returns true for your user
- [ ] `is_editor()` returns true for your user
- [ ] `article_status_history` table exists
- [ ] `system_settings` table exists
- [ ] Can create articles (as authenticated user)
- [ ] Can update own drafts (as author)
- [ ] Cannot update other users' articles (as author)
- [ ] Can publish articles (as admin/editor)

---

## 🐛 Troubleshooting

### Error: "function is_admin() does not exist"
**Solution:** Make sure Step 1 completed successfully. Re-run Step 1.

### Error: "cannot change name of input parameter"
**Solution:** Run the cleanup script (Step 0) first, then re-run migrations.

### Error: "permission denied"
**Solution:** Make sure you assigned yourself admin role after Step 1.

### Error: "relation user_roles does not exist"
**Solution:** Step 1 didn't complete. Re-run Step 1.

---

## 📝 Quick Reference

```sql
-- Check your role
SELECT get_user_role();

-- Assign admin role
INSERT INTO user_roles (user_id, role)
VALUES (auth.uid(), 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- List all roles
SELECT * FROM user_roles;

-- Check system settings
SELECT * FROM system_settings;
```

---

**Run migrations in order: 0 → 1 → 2 → 3**
