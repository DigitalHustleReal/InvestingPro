# Complete Database Schema

## Overview

This file (`000_complete_schema.sql`) contains **all-inclusive SQL** for creating the complete InvestingPro database schema. It includes:

- ✅ 25+ tables covering all features
- ✅ All indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Triggers and functions
- ✅ Proper foreign key relationships
- ✅ Extensions (UUID, pg_trgm, vector)

## How to Use

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy and paste the entire contents of `000_complete_schema.sql`
6. Click **Run** (or press `Ctrl+Enter`)

### Option 2: Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

### Option 3: psql Command Line

```bash
psql -h <your-supabase-host> -U postgres -d postgres -f supabase/migrations/000_complete_schema.sql
```

## Tables Included

### Core Product Tables
- `products` - Unified product table
- `product_data_points` - Provenance tracking for all data
- `data_sources` - Source tracking
- `raw_data_snapshots` - Audit trail

### Product-Specific Tables
- `credit_cards` - Credit card details
- `mutual_funds` - Mutual fund details
- `personal_loans` - Personal loan details

### User Management
- `user_profiles` - User profile information
- `user_subscriptions` - Stripe subscription management

### Content Management
- `articles` - Articles and guides
- `content` - Alternative content table
- `authors` - Author information
- `categories` - Content categories
- `comparisons` - Product comparisons

### Analytics & Tracking
- `rankings` - Product rankings
- `ranking_configurations` - Ranking methodology
- `reviews` - User reviews
- `calculator_results` - Calculator usage tracking
- `affiliate_clicks` - Affiliate click tracking
- `ad_placements` - Ad management

### Financial Data
- `live_rates` - Live interest rates
- `inflation_data` - Inflation tracking

### Portfolio Management
- `portfolios` - User portfolio holdings
- `assets` - Universal asset model
- `asset_price_history` - Price history for assets

### Monetization
- `affiliate_products` - Affiliate product inventory

## Features

### Row Level Security (RLS)
All tables have RLS enabled with appropriate policies:
- Public read access for published content
- User-specific access for portfolios and profiles
- Admin-only access for management operations
- Service role access for automated operations

### Automatic Triggers
- `updated_at` timestamps automatically updated
- User profile creation on signup
- Data completeness score calculation

### Performance Indexes
- Full-text search indexes
- Foreign key indexes
- Composite indexes for common queries
- GIN indexes for JSONB and arrays

## Important Notes

1. **Idempotent**: The script uses `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS`, so it's safe to run multiple times.

2. **Dependencies**: Tables are created in the correct order to handle foreign key dependencies.

3. **Auth Integration**: Some tables reference `auth.users` which is managed by Supabase Auth. Make sure Supabase Auth is enabled.

4. **Service Role**: Some operations require the `service_role` key. Keep this secure and never expose it in client-side code.

5. **RLS Policies**: Review and adjust RLS policies based on your security requirements.

## Verification

After running the schema, verify it worked:

```sql
-- Check table count
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check specific tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Test a query
SELECT * FROM products LIMIT 1;
```

## Next Steps

1. **Seed Data**: Add initial data to your tables
2. **Test RLS**: Verify RLS policies work as expected
3. **Set Up Scrapers**: Configure data sources and scrapers
4. **Configure Stripe**: Set up subscription products
5. **Add Content**: Start creating articles and guides

## Support

If you encounter any issues:
1. Check Supabase logs in the dashboard
2. Verify all extensions are enabled
3. Ensure Supabase Auth is properly configured
4. Review RLS policies if you have permission issues

