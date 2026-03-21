# QUICK WINS: Next 30 Days
## Highest-ROI Actions to Go from ₹0 → ₹50,000/month

> **Goal**: First real revenue within 30 days
> **Total time investment**: ~40 hours (developer) + automated runs
> **Total cash investment**: ₹15,000–25,000 (API costs only)

---

## DAY 1–2: API KEYS & INFRASTRUCTURE (2 hours, ₹0 cost)
**Unlocks**: All existing automation that's currently dead

### Step 1: Add Required Environment Variables

Open `.env.local` (or Vercel environment settings) and add:

```bash
# Revenue (BLOCKING)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (BLOCKING — no leads without this)
RESEND_API_KEY=re_...

# AI Content Generation (BLOCKING)
OPENAI_API_KEY=sk-...

# Automation Queue (BLOCKING)
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

# Affiliate Networks
VCOMMISSION_API_KEY=...
CJ_AFFILIATE_KEY=...

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...

# Social (optional in week 1)
TWITTER_BEARER_TOKEN=...
```

**Time**: 30 minutes
**Outcome**: Stripe, email, AI pipeline, and Inngest all come alive

### Step 2: Install Missing Dependencies

```bash
npm install playwright
npx playwright install chromium
```

**Time**: 15 minutes
**Outcome**: Product scraper can now crawl BankBazaar, CardExpert

### Step 3: Verify Everything Works

```bash
# Test content generation
curl -X POST /api/admin/content-factory \
  -H "Content-Type: application/json" \
  -d '{"action":"generate","category":"credit-cards","count":1}'

# Test product scraper
curl -X POST /api/cron/product-data-scraping

# Test email
curl -X POST /api/test/email -d '{"to":"your@email.com"}'
```

---

## DAY 2–7: SEED THE PRODUCT DATABASE (4 hours + automated)
**Unlocks**: 500+ comparison pages, working affiliate links

### Run the Product Scraper

```bash
# Seed credit cards (target: 50+ cards)
node scripts/scrape-products.ts --category credit-cards --limit 50

# Seed mutual funds from AMFI
node scripts/scrape-products.ts --category mutual-funds --limit 200

# Seed brokers
node scripts/scrape-products.ts --category brokers --limit 30

# Seed insurance products
node scripts/scrape-products.ts --category insurance --limit 50

# Seed loans
node scripts/scrape-products.ts --category loans --limit 40
```

**Expected outcome**: 370+ products in database
**Versus pages auto-generated**: 370*(369)/2 = 68,265 potential comparison pages
**Time**: 4 hours setup, then automated nightly

### Manual Fallback (if scraper issues)

Use existing Admin CMS to add products manually:
1. Go to `/admin/products/new`
2. Add top 20 credit cards (HDFC, ICICI, SBI, Axis, Kotak — 4 cards each)
3. Add top 20 mutual funds (top performers from AMFI list)
4. Add top 10 insurance products

**Time**: 8 hours manual work
**Outcome**: 50 products = 1,225 comparison pages minimum

---

## DAY 3–14: CONTENT EXPLOSION (10 hours setup + automated)
**Unlocks**: SEO traffic, affiliate link opportunities

### Run the AI Content Pipeline at Scale

```bash
# Phase 1: Product Reviews (high affiliate intent)
node scripts/generate-content.ts \
  --template product-review \
  --count 30 \
  --category credit-cards \
  --publish true

# Phase 2: Comparison Guides (highest conversion)
node scripts/generate-content.ts \
  --template comparison-guide \
  --count 20 \
  --category credit-cards \
  --publish true

# Phase 3: How-To Guides (long-tail keywords)
node scripts/generate-content.ts \
  --template how-to-guide \
  --count 20 \
  --category loans \
  --publish true

# Phase 4: Beginner Guides (top-of-funnel)
node scripts/generate-content.ts \
  --template beginners-guide \
  --count 20 \
  --category mutual-funds \
  --publish true

# Phase 5: Glossary terms (SEO breadth)
node scripts/generate-glossary.ts --count 200 --publish true
```

**Target by Day 14**: 100 articles + 200 glossary terms
**AI API cost**: ~₹8,000–12,000 (GPT-4 at scale)
**Expected organic traffic by Day 30**: 2,000–8,000 visitors

### Highest-Priority Articles to Publish (Manual or AI)

These specific articles will generate first revenue:

1. "Best Credit Cards for Airport Lounge Access 2026" → affiliate: ₹1,500–3,000/card
2. "Zerodha vs Groww vs Angel One: Full Comparison" → affiliate: ₹300/account
3. "Best SIP Plans for ₹1,000/month Beginners" → affiliate: ₹200/SIP
4. "Term Insurance: LIC vs HDFC Life vs ICICI Pru" → affiliate: ₹1,000–2,000/policy
5. "Home Loan Interest Rate Comparison 2026" → lead gen: ₹500–2,000/lead
6. "Best Savings Account Interest Rates India" → affiliate + display
7. "Mutual Fund Expense Ratio Explained" → trust builder
8. "How to Check CIBIL Score Free" → lead gen
9. "Credit Card Annual Fee Waiver: Complete Guide" → affiliate
10. "PPF vs ELSS: Which is Better for Tax Saving?" → affiliate

---

## DAY 7–14: AFFILIATE LINKS ACTIVATION (4 hours)
**Unlocks**: First affiliate commissions

### Wire Affiliate Links to Products

```typescript
// In /lib/affiliate/link-injector.ts — verify these product mappings exist:

const AFFILIATE_MAP = {
  'hdfc-regalia': 'https://track.vcommission.com/...?ref=investingpro',
  'zerodha': 'https://track.zerodha.com/?ref=investingpro',
  'policybazaar-term': 'https://track.policybazaar.com/?ref=investingpro',
  // Add all affiliate product links here
}
```

**Apply affiliate links** to all product CTA buttons:
1. Go to Admin → Products
2. For each product, add the affiliate tracking URL
3. Verify "Apply Now" buttons use tracked URLs

**Time**: 4 hours
**Outcome**: Every product page now earns commission on clicks

### Set Up Conversion Tracking

Add conversion tracking pixels to thank-you pages:
```typescript
// In /app/affiliate/callback/route.ts
// Already exists — verify it's logging to database
```

---

## DAY 10–20: EMAIL LIST LAUNCH (3 hours)
**Unlocks**: Direct revenue channel, not dependent on Google

### Activate Lead Capture

1. **Homepage email capture**: "Get free weekly best rates newsletter"
2. **Calculator results**: "Email me this calculation"
3. **Article bottom**: "Get similar articles in your inbox"
4. **Exit intent popup**: "Don't miss: best credit card of 2026"

### Set Up Email Sequences (already built)

Verify these sequences exist and activate in `/lib/email/sequences/`:
- `welcome-sequence.ts` — 7-email onboarding over 14 days
- `weekly-rates-digest.ts` — weekly best rates email
- `product-recommendation.ts` — personalized picks

```bash
# Activate email sequences
curl -X POST /api/admin/email/activate-sequences
```

**Target**: 500 email subscribers by Day 30
**Revenue path**: 500 subscribers → 5 conversions/mo × ₹5,000 avg → ₹25,000/mo

---

## DAY 14–21: SEO TECHNICAL (4 hours)
**Unlocks**: Faster Google indexing

### Submit to Google Search Console

1. Verify domain at search.google.com/search-console
2. Submit sitemap: `https://yourdomain.com/sitemap.xml`
3. Request indexing for top 20 articles

### Implement Missing Schema Markup

Verify these schema types are in place:
- `Article` schema on all articles ✓ (likely exists)
- `FAQPage` schema on comparison articles
- `Product` schema on product pages
- `Review` + `AggregateRating` schema

### Fix Core Web Vitals

Quick wins:
```bash
# Check current score
npx lighthouse https://yourdomain.com --output json

# Expected issues and fixes:
# LCP > 2.5s → preload hero image
# CLS > 0.1 → fix layout shifts in product cards
# FID/INP → reduce JS bundle (check next build analyzer)
```

---

## DAY 20–30: FIRST REVENUE REPORTING (2 hours)
**Unlocks**: Data to optimize

### Set Up Revenue Dashboard

The Admin dashboard exists at `/admin/analytics` — verify it shows:
- [ ] Affiliate clicks by product
- [ ] Conversion rate by article
- [ ] Email subscriber growth
- [ ] Subscription revenue
- [ ] Top traffic pages

### Optimize the Top 10 Articles

By Day 20 you should have data. For top performing articles:
1. Add more affiliate CTAs
2. Improve meta title/description (CTR optimization)
3. Add internal links to comparison pages
4. Add FAQ schema for voice search

---

## 30-DAY EXPECTED RESULTS

| Metric | Day 1 | Day 30 | Growth |
|--------|-------|--------|--------|
| Articles | 4 | 100+ | 25x |
| Products | 10 | 370+ | 37x |
| Comparison pages | 0 | 5,000+ | ∞ |
| Glossary terms | 0 | 200+ | ∞ |
| Email subscribers | 0 | 500 | ∞ |
| Monthly visitors | ~100 | 5,000–15,000 | 50-150x |
| Monthly revenue | ₹0 | ₹15,000–50,000 | ∞ |

---

## DAILY CHECKLIST (Once Automated)

After setup is complete, your daily work = 30 minutes:

```
[ ] Check admin dashboard: any errors in cron jobs?
[ ] Review 3 AI-generated articles: approve or reject
[ ] Check affiliate click reports: any anomalies?
[ ] Respond to user comments/reviews
[ ] Check email unsubscribe rate (should be <1%)
[ ] Note: everything else runs automatically
```

---

## COSTS SUMMARY

| Item | Monthly Cost | One-Time |
|------|-------------|---------|
| OpenAI API (content gen) | ₹8,000–15,000 | — |
| Inngest (automation queue) | ₹2,500 | — |
| Resend (email) | ₹800 | — |
| Vercel hosting | ₹0 (existing) | — |
| Supabase database | ₹0 (existing) | — |
| Playwright scraping | ₹0 (self-hosted) | — |
| **TOTAL** | **₹11,300–18,300/mo** | **₹0** |

**Break-even**: ₹18,300/mo in costs → need ~3–4 credit card conversions to cover
**First profit**: Week 3–4 (as traffic starts converting)

---

*Execute in order. Don't skip steps. The system is built — now just turn it on.*

*Compiled: March 21, 2026*
