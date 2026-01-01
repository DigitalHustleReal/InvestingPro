# 🚀 ESSENTIAL OPEN-SOURCE LIBRARIES & DATA SOURCES

## Overview
Powerful FREE tools and libraries to supercharge your InvestingPro platform with real financial data.

---

## 📊 **1. FINANCIAL DATA LIBRARIES**

### **Yahoo Finance (yahoo-finance2)** ⭐⭐⭐⭐⭐ CRITICAL
```bash
npm install yahoo-finance2
```

**What You Get:**
- ✅ Real-time stock prices (NSE, BSE, NYSE, NASDAQ)
- ✅ Historical data (daily, weekly, monthly)
- ✅ Company fundamentals (P/E, EPS, market cap)
- ✅ Mutual fund NAV data
- ✅ Options data
- ✅ Dividends & splits
- ✅ **UNLIMITED & FREE**

**Usage:**
```typescript
import yahooFinance from 'yahoo-finance2';

// Get Indian stock quote
const quote = await yahooFinance.quote('RELIANCE.NS');
console.log(`₹${quote.regularMarketPrice}`);

// Get historical data
const history = await yahooFinance.historical('TCS.NS', {
  period1: '2024-01-01',
  period2: '2025-01-01',
  interval: '1d'
});

// Get mutual fund NAV
const mutualFund = await yahooFinance.quote('0P0000XVHZ.BO'); // Example MF

// Search for stocks
const search = await yahooFinance.search('Reliance');
```

**Indian Market Symbols:**
- NSE: Add `.NS` (e.g., `RELIANCE.NS`)
- BSE: Add `.BO` (e.g., `RELIANCE.BO`)

**Priority**: ⭐⭐⭐⭐⭐ IMPLEMENT IMMEDIATELY

---

### **AMFI (Mutual Fund Data Scraper)** ⭐⭐⭐⭐⭐ CRITICAL
```bash
npm install cheerio axios
```

**What You Get:**
- ✅ All Indian mutual fund NAV data
- ✅ Daily updated NAV
- ✅ Fund house details
- ✅ Scheme codes
- ✅ **FREE & OFFICIAL DATA**

**Usage:**
```typescript
import axios from 'axios';
import * as cheerio from 'cheerio';

// Scrape AMFI NAV data
async function getAMFIData() {
  const url = 'https://www.amfiindia.com/spages/NAVAll.txt';
  const response = await axios.get(url);
  
  // Parse NAV data
  const lines = response.data.split('\n');
  const funds = lines.map(line => {
    const parts = line.split(';');
    return {
      schemeCode: parts[0],
      isinDivPayout: parts[1],
      isinDivReinvest: parts[2],
      schemeName: parts[3],
      nav: parseFloat(parts[4]),
      date: parts[5]
    };
  });
  
  return funds;
}

// Get specific fund NAV
async function getFundNAV(schemeName: string) {
  const funds = await getAMFIData();
  return funds.find(f => f.schemeName.includes(schemeName));
}
```

**Data Source**: https://www.amfiindia.com/spages/NAVAll.txt

**Priority**: ⭐⭐⭐⭐⭐ IMPLEMENT IMMEDIATELY

---

### **NSE/BSE Data Scraper** ⭐⭐⭐⭐
```bash
npm install puppeteer cheerio
```

**What You Get:**
- ✅ Live NSE/BSE stock prices
- ✅ Market depth
- ✅ Corporate actions
- ✅ Bulk deals
- ✅ **FREE (with scraping)**

**Usage:**
```typescript
import axios from 'axios';

// NSE Stock Quote
async function getNSEQuote(symbol: string) {
  const url = `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`;
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json'
    }
  });
  
  return {
    symbol: response.data.info.symbol,
    price: response.data.priceInfo.lastPrice,
    change: response.data.priceInfo.change,
    changePercent: response.data.priceInfo.pChange,
    volume: response.data.preOpenMarket.totalTradedVolume
  };
}

// BSE Stock Quote
async function getBSEQuote(scrip: string) {
  const url = `https://api.bseindia.com/BseIndiaAPI/api/StockReachGraph/w?scripcode=${scrip}&flag=0`;
  const response = await axios.get(url);
  
  return response.data;
}
```

**Priority**: ⭐⭐⭐⭐ HIGH

---

## 💳 **2. CREDIT CARD & LOAN DATA**

### **BankBazaar API (Unofficial Scraper)** ⭐⭐⭐⭐
```bash
npm install cheerio axios
```

**What You Get:**
- ✅ Credit card details
- ✅ Interest rates
- ✅ Loan products
- ✅ Comparison data

**Usage:**
```typescript
import axios from 'axios';
import * as cheerio from 'cheerio';

async function scrapeCreditCards() {
  const url = 'https://www.bankbazaar.com/credit-card.html';
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  const cards: any[] = [];
  $('.card-item').each((i, elem) => {
    cards.push({
      name: $(elem).find('.card-name').text(),
      bank: $(elem).find('.bank-name').text(),
      annualFee: $(elem).find('.annual-fee').text(),
      features: $(elem).find('.features').text()
    });
  });
  
  return cards;
}
```

**Priority**: ⭐⭐⭐ MEDIUM

---

### **RBI Data (Official)** ⭐⭐⭐⭐⭐
```bash
npm install axios
```

**What You Get:**
- ✅ Interest rates (repo, reverse repo)
- ✅ Inflation data
- ✅ Currency exchange rates
- ✅ Banking statistics
- ✅ **OFFICIAL & FREE**

**Usage:**
```typescript
// RBI Reference Rates
async function getRBIRates() {
  const url = 'https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx';
  // Scrape or use their data API
}

// Policy Rates
const policyRates = {
  repoRate: 6.50,
  reverseRepoRate: 3.35,
  bankRate: 6.75,
  CRR: 4.50,
  SLR: 18.00
};
```

**Data Source**: https://www.rbi.org.in/

**Priority**: ⭐⭐⭐⭐ HIGH

---

## 📰 **3. NEWS & MARKET DATA**

### **MoneyControl Scraper** ⭐⭐⭐⭐
```bash
npm install cheerio axios
```

**What You Get:**
- ✅ Latest market news
- ✅ Stock recommendations
- ✅ Mutual fund analysis
- ✅ Expert opinions

**Usage:**
```typescript
import axios from 'axios';
import * as cheerio from 'cheerio';

async function scrapeMoneyControlNews() {
  const url = 'https://www.moneycontrol.com/news/business/markets/';
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  const news: any[] = [];
  $('.news-item').each((i, elem) => {
    news.push({
      title: $(elem).find('h2').text(),
      summary: $(elem).find('.summary').text(),
      link: $(elem).find('a').attr('href'),
      time: $(elem).find('.time').text()
    });
  });
  
  return news;
}
```

**Priority**: ⭐⭐⭐⭐ HIGH

---

### **Economic Times Scraper** ⭐⭐⭐⭐
```bash
npm install cheerio axios
```

**What You Get:**
- ✅ Business news
- ✅ Market analysis
- ✅ IPO updates
- ✅ Expert columns

**Priority**: ⭐⭐⭐⭐ HIGH

---

## 🔧 **4. UTILITY LIBRARIES**

### **Cheerio (Web Scraping)** ⭐⭐⭐⭐⭐
```bash
npm install cheerio
```

**What It Does:**
- ✅ Parse HTML (jQuery-like)
- ✅ Extract data from websites
- ✅ Fast & lightweight

**Priority**: ⭐⭐⭐⭐⭐ CRITICAL

---

### **Puppeteer (Browser Automation)** ⭐⭐⭐⭐
```bash
npm install puppeteer
```

**What It Does:**
- ✅ Scrape JavaScript-heavy sites
- ✅ Take screenshots
- ✅ Generate PDFs
- ✅ Automated testing

**Usage:**
```typescript
import puppeteer from 'puppeteer';

async function scrapeWithPuppeteer(url: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  
  const data = await page.evaluate(() => {
    return document.querySelector('.price')?.textContent;
  });
  
  await browser.close();
  return data;
}
```

**Priority**: ⭐⭐⭐⭐ HIGH

---

### **Axios (HTTP Client)** ⭐⭐⭐⭐⭐
```bash
npm install axios
```

**What It Does:**
- ✅ Make HTTP requests
- ✅ Handle responses
- ✅ Error handling

**Priority**: ⭐⭐⭐⭐⭐ CRITICAL

---

## 📊 **5. DATA PROCESSING**

### **Papa Parse (CSV Parser)** ⭐⭐⭐⭐
```bash
npm install papaparse
```

**What It Does:**
- ✅ Parse CSV files
- ✅ Convert to JSON
- ✅ Handle large files

**Usage:**
```typescript
import Papa from 'papaparse';

// Parse AMFI CSV data
Papa.parse(csvData, {
  header: true,
  complete: (results) => {
    console.log(results.data);
  }
});
```

**Priority**: ⭐⭐⭐⭐ HIGH

---

### **date-fns (Date Utilities)** ⭐⭐⭐⭐⭐
```bash
npm install date-fns
```

**What It Does:**
- ✅ Format dates
- ✅ Calculate date differences
- ✅ Lightweight (vs moment.js)

**Priority**: ⭐⭐⭐⭐⭐ CRITICAL

---

## 🎨 **6. VISUALIZATION**

### **Recharts** ⭐⭐⭐⭐
```bash
npm install recharts
```

**What It Does:**
- ✅ React charts (alternative to Chart.js)
- ✅ Composable charts
- ✅ Responsive

**Priority**: ⭐⭐⭐ MEDIUM (Alternative)

---

### **D3.js** ⭐⭐⭐⭐
```bash
npm install d3
```

**What It Does:**
- ✅ Advanced visualizations
- ✅ Custom charts
- ✅ Data-driven documents

**Priority**: ⭐⭐⭐ MEDIUM (Advanced)

---

## 🔐 **7. SECURITY & VALIDATION**

### **Zod (Schema Validation)** ⭐⭐⭐⭐⭐
```bash
npm install zod
```

**What It Does:**
- ✅ Validate API responses
- ✅ Type-safe schemas
- ✅ Error handling

**Usage:**
```typescript
import { z } from 'zod';

const StockQuoteSchema = z.object({
  symbol: z.string(),
  price: z.number(),
  change: z.number(),
  volume: z.number()
});

// Validate API response
const quote = StockQuoteSchema.parse(apiResponse);
```

**Priority**: ⭐⭐⭐⭐⭐ CRITICAL

---

## 📋 **IMPLEMENTATION PRIORITY**

### **Week 1: Critical Data Sources**
```bash
# 1. Yahoo Finance (Stock data)
npm install yahoo-finance2

# 2. AMFI Scraper (Mutual funds)
npm install cheerio axios

# 3. Zod (Validation)
npm install zod
```

### **Week 2: Enhanced Data**
```bash
# 4. NSE/BSE Scraper
npm install puppeteer

# 5. News Scraper
# (Use cheerio + axios)

# 6. Date utilities
npm install date-fns
```

### **Week 3: Additional Features**
```bash
# 7. CSV Parser
npm install papaparse

# 8. Advanced charts
npm install recharts
```

---

## 🎯 **COMPLETE SETUP SCRIPT**

```bash
# Install all essential libraries
npm install yahoo-finance2 \
  cheerio \
  axios \
  zod \
  date-fns \
  papaparse \
  puppeteer

# Optional (advanced)
npm install recharts d3
```

---

## 💡 **DATA SOURCES SUMMARY**

### **Stock Market:**
- ✅ Yahoo Finance API (yahoo-finance2)
- ✅ NSE India (scraping)
- ✅ BSE India (scraping)
- ✅ Alpha Vantage (API)

### **Mutual Funds:**
- ✅ AMFI (official NAV data)
- ✅ Yahoo Finance (some funds)
- ✅ MoneyControl (scraping)

### **Credit Cards & Loans:**
- ✅ BankBazaar (scraping)
- ✅ PolicyBazaar (scraping)
- ✅ Bank websites (scraping)

### **Economic Data:**
- ✅ RBI (official data)
- ✅ Ministry of Finance
- ✅ SEBI

### **News:**
- ✅ MoneyControl
- ✅ Economic Times
- ✅ Business Standard
- ✅ NewsAPI (API)

---

## 🚀 **QUICK START EXAMPLE**

```typescript
import yahooFinance from 'yahoo-finance2';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { z } from 'zod';

// 1. Get stock quote
const stock = await yahooFinance.quote('RELIANCE.NS');

// 2. Get mutual fund NAV
const amfiData = await axios.get('https://www.amfiindia.com/spages/NAVAll.txt');
const funds = parseAMFIData(amfiData.data);

// 3. Scrape news
const newsResponse = await axios.get('https://www.moneycontrol.com/news/');
const $ = cheerio.load(newsResponse.data);
const news = $('.news-item').map((i, el) => ({
  title: $(el).find('h2').text(),
  link: $(el).find('a').attr('href')
})).get();

// 4. Validate data
const StockSchema = z.object({
  regularMarketPrice: z.number(),
  symbol: z.string()
});

const validatedStock = StockSchema.parse(stock);
```

---

## 🎊 **CONCLUSION**

**Essential Libraries for InvestingPro:**

### **Must Have (Week 1):**
1. ✅ yahoo-finance2 (Stock data)
2. ✅ cheerio + axios (Scraping)
3. ✅ zod (Validation)
4. ✅ date-fns (Dates)

### **Should Have (Week 2):**
5. ✅ puppeteer (Advanced scraping)
6. ✅ papaparse (CSV parsing)

### **Nice to Have (Week 3):**
7. ✅ recharts (Alternative charts)
8. ✅ d3 (Advanced viz)

**Total Cost**: **$0** (all open source!)

---

**Last Updated**: January 1, 2026 at 09:10 AM  
**Libraries**: 10+ essential tools  
**Cost**: $0 (all FREE & open source)  
**Data Sources**: Stock, MF, Credit Cards, Loans, News  
**Priority**: Start with yahoo-finance2 + AMFI scraper
