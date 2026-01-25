# InvestingPro.in - Data Source & Integrity Audit (2026)

## 🎯 Audit Objective
To distinguish between **"Real Data"** (Supabase/API) and **"Mock Data"** (Static JSON).
**Goal:** Achieve 100% "Truth of Data" by migrating all mock sources to the CMS or external APIs.

---

## 🕵️ Data Truth Table

| Entity / Widget | Source Location | Current Status | Connection Type | Risk Level |
| :--- | :--- | :--- | :--- | :--- |
| **Credit Cards** | `lib/api-client.ts` | 🟢 **Real** | Supabase (`credit_cards`) | Low |
| **Mutual Funds** | `lib/api-client.ts` | 🟢 **Real** | Supabase (`mutual_funds`) | Low |
| **Loans** | `lib/api-client.ts` | 🟢 **Real** | Supabase (`loans`) | Low |
| **Articles** | `lib/api-client.ts` | 🟢 **Real** | Supabase (`articles`) | Low |
| **IPOs** | `lib/api-client.ts` | 🔴 **Mock** | Static Array (Tata Tech example) | **Critical** |
| **Brokers** | `lib/api-client.ts` | 🔴 **Mock** | Static Array (Zerodha, Groww) | **High** |
| **News Widget** | `ContextualNewsWidget.tsx` | 🔴 **Mock** | `const MOCK_NEWS` | **High** |
| **Rates Widget** | `RatesWidget.tsx` | 🔴 **Mock** | `const RATES_DATA` | **High** |
| **Platform Stats** | `platform-stats.ts` | 🟠 **Static** | Hardcoded Constants | Medium |

---

## 🔍 Deep Dive Findings

### 1. The "IPO" Illusion
*   **Finding:** The `IPO.list()` function in `api-client.ts` returns hardcoded data from 2024 ("Tata Technologies").
*   **Impact:** Users seeing "Open" IPOs that listed years ago destroys trust instantly.
*   **Fix:** Create `ipos` table in Supabase or fetch from a financial data API (e.g., Chittorgarh scrape).

### 2. The "Static" News
*   **Finding:** `ContextualNewsWidget` displays "2h ago" for news items that are hardcoded strings.
*   **Impact:** The site feels "dead" if the news never changes.
*   **Fix:** Integrate a real News API (Bing Search API or a custom RSS parser) to fetch live finance news.

### 3. Rate Stagnation
*   **Finding:** `RatesWidget` shows Gold at ₹72,450 forever.
*   **Impact:** Misleading financial information.
*   **Fix:** 
    *   **Option A (Fast):** Update manually via Admin Panel (CMS).
    *   **Option B (Auto):** Vercel Cron Job to fetch rates daily and update Supabase.

### 4. Broker Listings
*   **Finding:** Broker comparison data is hardcoded in `api-client.ts`.
*   **Impact:** New brokers cannot be added without code deploys.
*   **Fix:** Migrate `Brokers` to a Supabase table (`brokers`).

---

## 🚀 Migration Roadmap

### Phase 1: The "Trust" Fixes (Immediate)
1.  **Migrate IPOs to CMS:** Create `ipos` table. Remove mock array.
2.  **Migrate Brokers to CMS:** Create `brokers` table. Remove mock array.

### Phase 2: Live Data Pipes
1.  **News Automation:** Connect `ContextualNewsWidget` to a server-side fetch that pulls from `supa_news` table (populated by a background worker).
2.  **Rates Automation:** Create `rates` table in Supabase. Build a simple Admin UI to update these values daily.

## 🛠️ Schema Recommendations

### New Table: `ipos`
```sql
create table ipos (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  symbol text,
  open_date date,
  close_date date,
  listing_date date,
  price_band text,
  status text check (status in ('Open', 'Closed', 'Upcoming')),
  listing_gmp text
);
```

### New Table: `rates`
```sql
create table rates (
  key text primary key, -- e.g. 'gold_24k', 'sbi_home_loan'
  value text not null,
  trend text, -- 'up', 'down', 'stable'
  updated_at timestamp default now()
);
```

---
**Verdict:** The core product engine (Cards, Funds) is solid/real. The "peripheral" engagement layers (News, IPOs, Rates) are currently smoke and mirrors.
