# ✅ Constraints Acknowledged & Confirmed

**Date:** January 2025  
**Platform:** InvestingPro.in  
**Status:** All constraints understood and will be enforced

---

## ✅ ACKNOWLEDGMENT

I acknowledge and confirm understanding of all 10 absolute rules for InvestingPro.in:

1. ✅ **Correctness First** - Prioritize accuracy, transparency, trust over speed
2. ✅ **No Hallucination** - Never invent financial facts, rates, rules, or legal claims
3. ✅ **Verified Sources Only** - All facts from Supabase, RBI, SEBI, AMFI, official sites
4. ✅ **AI Templates Only** - No free writing, strict templates with citations
5. ✅ **Editorial Team** - Assume team operation, not solo founder
6. ✅ **No Stripe** - Stripe and subscriptions NOT required
7. ✅ **Affiliate Only** - Monetization = affiliate links, tracking, ads only
8. ✅ **Approval-Gated** - Automation-first but requires human approval
9. ✅ **Never Break Dev** - All changes must preserve preview/dev server
10. ✅ **Ask When Uncertain** - Clarify before implementing

---

## 🔍 COMPLIANCE AUDIT RESULTS

### ✅ Compliant Areas
- Database schema properly structured
- Scrapers designed for official sources
- API structure supports verification
- Error handling in place
- Security headers configured

### 🔴 Non-Compliant Areas Found

1. **Stripe Code Present** (Rule 6 violation)
   - 3 Stripe API routes exist
   - Subscription tables in schema
   - Needs removal/disable

2. **Hardcoded Data** (Rule 3 violation)
   - `lib/data.ts` has mock data
   - Scripts have hardcoded rates
   - Needs removal, use Supabase only

3. **AI Assumptions** (Rule 2 violation)
   - AI prompts have "assume" statements
   - Default fallback rates
   - Needs removal, require verified data

---

## 📋 ACTION PLAN

### Immediate Actions (Before Next Development)

1. **Remove Stripe Code**
   - [ ] Delete/disable Stripe API routes
   - [ ] Remove subscription dependencies
   - [ ] Update documentation

2. **Remove Hardcoded Data**
   - [ ] Clean `lib/data.ts` (keep types only)
   - [ ] Update scripts to use Supabase
   - [ ] Remove mock data files

3. **Fix AI Templates**
   - [ ] Remove all assumptions
   - [ ] Require source data in prompts
   - [ ] Add citation requirements

4. **Add Source Tracking**
   - [ ] Ensure all data has source URLs
   - [ ] Add verification status fields
   - [ ] Implement approval workflow

---

## ✅ CONFIRMATION

**I will:**
- ✅ Always verify sources before using financial data
- ✅ Never assume or estimate rates/facts
- ✅ Use AI only with strict templates and citations
- ✅ Require human approval for all content
- ✅ Remove Stripe/subscription code
- ✅ Test all changes before committing
- ✅ Ask when uncertain about any constraint

**I will NOT:**
- ❌ Invent financial facts
- ❌ Use hardcoded rates without sources
- ❌ Allow AI to generate facts freely
- ❌ Implement Stripe/subscriptions
- ❌ Break preview or dev server
- ❌ Assume when uncertain

---

**Status:** Ready to proceed with constraint-compliant development  
**Next:** Awaiting approval to proceed with compliance fixes

