-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: Article SEO & Editorial Intelligence Fields
-- Date: 2026-03-24
-- Purpose: Add fields required for SEO intelligence, editorial trust signals,
--          cross-vertical product linking, and newsletter automation.
--          All fields use ADD COLUMN IF NOT EXISTS (safe to re-run).
-- Source: CLAUDE.md Section 14 — Article Page Schema Plan
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Phase 1: Editorial Trust Fields ──────────────────────────────────────────
-- These are highest-impact, lowest-effort additions.
-- "Rate data last verified: [date]" visible on every product-linked article.

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS last_rate_verified_at  TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS expert_quote           TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS review_methodology     TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS affiliate_disclosure_text TEXT DEFAULT NULL;

-- ── Phase 2: Content Classification Fields ───────────────────────────────────
-- Enables content calendar automation, seasonal content planning,
-- and SEO keyword tracking per article.

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS content_subtype       TEXT
    CHECK (content_subtype IN ('guide','comparison','tool-page','news','glossary','pillar','programmatic') OR content_subtype IS NULL),
  ADD COLUMN IF NOT EXISTS seasonal_peak_month   SMALLINT
    CHECK (seasonal_peak_month BETWEEN 1 AND 12 OR seasonal_peak_month IS NULL),
  ADD COLUMN IF NOT EXISTS target_keyword        TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS keyword_priority      TEXT
    CHECK (keyword_priority IN ('p0','p1','p2') OR keyword_priority IS NULL),
  ADD COLUMN IF NOT EXISTS search_volume_est     TEXT DEFAULT NULL;  -- e.g. "150K–300K"

-- ── Phase 3: SEO & Structured Data Fields ────────────────────────────────────
-- Enables rich snippets (FAQPage, HowTo, Article schema) and canonical URLs.

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS schema_markup         JSONB DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS faq_items             JSONB DEFAULT NULL,
  -- faq_items shape: [{"question": "...", "answer": "..."}]
  ADD COLUMN IF NOT EXISTS canonical_url         TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS breadcrumb_path       JSONB DEFAULT NULL;
  -- breadcrumb_path shape: [{"label": "Home", "href": "/"}, ...]

-- ── Phase 4: Product Integration Fields ──────────────────────────────────────
-- Links articles to calculators and specific products for cross-vertical CTAs.

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS embedded_calculator   TEXT DEFAULT NULL,
  -- e.g. 'sip-calculator', 'emi-calculator' — slug of calculator to embed inline
  ADD COLUMN IF NOT EXISTS featured_products     UUID[] DEFAULT NULL,
  -- Array of product IDs to highlight in the article
  ADD COLUMN IF NOT EXISTS approval_rules_ref    TEXT DEFAULT NULL;

-- ── Phase 5: Engagement & Email Fields ───────────────────────────────────────
-- Powers InvestingPro Weekly newsletter and rate alert system.

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS newsletter_featured   BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS rate_alert_category   TEXT DEFAULT NULL;
  -- e.g. 'home-loan-rates', 'fd-rates', 'sip-returns'

-- ── Phase 6: Performance Tracking Fields ─────────────────────────────────────
-- Manual input from Google Search Console — updated by admin or future API sync.

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS organic_rank_position      SMALLINT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS organic_click_through_rate NUMERIC(5,2) DEFAULT NULL;
  -- e.g. 3.75 = 3.75%

-- ── Indexes for new query patterns ───────────────────────────────────────────

-- Find articles needing rate verification (last verified > 30 days ago)
CREATE INDEX IF NOT EXISTS idx_articles_rate_verified
  ON articles (last_rate_verified_at)
  WHERE last_rate_verified_at IS NOT NULL;

-- Filter by keyword priority for editorial planning
CREATE INDEX IF NOT EXISTS idx_articles_keyword_priority
  ON articles (keyword_priority)
  WHERE keyword_priority IS NOT NULL;

-- Filter newsletter-featured articles for weekly digest generation
CREATE INDEX IF NOT EXISTS idx_articles_newsletter_featured
  ON articles (newsletter_featured)
  WHERE newsletter_featured = TRUE;

-- Find articles by seasonal peak month (content calendar)
CREATE INDEX IF NOT EXISTS idx_articles_seasonal_peak
  ON articles (seasonal_peak_month)
  WHERE seasonal_peak_month IS NOT NULL;

-- Full-text index on target_keyword for SEO admin search
CREATE INDEX IF NOT EXISTS idx_articles_target_keyword
  ON articles USING gin (to_tsvector('english', COALESCE(target_keyword, '')));

-- ── Comments (documentation in DB) ───────────────────────────────────────────

COMMENT ON COLUMN articles.last_rate_verified_at IS
  'When rate/product data in this article was last manually verified. Display as "Rates verified X days ago" on frontend.';

COMMENT ON COLUMN articles.target_keyword IS
  'Primary SEO keyword this article is optimised for. Used for SERP rank tracking.';

COMMENT ON COLUMN articles.keyword_priority IS
  'P0 = target immediately (100K+/mo), P1 = build soon (10K–100K/mo), P2 = long-tail.';

COMMENT ON COLUMN articles.faq_items IS
  'Array of {question, answer} objects. Auto-generates FAQPage JSON-LD schema for rich snippets.';

COMMENT ON COLUMN articles.schema_markup IS
  'Custom JSON-LD for Article, HowTo, Product schema. Merged with auto-generated schema at render time.';

COMMENT ON COLUMN articles.embedded_calculator IS
  'Slug of calculator to embed inline (e.g. "sip-calculator"). Links to /calculators/[slug].';

COMMENT ON COLUMN articles.newsletter_featured IS
  'Flag to include this article in the next InvestingPro Weekly email digest.';

COMMENT ON COLUMN articles.seasonal_peak_month IS
  'Month (1–12) when this article gets 3–5x traffic. E.g. 3 = March for tax-season content.';
