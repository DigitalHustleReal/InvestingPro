# Today's Action Checklist - Final 5% to Production

**Date:** January 17, 2026  
**Goal:** Complete remaining 5% to reach 100% production readiness  
**Estimated Time:** 90 minutes

---

## ✅ QUICK STATUS CHECK

**Current Status:** 95% Production Ready  
**Target:** 100% Production Ready  
**Remaining:** 5% (4 tasks)

---

## 🎯 TODAY'S TASKS (90 minutes)

### Task 1: Apply Database Migrations (15 min) ⏰

**Priority:** CRITICAL  
**Status:** ⏳ Pending

**Steps:**
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/20260115_analytics_events.sql`
3. Run migration
4. Verify: `SELECT * FROM analytics_events LIMIT 1;`
5. Copy contents of `supabase/migrations/20260115_content_scoring.sql`
6. Run migration
7. Verify: `SELECT * FROM content_scores LIMIT 1;`

**Success Criteria:**
- ✅ `analytics_events` table exists
- ✅ `content_scores` table exists
- ✅ Both tables queryable

**Files:**
- `supabase/migrations/20260115_analytics_events.sql`
- `supabase/migrations/20260115_content_scoring.sql`

---

### Task 2: Set Up Google Search Console (30 min) ⏰

**Priority:** HIGH  
**Status:** ⏳ Pending

**Steps:**
1. Go to https://search.google.com/search-console
2. Click "Add Property"
3. Enter: `https://investingpro.in`
4. Choose verification method:
   - **Option A:** HTML file (download, upload to `/public/`)
   - **Option B:** DNS record (add TXT record)
5. Verify ownership
6. Submit sitemap: `https://investingpro.in/sitemap.xml`
7. Test URL inspection with a sample page

**Success Criteria:**
- ✅ Property verified
- ✅ Sitemap submitted
- ✅ URL inspection working

**Benefits:**
- Instant indexing for new content
- Search performance insights
- Coverage reports

---

### Task 3: Set Up Lighthouse CI (15 min) ⏰

**Priority:** MEDIUM  
**Status:** ⏳ Pending

**Steps:**
1. Create `.lighthouserc.js` in project root:
   ```javascript
   module.exports = {
     ci: {
       collect: {
         url: ['http://localhost:3000'],
         numberOfRuns: 3,
       },
       assert: {
         assertions: {
           'categories:performance': ['error', {minScore: 0.8}],
           'categories:accessibility': ['error', {minScore: 0.9}],
           'categories:best-practices': ['error', {minScore: 0.9}],
           'categories:seo': ['error', {minScore: 0.9}],
         },
       },
       upload: {
         target: 'temporary-public-storage',
       },
     },
   };
   ```

2. Add to `package.json` scripts:
   ```json
   "lighthouse": "lhci autorun"
   ```

3. Test locally: `npm run lighthouse`

4. (Optional) Add GitHub Action for CI/CD

**Success Criteria:**
- ✅ Lighthouse config created
- ✅ Local test passes
- ✅ Performance budgets set

**Files to Create:**
- `.lighthouserc.js`

---

### Task 4: Test All Systems (30 min) ⏰

**Priority:** CRITICAL  
**Status:** ⏳ Pending

**Test Checklist:**

#### Analytics Tracking
- [ ] Trigger page view event
- [ ] Check `analytics_events` table for entry
- [ ] Verify event data structure
- [ ] Test funnel tracking

#### Content Scoring
- [ ] Score an existing article
- [ ] Check `content_scores` table
- [ ] Verify score breakdown (SEO, intent, monetization, quality)
- [ ] Verify overall score calculation

#### Intent Classification
- [ ] Classify an article
- [ ] Verify intent type (informational/navigational/transactional/commercial)
- [ ] Check keyword extraction
- [ ] Review optimization suggestions

#### Background Jobs
- [ ] Trigger daily scoring job
- [ ] Verify job execution
- [ ] Check scores updated
- [ ] Trigger weekly cleanup job
- [ ] Verify low-performing content archived

#### Health Checks
- [ ] Call `/api/health` - verify 200 response
- [ ] Call `/api/health/liveness` - verify 200 response
- [ ] Call `/api/health/readiness` - verify 200 response
- [ ] Check component statuses

#### Alert Evaluation
- [ ] Call `POST /api/v1/alerts/evaluate`
- [ ] Verify response structure
- [ ] Check alert rules evaluated

**Success Criteria:**
- ✅ All systems responding
- ✅ Data flowing correctly
- ✅ No errors in logs

---

## 📋 VERIFICATION COMMANDS

### Database Verification
```sql
-- Check analytics events
SELECT COUNT(*) FROM analytics_events;

-- Check content scores
SELECT COUNT(*) FROM content_scores;

-- Check recent events
SELECT * FROM analytics_events ORDER BY created_at DESC LIMIT 5;

-- Check recent scores
SELECT * FROM content_scores ORDER BY created_at DESC LIMIT 5;
```

### API Testing
```bash
# Health check
curl https://investingpro.in/api/health

# Liveness
curl https://investingpro.in/api/health/liveness

# Readiness
curl https://investingpro.in/api/health/readiness

# Alert evaluation
curl -X POST https://investingpro.in/api/v1/alerts/evaluate \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ⏰ TIME ALLOCATION

| Task | Time | Priority |
|------|------|----------|
| Apply Migrations | 15 min | CRITICAL |
| Google Search Console | 30 min | HIGH |
| Lighthouse CI | 15 min | MEDIUM |
| Test Systems | 30 min | CRITICAL |
| **Total** | **90 min** | |

---

## ✅ COMPLETION CHECKLIST

### Database
- [ ] Analytics events migration applied
- [ ] Content scoring migration applied
- [ ] Tables verified and queryable

### External Services
- [ ] Google Search Console configured
- [ ] Sitemap submitted
- [ ] Lighthouse CI configured
- [ ] Performance budgets set

### Testing
- [ ] Analytics tracking tested
- [ ] Content scoring tested
- [ ] Intent classification tested
- [ ] Background jobs tested
- [ ] Health checks verified
- [ ] Alert evaluation tested

### Documentation
- [ ] All changes documented
- [ ] Status updated
- [ ] Next steps clear

---

## 🎯 SUCCESS METRICS

**After Today:**
- ✅ 100% Production Ready
- ✅ All migrations applied
- ✅ External services configured
- ✅ All systems tested and verified
- ✅ Ready for staging deployment

---

## 🚀 NEXT STEPS (After Today)

### Tomorrow
- Integration testing
- Performance optimization
- Fix any issues found

### This Week
- Create staging environment
- Deploy to staging
- Staging validation

### Next Week
- Production deployment
- 7-day survival test
- Monitor and optimize

---

## 📞 QUICK REFERENCE

**Supabase Dashboard:** https://supabase.com/dashboard  
**Google Search Console:** https://search.google.com/search-console  
**Lighthouse CI Docs:** https://github.com/GoogleChrome/lighthouse-ci

**Health Endpoints:**
- `/api/health` - Full health check
- `/api/health/liveness` - Liveness probe
- `/api/health/readiness` - Readiness probe

**Alert Endpoint:**
- `POST /api/v1/alerts/evaluate` - Evaluate alerts

---

**Status:** Ready to complete final 5%! 🎯  
**Confidence:** Very High ✅  
**Blockers:** None 🚀
