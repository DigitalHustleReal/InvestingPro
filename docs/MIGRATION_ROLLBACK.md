# Database Migration Rollback Playbook

## Overview

This document provides procedures for safely rolling back Supabase database migrations in case of issues during deployment.

---

## Pre-Rollback Checklist

Before initiating a rollback, verify the following:

- [ ] **Identify the problematic migration** - Which migration caused the issue?
- [ ] **Assess impact** - What data/features are affected?
- [ ] **Notify stakeholders** - Alert team members of the rollback
- [ ] **Create backup** - Ensure current state is backed up
- [ ] **Check dependencies** - Are other migrations dependent on this one?
- [ ] **Prepare rollback script** - Have the rollback SQL ready

---

## Rollback Procedures

### Method 1: Supabase Dashboard Rollback

For simple migrations that haven't affected data:

1. Go to Supabase Dashboard → Database → Migrations
2. Identify the migration to rollback
3. Click "Revert" if available
4. Verify the rollback was successful

### Method 2: Manual SQL Rollback

For complex migrations requiring custom rollback:

```sql
-- Example: Rolling back a column addition
ALTER TABLE articles DROP COLUMN IF EXISTS new_column;

-- Example: Rolling back an index
DROP INDEX IF EXISTS idx_articles_new_index;

-- Example: Rolling back a table creation
DROP TABLE IF EXISTS new_table CASCADE;

-- Example: Rolling back RLS policy
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

### Method 3: Point-in-Time Recovery (PITR)

For critical failures requiring full state restoration:

1. **Contact Supabase Support** for PITR (Pro plan required)
2. Specify the target timestamp (before migration)
3. Supabase will restore to that point
4. Re-apply any valid migrations after that point

---

## Common Rollback Scenarios

### Scenario 1: Failed Column Migration

**Problem:** New column caused application errors

```sql
-- Rollback
ALTER TABLE articles DROP COLUMN IF EXISTS problematic_column;

-- Verify
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'articles';
```

### Scenario 2: Bad Index Creation

**Problem:** Index causing performance issues

```sql
-- Rollback
DROP INDEX CONCURRENTLY IF EXISTS idx_problematic_index;

-- Verify
SELECT indexname FROM pg_indexes WHERE tablename = 'target_table';
```

### Scenario 3: RLS Policy Issues

**Problem:** RLS policy blocking legitimate access

```sql
-- Rollback
DROP POLICY IF EXISTS "problematic_policy" ON table_name;

-- Verify
SELECT * FROM pg_policies WHERE tablename = 'table_name';
```

### Scenario 4: Function/Trigger Rollback

**Problem:** New function causing errors

```sql
-- Rollback function
DROP FUNCTION IF EXISTS problematic_function CASCADE;

-- Rollback trigger
DROP TRIGGER IF EXISTS problematic_trigger ON table_name;
```

---

## Rollback Script Template

Create rollback scripts alongside migrations:

```
supabase/migrations/
├── 20260124_add_feature.sql           # Forward migration
└── 20260124_add_feature_rollback.sql  # Rollback script
```

**Rollback script template:**

```sql
-- Migration: 20260124_add_feature
-- Rollback Script
-- Author: [Your Name]
-- Date: [Date]
-- Description: Rollback for [feature description]

BEGIN;

-- Step 1: Remove new constraints
-- ALTER TABLE ... DROP CONSTRAINT ...

-- Step 2: Remove new columns
-- ALTER TABLE ... DROP COLUMN ...

-- Step 3: Remove new tables
-- DROP TABLE IF EXISTS ... CASCADE;

-- Step 4: Remove new indexes
-- DROP INDEX IF EXISTS ...;

-- Step 5: Remove new functions
-- DROP FUNCTION IF EXISTS ... CASCADE;

-- Step 6: Remove new policies
-- DROP POLICY IF EXISTS ... ON ...;

COMMIT;
```

---

## Post-Rollback Verification

After completing a rollback:

### 1. Database State Check

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check columns
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'affected_table';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'affected_table';
```

### 2. Application Health Check

```bash
# Run application health check
curl https://your-domain.com/api/health

# Check for errors in logs
# Vercel: Check deployment logs
# Sentry: Check for new errors
```

### 3. Data Integrity Check

```sql
-- Check row counts
SELECT COUNT(*) FROM affected_table;

-- Check for orphaned records
SELECT * FROM child_table 
WHERE parent_id NOT IN (SELECT id FROM parent_table);
```

---

## Emergency Contacts

| Role | Contact | Availability |
|------|---------|--------------|
| Database Admin | [Contact Info] | 24/7 |
| Lead Developer | [Contact Info] | Business Hours |
| Supabase Support | support@supabase.io | 24/7 (Pro plan) |

---

## Rollback Decision Matrix

| Severity | Impact | Action |
|----------|--------|--------|
| Critical | Production down | Immediate PITR or manual rollback |
| High | Feature broken, data at risk | Manual rollback within 1 hour |
| Medium | Performance degradation | Scheduled rollback |
| Low | Minor UI/UX issue | Fix forward instead of rollback |

---

## Best Practices

1. **Always test migrations** in staging before production
2. **Create rollback scripts** alongside forward migrations
3. **Use transactions** (`BEGIN`/`COMMIT`) for atomic rollbacks
4. **Document dependencies** between migrations
5. **Keep migrations small** - easier to rollback
6. **Never delete migration files** - keep history
7. **Use `IF EXISTS`/`IF NOT EXISTS`** for idempotent scripts

---

## Related Documentation

- [Supabase Migrations Guide](https://supabase.com/docs/guides/getting-started/local-development#database-migrations)
- [PostgreSQL ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
- [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md)
