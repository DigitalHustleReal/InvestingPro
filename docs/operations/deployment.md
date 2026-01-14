# Deployment Process

**Version:** 1.0  
**Last Updated:** January 22, 2026  
**Purpose:** Standardized deployment and rollback procedures

---

## 📋 Table of Contents

1. [Deployment Overview](#1-deployment-overview)
2. [Pre-Deployment Checklist](#2-pre-deployment-checklist)
3. [Deployment Process](#3-deployment-process)
4. [Post-Deployment Verification](#4-post-deployment-verification)
5. [Rollback Procedure](#5-rollback-procedure)
6. [Emergency Rollback](#6-emergency-rollback)

---

## 1. Deployment Overview

### Deployment Platform

- **Primary**: Vercel (automatic deployments)
- **Database**: Supabase (manual migrations)
- **CDN**: Vercel Edge Network

### Deployment Types

1. **Automatic**: On push to `main` branch
2. **Manual**: Via Vercel dashboard
3. **Preview**: On pull requests

---

## 2. Pre-Deployment Checklist

### Code Quality

- [ ] All tests passing
- [ ] No linter errors
- [ ] Code reviewed and approved
- [ ] Documentation updated

### Database Migrations

- [ ] Migrations tested locally
- [ ] Migrations are idempotent
- [ ] Rollback plan prepared
- [ ] Backup created

### Environment Variables

- [ ] All required variables set in Vercel
- [ ] Production values verified
- [ ] Secrets properly configured
- [ ] No development values in production

### Dependencies

- [ ] Dependencies updated
- [ ] Security vulnerabilities fixed
- [ ] Breaking changes reviewed
- [ ] Compatibility verified

---

## 3. Deployment Process

### Step 1: Prepare Release

1. **Create Release Branch**
   ```bash
   git checkout -b release/v1.x.x
   ```

2. **Update Version**
   ```bash
   npm version patch|minor|major
   ```

3. **Update Changelog**
   ```markdown
   ## [1.x.x] - YYYY-MM-DD
   - Feature: Description
   - Fix: Description
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "chore: release v1.x.x"
   git push origin release/v1.x.x
   ```

### Step 2: Run Database Migrations

**⚠️ CRITICAL: Run migrations BEFORE deployment**

1. **Review Migrations**
   ```bash
   # List pending migrations
   supabase migration list
   ```

2. **Test Migrations Locally**
   ```bash
   # Reset local database
   supabase db reset
   
   # Apply migrations
   supabase migration up
   ```

3. **Apply to Production**
   ```bash
   # Link to production
   supabase link --project-ref your-project-ref
   
   # Apply migrations
   supabase db push
   ```

   **OR via Supabase Dashboard:**
   1. Go to SQL Editor
   2. Copy migration SQL
   3. Run migration
   4. Verify success

4. **Verify Migrations**
   ```sql
   -- Check migration status
   SELECT * FROM supabase_migrations.schema_migrations
   ORDER BY version DESC LIMIT 5;
   ```

### Step 3: Deploy Application

**Automatic Deployment (Recommended):**

1. **Merge to Main**
   ```bash
   git checkout main
   git merge release/v1.x.x
   git push origin main
   ```

2. **Monitor Deployment**
   - Watch Vercel dashboard
   - Check build logs
   - Verify deployment success

**Manual Deployment:**

1. **Via Vercel Dashboard**
   - Go to Vercel dashboard
   - Select project
   - Click "Deploy"
   - Select branch/commit

2. **Via Vercel CLI**
   ```bash
   vercel --prod
   ```

### Step 4: Verify Deployment

1. **Check Health**
   ```bash
   curl https://investingpro.in/api/health
   ```

2. **Check Build Status**
   - Verify build succeeded
   - Check for build warnings
   - Review deployment logs

3. **Smoke Tests**
   ```bash
   # Test key endpoints
   curl https://investingpro.in/api/health/liveness
   curl https://investingpro.in/api/health/readiness
   curl https://investingpro.in/api/metrics
   ```

---

## 4. Post-Deployment Verification

### Immediate Checks (0-5 minutes)

1. **Health Endpoints**
   ```bash
   curl https://investingpro.in/api/health
   ```

2. **Key Functionality**
   - Homepage loads
   - API endpoints respond
   - Admin dashboard accessible

3. **Error Monitoring**
   - Check Axiom for errors
   - Review error rate
   - Verify no critical errors

### Extended Monitoring (5-30 minutes)

1. **Performance Metrics**
   - Check API latency
   - Verify cache hit rate
   - Monitor database performance

2. **Functionality Tests**
   - Test content generation
   - Verify workflows
   - Check admin features

3. **User Impact**
   - Monitor user reports
   - Check error logs
   - Review metrics

---

## 5. Rollback Procedure

### When to Rollback

- **Critical Bugs**: Functionality broken
- **Performance Issues**: Significant degradation
- **Data Issues**: Data corruption or loss
- **Security Issues**: Security vulnerabilities exposed

### Standard Rollback

**Step 1: Identify Previous Version**

```bash
# List recent deployments
vercel deployments list

# Or check git history
git log --oneline -10
```

**Step 2: Rollback Deployment**

**Via Vercel Dashboard:**
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

**Via Vercel CLI:**
```bash
vercel rollback [deployment-url]
```

**Step 3: Rollback Database (if needed)**

⚠️ **Only if migrations caused issues**

```sql
-- Check migration history
SELECT * FROM supabase_migrations.schema_migrations
ORDER BY version DESC LIMIT 5;

-- Rollback specific migration (if rollback script exists)
-- Run rollback SQL manually
```

**Step 4: Verify Rollback**

```bash
# Check health
curl https://investingpro.in/api/health

# Verify functionality
# Test key features
```

**Step 5: Document Rollback**

- Document reason for rollback
- Note which version rolled back to
- Create issue for fix
- Update team

---

## 6. Emergency Rollback

### Quick Rollback (<5 minutes)

**If system is down:**

1. **Immediate Rollback**
   ```bash
   # Via Vercel CLI
   vercel rollback --yes
   ```

2. **Verify Recovery**
   ```bash
   curl https://investingpro.in/api/health
   ```

3. **Communicate**
   - Post in incident channel
   - Update status page
   - Notify team

### Database Emergency Rollback

**If database migration caused issues:**

1. **Stop Application**
   - Pause Vercel deployment
   - Or rollback application first

2. **Restore Database**
   ```sql
   -- If you have backup
   -- Restore from backup
   
   -- Or manually revert migration
   -- Run reverse SQL
   ```

3. **Verify Database**
   ```sql
   -- Check critical tables
   SELECT COUNT(*) FROM articles;
   SELECT COUNT(*) FROM workflows;
   ```

4. **Restart Application**
   - Redeploy previous version
   - Verify functionality

---

## 7. Deployment Best Practices

### Before Deployment

- ✅ **Test Locally**: Always test changes locally
- ✅ **Review Changes**: Code review before merge
- ✅ **Run Tests**: Ensure all tests pass
- ✅ **Check Migrations**: Test migrations separately
- ✅ **Backup Database**: Backup before migrations

### During Deployment

- ✅ **Monitor Build**: Watch build logs
- ✅ **Check Errors**: Monitor for errors
- ✅ **Verify Health**: Check health endpoints
- ✅ **Test Functionality**: Smoke test key features

### After Deployment

- ✅ **Monitor Metrics**: Watch performance metrics
- ✅ **Check Logs**: Review error logs
- ✅ **Verify Features**: Test new features
- ✅ **Document Changes**: Update changelog

---

## 8. Common Deployment Issues

### Issue: Build Fails

**Symptoms:**
- Build errors in Vercel
- TypeScript errors
- Missing dependencies

**Solution:**
1. Check build logs
2. Fix errors locally
3. Verify `package.json` dependencies
4. Re-run deployment

---

### Issue: Migration Fails

**Symptoms:**
- Migration errors in Supabase
- Database errors
- Table creation failures

**Solution:**
1. Check migration SQL
2. Verify idempotency
3. Check dependencies
4. Run migration manually if needed

---

### Issue: Environment Variables Missing

**Symptoms:**
- Runtime errors
- Missing configuration
- Service failures

**Solution:**
1. Check Vercel environment variables
2. Verify all required variables set
3. Check variable names
4. Redeploy after fixing

---

### Issue: Performance Degradation

**Symptoms:**
- Slow API responses
- High latency
- Timeout errors

**Solution:**
1. Check metrics
2. Review recent changes
3. Check database performance
4. Rollback if needed

---

## 9. Deployment Checklist

### Pre-Deployment

- [ ] Code reviewed
- [ ] Tests passing
- [ ] Migrations tested
- [ ] Environment variables set
- [ ] Documentation updated

### Deployment

- [ ] Migrations applied
- [ ] Deployment triggered
- [ ] Build successful
- [ ] Health checks passing

### Post-Deployment

- [ ] Functionality verified
- [ ] Metrics monitored
- [ ] No errors detected
- [ ] Team notified

---

**See Also:**
- [Deployment Guide](../DEPLOYMENT_GUIDE.md)
- [Runbook](./runbook.md)
- [Troubleshooting Guide](./troubleshooting.md)
