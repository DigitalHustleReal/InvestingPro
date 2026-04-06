# InvestingPro.in — Master Product & SEO Execution Plan

> **Created:** 2026-04-06
> **Goal:** Populate all product categories, connect CMS → Frontend dynamically, build keyword-optimized taxonomy, then execute pillar page + interlinking strategy.

---

## CURRENT STATE AUDIT

### Database Product Counts (Live Production)

| Table | Rows | Status | Notes |
|-------|------|--------|-------|
| `credit_cards` | 81 | GOOD | Has rich schema (36 columns), real data from scrapers |
| `loans` | 43 | PARTIAL | Only "Personal" type. Missing: Home, Car, Education, Business, Gold |
| `mutual_funds` | 51 | PARTIAL | Only 5 categories (Flexi Cap 18, ELSS 15, Small Cap 10, Index 6, Large Cap 2). Missing: Mid Cap, Multi Cap, Liquid, Debt, Hybrid, Sectoral |
| `insurance` | 8 | SKELETON | Has table (12 columns), minimal data |
| `brokers` | 0 | EMPTY | Table exists (13 columns), zero rows |
| `products` (unified) | 2,584 | LARGE | 2,545 mutual funds + 36 CC + 1 each (broker/loan/insurance). Used by admin CMS |
| **fixed_deposits** | **TABLE MISSING** | CRITICAL | No table exists. Frontend page expects it |
| **ppf_nps** | **TABLE MISSING** | CRITICAL | No table exists |
| **savings_accounts** | **TABLE MISSING** | CRITICAL | No table for banking page |
| **stocks** | **TABLE MISSING** | CRITICAL | No table (has `brokers` but empty) |

### Frontend Pages vs Backend Reality

| Page Route | Has Data? | Fetcher Exists? | Shows Products? |
|-----------|-----------|-----------------|-----------------|
| `/credit-cards` | YES (81) | YES | YES |
| `/loans` | PARTIAL (43 personal only) | YES | YES (but limited) |
| `/mutual-funds` | PARTIAL (51) | YES | YES |
| `/fixed-deposits` | NO TABLE | YES (will fail) | NO (empty/error) |
| `/demat-accounts` | EMPTY (0 brokers) | YES | NO (empty state) |
| `/insurance` | SKELETON (8) | YES | BARELY |
| `/ppf-nps` | NO TABLE | Likely fails | NO |
| `/banking` | NO TABLE | Likely fails | NO |
| `/stocks` | NO TABLE | Uses brokers (empty) | NO |

### Categories Table (19 defined)
Existing categories in DB: Banking, Credit Cards, Fixed Deposits, Insurance, Investing, Investing Basics, IPO, Loans, Mutual Funds, Personal Finance, Personal Loans, Retirement, Small Business, Stocks, Stocks & IPOs, Tax, Tax Planning, Taxes, Tools

---

## PHASE 0: DATABASE FOUNDATION (Day 1-2)

### 0.1 Create Missing Tables

```sql
-- 1. Fixed Deposits table
CREATE TABLE fixed_deposits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Regular', -- Regular, Tax Saving, Senior Citizen, Flexi, Corporate
    interest_rate NUMERIC(5,2),
    senior_citizen_rate NUMERIC(5,2),
    women_rate NUMERIC(5,2),
    min_deposit NUMERIC,
    max_deposit NUMERIC,
    tenure_min_days INTEGER,
    tenure_max_days INTEGER,
    premature_withdrawal BOOLEAN DEFAULT true,
    auto_renewal BOOLEAN DEFAULT true,
    loan_against_fd BOOLEAN DEFAULT true,
    tax_saving BOOLEAN DEFAULT false,
    rating NUMERIC(3,1) DEFAULT 4.0,
    features JSONB DEFAULT '{}',
    pros TEXT[] DEFAULT '{}',
    cons TEXT[] DEFAULT '{}',
    apply_link TEXT,
    official_link TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Savings Accounts / Banking table
CREATE TABLE savings_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Regular', -- Regular, Zero Balance, Salary, Women, Senior Citizen, Kids
    interest_rate NUMERIC(5,2),
    min_balance NUMERIC,
    monthly_free_atm INTEGER DEFAULT 5,
    free_neft_rtgs BOOLEAN DEFAULT true,
    debit_card_type TEXT, -- RuPay, Visa, Mastercard
    mobile_banking BOOLEAN DEFAULT true,
    upi_support BOOLEAN DEFAULT true,
    features JSONB DEFAULT '{}',
    pros TEXT[] DEFAULT '{}',
    cons TEXT[] DEFAULT '{}',
    rating NUMERIC(3,1) DEFAULT 4.0,
    apply_link TEXT,
    official_link TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PPF/NPS/Government Schemes table
CREATE TABLE govt_schemes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    scheme_type TEXT NOT NULL, -- PPF, NPS, SSY, SCSS, KVP, NSC, MIS, POMIS
    provider TEXT NOT NULL DEFAULT 'Government of India',
    current_interest_rate NUMERIC(5,2),
    min_investment NUMERIC,
    max_investment NUMERIC,
    lock_in_period TEXT,
    maturity_period TEXT,
    tax_benefit TEXT, -- Section 80C, EEE, EET
    tax_on_returns TEXT,
    risk_level TEXT DEFAULT 'Very Low',
    features JSONB DEFAULT '{}',
    pros TEXT[] DEFAULT '{}',
    cons TEXT[] DEFAULT '{}',
    rating NUMERIC(3,1) DEFAULT 4.5,
    official_link TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Stocks/IPO table (for stock recommendations, NOT broker which already exists)
-- Brokers table already exists, just needs data
```

### 0.2 Add Missing Columns to Existing Tables

```sql
-- Loans: Add missing columns for all loan types
ALTER TABLE loans ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) DEFAULT 4.0;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS pros TEXT[] DEFAULT '{}';
ALTER TABLE loans ADD COLUMN IF NOT EXISTS cons TEXT[] DEFAULT '{}';
ALTER TABLE loans ADD COLUMN IF NOT EXISTS min_amount NUMERIC;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS max_amount NUMERIC;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS prepayment_charges TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS best_for TEXT;

-- Insurance: Add missing columns
ALTER TABLE insurance ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE insurance ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) DEFAULT 4.0;
ALTER TABLE insurance ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE insurance ADD COLUMN IF NOT EXISTS pros TEXT[] DEFAULT '{}';
ALTER TABLE insurance ADD COLUMN IF NOT EXISTS cons TEXT[] DEFAULT '{}';
ALTER TABLE insurance ADD COLUMN IF NOT EXISTS best_for TEXT;
ALTER TABLE insurance ADD COLUMN IF NOT EXISTS official_link TEXT;
ALTER TABLE insurance ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE insurance ADD COLUMN IF NOT EXISTS premium_range TEXT;
ALTER TABLE insurance ADD COLUMN IF NOT EXISTS network_hospitals INTEGER;

-- Brokers: Add missing columns
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Discount'; -- Discount, Full-Service
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS account_opening_fee NUMERIC DEFAULT 0;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS amc NUMERIC DEFAULT 0;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS brokerage_delivery TEXT;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS brokerage_intraday TEXT;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS trading_platforms TEXT[];
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS mobile_app_rating NUMERIC(3,1);
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS research_tools BOOLEAN DEFAULT false;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS mutual_funds BOOLEAN DEFAULT true;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS best_for TEXT;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS official_link TEXT;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
```

---

## PHASE 1: PRODUCT DATA POPULATION (Day 2-5)

### 1.1 Credit Cards (81 exist — EXPAND to 120+)

**Missing subcategories to add:**
| Subcategory | Target Count | Examples to Add |
|------------|-------------|-----------------|
| Lifetime Free | 15 | AU Small Finance LIT, IDFC FIRST Select, OneCard |
| Student | 8 | SBI Student Plus, ICICI Student, Axis Neo |
| Business | 10 | HDFC BIZ First, ICICI Business Advantage, Amex Business Gold |
| Fuel | 8 | IndianOil Citi, HPCL ICICI, BPCL SBI |
| Shopping | 8 | Flipkart Axis, Amazon Pay ICICI, Myntra Kotak |
| Entry-Level | 10 | SBI SimplySave, ICICI Coral, Axis My Zone |

**SEO tags per card:**
- `type`: Rewards/Cashback/Travel/Fuel/Shopping/Business/Student/Lifetime Free/Premium/Entry-Level
- `best_for`: "airport-lounges", "fuel-savings", "online-shopping", "first-credit-card", "high-income"
- `salary_bracket`: "15000-25000", "25000-50000", "50000-100000", "100000+"

### 1.2 Loans (43 personal — EXPAND to 150+)

| Loan Type | Target Count | Key Players |
|-----------|-------------|-------------|
| Personal Loans | 43 (exists) | SBI, HDFC, ICICI, Axis, Kotak, Bajaj, Tata Capital |
| Home Loans | 25 | SBI, HDFC Ltd, LIC HFL, Axis, ICICI, PNB, Bank of Baroda |
| Car Loans | 15 | SBI, HDFC, ICICI, Axis, Bank of Baroda, Union Bank |
| Education Loans | 15 | SBI Scholar, HDFC Credila, Avanse, Prodigy, MPOWER |
| Business Loans | 15 | SBI eLoan, HDFC Business Growth, ICICI iMobile, Lendingkart |
| Gold Loans | 10 | Muthoot, Manappuram, SBI Gold, HDFC Gold, IIFL |
| Loan Against Property | 10 | SBI LAP, HDFC LAP, ICICI LAP, Bajaj Finserv |
| Two-Wheeler Loans | 8 | HDFC, ICICI, Bajaj Auto Finance, Hero FinCorp |
| Consumer Durable Loans | 8 | Bajaj Finserv EMI Card, HDFC, ICICI, ZestMoney |

### 1.3 Mutual Funds (51 exist — Already 2,545 in products table)

**Priority: Sync `products` table MF data → `mutual_funds` table**

Currently `mutual_funds` has 51 rows but `products` has 2,545 MFs. Need to:
1. Verify `mutual_funds` schema matches what frontend expects
2. Bulk insert from `products` where `category = 'mutual_fund'` (map fields)
3. Add missing categories:

| MF Category | Current Count | Target |
|-------------|--------------|--------|
| Flexi Cap | 18 | 25 |
| ELSS (Tax Saving) | 15 | 20 |
| Small Cap | 10 | 15 |
| Index Fund | 6 | 20 |
| Large Cap | 2 | 15 |
| **Mid Cap** | **0** | **15** |
| **Multi Cap** | **0** | **10** |
| **Large & Mid Cap** | **0** | **10** |
| **Liquid** | **0** | **10** |
| **Debt/Bond** | **0** | **15** |
| **Hybrid/Balanced** | **0** | **10** |
| **Sectoral/Thematic** | **0** | **15** |
| **International** | **0** | **10** |

### 1.4 Fixed Deposits (NEW — 0 rows, table to be created)

| Provider Type | Target Count | Key Players |
|--------------|-------------|-------------|
| Large Banks | 15 | SBI, HDFC, ICICI, Axis, Kotak, PNB, Bank of Baroda, Canara, Union, Indian Bank |
| Small Finance Banks | 10 | AU SFB, Equitas, Ujjivan, Jana, Suryoday, Unity, ESAF, Fincare |
| NBFCs | 10 | Bajaj Finserv, Mahindra Finance, HDFC Ltd, LIC HFL, Shriram |
| Corporate FDs | 8 | Bajaj Finance, Shriram Transport, HDFC Ltd, Mahindra |
| Tax Saver FDs | 8 | SBI Tax Saving, HDFC Tax Saving, ICICI Tax Saving |
| Senior Citizen Special | 8 | SBI Wecare, HDFC Senior, Post Office SCSS |

### 1.5 Demat/Brokers (0 rows — populate)

| Broker | Type | Account Fee | Delivery | Intraday |
|--------|------|------------|----------|----------|
| Zerodha | Discount | 0 | 0 | 20/order |
| Groww | Discount | 0 | 0 | 20/order |
| Upstox | Discount | 0 | 0 | 20/order |
| Angel One | Discount | 0 | 0 | 20/order |
| 5Paisa | Discount | 0 | 0 | 20/order |
| Dhan | Discount | 0 | 0 | 20/order |
| Paytm Money | Discount | 0 | 0 | 10/order |
| ICICI Direct | Full-Service | 0 | 0.55% | 0.275% |
| HDFC Securities | Full-Service | 0 | 0.50% | 0.05% |
| Kotak Securities | Full-Service | 0 | 0.49% | 0.049% |
| Axis Direct | Full-Service | 0 | 0.50% | 0.05% |
| SBI Securities | Full-Service | 0 | 0.50% | 0.05% |
| Motilal Oswal | Full-Service | 0 | 0.50% | 0.05% |
| Sharekhan | Full-Service | 0 | 0.50% | 0.10% |
| Fyers | Discount | 0 | 0 | 20/order |

### 1.6 Insurance (8 rows — EXPAND to 60+)

| Insurance Type | Target Count | Key Players |
|---------------|-------------|-------------|
| Health Insurance | 15 | Star Health, HDFC ERGO, ICICI Lombard, Max Bupa, Niva Bupa, Care Health, Bajaj Allianz, New India |
| Term Insurance | 12 | ICICI Pru, HDFC Life, Max Life, Tata AIA, LIC, SBI Life, Kotak Life, PNB MetLife |
| Life Insurance | 10 | LIC Jeevan Anand, SBI Life, HDFC Life, Max Life, Kotak Life |
| Car Insurance | 8 | HDFC ERGO, ICICI Lombard, Bajaj Allianz, New India, Digit, Acko |
| Bike Insurance | 5 | Same players as car |
| Travel Insurance | 5 | HDFC ERGO, ICICI Lombard, Bajaj Allianz, Digit, Tata AIG |
| Critical Illness | 5 | Star Health, HDFC ERGO, Max Bupa, Care Health |

### 1.7 PPF/NPS/Govt Schemes (NEW)

| Scheme | Interest Rate | Lock-in | Tax Benefit |
|--------|-------------|---------|-------------|
| PPF | 7.1% | 15 years | Section 80C (EEE) |
| NPS Tier 1 | Market-linked | Till 60 | 80CCD(1B) extra 50K |
| NPS Tier 2 | Market-linked | None | No (unless Govt) |
| SSY (Sukanya) | 8.2% | 21 years | Section 80C (EEE) |
| SCSS | 8.2% | 5 years | Section 80C |
| KVP | 7.5% | 30 months | No tax benefit |
| NSC | 7.7% | 5 years | Section 80C |
| Post Office MIS | 7.4% | 5 years | No tax benefit |
| Post Office TD | 7.5% | 1-5 years | Section 80C (5yr) |
| Sovereign Gold Bond | 2.5% + gold | 8 years | LTCG exempt |
| Atal Pension Yojana | Pension | Till 60 | Section 80CCD |
| PM Vaya Vandana | 7.4% | 10 years | Section 80C |

### 1.8 Banking/Savings Accounts (NEW)

| Bank | Type | Interest Rate | Min Balance | Key Feature |
|------|------|-------------|-------------|-------------|
| SBI | Regular | 2.70% | 3,000 | Largest network |
| HDFC Bank | Regular | 3.00% | 10,000 | Digital excellence |
| ICICI Bank | Regular | 3.00% | 10,000 | iMobile app |
| Axis Bank | Regular | 3.00% | 10,000 | Axis Mobile |
| Kotak 811 | Zero Balance | 3.50% | 0 | Best digital savings |
| Jupiter | Zero Balance | Up to 5.50% | 0 | Fintech leader |
| Fi Money | Zero Balance | Up to 5.00% | 0 | Smart deposits |
| IndusInd | Regular | 4.00% | 10,000 | High interest |
| IDFC FIRST | Regular | Up to 7.25% | 10,000 | Highest rate |
| AU Small Finance | Regular | Up to 7.25% | 2,500 | Competitive rates |
| Yes Bank | Regular | 4.00% | 10,000 | Rewards |
| Federal Bank | Regular | 3.05% | 5,000 | Kerala strong |
| RBL Bank | Regular | 5.50% | 2,500 | High interest |
| Niyo (partner) | Zero Balance | Up to 7.00% | 0 | Travel + savings |

---

## PHASE 2: CMS → FRONTEND DYNAMIC CONNECTION (Day 3-5)

### 2.1 Admin CMS Product Management Flow

```
/admin/products → ProductService → products table (unified)
                                         ↓ (sync)
                              category-specific tables
                                         ↓ (fetch)
                              /credit-cards, /loans, etc.
```

**Problem:** Admin CMS uses `products` table, but frontends read from category-specific tables. They're disconnected.

**Solution Options:**

#### Option A: Unified Table Only (Recommended)
- All frontends read from `products` table with `category` filter
- Remove category-specific fetchers, use one generic `getProductsByCategory()`
- **Pros:** Single source of truth, admin edits appear instantly
- **Cons:** Need to migrate rich columns (annual_fee, interest_rate, etc.) into `features` JSONB

#### Option B: Sync Layer (Current Architecture)
- Admin writes to `products`, a trigger syncs to category tables
- Frontends continue reading category-specific tables
- **Pros:** Rich typed columns per category, no frontend changes
- **Cons:** Sync complexity, data can get out of sync

#### Option C: Hybrid (Pragmatic — RECOMMENDED)
- Admin CMS writes to BOTH `products` AND category-specific tables
- Each `createProduct()` / `updateProduct()` call also upserts to the right category table
- Frontend reads from category tables (already works)
- `products` table is the admin index/search layer
- **Pros:** Admin works, frontend works, no migration needed
- **Cons:** Dual writes (acceptable with service layer)

### 2.2 Implementation Steps (Option C)

1. **Enhance `ProductService.createProduct()`:**
   - After inserting into `products`, also insert into the category-specific table
   - Map generic fields → category-specific columns
   - Use `features` JSONB for category-specific data that doesn't have dedicated columns

2. **Create server-side fetchers for missing categories:**
   - `get-fixed-deposits-server.ts` → query `fixed_deposits` table
   - `get-savings-accounts-server.ts` → query `savings_accounts` table
   - `get-govt-schemes-server.ts` → query `govt_schemes` table
   - `get-insurance-server.ts` → update existing to handle new columns
   - `get-brokers-server.ts` → already exists, just needs data

3. **Wire frontend pages:**
   - Each listing page already has the pattern:
     ```tsx
     const products = await getXxxServer();
     return <XxxClient initialAssets={products} />;
     ```
   - Just need to create/fix the server fetcher for each

4. **Admin product form enhancements:**
   - Dynamic form fields based on selected category
   - Credit Card: show annual_fee, rewards, lounge fields
   - Loan: show interest_rate_min/max, tenure, processing_fee
   - Insurance: show cover_amount, premium, claim_ratio
   - FD: show interest_rate, tenure, deposit range
   - Broker: show brokerage, platforms, fees

---

## PHASE 3: SEO KEYWORD TAXONOMY (Day 5-8)

### 3.1 Category-Level Keywords

#### Credit Cards
| Keyword | Est. Monthly Volume | KD | Intent | Priority |
|---------|-------------------|-----|--------|----------|
| best credit cards in india | 110,000 | 75 | Commercial | P0 |
| credit card comparison india | 14,800 | 45 | Commercial | P0 |
| best rewards credit card india | 22,200 | 55 | Commercial | P0 |
| best cashback credit card | 18,100 | 50 | Commercial | P0 |
| lifetime free credit card india | 33,100 | 40 | Commercial | P0 - QUICK WIN |
| best travel credit card india | 14,800 | 50 | Commercial | P0 |
| best credit card for salary 25000 | 8,100 | 25 | Commercial | P0 - QUICK WIN |
| best credit card for salary 50000 | 12,100 | 30 | Commercial | P0 - QUICK WIN |
| best fuel credit card | 9,900 | 35 | Commercial | P1 |
| best credit card for online shopping | 12,100 | 40 | Commercial | P1 |
| credit card apply online | 40,500 | 65 | Transactional | P0 - MONEY KW |
| first credit card india | 6,600 | 20 | Informational | P1 - QUICK WIN |
| student credit card india | 8,100 | 25 | Commercial | P1 - QUICK WIN |
| business credit card india | 6,600 | 35 | Commercial | P1 |
| credit card with airport lounge access | 22,200 | 45 | Commercial | P0 |
| hdfc credit card compare | 9,900 | 30 | Navigational | P1 |
| sbi credit card best | 12,100 | 35 | Navigational | P1 |
| credit card interest rate india | 8,100 | 20 | Informational | P2 |
| credit card eligibility checker | 6,600 | 30 | Transactional | P1 |
| credit card benefits comparison | 5,400 | 25 | Commercial | P1 - QUICK WIN |

**Optimized Title Tag:** `Best Credit Cards in India 2026 — Compare Rewards, Cashback & Travel Cards`
**Meta Description:** `Compare 100+ credit cards from HDFC, SBI, ICICI, Axis & more. Find the best rewards, cashback, travel & lifetime free credit cards. Expert ratings & instant apply.`

#### Loans
| Keyword | Est. Monthly Volume | KD | Intent | Priority |
|---------|-------------------|-----|--------|----------|
| best personal loan india | 60,500 | 65 | Commercial | P0 |
| lowest interest rate personal loan | 33,100 | 50 | Commercial | P0 |
| home loan interest rate comparison | 40,500 | 55 | Commercial | P0 |
| personal loan eligibility calculator | 22,200 | 35 | Transactional | P0 - QUICK WIN |
| sbi home loan interest rate | 49,500 | 40 | Navigational | P0 |
| home loan emi calculator | 74,000 | 45 | Transactional | P0 |
| car loan interest rate india | 14,800 | 35 | Commercial | P1 |
| education loan india | 22,200 | 45 | Commercial | P1 |
| gold loan interest rate | 18,100 | 35 | Commercial | P1 |
| personal loan apply online | 33,100 | 60 | Transactional | P0 - MONEY KW |
| loan against property rates | 9,900 | 30 | Commercial | P1 - QUICK WIN |
| business loan for MSME | 8,100 | 25 | Commercial | P1 - QUICK WIN |
| instant personal loan app | 22,200 | 55 | Transactional | P0 |

**Optimized Title Tag:** `Best Loans in India 2026 — Compare Personal, Home, Car & Business Loans`
**Meta Description:** `Compare loan interest rates from 30+ banks. Personal loans from 10.49%, home loans from 8.30%. Check eligibility, EMI calculator & apply online instantly.`

#### Mutual Funds
| Keyword | Est. Monthly Volume | KD | Intent | Priority |
|---------|-------------------|-----|--------|----------|
| best mutual funds india | 90,500 | 70 | Commercial | P0 |
| best sip plans to invest | 60,500 | 55 | Commercial | P0 |
| sip calculator | 201,000 | 50 | Transactional | P0 (HAVE IT) |
| best elss funds | 33,100 | 45 | Commercial | P0 |
| best index funds india | 22,200 | 40 | Commercial | P0 |
| best large cap mutual funds | 18,100 | 45 | Commercial | P0 |
| best small cap mutual funds | 22,200 | 50 | Commercial | P0 |
| best mid cap mutual funds | 18,100 | 45 | Commercial | P0 |
| mutual fund comparison | 14,800 | 40 | Commercial | P0 |
| lumpsum calculator | 33,100 | 35 | Transactional | P0 (HAVE IT) |
| mutual fund nav today | 49,500 | 55 | Informational | P1 |
| liquid funds best | 8,100 | 30 | Commercial | P1 - QUICK WIN |
| nfo mutual fund | 12,100 | 25 | Informational | P1 - QUICK WIN |
| direct vs regular mutual fund | 14,800 | 20 | Informational | P1 - QUICK WIN |
| sip vs lumpsum | 22,200 | 25 | Informational | P1 - QUICK WIN |

**Optimized Title Tag:** `Best Mutual Funds in India 2026 — Top SIP Plans, ELSS, Index & Equity Funds`
**Meta Description:** `Compare 2,500+ mutual funds by returns, risk & ratings. Find best SIP plans, ELSS tax savers, index funds. Free SIP calculator & expert recommendations.`

#### Fixed Deposits
| Keyword | Est. Monthly Volume | KD | Intent | Priority |
|---------|-------------------|-----|--------|----------|
| best fd rates india | 49,500 | 50 | Commercial | P0 |
| highest fd interest rate | 40,500 | 45 | Commercial | P0 |
| fd calculator | 60,500 | 40 | Transactional | P0 (HAVE IT) |
| fd rates comparison | 18,100 | 35 | Commercial | P0 - QUICK WIN |
| senior citizen fd rates | 22,200 | 30 | Commercial | P0 - QUICK WIN |
| small finance bank fd rates | 14,800 | 25 | Commercial | P0 - QUICK WIN |
| sbi fd rates | 33,100 | 35 | Navigational | P0 |
| corporate fd rates | 9,900 | 20 | Commercial | P1 - QUICK WIN |
| tax saving fd | 12,100 | 25 | Commercial | P1 - QUICK WIN |
| fd vs rd comparison | 8,100 | 15 | Informational | P1 - QUICK WIN |
| bajaj finance fd rate | 14,800 | 25 | Navigational | P1 |
| post office fd rates | 18,100 | 30 | Navigational | P1 |

**Optimized Title Tag:** `Best FD Rates in India 2026 — Compare Fixed Deposit Interest Rates`
**Meta Description:** `Compare FD interest rates from 50+ banks & NBFCs. Senior citizen rates up to 9.5%. Small finance banks offering 9%+. FD calculator & tax saving FD guide.`

#### Insurance
| Keyword | Est. Monthly Volume | KD | Intent | Priority |
|---------|-------------------|-----|--------|----------|
| best health insurance india | 49,500 | 65 | Commercial | P0 |
| best term insurance plan | 33,100 | 60 | Commercial | P0 |
| health insurance comparison | 22,200 | 50 | Commercial | P0 |
| term insurance comparison | 14,800 | 45 | Commercial | P0 |
| health insurance premium calculator | 12,100 | 30 | Transactional | P1 |
| 1 crore term insurance premium | 18,100 | 35 | Commercial | P0 - QUICK WIN |
| family health insurance plan | 14,800 | 40 | Commercial | P0 |
| car insurance online | 22,200 | 55 | Transactional | P1 |
| star health insurance review | 9,900 | 20 | Navigational | P1 - QUICK WIN |
| claim settlement ratio insurance | 8,100 | 15 | Informational | P1 - QUICK WIN |

**Optimized Title Tag:** `Best Insurance Plans in India 2026 — Health, Term & Life Insurance Comparison`
**Meta Description:** `Compare health & term insurance plans from Star Health, HDFC ERGO, ICICI Lombard. Claim settlement ratios, premium calculator & expert reviews. Apply online.`

#### Demat Accounts / Brokers
| Keyword | Est. Monthly Volume | KD | Intent | Priority |
|---------|-------------------|-----|--------|----------|
| best demat account india | 33,100 | 55 | Commercial | P0 |
| zerodha vs groww | 22,200 | 30 | Commercial | P0 - QUICK WIN |
| best stock broker india | 18,100 | 50 | Commercial | P0 |
| free demat account | 14,800 | 40 | Commercial | P0 |
| demat account comparison | 9,900 | 30 | Commercial | P0 - QUICK WIN |
| best app for stock trading | 12,100 | 45 | Commercial | P0 |
| lowest brokerage charges | 8,100 | 25 | Commercial | P1 - QUICK WIN |
| zerodha review | 14,800 | 20 | Navigational | P1 - QUICK WIN |
| upstox vs zerodha | 9,900 | 25 | Commercial | P1 - QUICK WIN |
| angel one review | 8,100 | 20 | Navigational | P1 - QUICK WIN |

**Optimized Title Tag:** `Best Demat Accounts in India 2026 — Compare Stock Brokers & Trading Apps`
**Meta Description:** `Compare 15+ stock brokers. Zerodha vs Groww vs Upstox vs Angel One. Free demat account opening, lowest brokerage charges & best trading platforms reviewed.`

#### PPF / NPS
| Keyword | Est. Monthly Volume | KD | Intent | Priority |
|---------|-------------------|-----|--------|----------|
| ppf interest rate | 49,500 | 35 | Informational | P0 |
| ppf calculator | 40,500 | 35 | Transactional | P0 (HAVE IT) |
| nps calculator | 33,100 | 35 | Transactional | P0 (HAVE IT) |
| nps vs ppf | 22,200 | 20 | Informational | P0 - QUICK WIN |
| ppf account rules | 14,800 | 25 | Informational | P0 - QUICK WIN |
| best nps fund manager | 8,100 | 15 | Commercial | P1 - QUICK WIN |
| scss interest rate | 12,100 | 20 | Informational | P1 - QUICK WIN |
| sukanya samriddhi yojana | 33,100 | 30 | Informational | P0 |
| atal pension yojana | 18,100 | 25 | Informational | P1 |

**Optimized Title Tag:** `PPF, NPS & Government Schemes 2026 — Interest Rates, Calculator & Comparison`
**Meta Description:** `Compare PPF vs NPS vs SSY vs SCSS. Current interest rates, tax benefits under 80C, maturity calculators. Expert guide to choosing the best government scheme.`

#### Banking / Savings
| Keyword | Est. Monthly Volume | KD | Intent | Priority |
|---------|-------------------|-----|--------|----------|
| best savings account india | 22,200 | 45 | Commercial | P0 |
| highest interest savings account | 14,800 | 35 | Commercial | P0 |
| zero balance account | 33,100 | 40 | Commercial | P0 |
| kotak 811 review | 8,100 | 15 | Navigational | P1 - QUICK WIN |
| best digital savings account | 9,900 | 25 | Commercial | P1 - QUICK WIN |
| salary account comparison | 6,600 | 20 | Commercial | P1 - QUICK WIN |
| jupiter account review | 6,600 | 10 | Navigational | P1 - QUICK WIN |
| fi money review | 5,400 | 10 | Navigational | P1 - QUICK WIN |

**Optimized Title Tag:** `Best Savings Accounts in India 2026 — Highest Interest Rates & Zero Balance`
**Meta Description:** `Compare savings accounts from 30+ banks. Interest rates up to 7.25%. Best zero balance accounts, digital savings & salary accounts. Open account online.`

#### Calculators
| Keyword | Est. Monthly Volume | KD | Intent | Priority |
|---------|-------------------|-----|--------|----------|
| sip calculator | 201,000 | 50 | Transactional | P0 (BUILT) |
| emi calculator | 165,000 | 55 | Transactional | P0 (BUILT) |
| fd calculator | 60,500 | 40 | Transactional | P0 (BUILT) |
| compound interest calculator | 49,500 | 40 | Transactional | P0 (BUILT) |
| ppf calculator | 40,500 | 35 | Transactional | P0 (BUILT) |
| nps calculator | 33,100 | 35 | Transactional | P0 (BUILT) |
| lumpsum calculator | 33,100 | 35 | Transactional | P0 (BUILT) |
| income tax calculator | 90,500 | 45 | Transactional | P0 (BUILT) |
| retirement calculator india | 12,100 | 20 | Transactional | P0 (BUILT) - QUICK WIN |
| swp calculator | 14,800 | 20 | Transactional | P0 (BUILT) - QUICK WIN |
| rd calculator | 22,200 | 25 | Transactional | P0 (BUILT) - QUICK WIN |
| gst calculator | 33,100 | 30 | Transactional | P0 (BUILT) |
| home loan vs sip calculator | 4,400 | 10 | Informational | P1 - QUICK WIN (BUILT) |

### 3.2 Subcategory / Filter Page Keywords

Each category listing page should have **SEO-optimized filter URLs** that rank independently:

```
/credit-cards/category/rewards          → "Best Rewards Credit Cards India 2026"
/credit-cards/category/cashback         → "Best Cashback Credit Cards India 2026"
/credit-cards/category/travel           → "Best Travel Credit Cards India 2026"
/credit-cards/category/fuel             → "Best Fuel Credit Cards India 2026"
/credit-cards/category/lifetime-free    → "Best Lifetime Free Credit Cards India 2026"
/credit-cards/category/student          → "Best Student Credit Cards India 2026"
/credit-cards/category/business         → "Best Business Credit Cards India 2026"
/credit-cards/category/premium          → "Best Premium Credit Cards India 2026"
/credit-cards/category/shopping         → "Best Credit Cards for Online Shopping 2026"
/credit-cards/salary/15000-25000        → "Best Credit Cards for Salary 15,000-25,000"
/credit-cards/salary/25000-50000        → "Best Credit Cards for Salary 25,000-50,000"
/credit-cards/salary/50000-100000       → "Best Credit Cards for Salary 50,000-1 Lakh"
/credit-cards/salary/100000-plus        → "Best Credit Cards for Salary Above 1 Lakh"

/loans/personal-loans                   → "Best Personal Loans India 2026"
/loans/home-loans                       → "Best Home Loans India 2026"
/loans/car-loans                        → "Best Car Loans India 2026"
/loans/education-loans                  → "Best Education Loans India 2026"
/loans/business-loans                   → "Best Business Loans India 2026"
/loans/gold-loans                       → "Best Gold Loans India 2026"

/mutual-funds/category/elss             → "Best ELSS Funds India 2026"
/mutual-funds/category/index            → "Best Index Funds India 2026"
/mutual-funds/category/large-cap        → "Best Large Cap Mutual Funds India 2026"
/mutual-funds/category/mid-cap          → "Best Mid Cap Mutual Funds India 2026"
/mutual-funds/category/small-cap        → "Best Small Cap Mutual Funds India 2026"
/mutual-funds/category/liquid           → "Best Liquid Funds India 2026"
/mutual-funds/category/debt             → "Best Debt Funds India 2026"

/insurance/health                       → "Best Health Insurance Plans India 2026"
/insurance/term                         → "Best Term Insurance Plans India 2026"
/insurance/car                          → "Best Car Insurance India 2026"
/insurance/life                         → "Best Life Insurance India 2026"

/fixed-deposits/bank/sbi                → "SBI FD Rates 2026"
/fixed-deposits/bank/hdfc               → "HDFC Bank FD Rates 2026"
/fixed-deposits/type/senior-citizen     → "Best Senior Citizen FD Rates 2026"
/fixed-deposits/type/tax-saving         → "Best Tax Saving FD India 2026"
```

### 3.3 Tags & Content Taxonomy

**Product-Level Tags** (stored in `features` JSONB or dedicated `tags` column):

```json
{
  "primary_tags": ["rewards", "travel", "premium"],
  "audience_tags": ["high-income", "frequent-traveler", "first-time"],
  "feature_tags": ["airport-lounge", "fuel-surcharge", "insurance", "cashback"],
  "bank_tags": ["hdfc", "sbi", "icici", "axis"],
  "intent_tags": ["compare", "apply", "review"],
  "salary_bracket": "50000-100000"
}
```

**Article-Level Tags:**
```
informational: guide, explainer, how-to, glossary, faq, basics
commercial: comparison, best-of, review, versus, recommendation
transactional: apply, calculator, tool, eligibility-check
navigational: bank-specific, product-specific
```

---

## PHASE 4: PILLAR PAGES STRATEGY (Day 8-15)

### 4.1 Pillar Page Architecture

Each category gets ONE pillar page (3,000-5,000 words) that links to:
- 5-10 cluster articles (1,500-2,500 words each)
- Product comparison tables
- Embedded calculators
- CTAs with affiliate links

```
PILLAR: "Complete Guide to Credit Cards in India 2026"
  ├── CLUSTER: "Best Rewards Credit Cards — Detailed Comparison"
  ├── CLUSTER: "How to Choose Your First Credit Card"
  ├── CLUSTER: "Credit Card Fees Explained: Annual Fee, Interest Rate, Late Payment"
  ├── CLUSTER: "Airport Lounge Access — Which Cards Get You In Free?"
  ├── CLUSTER: "Credit Score: How It Affects Your Card Approval"
  ├── CLUSTER: "Best Credit Cards for Each Salary Range"
  ├── CALCULATOR: SIP vs Credit Card Rewards Calculator
  ├── COMPARISON TABLE: Top 10 Cards Side-by-Side
  └── CTA: "Find Your Perfect Card → /credit-cards/find-your-card"
```

### 4.2 Pillar Pages to Create (10 Total)

| # | Pillar Page | Target Keyword | Volume | URL |
|---|------------|---------------|--------|-----|
| 1 | Complete Guide to Credit Cards India | best credit cards india | 110K | `/guides/credit-cards` |
| 2 | Complete Guide to Personal Loans | best personal loan india | 60K | `/guides/personal-loans` |
| 3 | Complete Guide to Home Loans | home loan guide india | 40K | `/guides/home-loans` |
| 4 | Complete Guide to Mutual Funds | best mutual funds india | 90K | `/guides/mutual-funds` |
| 5 | Complete Guide to Fixed Deposits | best fd rates india | 49K | `/guides/fixed-deposits` |
| 6 | Complete Guide to Health Insurance | best health insurance india | 49K | `/guides/health-insurance` |
| 7 | Complete Guide to Term Insurance | best term insurance | 33K | `/guides/term-insurance` |
| 8 | Complete Guide to Demat Accounts | best demat account india | 33K | `/guides/demat-accounts` |
| 9 | Complete Guide to PPF/NPS | ppf vs nps | 22K | `/guides/ppf-nps` |
| 10 | Complete Guide to Tax Saving | tax saving investments | 40K | `/guides/tax-saving` |

### 4.3 Cluster Articles Per Pillar (50 Total)

**Pillar 1: Credit Cards (5 clusters)**
1. "Best Rewards Credit Cards India 2026 — Detailed Comparison" (commercial)
2. "How to Choose Your First Credit Card — Beginner's Guide" (informational)
3. "Credit Card Airport Lounge Access — Complete List 2026" (commercial)
4. "Best Credit Cards by Salary Range — ₹15K to ₹5L+" (commercial)
5. "Credit Card Fees Explained — Hidden Charges to Watch" (informational)

**Pillar 2: Personal Loans (5 clusters)**
1. "Lowest Interest Rate Personal Loans — Bank-by-Bank Comparison" (commercial)
2. "Personal Loan Eligibility — How Banks Decide" (informational)
3. "Instant Personal Loan Apps — Legit Options Reviewed" (commercial)
4. "Personal Loan vs Credit Card Loan — Which is Cheaper?" (informational)
5. "How to Improve Personal Loan Approval Chances" (informational)

**Pillar 3: Home Loans (5 clusters)**
1. "Home Loan Interest Rates — All Banks Compared" (commercial)
2. "Home Loan Tax Benefits — Section 24, 80C, 80EEA" (informational)
3. "Fixed vs Floating Home Loan Rate — Which to Choose?" (informational)
4. "Home Loan Balance Transfer — When and How" (informational)
5. "Home Loan EMI Calculator — How Much Can You Afford?" (transactional)

*[Similar 5 clusters for each of the remaining 7 pillars]*

---

## PHASE 5: INTERLINKING STRATEGY (Day 10-15)

### 5.1 Link Architecture

```
Homepage
  ├── Category Pages (9)          ← nav, footer, hero section
  │   ├── Subcategory/Filter Pages ← breadcrumbs, sidebar
  │   ├── Individual Product Pages ← related products, comparison links
  │   └── Comparison Pages         ← versus links, table links
  ├── Pillar Pages (10)           ← guides section, sidebar
  │   └── Cluster Articles (50)   ← inline links, "read more" CTAs
  ├── Calculator Pages (23)       ← embedded in articles + pillar pages
  ├── Glossary (101 terms)        ← inline tooltip links throughout site
  └── Versus Pages (20+)         ← linked from product pages
```

### 5.2 Internal Link Rules

1. **Every product page** links to:
   - Parent category page (breadcrumb)
   - 3-5 similar products ("You might also like")
   - 1-2 comparison/versus pages ("Compare with X")
   - Relevant calculator
   - Relevant pillar page
   - Related articles

2. **Every article** links to:
   - 2-3 products mentioned (with affiliate CTAs)
   - Parent pillar page
   - 2-3 sibling cluster articles
   - Relevant calculators (embedded)
   - Glossary terms (inline tooltips)

3. **Every calculator** links to:
   - Related product category
   - Related article explaining the concept
   - "Next step" CTA (e.g., SIP calculator → "Start SIP with these top funds")

4. **Every category page** links to:
   - All subcategory filter pages
   - Top 3-5 products featured
   - Pillar page ("Complete Guide →")
   - Relevant calculator ("Calculate →")
   - Related categories (e.g., FD → also see PPF/NPS)

### 5.3 Implementation: Auto-Interlinking System

Build a `lib/interlinking/` module that:

```typescript
// Auto-generates contextual internal links
interface InternalLink {
  anchorText: string;
  href: string;
  context: 'inline' | 'sidebar' | 'footer' | 'related' | 'cta';
  relevanceScore: number;
}

// For each article/product page:
function getInternalLinks(pageSlug: string, category: string): InternalLink[] {
  return [
    ...getRelatedProducts(category, 5),
    ...getRelatedArticles(category, 3),
    ...getRelatedCalculators(category, 2),
    ...getPillarPageLink(category),
    ...getGlossaryLinks(content), // scan content for glossary terms
  ];
}
```

---

## PHASE 6: CALCULATOR EMBEDDING STRATEGY (Day 12-15)

### 6.1 Calculator-Category Mapping

| Calculator | Embed In Categories | Embed In Pillar | CTA After Result |
|-----------|-------------------|-----------------|------------------|
| SIP Calculator | Mutual Funds | MF Pillar | "Start SIP with top funds →" |
| EMI Calculator | Loans (all types) | Loan Pillars | "Compare lowest EMI loans →" |
| FD Calculator | Fixed Deposits, Banking | FD Pillar | "Get highest FD rates →" |
| PPF Calculator | PPF/NPS, Tax | PPF Pillar | "Open PPF account →" |
| NPS Calculator | PPF/NPS, Retirement | PPF Pillar | "Choose NPS fund →" |
| Tax Calculator | Tax, Insurance (80C) | Tax Pillar | "Save tax with ELSS →" |
| Lumpsum Calculator | Mutual Funds | MF Pillar | "Invest lumpsum →" |
| SWP Calculator | Mutual Funds | MF Pillar | "Best SWP funds →" |
| Compound Interest | FD, PPF, General | Multiple | "Where to invest →" |
| Home Loan vs SIP | Loans, MF | Both Pillars | "Compare options →" |
| Retirement Calculator | NPS, PPF, MF | Retirement Guide | "Start retirement plan →" |
| Goal Planning | General, MF | Planning Guide | "Best funds for your goal →" |
| Inflation Calculator | General | Multiple | "Beat inflation →" |

### 6.2 Calculator Embed Component

```tsx
<CalculatorEmbed
  type="sip"
  variant="compact"        // compact (inline) or full (standalone)
  prefilledValues={{        // optional context-aware prefill
    monthlyAmount: 5000,
    years: 10,
    expectedReturn: 12
  }}
  ctaText="Start SIP with top-rated funds"
  ctaLink="/mutual-funds?sort=rating"
  showRelatedProducts={true}
/>
```

---

## PHASE 7: IMAGE & CTA STRATEGY (Day 15-18)

### 7.1 Image Requirements Per Page Type

| Page Type | Images Needed | Source | Format |
|-----------|-------------|--------|--------|
| Product Card | Bank/company logo | Official sites | WebP, 200x200 |
| Product Detail | Hero banner + logo | Custom SVG | WebP, 1200x630 |
| Category Page | Hero illustration | AI generated | WebP, 1200x400 |
| Pillar Page | Custom infographic | AI + Canva | WebP, 1200x800 |
| Article | Featured image + inline | Unsplash/AI | WebP, 1200x630 |
| Calculator | Result chart/graph | Dynamic SVG | SVG, responsive |
| OG/Social | Preview card | Auto-generated | PNG, 1200x630 |

### 7.2 CTA Strategy Per Page Type

| Page Type | Primary CTA | Secondary CTA | Tertiary CTA |
|-----------|------------|---------------|-------------|
| Category Listing | "Apply Now" (affiliate) | "Compare" (comparison) | "Calculate" (calculator) |
| Product Detail | "Apply Now" (affiliate) | "Compare with X" | "Read Full Review" |
| Pillar Page | "Find Best [X] →" (finder tool) | "Use Calculator →" | "Read Guide →" |
| Article | "Check Top [X] →" (category) | "Use Calculator" | "Related: [article]" |
| Calculator Result | "Best [X] for You →" (category) | "Detailed Guide →" | "Talk to Expert →" |
| Comparison Page | "Winner: Apply Now" | "See All [X]" | "Read Reviews" |

### 7.3 CTA Component

```tsx
<ProductCTA
  variant="primary"          // primary, secondary, inline, sticky
  productId="uuid"
  productName="HDFC Infinia"
  affiliateLink="https://..."
  ctaText="Apply Now"
  trackingEvent="apply_click"
  showDisclosure={true}      // "Affiliate link" disclaimer
  showTrustBadge={true}      // "Verified ✓ | Last updated: Apr 2026"
/>
```

---

## PHASE 8: PROGRAMMATIC SEO PAGES (Day 18-25)

### 8.1 Auto-Generated Pages

```
/compare/{product-a}-vs-{product-b}     → 1,000+ versus pages
/credit-cards/salary/{bracket}           → 4 salary-range pages
/credit-cards/category/{type}            → 10 category filter pages
/best-mutual-funds/{category}            → 13 MF category pages (already have route)
/fixed-deposits/bank/{bank-slug}         → 20+ bank-specific FD pages
/loans/{type}                            → 9 loan type pages
/insurance/{type}                        → 7 insurance type pages
/calculators/{type}                      → 23 calculator pages (BUILT)
```

### 8.2 Versus Page Generation

For each category, auto-generate top comparison pages:

**Credit Cards:** HDFC Infinia vs Axis Magnus, SBI AURUM vs ICICI Sapphiro, etc.
**Brokers:** Zerodha vs Groww, Zerodha vs Upstox, Groww vs Angel One, etc.
**Mutual Funds:** Axis Bluechip vs Mirae Emerging, Parag Parikh vs UTI Nifty, etc.
**Insurance:** Star Health vs HDFC ERGO, ICICI Pru vs Max Life, etc.

---

## EXECUTION TIMELINE

| Week | Phase | Deliverables |
|------|-------|-------------|
| **Week 1** | Phase 0-1 | Create missing tables, populate all 9 categories with real product data |
| **Week 1** | Phase 2 | Wire CMS → Frontend for all categories, test data flow |
| **Week 2** | Phase 3 | Add keyword data to all products, optimize titles/meta per category |
| **Week 2** | Phase 4 | Write first 3 pillar pages (Credit Cards, Loans, Mutual Funds) |
| **Week 3** | Phase 4-5 | Remaining pillar pages, implement interlinking system |
| **Week 3** | Phase 6 | Embed calculators in articles + product pages |
| **Week 4** | Phase 7 | Images, CTAs, trust badges across all pages |
| **Week 4** | Phase 8 | Generate programmatic SEO pages (versus, filter, bank-specific) |

---

## QUICK WINS (Can Start Immediately)

1. **Salary-based credit card pages** (KD 20-30, volume 8K-12K) — already have route
2. **FD rates comparison** (KD 25-35, volume 14K-49K) — needs table + data
3. **Zerodha vs Groww** (KD 30, volume 22K) — needs broker data
4. **NPS vs PPF** (KD 20, volume 22K) — needs govt_schemes table
5. **Lifetime free credit cards** (KD 40, volume 33K) — needs tag filter
6. **Calculators already built** — just need SEO-optimized content around them
7. **101 glossary terms exist** — auto-link them throughout articles

---

## SUCCESS METRICS

| Metric | Current | Target (3 months) | Target (6 months) |
|--------|---------|-------------------|-------------------|
| Products in DB | ~180 | 500+ | 1,000+ |
| Categories with data | 3 of 9 | 9 of 9 | 9 of 9 |
| Pillar pages | 0 | 5 | 10 |
| Cluster articles | ~199 | 300 | 500 |
| Organic traffic | ~0 | 5K/month | 50K/month |
| Ranking keywords | ~0 | 200 | 1,000+ |
| Affiliate clicks | 0 | 500/month | 5,000/month |

---

*This plan is the execution blueprint. Each phase builds on the previous. Phase 0-2 are infrastructure (must do first). Phase 3-8 are growth (can parallelize).*
