# InvestingPro — Single Source of Truth

> **Last updated:** 2026-04-22 (session 2 wrap-up)
> **Status:** v3 Bold Redesign 100% deployed across public routes.
> **Rule:** Every session starts here. Every PR lists which item it closes.

---

## 1. Approved Design Language (LOCKED)

> "Editorially Bold, Regulatorily Transparent, Unapologetically Indian"

### Typography
| Use | Font | Weight |
|---|---|---|
| Heroes, headlines, verdicts, article H2 | **Playfair Display** | 900 (letter-spacing: -2px) |
| Body, UI, buttons | **Inter** | 400–700 |
| Rates, scores, dates, badges, labels | **JetBrains Mono** | 400–500 (uppercase, tracking-wider) |

### Colors (only these — no blue, no purple, no pink)
| Token | Hex | Use |
|---|---|---|
| `ink` | `#0A1F14` | Primary text, dark sections |
| `authority-green` | `#166534` | Brand, trust, structural elements |
| `action-green` | `#16A34A` | CTAs, positive data |
| `indian-gold` | `#D97706` | **Emphasis, Indian identity, methodology** |
| `canvas` | `#FAFAF9` | Page background |
| `warning-red` | `#DC2626` | Errors, negatives, stress |

### Hard rules
- **Emphasis = indian-gold** (not green)
- No gradients except hero sections
- Cards use 0px / 2px / sharp corners (rounded-sm max)
- No scale-transforms on hover
- No glassmorphism / backdrop-blur
- No shadow-lg / shadow-2xl (editorial = flat)
- Serif = opinion · Monospace = data · Sans = UI
- No vanity inventory brags ("X+ tested", "Y funds tracked") — users don't care
- **Surface alternation is NOT zebra striping.** Reserve `surface-ink` for *statement moments only*: the hero (top) and the final CTA (bottom). Optionally one credibility moment (methodology / how-we-rate) on long pages. Everything else stays on `bg-canvas`. Visual rhythm comes from indian-gold eyebrows + ink-12 thin dividers + mono small-caps labels — NOT from alternating dark/light surfaces. Locked 2026-04-25 PM after `/investing` + `/credit-cards` v3 redesign over-applied surface flips.

### Signature elements
1. **Verdict Cards** — Playfair headline + "Methodology disclosed →" gold link
2. **Data Strips** — Ink header + monospace values, tabular-nums
3. **Score Badges** — Square, 2px ink border, mono number + `/100`
4. **Section Labels** — JetBrains Mono 11px, uppercase, tracking 0.08em, gold

---

## 2. Production State (as of 2026-04-22)

### v3 rollout — 100% complete across public routes

| Route pattern | Count | Status |
|---|---|---|
| Homepage `/` | 1 | ✅ 11 sections, editorial flow |
| Listing pages `/credit-cards`, `/loans`, `/mutual-funds`, `/insurance`, `/fixed-deposits`, `/demat-accounts`, `/banking` | 7 | ✅ NerdWallet+ editorial cards default |
| Product detail `/credit-cards/[slug]` etc. | 1000+ | ✅ Square score hero + data strip + Our Take |
| Article hub `/articles` + detail `/articles/[slug]` | 228 | ✅ Playfair editorial body prose |
| Calculator hub `/calculators` + individuals | 72 | ✅ v3 tokens; SIP has full gold-standard features |
| Category pages `/category/[slug]` | 8+ | ✅ Playfair 64px hero |
| Best-of roundups `/{cat}/best/{sub}` | 35 | ✅ Editorial H1 |
| Compare `/compare` + sub-pages | 10+ | ✅ Sticky ink+gold tray |
| Footer | — | ✅ 6-col / 70 SEO links / 3 compliance blocks |

### Homepage section flow (11 sections)

1. **Hero** — rotating question + constellation, Playfair 60px + gold emphasis
2. **TrustBar** — surface-ink live-data ticker (rates + deadlines, NO inventory)
3. **RateComparison** — mono data strips with big mono rate numbers
4. **TopPicks** — 3 editor verdict cards with square score badges
5. **FindYourFit** — instant-value chip interface (0 clicks to recommendations)
6. **ExploreCategories** — 8 category cards with mono count badges
7. **CalculatorSpotlight** — 3 live interactive mini-calcs with sliders
8. **LifeStageHub** — 6 life-stage bundles, first auto-open (0 clicks to value)
9. **Editorial** — 1 featured + 5 small editorial layout with gold category pills
10. **TrustMethodology** — 6-criteria weighted methodology (brainstorm §7)
11. **NewsletterTrust** — real API-wired capture with success state

### Removed from homepage (kept as components)
- MarketPulse — redundant with Editorial
- MoreResources — redundant with 70-link footer
- BrandMarquee — decorative
- TrustStats — vanity inventory (228 articles / 75 calcs brags)

---

## 3. Shipped features — session log

### Session 1 (2026-04-21) — v3 foundation
- Design system audit + drift fix (`e22b243f`)
- 8 homepage sections polished with signature elements
- Footer NerdWallet-style rebuild (70 links, SEBI/RBI/IRDAI compliance block)
- Listing page editorial card rebuild (7 pages via shared RichProductCard)
- Product detail page rebuilds (6 categories)
- Category + best-of pages v3
- Article + calculator component sweeps (94 files)
- PostHog instrumentation (FindYourFit, LifeStageHub, TopPicks, CalculatorSpotlight, newsletter)

### Session 2 (2026-04-22) — polish + infrastructure
- Sitemap: 23 → 72 calcs + 35 best-of + 10 categories = ~1,450 URLs
- Cookie banner shrink (slim ink bar with gold border, pb-safe)
- Newsletter capture activated — `/api/newsletter` POST, success state, PostHog events on homepage + article bottom
- Compare feature v3 rebuild (CompareBar + CompareTray — no more glassmorphism)
- Editorial desk bylines on product cards (Credit Team / Investment Desk etc.)
- Affiliate tracking non-blocking + UUID validation + schema-mismatch retry fallback
- Self-healing slug resolver (3-tier fuzzy match) for credit card detail pages
- Migration `20260422_fix_affiliate_clicks_schema.sql` to fix article_id column
- Blue token purge across 9 user-facing files (admin kept separate)
- "This Week in Indian Money" editorial ticker on 6 listing pages
- SIP calculator gold-standard rebuild (persona presets, step-up, inflation, LTCG, stress test, donut, share-as-image, copy result)
- Article body typography — custom `.article-prose` CSS with Playfair headings, gold dash bullets, mono leading-zero OL, pull quotes with gold border, ink tables, editorial figures

### Total: **31 commits, 20 master deploys** across 2 days

---

## 4. Active pending items

### 🛠️ Engineering
- [ ] **Playwright visual regression** — screenshot every page, CI diff against approved snapshot (~1 hr)
- [ ] **Token/font linter in CI** — fail build if hex used instead of token, or `font-bold` used on H1/H2 (~30 min)
- [ ] **Run migration `20260422_fix_affiliate_clicks_schema.sql`** in Supabase SQL editor (manual action required)
- [ ] **Connect InvestingPro Supabase project to MCP** so future sessions can query DB directly
- [ ] **Extend fuzzy-slug resolver** to loans/MF/insurance/demat/FD detail pages (credit-cards already has it)

### 🎨 Design completion
- [ ] **Port SIP gold-standard to EMI + FD + Tax calculators** — these are the high-traffic ones (~3 hrs each)
- [ ] **PWA mobile mockup section** — brainstorm Phase mention, not yet built
- [ ] **Extend `.article-prose` opt-in classes** (`.data-callout`, `.takeaways`) with documentation for editorial team

### 💰 Revenue / SEO activation
- [ ] **Submit sitemap to Google Search Console** — 228 articles currently unindexed
- [ ] **Submit sitemap to Bing Webmaster Tools**
- [ ] **Request manual indexing** for top 10 money articles in GSC URL Inspection
- [ ] **Apply for Google AdSense** — 228 articles qualifies
- [ ] **Process 29 approved Grok images** — watermark removal + IP branding overlay
- [ ] **Wire Grok images** to all 228 articles (featured_image DB column)
- [ ] **Generate ~160 remaining Grok images** per content blueprint

### 📝 Content / E-E-A-T
- [ ] **Glossary expansion** 101 → 205 terms per content blueprint
- [ ] **Interlinking mesh** — 9+ articles missing cross-article links
- [ ] **Corrections policy page** — not built
- [ ] **Fact-check policy page** — not built

---

## 5. Design decisions — LOCKED (do not revisit)

| Decision | Chosen | Locked on |
|---|---|---|
| v3 Bold Redesign vs revert | **A — Finish v3** | 2026-04-21 |
| Blue/purple/pink usage | **Forbidden** | 2026-04-21 |
| Inventory brags ("228 articles", "75 calcs") | **Forbidden on user-facing pages** | 2026-04-21 |
| Popups / modals for newsletter | **No popups** — inline only | 2026-04-21 |
| Gradients | **Only in hero sections** | 2026-04-21 |
| Rounded corners | **rounded-sm max (2px)** | 2026-04-21 |
| Scale hover transforms | **Forbidden** | 2026-04-22 |
| Glassmorphism / backdrop-blur | **Forbidden** | 2026-04-22 |
| Homepage vanity sections (TrustStats, BrandMarquee) | **Removed** | 2026-04-22 |
| Author attribution pattern | **Desk bylines, never fake individuals** | 2026-04-22 |
| Emphasis italic colour | **indian-gold** (never action-green) | 2026-04-22 |

---

## 6. Content borrowed from NerdWallet (structure only, not design)

URL structure, content architecture, editorial patterns — yes.
Colours / fonts / visual treatment — no, we are distinctively Indian editorial.

### Patterns borrowed
- "Best of" roundup structure (35 live on our site)
- Editorial methodology disclosure linked per product
- Expandable advertiser disclosure
- "Updated [date]" stamps
- Per-category weighted rating criteria
- "APPLY NOW on [Issuer]'s website" CTA subtext

### Patterns we beat them on
- Editorial hero (Playfair 60px) vs NW's plain H1
- Inline cards with pros/cons on listing vs NW's pill-links only
- Left-rail filters (7 groups) vs NW has none on listing
- Visible score badges (`88/100`) vs NW hides ratings
- Compare tray sticky UX vs NW has none
- **Weekly Changes editorial ticker** vs NW's static news feed
- Indian regulatory compliance (RBI/SEBI/IRDAI/PFRDA) vs NW's US-only

---

## 7. Working agreement (7 rules)

1. **Every PR** lists which item from §4 it closes
2. **Every session** starts by reading §2 + §4 + §5
3. **No new design patterns** without updating §1
4. **No reverting** without Shiv writing decision in this doc
5. **Pending items in §4 are prioritised** before new features
6. **Content pipeline runs in parallel** — doesn't block design work
7. **Revenue activation is P0 alongside design** — ship both, not sequentially

---

## 8. Quick reference — key file paths

### Design source
- `app/globals.css` — all CSS variables + `.article-prose` + `.surface-*`
- `tailwind.config.ts` — single source of truth for tokens
- `components/v2/home/*` — 11 homepage sections

### Shared components (upgrade once, whole site benefits)
- `components/products/RichProductCard.tsx` — 7 listing pages inherit
- `components/products/ApplyNowCTA.tsx` — every affiliate click
- `components/articles/ArticleRenderer.tsx` — all 228 articles
- `components/articles/ArticleSources.tsx` — all 228 articles, 8 category citations
- `components/articles/Callout.tsx` — 5 editorial callout tones
- `components/articles/ArticleNewsletterInline.tsx` — every article bottom
- `components/common/WeeklyChanges.tsx` — 6 listing pages
- `components/common/ContextualTicker.tsx` — 6 listing pages
- `components/common/CookieConsent.tsx` — every page
- `components/layout/Footer.tsx` — every page
- `components/v2/layout/{Navbar,MegaMenu,MobileNav,TrustRail}.tsx` — every page
- `components/compare/{CompareBar,CompareTray}.tsx` — every page
- `components/calculators/shared/{SliderInput,ResultCard,TrustStrip,charts}.tsx` — 75 calculators

### Content files (edit without code deploy)
- `lib/content/weekly-changes.ts` — 6-category weekly editorial items
- `lib/content/hero-questions.ts` — homepage rotating questions
- `lib/content/expert-opinions.ts` — product expert opinions
- `lib/content/author-personas.ts` — desk byline config

### Infrastructure
- `app/sitemap.ts` — ~1,450 URLs across 10+ page patterns
- `app/robots.ts` — AI crawler allowlist (ChatGPT/Perplexity allowed, GPTBot blocked)
- `app/api/newsletter/route.ts` — POST handler, existing API
- `app/api/out/route.ts` + `app/go/[slug]/route.ts` — affiliate redirect tracking
- `lib/tracking/affiliate-tracker.ts` — non-blocking click tracking with retry
- `lib/analytics/posthog-service.tsx` — analytics provider + event helpers
- `supabase/migrations/20260422_fix_affiliate_clicks_schema.sql` — schema fix (run manually)

---

*This doc consolidates: Session 1 (2026-04-21) + Session 2 (2026-04-22) work.
Prior design specs archived — see git history for `2026-04-17-bold-redesign-design.md` etc.*
