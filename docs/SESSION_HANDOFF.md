# Session Handoff — 2026-04-25

> **Purpose:** Hand off context after `/clear`. Read this first; the rest
> of the project state is reachable from the pointers below.

---

## TL;DR

Multi-day session shipped:

- **P0 audit fixes** (5/5)
- **Phase 2 NerdWallet URL migration** complete (learn/, reviews/, calculators/ across 7 categories)
- **GEO score 28 → 62/100** (live llms.txt, robots.ts flipped to allow GPTBot/ClaudeBot)
- **404 redesign** + **affiliate link routing** end-to-end working
- **FAQ content migrated to Supabase** (`category_faqs` table, 59 rows) — proof of "everything routes through CMS" principle
- **Branding** — InvestingPro India unified channel label, v3 favicon

Branch `claude/vibrant-lovelace-875415` has **20 commits**, fully pushed.

PR ready to open: https://github.com/DigitalHustleReal/InvestingPro/pull/new/claude/vibrant-lovelace-875415

Companion branch `claude/eager-boyd-6d7f83` has the **40-cron GitHub Actions migration** — also pushed.
PR: https://github.com/DigitalHustleReal/InvestingPro/pull/new/claude/eager-boyd-6d7f83

---

## Architectural principles locked this session

These are the meta-rules. Every future change should respect them.

### 1. NerdWallet-style category-nested URLs (in flight)

Routes already shipped in Phase 2 — currently redirect to flat canonicals,
**Phase 3a flips that direction**:

```
/[cat]/learn/         → category editorial hub (article list)
/[cat]/learn/[slug]   → article detail (today: 308 → /articles/[slug])
/[cat]/reviews/[slug] → product detail (today: 308 → /credit-cards/[slug] etc.)
/[cat]/calculators/   → per-category calculator hub
/[cat]/calculators/[slug] → calculator (today: 308 → /calculators/[slug])
```

7 URL categories: `credit-cards`, `loans`, `banking`, `investing`,
`insurance`, `taxes`, `learn`. Mapping in `lib/routing/category-map.ts`.

### 2. Route everything through CMS / DB

> Every piece of content shown on the public site flows through the CMS /
> database — even content I (Claude) generate manually inside a session.
> Code-resident content arrays are an anti-pattern.

Pattern proven for FAQs: migration → seed → DB-first accessor with
React.cache → static fallback for resilience. Apply same pattern to
remaining content arrays (CMS-MIGRATION TODOs in code).

### 3. No platform-stat counts on user-facing pages

"X cards", "Y guides", "Z calculators" shown to end users looks immature.
Counts belong on `/admin/dashboard` (TBD), not public pages.
`/llms.txt` keeps live counts because that's for AI crawlers, not humans.

### 4. v3 design tokens only

6 tokens — ink (`#0A1F14`), authority-green, action-green, indian-gold
(`#D97706`), canvas (`#FAFAF9`), warning-red. Emphasis = indian-gold
(never action-green). Playfair Display (headlines), Inter (body),
JetBrains Mono (data). `rounded-sm` max, no gradients (except hero), no
glassmorphism, no `shadow-lg`, no scale-transforms. Forbidden classes:
cyan/teal/sky/purple/indigo/pink/rose/fuchsia/violet/blue-N.

### 5. Sitemap submission gated on design completion

Don't submit to GSC / Bing until Phase 3a flips canonical AND remaining
v1/v2 pages are addressed. Indexing inconsistent UI hurts more than delay.

---

## Stack reminders (from CLAUDE.md, abbreviated)

- Next.js 16.1 (App Router, Turbopack), React 19, TypeScript 5
- Tailwind 4 + shadcn/ui + Radix
- Supabase (Postgres + Auth + RLS) — project ref `txwxmbmbqltefwvilsii`
  (use `supabase-alt` MCP, NOT the primary `1779ad4e…` MCP which only
  sees inactive Conduit project)
- Vercel deploy on push to `master`
- Multi-LLM failover in `lib/ai-service.ts` (FROZEN)

FROZEN files (don't edit without explicit ask): `app/calculators/**`,
`lib/env.ts`, `lib/ai-service.ts`, `lib/calculators/**`,
`tailwind.config.ts`.

---

## Skills + MCPs in use (auto-invoked, no need to specify)

This session proactively used:
- `claude-seo:seo-geo` — GEO audit (produced the 28 → 62 score)
- `claude-seo:seo-schema` — caught canonical URL mismatches
- `vercel:react-best-practices` — flagged `React.cache` opportunity
- `supabase-alt` MCP — schema lookups, count queries, migrations, seeds
- `Claude_Preview` MCP — dev server + screenshots
- `playwright` MCP (limited — used Claude_Preview instead due to crashes)

Next session: don't re-specify these. They'll fire automatically when the
task matches. Hint only when you want a specific one (e.g.
"`claude-seo:seo-audit` on the live URL post-deploy").

---

## What's next — three options, ranked by impact

### A. Phase 3a canonical flip (biggest SEO/GEO win)

Inverts the redirect direction so NerdWallet URLs become canonical.
Unblocks GSC sitemap submission.

- **Plan:** [docs/PHASE_3A_EXTRACTION_PLAN.md](./PHASE_3A_EXTRACTION_PLAN.md)
- **Effort:** 4–6 focused hours, 5 commits
- **Risk:** Touches production-rendering article code (300+ line refactor)
- **Blocks:** Phase 4 sitemap submission, AdSense approval

### B. Continue CMS content migration (extends locked principle)

Apply the FAQ pattern to remaining hardcoded content arrays:

- `editorial_facts` table → `app/not-found.tsx` "Did You Know" hooks
- `calculators` reference table → `components/routing/CategoryCalculatorsHub.tsx`
  CALC_META (70+ entries) + `CALCULATOR_CATEGORY` map
- `tax_data` table → `app/taxes/page.tsx` slabs/deductions/key-dates
- `editorial_hubs` table → `/not-found` `TOP_HUBS` + `TOP_CALCULATORS`

Each is 30–60 min following the FAQ template
([lib/content/faqs.ts](../lib/content/faqs.ts) + the
`create_category_faqs` migration). Build admin UI under
`/admin/{faqs,calculators,tax-data,editorial}` once enough tables exist.

### C. Author/Desk bylines (GEO + E-E-A-T)

Wire `lib/data/team.ts` (7 desks) into glossary detail + 6 category hubs.
Add `Person` JSON-LD + visible "Reviewed by [Desk]" line. ~2 hours.
Direct GEO impact.

### D. Visible-counts cleanup on literal hub pages

Audit `/credit-cards`, `/loans`, `/banking`, `/investing`, `/insurance`
literal hubs for hardcoded "X cards", "Y products" copy. Already done
for new v3 routes.

---

## Key file pointers

### Routing + URL structure
- `lib/routing/category-map.ts` — single source of truth (URL_CATEGORIES, DB_TO_URL, PRODUCT_REVIEW_TABLES, CALCULATOR_CATEGORY)
- `app/[category]/learn/page.tsx` + `[slug]/page.tsx` — dynamic learn routes
- `app/[category]/reviews/[slug]/page.tsx` — product review redirects
- `app/[category]/calculators/page.tsx` + `[slug]/page.tsx` — calculator routes
- 6 literal overrides at `app/{credit-cards,loans,insurance}/{learn,calculators}/page.tsx` — defeat [slug] conflict

### Shared Server Components
- `components/routing/CategoryLearnHub.tsx` + `buildCategoryLearnMetadata`
- `components/routing/CategoryCalculatorsHub.tsx` + `buildCategoryCalculatorsMetadata`
- `components/routing/CategoryFAQ.tsx` (async, DB-first)

### CMS content
- Supabase table: `category_faqs` (59 rows seeded)
- `lib/content/faqs.ts` — runtime accessor (DB → static fallback)
- `lib/content/faq-data.ts` — static fallback + seed source

### Plans + trackers
- [docs/MANUAL_ACTIONS_TRACKER.md](./MANUAL_ACTIONS_TRACKER.md) — every
  pending human/manual action grouped by phase
- [docs/URL_STRUCTURE_NERDWALLET.md](./URL_STRUCTURE_NERDWALLET.md) — full
  4-phase route migration plan
- [docs/PHASE_3A_EXTRACTION_PLAN.md](./PHASE_3A_EXTRACTION_PLAN.md) — the
  canonical flip blueprint
- `.claude/prompts/session-2-phase-2-design.md` — Layer B agent roster
  prompt (separate workstream — agent mesh)

### Branding
- `app/icon.tsx` + `app/apple-icon.tsx` — v3 favicon (ink + indian-gold "IP")
- `components/layout/Footer.tsx` — Telegram + WhatsApp channels labeled
  "InvestingPro India"

### GEO infrastructure
- `app/llms.txt/route.ts` — concise variant per llmstxt.org spec
- `app/llms-full.txt/route.ts` — extended index with all article slugs
- `app/robots.ts` — 2026 policy (allows GPTBot, ClaudeBot, OAI-SearchBot)
- `app/not-found.tsx` — v3 with "Did You Know" data hooks

### Affiliate
- `app/go/[slug]/route.ts` — chain-resolve across all product tables
  (affiliate_links → products → credit_cards → loans → insurance → brokers)
- `app/api/out/route.ts` — id-based tracking (legacy, consolidation TODO)

---

## Manual actions still pending (high-priority extract)

From `docs/MANUAL_ACTIONS_TRACKER.md` — full list there.

🔴 **Critical (blocks automation / revenue)**
- Add `CRON_SECRET` to GitHub Actions Secrets (40 crons sit at 401 until done)
- Open + merge cron-migration PR (`claude/eager-boyd-6d7f83`)
- Open + merge this branch's PR (`claude/vibrant-lovelace-875415`)
- Apply schema fix for `update-intelligence` cron (5 phantom tables)
- Wire Draft→Publish bridge agent (228 published, 28 drafts, zero auto-promote since Apr 17)

🟡 **Phase / SEO blockers**
- Phase 3a canonical flip (Option A above) → unblocks GSC submission
- FAQ blocks already on hubs ✓ — extend to `/credit-cards`, `/loans` literal hubs (TBD)
- Author/Desk bylines (Option C above)
- Brand-mention surface — Wikipedia, YouTube, Reddit, LinkedIn (3× stronger AI-citation correlation than backlinks)

🟢 **Ongoing CMS migration (Option B above)**

---

## How to start cleanly after `/clear`

Paste this into the next session:

```
Read docs/SESSION_HANDOFF.md and docs/MANUAL_ACTIONS_TRACKER.md.

I want to continue: [pick one — A / B / C / D from the handoff].

Use skills + MCPs proactively (you don't need me to name them).
Worktree is at .claude/worktrees/vibrant-lovelace-875415.
Branch is up to date with origin.
```

That gives the new session enough to find everything else without
re-loading this entire context window.
