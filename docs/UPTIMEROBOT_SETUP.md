# UptimeRobot Setup Guide

## Overview

UptimeRobot is a free uptime monitoring service that will monitor your health check endpoint and alert you if the platform goes down.

---

## Step 1: Create Account

1. Go to https://uptimerobot.com
2. Click "Sign Up Free"
3. Enter your email and create password
4. Verify your email

---

## Step 2: Add Health Check Monitor

1. Click "Add New Monitor"
2. Configure:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** InvestingPro Health Check
   - **URL:** `https://investingpro.in/api/health`
   - **Monitoring Interval:** 5 minutes
   - **Monitor Timeout:** 30 seconds
   - **HTTP Method:** GET (default)

3. Click "Create Monitor"

---

## Step 3: Configure Alerts

### Email Alert (Default)

1. Go to "My Settings" → "Alert Contacts"
2. Your email is already added by default
3. Verify it's enabled for notifications

### Additional Alert Channels (Optional)

**Slack:**
1. Create Slack webhook: https://api.slack.com/messaging/webhooks
2. In UptimeRobot: "Add Alert Contact" → "Webhook"
3. Paste Slack webhook URL
4. Test the integration

**Discord:**
1. Create Discord webhook in your server settings
2. In UptimeRobot: "Add Alert Contact" → "Webhook"
3. Paste Discord webhook URL
4. Test the integration

---

## Step 4: Configure Alert Rules

1. Click on your monitor
2. Go to "Alert Contacts to Notify"
3. Select which contacts to notify
4. Configure:
   - **When to Alert:** Down (immediately)
   - **When to Alert Up:** After 2 checks (10 minutes)

---

## Step 5: Test the Monitor

### Manual Test

1. Stop your dev server or production deployment
2. Wait 5 minutes
3. Check your email for alert
4. Restart server
5. Wait 10 minutes
6. Check for "up" notification

### Expected Alerts

**Down Alert:**
```
[Down] InvestingPro Health Check
Monitor: InvestingPro Health Check
URL: https://investingpro.in/api/health
Reason: Connection timeout
Time: 2026-01-14 17:45:00
```

**Up Alert:**
```
[Up] InvestingPro Health Check
Monitor: InvestingPro Health Check
URL: https://investingpro.in/api/health
Uptime: 99.95%
Time: 2026-01-14 17:55:00
```

---

## Step 6: View Dashboard

1. Go to UptimeRobot dashboard
2. You'll see:
   - **Status:** Green (up) or Red (down)
   - **Uptime %:** Last 24h, 7d, 30d
   - **Response Time:** Average latency
   - **Logs:** Recent up/down events

---

## Free Tier Limits

- **Monitors:** 50
- **Interval:** 5 minutes minimum
- **Alert Contacts:** Unlimited
- **Logs:** 60 days retention

This is sufficient for production monitoring!

---

## Monitoring Best Practices

### 1. Set Realistic Intervals

- **5 minutes:** Good for production
- **1 minute:** Overkill for most apps (paid tier)

### 2. Configure Multiple Alert Channels

- Email (primary)
- Slack/Discord (team notifications)
- SMS (critical only, paid tier)

### 3. Review Uptime Reports

- **Daily:** Check for any downtime
- **Weekly:** Review uptime percentage (target: >99%)
- **Monthly:** Analyze patterns

### 4. Investigate Alerts

When you receive a down alert:
1. Check health endpoint manually
2. Review Vercel deployment logs
3. Check Sentry for errors
4. Review database status (Supabase dashboard)

---

## Troubleshooting

### Monitor Shows Down But Site Works

**Possible Causes:**
- Health check endpoint returning 503
- One component unhealthy (database, Redis, AI)
- Timeout (response taking >30s)

**Solution:**
```bash
# Check health endpoint
curl https://investingpro.in/api/health

# Check response time
curl -w "@-" -o /dev/null -s https://investingpro.in/api/health <<'EOF'
time_total: %{time_total}s
http_code: %{http_code}
EOF
```

### False Positives

If you get frequent false alerts:
1. Increase timeout to 60 seconds
2. Check if health check is too strict
3. Consider making cache/metrics checks optional

---

## Next Steps

After UptimeRobot is configured:
1. ✅ Monitor is active
2. ✅ Alerts are configured
3. ✅ Test alerts work
4. → Set up Sentry alerts (see `SENTRY_SETUP.md`)
5. → Deploy to production
6. → Monitor for first 24 hours

---

## Quick Reference

**Dashboard:** https://uptimerobot.com/dashboard  
**API Docs:** https://uptimerobot.com/api  
**Support:** https://uptimerobot.com/contact

**Health Check URL:** `https://investingpro.in/api/health`  
**Expected Status:** 200 OK  
**Expected Response:** `{ "status": "healthy", ... }`
