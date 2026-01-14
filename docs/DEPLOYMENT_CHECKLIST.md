# Production Deployment Checklist

## Pre-Deployment (Day -2)

### Environment Setup
- [ ] All environment variables set in Vercel
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `INNGEST_EVENT_KEY`
  - [ ] `INNGEST_SIGNING_KEY`
  - [ ] At least one AI provider API key
  - [ ] `NEXT_PUBLIC_SENTRY_DSN` (optional but recommended)
  - [ ] `ALERT_WEBHOOK_URL` (for critical alerts)

### Database
- [ ] All migrations applied to production database
- [ ] Soft delete migration applied (`20260114_soft_delete.sql`)
- [ ] State machine enforcement migration applied
- [ ] System settings table exists
- [ ] At least one admin user created
- [ ] Database backup configured

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] All lint errors resolved
- [ ] No console.log statements in production code
- [ ] No TODO/FIXME comments for critical issues

### Safety Features
- [ ] Circuit breaker implemented in continuous mode
- [ ] Health check endpoint returns 200
- [ ] Idempotency middleware applied to critical endpoints
- [ ] Admin authentication enforces admin role
- [ ] Soft delete prevents permanent data loss
- [ ] Environment validation enabled

### Testing
- [ ] Health check endpoint tested: `curl https://investingpro.in/api/health`
- [ ] Admin login tested with admin user
- [ ] Admin login tested with non-admin user (should fail)
- [ ] Article generation flow tested end-to-end
- [ ] Duplicate request handling tested
- [ ] Circuit breaker tested with simulated failures

### Monitoring
- [ ] Sentry configured and receiving test errors
- [ ] UptimeRobot monitoring configured for `/api/health`
- [ ] Alert webhook tested (send test alert)
- [ ] Vercel analytics enabled

---

## Launch Day (Day 0)

### Deployment
- [ ] Deploy to production via Vercel
- [ ] Verify deployment successful
- [ ] Check Vercel deployment logs for errors

### Verification
- [ ] Health check returns 200: `curl https://investingpro.in/api/health`
- [ ] Homepage loads successfully
- [ ] Admin panel accessible
- [ ] Database connection working
- [ ] Redis connection working (if configured)
- [ ] AI providers configured correctly

### Initial Testing
- [ ] Generate one test article
- [ ] Verify article appears in database
- [ ] Verify article appears on frontend
- [ ] Test admin authentication
- [ ] Test soft delete (delete and restore test article)

### Monitoring Setup
- [ ] Verify Sentry receiving errors
- [ ] Verify UptimeRobot monitoring active
- [ ] Verify alert webhook working
- [ ] Check Vercel logs for any errors

### First 2 Hours
- [ ] Monitor health check status (should stay 200)
- [ ] Monitor Sentry for critical errors
- [ ] Monitor database size
- [ ] Monitor AI costs
- [ ] Check for any failed workflows

---

## Post-Launch (Day +1 to +7)

### Daily Checks
- [ ] Health check status (should be 200 always)
- [ ] Sentry error rate (should be <5%)
- [ ] AI cost (should be <$50/day)
- [ ] Workflow failure rate (should be <10%)
- [ ] Database size growth (should be <100MB/day)

### Weekly Review
- [ ] Review all Sentry errors
- [ ] Review workflow failures
- [ ] Review AI costs
- [ ] Review database size
- [ ] Review uptime percentage (should be >99%)

### Red Flags (Immediate Action Required)
- ⚠️ Health check returns 503 for >5 minutes
- ⚠️ Sentry error rate >20%
- ⚠️ AI cost >$200/day
- ⚠️ Workflow failure rate >50%
- ⚠️ Database size grows >1GB/day
- ⚠️ Uptime <95%

---

## Rollback Procedure

If critical issues occur:

1. **Immediate Rollback**
   - Go to Vercel dashboard
   - Click "Deployments"
   - Find last working deployment
   - Click "..." → "Promote to Production"

2. **Verify Rollback**
   - Check health endpoint: `curl https://investingpro.in/api/health`
   - Verify homepage loads
   - Check Sentry for new errors

3. **Investigate Issue**
   - Review Vercel deployment logs
   - Review Sentry errors
   - Review database logs
   - Identify root cause

4. **Fix and Redeploy**
   - Fix issue in code
   - Test locally
   - Deploy to staging (if available)
   - Test staging
   - Redeploy to production

---

## Emergency Contacts

- **Platform Owner:** [Your Name/Email]
- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/support
- **Sentry Support:** https://sentry.io/support

---

## Success Criteria

Platform is considered successfully deployed when:

- ✅ Health check returns 200 for 24 hours straight
- ✅ No critical errors in Sentry
- ✅ At least 10 articles generated successfully
- ✅ Uptime >99% for first week
- ✅ AI costs within budget (<$50/day)
- ✅ No workflow failures for 24 hours
