# InvestingPro — Master Task List
> **Created:** April 9, 2026
> **Based on:** April 5 Executive Audit (7 perspectives) + April 9 Pipeline Hardening Session
> **Status:** Living document — update as tasks complete

---

## AUDIT THEN vs NOW (April 5 → April 9)

| Metric | April 5 Audit | April 9 (Today) | Delta |
|--------|--------------|-----------------|-------|
| **Overall Score** | 4.9/10 | ~6.5/10 | +1.6 |
| **Published Articles** | ~4 | 27 | +23 |
| **Products with Data** | ~57 | 259 (81 CC + 61 loans + 51 MF + 14 demat + 25 FD + 15 savings + 11 govt) | +202 |
| **Products with Apply Links** | 0 | 195/259 (75%) | +195 |
| **Product Images** | 0 | 0 | No change |
| **DB Query Errors** | Unknown (silent) | 0 (all fixed) | Fixed |
| **Detail Pages Working** | Unknown | 19/19 verified | Verified |
| **Content Automation** | Built, never run | Fully wired — auto-generate + quality gate + auto-publish | Activated |
| **Content Sources** | 10 defaults | 35+ feeds + X/Twitter + Financial Calendar (30 events) | +25 sources |
| **Interlinking** | Built, not wired | Wired into generation pipeline | Connected |
| **Auto-Publish** | Disabled | Enabled with quality gate (score >= 75) | Activated |
| **Homepage** | 100% hardcoded | Dynamic from DB with fallbacks | Fixed |
| **RelatedArticles** | Broken (import error + mock data) | Real DB fetch | Fixed |
| **Revalidation API** | Broken (wrong args) | Fixed for Next.js 16 | Fixed |
| **Scrapers Active** | 0 producing output | AMFI (daily) + RBI (daily) + CC (weekly) | 3 active |
| **Cron Security** | No CRON_SECRET | Still no CRON_SECRET | **STILL OPEN** |
| **Revenue** | $0 | $0 | **STILL OPEN** |
| **Analytics** | Placeholder keys | Still no GA4/PostHog | **STILL OPEN** |
| **Social Accounts** | 0 | 0 | **STILL OPEN** |
| **Email Subscribers** | 0 | 0 | **STILL OPEN** |

---

## TASK LIST — PRIORITIZED

### PHASE 1: IMMEDIATE ACTIVATION (This Week)
> These are human tasks — YOU need to do them. 2-3 hours total.

| # | Task | Type | Time | Status |
|---|------|------|------|--------|
| 1.1 | **Add `CRON_SECRET`** to Vercel env vars (generate: `openssl rand -hex 32`) | Security | 5 min | TODO |
| 1.2 | **Add `NEXT_PUBLIC_BASE_URL=https://investingpro.in`** to Vercel env vars | Config | 2 min | TODO |
| 1.3 | **Sign up for Pexels API** (pexels.com/api) → add `PEXELS_API_KEY` to Vercel | Images | 5 min | TODO |
| 1.4 | **Set up Google Analytics 4** → add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to Vercel | Analytics | 10 min | TODO |
| 1.5 | **Set up PostHog** (posthog.com) → add `NEXT_PUBLIC_POSTHOG_KEY` + `HOST` to Vercel | Analytics | 10 min | TODO |
| 1.6 | **Submit sitemap** to Google Search Console (investingpro.in/sitemap.xml) | SEO | 10 min | TODO |
| 1.7 | **Fix Sentry DSN** (remove spaces in current value) | Monitoring | 5 min | TODO |
| 1.8 | **Push code to production** (`git push origin master`) | Deploy | 5 min | TODO |
| 1.9 | **Register on Cuelinks** (cuelinks.com) for affiliate network | Revenue | 15 min | TODO |
| 1.10 | **Register on EarnKaro** (earnkaro.com) for affiliate backup | Revenue | 15 min | TODO |

### PHASE 2: SOCIAL & DISTRIBUTION (This Week)
> Connect social accounts for auto-posting.

| # | Task | Type | Time | Status |
|---|------|------|------|--------|
| 2.1 | **Create Twitter/X account** for InvestingPro → get API keys (developer.twitter.com) | Social | 30 min | TODO |
| 2.2 | **Create LinkedIn page** for InvestingPro → get API token | Social | 30 min | TODO |
| 2.3 | Add `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_TOKEN_SECRET` to Vercel | Config | 5 min | TODO |
| 2.4 | Add `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_ORGANIZATION_ID` to Vercel | Config | 5 min | TODO |
| 2.5 | **Create Telegram channel** (@investingpro_updates) + bot → add `TELEGRAM_BOT_TOKEN` | Social | 15 min | TODO |
| 2.6 | **Set up Resend domain** (investingpro.in) for transactional email | Email | 15 min | TODO |
| 2.7 | **Configure welcome email** template in Resend | Email | 20 min | TODO |

### PHASE 3: REVENUE ACTIVATION (Week 1-2)
> Wire affiliate links to real networks.

| # | Task | Type | Time | Status |
|---|------|------|------|--------|
| 3.1 | Replace BankBazaar URLs with Cuelinks affiliate URLs for credit cards | Revenue | Agent 2h | TODO |
| 3.2 | Add affiliate links for remaining 19 loans (niche NBFCs) | Revenue | Agent 1h | TODO |
| 3.3 | Add affiliate links for remaining 2 FDs | Revenue | Agent 15m | TODO |
| 3.4 | **Set up Stripe** → add keys → create Pro Monthly (₹199) and Pro Annual (₹1999) prices | Payments | Human 30m | TODO |
| 3.5 | Test affiliate click tracking end-to-end (`/go/[slug]` → redirect → log) | Testing | Agent 1h | TODO |
| 3.6 | Remove fake "12,000+" subscriber count from newsletter widget | Honesty | Agent 15m | TODO |
| 3.7 | Remove fake `Math.random()` analytics from admin dashboards | Honesty | Agent 2h | TODO |

### PHASE 4: CONTENT VELOCITY (Week 1-3)
> Generate 200+ articles to build traffic.

| # | Task | Type | Time | Status |
|---|------|------|------|--------|
| 4.1 | Run product image generation cron (needs Pexels key from 1.3) | Images | Agent 1h | TODO |
| 4.2 | Generate 30 "Best X for Y" articles (credit cards + mutual funds) | Content | Agent 8h | TODO |
| 4.3 | Generate 10 comparison articles (X vs Y: SIP vs FD, PPF vs ELSS, etc.) | Content | Agent 4h | TODO |
| 4.4 | Generate 10 "How to" guides (CIBIL, home loan, tax filing) | Content | Agent 4h | TODO |
| 4.5 | Generate 15 calculator companion guides (SIP, EMI, FD, PPF, tax, etc.) | Content | Agent 6h | TODO |
| 4.6 | Backfill interlinks on existing 27 articles (run auto-interlink batch) | SEO | Agent 1h | TODO |
| 4.7 | Generate featured images for all 27 existing articles | Images | Agent 1h | TODO |
| 4.8 | **Set up Cloudinary** (free tier) → add keys → image CDN for all products | Images | Human 10m | TODO |
| 4.9 | Scrape real credit card images from bank websites | Images | Agent 4h | TODO |
| 4.10 | Scrape broker logos (Zerodha, Groww, etc.) from official sites | Images | Agent 1h | TODO |

### PHASE 5: SEO & PERFORMANCE (Week 2-3)
> Optimize for Google rankings.

| # | Task | Type | Time | Status |
|---|------|------|------|--------|
| 5.1 | **Set up Google Search Console** → add OAuth credentials to Vercel | SEO | Human 15m | TODO |
| 5.2 | Fix schema markup — remove fake ratingCount, add real review data | SEO | Agent 2h | TODO |
| 5.3 | Add city-level landing pages (Top 10 cities × 5 categories = 50 pages) | Programmatic SEO | Agent 8h | TODO |
| 5.4 | Add bank holidays page generator (all states = 500+ pages) | Programmatic SEO | Agent 4h | TODO |
| 5.5 | Build VS calculator comparison pages (SIP vs FD, PPF vs ELSS, etc.) | Content | Agent 6h | TODO |
| 5.6 | Replace `SmartImage` with `next/image` where possible for Core Web Vitals | Performance | Agent 2h | TODO |
| 5.7 | Dynamic import large libraries (recharts, framer-motion, jspdf) | Performance | Agent 3h | TODO |
| 5.8 | Add IndexNow ping on every article publish | SEO | Agent 1h | TODO |

### PHASE 6: CALCULATOR UPGRADE (Week 3-4)
> Calculators are highest-rated asset (7.6/10) — make them best-in-class.

| # | Task | Type | Time | Status |
|---|------|------|------|--------|
| 6.1 | Upgrade all 25 calculators: share results, PDF download, email capture | UI/UX | Agent 12h | TODO |
| 6.2 | Build 5 niche calculators: Rent vs Buy, Marriage Cost, Gratuity, EPF, Salary Hike | Feature | Agent 10h | TODO |
| 6.3 | Build 10 VS comparison calculator pages | Feature | Agent 8h | TODO |
| 6.4 | Generate SEO guide for each calculator (25 articles) | Content | Agent 8h | TODO |

### PHASE 7: SECURITY & QUALITY (Week 2-4)
> From CTO audit — fix critical vulnerabilities.

| # | Task | Type | Time | Status |
|---|------|------|------|--------|
| 7.1 | Rotate all hardcoded API keys (check git history for exposure) | Security | Human 1h | TODO |
| 7.2 | Add admin role check to all admin API routes missing auth | Security | Agent 3h | TODO |
| 7.3 | Fix `affiliate_clicks` RLS policy (`USING(true)` → proper check) | Security | Agent 30m | TODO |
| 7.4 | Add rate limiting to public AI routes (`/api/translate`, etc.) | Security | Agent 2h | TODO |
| 7.5 | Add DOMPurify to all `dangerouslySetInnerHTML` usage | Security | Agent 2h | TODO |
| 7.6 | Set `typescript.ignoreBuildErrors: false` in next.config | Quality | Agent 4h | TODO |
| 7.7 | Remove all `console.log` → use `logger` | Quality | Agent 2h | TODO |

### PHASE 8: INSURANCE & NEW VERTICALS (Month 2)
> Missing verticals from roadmap.

| # | Task | Type | Time | Status |
|---|------|------|------|--------|
| 8.1 | Create `insurance_products` table in Supabase | Database | Agent 1h | TODO |
| 8.2 | Create `savings_accounts` and `govt_schemes` listing pages | Pages | Agent 4h | TODO |
| 8.3 | Seed insurance products (term, health, motor) | Data | Agent 4h | TODO |
| 8.4 | Build insurance comparison pages | Feature | Agent 6h | TODO |
| 8.5 | Build NPS & retirement planning hub | Feature | Agent 6h | TODO |
| 8.6 | Build gold rate pages (city-level = 100 pages) | Programmatic SEO | Agent 4h | TODO |

### PHASE 9: TESTING & MONITORING (Ongoing)
> From CTO audit — current test coverage 1.13%.

| # | Task | Type | Time | Status |
|---|------|------|------|--------|
| 9.1 | Test affiliate click tracking end-to-end | Testing | Agent 3h | TODO |
| 9.2 | Test Stripe checkout + webhook flow | Testing | Agent 4h | TODO |
| 9.3 | Test auth flow (login/signup/session/role) | Testing | Agent 3h | TODO |
| 9.4 | Add component tests for top 20 components | Testing | Agent 8h | TODO |
| 9.5 | Set up Sentry alerts for production errors | Monitoring | Human 15m | TODO |
| 9.6 | Build cron execution dashboard in admin | Monitoring | Agent 4h | TODO |

### PHASE 10: CALCULATOR ECOSYSTEM — BEST IN CLASS (Month 1-2)
> Current: 23 calculators. Target: 100+ (Groww has 30+, NerdWallet has 40+, we'll have 100+)
> UI benchmark: Groww's clean cards + NerdWallet's depth + our Indian context

**Current State:**
- 23 calculators with sliders, charts (AreaChart, PieChart), email capture
- Math logic in `lib/calculators/` (FROZEN — validated)
- Missing: share results, PDF download, step-up in most calcs, mobile-first layout
- Email capture is fake (simulated API call, doesn't actually save)

#### 10A. Upgrade Existing 23 Calculators (UI/UX Overhaul)

| # | Task | Type | Time | Status |
|---|------|------|------|--------|
| 10A.1 | **Groww-style result cards** — large number, ₹ formatted, invested vs returns split | UI/UX | Agent 4h | TODO |
| 10A.2 | **Share results** — WhatsApp, Twitter, copy link with params encoded in URL | Feature | Agent 3h | TODO |
| 10A.3 | **PDF report download** — email gate before download (captures lead) | Feature | Agent 4h | TODO |
| 10A.4 | **Wire email capture to Resend** — currently fake setTimeout | Fix | Agent 1h | TODO |
| 10A.5 | **Mobile-first full-screen layout** — sticky result card, collapsible inputs | UI/UX | Agent 4h | TODO |
| 10A.6 | **Donut chart** (invested vs returns) + **year-wise breakdown table** | UI/UX | Agent 3h | TODO |
| 10A.7 | **SoftwareApplication + FinancialProduct JSON-LD** on all calc pages | SEO | Agent 2h | TODO |
| 10A.8 | **Related calculators section** at bottom of each calculator | Interlinking | Agent 1h | TODO |
| 10A.9 | **Result nudges** — contextual ("That's ₹23K = 2 months of SIPs!") | Engagement | Agent 2h | TODO |

#### 10B. Missing Groww-Level Calculators (32 new)

| # | Calculator | Category | Search Vol | Priority |
|---|-----------|----------|-----------|----------|
| 10B.1 | CAGR Calculator | Investment | 150K/mo | P0 |
| 10B.2 | Gratuity Calculator | Govt/Salary | 110K/mo | P0 |
| 10B.3 | EPF Calculator | Govt/Salary | 90K/mo | P0 |
| 10B.4 | HRA Exemption Calculator | Tax | 80K/mo | P0 |
| 10B.5 | Salary Calculator (CTC to In-Hand) | Salary | 200K/mo | P0 |
| 10B.6 | TDS Calculator | Tax | 70K/mo | P0 |
| 10B.7 | Step-Up SIP Calculator | Investment | 60K/mo | P1 |
| 10B.8 | Home Loan EMI Calculator | Loans | 300K/mo | P0 |
| 10B.9 | Car Loan EMI Calculator | Loans | 100K/mo | P1 |
| 10B.10 | Education Loan EMI Calculator | Loans | 50K/mo | P1 |
| 10B.11 | Personal Loan EMI Calculator | Loans | 150K/mo | P0 |
| 10B.12 | Gold Investment Calculator | Investment | 40K/mo | P1 |
| 10B.13 | Rent vs Buy Calculator | Real Estate | 60K/mo | P1 |
| 10B.14 | FIRE Calculator (India) | Retirement | 30K/mo | P2 |
| 10B.15 | Marriage Cost Calculator | Life Events | 40K/mo | P1 |
| 10B.16 | Child Education Cost Calculator | Life Events | 50K/mo | P1 |
| 10B.17 | Brokerage Calculator | Trading | 90K/mo | P1 |
| 10B.18 | Stamp Duty Calculator | Real Estate | 80K/mo | P1 |
| 10B.19 | Mutual Fund Returns Calculator | Investment | 70K/mo | P1 |
| 10B.20 | ELSS Calculator | Tax | 40K/mo | P1 |
| 10B.21 | Dividend Yield Calculator | Investment | 30K/mo | P2 |
| 10B.22 | Capital Gains Tax Calculator | Tax | 60K/mo | P1 |
| 10B.23 | Flat vs Reducing Rate Calculator | Loans | 40K/mo | P2 |
| 10B.24 | Real Estate ROI Calculator | Investment | 30K/mo | P2 |
| 10B.25 | Atal Pension Yojana Calculator | Govt | 50K/mo | P1 |
| 10B.26 | PM Kisan Calculator | Govt | 30K/mo | P2 |
| 10B.27 | Lumpsum vs SIP Calculator | Investment | 70K/mo | P0 |
| 10B.28 | Crypto Tax Calculator India | Tax | 40K/mo | P2 |
| 10B.29 | Freelancer Tax Calculator | Tax | 30K/mo | P2 |
| 10B.30 | NRI Tax Calculator | Tax | 20K/mo | P2 |
| 10B.31 | Post Office Savings Calculator | Govt | 40K/mo | P1 |
| 10B.32 | Senior Citizen FD Calculator | Savings | 30K/mo | P1 |

#### 10C. VS Comparison Calculator Pages (17 programmatic pages)

| # | Comparison | Category | Search Vol |
|---|-----------|----------|-----------|
| 10C.1 | SIP vs FD | Investment | 50K/mo |
| 10C.2 | SIP vs Lumpsum | Investment | 70K/mo |
| 10C.3 | PPF vs ELSS | Tax Saving | 40K/mo |
| 10C.4 | NPS vs PPF | Retirement | 30K/mo |
| 10C.5 | Old vs New Tax Regime | Tax | 200K/mo |
| 10C.6 | RD vs SIP | Savings | 20K/mo |
| 10C.7 | FD vs Debt Mutual Fund | Savings | 30K/mo |
| 10C.8 | Gold vs Equity (10yr) | Investment | 20K/mo |
| 10C.9 | Rent vs Buy | Real Estate | 60K/mo |
| 10C.10 | EPF vs VPF | Govt | 20K/mo |
| 10C.11 | Term vs Endowment Insurance | Insurance | 40K/mo |
| 10C.12 | Direct vs Regular Mutual Fund | Investment | 50K/mo |
| 10C.13 | Index Fund vs Active Fund | Investment | 40K/mo |
| 10C.14 | SSY vs PPF | Govt/Kids | 20K/mo |
| 10C.15 | NSC vs FD | Savings | 15K/mo |
| 10C.16 | Post Office FD vs Bank FD | Savings | 20K/mo |
| 10C.17 | SIP vs RD | Savings | 25K/mo |

Each VS page gets: side-by-side calculator, comparison table, verdict, FAQ, JSON-LD

#### 10E. Multi-Way Comparison Calculators (3+ products compared)

| # | Comparison | What It Compares | Search Vol |
|---|-----------|-----------------|-----------|
| 10E.1 | SIP vs SWP vs Lumpsum | All three investment modes side-by-side | 30K/mo |
| 10E.2 | SIP vs FD vs RD vs PPF | 4-way savings/investment comparison | 40K/mo |
| 10E.3 | FD vs MIS vs SCSS vs PPF | Post office + bank schemes compared | 25K/mo |
| 10E.4 | Loan EMI Comparison (Home vs Personal vs Car vs Education) | All EMI types in one tool | 50K/mo |
| 10E.5 | Tax Saving Showdown (ELSS vs PPF vs NPS vs SSY vs FD) | All 80C options ranked | 60K/mo |
| 10E.6 | Retirement Planning (NPS vs PPF vs EPF vs MF) | Retirement corpus comparison | 30K/mo |
| 10E.7 | Child Future Planning (SSY vs PPF vs SIP vs FD) | Long-term child savings | 20K/mo |
| 10E.8 | Gold Investment (Physical vs Digital vs ETF vs SGB) | All gold options compared | 30K/mo |
| 10E.9 | Debt Investment (FD vs Debt MF vs RD vs Corporate Bond) | Safe investment comparison | 20K/mo |
| 10E.10 | Insurance (Term vs ULIP vs Endowment vs Whole Life) | Life insurance types compared | 40K/mo |

#### 10F. Life Planning & FIRE Calculators

| # | Calculator | What It Does | Search Vol |
|---|-----------|-------------|-----------|
| 10F.1 | **FIRE Calculator India** | Financial Independence, Retire Early — India-specific (EPF, PPF, NPS, SIP, FD mix) | 30K/mo |
| 10F.2 | **Retirement Corpus Calculator** | "How much do I need to retire?" with inflation + medical costs | 50K/mo |
| 10F.3 | **Retirement Income Planner** | SWP + FD + pension to generate monthly income post-retirement | 20K/mo |
| 10F.4 | **Wedding Cost Planner** | Indian wedding by city (Mumbai vs Delhi vs Bangalore vs Tier 2) | 40K/mo |
| 10F.5 | **Child Education Planner** | IIT/IIM/abroad fees inflation-adjusted, SIP required | 50K/mo |
| 10F.6 | **Rent vs Buy India** | With stamp duty, registration, maintenance, opportunity cost | 60K/mo |
| 10F.7 | **Emergency Fund Calculator** | Months of expenses × city cost of living | 30K/mo |
| 10F.8 | **Net Worth Calculator** | Assets - liabilities with Indian categories (property, gold, FD, MF, loans) | 25K/mo |
| 10F.9 | **Budget 50/30/20 Calculator** | Indian salary breakdown with EPF, HRA, standard deduction | 20K/mo |
| 10F.10 | **Inflation Impact Calculator** | "What will ₹1L be worth in 20 years?" — purchasing power erosion | 15K/mo |
| 10F.11 | **Salary Negotiation Calculator** | CTC vs in-hand breakdown with all components (basic, HRA, DA, PF, gratuity, tax) | 80K/mo |
| 10F.12 | **Freelancer Income Tax Calculator** | Quarterly advance tax + GST + deductions for self-employed | 30K/mo |

#### 10G. Additional VS Pairs (Investment Comparison)

| # | Comparison | Category |
|---|-----------|----------|
| 10G.1 | SIP vs EMI (invest vs repay early) | Financial Decision |
| 10G.2 | MF Direct vs Regular Plan | Mutual Fund |
| 10G.3 | Growth vs Dividend Option MF | Mutual Fund |
| 10G.4 | Equity vs Debt Mutual Fund | Investment |
| 10G.5 | Large Cap vs Mid Cap vs Small Cap | Mutual Fund |
| 10G.6 | UPI vs Credit Card Spending | Personal Finance |
| 10G.7 | Home Loan Prepayment vs SIP | Financial Decision |
| 10G.8 | Bank FD vs Corporate FD | Savings |
| 10G.9 | Savings Account vs Liquid Fund | Savings |
| 10G.10 | Health Insurance vs Health Savings | Insurance |
| 10G.11 | Endowment vs Term + MF | Insurance |
| 10G.12 | Old Pension Scheme vs NPS | Retirement |
| 10G.13 | PF Withdrawal vs PF Transfer | Employment |
| 10G.14 | LIC vs Private Insurance | Insurance |
| 10G.15 | Indian Stocks vs US Stocks (via MF) | Investment |

#### 10D. Government Scheme Calculators (19 new)

| # | Calculator | Scheme | Search Vol |
|---|-----------|--------|-----------|
| 10D.1 | Gratuity Calculator | Labour Act | 110K/mo |
| 10D.2 | EPF Calculator | EPFO | 90K/mo |
| 10D.3 | VPF Calculator | EPFO | 20K/mo |
| 10D.4 | HRA Exemption Calculator | Income Tax | 80K/mo |
| 10D.5 | DA Calculator | Central Govt | 50K/mo |
| 10D.6 | Leave Encashment Calculator | Labour Act | 30K/mo |
| 10D.7 | Pension Commutation Calculator | Central Govt | 20K/mo |
| 10D.8 | Atal Pension Yojana Calculator | PFRDA | 50K/mo |
| 10D.9 | PM Kisan Benefit Calculator | Govt | 30K/mo |
| 10D.10 | PM Vaya Vandana Yojana | LIC/Govt | 15K/mo |
| 10D.11 | Sukanya Samriddhi Calculator | Post Office | 60K/mo |
| 10D.12 | Senior Citizen Savings Scheme | Post Office | 40K/mo |
| 10D.13 | Post Office Time Deposit | Post Office | 25K/mo |
| 10D.14 | Employee Pension Scheme | EPFO | 20K/mo |
| 10D.15 | 7th Pay Commission Calculator | Central Govt | 70K/mo |
| 10D.16 | Advance Tax Calculator | Income Tax | 30K/mo |
| 10D.17 | Capital Gains Tax Calculator | Income Tax | 60K/mo |
| 10D.18 | TDS on Salary Calculator | Income Tax | 70K/mo |
| 10D.19 | Dividend Tax Calculator | Income Tax | 20K/mo |

### PHASE 11: MULTI-LANGUAGE PROGRAMMATIC SEO (Month 2-3)
> 5 major Indian languages × existing content = 5x traffic potential
> Target: 2M+ addressable searches/month in Hindi, Tamil, Telugu, Marathi, Bengali

**Current State:**
- Translation API exists (`app/api/translate/route.ts`) — GPT-4 powered, 8 languages
- Zero translated pages live
- No hreflang tags, no language routes, no language switcher

#### 11A. Infrastructure

| # | Task | Type | Time | Status |
|---|------|------|------|--------|
| 11A.1 | Create `/[lang]/` route group (hi, ta, te, mr, bn) | Architecture | Agent 4h | TODO |
| 11A.2 | Add hreflang tags to all pages (en-IN + 5 languages) | SEO | Agent 2h | TODO |
| 11A.3 | Create language switcher component (dropdown in navbar) | UI | Agent 2h | TODO |
| 11A.4 | Generate language-specific sitemaps (sitemap-hi.xml, etc.) | SEO | Agent 2h | TODO |
| 11A.5 | Add language-aware canonical URLs | SEO | Agent 1h | TODO |

#### 11B. Content Translation Pipeline

| # | Task | Type | Time | Status |
|---|------|------|------|--------|
| 11B.1 | Build bulk translation cron — translates top 50 articles into 5 languages | Automation | Agent 6h | TODO |
| 11B.2 | Translate calculator pages (all 23 → 5 languages = 115 pages) | Content | Agent 8h | TODO |
| 11B.3 | Translate product listing pages (7 categories × 5 = 35 pages) | Content | Agent 4h | TODO |
| 11B.4 | Translate homepage + key landing pages (5 pages × 5 = 25 pages) | Content | Agent 3h | TODO |
| 11B.5 | Generate Hindi calculator guides (top 10 calcs) | Content | Agent 4h | TODO |

#### 11C. Language Priority (by search volume)

| Language | Code | Speakers | Finance Search Vol | Priority |
|----------|------|----------|-------------------|----------|
| Hindi | hi | 600M | ~800K/mo | P0 |
| Tamil | ta | 80M | ~200K/mo | P1 |
| Telugu | te | 85M | ~180K/mo | P1 |
| Marathi | mr | 85M | ~150K/mo | P1 |
| Bengali | bn | 100M | ~160K/mo | P1 |

**Total addressable:** ~1.5M searches/month across 5 languages for financial terms.
**Zero competition** in most languages for quality financial content.

---

## EFFORT SUMMARY

| Phase | Human Time | Agent Time | Priority |
|-------|-----------|------------|----------|
| Phase 1: Immediate Activation | 1.5 hours | 0 | **DO NOW** |
| Phase 2: Social & Distribution | 2 hours | 0 | **THIS WEEK** |
| Phase 3: Revenue Activation | 30 min | 6 hours | **THIS WEEK** |
| Phase 4: Content Velocity | 10 min | 30 hours | Week 1-3 |
| Phase 5: SEO & Performance | 15 min | 26 hours | Week 2-3 |
| Phase 6: (Merged into Phase 10) | — | — | — |
| Phase 7: Security & Quality | 1 hour | 14 hours | Week 2-4 |
| Phase 8: New Verticals | 0 | 25 hours | Month 2 |
| Phase 9: Testing | 15 min | 22 hours | Ongoing |
| **Phase 10: Calculator Ecosystem** | 0 | **~80 hours** | **Month 1-2** |
| — 10A: Upgrade 23 existing | 0 | 24h | Week 2-3 |
| — 10B: 32 new Groww-level calcs | 0 | 32h | Week 3-6 |
| — 10C: 17 VS comparison pages | 0 | 12h | Week 4-6 |
| — 10D: 19 Govt scheme calcs | 0 | 12h | Week 4-8 |
| **Phase 11: Multi-Language SEO** | 0 | **~34 hours** | **Month 2-3** |
| — 11A: Infrastructure (routes, hreflang) | 0 | 11h | Month 2 |
| — 11B: Translation pipeline (275 pages) | 0 | 25h | Month 2-3 |
| **TOTAL** | **~6 hours** | **~275 hours** | |

### Calculator Count Projection

| Category | Count | Examples |
|----------|-------|---------|
| Existing calculators | 23 | SIP, EMI, FD, PPF, Tax, NPS, etc. |
| New Groww-level (10B) | 32 | CAGR, Gratuity, EPF, HRA, Salary, Home Loan EMI, etc. |
| VS 1-on-1 comparisons (10C) | 17 | SIP vs FD, PPF vs ELSS, Old vs New Tax, etc. |
| Govt scheme calculators (10D) | 19 | Gratuity, EPF, VPF, DA, Atal Pension, 7th Pay, etc. |
| Multi-way comparisons (10E) | 10 | SIP vs SWP vs Lumpsum, FD vs MIS vs PPF, etc. |
| Life planning & FIRE (10F) | 12 | FIRE India, Wedding, Child Education, Rent vs Buy, etc. |
| Additional VS pairs (10G) | 15 | SIP vs EMI, Direct vs Regular, Large vs Mid vs Small Cap, etc. |
| **Total calculator pages** | **128** | |
| SEO guide per calculator | +128 | 1500-word companion article per calculator |
| **Total calc + guide pages** | **256** | |
| Multi-language (×5 languages) | +640 | Hindi, Tamil, Telugu, Marathi, Bengali |
| **Grand total calculator ecosystem** | **896 pages** | |

---

## THE BOTTOM LINE

**April 5 audit said:** "You built a race car and never put gas in it."

**April 9 status:** The engine is now running. Content pipeline is autonomous. Products display correctly. Articles publish automatically. But the gas (credentials + traffic + revenue) is still waiting on **6 hours of your time** — mostly registering accounts and adding API keys.

**The single highest-ROI action right now:**
1. Add `PEXELS_API_KEY` (5 min) → unlocks all product images
2. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` (10 min) → start tracking traffic
3. `git push origin master` (5 min) → deploy everything we fixed today
4. Submit sitemap to GSC (10 min) → Google starts indexing 259 products + 27 articles

**That's 30 minutes to go from "built but invisible" to "live and indexing."**
