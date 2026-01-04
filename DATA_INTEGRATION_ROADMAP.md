# Data Integration Roadmap
**Phase:** Production-Ready Platform  
**Timeline:** 1-2 weeks  
**Goal:** Replace mock data with live, real-time financial data from credible sources

---

## 🎯 **Integration Priority Matrix**

### **Priority 1: IPO Terminal (Highest Impact)**
**Why First?** 
- UI already complete and polished
- High user engagement feature
- Clear competitive advantage
- Relatively simple API integration

**Data Sources:**
1. **Chittorgarh.com API** (if available) - GMP data
2. **Investorgain.com** - Subscription status
3. **NSE/BSE APIs** - Official IPO listings
4. **Fallback:** Web scraping with caching

**Implementation:**
- Create `/lib/data/ipo-service.ts`
- Set up cron job for hourly data refresh
- Add Supabase caching table: `ipo_data_cache`
- Implement fallback for API failures

---

### **Priority 2: Banking Page (Medium Impact)**
**Why Second?**
- Just created, needs credible data immediately
- FD rates change frequently (daily/weekly)
- Users trust platforms with live rates

**Data Sources:**
1. **BankBazaar API** (partnership opportunity)
2. **MoneyControl FD Rates** - Web scraping
3. **RBI Website** - Official bank rate data
4. **Individual Bank APIs** (HDFC, ICICI, etc.)

**Implementation:**
- Create `/lib/data/banking-service.ts`
- Daily cron job for FD rate updates
- Supabase table: `fd_rates_cache`
- Admin dashboard to manually update rates

---

### **Priority 3: Investing Page (Medium Impact)**
**Why Third?**
- Mutual fund data is standard and stable
- AMFI provides official NAV data
- Required for credibility

**Data Sources:**
1. **AMFI (Association of Mutual Funds in India)** - Official NAV data
2. **MoneyControl** - Mutual fund performance
3. **ValueResearch API** (if available)
4. **MFCentral** - Consolidated MF data

**Implementation:**
- Create `/lib/data/mutual-funds-service.ts`
- Daily EOD (End of Day) NAV updates
- Supabase table: `mutual_fund_nav_cache`
- Historical performance data integration

---

### **Priority 4: Insurance Page (Lower Impact)**
**Why Last?**
- Insurance data is mostly static (changes annually)
- Claim settlement ratios updated yearly by IRDAI
- Lower user engagement compared to IPO/Banking

**Data Sources:**
1. **IRDAI Annual Reports** - Official claim settlement data
2. **PolicyBazaar** - Insurance product details
3. **Insurance company websites** - Premium calculators

**Implementation:**
- Create `/lib/data/insurance-service.ts`
- Quarterly data refresh
- Supabase table: `insurance_products_cache`
- Manual admin updates for claim ratios

---

## 🛠️ **Technical Architecture**

### **Data Flow:**
```
External API/Scraper → Data Service Layer → Supabase Cache → Next.js API Route → Frontend
                                ↓
                        Fallback to Mock Data (if API fails)
```

### **Key Components:**

#### **1. Data Service Layer** (`/lib/data/`)
```typescript
// Example: ipo-service.ts
export class IPODataService {
  async fetchLiveGMP(): Promise<IPO[]>
  async getCachedData(): Promise<IPO[]>
  async refreshCache(): Promise<void>
}
```

#### **2. Supabase Caching Tables**
```sql
-- ipo_data_cache
CREATE TABLE ipo_data_cache (
  id UUID PRIMARY KEY,
  company_name TEXT,
  issue_price DECIMAL,
  gmp DECIMAL,
  estimated_listing_price DECIMAL,
  subscription_qib DECIMAL,
  subscription_nii DECIMAL,
  subscription_retail DECIMAL,
  open_date DATE,
  close_date DATE,
  listing_date DATE,
  last_updated TIMESTAMP,
  data_source TEXT
);

-- fd_rates_cache
CREATE TABLE fd_rates_cache (
  id UUID PRIMARY KEY,
  bank_name TEXT,
  regular_rate DECIMAL,
  senior_rate DECIMAL,
  tenure TEXT,
  min_deposit DECIMAL,
  rating DECIMAL,
  verified BOOLEAN,
  last_updated TIMESTAMP
);

-- mutual_fund_nav_cache
CREATE TABLE mutual_fund_nav_cache (
  id UUID PRIMARY KEY,
  fund_name TEXT,
  scheme_code TEXT,
  nav DECIMAL,
  nav_date DATE,
  fund_house TEXT,
  category TEXT,
  aum DECIMAL,
  returns_1y DECIMAL,
  returns_3y DECIMAL,
  returns_5y DECIMAL,
  last_updated TIMESTAMP
);
```

#### **3. API Routes** (`/app/api/`)
```
/app/api/ipo/live/route.ts
/app/api/banking/fd-rates/route.ts
/app/api/investing/mutual-funds/route.ts
/app/api/insurance/products/route.ts
```

#### **4. Cron Jobs** (Vercel Cron or Supabase Edge Functions)
```typescript
// Daily at 9:00 AM IST
export async function GET() {
  await ipoService.refreshCache();
  await bankingService.refreshFDRates();
  await mutualFundService.refreshNAV();
  return Response.json({ success: true });
}
```

---

## 📊 **Data Quality Standards**

### **All Data Sources Must:**
1. ✅ **Be Verifiable** - Traceable to official source
2. ✅ **Have Timestamps** - Last updated time clearly displayed
3. ✅ **Include Fallbacks** - Mock data if API fails
4. ✅ **Cache Efficiently** - Minimize API calls, respect rate limits
5. ✅ **Log Errors** - Track API failures for monitoring

---

## 🔐 **API Keys & Credentials Management**

### **Environment Variables Required:**
```env
# IPO Data
CHITTORGARH_API_KEY=xxx
INVESTORGAIN_API_KEY=xxx

# Banking Data
BANKBAZAAR_API_KEY=xxx
MONEYCONTROL_API_KEY=xxx

# Mutual Funds
AMFI_API_KEY=xxx (if required)
VALUERESEARCH_API_KEY=xxx

# Insurance
IRDAI_API_KEY=xxx
POLICYBAZAAR_API_KEY=xxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

---

## 🚦 **Implementation Phases**

### **Week 1: IPO Terminal + Banking**
**Day 1-2:** IPO Data Integration
- Research available APIs (Chittorgarh, Investorgain, NSE)
- Create `ipo-service.ts` with web scraping fallback
- Set up Supabase cache table
- Test with live data
- Update UI to consume real data

**Day 3-4:** Banking FD Rates
- Research FD rate sources (BankBazaar, MoneyControl, RBI)
- Create `banking-service.ts`
- Implement daily cron job
- Update Banking page with live rates
- Add "Last Updated" timestamp to UI

**Day 5:** Testing & Debugging
- End-to-end testing of data flow
- Error handling and fallback scenarios
- Performance optimization

---

### **Week 2: Investing + Insurance**
**Day 6-8:** Mutual Fund Data
- Integrate AMFI NAV API
- Create `mutual-funds-service.ts`
- Historical performance data
- Update Investing page

**Day 9-10:** Insurance Data
- IRDAI claim settlement data
- Insurance product details
- Premium calculator integration

**Day 11-12:** Final Polish
- Cross-page data consistency checks
- Admin dashboard for manual overrides
- Documentation
- Monitoring and alerting setup

---

## 📈 **Success Metrics**

### **Data Freshness:**
- IPO data: < 1 hour old
- FD rates: < 24 hours old
- Mutual fund NAV: < 24 hours old (EOD)
- Insurance data: < 30 days old

### **Reliability:**
- API uptime: 99%+
- Fallback activation rate: < 5%
- Cache hit rate: > 80%

### **User Trust:**
- "Last Updated" timestamp visible on all data tables
- Data source attribution (e.g., "Source: AMFI")
- Verified badges for official data

---

## 🔄 **Fallback Strategy**

### **If APIs Fail:**
1. **Tier 1:** Serve cached data (< 48 hours old)
2. **Tier 2:** Activate web scraping
3. **Tier 3:** Display mock data with clear disclaimer: "Sample data shown. Live data unavailable."
4. **Tier 4:** Email admin alert for manual intervention

---

## 🎯 **Quick Wins (Start Here)**

### **Immediate Action Items:**

1. **IPO GMP Web Scraper** (2-3 hours)
   - Target: Chittorgarh.com IPO section
   - Use Cheerio/Puppeteer
   - Cache in Supabase
   - Update IPO page to consume

2. **FD Rate Manual Seeding** (1 hour)
   - Manually collect top 10 bank FD rates
   - Seed Supabase `fd_rates_cache`
   - Update Banking page
   - Add "Updated: Jan 3, 2026" timestamp

3. **AMFI NAV Integration** (3-4 hours)
   - AMFI provides free NAV data
   - Parse CSV/JSON
   - Cache in Supabase
   - Update Investing page

---

## 📝 **Notes & Decisions**

### **Design Decisions:**
- **Prioritize Web Scraping Over Paid APIs** - Keep costs low initially
- **24-Hour Cache TTL** - Balance freshness vs API costs
- **Manual Admin Override** - Allow manual data updates for critical corrections
- **Source Attribution** - Always show data source for transparency

### **Legal Considerations:**
- ✅ Web scraping public data (allowed for informational purposes in India)
- ✅ AMFI data is publicly available
- ✅ RBI/IRDAI data is official and free
- ⚠️ Paid API partnerships require agreements

---

**Document Version:** 1.0  
**Last Updated:** January 3, 2026, 5:45 PM IST  
**Next Review:** After Week 1 completion
