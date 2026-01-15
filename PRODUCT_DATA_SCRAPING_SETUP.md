# Product Data Scraping Setup

**Date:** January 23, 2026  
**Status:** ✅ System Created

---

## ✅ What's Been Created

### 1. Product Data Scraper (`lib/scraper/product-data-scraper.ts`)

**Features:**
- ✅ Credit Card scraping from BankBazaar
- ✅ Mutual Fund NAV updates from AMFI
- ✅ Insurance scraping from Policybazaar
- ✅ Loan scraping from BankBazaar
- ✅ Automatic slug generation
- ✅ Provider name extraction
- ✅ Product type detection (card type, insurance type, loan type, fund category)
- ✅ Rate limiting (1 second between requests)
- ✅ Error handling and retries
- ✅ Database upsert support

**Supported Data Sources:**
- **Credit Cards:** BankBazaar (expandable to Paisabazaar, CardExpert)
- **Mutual Funds:** AMFI NAV data (official source)
- **Insurance:** Policybazaar, BankBazaar (expandable)
- **Loans:** BankBazaar, Paisabazaar (expandable)

---

### 2. Background Job (`lib/jobs/product-data-scraping.ts`)

**Schedule:** Weekly (Every Wednesday at 3 AM)  
**Purpose:** Automatically update product data for all categories

**What It Does:**
1. **Primary Categories:**
   - Updates existing credit cards (50 per run)
   - Updates mutual fund NAVs from AMFI
2. **Secondary Categories:**
   - Updates insurance products (30 per run)
   - Updates loans (30 per run)
3. Logs results and errors for all categories

---

## 🚀 How to Use

### Manual Scraping

```typescript
import { productDataScraper } from '@/lib/scraper/product-data-scraper';

// Scrape a single credit card
const cardData = await productDataScraper.scrapeCreditCardFromBankBazaar(
    'https://www.bankbazaar.com/credit-card/hdfc-regalia.html'
);
if (cardData) {
    await productDataScraper.saveCreditCard(cardData);
}

// Update mutual fund NAVs
const results = await productDataScraper.updateMutualFundNAVs([123456, 789012]);
console.log(`Updated: ${results.updated}, Failed: ${results.failed}`);
```

### Automatic Scraping

The job runs automatically every Wednesday at 3 AM. No action needed.

---

## 📋 Data Sources

### Credit Cards (Primary)

**Primary Source:** BankBazaar
- URL Pattern: `https://www.bankbazaar.com/credit-card/[card-name].html`
- Data Extracted:
  - Name, Bank, Type
  - Annual Fee, Joining Fee
  - Min Income, Interest Rate
  - Rewards, Features
  - Image URL, Apply Link

**Future Sources (To Add):**
- Paisabazaar
- CardExpert
- Direct bank websites

### Mutual Funds (Primary)

**Primary Source:** AMFI (Association of Mutual Funds in India)
- URL: `https://portal.amfiindia.com/spages/NAVAll.txt`
- Data Extracted:
  - NAV (Net Asset Value)
  - Scheme Code
  - Fund Name
  - Last Updated Date

**Future Sources (To Add):**
- Value Research (for returns, ratings)
- Moneycontrol (for AUM, expense ratio)

### Insurance (Secondary)

**Primary Source:** Policybazaar, BankBazaar
- URL Pattern: `https://www.policybazaar.com/[insurance-type]/[policy-name].html`
- Data Extracted:
  - Name, Provider, Type (Term/Health/Motor)
  - Coverage Amount (Min/Max)
  - Premium (Monthly/Yearly)
  - Features, Claim Settlement Ratio
  - Cashless Hospitals, Waiting Period
  - Image URL, Apply Link

**Future Sources (To Add):**
- Paisabazaar
- Direct insurer websites

### Loans (Secondary)

**Primary Source:** BankBazaar, Paisabazaar
- URL Pattern: `https://www.bankbazaar.com/[loan-type]/[loan-name].html`
- Data Extracted:
  - Name, Provider, Type (Personal/Home/Car/Education)
  - Interest Rate (Min/Max, Fixed/Floating)
  - Processing Fee, Prepayment Charges
  - Max Tenure, Max Amount
  - Min Age, Description
  - Image URL, Apply Link

**Future Sources (To Add):**
- RBI data (for interest rates)
- Direct bank websites

---

## 🔧 Configuration

### Rate Limiting

- **Between Requests:** 1 second delay
- **Retries:** 3 attempts with exponential backoff
- **Timeout:** 10 seconds per request

### Batch Size

- **Credit Cards:** 50 cards per run (configurable)
- **Mutual Funds:** All funds with scheme codes

---

## 📊 Database Schema

### Credit Cards Table

```sql
credit_cards (
    slug TEXT UNIQUE,
    name TEXT,
    bank TEXT,
    type TEXT, -- Cashback, Rewards, Travel, etc.
    annual_fee TEXT,
    joining_fee TEXT,
    min_income TEXT,
    interest_rate TEXT,
    rewards TEXT[],
    pros TEXT[],
    cons TEXT[],
    image_url TEXT,
    apply_link TEXT,
    description TEXT,
    updated_at TIMESTAMPTZ
)
```

### Mutual Funds Table

```sql
mutual_funds (
    slug TEXT UNIQUE,
    name TEXT,
    fund_house TEXT,
    scheme_code INTEGER,
    category TEXT, -- Large Cap, Mid Cap, etc.
    nav NUMERIC,
    aum TEXT,
    expense_ratio NUMERIC,
    returns_1y NUMERIC,
    returns_3y NUMERIC,
    returns_5y NUMERIC,
    risk TEXT,
    min_investment TEXT,
    updated_at TIMESTAMPTZ
)
```

### Insurance (Uses affiliate_products table)

```sql
affiliate_products (
    name TEXT,
    company TEXT, -- Provider name
    type TEXT, -- 'insurance'
    description TEXT,
    features TEXT[],
    pricing JSONB, -- { monthly, yearly, coverage_min, coverage_max }
    image_url TEXT,
    affiliate_link TEXT,
    status TEXT,
    updated_at TIMESTAMPTZ
)
```

### Loans (Uses products + personal_loans tables)

```sql
products (
    slug TEXT UNIQUE,
    name TEXT,
    product_type TEXT, -- 'personal_loan'
    provider TEXT,
    is_active BOOLEAN,
    last_updated_at TIMESTAMPTZ
)

personal_loans (
    product_id UUID REFERENCES products(id),
    interest_rate_min DECIMAL(5,2),
    interest_rate_max DECIMAL(5,2),
    processing_fee_value DECIMAL(10,2),
    updated_at TIMESTAMPTZ
)
```

---

## 🎯 Next Steps

### Immediate (To Complete Scraping)

1. **Add Product URLs Lists**
   - Create lists of URLs to scrape for each category:
     - Credit Cards (BankBazaar URLs)
     - Insurance (Policybazaar URLs)
     - Loans (BankBazaar/Paisabazaar URLs)
   - Store in database or config file
   - Update job to use these lists

2. **Add More Data Sources**
   - Paisabazaar for credit cards and loans
   - Value Research for mutual fund details
   - Direct bank/insurer APIs (if available)

3. **Enhance Data Extraction**
   - Better selectors for all sources
   - Extract pros/cons from reviews
   - Extract ratings from multiple sources
   - Add more insurance providers
   - Add more loan types (home, car, education)

### Future Enhancements

1. **Real-time Updates**
   - Webhook support for instant updates
   - API integrations where available

2. **Data Validation**
   - Compare data from multiple sources
   - Flag discrepancies
   - Manual review queue for changes

3. **Analytics**
   - Track scraping success rates
   - Monitor data freshness
   - Alert on stale data

---

## ⚠️ Important Notes

### Legal & Ethical

- ✅ Respects robots.txt
- ✅ Rate limiting to avoid overload
- ✅ Uses official AMFI data (public)
- ✅ Proper User-Agent identification

### Error Handling

- All errors are logged
- Failed scrapes don't stop the job
- Retries with exponential backoff
- Database errors are caught and logged

### Performance

- Batch processing (50 cards per run)
- Rate limiting prevents IP bans
- Timeout protection (10s per request)
- Efficient database upserts

---

## 📝 Example Usage

### Scrape Credit Cards from URLs

```typescript
const urls = [
    'https://www.bankbazaar.com/credit-card/hdfc-regalia.html',
    'https://www.bankbazaar.com/credit-card/sbi-cashback.html',
    // ... more URLs
];

const results = await productDataScraper.scrapeCreditCards(urls);
console.log(`Success: ${results.success}, Failed: ${results.failed}`);
```

### Update All Mutual Fund NAVs

```typescript
const results = await productDataScraper.updateMutualFundNAVs();
console.log(`Updated: ${results.updated}, Failed: ${results.failed}`);
```

### Scrape Insurance from URLs

```typescript
const urls = [
    'https://www.policybazaar.com/term-insurance/hdfc-life.html',
    'https://www.policybazaar.com/health-insurance/star-health.html',
    // ... more URLs
];

const results = await productDataScraper.scrapeInsurance(urls);
console.log(`Success: ${results.success}, Failed: ${results.failed}`);
```

### Scrape Loans from URLs

```typescript
const urls = [
    'https://www.bankbazaar.com/personal-loan/hdfc-personal-loan.html',
    'https://www.bankbazaar.com/home-loan/sbi-home-loan.html',
    // ... more URLs
];

const results = await productDataScraper.scrapeLoans(urls);
console.log(`Success: ${results.success}, Failed: ${results.failed}`);
```

---

## ✅ Status

- ✅ Scraper created
- ✅ Background job created
- ✅ Database integration complete
- ✅ Error handling implemented
- ⏳ URL list needed (for credit cards)
- ⏳ Additional data sources (future)

---

*Last Updated: January 23, 2026*  
*Status: Ready for URL list and testing*
