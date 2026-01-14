# Final Migration Fix - Handle Function Dependencies
## Resolving "cannot drop function because other objects depend on it"

**Error:** Policies depend on `is_admin(uuid)` function, preventing drop

---

## ✅ SOLUTION: Run Cleanup Script FIRST

The cleanup script has been updated to:
1. **Drop ALL dependent policies FIRST**
2. **Then drop functions with CASCADE**

---

## 📋 CORRECT EXECUTION ORDER

### Step 0: Run Cleanup (MANDATORY)

**File:** `supabase/migrations/20260115_cleanup_before_rls_fix.sql`

**What it does:**
- Drops ALL policies on `articles`, `user_profiles`, `system_settings`, `user_roles`
- Drops ALL function variants with CASCADE
- Drops triggers

**⚠️ IMPORTANT:** This is safe - we recreate everything in the next step.

**Run this FIRST in Supabase SQL Editor**

---

### Step 1: Fix RLS Policies

**File:** `supabase/migrations/20260115_fix_rls_policies.sql`

**What it does:**
- Creates `user_roles` table
- Creates new functions (`get_user_role()`, `is_admin()`, `is_editor()`)
- Creates proper RLS policies

**After running:**
```sql
-- Assign yourself admin role
INSERT INTO user_roles (user_id, role)
VALUES (auth.uid(), 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

---

### Step 2: State Machine Enforcement

**File:** `supabase/migrations/20260116_state_machine_enforcement.sql`

**Run this SECOND**

---

### Step 3: System Settings & Workflow Ownership

**File:** `supabase/migrations/20260117_system_settings_and_workflow_ownership.sql`

**Run this THIRD**

---

## 🔧 WHAT THE CLEANUP SCRIPT DROPS

### Policies Dropped:
- All `articles` table policies
- All `user_profiles` table policies (that use `is_admin(uuid)`)
- All `system_settings` table policies
- All `user_roles` table policies

### Functions Dropped (with CASCADE):
- `is_admin(uuid)` and `is_admin()`
- `is_editor(uuid)` and `is_editor()`
- `get_user_role(uuid)` and `get_user_role()`
- `assign_workflow(uuid, uuid)`
- `resolve_workflow(uuid)`
- `validate_article_status_transition(text, text, text)`

### Triggers Dropped:
- `enforce_article_status_transition_trigger`

---

## ⚠️ IMPORTANT NOTES

1. **Cleanup is Safe:** All dropped objects are recreated in subsequent migrations
2. **No Data Loss:** Dropping policies/functions doesn't delete data
3. **Temporary Access Loss:** You'll lose access briefly until Step 1 completes
4. **Run Quickly:** Run Step 0 → Step 1 in quick succession

---

## 🚀 QUICK START

```sql
-- 1. Run cleanup (Step 0)
-- Copy/paste: supabase/migrations/20260115_cleanup_before_rls_fix.sql

-- 2. Run RLS fix (Step 1)
-- Copy/paste: supabase/migrations/20260115_fix_rls_policies.sql

-- 3. Assign yourself admin role
INSERT INTO user_roles (user_id, role)
VALUES (auth.uid(), 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- 4. Verify
SELECT get_user_role(); -- Should return 'admin'
SELECT is_admin(); -- Should return true

-- 5. Run state machine (Step 2)
-- Copy/paste: supabase/migrations/20260116_state_machine_enforcement.sql

-- 6. Run system settings (Step 3)
-- Copy/paste: supabase/migrations/20260117_system_settings_and_workflow_ownership.sql
```

---

## ✅ VERIFICATION

After all steps:

```sql
-- Check functions exist
SELECT proname FROM pg_proc WHERE proname IN ('get_user_role', 'is_admin', 'is_editor');

-- Check your role
SELECT get_user_role();

-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('user_roles', 'article_status_history', 'system_settings');

-- Check policies exist
SELECT policyname FROM pg_policies WHERE tablename = 'articles';
```

---

**The cleanup script now handles all dependencies. Run it FIRST!**
