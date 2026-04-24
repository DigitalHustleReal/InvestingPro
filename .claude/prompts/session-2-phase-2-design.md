# Session 2 — Phase 2: Layer B Agent Roster Design

> **Role for this session:** You are designing, not building.
> **Deliverable:** A single markdown doc (`docs/agents/LAYER_B_ROSTER.md`) with a 15-agent roster + handoff matrix to Layer A + skill/token locks.
> **Do NOT touch code.** No routes, no DB writes, no scheduler edits.

---

## 0. Canonical Infra (from Session 1b)

- **Supabase project ref:** `txwxmbmbqltefwvilsii` (org `InvestingPro`, ap-south-1, `ACTIVE_HEALTHY`)
- **MCP access:** Use the `supabase-alt` MCP (the primary `1779ad4e…` MCP only sees the inactive `Conduit` project — do not use it).
- **Scheduler:** Cron migrated off Vercel Hobby → **GitHub Actions** workflows in `.github/workflows/` (40 jobs). `vercel.json` crons retained only as fallback.
- **Auth:** All cron endpoints expect `Authorization: Bearer ${CRON_SECRET}`. Env is set in Vercel **and** GitHub Actions Secrets (manual step pending confirmation).
- **Admin nav:** `/admin/agents` redirects to `/admin/pipeline` (single source of truth for live agent state).

---

## 1. Session 1b Truth Table (use these facts, do not re-verify)

| Signal | Status | Evidence |
|---|---|---|
| Vercel Hobby crons | ❌ DEAD — only 2 allowed, daily-only | `vercel.json` had 40 → blocked at deploy |
| Inngest | ❌ DEAD — no active runs, handlers missing | `job_status` table 0 rows |
| `update-intelligence` cron (the 1 that appeared to fire) | ⚠️ SCHEMA-BROKEN — writes to 5 tables that **do not exist** | `behavioral_events`, `lead_scores`, `product_rates_history`, `product_watchlists`, `content_attribution_cache` all absent in `information_schema.tables` |
| `ai_persona_performance` | 🟡 EMPTY — 0 rows | Table exists; nothing has ever written to it |
| Articles published | 228 published + 28 draft | Latest published `2026-04-17 12:13:44` |
| Articles since Apr 17 | **ZERO new publishes in 7 days** | `MAX(created_at WHERE status='published')` = Apr 17 |
| Articles generated Apr 24 | 39 via `ArticleGenerator` (manually triggered) | `system_events` — all went to `draft`, none auto-published |
| `agent_executions` | 14 rows, last Apr 6 (stale 18 days) | |
| `agent_heartbeats` | 11 rows — never refreshed | |
| `pipeline_runs` | 27 rows, last Apr 20 | |
| `system_events` | 135 rows — active only via manual `ArticleGenerator` triggers | |

**Implication for Layer B design:** The mesh is cosmetically instrumented but has three rot points — (a) empty persona performance → writers cannot self-rank; (b) schema-broken intelligence cron → no lead/attribution signals; (c) draft → publish handoff is manual. Layer B must close these three gaps.

---

## 2. Layer A Inventory (DO NOT redesign these)

The 11 Layer A agents that already exist as cron endpoints under `app/api/cron/`:

| # | Layer A agent | Endpoint | Primary DB tables |
|---|---|---|---|
| A1 | Content Scout | `agent-content-scout` | `content_queue`, `keyword_research` |
| A2 | SERP Analyst | `agent-serp-analyst` | `serp_cache`, `serp_analyses`, `serp_tracking` |
| A3 | Content Architect | `agent-content-architect` | `article_outlines`, `content_queue` |
| A4 | Writer | `agent-writer` | `articles` (draft), `article_versions` |
| A5 | Editor | `agent-editor` | `editor_queue`, `article_reviews` |
| A6 | SEO | `agent-seo` | `articles` (SEO fields), `content_scores` |
| A7 | Publisher | `agent-publisher` | `articles.status → 'published'`, `sitemap` |
| A8 | Distribution | `agent-distribution` | `distribution_queue`, `social_posts` |
| A9 | Analytics | `agent-analytics` | `article_analytics`, `analytics_events` |
| A10 | Data | `agent-data` | `products`, `rates`, cache tables |
| A11 | Supervisor | `agent-supervisor` | `agent_heartbeats`, `agent_executions` |

Layer B **wraps, evaluates, or specializes** these — it does not replace them.

---

## 3. Your Deliverable — 15 Layer B Agents

Produce `docs/agents/LAYER_B_ROSTER.md` with this structure for each agent:

```
### B{n}. {Agent Name}
- **Layer A handoff:** consumes output of → [A{x}, A{y}]; feeds input of → [A{z}]
- **Primary job:** one sentence, verb-led
- **Reads from:** list DB tables + external APIs
- **Writes to:** list DB tables (must exist — cross-check §1 + list_tables)
- **Skills invoked:** from the skill stack in §5
- **Persona (if writer):** from §4
- **Trigger:** cron schedule OR event-driven (which `system_events.event_type`)
- **SLO:** p95 latency + daily volume ceiling
- **Kill-switch:** which `tenant_feature_flags` row disables it
```

### Required 15 — choose names, but cover these jobs

Close the three Session 1b rot points **first**:

1. **Persona Performance Ranker** — populates `ai_persona_performance` from `articles` × `article_analytics` × `affiliate_clicks`. Outputs ranked persona scores that A4 Writer reads before each generation.
2. **Schema-Heal Watcher** — nightly `information_schema.tables` diff vs. expected schema from `supabase/migrations/*`. Opens a GitHub issue when a cron target is missing (prevents Apr 2026 `update-intelligence` ghost).
3. **Draft→Publish Bridge** — closes the ArticleGenerator→publisher gap. Promotes `draft` articles that pass editor + SEO + schema gates. (Why none published since Apr 17? Because nothing promotes drafts.)

Then fill the remaining **12** across these families (proportions suggested):

- **Writer specialists (4):** Tax Desk, Credit Desk, Investment Desk, Insurance Desk — each tuned with desk-specific style guide + SEBI/RBI compliance guardrails.
- **SEO depth (3):** Interlink Mesh Builder (glossary → article links), Schema Generator (see §6), Keyword Cluster Maintainer.
- **Revenue (2):** Affiliate Position Optimizer, Revenue Intelligence Aggregator (populates `article_revenue` + `revenue_intelligence` — both currently 0 rows).
- **Quality (2):** Fact-Check Auditor (regulatory claims → source citations), Freshness Monitor (RBI rate changes → `article_refresh_triggers`).
- **Ops (1):** Cost Governor — monitors `ai_costs` + `monthly_budgets` + kills requests over threshold.

---

## 4. Locked Writer Personas (for §3 writer specialists)

From `lib/data/team.ts` — **auto-assigned by category, never fake individuals**:

| Desk | Covers | Tone | Compliance overlay |
|---|---|---|---|
| Tax Desk | ITR, 80C, LTCG, capital gains | Procedural, dated | Cite latest Finance Act |
| Credit Desk | Credit cards, credit score, loans | Action-oriented, comparison-heavy | RBI FPC + Apr 2024 credit card rules |
| Investment Desk | MF, stocks, SIP, portfolio | Analytical, data-led | SEBI MF regulations + risk disclosures |
| Lending Desk | Personal, home, business loans | Calculator-first | RBI FPC + EMI transparency |
| Insurance Desk | Health, life, term | Protective, needs-based | IRDAI disclosures |
| Banking Desk | Savings, FD, NRE/NRO | Utility-focused | RBI banking codes |
| Editorial Desk | Opinion, explainers, weekly ticker | Voice-led, POV | Editorial independence disclaimer |

---

## 5. Locked Skill Stack (agents pick from this menu only)

- **SEO:** GSC Performance, SERP Snapshot (DataForSEO), Google Trends, Glossary Interlink (101 terms), Keyword Difficulty.
- **Content:** Article outline, Writer (persona-aware), Editor (grammar + fact + compliance), Readability (Flesch-Kincaid).
- **Schema:** FAQPage (180/228 done), Article, Product (CC/MF/loan/insurance), HowTo, BreadcrumbList, Organization.
- **Data:** Fuzzy slug resolver, RBI rate sync, AMFI NAV sync, Credit card scraper.
- **Revenue:** Affiliate link validator, UUID-safe click tracker, CPA attribution (last-click + time-decay + position).
- **Ops:** Cron auth verify, Heartbeat, Budget guardrail, Schema diff.

Do **not** invent new skills in this session. If you see a gap, list it in an `### Open Questions` section at the end.

---

## 6. Schema Generator — Exact Scope (bound this tightly)

- **In scope for Layer B:** JSON-LD generation for 228 articles — Article + FAQPage (existing) + BreadcrumbList + Author (desk as `Organization`), embedded in `ArticleRenderer.tsx`.
- **In scope:** Product schema on 6 category detail pages (`CreditCard`, `FinancialProduct` for MF/loan/insurance/FD/demat).
- **Out of scope (explicitly defer):** VideoObject, Recipe, Event, Review aggregation, LocalBusiness. Record these in `### Deferred` section.

---

## 7. Locked Design Tokens (agents must respect; don't redefine)

6 tokens only: **ink, authority-green, action-green, indian-gold, canvas, warning-red.**
- Emphasis = **indian-gold** (never action-green).
- Typography: Playfair Display (headlines), Inter (body), JetBrains Mono (data).
- Max radius `rounded-sm` (2px). No gradients (except hero). No glassmorphism. No `shadow-lg`. No scale-transforms.
- Tailwind classes: `green-*` / `primary-*` / `amber-*` only. Forbidden: `cyan-*`, `teal-*`, `sky-*`.

Any writer/schema/visual output that violates these = reject at Layer B editor step.

---

## 8. FROZEN Files — Layer B Must NOT Edit

| File/Folder | Reason |
|---|---|
| `app/calculators/**` | Validated financial math |
| `lib/env.ts` | Security — env validation |
| `lib/ai-service.ts` | Multi-LLM circuit breaker |
| `tailwind.config.ts` | Design tokens |
| `lib/calculators/**` | Validated math |

If a Layer B agent needs to read these, it reads — it does not write.

---

## 9. Success Criteria for This Session

Output `docs/agents/LAYER_B_ROSTER.md` that:

1. ✅ Has exactly 15 agents, each with all 9 fields from §3.
2. ✅ Handoff matrix at the top — a 15×11 table (Layer B rows × Layer A cols) marking consume/feed/both.
3. ✅ The three rot-point agents (Persona Ranker, Schema-Heal, Draft→Publish Bridge) are numbered B1–B3.
4. ✅ Every "Writes to" table has been verified present via `list_tables` on project `txwxmbmbqltefwvilsii`. Missing tables go to `### Migrations Required` (do not design around phantom tables).
5. ✅ `### Open Questions` section lists anything that can't be answered from this prompt + CLAUDE.md alone.
6. ✅ `### Deferred` section lists schema types, agent types, or skill-stack additions postponed beyond this roster.
7. ❌ **Zero code changes.** No route files, no migrations, no component edits. Code comes in Phase 3.

---

## 10. External Actions Blocking Deploy (track, don't execute in this session)

- [ ] Add `CRON_SECRET` to GitHub Actions Secrets → https://github.com/DigitalHustleReal/InvestingPro/settings/secrets/actions
- [ ] Commit + push from `.claude/worktrees/eager-boyd-6d7f83`:
  ```
  git add .github/workflows/ vercel.json CLAUDE.md AUDIT_LAYER_A.md app/admin/agents/page.tsx .claude/prompts/
  git commit -m "feat(scheduler): migrate 40 cron jobs from Vercel Hobby to GitHub Actions"
  git push
  ```

These are user actions. Phase 2 proceeds regardless.
