# Mutual Fund Detail Page — Implementation Plan

> Goal: Build the best mutual fund detail page in India — better than Groww, ET Money, Kuvera, Zerodha Coin, and NerdWallet.
> Status: PLANNED — Execute next session

---

## Competitive Analysis Summary

| Feature | Groww | ET Money | InvestingPro (Target) |
|---------|-------|---------|----------------------|
| Hero + Stats | Logo, NAV, 3Y return, risk badge | Logo, NAV, rating stars | Logo, NAV, animated return, risk meter, AI verdict |
| NAV Chart | 1M/6M/1Y/3Y/5Y interactive | With benchmark overlay | Interactive + benchmark + SIP growth overlay |
| SIP Calculator | Slider + returns table | Bar chart + table | Embedded + visual + "what ₹500/mo becomes" |
| Holdings | Top 10 + stock links | Sector pie chart | Top 10 + pie chart + overlap detector |
| Returns | Fund vs category vs rank | Annualized + absolute | + post-tax returns + rolling returns |
| Compare | 4 similar funds table | Side-by-side | AI-picked alternatives + "why this over that" |
| Exit Load/Tax | Expandable text | Same | Visual timeline + tax calculator |
| Fund Manager | Name + tenure | Name + photo | Name + photo + track record + other funds |
| FAQs | Auto-generated | Auto-generated | AI-generated + schema markup |
| **UNIQUE** | — | — | AI verdict, overlap detector, goal matcher, plain English risk, tax-aware returns |

---

## Architecture

### Route
```
app/mutual-funds/[slug]/page.tsx     — Server component (ISR, revalidate: 3600)
```

### Data Sources
```
1. Supabase products table          — Base fund data (name, NAV, category, features JSONB)
2. mfapi.in (FREE)                  — Historical NAV, returns (1Y/3Y/5Y), no auth needed
3. AMFI API                         — Latest NAV (daily refresh)
4. Static: fund house logos         — public/images/fund-houses/{slug}.png
5. AI service (on-demand)           — "Should you invest?" verdict, FAQ generation
```

### Key Files to Create/Modify
```
NEW:  app/mutual-funds/[slug]/page.tsx          — Detail page (server component)
NEW:  components/mutual-funds/FundHero.tsx       — Hero section with logo, stats, CTA
NEW:  components/mutual-funds/NAVChart.tsx       — Interactive NAV chart (recharts)
NEW:  components/mutual-funds/ReturnCalculator.tsx — SIP/Lumpsum calculator widget
NEW:  components/mutual-funds/ReturnsTable.tsx   — Returns comparison table
NEW:  components/mutual-funds/HoldingsSection.tsx — Portfolio holdings + pie chart
NEW:  components/mutual-funds/FundCompare.tsx    — Compare similar funds
NEW:  components/mutual-funds/ExitLoadTax.tsx    — Exit load + tax info
NEW:  components/mutual-funds/FundFAQ.tsx        — Auto-generated FAQs with schema
NEW:  components/mutual-funds/AIVerdict.tsx      — AI "Should you invest?" card
NEW:  components/mutual-funds/RiskExplainer.tsx  — Plain English risk + drawdown history
NEW:  lib/data-sources/mfapi-client.ts           — mfapi.in client (historical NAV)
EDIT: lib/data-sources/amfi-client.ts            — Add returns enrichment
EDIT: app/mutual-funds/page.tsx                  — Link to detail pages
EDIT: app/sitemap.ts                             — Add fund detail URLs
```

---

## Phase 1: Core Detail Page (Session 1)

### 1.1 Data Enrichment — mfapi.in Integration
```
Endpoint: https://api.mfapi.in/mf/{scheme_code}
Returns:  scheme name, scheme code, historical NAV array [{date, nav}]
Free, no auth, no rate limit mentioned
```

Create `lib/data-sources/mfapi-client.ts`:
- `fetchFundHistory(schemeCode: string)` → historical NAV data
- `calculateReturns(navHistory)` → 1Y, 3Y, 5Y, 10Y returns
- `calculateSIPReturns(navHistory, monthly, years)` → SIP simulation
- Cache in Supabase or Redis (24h TTL)

### 1.2 Fund Detail Page — `/mutual-funds/[slug]/page.tsx`

Server component with ISR (revalidate: 3600):

```tsx
// Data fetching
1. Fetch fund from Supabase by slug
2. Fetch historical NAV from mfapi.in (cached)
3. Calculate returns (1Y/3Y/5Y/10Y)
4. Get similar funds from same category
5. Generate structured data (JSON-LD)
```

### 1.3 Component Breakdown

#### FundHero (above the fold)
```
┌─────────────────────────────────────────────────┐
│ [Logo]  SBI Bluechip Fund                       │
│         Direct Plan · Growth                    │
│                                                 │
│  Equity │ Large Cap │ ●●●●○ Very High Risk      │
│                                                 │
│  NAV ₹93.26        AUM ₹55,246 Cr              │
│  as on 31 Mar 2026  Expense: 0.84%             │
│                                                 │
│  +15.72%           Min SIP    Rating            │
│  3Y annualised     ₹500       ★★★★ (4/5)       │
│                                                 │
│  [Start SIP ₹500/mo]  [Compare]  [Share]        │
└─────────────────────────────────────────────────┘
```

#### NAVChart (interactive)
```
┌─────────────────────────────────────────────────┐
│  NAV Movement            1M 6M 1Y 3Y 5Y All    │
│  ┌─────────────────────────────────────────┐    │
│  │         ╱╲    ╱╲                        │    │
│  │   ╱╲  ╱    ╲╱    ╲  ╱─────             │    │
│  │  ╱  ╲╱              ╲╱                  │    │
│  │╱                                        │    │
│  └─────────────────────────────────────────┘    │
│  Hover: ₹93.26 on 31 Mar 2026                  │
└─────────────────────────────────────────────────┘
```

#### ReturnCalculator (embedded SIP calculator)
```
┌─────────────────────────────────────────────────┐
│  Return Calculator       [Monthly SIP] [Lumpsum]│
│                                                 │
│  Monthly Investment: ₹500  ──────●──────        │
│                                                 │
│  Period    Invested    Value      Returns        │
│  1 Year   ₹6,000      ₹6,544    +9.07%         │
│  3 Years  ₹18,000     ₹22,500   +25.0%         │
│  5 Years  ₹30,000     ₹45,765   +52.6%         │
│  10 Years ₹60,000     ₹1,28,158 +113.6%        │
└─────────────────────────────────────────────────┘
```

#### ReturnsTable (fund vs category vs benchmark)
```
┌─────────────────────────────────────────────────┐
│  Returns & Rankings    [Annualised] [Absolute]   │
│                                                 │
│              1Y      3Y      5Y      10Y        │
│  Fund        +8.2%   +15.7%  +14.3%  +13.8%    │
│  Category    +9.1%   +15.1%  +15.0%  +13.2%    │
│  Nifty 50    +7.8%   +14.2%  +13.8%  +12.5%    │
│  Rank        #12/36  #8/36   #5/36   #3/36     │
│              ████░░  ██████  ███████ █████████  │
└─────────────────────────────────────────────────┘
```

---

## Phase 2: Differentiation Features (Session 2)

### 2.1 AI Verdict Card
```
┌─────────────────────────────────────────────────┐
│  🤖 AI Analysis                                │
│                                                 │
│  "SBI Bluechip is a solid large-cap fund with   │
│   consistent 10-year track record. It            │
│   underperformed its category by 1.2% in the    │
│   last year but has strong recovery history.     │
│   Best for: 5+ year SIP investors seeking       │
│   stability over aggressive returns."            │
│                                                 │
│  Verdict: ✅ GOOD for conservative equity        │
│  Best paired with: Mid-cap fund for balance     │
└─────────────────────────────────────────────────┘
```

### 2.2 Risk Explainer (Plain English)
```
┌─────────────────────────────────────────────────┐
│  Risk in Plain English                          │
│                                                 │
│  📉 Worst drop: -34.8% (Mar 2020, COVID crash) │
│  📈 Recovery time: 14 months                    │
│  📊 Negative years: 2 out of last 10            │
│  🎯 Max you could've lost in any 3-year SIP: 0% │
│                                                 │
│  "If you invested ₹10,000 at the worst possible │
│   time, you'd have ₹6,520 after 1 month but     │
│   ₹14,380 after 3 years."                       │
└─────────────────────────────────────────────────┘
```

### 2.3 Goal Matcher
```
┌─────────────────────────────────────────────────┐
│  Which goals does this fund fit?                │
│                                                 │
│  ✅ Retirement (15+ years)     — Excellent       │
│  ✅ Child's Education (10 yr)  — Good            │
│  ⚠️  House Down Payment (3 yr) — Risky          │
│  ❌ Emergency Fund              — Not suitable   │
└─────────────────────────────────────────────────┘
```

### 2.4 Overlap Detector (future)
- Compare holdings with user's other funds
- "This fund has 62% overlap with HDFC Top 100"

### 2.5 Tax-Aware Returns
- Show pre-tax AND post-tax returns
- LTCG (12.5% above ₹1.25L) and STCG (20%) applied
- "Your actual return after tax: +12.1% (not +15.7%)"

---

## Phase 3: SEO & Performance (Session 3)

### 3.1 Structured Data (JSON-LD)
```json
{
  "@type": "InvestmentFund",
  "name": "SBI Bluechip Fund Direct Growth",
  "provider": { "@type": "Organization", "name": "SBI Mutual Fund" },
  "category": "Equity - Large Cap",
  "riskLevel": "Very High",
  "annualReturn": "15.72%",
  "minimumInvestment": { "value": 500, "currency": "INR" }
}
```

### 3.2 SEO Metadata
```
Title: SBI Bluechip Fund Direct Growth — NAV, Returns, Review 2026 | InvestingPro
Description: SBI Bluechip Fund Direct Growth NAV ₹93.26, 3Y return 15.72%. Compare returns, check holdings, calculate SIP. Expert AI analysis & risk assessment.
```

### 3.3 Sitemap
- Add all 2,547 fund slugs to `app/sitemap.ts`
- Priority: 0.7 for top 200 funds, 0.5 for rest
- Changefreq: daily (NAV updates)

### 3.4 Performance
- ISR with 1-hour revalidation
- Lazy load chart component (heavy recharts)
- Skeleton loading for data-dependent sections
- Image optimization for fund house logos

---

## Data Enrichment Priorities

### From mfapi.in (FREE, automate immediately)
- Historical NAV (full history)
- Calculate: 1Y/3Y/5Y/10Y returns, CAGR, max drawdown
- Calculate: SIP returns simulation
- Rolling returns (best/worst 1Y/3Y)

### From AMFI API (already integrated)
- Latest NAV (daily refresh via cron)
- Fund house, category, ISIN

### Needs manual collection or scraping
- AUM (Assets Under Management) — from AMC factsheets
- Expense ratio — from AMC factsheets
- Fund manager name — from AMC sites
- Portfolio holdings — from AMC monthly factsheets
- Benchmark index — from SEBI categorization
- Rating (1-5 stars) — from CRISIL/Value Research/Morningstar

### User-provided
- Fund house logos (48 PNGs — you download)

---

## Technical Decisions

1. **Chart library**: recharts (already in project) — lightweight, React-native
2. **Data fetching**: Server component + ISR (1 hour) — fast, SEO-friendly
3. **Historical NAV cache**: Redis (Upstash, already configured) with 24h TTL
4. **SIP calculator**: Client component with useState — instant feedback
5. **AI verdict**: On-demand via existing AI service, cached in Supabase
6. **Styling**: Tailwind + shadcn/ui — consistent with rest of app
7. **Mobile**: Bottom sticky "Start SIP" CTA — Indian app pattern

---

## Execution Order

```
Session 1 (Core — ~2 hours):
  ├── 1. mfapi.in client + returns calculation
  ├── 2. Fund detail page route + data fetching
  ├── 3. FundHero component
  ├── 4. NAVChart component
  ├── 5. ReturnCalculator component
  ├── 6. ReturnsTable component
  └── 7. Update listing page to link to details

Session 2 (Differentiation — ~2 hours):
  ├── 1. AI Verdict card
  ├── 2. Risk Explainer
  ├── 3. Goal Matcher
  ├── 4. Compare Similar Funds
  ├── 5. Exit Load / Tax section
  └── 6. Auto-generated FAQs + schema

Session 3 (Polish — ~1 hour):
  ├── 1. Fund house logos integration
  ├── 2. JSON-LD structured data
  ├── 3. Sitemap with 2,547 URLs
  ├── 4. Mobile optimization + sticky CTA
  └── 5. Performance audit + lazy loading
```

---

## Success Metrics

- [ ] Fund detail page loads in < 2s (LCP)
- [ ] All 2,547 funds have working detail pages
- [ ] Returns data auto-updates daily
- [ ] AI verdict generates in < 3s
- [ ] Google indexes fund pages within 1 week
- [ ] Mobile UX score > 90 (Lighthouse)
- [ ] Better data density than Groww per viewport
- [ ] Unique features (AI verdict, risk explainer) not on any competitor

---

*Created: April 2, 2026*
*Execute: Next session*
