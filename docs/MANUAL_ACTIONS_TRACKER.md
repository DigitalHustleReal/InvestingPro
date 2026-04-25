# Manual Actions Tracker

> Single source of truth for user actions that Claude cannot execute (platform
> UIs, billing, external credentials, domain decisions). Grouped by migration
> phase per [URL_STRUCTURE_NERDWALLET.md](./URL_STRUCTURE_NERDWALLET.md) and by
> the 90% automation goal.
>
> **Rule:** Every time a Claude session uncovers a blocker that needs a human
> to act, it goes here — with the exact URL, exact command, or exact steps.

---

## Status Legend
- `[ ]` — Not done
- `[x]` — Done
- `[~]` — Partial / in progress
- `🔴` — Blocks automation from firing
- `🟡` — Blocks a phase handoff
- `🟢` — Nice-to-have / unblocks revenue

---

## Phase 1 — Foundations (this session: 2026-04-24)

### Cron scheduler migration (Vercel Hobby → GitHub Actions)
- [ ] 🔴 Add `CRON_SECRET` to GitHub Actions Secrets
  → https://github.com/DigitalHustleReal/InvestingPro/settings/secrets/actions
  → Value must match Vercel env `CRON_SECRET` exactly (no whitespace)
  → Until set, all 40 migrated crons receive `401 Unauthorized`
- [ ] 🔴 Open + merge PR `claude/eager-boyd-6d7f83`
  → https://github.com/DigitalHustleReal/InvestingPro/pull/new/claude/eager-boyd-6d7f83
  → 48 files: `.github/workflows/*.yml` (40 crons + 1 invoke), `vercel.json` trim, `AUDIT_LAYER_A.md`, `/admin/agents` redirect, session prompts
- [ ] 🟡 Push current worktree + open PR
  → `git push -u origin claude/vibrant-lovelace-875415`
  → Contains glossary v3 rebuild, `/taxes` hub, goal-planner token swap, footer social channels, `/article/` dedup redirect, URL plan, Session 2 prompt

### Agent mesh repair (discovered in Session 1b)
- [ ] 🔴 Apply schema fix for `update-intelligence` cron
  → Writes to 5 non-existent tables: `behavioral_events`, `lead_scores`, `product_rates_history`, `product_watchlists`, `content_attribution_cache`
  → Either create the tables via a migration OR strip the cron to only the parts whose tables exist
  → Decision needed from user — this cron has been silently failing since at least April 2026
- [ ] 🔴 Wire Draft→Publish bridge
  → ArticleGenerator produced 39 drafts on Apr 24 but zero promoted — last publish was Apr 17
  → Session 2 Phase 2 agent B3 (Draft→Publish Bridge) is the design solution; implementation blocked by Session 2 execution
- [ ] 🟡 Populate `ai_persona_performance` table
  → Table exists with 0 rows; writers can't self-rank
  → Session 2 Phase 2 agent B1 (Persona Performance Ranker) closes this

---

## Phase 2 — Category-nested routes (next)

### Route scaffolding
- [ ] 🟡 Confirm URL mapping for ambiguous categories (decide before auto-redirects go live)
  → `small_business` / `small-business` → `/loans/business/` (NerdWallet nests under loans)
  → `personal-finance` → `/learn/` (cross-cutting, no single top-level owner)
  → `tools` → `/learn/tools/` or treat as utility?
  → `retirement` → `/investing/retirement/` (aligns with NerdWallet)
- [ ] 🟡 Approve article category normalization migration
  → DB has 23 distinct category values including dupe pairs (`mutual-funds` vs `mutual_fund`, `credit-cards` vs `credit_cards`, `fixed-deposits` vs `fixed_deposit`, `demat-accounts` vs `demat_account`, `small-business` vs `small_business`, `tax-planning` vs `tax`)
  → SQL normalization planned; user needs to approve canonical form (hyphen or underscore — NerdWallet uses hyphen)
- [ ] 🟢 Designate primary category for multi-topic articles
  → Some articles could legitimately live under multiple top-levels (e.g. "PPF vs NPS vs ELSS" — taxes, investing, or retirement?)
  → Need `primary_category` column OR first-match rule

### Content sources — route through CMS / DB (user-flagged 2026-04-25)
> **Architectural principle (locked):** Every piece of content shown on the
> public site flows through the CMS / database — even content I (Claude)
> generate manually inside a session. Code-resident content arrays are an
> anti-pattern; they couple editorial freshness to engineering deploys
> and hide content from any future admin tooling. The pattern: write a
> seed SQL once, populate the table, point the runtime at the DB with a
> static-module fallback for resilience. Counts shown to users (X cards,
> X guides) look immature — strip from public pages, keep in admin only.

- [x] Stripped count-claims from `/not-found`, `/[cat]/learn/`, `/[cat]/calculators/`, `/taxes` user-facing copy. Counts still pulled to llms.txt (AI-only) for accurate citation.
- [x] FAQ blocks added to all 7 `/[cat]/learn/` hubs + `/taxes` top-level via shared `CategoryFAQ` Server Component. Currently sourced from `lib/content/faq-data.ts` (typed module). 35+ FAQ items across 7 categories.
- [ ] 🟡 **Migrate FAQ data to DB** — create a `category_faqs` table (id, url_category, question, answer, sort_order, published, created_at, updated_at). Refactor `getCategoryFAQs` to query DB via React.cache. Build admin UI under `/admin/faqs`. Keep static fallback for resilience.
- [ ] 🟡 **Migrate calculator metadata to DB** — `CALCULATOR_CATEGORY` map + `CALC_META` (titles, taglines, accents) currently in code. Create a `calculators` reference table (id, slug, url_category, title, tagline, accent, status, popularity_rank). Refactor hubs + 404 page to query the table. Admin UI under `/admin/calculators`.
- [ ] 🟢 **Move "Did you know?" data hooks to DB** — currently hardcoded in `app/not-found.tsx`. Future `editorial_facts` table + admin UI lets editorial team refresh post-Budget without a code deploy.
- [ ] 🟢 **Move tax regime / deductions / key dates from code to DB** — `app/taxes/page.tsx` has TAX_CALCULATORS, DEDUCTIONS, REGIME_SLABS, KEY_DATES as in-code arrays. Should live in `tax_data` table with annual rev policy.

### Counts visible to users (cleanup audit — fixed in this session)
- [x] `/not-found` — removed "81 cards ranked", "70 deep dives"
- [x] `/[cat]/learn/` — removed "{N} guides" header
- [x] `/[cat]/calculators/` — removed "{N} free calculators" header + "All 72 calculators" CTA
- [x] `/taxes` — "All 75 calculators" → "All calculators"
- [ ] 🟢 Audit `/credit-cards`, `/loans`, `/banking`, `/investing`, `/insurance` literal hub pages for similar hardcoded counts. Tracked, not yet done.
- [ ] 🟢 Build admin dashboard view at `/admin/dashboard` showing platform stats (228 articles, 81 cards, 101 glossary, etc.) — _appropriate_ place for these numbers, not the public site.

### SEO / GEO / GSC (user-flagged 2026-04-24, partial in this session)
- [x] **GEO audit run** via `claude-seo:seo-geo` skill — score went from ~28 → 62/100 after this session's fixes. Detailed report inline in commit message.
- [x] **`/llms.txt` + `/llms-full.txt`** — dynamic, live counts from Supabase. Concise + extended variants. Replace stale public/llms.txt that claimed 500 glossary terms / 25 calcs.
- [x] **`robots.ts` flipped to 2026 policy** — now allows GPTBot, OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, Google-Extended, bingbot. ChatGPT web search (900M weekly users) was previously locked out. Still blocks pure training scrapers (CCBot, Bytespider, Diffbot, FacebookBot, ImagesiftBot, Omgilibot).
- [x] **Removed conflicting `public/llms.txt` + `public/robots.txt`** — Next.js dynamic routes now win.
- [ ] 🟡 Run full SEO audit — invoke `claude-seo:seo-audit` on the live URL post-deploy; delegates to 9 specialists (technical/content/schema/images/links/performance/E-E-A-T + GEO + local). Produces a health score.
- [ ] 🟡 Add FAQ blocks to 6 category hubs (`/credit-cards`, `/loans`, `/banking`, `/investing`, `/insurance`, `/taxes`) — 134-167 word self-contained Q&A blocks following "What is X?" pattern. Highest GEO impact gap remaining.
- [ ] 🟡 Add Person/Desk byline JSON-LD + visible "Reviewed by" line on every glossary term and category hub. `lib/data/team.ts` has 7 desks; just wire into JSX.
- [ ] 🔴 Google Search Console — connect + submit sitemap (https://search.google.com/search-console). **UNBLOCKED 2026-04-25** — Phase 3a canonical flip shipped on this branch. Sitemap now emits 212 nested + 16 cross-cutting flat URLs (no overlap, single canonical per article).
- [ ] 🔴 Bing Webmaster Tools — submit sitemap once Phase 3a deploys to prod.
- [ ] 🟡 Request manual indexing on top 10 articles once Phase 3a deploys.

### Brand-mention surface (3x stronger AI-citation correlation than backlinks per Ahrefs Dec 2025)
- [ ] 🔴 Wikipedia — submit a draft entry for InvestingPro (eligible if there's enough independent press coverage)
- [ ] 🔴 YouTube channel — 5 founding videos (compounds: each video = potential AI citation source)
- [ ] 🔴 Reddit engagement — `r/IndianInvestments`, `r/IndiaFinance`, `r/personalfinanceindia` — comment + link strategically (don't spam)
- [ ] 🟡 LinkedIn company page — set up + cross-post weekly editorial ticker
- [ ] 🟢 Quora answers — top 50 questions by topic where InvestingPro can authoritatively answer

### Affiliate link routing (user-flagged 2026-04-24 — fixed in this session)
- [x] `/go/[slug]` was only checking `affiliate_links` (0 rows) + `products` (36/2584 active), causing 404s on every CC/loan/insurance/broker slug emitted by `InlineProductCard`, `ContextualProducts`, `SmartRecommendation`, `SmartContextualOffers`. Extended to chain-check:
      - `affiliate_links` (active) → `products` → `credit_cards` (81/81 via apply_link) → `loans` (affiliate/apply/official) → `insurance` (apply/official) → `brokers` (affiliate/official). Mutual funds correctly skipped (no outbound link column — info-only).
- [x] Final fallback swapped from `/404` (phantom path) to rewrite to `/not-found` with status 404 — the real Next.js 16 catch-all.
- [ ] 🟡 Reconcile `/go/[slug]` (short-code tracking) vs `/api/out?id=X` (id tracking). Current: 7 components use `/go/`, 5 use `/api/out?id=`. Consolidate to one tracking surface.
- [ ] 🟢 Populate `affiliate_links` table — currently empty. Each active product should have a row with short code, destination, partner, etc. so click-attribution works beyond the per-table fallbacks.
- [ ] 🟢 Migration `20260422_fix_affiliate_clicks_schema.sql` — CLAUDE.md §9 flagged this as pending; apply in Supabase SQL editor.

### 404 / not-found page (user-flagged 2026-04-24 — fixed in this session)
- [x] `app/not-found.tsx` rebuilt as v3 Server Component. Replaces v1/v2 gradients + rounded-2xl + secondary-500 tokens. New surface:
      - Ink hero: Playfair "Lost in the numbers?" with indian-gold accent
      - URL structure tip (shows valid top-level categories)
      - "Did you know?" strip with 3 rupee-accurate data hooks (₹99.9L SIP outcome, old-vs-new threshold, LTCG jump to ₹1.25L)
      - 6 most-run calculators (SIP/EMI/HRA/old-vs-new/FD/LTCG)
      - 3 category hub shortcuts (credit-cards/investing-learn/taxes)
      - CTA back to homepage
- [ ] 🟢 Refresh data hooks annually after Budget — currently FY 2026-27 aligned.
- [ ] 🟢 A/B test the CTA copy — once PostHog events flow through, measure click-through from /not-found.

### Branding (this session — follow-up)
- [x] Footer channel labels unified to **InvestingPro India** (matches both Telegram and WhatsApp channel display names) — platform disambiguator moved to mono small-caps (`on Telegram`, `on WhatsApp`)
- [x] Favicon rebuilt on v3 tokens — `app/icon.tsx` + new `app/apple-icon.tsx`, ink (#0A1F14) rounded square with indian-gold (#D97706) serif "IP" monogram. Replaces the legacy teal/emerald gradient.
- [ ] 🟢 If you have a real profile-picture image from the channel, drop it at `public/icons/profile-512.png` and point `app/icon.tsx` / `app/apple-icon.tsx` at it (swap the ImageResponse for a `redirect()` to the static asset). Right now both routes render the monogram at build time.
- [ ] 🟢 Replace legacy `public/icons/icon-192x192.png` and `icon-512x512.png` — they still show the old gradient design, used by the PWA manifest. Either regenerate them with the new monogram or link them to rendered ImageResponses.

### Review routes (Phase 2 Step 2 — done in this session)
- [x] Built `/[category]/reviews/[slug]` dynamic route — PRODUCT_REVIEW_TABLES map handles credit-cards, loans, banking (FDs), investing (MFs + brokers), insurance. Taxes + learn return 404 (no product inventory).
- [x] Cross-category guard — `/loans/reviews/zerodha` correctly 404s (zerodha is a broker, not a loan).
- [ ] 🟢 Add `savings_accounts` detail page + include in banking review tables (currently skipped)
- [ ] 🟢 Add `stocks` to investing review tables once stocks table gets `slug` column

### Calculator nesting (Phase 2 Step 3 — done in this session)
- [x] Built `/[category]/calculators/[slug]` — 72 flat calcs reachable via nested URLs. Static `CALCULATOR_CATEGORY` map in `lib/routing/category-map.ts` drives routing (taxes: 14, investing: 29, banking: 14, loans: 7, insurance: 1, learn: 9).
- [x] Cross-category guards verified — `/taxes/calculators/sip` → 404 (SIP is investing), `/loans/calculators/hra` → 404 (HRA is taxes).
- [ ] 🟡 Decision on 3 ambiguous calcs:
  → `cagr` currently in investing → confirm (could be learn)
  → `dividend-yield` currently in investing → confirm
  → `salary` currently in taxes → confirm (could be learn)
- [ ] 🟢 Build `/[category]/calculators/` hub per category (list of that category's calcs with v3 design) — Phase 2b nice-to-have
- [ ] 🟢 Move static CALC_CATEGORY map into DB once a `calculators` reference table exists (current static map is fine but requires code edits per new calc)

---

## Phase 3a — Canonical flip + redirects ✅ SHIPPED 2026-04-25

- [x] **Decision:** `/[cat]/learn/[slug]` is canonical for categorized articles (228 articles). `/articles/[slug]` 308s when category maps to a real URL category; cross-cutting personal-finance content keeps `/articles/[slug]` as canonical.
- [x] 5-commit Phase 3a series shipped on `claude/vibrant-lovelace-875415`:
  1. `refactor(articles): extract FullArticleView shared Server Component`
  2. `feat(phase3a): /[cat]/learn/[slug] renders article content (was 308)`
  3. `feat(phase3a): /articles/[slug] -> /[cat]/learn/[slug] 308`
  4. `feat(phase3a): emit nested article URLs from sitemap`
  5. `refactor(linking): internal article links prefer nested URLs`
- [x] Internal linkers updated — 13 user-facing files + 2 SEO routes (sitemap.xml + news-sitemap.xml + feed.xml + Footer hardcoded link). Helper `lib/routing/article-url.ts :: articleUrl()` is the single source.
- [x] Verified end-to-end on dev: 1-hop redirect chain, no loops, cross-category 404s, preview mode bypassed, canonical link points to nested.
- [ ] 🟡 Followups (out of scope for Phase 3a — 308 catches them):
  - `lib/automation/article-generator.ts` writes `/articles/<slug>` into article HTML stored in DB. Long-term: regenerate via `articleUrl()` helper. Until then, those internal links 308 once.
  - `lib/seo/advanced-seo-optimizer.ts` internal-link suggestions
  - `app/glossary/[slug]/page.tsx` related_guides (slug-only, would need extra DB lookup)
  - `app/api/conduit-webhook/route.ts` `revalidatePath('/articles/...')` calls — still work, just suboptimal
  - admin/preview internal nav (admins hit redirect, fine)

---

## Phase 4 — Sitemap + GSC submission (UNBLOCKED 2026-04-25)

- [ ] 🔴 Submit sitemap to Google Search Console
  → **Phase 3a shipped** — gate is now: this branch must be merged + deployed to prod before submitting.
  → URL: https://search.google.com/search-console
  → Submit `https://www.investingpro.in/sitemap.xml`
  → Sitemap currently emits 1,819 URLs total: 212 nested article URLs (`/<cat>/learn/<slug>`), 16 cross-cutting flat (`/articles/<slug>`), 72 calculators, 101 glossary terms, ~1,400 product/category/comparison pages.
- [ ] 🔴 Submit sitemap to Bing Webmaster Tools
  → URL: https://www.bing.com/webmasters
- [ ] 🟡 Request manual indexing for top 10 money articles
  → Use GSC URL Inspection tool per-URL
- [ ] 🟢 Apply for Google AdSense
  → 228 articles qualify now; blocked on Phase 3 design consistency
  → URL: https://www.google.com/adsense
- [ ] 🟢 Process 29 approved Grok images (watermark removal + brand overlay)
  → Current state: images approved but not post-processed
  → Once processed, wire to `articles.featured_image` DB column
- [ ] 🟢 Generate ~160 remaining Grok images
  → Per `docs/MASTER_CONTENT_PLAN.md` blueprint
- [ ] 🟢 Glossary expansion 101 → 205 terms
  → Per content blueprint; new `/glossary/[slug]` template ready (shipped this session)

---

## Cross-phase / Infrastructure

### Vercel
- [ ] 🟢 Install Vercel CLI (`npm i -g vercel`) to unlock `vercel env pull`, `vercel deploy`, `vercel logs` agentic features
- [ ] 🟢 Consider migration `vercel.json` → `vercel.ts` with `@vercel/config` (Phase 4+ after crons fully off vercel.json)

### Auth / OAuth
- [ ] 🟢 Google Search Console OAuth credentials into Vercel env (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) — currently GSC data fetch is manual
- [ ] 🟢 Notion integration credentials (for `/api/import/notion`) — currently routes exist, no creds configured
- [ ] 🟢 Twitter/LinkedIn OAuth for auto-post (`TWITTER_*`, `LINKEDIN_*`) — required by Distribution agent (Layer A A8)

### Claude automation (90% goal)
- [ ] 🟡 Session 2 — execute Layer B roster design
  → Prompt at `.claude/prompts/session-2-phase-2-design.md`
  → Deliverable: `docs/agents/LAYER_B_ROSTER.md`
- [ ] 🟢 Add token/font linter to CI
  → Reject PRs that reintroduce forbidden classes (cyan/teal/sky/purple/rounded-xl/shadow-lg/gradients)
  → ~30 min work; blocks regression as new pages get built
- [ ] 🟢 Playwright visual regression
  → Snapshot homepage + 6 category listings + article detail + glossary detail
  → ~1 hr work; gives confidence for Phase 3 redirect flip

---

## Future roadmap (user-added 2026-04-25 — NOT this session)

Strategic bets in **strict priority order**. Do not jump ahead — earlier
items unblock later ones. The user explicitly set this sequence on
2026-04-25 PM; the previously written items have been re-ordered to match.

### Priority 0 — Category page redesign sweep (BEFORE everything else)

Goal: a seamless, mobile-first, no-flaw frontend before we drive any
new traffic (multi-language, news engine, ads). Inconsistent pages
hurt indexing + AI citation more than delay does.

Method:
1. Audit every category page individually:
   `/credit-cards`, `/loans`, `/banking`, `/investing`, `/insurance`,
   `/taxes`, `/learn` — plus all `/[cat]/learn/`, `/[cat]/reviews/`,
   `/[cat]/calculators/` sub-hubs.
2. Per page, capture screenshots of NerdWallet's equivalent + 1–2
   niche-best competitors (BankBazaar, Paisabazaar for cards/loans;
   ClearTax for taxes; Groww/INDmoney for investing; PolicyBazaar for
   insurance). Pull what they do well, document what's missing on ours.
3. Redesign **strictly** in v3 tokens — same lock as homepage:
   - Colors: ink, authority-green, action-green, indian-gold, canvas,
     warning-red. **No** blue/purple/pink/cyan/teal/sky.
   - Typography: Playfair Display headlines, Inter body, JetBrains
     Mono for data/labels.
   - Rounded-sm max, no gradients (except hero), no glassmorphism, no
     `shadow-lg`, no scale-transforms.
   - Emphasis = indian-gold (never action-green).
4. Mobile-first verification: bottom-tab thumb-zone navigation, 44px
   tap targets, no horizontal scroll under 360px width, no layout
   shift below the fold.
5. Token/font CI lint to prevent regression — already on backlog
   (Cross-phase / Infrastructure section). Ship that lint before the
   redesign work so the sweep doesn't drift.

Estimated effort: 2–3 weeks of focused design iteration. Deliverable:
every public route passing the same lighthouse + visual-regression bar.

### Priority 1 — Multi-language (after redesign sweep)

**Platform positioning to keep in mind across all priorities:** we are
building a *better-than-NerdWallet* product for India, not a clone.
Every redesign + language choice is judged against "would this beat
NerdWallet on the same page" not "does this match NerdWallet".

**Language strategy — English is the default and canonical, regional
languages are *additive*:**

- English stays at root URLs (`/credit-cards`, `/articles/foo`, etc.)
  and remains the canonical URL for SEO. International audience,
  educated urban India, and global crawlers all land here first.
- Regional languages live at locale-prefixed paths (`/hi/credit-cards`,
  `/te/articles/foo`, …). They emit `hreflang` back to the English
  canonical and to each other so Google understands the relationship.
- The goal of regional content is **outreach + reach + SEO growth**:
  - Outreach: the user's WhatsApp/Telegram distribution audience prefers
    reading + learning in their own language.
  - Reach: regional language searches in India are 2–3× English search
    volume per Google's own India index data, and growing.
  - SEO: regional pages capture long-tail queries English pages can't,
    and don't cannibalize the English ranking because hreflang
    deduplicates.
- Original locale-specific content generated at build time (real
  examples in regional context — Mumbai rent ≠ Bengaluru rent ≠
  Hyderabad rent), not runtime translation. Translation alone is a
  weak SEO signal; localized content wins.
- Rollout: Hindi first (~50 pillar articles), then Telugu / Tamil /
  Marathi / Gujarati / Bengali based on traffic-mix data. Add a locale
  switcher to navbar (already on the future-navbar memory).

See "Multi-language programmatic expansion" further below for the
route-group architecture sketch (`app/(intl)/[locale]/…`).

### Priority 2 — Per the rest of the future roadmap below

Once the redesign + multi-language land, work the remaining items in
this order: news engine → financial tool expansion → dark theme polish
→ PWA / mobile install. Each is independently described below; they're
intentionally sequenced so revenue-activating work (news engine
captures search demand the redesign + i18n have unlocked) lands first.

---

### 1. Real-time financial news → article engine 🟡 HIGH LEVERAGE

**Concept:** Monitor niche news (SEBI/RBI/Budget/Finance Ministry/BSE/NSE/
major bank announcements/tax notifications). When a relevant event fires,
auto-generate + auto-publish a detailed article within minutes. Goal: be
first to rank on "what happened today in Indian finance".

Why it's credible for InvestingPro: most of the infra already exists.
- Article generator: `lib/automation/article-generator.ts` (multi-LLM failover)
- Topic pipeline: `scripts/data/topics.json` + `auto-generate-batch.ts`
- Desk assignment: `lib/data/team.ts` (7 desks, auto-selected by category)
- Publish path: `articles` table + ISR + sitemap auto-emit

What's missing:
- **News ingestion** — RSS/scrape feeds: SEBI press releases, RBI circulars,
  Budget live, Finance Ministry notifications, BSE/NSE announcements,
  income-tax notifications, major bank PR feeds.
- **Event classifier** — LLM filter: is this event relevant + which category?
  (investing/banking/taxes/credit-cards/insurance/loans/learn)
- **Velocity gate** — publish within N minutes of event detection.
  Human-in-loop review vs auto-publish: probably auto-publish for
  regulatory events (factual), human review for speculative ("stocks to
  watch") — avoids SEBI advisory violations.
- **Speed-to-rank tactic** — submit immediately to IndexNow (already set
  up per `app/robots.ts`) + Bing Webmaster ping + social broadcast via
  Telegram/WhatsApp channels (already configured).

Risk: SEBI Regulation on Research Analysts (RA). Factual news coverage ≠
research/recommendation, but the line matters. Editorial guardrails
required before auto-publish on market-moving events.

### 2. Financial calculator / tool expansion

Each is a SEO-pillar-page candidate — dedicated URL + schema + guide.

- **Mutual fund overlap calculator** — upload 2+ MF holdings, show
  portfolio overlap %, redundancy warnings. High search intent. Public
  data via AMFI/Value Research scrape or paid API.
- **Tax regime simulator** — already exists (`/calculators/old-vs-new-tax`).
  Extend: upload Form 16 + FY outcomes comparison, multi-year projection.
- **Tax pre-filing draft from uploaded documents** — user uploads Form 16
  / AIS / 26AS / bank statements; AI extracts + drafts ITR sections.
  Differentiator vs ClearTax: free + detailed explanation of each field.
  Privacy-critical — needs ephemeral storage + clear data deletion policy.
  Likely Vercel Sandbox + OpenAI vision for extraction.
- **Other gaps to survey:** F&O P&L simulator, CAGR from CAS/capital-gains
  statement, REIT-vs-direct-property cashflow, SWP longevity, lifecycle
  portfolio allocation (Boglehead 3-fund India equivalent).

### 3. Multi-language programmatic expansion

NOT just translation of existing pages. Generate original
language-specific content at build time so each language is SEO-first-
class (not a `lang=` subdomain afterthought).

- **Priority markets:** Hindi (largest), then Telugu, Tamil, Marathi,
  Gujarati, Bengali, Kannada, Malayalam, Punjabi.
- **Architecture:** route group `app/(intl)/[locale]/…` with 1 tree per
  locale. Article + glossary content generated via LLM with
  region-specific examples (Mumbai tenant rent ≠ Bengaluru rent). English
  version stays the default source of truth.
- **Rollout phase:** Hindi first — `hi-IN` locale, ~50 pillar articles
  translated + localized. Schema `inLanguage`, hreflang tags, dedicated
  `/hi/sitemap.xml`. NerdWallet doesn't do this — meaningful moat.

### 4. Dark theme polish

Infrastructure already exists (next-themes, CSS vars, `.dark` class,
light-first default). What's missing:
- Audit every v3 listing/detail page for dark-mode token usage (some
  still have hardcoded `bg-white` / `text-gray-900` instead of
  `bg-background` / `text-foreground`)
- Verify charts in calculators render legibly on dark canvas
- Verify images — featured images don't have white edges that look
  broken on dark surface
- Add theme toggle to navbar (was deferred in earlier session — see
  memory "Future Navbar Features")

### 5. PWA / mobile optimization

- **PWA manifest** — already exists at `public/manifest.json` with old
  gradient icons. Regenerate with v3 ink+gold monogram.
- **Install prompt** — show a dismissible "Install InvestingPro" strip
  on mobile, bottom-right, respects `beforeinstallprompt` event.
- **Link from Footer** — "Install App" column entry in the footer (user
  called this out specifically).
- **Offline read** — service worker caches the last 10 articles the user
  viewed for offline read. Low lift, high retention signal.
- **iOS Add to Home Screen** polish — apple-touch-icon, manifest.json
  name + short_name, status bar color match v3 ink.

---

## Notes

- When a manual action completes, mark `[x]` inline + add date.
- When a new blocker surfaces, append here with phase + priority.
- This file should never exceed 300 lines — consolidate completed items into a "Done" appendix quarterly.
