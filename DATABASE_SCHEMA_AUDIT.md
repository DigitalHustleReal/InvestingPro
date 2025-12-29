# Database Schema Comprehensive Audit Report
**Date:** 2025-01-20  
**Scope:** All uploaded SQL schemas for InvestingPro CMS

---

## Executive Summary

### ✅ **What's Good**
- Comprehensive coverage of core business entities
- Good use of UUIDs, indexes, and constraints
- Strong RLS policy framework (with some fixes needed)
- Well-structured product data model with provenance tracking
- Good separation of concerns (products, content, users, monetization)

### ⚠️ **What's Bad**
- **CRITICAL:** Missing CMS automation tables (keyword research, RSS, SEO integrations, social media, visual content)
- Redundant/conflicting articles table definitions
- Overly permissive RLS policies (emergency fixes)
- Missing `update_updated_at_column()` function definition
- Inconsistent schema naming (some use `public.`, some don't)
- Missing foreign key constraints on some tables
- Duplicate/conflicting indexes

### 🔴 **What's Ugly**
- Emergency RLS fixes allowing `WITH CHECK (true)` - **MAJOR SECURITY RISK**
- Multiple conflicting article table definitions
- Inconsistent use of `TIMESTAMPTZ` vs `TIMESTAMP WITH TIME ZONE`
- Missing CMS automation infrastructure entirely
- No migration strategy documented

### 🔧 **What Needs Replacement**
- Emergency RLS policies → Proper role-based policies
- Multiple article table definitions → Single consolidated version
- Inconsistent function definitions → Standardized functions

### ➕ **What's Missing**
1. **CMS Automation Tables** (CRITICAL - Required for CMS features):
   - `keyword_research`, `keyword_clusters`, `title_variations`
   - `rss_feeds`, `rss_feed_items`, `rss_import_jobs`, `rss_article_generation_rules`
   - `seo_service_integrations`, `gsc_performance_data`, `google_trends_data`
   - `social_scheduler_integrations`, `social_media_accounts`, `repurposed_content`
   - `brand_color_palette`, `generated_images`, `generated_graphics`

2. **Supporting Infrastructure**:
   - Media library table
   - Content templates
   - Content performance tracking
   - A/B testing tables
   - Analytics aggregation tables

---

## Detailed Analysis

### 1. **Articles Table - CRITICAL ISSUES** 🔴

#### Problems:
1. **Multiple Conflicting Definitions**: You have 3+ different articles table definitions
   - Main schema (category check constraint missing newer categories)
   - User/content schema (has more categories)
   - Emergency fixes (overly permissive policies)

2. **Missing Fields from CMS Requirements**:
   ```sql
   -- MISSING but referenced in codebase:
   primary_keyword TEXT,
   secondary_keywords TEXT[],
   search_intent TEXT,
   category_id UUID, -- Some schemas have this, some don't
   published_at TIMESTAMPTZ, -- Some use published_date, some use published_at
   meta_title, meta_description, -- Some have these, some use seo_title/seo_description
   keywords TEXT[], -- Sometimes missing
   ```

3. **RLS Policy Issues**:
   ```sql
   -- UGLY: This allows ANYONE to insert articles - SECURITY RISK
   CREATE POLICY "Allow all inserts" ON articles FOR INSERT WITH CHECK (true);
   
   -- Also allows anyone to view/update all articles
   CREATE POLICY "Admins can view all articles" ON articles FOR SELECT USING (true);
   CREATE POLICY "Admins can update all articles" ON articles FOR UPDATE USING (true);
   ```

#### Recommendations:
```sql
-- CONSOLIDATED Articles Table (Recommended)
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Core Content
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    body_markdown TEXT, -- Alternative content format
    body_html TEXT, -- Rendered HTML
    
    -- Classification
    category TEXT NOT NULL CHECK (category IN (
        'mutual-funds', 'stocks', 'insurance', 'loans', 'credit-cards',
        'tax-planning', 'retirement', 'investing-basics', 'banking',
        'small-business', 'real-estate', 'gold-investments', 'nri-banking'
    )),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    language TEXT DEFAULT 'en' CHECK (language IN ('en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu')),
    tags TEXT[],
    
    -- SEO & Keywords (SCHEMA-DRIVEN FIELDS)
    primary_keyword TEXT,
    secondary_keywords TEXT[] DEFAULT '{}',
    search_intent TEXT CHECK (search_intent IN ('informational', 'commercial', 'transactional')),
    keywords TEXT[], -- Legacy/compatibility
    seo_title TEXT,
    seo_description TEXT,
    meta_title TEXT, -- Alternative field name
    meta_description TEXT, -- Alternative field name
    canonical_url TEXT,
    
    -- Media
    featured_image TEXT,
    read_time NUMERIC,
    
    -- Authorship & Moderation
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT,
    author_email TEXT,
    is_user_submission BOOLEAN DEFAULT FALSE,
    submission_status TEXT DEFAULT 'approved' CHECK (submission_status IN ('pending', 'approved', 'rejected', 'revision-requested')),
    rejection_reason TEXT,
    
    -- Publishing Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    published_date TIMESTAMPTZ, -- Alternative field name for compatibility
    
    -- Analytics & Tech
    views INTEGER DEFAULT 0,
    ai_generated BOOLEAN DEFAULT FALSE,
    
    -- Citations & Sources
    citations JSONB,
    data_sources JSONB,
    
    -- Monetization
    affiliate_products TEXT[],
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 2. **Missing update_updated_at_column() Function** ⚠️

#### Problem:
Many schemas reference `update_updated_at_column()` but it's not defined in the main schema.

#### Solution:
```sql
-- Add this to your main schema BEFORE any trigger definitions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

### 3. **CMS Automation Tables - COMPLETELY MISSING** 🔴🔴🔴

Based on your codebase (`lib/supabase/*.sql` files), these tables are REQUIRED but missing from uploaded schemas:

#### A. Keyword Research Tables
```sql
-- REQUIRED: keyword_research_schema.sql
CREATE TABLE IF NOT EXISTS keyword_research (...);
CREATE TABLE IF NOT EXISTS keyword_clusters (...);
CREATE TABLE IF NOT EXISTS article_keyword_clusters (...);
CREATE TABLE IF NOT EXISTS title_variations (...);
```

#### B. RSS Import Tables
```sql
-- REQUIRED: rss_import_schema.sql
CREATE TABLE IF NOT EXISTS rss_feeds (...);
CREATE TABLE IF NOT EXISTS rss_feed_items (...);
CREATE TABLE IF NOT EXISTS rss_import_jobs (...);
CREATE TABLE IF NOT EXISTS rss_article_generation_rules (...);
CREATE TABLE IF NOT EXISTS keyword_extractions (...);
```

#### C. SEO Integration Tables
```sql
-- REQUIRED: seo_integrations_schema.sql
CREATE TABLE IF NOT EXISTS seo_service_integrations (...);
CREATE TABLE IF NOT EXISTS gsc_performance_data (...);
CREATE TABLE IF NOT EXISTS gsc_issues (...);
CREATE TABLE IF NOT EXISTS google_trends_data (...);
```

#### D. Social Media Automation Tables
```sql
-- REQUIRED: social_automation_schema.sql
CREATE TABLE IF NOT EXISTS social_scheduler_integrations (...);
CREATE TABLE IF NOT EXISTS social_media_accounts (...);
CREATE TABLE IF NOT EXISTS repurposing_templates (...);
CREATE TABLE IF NOT EXISTS repurposed_content (...);
```

#### E. Visual Content Tables
```sql
-- REQUIRED: visual_content_schema.sql
CREATE TABLE IF NOT EXISTS brand_color_palette (...);
CREATE TABLE IF NOT EXISTS generated_images (...);
CREATE TABLE IF NOT EXISTS generated_graphics (...);
CREATE TABLE IF NOT EXISTS graphic_templates (...);
```

#### F. Additional Missing Tables
```sql
-- Referenced in social_automation_schema.sql but not defined:
CREATE TABLE IF NOT EXISTS content_distributions (...);

-- Referenced for pillar pages:
-- Pillar page fields should be added via ALTER TABLE (see pillar_page_schema.sql)

-- Pipeline runs tracking:
CREATE TABLE IF NOT EXISTS pipeline_runs (...);
```

**ACTION REQUIRED:** You must add ALL of these tables from your `lib/supabase/` schema files!

---

### 4. **RLS Policy Security Issues** 🔴

#### Critical Problems:

1. **Overly Permissive Policies** (Emergency fixes):
   ```sql
   -- DANGEROUS: Allows anyone to insert articles
   CREATE POLICY "Allow all inserts" ON articles FOR INSERT WITH CHECK (true);
   
   -- DANGEROUS: Allows anyone to view/update all articles
   CREATE POLICY "Admins can view all articles" ON articles FOR SELECT USING (true);
   CREATE POLICY "Admins can update all articles" ON articles FOR UPDATE USING (true);
   ```

2. **Inconsistent Admin Checks**:
   - Some use: `auth.jwt() ->> 'role' = 'admin'`
   - Some use: `EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')`
   - Some use: `auth.role() = 'service_role'`

#### Recommended Secure Policies:
```sql
-- Drop dangerous policies
DROP POLICY IF EXISTS "Allow all inserts" ON articles;
DROP POLICY IF EXISTS "Admins can view all articles" ON articles;
DROP POLICY IF EXISTS "Admins can update all articles" ON articles;

-- Secure INSERT policy
CREATE POLICY "Authenticated users can create articles"
ON articles FOR INSERT
WITH CHECK (
    auth.role() = 'authenticated' OR
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- Secure SELECT policy
CREATE POLICY "Public can view published articles"
ON articles FOR SELECT
USING (
    (status = 'published' AND submission_status = 'approved') OR
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- Secure UPDATE policy
CREATE POLICY "Users can update own drafts or admins can update all"
ON articles FOR UPDATE
USING (
    (auth.uid() = author_id AND status = 'draft') OR
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- Service role bypass (for API routes)
CREATE POLICY "Service role has full access"
ON articles FOR ALL
USING (auth.role() = 'service_role');
```

---

### 5. **Schema Consistency Issues** ⚠️

#### Problems:

1. **Inconsistent Schema Prefixes**:
   - Some tables use `public.articles`
   - Some use just `articles`
   - **Recommendation:** Use `public.` prefix consistently

2. **Inconsistent Timestamp Types**:
   - Some use `TIMESTAMPTZ`
   - Some use `TIMESTAMP WITH TIME ZONE`
   - **Recommendation:** Use `TIMESTAMPTZ` (shorter, same functionality)

3. **Inconsistent UUID Generation**:
   - Some use `uuid_generate_v4()`
   - Some use `gen_random_uuid()`
   - **Recommendation:** Use `uuid_generate_v4()` if extension enabled, otherwise `gen_random_uuid()`

4. **Missing Foreign Key Constraints**:
   - `articles.category_id` → `categories.id` (sometimes missing)
   - `reviews.product_id` → No foreign key constraint
   - `affiliate_clicks.product_id` → No foreign key constraint

---

### 6. **Index Issues** ⚠️

#### Problems:

1. **Duplicate Indexes**:
   ```sql
   -- Multiple definitions of same index
   CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
   CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug); -- Duplicate
   ```

2. **Missing Composite Indexes**:
   ```sql
   -- Should have composite index for common queries
   CREATE INDEX idx_articles_status_category ON articles(status, category) WHERE status = 'published';
   ```

3. **Missing Partial Indexes**:
   ```sql
   -- More efficient for filtered queries
   CREATE INDEX idx_articles_published_active ON articles(published_at DESC) 
   WHERE status = 'published' AND submission_status = 'approved';
   ```

---

### 7. **Storage Bucket Policies** ✅

The storage bucket policies look reasonable:
```sql
CREATE POLICY "Public can view images" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Public can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');
CREATE POLICY "Public can delete images" ON storage.objects FOR DELETE USING (bucket_id = 'media');
```

**⚠️ Security Note:** The upload/delete policies are marked for development only. Consider restricting in production:
```sql
-- Production-ready policies
CREATE POLICY "Public can view images" ON storage.objects FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete" ON storage.objects FOR DELETE 
USING (bucket_id = 'media' AND EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));
```

---

### 8. **Data Model Strengths** ✅

#### Good Practices:

1. **Provenance Tracking**: Excellent use of `data_sources` and `product_data_points` tables
2. **Versioning**: Rankings table has versioning built-in
3. **Flexibility**: Good use of JSONB for flexible data storage
4. **Search**: Full-text search indexes with `tsvector`
5. **Audit Trail**: `raw_data_snapshots` table for debugging

---

### 9. **Migration Strategy Needed** ⚠️

**Missing:**
- Version numbering system
- Migration rollback scripts
- Dependency order documentation
- Testing strategy

**Recommendation:**
```
supabase/
  migrations/
    000_base_schema.sql          -- Core tables (products, users)
    001_cms_schema.sql            -- Articles, categories, authors
    002_cms_automation.sql        -- Keyword research, RSS, SEO
    003_monetization.sql          -- Affiliates, ads
    004_analytics.sql             -- Tracking, performance
```

---

## Priority Fix List

### 🔴 **CRITICAL (Fix Immediately)**

1. ✅ **Remove emergency RLS policies** - Replace with secure role-based policies
2. ✅ **Add missing CMS automation tables** - Copy from `lib/supabase/*.sql` files
3. ✅ **Consolidate articles table** - Single definition with all required fields
4. ✅ **Add `update_updated_at_column()` function** - Required by triggers

### ⚠️ **HIGH PRIORITY (Fix Soon)**

5. ✅ **Fix foreign key constraints** - Add missing FK constraints
6. ✅ **Standardize schema naming** - Use `public.` prefix consistently
7. ✅ **Fix duplicate indexes** - Remove redundant index definitions
8. ✅ **Add missing indexes** - Composite and partial indexes for performance

### 📋 **MEDIUM PRIORITY (Plan For)**

9. ✅ **Add media library table** - For better asset management
10. ✅ **Add content templates** - For article generation rules
11. ✅ **Add analytics aggregation tables** - For performance tracking
12. ✅ **Document migration strategy** - Version control and rollback

---

## Recommended Schema Execution Order

```sql
-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Core Functions
CREATE OR REPLACE FUNCTION update_updated_at_column() ...;

-- 3. Core Tables (no dependencies)
CREATE TABLE data_sources ...;
CREATE TABLE products ...;
CREATE TABLE categories ...;
CREATE TABLE authors ...;

-- 4. User Tables
CREATE TABLE user_profiles ...;
CREATE TABLE user_subscriptions ...;

-- 5. Product Tables (depends on products)
CREATE TABLE credit_cards ...;
CREATE TABLE mutual_funds ...;
CREATE TABLE product_data_points ...;

-- 6. Content Tables (depends on users, categories)
CREATE TABLE articles ...; -- CONSOLIDATED VERSION

-- 7. CMS Automation Tables (depends on articles)
CREATE TABLE keyword_research ...;
CREATE TABLE rss_feeds ...;
CREATE TABLE seo_service_integrations ...;
-- etc.

-- 8. Monetization Tables
CREATE TABLE affiliate_products ...;
CREATE TABLE ad_placements ...;

-- 9. RLS Policies (after all tables exist)
ALTER TABLE ... ENABLE ROW LEVEL SECURITY;
CREATE POLICY ...;

-- 10. Indexes (after tables and policies)
CREATE INDEX ...;
```

---

## Final Recommendations

1. **Create a single consolidated schema file** that includes all tables in proper dependency order
2. **Remove all emergency RLS fixes** and implement proper role-based security
3. **Add all missing CMS automation tables** from your codebase
4. **Test migrations** in a development environment before production
5. **Document dependencies** between tables clearly
6. **Version control** your schema changes properly
7. **Review security policies** with your team before deployment

---

## Questions for Clarification

1. Do you want to keep the `authors` table separate from `user_profiles`, or consolidate?
2. Should `reviews.product_id` reference `products.id` or specific product tables?
3. What's the relationship between `products` table and specific product tables (`credit_cards`, `mutual_funds`)?
4. Should `category_id` in articles reference `categories.id` or be TEXT only?
5. Do you need both `published_at` and `published_date` fields, or can we standardize?

---

**End of Audit Report**

