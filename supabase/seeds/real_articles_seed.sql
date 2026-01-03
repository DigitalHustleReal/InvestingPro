-- =====================================================
-- SEED: Real Financial Articles
-- =====================================================

-- 1. DELETE EXISTING DEMO ARTICLES
DELETE FROM articles;

-- 2. INSERT REAL ARTICLES
INSERT INTO articles (
    title, 
    slug, 
    excerpt, 
    category, 
    featured_image, 
    published_at, 
    read_time, 
    views, 
    author_name, 
    content, 
    tags, 
    status,
    created_at,
    updated_at
) VALUES 
(
    'Market Outlook 2026: Why Indian Equities Are Poised for a Bull Run',
    'market-outlook-2026-indian-equities-bull-run',
    'With strong GDP growth and robust corporate earnings, the Nifty 50 is eyeing new highs. Here is our comprehensive sector-wise analysis for the coming year.',
    'market-analysis',
    'https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=1000&auto=format&fit=crop',
    NOW() - INTERVAL '2 days',
    8,
    1250,
    'Rajesh Kumar',
    '<h1>Market Outlook 2026</h1><p>The Indian equity market is currently in a sweet spot...</p>',
    ARRAY['market-outlook', 'nifty-50', 'stocks', 'investing'],
    'published',
    NOW(),
    NOW()
),
(
    'Best Credit Cards for Airport Lounge Access in India (2026 Guide)',
    'best-credit-cards-airport-lounge-access-india-2026',
    'Travel in style without breaking the bank. We compare the top 5 credit cards offering complimentary domestic and international lounge access.',
    'credit-cards',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1000&auto=format&fit=crop',
    NOW() - INTERVAL '5 days',
    6,
    3400,
    'Priya Sharma',
    '<h1>Top Travel Credit Cards</h1><p>Airport lounge access has become a coveted perk...</p>',
    ARRAY['credit-cards', 'travel', 'lifestyle', 'hdfc'],
    'published',
    NOW(),
    NOW()
),
(
    'Mutual Funds vs Fixed Deposits: Where Should You Park Your Emergency Fund?',
    'mutual-funds-vs-fd-emergency-fund',
    'While FDs offer safety, Liquid Funds offer better tax-adjusted returns. We breakdown the pros and cons of each for your safety net.',
    'personal-finance',
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1000&auto=format&fit=crop',
    NOW() - INTERVAL '1 week',
    5,
    980,
    'Amit Patel',
    '<h1>Building an Emergency Fund</h1><p>Liquidity and safety are the two pillars of an emergency fund...</p>',
    ARRAY['mutual-funds', 'fixed-deposits', 'savings', 'emergency-fund'],
    'published',
    NOW(),
    NOW()
),
(
    'Demystifying Health Insurance: Top-Up vs Super Top-Up Plans',
    'health-insurance-top-up-vs-super-top-up',
    'Don''t let medical inflation eat your savings. Understand how Top-Up plans can enhance your coverage at a fraction of the cost.',
    'insurance',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1000&auto=format&fit=crop',
    NOW() - INTERVAL '10 days',
    7,
    1500,
    'Dr. Sneha Gupta',
    '<h1>Healthcare Costs are Rising</h1><p>A base policy of 5 Lakhs is no longer sufficient...</p>',
    ARRAY['health-insurance', 'financial-planning', 'risk-management'],
    'published',
    NOW(),
    NOW()
);
