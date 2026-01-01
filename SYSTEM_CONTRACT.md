# InvestingPro Application System Contract

**Document Purpose**: Describes all database assumptions made by the InvestingPro application codebase. This contract defines what the application expects from the database schema, RLS policies, default values, and admin visibility requirements.

**Scope**: Frontend (Next.js), Admin CMS UI, API routes, Content pipelines, Automation logic

**Out of Scope**: Supabase RLS evaluation details, Live data policies beyond schema expectations, Database-side defaults beyond documented assumptions

---

## Tables Assumed

The application assumes the following tables exist with the specified structure:

### Core Product Tables
- **products** - Unified product table with type discriminator
- **product_data_points** - Individual data fields with provenance tracking
- **data_sources** - Provenance tracking for data sources
- **credit_cards** - Type-specific credit card data
- **mutual_funds** - Type-specific mutual fund data
- **personal_loans** - Type-specific personal loan data

### Content Management Tables
- **articles** - Main content table for articles, guides, educational content
- **content** - Alternative content table (articles, FAQs, guides, comparisons)
- **authors** - CMS author information
- **categories** - CMS category information
- **glossary_terms** - Glossary term definitions

### User & Authentication Tables
- **user_profiles** - User profile information extending Supabase auth.users
- **user_subscriptions** - Stripe subscription management

### Ranking & Comparison Tables
- **ranking_configurations** - Versioned ranking configurations
- **rankings** - Versioned ranking results
- **comparisons** - Product comparison snapshots

### Reviews & Moderation Tables
- **reviews** - Product reviews with moderation status

### Portfolio & Asset Tables
- **portfolios** - User portfolio holdings
- **assets** - Universal asset model (Ghost Infrastructure)
- **asset_price_history** - Historical price data for assets

### Monetization Tables
- **affiliate_products** - Affiliate product inventory
- **affiliate_clicks** - Affiliate click tracking
- **ad_placements** - Advertisement placement configuration

### Calculator & Rate Tables
- **calculator_results** - Calculator calculation results
- **live_rates** - Live financial rates
- **inflation_data** - Inflation rate data

### CMS Automation Tables
- **keyword_research** - Keyword research data
- **keyword_clusters** - Keyword cluster definitions
- **title_variations** - Generated title variations
- **rss_feeds** - RSS feed configurations
- **rss_feed_items** - Imported RSS feed items
- **keyword_extractions** - Extracted keywords from content
- **rss_import_jobs** - RSS import job tracking
- **rss_article_generation_rules** - Rules for RSS-to-article generation
- **seo_service_integrations** - SEO service integration configs
- **gsc_performance_data** - Google Search Console performance data
- **gsc_issues** - Google Search Console issues tracking
- **google_trends_data** - Google Trends data
- **social_scheduler_integrations** - Social media scheduler integrations
- **social_media_accounts** - Social media account configurations
- **repurposing_templates** - Content repurposing templates
- **repurposed_content** - Repurposed social media content
- **content_distributions** - Content distribution tracking
- **brand_color_palette** - Brand color definitions
- **generated_images** - AI-generated images
- **generated_graphics** - Generated graphics
- **graphic_templates** - Graphic template definitions
- **pipeline_runs** - Pipeline execution tracking

### Audit & Snapshot Tables
- **raw_data_snapshots** - Full HTML/JSON snapshots for audit trail

---

## Columns Assumed

### products
- `id` (UUID, PRIMARY KEY)
- `slug` (TEXT, UNIQUE, NOT NULL)
- `name` (TEXT, NOT NULL)
- `product_type` (TEXT, NOT NULL, CHECK: 'credit_card', 'mutual_fund', 'personal_loan', 'fd', 'insurance', 'stock', 'etf')
- `provider` (TEXT, NOT NULL)
- `provider_slug` (TEXT)
- `is_active` (BOOLEAN, DEFAULT true)
- `launch_date` (DATE)
- `meta_title` (TEXT)
- `meta_description` (TEXT)
- `canonical_url` (TEXT)
- `data_completeness_score` (DECIMAL(3,2), DEFAULT 0)
- `last_updated_at` (TIMESTAMPTZ, DEFAULT NOW())
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `search_vector` (tsvector, GENERATED)

### articles
- `id` (UUID, PRIMARY KEY)
- `title` (TEXT, NOT NULL)
- `slug` (TEXT, UNIQUE, NOT NULL)
- `excerpt` (TEXT)
- `content` (TEXT, NOT NULL)
- `body_markdown` (TEXT) - Alternative field name
- `body_html` (TEXT) - Rendered HTML
- `category` (TEXT, NOT NULL, CHECK: 'mutual-funds', 'stocks', 'insurance', 'loans', 'credit-cards', 'tax-planning', 'retirement', 'investing-basics')
- `category_id` (UUID) - For CMS schema compatibility
- `language` (TEXT, DEFAULT 'en', CHECK: 'en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu')
- `tags` (TEXT[])
- `keywords` (TEXT[]) - SEO keywords
- `featured_image` (TEXT)
- `read_time` (NUMERIC)
- `author_id` (UUID, REFERENCES auth.users)
- `author_name` (TEXT)
- `author_email` (TEXT)
- `is_user_submission` (BOOLEAN, DEFAULT FALSE)
- `submission_status` (TEXT, DEFAULT 'approved', CHECK: 'pending', 'approved', 'rejected', 'revision-requested')
- `rejection_reason` (TEXT)
- `status` (TEXT, DEFAULT 'draft', CHECK: 'draft', 'review', 'published', 'archived')
- `published_at` (TIMESTAMPTZ)
- `published_date` (TIMESTAMPTZ) - Alternative field name
- `meta_title` (TEXT)
- `meta_description` (TEXT)
- `seo_title` (TEXT)
- `seo_description` (TEXT)
- `canonical_url` (TEXT)
- `citations` (JSONB)
- `data_sources` (JSONB)
- `is_ai_generated` (BOOLEAN, DEFAULT false)
- `ai_generated` (BOOLEAN, DEFAULT false) - Alternative field name
- `ai_model` (TEXT)
- `ai_prompt_hash` (TEXT)
- `human_reviewed` (BOOLEAN, DEFAULT false)
- `reviewed_by` (TEXT)
- `reviewed_at` (TIMESTAMPTZ)
- `views` (INTEGER, DEFAULT 0)
- `affiliate_products` (TEXT[])
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

### user_profiles
- `id` (UUID, PRIMARY KEY, REFERENCES auth.users)
- `email` (TEXT, NOT NULL)
- `full_name` (TEXT)
- `avatar_url` (TEXT)
- `role` (TEXT, NOT NULL, DEFAULT 'user', CHECK: 'user', 'editor', 'admin')
- `language` (TEXT, DEFAULT 'en')
- `timezone` (TEXT, DEFAULT 'Asia/Kolkata')
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

### reviews
- `id` (UUID, PRIMARY KEY)
- `product_id` (UUID, NOT NULL)
- `product_type` (TEXT)
- `user_id` (UUID, REFERENCES auth.users)
- `user_name` (TEXT, NOT NULL)
- `rating` (NUMERIC, NOT NULL, CHECK: >= 1 AND <= 5)
- `title` (TEXT)
- `review_text` (TEXT, NOT NULL)
- `pros` (TEXT[])
- `cons` (TEXT[])
- `verified_purchase` (BOOLEAN, DEFAULT FALSE)
- `helpful_count` (INTEGER, DEFAULT 0)
- `language` (TEXT, DEFAULT 'en')
- `status` (TEXT, NOT NULL, DEFAULT 'pending', CHECK: 'pending', 'approved', 'rejected')
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

### portfolios
- `id` (UUID, PRIMARY KEY)
- `user_id` (UUID, REFERENCES auth.users)
- `user_email` (TEXT) - Alternative identifier
- `asset_id` (UUID, REFERENCES assets)
- `asset_name` (TEXT)
- `asset_type` (TEXT, NOT NULL, CHECK: 'mutual-fund', 'stock', 'etf', 'bond', 'fd', 'gold')
- `asset_category` (TEXT, NOT NULL, CHECK: 'equity', 'debt', 'hybrid', 'gold', 'international')
- `quantity` (NUMERIC(15, 4), NOT NULL, DEFAULT 0)
- `purchase_price` (NUMERIC(15, 4), NOT NULL, DEFAULT 0)
- `average_price` (NUMERIC(15, 4), NOT NULL, DEFAULT 0) - Alternative field name
- `current_price` (NUMERIC(15, 4))
- `purchase_date` (DATE, NOT NULL, DEFAULT CURRENT_DATE)
- `invested_amount` (NUMERIC, GENERATED)
- `current_value` (NUMERIC, GENERATED)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

### assets
- `id` (UUID, PRIMARY KEY)
- `category` (TEXT, NOT NULL) - 'mutual_funds', 'stocks', 'fixed_deposits', 'loans', 'insurance', 'credit_cards', 'brokers'
- `vertical_slug` (TEXT, NOT NULL)
- `slug` (TEXT, UNIQUE, NOT NULL)
- `name` (TEXT, NOT NULL)
- `provider` (TEXT, NOT NULL)
- `logo_url` (TEXT)
- `status` (TEXT, DEFAULT 'active')
- `scraped_at` (TIMESTAMPTZ, DEFAULT now())
- `rating` (INTEGER, DEFAULT 0)
- `risk_level` (TEXT)
- `metadata` (JSONB, NOT NULL, DEFAULT '{}'::jsonb)
- `search_vector` (tsvector, GENERATED)
- `created_at` (TIMESTAMPTZ, DEFAULT now())
- `updated_at` (TIMESTAMPTZ, DEFAULT now())

### affiliate_products
- `id` (UUID, PRIMARY KEY)
- `name` (TEXT, NOT NULL)
- `company` (TEXT, NOT NULL)
- `type` (TEXT, NOT NULL, CHECK: 'mutual-fund', 'stock-broker', 'insurance', 'loan', 'credit-card', 'demat-account', 'banking')
- `description` (TEXT)
- `affiliate_link` (TEXT, NOT NULL)
- `commission_rate` (NUMERIC)
- `commission_type` (TEXT, DEFAULT 'cpa', CHECK: 'percentage', 'fixed', 'cpa')
- `rating` (NUMERIC, CHECK: >= 0 AND <= 5)
- `features` (TEXT[])
- `pricing` (JSONB)
- `image_url` (TEXT)
- `clicks` (INTEGER, DEFAULT 0)
- `conversions` (INTEGER, DEFAULT 0)
- `status` (TEXT, NOT NULL, DEFAULT 'active', CHECK: 'active', 'inactive', 'pending')
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

### ad_placements
- `id` (UUID, PRIMARY KEY)
- `name` (TEXT, NOT NULL)
- `position` (TEXT, NOT NULL, CHECK: 'header', 'sidebar', 'in-article', 'footer', 'between-cards')
- `pages` (TEXT[])
- `ad_type` (TEXT, NOT NULL, DEFAULT 'banner', CHECK: 'banner', 'native', 'video', 'sponsored-content')
- `advertiser` (TEXT)
- `ad_content` (TEXT, NOT NULL)
- `click_url` (TEXT)
- `status` (TEXT, NOT NULL, DEFAULT 'active', CHECK: 'active', 'paused', 'expired')
- `start_date` (DATE, DEFAULT CURRENT_DATE)
- `end_date` (DATE)
- `impressions` (INTEGER, DEFAULT 0)
- `clicks` (INTEGER, DEFAULT 0)
- `cpc` (NUMERIC, DEFAULT 0)
- `budget` (NUMERIC)
- `spent` (NUMERIC, DEFAULT 0)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

### glossary_terms
- `id` (UUID, PRIMARY KEY)
- `term` (TEXT, NOT NULL, UNIQUE)
- `slug` (TEXT, NOT NULL, UNIQUE)
- `full_form` (TEXT)
- `pronunciation` (TEXT)
- `category` (TEXT, NOT NULL, CHECK: 'investing', 'mutual-funds', 'stocks', 'credit-cards', 'loans', 'insurance', 'tax', 'retirement', 'banking', 'general')
- `definition` (TEXT, NOT NULL)
- `why_it_matters` (TEXT, NOT NULL)
- `example_numeric` (TEXT, NOT NULL)
- `example_text` (TEXT)
- `related_calculators` (TEXT[])
- `related_guides` (TEXT[])
- `related_terms` (TEXT[])
- `sources` (JSONB, NOT NULL, DEFAULT '[]'::jsonb)
- `ai_metadata` (JSONB, DEFAULT '{}'::jsonb)
- `internal_links` (JSONB, DEFAULT '[]'::jsonb)
- `schema_markup` (JSONB, DEFAULT '{}'::jsonb)
- `seo_title` (TEXT)
- `seo_description` (TEXT)
- `meta_keywords` (TEXT[])
- `status` (TEXT, DEFAULT 'draft', CHECK: 'draft', 'published', 'archived')
- `is_ai_generated` (BOOLEAN, DEFAULT true)
- `requires_review` (BOOLEAN, DEFAULT true)
- `review_status` (TEXT, DEFAULT 'pending', CHECK: 'pending', 'approved', 'rejected', 'needs_revision')
- `views` (INTEGER, DEFAULT 0)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())
- `published_at` (TIMESTAMPTZ)
- `last_reviewed_at` (TIMESTAMPTZ)

### pipeline_runs
- `id` (UUID, PRIMARY KEY)
- `pipeline_type` (TEXT, NOT NULL)
- `status` (TEXT, NOT NULL, DEFAULT 'triggered', CHECK: 'triggered', 'running', 'completed', 'failed', 'cancelled')
- `params` (JSONB, DEFAULT '{}'::jsonb)
- `triggered_at` (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())
- `started_at` (TIMESTAMPTZ)
- `completed_at` (TIMESTAMPTZ)
- `result` (JSONB)
- `error_message` (TEXT)
- `error_stack` (TEXT)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

---

## RLS Expectations

The application assumes the following Row Level Security (RLS) policies are in place:

### products
- **SELECT**: Public can read `is_active = true` products
- **INSERT/UPDATE/DELETE**: Assumes service_role or admin role can modify

### articles
- **SELECT (Public)**: Can view articles where `status = 'published'` AND (`submission_status = 'approved'` OR `submission_status IS NULL`)
- **SELECT (User)**: Users can view their own articles (`auth.uid() = author_id`)
- **INSERT**: Authenticated users can insert articles
- **UPDATE (User)**: Users can update own drafts (`auth.uid() = author_id AND status = 'draft'`)
- **ALL (Admin)**: Admins can perform all operations (`auth.jwt() ->> 'role' = 'admin'`)

### user_profiles
- **SELECT (User)**: Users can view own profile (`auth.uid() = id`)
- **UPDATE (User)**: Users can update own profile (`auth.uid() = id`)
- **SELECT (Admin)**: Admins can view all profiles (`auth.jwt() ->> 'role' = 'admin'`)

### reviews
- **SELECT (Public)**: Can view reviews where `status = 'approved'`
- **INSERT**: Authenticated users can insert reviews (or anonymous if policy allows)
- **ALL (Admin)**: Admins can manage all reviews (`auth.jwt() ->> 'role' = 'admin'`)

### portfolios
- **SELECT**: Users can view own portfolios (`auth.uid() = user_id OR auth.jwt() ->> 'email' = user_email`)
- **INSERT**: Users can insert own portfolios (`auth.uid() = user_id OR auth.jwt() ->> 'email' = user_email`)
- **UPDATE**: Users can update own portfolios (`auth.uid() = user_id OR auth.jwt() ->> 'email' = user_email`)
- **DELETE**: Users can delete own portfolios (`auth.uid() = user_id OR auth.jwt() ->> 'email' = user_email`)

### assets
- **SELECT**: Public can read all assets (`true`)

### affiliate_products
- **SELECT (Public)**: Can view where `status = 'active'`
- **ALL (Admin)**: Admins can manage all (`auth.jwt() ->> 'role' = 'admin'`)

### ad_placements
- **SELECT (Public)**: Can view where `status = 'active'`
- **ALL (Admin)**: Admins can manage all (`auth.jwt() ->> 'role' = 'admin'`)

### glossary_terms
- **SELECT (Public)**: Can view where `status = 'published'`
- **ALL (Authenticated)**: Authenticated users (editors/admins) can manage (`auth.role() = 'authenticated'`)
- **ALL (Service Role)**: Service role can manage (`auth.role() = 'service_role'`)

### pipeline_runs
- **SELECT/INSERT/UPDATE**: Authenticated users can access (`auth.role() = 'authenticated'`)

### CMS Automation Tables
- **Service Role**: Full access to all CMS automation tables (`auth.role() = 'service_role'`)
- **Admin/Editor**: Full access via user_profiles role check (`role IN ('admin', 'editor')`)

### credit_cards, mutual_funds
- **SELECT**: Public can view all
- **INSERT**: Service role or admin can insert (`auth.role() = 'service_role' OR auth.jwt() ->> 'role' = 'admin'`)

### calculator_results
- **INSERT**: Public can insert
- **SELECT**: Users can view own results (`user_email IS NULL OR auth.jwt() ->> 'email' = user_email OR auth.uid() = user_id`)

### live_rates, inflation_data
- **SELECT (Public)**: Can view active/valid rates
- **ALL (Service Role)**: Service role can manage (`auth.role() = 'service_role'`)

### user_subscriptions
- **SELECT (User)**: Users can view own subscriptions (`auth.jwt() ->> 'email' = email OR auth.uid() = user_id`)
- **ALL (Service Role)**: Service role can manage (`auth.role() = 'service_role'`)
- **SELECT (Admin)**: Admins can view all (`auth.jwt() ->> 'role' = 'admin'`)

### affiliate_clicks
- **INSERT**: Public can insert
- **SELECT/UPDATE (Admin)**: Admins can view/update (`auth.jwt() ->> 'role' = 'admin'`)

---

## Admin Visibility Contract

The application assumes the following admin visibility requirements:

### Role Detection
- Admin role is determined by `user_profiles.role = 'admin'` OR `auth.jwt() ->> 'role' = 'admin'`
- Editor role is determined by `user_profiles.role = 'editor'` OR `auth.role() = 'authenticated'` (for some tables)

### Admin Can View
- **All articles** regardless of status or submission_status
- **All user_profiles** regardless of ownership
- **All reviews** regardless of status
- **All user_subscriptions** regardless of ownership
- **All affiliate_clicks** for analytics
- **All CMS automation tables** (keyword_research, rss_feeds, pipeline_runs, etc.)
- **All products** regardless of is_active status
- **All portfolios** (if needed for support)

### Admin Can Modify
- **All articles** (status changes, content edits, approval/rejection)
- **All reviews** (approval, rejection, moderation)
- **All products** (activate/deactivate, data updates)
- **All affiliate_products** (status, links, commission rates)
- **All ad_placements** (create, update, pause, activate)
- **All CMS automation configurations** (rss_feeds, keyword_clusters, etc.)
- **All user_profiles** (role changes, profile updates)

### Admin Cannot See (Public-Only Data)
- **calculator_results** from other users (unless explicitly granted)
- **portfolios** from other users (unless explicitly granted)

### Admin Dashboard Assumptions
- Admin dashboard queries assume ability to:
  - Filter articles by `submission_status = 'pending'`
  - Count all reviews with `status = 'pending'`
  - View all pipeline_runs
  - View all affiliate_products ordered by clicks
  - View all ad_placements
  - Access all CMS automation tables

---

## Required Default Values

The application assumes the following default values:

### Status Defaults
- **articles.status**: `'draft'`
- **articles.submission_status**: `'approved'` (or `'pending'` for user submissions)
- **reviews.status**: `'pending'`
- **glossary_terms.status**: `'draft'`
- **glossary_terms.review_status**: `'pending'`
- **products.is_active**: `true`
- **affiliate_products.status**: `'active'`
- **ad_placements.status**: `'active'`
- **pipeline_runs.status**: `'triggered'`

### Content Type Defaults
- **articles.language**: `'en'`
- **articles.category**: Must be one of: 'mutual-funds', 'stocks', 'insurance', 'loans', 'credit-cards', 'tax-planning', 'retirement', 'investing-basics'
- **content.content_type**: Must be one of: 'article', 'faq', 'guide', 'comparison'
- **content.language**: `'en'` (CHECK: 'en', 'hi')
- **glossary_terms.category**: Must be one of: 'investing', 'mutual-funds', 'stocks', 'credit-cards', 'loans', 'insurance', 'tax', 'retirement', 'banking', 'general'

### User Defaults
- **user_profiles.role**: `'user'` (CHECK: 'user', 'editor', 'admin')
- **user_profiles.language**: `'en'`
- **user_profiles.timezone**: `'Asia/Kolkata'`

### AI Generation Defaults
- **articles.is_ai_generated**: `false`
- **articles.ai_generated**: `false` (alternative field)
- **articles.human_reviewed**: `false`
- **glossary_terms.is_ai_generated**: `true`
- **glossary_terms.requires_review**: `true`

### Submission Defaults
- **articles.is_user_submission**: `false`
- **articles.submission_status**: `'approved'` (for editorial content) or `'pending'` (for user submissions)

### Numeric Defaults
- **articles.views**: `0`
- **reviews.helpful_count**: `0`
- **reviews.rating**: Must be between 1 and 5
- **affiliate_products.clicks**: `0`
- **affiliate_products.conversions**: `0`
- **ad_placements.impressions**: `0`
- **ad_placements.clicks**: `0`
- **ad_placements.cpc**: `0`
- **ad_placements.spent**: `0`
- **glossary_terms.views**: `0`
- **assets.rating**: `0`
- **products.data_completeness_score**: `0`

### Timestamp Defaults
- **created_at**: `NOW()` for all tables
- **updated_at**: `NOW()` for all tables (via triggers)
- **published_at**: `NULL` (set when publishing)
- **scraped_at**: `now()` for assets

### JSONB Defaults
- **assets.metadata**: `'{}'::jsonb`
- **glossary_terms.sources**: `'[]'::jsonb`
- **glossary_terms.ai_metadata**: `'{}'::jsonb`
- **glossary_terms.internal_links**: `'[]'::jsonb`
- **glossary_terms.schema_markup**: `'{}'::jsonb`
- **pipeline_runs.params**: `'{}'::jsonb`

### Array Defaults
- **articles.tags**: `NULL` or empty array
- **articles.keywords**: `NULL` or empty array
- **articles.affiliate_products**: `NULL` or empty array
- **reviews.pros**: `NULL` or empty array
- **reviews.cons**: `NULL` or empty array
- **ad_placements.pages**: `NULL` or empty array
- **affiliate_products.features**: `NULL` or empty array

---

## Failure Modes if Violated

### Missing Tables
- **Impact**: Application will fail to start or crash on API calls
- **Symptoms**: 404 errors, "relation does not exist" database errors
- **Affected Features**: All features dependent on missing tables

### Missing Columns
- **Impact**: Queries will fail, data insertion/updates will fail
- **Symptoms**: "column does not exist" errors, null reference errors in frontend
- **Affected Features**: Features using missing columns

### Incorrect Column Types
- **Impact**: Type mismatches, data corruption, query failures
- **Symptoms**: Type errors, invalid data format errors
- **Affected Features**: Features using affected columns

### Missing RLS Policies
- **Impact**: Security vulnerabilities, unauthorized access, data leaks
- **Symptoms**: Users seeing data they shouldn't, admin functions accessible to non-admins
- **Affected Features**: All features with security implications

### Incorrect RLS Policy Logic
- **Impact**: Users cannot access their own data, or can access others' data
- **Symptoms**: 403 Forbidden errors for legitimate users, unauthorized data access
- **Affected Features**: User-specific features (portfolios, profiles, submissions)

### Missing Default Values
- **Impact**: NULL constraint violations, application logic failures
- **Symptoms**: Insert errors, null reference errors, broken UI components
- **Affected Features**: Features creating new records without explicit values

### Incorrect Status Values
- **Impact**: Content not visible when it should be, or visible when it shouldn't
- **Symptoms**: Published articles not showing, draft articles visible to public
- **Affected Features**: Content publishing, moderation workflows

### Missing Admin Role Detection
- **Impact**: Admin dashboard inaccessible, admin functions unavailable
- **Symptoms**: 403 errors in admin routes, admin UI not loading
- **Affected Features**: All admin CMS features, moderation, configuration

### Missing Foreign Key Constraints
- **Impact**: Orphaned records, referential integrity violations
- **Symptoms**: Broken relationships, missing data in joins
- **Affected Features**: Features displaying related data

### Missing Indexes
- **Impact**: Slow queries, poor performance, timeouts
- **Symptoms**: Slow page loads, API timeouts, database CPU spikes
- **Affected Features**: Search, filtering, listing pages

### Incorrect CHECK Constraints
- **Impact**: Invalid data insertion, application logic failures
- **Symptoms**: Constraint violation errors, data validation failures
- **Affected Features**: Features inserting/updating constrained columns

### Missing Triggers (updated_at)
- **Impact**: updated_at timestamps not updating automatically
- **Symptoms**: Stale timestamps, incorrect "last updated" displays
- **Affected Features**: Features displaying update timestamps

### Missing Generated Columns
- **Impact**: Search functionality broken, computed values missing
- **Symptoms**: Search not working, missing calculated fields
- **Affected Features**: Full-text search, computed portfolio values

### Missing JSONB Structure
- **Impact**: JSON parsing errors, missing nested data
- **Symptoms**: JSON parse errors, missing metadata in UI
- **Affected Features**: Features using JSONB columns (metadata, citations, etc.)

---

## Additional Assumptions

### Database Extensions
- Application assumes `uuid-ossp` extension is enabled
- Application assumes `pg_trgm` extension is enabled (for fuzzy search)
- Application assumes `vector` extension is enabled (for RAG, if used)

### Functions
- Application assumes `update_updated_at_column()` function exists for triggers
- Application assumes `handle_new_user()` function exists for user profile creation
- Application assumes `calculate_data_completeness()` function exists (optional)

### Auth Integration
- Application assumes Supabase Auth is configured
- Application assumes `auth.users` table exists (Supabase managed)
- Application assumes JWT tokens contain role information in `auth.jwt() ->> 'role'`
- Application assumes `auth.uid()` returns current user ID
- Application assumes `auth.role()` returns current role ('authenticated', 'service_role', etc.)

### Service Role
- Application assumes service_role can bypass RLS for automated operations
- Application assumes service_role is used for scrapers, AI generation, and background jobs

### Data Integrity
- Application assumes unique constraints on `slug` columns
- Application assumes foreign key constraints maintain referential integrity
- Application assumes cascading deletes where appropriate (e.g., `ON DELETE CASCADE`)

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-20  
**Maintained By**: Application Compiler


