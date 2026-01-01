# ⭐ REVIEW & RATING AUDIT

## 1. 🏗️ INGESTION STATUS
**Status: Standalone Python Script (Disconnected)**
- You have a Python script `lib/scraper/review_scraper.py` that scrapes Reddit, Trustpilot, and MouthShut.
- **Problem**: This script writes to a local JSON file (`reviews_hdfc_regalia.json`). It does **NOT** write to Supabase.
- **Frontend**: The Frontend reads from Supabase `reviews` table, which is empty.

## 2. 🗄️ DATABASE GAP
**Schema Mismatch**
- `reviews` table assumes user-generated content (`user_id`, `verified_purchase`).
- It lacks:
    - `source` (e.g., "Trustpilot")
    - `external_id` (to prevent duplicates)
    - `sentiment_score` (if analyzing Reddit text)

## 3. ⚖️ COMPLIANCE RISK
**High Risk**
- Storing full review text from Trustpilot/MouthShut violates their Terms of Service (Copyright).
- **Safe Approach**:
    1.  Scrape Text.
    2.  Use AI to **Synthesize** a summary ("Users generally complain about high fees...").
    3.  Store only the **Summary** + **Aggregate Rating**.
    4.  Discard the raw text.

## 4. 🛠️ ACTION PLAN
1.  **Modify Schema**: Add `source`, `external_url` to `reviews` table.
2.  **Connect Pipeline**: Update `review_scraper.py` to write to Supabase using `supabase-py`.
3.  **AI Summarization**: Add an LLM step in the scraper to generate summaries instead of storing raw text.
