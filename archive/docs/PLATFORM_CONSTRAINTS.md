# InvestingPro.in Platform Constraints & Rules

**Last Updated:** January 2025  
**Status:** ACTIVE - All development must comply

---

## ✅ ACKNOWLEDGED CONSTRAINTS

### 1. **Correctness Over Speed** ✅
- Prioritize accuracy, transparency, and trust
- Never sacrifice correctness for speed or creativity
- All financial information must be verified

### 2. **No Financial Hallucination** ✅
- NEVER invent, estimate, or assume financial facts
- NEVER create rates, rules, or legal claims without sources
- All factual content must be traceable to official sources

### 3. **Source Requirements** ✅
All factual content must come from:
- ✅ Supabase database (verified data)
- ✅ RBI official documents/website
- ✅ SEBI official documents/website
- ✅ AMFI official data/website
- ✅ Other government sites (IRDAI, etc.)
- ✅ Official product provider websites
- ✅ Existing calculator formulas (verified)

**FORBIDDEN:**
- ❌ Hardcoded rates in code
- ❌ Estimated or assumed values
- ❌ AI-generated facts without source verification
- ❌ Mock data in production

### 4. **AI Content Templates** ✅
- AI-generated content MUST follow strict templates
- NO free writing or creative generation
- Templates must include:
  - Source citations
  - Data verification requirements
  - Human review gates
  - Approval workflow

### 5. **Editorial Team Assumption** ✅
- Platform operated by editorial team, not solo founder
- All content requires review and approval
- Automation must be approval-gated
- Human oversight required for all published content

### 6. **No Stripe/Subscriptions** ✅
- Stripe integration NOT required
- Subscription flows NOT required
- Payment processing NOT needed
- **Action Required:** Remove/disable Stripe code

### 7. **Monetization Model** ✅
Monetization = ONLY:
- ✅ Affiliate links
- ✅ Affiliate click tracking
- ✅ Ad placements
- ❌ NO subscriptions
- ❌ NO payments
- ❌ NO premium tiers

### 8. **Automation-First, Approval-Gated** ✅
- All automation must be approval-gated
- Scraped data requires human review before publishing
- AI-generated content requires editorial approval
- No automatic publishing of unverified data

### 9. **Never Break Preview/Dev** ✅
- All changes must be tested
- Preview server must always work
- Dev server must always work
- No breaking changes without testing

### 10. **Ask When Uncertain** ✅
- If uncertain about implementation, ASK
- If source is unclear, ASK
- If constraint is ambiguous, ASK
- Better to ask than assume

---

## 🔴 COMPLIANCE ISSUES FOUND

### Issue 1: Stripe Code Present
**Location:** `app/api/stripe/`
**Files:**
- `create-checkout-session/route.ts`
- `webhook/route.ts`
- `subscription-status/route.ts`

**Rule Violation:** Rule 6 - Stripe NOT required

**Action Required:**
- [ ] Remove or disable Stripe API routes
- [ ] Remove subscription-related database tables (if not needed)
- [ ] Remove Stripe dependencies from package.json
- [ ] Update documentation

### Issue 2: Hardcoded Financial Data
**Location:** `lib/data.ts`
**Content:** Mock credit cards, loans, mutual funds with hardcoded rates

**Rule Violation:** Rule 3 - Must come from verified sources

**Action Required:**
- [ ] Remove hardcoded data
- [ ] Ensure all data comes from Supabase
- [ ] Verify all rates are from official sources
- [ ] Add source tracking to all data

### Issue 3: Mock/Scraped Data in Scripts
**Location:** `scripts/ghost_*.js`
**Content:** Hardcoded FD rates, interest rates

**Rule Violation:** Rule 3 - Must be from official sources

**Action Required:**
- [ ] Update scrapers to only use official sources
- [ ] Remove mock data
- [ ] Add source URL tracking
- [ ] Add verification step before database insertion

### Issue 4: AI Assumptions in Prompts
**Location:** `docs/AI_PROMPT_LIBRARY.md`
**Content:** "assume 6.95%" for T-Bill rates

**Rule Violation:** Rule 2 - No assumptions

**Action Required:**
- [ ] Remove all assumptions from AI prompts
- [ ] Require all values to be passed as verified data
- [ ] Update templates to require source citations

### Issue 5: Hardcoded Rates in Scrapers
**Location:** `lib/scraper/rate_scraper.py`
**Content:** Fallback default rates (6.0% inflation, etc.)

**Rule Violation:** Rule 2 - No assumptions

**Action Required:**
- [ ] Remove default/fallback rates
- [ ] Fail gracefully if data unavailable
- [ ] Log missing data for manual review
- [ ] Never use assumed values

---

## ✅ COMPLIANCE CHECKLIST

### Data Sources
- [ ] All product data from Supabase (verified)
- [ ] All rates from official sources (RBI, banks, AMFI)
- [ ] All legal claims from official documents
- [ ] All calculator formulas verified
- [ ] No hardcoded financial data

### Content Generation
- [ ] AI uses strict templates only
- [ ] All AI content requires citations
- [ ] All AI content requires human review
- [ ] No free-form AI writing
- [ ] Approval workflow in place

### Monetization
- [ ] Stripe code removed/disabled
- [ ] Subscription flows removed
- [ ] Only affiliate links active
- [ ] Only ad placements active
- [ ] Tracking implemented

### Automation
- [ ] All scrapers approval-gated
- [ ] All AI content approval-gated
- [ ] Human review required before publish
- [ ] Source tracking implemented
- [ ] Verification workflow in place

### Development
- [ ] Preview server tested
- [ ] Dev server tested
- [ ] No breaking changes
- [ ] All changes reviewed
- [ ] Documentation updated

---

## 📋 IMPLEMENTATION PRIORITIES

### Priority 1: Remove Stripe (Rule 6)
**Impact:** High  
**Effort:** Low  
**Status:** ⏳ Pending

### Priority 2: Remove Hardcoded Data (Rule 3)
**Impact:** Critical  
**Effort:** Medium  
**Status:** ⏳ Pending

### Priority 3: Fix AI Templates (Rule 4)
**Impact:** High  
**Effort:** Low  
**Status:** ⏳ Pending

### Priority 4: Add Source Tracking (Rule 3)
**Impact:** Critical  
**Effort:** High  
**Status:** ⏳ Pending

### Priority 5: Approval Workflows (Rule 8)
**Impact:** High  
**Effort:** High  
**Status:** ⏳ Pending

---

## 🎯 NEXT STEPS

1. **Review and confirm** this compliance document
2. **Prioritize fixes** based on criticality
3. **Implement fixes** one by one
4. **Test thoroughly** before merging
5. **Document changes** in this file

---

**I acknowledge and will comply with all constraints.** ✅

