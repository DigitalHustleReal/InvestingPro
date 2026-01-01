-- =====================================================
-- SEED CONTENT (No external table dependencies)
-- =====================================================

-- Drop restrictive constraints
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_category_check;
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_content_type_check;
ALTER TABLE articles ALTER COLUMN content DROP NOT NULL;

-- =====================================================
-- CATEGORIES
-- =====================================================

INSERT INTO categories (name, slug, description) VALUES
('Mutual Funds', 'mutual-funds', 'Mutual fund investing in India'),
('Stocks', 'stocks', 'Stock market investing'),
('Fixed Deposits', 'fixed-deposits', 'FD rates and guides'),
('Credit Cards', 'credit-cards', 'Credit card reviews'),
('Personal Loans', 'personal-loans', 'Loan guides'),
('Tax Planning', 'tax-planning', 'Tax saving guides'),
('Insurance', 'insurance', 'Insurance guides'),
('Retirement', 'retirement', 'NPS, PPF, retirement'),
('Banking', 'banking', 'Banking guides'),
('IPO', 'ipo', 'IPO analysis')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- AUTHORS
-- =====================================================

INSERT INTO authors (name, role, bio, avatar_url) VALUES
('Rahul Sharma', 'Senior Financial Analyst', 'SEBI-registered advisor.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
('Priya Kapoor', 'Mutual Fund Expert', 'CFP-certified planner.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
('Amit Verma', 'Tax Consultant', 'Chartered Accountant.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('Neha Gupta', 'Credit Card Specialist', 'Banking expert.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'),
('InvestingPro Team', 'Editorial', 'Expert team.', NULL)
ON CONFLICT DO NOTHING;

-- =====================================================
-- PILLAR PAGES
-- =====================================================

INSERT INTO articles (
    title, slug, excerpt, content, body_markdown, 
    category, status, content_type, 
    seo_title, seo_description,
    featured_image, read_time, views, language,
    author_name, author_role, published_at, published_date
) VALUES 
(
    'Complete Guide to Mutual Funds in India 2026',
    'mutual-funds-complete-guide',
    'Everything about mutual fund investing in India.',
    'Complete guide to mutual funds.',
    '# Complete Guide to Mutual Funds 2026

## What are Mutual Funds?
Pooled investment managed by professionals.

## Types
- Equity Funds
- Debt Funds
- Hybrid Funds
- ELSS (Tax Saving)

## How to Start
1. Complete KYC
2. Choose SIP or Lump Sum
3. Select funds
4. Invest via Groww/Zerodha

## Best Funds 2026
- Mirae Asset Large Cap
- Axis Bluechip
- Canara Robeco ELSS

## Tax Rules
- STCG: 15%
- LTCG: 10% above 1 lakh',
    'mutual-funds', 'published', 'pillar',
    'Mutual Funds Guide India 2026 | InvestingPro',
    'Complete mutual fund investing guide.',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200',
    25, 1520, 'en',
    'Priya Kapoor', 'Mutual Fund Expert',
    NOW() - INTERVAL '5 days', CURRENT_DATE - 5
),
(
    'Ultimate Credit Card Guide 2026',
    'credit-cards-complete-guide',
    'Master credit cards and maximize rewards.',
    'Complete credit card guide.',
    '# Credit Card Guide 2026

## Benefits
- Rewards and Cashback
- Credit Score Building

## Best Cards
- HDFC Regalia
- Amazon Pay ICICI
- Axis Atlas

## Best Practices
1. Pay full before due date
2. Keep utilization below 30%
3. Never miss payments',
    'credit-cards', 'published', 'pillar',
    'Credit Card Guide 2026 | InvestingPro',
    'Master credit cards in India.',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
    20, 980, 'en',
    'Neha Gupta', 'Credit Card Specialist',
    NOW() - INTERVAL '3 days', CURRENT_DATE - 3
),
(
    'Tax Planning Guide for Salaried 2026',
    'tax-planning-guide-salaried',
    'Maximize tax savings legally.',
    'Tax planning guide for employees.',
    '# Tax Planning Guide 2026

## Section 80C (1.5 Lakh)
- ELSS Funds
- PPF
- NPS

## Section 80D
- Health Insurance premium

## HRA Exemption
Calculate based on rent paid.',
    'tax-planning', 'published', 'pillar',
    'Tax Planning Guide 2026 | InvestingPro',
    'Save maximum tax legally.',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200',
    22, 2150, 'en',
    'Amit Verma', 'Tax Consultant',
    NOW() - INTERVAL '7 days', CURRENT_DATE - 7
),
(
    'Stock Market Guide for Beginners 2026',
    'stock-market-beginners-guide',
    'Start stock market investing.',
    'Stock market beginners guide.',
    '# Stock Market Guide 2026

## Why Invest?
- Wealth creation
- Beat inflation

## How to Start
1. Open Demat Account
2. Complete KYC
3. Start with index funds

## Risk Management
- Use stop-loss
- Diversify portfolio',
    'stocks', 'published', 'pillar',
    'Stock Market Guide 2026 | InvestingPro',
    'Complete stock market guide.',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200',
    28, 1850, 'en',
    'Rahul Sharma', 'Senior Financial Analyst',
    NOW() - INTERVAL '10 days', CURRENT_DATE - 10
),
(
    'Retirement Planning Guide 2026',
    'retirement-planning-guide',
    'Plan your retirement wisely.',
    'Retirement planning guide.',
    '# Retirement Planning Guide 2026

## Retirement Vehicles
- NPS: Market-linked
- PPF: Fixed 7.1%
- EPF: Employer contribution

## 25x Rule
Need: Annual expenses × 25

## Start Early
Time is your biggest asset.',
    'retirement', 'published', 'pillar',
    'Retirement Planning Guide 2026 | InvestingPro',
    'Plan retirement with NPS, PPF.',
    'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=1200',
    20, 890, 'en',
    'InvestingPro Team', 'Editorial',
    NOW() - INTERVAL '2 days', CURRENT_DATE - 2
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- REGULAR ARTICLES
-- =====================================================

INSERT INTO articles (
    title, slug, excerpt, content, body_markdown,
    category, status, content_type,
    seo_title, seo_description,
    featured_image, read_time, views, language,
    author_name, author_role, published_at, published_date
) VALUES
(
    'SIP vs Lump Sum: Which is Better?',
    'sip-vs-lump-sum-investment',
    'Compare SIP and lump sum investing.',
    'SIP vs Lump Sum comparison.',
    '# SIP vs Lump Sum
## SIP: Regular investing
## Lump Sum: One-time investment
## Verdict: Use both strategically.',
    'mutual-funds', 'published', 'article',
    'SIP vs Lump Sum | InvestingPro',
    'SIP vs Lump Sum comparison.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    8, 450, 'en',
    'Priya Kapoor', 'Mutual Fund Expert',
    NOW() - INTERVAL '1 day', CURRENT_DATE - 1
),
(
    'Top 5 ELSS Funds for Tax Saving 2026',
    'best-elss-funds-2026',
    'Best ELSS mutual funds.',
    'ELSS funds comparison.',
    '# Top 5 ELSS Funds 2026
1. Mirae Asset Tax Saver
2. Canara Robeco ELSS
3. Axis Long Term Equity
4. DSP Tax Saver
5. SBI Long Term Equity',
    'mutual-funds', 'published', 'article',
    'Best ELSS Funds 2026 | InvestingPro',
    'Best ELSS for tax saving.',
    'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=800',
    6, 780, 'en',
    'Priya Kapoor', 'Mutual Fund Expert',
    NOW() - INTERVAL '4 days', CURRENT_DATE - 4
),
(
    'How to Improve Your CIBIL Score',
    'improve-cibil-score-quickly',
    'Boost your credit score.',
    'CIBIL score guide.',
    '# Improve CIBIL Score
1. Pay bills on time
2. Keep usage below 30%
3. Dont close old accounts',
    'credit-cards', 'published', 'article',
    'Improve CIBIL Score | InvestingPro',
    'Boost credit score.',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    7, 1250, 'en',
    'Neha Gupta', 'Credit Card Specialist',
    NOW() - INTERVAL '6 days', CURRENT_DATE - 6
),
(
    'Best Cashback Credit Cards 2026',
    'best-cashback-credit-cards-2026',
    'Top cashback cards India.',
    'Cashback cards comparison.',
    '# Best Cashback Cards
- Amazon Pay ICICI: 5%
- Flipkart Axis: 5%
- HSBC Cashback: 1.5%',
    'credit-cards', 'published', 'article',
    'Best Cashback Cards 2026 | InvestingPro',
    'Top cashback credit cards.',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    5, 890, 'en',
    'Neha Gupta', 'Credit Card Specialist',
    NOW() - INTERVAL '2 days', CURRENT_DATE - 2
),
(
    'NPS vs PPF: Which is Better?',
    'nps-vs-ppf-comparison',
    'Compare NPS and PPF.',
    'NPS PPF comparison.',
    '# NPS vs PPF
- NPS: 8-12% returns
- PPF: 7.1% fixed
Use both!',
    'retirement', 'published', 'article',
    'NPS vs PPF | InvestingPro',
    'Compare NPS and PPF.',
    'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800',
    10, 620, 'en',
    'Amit Verma', 'Tax Consultant',
    NOW() - INTERVAL '8 days', CURRENT_DATE - 8
),
(
    'Best Fixed Deposit Rates in India 2026',
    'best-fd-rates-2026',
    'Compare FD rates across banks.',
    'FD rates comparison.',
    '# Best FD Rates 2026
- SBI: 7.10%
- HDFC Bank: 7.40%
- Unity SFB: 9.00%',
    'banking', 'published', 'article',
    'Best FD Rates 2026 | InvestingPro',
    'Compare FD rates.',
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
    5, 560, 'en',
    'InvestingPro Team', 'Editorial',
    NOW() - INTERVAL '3 days', CURRENT_DATE - 3
),
(
    'How to Open Demat Account Online',
    'open-demat-account-guide',
    'Step by step guide to open demat.',
    'Demat account guide.',
    '# Open Demat Account
1. Choose broker (Zerodha, Groww)
2. Submit documents
3. Complete e-KYC
4. Start trading',
    'stocks', 'published', 'article',
    'Open Demat Account | InvestingPro',
    'How to open demat online.',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800',
    6, 340, 'en',
    'Rahul Sharma', 'Senior Financial Analyst',
    NOW() - INTERVAL '5 days', CURRENT_DATE - 5
),
(
    'Term Insurance vs Whole Life Insurance',
    'term-vs-whole-life-insurance',
    'Which insurance is better?',
    'Insurance comparison.',
    '# Term vs Whole Life
- Term: Pure protection, low cost
- Whole Life: Savings + protection
Verdict: Term is better for most.',
    'insurance', 'published', 'article',
    'Term vs Whole Life Insurance | InvestingPro',
    'Compare insurance types.',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    8, 420, 'en',
    'InvestingPro Team', 'Editorial',
    NOW() - INTERVAL '7 days', CURRENT_DATE - 7
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- GLOSSARY / DEFINITION ARTICLES
-- =====================================================

INSERT INTO articles (
    title, slug, excerpt, content, body_markdown,
    category, status, content_type,
    read_time, views, language, published_at, published_date
) VALUES
('What is NAV in Mutual Funds?', 'what-is-nav', 'NAV explained simply.', 'NAV definition.', '# NAV (Net Asset Value)\nPer-unit price of mutual fund.', 'mutual-funds', 'published', 'article', 2, 120, 'en', NOW(), CURRENT_DATE),
('What is CAGR?', 'what-is-cagr', 'CAGR explained.', 'CAGR definition.', '# CAGR\nCompound Annual Growth Rate.', 'mutual-funds', 'published', 'article', 2, 95, 'en', NOW(), CURRENT_DATE),
('What is Expense Ratio?', 'what-is-expense-ratio', 'Expense ratio explained.', 'Expense ratio.', '# Expense Ratio\nAnnual fund fee.', 'mutual-funds', 'published', 'article', 2, 88, 'en', NOW(), CURRENT_DATE),
('What is CIBIL Score?', 'what-is-cibil-score', 'CIBIL explained.', 'CIBIL definition.', '# CIBIL Score\nCredit score 300-900.', 'credit-cards', 'published', 'article', 2, 210, 'en', NOW(), CURRENT_DATE),
('What is SIP?', 'what-is-sip', 'SIP explained.', 'SIP definition.', '# SIP\nSystematic Investment Plan.', 'mutual-funds', 'published', 'article', 2, 180, 'en', NOW(), CURRENT_DATE),
('What is Section 80C?', 'what-is-section-80c', '80C explained.', '80C definition.', '# Section 80C\nTax deduction up to 1.5 lakh.', 'tax-planning', 'published', 'article', 2, 340, 'en', NOW(), CURRENT_DATE),
('What is Demat Account?', 'what-is-demat-account', 'Demat explained.', 'Demat definition.', '# Demat Account\nDigital share holding.', 'stocks', 'published', 'article', 2, 156, 'en', NOW(), CURRENT_DATE),
('What is P/E Ratio?', 'what-is-pe-ratio', 'PE ratio explained.', 'PE definition.', '# P/E Ratio\nPrice to Earnings ratio.', 'stocks', 'published', 'article', 2, 178, 'en', NOW(), CURRENT_DATE),
('What is PPF?', 'what-is-ppf', 'PPF explained.', 'PPF definition.', '# PPF\nPublic Provident Fund - tax-free.', 'retirement', 'published', 'article', 2, 230, 'en', NOW(), CURRENT_DATE),
('What is NPS?', 'what-is-nps', 'NPS explained.', 'NPS definition.', '# NPS\nNational Pension System.', 'retirement', 'published', 'article', 2, 190, 'en', NOW(), CURRENT_DATE)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 
    (SELECT COUNT(*) FROM articles) as total_articles,
    (SELECT COUNT(*) FROM articles WHERE content_type = 'pillar') as pillar_pages,
    (SELECT COUNT(*) FROM categories) as categories,
    (SELECT COUNT(*) FROM authors) as authors,
    'Seed content added successfully!' as status;
