# Session 1 — Ground Truth Refresh + Layer A Audit

> Paste this prompt into a **fresh Claude Code session** at the repo root (`/clear` first if continuing in the same window). This is Session 1 of a ~7-session plan to reach near-100% automation. Read-only audit + docs refresh. No code changes.

---

## Mission

InvestingPro.in is building a near-100% autonomous content/SEO/revenue operation with two agent layers:

- **Layer A** — runtime agents in `lib/agents/*.ts` (34 files) that serve end users
- **Layer B** — Claude Code `.claude/agents/*.md` dev agents (don't exist yet)

Before we design Layer B, we need ground truth on Layer A. Docs have drifted from reality. Your job this session: **refresh CLAUDE.md + produce a Layer A audit**. Output is two files. That's it. Do not build, refactor, or fix anything else.

## Read these first, in order

1. `CLAUDE.md` at repo root
2. `brainstorm.md` at repo root
3. Invoke `Skill("claude-mem:mem-search")` with query `"InvestingPro Layer A agents lib/agents autonomy"` — surface any prior audit work
4. Invoke `Skill("superpowers:using-superpowers")` to establish skill discipline for this session

## Task 1 — Fix 7 known drifts in CLAUDE.md

The current CLAUDE.md has these known inaccuracies. Verify each, then edit CLAUDE.md to reflect reality. Preserve the file's structure, tone, and lock markers — only change what's verifiably wrong.

1. **Tailwind version** — §2 claims "Tailwind CSS 4". `package.json` has `tailwindcss: ^3.4.17`. Confirm the real version and update §2.
2. **Runtime agent system** — CLAUDE.md has no mention of `lib/agents/`. Add a new section "Runtime Agent System (Layer A)" listing all agents grouped by function (content / SEO / ops / swarm / governance / market / risk).
3. **Inngest** — CLAUDE.md doesn't mention Inngest. Check `lib/inngest/client.ts` — is it a real config or stub? Add a section "Durable Workflows (Inngest)" noting actual status.
4. **Autonomy admin UIs** — CLAUDE.md doesn't mention `/admin/agents`, `/admin/autonomy`, `/admin/autonomy/settings`, `/admin/swarm-dashboard`, `/admin/ai-personas`, `/admin/ops-health`, `/admin/strategy`, `/admin/revenue/intelligence`. Add to file structure map.
5. **AI Persona system** — Supabase view `ai_persona_performance` exists (queried by `/admin/ai-personas`). Add to the schema section.
6. **SERP pipeline** — routes `/api/admin/serp-analyze` and `/api/admin/serp-pipeline` + `lib/agents/swarm/serp-analyst-agent.ts` exist. Add to the file structure map.
7. **Route count** — §9 says "10 route patterns". Top-level `app/` has 83 folders. Update §9 with the real count and list any route categories missing from the doc.

If you find more drifts during this work, add them to the fix list and resolve them. Report all drifts in the final output.

## Task 2 — Audit Layer A (all `lib/agents/**/*.ts`)

Classify every agent file into exactly one bucket:

- **WIRED** — imported by something that executes in production: an API route, an Inngest function, a cron job, an admin UI button that calls an endpoint that imports the agent, or another WIRED agent.
- **SCAFFOLDED** — file contains real logic but is not imported by any executable path. Dormant but salvageable.
- **DEAD** — file is a stub, TODO-only, or has broken/missing imports that prevent execution.

**Method:**
- Use `Grep` to find every import of each agent file across the repo
- If zero imports outside `lib/agents/` → SCAFFOLDED or DEAD
- Read 20–40 lines of each agent to distinguish SCAFFOLDED (real logic) from DEAD (stub/broken)
- For WIRED, trace one complete invocation path from trigger → agent execution

For each agent record:
- Path
- Classification (WIRED / SCAFFOLDED / DEAD)
- Triggers (what invokes it — API route name, Inngest function name, UI component, cron, parent agent)
- Last meaningful git activity — use `git log --oneline -- <path>` and note the date of the last substantive change (not formatting/renames)
- External dependencies (Gemini / Groq / OpenAI / Mistral / Supabase / Redis / SerpAPI / etc.)
- Blockers preventing activation (missing env var, missing table, missing wire-up, broken import)

## Task 3 — Admin UI reality check

For each UI below, determine: REAL data or HARDCODED seed?

- `app/admin/agents/page.tsx`
- `app/admin/autonomy/page.tsx`
- `app/admin/autonomy/settings/page.tsx`
- `app/admin/swarm-dashboard/page.tsx`
- `app/admin/ai-personas/page.tsx`
- `app/admin/ops-health/page.tsx`
- `app/admin/strategy/page.tsx`
- `app/admin/revenue/intelligence/page.tsx`
- `app/admin/pipeline-monitor/page.tsx`
- `app/admin/performance-dashboard/page.tsx`

**Method:** look for `useQuery`, `fetch(`, `supabase.from(...)`. If data comes from `const INITIAL_X = [...]` or hardcoded arrays → HARDCODED. If it hits an API or table → REAL, and record the endpoint/table.

## Task 4 — Scheduling inventory

Map every scheduled / automated / hook-triggered entry point in the repo:

- **Inngest** — find all `inngest.createFunction` and `client.send` usages. For each: function name, trigger (event / cron), handler, status.
- **Vercel crons** — check `vercel.json` for `crons` config.
- **`node-cron`** — grep for `node-cron` usage in any service file.
- **Webhooks** — list every route under `app/api/webhooks/**` and `app/api/*/webhook*`.
- **Git hooks** — read `.husky/pre-commit`. Note what it enforces. List any other hooks.

For each entry: trigger source, what it calls, active status (is it deployed / enabled?).

## Task 5 — Write the output

Write `AUDIT_LAYER_A.md` at repo root with this exact structure:

```markdown
# Layer A Audit — <today's date>

## Summary
- Total runtime agents: <N>
- WIRED: <n>
- SCAFFOLDED: <n>
- DEAD: <n>
- Admin UIs reading real data: <n> of <total>
- Active scheduled triggers: <n>

## Drift fixes applied to CLAUDE.md
| # | Drift | Resolution |
|---|---|---|
| 1 | <e.g., Tailwind 4 → 3.4.17> | Updated §2 |
| ... | | |

## Runtime agent inventory
| Path | Class | Triggers | Last activity | Deps | Blockers |
|---|---|---|---|---|---|
| lib/agents/content-agent.ts | WIRED | /api/admin/generate-article, Inngest: content.generate | 2026-04-12 | Gemini, Supabase | — |
| ... | | | | | |

## Admin UI reality
| UI | Real or Hardcoded | Data source | Notes |
|---|---|---|---|
| /admin/agents | HARDCODED | INITIAL_AGENTS const | Needs real agents table or /api/admin/agents route |
| ... | | | |

## Scheduling inventory
| Trigger | Type | Active | Source | Calls |
|---|---|---|---|---|
| .husky/pre-commit | git hook | yes | local | lint-staged |
| ... | | | | |

## Recommendations for Phase 2 (Session 2 input)
### High-impact SCAFFOLDED agents to activate (top 5 by ROI)
1. <agent> — reason, effort estimate, blockers
...

### DEAD agents to delete
- <path> — why

### Critical blockers requiring user action before Session 3 can proceed
- [ ] <blocker> — what's needed, who can resolve

### Admin UIs needing real data wiring (prioritized)
1. <UI> — which agent/table would populate it

## Appendix — surprises and open questions
- <anything that didn't fit above but future sessions need to know>
```

## Hard rules

- **Do NOT modify any file in `app/`, `lib/`, `components/`, `scripts/`, or `public/`.**
- **ONLY write/edit these two files:** `CLAUDE.md` and `AUDIT_LAYER_A.md`.
- **Do NOT run `npm install`, do NOT add dependencies.**
- **Do NOT start the dev server, do NOT run the build.** All analysis is static: file reads + grep + `git log`.
- **Do NOT invent information.** If wiring is unclear, mark "UNKNOWN" with the reason.
- **Do NOT propose Layer B agents or Phase 2 design.** That's Session 2. Only report findings + recommendations.
- **Do NOT touch frozen files** listed in CLAUDE.md §5.
- Use `TodoWrite` to track Tasks 1–5. Mark each complete as you finish.
- Before claiming done, invoke `Skill("superpowers:verification-before-completion")` and verify `CLAUDE.md` + `AUDIT_LAYER_A.md` both exist, are complete, and follow the specified structure.

## Final report

After writing both files, reply in ≤300 words with:

1. **Bucket counts** — WIRED / SCAFFOLDED / DEAD (and admin UIs real/hardcoded)
2. **Biggest surprise** — the finding I should know about before Session 2
3. **Top 3 SCAFFOLDED agents to activate** in Session 6 (highest ROI)
4. **Critical blockers** — anything requiring user action (env vars, DB tables, accounts) before Session 3 can start building

Then stop. Do not start Session 2 design.
