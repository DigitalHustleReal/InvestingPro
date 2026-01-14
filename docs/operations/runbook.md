# Operations Runbook

**Version:** 1.0  
**Last Updated:** January 22, 2026  
**Purpose:** Common operations and procedures for the InvestingPro platform

---

## 📋 Table of Contents

1. [Common Operations](#1-common-operations)
2. [Daily Operations](#2-daily-operations)
3. [Weekly Operations](#3-weekly-operations)
4. [Monthly Operations](#4-monthly-operations)
5. [Emergency Procedures](#5-emergency-procedures)
6. [Maintenance Tasks](#6-maintenance-tasks)

---

## 1. Common Operations

### 1.1 Check System Health

**Command:**
```bash
curl https://investingpro.in/api/health
```

**Expected Response:**
```json
{
    "status": "healthy",
    "checks": {
        "database": { "status": "ok", "latency_ms": 45 },
        "cache": { "status": "ok", "latency_ms": 12 },
        "ai_providers": { "status": "ok", "available_providers": 5 }
    }
}
```

**Troubleshooting:**
- If `status` is `degraded`: Check individual check statuses
- If `status` is `unhealthy`: Follow emergency procedures

### 1.2 Check Budget Status

**Via API:**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://investingpro.in/api/v1/budget/status
```

**Via Admin Dashboard:**
1. Navigate to `/admin/cost-dashboard`
2. View daily and monthly budgets
3. Check projections

**Actions:**
- If budget exhausted: Set new budget or wait for reset
- If approaching limit: Review cost breakdown

### 1.3 View Recent Logs

**Via Axiom:**
1. Log into Axiom dashboard
2. Select `investingpro-logs` dataset
3. Filter by time range, severity, or service

**Via API:**
```bash
# Get recent errors
curl -H "Authorization: Bearer $TOKEN" \
  "https://investingpro.in/api/v1/admin/audit-log?severity=error&limit=50"
```

### 1.4 Check Workflow Status

**Via API:**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://investingpro.in/api/v1/workflows/[id]
```

**Check Stuck Workflows:**
```sql
SELECT * FROM workflow_instances
WHERE state = 'running'
AND started_at < NOW() - INTERVAL '1 hour';
```

### 1.5 Pause/Resume Budget

**Pause Budget:**
```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"pause": true}' \
  https://investingpro.in/api/v1/admin/budget/pause
```

**Resume Budget:**
```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"pause": false}' \
  https://investingpro.in/api/v1/admin/budget/pause
```

---

## 2. Daily Operations

### 2.1 Morning Checklist

1. **Check System Health**
   ```bash
   curl https://investingpro.in/api/health
   ```

2. **Review Overnight Alerts**
   - Check Axiom for critical alerts
   - Review cost alerts
   - Check error rates

3. **Verify Budget Status**
   - Check daily budget usage
   - Review cost projections
   - Ensure budget not exhausted

4. **Check Workflow Status**
   - Verify no stuck workflows
   - Check workflow completion rates
   - Review failed workflows

5. **Review Content Generation**
   - Check articles generated overnight
   - Verify quality scores
   - Review published articles

### 2.2 Daily Cost Report

**Automatic:** Sent daily at 8 AM UTC via cron job

**Manual Trigger:**
```bash
curl -X POST \
  -H "Authorization: Bearer $CRON_SECRET" \
  https://investingpro.in/api/cron/daily-cost-report
```

**Review:**
- Check email/Slack for daily report
- Review cost breakdown by provider
- Verify projections

### 2.3 Monitor Performance

**Check Metrics:**
```bash
curl https://investingpro.in/api/metrics
```

**Key Metrics:**
- API request rate
- Error rate
- Database query latency
- Cache hit rate
- AI provider latency

---

## 3. Weekly Operations

### 3.1 Weekly Review

1. **Content Performance**
   - Review top-performing articles
   - Check engagement metrics
   - Identify optimization opportunities

2. **Cost Analysis**
   - Review weekly costs
   - Compare to budget
   - Optimize provider usage

3. **System Health**
   - Review error trends
   - Check slow queries
   - Review alert frequency

4. **Database Maintenance**
   - Check table sizes
   - Review slow queries
   - Verify indexes

### 3.2 Database Cleanup

**Check Table Sizes:**
```sql
SELECT * FROM table_sizes
ORDER BY size_bytes DESC
LIMIT 20;
```

**Archive Old Data:**
```bash
curl -X POST \
  -H "Authorization: Bearer $CRON_SECRET" \
  https://investingpro.in/api/cron/archive-data
```

---

## 4. Monthly Operations

### 4.1 Monthly Budget Review

1. **Review Monthly Costs**
   - Check total monthly spend
   - Compare to budget
   - Analyze trends

2. **Optimize Budget**
   - Adjust daily limits if needed
   - Review provider costs
   - Optimize prompt selection

3. **Cost Forecasting**
   - Review projections
   - Adjust budgets
   - Plan for next month

### 4.2 Performance Review

1. **Review SLA Compliance**
   - Check availability metrics
   - Review latency percentiles
   - Verify error rates

2. **System Optimization**
   - Review slow queries
   - Optimize database indexes
   - Review cache hit rates

3. **Capacity Planning**
   - Review growth trends
   - Plan for scaling
   - Adjust resources

---

## 5. Emergency Procedures

### 5.1 System Down

**Symptoms:**
- Health check returns `unhealthy`
- API endpoints returning 500 errors
- Database connection failures

**Steps:**
1. **Check Health Endpoint**
   ```bash
   curl https://investingpro.in/api/health
   ```

2. **Check Individual Services**
   ```bash
   curl https://investingpro.in/api/health/liveness
   curl https://investingpro.in/api/health/readiness
   ```

3. **Check Logs**
   - Review Axiom logs for errors
   - Check database connection logs
   - Review recent deployments

4. **Restart Services**
   - Redeploy on Vercel if needed
   - Check Supabase status
   - Verify Redis connection

5. **Escalate**
   - Contact team lead
   - Post in incident channel
   - Document incident

### 5.2 Budget Exhausted

**Symptoms:**
- Cost alerts triggered
- Generation paused
- Budget status shows 100%

**Steps:**
1. **Verify Budget Status**
   ```bash
   curl -H "Authorization: Bearer $TOKEN" \
     https://investingpro.in/api/v1/budget/status
   ```

2. **Review Costs**
   - Check cost dashboard
   - Review provider breakdown
   - Identify high-cost operations

3. **Set New Budget**
   ```bash
   curl -X POST \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"maxCostPerDay": 100}' \
     https://investingpro.in/api/v1/admin/budget/daily
   ```

4. **Resume Generation**
   - Unpause budget
   - Verify generation resumes
   - Monitor costs

### 5.3 Database Performance Degradation

**Symptoms:**
- Slow query alerts
- High connection pool usage
- Timeout errors

**Steps:**
1. **Check Database Metrics**
   ```bash
   curl -H "Authorization: Bearer $TOKEN" \
     https://investingpro.in/api/v1/admin/database/performance
   ```

2. **Review Slow Queries**
   ```sql
   SELECT * FROM slow_queries
   WHERE execution_time_ms > 1000
   ORDER BY execution_time_ms DESC
   LIMIT 20;
   ```

3. **Optimize Queries**
   - Add indexes if needed
   - Rewrite slow queries
   - Review query plans

4. **Scale Database**
   - Increase connection pool size
   - Upgrade Supabase plan if needed
   - Add read replicas

### 5.4 High Error Rate

**Symptoms:**
- Error rate > 5%
- Multiple alerts triggered
- User complaints

**Steps:**
1. **Check Error Logs**
   ```bash
   # Get recent errors
   curl -H "Authorization: Bearer $TOKEN" \
     "https://investingpro.in/api/v1/admin/audit-log?severity=error&limit=100"
   ```

2. **Identify Error Pattern**
   - Group by error type
   - Check affected endpoints
   - Review error messages

3. **Check System Health**
   - Verify database connectivity
   - Check AI provider status
   - Review cache status

4. **Fix Root Cause**
   - Deploy fix if code issue
   - Restart services if needed
   - Scale resources if needed

5. **Monitor Recovery**
   - Watch error rate decrease
   - Verify functionality restored
   - Document incident

---

## 6. Maintenance Tasks

### 6.1 Clear Cache

**Clear All Cache:**
```typescript
import { cacheService } from '@/lib/cache/cache-service';

await cacheService.clearAll();
```

**Clear Specific Tags:**
```typescript
await cacheService.invalidateByTags(['articles', 'products']);
```

### 6.2 Update Prompts

**Create New Version:**
```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "base_prompt_id": "uuid",
    "updates": {
      "user_prompt_template": "New template..."
    }
  }' \
  https://investingpro.in/api/v1/admin/prompts
```

**Activate Best Version:**
```typescript
import { autoOptimizePrompt } from '@/lib/ai/prompt-manager';

await autoOptimizePrompt('article-generator');
```

### 6.3 Rollback Article Version

**Via API:**
```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  https://investingpro.in/api/v1/articles/[id]/rollback/[version]
```

**Via UI:**
1. Navigate to article edit page
2. Click "Version History"
3. Select version to restore
4. Click "Rollback"

### 6.4 Archive Old Data

**Manual Archive:**
```bash
curl -X POST \
  -H "Authorization: Bearer $CRON_SECRET" \
  https://investingpro.in/api/cron/archive-data
```

**Verify Archive:**
```sql
SELECT * FROM archive_logs
ORDER BY archived_at DESC
LIMIT 10;
```

---

## 7. Monitoring & Alerts

### 7.1 Key Metrics to Monitor

- **Availability**: Target 99.9%
- **Error Rate**: Target <1%
- **Latency**: P95 <500ms
- **Budget Usage**: Alert at 50%, 80%, 100%
- **Database Performance**: Query time <200ms

### 7.2 Alert Channels

- **Email**: Critical alerts
- **Slack**: All alerts
- **Axiom**: Native monitors
- **Webhook**: Custom integrations

### 7.3 Alert Response

1. **Acknowledge Alert**
2. **Investigate Issue**
3. **Fix or Escalate**
4. **Document Resolution**

---

**See Also:**
- [Troubleshooting Guide](./troubleshooting.md)
- [On-Call Playbook](./on-call.md)
- [System Design Documentation](../SYSTEM_DESIGN.md)
