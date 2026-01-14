# Database Setup Guide

## Overview

This guide walks you through setting up the InvestingPro database on Supabase.

---

## Prerequisites

- Supabase account and project created
- Supabase credentials (URL, anon key, service role key)
- Supabase CLI installed (optional, but recommended)

```bash
npm install -g supabase
```

---

## Step 1: Configure Environment Variables

Copy the production template:

```bash
cp env.production.template .env.local
```

Fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Step 2: Verify Connection

Test your Supabase connection:

```bash
tsx scripts/apply-migrations.ts
```

This validates all migration files and checks connectivity.

---

## Step 3: Apply Migrations

### Method 1: Supabase CLI (Recommended)

```bash
# Initialize Supabase locally
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Push all migrations
supabase db push
```

### Method 2: Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the SQL from each schema file in order:

**Core Tables (Apply First):**
- `lib/supabase/cms_schema.sql`
- `lib/supabase/user_profiles_schema.sql`

**Product Tables:**
- `lib/supabase/product_analytics_schema.sql`
- `lib/supabase/credit_card_schema.sql`
- `lib/supabase/mutual_fund_schema.sql`
- `lib/supabase/reviews_schema.sql`

**Content Tables:**
- `lib/supabase/article_advanced_schema.sql`
- `lib/supabase/pillar_page_schema.sql`
- `lib/supabase/migrations/glossary_expansion_investing.sql`
- `lib/supabase/migrations/glossary_expansion_new_categories.sql`

**CMS Features:**
- `lib/supabase/pipeline_runs_schema.sql`
- `lib/supabase/keyword_research_schema.sql`
- `lib/supabase/seo_integrations_schema.sql`
- `lib/supabase/social_automation_schema.sql`
- `lib/supabase/visual_content_schema.sql`
- `lib/supabase/rss_import_schema.sql`

**Monetization:**
- `lib/supabase/affiliate_complete_schema.sql`
- `lib/supabase/affiliate_product_schema.sql`
- `lib/supabase/ad_placement_schema.sql`

**Additional Features:**
- `lib/supabase/calculator_schema.sql`
- `lib/supabase/portfolio_schema.sql`
- `lib/supabase/leads_schema.sql`
- `lib/supabase/subscription_schema.sql`
- `lib/supabase/schema_driven_fields.sql`

### Method 3: Direct Postgres Connection

```bash
# Get connection string from Supabase Dashboard > Settings > Database
psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# Then run migrations
\i lib/supabase/cms_schema.sql
\i lib/supabase/user_profiles_schema.sql
# ... continue with other files
```

---

## Step 4: Verify Tables

Check that all tables were created:

```sql
-- In Supabase SQL Editor or psql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected tables:
- `authors`
- `categories`
- `articles`
- `products`
- `glossary_terms`
- `user_profiles`
- `reviews`
- `pipeline_runs`
- And ~20 more...

---

## Step 5: Enable Row Level Security (RLS)

Verify RLS is enabled on critical tables:

```sql
-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

For tables without RLS, enable it:

```sql
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
-- ... for other sensitive tables
```

---

## Step 6: Create RLS Policies

Apply the secure RLS policies:

```bash
# In Supabase SQL Editor, run:
```

```sql
-- Public read access to published articles
CREATE POLICY "Public articles are viewable by everyone" 
ON articles FOR SELECT 
USING (status = 'published');

-- Authenticated users can do everything
CREATE POLICY "Editors can do everything" 
ON articles FOR ALL 
USING (auth.role() = 'authenticated');

-- Apply similar policies to other tables as needed
```

See `lib/supabase/SECURE_RLS_POLICIES.sql` for complete policies.

---

## Step 7: Seed Initial Data

### Create Categories

```sql
INSERT INTO categories (name, slug, description) VALUES
('Mutual Funds', 'mutual-funds', 'Mutual fund investment guides'),
('Credit Cards', 'credit-cards', 'Credit card reviews and comparisons'),
('Insurance', 'insurance', 'Insurance product information'),
('Banking', 'banking', 'Banking and savings accounts'),
('Loans', 'loans', 'Personal and home loan information'),
('Investments', 'investments', 'Investment strategies and tips');
```

### Create Default Author

```sql
INSERT INTO authors (name, role, bio) VALUES
('Editorial Team', 'Editor', 'InvestingPro Editorial Team');
```

---

## Step 8: Create Admin User

Use the admin setup script:

```bash
tsx scripts/create-admin.ts
```

Or manually in Supabase Dashboard:
1. Go to Authentication > Users
2. Create a new user
3. Copy the user ID
4. Insert into user_profiles:

```sql
INSERT INTO user_profiles (id, email, role, display_name)
VALUES ('user-uuid-here', 'admin@investingpro.in', 'admin', 'Admin User');
```

---

## Step 9: Verify Setup

Run the verification script:

```bash
npm run cms:verify
```

This checks:
- Database connection
- Required tables exist
- RLS policies are active
- Initial data is seeded

---

## Troubleshooting

### Connection Refused

**Problem:** Cannot connect to Supabase

**Solution:**
- Verify credentials in `.env.local`
- Check Supabase project is active
- Verify IP is not blocked (check Supabase Dashboard > Settings > Database > Connection pooling)

### Table Already Exists

**Problem:** `ERROR: relation "articles" already exists`

**Solution:**
- Skip that migration (already applied)
- Or drop and recreate: `DROP TABLE IF EXISTS articles CASCADE;`

### Permission Denied

**Problem:** `ERROR: permission denied for table articles`

**Solution:**
- Use service role key, not anon key
- Verify RLS policies allow your operation

### Missing Extension

**Problem:** `ERROR: extension "uuid-ossp" does not exist`

**Solution:**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## Post-Setup Checklist

- [ ] All tables created successfully
- [ ] RLS enabled on sensitive tables
- [ ] RLS policies applied
- [ ] Initial categories seeded
- [ ] Default author created
- [ ] Admin user created
- [ ] Database connection verified
- [ ] Backup strategy in place

---

## Backup Strategy

### Automated Backups (Supabase)

Supabase automatically backs up your database daily (Pro plan and above).

### Manual Backup

```bash
# Export full database
supabase db dump -f backup.sql

# Export specific table
pg_dump -h db.xxx.supabase.co -U postgres -t articles > articles_backup.sql
```

### Point-in-Time Recovery

Available on Supabase Pro plan:
- Dashboard > Settings > Database > Point in Time Recovery

---

## Next Steps

After database setup is complete:
1. Run `tsx scripts/setup-production.ts` to verify environment
2. Test content generation pipeline
3. Deploy to staging environment
4. Run full QA pass

---

For more information, see:
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
