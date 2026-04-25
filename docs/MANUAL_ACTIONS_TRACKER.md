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
> User principle: "no hard coded articles or products, route everything through cms, db, front end". Counts shown to users (X cards, X guides) look immature — strip from user-facing pages, keep in admin dashboard only.

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
- [ ] 🔴 Google Search Console — connect + submit sitemap (https://search.google.com/search-console). **Gated on Phase 3a canonical flip completing** — indexing `/articles/` while `/[cat]/learn/` is canonical causes duplicate-content hits.
- [ ] 🟡 Request manual indexing on top 10 articles once Phase 3a ships.

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

## Phase 3 — Canonical flip + redirects

- [ ] 🔴 Decide: keep `/articles/[slug]` → redirect OR leave as canonical
  → NerdWallet uses `/[cat]/learn/[slug]` as canonical; we'd redirect `/articles/` → new URL
  → Risk: any existing external backlinks break (mitigated by 301)
- [ ] 🟡 Review + approve `next.config.ts` redirect block before deploy
  → Will contain ~200 route redirects (every product detail, article, calc, best-of, compare page)
- [ ] 🟡 Update internal link generators
  → `lib/linking/engine.ts` (auto-links within article content)
  → `lib/glossary/link-generation.ts` (glossary auto-link)
  → `components/layout/Footer.tsx` — 70+ SEO links
  → `components/layout/Navbar.tsx` + mega-menu
  → Requires one-time find/replace pass

---

## Phase 4 — Sitemap + GSC submission

- [ ] 🔴 Submit sitemap to Google Search Console
  → **Gate: do NOT submit until Phase 3 complete** — indexing disconnected v1/v2 pages hurts ranking more than delay
  → URL: https://search.google.com/search-console
  → Submit `https://www.investingpro.in/sitemap.xml`
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

## Notes

- When a manual action completes, mark `[x]` inline + add date.
- When a new blocker surfaces, append here with phase + priority.
- This file should never exceed 300 lines — consolidate completed items into a "Done" appendix quarterly.
