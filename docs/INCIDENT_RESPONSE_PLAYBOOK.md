# 🚨 Incident Response Playbook

**Purpose:** Standardized procedures for handling production incidents  
**Target:** Minimize downtime and impact

---

## 📋 Incident Severity Levels

### P0 - Critical (Immediate Response)
- **Service completely down**
- **Data loss or corruption**
- **Security breach**
- **Response Time:** < 5 minutes
- **Escalation:** Immediate

### P1 - High (Urgent Response)
- **Major feature broken**
- **Performance degradation (>50%)**
- **Partial service outage**
- **Response Time:** < 15 minutes
- **Escalation:** Within 1 hour

### P2 - Medium (Standard Response)
- **Minor feature broken**
- **Performance issues (<50%)**
- **Non-critical errors**
- **Response Time:** < 1 hour
- **Escalation:** Within 4 hours

### P3 - Low (Normal Response)
- **Cosmetic issues**
- **Minor bugs**
- **Documentation issues**
- **Response Time:** < 4 hours
- **Escalation:** Next business day

---

## 🚨 Incident Response Workflow

### Step 1: Detection & Triage (0-5 minutes)

**Detection Sources:**
- Sentry alerts
- Health check failures
- User reports
- Monitoring dashboards
- Uptime monitoring alerts

**Immediate Actions:**
1. **Acknowledge Incident**
   - Confirm incident in team channel
   - Assess severity level
   - Check health endpoints: `/api/health/detailed`

2. **Gather Information**
   - Check Sentry for errors
   - Review metrics dashboard (`/admin/metrics`)
   - Check Vercel logs
   - Review recent deployments

3. **Determine Severity**
   - Classify as P0/P1/P2/P3
   - Escalate if needed

---

### Step 2: Containment (5-15 minutes)

**For P0/P1 Incidents:**

1. **Immediate Containment**
   ```bash
   # Check health status
   curl https://your-domain.com/api/health/detailed
   
   # Check recent deployments
   # Review Vercel dashboard
   ```

2. **Rollback if Needed**
   - Go to Vercel Dashboard → Deployments
   - Find last working deployment
   - Promote to production
   - Or use CLI: `vercel promote <deployment-url>`

3. **Disable Affected Features** (if possible)
   - Update feature flags
   - Disable problematic endpoints
   - Add maintenance mode if needed

---

### Step 3: Investigation (15-60 minutes)

**Gather Evidence:**

1. **Error Logs**
   - Sentry: Check error details, stack traces
   - Vercel: Function logs
   - Application logs: Check correlation IDs

2. **Metrics Analysis**
   - Visit `/admin/metrics`
   - Check error rates
   - Review latency spikes
   - Identify affected endpoints

3. **Database Issues**
   ```bash
   # Test database connection
   npx tsx scripts/test-critical-flows.ts
   
   # Check Supabase dashboard
   # Review query performance
   ```

4. **Recent Changes**
   - Review recent deployments
   - Check recent code changes
   - Review environment variable changes

---

### Step 4: Resolution (30 minutes - 4 hours)

**Common Resolution Steps:**

1. **Code Fix**
   - Identify root cause
   - Create fix
   - Test locally
   - Deploy fix

2. **Configuration Fix**
   - Update environment variables
   - Adjust rate limits
   - Update feature flags

3. **Infrastructure Fix**
   - Scale resources
   - Restart services
   - Clear caches

4. **Data Fix**
   - Restore from backup
   - Fix corrupted data
   - Run data migration

---

### Step 5: Verification (15-30 minutes)

**Post-Resolution Checks:**

1. **Health Checks**
   ```bash
   curl https://your-domain.com/api/health
   curl https://your-domain.com/api/health/detailed
   ```

2. **Critical Flows**
   ```bash
   NEXT_PUBLIC_BASE_URL=https://your-domain.com \
   npx tsx scripts/test-critical-flows.ts
   ```

3. **User Verification**
   - Test affected features
   - Monitor error rates
   - Check user reports

4. **Metrics Monitoring**
   - Monitor for 1 hour
   - Check error rates return to normal
   - Verify performance restored

---

### Step 6: Post-Incident (Within 24 hours)

1. **Incident Report**
   - Document timeline
   - Root cause analysis
   - Impact assessment
   - Resolution steps

2. **Prevention Measures**
   - Identify improvements
   - Update monitoring
   - Add alerts
   - Update runbooks

3. **Team Communication**
   - Share incident report
   - Discuss learnings
   - Update documentation

---

## 🔧 Common Incident Scenarios

### Scenario 1: API Endpoint Down

**Symptoms:**
- 500 errors on specific endpoint
- High error rate in metrics

**Response:**
1. Check health endpoints
2. Review Sentry for errors
3. Check Vercel function logs
4. Review recent code changes
5. Rollback if needed
6. Fix and redeploy

---

### Scenario 2: Database Connection Issues

**Symptoms:**
- Health check shows database error
- All database queries failing

**Response:**
1. Check Supabase dashboard
2. Verify credentials
3. Check RLS policies
4. Test connection: `npx tsx scripts/test-critical-flows.ts`
5. Contact Supabase support if needed

---

### Scenario 3: High Error Rate

**Symptoms:**
- Error rate > 5% in metrics
- Multiple errors in Sentry

**Response:**
1. Check `/admin/metrics` for patterns
2. Review Sentry for error types
3. Identify affected endpoints
4. Check recent deployments
5. Review error logs with correlation IDs
6. Fix root cause

---

### Scenario 4: Performance Degradation

**Symptoms:**
- High latency (p95 > 1s)
- Slow page loads
- Timeout errors

**Response:**
1. Check metrics dashboard
2. Identify slow endpoints
3. Review database query performance
4. Check external API latency
5. Review recent changes
6. Scale resources if needed

---

### Scenario 5: Rate Limiting Issues

**Symptoms:**
- Users getting 429 errors
- Legitimate traffic blocked

**Response:**
1. Check rate limit configuration
2. Review Redis connectivity
3. Adjust rate limits if needed
4. Check for DDoS/abuse
5. Whitelist legitimate IPs if needed

---

## 📊 Monitoring & Alerts

### Key Metrics to Monitor

1. **Error Rate**
   - Alert if > 1% for 5 minutes
   - Alert if > 5% for 1 minute

2. **Latency**
   - Alert if p95 > 1s for 5 minutes
   - Alert if p99 > 2s for 1 minute

3. **Health Checks**
   - Alert if health check fails
   - Alert if readiness check fails

4. **Throughput**
   - Alert if traffic drops > 50%
   - Alert if traffic spikes > 200%

### Alert Channels

- **Sentry:** Error alerts
- **Vercel:** Deployment failures
- **Uptime Monitoring:** Health check failures
- **Team Channel:** Critical alerts

---

## 🆘 Escalation Path

### On-Call Engineer
- **Primary responder**
- **Available:** 24/7 for P0/P1
- **Responsibilities:** Initial triage, containment, resolution

### Team Lead
- **Escalation:** If incident not resolved in 30 minutes
- **Responsibilities:** Coordinate response, make decisions

### CTO/Engineering Manager
- **Escalation:** P0 incidents, security breaches
- **Responsibilities:** Strategic decisions, external communication

---

## 📝 Incident Report Template

```markdown
## Incident Report - [Date]

**Incident ID:** [Unique ID]
**Severity:** P0/P1/P2/P3
**Status:** Resolved/Investigating/Mitigated

### Timeline
- **Detected:** [Time]
- **Acknowledged:** [Time]
- **Contained:** [Time]
- **Resolved:** [Time]

### Impact
- **Users Affected:** [Number/Percentage]
- **Duration:** [Time]
- **Services Affected:** [List]

### Root Cause
[Detailed explanation]

### Resolution
[Steps taken to resolve]

### Prevention
[Measures to prevent recurrence]

### Lessons Learned
[Key takeaways]
```

---

## 🔗 Quick Links

- **Health Checks:** `/api/health/detailed`
- **Metrics Dashboard:** `/admin/metrics`
- **Sentry:** [Sentry Dashboard URL]
- **Vercel:** [Vercel Dashboard URL]
- **Supabase:** [Supabase Dashboard URL]

---

## 📞 Emergency Contacts

- **On-Call Engineer:** [Contact]
- **Team Lead:** [Contact]
- **CTO:** [Contact]
- **Vercel Support:** [Support URL]
- **Supabase Support:** [Support URL]

---

*Last Updated: January 13, 2026*
