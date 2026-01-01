# Database Migrations - Execution Guide

## Overview

This directory contains all SQL migrations for the InvestingPro application. Run them in order to set up a complete database schema.

## Migration Files

| Order | File | Description |
|-------|------|-------------|
| 1 | `20260101_consolidated_schema.sql` | Core tables: products, articles, reviews, users |
| 2 | `20260101_schema_fixes.sql` | Article enhancements + Analytics + RSS + Ads |
| 3 | `20260101_monetization_schema.sql` | Affiliate partners, links, and click tracking |
| 4 | `20260101_engagement_schema.sql` | Newsletter, bookmarks, notifications |
| 5 | `20260101_rpc_functions.sql` | **⚠️ REQUIRED** Admin dashboard RPCs, search functions |

## How to Run

### Option 1: Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy and paste contents of each migration file in order
6. Click **Run** (or press `Ctrl+Enter`)

### Option 2: Supabase CLI

```bash
# Push all migrations
supabase db push
```

### Option 3: Direct psql

```bash
# Run each file in order
psql -h <your-supabase-host> -U postgres -d postgres \
  -f supabase/migrations/20260101_consolidated_schema.sql

psql -h <your-supabase-host> -U postgres -d postgres \
  -f supabase/migrations/20260101_schema_fixes.sql

psql -h <your-supabase-host> -U postgres -d postgres \
  -f supabase/migrations/20260101_monetization_schema.sql

psql -h <your-supabase-host> -U postgres -d postgres \
  -f supabase/migrations/20260101_engagement_schema.sql
```

## Tables Created

### Core (consolidated_schema)
- `data_sources` - Data provenance
- `authors` - CMS authors
- `categories` - Content categories
- `products` - Universal product table
- `credit_cards` - Credit card details
- `mutual_funds` - Mutual fund details
- `personal_loans` - Loan details
- `articles` - CMS articles
- `reviews` - User reviews
- `user_profiles` - User data
- `calculator_results` - Calculator usage
- `pipeline_runs` - Automation logs
- `affiliate_clicks` - Basic click tracking

### Analytics & RSS (schema_fixes)
- `article_views` - Detailed view events
- `article_analytics` - Aggregated metrics
- `rss_feeds` - RSS feed configs
- `rss_items` - Imported items
- `rss_jobs` - Import job logs
- `ad_placements` - Ad management
- `content_calendar` - Editorial calendar
- `social_schedulers` - Social posting

### Monetization (monetization_schema)
- `affiliate_partners` - Partner programs
- `affiliate_links` - Trackable short links
- `affiliate_clicks` - Click events (extended)

### Engagement (engagement_schema)
- `newsletter_subscribers` - Email subscriptions
- `bookmarks` - Saved articles
- `reading_progress` - Read tracking
- `notifications` - User notifications
- `user_preferences` - User settings

## Verification

After running all migrations, verify with:

```sql
-- Count tables
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public';
-- Expected: ~25+

-- List all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Test key tables
SELECT COUNT(*) FROM articles;
SELECT COUNT(*) FROM newsletter_subscribers;
SELECT COUNT(*) FROM affiliate_partners;
```

## Seed Data

The `monetization_schema` includes sample affiliate partners:
- Groww (Mutual Funds)
- Zerodha (Stocks)
- ICICI Prudential (Mutual Funds)
- HDFC Bank (Credit Cards)
- Bajaj Finserv (Loans)

## Troubleshooting

### "Table already exists"
Migrations use `IF NOT EXISTS` - safe to re-run.

### "Column already exists"
The schema_fixes migration uses `ADD COLUMN IF NOT EXISTS` - safe to re-run.

### "auth.users does not exist"
Make sure Supabase Auth is enabled in your project settings.

### RLS Policy errors
Some policies may already exist. You can drop and recreate them:
```sql
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

## Legacy Migrations

The `legacy/` folder contains old migration files that are superseded by the consolidated schema. Do not run these.
