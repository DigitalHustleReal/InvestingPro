# Scraper System Documentation

## Overview

Complete automated scraping system for real-time financial data updates. All demo/mock data has been removed and replaced with live data scraping.

## Components

### 1. Product Scraper (`lib/scraper/product_scraper.py`)
- Scrapes credit cards from BankBazaar
- Scrapes mutual funds from AMFI
- Scrapes loan rates from bank websites
- Updates `products` table in Supabase
- Updates type-specific tables (`credit_cards`, `mutual_funds`, `personal_loans`)

### 2. Review Processor (`lib/scraper/review_processor.py`)
- Scrapes reviews from Trustpilot, Reddit, MouthShut
- Analyzes sentiment using OpenAI
- Categorizes reviews (fees, rewards, service, approval)
- Extracts pros/cons
- Calculates aggregate scores
- Updates `reviews` table in Supabase
- Updates product metadata with review stats

### 3. Rate Scraper (`lib/scraper/rate_scraper.py`)
- Scrapes FD rates from bank websites
- Scrapes loan rates (personal, home, car, education)
- Scrapes savings account rates
- Scrapes inflation data from RBI
- Updates `live_rates` and `inflation_data` tables

### 4. Master Worker (`lib/scraper/master_worker.py`)
- Orchestrates all scraping tasks
- Runs products → reviews → rates in sequence
- Provides comprehensive logging
- Returns success/failure status

## Cron Jobs (Vercel)

Configured in `vercel.json`:

1. **Scrape Products**: Daily at 2:00 AM IST
   - Endpoint: `/api/cron/scrape-products`
   - Updates all product data

2. **Scrape Reviews**: Daily at 3:00 AM IST
   - Endpoint: `/api/cron/scrape-reviews`
   - Processes reviews and calculates scores

3. **Scrape Rates**: Daily at 8:00 PM IST
   - Endpoint: `/api/cron/scrape-rates`
   - Updates financial rates

4. **Master Worker**: Daily at 1:00 AM IST (optional)
   - Endpoint: `/api/cron/run-worker`
   - Runs all tasks in sequence

## Setup

### 1. Environment Variables

Add to `.env.local` and Vercel:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (for review sentiment analysis)
OPENAI_API_KEY=your_openai_key

# Cron Secret (for Vercel cron authentication)
CRON_SECRET=your_random_secret
```

### 2. Python Dependencies

Install Python dependencies:

```bash
cd lib/scraper
pip install -r requirements.txt
```

### 3. Vercel Configuration

The cron jobs are already configured in `vercel.json`. Make sure:
- Python runtime is available (Vercel supports Python)
- Or use Node.js to call Python scripts (current implementation)

## Manual Execution

### Run Individual Scrapers

```bash
# Products
python3 lib/scraper/product_scraper.py

# Reviews
python3 lib/scraper/review_processor.py

# Rates
python3 lib/scraper/rate_scraper.py
```

### Run Master Worker

```bash
python3 lib/scraper/master_worker.py
```

## Data Flow

```
1. Product Scraper
   └─> Scrapes bank websites
   └─> Updates products table
   └─> Updates credit_cards/mutual_funds/personal_loans tables

2. Review Processor
   └─> Scrapes reviews from multiple sources
   └─> Analyzes sentiment (OpenAI)
   └─> Categorizes and scores
   └─> Updates reviews table
   └─> Updates product metadata with scores

3. Rate Scraper
   └─> Scrapes FD/loan/savings rates
   └─> Scrapes inflation data
   └─> Updates live_rates table
   └─> Updates inflation_data table
```

## API Integration

The scrapers update Supabase directly. Your Next.js API (`lib/api.ts`) should read from Supabase instead of mock data:

```typescript
// Before (mock data)
import { CREDIT_CARDS } from '@/lib/data';

// After (Supabase)
const { data } = await supabase
  .from('products')
  .select('*, credit_cards(*)')
  .eq('product_type', 'credit_card')
  .eq('is_active', true);
```

## Monitoring

### Check Cron Job Status

1. Go to Vercel Dashboard → Your Project → Cron Jobs
2. View execution logs and status

### Check Database Updates

```sql
-- Check last product update
SELECT name, last_updated_at FROM products ORDER BY last_updated_at DESC LIMIT 10;

-- Check review counts
SELECT product_id, COUNT(*) as review_count 
FROM reviews 
WHERE status = 'approved'
GROUP BY product_id;

-- Check latest rates
SELECT provider, rate_value, scraped_at 
FROM live_rates 
ORDER BY scraped_at DESC 
LIMIT 10;
```

## Troubleshooting

### Scrapers Not Running

1. Check Vercel cron logs
2. Verify `CRON_SECRET` matches in Vercel env vars
3. Check Python dependencies are installed
4. Verify Supabase credentials

### No Data Scraped

1. Check if websites are accessible
2. Verify HTML structure hasn't changed (scrapers may need updates)
3. Check rate limiting (some sites block frequent requests)
4. Review error logs in Supabase

### Review Analysis Failing

1. Verify OpenAI API key is set
2. Check API quota/limits
3. Review sentiment analyzer logs

## Next Steps

1. **Add More Sources**: Extend scrapers to cover more banks/products
2. **Improve Parsing**: Add more robust HTML parsing for different bank sites
3. **Add Caching**: Cache scraped data to reduce API calls
4. **Add Alerts**: Set up alerts for scraping failures
5. **Add Analytics**: Track scraping success rates and data quality

## Notes

- All demo/mock data has been removed
- Scrapers use real-time data from bank websites
- Rate limiting is implemented to avoid blocking
- Error handling ensures partial failures don't stop the pipeline
- All data is saved to Supabase with provenance tracking

