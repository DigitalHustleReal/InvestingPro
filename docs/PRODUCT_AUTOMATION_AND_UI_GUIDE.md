# Product Automation, Comparison Engine & UI Guide
## How to Add Products Legally, Keep Them Updated, and Build World-Class Pages

---

## 1. HOW TO ADD PRODUCTS LEGALLY (The Only Correct Answer)

### The 3-Tier Legal Framework

#### TIER 1 — Official Regulatory APIs (Use First, Always)
These are 100% legal, free, and explicitly published for public use:

| Source | Data | URL | Update Freq |
|--------|------|-----|-------------|
| **AMFI** | All mutual fund NAVs (5,000+ funds) | `amfiindia.com/spages/NAVAll.txt` | Daily |
| **mfapi.in** | Fund details + historical NAV | `api.mfapi.in/mf` | Daily |
| **RBI DBIE** | Policy rates, FX, inflation | `dbie.rbi.org.in` | Weekly/As announced |
| **Data.gov.in** | Government financial datasets | `data.gov.in` | Varies |
| **SEBI** | Fund categories, regulations | `sebi.gov.in` | As announced |
| **IRDAI** | Insurance claim ratios | `irdai.gov.in` | Annual |
| **NSE** | Index data, market cap | `nseindia.com/api` | Live |

**Implementation**: `lib/data-sources/legal-product-pipeline.ts` → `syncMutualFundsFromAMFI()`

#### TIER 2 — Respectful Public Website Scraping (Credit Cards, Insurance, Loans)
Legally permissible when:
- ✅ You scrape only publicly displayed information (no login required)
- ✅ You check and comply with `robots.txt`
- ✅ You rate limit (minimum 5 seconds between requests per domain)
- ✅ Your User-Agent identifies your bot: `InvestingPro-DataBot/1.0 (+https://investingpro.in/bot)`
- ✅ Data is used for comparison/education purposes (not resold)
- ✅ You link back to the original source for latest info
- ✅ You remove data on request from the copyright holder

**Banks that allow this**: HDFC, SBI, ICICI, Axis, Kotak — their product pages are marketing material intended to be publicly read and compared.

**Do NOT scrape**:
- ❌ Pages behind login
- ❌ Actual customer account data
- ❌ Real-time transaction data
- ❌ APIs with authentication that you've bypassed

**Implementation**: `lib/scraper/credit-card-scraper.ts` (uses Playwright, requires `npm install playwright`)

#### TIER 3 — Partnership APIs (Best Data Quality, Requires Agreement)
Business partnerships with aggregators give you cleaner, more complete data:

| Partner | How to Apply | Data Quality | Commission |
|---------|-------------|--------------|------------|
| **BankBazaar** | bankbazaar.com/affiliate | Excellent | 1-3% |
| **Paisabazaar** | paisabazaar.com/affiliates | Excellent | 1-3% |
| **PolicyBazaar** | policybazaar.com/affiliates | Excellent | 1-5% |
| **VCommission** | vcommission.com | Good | Varies |
| **CJ Affiliate** | cj.com | Good | Varies |

Once you have API access, replace the curated data in `CURATED_CREDIT_CARDS` with live API calls.

---

## 2. AUTOMATED PRODUCT UPDATE PIPELINE

### Architecture

```
Daily Cron (6 AM IST)
  │
  ├── AMFI Sync → 5,000+ mutual funds with daily NAV
  │     └── legal-product-pipeline.ts → syncMutualFundsFromAMFI()
  │
  ├── Curated Credit Card Sync → update fees/rates from curated list
  │     └── legal-product-pipeline.ts → syncCuratedProducts()
  │
  ├── RBI Rate Sync → repo rate, reverse repo, bank rate
  │     └── legal-product-pipeline.ts → syncRBIPolicyRates()
  │
  └── Scraper Run (weekly, Sunday 2 AM)
        └── credit-card-scraper.ts → scrapeAllCreditCards()
              ├── scrapeHDFC()    ← respects robots.txt
              ├── scrapeSBI()     ← rate limited
              ├── scrapeICICI()   ← 5s delay between pages
              └── scrapeAxis()    ← identifies as bot
```

### How to Trigger

```bash
# Manual: Test the pipeline locally
curl http://localhost:3000/api/cron/sync-legal-products \
  -H "Authorization: Bearer $CRON_SECRET"

# Manual: Run credit card scraper
curl http://localhost:3000/api/cron/scrape-credit-cards \
  -H "Authorization: Bearer $CRON_SECRET"

# Automatic: Vercel Cron (set in vercel.json)
# "sync-legal-products" runs at 12:30 UTC = 6 AM IST daily
```

### Keeping Data Fresh (Update Strategy)

| Product Type | Update Frequency | Method |
|---|---|---|
| Mutual Fund NAV | Daily | AMFI official feed |
| Credit Card Fees | Monthly | Scraper + manual verification |
| Insurance Premiums | Quarterly | Manual + IRDAI |
| Loan Interest Rates | Weekly | RBI rates → calculate |
| Stock/Index data | Real-time | Alpha Vantage / Yahoo Finance |

---

## 3. ADDING NEW PRODUCTS (Step-by-Step)

### Option A: Via Admin CMS (Immediate)
1. Go to `/admin/products/new`
2. Fill in: name, category, provider, features (JSON)
3. Add affiliate link (from VCommission/CJ dashboard)
4. Set `is_verified: true`, `trust_score: 85`
5. Publish → Versus generator auto-creates comparison pages

### Option B: Via Code (Bulk)
Add to `CURATED_CREDIT_CARDS` array in `lib/data-sources/legal-product-pipeline.ts`:

```typescript
{
  name: 'HDFC Infinia Metal',
  bank: 'HDFC Bank',
  slug: 'hdfc-infinia-metal',
  annualFee: '₹12,500 + GST',
  joiningFee: '₹12,500 + GST',
  rewardRate: '5 points per ₹150 on all spends',
  interestRate: '3.6% per month',
  welcomeBonus: '12,500 reward points',
  loungeAccess: 'Unlimited domestic + international (Priority Pass)',
  fuelSurchargeWaiver: true,
  minIncome: '₹3,00,000 per month',
  minCreditScore: 800,
  applyLink: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-metal-edition',
  sourceUrl: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-metal-edition',
}
```

Then run: `curl /api/cron/sync-legal-products -H "Authorization: Bearer $CRON_SECRET"`

### Option C: Via Scraper (Automated)
Extend `credit-card-scraper.ts` with a new function:

```typescript
async function scrapeKotak(): Promise<ScrapeResult> {
  // 1. Check robots.txt first
  const allowed = await isScrapingAllowed('https://www.kotak.com', '/credit-cards')
  if (!allowed) return { success: false, cards: [], errors: ['robots.txt blocked'], bank: 'Kotak' }

  // 2. Launch Playwright (installed via npm install playwright)
  const { launchBrowser } = await import('./playwright-scraper')
  const browser = await launchBrowser(true)
  // ... scrape with 5s delays between pages
}
```

### Versus Pages Auto-Generation
Every new product pair creates a comparison page automatically:

```typescript
// Run this after adding new products
// Creates /compare/hdfc-infinia-vs-axis-magnus etc.
import { generateVersusPages } from '@/lib/seo/versus-generator'
await generateVersusPages({ category: 'credit_card', limit: 100 })
```

With 50 credit cards: **50 × 49 / 2 = 1,225 unique comparison pages**
With 200 credit cards: **200 × 199 / 2 = 19,900 unique comparison pages**

---

## 4. SINGLE PRODUCT PAGE — Design System

### Current Implementation (Credit Card Page)
`/app/credit-cards/[slug]/page.tsx` — Already production-ready with:
- Hero section with trust badges
- Rating breakdown
- Reward calculator (interactive)
- Eligibility checker inline
- Pros/cons table
- Document checklist
- Expert opinion
- Alternatives carousel
- Reviews section
- Related articles
- Sticky mobile CTA
- Affiliate disclosure

### Product Page Information Architecture

```
/credit-cards/[slug]
│
├── ABOVE THE FOLD
│   ├── Card image + name + provider badge
│   ├── Overall score (0-100 gauge)
│   ├── Star rating + review count
│   ├── "Apply Now" CTA (affiliate tracked)
│   ├── Top 3 highlights (joining fee, reward rate, lounge)
│   └── "Compare" button (opens CompareBar)
│
├── SECTION 1: Quick Summary
│   ├── Fee table (joining, annual, addon)
│   ├── Reward rate table
│   └── "Best for" badges
│
├── SECTION 2: Reward Calculator (interactive)
│   └── Input monthly spend → shows reward value
│
├── SECTION 3: Full Feature Breakdown
│   ├── Travel benefits (lounge, insurance)
│   ├── Dining benefits
│   ├── Shopping benefits (EMI, offers)
│   └── Fuel surcharge waiver
│
├── SECTION 4: Eligibility
│   ├── Inline eligibility checker (client component)
│   ├── Min income, credit score, age
│   └── Required documents
│
├── SECTION 5: Expert Opinion
│   └── Curated text from financial expert
│
├── SECTION 6: Pros & Cons
│
├── SECTION 7: User Reviews
│   └── Reviews with filtering
│
├── SECTION 8: Alternatives
│   └── Horizontal scroll of similar products
│
└── SECTION 9: Related Articles
    └── "How to maximize HDFC Regalia benefits" etc.
```

### UI Principles for Product Pages
- **Hero**: Dark gradient background, card image, score ring, primary CTA
- **Typography**: Font-black headings, 1.4 line height for body
- **Colors**: Primary (teal/blue), trust (green), warning (amber)
- **Mobile**: Sticky "Apply Now" bar at bottom (StickyMobileCTA component)
- **Trust signals**: SEBI verified, last updated date, review count
- **Conversion**: Multiple CTAs (hero, mid-page, post-calculator, bottom)

---

## 5. SINGLE CONTENT PAGE — Design System

### New Implementation
`/app/articles/[slug]/page.tsx` has been converted to ISR server component.

### Architecture Changes (New vs Old)

| Feature | Old (`"use client"`) | New (ISR Server) |
|---------|---------------------|-----------------|
| SEO | Poor (CSR, no SSR HTML) | Excellent (full HTML at build time) |
| First load | Shows spinner 2-3s | Instant (pre-rendered) |
| Google indexing | Partial | Complete |
| Preview mode | Client-side fetch | Server-side (searchParams) |
| Reading progress | Client | Client island (ArticleClientShell) |
| Bookmark | Client | Client island |
| Share | Client | Client island |
| Related articles | Client | Suspense + Server |
| Caching | None | ISR 1 hour |
| Static generation | None | Top 100 at build time |

### Content Page Information Architecture

```
/articles/[slug]
│
├── FIXED: Reading progress bar (top, 2px)
├── FIXED: Floating actions (bookmark + share, right side desktop)
│
├── HEADER AREA
│   ├── Category badge + Difficulty badge + Fact-checked badge
│   ├── H1 title (font-black, 5xl)
│   ├── Excerpt (bordered left, xl, muted)
│   └── Meta row (author, date, read time, views)
│
├── FEATURED IMAGE (aspect-video, rounded-2xl, next/image)
│
├── ADVERTISER DISCLOSURE (above fold)
│
├── ARTICLE BODY (id="article-content")
│   └── ArticleRenderer (handles markdown, HTML, calculator shortcodes)
│
├── POST-CONTENT CONVERSIONS
│   ├── SeamlessCTA (category-specific, inline)
│   ├── LeadMagnet (category-specific download)
│   └── ContextualProducts (relevant product cards)
│
├── TAGS (link to /tag/[tag])
│
├── RELATED ARTICLES (Suspense)
│
└── SIDEBAR (desktop only, sticky)
    └── TopPicksSidebar (category-filtered product cards)
```

### Content Page UI Principles
- **Reading experience**: Max 720px content width, 1.8 line height, 18px base font
- **Typography**: `prose` class via `@tailwindcss/typography`
- **Headings**: Anchor links (for TOC), font-bold, not font-black
- **Code blocks**: Syntax highlighted with gray background
- **Tables**: Responsive horizontal scroll on mobile
- **CTAs**: Never interrupt reading flow — placed at section breaks
- **Mobile**: No sidebar, reading actions in floating sheet
- **Performance**: ISR means Google crawls full HTML, not spinner

---

## 6. COMPARISON ENGINE — Architecture

### URL Structure
```
/compare/[product-a-slug]-vs-[product-b-slug]
```

Example: `/compare/hdfc-regalia-gold-vs-axis-magnus`

### Data Flow

```
User visits /compare/hdfc-regalia-vs-axis-magnus
              │
              ▼
Check versus_pages table (cached programmatic SEO)
              │
        Found? ──YES──► Use cached verdict (instant)
              │
             NO
              │
              ▼
Fetch both products from products table
              │
              ▼
Category match check (prevent credit-card vs mutual-fund)
              │
              ▼
Generate AI verdict via Gemini (getComparisonVerdict())
              │
              ▼
Cache in comparison_cache table
              │
              ▼
Render full comparison page
```

### Comparison Matrix Logic

The `buildComparisonRows()` function in the comparison page:
1. Reads `features` JSONB from both products
2. Matches known field names (annual_fee, reward_rate, etc.)
3. Parses numeric values to determine winner
4. Sets `winner: 'p1' | 'p2' | 'tie'` per row
5. Renders green highlight + checkmark on winner

### Pre-Generate All Comparison Pages (SEO Scale)

```bash
# Generate all credit card comparisons (run weekly)
node scripts/generate-versus-pages.ts --category credit_card
# With 50 cards → generates 1,225 rows in versus_pages table
# Each row = one fully indexed /compare/ URL
```

### Comparison Page Scoring
Overall winner = product with most feature wins + higher rating
- Each feature row counts as 1 point to winner
- Rating tie-breaker

---

## 7. QUICK COMMANDS

```bash
# Add Playwright (required for bank scraping)
npm install playwright
npx playwright install chromium

# Run legal product sync
curl /api/cron/sync-legal-products -H "Authorization: Bearer $CRON_SECRET"

# Run credit card scraper
curl /api/cron/scrape-credit-cards -H "Authorization: Bearer $CRON_SECRET"

# Verify product count
node -e "
const { createServiceClient } = require('./lib/supabase/service')
const s = createServiceClient()
s.from('products').select('category', { count: 'exact' }).then(r => console.log(r.count))
"

# Test comparison page
curl http://localhost:3000/compare/hdfc-regalia-gold-vs-sbi-elite
```

---

## 8. LEGAL CHECKLIST (Before Going Live)

- [ ] robots.txt checker implemented (`isScrapingAllowed()` function in pipeline)
- [ ] Bot User-Agent set: `InvestingPro-DataBot/1.0 (+https://yourdomain.com/bot)`
- [ ] Rate limiting: minimum 5 seconds between requests per domain
- [ ] Data attribution: `data_source_url` stored with every scraped record
- [ ] `last_scraped_at` timestamp on every product record
- [ ] SEBI disclaimer on all product pages
- [ ] Affiliate disclosure on all articles with product links
- [ ] "Information may change — verify on official website" note
- [ ] GDPR/DPDP compliant: no user data stored without consent
- [ ] Compliance checker running on all AI-generated content

---

*Last updated: March 21, 2026*
