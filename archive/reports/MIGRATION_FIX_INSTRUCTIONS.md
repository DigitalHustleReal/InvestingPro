# Migration Fix Instructions
## Resolving SQL Function Errors

**Issue:** Function parameter name conflicts and missing function dependencies

---

## ✅ FIXED MIGRATIONS

I've created a fixed version of the first migration. Here's what to do:

### Step 1: Run Fixed Migration

**File:** `supabase/migrations/20260115_fix_rls_policies_FIXED.sql`

This migration:
- ✅ Drops existing functions first (avoids parameter conflicts)
- ✅ Creates functions with correct signatures
- ✅ Functions are called without parameters (use DEFAULT auth.uid())

**Run this FIRST in Supabase SQL Editor**

---

### Step 2: Run State Machine Migration

**File:** `supabase/migrations/20260116_state_machine_enforcement.sql`

This has been updated to:
- ✅ Call `get_user_role()` correctly
- ✅ Use `IS NOT DISTINCT FROM` for null-safe comparison
- ✅ Properly handle function dependencies

**Run this SECOND**

---

### Step 3: Run System Settings Migration

**File:** `supabase/migrations/20260117_system_settings_and_workflow_ownership.sql`

This has been updated to:
- ✅ Use direct role checks instead of function calls in policies (avoids dependency issues)
- ✅ Use `get_user_role()` in functions instead of `is_editor()`/`is_admin()`

**Run this THIRD**

---

## 🔧 WHAT WAS FIXED

### Problem 1: Function Parameter Name Conflict
**Error:** `cannot change name of input parameter "user_id"`

**Fix:** Added `DROP FUNCTION IF EXISTS` statements before creating functions to remove any existing versions with different signatures.

### Problem 2: Function Doesn't Exist
**Error:** `function is_editor() does not exist`

**Fix:** 
- Functions now created with no-parameter signatures (use DEFAULT)
- Updated all calls to match
- Used direct role checks in policies to avoid circular dependencies

---

## 📋 MIGRATION ORDER

Run migrations in this exact order:

1. ✅ `20260115_fix_rls_policies_FIXED.sql` (or update the original)
2. ✅ `20260116_state_machine_enforcement.sql` (already fixed)
3. ✅ `20260117_system_settings_and_workflow_ownership.sql` (already fixed)

---

## 🧪 TESTING

After running migrations, test:

```sql
-- Test 1: Check functions exist
SELECT get_user_role();
SELECT is_admin();
SELECT is_editor();

-- Test 2: Assign yourself admin role
INSERT INTO user_roles (user_id, role)
VALUES (auth.uid(), 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Test 3: Verify role
SELECT get_user_role(); -- Should return 'admin'
SELECT is_admin(); -- Should return true
SELECT is_editor(); -- Should return true
```

---

## ⚠️ IMPORTANT NOTES

1. **Backup First:** Always backup your database before running migrations
2. **Run in Order:** Migrations must run in sequence
3. **Test Functions:** Verify functions work after each migration
4. **Assign Roles:** Don't forget to assign admin role to your user after migration 1

---

## 🚀 QUICK FIX (If Errors Persist)

If you still get errors, run this cleanup first:

```sql
-- Drop all functions
DROP FUNCTION IF EXISTS is_admin(uuid);
DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS is_editor(uuid);
DROP FUNCTION IF EXISTS is_editor();
DROP FUNCTION IF EXISTS get_user_role(uuid);
DROP FUNCTION IF EXISTS get_user_role();
DROP FUNCTION IF EXISTS assign_workflow(uuid, uuid);
DROP FUNCTION IF EXISTS resolve_workflow(uuid);

-- Then run migrations in order
```

---

**All migrations are now fixed and ready to run!**
