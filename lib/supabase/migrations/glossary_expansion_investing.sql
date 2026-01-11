-- Glossary Enhancement: Add metadata fields and new terms
-- Phase 1: Critical expansion of investing category and new categories

-- Step 1: Add metadata columns to glossary_terms table
ALTER TABLE glossary_terms 
ADD COLUMN IF NOT EXISTS difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS read_time_minutes INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS related_calculator_slug VARCHAR(100),
ADD COLUMN IF NOT EXISTS examples TEXT,
ADD COLUMN IF NOT EXISTS why_it_matters TEXT;

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_glossary_difficulty ON glossary_terms(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_glossary_category ON glossary_terms(category);
CREATE INDEX IF NOT EXISTS idx_glossary_view_count ON glossary_terms(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_glossary_updated ON glossary_terms(last_updated DESC);

-- Step 3: Create related terms table
CREATE TABLE IF NOT EXISTS glossary_term_relations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    term_id UUID REFERENCES glossary_terms(id) ON DELETE CASCADE,
    related_term_id UUID REFERENCES glossary_terms(id) ON DELETE CASCADE,
    relation_type VARCHAR(50) DEFAULT 'related',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(term_id, related_term_id)
);

-- Step 4: Create Term of the Day table
CREATE TABLE IF NOT EXISTS term_of_the_day (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    term_id UUID REFERENCES glossary_terms(id) ON DELETE CASCADE,
    featured_date DATE UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_totd_date ON term_of_the_day(featured_date DESC);

-- Step 5: Insert new INVESTING terms (expanding from 2 to 50+)

-- Basic Investment Concepts (15 terms)
INSERT INTO glossary_terms (term, definition, category, difficulty_level, read_time_minutes, examples, why_it_matters) VALUES
('Asset', 'Anything of value owned by an individual or company that can be converted to cash. Assets include stocks, bonds, real estate, and cash equivalents.', 'investing', 'beginner', 2, 'Your home, car, savings account, and stock portfolio are all assets.', 'Understanding assets helps you calculate your net worth and make informed investment decisions.'),

('Stock', 'A share representing partial ownership in a company. When you buy stock, you become a shareholder with potential rights to dividends and voting.', 'investing', 'beginner', 3, 'If you buy 100 shares of Reliance Industries at ₹2,500 each, you own a tiny fraction of the company worth ₹2,50,000.', 'Stocks are the foundation of wealth building, historically providing higher returns than other asset classes over long periods.'),

('Bond', 'A debt instrument where an investor loans money to a borrower (government or corporation) in exchange for periodic interest payments and return of principal at maturity.', 'investing', 'beginner', 3, 'A 10-year government bond with 7% interest pays you ₹7,000 annually on a ₹1 lakh investment, returning your ₹1 lakh after 10 years.', 'Bonds provide stable income and lower risk compared to stocks, essential for balanced portfolios.'),

('Portfolio', 'A collection of financial investments like stocks, bonds, mutual funds, and other assets owned by an investor.', 'investing', 'beginner', 2, 'Your portfolio might include 60% equity mutual funds, 30% debt funds, and 10% gold.', 'Diversifying your portfolio across asset classes reduces risk while maintaining growth potential.'),

('Dividend', 'A portion of company profits distributed to shareholders, typically paid quarterly or annually in cash or additional shares.', 'investing', 'beginner', 3, 'If you own 1,000 shares of a company paying ₹5 dividend per share, you receive ₹5,000.', 'Dividends provide passive income and signal company financial health.'),

('Equity', 'Ownership interest in a company represented by stock. Also refers to the value of an asset minus debts against it.', 'investing', 'beginner', 2, 'Equity investments include stocks and equity mutual funds. Home equity is your home value minus mortgage.', 'Equity investments offer highest long-term growth potential but come with higher volatility.'),

('Capital', 'Financial assets or resources available for investment or business operations. Can refer to money, property, or equipment.', 'investing', 'beginner', 2, 'Starting a business with ₹10 lakhs means you have ₹10 lakhs in capital.', 'Capital is the fuel for investment growth and business expansion.'),

('Return', 'The gain or loss on an investment over a specified period, expressed as a percentage of the original investment.', 'investing', 'beginner', 2, 'If you invest ₹1 lakh and it grows to ₹1.12 lakh in a year, your return is 12%.', 'Returns measure investment performance and help compare different investment options.'),

('Yield', 'The income return on an investment, expressed as a percentage. For stocks, it''s dividend yield; for bonds, it''s interest yield.', 'investing', 'intermediate', 3, 'A stock priced at ₹1,000 paying ₹40 annual dividend has a 4% dividend yield.', 'Yield helps income-focused investors compare investment options.'),

('Liquidity', 'How quickly an asset can be converted to cash without significant price impact. Cash is most liquid; real estate is illiquid.', 'investing', 'beginner', 2, 'Stocks can be sold in seconds during market hours. Real estate may take months to sell.', 'Liquidity determines how easily you can access your money in emergencies.'),

('Volatility', 'The degree of variation in an investment''s price over time. High volatility means large price swings; low volatility means stable prices.', 'investing', 'intermediate', 3, 'A stock moving between ₹900-₹1,100 monthly is more volatile than one staying ₹990-₹1,010.', 'Understanding volatility helps match investments to your risk tolerance.'),

('Diversification', 'Spreading investments across different assets, sectors, or geographies to reduce risk. The principle of "don''t put all eggs in one basket."', 'investing', 'beginner', 3, 'Instead of buying only tech stocks, invest across IT, pharma, banking, and FMCG sectors.', 'Diversification is the only free lunch in investing - it reduces risk without sacrificing returns.'),

('Market Capitalization', 'Total market value of a company''s outstanding shares, calculated by multiplying share price by total shares. Used to categorize companies as large-cap, mid-cap, or small-cap.', 'investing', 'intermediate', 3, 'A company with 10 crore shares at ₹500 each has a market cap of ₹50,000 crores (large-cap).', 'Market cap indicates company size, stability, and growth potential.'),

('Shareholder', 'An individual or institution that owns shares in a company, giving them ownership rights and potential voting power.', 'investing', 'beginner', 2, 'As a shareholder of 100 Infosys shares, you own a tiny fraction of the company.', 'Shareholders benefit from company growth through dividends and stock price appreciation.'),

('Investment', 'Allocating money or resources with the expectation of generating income or profit over time.', 'investing', 'beginner', 2, 'Buying mutual funds, real estate, or starting a business are all investments.', 'Investing is essential for wealth creation and achieving financial goals.');

-- Investment Vehicles (10 terms)
INSERT INTO glossary_terms (term, definition, category, difficulty_level, read_time_minutes, examples, why_it_matters) VALUES
('ETF', 'Exchange-Traded Fund - an investment fund that tracks an index, commodity, or basket of assets and trades on stock exchanges like individual stocks.', 'investing', 'intermediate', 4, 'Nifty 50 ETF tracks the Nifty 50 index, giving you exposure to top 50 Indian companies in one investment.', 'ETFs offer diversification, low costs, and liquidity, making them ideal for passive investors.'),

('Index Fund', 'A mutual fund designed to track the performance of a specific market index like Nifty 50 or Sensex by holding the same stocks in the same proportions.', 'investing', 'intermediate', 3, 'A Nifty 50 index fund holds all 50 Nifty stocks, automatically matching the index performance.', 'Index funds provide market returns at low cost, outperforming most actively managed funds over time.'),

('Hedge Fund', 'A pooled investment fund using advanced strategies like leverage, derivatives, and short-selling to generate returns regardless of market direction. Typically for wealthy investors.', 'investing', 'advanced', 4, 'A hedge fund might short overvalued stocks while buying undervalued ones to profit in any market.', 'Hedge funds offer sophisticated strategies but come with high fees and risks.'),

('REIT', 'Real Estate Investment Trust - a company that owns, operates, or finances income-producing real estate, allowing investors to earn real estate returns without buying property.', 'investing', 'intermediate', 4, 'Embassy Office Parks REIT owns commercial properties and distributes 90% of rental income to investors.', 'REITs provide real estate exposure with liquidity, diversification, and regular income.'),

('Unit Trust', 'An investment vehicle where investors'' money is pooled and invested in a diversified portfolio managed by professionals. Similar to mutual funds.', 'investing', 'intermediate', 3, 'Unit trusts pool money from thousands of investors to buy a diversified portfolio of stocks and bonds.', 'Unit trusts offer professional management and diversification for small investors.'),

('Closed-End Fund', 'An investment fund with a fixed number of shares that trade on exchanges. Unlike mutual funds, shares aren''t redeemed directly with the fund.', 'investing', 'advanced', 4, 'A closed-end fund issues 1 crore shares at launch; investors buy/sell these shares on the stock exchange.', 'Closed-end funds can trade at premiums or discounts to NAV, creating opportunities for savvy investors.'),

('Open-End Fund', 'A mutual fund that continuously issues and redeems shares at NAV, with no limit on shares outstanding. Most mutual funds are open-end.', 'investing', 'intermediate', 3, 'You can buy or redeem mutual fund units any business day at the current NAV.', 'Open-end funds provide liquidity and flexibility for investors to enter or exit anytime.'),

('Money Market Fund', 'A mutual fund investing in short-term, high-quality debt instruments like treasury bills and commercial paper, offering stability and liquidity.', 'investing', 'beginner', 3, 'Money market funds invest in 30-90 day government securities, providing 4-6% returns with minimal risk.', 'Money market funds are ideal for parking emergency funds or short-term savings.'),

('Balanced Fund', 'A mutual fund investing in both stocks and bonds to balance growth potential with stability. Typically maintains a fixed equity-debt ratio.', 'investing', 'beginner', 3, 'A balanced fund might hold 60% stocks for growth and 40% bonds for stability.', 'Balanced funds offer one-stop diversification suitable for moderate-risk investors.'),

('Debt Fund', 'A mutual fund primarily investing in fixed-income securities like bonds, government securities, and corporate debt.', 'investing', 'beginner', 3, 'Debt funds invest in government bonds, corporate bonds, and money market instruments for steady returns.', 'Debt funds provide stable returns with lower risk than equity funds, ideal for conservative investors.');

-- Key Metrics (15 terms)
INSERT INTO glossary_terms (term, definition, category, difficulty_level, read_time_minutes, related_calculator_slug, examples, why_it_matters) VALUES
('Alpha', 'Excess return generated by an investment compared to its benchmark index. Positive alpha indicates outperformance; negative alpha indicates underperformance.', 'investing', 'intermediate', 4, 'sip', 'If Nifty 50 returns 12% and your fund returns 15%, the alpha is 3%, showing the manager added 3% value.', 'Alpha measures fund manager skill in beating the market through stock selection and timing.'),

('Beta', 'A measure of an investment''s volatility relative to the overall market. Beta of 1 means moves with market; >1 means more volatile; <1 means less volatile.', 'investing', 'intermediate', 4, NULL, 'A stock with beta 1.5 typically moves 15% when the market moves 10%.', 'Beta helps investors understand and manage portfolio risk relative to market movements.'),

('P/E Ratio', 'Price-to-Earnings Ratio - stock price divided by earnings per share. Indicates how much investors pay for each rupee of company earnings.', 'investing', 'intermediate', 4, NULL, 'A stock at ₹1,000 with EPS of ₹50 has a P/E of 20, meaning investors pay ₹20 for every ₹1 of earnings.', 'P/E ratio helps identify overvalued or undervalued stocks compared to peers and historical averages.'),

('ROI', 'Return on Investment - percentage gain or loss on an investment relative to the amount invested.', 'investing', 'beginner', 2, 'sip', 'Investing ₹1 lakh that grows to ₹1.3 lakh gives 30% ROI.', 'ROI is the fundamental metric for comparing investment performance across different options.'),

('CAGR', 'Compound Annual Growth Rate - the mean annual growth rate of an investment over a specified period longer than one year.', 'investing', 'intermediate', 3, 'sip', 'An investment growing from ₹1 lakh to ₹1.61 lakh in 5 years has a CAGR of 10%.', 'CAGR smooths out volatility to show true long-term investment performance.'),

('Sharpe Ratio', 'A measure of risk-adjusted return, calculated by dividing excess return by standard deviation. Higher Sharpe ratio indicates better risk-adjusted performance.', 'investing', 'advanced', 4, NULL, 'A fund with 15% return and 10% volatility has a better Sharpe ratio than one with 16% return and 15% volatility.', 'Sharpe ratio helps compare investments with different risk levels on an equal footing.'),

('Dividend Yield', 'Annual dividend per share divided by stock price, expressed as a percentage. Measures income return from dividends.', 'investing', 'intermediate', 3, NULL, 'A ₹1,000 stock paying ₹40 annual dividend has a 4% dividend yield.', 'Dividend yield helps income investors identify stocks providing steady cash flow.'),

('EPS', 'Earnings Per Share - company''s net profit divided by number of outstanding shares. Indicates profitability per share.', 'investing', 'intermediate', 3, NULL, 'A company with ₹100 crore profit and 2 crore shares has EPS of ₹50.', 'EPS growth indicates improving company profitability and potential for stock price appreciation.'),

('NAV', 'Net Asset Value - per-unit market value of a mutual fund, calculated by dividing total assets minus liabilities by number of units.', 'investing', 'beginner', 3, NULL, 'A fund with ₹1,000 crore assets, ₹10 crore liabilities, and 100 crore units has NAV of ₹9.90.', 'NAV is the price at which you buy or sell mutual fund units.'),

('Expense Ratio', 'Annual fee charged by mutual funds as a percentage of assets, covering management fees, administrative costs, and other expenses.', 'investing', 'beginner', 3, NULL, 'A fund with 1.5% expense ratio charges ₹1,500 annually on a ₹1 lakh investment.', 'Lower expense ratios mean more of your returns stay in your pocket, significantly impacting long-term wealth.'),

('P/B Ratio', 'Price-to-Book Ratio - stock price divided by book value per share. Indicates how much investors pay for company''s net assets.', 'investing', 'intermediate', 3, NULL, 'A stock at ₹500 with book value of ₹250 has P/B ratio of 2.', 'P/B ratio helps identify undervalued stocks, especially useful for asset-heavy companies like banks.'),

('Standard Deviation', 'A statistical measure of investment return volatility. Higher standard deviation means greater price fluctuations and risk.', 'investing', 'advanced', 4, NULL, 'A fund with 15% standard deviation typically sees returns vary ±15% from its average in most years.', 'Standard deviation quantifies investment risk, helping match investments to risk tolerance.'),

('Debt-to-Equity Ratio', 'Company''s total debt divided by shareholder equity. Indicates financial leverage and risk level.', 'investing', 'intermediate', 3, NULL, 'A company with ₹500 crore debt and ₹1,000 crore equity has a D/E ratio of 0.5.', 'D/E ratio reveals how much a company relies on debt vs. equity financing, indicating financial stability.'),

('Free Cash Flow', 'Cash a company generates after accounting for capital expenditures. Indicates ability to pay dividends, reduce debt, or invest in growth.', 'investing', 'advanced', 4, NULL, 'A company with ₹1,000 crore operating cash flow and ₹300 crore capex has ₹700 crore free cash flow.', 'Free cash flow shows true financial health better than accounting profits.'),

('Trailing Returns', 'Investment returns over a past period (1-year, 3-year, 5-year) calculated from current date backwards.', 'investing', 'beginner', 2, 'sip', 'A fund''s 3-year trailing return shows performance over the last 36 months from today.', 'Trailing returns help evaluate recent fund performance and manager consistency.');

-- Market Terms (10 terms)
INSERT INTO glossary_terms (term, definition, category, difficulty_level, read_time_minutes, examples, why_it_matters) VALUES
('Bull Market', 'A market condition where prices are rising or expected to rise, typically characterized by investor optimism and economic growth.', 'investing', 'beginner', 3, 'The 2020-2021 period saw a bull market with Nifty rising from 7,500 to 18,000.', 'Recognizing bull markets helps investors capitalize on upward trends and adjust strategies.'),

('Bear Market', 'A market condition where prices fall 20% or more from recent highs, typically characterized by pessimism and economic concerns.', 'investing', 'beginner', 3, 'The March 2020 COVID crash was a bear market with Nifty falling from 12,000 to 7,500.', 'Understanding bear markets helps investors avoid panic selling and identify buying opportunities.'),

('Market Correction', 'A decline of 10-20% from recent market highs, considered a normal part of market cycles and less severe than a bear market.', 'investing', 'intermediate', 3, 'A correction occurs when Nifty falls from 18,000 to 15,000 (16.7% decline).', 'Corrections present buying opportunities for long-term investors without signaling major economic problems.'),

('IPO', 'Initial Public Offering - when a private company first sells shares to the public, becoming a publicly-traded company.', 'investing', 'beginner', 4, 'Zomato''s 2021 IPO allowed public investors to buy shares for the first time at ₹76 per share.', 'IPOs offer early investment opportunities in growing companies but come with higher risks.'),

('Stock Exchange', 'A regulated marketplace where stocks, bonds, and other securities are bought and sold. NSE and BSE are India''s main exchanges.', 'investing', 'beginner', 3, 'NSE (National Stock Exchange) and BSE (Bombay Stock Exchange) facilitate trading of Indian stocks.', 'Stock exchanges provide liquidity, price discovery, and investor protection for securities trading.'),

('Trading Volume', 'The number of shares or contracts traded in a security or market during a given period, indicating liquidity and investor interest.', 'investing', 'intermediate', 3, 'High trading volume of 10 lakh shares daily indicates strong investor interest and easy buying/selling.', 'Volume confirms price trends and indicates how easily you can buy or sell without affecting price.'),

('Bid-Ask Spread', 'The difference between the highest price a buyer is willing to pay (bid) and the lowest price a seller will accept (ask).', 'investing', 'intermediate', 3, 'If buyers bid ₹1,000 and sellers ask ₹1,002, the spread is ₹2.', 'Narrow spreads indicate liquid markets with lower trading costs; wide spreads mean higher costs.'),

('Market Order', 'An order to buy or sell a security immediately at the best available current price, prioritizing speed over price.', 'investing', 'beginner', 2, 'A market order to buy 100 shares executes instantly at the current ask price.', 'Market orders ensure execution but may result in unexpected prices during volatile markets.'),

('Limit Order', 'An order to buy or sell a security at a specific price or better, prioritizing price over immediate execution.', 'investing', 'intermediate', 3, 'A limit buy order at ₹1,000 only executes if the stock price falls to ₹1,000 or below.', 'Limit orders give price control but may not execute if the market doesn''t reach your price.'),

('Circuit Breaker', 'Trading halt triggered when a stock or index moves beyond a specified percentage limit in a single day, designed to prevent panic.', 'investing', 'intermediate', 3, 'If Nifty falls 10% in a day, trading halts for 45 minutes to allow investors to reassess.', 'Circuit breakers protect investors from extreme volatility and allow time for rational decision-making.');

-- Update existing investing terms with metadata
UPDATE glossary_terms 
SET difficulty_level = 'intermediate',
    read_time_minutes = 3,
    last_updated = NOW()
WHERE category = 'investing' 
AND difficulty_level IS NULL;

COMMIT;
