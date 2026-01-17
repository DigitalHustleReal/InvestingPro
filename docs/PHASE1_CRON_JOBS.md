# Phase 1 Cron Jobs Setup

## Overview

Phase 1 includes automated cron jobs for:
1. **Refresh Triggers** - Daily check for content needing refresh
2. **Rankings Sync** - Daily sync of keyword rankings from GSC

## Vercel Cron Jobs

Cron jobs are configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/automation/refresh-triggers",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/analytics/rankings/sync",
      "schedule": "0 3 * * *"
    }
  ]
}
```

### Schedule:
- **Refresh Triggers**: Daily at 2:00 AM UTC
- **Rankings Sync**: Daily at 3:00 AM UTC

## Manual Trigger

You can also trigger these endpoints manually:

### Check Refresh Triggers:
```bash
GET /api/automation/refresh-triggers
GET /api/automation/refresh-triggers?type=rankings
GET /api/automation/refresh-triggers?type=stale
```

### Process Refresh Triggers:
```bash
POST /api/automation/refresh-triggers
```

### Sync Rankings:
```bash
POST /api/analytics/rankings/sync
```

With body:
```json
{
  "keywords": ["best credit card", "mutual funds"],
  "siteUrl": "https://investingpro.in"
}
```

Or manual rankings:
```json
{
  "manualRankings": [
    {
      "keyword": "best credit card",
      "position": 5,
      "url": "https://investingpro.in/credit-cards/best",
      "dataSource": "manual"
    }
  ]
}
```

## Authentication

Cron jobs require authentication via:
1. **User authentication** (admin users)
2. **Service key** (for automated cron jobs)

Set `CRON_SECRET` in environment variables for cron authentication.

## Local Testing

For local testing, you can use:
```bash
# Check triggers
curl http://localhost:3000/api/automation/refresh-triggers

# Process triggers
curl -X POST http://localhost:3000/api/automation/refresh-triggers

# Sync rankings
curl -X POST http://localhost:3000/api/analytics/rankings/sync \
  -H "Content-Type: application/json" \
  -d '{"keywords": ["test"], "siteUrl": "https://investingpro.in"}'
```

## Monitoring

Check logs for:
- `Processing refresh triggers...`
- `Found X ranking drop triggers`
- `Found X stale content triggers`
- `Refresh triggers processed`

## Troubleshooting

1. **Cron jobs not running**: Check Vercel cron configuration
2. **Authentication errors**: Verify `CRON_SECRET` is set
3. **No triggers found**: Check if rankings are being tracked
4. **Sync failures**: Verify GSC API key is configured
