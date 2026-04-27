# InvestingPro × NerdWallet — Complete Launch Audit & Phased Plan

> Generated: 2026-04-27  
> Sources: CEO audit (Apr 5), 40-task roadmap (Apr 6), NerdWallet gap report (Apr 17), brainstorm.md (Apr 22), PROJECT_STATUS.md (Apr 27), 8 memory observations  
> Framework: NerdWallet as benchmark ($836M revenue, 20M monthly visitors, DR 81)

---

## Executive Summary

InvestingPro scored **4.0/10** in the Apr 5 CEO audit ("built but not activated"). Since then:
- Design: **9/10** — v3 Bold Redesign 100% shipped, PSI mobile 88, SEO 100/100
- Infrastructure: **8/10** — CSP, HSTS, ISR, PWA, 34 agents, 40 crons, RLS
- Content: **6/10** — 228 articles, 72 calcs, 101 glossary, but images missing + thin calc pages
- Revenue: **2/10** — Affiliate tracking wired but unverified; 0 subscribers; 0 AdSense; 0 live rates
- Social: **1/10** — 0 accounts created

The platform is a fully-built Ferrari. The ignition key is revenue activation.

---

## Status Legend
- ✅ DONE — shipped and live
- ⏳ PENDING — built/planned, not yet activated (user action or small eng task)
- ❌ NOT PLANNED — no spec/implementation exists yet

---

## LAYER 1: Infrastructure & Design

| Item | Status | Owner | Phase |
|---|---|---|---|
| v3 Bold Redesign (all 10 route patterns) | ✅ | — | — |
| Design tokens locked (6 colors, 3 fonts) | ✅ | — | — |
| Homepage 11 editorial sections | ✅ | — | — |
| Brand identity + "Money, Decoded." tagline | ✅ | — | — |
| Adaptive favicon + PWA icons | ✅ | — | — |
| Security headers (CSP + HSTS + 5 total) | ✅ | — | — |
| PSI mobile 88 / desktop 95 | ✅ | — | — |
| SEO 100/100 desktop + mobile | ✅ | — | — |
| PWA shell (sw.js + install flow) | ✅ | — | — |
| 34-agent autonomous system | ✅ | — | — |
| 40 GitHub Actions cron jobs | ✅ | — | — |
| Run migration 20260422_fix_affiliate_clicks_schema.sql | ⏳ | CLAUDE | P0 Phase 1 |
| Playwright visual regression CI | ⏳ | CLAUDE | P1 Phase 2 |
| Token/font linter in CI | ⏳ | CLAUDE | P1 Phase 2 |
| Rate limit public AI routes | ⏳ | CLAUDE | P1 Phase 2 |
| DOMPurify XSS audit | ⏳ | CLAUDE | P1 Phase 2 |
| Supabase JWT key rotation | ⏳ | USER | P1 Phase 2 |
| Connect InvestingPro Supabase → MCP | ⏳ | USER | P1 Phase 2 |
| patch-package for Sentry .d.ts typo | ⏳ | CLAUDE | P2 Phase 3 |
| Mobile LCP 3.3s → <2.5s (critical CSS extraction) | ⏳ | CLAUDE | P2 Phase 3 |
| PWA per-resource caching strategies | ⏳ | CLAUDE | P2 Phase 3 |
| CSP nonces (drop unsafe-inline) | ⏳ | CLAUDE | P3 Phase 4 |
| Hero constellation → CSS keyframes | ❌ | — | Trigger-only |
| Mobile app (iOS/Android) | ❌ | — | Not planned |
| Bundle analyzer sprint | ❌ | — | Phase 5 |

---

## LAYER 2: Content

| Item | Status | Owner | Phase |
|---|---|---|---|
| 228+ published articles | ✅ | — | — |
| 101 glossary terms | ✅ | — | — |
| 72 calculators | ✅ | — | — |
| 8 methodology pages | ✅ | — | — |
| 35 best-of roundups | ✅ | — | — |
| About page (founding story) | ✅ | — | — |
| Advertiser disclosure page | ✅ | — | — |
| llms.txt | ✅ | — | — |
| 18 demoted articles → edit + republish | ⏳ | CLAUDE | P0 Phase 1 |
| Corrections policy page (content) | ⏳ | CLAUDE | P0 Phase 1 |
| Fact-check policy page (content) | ⏳ | CLAUDE | P0 Phase 1 |
| About page editorial pass | ⏳ | USER→CLAUDE | P0 Phase 1 |
| Glossary 101 → 205 terms | ⏳ | CLAUDE | P1 Phase 2 |
| 24 thin calc pages (flesh-out content) | ⏳ | CLAUDE | P1 Phase 2 |
| Interlinking mesh (9+ articles) | ⏳ | CLAUDE | P1 Phase 2 |
| Grok images: process 29 approved | ⏳ | USER | P1 Phase 2 |
| Grok images: generate ~160 remaining | ⏳ | CLAUDE | P1 Phase 2 |
| Wire Grok images to 228 articles (DB) | ⏳ | CLAUDE | P1 Phase 2 |
| .article-prose opt-in classes doc | ⏳ | CLAUDE | P2 Phase 3 |
| Home loan content cluster | ❌ | — | Phase 5 |
| Original research / data studies | ❌ | — | Phase 5 |
| Video content / YouTube | ❌ | — | Phase 5 |
| Full 197-topic content queue execution | ⏳ PARTIAL | CLAUDE | P1 ongoing |

---

## LAYER 3: SEO & Discovery

| Item | Status | Owner | Phase |
|---|---|---|---|
| GSC sitemap submitted + accepted (1,518 URLs) | ✅ | — | — |
| Bing sitemap submitted | ✅ | — | — |
| IndexNow auto-ping | ✅ | — | — |
| FAQ schema on ~180/228 articles | ✅ | — | — |
| LocalBusiness JSON-LD (footer) | ✅ | — | — |
| VersusSchema JSON-LD (compare pages) | ✅ | — | — |
| Article structured data | ✅ | — | — |
| GSC 5xx + 404 cleanup | ⏳ | USER→CLAUDE | P0 Phase 1 |
| GSC stale submissions cleanup | ⏳ | USER | P0 Phase 1 |
| Manual indexing top-10 URLs in GSC | ⏳ | USER | P0 Phase 1 |
| Product schema JSON-LD on detail pages | ⏳ | CLAUDE | P0 Phase 1 |
| Google AdSense application | ⏳ | USER | P0 Phase 1 |
| hreflang in sitemap | ⏳ | CLAUDE | Phase 4 |
| Programmatic SEO: cities × categories (~550 pages) | ❌ | — | Phase 5 |
| 80K IFSC lookup pages | ❌ | — | Phase 5 |
| 100 city gold rate pages | ❌ | — | Phase 5 |
| FD rate tables (50+ banks) | ❌ | — | Phase 5 |
| Video schema | ❌ | — | Phase 5 |

---

## LAYER 4: Monetization / Revenue

| Item | Status | Owner | Phase |
|---|---|---|---|
| Cuelinks (244238) + EarnKaro (5197986) registered | ✅ | — | — |
| Affiliate tracking (non-blocking, UUID, retry) | ✅ | — | — |
| /api/out + /go/[slug] redirect tracking | ✅ | — | — |
| Apply Now CTAs on product cards | ✅ | — | — |
| Calculator marketplace cross-selling | ✅ | — | — |
| **Cuelinks/EarnKaro link wrapping on product pages** | ⏳ CRITICAL | CLAUDE | P0 Phase 1 |
| Google AdSense application | ⏳ | USER | P0 Phase 1 |
| Razorpay KYB completion | ⏳ | USER | P0 Phase 1 |
| Stripe price IDs setup | ⏳ | USER | P1 Phase 2 |
| Resend domain verification | ⏳ | USER | P0 Phase 1 |
| Email newsletter launch | ⏳ | CLAUDE | P1 Phase 2 |
| Premium/subscription tier | ❌ | — | Phase 4 |
| Home loan DSA partnerships (₹90K/conversion) | ❌ | — | Phase 5 |
| PDF download reports (calc lead magnet) | ❌ | — | Phase 4 |
| CIBIL Score Simulator | ❌ | — | Phase 5 |
| Net worth dashboard | ❌ | — | Phase 5+ |
| Budget tracker | ❌ | — | Phase 5+ |

---

## LAYER 5: Trust & E-E-A-T

| Item | Status | Owner | Phase |
|---|---|---|---|
| 8 methodology pages | ✅ | — | — |
| Advertiser disclosure page | ✅ | — | — |
| Editorial desk bylines | ✅ | — | — |
| About page (founding story) | ✅ | — | — |
| PromiseStrip (universal trust section) | ✅ | — | — |
| SEBI/RBI/IRDAI compliance blocks | ✅ | — | — |
| Corrections policy page | ⏳ | CLAUDE | P0 Phase 1 |
| Fact-check policy page | ⏳ | CLAUDE | P0 Phase 1 |
| E-E-A-T authority scoreboard (admin) | ⏳ | CLAUDE | P2 Phase 3 |
| About page editorial pass | ⏳ | USER→CLAUDE | P0 Phase 1 |
| Individual expert author bios with credentials | ❌ | — | Phase 4 |
| Original research studies cited by media | ❌ | — | Phase 5 |
| Annual content review cycle system | ❌ | — | Phase 4 |

---

## LAYER 6: Data & Products

| Item | Status | Owner | Phase |
|---|---|---|---|
| 36 credit cards (images + apply links + ratings) | ✅ | — | — |
| 962 mutual funds (565 active) | ✅ | — | — |
| Self-healing fuzzy slug resolver (CC) | ✅ | — | — |
| AMFI MF re-ingest (514 NULL-rated funds) | ⏳ | CLAUDE | P1 Phase 2 |
| IRDAI CSR + SEBI SCORES ingestion | ⏳ | CLAUDE | P2 Phase 3 |
| Extend fuzzy-slug resolver (loans/MF/insurance/demat/FD) | ⏳ | CLAUDE | P1 Phase 2 |
| **Live rates feed (0 rows in all 3 tables)** | ⏳ CRITICAL | CLAUDE | P0 Phase 1 |
| FD rate tables (50+ banks, daily) | ❌ | — | Phase 5 |
| 1,700+ credit cards | ❌ | — | Phase 5 |
| 200+ lenders | ❌ | — | Phase 5 |

---

## LAYER 7: Social & Distribution

| Item | Status | Owner | Phase |
|---|---|---|---|
| Social posting API (Twitter/LinkedIn) | ✅ | — | — |
| 6 social handles in footer (placeholder) | ✅ | — | — |
| **Create 6 actual social accounts** | ⏳ | USER | P0 Phase 1 |
| **0 newsletter subscribers** | ⏳ | — | P0+ |
| Resend domain verification | ⏳ | USER | P0 Phase 1 |
| Pinterest infographics | ❌ | — | Phase 3 |
| YouTube channel | ❌ | — | Phase 5 |
| Newsletter segmentation | ❌ | — | Phase 4 |
| Email drip sequences | ❌ | — | Phase 4 |

---

## LAYER 8: Internationalization

| Item | Status | Owner | Phase |
|---|---|---|---|
| Phase 1 routing infra | ✅ | — | — |
| Phase 2a chrome (language switcher) | ✅ | — | — |
| Phase 2b (gu+kn + self-canonical) | ✅ | — | — |
| Phase 3a glossary translations (infra) | ✅ | — | — |
| Phase 3b FAQ infra | ⏳ | CLAUDE | Phase 4 |
| Phase 3c calc labels | ⏳ | CLAUDE | Phase 4 |
| Hindi translation (top 50 articles) | ❌ | — | Phase 4 |
| Telugu / Tamil | ❌ | — | Phase 5 |
| hreflang in sitemap | ❌ | — | Phase 4 |

---

## THE PHASED PLAN

### Phase 1 — Revenue Ignition (Week 1-2, NOW)
> Goal: Turn the gas on. First ₹ earned. Search engines start crawling.

**CLAUDE can do immediately:**
- [ ] Verify + audit Cuelinks/EarnKaro link wrapping on all 36 CC pages (are apply_links actual affiliate URLs?)
- [ ] Run `20260422_fix_affiliate_clicks_schema.sql` in Supabase SQL editor
- [ ] Build Corrections policy page content
- [ ] Build Fact-check policy page content
- [ ] Edit + republish 18 demoted articles (fabricated stat removal)
- [ ] Add Product schema JSON-LD to credit card detail pages
- [ ] Check live rates cron — diagnose why live_rates / fd_rates_cache / MF NAV cache have 0 rows
- [ ] Add rate limiting middleware on public AI routes

**USER must do:**
- [ ] AdSense application (228 articles + 818 products qualifies)
- [ ] Create 6 social accounts (X, Telegram, WhatsApp Channel, LinkedIn, Pinterest, Instagram)
- [ ] Razorpay KYB verification (~1 business day)
- [ ] Resend domain verification (investingpro.in)
- [ ] GSC URL Inspection → manual indexing for top-10 URLs
- [ ] GSC cleanup: remove stale feed.xml + sitemap_index.xml submissions
- [ ] Paste GSC 5xx + 404 URL lists → CLAUDE fixes in 1 commit
- [ ] Read /about → send editorial corrections
- [ ] Verify address "Flat 4-12, Viman Nagar, Lane 10, NAD, Visakhapatnam – 530009"

**Success metrics:**
- First affiliate_clicks row in DB
- First AdSense approval
- 0 → 50 newsletter subscribers within 2 weeks of welcome flow launch
- live_rates table has data

---

### Phase 2 — Content Depth + SEO Authority (Week 2-5)
> Goal: Index every page. Fill thin content. Build E-E-A-T depth.

- [ ] Glossary expansion: 101 → 205 terms (104 new pages = 104 more indexed URLs)
- [ ] 24 thin calculator pages: AI-draft content, you review, ship (30 min × 24)
- [ ] Interlinking mesh: wire 9+ articles with missing cross-links
- [ ] AMFI MF re-ingest: algorithmic re-rating for 514 NULL-rated funds
- [ ] Extend fuzzy-slug resolver to loans / MF / insurance / demat / FD detail pages
- [ ] Generate ~160 Grok images (per content blueprint)
- [ ] Wire all 228 articles to featured_image DB column
- [ ] Token/font linter in CI
- [ ] Playwright visual regression
- [ ] Rate limit public AI routes
- [ ] DOMPurify XSS audit

**Success metrics:**
- 1,200+ indexed URLs (GSC Coverage report)
- All 228 articles have featured images
- 205 glossary terms live
- 0 Crawled-not-indexed calc pages

---

### Phase 3 — Product Depth + Calculator Gold Standard (Week 5-10)
> Goal: Catch up on product inventory. Make every calculator world-class.

- [ ] Port SIP gold-standard to EMI + FD + Tax calculators (3 hrs each)
- [ ] Compare components v3 migration (7 remaining components)
- [ ] Tool/feature pages v3: /ipo, /loans/eligibility-checker, /mutual-funds/goal-planner, /risk-profiler, /taxes, /small-business
- [ ] Auth flow design: /signup, /login, /forgot-password (v3 tokens)
- [ ] IRDAI CSR + SEBI SCORES data ingestion
- [ ] E-E-A-T authority scoreboard (admin dashboard)
- [ ] Stripe price IDs setup → wire premium tier
- [ ] Mobile LCP 3.3s → <2.5s (critical CSS extraction)
- [ ] PWA caching strategies
- [ ] .article-prose opt-in classes documentation
- [ ] Pinterest infographics (first 20, schedule weekly)

**Success metrics:**
- EMI/FD/Tax calculators match SIP quality
- 0 legacy-token pages in user-facing routes
- Mobile LCP green (<2.5s)

---

### Phase 4 — Programmatic Scale + i18n + Subscriptions (Month 2-3)
> Goal: 10x URL count. Unlock Hindi audience. First subscription revenue.

- [ ] Razorpay → wire env vars + DB migration + checkout (once KYB done)
- [ ] i18n Phase 3b (FAQ infra)
- [ ] i18n Phase 3c (calc labels)
- [ ] Hindi translation: top 50 articles (chrome-review pass from May 10 nudge)
- [ ] hreflang in sitemap (after translations exist)
- [ ] Programmatic SEO: cities × categories (~550 pages)
- [ ] Annual content review cycle system (admin tooling)
- [ ] Individual expert author bios (credentialed, not desk-only)
- [ ] Email drip sequences (onboarding + weekly newsletter)
- [ ] Newsletter segmentation (credit vs MF vs tax vs calc)
- [ ] PDF download reports (calc lead magnet with email gate)
- [ ] CSP nonces (drop unsafe-inline, push Best Practices 96→100)

**Success metrics:**
- 5,000+ indexed URLs
- First Hindi-language article indexed
- First subscription payment
- Newsletter 200+ subscribers

---

### Phase 5 — Traffic Moats + Consumer Platform (Month 3-6)
> Goal: Build defensible traffic sources NerdWallet can't copy.

- [ ] CIBIL Score Simulator (traffic driver + CC/loan funnel)
- [ ] Home loan content cluster (₹90K/conversion; DSA prep)
- [ ] Original research/data studies (1 per quarter, pitch to ET Money/Mint for backlinks)
- [ ] Award programs ("InvestingPro Best Card 2026" — ego-bait for issuer backlinks)
- [ ] 80K IFSC code lookup pages (programmatic; 1.29M monthly visit potential)
- [ ] 100 city gold rate pages (200K+ visits; GoodReturns model)
- [ ] FD rate comparison tables (50+ banks, daily scraped)
- [ ] Net worth dashboard (user accounts)
- [ ] Budget tracker (50/30/20)
- [ ] YouTube channel launch
- [ ] Mobile app evaluation (Phase 5 decision point)
- [ ] Marketplace MVP (premium prompts, agent templates)

**Success metrics:**
- 50,000+ monthly organic visitors
- ₹3.9L/mo affiliate revenue (per revenue model)
- First home loan conversion
- App store listing

---

## Quick Reference: P0 Blockers (Do These First)

| Blocker | Blocks What | Owner |
|---|---|---|
| Affiliate link wrapping audit | Revenue from 36 CC pages | CLAUDE |
| live_rates feed (0 rows) | TrustBar live data, rate pages | CLAUDE |
| Resend domain verification | Newsletter welcome flow | USER |
| Social accounts creation | Distribution + authority signals | USER |
| AdSense application | Display ad revenue | USER |
| GSC manual indexing (top 10) | Search traffic | USER |
| Product schema on CC detail pages | Rich results in Google | CLAUDE |
| 18 demoted articles | Article count + E-E-A-T | CLAUDE |

---

## NerdWallet Gap Score (Updated Apr 27)

| Dimension | Apr 5 | Apr 27 | Target |
|---|---|---|---|
| Design / UI | 3/10 | **9/10** | 9/10 ✅ |
| Infrastructure | 8/10 | **9/10** | 9/10 ✅ |
| Content quality | 3/10 | **7/10** | 8/10 |
| Content volume | 1/10 | **4/10** | 7/10 |
| SEO technical | 4/10 | **9/10** | 9/10 ✅ |
| Product database | 3/10 | **4/10** | 7/10 |
| Revenue activation | 2/10 | **3/10** | 8/10 |
| Social / distribution | 1/10 | **1/10** | 5/10 |
| E-E-A-T / trust | 5/10 | **7/10** | 8/10 |
| User retention features | 1/10 | **1/10** | 5/10 |
| **Overall** | **4.0/10** | **6.0/10** | **8.0/10** |

Design and SEO are done. Revenue and social are the urgent gaps. Product database and user retention are Phase 5 moats.

---

*Doc owner: Shiv / DigitalHustleReal*  
*Next review: May 10, 2026 (Hindi chrome-review nudge fires)*  
*File: docs/superpowers/specs/2026-04-27-nerdwallet-launch-audit.md*
