# Layer A Audit — 2026-04-24

> Session 1 deliverable. Read-only audit of runtime agent infrastructure at `lib/agents/**/*.ts`, Vercel cron, admin observability UIs, and automation hooks. No code modified except CLAUDE.md (drift fixes) and this file.

## Summary

| Metric | Count |
|---|---|
| Total runtime agents | **34** |
| WIRED | **34** (11 via cron, 18 via CMSOrchestrator, 3 base/helper, 1 nested via TrendAgent, 1 helper provider) |
| SCAFFOLDED (dormant) | **0** |
| DEAD (stub/broken) | **0** |
| Admin UIs reading real data | **13 of 14 sampled** |
| Admin UIs hardcoded | **1** (`/admin/agents` — uses `INITIAL_AGENTS` const) |
| Active scheduled triggers | **40 Vercel crons** + 1 git pre-commit hook |
| Inactive route files (crons not scheduled) | 2 (`import-rss-news`, `update-gold-prices`) |
| Inngest functions | **0** (client is a stub) |
| Webhook routes | **0** (`/api/webhooks/**` does not exist) |

**Core headline:** Layer A exists and is fully plumbed. What we don't know is whether it's *firing* in production — the cron schedules are declared in `vercel.json`, but without Vercel logs / Sentry access we can't confirm execution. That's the single biggest blocker for Session 2 to address.

## Drift fixes applied to CLAUDE.md

| # | Drift | Resolution |
|---|---|---|
| 1 | §2 claimed "Tailwind CSS 4" | Corrected to **3.4.17** (per `package.json`) |
| 2 | §2 missing Inngest status | Added "Inngest package installed but NOT WIRED — lib/inngest/client.ts is a stub" |
| 3 | §2 missing scheduler info | Added "Scheduler: Vercel Cron (40 scheduled jobs)" |
| 4 | §2 AI provider chain missed Anthropic | Extended failover chain to include Anthropic + noted @cloudflare/ai, @google/genai, replicate, groq-sdk |
| 5 | §2 missing pre-commit hook description | Added "Husky pre-commit → type-check + lint-staged (NO design-token enforcement yet)" |
| 6 | §4 file structure missed `lib/agents/`, `lib/automation/`, `lib/orchestration/`, `lib/workers/`, `lib/jobs/`, `lib/queue/`, `lib/inngest/`, `lib/workflows/`, and expanded api routes | Rewrote file structure map with all of these |
| 7 | §4 file structure had no admin-route detail | Added full admin route enumeration (inline) + new §14 "Admin Panel Map" |
| 8 | Missing Runtime Agent System documentation | Added new §12 with full 34-agent taxonomy (swarm vs orchestrator vs watcher vs helper) |
| 9 | Missing scheduling inventory | Added new §13 with all 40 cron categories, stub Inngest warning, hook status |
| 10 | `/admin/agents` claimed to be functional | Flagged in §14 as **HARDCODED** with remediation note |
| 11 | §12 "Session Efficiency Rules" had ambiguous numbering | Renumbered to §15 (now the tail) |
| 12 | Missing brainstorm.md reference in structure | Added at end of tree |

All drift fixes preserved existing CLAUDE.md structure, tone, and FROZEN-file markers.

## Runtime agent inventory

### Swarm agents (11) — `lib/agents/swarm/` — WIRED via Vercel cron

| Path | Class | Cron route | Triggers | Deps | Blockers |
|---|---|---|---|---|---|
| `content-scout-agent.ts` | WIRED | `/api/cron/agent-content-scout` | Vercel cron 2:00 AM IST | Multi-AI, Supabase, Google Trends | none |
| `serp-analyst-agent.ts` | WIRED | `/api/cron/agent-serp-analyst` | Vercel cron 3:00 AM/PM | Multi-AI, SerpAPI, Supabase | SerpAPI key |
| `content-architect-agent.ts` | WIRED | `/api/cron/agent-content-architect` | Vercel cron 4:00 AM/PM | Multi-AI, Supabase | none |
| `writer-agent.ts` | WIRED | `/api/cron/agent-writer` | Vercel cron 6:30 AM/PM | Multi-AI, Supabase | none |
| `editor-agent.ts` | WIRED | `/api/cron/agent-editor` | Vercel cron 8:00 AM/PM | Multi-AI, Supabase | none |
| `publisher-agent.ts` | WIRED | `/api/cron/agent-publisher` | Vercel cron 10:00 AM | Supabase | `auto-publish` flag in autonomy config |
| `distribution-agent.ts` | WIRED | `/api/cron/agent-distribution` | Vercel cron 10:30 AM | Twitter, LinkedIn, Supabase | Social OAuth tokens |
| `seo-agent.ts` | WIRED | `/api/cron/agent-seo` | Vercel cron 6:00 AM | DataForSEO / SerpAPI, Supabase | SEO API credentials |
| `data-agent.ts` | WIRED | `/api/cron/agent-data` | Vercel cron 1:00 AM | Yahoo Finance, Supabase | none |
| `analytics-agent.ts` | WIRED | `/api/cron/agent-analytics` | Vercel cron 3:30 AM | PostHog, GA4, Supabase | PostHog/GA credentials |
| `supervisor-agent.ts` | WIRED | `/api/cron/agent-supervisor` | Vercel cron 5:30 AM | Supabase (meta-orchestrator) | none |

Base class: `swarm/base-swarm-agent.ts` (WIRED as parent of all 11 above).

### Classic agents (18) — `lib/agents/` — WIRED via CMSOrchestrator

All 18 are instantiated in `CMSOrchestrator` constructor (`lib/agents/orchestrator.ts:76-96`). Consumers of `CMSOrchestrator`:
- `/api/cms/orchestrator/execute/route.ts`
- `/api/cms/orchestrator/continuous/route.ts`
- `/api/cms/orchestrator/canary/route.ts`
- `/api/content-pipeline/route.ts`
- `lib/workers/pipelineWorker.ts`
- `lib/orchestration/continuous-mode.ts`
- `lib/jobs/content-publishing.ts`
- `lib/automation/keyword-content-generator.ts`
- `scripts/initialize-cms.ts` + `scripts/test-pipeline-e2e.js`

| Path | Class | Additional direct triggers | Deps | Blockers |
|---|---|---|---|---|
| `trend-agent.ts` | WIRED | `lib/automation/content-pipeline.ts` | RSS/Yahoo/Google Trends, Supabase | none |
| `keyword-agent.ts` | WIRED | orchestrator only | DataForSEO, `providers/google-autocomplete.ts`, Supabase | none |
| `strategy-agent.ts` | WIRED | orchestrator only | Imports FeedbackLoop + EconomicIntelligence | none |
| `content-agent.ts` | WIRED | orchestrator only | Multi-AI, Supabase | none |
| `image-agent.ts` | WIRED | orchestrator only | Replicate, Cloudinary, Grok (external) | Replicate/Cloudinary keys |
| `quality-agent.ts` | WIRED | orchestrator only | Multi-AI, Supabase | none |
| `publish-agent.ts` | WIRED | orchestrator only | Imports RiskCompliance, Supabase | none |
| `tracking-agent.ts` | WIRED | orchestrator only | Supabase (analytics_events) | none |
| `repurpose-agent.ts` | WIRED | orchestrator only | Multi-AI, Supabase | none |
| `social-agent.ts` | WIRED | orchestrator only | Twitter/LinkedIn APIs | OAuth tokens |
| `affiliate-agent.ts` | WIRED | orchestrator only | Cuelinks, EarnKaro, Supabase | none |
| `feedback-loop-agent.ts` | WIRED | Also imported by strategy-agent | Supabase (ai_persona_performance) | none |
| `scraper-agent.ts` | WIRED | Also `/api/cms/scrapers` | Cheerio, Supabase | none |
| `bulk-generation-agent.ts` | WIRED | orchestrator only | Multi-AI, Supabase | none |
| `budget-governor-agent.ts` | WIRED | Also `/api/cms/budget` | Supabase (cost tracking) | none |
| `risk-compliance-agent.ts` | WIRED | Also imported by publish-agent | Multi-AI, Supabase | none |
| `economic-intelligence-agent.ts` | WIRED | Also imported by strategy-agent | RSS, Yahoo Finance | none |
| `health-monitor-agent.ts` | WIRED | Also `/api/cms/health` | Supabase | none |

Base class: `base-agent.ts` (WIRED as parent of all 18 above).

### Specialized + helper (4)

| Path | Class | Triggers | Notes |
|---|---|---|---|
| `market-event-watcher.ts` | WIRED (nested) | Imported only by `trend-agent.ts` | Monitors Yahoo/Moneycontrol/ET RSS + Google Trends → generates content angles from Nifty moves, RBI rates, budget |
| `base-agent.ts` | WIRED (base) | Parent of 18 classic agents | — |
| `swarm/base-swarm-agent.ts` | WIRED (base) | Parent of 11 swarm agents | Provides `runWithHeartbeat()` used by all cron handlers |
| `providers/google-autocomplete.ts` | WIRED (helper) | Used by `keyword-agent.ts` | Non-agent utility |

### Total classification: 34 / 34 WIRED, 0 SCAFFOLDED, 0 DEAD

## Admin UI reality

| Route | Status | Data source | Notes |
|---|---|---|---|
| `/admin/agents` | **HARDCODED** | `INITIAL_AGENTS` const in component | Decorative only. No real backend wiring. Redundant with `/admin/swarm-dashboard`. |
| `/admin/swarm-dashboard` | REAL | Supabase direct (heartbeat, pipeline, queues, articles_pending) | Founder's single pane of glass. Works. |
| `/admin/autonomy` | REAL | `/api/admin/autonomous` | — |
| `/admin/autonomy/settings` | REAL | `/api/admin/autonomy/config` | Confidence thresholds, category rules, rate limits (10/hr, 50/day default) |
| `/admin/ai-personas` | REAL | Supabase view `ai_persona_performance` | Revenue / articles / SEO ranked per persona |
| `/admin/ops-health` | REAL | `/api/admin/ai/metrics`, `/api/admin/cache/stats` | Circuit breaker state, cache ratio, provider latency |
| `/admin/strategy` | REAL | `/api/admin/strategy/gaps` | Content gap analysis, category coverage |
| `/admin/revenue/intelligence` | REAL w/ mock fallback | `/api/v1/admin/revenue/predictions` | Gracefully degrades to mock data if endpoint missing |
| `/admin/pipeline-monitor` | REAL | `/api/pipeline/runs`, `/api/pipeline/metrics` | 5-sec poll for live activity |
| `/admin/performance-dashboard` | REAL | `/api/performance/metrics` | — |

## Scheduling inventory

### Vercel Cron (40 active jobs in `vercel.json`)

All schedules authenticated via `Authorization: Bearer ${CRON_SECRET}`.

| Category | Count | Jobs |
|---|---|---|
| **Swarm agents** | 11 | agent-content-scout, agent-writer, agent-editor, agent-publisher, agent-distribution, agent-serp-analyst, agent-content-architect, agent-seo, agent-data, agent-analytics, agent-supervisor |
| **Content lifecycle** | 8 | daily-content-generation, content-refresh, content-strategy, content-sense, publish-scheduled, process-pipeline, content-distribution, email-sequences |
| **Data sync** | 8 | update-rbi-rates, sync-amfi-data, sync-legal-products, update-intelligence, weekly-data-update, check-data-freshness, check-data-changes, scrape-credit-cards |
| **SEO / rankings** | 4 | seo-rankings-update, sync-rankings, check-rankings-drops, sitemap-ping |
| **Cost / budget** | 3 | check-cost-alerts, daily-cost-report, record-table-sizes |
| **Revenue / analytics** | 2 | daily-revenue-report, analytics-sync |
| **Link health** | 1 | check-links (Sun 21:30 UTC, uses `lib/automation/link-checker`) |
| **Ops / media** | 3 | cleanup, archive-data, generate-missing-images |

### Cron routes that exist but are NOT scheduled
- `/api/cron/import-rss-news/route.ts`
- `/api/cron/update-gold-prices/route.ts`

These are wired as Next.js routes but missing from `vercel.json` — either an omission or deprecated. Recommend: audit intent, then either add to `vercel.json` or delete.

### Inngest — STUB, not functional
- `lib/inngest/client.ts` returns no-op functions
- 26 files import from this stub (they compile but do nothing on `.send()` or `.createFunction()`)
- `inngest` npm package installed at `3.49.1` — real client not initialized
- **Implication:** any code that relies on Inngest for durable workflows is silently non-functional

### Git hooks — `.husky/pre-commit`
```sh
npm run type-check
npx lint-staged
```
No design-token enforcement, no schema validation, no brand-rule check. Design Guardian agent will extend this in Session 4.

### Webhooks
No `/api/webhooks/**` directory. Stripe/email/other webhook handlers, if any, live elsewhere.

## Recommendations for Phase 2 (Session 2 input)

### Tier 1 — verify execution (no code changes)
Before building Layer B, we must answer: **are the 40 cron jobs actually running?** This needs:
1. Access to Vercel deployment logs (Vercel MCP or dashboard export)
2. Access to Sentry error feed (to see if agents are throwing in prod)
3. Supabase queries against `ai_persona_performance`, `pipeline_runs`, `agent_runs` (if exists), or heartbeat tables used by `/admin/swarm-dashboard`

**This is the single biggest blocker. Without it, Session 2 designs blind.**

### Tier 2 — highest-ROI wiring gaps (Layer B should address)
None of Layer A is scaffolded, so there's no "activate" work — it's all "verify + optimize + supervise". Gaps that require Layer B effort:

1. **`/admin/agents` → real data** — hardcoded `INITIAL_AGENTS` should be replaced by a query against the swarm heartbeat tables. Either wire it, or delete in favor of `/admin/swarm-dashboard`. (Effort: ~1 hr)
2. **Inngest decision** — wire it properly, or delete the 26 import sites and clean up the dependency. Current state is confusing and silently broken. (Effort: 2 hr — decision + cleanup)
3. **Unscheduled cron routes** — `import-rss-news` and `update-gold-prices` exist as routes but not in `vercel.json`. Schedule or delete. (Effort: 15 min)
4. **Design Guardian pre-commit hook** — extend `.husky/pre-commit` to block banned design tokens. (Effort: 1 hr, Session 4)
5. **Missing `lib/schema/` generators** — no dynamic JSON-LD generator; articles have FAQ schema per brainstorm.md but no systematic coverage. (Effort: Session 4)
6. **Layer B supervisor agent** — new Claude Code agent that reads `/admin/swarm-dashboard`, `/admin/ops-health`, Sentry, and Vercel logs to surface "what's broken in Layer A this week". This is the single highest-leverage dev agent. (Effort: Session 5)

### Tier 3 — nice-to-have
- Consolidate the 4 content-pipeline implementations (`orchestrator`, `swarm`, `content-pipeline.ts`, `continuous-mode.ts`) — multiple overlapping systems, clarify canonical path
- Migrate the `lib/queue/` experimental jobs to production or delete
- Document `/api/content-pipeline/route.ts` vs `/api/cms/orchestrator/*` — overlapping surface

## Critical blockers requiring user action before Session 3

1. **🔴 Vercel logs / Sentry access for Claude Code** — without this, we can't tell if Layer A is alive or dead. Either install Vercel MCP + give Claude Code Sentry token, OR paste a snapshot of the last 7 days of cron execution logs into `docs/audits/layer-a-execution-snapshot-2026-04-24.md` for Session 2 input.
2. **🔴 Supabase MCP connection** — per brainstorm.md §4 "Connect InvestingPro Supabase project to MCP so future sessions can query DB directly" is already on the pending list. This is now a hard blocker for Session 2/3 — without it, we can't inspect `ai_persona_performance`, `pipeline_runs`, affiliate_clicks, or the heartbeat tables that power `/admin/swarm-dashboard`.
3. **🟡 Decide Inngest policy** — wire it or remove it. Current stub state is actively misleading.
4. **🟡 Confirm `CRON_SECRET` is set on Vercel** — brainstorm.md says it is; re-verify if any cron returns 401.

## Appendix — surprises and open questions

### Surprises
1. **Nothing is SCAFFOLDED or DEAD** — my earlier estimate (in prior chat conversation) that "30 of 34 may be dead" was wrong. The orchestrator pattern means every agent is at least wired into a code path that runs.
2. **Inngest is a silent non-functional stub** despite 26 import sites. This is worse than "not installed" because imports give false confidence that durable workflows exist.
3. **Four parallel content pipelines** exist: (a) orchestrator, (b) swarm via cron, (c) `lib/automation/content-pipeline.ts`, (d) `lib/orchestration/continuous-mode.ts`. These likely overlap in responsibility — a code smell, but not a bug.
4. **`/admin/agents` is a Potemkin dashboard** — hardcoded seed data. The real agent dashboard is `/admin/swarm-dashboard`, which is wired.
5. **No webhooks directory.** Any third-party integrations that *should* use webhooks either use polling, OAuth callbacks, or aren't implemented.
6. **Pre-commit hook has no design-lock enforcement** — the v3 design system is protected only by social convention + code review. Session 4's Design Guardian fills this gap.

### Open questions for Session 2
- Are any of the 40 cron jobs throwing errors in production? (Needs Vercel logs)
- Is `auto-publish` currently live (flag in `/admin/autonomy/settings`)? What's the dry-run state?
- Is `CRON_SECRET` identical across all Vercel environments (preview + production)?
- Are the "4 parallel content pipelines" intentional redundancy or accidental overlap?
- What happens when `publisher-agent` runs with `auto-publish: false` and `dry-run: true`? (Needs log sample)
- Does `/admin/ai-personas` actually have rows in `ai_persona_performance`? (Proves the persona tracking loop is closed)

### References
- Prior audits in memory (useful context for Session 2):
  - `#1270` (2026-04-08) "Automated Agent Pipeline with Scheduled Cron Jobs"
  - `#1521` (2026-04-15) "Environment Configuration and Automated Cron Job Infrastructure Verified"
  - `#1529` (2026-04-15) "Comprehensive SEO & Distribution Infrastructure Audit"
  - `#2291` (2026-04-24) "Existing agent architecture with 34 agents and swarm orchestration infrastructure"
- Relevant codebase docs: `docs/audits/FULL_LIFECYCLE_OPERATIONAL_AUDIT.md`, `docs/BRUTAL_TRUTH_AUDIT_2026.md`, `docs/ARCHITECTURE_DOCUMENTATION.md`

---

## Session 1b addendum — 2026-04-24, post-MCP-restart (Vercel verified, Supabase pending)

### 🔴 CRITICAL — Production cron execution reality check

Pulled 30 days of Vercel runtime logs on `prj_RUFFiaXR6gGuebGtilt8E3eueEnd` (production, team `InvestingproIndia's projects`).

**Query:** `/api/cron` — any path matching.
**Window:** 2026-03-25 → 2026-04-24 (30 days).
**Total cron invocations captured:** **1**.

```
| Time     | Method | Path                            | Status |
|----------|--------|---------------------------------|--------|
| 02:24:08 | GET    | /api/cron/update-intelligence   | 200    |
```

**That is the entire production cron activity for the last 30 days.** Zero agent-cron fires (none of the 11 `/api/cron/agent-*` paths). Zero daily-content-generation. Zero publish-scheduled. Zero check-links. Zero daily-revenue-report. **Nothing.**

Error log check (7 days, level: error|fatal) also returned **zero entries**. So the platform isn't crashing — it's simply not running the crons it's declared.

### Root cause (highly likely)

**Vercel Hobby-tier cron limit.** Current project plan is **Hobby** (confirmed from dashboard screenshot in session 2026-04-24). Vercel Hobby currently allows **2 cron jobs** per project. `vercel.json` declares **40**. The platform silently accepts the extras during deploy but only actually schedules a tiny subset.

**Verification step for user (manual):** Vercel Dashboard → `investing-pro` project → Settings → **Cron Jobs** tab. Expect to see 1–2 jobs listed, with the remaining 38–39 either missing or marked inactive.

### Business impact

| Claim in CLAUDE.md / brainstorm.md | Production reality |
|---|---|
| "34 wired runtime agents" | True in code. 0 actually running on any schedule. |
| "11 swarm agents run on cron: ContentScout 2AM, Writer 6:30AM/PM, Editor 8AM/PM, Publisher 10AM, Distribution 10:30AM, …" | Not running. None have fired in 30 days. |
| "Autonomous content factory" | Aspirational. No articles are being auto-generated, edited, or published by agents. |
| "Content velocity via WriterAgent + EditorAgent" | Dead. All recent articles (228 published) were created via manual `npm run generate:content` script runs, not the agent swarm. |
| "SEO rankings update daily, SERP analyst runs twice daily" | Dead. No SERP data is being collected automatically. |
| "Affiliate tracking + budget governor + health monitor via cron" | Dead. All manual or user-request-triggered. |
| "40 scheduled jobs" | 2 scheduled at most. 38+ are declared-but-dead. |

### Fix options (pre-Session 2 blocker)

**A. Upgrade to Vercel Pro (~$20/month, 5-minute unlock).** Pro tier allows unlimited cron jobs. Cheapest and fastest path — entire Layer A goes live without any code changes. Current revenue target (₹3.9L/mo) justifies this trivially.

**B. Consolidate 40 crons → 2 meta-crons.** Write `/api/cron/meta-hourly` and `/api/cron/meta-daily` that internally dispatch to handlers based on current time. Preserves Hobby plan. Architectural cost: 1 session of refactor. Loses per-job Vercel observability.

**C. Move scheduling to GitHub Actions** (free, unlimited). `.github/workflows/cron-*.yml` files POST to existing `/api/cron/*` endpoints with the `CRON_SECRET` header. No code changes to handlers. Cost: ~1 hour setup + keeps handlers intact. Side benefit: schedules survive if you ever leave Vercel.

**Recommendation: Option A.** You're moving toward revenue activation. Spending $20/month to unlock $40k+/month of automation is a no-brainer. Upgrade first, then Session 2 can design Layer B on a working Layer A base.

### Other Session 1b findings

#### Inngest decision — **RIP IT OUT**

Grep for real callsites (excluding docs, `.example.ts` files, and email-sender `resend.emails.send` false positives):

**5 `.send()` call sites** (silently no-op because of stub):
- `lib/workflows/workflow-scheduler.ts:59, 74`
- `lib/workflows/workflow-engine.ts:419`
- `app/api/cms/bulk-generate/route.ts:61`
- `app/api/articles/generate-comprehensive/route.ts:35`

**11 `.createFunction()` definitions** (just return handler; no real job registration):
- `lib/jobs/content-publishing.ts:131` (`contentPublishingJob`)
- `lib/jobs/content-cleanup.ts:15` (`contentCleanupJob`)
- `lib/jobs/product-data-scraping.ts:21` (`productDataScrapingJob`)
- `lib/jobs/keyword-discovery.ts:20` (`keywordDiscoveryJob`)
- `lib/jobs/content-scoring.ts:12` (`contentScoringJob`)
- `lib/jobs/content-refresh.ts:20` (`contentRefreshJob`)
- `lib/queue/jobs/article-generation.ts:9` (`generateArticleJob`)
- `lib/queue/jobs/article-generation-comprehensive.ts:11`
- `lib/queue/jobs/auto-content-generator.ts:26`
- `lib/queue/jobs/bulk-generation.ts:10`
- `lib/queue/jobs/image-generation.ts:8`
- `lib/queue/jobs/workflow-step.ts:10`

**Verdict: remove Inngest entirely.** Nothing durable is happening. Every `.send()` is a no-op, every `createFunction` is unused as an Inngest function. Cleanup steps:
1. Delete `lib/inngest/client.ts`
2. In each of the 16 callsites, remove the import + the `.send()` / `.createFunction()` (replace with direct calls where it makes sense)
3. `npm uninstall inngest`
4. Delete `lib/queue/` entirely (all 6 files are Inngest-dependent stubs per PHASE2 docs)
5. Keep `lib/jobs/` if the underlying logic is useful without Inngest (direct imports from cron routes)

Reserve for Session 3 (code change) — do not execute yet.

#### /admin/agents redirect — ✅ already applied
`app/admin/agents/page.tsx` is now a 5-line redirect to `/admin/swarm-dashboard`. No sidebar links found pointing at `/admin/agents`, so no sidebar cleanup needed.

### Updated recommendations for Session 2

1. **Before anything else — user must upgrade Vercel to Pro** (or pick Option B / C). Session 2 design assumes working Layer A; no point designing Layer B supervisors over a 1-of-40 firing base.
2. After upgrade, **run this same query one week later** to confirm all 40 crons are now firing. If yes, the actual Layer A → Layer B design begins.
3. **Inngest cleanup** goes into Session 3 work list (code change, needs TDD).
4. **Supabase MCP still uncleared on this account** — user restart pending. Once verified, run the Task 3 production data queries (`ai_persona_performance`, `pipeline_runs`, `articles`, `affiliate_clicks`) to confirm the 1 cron that IS firing (`update-intelligence`) is actually writing useful data.

---

*End of Session 1b addendum. Biggest known unknown: how many crons Vercel actually registered vs silently dropped. That's 30 seconds in the Vercel dashboard for the user to check.*
