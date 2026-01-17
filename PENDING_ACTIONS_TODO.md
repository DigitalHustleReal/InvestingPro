# Pending Actions - TODO List

**Status:** ⏳ **DEFERRED** - Will be completed at end of development

---

## 🔄 Data Source Enhancements

### 1. RBI Website Scraping ⏳
**Current:** Using default rates (updated manually)  
**Pending:** Implement Playwright/Puppeteer scraper for RBI website  
**Priority:** Medium  
**Impact:** Real-time RBI policy rates

**Files to Update:**
- `lib/data-sources/rbi-api.ts` - Add scraping function
- `app/api/cron/update-rbi-rates/route.ts` - Use scraper instead of defaults

---

### 2. AMFI Returns Calculation ⏳
**Current:** Validates NAV only  
**Pending:** Calculate 1Y/3Y/5Y returns from AMFI NAV history  
**Priority:** Medium  
**Impact:** More accurate return validation

**Files to Update:**
- `lib/data-sources/amfi-api.ts` - Add returns calculation
- `lib/validation/fact-checker-authoritative.ts` - Use calculated returns

---

### 3. IRDA Integration ⏳
**Current:** No IRDA validation  
**Pending:** Add IRDA (Insurance Regulatory Authority) validation  
**Priority:** Low  
**Impact:** Insurance product validation

**Files to Create:**
- `lib/data-sources/irda-api.ts` - IRDA API integration
- Update `lib/validation/fact-checker-authoritative.ts` - Add IRDA validation

---

### 4. SEBI Circulars Database ⏳
**Current:** Static compliance rules  
**Pending:** Scrape/parse SEBI circulars for auto-updating rules  
**Priority:** Low  
**Impact:** Auto-updating compliance rules

**Files to Create:**
- `lib/data-sources/sebi-circulars.ts` - SEBI circulars scraper
- `app/api/cron/sync-sebi-rules/route.ts` - Cron job for SEBI rules

---

### 5. NSE/BSE Integration ⏳
**Current:** No stock price validation  
**Pending:** Add NSE/BSE integration for stock price validation  
**Priority:** Low  
**Impact:** Stock-related content validation

**Files to Create:**
- `lib/data-sources/nse-bse-api.ts` - NSE/BSE API integration

---

## 🎨 UI/UX Enhancements

### 6. Validation UI in Admin Editor ⏳
**Current:** Validation happens but errors shown in console/API response  
**Pending:** Add inline validation errors in admin editor  
**Priority:** High  
**Impact:** Better user experience

**Files to Create/Update:**
- `components/admin/ValidationErrors.tsx` - Validation error display
- `app/admin/articles/[id]/edit/page.tsx` - Integrate validation UI

---

## 📊 Monitoring & Alerts

### 7. Rate Change Alerts ⏳
**Current:** Rates update silently  
**Pending:** Add alerts when RBI/AMFI rates change significantly  
**Priority:** Low  
**Impact:** Proactive monitoring

**Files to Create:**
- `lib/alerts/rate-change-alerts.ts` - Alert system
- `app/api/cron/check-rate-changes/route.ts` - Rate change detection

---

### 8. Historical Data Tracking ⏳
**Current:** Only current rates stored  
**Pending:** Track historical rate changes for trend analysis  
**Priority:** Low  
**Impact:** Trend analysis, better predictions

**Files to Create:**
- `supabase/migrations/XXXXXX_rbi_rates_history.sql` - Historical rates table
- `lib/analytics/rate-trends.ts` - Trend analysis

---

## 📋 Summary

**Total Pending Items:** 8

**By Priority:**
- **High:** 1 (Validation UI)
- **Medium:** 2 (RBI Scraping, AMFI Returns)
- **Low:** 5 (IRDA, SEBI, NSE/BSE, Alerts, Historical)

**Estimated Time:**
- High Priority: 1-2 days
- Medium Priority: 2-3 days
- Low Priority: 3-5 days
- **Total:** 6-10 days

---

## ✅ What's Working Now

- ✅ RBI validation (with default rates)
- ✅ AMFI validation (NAV, basic returns)
- ✅ SEBI compliance (static rules)
- ✅ Product database validation
- ✅ Daily cron jobs (RBI, AMFI sync)
- ✅ Fact-checking integration
- ✅ Compliance validation

**All core functionality is working!** Pending items are enhancements.

---

**Status:** ⏳ **DEFERRED** - Will complete at end of development

**Last Updated:** 2026-01-XX
