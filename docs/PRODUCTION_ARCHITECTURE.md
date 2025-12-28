# InvestingPro: Production Architecture Documentation

## Overview

This document describes the production-grade architecture for InvestingPro, India's authoritative financial intelligence platform.

## Core Principles

1. **Data Provenance**: Every value has source URL, timestamp, update frequency
2. **Transparent Rankings**: Reproducible, explainable, weight-based, not influenced by monetization
3. **SEO-First**: Canonical URLs, structured data (JSON-LD), sitemap, fast Core Web Vitals
4. **Regulatory Compliance**: Educational language only, no unverified claims
5. **Multi-Language**: i18n architecture from day one

## Database Schema

### Key Tables

1. **products** - Unified product table with type discriminator
2. **product_data_points** - Individual fields with full provenance
3. **data_sources** - Source URLs and metadata
4. **rankings** - Versioned, immutable ranking snapshots
5. **ranking_configurations** - Versioned ranking methodologies
6. **raw_data_snapshots** - Full HTML/JSON snapshots for audit

### Schema Features

- **Provenance Tracking**: Every data point links to source
- **Versioning**: Rankings are immutable snapshots
- **Audit Trail**: Full history of data changes
- **Type Safety**: Separate tables for different product types

See `supabase/migrations/001_core_schema.sql` for full schema.

## Ranking Engine

### Architecture

- **Deterministic**: Same inputs = same outputs
- **Versioned**: Configurations stored in database
- **Explainable**: Every score has breakdown
- **Transparent**: Methodology publicly disclosed

### Implementation

Located in `lib/ranking/engine.ts`:

```typescript
rankCreditCards(cards, config) → RankingResult[]
rankMutualFunds(funds, config) → RankingResult[]
rankPersonalLoans(loans, config) → RankingResult[]
```

### Example Configuration

```json
{
  "name": "Credit Cards - Best Overall 2025",
  "productType": "credit_card",
  "version": 1,
  "weights": {
    "annual_fee": 0.25,
    "rewards": 0.30,
    "features": 0.15,
    "interest_rate": 0.10,
    "eligibility": 0.10,
    "provider_trust": 0.10
  },
  "methodology": "Cards are ranked based on..."
}
```

## Data Pipeline

### Architecture

```
Scraper → Normalizer → Validator → Supabase Writer → Database
   ↓
Raw Snapshot Storage (for audit)
```

### Components

1. **Scrapers** (`lib/scraper/example_credit_card_scraper.py`)
   - Respectful rate limiting
   - Error handling
   - HTML snapshot storage

2. **Normalizer** (`lib/scraper/normalizer.py`)
   - Standardizes data format
   - Handles variations (₹, Rs., lakhs, etc.)
   - Type conversion

3. **Supabase Writer** (`lib/scraper/supabase_writer.py`)
   - Writes to database
   - Handles upserts
   - Tracks provenance

### Example Normalized Output

```json
{
  "name": "HDFC Regalia Gold Credit Card",
  "provider": "HDFC Bank",
  "annual_fee": 2500.0,
  "interest_rate": 24.0,
  "reward_rate": 4.0,
  "reward_type": "points",
  "min_income": 600000.0,
  "min_credit_score": 750,
  "source_url": "https://www.hdfcbank.com/...",
  "fetched_at": "2025-01-20T10:30:00Z",
  "update_frequency": "weekly"
}
```

## SEO Implementation

### Structured Data (JSON-LD)

Located in `lib/seo/structured-data.ts`:

- **Product** (FinancialProduct schema)
- **FAQPage** (for FAQ sections)
- **BreadcrumbList** (navigation)
- **Review** (aggregate ratings)
- **Organization** (site metadata)

### Sitemap

- Dynamic generation from database
- Includes all products, comparisons, content
- Updates automatically
- Located at `/sitemap.xml`

### Robots.txt

- Allows all public pages
- Blocks API routes, admin, private content
- Points to sitemap
- Located at `/robots.txt`

## Frontend Architecture

### Pages Structure

```
app/
├── credit-cards/
│   └── [slug]/
│       └── page.tsx          # Product detail page
├── mutual-funds/
│   └── [slug]/
│       └── page.tsx
├── loans/
│   └── [slug]/
│       └── page.tsx
├── methodology/
│   └── page.tsx              # Ranking methodology
├── editorial-policy/
│   └── page.tsx              # Editorial standards
├── sitemap.ts                # Dynamic sitemap
└── robots.ts                 # Robots.txt
```

### Key Features

- **SSR for SEO**: All product pages server-rendered
- **ISR for Catalogs**: Category pages use incremental static regeneration
- **Structured Data**: Every page includes JSON-LD
- **Provenance Display**: Shows data sources and timestamps
- **Ranking Breakdown**: Visual score breakdown with explanations

## API Routes

### Product Data

`GET /api/products/[type]/[slug]`
- Returns product with full provenance
- Includes data points, sources, rankings

### Rankings

`POST /api/rankings/calculate`
- Recalculates rankings for product type
- Uses current configuration
- Stores results in database

### Scraper

`POST /api/scraper/run`
- Triggers Python scraper
- Secured with secret key
- Returns execution results

## Multi-Language Support

### Setup

- Using `next-intl`
- Primary: English
- Secondary: Hindi
- Ready for expansion

### Translation Files

- `messages/en.json` - English
- `messages/hi.json` - Hindi

### Implementation

- Language switcher in navbar
- URL-based routing (`/hi/credit-cards/...`)
- Content structured for translation

## Content System

### AI Content Generation

**Guardrails:**
- RAG (Retrieval-Augmented Generation) only
- Citations required
- Human review before publish
- No financial advice

**Workflow:**
1. AI generates first draft
2. Citations added from source data
3. Human reviewer checks
4. Published if approved

### Content Types

- Articles (guides, analysis)
- FAQs (extracted from data)
- Comparisons (product vs product)
- Product summaries

## Security & Compliance

### Data Protection

- Row Level Security (RLS) enabled
- Public read access only
- No sensitive user data stored

### Regulatory Compliance

- Educational language only
- No unverified claims
- Clear disclaimers
- Methodology transparency

### API Security

- Secret keys for scrapers
- Rate limiting (to be implemented)
- Input validation
- Error handling

## Monitoring & Logging

### Logging

- Structured logging via `lib/logger.ts`
- Different levels (debug, info, warn, error)
- Production monitoring hooks ready

### Error Tracking

- Error boundaries in place
- User-friendly error pages
- Development error details

## Deployment

### Vercel Configuration

- Cron jobs for scheduled scraping
- Function timeouts configured
- Environment variables required

### Environment Variables

See `.env.example` for required variables:
- Supabase credentials
- OpenAI API key
- Scraper secrets
- Base URL

## Next Steps

1. **Complete Product Pages**: Mutual funds and loans detail pages
2. **Comparison Engine**: Head-to-head comparison UI
3. **Content Pipeline**: Automated article generation
4. **Monitoring**: Set up Sentry/LogRocket
5. **Performance**: Optimize Core Web Vitals
6. **Testing**: Expand test coverage

---

**Last Updated:** January 2025  
**Status:** Production-Ready Architecture ✅

