# Database Setup & Migration Guide

## 🎯 Overview

This guide covers setting up the database for the autonomous intelligence platform.

---

## 📋 Prerequisites

- Supabase project created
- Service role key (from Supabase dashboard)
- Environment variables configured

---

## 🚀 Quick Start

### Step 1: Set Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 2: Run Migrations

```bash
# Install dependencies
npm install

# Run migrations
npm run db:migrate

# Or manually:
npx tsx scripts/run-migrations.ts
```

---

## 📊 Tables Created

### Engagement Tracking
- `engagement_metrics` - Individual session metrics
- `article_performance` - Aggregated article stats

### Automation & Approval
- `automation_settings` - System configuration
- `approval_queue` - Human review workflow
- `ab_tests` - A/B testing data
- `ai_prompt_improvements` - Learned patterns

### Indexes Added
- Article indexes (category, status, published_at)
- Credit card indexes (issuer, type, rating)
- Mutual fund indexes (category, fund_house, risk_level)
- Broker indexes (type, rating)
- Engagement indexes (article_id, user_id, session_id)

---

## 🔒 Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

**Engagement Metrics:**
- Anyone can insert (anonymous tracking)
- Users can view their own data

**Article Performance:**
- Public read access
- Admin-only write access

**Admin Tables:**
- Approval queue, A/B tests, automation settings
- Admin-only access

---

## 🛠️ Manual Migration (Alternative)

If the script fails, run SQL manually in Supabase SQL Editor:

1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/001_autonomous_intelligence_tables.sql`
3. Paste and run

---

## ✅ Verify Migration

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN (
  'engagement_metrics',
  'article_performance',
  'approval_queue',
  'ab_tests',
  'automation_settings'
);

-- Check indexes
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%';

-- Check RLS policies
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

---

## 🔄 Rollback (If Needed)

```sql
-- Drop autonomous intelligence tables
DROP TABLE IF EXISTS engagement_metrics CASCADE;
DROP TABLE IF EXISTS article_performance CASCADE;
DROP TABLE IF EXISTS approval_queue CASCADE;
DROP TABLE IF EXISTS ab_tests CASCADE;
DROP TABLE IF EXISTS ai_prompt_improvements CASCADE;
DROP TABLE IF EXISTS automation_settings CASCADE;

-- Drop indexes
DROP INDEX IF EXISTS idx_engagement_article_id;
DROP INDEX IF EXISTS idx_engagement_user_id;
-- ... (drop all indexes)
```

---

## 📈 Performance Monitoring

### Check Index Usage
```sql
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

### Check Table Sizes
```sql
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🐛 Troubleshooting

### Error: "relation already exists"
```bash
# Tables already created, skip migration or drop and recreate
```

### Error: "permission denied"
```bash
# Check service role key is correct
# Ensure you're using service role key, not anon key
```

### Error: "function exec_sql does not exist"
```sql
-- Create the function in Supabase SQL Editor:
CREATE OR REPLACE FUNCTION exec_sql(sql_string text)
RETURNS void AS $$
BEGIN
  EXECUTE sql_string;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 📝 Next Steps

After migration:

1. ✅ Verify all tables created
2. ✅ Check RLS policies active
3. ✅ Test engagement tracking
4. ✅ Configure automation settings
5. ✅ Initialize autonomous systems

---

**Migration Version:** 001  
**Tables Created:** 6  
**Indexes Added:** 20+  
**RLS Policies:** 10+
