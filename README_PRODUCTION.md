# InvestingPro - Production Platform

## 🎯 Platform Overview

InvestingPro is India's authoritative, transparent, and SEO-optimized financial intelligence platform - positioned as the "NerdWallet of India."

**Core Principles:**
- ✅ Data-driven with full provenance tracking
- ✅ Transparent, explainable rankings
- ✅ SEO-first architecture
- ✅ Regulatory compliance
- ✅ Multi-language support

## 🏗️ Architecture

### Database (Supabase PostgreSQL)

**Key Features:**
- Provenance tracking for every data point
- Versioned, immutable rankings
- Full audit trail with HTML snapshots
- Type-safe product schemas

**Run Migration:**
```bash
# Apply schema to Supabase
# Copy contents of supabase/migrations/001_core_schema.sql
# Execute in Supabase SQL Editor
```

### Ranking Engine

**Location:** `lib/ranking/engine.ts`

**Features:**
- Deterministic calculations
- Versioned configurations
- Explainable breakdowns
- Transparent methodology

**Usage:**
```typescript
import { rankCreditCards } from '@/lib/ranking/engine';

const results = rankCreditCards(cards, configuration);
// Returns: RankingResult[] with scores, breakdowns, explanations
```

### Data Pipeline

**Components:**
1. **Scrapers** - Python-based, respectful scraping
2. **Normalizer** - Standardizes data format
3. **Supabase Writer** - Direct database writes

**Run Scraper:**
```bash
cd lib/scraper
python pipeline.py
```

**Via API:**
```bash
curl -X POST http://localhost:3000/api/scraper/run \
  -H "Content-Type: application/json" \
  -d '{"type": "credit_cards", "secret": "your-secret"}'
```

### SEO Components

**Implemented:**
- ✅ Structured data (JSON-LD)
- ✅ Dynamic sitemap (`/sitemap.xml`)
- ✅ Robots.txt (`/robots.txt`)
- ✅ Canonical URLs
- ✅ Meta tags component

**Test Structured Data:**
- Use [Google Rich Results Test](https://search.google.com/test/rich-results)

## 📄 Key Pages

### Product Pages
- `/credit-cards/[slug]` - Credit card detail with provenance
- `/mutual-funds/[slug]` - Mutual fund analysis
- `/loans/[slug]` - Personal loan details (TODO)

### Information Pages
- `/methodology` - Ranking methodology explained
- `/editorial-policy` - Editorial independence statement

## 🔐 Environment Setup

**Required Variables:**
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
OPENAI_API_KEY=
SCRAPER_SECRET=
CRON_SECRET=
NEXT_PUBLIC_BASE_URL=
```

## 🚀 Deployment

1. **Database:** Apply migrations to Supabase
2. **Environment:** Set all variables in Vercel
3. **Deploy:** `vercel deploy --prod`
4. **Cron:** Verify cron jobs in Vercel dashboard

## 📊 Data Flow

```
Python Scraper → Normalizer → Supabase Writer → Database
                                              ↓
                                    Product Pages (SSR)
                                              ↓
                                    Rankings Calculated
                                              ↓
                                    SEO-Optimized Pages
```

## 🎯 Next Steps

1. Populate initial data (run scrapers)
2. Calculate rankings
3. Generate content (AI + human review)
4. Launch and monitor

---

**Status:** Production-Ready ✅  
**Documentation:** See `docs/` folder for detailed guides

