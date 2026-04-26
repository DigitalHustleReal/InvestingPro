# Disabled cron workflows (archived)

These 40 cron workflows + the reusable `_invoke-cron.yml` were the
GitHub-Actions-driven cron mesh from the eager-boyd-6d7f83 migration
(needed because Vercel Hobby capped cron jobs at 2/day).

After upgrading to **Vercel Pro on 2026-04-26**, the cron limit was
lifted and we migrated the schedules into `vercel.json` (native Vercel
crons). Vercel platform now invokes each `/api/cron/*` endpoint on
schedule directly — no GitHub Actions detour, no GitHub Secret to
keep in sync, simpler logs in one place (Vercel dashboard).

These files are preserved here (not in `.github/workflows/` so
GitHub Actions does not pick them up) for two reasons:

1. **Rollback safety** — if Vercel native crons hit an unforeseen
   issue, restoring this directory back to `.github/workflows/`
   re-enables the GH-Actions path. Just `git mv` them back and
   re-add `CRON_SECRET` to GitHub repo secrets.
2. **Reference for schedules** — each `cron-<task>.yml` shows the
   intended UTC cron expression, the endpoint path, and the
   reasoning comment from the original migration. The schedules are
   mirrored in `vercel.json#crons[]`.

The non-cron CI/quality-gate workflows (`accessibility.yml`,
`ci.yml`, `lighthouse.yml`, `pr-quality.yml`, `staging.yml`,
`scraper.yml`, `credit-card-scraper.yml`, `content-factory.yml`)
remain active in `.github/workflows/` — those are CI on push/PR,
not crons.

## When you would re-enable

- Vercel native cron is degraded or has an outage
- You need free fan-out parallelism that Vercel cron concurrency
  doesn't give you
- You move part of the project off Vercel and need an external
  scheduler

## Source-of-truth for cron schedules

`vercel.json` → `crons[]` array. 40 entries, one per `/api/cron/*`
endpoint. Each entry:

```json
{ "path": "/api/cron/agent-supervisor", "schedule": "0 0 * * *" }
```

## Authentication

Vercel native crons automatically send `Authorization: Bearer
$CRON_SECRET` to the cron URL (when `CRON_SECRET` env var is set).
Existing `/api/cron/*/route.ts` files already validate this header,
so no route changes were needed for the migration.
