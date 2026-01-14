# 📊 Monitoring Setup Guide

**Purpose:** Complete guide for setting up production monitoring  
**Target:** 90% Production Readiness

---

## 🎯 Monitoring Stack Overview

### Current Setup (85% Complete)

✅ **Built-in Monitoring:**
- Health check endpoints (4 endpoints)
- Metrics collection system
- Metrics dashboard (`/admin/metrics`)
- Structured logging
- Sentry error tracking

⏳ **External Services (Optional):**
- Log aggregation (Datadog/LogRocket)
- Uptime monitoring (UptimeRobot/Pingdom)
- Performance monitoring (Core Web Vitals)

---

## ✅ Step 1: Verify Built-in Monitoring

### 1.1 Health Checks

**Endpoints:**
- `/api/health` - Basic health check
- `/api/health/detailed` - Comprehensive status
- `/api/health/readiness` - Kubernetes readiness
- `/api/health/liveness` - Kubernetes liveness

**Test:**
```bash
curl https://your-domain.com/api/health/detailed
```

**Expected Response:**
```json
{
  "status": "ok",
  "services": {
    "supabase": { "status": "ok", "latency": 50 },
    "redis": { "status": "ok", "latency": 10 },
    ...
  }
}
```

---

### 1.2 Metrics Dashboard

**Access:**
- URL: `https://your-domain.com/admin/metrics`
- Requires: Admin authentication

**Features:**
- Real-time API metrics
- Latency percentiles (p50, p95, p99)
- Error rates
- Throughput
- Recent requests

**Verify:**
1. Visit dashboard
2. Check metrics are updating
3. Verify auto-refresh works

---

### 1.3 Structured Logging

**Configuration:**
- File: `lib/logger.ts`
- Correlation IDs: Enabled
- Request tracking: Enabled
- External hooks: Ready

**Test:**
```typescript
import { logger } from '@/lib/logger';

logger.info('Test log', { test: true });
```

**Verify:**
- Logs include correlation IDs
- Logs are structured JSON
- Errors sent to Sentry

---

### 1.4 Sentry Error Tracking

**Configuration:**
- Files: `sentry.client.config.ts`, `sentry.server.config.ts`
- Environment tracking: Enabled
- Release tracking: Enabled
- Error filtering: Configured

**Verify:**
1. Go to Sentry Dashboard
2. Check project is receiving errors
3. Verify environment tags
4. Test error capture

---

## ⏳ Step 2: Setup Log Aggregation (Optional)

### Option A: Datadog (Recommended)

**Why Datadog:**
- Comprehensive monitoring
- Log aggregation + APM
- Good Next.js integration
- Free tier available

**Setup Steps:**

1. **Sign Up**
   - Go to [datadoghq.com](https://www.datadoghq.com)
   - Create account
   - Get API key

2. **Install Agent** (Optional - for APM)
   ```bash
   npm install dd-trace
   ```

3. **Configure Logger**
   - Update `lib/logger.ts`
   - Add Datadog log forwarding
   - Set `LOG_AGGREGATION_SERVICE=datadog`
   - Add `DATADOG_API_KEY` to environment

4. **Verify**
   - Check Datadog dashboard
   - Verify logs are appearing
   - Test log search

---

### Option B: LogRocket (Simple)

**Why LogRocket:**
- Simple setup
- Great for frontend debugging
- Session replay
- Free tier available

**Setup Steps:**

1. **Sign Up**
   - Go to [logrocket.com](https://logrocket.com)
   - Create account
   - Get project ID

2. **Install SDK**
   ```bash
   npm install logrocket
   ```

3. **Configure**
   - Add to `app/layout.tsx`
   - Initialize LogRocket
   - Configure for production

4. **Verify**
   - Check LogRocket dashboard
   - Verify sessions are recorded

---

### Option C: Better Stack (HTTP API)

**Why Better Stack:**
- Simple HTTP API
- No agent required
- Free tier available

**Setup Steps:**

1. **Sign Up**
   - Go to [betterstack.com](https://betterstack.com)
   - Create account
   - Get API key

2. **Configure Logger**
   - Update `lib/logger.ts`
   - Add Better Stack log forwarding
   - Set `LOG_AGGREGATION_SERVICE=better-stack`
   - Add `BETTER_STACK_API_KEY` to environment

3. **Verify**
   - Check Better Stack dashboard
   - Verify logs are appearing

---

## ⏳ Step 3: Setup Uptime Monitoring (Optional)

### Option A: UptimeRobot (Free Tier)

**Why UptimeRobot:**
- Free tier (50 monitors)
- Simple setup
- Email/SMS alerts

**Setup Steps:**

1. **Sign Up**
   - Go to [uptimerobot.com](https://uptimerobot.com)
   - Create account

2. **Add Monitor**
   - Monitor Type: HTTP(s)
   - URL: `https://your-domain.com/api/health`
   - Monitoring Interval: 5 minutes
   - Alert Contacts: Add email/SMS

3. **Add Additional Monitors**
   - `/api/health/readiness` - Readiness check
   - `/api/health/detailed` - Detailed health
   - Main website URL

4. **Configure Alerts**
   - Set up email alerts
   - Configure SMS (optional)
   - Set up team notifications

---

### Option B: Pingdom

**Why Pingdom:**
- Professional monitoring
- Advanced features
- Good reporting

**Setup Steps:**

1. **Sign Up**
   - Go to [pingdom.com](https://www.pingdom.com)
   - Create account

2. **Add Check**
   - Check Type: HTTP
   - URL: `https://your-domain.com/api/health`
   - Check Interval: 1 minute
   - Alert Contacts: Configure

3. **Verify**
   - Check Pingdom dashboard
   - Verify checks are passing
   - Test alert delivery

---

## ✅ Step 4: Setup Performance Monitoring

### 4.1 Core Web Vitals Tracking

**Implementation:**
- File: `lib/performance/web-vitals.ts`
- Component: `components/performance/WebVitalsTracker.tsx`

**Setup:**

1. **Install Dependencies**
   ```bash
   npm install web-vitals
   ```

2. **Add to Layout**
   ```typescript
   // app/layout.tsx
   import WebVitalsTracker from '@/components/performance/WebVitalsTracker';
   
   // In your layout component:
   <WebVitalsTracker />
   ```

3. **Verify**
   - Check PostHog for web_vital events
   - Check `/api/analytics/track` logs
   - Verify metrics are being captured

---

### 4.2 Real User Monitoring (RUM)

**Using PostHog:**

PostHog already provides RUM. Verify it's working:

1. **Check PostHog Dashboard**
   - Go to PostHog dashboard
   - Check "Session Replay" (if enabled)
   - Review user sessions

2. **Verify Configuration**
   - Check `components/common/Analytics.tsx`
   - Verify PostHog is initialized
   - Check environment variables

---

## 📊 Step 5: Configure Alerts

### 5.1 Sentry Alerts

**Setup:**

1. Go to Sentry Dashboard → Alerts
2. Create Alert Rule:
   - **Trigger:** Error rate > 5% in 5 minutes
   - **Action:** Email/Slack notification
   - **Recipients:** Team members

3. Create Additional Alerts:
   - Critical errors (P0)
   - New error types
   - Performance degradation

---

### 5.2 Vercel Alerts

**Setup:**

1. Go to Vercel Dashboard → Project → Settings → Notifications
2. Configure:
   - Deployment failures
   - Build failures
   - Function errors

---

### 5.3 Custom Alerts (Optional)

**Using Monitoring Service:**

If using Datadog/Pingdom:
- Configure alert thresholds
- Set up notification channels
- Test alert delivery

---

## ✅ Step 6: Verify Complete Setup

### Checklist

- [ ] Health checks responding
- [ ] Metrics dashboard accessible
- [ ] Structured logging working
- [ ] Sentry receiving errors
- [ ] Log aggregation configured (optional)
- [ ] Uptime monitoring active (optional)
- [ ] Core Web Vitals tracking (optional)
- [ ] Alerts configured
- [ ] Team notified of alert channels

---

## 📈 Monitoring Best Practices

### 1. Regular Reviews

- **Daily:** Check error rates, latency
- **Weekly:** Review metrics trends
- **Monthly:** Analyze performance patterns

### 2. Alert Tuning

- Start with conservative thresholds
- Adjust based on actual patterns
- Avoid alert fatigue

### 3. Dashboard Organization

- Create custom dashboards for different teams
- Focus on key metrics
- Set up automated reports

### 4. Documentation

- Document alert procedures
- Keep runbooks updated
- Share learnings with team

---

## 🆘 Troubleshooting

### Health Checks Failing

1. Check database connectivity
2. Verify Redis connection (if configured)
3. Review error logs
4. Check environment variables

### Metrics Not Updating

1. Verify metrics endpoint: `/api/metrics`
2. Check metrics middleware is applied
3. Review application logs
4. Verify dashboard is accessible

### Sentry Not Receiving Errors

1. Verify `NEXT_PUBLIC_SENTRY_DSN` is set
2. Check Sentry configuration files
3. Test error capture manually
4. Review Sentry dashboard

### Log Aggregation Not Working

1. Verify API keys are correct
2. Check network connectivity
3. Review logger configuration
4. Test log forwarding manually

---

## 📖 Related Documentation

- **Production Hardening Plan:** `docs/AUDIT_RESULTS/08_PRODUCTION_HARDENING_PLAN.md`
- **Incident Response Playbook:** `docs/INCIDENT_RESPONSE_PLAYBOOK.md`
- **Deployment Runbook:** `docs/DEPLOYMENT_RUNBOOK.md`

---

*Last Updated: January 13, 2026*
