# Operations Runbook
**InvestingPro CMS - Operational Procedures**

**Last Updated:** 2026-01-XX  
**Version:** 1.0

---

## Table of Contents

1. [Deployment Process](#deployment-process)
2. [Database Operations](#database-operations)
3. [Cache Management](#cache-management)
4. [Emergency Procedures](#emergency-procedures)
5. [Monitoring & Alerts](#monitoring--alerts)
6. [Troubleshooting](#troubleshooting)

---

## 1. Deployment Process

### Pre-Deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] Type check passing (`npm run type-check`)
- [ ] Lint passing (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Database migrations reviewed and tested
- [ ] Environment variables verified
- [ ] API keys rotated (if needed)
- [ ] Performance benchmarks acceptable

### Deployment Steps

#### Staging Deployment (Automatic via Vercel)

1. **Push to `staging` branch**
   ```bash
   git checkout staging
   git pull origin staging
   git merge main
   git push origin staging
   ```

2. **Vercel automatically deploys**
   - Monitor deployment in Vercel dashboard
   - Wait for build to complete (~3-5 minutes)

3. **Verify Staging**
   - [ ] Homepage loads
   - [ ] Admin dashboard accessible
   - [ ] Article CRUD operations work
   - [ ] API endpoints respond correctly
   - [ ] No console errors

#### Production Deployment (Manual Approval)

1. **Create Release PR**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b release/vX.X.X
   # Make final changes if needed
   git push origin release/vX.X.X
   ```

2. **Review and Merge PR**
   - Code review completed
   - All checks passing
   - Merge to `main`

3. **Vercel Production Deploy**
   - Manual approval in Vercel dashboard
   - Monitor deployment
   - Verify production health

4. **Post-Deployment Verification**
   - [ ] Production site loads
   - [ ] Critical flows tested
   - [ ] Error rates normal
   - [ ] Performance metrics acceptable

### Rollback Procedure

#### Immediate Rollback (Vercel)

1. **Via Vercel Dashboard**
   - Go to Deployments
   - Select previous deployment
   - Click "Promote to Production"
   - Confirm rollback

2. **Via CLI**
   ```bash
   vercel --prod --yes --force
   ```

#### Database Rollback

1. **Identify migration to rollback**
   ```sql
   SELECT * FROM supabase_migrations.schema_migrations 
   ORDER BY version DESC LIMIT 5;
   ```

2. **Revert migration** (if migration file has down migration)
   ```bash
   npm run db:migrate:rollback
   ```

3. **Manual rollback** (if no down migration)
   - Connect to database
   - Manually revert schema changes
   - Update migration tracking table

---

## 2. Database Operations

### Migration Process

1. **Create Migration**
   ```bash
   # Create new migration file
   touch supabase/migrations/YYYYMMDD_description.sql
   ```

2. **Write Migration**
   - Include UP migration (changes)
   - Include DOWN migration (rollback) if possible
   - Test on local database first

3. **Test Migration**
   ```bash
   # Apply migration locally
   npm run db:migrate
   
   # Verify changes
   psql $DATABASE_URL -c "SELECT * FROM schema_migrations;"
   ```

4. **Apply to Production**
   ```bash
   # Via Supabase Dashboard (recommended)
   # OR via CLI:
   npm run deploy:check-db
   ```

### Backup Procedures

#### Manual Backup

```bash
# Full database backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Specific table backup
pg_dump $DATABASE_URL -t articles > articles_backup_$(date +%Y%m%d).sql
```

#### Automated Backups

- Supabase automatically creates daily backups
- Backups retained for 7 days (default)
- Can restore via Supabase Dashboard → Database → Backups

### Restore Procedures

#### From Supabase Backup

1. Go to Supabase Dashboard
2. Navigate to Database → Backups
3. Select backup point
4. Click "Restore"
5. Confirm restoration

#### From Manual Backup

```bash
# Restore full database
psql $DATABASE_URL < backup_20260126_120000.sql

# Restore specific table
psql $DATABASE_URL -c "DROP TABLE articles CASCADE;"
psql $DATABASE_URL -t articles < articles_backup_20260126.sql
```

### Performance Tuning

#### Check Slow Queries

```sql
-- View slow queries (if pg_stat_statements enabled)
SELECT 
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

#### Index Optimization

```sql
-- Find missing indexes
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats
WHERE n_distinct > 100
AND correlation < 0.1
ORDER BY n_distinct DESC;
```

---

## 3. Cache Management

### Clear Cache

#### Application Cache (Redis/In-Memory)

```bash
# Clear all cache (via API)
curl -X POST https://api.investingpro.in/api/admin/cache/clear \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

#### Next.js Cache

```bash
# Clear .next cache
rm -rf .next

# Clear Turbopack cache
rm -rf .turbo

# Rebuild
npm run build
```

#### CDN Cache (Vercel)

- Automatic cache invalidation on deploy
- Manual purge via Vercel Dashboard → Settings → Domains → Purge Cache

### Cache Warming

```bash
# Pre-warm critical pages
curl https://investingpro.in/
curl https://investingpro.in/blog
curl https://investingpro.in/credit-cards
```

### Monitor Cache Hit Rates

```sql
-- Check cache statistics (if implemented)
SELECT 
    cache_key,
    hits,
    misses,
    hit_rate
FROM cache_stats
ORDER BY hits DESC;
```

---

## 4. Emergency Procedures

### Emergency Stop Automation

#### Pause AI Generation

```bash
# Set environment variable to pause
# Vercel Dashboard → Settings → Environment Variables
AI_GENERATION_ENABLED=false
```

#### Disable Scrapers

```bash
# Pause scraper cron jobs
# Vercel Dashboard → Cron Jobs → Disable
```

#### Database Connection Issues

1. **Check Supabase Status**
   - Visit https://status.supabase.com
   - Check for incidents

2. **Verify Connection String**
   ```bash
   # Test connection
   psql $DATABASE_URL -c "SELECT 1;"
   ```

3. **Switch to Read Replica** (if available)
   - Update `DATABASE_URL` to read replica
   - Disable write operations

### Incident Response

#### Critical Issues (P0)

1. **Immediate Actions**
   - [ ] Assess impact
   - [ ] Notify team (Slack #incidents)
   - [ ] Deploy hotfix or rollback
   - [ ] Monitor metrics

2. **Communication**
   - Update status page
   - Notify stakeholders
   - Document incident

3. **Post-Incident**
   - Root cause analysis
   - Incident report
   - Action items

#### High Priority Issues (P1)

1. **Assess and Triage**
   - Identify affected users
   - Check logs for errors
   - Determine fix timeline

2. **Fix or Workaround**
   - Deploy fix if available
   - Implement workaround if needed
   - Monitor resolution

---

## 5. Monitoring & Alerts

### Key Metrics to Monitor

#### Application Metrics

- **Response Times**
  - API latency (p50, p95, p99)
  - Page load times
  - Database query times

- **Error Rates**
  - 4xx errors (client errors)
  - 5xx errors (server errors)
  - Error rate percentage

- **Throughput**
  - Requests per second
  - API calls per minute
  - Database connections

#### Business Metrics

- **Content Metrics**
  - Articles published per day
  - Page views
  - User engagement

- **AI Metrics**
  - AI cost per day/month
  - Generation success rate
  - Token usage

### Alert Configuration

#### Critical Alerts (Immediate Notification)

- [ ] Build failures
- [ ] Production deployment failures
- [ ] Database connection failures
- [ ] Error rate > 5%
- [ ] API latency > 5s (p99)
- [ ] AI cost threshold exceeded (>100% daily budget)

#### Warning Alerts (Daily Summary)

- [ ] Scraper failures (3 consecutive)
- [ ] API latency > 2s (p95)
- [ ] Error rate > 1%
- [ ] Cache hit rate < 80%
- [ ] AI cost > 80% daily budget

### On-Call Procedures

1. **Receiving Alert**
   - Acknowledge alert
   - Assess severity
   - Check dashboard for context

2. **Investigating**
   - Check logs (Vercel Logs, Supabase Logs)
   - Review recent deployments
   - Check system status pages

3. **Escalation**
   - If unable to resolve in 30 minutes → Escalate
   - Contact team lead or technical lead
   - Document findings

---

## 6. Troubleshooting

### Common Issues

#### Build Failures

**Symptoms:** Build fails in Vercel

**Diagnosis:**
```bash
# Test build locally
npm run build

# Check for TypeScript errors
npm run type-check

# Check for lint errors
npm run lint
```

**Common Causes:**
- TypeScript errors
- Missing dependencies
- Environment variables not set
- Module resolution issues

**Fix:**
1. Fix errors locally
2. Test build locally
3. Commit and push
4. Verify deployment

#### Database Connection Errors

**Symptoms:** "Connection refused" or "Connection timeout"

**Diagnosis:**
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Check connection pool
# Supabase Dashboard → Database → Connection Pooling
```

**Fix:**
1. Verify `DATABASE_URL` is correct
2. Check Supabase status
3. Verify IP allowlist (if configured)
4. Check connection pool limits

#### Slow API Responses

**Symptoms:** API latency > 2s

**Diagnosis:**
```sql
-- Check slow queries
SELECT * FROM api_timing 
WHERE duration_ms > 2000 
ORDER BY timestamp DESC 
LIMIT 10;
```

**Fix:**
1. Identify slow endpoints
2. Check database query performance
3. Review N+1 queries
4. Add database indexes if needed
5. Consider caching

#### High AI Costs

**Symptoms:** Daily budget exceeded

**Diagnosis:**
```sql
-- Check recent AI costs
SELECT 
    DATE(created_at) as date,
    SUM(cost_usd) as daily_cost
FROM ai_costs
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

**Fix:**
1. Pause AI generation temporarily
2. Review cost by provider/model
3. Optimize prompts (reduce tokens)
4. Switch to cheaper models if possible
5. Adjust daily budget limits

### Log Locations

#### Application Logs

- **Vercel Logs:** Dashboard → Project → Logs
- **Supabase Logs:** Dashboard → Logs → API Logs

#### Database Logs

- **Supabase Logs:** Dashboard → Logs → Postgres Logs
- **Query Logs:** Enable `log_statement = 'all'` for debugging (not in production)

### Performance Debugging

#### Enable Debug Mode

```bash
# Set environment variable
DEBUG=true

# Or in code
process.env.NODE_ENV === 'development'
```

#### Profiling

```bash
# Node.js profiler
node --prof server.js

# Analyze profile
node --prof-process isolate-*.log
```

---

## Appendix

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key |
| `OPENAI_API_KEY` | Optional | OpenAI API key |
| `FIELD_ENCRYPTION_KEY` | Optional | PII encryption key (64 hex chars) |
| `AI_GENERATION_ENABLED` | Optional | Enable/disable AI generation |

### Contact Information

- **Slack:** #investingpro-cms
- **Email:** devops@investingpro.in
- **On-Call:** Check PagerDuty rotation

### Useful Commands

```bash
# Full validation
npm run validate

# Deploy check
npm run deploy:validate

# Create admin user
npm run deploy:create-admin

# Run migrations
npm run db:migrate
```

---

**Remember:** When in doubt, ask for help. Better to escalate early than break production! 🚨
