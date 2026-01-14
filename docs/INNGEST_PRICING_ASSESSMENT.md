# 💰 Inngest Pricing Assessment

**Date:** January 13, 2026  
**Question:** Is Inngest free tier enough?

---

## 📊 Inngest Free Tier Limits (Updated 2026)

### What's Included (Free "Hobby" Tier)

**Function Executions:**
- ✅ **50,000 executions/month** (free) - **DOUBLED from previous limit!**
- ✅ **5 concurrent steps** (parallel processing)
- ✅ **50 realtime connections**
- ✅ **3 users** (team members)
- ✅ Unlimited events
- ✅ Basic monitoring
- ✅ All core features
- ✅ **No credit card required**

**What Counts as an Execution:**
- Each time a function runs (job execution)
- Article generation = 1 execution
- Bulk generation = 1 execution (even if processing multiple articles)
- Retries count as separate executions

---

## 📈 Your Usage Estimate

### Current Usage Patterns

**Article Generation:**
- Single article generation = **1 invocation**
- Typical generation time: 30-120 seconds
- Each API call = 1 job = 1 invocation

**Bulk Generation:**
- Bulk job (10 articles) = **1 invocation** (not 10!)
- Inngest counts the function execution, not individual items
- So bulk operations are very efficient

**Other Jobs:**
- Image generation = 1 invocation per image
- Any other background job = 1 invocation

---

## 🎯 Free Tier Sufficiency Analysis

### Scenario 1: Moderate Usage (Likely Your Case)

**Assumptions:**
- 50-100 articles generated per month
- 5-10 bulk operations per month (50-100 articles)
- Occasional image generation

**Total Executions:**
- Single articles: ~100 executions
- Bulk operations: ~10 executions
- Image generation: ~50 executions
- **Total: ~160 executions/month**

**Verdict:** ✅ **Free tier is MORE than enough** (0.3% of 50,000 limit!)

---

### Scenario 2: High Usage

**Assumptions:**
- 500-1000 articles per month
- 20-50 bulk operations
- Regular image generation

**Total Executions:**
- Single articles: ~1,000 executions
- Bulk operations: ~50 executions
- Image generation: ~200 executions
- **Total: ~1,250 executions/month**

**Verdict:** ✅ **Still well within free tier** (2.5% of 50,000 limit)

---

### Scenario 3: Very High Usage (Future Growth)

**Assumptions:**
- 5,000+ articles per month
- 100+ bulk operations
- Heavy automation

**Total Executions:**
- Could reach 5,000-10,000 executions/month
- **Verdict:** ✅ **Still well within free tier** (10-20% of 50,000 limit)

---

## 💡 Key Insight: Bulk Operations Are Efficient

**Important:** Inngest counts **function executions**, not individual items.

**Example:**
- Bulk generate 100 articles = **1 execution** (not 100!)
- This makes bulk operations very cost-effective
- Even with retries, you're unlikely to hit limits

**Your bulk generation job:**
```typescript
// This entire job = 1 invocation, even if processing 100 topics
for (const topic of topics) {
  await generateArticle(topic);
}
```

---

## 📊 Free Tier vs Paid Plans

### Free Tier (Hobby Plan - Current)
- ✅ **50,000 executions/month** (generous!)
- ✅ 5 concurrent steps
- ✅ 50 realtime connections
- ✅ 3 users
- ✅ Unlimited events
- ✅ Basic monitoring
- ✅ All core features
- ✅ **No credit card required**

### Paid Plans (If Needed Later)
- **Pro:** $75/month - 1,000,000+ executions
- **Enterprise:** Custom pricing

---

## 🎯 Recommendation

### ✅ **Free Tier is Sufficient For:**

1. **Development & Testing** ✅
   - Unlimited testing
   - All features available
   - 50,000 executions is very generous

2. **Early Production** ✅
   - Up to 50,000 executions/month
   - Typical usage: 100-1,000 executions/month
   - **98% headroom remaining!**

3. **Moderate Growth** ✅
   - Can handle 10,000-20,000 articles/month
   - Bulk operations are efficient
   - Still well within free tier

4. **Significant Growth** ✅
   - Can handle 30,000-40,000 executions/month
   - Plenty of room for scaling

### ⚠️ **Consider Paid Plan When:**

1. **Very High Volume** (40,000+ executions/month)
   - Approaching free tier limit (80%+)
   - Need more headroom or optimization

2. **Advanced Features** (Future)
   - Advanced monitoring
   - Priority support
   - Custom SLAs

3. **Enterprise Needs**
   - Custom integrations
   - Dedicated support
   - Compliance requirements

---

## 📈 Growth Projection

### Current Phase (Development)
- **Usage:** <100 executions/month
- **Tier:** Free ✅ (0.2% of limit)

### Launch Phase (First 6 Months)
- **Usage:** 500-2,000 executions/month
- **Tier:** Free ✅ (1-4% of limit)

### Growth Phase (6-12 Months)
- **Usage:** 2,000-10,000 executions/month
- **Tier:** Free ✅ (4-20% of limit)

### Scale Phase (12+ Months)
- **Usage:** 10,000-30,000 executions/month
- **Tier:** Free ✅ (20-60% of limit)

### Enterprise Phase (24+ Months)
- **Usage:** 30,000-50,000 executions/month
- **Tier:** Free ✅ (60-100% of limit, consider upgrade)

---

## 💰 Cost Comparison

### If You Exceed Free Tier:

**Option 1: Upgrade to Pro**
- Cost: $75/month
- Limit: 1,000,000+ executions
- **Cost per 1,000 executions:** $0.075 (very affordable)

**Option 2: Optimize Usage**
- Use bulk operations more (1 invocation for many articles)
- Batch similar jobs
- **Cost:** $0 (stay on free tier)

---

## 🎯 Final Answer

### ✅ **YES - Free Tier is MORE Than Enough!**

**Reasons:**
1. ✅ **50,000 executions/month** is very generous (doubled from previous limit!)
2. ✅ **Bulk operations are efficient** (1 execution for many articles)
3. ✅ **Typical usage** is 100-1,000 executions/month (0.2-2% of limit)
4. ✅ **Massive headroom** - can scale 50x before hitting limit
5. ✅ **No credit card required** - truly free
6. ✅ **5 concurrent steps** - handles parallel processing
7. ✅ **All core features** included

**When to Reassess:**
- If you consistently use 40,000+ executions/month (80%+ of limit)
- If you need more concurrent steps (currently 5)
- If you need advanced features or enterprise support
- If you need more team members (currently 3 users)

---

## 📝 Monitoring Usage

### Check Your Usage:

1. **Inngest Dashboard:**
   - Visit: https://app.inngest.com
   - Go to: **Usage** or **Billing**
   - See current month's executions
   - Monitor percentage of free tier used

2. **Set Up Alerts:**
   - Inngest can alert you at 80% of limit
   - Gives time to optimize or upgrade

---

## 🚀 Recommendation

**Start with Free Tier:**
- ✅ No cost
- ✅ All features available
- ✅ Plenty of headroom
- ✅ Easy to upgrade later if needed

**Monitor Usage:**
- Check dashboard monthly
- Optimize if approaching limit
- Upgrade only when necessary

**Bottom Line:** Free tier (50,000 executions/month) will easily handle your needs for the **next 1-2 years** of growth. You can always upgrade later if you scale significantly (40,000+ executions/month).

**Confidence Level:** 🟢 **Very High** - Free tier is more than sufficient for your use case.

---

*Pricing Assessment - January 13, 2026*
