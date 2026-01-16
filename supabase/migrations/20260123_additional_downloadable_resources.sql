-- Additional Downloadable Resources
-- More finance dashboards, calculators, and guides

INSERT INTO downloadable_resources (title, description, type, format, category, slug, tags, requires_email) VALUES
('Credit Card Comparison Matrix', 'Compare multiple credit cards side-by-side with rewards, fees, and benefits', 'dashboard', 'excel', 'credit-cards', 'credit-card-comparison-matrix', ARRAY['credit-cards', 'comparison', 'rewards'], true),
('Credit Card Rewards Calculator', 'Calculate how much you can earn in rewards based on your spending patterns', 'template', 'excel', 'credit-cards', 'credit-card-rewards-calculator', ARRAY['credit-cards', 'calculator', 'rewards'], true),
('SIP vs Lump Sum Calculator', 'Compare SIP and lump sum investments to see which works better for you', 'template', 'excel', 'mutual-funds', 'sip-vs-lump-sum-calculator', ARRAY['mutual-funds', 'sip', 'calculator'], true),
('Mutual Fund Portfolio Tracker', 'Track all your mutual fund investments, SIPs, and returns in one place', 'dashboard', 'excel', 'mutual-funds', 'mutual-fund-portfolio-tracker', ARRAY['mutual-funds', 'portfolio', 'tracking'], true),
('Home Loan EMI Calculator & Tracker', 'Calculate EMI, track payments, and see how prepayments affect your loan', 'template', 'excel', 'loans', 'home-loan-emi-calculator', ARRAY['loans', 'home-loan', 'emi', 'calculator'], true),
('Personal Loan Comparison Sheet', 'Compare personal loan offers from multiple banks with interest rates and fees', 'dashboard', 'excel', 'loans', 'personal-loan-comparison', ARRAY['loans', 'personal-loan', 'comparison'], true),
('Income Tax Calculator 2026', 'Calculate your income tax liability with all deductions and exemptions', 'template', 'excel', 'tax', 'income-tax-calculator-2026', ARRAY['tax', 'calculator', '2026', 'income-tax'], true),
('Section 80C Investment Planner', 'Plan your Section 80C investments to maximize tax savings', 'dashboard', 'excel', 'tax', 'section-80c-planner', ARRAY['tax', '80C', 'planning'], true),
('Complete Guide to SIP Investment', 'Everything you need to know about Systematic Investment Plans (SIPs)', 'guide', 'pdf', 'mutual-funds', 'sip-investment-guide', ARRAY['mutual-funds', 'sip', 'guide', 'investing'], true),
('Credit Card Rewards Optimization Guide', 'Learn how to maximize credit card rewards and cashback', 'guide', 'pdf', 'credit-cards', 'credit-card-rewards-guide', ARRAY['credit-cards', 'rewards', 'optimization'], true),
('Emergency Fund Calculator', 'Calculate how much emergency fund you need based on your expenses', 'template', 'excel', 'budget', 'emergency-fund-calculator', ARRAY['budget', 'emergency-fund', 'calculator'], true),
('Retirement Planning Calculator', 'Calculate how much you need to save for retirement', 'template', 'excel', 'retirement', 'retirement-planning-calculator', ARRAY['retirement', 'planning', 'calculator'], true)
ON CONFLICT (slug) DO NOTHING;
