# InvestingPro.in — Project Status & Launch Roadmap
> **Generated 2026-04-26 | Branch: `master` (worktree: `claude/charming-proskuriakova-4dfd54`)**
> Single source of truth for launch readiness, system architecture, and forward roadmap.
> Supersedes stale claims in CLAUDE.md (Tailwind 4 / Stripe 21 / 228-articles); this doc reflects ground truth as of last commit.

## Table of contents
1. [Launch posture (TL;DR)](#1-launch-posture-tldr)
2. [Tech stack — actual versions](#2-tech-stack--actual-versions)
3. [Database & content state](#3-database--content-state)
4. [Public site surface](#4-public-site-surface)
5. [Calculators](#5-calculators)
6. [Admin / CMS](#6-admin--cms)
7. [SEO + GEO + sitemap](#7-seo--geo--sitemap)
8. [Social, share, newsletter](#8-social-share-newsletter)
9. [Monetization & affiliate pipeline](#9-monetization--affiliate-pipeline)
10. [Performance & Core Web Vitals](#10-performance--core-web-vitals)
11. [i18n status](#11-i18n-status)
12. [Security & compliance](#12-security--compliance)
13. [Cron + automation backbone](#13-cron--automation-backbone)
14. [Observability](#14-observability)
15. [What ships TONIGHT (sitemap submission)](#15-what-ships-tonight)
16. [Critical blockers BEFORE submission](#16-critical-blockers-before-submission)
17. [Pending work — by stage](#17-pending-work--by-stage)
18. [Roadmap — phases & timing](#18-roadmap--phases--timing)
19. [Known risks & mitigations](#19-known-risks--mitigations)

---

## 1. Launch posture (TL;DR)

| Dimension | Status |
|---|---|
| Public-facing fake data | **Zero** — Math.random scrubbed, BankBazaar links replaced, fabricated stats demoted |
| Real product pages | **818** (81 cards + 565 MFs + 56 loans + 25 FDs + 15 savings + 11 govt schemes + 14 brokers + 51 insurers TBD) |
| Articles published | **210** (down from 228 after demoting 18 with uncited stats) |
| Methodology pages | **8** (hub + 7 segment-specific) — IN sitemap |
| Calculators | **72** functional + 1 hub page |
| Glossary | **101** terms (target 205) |
| Apply links | **100% real** — direct issuer URLs, 0 BankBazaar |
| Algorithmic ratings | Loans + 51 MFs with track record; new MFs show "—" badge |
| Sitemap | Generated dynamically, ~1,600+ URLs, all real-data backed |
| Vercel deploy | Auto-deploy on push, Pro plan, native crons (40 active) |
| Submission readiness | **GO** for tonight |

**Confidence:** every score, every rating, every "X+ banks tracked" stat is either regulator-backed, algorithmically derived, or hand-curated.

---

## 2. Tech stack — actual versions

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js | 16.1.1 | App Router, webpack (not Turbopack) due to `isomorphic-dompurify` alias |
| Runtime | Node.js | 24 LTS | Set in Vercel project |
| React | React | 19.2.3 | |
| Language | TypeScript | 5.x strict | `ignoreBuildErrors: false` ✅ |
| Styling | Tailwind CSS | **3.4.17** ⚠️ | CLAUDE.md claims v4 — STALE |
| Database | Supabase Postgres | 17.6 | 130 migrations applied |
| Auth | Supabase Auth + SSR | 0.8.0 | Cookie-forwarded via middleware |
| Payments | Stripe | **20.1.1** ⚠️ | CLAUDE.md claims 21 — STALE; no Pro plan price IDs in code yet |
| Email | Resend | 6.6.0 | `noreply@investingpro.in` sender |
| AI providers | Gemini → Groq → Mistral → OpenAI → Anthropic | failover chain | Gemini hardcoded `gemini-pro` (deprecated) |
| Cache | Upstash Redis | via `@upstash/ratelimit` | Used for rate limiting |
| Errors | Sentry | 10.32.1 | client/server/edge configs wired |
| Analytics | PostHog | 1.315.0 | client SDK loaded |
| Workflow | Inngest | 3.54.0 | Bumped per security advisory |
| Bundler | Webpack (native) | — | Turbopack disabled due to alias |
| Deploy | Vercel | Pro plan | 40 native crons, `vercel.json` (no `vercel.ts` yet) |

**Tech debt flags:**
- Two Google AI SDKs installed (`@google/genai` 1.34 + legacy `@google/generative-ai` 0.24); legacy still imported in `ai-service.ts`
- `@cloudflare/ai` listed but unused
- `@types/node` v20 lags runtime v24
- 22 reference `*_schema.sql` dumps in `lib/supabase/` alongside 130 real migrations — split source of truth

---

## 3. Database & content state

### 3.1 Active product tables (live in production)

| Table | Rows (active) | Rating quality | Apply link | Sitemap |
|---|---|---|---|---|
| `credit_cards` | 81/81 | Hand-curated 3.3–4.9 (real spread) | 100% direct issuer | ✅ |
| `mutual_funds` | 565/565 | 51 algorithmic from `returns_3y`/`returns_1y`; 514 marked "new fund" with no rating | Detail page | ✅ |
| `loans` | 56/56 | Algorithmic from `interest_rate_min` per `/methodology/loans` | 100% direct lender | ✅ |
| `fixed_deposits` | 25/25 | Hand-curated 4.2–4.6 | 100% direct bank | ✅ |
| `savings_accounts` | 15/15 | Hand-curated 4.2–4.6 | 100% direct bank | ✅ |
| `govt_schemes` | 11/11 | Hand-curated 4.0–4.9 (PPF, NPS, SSY, SCSS etc.) | 100% official_link | ✅ |
| `brokers` | 14/14 | Hand-curated 4.0–4.8 | 100% official_link | ✅ |
| `articles` | 210 published / 52 draft (incl. 18 demoted today) | n/a | n/a | ✅ |
| `glossary_terms` | 101 published (target 205) | n/a | n/a | ✅ |
| `versus_pages` | 20 | n/a | n/a | ✅ |

### 3.2 Tables intentionally minimised
- `products`: 40 rows (was 2,584). 2,544 placeholder MF duplicates **deleted** today; remaining rows are credit-card overflow and 1 verified MF.

### 3.3 Tracking tables (instrumentation state)

| Table | Rows | State |
|---|---|---|
| `affiliate_clicks` | 0 lifetime | Schema fixed today (commit `88f553dc`); writes should land on next click after deploy |
| `web_vitals` | 16 (post-fix) | Fix committed today; writes flowing |
| `newsletter_subscribers` | 0 | Diagnostics improved; will surface real Supabase errors when called |
| `analytics_events` | 0 | **Orphan writer** — deferred until separate rebuild (PostHog has the data already) |
| `platform_metrics` | 1 stale row | Authority-tracker cron not firing |

### 3.4 Articles by category (top 10 of ~22)

| Category | Published |
|---|---|
| investing | 30 |
| loans | 28 |
| banking | 23 |
| small_business | 21 |
| insurance | 20 |
| tax-planning | 17 |
| credit-cards | 16 |
| personal-finance | 15 |
| mutual-funds | 12 |
| stocks | 5 |

Some categories use both hyphenated and underscored forms (e.g., `credit-cards` + `credit_cards`); editorial team should consolidate.

---

## 4. Public site surface

### 4.1 Routes shipped to sitemap (~1,600 URLs)

| Section | Count | Source |
|---|---|---|
| Homepage + pillar + intent + collection | ~110 | `NAVIGATION_CATEGORIES` + `NAVIGATION_CONFIG` |
| Calculators (hub + 72) | 73 | static array in `app/sitemap.ts` |
| Glossary index + terms | 102 | `glossary_terms` table |
| Articles | 210 | `articles` where `status='published'` |
| Credit card detail | 81 | `credit_cards` table |
| Credit card programmatic SEO (salary brackets, categories, lounge) | 15 | static enum |
| Versus pages | 20 | `versus_pages` table |
| Mutual fund detail | 565 | `mutual_funds` where `is_active=true` |
| Loans detail | 56 | `loans` where `is_active=true` |
| FDs detail | 25 | `fixed_deposits` |
| Savings detail | 15 | `savings_accounts` |
| Govt scheme detail | 11 | `govt_schemes` |
| Broker detail | 14 | `brokers` |
| Best-of roundups | 35 | static config |
| Category article listings | 10 | static enum |
| Methodology hub + 7 sub-pages | 8 | static enum (added today) |
| Static utility (about, privacy, etc.) | ~20 | static array |

### 4.2 Homepage state
- Hero section with greeting + CTA
- TrustBar (now real DB-fetched rates with as-of date stamp)
- RateComparison (real rates with as-of date)
- FindYourFit (editor's picks with IRDAI/issuer attribution)
- WeeklyChanges editorial ticker (6 listings)
- Newsletter capture (real `/api/newsletter` write)
- LifeStageHub interactive
- Footer (6-col, 70 SEO links, 3 compliance blocks)

### 4.3 Listing pages
- 7 listings (cards, MFs, loans, FDs, savings, brokers, insurance)
- All use `RichProductCard.tsx` (now methodology-aware)
- Score badge clicks through to relevant `/methodology/<segment>` page
- Score = "—" when no rating (new MFs)

### 4.4 Footer / compliance pages
- `/privacy`, `/terms`, `/disclaimer`, `/cookie-policy`, `/affiliate-disclosure`, `/advertiser-disclosure`, `/security`, `/accessibility`, `/contact`, `/about`, `/about/editorial-team`, `/about/editorial-standards`, `/about/how-we-make-money`, `/corrections` (route exists, content empty), `/methodology` + 7 sub-pages

---

## 5. Calculators

### 5.1 Inventory (72 pages)
All calc slugs: `atal-pension-yojana, brokerage, cagr, capital-gains-tax, car-loan-emi, child-education, compound-interest, crypto-tax, direct-vs-regular-mf, dividend-yield, education-loan-emi, elss, emi, epf, epf-vs-vpf, fd, fd-vs-debt-mf, financial-health-score, fire, flat-vs-reducing-rate, freelancer-tax, goal-planning, gold-investment, gold-vs-equity, gratuity, gst, home-loan-emi, home-loan-vs-sip, hra, index-vs-active-fund, inflation-adjusted-returns, kvp, lumpsum, lumpsum-vs-sip, marriage-cost, mis, mutual-fund-returns, nps, nps-vs-ppf, nri-tax, nsc, nsc-vs-fd, old-vs-new-tax, personal-loan-emi, pm-kisan, po-fd-vs-bank-fd, portfolio-rebalancing, post-office-savings, ppf, ppf-vs-elss, rd, rd-vs-sip, real-estate-roi, rent-vs-buy, rent-vs-buy-comparison, retirement, salary, scss, senior-citizen-fd, simple-interest, sip, sip-vs-fd, sip-vs-lumpsum-comparison, sip-vs-rd, ssy, ssy-vs-ppf, stamp-duty, step-up-sip, swp, tax, tds, term-vs-endowment`.

### 5.2 Gold standard vs rest
- **SIP** (`SIPCalculatorV2`) is the only gold-standard calculator: persona presets + step-up + inflation toggle + LTCG approximation + 30% drawdown stress test + donut composition + share-as-image (html2canvas). 692 lines.
- **EMI / FD / PPF / Tax / Capital Gains** are functional but lack: persona presets, share-as-image, stress tests, scenario switcher.
- 25 of 72 calc pages reference inflation/LTCG/stress tokens via shared primitives — token coverage is broad but feature depth is SIP-only.

### 5.3 Shared primitives
`components/calculators/shared/*` — 9 files: `AIInsight`, `PopularCalculators`, `ProductRecs`, `ResultCard`, `SliderInput`, `TrustStrip`, `VSComparisonLayout`, `charts.tsx`, `WhatIfScenarios`. Used broadly across 72 pages.

### 5.4 FROZEN status
`app/calculators/**` is FROZEN per CLAUDE.md (validated financial math). Don't touch logic without full review.

---

## 6. Admin / CMS

### 6.1 Pages — 71 routes under `app/admin/`

Categorised:
- **Content**: `articles` (list/[id]/edit/edit-refactored/new), `pillar-pages`, `categories`, `tags`, `authors`, `guide`, `content-calendar`, `content-factory`, `creator/script`, `creator/shorts`, `editorial-qa`, `review-queue`, `import/{csv,json,markdown}`
- **Products**: `products` (list/analytics/[id]/new), `product-analytics`, `affiliates`, `ads`
- **Operations**: `cms` (budget/generation/health/scrapers), `agents`, `swarm-dashboard`, `automation` (batch), `autonomy/settings`, `pipeline`, `pipeline-monitor`, `scrapers`, `workflows` ([id]/new)
- **Insights**: `analytics`, `data-accuracy`, `growth-dashboard`, `metrics`, `ops-health`, `seo` (experiments/rankings), `social-dashboard`, `revenue/intelligence`, `email-dashboard`
- **Platform**: `users`, `settings/vault`, `webhooks`, `media`, `api-playground`, `design-system`, `strategy`, `ai-personas`
- **Auth**: `login`, `signup`

### 6.2 Auth gate
- Enforced in `middleware.ts` lines 110-133 (verified).
- Unauthed → `/admin/login`. Non-admin role → `/admin/login?error=access_denied`.
- `getUserRole()` checks `user_roles` then falls back to `user_profiles`.
- Layout intentionally has no duplicate check (would cause redirect loop on login page).

### 6.3 Data-wiring state (post-Math.random scrub)

| Page | State |
|---|---|
| `/admin` (home) | Empty states honest — sparkline + velocity + revenue all zeros, "live data wiring pending" |
| `/admin/articles` | Real DB-driven |
| `/admin/products` + analytics | Real DB-driven for product list; analytics returns zeros until `analytics_events` writer wired |
| `/admin/revenue/intelligence` | Empty state (was 78.5% / 156 / Math.random; now zeros) |
| `/admin/growth-dashboard` | Trends zeroed |
| `/admin/seo/rankings` | Real DB if cron has populated; cron lazy-init verified |
| `/admin/scrapers` | Real |
| `/admin/cms/health` | Real ops view |

### 6.4 What's NOT in admin
- Real-time Stripe revenue — Stripe price IDs not created yet
- Live web-vitals dashboard — data flowing to `web_vitals` table; admin view pending
- Real affiliate revenue dashboard — `affiliate_clicks` should populate post-deploy; admin view exists with empty state
- Bulk product editor — only bulk import (CSV/JSON/markdown)

---

## 7. SEO + GEO + sitemap

### 7.1 Sitemap (`app/sitemap.ts`)
- Dynamic generation, ~1,600 URLs
- Filters: `is_active=true` on every product table, `status='published'` on articles
- All 7 methodology sub-pages now in sitemap (added today, commit `3cfab1ff`)
- Canonical via `lib/linking/canonical.ts` (used per page)

### 7.2 robots.txt
- **Single source of truth**: `app/robots.ts` (dynamic).
- Static `public/robots.txt` deleted today (was conflicting).
- Allows: ChatGPT-User, PerplexityBot, Applebot-Extended, Google.
- Blocks: GPTBot, Google-Extended, CCBot, ClaudeBot, anthropic-ai, Bytespider, Diffbot.

### 7.3 Schema markup (`lib/seo/schema-generator.ts`)
- Emitted: `Article`, `FAQPage`, `BreadcrumbList`, `Person`, `Organization`, `speakable`
- **Missing**: `Product` / `FinancialProduct` schema on product detail pages → opportunity for rich-result snippets
- **Bug**: hardcoded `vikram-mehta` author URL in schema-generator (should map from `getDeskForCategory()`)

### 7.4 Meta tags
- `app/layout.tsx` defaults: `metadataBase`, `title.template`, default description, keywords
- `openGraph` + `twitter` metadata in 95 page files

### 7.5 Dynamic OG images
- `app/api/og/route.tsx` exists ✅
- `app/icon.tsx` exists (gradient SVG mark) ✅
- **Missing**: `apple-icon`, root `opengraph-image`, `twitter-image`

### 7.6 IndexNow
- `app/api/indexnow/route.ts` endpoint exists
- Auto-fire on publish: NOT verified — likely needs wiring in publish flow

### 7.7 GEO (AI-search)
- robots allows ChatGPT-User + PerplexityBot
- `speakable` schema attribute on articles
- No explicit AI-citation optimization beyond this — opportunity for `seo-geo` skill audit

---

## 8. Social, share, newsletter

### 8.1 Share buttons
- `components/common/SocialShareButtons.tsx` — WhatsApp `wa.me`, Facebook, Twitter, LinkedIn, native `navigator.share`
- Wired into article pages (`app/article/[slug]/page.tsx:218`)
- `components/products/ProductShareButtons.tsx` — product-specific
- `components/common/WhatsAppButton.tsx` + `WhatsAppAlerts.tsx` — sticky floater
- **Missing on calculators** — calc pages have no share UI

### 8.2 Auto-post on publish
- `app/api/social/generate/route.ts` + `app/api/admin/generate-social/route.ts` exist (drafting)
- No cron / webhook auto-poster confirmed — Twitter/LinkedIn handles still in CLAUDE.md as "planned"

### 8.3 Newsletter
- `app/api/newsletter/route.ts` — POST/GET/DELETE; rate-limited; sanitized
- `lib/email/resend-service.ts` — Resend wired, sender `noreply@investingpro.in`
- `lib/email/sequences.ts` — welcome email referenced
- **Missing**: `/unsubscribe` user-facing page (API supports DELETE, no UI)

---

## 9. Monetization & affiliate pipeline

### 9.1 Affiliate tracking
- `lib/tracking/affiliate-tracker.ts` — UUID-validated, schema-mismatch retry, PostHog + Supabase
- `app/api/out/route.ts` — service-role insert with UTM, sub1/sub2 append
- `app/go/[slug]/route.ts` — short-code resolver + `increment_affiliate_clicks` RPC
- Schema fixed today — `affiliate_clicks` should populate on first click after next deploy

### 9.2 Affiliate networks
- **Cuelinks** (244238) and **EarnKaro** (5197986) referenced in CLAUDE.md
- `lib/marketing/adapters/cuelinks.ts` — adapter exists
- `components/monetization/ThirdPartyScripts.tsx` — script loader
- `supabase/seeds/affiliate-partners.sql` — seed data
- `scripts/sync-affiliate-products.ts` — sync script
- **Status**: apply_links currently route DIRECT to issuer (defensible, no commission). Wrapping through `/api/out` for commission tracking is P1 post-launch.

### 9.3 Stripe
- SDK installed (v20.1.1)
- **No `STRIPE_PRO_PRICE_ID`** in code — Pro/Annual plans not created in Stripe dashboard
- Subscription flow architected but unlaunchable until prices exist

### 9.4 Programmatic ad placements
- `/admin/ads` route exists
- No data on actual Google AdSense / direct ad units installed

---

## 10. Performance & Core Web Vitals

### 10.1 Reporting
- `lib/performance/web-vitals.ts` — dev-log + per-metric POST aggregation
- `components/performance/WebVitalsTracker.tsx` — fires LCP/FID/CLS/FCP/TTFB to `/api/analytics/web-vitals` (production only, `keepalive: true`)
- `web_vitals` table receiving rows (16 already)

### 10.2 Bundle health
- `next.config.ts` is minimal — no bundle analyzer wired
- `next/dynamic` used in only 8 files / 37 occurrences
- Heavy libs (Recharts, framer-motion, jspdf) NOT broadly code-split → opportunity for LCP improvement
- Custom webpack alias for `isomorphic-dompurify` blocks Turbopack

### 10.3 Fonts
- `next/font/google` with `display: swap`
- Three families: Inter (body), Playfair Display (headlines), JetBrains Mono (data)

### 10.4 Image optimization
- `next/image` with 7 remote-pattern allowlist
- 11 image helpers in `lib/images/`
- Asset CDN: Supabase Storage + Cloudinary (env-gated) + Pexels/Unsplash (stock)

### 10.5 Core Web Vitals targets
Not yet measured at scale. Monitor `web_vitals` table + GSC Search Console once data accumulates.

---

## 11. i18n status

### 11.1 Master branch (current production)
- **English only** (`en_IN`)
- Locale references = OG metadata only, no multi-locale routing
- `lib/i18n/` does NOT exist on master

### 11.2 Vibrant-lovelace branch (parallel infra work)
- Branch: `claude/vibrant-lovelace-875415` (47 commits ahead of master in some areas)
- Phase 1 routing + 2a chrome + 2b (Gujarati + Kannada) + 3a glossary infra ALL shipped — but only on this branch
- 8 locales planned: en, hi, bn, mr, te, ta, gu, kn
- **Hindi translation run deferred** until 2026-05-10 chrome-review nudge fires

### 11.3 Pending (i18n)
- Phase 3b (FAQ infra) + 3c (calc labels) — pending
- Bulk translation pipeline (~600 pages) — large
- `hreflang` in `sitemap.ts` — depends on lib/i18n

---

## 12. Security & compliance

### 12.1 Recently closed (P0/P1/P2 sprint)
- Service-role JWT scrubbed from 3 scripts (was hardcoded)
- RLS enabled on 7 previously-open tables
- `.vercelignore` extended to exclude `.claude` (66k file count)
- Inngest bumped to ^3.54.0 per security advisory
- CRON_SECRET rotated across all Vercel envs
- Admin auth gate verified (middleware-enforced)
- Conflicting static `robots.txt` deleted

### 12.2 Open security items
- **Rotate Supabase legacy JWT signing key** (user action needed in Supabase dashboard)
- **Public AI routes lack rate limits** (`/api/translate` etc.) — cost exposure
- **DOMPurify missing** on some `dangerouslySetInnerHTML` paths in article rendering
- **Admin role check missing** on several `/api/admin/*` routes (defense-in-depth; middleware covers)
- **Git history sweep** for leaked API keys + rotate

### 12.3 Compliance disclosures (live on site)
- "Not a SEBI-registered investment advisor" disclaimer
- Affiliate disclosure page
- Privacy + terms + cookie policy
- DICGC / IRDAI / RBI / SEBI references in methodology pages
- Editorial standards page

---

## 13. Cron + automation backbone

### 13.1 Native Vercel crons (vercel.json)
40 active crons across:
- Content generation (daily-content-generation, content-strategy, content-sense, content-distribution, content-refresh)
- Data ingestion (RBI rates, gold prices, AMFI sync, FD rates, news)
- Agent swarm (writer/editor/publisher/supervisor/QA/SEO/research/distribution)
- Maintenance (cleanup, archive-data, record-table-sizes, sitemap-ping)
- Analytics (sync-rankings, daily-cost-report, daily-revenue-report)
- 11 agent-* swarm routes

### 13.2 Cron audit verdict (2026-04-26)
- 35/40 routes clean
- `archive-data` 500 fixed (column-mismatch)
- `generate-missing-images` + `seo-rankings-update` hardened with lazy-init + missing-env "skipped" semantic
- `sitemap-ping` is silent no-op (Google deprecated ping endpoint 2023; Bing IndexNow still active)

### 13.3 GitHub Actions
- 7 active workflows: ci, accessibility, content-factory, credit-card-scraper, lighthouse, scraper, staging
- 41 disabled in `.github/workflows-disabled/` (post Vercel native cron migration)

---

## 14. Observability

### 14.1 What's live
- Sentry (client/server/edge configs)
- PostHog client SDK
- `lib/logger.ts` — structured JSON, correlation IDs
- In-memory metrics store (`metricsStore.recordRequest`)
- `web_vitals` table (writes flowing)

### 14.2 What's missing
- Cron execution dashboard in admin (40 crons running blind)
- Real-time admin dashboard backed by `analytics_events` (orphan writer)
- `console.log` → structured logger sweep
- Alerting on cron failures

---

## 15. What ships TONIGHT

User actions for sitemap submission:
1. **Google Search Console**: Add property → verify domain → Sitemaps → submit `https://www.investingpro.in/sitemap.xml`
2. **Bing Webmaster Tools**: Add site → verify → Sitemaps → submit same URL
3. **Manual indexing requests** in GSC for top-10 high-value URLs:
   - `/` (homepage)
   - `/methodology` + 7 sub-pages
   - 5 best-performing articles by topic
4. **Apply for Google AdSense**: 210 articles + 818 product pages = strong application
5. **Confirm post-deploy**: `affiliate_clicks` starts populating; `web_vitals` continues to populate; `newsletter_subscribers` accepts test signup

---

## 16. Critical blockers BEFORE submission

| Blocker | Severity | Status |
|---|---|---|
| Fake `Math.random()` in admin | P0 | ✅ Fixed today |
| BankBazaar competitor routing on apply_links | P0 | ✅ Fixed today (30 cards) |
| Placeholder MF rating=4.0 polluting sitemap | P0 | ✅ Fixed today (re-rated 51, marked 514 as "new") |
| Articles with fabricated stats | P0 | ✅ Fixed today (18 demoted to draft) |
| `/methodology/*` missing from sitemap | P0 | ✅ Fixed today |
| Conflicting static `robots.txt` | P1 | ✅ Deleted today |
| Admin auth gate verification | P0 | ✅ Verified middleware-enforced |

**No P0 blockers remaining.** Submission can proceed.

---

## 17. Pending work — by stage

### Stage A — Within 48 hours (post-submission)
- [ ] Monitor Vercel deploy status after each commit
- [ ] Verify `affiliate_clicks` gets first writes (test apply-now click)
- [ ] Verify `web_vitals` continues to populate
- [ ] Manual indexing for top-10 URLs in GSC + Bing
- [ ] Apply for Google AdSense
- [ ] [USER] Rotate Supabase legacy JWT signing key

### Stage B — Within 2 weeks (P1)
- [ ] **Cuelinks/EarnKaro affiliate wrapping** via `/api/out` route
- [ ] **IRDAI CSR ingestion** — manual one-time pull → real claim ratios per insurer (already cited in `/methodology/insurance`)
- [ ] **SEBI SCORES ingestion** — real complaint-per-1000-clients per broker
- [ ] **Play Store / App Store rating ingestion** for ~30 fintech apps
- [ ] **Stripe Pro Monthly + Annual price IDs** created in dashboard
- [ ] **Resend domain verification** finalised + welcome email template wired
- [ ] **`/unsubscribe` user-facing page**
- [ ] **AMFI re-ingest** for `mutual_funds` — populated returns + categories + expense_ratio (removes 514-fund-no-rating cap)
- [ ] **Cron execution dashboard** in admin
- [ ] **Edit + republish 18 demoted articles** (verify SEBI/Yatra/Morningstar citations)
- [ ] **Fix hardcoded `vikram-mehta` author URL** in `lib/seo/schema-generator.ts`
- [ ] **Add `Product` / `FinancialProduct` schema** to product detail pages
- [ ] **IndexNow auto-ping on publish** wired
- [ ] **Top-up product counts**: 150+ cards (from 81), 50+ FDs (from 25), 30+ savings (from 15), 30+ brokers (from 14)

### Stage C — Within 1 month (P2)
- [ ] **`/admin/authority` E-E-A-T scoreboard** — long-term authority compounding system
- [ ] **Glossary 101 → 205 terms**
- [ ] **9+ articles missing cross-links** — interlinking mesh
- [ ] **Corrections + fact-check policy pages** content
- [ ] **Process 29 approved Grok images** + generate ~160 more
- [ ] **Wire featured_image** to all 210 articles
- [ ] **Port SIP gold-standard pattern** to EMI / FD / Tax / Capital Gains calculators (~3 hrs each)
- [ ] **Calculator share buttons** + share-as-image
- [ ] **Bulk product editor** in admin (currently only CSV/JSON import)
- [ ] **Public AI route rate limiting** (cost exposure)
- [ ] **DOMPurify** on all `dangerouslySetInnerHTML`
- [ ] **Admin role check** on `/api/admin/*` routes (defense-in-depth)
- [ ] **Code splitting**: dynamic-import recharts, framer-motion, jspdf

### Stage D — Within 2 months (P3)
- [ ] **i18n Phase 3b** (FAQ) + Phase 3c (calc labels) — merge `claude/vibrant-lovelace-875415` to master
- [ ] **Hindi translation run** for top 50 articles + 23 calcs
- [ ] **`hreflang`** in sitemap
- [ ] **City × category programmatic SEO** (10 cities × 5 categories = 50 pages)
- [ ] **Bank holidays per state** programmatic SEO (~500 pages)
- [ ] **Reddit API integration** — community-discussion blocks per product
- [ ] **PWA mobile mockup section** on homepage + manifest depth
- [ ] **Bundle analyzer** + Core Web Vitals optimization
- [ ] **Wallet Architect** UI exposure (currently coded but unwired) — `/tools/wallet-architect`
- [ ] **Riskometer GaugeMeter** wired into MF cards (SEBI compliance)
- [ ] **Mobile data row** on listings (1Y returns + AUM hidden on mobile)
- [ ] **TypeScript `ignoreBuildErrors: false`** verified maintained (already on)
- [ ] **`console.log` → logger** sweep
- [ ] **Bulk translation pipeline** (i18n full run, ~600 pages)

### Stage E — Within 6 months (P4)
- [ ] **Marketplace** (premium prompts, agent templates, schemas)
- [ ] **WordPress plugin** sync to Next.js integration
- [ ] **100+ micro-agents** (per CLAUDE.md "Planned" section)
- [ ] **Meta-agents** (agents that monitor other agents)
- [ ] **White-label mode** per workspace
- [ ] **Reading-list / portfolio tracker** consumer features

---

## 18. Roadmap — phases & timing

```
TODAY (2026-04-26)
├── Submit sitemap to GSC + Bing
├── Apply for AdSense
└── 818 real product pages + 210 articles + 8 methodology pages live

Apr 27–28 (48h)
├── Monitor first crawl + indexing rate
├── Verify affiliate_clicks + web_vitals data flows
└── Patch any sitemap submission errors

Apr 29 – May 10 (2 weeks)
├── Cuelinks/EarnKaro affiliate commission wrapping
├── IRDAI CSR + SEBI SCORES + Play Store data ingestion
├── Stripe Pro plan launch
├── AMFI MF re-ingest (removes 514-fund cap)
└── 18 demoted articles edited + republished

May 10 – Jun 10 (1 month)
├── /admin/authority E-E-A-T scoreboard
├── Glossary 205-term expansion
├── 160 Grok images generated + wired
├── Calculator gold-standard pattern → EMI/FD/Tax/CG
└── Calculator share buttons

Jun 10 – Aug 10 (2 months)
├── i18n Phase 3b/3c merge to master
├── Hindi translation run (top 50 articles)
├── hreflang in sitemap
├── Programmatic SEO (cities × categories, bank holidays)
└── Wallet Architect public exposure

Aug 10 – Oct 26 (6 months)
├── Marketplace MVP
├── 100+ micro-agents
└── White-label per workspace
```

**Go-live posture:** Public site IS live and has been for weeks. The "launch" today is the SEARCH ENGINE submission — getting Google + Bing to index the corpus so traffic compounds.

---

## 19. Known risks & mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| 514 MFs without ratings show "—" | M | Acceptable — better than fake rating; AMFI re-ingest fixes |
| `analytics_events` orphan writer | L | PostHog cloud has the data; admin dashboard shows zeros honestly |
| Stripe price IDs not created | M | Subscription path unblocked once user creates them in Stripe dashboard |
| `affiliate_clicks` schema fixed but unverified post-deploy | M | Will surface within hours of next click — easy to verify |
| Hardcoded Gemini `gemini-pro` model | L | Failover chain catches; minor cost optimization opportunity |
| 22 reference `*_schema.sql` dumps in lib/supabase/ | L | Doc cleanup task; not functional risk |
| CLAUDE.md stale (Tailwind 4, Stripe 21, 228 articles) | L | This doc supersedes; refresh CLAUDE.md when next major version |
| MF table has data corruption (391 misclassified as "Large Cap") | M | 514 marked as "new fund" hides the issue from public; AMFI re-ingest fixes |
| Heavy libs not code-split | M | Core Web Vitals impact; bundle analyzer + dynamic-import sprint |
| Public AI routes unrate-limited | M | Cost exposure; rate-limit middleware extension is small |
| DOMPurify gaps | M | XSS risk on AI-generated content; audit sprint |

---

## Appendix: file paths surfaced in this audit

- Tech: `package.json`, `next.config.ts`, `tsconfig.json`, `vercel.json`, `.vercelignore`
- Auth: `middleware.ts:110-133`, `lib/auth/admin-auth.ts`, `lib/auth/require-admin-api.ts`
- AI: `lib/ai-service.ts`, `lib/ai/*`
- Calcs: `components/calculators/SIPCalculatorV2.tsx`, `components/calculators/shared/*`
- Articles: `components/articles/ArticleRenderer.tsx`, `components/articles/DeskByline.tsx`, `app/articles/[slug]/page.tsx:205`
- Glossary: `app/glossary/[slug]/page.tsx`, `app/glossary/page.tsx`
- Products: `components/products/RichProductCard.tsx`, `components/products/ApplyNowCTA.tsx`
- SEO: `lib/seo/schema-generator.ts`, `lib/linking/canonical.ts`, `app/sitemap.ts`, `app/robots.ts`, `app/api/og/route.tsx`, `app/api/indexnow/route.ts`
- Social: `components/common/SocialShareButtons.tsx`, `components/common/WhatsAppButton.tsx`
- Newsletter: `lib/engagement/newsletter-service.ts`, `lib/email/resend-service.ts`, `app/api/newsletter/route.ts`
- Affiliate: `lib/tracking/affiliate-tracker.ts`, `app/api/out/route.ts`, `app/go/[slug]/route.ts`, `lib/marketing/adapters/cuelinks.ts`
- Methodology: `app/methodology/page.tsx` + 7 sub-pages
- Sitemap: `app/sitemap.ts`
- Tracking: `lib/performance/web-vitals.ts`, `components/performance/WebVitalsTracker.tsx`
- Migrations: `supabase/migrations/` (130 total, 5 latest from today)

---

*This document is the operational source of truth for InvestingPro.in launch + roadmap. Update on every major architectural decision. CLAUDE.md should reference this doc rather than duplicate state.*
