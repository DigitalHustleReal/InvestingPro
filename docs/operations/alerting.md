# Alerting System Setup

This document describes how to set up alerting for your application.

## 🎯 Overview

The alerting system monitors critical metrics and sends notifications when thresholds are exceeded.

**Features:**
- ✅ Multiple notification channels (Email, Slack, Webhook, Axiom)
- ✅ Alert deduplication (cooldown periods)
- ✅ Configurable alert rules
- ✅ Integration with Axiom monitoring

---

## 🚀 Quick Setup

### Option 1: Axiom Native Alerts (Recommended - FREE)

Axiom includes **500 monitors** in the free tier. Set up alerts directly in Axiom dashboard:

1. **Go to Axiom Dashboard** → Monitors
2. **Create Monitor** for each alert rule:
   - **Error Rate Monitor:**
     - Query: `['level'] = 'error' AND _time > now() - 5m`
     - Condition: Count > threshold
     - Notification: Email/Slack
   
   - **Latency Monitor:**
     - Query: `['metrics.duration'] > 2000 AND ['message'] LIKE 'API%'`
     - Condition: Count > 0
     - Notification: Email/Slack

3. **Configure Notifications:**
   - Add email addresses
   - Add Slack webhook (optional)
   - Set notification frequency

**Benefits:**
- ✅ Free (500 monitors included)
- ✅ No code changes needed
- ✅ Real-time evaluation
- ✅ Native Axiom integration

---

### Option 2: Application-Based Alerts

Use the alert manager for custom logic and database checks:

1. **Set up notification channels:**

```env
# Email (for alerts)
ALERT_EMAIL=your-email@example.com
ADMIN_EMAIL=admin@example.com

# Slack (optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Alert evaluation token (for cron job)
ALERT_EVALUATION_TOKEN=your-secret-token
```

2. **Set up cron job** (Vercel Cron or external):

```typescript
// vercel.json or external cron
{
  "crons": [{
    "path": "/api/v1/alerts/evaluate",
    "schedule": "*/5 * * * *" // Every 5 minutes
  }]
}
```

3. **Test alert evaluation:**

```bash
curl -X POST https://your-domain.com/api/v1/alerts/evaluate \
  -H "Authorization: Bearer your-secret-token"
```

---

## 📋 Alert Rules

### Default Rules

| Rule ID | Name | Severity | Threshold | Cooldown |
|---------|------|----------|-----------|----------|
| `error-rate-high` | High Error Rate | Critical | 5% (5 min) | 15 min |
| `api-latency-high` | High API Latency | Warning | 2s (p95) | 30 min |
| `workflow-stuck` | Workflow Stuck | Critical | 60 min | 60 min |
| `budget-exceeded` | Budget Threshold | Warning | 80% | 24 hours |
| `ai-provider-failure` | AI Provider Failure | Critical | 20% (5 min) | 15 min |

---

## 🔔 Notification Channels

### Email

**Setup:**
1. Add `ALERT_EMAIL` environment variable
2. Configure email service (Resend, SendGrid, etc.)
3. Update `alert-manager.ts` to use your email service

**Example with Resend:**
```typescript
// In lib/alerts/alert-manager.ts
await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        from: 'alerts@investingpro.in',
        to: email,
        subject: `[${alert.severity.toUpperCase()}] ${rule.name}`,
        html: formatEmailAlert(alert, rule),
    }),
});
```

---

### Slack

**Setup:**
1. Create Slack webhook:
   - Go to Slack → Apps → Incoming Webhooks
   - Create webhook for your channel
   - Copy webhook URL

2. Add environment variable:
   ```env
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   ```

3. Alerts will automatically post to Slack channel

---

### Webhook

**Setup:**
1. Add webhook URL to alert rule configuration
2. Custom webhook will receive POST requests with alert data

**Payload:**
```json
{
  "alert": {
    "id": "error-rate-high-1234567890",
    "ruleId": "error-rate-high",
    "severity": "critical",
    "message": "High Error Rate: Error rate exceeds 5%",
    "timestamp": "2026-01-15T10:30:00.000Z"
  },
  "rule": {
    "id": "error-rate-high",
    "name": "High Error Rate",
    "description": "Error rate exceeds 5% in 5-minute window"
  }
}
```

---

## 🔧 Configuration

### Customize Alert Rules

Edit `lib/alerts/rules.ts` to modify alert rules:

```typescript
export const DEFAULT_ALERT_RULES: AlertRule[] = [
    {
        id: 'custom-alert',
        name: 'Custom Alert',
        description: 'Your custom alert description',
        severity: 'warning',
        enabled: true,
        condition: {
            type: 'custom',
            threshold: 100,
            windowMinutes: 5,
            query: "['level'] = 'error' AND ['context.errorCount'] > 100",
        },
        notificationChannels: [
            { type: 'email', config: { email: 'your@email.com' } },
        ],
        cooldownMinutes: 30,
    },
];
```

---

## 📊 Monitoring Alerts

### Check Active Alerts

```bash
GET /api/v1/alerts/evaluate
```

Response:
```json
{
  "activeAlerts": 2,
  "alerts": [
    {
      "id": "error-rate-high-1234567890",
      "ruleId": "error-rate-high",
      "severity": "critical",
      "message": "High Error Rate: Error rate exceeds 5%",
      "timestamp": "2026-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## 🎯 Axiom Monitor Setup (Recommended)

### 1. Error Rate Monitor

**Query:**
```
['level'] = 'error' AND _time > now() - 5m
```

**Condition:**
- Count > 10 (or your threshold)
- Evaluation: Every 1 minute

**Notification:**
- Email: your-email@example.com
- Slack: (optional)

---

### 2. API Latency Monitor

**Query:**
```
['metrics.duration'] > 2000 AND ['message'] LIKE 'API%' AND _time > now() - 5m
```

**Condition:**
- Count > 0
- Evaluation: Every 1 minute

---

### 3. Workflow Stuck Monitor

**Query:**
```
['message'] LIKE '%workflow%' AND ['context.state'] = 'running' AND ['context.duration'] > 3600000
```

**Condition:**
- Count > 0
- Evaluation: Every 5 minutes

---

## 🔒 Security

### Alert Evaluation Endpoint

Protect the evaluation endpoint with a token:

```env
ALERT_EVALUATION_TOKEN=your-secret-token-here
```

Then call with:
```bash
curl -X POST https://your-domain.com/api/v1/alerts/evaluate \
  -H "Authorization: Bearer your-secret-token-here"
```

---

## 🚨 Alert Deduplication

Alerts have cooldown periods to prevent spam:

- **Critical alerts:** 15 minutes
- **Warning alerts:** 30 minutes
- **Budget alerts:** 24 hours

Alerts won't trigger again until cooldown expires.

---

## 📈 Best Practices

1. **Start with Axiom monitors** (easiest, free)
2. **Add email notifications** for critical alerts
3. **Use Slack** for team collaboration
4. **Set appropriate cooldowns** to prevent alert fatigue
5. **Monitor alert effectiveness** - adjust thresholds as needed

---

## 🎯 Next Steps

- ✅ Alerting system implemented
- 🔄 **Next:** Task 5.1 - Distributed Tracing
- ⏸️ Task 5.2 - Application Metrics

---

**Questions?** Check the code in `lib/alerts/alert-manager.ts` or `lib/alerts/rules.ts`
