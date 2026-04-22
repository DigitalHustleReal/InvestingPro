# InvestingPro — Single Source of Truth

> **Last updated:** 2026-04-21
> **Status:** v3 Bold Redesign 30% applied, drifting. This doc halts drift.
> **Rule:** Every session starts here. Every PR lists which item it closes.

---

## 1. Approved Design Language (LOCKED — no more re-debate)

> "Editorially Bold, Regulatorily Transparent, Unapologetically Indian"

### Typography
| Use | Font | Weight |
|---|---|---|
| Heroes, headlines, verdicts | **Playfair Display** | 900 (letter-spacing: -2px) |
| Body, UI, buttons | **Inter** | 400–700 |
| Rates, scores, dates, badges | **JetBrains Mono** | 400–500 (uppercase, tracking-wider) |

### Colors
| Token | Hex | Use |
|---|---|---|
| `ink` | `#0A1F14` | Primary text, dark sections |
| `authority-green` | `#166534` | Brand, trust signals (structural only) |
| `action-green` | `#16A34A` | CTAs, positive data |
| `indian-gold` | `#D97706` | **Emphasis, accents, methodology links, premium** |
| `canvas` | `#FAFAF9` | Page background |
| `warning-red` | `#DC2626` | Errors, negatives |

**Hard rules:**
- No blue, no purple, no pink anywhere
- No gradients except hero sections
- Cards use 0px or 2px radius (sharp = authority)
- **Emphasis = indian-gold** (not green — current bug)
- Serif = opinion, Monospace = data, Sans = UI

### Signature Elements
1. **Verdict Cards** — Playfair headline + opinion + "Methodology disclosed →" gold link
2. **Data Strips** — Ink header + monospace values
3. **Score Badges** — Square, large mono number, weighted criteria link
4. **Section Labels** — JetBrains Mono, 11px, uppercase, tracking 3px, **gold**

---

## 2. Current State — Page by Page

### ✅ Built with v3 Bold Redesign (correct)
| Page/Component | File | Notes |
|---|---|---|
| Global Navbar | `components/v2/layout/Navbar.tsx` | Ink bg, gold underline |
| Trust Rail | `components/v2/layout/TrustRail.tsx` | Ink strip below nav |
| Global Footer | `components/layout/Footer.tsx` | Ink bg (but gold titles broken — see §4) |
| Mobile Bottom Nav | `components/v2/layout/MobileNav.tsx` | 64px, 22px icons |
| Mega Menu | `components/v2/layout/MegaMenu.tsx` | 3-col, v3 tokens |
| Homepage Hero | `components/v2/home/Hero.tsx` | Layout right, but **H1 uses Inter not Playfair** |

### ⚠️ Drifted / Partial (needs v3 rework)
| Page/Component | File | Drift |
|---|---|---|
| Homepage `RateComparison` | `components/v2/home/RateComparison.tsx` | Plain Inter H2, green italic |
| Homepage `MarketPulse` | `components/v2/home/MarketPulse.tsx` | Plain Inter, green italic |
| Homepage `TopPicks` | `components/v2/home/TopPicks.tsx` | Plain Inter, green italic |
| Homepage `CalculatorSpotlight` | `components/v2/home/CalculatorSpotlight.tsx` | No Playfair, green italic |
| Homepage `ExploreCategories` | `components/v2/home/ExploreCategories.tsx` | Green italic emphasis |
| Homepage `TrustStats` | `components/v2/home/TrustStats.tsx` | Green italic |
| Homepage `Editorial` | `components/v2/home/Editorial.tsx` | Minor — mostly correct |
| Homepage `MoreResources` | `components/v2/home/MoreResources.tsx` | Accordion→tabs done, colors ok |
| Homepage `NewsletterTrust` | `components/v2/home/NewsletterTrust.tsx` | Green italic |

### ❌ Not started — Still in NerdWallet-parity flat style
| Page | Route | Status |
|---|---|---|
| Credit Cards Listing | `/credit-cards` | H1 Inter, no Playfair, no ink/gold |
| Loans Listing | `/loans` | Same |
| Mutual Funds Listing | `/mutual-funds` | Same |
| Demat Accounts Listing | `/demat-accounts` | Same |
| Fixed Deposits Listing | `/fixed-deposits` | Same |
| Insurance Listing | `/insurance` | Same |
| Banking Listing | `/banking` | Same |
| Article Detail | `/articles/[slug]` | Plain NW article layout |
| Category Listing | `/category/[slug]` | Plain |
| Calculator Hub | `/calculators` | Grid exists, no v3 tokens |
| Individual Calculators (75) | `/calculators/*` | Plain H1, centered, flat |
| Glossary | `/glossary` + 101 term pages | Not styled |
| Best-of roundups (35) | `/{cat}/best/{sub}` | NW-parity only |
| About / Editorial pages | `/about/*` | Not styled |
| Auth pages (login/signup) | `/login`, `/signup` | Not touched |
| Admin CMS (100+ pages) | `/admin/*` | Separate theme, out of scope |

---

## 3. Tasks by Role

### 🎯 CEO (Shiv) — Decisions only
- [ ] **Decide Option A/B/C** — do we finish v3 Bold Redesign OR revert to NW-clean? (See §5)
- [ ] **Decide PWA mobile mockup** — build now or P2?
- [ ] **Decide italic emphasis color** — confirm it's gold (per brainstorm) not green
- [ ] **Revenue focus** — 2-week freeze on features, focus on GSC + AdSense + affiliate activation
- [ ] **Write weekly review** — what shipped, what moved numbers

### 🏗️ CTO (Claude/Shiv together) — Architecture
- [ ] **Fix `surface-ink` / `surface-canvas` CSS bugs** (`app/globals.css:487, 508`) — remove `:is(h1..h6..)` blanket overrides
- [ ] **Collapse `globals.css` from 525 → ~150 lines** — remove v1/v2 aliases, deduplicate tokens
- [ ] **Clean `tailwind.config.ts`** — remove duplicate `indian-gold`/`canvas` hex declarations, kill `wt-*` aliases, fix `text.primary` dark-assumption
- [ ] **Lock design token source** — one file, `app/globals.css`, no others allowed
- [ ] **Component library audit** — ensure every shared component uses tokens, not hex
- [ ] **Performance pass** — Core Web Vitals on all top pages
- [ ] **SEO infra** — sitemap submission, robots, Schema validation

### 🎨 Head of Design (Claude + Shiv review)
- [ ] **Hero.tsx:222,225** — `font-bold` → `font-display font-black`, green → indian-gold
- [ ] **Replace `italic text-authority-green` → `italic text-indian-gold`** across 9 home files
- [ ] **Homepage listing-style rework** — apply Playfair H2s, ink accents to RateComparison / MarketPulse / TopPicks / CalculatorSpotlight
- [ ] **Product listing page template** — build v3 version (hero + filter pills + full-width product cards with data strips + square score badges + square Apply Now)
- [ ] **Article detail template** — build v3 version (full-width Grok hero, Playfair 40px title, mono byline, gold pull-quote borders)
- [ ] **Calculator template** — split layout, mono results, "Products for you" cross-sell
- [ ] **Verdict card component** — reusable `<VerdictCard>` with Playfair + gold methodology link
- [ ] **Data strip component** — reusable `<DataStrip>` with mono values
- [ ] **Score badge component** — square, mono, weighted criteria
- [ ] **Section label component** — mono uppercase tracking-wider gold

### 📝 Content / Editor-in-Chief (Shiv + AI pipeline)
- [ ] **Process 29 approved Grok images** — watermark removal + InvestingPro branding
- [ ] **Wire images to all 228 articles** — update `featured_image` in DB
- [ ] **Generate ~160 remaining Grok images** — use existing prompt file
- [ ] **Article quality audit** — verify factual accuracy, interlinking, glossary dashed-underline links
- [ ] **Interlinking mesh** — 9+ articles missing cross-article links
- [ ] **Desk byline coverage** — verify all 228 have correct desk assigned
- [ ] **FAQ schema coverage** — ~180/228 have it, push to 100%
- [ ] **Sources block** — every article links to RBI/SEBI/IRDAI per category
- [ ] **Glossary expansion** — 101 → 205 terms per Content Blueprint
- [ ] **Content calendar** — 5-10 articles/week, track in spreadsheet

### 💰 CMO / Growth (Shiv)
- [ ] **Submit sitemap to GSC** (never done yet — 228 articles unindexed)
- [ ] **Submit to Google News** — qualify + apply
- [ ] **Apply for Google AdSense** (228 articles = qualifies)
- [ ] **Cuelinks/EarnKaro activation** — verify all 6 product page apply-now links fire tracking
- [ ] **Affiliate network expansion** — apply to RupeeGains, Bajaj direct, Axis direct, HDFC Smartbuy
- [ ] **Newsletter setup** — capture emails on homepage + every article bottom
- [ ] **Social distribution** — Telegram bot (P1), X API (P2), WhatsApp Channel (P3)
- [ ] **Backlink outreach** — pitch to Bloomberg Quint, Moneycontrol, Livemint for citation
- [ ] **PostHog funnel tracking** — homepage → category → product → Apply Now

### 💼 CFO / Monetization (Shiv)
- [ ] **Revenue target** — ₹3.9L/month from affiliate CPAs (per memory)
- [ ] **CPA tracking dashboard** — Cuelinks + EarnKaro + manual affiliates → one view
- [ ] **A/B test Apply Now copy** — current "APPLY NOW" vs alternatives
- [ ] **Premium tier planning** — Stripe ready, no product spec yet
- [ ] **AdSense revenue projection** — traffic × RPM estimate

### ⚖️ COO / Ops (Shiv)
- [ ] **Pre-commit validation hook** — `npm run validate` before any push
- [ ] **Secure the 40 unsecured cron endpoints** (from Apr 15 audit)
- [ ] **Fill 11 empty categories** (from Apr 15 audit)
- [ ] **Environment variables hygiene** — document which are required where
- [ ] **Error monitoring** — Sentry + PostHog error count → weekly review

### ✅ QA / Visual Regression
- [ ] **Playwright test suite** — screenshot every page, diff against approved version
- [ ] **Token linter** — CI fails if hex color committed instead of token
- [ ] **Font linter** — CI fails if `font-bold` used on H1/H2 (should be `font-display font-black`)

---

## 4. Active Bugs (verified with code + runtime inspection)

| # | Bug | File:Line | Severity | Status |
|---|---|---|---|---|
| 1 | `surface-ink` forces canvas color on all h1-h6/p/a — kills Footer gold titles | `globals.css:508-510` | **P0** | ✅ fixed `e22b243f` |
| 2 | `surface-canvas` forces ink color on all text — will block any gold headline inside | `globals.css:487-489` | **P0** | ✅ fixed `e22b243f` |
| 3 | Hero H1 uses Inter bold instead of Playfair 900 | `Hero.tsx:222,225` | **P0** | ✅ fixed `e22b243f` |
| 4 | "at 55?" hero emphasis is `text-green-600` (should be `text-indian-gold`) | `Hero.tsx:225` | **P0** | ✅ fixed `e22b243f` |
| 5 | 9× `italic text-authority-green` pattern across homepage (should be `text-indian-gold`) | 9 `components/v2/home/*.tsx` | **P0** | ✅ fixed `e22b243f` |
| 6 | 9 section H2s use `font-medium` instead of `font-display font-black` | 9 home files | **P1** | ✅ fixed `fde017b7` |
| 7 | Hero buttons hardcode hex (`#16A34A`, `#0A1F14`) instead of tokens | `Hero.tsx:256,262` | **P2** | ✅ fixed `fde017b7` |
| 8 | Duplicate `indian-gold`/`canvas` defined both as `var()` and literal hex | `tailwind.config.ts:195-231` | **P1** | ✅ fixed `fde017b7` |
| 9 | Legacy `wt-*` tokens still live (not used by v3) | `tailwind.config.ts:204-207` | **P2** | ✅ fixed `fde017b7` |
| 10 | Typo "Eligibilty" on credit cards filter | `components/credit-cards/FilterSidebar.tsx:96` | **P2** | ✅ fixed `fde017b7` |
| 11 | Cookie banner too tall, blocks content on scroll | `components/common/CookieConsent.tsx` | **P2** | pending |
| 12 | No PWA mobile mockup section on homepage | — (not built) | **P2** | pending |

**New bugs discovered during v3 rollout (to address next):**
| # | Bug | Severity | Status |
|---|---|---|---|
| 13 | Listing page H1s (`/credit-cards`, `/loans`, etc.) use Inter not Playfair | P1 | ✅ fixed `493f0b20` |
| 14 | Article detail H1 uses Inter not Playfair | P1 | ✅ fixed `493f0b20` |
| 15 | Calculator H1s use Inter not Playfair | P1 | ✅ fixed `493f0b20` |
| 16 | Card h3s in TopPicks/ExploreCategories/TrustStats/RateComparison — tokens applied | P2 | ✅ fixed `8b6efd9b` |

**v3 Bold Redesign: 100% site coverage reached on 2026-04-22 (commit `493f0b20`).**
All public routes (homepage, 7 listing pages, 228 articles, 75 calculators) now
render in Playfair + ink + gold + canvas tokens. 83 files migrated in single sweep.

---

## 8. Session progress (2026-04-21)

**Shipped (6 commits):**
- `e22b243f` P0 bugs 1-5: surface-* CSS overrides, Playfair hero, gold emphasis
- `fde017b7` P1/P2 bugs 6-10: 9 H2s to Playfair, token buttons, dedupe config, typo
- `8d006d60` Doc update
- `8b6efd9b` Homepage sections polish: RateComparison, TopPicks, TrustStats, ExploreCategories (brainstorm signature elements applied)
- `b78fcbb1` Footer rebuild: 6-col × sub-sections, 70 SEO links, 3 compliance blocks

**Homepage section status:**
| # | Section | Status |
|---|---|---|
| 1 | Hero | ✅ Playfair + gold emphasis |
| 2 | TrustRail | ✅ ink ticker |
| 3 | RateComparison | ✅ Polished — mono data strips |
| 4 | MarketPulse | ⚠️ H2 only (still needs Grok images + category ink badges) |
| 5 | TopPicks | ✅ Polished — square score badges |
| 6 | CalculatorSpotlight | ⚠️ H2 only (still needs big mono preview numbers) |
| 7 | ExploreCategories | ✅ Polished — mono count badges |
| 8 | Editorial | ⚠️ Partial (asymmetric grid pending) |
| 9 | TrustStats | ✅ Polished — Playfair 44px numbers |
| 10 | NewsletterTrust | ✅ Inline signup correct |
| 11 | MoreResources | ✅ Tab navigation |
| 12 | Footer | ✅ 6-col NW-style, 70 SEO links, compliance |

**Homepage polish coverage: 9 of 12 sections complete.**

**Still pending for homepage completion:**
- Section 4 MarketPulse: add Grok image thumbnails + category ink badges
- Section 6 CalculatorSpotlight: big mono preview numbers + editorial card style
- Section 8 Editorial: brainstorm Phase 2 §6 asymmetric 1-large + 4-small grid

---

## 5. The Big Decision

**Option A — Finish v3 Bold Redesign (RECOMMENDED)**
- Keep Navbar/Footer/Hero work (2 weeks committed)
- Apply Playfair/ink/gold tokens to listings, calculators, articles
- Fix bugs in §4
- Est: 15–20 hrs spread over 2 weeks (alongside revenue work)
- Outcome: Distinctive, "Unapologetically Indian" editorial finance brand

**Option B — Revert to NerdWallet-parity clean (Apr 18 state)**
- Roll back to commit `252b6054`
- Lose all v3 work
- Uniformly clean but generic — looks like every other fintech
- Est: 1 hr revert + cleanup
- Outcome: Safe, undifferentiated

**Option C — Hybrid (worst of both)**
- Keep ink Navbar/Footer, strip Playfair + gold emphasis
- Confuses users, wastes half the brainstorm
- Not recommended

**Decision:** **A — Finish v3 Bold Redesign.** Locked 2026-04-21 by Shiv.

---

## 6. What We Borrow from NerdWallet (content patterns only — NOT design)

> We use our own design tokens (ink/gold/canvas/Playfair). We borrow NerdWallet's **content architecture** only.

### URL structure
- `/{category}/learn/{slug}` for articles (currently `/articles/{slug}` — migrate P2)
- `/{category}/best/{subcategory}` for "best of" roundups (35 built ✅)
- `/{category}/reviews/{product}` for individual product reviews (sparse, expand)
- `/{category}/news` for category news feed (not built)

### Content patterns
- **"Best of" roundup structure** — ranked list, rating methodology link, table of winners
- **Editorial methodology disclosure** — every roundup links "How we rate"
- **Expandable advertiser disclosure** — already built ✅
- **"Updated [date]" stamps** — every article + product page
- **Per-category rating criteria** — weighted criteria disclosed per product type ✅
- **"APPLY NOW on [Issuer]'s website" CTA subtext** — already built ✅
- **Callout boxes** — simple border + light bg (no gradients) ✅

### SEO patterns
- **Hub + pillar + supporting + roundup** content structure (per Content Blueprint)
- **Keyword clusters** per category
- **Glossary dashed-underline links** ✅
- **Internal link mesh** — every article links 3+ related

### Trust signals
- **Desk bylines** (not individual fake authors) ✅
- **Regulatory citations block** (RBI, SEBI, IRDAI) ✅
- **Editorial standards page** ✅
- **Corrections policy page** — not built
- **Fact-check policy page** — not built

### What we DON'T borrow from NerdWallet
- ❌ Their Gotham font (we use Playfair + Inter)
- ❌ Their teal-green `#008254` (we use forest `#166534` + action `#16A34A`)
- ❌ Their cream footer (we use ink `#0A1F14`)
- ❌ Their rounded buttons (we use 2–6px square)
- ❌ Their visual style — generic US fintech look

---

## 7. Working Agreement

1. **Every PR** must list which numbered item from this doc it closes.
2. **Every session** starts by reading this doc (§2 + §4 at minimum).
3. **No new design patterns** without updating §1.
4. **No reverting** without Shiv writing decision in §5.
5. **Bugs in §4 are P0** — fix before any new feature.
6. **Content pipeline runs in parallel** — doesn't block design work.
7. **Revenue activation is P0 alongside design** — ship both, not sequentially.

---

*This doc replaces: homepage_design_audit.md, 2026-04-17-bold-redesign-design.md (archived reference), nerdwallet-parity-gap-report.md (archived reference).*
*Archive those, link them here if needed, don't edit them.*
