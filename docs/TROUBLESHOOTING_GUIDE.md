# 🔧 Troubleshooting Guide

**Purpose:** Common issues and solutions for production operations  
**Target:** Quick problem resolution

---

## 🚨 Common Issues

### Issue 1: Health Checks Failing

**Symptoms:**
- `/api/health` returns 500
- `/api/health/detailed` shows service errors

**Diagnosis:**
```bash
# Check detailed health
curl https://your-domain.com/api/health/detailed

# Check specific service
# Look for "status": "error" in response
```

**Solutions:**

**Database Connection Failed:**
1. Verify Supabase credentials
2. Check Supabase dashboard for outages
3. Verify RLS policies
4. Test connection: `npx tsx scripts/test-critical-flows.ts`

**Redis Connection Failed:**
1. Verify Upstash credentials
2. Check Redis dashboard
3. Rate limiting will work without Redis (just not distributed)

**AI Provider Failed:**
1. Verify API keys are valid
2. Check API provider status
3. Verify rate limits not exceeded
4. Check API key permissions

---

### Issue 2: High Error Rate

**Symptoms:**
- Error rate > 5% in metrics dashboard
- Multiple errors in Sentry

**Diagnosis:**
1. Check `/admin/metrics` for error patterns
2. Review Sentry for error types
3. Check correlation IDs in logs

**Solutions:**

**API Validation Errors:**
- Check request format
- Verify validation schemas
- Review error details in response

**Database Errors:**
- Check RLS policies
- Verify database connectivity
- Review query performance

**Rate Limiting:**
- Check if legitimate traffic being blocked
- Adjust rate limits if needed
- Verify Redis connectivity

---

### Issue 3: Slow API Responses

**Symptoms:**
- High latency (p95 > 1s)
- Timeout errors
- User complaints

**Diagnosis:**
1. Check `/admin/metrics` for latency
2. Identify slow endpoints
3. Review database query performance

**Solutions:**

**Database Query Performance:**
- Add database indexes
- Optimize slow queries
- Review query plans

**External API Latency:**
- Check AI provider latency
- Add caching
- Use faster providers

**Rate Limiting Too Strict:**
- Adjust rate limits
- Check Redis latency

---

### Issue 4: Deployment Failures

**Symptoms:**
- Build fails in Vercel
- Deployment errors

**Diagnosis:**
1. Check Vercel build logs
2. Review error messages
3. Check environment variables

**Solutions:**

**Build Errors:**
- Fix TypeScript errors
- Fix linter errors
- Check dependencies

**Environment Variable Errors:**
- Verify all variables set
- Check variable names (case-sensitive)
- Verify no placeholder values

**Memory/Timeout Errors:**
- Optimize build process
- Increase Vercel plan
- Split large operations

---

### Issue 5: Metrics Not Updating

**Symptoms:**
- Metrics dashboard shows no data
- `/api/metrics` returns empty

**Diagnosis:**
1. Check if metrics middleware applied
2. Verify API routes are being called
3. Check application logs

**Solutions:**

**Metrics Middleware Not Applied:**
- Verify API wrapper is used
- Check route configuration
- Review middleware setup

**No API Traffic:**
- Verify application is receiving requests
- Check load balancer/routing
- Verify domain configuration

---

### Issue 6: Rate Limiting Not Working

**Symptoms:**
- Users not being rate limited
- No rate limit headers in responses

**Diagnosis:**
1. Check Redis connectivity
2. Verify rate limit middleware applied
3. Check environment variables

**Solutions:**

**Redis Not Configured:**
- Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- Or rate limiting will work without Redis (in-memory only)

**Middleware Not Applied:**
- Verify API wrapper is used
- Check route configuration

---

### Issue 7: Validation Errors

**Symptoms:**
- 400 errors on API requests
- Validation error messages

**Diagnosis:**
1. Check request format
2. Review validation schemas
3. Check error details

**Solutions:**

**Request Format Issues:**
- Verify request body matches schema
- Check query parameters
- Review API documentation

**Schema Mismatch:**
- Update validation schemas
- Or adjust request format

---

## 🔍 Debugging Tools

### 1. Health Check Endpoints

```bash
# Basic health
curl https://your-domain.com/api/health

# Detailed health (shows all services)
curl https://your-domain.com/api/health/detailed

# Readiness probe
curl https://your-domain.com/api/health/readiness

# Liveness probe
curl https://your-domain.com/api/health/liveness
```

### 2. Metrics Dashboard

Visit: `https://your-domain.com/admin/metrics`

**Shows:**
- API latency (p50, p95, p99)
- Error rates
- Throughput
- Recent requests
- Requests by status/path

### 3. Sentry

**Check:**
- Error types
- Error frequency
- Stack traces
- User context
- Correlation IDs

### 4. Vercel Logs

**Access:**
- Vercel Dashboard → Project → Logs
- Filter by function/route
- Check for errors

### 5. Application Logs

**Structured Logging:**
- Correlation IDs for request tracking
- Request IDs for debugging
- User IDs for user-specific issues

**Search logs by:**
- Correlation ID
- Request ID
- Error message
- Timestamp

---

## 🆘 Emergency Procedures

### Service Completely Down

1. **Check Health Endpoints**
   ```bash
   curl https://your-domain.com/api/health/detailed
   ```

2. **Check Vercel Status**
   - Vercel Dashboard
   - Vercel Status Page

3. **Check Supabase Status**
   - Supabase Dashboard
   - Supabase Status Page

4. **Rollback if Needed**
   - Vercel Dashboard → Deployments
   - Promote previous deployment

---

### Database Issues

1. **Test Connection**
   ```bash
   npx tsx scripts/test-critical-flows.ts
   ```

2. **Check Supabase Dashboard**
   - Database status
   - Query performance
   - Connection pool

3. **Review RLS Policies**
   - Check if policies blocking access
   - Verify policy logic

---

### High Error Rate

1. **Identify Pattern**
   - Check `/admin/metrics`
   - Review Sentry errors
   - Check correlation IDs

2. **Quick Fixes**
   - Rollback recent deployment
   - Disable problematic feature
   - Increase rate limits (if needed)

3. **Long-term Fix**
   - Fix root cause
   - Add monitoring
   - Update documentation

---

## 📞 Escalation

### When to Escalate

- **P0 Incident:** Service down, data loss
- **P1 Incident:** Major feature broken, high error rate
- **Cannot resolve in 30 minutes**

### Escalation Path

1. **On-Call Engineer** (First responder)
2. **Team Lead** (If not resolved in 30 min)
3. **CTO/Engineering Manager** (P0 incidents)

---

## 📖 Related Documentation

- **Incident Response Playbook:** `docs/INCIDENT_RESPONSE_PLAYBOOK.md`
- **Deployment Runbook:** `docs/DEPLOYMENT_RUNBOOK.md`
- **Monitoring Setup:** `docs/MONITORING_SETUP_GUIDE.md`

---

*Last Updated: January 13, 2026*
