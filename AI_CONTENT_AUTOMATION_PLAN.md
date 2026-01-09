# Automated Data Integration & Content Generation Master Plan
**Created:** January 3, 2026, 7:00 PM IST  
**Objective:** Replace all demo content with real data using AI + scrapers

---

## 🎯 **Project Overview**

### **Goals:**
1. ✅ Clean all demo content from 8 category pages
2. ✅ Scrape live data from trusted sources (BankBazaar, Paisabazaar, AMFI, etc.)
3. ✅ Generate 1000+ glossary terms using AI
4. ✅ Create SEO-optimized info posts for all categories
5. ✅ Automate content refresh with cron jobs

### **Timeline:**
- **Phase 1:** Infrastructure setup (2-3 days)
- **Phase 2:** Content cleaning (1 day)
- **Phase 3:** Data scraping (3-4 days)
- **Phase 4:** AI content generation (1 week)
- **Phase 5:** Integration & verification (2-3 days)

**Total:** ~2 weeks to full automation

---

## 📊 **Data Sources by Category**

### **1. Credit Cards**
**Primary Sources:**
- BankBazaar.com - Card listings, features, fees
- Paisabazaar.com - Comparison data
- Individual bank websites (HDFC, SBI, ICICI, Axis)

**Data Points to Scrape:**
- Card name, bank, annual fee, joining fee
- Reward rate, cashback percentage
- Features (lounge access, fuel surcharge waiver)
- Eligibility (min income, credit score)
- Card image URL

**Scraper Priority:** HIGH (straightforward HTML structure)

---

### **2. Loans**
**Primary Sources:**
- BankBazaar.com - Personal loan rates
- Paisabazaar.com - EMI calculator data
- RBI website - Published bank rates
- Individual bank websites

**Data Points to Scrape:**
- Lender name, loan type
- Interest rate range (min-max)
- Processing fee, prepayment charges
- Loan amount range, tenure options
- Eligibility criteria

**Scraper Priority:** HIGH (critical for user decision-making)

---

### **3. Mutual Funds**
**Primary Sources:**
- AMFI (Association of Mutual Funds in India) - Official NAV data
- ValueResearch.com - Fund rankings, performance
- Moneycontrol.com - Fund screener data
- Individual AMC websites

**Data Points to Scrape:**
- Fund name, ISIN, scheme code
- Current NAV, NAV date
- 1Y/3Y/5Y returns, AUM
- Expense ratio, exit load
- Fund manager, fund house

**Scraper Priority:** MEDIUM (AMFI provides CSV, easy to parse)

---

### **4. IPOs**
**Primary Sources:**
- Chittorgarh.com - GMP data (already started)
- Investorgain.com - Subscription status
- NSE/BSE - Official IPO listings
- Moneycontrol.com - IPO calendar

**Data Points to Scrape:**
- Company name, issue price, lot size
- Grey Market Premium (GMP)
- Subscription data (QIB, NII, Retail)
- Open/close/listing dates
- Issue size, price band

**Scraper Priority:** HIGH (already have infrastructure)

---

### **5. Insurance**
**Primary Sources:**
- IRDAI Annual Reports - Claim settlement ratios
- PolicyBazaar.com - Policy details
- Individual insurer websites
- Coverfox.com - Comparison data

**Data Points to Scrape:**
- Insurer name, policy name
- Premium rates (age-wise)
- Sum assured options
- Claim settlement ratio (from IRDAI)
- Policy features, riders

**Scraper Priority:** MEDIUM (IRDAI data is PDF-based)

---

### **6. Banking (FD Rates)**
**Primary Sources:**
- BankBazaar.com - FD rate comparison
- Moneycontrol.com - Bank FD rates
- Individual bank websites
- RBI website - Official data

**Data Points to Scrape:**
- Bank name, bank type (scheduled/small finance)
- Regular interest rate, senior citizen rate
- Tenure-wise rates (7 days to 10 years)
- Minimum deposit, maximum deposit
- Bank rating (CRISIL/ICRA)

**Scraper Priority:** HIGH (already have page infrastructure)

---

### **7. Taxes**
**Primary Sources:**
- Income Tax Department website - Official tax slabs
- ClearTax.com - Tax-saving instruments list
- Government of India - Budget announcements

**Data Points to Scrape:**
- Tax slabs (current year)
- Section limits (80C, 80D, etc.)
- Deduction rules, eligibility
- Tax filing deadlines

**Scraper Priority:** LOW (mostly static government data, update yearly)

---

### **8. Small Business**
**Primary Sources:**
- MSME Ministry website - Government schemes
- Startup India portal - Startup schemes
- BankBazaar.com - Business loan rates
- Zoho, Tally, QuickBooks - Software pricing

**Data Points to Scrape:**
- Loan products (rates, eligibility)
- Government scheme details
- Software tool pricing
- Credit card features for business

**Scraper Priority:** MEDIUM (mix of static and dynamic data)

---

## 🤖 **AI Content Generation Plan**

### **Glossary Terms (1000+ total)**

#### **Category Breakdown:**
| Category | Target Terms | Examples |
|----------|-------------|----------|
| Credit Cards | 150 | APR, Grace Period, Credit Limit, Reward Points, Annual Fee |
| Loans | 150 | EMI, Principal, Interest Rate, Prepayment, Foreclosure |
| Investing | 200 | NAV, AUM, SIP, Lump Sum, Expense Ratio, CAGR, XIRR |
| IPOs | 120 | GMP, Listing Gains, Subscription, QIB, Lot Size, Allotment |
| Insurance | 120 | Sum Assured, Premium, Claim Settlement, Riders, Maturity |
| Banking | 100 | FD, RD, Account Types, IFS Code, NEFT, RTGS, UPI |
| Taxes | 100 | Tax Slab, Deduction, Exemption, ITR, TDS, Advance Tax |
| Small Business | 60 | MSME, Mudra Loan, GST, Working Capital, Invoice |

**Total:** 1000 terms

---

### **Info Posts (100+ articles)**

#### **Content Categories:**
1. **How-To Guides:** "How to choose best credit card", "How to file ITR"
2. **Comparison Posts:** "FD vs RD", "Old vs New Tax Regime"
3. **Explainers:** "What is ELSS?", "Understanding GMP"
4. **Best Practices:** "Tax saving tips", "Credit score improvement"
5. **Product Reviews:** "Best credit cards for travel", "Top ELSS funds"

#### **Content Structure per Post:**
- Title (SEO-optimized)
- Meta description (150-160 chars)
- Introduction (3-4 paragraphs)
- Main content (1500-2000 words)
- Key takeaways (bullet points)
- FAQ section (5-7 questions)
- Related links
- Schema markup (JSON-LD)

---

## 🛠️ **Technical Infrastructure**

### **1. Web Scraping Stack**
```
Puppeteer (for JavaScript-heavy sites)
Cheerio (for static HTML parsing)
Axios (for HTTP requests)
Node-Cron (for scheduled scraping)
```

### **2. AI Content Generation Stack**
```
OpenAI GPT-4 API (for glossary + blog posts)
Anthropic Claude (backup/comparison)
Prompt templates (stored in database)
Content versioning system
Quality checks (plagiarism, factual accuracy)
```

### **3. Data Storage**
```
Supabase tables:
- glossary_terms (term, definition, category)
- blog_posts (title, content, meta, category)
- scraped_data (category-specific tables we already created)
- scrape_logs (tracking success/failures)
```

### **4. Content Management**
```
Admin dashboard for:
- Reviewing AI-generated content
- Approving/editing glossary terms
- Scheduling blog posts
- Monitoring scraper health
```

---

## 📋 **Implementation Phases**

### **Phase 1: Infrastructure Setup (Days 1-3)**

**Tasks:**
1. Create web scraper templates for each category
2. Set up Puppeteer/Cheerio configuration
3. Build rate limiting and error handling
4. Create Supabase tables for scraped data
5. Set up OpenAI API integration
6. Create prompt templates for glossary generation

---

### **Phase 2: Content Cleaning (Day 4)**

**Tasks:**
1. Audit all 8 pages for mock/demo content
2. Create list of all placeholder text
3. Identify components needing real data
4. Create migration script to clean demo content
5. Test pages after cleanup

**Files to Audit:**
- All `/app/**/page.tsx` files
- Component files with hardcoded data
- Mock data arrays

---

### **Phase 3: Data Scraping (Days 5-8)**

**Priority Order:**
1. **Day 5:** IPO data (Chittorgarh) - Already started
2. **Day 6:** Banking FD rates (BankBazaar, MoneyControl)
3. **Day 7:** Credit Cards + Loans (BankBazaar, Paisabazaar)
4. **Day 8:** Mutual Funds (AMFI CSV parsing)

**For Each Scraper:**
- Build scraper script
- Test with sample data
- Add to cron schedule
- Set up error notifications
- Verify data quality

---

### **Phase 4: AI Content Generation (Days 9-15)**

**Week 1 Focus: Glossary Terms**
- **Day 9-10:** Generate Credit Cards + Loans glossary (300 terms)
- **Day 11-12:** Generate Investing + IPO glossary (320 terms)
- **Day 13-14:** Generate Insurance + Banking + Taxes glossary (320 terms)
- **Day 15:** Generate Small Business glossary (60 terms)

**Prompting Strategy:**
```
For each term:
1. Generate clear, concise definition (50-100 words)
2. Add example usage
3. Include related terms
4. Add category tags
5. SEO-optimize for search
```

---

### **Phase 5: Info Posts Generation (Days 16-20)**

**Content Pipeline:**
1. Generate title ideas (AI)
2. Create outline (AI)
3. Write full draft (AI)
4. Human review for accuracy
5. Add images/charts
6. Optimize for SEO
7. Publish with schema markup

**Target:** 20 posts per category = 160 total posts

---

## 🔄 **Automation & Maintenance**

### **Cron Jobs Setup:**
```
Hourly: IPO data refresh (GMP changes frequently)
Daily: FD rates, mutual fund NAV
Weekly: Credit cards, loans (less volatile)
Monthly: Insurance, taxes (rarely change)
```

### **Content Updates:**
```
Quarterly: Review and update glossary terms
Monthly: Generate new info posts
Weekly: Update trending topics
```

### **Quality Monitoring:**
```
Data accuracy checks (compare multiple sources)
Content plagiarism detection
Factual verification against official sources
User feedback integration
```

---

## 📊 **Success Metrics**

### **Data Scraping:**
- **Uptime:** 95%+ for all scrapers
- **Accuracy:** 98%+ match with source
- **Freshness:** < 24 hours for most data

### **Content Generation:**
- **Glossary:** 1000+ terms published
- **Blog Posts:** 100+ articles live
- **SEO Performance:** Ranking for 500+ keywords
- **User Engagement:** 5+ min avg time on page

---

## 🚀 **Quick Start (Next Steps)**

### **Immediate Actions:**
1. Create glossary terms database schema
2. Create blog posts database schema
3. Set up OpenAI API credentials
4. Build first scraper (BankBazaar FD rates)
5. Generate first batch of glossary (Credit Cards - 50 terms)

**Estimated Time:** 2-3 hours to get first results

---

**Next Document:** Detailed scraper implementation plan for each category
