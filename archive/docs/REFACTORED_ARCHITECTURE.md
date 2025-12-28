# Refactored Architecture: Data-First Financial Intelligence Platform

## Core Principle
**This is NOT an AI content generator. It is an authoritative financial comparison and ranking engine in the YMYL category.**

---

## 1. PRODUCT TAXONOMY

### Canonical Entities
- `credit_card` - Credit card products
- `mutual_fund` - Mutual fund schemes
- `personal_loan` - Personal loan products
- `broker` - Brokerage accounts (future)
- `bank_account` - Bank accounts (future)

### URL Structure
```
/credit-cards                    → Category listing
/credit-cards/[slug]             → Product detail page
/credit-cards/compare            → Comparison tool
/credit-cards/compare?ids=id1,id2 → Specific comparison

/mutual-funds                    → Category listing
/mutual-funds/[slug]             → Product detail page
/mutual-funds/compare            → Comparison tool

/personal-loans                  → Category listing
/personal-loans/[slug]           → Product detail page
/personal-loans/compare          → Comparison tool
```

### Unique Identifiers
- **Slug**: URL-friendly identifier (e.g., `hdfc-regalia-credit-card`)
- **Product ID**: UUID (database primary key)
- **Canonical URL**: `https://investingpro.in/{product_type}/{slug}`

**No duplicate content paths.** Each product has exactly one canonical URL.

---

## 2. RANKING ENGINE (CORE FEATURE)

### Principles
1. **Deterministic**: Same inputs → same outputs
2. **Reproducible**: Can re-run with historical data
3. **Explainable**: Every score has a breakdown
4. **Transparent**: Methodology is public
5. **Independent**: Rankings NOT influenced by monetization

### Architecture

```
Data Points (with provenance)
    ↓
Normalization & Validation
    ↓
Ranking Configuration (versioned weights)
    ↓
Score Calculation (deterministic algorithm)
    ↓
Ranking Result (score + explanation)
    ↓
Storage (immutable snapshot)
    ↓
UI Display (with explanation)
```

### Ranking Configuration Schema
```typescript
{
  id: UUID,
  name: "Credit Cards - Best Overall 2025",
  product_type: "credit_card",
  version: 1,
  weights: {
    annual_fee: 0.25,
    rewards: 0.30,
    features: 0.15,
    interest_rate: 0.10,
    eligibility: 0.10,
    provider_trust: 0.10
  },
  factors: ["annual_fee", "rewards", "features", ...],
  methodology: "Human-readable explanation...",
  is_active: true,
  created_at: timestamp
}
```

### Ranking Result Schema
```typescript
{
  product_id: UUID,
  total_score: 0-100,
  rank: integer,
  breakdown: [
    {
      factor: "annual_fee",
      rawValue: 500,
      normalizedScore: 80,
      weight: 0.25,
      weightedScore: 20,
      explanation: "Annual fee of ₹500 compared to average of ₹1,200"
    },
    ...
  ],
  strengths: ["No annual fee", "High reward rate"],
  weaknesses: ["High income requirement"],
  explanation: "This card scores 85.5/100..."
}
```

### Implementation
- **Location**: `lib/ranking/engine.ts`
- **API**: `/api/rankings/calculate` (POST)
- **Storage**: `rankings` table (immutable snapshots)

---

## 3. DATA PROVENANCE (MANDATORY)

### Every Numeric Value Must Have:
1. **value**: The actual data point
2. **source_url**: Where it came from
3. **fetched_at**: When it was fetched
4. **update_frequency**: How often it's refreshed

### Database Schema
```sql
product_data_points (
  id UUID,
  product_id UUID,
  field_name TEXT,        -- e.g., "annual_fee"
  field_value JSONB,      -- The actual value
  data_type TEXT,         -- 'number', 'text', 'boolean', etc.
  
  -- Provenance
  source_id UUID,         -- Reference to data_sources table
  source_url TEXT,        -- Direct URL to source
  fetched_at TIMESTAMPTZ, -- When fetched
  update_frequency TEXT,  -- 'daily', 'weekly', 'monthly', 'on_demand'
  
  -- Validation
  is_verified BOOLEAN,
  verification_notes TEXT,
  
  -- Versioning
  version INTEGER,
  previous_value JSONB,
  changed_at TIMESTAMPTZ
)
```

### Display on UI
Every product page must show:
- **Last Updated**: `Last updated: January 15, 2025`
- **Data Sources**: List of sources with links
- **Update Frequency**: "Updated daily" / "Updated weekly"

---

## 4. SEO ARCHITECTURE

### URL Hierarchy
```
/ (homepage)
├── /credit-cards
│   ├── /credit-cards/[slug]
│   └── /credit-cards/compare
├── /mutual-funds
│   ├── /mutual-funds/[slug]
│   └── /mutual-funds/compare
├── /personal-loans
│   ├── /personal-loans/[slug]
│   └── /personal-loans/compare
├── /methodology
├── /editorial-policy
└── /legal-disclaimers
```

### Canonical URLs
- Every page has exactly one canonical URL
- Format: `https://investingpro.in/{product_type}/{slug}`
- Set via `<link rel="canonical">` tag

### JSON-LD Structured Data
Required for all product pages:
1. **FinancialProduct** (schema.org)
2. **Product** (schema.org)
3. **FAQPage** (if FAQs exist)
4. **Review** (if reviews exist)
5. **BreadcrumbList**

### Hreflang (Multi-language)
- Primary: English (`en`)
- Secondary: Hindi (`hi`)
- Format: `<link rel="alternate" hreflang="en" href="...">`

### Sitemap & Robots.txt
- Dynamic sitemap generation from product database
- Robots.txt allows all crawlers (no blocking)

---

## 5. AI USE (STRICT LIMITATIONS)

### AI May ONLY Be Used For:
1. **Drafting summaries** from verified data (human review required)
2. **FAQ extraction** from source documents (human review required)
3. **Metadata generation** (titles, descriptions) (human review required)

### Guardrails:
- ✅ Must use RAG (retrieval from scraped data)
- ✅ Must include citations
- ✅ Must be human-reviewable before publish
- ✅ No financial advice phrasing
- ✅ Informational language only

### AI Workflow
```
Scraped Data (verified)
    ↓
RAG Retrieval
    ↓
AI Draft Generation
    ↓
Human Review (MANDATORY)
    ↓
Publish (with citations)
```

### NOT Allowed:
- ❌ Bulk article generation
- ❌ AI-first content workflows
- ❌ Unreviewed AI content
- ❌ Financial advice or recommendations
- ❌ Claims of expertise or registration

---

## 6. LEGAL & COMPLIANCE

### Language Requirements
- **Informational only**: "This product offers..."
- **No advisory claims**: Never say "We recommend" or "You should"
- **Educational tone**: "Learn about..." instead of "Get the best..."
- **Disclaimers**: Every page must have appropriate disclaimers

### Required Disclaimers
1. **Not a registered advisor**: "InvestingPro.in is not registered with SEBI as an investment advisor."
2. **Informational purpose**: "This information is for educational purposes only."
3. **No guarantee**: "Past performance does not guarantee future results."
4. **User responsibility**: "Users should consult with qualified financial advisors before making decisions."

### Separation of Facts vs Opinions
- **Facts**: Data points with provenance (e.g., "Annual fee: ₹500")
- **Opinions**: Rankings and comparisons (clearly labeled as such)

---

## 7. DATA FLOW

```
1. Data Ingestion (Python Scraper)
   ↓
2. Normalization & Validation
   ↓
3. Storage (Supabase) with Provenance
   ↓
4. Ranking Calculation (Deterministic)
   ↓
5. Explanation Generation
   ↓
6. Content Assembly (Human-reviewed)
   ↓
7. SEO Optimization
   ↓
8. Publication
```

---

## 8. KEY COMPONENTS

### Ranking Explanation UI
- **Component**: `components/ranking/RankingExplanation.tsx`
- **Shows**: Score breakdown, factor weights, strengths/weaknesses
- **Location**: Product detail pages

### Data Provenance Display
- **Component**: `components/common/DataProvenance.tsx`
- **Shows**: Last updated, sources, update frequency
- **Location**: All product pages

### Methodology Page
- **Route**: `/methodology`
- **Content**: How rankings are calculated, weights, factors

### Editorial Policy Page
- **Route**: `/editorial-policy`
- **Content**: Content standards, AI usage policy, review process

---

## 9. IMPLEMENTATION PRIORITIES

### Phase 1 (Immediate)
1. ✅ Refactor AI to support-only
2. ✅ Strengthen ranking engine
3. ✅ Ensure data provenance everywhere
4. ✅ Add ranking explanation UI
5. ✅ Enforce compliance language

### Phase 2 (Next)
1. Complete ranking implementations (mutual funds, loans)
2. Add data provenance display to all pages
3. Create methodology page
4. Create editorial policy page
5. Add hreflang support

---

## 10. SUCCESS METRICS

- **Data Quality**: 100% of numeric values have provenance
- **Ranking Transparency**: All rankings have explainable breakdowns
- **Compliance**: Zero advisory language in published content
- **SEO**: All pages have proper structured data
- **Reproducibility**: Rankings can be re-run deterministically

