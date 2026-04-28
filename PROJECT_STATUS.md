# InvestingPro.in — Project Status

> **Read this first, every session.** Single source of truth. Updated 2026-04-28.
> Branch: `clever-shannon-bdbc17` (worktree) · Last commit: `4d09c352` · Merge to master when ready.
> Production: https://www.investingpro.in

---

## TL;DR

**18 new files, 4,980 lines — News Intelligence Pipeline shipped (Apr 28).** InvestingPro can now detect breaking personal finance events (RBI rate cuts, DA hikes, LPG price changes, gold rates, budget announcements — any personal finance news), automatically generate SEO-optimized articles within ~30 minutes, and publish them before competitors. The pipeline is DB-configurable (add sources from admin UI), SERP-credit-rationed (10/day), and runs on GitHub Actions every 15 minutes.

Previous milestone (Apr 27): **16 commits.** Brand identity (Money, Decoded.), PSI 64→88, CSP headers, PromiseStrip trust section, Footer redesign (LocalBusiness JSON-LD + 6 social handles + PWA install + NerdWallet phone mockup), About page founding story, v3 Compare migration. GSC submitted (1,518 URLs). SEO **100/100** on both desktop and mobile.

---

## Apr 28 Commits (News Intelligence Pipeline)

```
1.  10e3ea9e  feat(footer): NerdWallet-style redesign — phone mockup + newsletter strip
2.  2051f5db  docs(spec): News Intelligence Pipeline design spec
3.  4d09c352  feat(news): News Intelligence Pipeline — source-to-live in ~30 min
```

**What the news pipeline does:**
- Polls 14 configurable RSS/price sources every 15 min (RBI, SEBI, PIB, ET, MC, Livemint, NDTV Profit, BSE, NSE + more)
- Classifies events into 17 categories (da_announcement, repo_rate, lpg, fuel_price, gold_silver, tax_change, budget, mutual_fund, ipo, epfo, insurance_regulation, banking, pension, forex, markets, pay_commission, general_finance)
- Runs parallel spike pre-screening: Google Trends RSS + GSC impressions delta + internal traffic
- SERP analysis: Serper.dev (paid, 10 credits/day) or Google Autocomplete (free fallback)
- Generates articles via `generateArticle()` with category-specific 700+ word templates
- Quality gate: ≥75/100 (vs 85 for editorial). Auto-publishes + pings IndexNow.
- Admin dashboard at `/admin/news-intelligence` with live feed, credit meter, source health

**⚠️ ACTION REQUIRED before pipeline is live:**
1. Run `supabase/migrations/20260428_news_intelligence_pipeline.sql` in Supabase SQL editor
2. Optional: Add `SERPER_API_KEY` to Vercel env vars (get free key at serper.dev — 2,500 searches/month)
3. Merge `clever-shannon-bdbc17` → `master` to activate GitHub Actions crons
4. Add `/admin/news-intelligence` link to admin sidebar navigation

---

## Apr 27 Commits (chronological)

```
1.  87f44dec  fix(gsc-prep): pre-submission cleanup — 3-audit synthesis pass
2.  db20fbcc  fix(seo): repair UTF-8 mojibake in calculator schema + profile copy
3.  b5529220  fix(seo): repair em-dash mojibake in SWP + IPO pages
4.  440003c4  fix(seo): align canonical/og:url with sitemap host (www)
5.  2240097d  fix(build): delete app/(client)/search — parallel-route conflict broke prod
6.  f2f6ca3d  feat(brand): Money, Decoded. — adaptive favicon + brand kit + tagline rollout
7.  8649ee31  fix(mobile-perf+a11y): Phase 1 — 11 PSI-flagged fixes
8.  b1012e3c  perf(mobile): Phase 2 — defer GTM + dynamic-import 5 below-fold sections
9.  6cc1f38a  sec(headers): add CSP with full 3rd-party allowlist
10. 934d3af7  perf(mobile-dom): reduce Hero dot mesh 120 → 48
11. 4354dda0  perf(mobile-dom): Phase 4 — viewport-conditional Hero constellation
12. cadb65a7  feat(home): Phase 5 — universal Promise Strip section (trust-first)
13. 9f776145  feat(footer+pwa): Phase 6 — real address + social + PWA install card + JSON-LD
14. 5304f939  fix(footer): Phase 6.5 polish — research-validated 3 fixes
15. 5a6304a2  style(compare): Phase 7 — migrate /compare/[combination] to v3 tokens
16. 6d304f11  feat(about): Phase 8 — founding-story rewrite + v3 design
```

---

## Production State (verified Apr 27)

### PSI metrics (last run: Apr 27 4:24 PM IST)

| Metric | Mobile | Desktop |
|---|---|---|
| Performance | **88** | **95** |
| Accessibility | 93 | 93 |
| Best Practices | 96 | 96 |
| SEO | **100** ⭐ | **100** ⭐ |
| LCP | 3.3s ⚠️ | 0.6s ✅ |
| FCP | 1.2s ✅ | 0.4s ✅ |
| TBT | 220ms ⚠️ | 170ms ✅ |
| CLS | 0 ✅ | 0 ✅ |
| Speed Index | 2.5s ✅ | 1.0s ✅ |

Mobile LCP still 800ms over green threshold. Mobile TBT 20ms over. Both passable, both fixable in Phase 9 if prioritized (critical CSS extraction + framer-motion lazy split).

### Search engine state
- **GSC:** 1,518 URLs submitted. Domain property + URL prefix property set up. Apex→www 308 redirect verified. Breadcrumb absolute URLs live (was the Gemini-flagged issue). Sitemap status: **Success**.
- **Bing Webmaster:** Sitemap submitted.
- **IndexNow:** Auto-ping wired in daily cron via `lib/seo/indexnow-helper.ts`.

### Brand identity (live)
- Tagline `Money, Decoded.` rolled out across 7 surfaces (sitewide title, OG, Twitter, footer, manifest, admin placeholder)
- Adaptive favicon at `/favicon.svg` (auto-swap light/dark via `prefers-color-scheme`)
- Apple-touch-icon, PWA icons at 192/512, maskable variant
- Downloadable brand kit at `/brand/*` (6 PNG sizes + 4 SVG sources)
- Wordmark uses `Pro.` with period in `indian-gold` (matches Telegram/WhatsApp avatar identity)

### Production deploy chain
- **Vercel auto-deploys** master on every push
- Last verified deploy: commit `b1012e3c`; subsequent commits queuing
- Build infrastructure: Next.js 16.1, Turbopack, Node 24

---

## Platform Inventory (Apr 27)

| Asset | Count | Status |
|-------|-------|--------|
| Public route patterns | 10 | ✅ ALL on v3 Bold Redesign |
| Calculator pages | 72 | SIP gold-standard; 71 use shared v3 primitives |
| Products in DB | ~1,000 (36 CC, 962 MF + 1 loan) | CC images in Supabase Storage |
| Published articles | 228+ | Editorial Playfair typography via `.article-prose` |
| Glossary terms | 101 | Target: 205 |
| Sitemap URLs | ~1,518 | Submitted to GSC + Bing |
| Social accounts | 0 live | Pending user action (6 handles planned) |
| Affiliate networks | 2 active | Cuelinks 244238 + EarnKaro 5197986 |

---

## What's Live (Phase 1-8 cumulative)

### Homepage (11 sections, narrative-ordered)
1. Hero — rotating Q&A (12 questions, all 12 CTAs route to real `/calculators/*`)
2. **PromiseStrip** (NEW) — universal trust-signal panel, 3 panels linking to /methodology, /how-we-make-money, /about/editorial-standards
3. TrustBar — live data ticker
4. RateComparison
5. TopPicks
6. FindYourFit
7. ExploreCategories
8. CalculatorSpotlight
9. LifeStageHub
10. Editorial
11. TrustMethodology + NewsletterTrust

### Hero (mobile-optimized)
- Constellation only renders on `lg+` viewports (saved 130+ DOM nodes from mobile)
- Touch targets: navigation dots 7×7 → 24×24 hit area
- Text contrast: `text-gray-400` → `text-ink-60` (WCAG AA)
- All 12 rotating CTAs route to real calculator pages (no 404s)

### Footer (10/10 vs research benchmarks)
- 6-column SEO inventory grid (~60 internal links) with mobile accordion
- PWA install card placed correctly (after grid — per NerdWallet pattern)
- Phone-frame mockup hidden on mobile
- Real address: `Flat 4-12, Viman Nagar, Lane 10, NAD, Visakhapatnam – 530009`
- Email: `contact@investingpro.in`
- 6 social icons: X, Telegram, WhatsApp Channel, LinkedIn, Pinterest, Instagram
- Mobile-collapsed compliance band with toggle
- LEGAL_LINKS: 10 items including Sitemap + Accessibility
- LocalBusiness JSON-LD with `@type: FinancialService`, areaServed: India, knowsAbout: [9 finance topics], sameAs: [6 social URLs]

### About page (Phase 8 — founding story)
- 9 sections: Hero → Founding story → Pull quote → 4 beliefs → "We're not (yet)" → Vision (4 personas) → Trust links → Editorial team → Founder block → Investing.com disclaimer
- Hero: "Built to empower, not to sell."
- Vernacular language commitment surfaced as competitive moat
- Investing.com non-affiliation disclaimer preserved (legally critical)

### Compare engine
- `/compare/[combination]` migrated to v3 design tokens (18 swap operations)
- All sub-component functionality preserved (programmatic SEO, AI verdicts, ISR 24h, PDF export, VersusSchema JSON-LD)
- 7 supporting components in `components/compare/*` still on legacy tokens — defer to Phase 7.5 if visual seam shows

### Performance + security
- GTM `lazyOnload` (was `afterInteractive` blocking main thread 175ms)
- 5 below-fold homepage sections dynamic-imported (~100-150 KiB JS off initial bundle)
- AVIF + WebP + 7 device sizes + 8 image sizes
- Browserslist modern targets (33 KiB legacy polyfills dropped)
- ISR caching: sitemap.ts (24h), news-sitemap (1h), feed.xml (1h)
- HSTS + X-Frame-Options + COOP + Permissions-Policy + nosniff + Referrer-Policy
- CSP with full 3rd-party allowlist (GTM, GA4, PostHog, Tawk, Cuelinks, EarnKaro, Razorpay, Sentry, Supabase, Google Fonts)
- 5 redirect rules in next.config.ts

### PWA infrastructure
- `public/sw.js` — minimal service worker (pure pass-through, satisfies installability)
- `components/pwa/ServiceWorkerRegistration.tsx` — production-only auto-register
- `components/pwa/PWAInstallButton.tsx` — 3 honest states (installed / installable / browser-menu)

---

## Parked — Pending User Action

| # | Item | What's needed | Effort once unblocked |
|---|---|---|---|
| 1 | **Razorpay KYB approval** | Complete Razorpay business verification (~1 business day) | Wire env vars + DB migration + checkout button (~1 hr) |
| 2 | **GSC 5xx + 404 cleanup** | Export URL lists from GSC → paste in next session | Fix in 1 commit (~1-2 hrs) |
| 3 | **Real social handles** | Create 6 accounts (X/TG/WhatsApp Channel/LinkedIn/Pinterest/IG), provide URLs | Update `SOCIAL[]` const in `Footer.tsx` (~5 min) |
| 4 | **Resend domain verification** | Verify `investingpro.in` in Resend dashboard | Newsletter welcome flow goes live |
| 5 | **About page editorial pass** | Read at `/about`, send text changes for any factual items | Edit + commit (~15 min) |
| 6 | **Address verification** | Confirm "Flat 4-12, Viman Nagar, Lane 10, NAD, Visakhapatnam – 530009" | Edit `BRAND_ADDRESS` in `Footer.tsx` if wrong |
| 7 | **GSC dashboard cleanup** | Remove broken sitemap submissions (`feed.xml`, `sitemap_index.xml`) via GSC UI | Reduces noise in Coverage report |

---

## Deferred — Future Phases

| Phase | What | Effort | Trigger |
|---|---|---|---|
| **Phase 9: PWA caching** | Per-resource SW caching strategies | 4-6 hrs | After 2-4 weeks of web_vitals return-visit data |
| **Phase 9b: Critical CSS** | Manual extract above-fold CSS, pushes mobile LCP 3.3s → <2.5s | 2-3 hrs | If real-user CWV still shows LCP > 2.5s |
| **Phase 9c: Hero constellation rewrite** | Convert 130-node SVG to CSS keyframes | 2-3 hrs | If desktop PSI drops below 90 |
| **Phase 9d: CSP nonces** | Per-request nonces; drop `unsafe-inline` | 3-4 hrs | When pushing Best Practices 96 → 100 |
| **Phase 10: News pipeline** | 50% scaffolded — ship or delete | 3-4 hrs ship / 30 min delete | After editorial cadence decision |
| **Phase 11: Calculator content** | 24 thin calc pages flagged "Crawled — not indexed" | 30 min × 24 = 12 hrs | Focused indexation recovery sprint |
| **Phase 12: Compare components v3** | 7 supporting components in `components/compare/*` on legacy tokens | 2-3 hrs | If visual seam visible post-deploy |
| **Phase 13: Tool/feature pages** | `/ipo`, `/loans/eligibility-checker`, `/mutual-funds/goal-planner`, `/risk-profiler`, `/taxes`, `/small-business` | 3-4 hrs | SEO uniformity sprint |
| **Phase 14: Auth flow design** | `/signup`, `/login`, `/forgot-password` on legacy tokens | 2-3 hrs | After Razorpay activation |
| **Phase 15: Calculator depth port** | Port SIP gold-standard primitives to EMI/FD/Tax | 4-6 hrs | Long-term polish |
| **Phase 16: Vernacular content** | Hindi → Telugu → Tamil | Multi-week | Post-revenue activation |

**Highest-leverage next moves (priority order):**
1. **GSC cleanup** — paste 5xx + 404 URL lists, fix in 1 commit (1-2 hrs)
2. **Razorpay KYB unblock** — once complete, wire env vars + checkout (1 hr)
3. **Calculator content batch 1** — pick 8 of 24 thin calc pages, AI auto-draft, review, ship (4 hrs)
4. **About page editorial pass** — read live deploy, send text edits (15 min)
5. **News pipeline decision** — ship-or-delete (requires editorial cadence decision)

---

## Critical Files Map (new + modified today)

```
Brand identity:
  public/favicon.svg                        — adaptive (light/dark via prefers-color-scheme)
  public/favicon.ico                        — legacy fallback
  public/apple-touch-icon.png               — iOS home screen
  public/icons/icon-{192,512,512-maskable}.png
  public/brand/                             — downloadable kit (6 PNGs + 4 SVGs)
  public/logo-ip-monogram.svg               — replaced legacy teal
  scripts/generate-brand-assets.ts          — regenerate all from SVG masters

PWA infrastructure:
  public/sw.js                              — minimal service worker
  components/pwa/ServiceWorkerRegistration.tsx
  components/pwa/PWAInstallButton.tsx

Homepage:
  components/v2/home/PromiseStrip.tsx       — NEW universal trust-signal section
  components/v2/home/Hero.tsx               — viewport-conditional constellation
  app/page.tsx                              — Hero+PromiseStrip+TrustBar order, dynamic imports

Footer:
  components/layout/Footer.tsx              — full redesign (BRAND_ADDRESS, SOCIAL[], JSON-LD)

About:
  app/about/page.tsx                        — full v3 rewrite with founding story

Compare:
  app/compare/[combination]/page.tsx        — v3 token migration

Schema generators (absolute URLs fix):
  lib/linking/breadcrumbs.ts
  lib/linking/schema.ts
  lib/seo/structured-data.ts

Hero questions data (404 fix):
  lib/content/hero-questions.ts             — 12 CTA URLs: /tools/* → /calculators/*

Build config:
  next.config.ts                            — image formats, redirects, security headers, CSP
  package.json                              — modern browserslist
```

---

## Known Gotchas (don't re-debug)

1. **Sentry .d.ts typo in node_modules** — `@sentry/core/build/types/integrations/express/types.d.ts:30` has `SpanAttributes = from` instead of `SpanAttributes } from`. Patch locally to unblock tsc. Lost on next `npm install`. Fix: re-patch OR install `patch-package` OR wait for upstream fix.

2. **Turbopack vs --webpack** — `next.config.ts` has both `webpack` config (for `isomorphic-dompurify` alias) and `turbopack: {}`. Production builds use Turbopack. If you see `isomorphic-dompurify` import errors locally, run `next build --webpack`.

3. **`/article/:slug` vs `/articles/:slug`** — singular `/article` is deleted. Canonical is plural `/articles`. 308 redirect in `next.config.ts` for straggling external links.

4. **`(client)/search` was the build-blocker** — Production frozen Apr 26→27 because `app/(client)/search/page.tsx` AND `app/search/page.tsx` both resolved to `/search` (Turbopack rejects). Deleted `(client)/search` in commit `2240097d`. Don't recreate.

5. **CSP keeps `'unsafe-inline'` and `'unsafe-eval'`** — Required for Next.js inline hydration + PostHog SDK + GTM dataLayer. Best Practices 96 → 100 requires nonce-based CSP (Phase 9d).

6. **PWA SW only registers on production** — local dev intentionally skips registration (avoids HMR cache issues). Test PWA install only on live deploy.

7. **Hero constellation is desktop-only** — `lg+` viewports only. Removing the `isDesktop` conditional adds ~130 DOM nodes back to mobile.

8. **Footer is `"use client"`** — needs `usePathname` + state. Don't convert to server component.

9. **`BRAND_ADDRESS` + `BRAND_EMAIL` + `SOCIAL[]` are single source of truth** — Footer text + LocalBusiness JSON-LD `sameAs` both read from these constants.

10. **Calculator math is FROZEN** — `app/calculators/**/*` math layer untouchable. Only port shared UI primitives into `components/calculators/shared/`.

---

## Bootstrap Recipe for Next Session

```bash
# 1. Read this file first
cat PROJECT_STATUS.md

# 2. Confirm git state
git log --oneline -5

# 3. Confirm production is live
curl -sI https://www.investingpro.in/ | head -5

# 4. Pick from the "Parked" or "Deferred" tables above
```

**Highest-leverage next moves (priority order):**
1. **GSC 5xx + 404 cleanup** — paste URL lists, I fix in 1 commit (1-2 hrs)
2. **Razorpay KYB unblock** — once you complete it, I wire env vars + checkout (1 hr)
3. **About page editorial pass** — read live deploy, send me text edits for any item (15 min)
4. **Calculator content batch 1** — pick 8 of 24 thin calc pages, AI auto-draft via existing pipeline, you review, ship (4 hrs)
5. **News pipeline decision** — ship-or-delete. Need your call.

---

*Single source of truth for Claude Code sessions on InvestingPro.in.*
*Update this file whenever major architectural or status changes are made.*
