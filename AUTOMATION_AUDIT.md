# 🤖 AUTOMATION & PIPELINE AUDIT

## 1. 🏭 CONTENT FACTORY STATUS
**Status: READY (Local) / RISKY (Production)**
You have a fully functional "Content Factory" pipeline.

| Pipeline | Trigger | Action | Status |
| :--- | :--- | :--- | :--- |
| **generate_article** | Database Queue | Writes Article (Draft) | ✅ Ready |
| **scrape_and_generate** | Database Queue | Trends -> Keyword -> Article | ✅ Ready |
| **scraper_credit_cards** | Database Queue | Executes `python script` | ⚠️ Deployment Risk |

## 2. ⚠️ DEPLOYMENT RISK (Python)
- **Issue**: `pipelineWorker.ts` uses `child_process.exec('python ...')`.
- **Environment**: Vercel/Next.js environments do not have Python installed by default in the runtime image.
- **Consequence**: Your Scrapers will fail in production with `command not found: python`.
- **Fix**: You must deploy scrapers as:
    1.  Vercel Python Serverless Functions (`api/python/...`).
    2.  Or a separate backend (Railway/VPS).
    3.  Or use Node.js scrapers (`cheerio`) instead of Python.

## 3. 🛡️ SAFETY CHECKS
- **Auto-Publish**: ❌ Disabled. All content goes to `pending`. **(SAFE)**.
- **Category Enforcement**: ✅ Pipeline manually maps keywords to allowed categories to prevent DB errors.
- **Error Handling**: ✅ Robust try/catch blocks that update `pipeline_runs` status.

## 4. 🛠️ ACTION PLAN
1.  **Refactor Scrapers**: If possible, port `product_scraper.py` to Node.js (`cheerio`/`puppeteer`) to keep the stack unified and Vercel-compatible.
2.  **Enable Cron**: Ensure Vercel Cron is configured to hit `GET /api/cron/process-pipeline` every 10 minutes.
