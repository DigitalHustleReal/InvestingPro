# 🔄 DATA FRESHNESS AUDIT

## 1. 🛑 THE "CHILD PROCESS" TRAP
**Status: PRODUCTION INCOMPATIBLE**
- `pipelineWorker.ts` tries to run `python lib/scraper/product_scraper.py`.
- **Vercel Runtime**: Does not support Python child processes.
- **Consequence**: Your cron job will trigger, the worker will start, and then it will crash saying `python: command not found`.

## 2. 🌫️ STALE DATA RISK
- **IPO Data**: Hardcoded in `lib/data.ts`.
- **Market Rates**: Scraper will fail.
- **Result**: Users see "Upcoming" for listed IPOs and old Interest Rates. This destroys trust.

## 3. 🛠️ ACTION PLAN (choose one)
- **Option A (Recommended)**: Rewrite scrapers in TypeScript using `cheerio` and `axios`. Run them natively in Next.js API Routes (Serverless).
- **Option B**: Deploy Python scripts to Railway.app/Render as a separate microservice.
- **Option C**: Kill scraping. Subscribe to a Data API (e.g., Yahoo Finance API via RapidAPI).

## 4. 📅 SCHEDULING GAP
- You have `api/cron/process-pipeline` configured.
- But you have **No "Update Market Data" pipeline**. It only generates content (`generate_article`).
- **Fix**: Create a `market_update` job in `pipeline_runs`.
