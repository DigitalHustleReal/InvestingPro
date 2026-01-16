# Data Automation Setup Guide

## Overview
Automated data collection and update system for product data (Credit Cards, Mutual Funds, Loans, Insurance).

**Status:** Infrastructure Complete ⚠️ Scraping Implementation Pending

---

## ✅ What's Built

### 1. Data Validator ✅
- **File:** `lib/automation/data-validator.ts`
- Validates credit card and mutual fund data
- Calculates data quality scores (0-100)
- Checks required fields, formats, ranges

### 2. Data Pipeline (ETL) ✅
- **File:** `lib/automation/data-pipeline.ts`
- Normalizes scraped data
- Detects duplicates (by slug, name+bank, scheme_code)
- Inserts new or updates existing products
- Quality scoring

### 3. Scrapers Framework ✅
- **Credit Cards:** `scripts/scrapers/credit-card-scraper.ts`
- **Mutual Funds:** `scripts/scrapers/mutual-fund-scraper.ts` (AMFI working)
- Ready for implementation with Playwright/Cheerio

### 4. Weekly Cron Job ✅
- **File:** `app/api/cron/weekly-data-update/route.ts`
- Runs weekly (Monday 2 AM)
- Processes all product categories
- Sends notifications on completion

---

## ⚠️ What Needs Implementation

### Scraping Logic (Currently Placeholders)

The scrapers are structured but need actual scraping implementation:

1. **Credit Card Scrapers:**
   - HDFC Bank (requires Playwright - JavaScript-heavy)
   - SBI Card (requires Playwright)
   - ICICI Bank (requires Playwright)
   - Axis Bank (requires Playwright)
   - BankBazaar (can use Cheerio - static HTML)

2. **Mutual Fund Scrapers:**
   - ✅ AMFI (working - official source)
   - ⚠️ Value Research (needs implementation)
   - ⚠️ Moneycontrol (needs implementation)

---

## 🛠️ Implementation Steps

### Step 1: Install Dependencies (If Needed)

```bash
# Playwright (for JavaScript-heavy sites)
npm install playwright

# Cheerio (already installed - for static HTML)
# npm install cheerio
```

### Step 2: Implement BankBazaar Scraper (Easiest - Static HTML)

BankBazaar has structured HTML, can use Cheerio:

```typescript
import * as cheerio from 'cheerio';

async function scrapeBankBazaar(): Promise<ScrapedCreditCard[]> {
    const response = await axios.get('https://www.bankbazaar.com/credit-card.html');
    const $ = cheerio.load(response.data);
    
    const cards: ScrapedCreditCard[] = [];
    
    // Parse HTML structure (adjust selectors based on actual HTML)
    $('.credit-card-item').each((i, elem) => {
        const card: ScrapedCreditCard = {
            name: $(elem).find('.card-name').text().trim(),
            bank: $(elem).find('.bank-name').text().trim(),
            type: determineType($(elem).find('.card-type').text()),
            // ... extract other fields
        };
        cards.push(card);
    });
    
    return cards;
}
```

### Step 3: Implement Bank Websites (Requires Playwright)

For JavaScript-heavy sites like HDFC, SBI:

```typescript
import { chromium } from 'playwright';

async function scrapeHDFC(): Promise<ScrapedCreditCard[]> {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto('https://www.hdfcbank.com/personal/pay/cards/credit-cards');
    
    // Wait for content to load
    await page.waitForSelector('.credit-card-list');
    
    // Extract data
    const cards = await page.evaluate(() => {
        // JavaScript code to extract card data
        // ...
    });
    
    await browser.close();
    return cards;
}
```

### Step 4: Test Scrapers

```bash
# Test individual scraper
tsx scripts/scrapers/credit-card-scraper.ts

# Test mutual fund scraper
tsx scripts/scrapers/mutual-fund-scraper.ts

# Test full pipeline
tsx scripts/test-data-pipeline.ts
```

### Step 5: Configure Cron Job

Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/weekly-data-update",
    "schedule": "0 2 * * 1"
  }]
}
```

---

## 📋 Data Sources & Complexity

| Source | Type | Method | Status |
|--------|------|--------|--------|
| AMFI | Official API | Text file | ✅ Working |
| BankBazaar | Static HTML | Cheerio | ⚠️ Needs implementation |
| Paisabazaar | Static HTML | Cheerio | ⚠️ Needs implementation |
| HDFC Bank | JavaScript-heavy | Playwright | ⚠️ Needs implementation |
| SBI Card | JavaScript-heavy | Playwright | ⚠️ Needs implementation |
| ICICI Bank | JavaScript-heavy | Playwright | ⚠️ Needs implementation |
| Axis Bank | JavaScript-heavy | Playwright | ⚠️ Needs implementation |

---

## 🔧 Testing & Monitoring

### Manual Test

```bash
# Trigger data update manually
curl -X GET http://localhost:3000/api/cron/weekly-data-update \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Check Results

- **Database:** Query `credit_cards` and `mutual_funds` tables
- **Logs:** Check server logs for scraping progress
- **Notifications:** Check Telegram/WhatsApp for completion status

### Environment Variables

```bash
# Optional: Get notifications on data updates
DATA_UPDATE_NOTIFICATION_ENABLED=true
DATA_UPDATE_TELEGRAM_CHATS=-123456789
DATA_UPDATE_WHATSAPP_NUMBERS=+911234567890

# Cron security
CRON_SECRET=your-random-secret-here
```

---

## 📊 Current Status

### ✅ Completed
- Data validation infrastructure
- ETL pipeline (normalize, dedupe, load)
- Weekly cron job framework
- AMFI mutual fund scraper (official source)
- Scraper structure for all sources

### ⚠️ In Progress
- Bank website scraping (HDFC, SBI, ICICI, Axis)
- Aggregator scraping (BankBazaar, Paisabazaar)
- Data enrichment (additional fields)

### 📝 Next Steps
1. Implement BankBazaar scraper (Cheerio - easiest)
2. Implement Paisabazaar scraper (Cheerio)
3. Implement bank websites (Playwright - more complex)
4. Add data change tracking
5. Add quality alerts

---

## 🎯 Success Metrics

When complete, the system will:
- ✅ Scrape 2000+ products weekly
- ✅ Update existing products automatically
- ✅ Detect and handle duplicates
- ✅ Validate data quality
- ✅ Send alerts on failures
- ✅ Track data changes

---

**Last Updated:** January 23, 2026  
**Status:** Infrastructure ✅ Complete | Scraping ⚠️ Needs Implementation
