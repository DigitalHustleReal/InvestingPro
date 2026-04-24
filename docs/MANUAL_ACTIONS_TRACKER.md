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

### Calculator nesting (Phase 2b)
- [ ] 🟡 Approve calculator-to-category mapping
  → 75 calculators flat today; NerdWallet nests per category
  → E.g. `sip` → `/investing/calculators/sip`, `emi` → `/loans/calculators/emi`, `hra` → `/taxes/calculators/hra`
  → Mapping is obvious for most but some (like `cagr`, `compound-interest`) could live under `/learn/calculators/`

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
