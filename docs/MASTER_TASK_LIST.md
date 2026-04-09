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

---

## EFFORT SUMMARY

| Phase | Human Time | Agent Time | Priority |
|-------|-----------|------------|----------|
| Phase 1: Immediate Activation | 1.5 hours | 0 | **DO NOW** |
| Phase 2: Social & Distribution | 2 hours | 0 | **THIS WEEK** |
| Phase 3: Revenue Activation | 30 min | 6 hours | **THIS WEEK** |
| Phase 4: Content Velocity | 10 min | 30 hours | Week 1-3 |
| Phase 5: SEO & Performance | 15 min | 26 hours | Week 2-3 |
| Phase 6: Calculator Upgrade | 0 | 38 hours | Week 3-4 |
| Phase 7: Security & Quality | 1 hour | 14 hours | Week 2-4 |
| Phase 8: New Verticals | 0 | 25 hours | Month 2 |
| Phase 9: Testing | 15 min | 22 hours | Ongoing |
| **TOTAL** | **~6 hours** | **~161 hours** | |

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
