# Cursor Pro Execution Plan (Project Handover)

## 📌 Context
We have successfully populated the `credit_cards` database table with **60 real credit cards** scraped from Finology (HDFC, SBI, Axis, etc.).
The scrape was done using `scripts/scrape-finology.ts` and imported via `scripts/import_finology_json.ts`.

**Current State:**
- **Database**: `credit_cards` table has 60 rows.
- **Detail Page**: `app/credit-cards/[slug]/page.tsx` is REFACTORED to use the new `credit_cards` table.
- **Listing Page**: `app/credit-cards/page.tsx` is **NOT** connected to the new table yet (it uses the legacy `products` table via `api.entities.CreditCard.list()`).
- **Comparison Tool**: `app/credit-cards/compare/page.tsx` is **NOT** connected.

## 🎯 Objective
Your goal is to connect the remaining frontend pages to the new `credit_cards` data source and ensure a seamless UI.

---

## 🛠️ Task 1: Connect Listing Page
**File:** `lib/api.ts` (and indirectly `app/credit-cards/page.tsx`)

The listing page fetches data via `api.entities.CreditCard.list()`. This function currently queries the `products` table.
1.  **Refactor `lib/api.ts`**:
    - Update `CreditCard.list()` to query the `credit_cards` table.
    - Map the response fields to the `Product` or `RichProduct` interface expected by the UI.
    - **Schema Mapping**:
        - `id` -> `id`
        - `name` -> `name`
        - `slug` -> `slug`
        - `provider` -> `bank` (IMPORTANT: DB column is `bank`)
        - `rating` -> `rating`
        - `image_url` -> `image_url`
        - `features` -> Map `pros` (array) to features object or Key Highlights.
        - `description` -> `description` (Note: many are NULL currently, see Task 3).
        - `annual_fee` (numeric) -> Map to metadata or features.

2.  **Verify Grid View**:
    - Check that cards render correctly in `app/credit-cards/page.tsx`.
    - Ensure duplicate cards from the old `products` table are not mixed in.

---

## 🛠️ Task 2: Update Comparison Tool
**File:** `app/credit-cards/compare/page.tsx`

The comparison tool allows adding cards to a side-by-side view.
1.  **Update Data Fetching**:
    - Ensure the search/autocomplete in the comparison tool searches the `credit_cards` table.
    - Ensure `getProductBySlug` (if used by comparison) returns data from `credit_cards`.
2.  **Harmonize Types**:
    - The comparison table expects specific fields (`joiningFee`, `rewardRate`, `loungeAccess`).
    - You may need to create a helper to transform the `credit_cards` row into the comparison format.

---

## 🛠️ Task 3: API Keys & AI Descriptions
**Blocker**: The descriptions are currently empty because `OPENAI_API_KEY` was missing/invalid during the run.

1.  **Fix Environment**: Add valid `OPENAI_API_KEY` or `GROQ_API_KEY` to `.env.local`.
2.  **Run Generator**:
    ```bash
    npx tsx scripts/generate-cards-with-quality.ts
    ```
    - This will fill the `description` column for all 60 cards.

---

## 🛠️ Task 4: Lint Cleanup
There are several unused variable warnings in the codebase.
- **Files**:
    - `app/credit-cards/[slug]/page.tsx`: unused imports (`Percent`, `Fuel`, etc.)
    - `app/recommendations/page.tsx`: unused `ProductScore`, `isLoading`.
- **Action**: Remove unused imports and variables to clean up the build output.

---

## 📂 Key Files Reference
- `lib/supabase/credit_card_schema.sql` (The authoritative schema)
- `scripts/import_finology_json.ts` (Example of how data was mapped)
- `credit_cards_backup.json` (Full backup of the 60 scraped cards)
