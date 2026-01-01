# 🗿 HARDCODED LOGIC AUDIT

## 1. 📂 THE "STATIC DATA" PROBLEM
**Status: Heavy Reliance on Mocks**
- `lib/data.ts` contains `CREDIT_CARDS`, `LOANS`, `MUTUAL_FUNDS`.
- **Why this is bad**:
    - **No Real-Time Updates**: "Ola Electric" IPO status is hardcoded as "Upcoming".
    - **No Affiliate Revenue**: `applyLink: '#'` is hardcoded everywhere.

## 2. 🗺️ NAVIGATION SCALABILITY
- `NAVIGATION_CONFIG` (600 lines) defines the entire site structure.
- **Risk**: Adding a new vertical requires a Code Deploy, not a CMS update.
- **Solution**: Hydrate navigation from a Redis Cache or Supabase on app startup.

## 3. 🧩 ENUM FRAGILITY
- **File**: `lib/supabase/credit_card_schema.sql`
- **Constraint**: `CHECK (type IN ('Rewards', 'Travel'))`
- **Risk**: If a new type "Lifestyle" emerges, your DB rejects it.
- **Fix**: Use a `credit_card_types` reference table instead of hardcoded `CHECK` constraints.

## 4. 🛠️ ACTION PLAN
1.  **Migrate Mocks**: Write a script to push `lib/data.ts` into Supabase `products` tables.
2.  **Dynamic Navigation**: Create an API `GET /api/navigation` that builds the menu from the DB.
3.  **Affiliate Injection**: Replace `'#'` links with a dynamic lookup to `affiliate_products` table.
