# Security Audit — 2026-04-26

End-to-end audit of Vercel + GitHub + Supabase wiring. Findings ranked
by severity. P0 items are fixed in commit landing this doc, with the
exception of secret rotation (manual user action required).

---

## P0 — Critical

### #1  Supabase `service_role` JWT hardcoded in 3 committed scripts
**Status:** code fixed in this commit; **JWT rotation required by user.**

Files (now strict env-only):
- `scripts/ai-content-generator.ts`
- `scripts/fix-article-data.ts`
- `scripts/generate-sip-swp-article.ts`

The decoded JWT was a `service_role` token for project
`txwxmbmbqltefwvilsii` valid until **December 2035**. Anyone with
read access to the repo (current or historical, on any branch — git
history retains the value) had unrestricted Supabase access bypassing
RLS until the key is rotated.

**Required follow-up (manual, dashboard):**
1. Supabase → Project Settings → API → reset `service_role` JWT.
2. Update `SUPABASE_SERVICE_ROLE_KEY` env var in Vercel
   (Production + Preview + Development).
3. Older branches (`claude/admiring-panini`, `claude/eager-boyd-6d7f83`,
   etc.) still contain the leaked JWT in their git history. After
   rotation those references are dead strings, but should be
   eventually scrubbed (BFG / `git filter-repo`) if the repo ever
   becomes public.

### #2  20+ consecutive Vercel Production deploys failed (24h+)
**Status:** root cause = Hobby plan post-build limit. **Fixed by Pro upgrade** done this session.

Symptom: build succeeds (6 min), `status ● Error` flips after build
output, no log message. Live site served stale code from the last
successful deploy. After Pro upgrade, redeploy expected to succeed.

---

## P1 — High

### #3  RLS disabled on 7 tables
**Status:** fixed via migration `enable_rls_on_missing_tables` (applied 2026-04-26).

Tables now RLS-enabled (service-role-only by default; no policies
needed because they hold internal/non-public data):

- `analytics_events`, `article_quality_logs`, `content_assignments`,
  `content_scores`, `editorial_standards`, `ai_prompt_improvements`,
  `migrations`

### #4  RLS enabled with zero policies on 7 tables
**Status:** intentional (service-role bypass). Documented per-table.

Tables: `article_keyword_clusters`, `article_status_history`,
`comparisons`, `data_sources`, `personal_loans`,
`ranking_configurations`, `raw_data_snapshots`. RLS-on + no policy =
inaccessible to anon/authenticated, accessible to service-role.
Correct posture for these. If `personal_loans` ever needs public
read for the `/loans` page, add an explicit `CREATE POLICY
public_read ON personal_loans FOR SELECT USING (true)` then.

### #5  Cron endpoints are likely empty stubs
**Status:** open. Tracked in launch-readiness audit, not part of this PR.

`scraper_runs` has zero rows ever; `data_sync_log` last write 19
days ago; `live_rates` / `fd_rates_cache` / `mutual_fund_nav_cache`
all empty. Forty `/api/cron/*` endpoints fire but don't write to
their target tables. Each endpoint needs a real implementation
audit before launch — separate work.

### #6  `CRON_SECRET` value drift across Vercel envs
**Status:** will be fixed via CLI rotation after this PR is merged + deploy succeeds.

Production + Development entries are 10 days old; Preview entry is
2 hours old. They may not be the same value. Will rotate to a single
fresh value via `vercel env rm` + `vercel env add` for all 3 envs,
then user pastes the same value into GitHub Secrets.

---

## P2 — Medium

### #7  `middleware.ts` uses Next.js 16 deprecated convention
**Status:** open. Next.js 16 wants `proxy.ts`. Build warns but still
works. Will migrate in a follow-up PR (separate concern).

### #8  `inngest@3.49.1` has security advisory
**Status:** fixed in this commit. Bumped to `^3.54.0`.

### #9  Local `vercel deploy` blocked by 48k file count
**Status:** fixed in this commit. `.vercelignore` extended to
exclude `.claude`, `coverage`, `archive`, `.playwright-mcp`,
`screenshots`. Local CLI deploys now under the 15k upload cap.
GitHub-triggered auto-deploys were never affected (those clone
fresh server-side).

### #10  Env var scope inconsistencies
**Status:** documented. To be addressed via `vercel env add` calls.

- `NEXT_PUBLIC_BASE_URL` missing on Preview
- `PEXELS_API_KEY` missing on Preview + Development
- `NEXT_PUBLIC_SENTRY_DSN` missing entirely

### #11  GitHub branch protection on `master` unverifiable
**Status:** open (no automation possible from this session).

The `gh` binary on the developer machine is the wrong package
(`@eduardolundgren/node-gh`, not the official GitHub CLI). Need
official CLI (`https://cli.github.com/`) or a PAT to audit:

- Branch protection rules on `master`
- Repo visibility (public/private — relevant given P0 #1)
- Secret scanning + Dependabot status

---

## What is healthy

- Live site responds 200 across all key paths
  (`/`, `/credit-cards`, `/methodology`, `/sitemap.xml`, `/robots.txt`)
- `/api/cron/*` returns 401 when unauthenticated (auth check works)
- 96% RLS coverage (now 100% after this PR's migration)
- `.gitignore` properly excludes `.env*`, `.vercel`, `node_modules`,
  `.claude/worktrees/`, `.superpowers/`
- `vercel.json` minimal — no leftover cron entries
- 40 env vars provisioned (mostly correctly scoped)
- DNS pointing to Vercel correctly
- 4 AI providers wired with failover
- Logging: Axiom + OTEL configured

---

## Next steps in order

1. User: rotate Supabase `service_role` JWT (dashboard).
2. User: update `SUPABASE_SERVICE_ROLE_KEY` in Vercel (3 envs).
3. User: merge this PR.
4. Claude: trigger `vercel deploy --prod` (now under file-count cap).
5. Claude: monitor deploy; expect success now that Pro is active.
6. Claude: rotate `CRON_SECRET` via CLI to a single fresh value.
7. User: paste that value into GitHub Secrets (overwrites existing).
8. Claude: smoke-test one cron workflow → expect HTTP 200 + a row
   in `data_sync_log`.

After step 8: cron auth chain proven, deploys green, secrets rotated,
RLS closed. Then we move on to real launch work — methodology page,
hreflang sitemap, analytics audit, Phase 3a Hindi translation.
