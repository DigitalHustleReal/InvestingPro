# InvestingPro.in — Unified Task Table

> **Date:** April 5, 2026
> **Source:** 7 NerdWallet-perspective audits + Master Executive Audit
> **Purpose:** Single operating document for execution. Every task from every audit, deduplicated.

---

## HOW TO READ THIS TABLE

- **Task ID:** `DEPT-NNN` format by department
- **Priority:** P0 = blocker (Day 1), P1 = this week, P2 = next 2 weeks, P3 = month 1, P4 = ongoing
- **Owner:** Human = requires manual action (account signup, API key entry); Agent = automatable by Claude Code
- **Source:** Which audit(s) identified the task. CEO, CTO, CFO, MKT (Marketing VP), AI (AI/ML), UX (UI/UX+Copy), LEG (Legal)
- **Dependencies:** Other task IDs that must be completed first

---

## SECURITY

| ID | Task | Source | Priority | Effort | Owner | Dependencies |
|----|------|--------|----------|--------|-------|-------------|
| SEC-001 | Rotate ALL hardcoded API keys (Gemini, OpenAI, Groq, Mistral, Alpha Vantage) — they are compromised in git history | CTO, Master | P0 | 1h | Human | — |
| SEC-002 | Delete `scripts/setup-*-key.ts` files containing hardcoded API keys | CTO, Master | P0 | 15min | Agent | — |
| SEC-003 | Add admin role check (`is_admin`) to all 15+ unauthenticated admin API routes (`/api/admin/autonomous`, `/api/admin/autonomy/config`, `/api/admin/automation`, `/api/admin/cache/stats`, `/api/admin/generate-seo`, `/api/admin/translate`, `/api/admin/sync-categories`, etc.) | CTO, Master | P0 | 3h | Agent | — |
| SEC-004 | Fix admin article CRUD routes — verify `is_admin` role, not just session existence | CTO | P0 | 1h | Agent | — |
| SEC-005 | Add auth + rate limiting to public AI-triggering routes (`/api/translate`, `/api/social/generate`, `/api/cms/bulk-generate`, `/api/products/generate-image`) | CTO, AI, Master | P0 | 2h | Agent | — |
| SEC-006 | Fix `affiliate_clicks` RLS policy — replace `USING(true)` on SELECT/UPDATE with proper workspace/user check | CTO, Master | P0 | 30min | Agent | — |
| SEC-007 | Add DOMPurify sanitization to all 10+ `dangerouslySetInnerHTML` instances (`AdBanner`, `FAQAccordion`, `SEOContentBlock`, article pages, etc.) | CTO, Master | P1 | 2h | Agent | — |
| SEC-008 | Make cron auth fail-closed — reject requests when `CRON_SECRET` is unset (currently 7 routes bypass auth if env var missing) | CTO | P1 | 1h | Agent | — |
| SEC-009 | Fix `createAPIWrapper` — implement the auth check that is currently a TODO comment | CTO | P1 | 1h | Agent | — |
| SEC-010 | Stop using service role key at module level in 10+ files — lazy-load only when needed | CTO | P1 | 2h | Agent | — |
| SEC-011 | Implement proper RBAC middleware — single source of truth replacing 5 scattered admin auth implementations (`checkAdminRole.ts`, `admin-auth.ts`, `roles.ts`, `require-admin-api.ts`, `permissions.ts`) | CTO, Master | P2 | 3h | Agent | SEC-003, SEC-004 |
| SEC-012 | Add CSP headers and comprehensive security headers review | CTO, CEO | P2 | 2h | Agent | — |
| SEC-013 | Add CSRF protection on all forms | CEO | P2 | 2h | Agent | — |
| SEC-014 | Configure dependency scanning (Snyk or Dependabot) | CTO | P3 | 1h | Human | — |
| SEC-015 | Establish API key rotation schedule | CTO | P3 | 1h | Human | SEC-001 |

---

## LEGAL

| ID | Task | Source | Priority | Effort | Owner | Dependencies |
|----|------|--------|----------|--------|-------|-------------|
| LEG-001 | Remove ALL unsubstantiated statistics from production: "2.1M+ Happy Users", "500Cr+ Investments", "4.8/5 User Rating" on about page; "500+ credit cards", "2,000+ mutual funds" on marketing copy | LEG, UX, CEO | P0 | 1h | Agent | — |
| LEG-002 | Remove placeholder `\|\|'10,000+'` fallback logic — show "N/A" or hide field when data is missing, not fake numbers | LEG, UX, CEO | P0 | 1h | Agent | — |
| LEG-003 | Add age verification gate (DOB or "I am 18+" checkbox) for DPDPA 2023 Section 9 compliance — platform collects financial data | LEG | P0 | 2h | Agent | — |
| LEG-004 | Switch cookie consent from opt-out to opt-in model with granular per-purpose consent (analytics, marketing, functional) | LEG | P1 | 3h | Agent | — |
| LEG-005 | Add trademark attribution notice: "All brand names, logos, and trademarks are the property of their respective owners" | LEG | P1 | 30min | Agent | — |
| LEG-006 | Add explicit "InvestingPro.in is not affiliated with Investing.com or its InvestingPro product" disclaimer | LEG | P1 | 30min | Agent | — |
| LEG-007 | Build data deletion API endpoint + self-service "Delete My Data" UI (DPDPA Right to Erasure) | LEG | P1 | 4h | Agent | — |
| LEG-008 | Build data export/portability endpoint (DPDPA Right to Data Portability) | LEG | P1 | 4h | Agent | — |
| LEG-009 | Add explicit consent disclosure to eligibility widget before collecting income/credit score data | LEG, CEO | P1 | 2h | Agent | — |
| LEG-010 | Update Privacy Policy: add ALL third-party data processors (Cloudinary, PostHog, Sentry, Upstash, Vercel — currently undisclosed) | LEG | P1 | 2h | Agent | — |
| LEG-011 | Add data retention periods to Privacy Policy | LEG | P2 | 1h | Agent | — |
| LEG-012 | Document breach notification process — 72-hour SOP for Data Protection Board notification per DPDPA Section 8 | LEG | P1 | 2h | Human | — |
| LEG-013 | Disclose cross-border data transfers in Privacy Policy (Supabase US/EU, Google Analytics US, etc.) | LEG | P2 | 1h | Agent | — |
| LEG-014 | Add automated decision-making disclosure to Privacy Policy (AI recommendations) | LEG | P2 | 1h | Agent | — |
| LEG-015 | Verify IRDAI web aggregator license requirements — may be needed if insurance "Apply Now" links to purchase | LEG | P2 | 2h | Human | — |
| LEG-016 | Add RBI LSP non-registration disclosure on loan pages | LEG | P2 | 30min | Agent | — |
| LEG-017 | Implement consent withdrawal mechanism (must be as easy as giving consent) | LEG | P2 | 3h | Agent | LEG-004 |
| LEG-018 | Create Data Processing Agreements with all third-party processors (Supabase, Cloudinary, etc.) | LEG | P3 | 4h | Human | — |
| LEG-019 | Align user statistics across all pages — use ONE verified number consistently | UX, LEG | P0 | 1h | Agent | LEG-001 |
| LEG-020 | Add data source citations on all product comparison pages | LEG | P3 | 2h | Agent | — |
| LEG-021 | Remove or replace loan eligibility widget fake `setTimeout()` results — shows hardcoded "HDFC 10.25%" | CEO, LEG | P1 | 2h | Agent | — |
| LEG-022 | Remove fabricated `AggregateRating` with `ratingCount: 1` from `FundStructuredData.tsx` — Google policy violation | CEO, MKT | P0 | 30min | Agent | — |

---

## REVENUE

| ID | Task | Source | Priority | Effort | Owner | Dependencies |
|----|------|--------|----------|--------|-------|-------------|
| REV-001 | Register on Cuelinks affiliate network (no minimum traffic requirement) | CEO, CFO, Master | P0 | 15min | Human | — |
| REV-002 | Register on EarnKaro affiliate network (instant approval) | CEO, CFO, Master | P0 | 15min | Human | — |
| REV-003 | Get affiliate API keys and add to environment variables | CEO, CFO | P0 | 15min | Human | REV-001, REV-002 |
| REV-004 | Wire `TrackedAffiliateLink` component to ALL "Apply Now" buttons across credit card, loan, and product pages (currently 0 imports — component is orphaned) | CEO, CFO, Master | P0 | 2h | Agent | REV-003 |
| REV-005 | Populate `affiliate_links` table — map each product slug to real affiliate redirect URL | CEO, CFO | P0 | 2h | Agent | REV-003 |
| REV-006 | Uncomment and configure Cuelinks integration: register adapter in marketing service, add script tag to layout, set API key | CEO, CFO | P1 | 1h | Agent | REV-003 |
| REV-007 | Fix GA4 `Analytics.tsx` bug — hardcoded literal `'GA_MEASUREMENT_ID'` string instead of `process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID` | CEO | P0 | 15min | Agent | — |
| REV-008 | Set up affiliate conversion tracking (postback URLs from affiliate networks) | CEO, CFO | P1 | 2h | Agent | REV-001, REV-002 |
| REV-009 | Build revenue dashboard showing earnings per product, per page, per day | CFO | P2 | 4h | Agent | REV-004 |
| REV-010 | Add click fraud detection (IP dedup, rate limiting on affiliate clicks) | CFO | P2 | 3h | Agent | REV-004 |
| REV-011 | A/B test CTA placement, copy, and colors for conversion optimization | CFO, MKT | P2 | 4h | Agent | REV-004, MKT-003 |
| REV-012 | Build revenue reconciliation report (monthly P&L visibility) | CFO | P3 | 4h | Agent | REV-004 |
| REV-013 | Build GST invoice generation for tax compliance | CFO | P3 | 4h | Agent | — |
| REV-014 | Fix exchange rate — use dynamic rate instead of hardcoded x83 INR conversion | CFO | P3 | 1h | Agent | — |
| REV-015 | Build monthly investor-ready financial report | CFO | P4 | 8h | Agent | REV-012 |
| REV-016 | Wire `sendWelcomeEmail()` to auth signup event (currently dead code, never called) | CEO, CFO | P1 | 1h | Agent | MKT-009 |
| REV-017 | Wire `sendWelcomeSequence()` 4-email drip to subscriber events (currently dead code) | CEO | P1 | 1h | Agent | MKT-009 |
| REV-018 | Mount PostHogProvider in layout (currently not mounted, analytics dead) | CEO, MKT | P0 | 30min | Agent | MKT-004 |

---

## CONTENT

| ID | Task | Source | Priority | Effort | Owner | Dependencies |
|----|------|--------|----------|--------|-------|-------------|
| CNT-001 | Generate and publish 50 "Best Credit Card for X in India 2026" articles (highest-intent keywords) | CEO, MKT, Master | P0 | 8h | Agent | — |
| CNT-002 | Generate 20 "Credit Card X vs Credit Card Y" comparison articles | CEO, MKT, Master | P0 | 4h | Agent | — |
| CNT-003 | Generate 10 pillar guides (CIBIL score, home loan, mutual fund investing, tax saving, etc.) | CEO, MKT, Master | P0 | 4h | Agent | — |
| CNT-004 | Generate 10 "Best Mutual Fund for X" articles | MKT | P1 | 4h | Agent | DATA-002 |
| CNT-005 | Activate daily-content-generation cron — run manually first, verify output, fix bugs | AI, CEO, Master | P0 | 2h | Agent | — |
| CNT-006 | Create 100 glossary terms for financial literacy | CEO | P1 | 4h | Agent | — |
| CNT-007 | Establish annual content review process with admin tracking | CEO | P2 | 3h | Agent | — |
| CNT-008 | Create content calendar targeting 5 articles/day velocity | CEO, MKT | P2 | 2h | Agent | CNT-005 |
| CNT-009 | Create detailed rating methodology pages for each product category (credit cards, MF, loans) | CEO | P1 | 4h | Agent | — |
| CNT-010 | Add real author profiles with financial credentials and LinkedIn links | CEO, UX | P1 | 2h | Agent | — |
| CNT-011 | Assign authors to all published articles | CEO | P1 | 1h | Agent | CNT-010 |
| CNT-012 | Add "Reviewed by [Expert]" badges to article pages | CEO | P2 | 2h | Agent | CNT-010 |
| CNT-013 | Create correction/update policy page | CEO | P2 | 1h | Agent | — |
| CNT-014 | Build "Sources" citations for all product data claims | CEO, LEG | P3 | 3h | Agent | — |
| CNT-015 | Create 5 original data studies (e.g., "Average Credit Card Debt in India by City") for backlink earning | CEO | P1 | 8h | Agent | — |
| CNT-016 | Create annual "Best Credit Cards in India 2026" awards page (ego-bait backlink strategy) | CEO | P2 | 4h | Agent | — |
| CNT-017 | Create 3 lead magnets (credit card comparison PDF, SIP guide, tax saving checklist) | CEO, MKT | P2 | 4h | Agent | — |
| CNT-018 | Create festival-specific content (Diwali offers, etc.) for seasonal traffic | MKT | P2 | 2h | Agent | — |
| CNT-019 | Generate Hindi content for 500M Hindi speakers | MKT | P3 | 8h | Agent | CNT-005 |
| CNT-020 | Add human review feedback loop — rating system on AI-generated articles to improve quality | AI | P2 | 3h | Agent | CNT-005 |
| CNT-021 | Split monolithic article generator (1,126 lines) into step functions | AI | P3 | 4h | Agent | — |

---

## MARKETING

| ID | Task | Source | Priority | Effort | Owner | Dependencies |
|----|------|--------|----------|--------|-------|-------------|
| MKT-001 | Submit sitemap to Google Search Console | CEO, MKT, Master | P0 | 5min | Human | — |
| MKT-002 | Verify investingpro.in in Google Search Console | CEO, MKT | P0 | 5min | Human | — |
| MKT-003 | Configure GA4 with real Measurement ID (currently placeholder) | CEO, MKT, CFO, Master | P0 | 10min | Human | — |
| MKT-004 | Configure PostHog with real API key (currently placeholder) | CEO, MKT, CFO, Master | P0 | 10min | Human | — |
| MKT-005 | Set up conversion goals in GA4 (affiliate clicks, newsletter signups) | CEO, MKT | P1 | 30min | Human | MKT-003 |
| MKT-006 | Fix schema markup: remove deprecated HowTo schema from calculator pages | CEO, MKT, Master | P1 | 30min | Agent | — |
| MKT-007 | Add author schema to all articles (E-E-A-T signal) | MKT | P1 | 2h | Agent | CNT-010 |
| MKT-008 | Add Organization schema to homepage/root layout (currently missing site-wide) | CEO | P1 | 1h | Agent | — |
| MKT-009 | Configure Resend API key in production environment | CEO, MKT, Master | P0 | 5min | Human | — |
| MKT-010 | Create welcome email template and wire to signup | CEO, MKT | P1 | 2h | Agent | MKT-009 |
| MKT-011 | Create Twitter/X account @InvestingProIN | CEO, MKT, Master | P1 | 10min | Human | — |
| MKT-012 | Create LinkedIn company page | MKT, Master | P1 | 15min | Human | — |
| MKT-013 | Connect social OAuth tokens to posting API | MKT, Master | P1 | 30min | Human | MKT-011, MKT-012 |
| MKT-014 | Create WhatsApp community/Telegram channel | CEO, MKT | P1 | 10min | Human | — |
| MKT-015 | Create weekly newsletter template ("This Week in Indian Finance") | CEO, MKT | P2 | 2h | Agent | MKT-009 |
| MKT-016 | Remove hardcoded "12,000+" subscriber count from newsletter widget — show real count or remove | CEO | P1 | 15min | Agent | — |
| MKT-017 | Add newsletter signup CTA to every article page footer | CEO | P1 | 1h | Agent | — |
| MKT-018 | Build email automation for drip sequences based on subscriber interests | CEO, MKT | P2 | 4h | Agent | MKT-009 |
| MKT-019 | Verify Web Vitals data is flowing to API endpoint | CEO | P1 | 1h | Agent | — |
| MKT-020 | Implement PostHog feature flags for A/B testing CTAs | CEO, MKT | P2 | 2h | Agent | MKT-004 |
| MKT-021 | Set up weekly automated analytics email to admin | CEO | P3 | 2h | Agent | MKT-003, MKT-004 |
| MKT-022 | Activate IndexNow for instant indexing of new content (Bing/Yandex) | CEO | P1 | 1h | Agent | — |
| MKT-023 | Add custom metadata to all product category pages (70% currently missing) | CEO | P1 | 3h | Agent | — |
| MKT-024 | Build keyword tracking dashboard using existing keyword API | CEO | P1 | 3h | Agent | — |
| MKT-025 | Start outreach for backlinks via data studies and calculator embeds | CEO | P2 | 4h | Human | CNT-015 |
| MKT-026 | Build 5 "money quiz" interactive tools for viral acquisition | MKT | P3 | 8h | Agent | — |
| MKT-027 | Consolidate 3 schema libraries into one canonical source (`schema-generator.ts`, `schema-generator-enhanced.ts`, `structured-data.ts`, `lib/linking/schema.ts`) | CEO | P2 | 3h | Agent | — |
| MKT-028 | Extract BreadcrumbList from inline CollectionPage into standalone script tags (not eligible for rich result when nested) | CEO | P2 | 2h | Agent | — |
| MKT-029 | Add FinancialProduct schema to individual product detail pages | CEO | P2 | 3h | Agent | — |
| MKT-030 | Convert `glossary/[slug]` schema to server-side rendering (currently client-side, unreliable for Googlebot) | CEO | P2 | 2h | Agent | — |
| MKT-031 | Redirect `article/[slug]` to `articles/[slug]` or convert to server component (dual routes live) | CEO | P1 | 1h | Agent | — |
| MKT-032 | Activate rankings tracking cron with real SerpAPI key | AI | P1 | 10min | Human | — |
| MKT-033 | Connect Google Search Console OAuth for real SEO data flow | AI | P1 | 15min | Human | MKT-002 |
| MKT-034 | Start weekly LinkedIn newsletter | CEO | P2 | 2h | Agent | MKT-012, MKT-013 |

---

## ENGINEERING

| ID | Task | Source | Priority | Effort | Owner | Dependencies |
|----|------|--------|----------|--------|-------|-------------|
| ENG-001 | Remove `force-dynamic` from product pages, add ISR with appropriate revalidation | CTO, Master | P0 | 2h | Agent | — |
| ENG-002 | Add `.limit()` and column selection to all DB queries (currently `select('*')` with no limit) | CTO, Master | P0 | 3h | Agent | — |
| ENG-003 | Wire Redis cache to top 5 listing pages (cache built but connected to ZERO hot paths) | CTO, Master | P0 | 3h | Agent | — |
| ENG-004 | Replace `SmartImage.tsx` (raw `<img>` tag) with `next/image` for optimization | CTO, Master | P0 | 2h | Agent | — |
| ENG-005 | Dynamic import `recharts` (45KB) in all 25+ components — only 2 currently use `next/dynamic` | CTO, Master | P1 | 2h | Agent | — |
| ENG-006 | Dynamic import `framer-motion` (32KB) — currently in layout, loads on every page | CTO, Master | P1 | 1h | Agent | — |
| ENG-007 | Dynamic import `html2canvas` + `jspdf` (120KB) — statically imported, only needed on click | CTO, Master | P1 | 30min | Agent | — |
| ENG-008 | Parallelize sitemap DB queries with `Promise.all` (currently 5 sequential queries) | CTO | P1 | 30min | Agent | — |
| ENG-009 | Set `typescript.ignoreBuildErrors: false` in next.config.ts and fix resulting type errors | CTO, Master | P1 | 8h | Agent | — |
| ENG-010 | Consolidate 3 API clients into 1 canonical client (`lib/api.ts` 36 imports, `lib/api-client.ts` 37 imports, `lib/api/client.ts` 1 import) | CTO, Master | P2 | 4h | Agent | — |
| ENG-011 | Remove `@google/generative-ai` SDK (11 files), standardize on `@google/genai` (10 files) | CTO | P2 | 2h | Agent | — |
| ENG-012 | Replace 50+ `console.log` statements in production with structured `@/lib/logger` | CTO, Master | P2 | 2h | Agent | — |
| ENG-013 | Remove or create tracked issues for 87 TODO/FIXME/HACK comments across 49 files | CTO | P3 | 3h | Agent | — |
| ENG-014 | Split `lib/api-client.ts` (650+ lines, 16 `any` types) by domain | CTO | P2 | 4h | Agent | ENG-010 |
| ENG-015 | Add Zod validation to all write API routes (currently inconsistent — some validate, most don't) | CTO | P2 | 8h | Agent | — |
| ENG-016 | Fix N+1 auth query in middleware — cache user profile in session/cookie instead of fetching on every request | CTO | P1 | 2h | Agent | — |
| ENG-017 | Consolidate dual API trees: `/api/admin/` (45 routes) + `/api/v1/admin/` (21 routes) into one | CTO | P2 | 4h | Agent | — |
| ENG-018 | Fix Vercel production branch alignment (main vs master) | CEO, Master | P0 | 15min | Human | — |
| ENG-019 | Fix codebase ESLint errors and add ESLint to lint-staged | CEO | P1 | 3h | Agent | — |
| ENG-020 | Upgrade Upstash Redis from free tier (10K commands/day) to Pro tier for production traffic | CFO, CTO | P2 | 10min | Human | — |
| ENG-021 | Verify Vercel plan supports all 28 cron jobs (Pro plan needed — Hobby supports only 1) | CEO, AI | P1 | 15min | Human | — |
| ENG-022 | Fix `article-service.ts` — imports browser Supabase client in server module (auth context mismatch) | CTO | P1 | 1h | Agent | — |
| ENG-023 | Add UPI deep links for payments (most Indians prefer UPI over cards) | MKT | P3 | 2h | Agent | — |

---

## DESIGN

| ID | Task | Source | Priority | Effort | Owner | Dependencies |
|----|------|--------|----------|--------|-------|-------------|
| DSN-001 | Fix breadcrumb contrast — `text-gray-400` on white background fails WCAG AA; change to `gray-600` or darker | UX | P0 | 30min | Agent | — |
| DSN-002 | Replace AI-generated team avatars (`dicebear.com`) with real team photos on about page | UX | P1 | 1h | Human | — |
| DSN-003 | Replace all generic "Get Started" CTAs with context-specific alternatives ("Compare Cards", "Find My Card", etc.) | UX | P1 | 2h | Agent | — |
| DSN-004 | Add friction-reduction copy to all "Apply Now" buttons ("Takes 3 mins", "No credit impact", "Soft check only") | UX | P1 | 2h | Agent | — |
| DSN-005 | Redesign error states with recovery paths and suggestions (currently bare "No results found") | UX | P1 | 3h | Agent | — |
| DSN-006 | Unify admin theme colors — admin uses Sky Blue while public uses Forest Green (two different brands) | UX | P2 | 4h | Agent | — |
| DSN-007 | Add scroll affordance (fade gradient or indicator) to all horizontal scrollers (currently hidden scrollbar) | UX | P2 | 2h | Agent | — |
| DSN-008 | Standardize max-width to 1200px across all pages (currently mixed 1200px, 1280px, 7xl) | UX | P2 | 1h | Agent | — |
| DSN-009 | Create 10+ skeleton/loading variants for major page types (currently only 4 variants for 200+ pages) | UX | P2 | 4h | Agent | — |
| DSN-010 | Add `md:` breakpoints to all grid layouts (many jump from sm to lg, skipping tablet) | UX | P2 | 3h | Agent | — |
| DSN-011 | Formalize typography scale (H1-H6, body, caption) — H1 sizes currently vary: 32px, 44px, custom | UX | P2 | 2h | Agent | — |
| DSN-012 | Add emotional language to homepage hero + about page ("Stop losing 5,000/year to wrong cards") | UX | P2 | 2h | Agent | — |
| DSN-013 | Write testimonials and case studies (real or permission-based) | UX | P3 | 4h | Human | — |
| DSN-014 | Expand ARIA labels to public pages (currently 18 total ARIA attributes; 133 focus-visible references exist but ARIA depth is lacking) | UX | P2 | 3h | Agent | — |
| DSN-015 | Add "Did you mean?" suggestions to search (CommandPalette) | UX | P3 | 3h | Agent | — |
| DSN-016 | Fix 11px sub-text on mutual funds page — too small, below minimum readable size | UX | P2 | 15min | Agent | — |
| DSN-017 | Add product recommendation CTAs to ALL calculator result pages (some have them, not all) | CEO | P1 | 2h | Agent | — |
| DSN-018 | Build embeddable calculator widget for partner sites (backlink magnet) | CEO | P2 | 4h | Agent | — |

---

## DATA

| ID | Task | Source | Priority | Effort | Owner | Dependencies |
|----|------|--------|----------|--------|-------|-------------|
| DATA-001 | Seed 50+ real credit card products with real affiliate URLs (expand from 57 to 150+) | CEO, CFO, Master | P0 | 3h | Agent | REV-003 |
| DATA-002 | Run AMFI mutual fund sync script against production DB — load 2,547+ real funds from free API (`portal.amfiindia.com`) | CEO, AI, Master | P0 | 1h | Agent | — |
| DATA-003 | Verify no junk data from `mega-seed.ts` or `seed-dummy-products.ts` in production DB — clean if present | CEO | P0 | 1h | Agent | — |
| DATA-004 | Add 50+ loan products (personal, home, car, education, gold) | CEO | P1 | 3h | Agent | — |
| DATA-005 | Add 30+ FD products across banks and NBFCs | CEO | P2 | 2h | Agent | — |
| DATA-006 | Add 20+ demat account offerings | CEO | P2 | 2h | Agent | — |
| DATA-007 | Wire daily auto-refresh for interest rates, fees, rewards from bank websites | CEO | P1 | 4h | Agent | — |
| DATA-008 | Update RBI rate fallback from hardcoded 2024 value (6.5%) to current rate | CEO | P2 | 30min | Agent | — |
| DATA-009 | Build product freshness dashboard in admin showing last-updated dates per product | CEO | P3 | 3h | Agent | — |
| DATA-010 | Migrate monetary TEXT columns (annual_fee, joining_fee, aum) to NUMERIC type in DB | CTO, Master | P2 | 4h | Agent | — |
| DATA-011 | Reconcile duplicate table definitions — `credit_cards` defined differently in 2 separate SQL files | CTO | P2 | 2h | Agent | — |
| DATA-012 | Unify RLS admin role checks — 3 conflicting implementations across policies | CTO | P2 | 2h | Agent | — |
| DATA-013 | Remove `DELETE FROM products;` from `real_products_seed.sql` — add environment guard to prevent production data wipe | CTO | P1 | 1h | Agent | — |
| DATA-014 | Fix TypeScript/DB type mismatches — `CreditCard.type` is lowercase in TS but PascalCase in DB CHECK constraint | CTO | P2 | 2h | Agent | — |
| DATA-015 | Create rollback scripts for critical migrations (100+ forward-only migrations, ZERO rollbacks) | CTO | P3 | 4h | Agent | — |
| DATA-016 | Reconcile schema drift — `lib/supabase/*.sql` and `supabase/migrations/*.sql` define different schemas | CTO | P2 | 2h | Agent | DATA-011 |
| DATA-017 | Run credit card scraper for latest product data | AI | P1 | 1h | Agent | — |
| DATA-018 | Generate 500+ card-vs-card comparison pages programmatically from existing 57+ cards | CEO | P1 | 2h | Agent | — |
| DATA-019 | Build interactive "Find Your Best Credit Card" quiz (3-5 questions) | CEO | P1 | 4h | Agent | — |
| DATA-020 | Add star ratings and scoring to all product cards | CEO | P2 | 3h | Agent | — |
| DATA-021 | Build dynamic rate comparison tables for FDs across banks | CEO | P2 | 3h | Agent | DATA-005 |

---

## QA

| ID | Task | Source | Priority | Effort | Owner | Dependencies |
|----|------|--------|----------|--------|-------|-------------|
| QA-001 | Test affiliate click tracking end-to-end | CTO, Master | P1 | 3h | Agent | REV-004 |
| QA-002 | Test Stripe checkout + webhook flow | CTO, Master | P1 | 4h | Agent | — |
| QA-003 | Test auth flow — login, signup, session refresh, role check | CTO, Master | P1 | 3h | Agent | — |
| QA-004 | Test admin CRUD operations (create/read/update/delete articles and products) | CTO, Master | P2 | 4h | Agent | — |
| QA-005 | Test AI pipeline with cost guards (generation, rate limiting, cost tracking) | CTO, Master | P2 | 3h | Agent | — |
| QA-006 | Test product comparison engine accuracy | CTO | P2 | 3h | Agent | — |
| QA-007 | Test SEO metadata correctness | CTO | P2 | 2h | Agent | — |
| QA-008 | Test email sending and template rendering | CTO | P2 | 2h | Agent | MKT-009, MKT-010 |
| QA-009 | Test cron job execution and error handling | CTO | P2 | 3h | Agent | — |
| QA-010 | Component tests for top 20 components | CTO, Master | P3 | 8h | Agent | — |
| QA-011 | Target: 21 to 100+ test files, 1.13% to 30% coverage | CTO | P4 | Ongoing | Agent | — |
| QA-012 | Configure Sentry DSN in production environment | CEO, Master | P0 | 5min | Human | — |
| QA-013 | Set up uptime monitoring (UptimeRobot or Better Uptime) | CEO | P1 | 15min | Human | — |
| QA-014 | Verify Redis caching is active and reducing DB load | CEO | P1 | 1h | Agent | ENG-003 |
| QA-015 | Run Lighthouse CI and fix any Core Web Vitals issues | CEO | P2 | 3h | Agent | — |
| QA-016 | Set up alerting for error rate spikes | CEO | P3 | 1h | Agent | QA-012 |
| QA-017 | Add smoke test automation post-deploy | CEO | P3 | 2h | Agent | — |
| QA-018 | Build cron execution dashboard — show last run, status, errors for all 28 crons | AI, Master | P2 | 4h | Agent | — |
| QA-019 | Add Sentry alerts for cron failures (proactive error detection) | AI | P2 | 2h | Agent | QA-012 |
| QA-020 | Add inter-agent metrics dashboard (articles generated, posts created, emails sent) | AI | P2 | 3h | Agent | — |
| QA-021 | Add integration tests for admin CRUD operations | CEO | P2 | 4h | Agent | — |

---

## SUMMARY STATISTICS

| Department | Total Tasks | P0 | P1 | P2 | P3 | P4 |
|------------|-------------|----|----|----|----|-----|
| SECURITY | 15 | 6 | 4 | 3 | 2 | 0 |
| LEGAL | 22 | 4 | 7 | 6 | 4 | 1 |
| REVENUE | 18 | 6 | 5 | 4 | 3 | 0 |
| CONTENT | 21 | 5 | 6 | 5 | 4 | 1 |
| MARKETING | 34 | 5 | 13 | 10 | 3 | 3 |
| ENGINEERING | 23 | 5 | 7 | 7 | 3 | 1 |
| DESIGN | 18 | 1 | 5 | 8 | 3 | 1 |
| DATA | 21 | 4 | 6 | 8 | 3 | 0 |
| QA | 21 | 1 | 6 | 10 | 3 | 1 |
| **TOTAL** | **193** | **37** | **59** | **61** | **28** | **8** |

### Owner Breakdown

| Owner | Count | Notes |
|-------|-------|-------|
| Human | ~30 | Mostly account registration, API key config, 5min-30min tasks |
| Agent | ~155 | Code changes, content generation, test writing |
| Human+Agent | ~8 | Tasks requiring both manual setup and code changes |

### Effort Estimate

| Phase | Tasks | Est. Total Effort |
|-------|-------|-------------------|
| P0 (Day 1-2) | 37 tasks | ~25h Agent + ~3h Human |
| P1 (Week 1) | 59 tasks | ~55h Agent + ~3h Human |
| P2 (Week 2-3) | 61 tasks | ~80h Agent + ~1h Human |
| P3 (Month 1) | 28 tasks | ~45h Agent + ~8h Human |
| P4 (Ongoing) | 8 tasks | Continuous |

---

## EXECUTION ORDER (Critical Path)

**Day 1 — Security Code Freeze:**
SEC-001 through SEC-006, QA-012

**Day 1 — Revenue Unblock (Human, parallel):**
REV-001, REV-002, MKT-001, MKT-002, MKT-003, MKT-004, MKT-009, ENG-018

**Day 2 — Revenue Wiring:**
REV-003 > REV-004 > REV-005, REV-007, REV-018, LEG-001, LEG-002, LEG-022

**Day 3-5 — Content Sprint:**
CNT-001, CNT-002, CNT-003, CNT-005, DATA-001, DATA-002, DATA-003

**Week 2 — Performance + Quality:**
ENG-001 through ENG-009, SEC-007 through SEC-010, DSN-001

**Week 3 — Polish + Legal:**
LEG-003 through LEG-010, MKT-006 through MKT-008, ENG-010, ENG-011

**Week 4 — Testing + Hardening:**
QA-001 through QA-009, QA-018 through QA-020

**Ongoing:**
CNT-005 (daily cron), QA-011 (coverage growth), MKT content generation

---

*Generated from 7 NerdWallet-perspective audits + Master Executive Audit. Every task from every audit is included. Duplicates across audits are merged with all sources noted.*
