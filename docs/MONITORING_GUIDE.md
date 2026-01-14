# Production Monitoring Guide

## Overview

This guide explains how to monitor the InvestingPro platform in production to ensure reliable, unattended operation.

---

## Health Check Monitoring

### Endpoint
```
GET https://investingpro.in/api/health
```

### Expected Response (Healthy)
```json
{
  "status": "healthy",
  "timestamp": "2026-01-14T12:00:00.000Z",
  "uptime_seconds": 86400,
  "checks": {
    "database": {
      "status": "healthy",
      "latency_ms": 45
    },
    "redis": {
      "status": "healthy",
      "latency_ms": 12
    },
    "ai_providers": {
      "status": "healthy",
      "latency_ms": 5
    }
  },
  "total_latency_ms": 62
}
```

### UptimeRobot Setup (Free Tier)

1. **Create Account:** https://uptimerobot.com
2. **Add Monitor:**
   - Monitor Type: HTTP(s)
   - Friendly Name: InvestingPro Health Check
   - URL: `https://investingpro.in/api/health`
   - Monitoring Interval: 5 minutes
   - Monitor Timeout: 30 seconds
   - Alert Contacts: Your email

3. **Alert Rules:**
   - Down: Send alert immediately
   - Up: Send alert after 2 checks (10 minutes)

---

## Error Monitoring (Sentry)

### Critical Error Alerts

Errors logged with `critical: true` flag will trigger immediate alerts.

**Example:**
```typescript
logger.error('CRITICAL: System failure', error, {
    critical: true,
    action: 'Manual intervention required'
});
```

### Sentry Alert Rules

1. **Go to:** Sentry Dashboard → Alerts
2. **Create Alert:** "Critical Errors"
3. **Conditions:**
   - Event level: error
   - Event tags: `critical:true`
4. **Actions:**
   - Send email notification
   - Send webhook to Slack/Discord (optional)

### Daily Error Review

Check Sentry dashboard daily for:
- Error rate trends
- New error types
- Recurring errors
- Performance degradation

---

## Key Metrics to Monitor

### Daily Checks

| Metric | Healthy Range | Action if Outside Range |
|:---|:---|:---|
| **Health Check Status** | 200 (always) | Investigate immediately |
| **Sentry Error Rate** | <5% | Review errors, fix critical ones |
| **AI Cost** | <$50/day | Check budget governor, review usage |
| **Workflow Failure Rate** | <10% | Review failed workflows, fix issues |
| **Database Size Growth** | <100MB/day | Check for data bloat, run cleanup |
| **Uptime** | >99% | Investigate downtime causes |

### Weekly Checks

| Metric | Healthy Range | Action if Outside Range |
|:---|:---|:---|
| **Total AI Cost** | <$350/week | Optimize AI usage, review providers |
| **Article Generation Rate** | 10-50/week | Adjust automation settings |
| **Database Size** | <5GB | Archive old data, optimize tables |
| **Average Response Time** | <500ms | Optimize queries, add caching |

---

## Alert Channels

### Email Alerts
- UptimeRobot: Health check failures
- Sentry: Critical errors
- Vercel: Deployment failures

### Webhook Alerts (Optional)

Set up Slack/Discord webhook for critical alerts:

```typescript
// lib/logger.ts
if (entry.level === 'error' && entry.context?.critical) {
    await fetch(process.env.ALERT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            text: `🚨 CRITICAL ERROR: ${entry.message}`,
            details: entry.context
        })
    });
}
```

---

## Monitoring Dashboards

### Vercel Analytics
- **URL:** https://vercel.com/dashboard/analytics
- **Metrics:**
  - Page views
  - Response times
  - Error rates
  - Bandwidth usage

### Sentry Dashboard
- **URL:** https://sentry.io/organizations/[your-org]/issues/
- **Metrics:**
  - Error frequency
  - Error types
  - Affected users
  - Performance issues

### Supabase Dashboard
- **URL:** https://supabase.com/dashboard/project/[project-id]
- **Metrics:**
  - Database size
  - Active connections
  - Query performance
  - API requests

---

## Troubleshooting Common Issues

### Health Check Returns 503

**Possible Causes:**
1. Database connection failed
2. Redis connection failed
3. No AI providers configured

**Actions:**
1. Check Supabase dashboard for outages
2. Check Redis (Upstash) dashboard
3. Verify environment variables in Vercel

### High Error Rate in Sentry

**Possible Causes:**
1. AI provider failures
2. Database query errors
3. Invalid data in database

**Actions:**
1. Review error details in Sentry
2. Check AI provider status pages
3. Review recent database changes
4. Check for invalid data

### Workflow Failures

**Possible Causes:**
1. Budget exhausted
2. AI provider timeout
3. Invalid article data

**Actions:**
1. Check budget governor logs
2. Review workflow failure logs
3. Check AI provider response times
4. Validate article data schema

### Circuit Breaker Triggered

**Possible Causes:**
1. Repeated automation failures
2. Budget exhausted
3. AI provider outage

**Actions:**
1. Check system settings: `automation_paused = true`
2. Review `automation_paused_reason`
3. Fix underlying issue
4. Resume automation via admin panel

---

## Emergency Response Procedures

### Platform Down (Health Check 503)

1. **Check Status Pages:**
   - Vercel: https://www.vercel-status.com/
   - Supabase: https://status.supabase.com/
   - Upstash: https://status.upstash.com/

2. **Check Vercel Logs:**
   - Go to Vercel dashboard
   - Click on latest deployment
   - Review function logs

3. **Rollback if Needed:**
   - Follow rollback procedure in DEPLOYMENT_CHECKLIST.md

### Critical Error Alert

1. **Review Error in Sentry:**
   - Check error message
   - Review stack trace
   - Check affected users

2. **Assess Impact:**
   - Is platform still functional?
   - Are users affected?
   - Is data at risk?

3. **Take Action:**
   - If critical: Rollback deployment
   - If minor: Create fix, deploy
   - If data risk: Pause automation

### Budget Overrun

1. **Check AI Usage:**
   - Review `ai_usage_logs` table
   - Identify expensive operations

2. **Pause Automation:**
   - Go to admin panel
   - Click "Pause Automation"

3. **Optimize:**
   - Review AI provider costs
   - Switch to cheaper providers
   - Reduce generation frequency

---

## Monitoring Checklist

### Daily (5 minutes)
- [ ] Check UptimeRobot status (should be green)
- [ ] Check Sentry for critical errors
- [ ] Review AI costs in admin dashboard
- [ ] Check workflow failure rate

### Weekly (30 minutes)
- [ ] Review all Sentry errors
- [ ] Review workflow failures
- [ ] Review AI costs trend
- [ ] Review database size
- [ ] Review uptime percentage
- [ ] Check for performance degradation

### Monthly (2 hours)
- [ ] Review all metrics trends
- [ ] Optimize slow queries
- [ ] Archive old data
- [ ] Update dependencies
- [ ] Review security alerts
- [ ] Test backup/restore procedure

---

## Success Metrics

Platform is operating successfully when:

- ✅ Health check returns 200 for 7 days straight
- ✅ Uptime >99.5%
- ✅ Error rate <2%
- ✅ AI costs <$300/month
- ✅ Workflow success rate >95%
- ✅ Average response time <300ms
- ✅ No critical alerts for 7 days

---

## Contact Information

- **Platform Owner:** [Your Name/Email]
- **UptimeRobot Support:** https://uptimerobot.com/contact
- **Sentry Support:** https://sentry.io/support
- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/support
