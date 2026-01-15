# WEEK 1 ACTION CHECKLIST
**Date:** January 22, 2026  
**Goal:** Fix critical blockers + establish monetization foundation  
**Timeline:** 5 days (40 hours)

---

## DAY 1-2: Critical Production Blockers

### ✅ Task 1.1: Test Coverage Verification (4 hours)

**Action:**
```bash
npm run test:coverage
```

**Check:**
- [ ] Line coverage: 75%+
- [ ] Branch coverage: 70%+
- [ ] Function coverage: 75%+

**If Below Threshold:**
- [ ] Add tests for `lib/middleware/api-wrapper.ts`
- [ ] Add tests for `lib/content/content-scorer.ts`
- [ ] Add tests for `lib/analytics/event-tracker.ts`
- [ ] Add tests for `lib/monetization/affiliate-service.ts` (if exists)

**Success:** Coverage report shows thresholds met

---

### ✅ Task 1.2: Migration Rollback Strategy (2 hours)

**Action:** Create `MIGRATION_ROLLBACK_GUIDE.md`

**Document:**
- [ ] Manual rollback procedure for last 10 migrations
- [ ] OR create rollback migrations
- [ ] Test rollback on staging

**Success:** Rollback procedure documented and tested

---

## DAY 3-4: Strategic Rebranding

### ✅ Task 2.1: Rebrand Positioning (4 hours)

**Files to Update:**

1. **`app/page.tsx`** (Line 40)
   - **Current:** "Find Your Perfect Financial Product In 30 Seconds"
   - **Change To:** "Compare 1000+ Credit Cards & Mutual Funds. Make Smart Decisions. Apply Instantly."

2. **`app/page.tsx`** (Line 32)
   - **Current:** "India's Best Financial Platform. Compare investments, access terminal-grade tools, and optimize your wealth."
   - **Change To:** "India's Decision-Making Platform for Credit Cards & Investments. Compare, decide, and apply instantly."

3. **`components/home/HeroSection.tsx`** (Lines 18-20)
   - **Current:** Generic carousel slides
   - **Change To:** Decision-focused slides:
     - "Find Your Perfect Credit Card" (not "Maximize Your Spends")
     - "Start Your Investment Journey" (not "Grow Your Wealth Smartly")

4. **Meta Description** (All pages)
   - **Change To:** Include "decision-making" and "Credit Cards & Mutual Funds"

**Success:** All public-facing copy reflects decision-maker positioning

---

### ✅ Task 2.2: Remove Educational Content Focus (2 hours)

**Action:** Audit existing content

**Files to Check:**
- [ ] `app/articles/` - Check for "What is..." articles
- [ ] `app/blog/` - Check for educational content
- [ ] Content database - Query for educational titles

**Action Items:**
- [ ] List all "What is..." type articles
- [ ] Mark for removal or rewrite to decision-focused
- [ ] Update content strategy document

**Success:** Content strategy updated, educational content identified

---

## DAY 5: Revenue Foundation

### ✅ Task 3.1: Revenue Dashboard API (4 hours)

**Create:** `app/api/v1/admin/revenue/dashboard/route.ts`

**Endpoints:**
- `GET /api/v1/admin/revenue/dashboard` - Overall revenue metrics
- `GET /api/v1/admin/revenue/by-category` - Revenue by category
- `GET /api/v1/admin/revenue/by-article` - Revenue by article
- `GET /api/v1/admin/revenue/by-affiliate` - Revenue by affiliate partner

**Metrics to Return:**
```typescript
{
  totalRevenue: number;
  revenueByCategory: {
    creditCards: number;
    mutualFunds: number;
    insurance: number;
    others: number;
  };
  topConvertingArticles: Array<{
    articleId: string;
    articleTitle: string;
    revenue: number;
    conversions: number;
  }>;
  topAffiliatePartners: Array<{
    partnerName: string;
    revenue: number;
    conversions: number;
  }>;
  conversionRates: {
    creditCards: number;
    mutualFunds: number;
    overall: number;
  };
}
```

**Success:** API returns real-time revenue metrics

---

### ✅ Task 3.2: Revenue Dashboard UI (2 hours)

**Create:** `app/admin/revenue/page.tsx`

**Components:**
- [ ] Revenue overview card (total revenue)
- [ ] Revenue by category chart (Credit Cards vs Mutual Funds)
- [ ] Top converting articles table
- [ ] Top affiliate partners table
- [ ] Conversion rates display

**Success:** Dashboard displays revenue metrics visually

---

## WEEK 1 COMPLETION CHECKLIST

### Production Readiness
- [ ] Test coverage verified/improved
- [ ] Migration rollback strategy documented
- [ ] All critical blockers addressed

### Strategic Positioning
- [ ] Positioning rebranded to decision-maker
- [ ] All public-facing copy updated
- [ ] Educational content identified for removal

### Monetization Foundation
- [ ] Revenue dashboard API created
- [ ] Revenue dashboard UI created
- [ ] Revenue tracking by category working

---

## TIME TRACKING

| Task | Estimated | Actual | Status |
|------|-----------|--------|--------|
| Test Coverage | 4h | ___ | ⏳ |
| Migration Rollback | 2h | ___ | ⏳ |
| Rebrand Positioning | 4h | ___ | ⏳ |
| Content Audit | 2h | ___ | ⏳ |
| Revenue Dashboard API | 4h | ___ | ⏳ |
| Revenue Dashboard UI | 2h | ___ | ⏳ |
| **Total** | **18h** | **___** | |

---

## BLOCKERS & RISKS

**Potential Blockers:**
- Test coverage may require significant test writing
- Revenue data may not exist yet (need to seed/test)

**Mitigation:**
- Start with critical path tests only
- Use mock data for revenue dashboard initially

---

## NEXT WEEK PREVIEW

**Week 2 Focus:**
- Fix high-risk production gaps
- Set up content pipeline for Credit Cards + Mutual Funds
- Optimize affiliate placement
- Create staging environment

---

**Status:** Ready to start  
**Confidence:** High  
**First Action:** Run `npm run test:coverage`
