# Quick Start Checklist - CMS Operational Plan
**Priority Order:** Follow this sequence for fastest path to production

---

## 🚨 IMMEDIATE (Day 1-2) - Unblock Build

### Critical Fixes
- [ ] **Create `/app/api/admin/articles/[id]/route.ts`**
  - GET endpoint for fetching article
  - PUT endpoint for updating article
  - DELETE endpoint for deleting article
  - Add authentication checks

- [ ] **Update `app/admin/articles/[id]/edit/page.tsx`**
  - Replace `articleService.getById()` with API call
  - Replace `articleService.saveArticle()` with API call
  - Replace `articleService.publishArticle()` with API call

- [ ] **Update `app/admin/articles/[id]/edit-refactored/page.tsx`**
  - Same changes as above

- [ ] **Fix AWS SDK warning**
  - Wrap `@aws-sdk/client-s3` in try-catch OR add to devDependencies

- [ ] **Verify Build**
  ```bash
  npm run build
  npm run type-check
  npm run lint
  ```

**Expected Time:** 4-6 hours  
**Blocking:** YES - Cannot deploy without this

---

## 🔧 WEEK 1 - Core Functionality

### Day 3-4: Article Versioning
- [ ] Create migration: `add_article_versioning.sql`
- [ ] Create service: `lib/cms/article-versioning.ts`
- [ ] Integrate with `articleService.saveArticle()`
- [ ] Update UI: `components/admin/ArticleVersionHistory.tsx`
- [ ] Test: Create article → Edit → Verify version created

### Day 5: Scraper Foundation
- [ ] Install Playwright: `npm install playwright`
- [ ] Create base scraper structure
- [ ] Implement rate limiting
- [ ] Add retry logic
- [ ] Test with one bank (HDFC)

**Expected Time:** 2-3 days  
**Blocking:** NO - Can deploy without, but needed for automation

---

## 🔐 WEEK 2 - Security & Access

### Day 1-2: Role-Based Access
- [ ] Create `user_roles` table
- [ ] Create `lib/auth/roles.ts`
- [ ] Create `lib/middleware/permissions.ts`
- [ ] Update RLS policies
- [ ] Test: Editor can edit, Viewer cannot

### Day 3: PII Encryption
- [ ] Create `lib/encryption/field-encryption.ts`
- [ ] Encrypt `author_email` in articles
- [ ] Encrypt newsletter subscriber emails
- [ ] Test: Encrypt/decrypt works

**Expected Time:** 3 days  
**Blocking:** NO - Security improvement

---

## 📊 WEEK 3 - Monitoring

### Day 1: Performance
- [ ] Add Web Vitals tracking
- [ ] Add API latency monitoring
- [ ] Run bundle analysis

### Day 2-3: Testing
- [ ] Add integration tests
- [ ] Set up CI/CD pipeline
- [ ] Run load tests

### Day 4-5: Operations
- [ ] Create runbook
- [ ] Set up alerts (email/Slack)
- [ ] Test alert delivery

**Expected Time:** 5 days  
**Blocking:** NO - Operational excellence

---

## 🤖 WEEK 4 - Advanced Automation

### Day 1-2: Content Automation
- [ ] Content health monitoring
- [ ] Auto-refresh stale content
- [ ] Quality checks

### Day 3-5: Polish
- [ ] Complete credit card scraper
- [ ] Adaptive scraper scheduling
- [ ] Final testing

**Expected Time:** 5 days  
**Blocking:** NO - Nice to have

---

## 📋 DAILY STANDUP CHECKLIST

### What to Report
1. **Completed Yesterday:**
   - [ ] Tasks finished
   - [ ] Tests passing
   - [ ] Build successful

2. **Working Today:**
   - [ ] Current task
   - [ ] Expected completion

3. **Blockers:**
   - [ ] Any issues?
   - [ ] Need help?

---

## 🎯 SUCCESS CRITERIA

### Must Have (Production Ready)
- ✅ Build completes without errors
- ✅ All admin routes functional
- ✅ Basic versioning working
- ✅ Scrapers running automatically
- ✅ Monitoring in place

### Should Have (Fully Operational)
- ✅ Role-based access
- ✅ PII encrypted
- ✅ CI/CD pipeline
- ✅ Load tested
- ✅ Runbook complete

### Nice to Have (Advanced)
- ✅ Content auto-refresh
- ✅ Quality automation
- ✅ Adaptive scheduling

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All tests passing
- [ ] Build successful
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Cache cleared (if needed)

### Deployment
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Verify critical paths
- [ ] Deploy to production
- [ ] Monitor for errors

### Post-Deployment
- [ ] Verify health checks
- [ ] Check error logs
- [ ] Monitor performance
- [ ] Verify scrapers running

---

## 📞 ESCALATION

### If Build Fails
1. Check error message
2. Review recent changes
3. Check dependencies
4. Ask for help if stuck > 30 min

### If Scraper Fails
1. Check source website
2. Verify rate limits
3. Check logs
4. Manual run to debug

### If Production Issue
1. Check Sentry for errors
2. Review logs
3. Check database health
4. Use emergency stop if needed

---

**Quick Reference:** See `CMS_OPERATIONAL_IMPLEMENTATION_PLAN.md` for detailed steps
