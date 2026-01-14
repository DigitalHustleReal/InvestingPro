# Sentry Alert Configuration Guide

## Overview

Configure Sentry to send alerts for critical errors that require immediate attention.

---

## Step 1: Access Sentry Dashboard

1. Go to https://sentry.io
2. Log in to your account
3. Select your InvestingPro project

---

## Step 2: Create Critical Error Alert

### Navigate to Alerts

1. Click "Alerts" in left sidebar
2. Click "Create Alert"

### Configure Alert Rule

**Alert Name:** Critical Errors - Production

**Environment:** Production

**Conditions:**
```
When an event is captured by Sentry
AND event.level equals error
AND event.tags.critical equals true
```

**Filters:**
- Environment: `production`
- Level: `error`
- Custom Tag: `critical = true`

**Actions:**
- Send notification to: [Your Email]
- Frequency: Every time (no throttling for critical errors)

### Save Alert

Click "Save Rule"

---

## Step 3: Create High Error Rate Alert

### Create Second Alert

**Alert Name:** High Error Rate - Production

**Conditions:**
```
When error count is more than 100
in 1 hour
for any issue
```

**Actions:**
- Send notification to: [Your Email]
- Frequency: At most once every 30 minutes

---

## Step 4: Configure Notification Channels

### Email Notifications (Default)

Already configured with your account email.

### Slack Integration (Optional)

1. Go to "Settings" → "Integrations"
2. Find "Slack" and click "Add to Slack"
3. Authorize Sentry
4. Select channel (e.g., `#alerts`)
5. Test integration

### Discord Integration (Optional)

1. Create Discord webhook in your server
2. Go to "Settings" → "Integrations" → "Webhooks"
3. Add webhook URL
4. Test integration

---

## Step 5: Test Alerts

### Trigger Test Error

Add this to any API route temporarily:

```typescript
import { logger } from '@/lib/logger';

// Trigger critical error
logger.error('TEST: Critical error alert', new Error('Test error'), {
    critical: true,
    test: true
});
```

### Verify Alert Received

1. Make request to trigger error
2. Check email within 1-2 minutes
3. Verify alert contains error details
4. Remove test code

---

## Step 6: Configure Alert Rules

### Recommended Alert Rules

1. **Critical Errors** (Immediate)
   - Condition: `critical = true`
   - Frequency: Every time
   - Channel: Email + Slack

2. **High Error Rate** (Warning)
   - Condition: >100 errors/hour
   - Frequency: Once per 30 minutes
   - Channel: Email

3. **Circuit Breaker Triggered** (Critical)
   - Condition: Message contains "Circuit breaker"
   - Frequency: Every time
   - Channel: Email + Slack

4. **Database Errors** (High Priority)
   - Condition: Message contains "database"
   - Frequency: Once per 15 minutes
   - Channel: Email

---

## Step 7: Set Up Issue Ownership

### Assign Ownership

1. Go to "Settings" → "Ownership Rules"
2. Add rules:
   ```
   # Circuit breaker issues
   path:lib/agents/orchestrator.ts [your-email]
   
   # Database issues
   path:lib/supabase/* [your-email]
   
   # API errors
   path:app/api/* [your-email]
   ```

---

## Alert Response Procedures

### Critical Error Alert

1. **Immediate Actions:**
   - Check Sentry for error details
   - Check health endpoint status
   - Review recent deployments

2. **If Platform Down:**
   - Follow rollback procedure
   - Notify team
   - Post incident update

3. **If Platform Up:**
   - Create Sentry issue
   - Schedule fix
   - Monitor for recurrence

### High Error Rate Alert

1. **Investigate:**
   - Check Sentry dashboard for error types
   - Look for patterns (same endpoint, same user, etc.)
   - Check if related to recent deployment

2. **Triage:**
   - If critical: Follow critical error procedure
   - If minor: Create issue for next sprint
   - If spam: Adjust alert threshold

---

## Monitoring Best Practices

### 1. Review Sentry Daily

- Check error trends
- Review new issues
- Close resolved issues

### 2. Set Up Performance Monitoring

1. Go to "Performance"
2. Enable transaction monitoring
3. Set up slow transaction alerts (>1s)

### 3. Configure Release Tracking

```typescript
// sentry.config.ts
Sentry.init({
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  environment: process.env.NODE_ENV,
});
```

### 4. Use Breadcrumbs

```typescript
Sentry.addBreadcrumb({
  category: 'workflow',
  message: 'Starting article generation',
  level: 'info',
});
```

---

## Troubleshooting

### Not Receiving Alerts

**Check:**
1. Alert rule is enabled
2. Email notifications are enabled
3. Alert conditions are met
4. Check spam folder

**Solution:**
```bash
# Trigger test alert
curl -X POST https://sentry.io/api/0/projects/YOUR_ORG/YOUR_PROJECT/events/ \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{"message": "Test alert", "level": "error"}'
```

### Too Many Alerts

**Solutions:**
1. Increase error threshold
2. Add throttling (max once per hour)
3. Filter out known issues
4. Use issue grouping

---

## Free Tier Limits

- **Events:** 5,000/month
- **Team Members:** Unlimited
- **Projects:** Unlimited
- **Retention:** 30 days

Sufficient for production monitoring!

---

## Next Steps

After Sentry is configured:
1. ✅ Alert rules created
2. ✅ Notifications configured
3. ✅ Test alerts work
4. → Monitor for first 24 hours
5. → Adjust thresholds as needed

---

## Quick Reference

**Dashboard:** https://sentry.io/organizations/YOUR_ORG/issues/  
**Docs:** https://docs.sentry.io/  
**Support:** https://sentry.io/support/

**Critical Error Tag:** `critical: true`  
**Alert Frequency:** Immediate for critical, throttled for others
