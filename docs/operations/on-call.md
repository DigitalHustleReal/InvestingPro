# On-Call Playbook

**Version:** 1.0  
**Last Updated:** January 22, 2026  
**Purpose:** Guide for on-call engineers handling incidents

---

## 📋 Table of Contents

1. [On-Call Responsibilities](#1-on-call-responsibilities)
2. [Incident Severity Levels](#2-incident-severity-levels)
3. [Incident Response Process](#3-incident-response-process)
4. [Common Incidents](#4-common-incidents)
5. [Escalation Procedures](#5-escalation-procedures)
6. [Communication Templates](#6-communication-templates)

---

## 1. On-Call Responsibilities

### Primary Responsibilities

1. **Monitor Alerts**
   - Respond to alerts within SLA
   - Acknowledge alerts promptly
   - Investigate and resolve issues

2. **Maintain System Health**
   - Monitor dashboards
   - Review logs
   - Check metrics

3. **Handle Incidents**
   - Follow incident response process
   - Document incidents
   - Escalate when needed

4. **Communicate**
   - Update stakeholders
   - Post status updates
   - Document resolutions

---

## 2. Incident Severity Levels

### P0 - Critical (Immediate Response)

**Definition:**
- System completely down
- Data loss or corruption
- Security breach
- Complete service outage

**Response Time:** Immediate (<5 minutes)

**Examples:**
- Database unavailable
- All API endpoints returning 500
- Authentication system down
- Data corruption detected

**Actions:**
1. Acknowledge immediately
2. Start incident call
3. Escalate to team lead
4. Post status updates every 15 minutes

---

### P1 - High (Urgent Response)

**Definition:**
- Major feature broken
- Significant performance degradation
- Partial service outage
- Budget exhausted

**Response Time:** <15 minutes

**Examples:**
- Content generation failing
- High error rate (>5%)
- Slow API responses (>2s)
- Budget auto-paused

**Actions:**
1. Acknowledge within 15 minutes
2. Investigate root cause
3. Implement fix or workaround
4. Post status updates every 30 minutes

---

### P2 - Medium (Normal Response)

**Definition:**
- Minor feature issues
- Performance degradation
- Non-critical errors
- User-reported bugs

**Response Time:** <2 hours

**Examples:**
- Single endpoint failing
- Increased latency
- Non-critical errors
- UI issues

**Actions:**
1. Acknowledge within 2 hours
2. Investigate during business hours
3. Fix in next deployment
4. Update ticket

---

### P3 - Low (Best Effort)

**Definition:**
- Cosmetic issues
- Documentation updates
- Feature requests
- Non-urgent improvements

**Response Time:** Next business day

**Examples:**
- UI typos
- Documentation errors
- Enhancement requests
- Non-critical optimizations

**Actions:**
1. Acknowledge within 24 hours
2. Schedule for next sprint
3. Update ticket

---

## 3. Incident Response Process

### Step 1: Acknowledge

**Immediate Actions:**
1. Acknowledge alert in Axiom/Slack
2. Post in incident channel
3. Start investigation

**Template:**
```
🚨 INCIDENT: [Brief Description]
Severity: P0/P1/P2/P3
Status: Investigating
On-Call: [Your Name]
Started: [Time]
```

---

### Step 2: Investigate

**Checklist:**
1. **Health Checks**
   ```bash
   curl https://investingpro.in/api/health
   ```

2. **Review Logs**
   - Check Axiom for errors
   - Review recent audit logs
   - Check workflow status

3. **Check Metrics**
   ```bash
   curl https://investingpro.in/api/metrics
   ```

4. **Verify Dependencies**
   - Database connectivity
   - Redis connectivity
   - AI provider status
   - External services

---

### Step 3: Diagnose

**Identify Root Cause:**
1. Review error messages
2. Check recent changes
3. Verify configuration
4. Test hypotheses

**Document:**
- Root cause
- Affected systems
- User impact
- Timeline

---

### Step 4: Resolve

**Fix or Workaround:**
1. **Immediate Fix**
   - Deploy hotfix if needed
   - Restart services
   - Clear cache

2. **Workaround**
   - Pause affected features
   - Route traffic away
   - Manual intervention

3. **Verify Resolution**
   - Test functionality
   - Monitor metrics
   - Confirm alerts cleared

---

### Step 5: Communicate

**Update Stakeholders:**
1. Post status update
2. Update incident ticket
3. Notify affected users if needed
4. Document resolution

**Template:**
```
✅ RESOLVED: [Brief Description]
Root Cause: [Cause]
Resolution: [What was done]
Duration: [Time]
Next Steps: [Follow-up actions]
```

---

### Step 6: Post-Mortem

**Within 24 Hours:**
1. Document incident
2. Identify improvements
3. Create action items
4. Update runbook

---

## 4. Common Incidents

### Incident: System Down

**Severity:** P0

**Symptoms:**
- Health check returns `unhealthy`
- All endpoints returning 500
- No response from API

**Investigation:**
```bash
# Check health
curl https://investingpro.in/api/health

# Check logs
# Review Axiom dashboard

# Check Vercel status
# Check Supabase status
```

**Resolution:**
1. Check Vercel deployment status
2. Verify Supabase connectivity
3. Check environment variables
4. Redeploy if needed
5. Restart services

**Prevention:**
- Monitor health checks
- Set up alerts
- Regular deployments
- Test rollback procedures

---

### Incident: Database Performance Degradation

**Severity:** P1

**Symptoms:**
- Slow query alerts
- High connection pool usage
- Timeout errors

**Investigation:**
```sql
-- Check slow queries
SELECT * FROM slow_queries
WHERE execution_time_ms > 1000
ORDER BY execution_time_ms DESC
LIMIT 20;

-- Check connection pool
SELECT * FROM connection_pool_stats;
```

**Resolution:**
1. Identify slow queries
2. Add indexes if needed
3. Optimize queries
4. Scale database if needed
5. Archive old data

**Prevention:**
- Regular query optimization
- Monitor slow queries
- Archive old data
- Review indexes

---

### Incident: Budget Exhausted

**Severity:** P1

**Symptoms:**
- Budget alerts triggered
- Generation paused
- Cost dashboard shows 100%

**Investigation:**
```bash
# Check budget status
curl -H "Authorization: Bearer $TOKEN" \
  https://investingpro.in/api/v1/budget/status

# Check cost breakdown
curl -H "Authorization: Bearer $TOKEN" \
  https://investingpro.in/api/v1/admin/cost-dashboard
```

**Resolution:**
1. Review cost breakdown
2. Identify high-cost operations
3. Set new budget
4. Resume generation
5. Optimize costs

**Prevention:**
- Monitor daily costs
- Set appropriate budgets
- Optimize provider usage
- Review cost trends

---

### Incident: High Error Rate

**Severity:** P1

**Symptoms:**
- Error rate >5%
- Multiple alerts
- User complaints

**Investigation:**
```bash
# Get recent errors
curl -H "Authorization: Bearer $TOKEN" \
  "https://investingpro.in/api/v1/admin/audit-log?severity=error&limit=100"

# Check metrics
curl https://investingpro.in/api/metrics | grep error_rate
```

**Resolution:**
1. Identify error pattern
2. Check recent deployments
3. Review error logs
4. Deploy fix
5. Monitor recovery

**Prevention:**
- Test before deploy
- Monitor error rates
- Set up alerts
- Review logs regularly

---

### Incident: AI Provider Failures

**Severity:** P2

**Symptoms:**
- AI calls failing
- Generation errors
- Provider timeouts

**Investigation:**
```bash
# Check provider health
curl -H "Authorization: Bearer $TOKEN" \
  https://investingpro.in/api/health

# Check provider status pages
# Review error logs
```

**Resolution:**
1. Verify API keys
2. Check provider status
3. Retry with backoff
4. Failover to next provider
5. Update provider config

**Prevention:**
- Multiple providers configured
- Automatic failover
- Monitor provider health
- Set up alerts

---

## 5. Escalation Procedures

### When to Escalate

**Escalate to Team Lead:**
- P0 incidents
- P1 incidents lasting >1 hour
- Security incidents
- Data loss incidents
- Unclear resolution path

**Escalate to CTO:**
- P0 incidents lasting >2 hours
- Security breaches
- Major data loss
- Legal/compliance issues

### Escalation Template

```
🚨 ESCALATION REQUEST

Incident: [Description]
Severity: P0/P1
Duration: [Time]
Current Status: [Status]
Actions Taken: [List]
Next Steps: [What you need]
Contact: [Your info]
```

---

## 6. Communication Templates

### Initial Alert

```
🚨 INCIDENT: [Brief Description]
Severity: P0/P1/P2/P3
Status: Investigating
On-Call: [Name]
Started: [Time]
Impact: [What's affected]
```

### Status Update

```
📊 UPDATE: [Incident Name]
Status: [Investigating/Resolved]
Progress: [What's been done]
ETA: [Expected resolution time]
Next Update: [Time]
```

### Resolution

```
✅ RESOLVED: [Incident Name]
Root Cause: [Cause]
Resolution: [What was done]
Duration: [Time]
Prevention: [Steps to prevent recurrence]
```

---

## 7. On-Call Checklist

### Start of Shift

- [ ] Review overnight alerts
- [ ] Check system health
- [ ] Review pending incidents
- [ ] Verify alert channels working
- [ ] Check on-call calendar

### During Shift

- [ ] Monitor alerts
- [ ] Respond to incidents
- [ ] Update status pages
- [ ] Document actions
- [ ] Communicate updates

### End of Shift

- [ ] Hand off pending incidents
- [ ] Document shift summary
- [ ] Update runbook if needed
- [ ] Review incident trends

---

## 8. Tools & Resources

### Monitoring Dashboards

- **Axiom**: https://app.axiom.co
- **Vercel**: https://vercel.com/dashboard
- **Supabase**: https://supabase.com/dashboard
- **Prometheus**: `/api/metrics`

### Communication Channels

- **Slack**: #incidents channel
- **Email**: alerts@investingpro.in
- **Status Page**: (if configured)

### Documentation

- [Runbook](./runbook.md)
- [Troubleshooting Guide](./troubleshooting.md)
- [System Design](../SYSTEM_DESIGN.md)

---

**See Also:**
- [Runbook](./runbook.md)
- [Troubleshooting Guide](./troubleshooting.md)
- [Emergency Procedures](./runbook.md#5-emergency-procedures)
