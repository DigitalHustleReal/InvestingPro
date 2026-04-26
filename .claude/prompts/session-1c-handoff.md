# Session 1c — Post-Restart Handoff

> Paste as your **first message** in a fresh Claude Code window opened at this worktree path. Self-contained.

## Where we are

Two windows have been running in parallel:
- **Window A** (this worktree, `eager-boyd-6d7f83`): executed Session 1b — shipped Tasks 2, 4, 5.
- **Window B** (different worktree, `peaceful-visvesvaraya-73d137`): diagnosed the recurring Supabase MCP blocker and swapped the token.

Both windows are now closed. This is the single surviving session.

## What got done in Session 1b (before restart)

| Task | Status | Evidence |
|---|---|---|
| 1. Supabase MCP verify | ❌ **Still blocked** — token scope wrong, InvestingproIndia org not visible | Only `DigitalHustleReal`/Conduit visible on `list_organizations` |
| 2. Vercel cron logs (24–72h) | ⚠️ Partial — only ~40min of log retention available | Noted in findings |
| 3. Supabase agent-activity SQL | 🚫 Blocked by Task 1 | — |
| 4. Inngest decision | ✅ Dual-path dead code confirmed | Recommendation: rip out (details in Window A's in-progress report) |
| 5. `/admin/agents` redirect | ✅ Done (3-line redirect + sidebar entry removed) | Committed / staged in this worktree |
| 6. Session 2 prompt | ⏳ Not started — blocked on Task 3 data | — |

## What changed between Session 1b and now

**Supabase MCP token swapped** in `~/.claude/plugins/cache/claude-plugins-official/supabase/c35a3ad8fbe8/.mcp.json`. New token is loaded at process startup — that's why you're in a fresh session.

## Your first action: verify Task 1, then branch

Load the Supabase MCP tools via ToolSearch (`mcp__1779ad4e-6f8a-4c80-9dcc-ffb2ecd97384__list_organizations`, `__list_projects`, `__list_tables`, `__execute_sql`), then call:

1. `list_organizations` — expect **InvestingproIndia** in the result
2. `list_projects` — expect a project with ref `txwxmbmbqltefwvilsii`

### Branch A — both succeed

Proceed to Session 1b Task 3. Run the 4 SQL queries from `.claude/prompts/session-1b-post-mcp-restart.md` §Task 3 against `project_id=txwxmbmbqltefwvilsii`:
- `ai_persona_performance` active count + `max(last_article_date)`
- `pipeline_runs` last-7d count + `max(started_at)`
- `articles` published last-7d
- `affiliate_clicks` last-7d count + unique users

Then Task 6 — write `.claude/prompts/session-2-phase-2-design.md` using:
- `AUDIT_LAYER_A.md` (repo root — Session 1 output)
- The real numbers from Task 3
- The 15-agent Layer B roster spec in `.claude/prompts/session-1b-post-mcp-restart.md` §Task 6

Finish with the ≤350-word final report from §"Final report" of Session 1b.

### Branch B — InvestingproIndia still not visible

The token is valid but scoped to the wrong Supabase account. Do NOT ask for another token. Instead, stop and tell the user exactly which orgs/projects `list_organizations`/`list_projects` DID return, plus this fix path:

> The PAT you keep generating is scoped to a Supabase account that doesn't own/belong to InvestingproIndia. Two options:
> 1. Log into https://supabase.com with the account that owns `txwxmbmbqltefwvilsii`, go to /dashboard/account/tokens, generate a PAT from THAT session, paste it into `.mcp.json` (not chat)
> 2. From the InvestingproIndia-owner account: Organization settings → Team → invite `digitalhustlereal@gmail.com` as member. Then regenerate the PAT — it'll now see both orgs.

Then stop. Don't attempt Tasks 3 or 6 without real data.

### Branch C — 401 / auth error

Token wasn't saved or Claude Code didn't pick it up. Run:
```
grep -rn "sbp_" ~/.claude .claude 2>/dev/null | grep -v node_modules | grep -v history | grep -v projects
```
Should return exactly ONE file: `~/.claude/plugins/cache/claude-plugins-official/supabase/c35a3ad8fbe8/.mcp.json`. If it has a different token than what was pasted, the edit didn't stick — report and stop.

## Read these to rebuild context

1. `AUDIT_LAYER_A.md` (repo root) — Session 1 findings, 34/34 agents wired, 40 crons, Inngest stub
2. `CLAUDE.md` §12 (Runtime Agents), §13 (Scheduling), §14 (Admin Map) — refreshed this week
3. `.claude/prompts/session-1b-post-mcp-restart.md` — the plan this session resumes
4. `brainstorm.md` §4 — active pending items
5. `git status` + `git diff` — Session 1b's uncommitted work (AUDIT_LAYER_A.md, CLAUDE.md edits, admin/agents redirect, sidebar edit)

## Security cleanup before you finish

After Task 1 verifies the token works, remind the user:

> The Supabase PAT `sbp_25b7...fa6a` is in the prior conversation transcript. Revoke it at https://supabase.com/dashboard/account/tokens, generate a replacement, paste the replacement directly into `~/.claude/plugins/cache/claude-plugins-official/supabase/c35a3ad8fbe8/.mcp.json` (not into a Claude chat), then restart Claude Code once more.

## Hard rules (inherited from Session 1b)

- Only code change permitted this session: the redirect in Task 5 is already done. No other edits except the Session 2 prompt (which is a new doc, not a code change).
- Supabase MCP `--read-only` / default-read scope only. No writes.
- If Vercel MCP log depth is insufficient for Task 2 re-run, ask for a dashboard export — do not fabricate.
- Before claiming done: invoke `Skill("superpowers:verification-before-completion")`.
- Update `AUDIT_LAYER_A.md` appendix with Task 3 findings (real numbers) and Task 4 Inngest decision.

## Final report format (≤ 350 words)

1. Supabase MCP identity — org + project verified? (quote the actual `list_organizations` result)
2. Agent production data — articles/week actual, persona activity, affiliate clicks (real numbers from SQL)
3. Inngest decision confirmed + specific file list to delete (cite line count)
4. `/admin/agents` redirect — committed? (show `git log -1 -- app/admin/agents/page.tsx`)
5. Session 2 prompt — written to `.claude/prompts/session-2-phase-2-design.md`? (line count)
6. Any new blockers

Then stop. Session 2 happens in a fresh window after the user reads the Session 2 prompt.
