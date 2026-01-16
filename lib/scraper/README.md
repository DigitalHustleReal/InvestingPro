# Data Automation & Scraping Strategy

## Overview
Automated data collection pipeline for financial products (Credit Cards, Loans, Insurance, Mutual Funds).

## Data Sources

### Credit Cards
1. **Bank Websites**
   - HDFC Bank: https://www.hdfcbank.com/personal/pay/cards/credit-cards
   - SBI Card: https://www.sbicard.com/
   - ICICI Bank: https://www.icicibank.com/credit-card
   - Axis Bank: https://www.axisbank.com/retail/cards/credit-card

2. **Aggregators**
   - BankBazaar: https://www.bankbazaar.com/credit-card.html
   - Paisabazaar: https://www.paisabazaar.com/credit-card/
   - CardExpert: https://www.cardexpert.in/

### Loans
1. **Bank Websites** (Interest Rates)
2. **RBI Data**: https://www.rbi.org.in/
3. **Aggregators**: BankBazaar, Paisabazaar

### Reviews & Ratings
1. **Google Reviews**: Bank-specific
2. **Trustpilot**: https://www.trustpilot.com/
3. **MouthShut**: https://www.mouthshut.com/
4. **Reddit**: r/IndiaInvestments, r/CreditCardsIndia

## Implementation Approach

### Phase 1: Manual Curation ✅ Complete
- Manually curated data in `lib/data.ts`
- Updated monthly by team

### Phase 2: Semi-Automated ✅ **IN PROGRESS**
- ✅ Scrapers built (credit cards, mutual funds)
- ✅ Data pipeline (ETL, validation, cleaning)
- ✅ Weekly cron job configured
- ⚠️ Scraping implementation (requires Playwright/Puppeteer for JavaScript-heavy sites)
- ⚠️ AMFI scraper working (mutual funds from official source)
- Store in Supabase PostgreSQL
- Cron job to update weekly

### Phase 3: Fully Automated (Future)
- Real-time API integrations where available
- ML-based review sentiment analysis
- Auto-ranking algorithm

## Tech Stack for Automation

### Scraping
- **Puppeteer** (Node.js) or **Playwright**: For JavaScript-heavy sites
- **Cheerio**: For static HTML parsing
- **Python + BeautifulSoup**: Alternative for complex scraping

### Data Storage
- **Supabase (PostgreSQL)**: Primary database
- **Redis**: Caching layer for frequently accessed data

### Scheduling
- **Vercel Cron Jobs**: For serverless functions
- **GitHub Actions**: For scheduled Python scripts

### Review Analysis
- **OpenAI API**: Sentiment analysis of reviews
- **Custom ML Model**: Product ranking algorithm

## Legal Considerations
- Respect robots.txt
- Rate limiting (max 1 req/sec per domain)
- Use official APIs where available
- Attribute data sources properly
