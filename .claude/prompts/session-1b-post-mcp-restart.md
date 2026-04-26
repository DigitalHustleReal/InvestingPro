# Session 1b — Post-MCP-restart Verification + Cron Reality Check

> Paste this prompt as your **first message** after restarting Claude Code. The previous session (Session 1) completed the Layer A audit, identified that the Supabase MCP was on the wrong account, and replaced the token. This session finishes Blocker 1 + 2 verification, pulls real production data, then produces the Session 2 prompt.

## State at session start

**Done:**
- `CLAUDE.md` refreshed (12 drifts fixed, §12/13/14 added for Runtime Agents / Scheduling / Admin Map)
- `AUDIT_LAYER_A.md` written at repo root (34/34 agents WIRED, 1 hardcoded admin UI, 40 Vercel crons, Inngest is a stub)
- Vercel MCP verified on correct team: `InvestingproIndia's projects` (`team_8rpm0p7V6PChDxmO5DIjtinq`)
- Vercel projects found: `investing-pro` (`prj_RUFFiaXR6gGuebGtilt8E3eueEnd`), `conduit` (`prj_IwACF5DG6vjuf9ASatMqJQ5CfHRf`)
- Supabase MCP token replaced with fresh PAT (in `~/.claude/plugins/cache/claude-plugins-official/supabase/c35a3ad8fbe8/.mcp.json`)
- InvestingPro Supabase project ref confirmed: **`txwxmbmbqltefwvilsii`** (ap-south-1, Healthy, FREE/NANO tier, ~649 req/min live traffic)

**Pending this session:**
1. Verify new Supabase MCP token sees InvestingPro org + real tables
2. Pull 24–72h of cron execution logs from Vercel (the "are the 40 crons actually firing?" question)
3. Query `ai_persona_performance` + agent heartbeat / pipeline_runs tables to confirm Layer A is producing real data
4. Decide Inngest fate (wire vs rip out)
5. Redirect `/admin/agents` → `/admin/swarm-dashboard` (5-min code change)
6. Produce the **Session 2 prompt** (Phase 2 design — Layer B roster + handoffs to Layer A) and write it to `.claude/prompts/session-2-phase-2-design.md`

## Read these first

1. `AUDIT_LAYER_A.md` at repo root — full context of what Session 1 found
2. `CLAUDE.md` §12 (Runtime Agent System), §13 (Scheduling), §14 (Admin Map)
3. `brainstorm.md` §4 (Active pending items)
4. `.claude/prompts/session-1-layer-a-audit.md` — original prompt that produced Session 1

## Task 1 — Verify Supabase MCP (5 min)

Load the tools and run:
- `mcp__...__list_organizations` — MUST now include **InvestingPro** (not just DigitalHustleReal)
- `mcp__...__list_projects` — MUST include project with ref `txwxmbmbqltefwvilsii` and name `InvestingPro`
- `mcp__...__list_tables` with `project_id=txwxmbmbqltefwvilsii, schemas=["public"], verbose=false` — MUST return real tables (articles, products, credit_cards, ai_persona_performance, affiliate_clicks, glossary, etc.)

If any of these fail:
- Token still wrong → stop, report to user, do NOT continue
- Token right but project scope wrong → use `project_id=txwxmbmbqltefwvilsii` explicitly in subsequent calls

## Task 2 — Pull production cron execution evidence (15 min)

Using Vercel MCP (`ef347c82-e00a-4bcb-bc1c-f955a42d737f`):

1. `list_deployments` with `projectId=prj_RUFFiaXR6gGuebGtilt8E3eueEnd, teamId=team_8rpm0p7V6PChDxmO5DIjtinq, since=<7 days ago as epoch ms>` — confirm prod deployments exist
2. For the latest production deployment, call `get_runtime_logs` and filter for paths starting with `/api/cron/agent-` — last 24–72h
3. Classify what you find into a table:

| Cron path | Invocations (24h / 72h) | Status codes | Avg execution time | Last error if any |
|---|---|---|---|---|
| /api/cron/agent-writer | ... | ... | ... | ... |
| ... | ... | ... | ... | ... |

4. If Vercel MCP can't return enough log depth, note that the user may need to paste a dashboard export instead.

## Task 3 — Query Supabase for agent activity (20 min)

With the verified Supabase MCP, run read-only SQL via `execute_sql` against `txwxmbmbqltefwvilsii`:

```sql
-- 1. Any agent run data at all?
select count(*) from ai_persona_performance where active_status = true;
select max(last_article_date) from ai_persona_performance;

-- 2. Pipeline activity
select count(*) as runs_last_7d, max(started_at) as last_run
from pipeline_runs
where started_at > now() - interval '7 days';

-- 3. Real article production velocity
select count(*) as articles_published_last_7d
from articles
where status = 'published' and published_at > now() - interval '7 days';

-- 4. Affiliate clicks captured (reality check on revenue tracking)
select count(*) as clicks_last_7d, count(distinct user_id) as unique_users
from affiliate_clicks
where created_at > now() - interval '7 days';
```

Adjust column names if the schema differs — use `list_tables verbose=true` on suspicious tables. Record results in the final report.

## Task 4 — Inngest decision (10 min)

Grep for actual `.send(` or `.createFunction(` call sites (not just imports):
```
grep -rn "inngest\.send\|client\.send\|inngest\.createFunction" --include="*.ts" --exclude-dir=node_modules --exclude-dir=docs .
```

Review each call site. If NONE need durable execution (survives crashes, retries automatically, runs > function timeout):
- **Recommend: rip it out.** Delete `lib/inngest/client.ts`, remove the 26 imports, `npm uninstall inngest`.

If some call sites genuinely need durability:
- **Recommend: wire it properly.** But do NOT do the wiring in this session — add it to Session 3's work list.

Either way, just produce the recommendation + specific file list. Don't code yet.

## Task 5 — `/admin/agents` redirect (5 min)

Replace `app/admin/agents/page.tsx` contents with a redirect to `/admin/swarm-dashboard`:

```tsx
import { redirect } from "next/navigation";
export default function Page() { redirect("/admin/swarm-dashboard"); }
```

Also remove the `/admin/agents` entry from the admin sidebar (grep `components/admin/AdminSidebar.tsx` for "agents" or the route path).

This is the ONLY code change permitted in this session.

## Task 6 — Write Session 2 prompt (20 min)

Based on findings from Tasks 2 + 3 (real production data + real cron activity), write `.claude/prompts/session-2-phase-2-design.md`. The prompt must:

- Reference `AUDIT_LAYER_A.md` + the Task 2/3 findings (cite specific numbers)
- Lock in the 15-agent Layer B roster from the earlier brainstorm (Dispatcher, CTO, Editor-in-Chief, v3 Design Guardian, Head of SEO, Head of Revenue, Fact-Checker, Schema Generator, Link Auditor, Competitor Scout, Deploy Sentinel, Page Redesign Finisher, Layer A QA Agent, Memory Curator, CEO/Strategy)
- For EACH Layer B agent: specify upstream callers, downstream handoffs to SPECIFIC Layer A agents (by name), skills it composes, MCP servers it uses, cron schedule if autonomous
- Respect FROZEN files (CLAUDE.md §5), design lock (§3, 6 tokens / 3 fonts), and banned tokens (no cyan/teal/sky/blue/purple/pink)
- Lock in the 5 article-writer personas (Educator / Tutor / Analyst / Converter / Newsroom)
- Explicitly mark the Schema Generator as building NEW code at `lib/schema/generators/` (this is the one net-new infrastructure piece; everything else is supervisor-over-existing)
- Phase 2 deliverable is the ROSTER + HANDOFFS spec — NOT building agents yet. Building happens in Session 3 onwards.

## Hard rules

- Only code change permitted: Task 5 (`/admin/agents` redirect)
- Keep Supabase MCP `--read-only` / default-read scope. No writes.
- If Vercel MCP log depth is insufficient, ask user for a dashboard export — do not fabricate data
- Before claiming done, invoke `Skill("superpowers:verification-before-completion")`
- Update `AUDIT_LAYER_A.md` appendix with findings from Tasks 2 + 3 (actual cron activity, actual agent production data)

## Final report (≤ 350 words)

1. Supabase MCP identity — org + project verified?
2. Cron execution reality — which of the 11 agent-crons are firing? Error rate?
3. Agent production data — articles/week actual, persona activity, affiliate clicks
4. Inngest recommendation (rip or wire) + list of 26 callsites
5. `/admin/agents` redirect — done?
6. Session 2 prompt — written to `.claude/prompts/session-2-phase-2-design.md`?
7. Any new blockers discovered

Then stop. Session 2 happens in a fresh window.
