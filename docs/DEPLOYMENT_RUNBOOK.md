# 🚀 Production Deployment Runbook

**Purpose:** Step-by-step guide for deploying to production  
**Target:** Zero-downtime deployment

---

## 📋 Pre-Deployment Checklist

### 1. Code Review
- [ ] All changes reviewed and approved
- [ ] Tests passing in CI
- [ ] No linter errors
- [ ] Security scans passed

### 2. Environment Validation
```bash
# Validate production environment variables
npx tsx scripts/setup-production.ts
```

- [ ] All required environment variables set
- [ ] No placeholder values
- [ ] API keys valid
- [ ] Database credentials correct

### 3. Database Readiness
```bash
# Check migrations
npx tsx scripts/apply-migrations.ts
```

- [ ] All migrations applied
- [ ] Database schema up to date
- [ ] RLS policies configured
- [ ] Backup taken (if applicable)

### 4. Build Validation
```bash
# Test build locally
npm run build
```

- [ ] Build succeeds without errors
- [ ] No TypeScript errors
- [ ] All assets generated correctly

---

## 🚀 Deployment Steps

### Step 1: Final Verification

```bash
# 1. Ensure you're on the correct branch
git checkout main
git pull origin main

# 2. Verify latest commit
git log -1

# 3. Run final checks
npm run build
npm test  # If tests exist
```

### Step 2: Deploy to Vercel

#### Option A: Via Vercel CLI
```bash
# Deploy to production
vercel --prod

# Or with specific project
vercel --prod --scope your-team
```

#### Option B: Via Git Push (Auto-Deploy)
```bash
# Push to main branch (triggers auto-deploy)
git push origin main
```

#### Option C: Via Vercel Dashboard
1. Go to Vercel Dashboard
2. Select project
3. Go to "Deployments" tab
4. Click "Redeploy" on latest deployment
5. Or create new deployment from Git branch

### Step 3: Monitor Deployment

1. **Watch Vercel Dashboard:**
   - Go to Deployments tab
   - Monitor build logs
   - Check for build errors

2. **Verify Health Checks:**
   ```bash
   # Wait 2-3 minutes after deployment, then:
   curl https://your-domain.com/api/health
   curl https://your-domain.com/api/health/detailed
   curl https://your-domain.com/api/health/readiness
   ```

3. **Check Metrics:**
   - Visit `/admin/metrics` (if accessible)
   - Check Sentry for errors
   - Monitor PostHog for traffic

### Step 4: Post-Deployment Verification

```bash
# Test critical flows
NEXT_PUBLIC_BASE_URL=https://your-domain.com \
npx tsx scripts/test-critical-flows.ts
```

**Verify:**
- [ ] Homepage loads
- [ ] Articles load
- [ ] Products load
- [ ] Search works
- [ ] API endpoints respond
- [ ] Health checks pass
- [ ] No errors in Sentry

---

## 🔄 Rollback Procedure

### If Deployment Fails

#### Option 1: Rollback via Vercel Dashboard
1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." menu → "Promote to Production"

#### Option 2: Rollback via CLI
```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url>
```

#### Option 3: Revert Git and Redeploy
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <previous-commit-hash>
git push origin main --force  # Use with caution!
```

### If Issues Detected Post-Deployment

1. **Immediate Actions:**
   - Check Sentry for errors
   - Check Vercel logs
   - Check database connectivity
   - Check health endpoints

2. **Quick Fixes:**
   - Update environment variables if needed
   - Restart deployment if transient issue
   - Rollback if critical issue

3. **Communication:**
   - Notify team
   - Update status page (if applicable)
   - Document issue

---

## 🚨 Emergency Procedures

### Database Issues

```bash
# Check database connection
npx tsx scripts/test-critical-flows.ts

# If connection fails:
# 1. Check Supabase dashboard
# 2. Verify credentials
# 3. Check RLS policies
# 4. Contact Supabase support if needed
```

### API Failures

1. **Check Health Endpoints:**
   ```bash
   curl https://your-domain.com/api/health/detailed
   ```

2. **Check Specific Services:**
   - Redis (if configured)
   - AI providers
   - External APIs

3. **Review Logs:**
   - Vercel function logs
   - Sentry errors
   - Application logs

### Performance Issues

1. **Check Metrics:**
   - Visit `/admin/metrics`
   - Check latency percentiles
   - Review error rates

2. **Common Causes:**
   - Database query performance
   - External API latency
   - Rate limiting too strict
   - Missing indexes

3. **Quick Fixes:**
   - Scale up Vercel plan
   - Optimize database queries
   - Add caching
   - Adjust rate limits

---

## 📊 Post-Deployment Monitoring

### First 30 Minutes

- [ ] Monitor Sentry for errors
- [ ] Check health endpoints every 5 minutes
- [ ] Review metrics dashboard
- [ ] Monitor PostHog for traffic
- [ ] Check Vercel logs

### First 24 Hours

- [ ] Daily health check review
- [ ] Error rate monitoring
- [ ] Performance metrics review
- [ ] User feedback monitoring
- [ ] Database performance check

### First Week

- [ ] Weekly metrics review
- [ ] Error trend analysis
- [ ] Performance optimization opportunities
- [ ] User experience feedback
- [ ] Cost analysis (AI, hosting, services)

---

## 🔧 Maintenance Windows

### Scheduled Maintenance

1. **Announce Maintenance:**
   - Update status page
   - Notify users (if applicable)
   - Schedule during low-traffic hours

2. **Pre-Maintenance:**
   - Backup database
   - Document changes
   - Prepare rollback plan

3. **During Maintenance:**
   - Deploy changes
   - Monitor closely
   - Test critical flows

4. **Post-Maintenance:**
   - Verify all systems
   - Monitor for 1 hour
   - Update status page

---

## 📝 Deployment Log Template

```markdown
## Deployment Log - [Date]

**Deployment ID:** [Vercel deployment URL]
**Deployed By:** [Name]
**Branch:** [Branch name]
**Commit:** [Commit hash]

### Pre-Deployment
- [ ] Code reviewed
- [ ] Tests passed
- [ ] Environment validated
- [ ] Database ready

### Deployment
- [ ] Deployed at: [Time]
- [ ] Build status: [Success/Failed]
- [ ] Deployment URL: [URL]

### Post-Deployment
- [ ] Health checks: [Pass/Fail]
- [ ] Critical flows: [Pass/Fail]
- [ ] Errors detected: [Yes/No]
- [ ] Rollback needed: [Yes/No]

### Notes
[Any issues, observations, or notes]
```

---

## 🆘 Support Contacts

- **Vercel Support:** [Support URL]
- **Supabase Support:** [Support URL]
- **Sentry Support:** [Support URL]
- **Team Lead:** [Contact]
- **On-Call Engineer:** [Contact]

---

## 📖 Related Documentation

- **Staging Setup:** `docs/STAGING_ENVIRONMENT_SETUP.md`
- **Production Readiness:** `docs/PRODUCTION_READINESS_CHECKLIST.md`
- **Hardening Plan:** `docs/AUDIT_RESULTS/08_PRODUCTION_HARDENING_PLAN.md`

---

*Last Updated: January 13, 2026*
