# Real Product Data Pipeline + Product Experience — Design Spec

> **Date:** 2026-04-01
> **Status:** Draft
> **Scope:** Seed real financial products from APIs/curation, build scoring engine, upgrade product experience layer
> **Constraint:** NOTHING hardcoded — all data from Supabase database, all pages DB-driven

---

## 1. Problem

InvestingPro product pages currently render hardcoded placeholder data. No real products in the database. Product detail pages, listing pages, and comparison pages have no actual content to display. The platform can't launch without real, accurate financial product data.

## 2. Goal

Populate Supabase with **real Indian financial products** across all 7 categories, scored by a transparent algorithm, with real images, and rendered dynamically from the database on every page. Zero hardcoded product arrays anywhere.

---

## 3. Product Schema (Supabase `products` table)

All product data lives in one table with a flexible `features` JSONB column per category.

```sql
products (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text UNIQUE NOT NULL,
  name            text NOT NULL,
  product_type    text NOT NULL,  -- credit_card | mutual_fund | fixed_deposit | loan | insurance | demat_account | ppf_nps
  provider_name   text NOT NULL,  -- "HDFC Bank", "SBI", "ICICI Prudential"
  provider_slug   text NOT NULL,
  provider_logo   text,           -- URL to provider logo
  
  -- Display
  image_url       text,           -- Product image (card image, fund logo, etc.)
  description     text,
  short_description text,         -- 1-liner for cards/lists
  
  -- Scoring (computed by scoring engine, stored for fast queries)
  investingpro_score  decimal(4,1),  -- 0.0-10.0 overall score
  score_breakdown     jsonb,          -- { value: 8.5, features: 9.0, trust: 7.5, sentiment: 8.0 }
  trust_score         decimal(4,1),
  
  -- Category-specific data (flexible JSONB)
  features            jsonb NOT NULL DEFAULT '{}',
  
  -- Structured fields common across categories
  pros                text[] DEFAULT '{}',
  cons                text[] DEFAULT '{}',
  key_features        text[] DEFAULT '{}',
  tags                text[] DEFAULT '{}',      -- "cashback", "no-annual-fee", "student", "premium"
  
  -- Links
  affiliate_link      text,
  official_link       text,
  apply_url           text,
  
  -- Reviews & social proof
  user_rating         decimal(3,2),   -- aggregated from reviews
  review_count        integer DEFAULT 0,
  sentiment_score     decimal(3,2),   -- from social media scraping
  
  -- SEO
  meta_title          text,
  meta_description    text,
  
  -- Status
  is_active           boolean DEFAULT true,
  is_featured         boolean DEFAULT false,
  is_verified         boolean DEFAULT false,
  verification_status text DEFAULT 'pending',
  data_source         text,           -- 'manual' | 'amfi_api' | 'rbi' | 'scraped'
  last_data_refresh   timestamptz,
  
  -- Timestamps
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);
```

### Category-Specific `features` JSONB

**Credit Cards:**
```json
{
  "annual_fee": 499,
  "joining_fee": 0,
  "interest_rate_monthly": 3.5,
  "reward_rate": "4 points per ₹150",
  "welcome_bonus": "500 reward points",
  "lounge_access": { "domestic": 8, "international": 2 },
  "fuel_surcharge_waiver": true,
  "contactless": true,
  "network": "Visa",
  "variant": "Signature",
  "min_income": 600000,
  "min_age": 21,
  "max_age": 60,
  "best_for": ["cashback", "online-shopping"],
  "fee_waiver_spend": 200000
}
```

**Mutual Funds:**
```json
{
  "scheme_code": "119551",
  "isin": "INF200K01RJ1",
  "fund_house": "SBI Mutual Fund",
  "category": "Equity - Large Cap",
  "sub_category": "Large Cap Fund",
  "nav": 68.45,
  "nav_date": "2026-03-31",
  "aum_crores": 45230,
  "expense_ratio": 0.69,
  "returns_1y": 18.5,
  "returns_3y": 15.2,
  "returns_5y": 14.8,
  "risk_level": "Moderately High",
  "benchmark": "S&P BSE 100 TRI",
  "fund_manager": "R. Srinivasan",
  "launch_date": "2013-01-01",
  "min_sip": 500,
  "min_lumpsum": 5000,
  "exit_load": "1% if redeemed within 1 year"
}
```

**Fixed Deposits:**
```json
{
  "bank_type": "private",
  "rate_general": 7.10,
  "rate_senior": 7.60,
  "min_deposit": 10000,
  "max_deposit": null,
  "tenure_min_days": 7,
  "tenure_max_days": 3650,
  "best_tenure": "1-2 years",
  "premature_withdrawal": true,
  "tax_saver": false,
  "auto_renewal": true,
  "online_opening": true,
  "dicgc_insured": true
}
```

**Loans:**
```json
{
  "loan_type": "personal",
  "interest_rate_min": 10.49,
  "interest_rate_max": 21.00,
  "processing_fee_percent": 2.0,
  "max_amount": 4000000,
  "min_amount": 50000,
  "max_tenure_months": 60,
  "min_tenure_months": 12,
  "prepayment_charges": "2% of outstanding",
  "disbursal_time": "24 hours",
  "min_income": 300000,
  "employment_types": ["salaried", "self-employed"],
  "cibil_min": 750
}
```

**Insurance:**
```json
{
  "insurance_type": "term",
  "cover_amount_min": 2500000,
  "cover_amount_max": 100000000,
  "premium_monthly_start": 490,
  "claim_settlement_ratio": 98.5,
  "entry_age_min": 18,
  "entry_age_max": 65,
  "policy_term_min": 10,
  "policy_term_max": 40,
  "riders": ["critical_illness", "accidental_death", "disability"],
  "tax_benefit_section": "80C",
  "irdai_reg_no": "133"
}
```

**Demat Accounts:**
```json
{
  "account_opening_fee": 0,
  "annual_maintenance": 300,
  "brokerage_delivery": 0,
  "brokerage_intraday": 20,
  "brokerage_options": 20,
  "brokerage_model": "flat",
  "platforms": ["web", "mobile", "desktop"],
  "mutual_fund_commission": false,
  "ipo_support": true,
  "research_reports": true,
  "margin_trading": true,
  "api_trading": true
}
```

---

## 4. Data Sources & Seeding Strategy

### Phase 1: Credit Cards (50 products)

**Source:** Manual curation from official bank websites + CIBIL partnership data
**Images:** Real card images — download from official bank media kits, CardExpert.in patterns, or use provider logos as fallback
**Data points per card:** name, bank, fees, rewards, lounges, eligibility, pros/cons, tags

**Top banks to cover:**
HDFC, SBI, ICICI, Axis, Kotak, RBL, IndusInd, IDFC First, Yes Bank, AU Small Finance, Amex, Citi (legacy), Standard Chartered, HSBC, Federal, BOB

**Seed script:** `scripts/seed-credit-cards.ts`
- Reads from `data/seed/credit-cards.json` (curated data file)
- Upserts to `products` table
- Downloads and stores images in Supabase Storage
- Computes initial InvestingPro Score

### Phase 2: Mutual Funds (200 top funds)

**Source:** AMFI NAV API (https://www.amfiindia.com/spages/NAVAll.txt) — FREE, public, daily
**Integration:** `lib/data-sources/amfi-client.ts`
- Parses the AMFI text file (pipe-delimited)
- Fetches all fund NAVs daily
- Enriches with returns data from Value Research RSS
- Stores in products table with `data_source: 'amfi_api'`

**Refresh:** Daily cron job updates NAVs and returns

### Phase 3: Fixed Deposits (30 banks)

**Source:** RBI data + manual from bank websites
**Data:** Interest rates by tenure for general and senior citizens
**Refresh:** Weekly manual update (rates change infrequently)

### Phase 4: Loans (40 products)

**Source:** Official bank rate pages, BankBazaar reference data
**Categories:** Personal, Home, Car, Education, Gold, Business
**Refresh:** Monthly

### Phase 5: Insurance (30 policies)

**Source:** IRDAI public data + Policybazaar reference
**Categories:** Term, Health, Motor, Travel
**Refresh:** Monthly

### Phase 6: Demat Accounts + PPF/NPS (15 products)

**Source:** SEBI registered broker list + manual
**Refresh:** Quarterly

---

## 5. Product Scoring Engine

**File:** `lib/scoring/product-scorer.ts`

### InvestingPro Score (0-10 scale)

Each category has weighted criteria:

**Credit Cards:**
| Factor | Weight | Metric |
|--------|--------|--------|
| Value | 30% | (rewards_value - annual_fee) / annual_fee |
| Features | 25% | count of premium features (lounges, insurance, etc.) |
| Trust | 25% | bank reputation score + verification status |
| Sentiment | 20% | social media sentiment + user reviews |

**Mutual Funds:**
| Factor | Weight | Metric |
|--------|--------|--------|
| Returns | 30% | 5Y returns vs category benchmark |
| Consistency | 25% | rolling returns standard deviation |
| Cost | 20% | expense ratio vs category average |
| Trust | 15% | fund house AUM + track record |
| Sentiment | 10% | expert ratings + user reviews |

**Fixed Deposits:**
| Factor | Weight | Metric |
|--------|--------|--------|
| Rate | 40% | interest rate vs category best |
| Safety | 30% | bank type (PSU=10, large private=9, small finance=7) |
| Flexibility | 20% | premature withdrawal, online opening, auto-renew |
| Trust | 10% | DICGC coverage + bank rating |

Similar matrices for loans (rate + flexibility + speed + trust), insurance (CSR + cover + riders + trust), demat (cost + features + platform + trust).

### Score Storage
- `investingpro_score`: single number for sorting/display
- `score_breakdown`: JSONB with per-factor scores for transparency
- Recomputed on data refresh

---

## 6. Review & Sentiment Scraping

**File:** `lib/data-sources/sentiment-scraper.ts`

### Sources
- **Twitter/X:** Search `"product_name" OR "provider_name" lang:en` via free search
- **Reddit:** r/IndiaInvestments, r/CreditCardsIndia — pushshift/public API
- **Google Play:** App store reviews for banking/broker apps

### Pipeline
1. Fetch recent mentions (last 30 days)
2. Classify sentiment: positive / neutral / negative (simple keyword-based, no paid API)
3. Extract key themes (rewards, customer service, app quality, etc.)
4. Aggregate into `sentiment_score` (0-1) and `review_highlights` JSONB
5. Store in `product_reviews` table

### `product_reviews` table
```sql
product_reviews (
  id            uuid PRIMARY KEY,
  product_id    uuid REFERENCES products(id),
  source        text,        -- 'twitter' | 'reddit' | 'google_play' | 'manual'
  author        text,
  rating        integer,     -- 1-5 if available
  content       text,
  sentiment     text,        -- 'positive' | 'neutral' | 'negative'
  themes        text[],
  source_url    text,
  created_at    timestamptz
);
```

---

## 7. Image Strategy

### Credit Cards
- Real card images stored in Supabase Storage (`/product-images/credit-cards/`)
- Naming: `{provider_slug}-{card_slug}.png`
- Fallback: Provider logo + card name text overlay (auto-generated)

### Other Categories
- Provider logos from official sources
- Store in `/product-images/logos/`
- Generic category illustrations for products without specific images

### Image Component
```tsx
<ProductImage product={product} size="card" />  // card | hero | thumbnail
// Falls back: product.image_url → provider.logo → category placeholder
```

---

## 8. Database-Driven Pages (Zero Hardcoding)

### Listing Pages (`/credit-cards`, `/loans`, etc.)
- Query `products` table filtered by `product_type` and `is_active`
- Sort by `investingpro_score` DESC (default), allow user sort
- Filter by tags, provider, features
- All filter options derived from actual data in DB

### Detail Pages (`/credit-cards/[slug]`)
- Fetch single product by slug from DB
- All sections render from `features` JSONB + structured fields
- Related products: same `product_type`, similar `tags`, exclude current
- Related articles: query `articles` where `category` matches
- Related calculators: mapped via `product_type` → calculator slugs (mapping in DB `category_calculator_map` table)

### Comparison Pages (`/compare/[combination]`)
- Fetch both products from DB
- Build comparison matrix from `features` JSONB keys
- Score comparison from `investingpro_score` and `score_breakdown`

### Homepage Sections
- "Top Picks" → `SELECT * FROM products WHERE is_featured = true ORDER BY investingpro_score DESC LIMIT 6`
- "Trending" → based on `view_count` or `click_count` in last 7 days
- Category cards → count from `products` table per `product_type`

---

## 9. Interlinking Architecture

### `category_links` table (maps everything)
```sql
category_links (
  id              uuid PRIMARY KEY,
  source_type     text,    -- 'product' | 'article' | 'glossary' | 'calculator'
  source_id       text,    -- slug or id
  target_type     text,
  target_id       text,
  link_type       text,    -- 'related' | 'mentioned' | 'recommended' | 'see_also'
  relevance_score decimal(3,2),
  is_auto         boolean DEFAULT true,
  created_at      timestamptz DEFAULT now()
);
```

### Auto-linking rules
- Product page → shows related articles (by category + tags match)
- Product page → shows related calculators (by product_type mapping)
- Product page → shows glossary terms (scan description for glossary slugs)
- Article → shows contextual products (by category)
- Glossary term → shows related products and articles
- Calculator → shows related products (by calculator type)

---

## 10. Product Experience Components

### Soft CTAs (non-pushy, contextual)
- "Compare with similar cards" button (not "BUY NOW")
- "Calculate your EMI" inline widget
- "See how this compares" link to comparison page
- All CTA text from DB: `cta_config` JSONB on product

### Email Capture (inline, not popup)
- "Get rate alerts for this product" — inline form on product detail page
- Stores in `email_subscribers` table with `product_id` context
- No modals, no popups (per design preferences)

### Sharing
- Existing `SocialShareButtons` component — already built
- Add "Share comparison" on compare pages

### Table of Contents
- Existing `TableOfContents` component — already built for articles
- Add to long product detail pages (>3 sections)

### AI Brief
- "Quick Summary" card at top of long articles
- Generated from article content via AI, cached in DB
- `article.ai_summary` field (text, max 200 words)

### Live Data Tables
- Responsive `<DataTable>` component using `@tanstack/react-table`
- Sortable columns, mobile-friendly (stacked cards on small screens)
- Data from DB, refreshed via ISR (revalidate = 3600)

---

## 11. Phased Rollout

| Phase | Deliverable | Products | Timeline |
|-------|------------|----------|----------|
| 1 | Credit cards seed + scoring | 50 cards | First |
| 2 | Mutual funds (AMFI API) | 200 funds | After Phase 1 |
| 3 | FDs + Loans + Insurance | 100 products | After Phase 2 |
| 4 | Scoring engine + reviews | All products | After Phase 3 |
| 5 | Product experience upgrade | All pages | After Phase 4 |
| 6 | Demat + PPF/NPS + interlinking | 15 products + links | After Phase 5 |

---

## 12. Files to Create/Modify

### New Files
- `data/seed/credit-cards.json` — curated credit card data
- `scripts/seed-credit-cards.ts` — credit card seeder
- `scripts/seed-mutual-funds.ts` — AMFI API integration + seeder
- `scripts/seed-fds.ts` — FD data seeder
- `scripts/seed-loans.ts` — loan data seeder
- `scripts/seed-insurance.ts` — insurance data seeder
- `lib/data-sources/amfi-client.ts` — AMFI NAV API client
- `lib/scoring/product-scorer.ts` — scoring engine
- `lib/data-sources/sentiment-scraper.ts` — review scraping
- `supabase/migrations/product_reviews.sql` — reviews table
- `supabase/migrations/category_links.sql` — interlinking table

### Modify
- `app/credit-cards/page.tsx` — DB-driven listing (remove hardcoded data)
- `app/credit-cards/[slug]/page.tsx` — DB-driven detail page
- All other category pages — same pattern
- `app/page.tsx` — homepage sections from DB
- `components/v2/home/TopPicks.tsx` — fetch from DB

---

## 13. Non-Goals (Explicitly Out of Scope)

- CMS/Conduit alignment (separate spec)
- Admin UI redesign (separate spec)
- Paid API integrations (stick to free sources)
- Real-time data (ISR with hourly revalidation is sufficient)
- User-generated reviews (only scraped reviews for now)
