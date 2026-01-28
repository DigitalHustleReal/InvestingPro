# 🔄 CMS Operational Maintenance Guide
**Purpose:** Keep CMS running at 100% operational status  
**Frequency:** Daily, Weekly, Monthly

---

## 📋 **Daily Maintenance Checklist** (30 min/day)

### **1. Monitor Cron Jobs** (5 min)
```bash
# Check Vercel cron job logs
# Or check database for last_run timestamps
```

**Check:**
- ✅ RBI rates sync (`/api/cron/update-rbi-rates`) - Should run daily at 2 AM
- ✅ AMFI data sync (`/api/cron/sync-amfi-data`) - Should run daily at 3 AM
- ✅ Rankings sync (`/api/cron/sync-rankings`) - Should run daily at 4 AM
- ✅ Scheduled publishing (`/api/cron/publish-scheduled`) - Should run every 15 min
- ✅ Broken links check (`/api/cron/check-links`) - Should run weekly
- ✅ Ranking drops check (`/api/cron/check-rankings-drops`) - Should run daily
- ✅ Data changes check (`/api/cron/check-data-changes`) - Should run daily

**Action if Failed:**
- Check error logs
- Verify API credentials
- Restart cron job if needed

---

### **2. Check Error Logs** (5 min)
**Location:** Vercel Dashboard → Functions → Logs

**Look for:**
- ❌ TypeScript errors
- ❌ API errors (429, 500, 503)
- ❌ Database connection errors
- ❌ External API failures

**Action if Errors:**
- Check error rate (should be < 0.1%)
- Investigate spikes
- Fix critical errors immediately

---

### **3. Monitor Data Freshness** (5 min)
**Check:** Admin Dashboard → CMS → Health

**Verify:**
- ✅ RBI rates updated in last 24 hours
- ✅ AMFI NAV updated in last 24 hours
- ✅ Product data updated in last 7 days
- ✅ No stale data warnings

**Action if Stale:**
- Trigger manual sync
- Check scraper status
- Verify cron jobs running

---

### **4. Review Generation Queue** (10 min)
**Check:** Admin Dashboard → Content Factory

**Monitor:**
- ✅ Articles in queue (should be < 10 pending)
- ✅ Failed generations (should be 0)
- ✅ Average generation time (should be < 5 min)
- ✅ AI cost today (should be within budget)

**Action if Issues:**
- Clear stuck jobs
- Check AI API quota
- Review generation errors

---

### **5. Check Rankings Sync** (5 min)
**Check:** Admin Dashboard → SEO → Rankings

**Verify:**
- ✅ Rankings synced in last 24 hours
- ✅ No ranking drops > 3 positions
- ✅ New articles appearing in GSC

**Action if Issues:**
- Verify GSC API credentials
- Check GSC API quota
- Review ranking drops

---

## 📊 **Weekly Maintenance** (2-3 hours/week)

### **1. Review Performance Metrics** (1 hour)
**Check:** Admin Dashboard → Analytics

**Review:**
- 📈 Top performing articles
- 📉 Articles with ranking drops
- 💰 Revenue attribution
- 📊 Keyword performance

**Action:**
- Identify content refresh opportunities
- Optimize top performers
- Fix underperformers

---

### **2. Check Content Quality** (30 min)
**Check:** Admin Dashboard → Review Queue

**Review:**
- ✅ Fact-check scores (should be > 90%)
- ✅ Compliance scores (should be 100%)
- ✅ Plagiarism checks (should be < 10% similarity)
- ✅ Validation errors (should be 0)

**Action:**
- Fix validation errors
- Review low-scoring content
- Update validation rules if needed

---

### **3. Update Keyword Data** (30 min)
**Check:** Admin Dashboard → SEO → Keywords

**Update:**
- ✅ Refresh trending keywords
- ✅ Update search volumes
- ✅ Check keyword difficulty
- ✅ Identify new opportunities

**Action:**
- Update keyword database
- Create content for trending keywords
- Optimize existing content

---

### **4. Optimize Slow Queries** (30 min)
**Check:** Database query logs

**Identify:**
- ⚠️ Queries > 1 second
- ⚠️ N+1 queries
- ⚠️ Missing indexes

**Action:**
- Add indexes if needed
- Optimize queries
- Cache frequently accessed data

---

## 📅 **Monthly Optimization** (1 day/month)

### **1. Review Revenue Attribution** (2 hours)
**Analyze:**
- 💰 Top revenue-generating articles
- 📊 Keyword-to-revenue paths
- 📈 Conversion rates by category
- 📉 Underperforming content

**Action:**
- Optimize top performers
- Fix or refresh underperformers
- Create content for high-value keywords

---

### **2. Content Performance Analysis** (2 hours)
**Analyze:**
- 📈 Traffic trends
- 📉 Ranking trends
- 🔄 Refresh opportunities
- 🎯 New content opportunities

**Action:**
- Refresh stale content
- Create new content
- Remove or consolidate duplicates

---

### **3. Automation Rules Review** (2 hours)
**Review:**
- ✅ Auto-refresh triggers (working correctly?)
- ✅ Auto-interlinking rules (too aggressive?)
- ✅ Cannibalization detection (catching issues?)
- ✅ Compliance rules (up to date?)

**Action:**
- Update rules based on performance
- Add new automation rules
- Remove ineffective rules

---

### **4. Cost Optimization** (1 hour)
**Review:**
- 💰 AI API costs (OpenAI, Anthropic)
- 💰 External API costs (GSC, keyword APIs)
- 💰 Database costs
- 💰 Storage costs (Cloudinary, Supabase)

**Action:**
- Optimize AI usage
- Reduce unnecessary API calls
- Clean up unused data
- Optimize storage

---

### **5. Security Audit** (1 hour)
**Check:**
- 🔒 API credentials (rotate if needed)
- 🔒 Database access (review permissions)
- 🔒 Admin access (review users)
- 🔒 PII encryption (verify working)

**Action:**
- Rotate credentials
- Revoke unused access
- Update security policies
- Review audit logs

---

### **6. Documentation Update** (1 hour)
**Update:**
- 📖 API documentation
- 📖 User guides
- 📖 Maintenance runbooks
- 📖 Troubleshooting guides

---

## 🚨 **Emergency Procedures**

### **If CMS Goes Down:**

1. **Check Status** (5 min)
   - Vercel deployment status
   - Database connection
   - API endpoints responding

2. **Identify Cause** (10 min)
   - Check error logs
   - Check cron job status
   - Check API quotas

3. **Fix Issue** (varies)
   - Restart services if needed
   - Fix code errors
   - Update credentials if expired

4. **Verify Recovery** (10 min)
   - Test core workflows
   - Verify cron jobs running
   - Check error rate

---

## 📈 **Health Monitoring Dashboard**

### **Key Metrics to Track:**

1. **Uptime:** Should be > 99.9%
2. **Error Rate:** Should be < 0.1%
3. **Response Time:** Should be < 500ms (p95)
4. **Data Freshness:** Should be < 7 days
5. **Generation Success Rate:** Should be > 95%
6. **Validation Pass Rate:** Should be > 99%

---

## ✅ **Status Checks**

### **Green (All Good):**
- ✅ All cron jobs running
- ✅ Error rate < 0.1%
- ✅ Data freshness < 7 days
- ✅ All workflows functional

### **Yellow (Attention Needed):**
- ⚠️ Some cron jobs failing
- ⚠️ Error rate 0.1-1%
- ⚠️ Data freshness 7-14 days
- ⚠️ Some workflows slow

### **Red (Critical):**
- 🔴 Cron jobs not running
- 🔴 Error rate > 1%
- 🔴 Data freshness > 14 days
- 🔴 Workflows broken

---

## 🔄 **Continuous Improvement**

### **Weekly:**
- Review and optimize workflows
- Update automation rules
- Fix edge cases

### **Monthly:**
- Review and update documentation
- Optimize costs
- Review and optimize performance

### **Quarterly:**
- Major feature updates
- Infrastructure improvements
- Security audits

---

**Keep this CMS running at 100%! 🚀**
