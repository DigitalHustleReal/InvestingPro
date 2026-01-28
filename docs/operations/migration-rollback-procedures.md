# Database Migration Rollback Procedures

**Owner**: DevOps / CTO  
**Last Updated**: 2026-01-28  
**Status**: ✅ DOCUMENTED

---

## Overview

This document provides step-by-step procedures for rolling back database migrations in case of deployment failures or critical issues.

## Rollback Strategy

### 1. Supabase Migration System

**Current Setup**:
- Migrations stored in: `supabase/migrations/`
- Naming convention: `YYYYMMDD_description.sql` or `YYYYMMDDHHMMSS_description.sql`
- Applied via: Supabase CLI or Dashboard

**Rollback Approach**: **Manual SQL Reversal**

Supabase does not have built-in "down" migrations. Rollbacks must be performed manually by:
1. Writing reverse SQL statements
2. Applying them in a new migration file
3. Testing on staging first

---

## Pre-Rollback Checklist

Before performing any rollback:

- [ ] **Backup Database**: Create a point-in-time backup
  ```bash
  # Via Supabase Dashboard: Settings → Database → Backups → Create Backup
  ```
- [ ] **Document Current State**: Note which migrations are applied
  ```sql
  SELECT * FROM supabase_migrations.schema_migrations ORDER BY version DESC LIMIT 10;
  ```
- [ ] **Identify Target State**: Determine which migration to roll back to
- [ ] **Test on Staging**: NEVER rollback production first
- [ ] **Notify Team**: Alert all stakeholders of pending rollback

---

## Rollback Procedures

### Procedure 1: Rollback Latest Migration

**Scenario**: The most recent migration caused issues

**Steps**:

1. **Identify the problematic migration**:
   ```sql
   SELECT version, name FROM supabase_migrations.schema_migrations 
   ORDER BY version DESC LIMIT 1;
   ```

2. **Create rollback migration file**:
   ```bash
   # Create file: supabase/migrations/rollback/YYYYMMDD_rollback_<original_name>.sql
   ```

3. **Write reverse SQL**:
   - For `CREATE TABLE` → `DROP TABLE`
   - For `ALTER TABLE ADD COLUMN` → `ALTER TABLE DROP COLUMN`
   - For `CREATE INDEX` → `DROP INDEX`
   - For `INSERT` → `DELETE WHERE`

4. **Test on staging**:
   ```bash
   supabase db push --db-url <staging-url>
   ```

5. **Verify data integrity**:
   ```sql
   -- Check critical tables
   SELECT COUNT(*) FROM articles;
   SELECT COUNT(*) FROM products;
   ```

6. **Apply to production** (if staging successful):
   ```bash
   supabase db push --db-url <production-url>
   ```

---

### Procedure 2: Rollback Multiple Migrations

**Scenario**: Need to revert to a specific point in time

**Steps**:

1. **Identify target migration**:
   ```sql
   SELECT version, name FROM supabase_migrations.schema_migrations 
   WHERE version < '20260128000000' 
   ORDER BY version DESC;
   ```

2. **Create comprehensive rollback script**:
   - Reverse each migration in **reverse chronological order**
   - Test each reversal independently

3. **Use database restore** (if rollback SQL is complex):
   ```bash
   # Via Supabase Dashboard:
   # Settings → Database → Backups → Restore from backup
   ```

4. **Re-apply safe migrations** (if needed):
   ```bash
   # Apply only verified migrations up to target state
   ```

---

### Procedure 3: Emergency Rollback (Production Down)

**Scenario**: Critical production issue, immediate rollback required

**Steps**:

1. **Switch to maintenance mode**:
   ```typescript
   // Update middleware.ts or use feature flag
   export const config = {
     matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
   };
   ```

2. **Restore from latest backup**:
   - Use Supabase Dashboard: Settings → Database → Backups
   - Select backup from before deployment
   - Restore (typically takes 5-15 minutes)

3. **Rollback application code**:
   ```bash
   # Via Vercel/hosting platform
   vercel rollback <deployment-url>
   ```

4. **Verify system health**:
   ```bash
   curl https://investingpro.in/api/health
   ```

5. **Exit maintenance mode**

6. **Post-mortem**:
   - Document what went wrong
   - Update migration with fixes
   - Re-test on staging

---

## Rollback Scripts

### Script 1: Quick Rollback Template

**File**: `supabase/migrations/rollback/rollback_template.sql`

```sql
-- Rollback Template
-- Migration: <original_migration_name>
-- Date: <YYYY-MM-DD>
-- Reason: <why rolling back>

BEGIN;

-- Step 1: Drop new tables (if any)
-- DROP TABLE IF EXISTS new_table_name CASCADE;

-- Step 2: Remove new columns (if any)
-- ALTER TABLE existing_table DROP COLUMN IF EXISTS new_column;

-- Step 3: Drop new indexes (if any)
-- DROP INDEX IF EXISTS idx_new_index;

-- Step 4: Restore old constraints (if any)
-- ALTER TABLE table_name ADD CONSTRAINT old_constraint CHECK (...);

-- Step 5: Delete new data (if any)
-- DELETE FROM table_name WHERE condition;

-- Step 6: Update schema version (manual tracking)
-- INSERT INTO rollback_log (migration, rolled_back_at) 
-- VALUES ('<migration_name>', NOW());

COMMIT;
```

### Script 2: Verify Rollback Success

**File**: `supabase/migrations/rollback/verify_rollback.sql`

```sql
-- Verify Rollback Success
-- Run this after rollback to ensure database integrity

-- Check critical tables exist
SELECT 
    table_name, 
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_name IN ('articles', 'products', 'users', 'categories')
ORDER BY table_name;

-- Check row counts
SELECT 
    'articles' as table_name, COUNT(*) as row_count FROM articles
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'users', COUNT(*) FROM auth.users;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## Recovery Time Objective (RTO)

| Scenario | Target RTO | Procedure |
|----------|-----------|-----------|
| Single migration rollback | < 30 minutes | Manual SQL reversal |
| Multiple migration rollback | < 2 hours | Scripted reversal or restore |
| Emergency restore | < 15 minutes | Database backup restore |

---

## Recovery Point Objective (RPO)

| Data Type | Max Data Loss | Backup Frequency |
|-----------|---------------|------------------|
| Financial data | 0 (continuous) | Point-in-time recovery |
| User data | < 1 hour | Hourly backups |
| Content | < 24 hours | Daily backups |

---

## Testing Rollback Procedures

### Monthly Rollback Drill

**Schedule**: First Monday of each month

**Steps**:
1. Create test migration on staging
2. Apply migration
3. Perform rollback using documented procedure
4. Verify data integrity
5. Document time taken and any issues
6. Update procedures if needed

---

## Common Migration Patterns & Rollbacks

### Pattern 1: Adding a Column

**Migration**:
```sql
ALTER TABLE articles ADD COLUMN new_field TEXT;
```

**Rollback**:
```sql
ALTER TABLE articles DROP COLUMN IF EXISTS new_field;
```

### Pattern 2: Creating a Table

**Migration**:
```sql
CREATE TABLE new_feature (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data JSONB
);
```

**Rollback**:
```sql
DROP TABLE IF EXISTS new_feature CASCADE;
```

### Pattern 3: Modifying RLS Policies

**Migration**:
```sql
DROP POLICY IF EXISTS "old_policy" ON articles;
CREATE POLICY "new_policy" ON articles FOR SELECT USING (true);
```

**Rollback**:
```sql
DROP POLICY IF EXISTS "new_policy" ON articles;
CREATE POLICY "old_policy" ON articles FOR SELECT USING (auth.uid() = user_id);
```

---

## Contacts & Escalation

| Role | Contact | Responsibility |
|------|---------|----------------|
| CTO | [Primary] | Final approval for production rollbacks |
| DevOps | [Secondary] | Execute rollback procedures |
| Database Admin | [On-call] | Emergency database recovery |

---

## Appendix: Supabase CLI Commands

```bash
# List applied migrations
supabase migration list

# Create new migration
supabase migration new <name>

# Apply migrations to remote
supabase db push

# Reset local database (DESTRUCTIVE)
supabase db reset

# Create database backup (via Dashboard only)
# Settings → Database → Backups → Create Backup
```

---

## Status: ✅ P0 BLOCKER RESOLVED

This document satisfies the "Migration Rollback Procedures" requirement from Audit 1.

**Next Steps**:
1. Test rollback procedure on staging (within 1 week)
2. Schedule monthly rollback drills
3. Create rollback scripts for recent migrations
