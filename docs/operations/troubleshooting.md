# Troubleshooting Guide

**Version:** 1.0  
**Last Updated:** January 22, 2026

---

## 📋 Table of Contents

1. [Common Issues](#1-common-issues)
2. [Error Messages](#2-error-messages)
3. [Performance Issues](#3-performance-issues)
4. [Database Issues](#4-database-issues)
5. [AI Provider Issues](#5-ai-provider-issues)
6. [Workflow Issues](#6-workflow-issues)
7. [Budget Issues](#7-budget-issues)

---

## 1. Common Issues

### Issue: API Returns 500 Error

**Symptoms:**
- API endpoints returning 500 status
- Error logs showing exceptions

**Diagnosis:**
```bash
# Check health endpoint
curl https://investingpro.in/api/health

# Check recent errors
curl -H "Authorization: Bearer $TOKEN" \
  "https://investingpro.in/api/v1/admin/audit-log?severity=error&limit=10"
```

**Common Causes:**
1. Database connection failure
2. Missing environment variables
3. Code errors
4. External service failures

**Solutions:**
1. Check database connectivity
2. Verify environment variables
3. Review error logs
4. Check external service status

---

### Issue: Slow API Responses

**Symptoms:**
- API latency >1s
- Timeout errors
- User complaints

**Diagnosis:**
```bash
# Check metrics
curl https://investingpro.in/api/metrics | grep latency

# Check database performance
curl -H "Authorization: Bearer $TOKEN" \
  https://investingpro.in/api/v1/admin/database/performance
```

**Common Causes:**
1. Slow database queries
2. Missing indexes
3. Cache misses
4. High load

**Solutions:**
1. Optimize slow queries
2. Add database indexes
3. Improve cache hit rate
4. Scale resources

---

### Issue: Content Generation Failing

**Symptoms:**
- Articles not generating
- Workflow failures
- Error messages

**Diagnosis:**
```bash
# Check workflow status
curl -H "Authorization: Bearer $TOKEN" \
  https://investingpro.in/api/v1/workflows/[id]

# Check budget status
curl -H "Authorization: Bearer $TOKEN" \
  https://investingpro.in/api/v1/budget/status
```

**Common Causes:**
1. Budget exhausted
2. AI provider failures
3. Workflow errors
4. Quality threshold not met

**Solutions:**
1. Check and increase budget
2. Verify AI provider status
3. Review workflow logs
4. Adjust quality thresholds

---

## 2. Error Messages

### Error: "UNAUTHORIZED"

**Meaning:** Authentication required or token invalid

**Solution:**
1. Verify token is valid
2. Check token expiration
3. Re-authenticate if needed

**Example:**
```bash
# Get new token
curl -X POST https://investingpro.in/api/auth/login \
  -d '{"email": "user@example.com", "password": "password"}'
```

---

### Error: "FORBIDDEN"

**Meaning:** Insufficient permissions

**Solution:**
1. Verify user role
2. Check RLS policies
3. Request admin access if needed

**Check Role:**
```sql
SELECT role FROM user_profiles WHERE id = auth.uid();
```

---

### Error: "INVALID_TRANSITION"

**Meaning:** Invalid article status transition

**Solution:**
1. Check current status
2. Verify allowed transitions
3. Use correct transition path

**Valid Transitions:**
- `draft` → `review` → `published`
- `draft` → `published` (admin/editor)
- `published` → `archived` (admin)

---

### Error: "BUDGET_EXHAUSTED"

**Meaning:** Daily/monthly budget reached

**Solution:**
1. Check budget status
2. Set new budget
3. Resume generation

**Set New Budget:**
```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"maxCostPerDay": 100}' \
  https://investingpro.in/api/v1/admin/budget/daily
```

---

### Error: "SERVICE_UNAVAILABLE"

**Meaning:** Service temporarily unavailable

**Solution:**
1. Check service health
2. Wait for recovery
3. Check circuit breaker status

**Check Health:**
```bash
curl https://investingpro.in/api/health
```

---

## 3. Performance Issues

### Issue: High Database Latency

**Symptoms:**
- Database queries >200ms
- Slow query alerts
- Timeout errors

**Diagnosis:**
```sql
-- Check slow queries
SELECT * FROM slow_queries
WHERE execution_time_ms > 1000
ORDER BY execution_time_ms DESC
LIMIT 20;

-- Check table sizes
SELECT * FROM table_sizes
ORDER BY size_bytes DESC
LIMIT 10;
```

**Solutions:**
1. **Add Indexes**
   ```sql
   CREATE INDEX IF NOT EXISTS idx_articles_category_status 
   ON articles(category, status);
   ```

2. **Optimize Queries**
   - Use EXPLAIN ANALYZE
   - Add WHERE clauses
   - Limit result sets

3. **Archive Old Data**
   ```bash
   curl -X POST \
     -H "Authorization: Bearer $CRON_SECRET" \
     https://investingpro.in/api/cron/archive-data
   ```

---

### Issue: Low Cache Hit Rate

**Symptoms:**
- Cache hit rate <50%
- High database load
- Slow responses

**Diagnosis:**
```bash
# Check cache metrics
curl https://investingpro.in/api/metrics | grep cache
```

**Solutions:**
1. **Increase Cache TTL**
   ```typescript
   // In cache-strategies.ts
   export const CACHE_TTL = {
     articles: 3600, // Increase from default
   };
   ```

2. **Pre-warm Cache**
   ```typescript
   await cacheService.warmCache(['articles', 'products']);
   ```

3. **Review Cache Keys**
   - Ensure consistent key generation
   - Check for cache invalidation issues

---

### Issue: High API Latency

**Symptoms:**
- P95 latency >500ms
- User complaints
- Timeout errors

**Diagnosis:**
```bash
# Check metrics
curl https://investingpro.in/api/metrics | grep latency
```

**Solutions:**
1. **Optimize Database Queries**
2. **Improve Caching**
3. **Reduce External Calls**
4. **Scale Resources**

---

## 4. Database Issues

### Issue: Connection Pool Exhausted

**Symptoms:**
- "Too many connections" errors
- Connection timeout errors
- High connection pool usage

**Diagnosis:**
```sql
-- Check connection pool usage
SELECT * FROM connection_pool_stats;
```

**Solutions:**
1. **Increase Pool Size**
   ```env
   SUPABASE_POOL_SIZE=20
   ```

2. **Close Idle Connections**
   ```sql
   SELECT pg_terminate_backend(pid)
   FROM pg_stat_activity
   WHERE state = 'idle'
   AND state_change < NOW() - INTERVAL '5 minutes';
   ```

3. **Review Connection Usage**
   - Check for connection leaks
   - Optimize query patterns

---

### Issue: Table Size Growth

**Symptoms:**
- Slow queries
- High storage usage
- Table size alerts

**Diagnosis:**
```sql
SELECT * FROM table_sizes
WHERE size_bytes > 1073741824 -- 1GB
ORDER BY size_bytes DESC;
```

**Solutions:**
1. **Archive Old Data**
   ```bash
   curl -X POST \
     -H "Authorization: Bearer $CRON_SECRET" \
     https://investingpro.in/api/cron/archive-data
   ```

2. **Delete Old Data**
   ```sql
   DELETE FROM audit_log
   WHERE created_at < NOW() - INTERVAL '90 days';
   ```

3. **Partition Large Tables**
   - Consider table partitioning
   - Archive by date ranges

---

### Issue: Missing Indexes

**Symptoms:**
- Slow queries
- Full table scans
- High CPU usage

**Diagnosis:**
```sql
-- Find missing indexes
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname = 'public'
AND n_distinct > 100
AND correlation < 0.1;
```

**Solutions:**
1. **Add Indexes**
   ```sql
   CREATE INDEX IF NOT EXISTS idx_articles_category_status
   ON articles(category, status);
   ```

2. **Review Query Plans**
   ```sql
   EXPLAIN ANALYZE SELECT * FROM articles WHERE category = 'mutual-funds';
   ```

---

## 5. AI Provider Issues

### Issue: AI Provider Timeout

**Symptoms:**
- AI calls timing out
- Generation failures
- Error logs

**Diagnosis:**
```bash
# Check provider health
curl -H "Authorization: Bearer $TOKEN" \
  https://investingpro.in/api/health
```

**Solutions:**
1. **Retry with Backoff**
   - Automatic retry configured
   - Check retry logs

2. **Failover to Next Provider**
   - Automatic failover enabled
   - Check provider selection logic

3. **Check Provider Status**
   - Verify API keys
   - Check provider status page
   - Review rate limits

---

### Issue: High AI Costs

**Symptoms:**
- Budget alerts triggered
- High cost per operation
- Budget exhausted quickly

**Diagnosis:**
```bash
# Check cost breakdown
curl -H "Authorization: Bearer $TOKEN" \
  https://investingpro.in/api/v1/admin/cost-dashboard
```

**Solutions:**
1. **Switch to Cheaper Provider**
   ```typescript
   // Use Groq instead of GPT-4
   const prompt = await selectPromptForABTest('article-generator');
   // Groq is cheaper
   ```

2. **Optimize Prompts**
   - Reduce token usage
   - Use shorter prompts
   - Cache responses

3. **Adjust Budget**
   - Increase daily budget
   - Optimize generation frequency

---

## 6. Workflow Issues

### Issue: Stuck Workflows

**Symptoms:**
- Workflows in "running" state for hours
- No progress updates
- Workflow alerts

**Diagnosis:**
```sql
SELECT * FROM workflow_instances
WHERE state = 'running'
AND started_at < NOW() - INTERVAL '1 hour';
```

**Solutions:**
1. **Check Workflow Logs**
   ```bash
   curl -H "Authorization: Bearer $TOKEN" \
     https://investingpro.in/api/v1/workflows/[id]
   ```

2. **Retry Workflow**
   ```typescript
   await workflowExecutor.retry(workflowInstanceId);
   ```

3. **Cancel Stuck Workflow**
   ```typescript
   await workflowRepository.updateInstance(instanceId, {
     state: 'failed',
     error: 'Manually cancelled due to timeout'
   });
   ```

---

### Issue: Workflow Failures

**Symptoms:**
- Workflows failing frequently
- Error messages in logs
- Low success rate

**Diagnosis:**
```sql
SELECT state, COUNT(*) 
FROM workflow_instances
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY state;
```

**Solutions:**
1. **Review Error Messages**
   ```sql
   SELECT error, COUNT(*) 
   FROM workflow_instances
   WHERE state = 'failed'
   GROUP BY error
   ORDER BY COUNT(*) DESC;
   ```

2. **Fix Root Cause**
   - Update workflow definitions
   - Fix agent errors
   - Adjust dependencies

3. **Add Retry Logic**
   - Configure retries in workflow
   - Add error handling

---

## 7. Budget Issues

### Issue: Budget Not Updating

**Symptoms:**
- Costs not recorded
- Budget shows 0 spent
- No cost alerts

**Diagnosis:**
```sql
-- Check cost recording
SELECT * FROM content_costs
ORDER BY created_at DESC
LIMIT 10;

-- Check budget updates
SELECT * FROM daily_budgets
ORDER BY updated_at DESC
LIMIT 5;
```

**Solutions:**
1. **Verify Cost Recording**
   ```typescript
   // Ensure recordCost is called
   await budgetGovernor.recordCost(
     articleId, tokens, cost, provider, model
   );
   ```

2. **Check Triggers**
   ```sql
   -- Verify triggers exist
   SELECT * FROM pg_trigger
   WHERE tgname LIKE '%cost%';
   ```

3. **Manual Update**
   ```sql
   -- Manually update budget
   UPDATE daily_budgets
   SET cost_spent_usd = (
     SELECT SUM(total_cost)
     FROM content_costs
     WHERE generation_date = CURRENT_DATE
   )
   WHERE budget_date = CURRENT_DATE;
   ```

---

### Issue: Incorrect Cost Calculation

**Symptoms:**
- Costs seem too high/low
- Mismatch with provider bills
- Inaccurate projections

**Diagnosis:**
```sql
-- Check cost breakdown
SELECT ai_provider, SUM(total_cost), COUNT(*)
FROM content_costs
WHERE generation_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY ai_provider;
```

**Solutions:**
1. **Verify Cost Calculation**
   ```typescript
   // Check cost calculation logic
   const cost = (tokensUsed / 1000) * costPer1KTokens;
   ```

2. **Review Provider Rates**
   - Verify cost per token rates
   - Check for rate changes
   - Update rates if needed

3. **Recalculate Costs**
   ```sql
   -- Recalculate from raw data
   UPDATE content_costs
   SET total_cost = ai_cost + image_cost;
   ```

---

## 8. Quick Reference

### Health Check Commands

```bash
# System health
curl https://investingpro.in/api/health

# Liveness
curl https://investingpro.in/api/health/liveness

# Readiness
curl https://investingpro.in/api/health/readiness

# Metrics
curl https://investingpro.in/api/metrics
```

### Database Commands

```sql
-- Check slow queries
SELECT * FROM slow_queries ORDER BY execution_time_ms DESC LIMIT 10;

-- Check table sizes
SELECT * FROM table_sizes ORDER BY size_bytes DESC LIMIT 10;

-- Check connection pool
SELECT * FROM connection_pool_stats;
```

### Log Commands

```bash
# Recent errors
curl -H "Authorization: Bearer $TOKEN" \
  "https://investingpro.in/api/v1/admin/audit-log?severity=error&limit=20"

# Recent activity
curl -H "Authorization: Bearer $TOKEN" \
  "https://investingpro.in/api/v1/admin/audit-log?limit=50"
```

---

**See Also:**
- [Runbook](./runbook.md)
- [On-Call Playbook](./on-call.md)
- [Error Handling Documentation](./error-handling.md)
