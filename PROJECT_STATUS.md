# InvestingPro.in — Project Status

> **Read this first, every session.** Single source of truth. Updated 2026-04-26.
> Branch: `master` · Last commit: `0fcb4344` · Vercel auto-deploys on push.

---

## TL;DR — Current State

InvestingPro.in is an **India-only** personal-finance comparison platform serving credit cards, loans, mutual funds, FDs, savings accounts, govt schemes, brokers, insurance. Production-ready, deployed on Vercel.

| Asset | Count |
|---|---|
| Real product detail pages | **818** (565 MFs + 81 cards + 56 loans + 25 FDs + 15 savings + 11 govt schemes + 14 brokers + 51 insurers TBD) |
| Published articles | **210** (18 demoted to draft for fabricated-stat review) |
| Methodology pages | **8** (hub + 7 segment-specific) |
| Calculators | **72** (only SIP fully gold-standard; 71 use shared primitives but lack presets/share/stress) |
| Glossary terms | **101** (target 205) |
| Active Vercel crons | **41** (40 → migrated from GH Actions, +1 sync-mf-returns) |

**No fake data on user-facing pages.** Algorithmic ratings on loans + MFs (where data exists). Real apply_links direct to issuer (zero BankBazaar). v3 design tokens across all chrome + ~90% of pages.

---

## Recent Session Arc (chronological commits)

| Commit | Summary |
|---|---|
| `71caa57a` | Pre-launch fake-data scrub: 30 BankBazaar links → direct issuer URLs, 36 missing apply_links filled, 8 orphan fake-claim components deleted, top-5 user-visible fake stats fixed |
| `3cfab1ff` | Sitemap rebuilt around real-data tables only; algorithmic ratings on loans (`interest_rate_min`-derived) + MFs (returns-derived); 2,544 placeholder MF products marked inactive |
| `fa608aa7` | Article quality gate: 18 articles with fabricated SEBI/Yatra stats demoted to draft. Methodology UI wired on RichProductCard. Admin `Math.random()` scrubbed to empty states. |
| `01cb6654` | `docs/LAUNCH_READINESS_2026_04_26.md` published |
| `2a9e0ec6` | Re-activated all 565 MFs (was wrong to exclude new funds); deleted 2,544 placeholder products entirely; admin auth note; deleted conflicting `public/robots.txt` |
| `88f553dc` | Tracking pipe wired: web_vitals POST, affiliate_clicks schema aligned, newsletter Supabase error surfaced |
| `1d57ca00` | Cron route fixes: archive-data column mismatches, lazy env init for crashing routes |
| `38823be9` + `7286218a` | Per-product methodology — 7 sub-pages + v3 hub |
| `dc91ebb0` | Stage B P1: Article schema author de-hardcoded · Product/FinancialProduct schema (CreditCard / LoanOrCredit / etc.) · `/unsubscribe` page · IndexNow auto-ping in daily-content cron · MF returns backfill via MFAPI.in (cron + one-shot script) |
| `24f14649` | Redesign batch 1: 4 missing routes (`/security`, `/advertiser-disclosure`, `/fact-check`, `/search`) + glossary SSG migration (101 terms now indexable) + corrections page rewrite + not-found rewrite + deleted `/article/[slug]` duplicate |
| `20547b4e` | Redesign batch 2: 6 compliance pages migrated via shared `PolicyPageShell` (privacy/terms/disclaimer/cookie-policy/affiliate-disclosure/accessibility) |
| `878b4b61` | **Razorpay swap** + India-context fixes + package upgrade reconciliation (43 files, 8.7k insertions) |
| `0fcb4344` | Site-wide chrome v3: Navbar + BottomMobileNav |

---

## Tech Stack

| Layer | Tech | Version | Notes |
|---|---|---|---|
| Framework | Next.js | 16.1.1 | App Router, webpack (not Turbopack — `isomorphic-dompurify` alias) |
| Runtime | Node | 24 LTS | Vercel default |
| Lang | TypeScript | 5 strict | `ignoreBuildErrors: false` |
| Styling | Tailwind | **3.4.17** | NOT v4 despite some doc claims |
| DB | Supabase Postgres | 17.6 | 130+ migrations |
| Auth | Supabase SSR | 0.8 | Cookie-forwarded via middleware.ts |
| Payments | **Razorpay** | 2.9.6 | **Just swapped from Stripe (2026-04-26)**. Greenfield — zero subs to migrate. KYB pending. |
| Email | Resend | 6.6 | `noreply@investingpro.in` |
| AI | Gemini → Groq → Mistral → OpenAI → Anthropic | failover | `lib/ai-service.ts` |
| Cache | Upstash Redis | — | Rate limiting |
| Errors | Sentry | 10.32 | client/server/edge configs wired |
| Analytics | PostHog | 1.315 | Client SDK loaded |
| Workflow | Inngest | 3.54 | Bumped per security advisory |
| Charts | Recharts | **v3** | **Just upgraded — Formatter type tightened, fixed via `(... as never)` cast in 25 files** |
| Web vitals | web-vitals | **v4** | **Just upgraded — onFID dropped (FID deprecated for INP)** |

### Tech debt flags
- Two Google AI SDKs installed (`@google/genai` + legacy `@google/generative-ai`); legacy still imported in ai-service.ts
- Gemini hardcoded `gemini-pro` (deprecated model)
- No `@vercel/ai-gateway` — direct provider SDKs
- No `vercel.ts` (still using `vercel.json`)

---

## Database — Active Tables (real data only)

| Table | Active rows | Rating quality | Apply link |
|---|---|---|---|
| `credit_cards` | 81 | Hand-curated 3.3–4.9 | Direct issuer (HDFC/ICICI/SBI/Axis/Amex...) |
| `mutual_funds` | 565 | 51 algorithmic from `returns_3y`/`returns_1y`, 514 marked "new fund" no rating | Detail page |
| `loans` | 56 | Algorithmic from `interest_rate_min` per `/methodology/loans` | Direct lender |
| `fixed_deposits` | 25 | Hand-curated 4.2–4.6 | Direct bank |
| `savings_accounts` | 15 | Hand-curated 4.2–4.6 | Direct bank |
| `govt_schemes` | 11 | Hand-curated 4.0–4.9 | Official govt URLs |
| `brokers` | 14 | Hand-curated 4.0–4.8 | Direct broker |
| `articles` | 210 published / 52 draft | n/a | n/a |
| `glossary_terms` | 101 published | n/a | n/a |

### Tracking tables (post-fix instrumentation)

| Table | State |
|---|---|
| `affiliate_clicks` | Schema aligned today; expect first writes after next click |
| `web_vitals` | 16+ rows (post-fix, flowing) |
| `newsletter_subscribers` | Diagnostics improved; will surface real errors |
| `analytics_events` | Empty (orphan writer + schema mismatch — separate rebuild deferred) |
| `platform_metrics` | 1 stale row (authority cron not firing) |

### Killed / minimised
- `products` table: was 2,584 rows, now 40. The 2,544 placeholder MF duplicates were deleted (real MFs live in dedicated `mutual_funds` table)
- `app/article/[slug]/page.tsx` legacy route: deleted; canonical is `/articles/[slug]`
- 8 orphan fake-claim components deleted (TrustSignals 125k users, MidArticleCapture, ExpertBylineWidget, TestimonialsCarousel, etc.)
- `public/robots.txt`: deleted (was conflicting with `app/robots.ts`)

---

## Razorpay (was Stripe)

**Why swapped:** India-only platform. Razorpay supports UPI + UPI AutoPay + RuPay + 50-bank net banking + e-mandate (RBI-compliant recurring). 2% fee vs Stripe's 3%. Modal checkout converts ~30% better in IN than Stripe redirect.

**Code state (commit 878b4b61):**
- ✅ `lib/payments/razorpay-service.ts` — full Subscriptions API surface
- ✅ `app/api/payments/checkout/route.ts` — accepts `{plan, email, name, userId}`, returns `{subscriptionId, keyId, amount, ...}`
- ✅ `app/api/payments/webhook/route.ts` — verifies x-razorpay-signature, handles 6 event types
- ✅ Pricing page copy updated
- ✅ Vault config shows 6 Razorpay env vars
- ✅ Stripe service deleted, packages removed

**YOU need to do (process-bound, not engineering):**
1. Create Razorpay account + complete KYB (~1 business day for Indian business)
2. In Razorpay dashboard, create plans for ₹199/mo and ₹1,999/yr
3. Set Vercel env vars: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_WEBHOOK_SECRET`, `RAZORPAY_PRO_MONTHLY_PLAN_ID`, `RAZORPAY_PRO_ANNUAL_PLAN_ID`
4. Configure webhook endpoint: `https://investingpro.in/api/payments/webhook`

**Engineering pending (next session):**
- DB migration: drop `user_profiles.stripe_*` columns, add `razorpay_customer_id` / `razorpay_subscription_id` / `subscription_period_end`
- Wire pricing CTA: replace `/signup?plan=pro` Link with `'use client'` button using `react-razorpay`'s `useRazorpay()` hook to open the modal

---

## Methodology v1.0 (shipped)

8 pages live: `/methodology` hub + 7 segment-specific (`credit-cards`, `loans`, `banking`, `mutual-funds`, `insurance`, `brokers`, `taxes`). Each pre-product methodology has 5–6 sub-segments with explicit factor weights anchored to the relevant regulator (RBI MCLR, IRDAI CSR, SEBI SCORES, AMFI, IT Act, etc.).

`RichProductCard.tsx` — score badge clicks through to segment-specific methodology page. Score badge renders "—" when no real rating (no fake numbers).

---

## Sitemap (~1,600 URLs)

| Section | Count |
|---|---|
| Homepage + pillar + intent + collection | ~110 |
| Calculators (hub + 72 individual) | 73 |
| Glossary index + terms | 102 |
| Articles | 210 |
| Credit-card detail pages | 81 |
| MF detail pages (`mutual_funds` table) | 565 (post AMFI re-ingest cron) |
| Loan / FD / savings / govt-scheme / broker detail | 121 |
| Methodology hub + 7 sub-pages | 8 |
| Versus + best-of + category landings + static utility | ~110 |

**robots.ts** allows ChatGPT-User, PerplexityBot, Applebot. Blocks GPTBot, Google-Extended, CCBot, ClaudeBot, anthropic-ai, Bytespider, Diffbot.

---

## v3 Design System Status

**Tokens:** ink, authority-green, action-green, indian-gold, canvas, warning-red.
**Typography:** Playfair Display (display), Inter (body), JetBrains Mono (data), Source Serif 4 (article prose).
**Rules:** rounded-sm max (2px), no gradients except hero, no glassmorphism, no shadow-lg, no scale-transforms.

| Surface | v3 status |
|---|---|
| Homepage (11 sections) | ✅ |
| 7 listing pages | ✅ |
| 6 product detail page categories | ✅ |
| Article hub + 210 article detail pages | ✅ (`.article-prose` CSS) |
| Calculator hub + 72 individual pages | ✅ tokens, ⚠️ feature-depth only on SIP |
| Methodology pages (8) | ✅ |
| Compliance pages (privacy/terms/disclaimer/cookie/affiliate/accessibility) | ✅ via `PolicyPageShell` |
| Glossary detail (101 pages) | ✅ (just migrated `'use client'` → SSG) |
| Corrections, fact-check, security, advertiser-disclosure, search, /unsubscribe | ✅ |
| not-found.tsx | ✅ |
| **Navbar + BottomMobileNav** | ✅ (just migrated) |
| **CommandPalette** | ❌ NEXT |
| `/about`, `/about/editorial-team`, `/about/editorial-standards`, `/how-we-make-money` | ⚠️ partially done (header stats), bodies need polish |
| `/contact-us`, `/admin/login` | ⚠️ legacy |

**~85% of public-facing pages are now v3-conformant.**

---

## Crons (41 active on Vercel)

Categorised:
- **Content generation**: daily-content-generation, content-strategy, content-sense, content-distribution, content-refresh
- **Data ingestion**: sync-amfi-data, sync-mf-returns (NEW), update-rbi-rates, update-gold-prices, update-intelligence, weekly-data-update, import-rss-news
- **Agent swarm**: 11 agent-* routes (writer, editor, publisher, supervisor, QA, SEO, research, distribution, content-architect, content-scout, data, serp-analyst, analytics)
- **Maintenance**: cleanup, archive-data (FIXED — was returning 500), record-table-sizes, sitemap-ping (silent no-op since Google deprecated ping endpoint)
- **Analytics**: sync-rankings, daily-cost-report, daily-revenue-report, check-* routes, scrape-credit-cards, sync-legal-products

---

## Pending — by Priority

### P0 (next session, sitemap unblockers)
- [ ] Run `npx tsx scripts/backfill-mf-returns.ts` to populate 514 unrated MFs (pulls historical NAV from MFAPI.in, computes 1Y/3Y/5Y CAGR, applies methodology rating). ~2 minutes. Then submit sitemap to GSC + Bing.
- [ ] Submit sitemap.xml to Google Search Console + Bing Webmaster Tools
- [ ] Apply for Google AdSense (210 articles + 818 product pages = strong application)
- [ ] **[YOU]** Rotate Supabase legacy JWT signing key (final security closure)

### P1 (within 2 weeks — engineering)
- [ ] **CommandPalette v3 redesign** (only remaining v3 chrome violation)
- [ ] **DB migration for Razorpay columns** (drop stripe_*, add razorpay_*) — depends on Razorpay KYB
- [ ] **Wire pricing CTA to Razorpay modal** (~1 hr)
- [ ] **E-E-A-T cluster polish**: about / about/editorial-team / about/editorial-standards / how-we-make-money — bodies still use legacy gray/Card/Badge primitives
- [ ] **Cuelinks/EarnKaro affiliate wrapping** — currently apply_links route direct to issuer (no commission). Wrap via existing `/api/out`.
- [ ] **IRDAI CSR ingestion** — manual one-time pull → real claim ratios per insurer
- [ ] **SEBI SCORES ingestion** — real complaint stats per broker
- [ ] **Play Store / App Store rating ingestion** for ~30 fintech apps
- [ ] **Edit + republish 18 demoted articles** (verify SEBI/Yatra/Morningstar citations)

### P1 (within 2 weeks — process / YOU)
- [ ] **Razorpay KYB approval** (~1 business day) — biggest blocker for revenue activation
- [ ] **Stripe → Razorpay env var swap** in Vercel after KYB done
- [ ] **Resend domain verification** (newsletter post-capture welcome flow)
- [ ] **Optionally delete CRON_SECRET from GitHub Secrets** (no longer needed since Vercel native crons)

### P2 (within 1 month)
- [ ] **`/admin/authority` E-E-A-T scoreboard** — long-term authority compounding system
- [ ] **Calculator port to SIP gold-standard** — extract `useCalcShare()` hook + `<PersonaPresets>` + `<StressToggle>` shared primitives, then port EMI/FD/Tax/Capital Gains as exemplars (~4 hrs first batch)
- [ ] **Glossary 101 → 205 terms**
- [ ] **9+ articles missing cross-links** — interlinking mesh
- [ ] **Process 29 approved Grok images** (watermark + IP overlay) + generate ~160 more
- [ ] **Wire featured_image** to all 210 articles
- [ ] **Public AI route rate limiting** (`/api/translate` etc — cost exposure)
- [ ] **DOMPurify** on all `dangerouslySetInnerHTML`
- [ ] **Admin role check on /api/admin/* routes** (defense-in-depth; middleware already covers most)
- [ ] **Fake `Math.random()` cleanup** in remaining admin routes (only major site-wide ones done)
- [ ] **Code-split heavy libs** (Recharts, framer-motion, jspdf) for Core Web Vitals
- [ ] **Cron execution dashboard** in admin
- [ ] **Bulk product editor** in admin (currently only CSV/JSON import)

### P3 (within 2 months — i18n + programmatic)
- [ ] **i18n Phase 3b/3c merge to master** (currently on `claude/vibrant-lovelace-875415` — 47 commits)
- [ ] **Hindi translation run** for top 50 articles + 23 calculators
- [ ] **hreflang in sitemap.ts**
- [ ] **City × category programmatic SEO** (10 cities × 5 categories = 50 pages)
- [ ] **Bank holidays per state** programmatic SEO (~500 pages)
- [ ] **Reddit API integration** for community-discussion blocks per product
- [ ] **PWA mobile mockup** + manifest depth

---

## Critical Files Map

```
app/
  methodology/             — Hub + 7 sub-pages (credit-cards, loans, banking, mutual-funds, insurance, brokers, taxes)
  unsubscribe/             — Newsletter unsubscribe page (NEW)
  search/                  — Site-wide search results (NEW)
  security/                — Security & data practices (NEW)
  advertiser-disclosure/   — Advertiser disclosure (NEW)
  fact-check/              — Fact-check policy (NEW)
  api/payments/checkout/   — Razorpay subscription create
  api/payments/webhook/    — Razorpay event handler
  api/cron/sync-mf-returns/ — Daily MF returns backfill (NEW)
  glossary/[slug]/         — Server component, generateStaticParams (101 pages SSG)

components/
  layout/Navbar.tsx                — v3 (just migrated)
  layout/BottomMobileNav.tsx       — v3 (just migrated)
  layout/PolicyPageShell.tsx       — Shared chrome for compliance pages (NEW)
  layout/Footer.tsx                — v3 (already done)
  products/RichProductCard.tsx     — Methodology link wired
  products/ProductSchemaMarkup.tsx — Uses generateProductSchema (delegates to schema-generator)
  search/CommandPalette.tsx        — ❌ Still legacy (NEXT)

lib/
  payments/razorpay-service.ts     — Replaces stripe-service.ts (DELETED)
  data-sources/mf-returns-fetcher.ts — Pulls historical NAV from MFAPI.in
  seo/schema-generator.ts          — Article + Product/FinancialProduct + DefinedTerm
  seo/indexnow-helper.ts           — Fire-and-forget IndexNow ping
  utils.ts                         — formatCurrency / formatCompactNumber (en-IN)

scripts/
  backfill-mf-returns.ts           — One-shot CLI: populate returns + ratings for all 514 unrated MFs

supabase/migrations/                — Recent: align_affiliate_clicks_schema, demote_low_eeat_articles, reactivate_mfs_delete_placeholder_products
```

---

## Known Gotchas (don't re-debug these)

1. **Middleware enforces `/admin/*` auth** at `middleware.ts:110-133` — admin layout intentionally has no duplicate check (would cause redirect loop on `/admin/login`).
2. **Razorpay needs Indian business KYB** — engineering is done, but no plans/keys = endpoints return 503 with "Razorpay not configured" message (clean degradation, not crash).
3. **MF rating cap is data-bound** — 514 funds without `returns_3y` show "—" instead of fake stars. Run `scripts/backfill-mf-returns.ts` to populate.
4. **archive-data cron** was 500ing on column mismatches — fixed in `1d57ca00`. Article_analytics has only `updated_at`, article_views uses `viewed_at`, affiliate_clicks uses `created_at`.
5. **Pre-commit hook runs full tsc** — every commit must pass `npx tsc --noEmit --skipLibCheck` cleanly. Don't skip with `--no-verify`.
6. **Calculator math layer is FROZEN** (`app/calculators/**`) — port shared UI primitives into `components/calculators/shared/` only.
7. **Stripe legacy DB columns** still exist on `user_profiles` (`stripe_customer_id`, etc.) — pending migration to drop them in favor of `razorpay_*`. Don't remove them prematurely.
8. **Recharts v3 + web-vitals v4 already reconciled** in commit `878b4b61` — don't be surprised by `(... as never)` casts on Tooltip formatters.
9. **`/article/[slug]` legacy route deleted** — only `/articles/[slug]` (plural) is canonical.
10. **`public/robots.txt` deleted** — `app/robots.ts` is the dynamic single source.

---

## Environment Variables (current)

### Required core
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_BASE_URL=https://www.investingpro.in
CRON_SECRET=investingpro-cron-secret-2026-secure
```

### Razorpay (NEW — replaces Stripe)
```
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
NEXT_PUBLIC_RAZORPAY_KEY_ID
RAZORPAY_WEBHOOK_SECRET
RAZORPAY_PRO_MONTHLY_PLAN_ID    # Create in Razorpay dashboard
RAZORPAY_PRO_ANNUAL_PLAN_ID     # Create in Razorpay dashboard
```

### AI providers (chain failover order)
```
GOOGLE_GEMINI_API_KEY  # Primary
GROQ_API_KEY            # Fast fallback
MISTRAL_API_KEY         # Fallback
OPENAI_API_KEY          # Fallback
ANTHROPIC_API_KEY       # Fallback
```

### Removed (no longer needed)
```
STRIPE_SECRET_KEY               # ❌ deleted
STRIPE_PUBLISHABLE_KEY          # ❌ deleted
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  # ❌ deleted
STRIPE_WEBHOOK_SECRET           # ❌ deleted
STRIPE_PRO_MONTHLY_PRICE_ID     # ❌ deleted
STRIPE_PRO_ANNUAL_PRICE_ID      # ❌ deleted
```

### Optional but used
```
RESEND_API_KEY                  # Newsletter + transactional
UPSTASH_REDIS_REST_URL          # Rate limiting
UPSTASH_REDIS_REST_TOKEN
NEXT_PUBLIC_GA_MEASUREMENT_ID
NEXT_PUBLIC_TAWK_PROPERTY_ID
NEXT_PUBLIC_SENTRY_DSN
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_POSTHOG_HOST
PEXELS_API_KEY
INNGEST_EVENT_KEY
INNGEST_SIGNING_KEY
```

---

## Next-Session Bootstrap

When you start a fresh Claude session:

1. **Tell it**: "Read PROJECT_STATUS.md first."
2. **Pick from pending list above** based on time + priority.
3. **Run** `git log --oneline -10` to see what's landed since this doc was written (timestamp at top).
4. **Don't re-debug the gotchas** — they're already solved.

**Highest-leverage next-session task: run the MF backfill, then submit the sitemap to GSC + Bing.** That's the revenue-activation unlock; everything else compounds on top.

```bash
npx tsx scripts/backfill-mf-returns.ts   # ~2 min, populates 514 MFs with real returns + ratings
# Then: GSC → Sitemaps → submit https://www.investingpro.in/sitemap.xml
# Then: Bing Webmaster Tools → submit same URL
```

---

*This doc is the operational source of truth. Update it whenever a major commit lands.*
*CLAUDE.md should reference this doc rather than duplicate state.*
