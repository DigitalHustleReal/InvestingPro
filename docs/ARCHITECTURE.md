# InvestingPro: Production Architecture

## Core Principles

1. **Data Provenance**: Every value has source, timestamp, update frequency
2. **Transparent Rankings**: Reproducible, explainable, weight-based
3. **SEO-First**: Canonical URLs, structured data, fast Core Web Vitals
4. **Regulatory Compliance**: Educational language, no unverified claims
5. **Multi-Language**: i18n from day one

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                   │
│  • SSR for SEO pages                                    │
│  • ISR for product catalogs                             │
│  • Client components for interactivity                  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              API Layer (Next.js API Routes)             │
│  • Product data endpoints                               │
│  • Ranking calculations                                 │
│  • Comparison queries                                   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Database (Supabase PostgreSQL)             │
│  • Products (credit_cards, mutual_funds, loans)         │
│  • Rankings (versioned, reproducible)                   │
│  • Data provenance (sources, timestamps)                │
│  • Content (articles, FAQs)                             │
└─────────────────────────────────────────────────────────┘
                          │
                          ▲
                          │
┌─────────────────────────────────────────────────────────┐
│         Data Pipeline (Python - Separate Service)      │
│  • Scrapers (Scrapy/Playwright)                        │
│  • Normalization layer                                  │
│  • Schema validation                                   │
│  • Scheduled jobs (daily refresh)                      │
└─────────────────────────────────────────────────────────┘
```

## Database Schema Design

### Core Tables

1. **products** - Unified product table with type discriminator
2. **product_data_points** - Individual data fields with provenance
3. **data_sources** - Source URLs and metadata
4. **rankings** - Versioned ranking configurations and results
5. **ranking_methodology** - Explainable ranking logic
6. **content** - Articles, FAQs with citations
7. **content_reviews** - Human review workflow

### Key Design Decisions

- **Provenance First**: Every data point tracks source, fetch time, update frequency
- **Versioned Rankings**: Rankings are immutable, versioned snapshots
- **Normalized Data**: Separate tables for different product types but unified interface
- **Audit Trail**: Full history of data changes

