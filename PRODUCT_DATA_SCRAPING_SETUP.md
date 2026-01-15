# Product Data Scraping Setup

**Date:** January 23, 2026  
**Status:** ✅ System Created

---

## ✅ What's Been Created

### 1. Product Data Scraper (`lib/scraper/product-data-scraper.ts`)

**Features:**
- ✅ Credit Card scraping from BankBazaar
- ✅ Mutual Fund NAV updates from AMFI
- ✅ Automatic slug generation
- ✅ Bank name extraction
- ✅ Card type detection
- ✅ Fund category detection
- ✅ Rate limiting (1 second between requests)
- ✅ Error handling and retries
- ✅ Database upsert support

**Supported Data Sources:**
- **Credit Cards:** BankBazaar (expandable to Paisabazaar, CardExpert)
- **Mutual Funds:** AMFI NAV data (official source)

---

### 2. Background Job (`lib/jobs/product-data-scraping.ts`)

**Schedule:** Weekly (Every Wednesday at 3 AM)  
**Purpose:** Automatically update product data

**What It Does:**
1. Updates existing credit cards (50 per run)
2. Updates mutual fund NAVs from AMFI
3. Logs results and errors

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

### Credit Cards

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

### Mutual Funds

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

---

## 🎯 Next Steps

### Immediate (To Complete Scraping)

1. **Add Credit Card URLs List**
   - Create a list of BankBazaar URLs to scrape
   - Store in database or config file
   - Update job to use this list

2. **Add More Data Sources**
   - Paisabazaar for credit cards
   - Value Research for mutual fund details
   - Direct bank APIs (if available)

3. **Enhance Data Extraction**
   - Better selectors for BankBazaar
   - Extract pros/cons from reviews
   - Extract ratings from multiple sources

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
