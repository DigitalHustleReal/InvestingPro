-- =====================================================
-- SEED: Real Financial Products Data
-- =====================================================

-- 1. DELETE EXISTING DEMO DATA (Clean slate)
DELETE FROM products;

-- 2. INSERT REAL PRODUCTS

-- === CREDIT CARDS ===
INSERT INTO products (
    name, slug, category, provider_name, provider_slug, 
    is_active, verification_status, trust_score, 
    meta_title, meta_description, launch_date, 
    created_at, last_updated_at, last_verified_at,
    data_completeness_score
) VALUES 
(
    'HDFC Regalia Gold Credit Card', 
    'hdfc-regalia-gold-credit-card', 
    'credit_card', 
    'HDFC Bank', 
    'hdfc-bank',
    true, 'verified', 98,
    'HDFC Regalia Gold Credit Card Review 2026 | Benefits & Fees',
    'Detailed review of HDFC Regalia Gold. Get complimentary lounge access, 5x reward points on Marks & Spencer, Myntra, Reliance Digital. Best premium lifestyle card.',
    '2023-01-15',
    NOW(), NOW(), NOW(),
    0.95
),
(
    'SBI Card ELITE', 
    'sbi-card-elite', 
    'credit_card', 
    'SBI Card', 
    'sbi-card',
    true, 'verified', 92,
    'SBI Card ELITE Review: Features, Fees & Lounge Access',
    'Get welcome e-gift voucher worth ₹5,000. Free movie tickets worth ₹6,000 every year. 5X Reward Points on Dining, Departmental stores and Grocery.',
    '2022-06-10',
    NOW(), NOW(), NOW(),
    0.90
),
(
    'Axis Bank Magnus Credit Card', 
    'axis-bank-magnus-credit-card', 
    'credit_card', 
    'Axis Bank', 
    'axis-bank',
    true, 'verified', 96,
    'Axis Magnus Credit Card Review - Best for Travel & Lifestyle',
    'Unlimited domestic & international lounge access. 25,000 EDGE REWARD Points on achieving monthly spends of ₹1 Lakh. Metal card for premium lifestyle.',
    '2022-09-01',
    NOW(), NOW(), NOW(),
    0.94
);

-- === MUTUAL FUNDS ===
INSERT INTO products (
    name, slug, category, provider_name, provider_slug, 
    is_active, verification_status, trust_score, 
    meta_title, meta_description, launch_date, 
    created_at, last_updated_at, last_verified_at,
    data_completeness_score
) VALUES 
(
    'Parag Parikh Flexi Cap Fund', 
    'parag-parikh-flexi-cap-fund', 
    'mutual_fund', 
    'PPFAS Mutual Fund', 
    'ppfas-mutual-fund',
    true, 'verified', 99,
    'Parag Parikh Flexi Cap Fund Direct Growth Review',
    'Invest in a diversified equity portfolio. Low expense ratio, consistent returns, and international equity exposure. Rated 5-star by Morningstar.',
    '2013-05-24',
    NOW(), NOW(), NOW(),
    0.98
),
(
    'Quant Small Cap Fund', 
    'quant-small-cap-fund', 
    'mutual_fund', 
    'Quant Mutual Fund', 
    'quant-mutual-fund',
    true, 'verified', 88,
    'Quant Small Cap Fund Direct Plan Growth - Analysis',
    'High growth small cap fund. Historically high returns but higher risk. Suitable for aggressive investors with long-term horizon.',
    '1996-01-01',
    NOW(), NOW(), NOW(),
    0.85
),
(
    'SBI Nifty 50 ETF', 
    'sbi-nifty-50-etf', 
    'mutual_fund', 
    'SBI Mutual Fund', 
    'sbi-mutual-fund',
    true, 'verified', 95,
    'SBI Nifty 50 ETF Review - Lowest Expense Ratio',
    'Passive investment in India top 50 companies. Extremely low expense ratio. Good for long-term wealth creation matching market returns.',
    '2015-07-20',
    NOW(), NOW(), NOW(),
    0.92
);

-- === STOCK BROKERS ===
INSERT INTO products (
    name, slug, category, provider_name, provider_slug, 
    is_active, verification_status, trust_score, 
    meta_title, meta_description, launch_date, 
    created_at, last_updated_at, last_verified_at,
    data_completeness_score
) VALUES 
(
    'Zerodha Kite', 
    'zerodha-kite', 
    'broker', 
    'Zerodha', 
    'zerodha',
    true, 'verified', 97,
    'Zerodha Review 2026: Brokerage Charges & Trading Platform',
    'India #1 discount broker. Zero brokerage on equity delivery. ₹20 per order for Intraday and F&O. Best-in-class trading platform Kite.',
    '2010-08-15',
    NOW(), NOW(), NOW(),
    0.96
),
(
    'Groww Investment Platform', 
    'groww', 
    'broker', 
    'Groww', 
    'groww',
    true, 'verified', 94,
    'Groww App Review: Stocks & Mutual Funds Investment',
    'Simple app for stocks and mutual funds. Zero account opening fee. Zero AMC. User-friendly interface perfect for beginners.',
    '2016-04-01',
    NOW(), NOW(), NOW(),
    0.93
),
(
    'Angel One', 
    'angel-one', 
    'broker', 
    'Angel One', 
    'angel-one',
    true, 'verified', 90,
    'Angel One Review - Full Service Broker with Discount Pricing',
    'Zero brokerage on delivery. Smart API for algorithmic trading. Advisory services included. Trusted brand with large offline presence.',
    '1996-12-13',
    NOW(), NOW(), NOW(),
    0.88
);

-- === LOANS ===
INSERT INTO products (
    name, slug, category, provider_name, provider_slug, 
    is_active, verification_status, trust_score, 
    meta_title, meta_description, launch_date, 
    created_at, last_updated_at, last_verified_at,
    data_completeness_score
) VALUES 
(
    'HDFC Personal Loan', 
    'hdfc-personal-loan', 
    'loan', 
    'HDFC Bank', 
    'hdfc-bank',
    true, 'verified', 93,
    'HDFC Personal Loan Interest Rates & Eligibility 2026',
    'Get personal loan up to ₹40 Lakhs. Interest rates starting from 10.50%. Quick disbursal in 10 seconds for pre-approved customers.',
    '2000-01-01',
    NOW(), NOW(), NOW(),
    0.91
),
(
    'Bajaj Finserv Personal Loan', 
    'bajaj-finserv-personal-loan', 
    'loan', 
    'Bajaj Finserv', 
    'bajaj-finserv',
    true, 'verified', 89,
    'Bajaj Finserv Instant Personal Loan - Apply Online',
    'Instant approval. Flexi loan facility available. Money in bank in 24 hours. Minimal documentation required.',
    '2007-05-01',
    NOW(), NOW(), NOW(),
    0.87
);

-- === INSURANCE ===
INSERT INTO products (
    name, slug, category, provider_name, provider_slug, 
    is_active, verification_status, trust_score, 
    meta_title, meta_description, launch_date, 
    created_at, last_updated_at, last_verified_at,
    data_completeness_score
) VALUES 
(
    'LIC Jeevan Umang', 
    'lic-jeevan-umang', 
    'insurance', 
    'LIC of India', 
    'lic',
    true, 'verified', 95,
    'LIC Jeevan Umang Plan 945 - Benefits & Premium Calculator',
    'Whole life assurance plan. Annual survival benefits from end of premium paying term till maturity. Lump sum maturity benefit.',
    '1956-09-01',
    NOW(), NOW(), NOW(),
    0.94
),
(
    'HDFC ERGO Optima Secure', 
    'hdfc-ergo-optima-secure', 
    'insurance', 
    'HDFC ERGO', 
    'hdfc-ergo',
    true, 'verified', 96,
    'HDFC ERGO Optima Secure Health Insurance Review',
    '4X coverage benefit at no extra cost. 100% restore benefit. Protect benefit. No room rent capping. One of the best detailed health plans.',
    '2021-07-01',
    NOW(), NOW(), NOW(),
    0.95
);
