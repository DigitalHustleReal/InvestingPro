# Disaster Recovery Plan

## InvestingPro.in - Business Continuity & Disaster Recovery

---

## Recovery Objectives

| Metric | Target | Description |
|--------|--------|-------------|
| **RTO** (Recovery Time Objective) | **4 hours** | Maximum acceptable downtime |
| **RPO** (Recovery Point Objective) | **1 hour** | Maximum acceptable data loss |

---

## Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     InvestingPro Stack                       │
├─────────────────────────────────────────────────────────────┤
│  Frontend: Vercel Edge (Global CDN)                         │
│  Database: Supabase (PostgreSQL)                            │
│  Cache: Upstash Redis                                       │
│  AI: Groq, Mistral, OpenAI, Claude (Multi-provider)         │
│  Monitoring: Sentry, PostHog                                │
│  Email: Resend                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Disaster Scenarios & Response

### Scenario 1: Vercel/Frontend Outage

**Symptoms:**
- Website unreachable
- 502/503 errors
- CDN failures

**Response:**
1. Check [Vercel Status](https://www.vercel-status.com/)
2. If Vercel-side issue: Wait for resolution, monitor status
3. If deployment issue:
   ```bash
   # Rollback to previous deployment
   vercel rollback [deployment-url]
   ```
4. If prolonged: Consider failover hosting (Netlify backup)

**Recovery Time:** 15 minutes - 2 hours

---

### Scenario 2: Supabase/Database Outage

**Symptoms:**
- API errors
- Data not loading
- Authentication failures

**Response:**
1. Check [Supabase Status](https://status.supabase.com/)
2. If Supabase-side issue: Enable read-only mode, serve cached content
3. If project-specific:
   ```bash
   # Check database connection
   psql $DATABASE_URL -c "SELECT 1"
   ```
4. For data corruption: Initiate Point-in-Time Recovery

**Point-in-Time Recovery (PITR):**
1. Contact Supabase Support (Pro plan)
2. Specify target recovery timestamp
3. Supabase restores to new project
4. Update environment variables
5. Verify data integrity

**Recovery Time:** 1-4 hours

---

### Scenario 3: Redis/Cache Failure

**Symptoms:**
- Slow response times
- Rate limiting not working
- Session issues

**Response:**
1. Check [Upstash Status](https://status.upstash.com/)
2. Application should degrade gracefully (cache misses)
3. If prolonged:
   ```bash
   # Verify Redis connection
   curl -X POST $UPSTASH_REDIS_REST_URL \
     -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" \
     -d '["PING"]'
   ```
4. Clear and rebuild cache if data corrupted

**Recovery Time:** 15 minutes - 1 hour

---

### Scenario 4: AI Provider Outage

**Symptoms:**
- Content generation failing
- AI features unavailable
- Circuit breakers open

**Response:**
1. Check provider status pages:
   - [OpenAI Status](https://status.openai.com/)
   - [Anthropic Status](https://status.anthropic.com/)
2. AI service has automatic fallback - verify other providers working
3. Check circuit breaker states:
   ```typescript
   // In admin dashboard or API
   const status = aiService.getStatus();
   console.log(status.circuitBreakers);
   ```
4. Manually switch primary provider if needed

**Recovery Time:** Automatic (multi-provider fallback)

---

### Scenario 5: Google Algorithm Update

**Symptoms:**
- Traffic drop > 20% within 24-48 hours
- Ranking losses for key terms
- Organic visibility decline

**Response:**

**Immediate (First 24 hours):**
1. Document the impact - screenshot rankings, traffic
2. Do NOT make panic changes
3. Check Google Search Central for announcements
4. Monitor competitor movements

**Analysis (24-72 hours):**
1. Identify affected pages/categories
2. Compare affected vs unaffected content
3. Check Core Web Vitals changes
4. Review Search Console for manual actions

**Recovery (1-4 weeks):**
1. If E-E-A-T related:
   - Enhance author credentials
   - Add more expert citations
   - Improve About/Team pages
2. If content quality:
   - Update thin content
   - Add unique data/insights
   - Improve content depth
3. If technical:
   - Fix Core Web Vitals
   - Improve mobile experience
   - Fix crawl issues

**Recovery Time:** 2-8 weeks (algorithm updates)

---

### Scenario 6: Security Breach

**Symptoms:**
- Unauthorized access detected
- Data exfiltration alerts
- Suspicious activity logs

**Response:**

**Immediate (First 15 minutes):**
1. Revoke compromised credentials
2. Enable maintenance mode
3. Notify security team

**Containment (1-4 hours):**
1. Identify breach scope
2. Rotate all secrets:
   ```bash
   # Regenerate Supabase keys
   # Regenerate API keys
   # Update Vercel environment variables
   ```
3. Review audit logs
4. Block suspicious IPs

**Recovery (4-24 hours):**
1. Patch vulnerability
2. Restore from clean backup if needed
3. Notify affected users (if required by law)
4. Document incident

**Recovery Time:** 4-24 hours

---

## Backup & Restore Procedures

### Supabase Database Backups

**Automatic Backups (Pro Plan):**
- Daily backups retained for 7 days
- Point-in-time recovery available

**Manual Backup:**
```bash
# Export schema
pg_dump $DATABASE_URL --schema-only > schema_backup.sql

# Export data
pg_dump $DATABASE_URL --data-only > data_backup.sql

# Full backup
pg_dump $DATABASE_URL > full_backup.sql
```

**Restore from Backup:**
```bash
# Restore to new database
psql $NEW_DATABASE_URL < full_backup.sql
```

### Application State Backups

**Environment Variables:**
- Stored in Vercel dashboard
- Export periodically to secure location
- Document in password manager

**Content Backups:**
- Articles: Stored in Supabase (included in DB backup)
- Media: Stored in Supabase Storage
- User data: Included in DB backup

---

## Communication Plan

### Internal Communication

| Severity | Channel | Notify |
|----------|---------|--------|
| Critical | Phone + Slack | All team |
| High | Slack #incidents | Engineering |
| Medium | Slack #ops | On-call |
| Low | Email | Relevant team |

### External Communication

**Status Page Updates:**
1. Update status page (if available)
2. Post on Twitter/X if customer-facing
3. Email affected users for data breaches

**Template:**
```
[INVESTIGATING] We are aware of issues with [service] and are investigating.
[IDENTIFIED] The issue has been identified as [cause]. Working on fix.
[MONITORING] Fix deployed. Monitoring for stability.
[RESOLVED] Issue resolved at [time]. [Brief explanation].
```

---

## Emergency Contacts

| Role | Name | Contact | Availability |
|------|------|---------|--------------|
| Lead Developer | [Name] | [Phone/Email] | Primary |
| Database Admin | [Name] | [Phone/Email] | Backup |
| Supabase Support | - | support@supabase.io | 24/7 |
| Vercel Support | - | support@vercel.com | 24/7 |
| Upstash Support | - | support@upstash.com | Business hours |

---

## DR Testing Schedule

| Test | Frequency | Last Tested | Next Test |
|------|-----------|-------------|-----------|
| Database restore | Quarterly | [Date] | [Date] |
| Failover simulation | Bi-annually | [Date] | [Date] |
| Runbook review | Monthly | [Date] | [Date] |
| Contact list update | Monthly | [Date] | [Date] |

---

## Runbook Quick Reference

### Quick Commands

```bash
# Check application health
curl https://investingpro.in/api/health

# Check database connection
psql $DATABASE_URL -c "SELECT NOW()"

# Check Redis
curl -X POST $UPSTASH_REDIS_REST_URL \
  -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" \
  -d '["PING"]'

# Rollback Vercel deployment
vercel rollback

# Clear all cache
curl -X POST https://investingpro.in/api/admin/cache/clear
```

---

## Related Documentation

- [MIGRATION_ROLLBACK.md](./MIGRATION_ROLLBACK.md)
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- [MONITORING_GUIDE.md](./MONITORING_GUIDE.md)
