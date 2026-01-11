-- Glossary Enhancement: Add Banking, Economy, Personal Finance, and Cryptocurrency categories
-- Phase 1 Part 2: New category terms

-- BANKING CATEGORY (20 terms)
INSERT INTO glossary_terms (term, definition, category, difficulty_level, read_time_minutes, examples, why_it_matters) VALUES
('Savings Account', 'A deposit account at a bank that earns interest and allows easy withdrawals, designed for storing money safely while earning modest returns.', 'banking', 'beginner', 2, 'A savings account with 4% interest earns ₹4,000 annually on ₹1 lakh balance.', 'Savings accounts provide liquidity for emergency funds while earning interest on idle cash.'),

('Checking Account', 'A transactional bank account for daily expenses with unlimited deposits and withdrawals, typically earning little or no interest. Called Current Account in India.', 'banking', 'beginner', 2, 'Current accounts allow unlimited transactions for business operations without earning interest.', 'Checking accounts facilitate daily financial transactions and bill payments.'),

('APY', 'Annual Percentage Yield - the effective annual rate of return taking into account compound interest, showing true earning potential.', 'banking', 'intermediate', 3, 'A 6% APY account earns more than 6% simple interest due to compounding.', 'APY helps compare savings products accurately by accounting for compounding frequency.'),

('APR', 'Annual Percentage Rate - the yearly interest rate charged on loans or credit cards, not including compounding effects.', 'banking', 'beginner', 3, 'A credit card with 36% APR charges 3% monthly interest on outstanding balances.', 'APR reveals the true cost of borrowing, essential for comparing loan offers.'),

('Interest Rate', 'The percentage charged by lenders for borrowing money or paid by banks on deposits, expressed annually.', 'banking', 'beginner', 2, 'A 7% interest rate on a ₹10 lakh loan means paying ₹70,000 annually in interest.', 'Interest rates determine borrowing costs and savings growth, affecting all financial decisions.'),

('Compound Interest', 'Interest calculated on initial principal plus accumulated interest from previous periods, causing exponential growth over time.', 'banking', 'beginner', 4, 'Investing ₹1 lakh at 10% compound interest grows to ₹2.59 lakhs in 10 years vs. ₹2 lakhs with simple interest.', 'Compound interest is the most powerful force in wealth building, making early investing crucial.'),

('FDIC Insurance', 'Federal Deposit Insurance Corporation protection (in US). In India, DICGC insures deposits up to ₹5 lakhs per depositor per bank.', 'banking', 'intermediate', 3, 'If your bank fails, DICGC protects up to ₹5 lakhs of your deposits.', 'Deposit insurance protects your savings from bank failures, ensuring financial security.'),

('DICGC', 'Deposit Insurance and Credit Guarantee Corporation - insures bank deposits up to ₹5 lakhs per depositor per bank in India.', 'banking', 'intermediate', 3, 'DICGC covers ₹5 lakhs across all your accounts (savings + FD) in one bank.', 'Understanding DICGC limits helps you distribute deposits across banks for full protection.'),

('Overdraft', 'A credit facility allowing account holders to withdraw more money than available in their account, up to an approved limit, with interest charged on the excess.', 'banking', 'intermediate', 3, 'An overdraft facility of ₹50,000 lets you withdraw even with zero balance, charging interest only on the amount used.', 'Overdrafts provide emergency liquidity but come with high interest rates.'),

('Minimum Balance', 'The minimum amount required to be maintained in a bank account to avoid penalty charges.', 'banking', 'beginner', 2, 'A savings account requiring ₹10,000 minimum balance charges ₹500 penalty if balance falls below.', 'Understanding minimum balance requirements helps avoid unnecessary fees.'),

('Wire Transfer', 'Electronic transfer of funds between banks, typically for large amounts or international transactions.', 'banking', 'beginner', 2, 'Wire transfers move money between banks within hours, useful for property purchases or international payments.', 'Wire transfers enable quick, secure movement of large sums across banks and countries.'),

('NEFT', 'National Electronic Funds Transfer - an Indian system for transferring funds between banks, settled in hourly batches.', 'banking', 'beginner', 2, 'NEFT transfers up to ₹2 lakhs typically complete within 2-3 hours during banking hours.', 'NEFT provides a reliable, low-cost method for inter-bank transfers.'),

('RTGS', 'Real Time Gross Settlement - instant fund transfer system for amounts ₹2 lakhs and above, settled individually in real-time.', 'banking', 'beginner', 2, 'RTGS transfers ₹5 lakhs instantly during banking hours with higher fees than NEFT.', 'RTGS enables immediate large-value transfers for time-sensitive transactions.'),

('IMPS', 'Immediate Payment Service - 24x7 instant fund transfer system available on mobile and internet banking for amounts up to ₹5 lakhs.', 'banking', 'beginner', 2, 'IMPS transfers ₹50,000 instantly even at midnight or on holidays.', 'IMPS provides round-the-clock instant transfers for urgent payments.'),

('UPI', 'Unified Payments Interface - instant payment system enabling inter-bank transfers using mobile numbers or virtual addresses.', 'banking', 'beginner', 3, 'UPI lets you send ₹5,000 to a friend using just their phone number or UPI ID like name@bankname.', 'UPI revolutionized digital payments in India with its simplicity and zero-cost instant transfers.'),

('Certificate of Deposit', 'A time deposit with a fixed term and interest rate, penalizing early withdrawals. Called Fixed Deposit (FD) in India.', 'banking', 'beginner', 3, 'A 1-year CD at 7% interest locks your ₹1 lakh for a year, earning ₹7,000.', 'CDs offer higher interest than savings accounts in exchange for locking funds for a fixed period.'),

('Debit Card', 'A payment card linked to your bank account that deducts money directly from your balance for purchases.', 'banking', 'beginner', 2, 'Using a debit card to buy groceries for ₹2,000 immediately deducts ₹2,000 from your account.', 'Debit cards provide convenient access to your money without borrowing or interest charges.'),

('Direct Deposit', 'Electronic transfer of salary or payments directly into a bank account, eliminating paper checks.', 'banking', 'beginner', 2, 'Your employer deposits your ₹80,000 monthly salary directly into your account on the 1st of each month.', 'Direct deposit provides faster, more secure access to your income.'),

('Bank Statement', 'A detailed record of all transactions in your account over a specific period, showing deposits, withdrawals, and balance.', 'banking', 'beginner', 2, 'Monthly bank statements help track spending, verify transactions, and detect fraud.', 'Regular statement review helps manage finances and catch unauthorized transactions early.'),

('Routing Number', 'A 9-digit code identifying a specific bank for electronic transfers. In India, IFSC code serves this purpose.', 'banking', 'beginner', 2, 'IFSC code SBIN0001234 identifies a specific SBI branch for NEFT/RTGS transfers.', 'Routing numbers ensure funds reach the correct bank and branch for transfers.');

-- ECONOMY CATEGORY (15 terms)
INSERT INTO glossary_terms (term, definition, category, difficulty_level, read_time_minutes, examples, why_it_matters) VALUES
('Inflation', 'The rate at which the general level of prices for goods and services rises, eroding purchasing power over time.', 'economy', 'beginner', 4, 'If inflation is 6%, items costing ₹100 today will cost ₹106 next year.', 'Inflation affects investment returns, savings value, and cost of living - understanding it is crucial for financial planning.'),

('Deflation', 'A decrease in the general price level of goods and services, opposite of inflation, often signaling economic problems.', 'economy', 'intermediate', 3, 'During deflation, a ₹100 item might cost ₹95 next year, but this often indicates economic weakness.', 'Deflation can lead to delayed purchases and economic slowdown, affecting investments and employment.'),

('GDP', 'Gross Domestic Product - the total value of all goods and services produced within a country in a specific period, measuring economic size and growth.', 'economy', 'beginner', 4, 'India''s GDP of $3.7 trillion makes it the world''s 5th largest economy.', 'GDP growth indicates economic health and affects stock markets, employment, and investment opportunities.'),

('CPI', 'Consumer Price Index - measures average change in prices paid by consumers for goods and services, used to calculate inflation.', 'economy', 'intermediate', 3, 'If CPI rises from 100 to 106, consumer prices increased 6% (inflation rate).', 'CPI directly affects your purchasing power and is used to adjust salaries, pensions, and investments.'),

('Repo Rate', 'The interest rate at which RBI lends money to commercial banks, used to control money supply and inflation.', 'economy', 'intermediate', 4, 'When RBI increases repo rate from 6% to 6.5%, banks raise lending rates, making loans more expensive.', 'Repo rate changes affect your loan EMIs, FD returns, and overall economic activity.'),

('Reverse Repo Rate', 'The interest rate at which RBI borrows money from commercial banks, used to absorb excess liquidity from the banking system.', 'economy', 'intermediate', 3, 'A 5.5% reverse repo rate incentivizes banks to park excess funds with RBI instead of lending.', 'Reverse repo rate affects bank lending behavior and overall credit availability in the economy.'),

('Recession', 'A significant decline in economic activity lasting more than a few months, typically defined as two consecutive quarters of negative GDP growth.', 'economy', 'beginner', 4, 'The 2008 recession saw GDP contract, unemployment rise, and stock markets crash globally.', 'Recessions affect jobs, investments, and business opportunities - recognizing them helps protect wealth.'),

('Fiscal Policy', 'Government''s use of taxation and spending to influence the economy, managed by the Finance Ministry.', 'economy', 'intermediate', 4, 'Reducing taxes and increasing infrastructure spending is expansionary fiscal policy to boost growth.', 'Fiscal policy affects economic growth, inflation, and investment opportunities across sectors.'),

('Monetary Policy', 'Central bank''s management of money supply and interest rates to achieve economic goals like price stability and growth.', 'economy', 'intermediate', 4, 'RBI''s monetary policy committee meets bi-monthly to decide repo rate and control inflation.', 'Monetary policy directly impacts loan rates, deposit returns, and currency value.'),

('Interest Rate', 'The cost of borrowing money or return on savings, set by central banks and adjusted by commercial banks.', 'economy', 'beginner', 3, 'When RBI raises interest rates, borrowing becomes expensive and saving becomes attractive.', 'Interest rates are the most important economic variable affecting all financial decisions.'),

('Unemployment Rate', 'Percentage of labor force actively seeking work but unable to find jobs, indicating economic health.', 'economy', 'beginner', 3, 'An unemployment rate of 7% means 7 out of 100 people in the workforce are jobless.', 'Unemployment affects consumer spending, economic growth, and social stability.'),

('Trade Deficit', 'When a country imports more goods and services than it exports, resulting in negative trade balance.', 'economy', 'intermediate', 3, 'India''s trade deficit of $200 billion means imports exceed exports by that amount annually.', 'Trade deficits affect currency value, foreign reserves, and economic stability.'),

('Foreign Exchange Reserves', 'Foreign currency assets held by a central bank to back liabilities and influence monetary policy.', 'economy', 'intermediate', 4, 'India''s forex reserves of $600 billion provide cushion against economic shocks and currency volatility.', 'Forex reserves indicate economic strength and ability to handle external shocks.'),

('Stagflation', 'An economic condition combining stagnant growth, high unemployment, and high inflation simultaneously.', 'economy', 'advanced', 4, 'The 1970s stagflation saw economies with 10% inflation and 10% unemployment simultaneously.', 'Stagflation is particularly challenging as traditional policy tools become ineffective.'),

('Economic Growth', 'Increase in production of goods and services in an economy over time, measured by GDP growth rate.', 'economy', 'beginner', 3, '7% economic growth means the economy produces 7% more goods and services than the previous year.', 'Economic growth creates jobs, increases incomes, and improves living standards.');

-- PERSONAL FINANCE CATEGORY (12 terms)
INSERT INTO glossary_terms (term, definition, category, difficulty_level, read_time_minutes, related_calculator_slug, examples, why_it_matters) VALUES
('Budget', 'A financial plan allocating income to expenses, savings, and debt payments over a specific period.', 'personal_finance', 'beginner', 3, NULL, 'A monthly budget might allocate ₹80,000 salary: ₹30,000 rent, ₹20,000 expenses, ₹15,000 savings, ₹15,000 investments.', 'Budgeting is the foundation of financial success, ensuring you live within means and achieve goals.'),

('Emergency Fund', 'Savings set aside for unexpected expenses like medical emergencies, job loss, or urgent repairs, typically 3-6 months of expenses.', 'personal_finance', 'beginner', 4, NULL, 'With ₹40,000 monthly expenses, an emergency fund should be ₹1.2-2.4 lakhs.', 'Emergency funds prevent debt during crises and provide financial security and peace of mind.'),

('Net Worth', 'Total assets minus total liabilities, representing your true financial position.', 'personal_finance', 'beginner', 3, NULL, 'Assets of ₹50 lakhs (home, investments) minus ₹20 lakhs debt equals ₹30 lakhs net worth.', 'Net worth tracks wealth building progress better than income alone.'),

('Debt-to-Income Ratio', 'Monthly debt payments divided by gross monthly income, indicating debt burden and borrowing capacity.', 'personal_finance', 'intermediate', 3, 'EMIs of ₹30,000 on ₹1 lakh income gives 30% debt-to-income ratio.', 'Lenders use this ratio to assess loan eligibility; keeping it below 40% is recommended.'),

('Credit Score', 'A numerical representation (300-900) of creditworthiness based on credit history, affecting loan approval and interest rates.', 'personal_finance', 'beginner', 4, 'A 750+ credit score qualifies for best loan rates; below 650 may face rejections.', 'Good credit scores save lakhs in interest over a lifetime and unlock better financial products.'),

('CIBIL Score', 'Credit Information Bureau India Limited score - India''s most widely used credit score ranging from 300-900.', 'personal_finance', 'beginner', 3, 'A CIBIL score of 800 indicates excellent credit history and timely repayments.', 'CIBIL score determines loan approval, interest rates, and credit card limits in India.'),

('Financial Planning', 'The process of setting financial goals and creating strategies to achieve them through budgeting, saving, investing, and risk management.', 'personal_finance', 'beginner', 4, NULL, 'Financial planning includes retirement planning, children''s education, home purchase, and emergency preparedness.', 'Comprehensive financial planning ensures you achieve life goals without financial stress.'),

('Retirement Planning', 'Preparing financially for post-retirement life through systematic savings and investments to maintain desired lifestyle.', 'personal_finance', 'intermediate', 4, 'retirement', 'Starting SIP of ₹10,000 at age 30 can build a ₹3 crore retirement corpus by 60.', 'Early retirement planning leverages compounding to build substantial wealth with smaller contributions.'),

('Asset Allocation', 'Dividing investments among different asset classes (stocks, bonds, real estate, gold) based on goals, risk tolerance, and time horizon.', 'personal_finance', 'intermediate', 4, 'sip', 'A 30-year-old might allocate 70% equity, 20% debt, 10% gold for long-term growth.', 'Proper asset allocation is the primary determinant of portfolio returns and risk.'),

('Diversification', 'Spreading investments across various assets, sectors, and geographies to reduce risk without sacrificing returns.', 'personal_finance', 'beginner', 3, 'sip', 'Instead of buying only IT stocks, invest across IT, pharma, banking, FMCG, and international markets.', 'Diversification is the only free lunch in investing - reduces risk without reducing expected returns.'),

('Financial Independence', 'Having sufficient wealth to live without working, where passive income covers all expenses.', 'personal_finance', 'intermediate', 4, 'retirement', 'Achieving ₹2 crore corpus generating ₹12 lakhs annual income (6% yield) to cover ₹1 lakh monthly expenses.', 'Financial independence provides freedom to pursue passions without financial constraints.'),

('Passive Income', 'Earnings from investments, rental property, or businesses requiring minimal active involvement.', 'personal_finance', 'intermediate', 3, NULL, 'Rental income of ₹30,000 monthly or dividend income of ₹50,000 annually are passive income sources.', 'Building passive income streams creates financial security and freedom.');

-- CRYPTOCURRENCY CATEGORY (8 terms)
INSERT INTO glossary_terms (term, definition, category, difficulty_level, read_time_minutes, examples, why_it_matters) VALUES
('Bitcoin', 'The first and largest cryptocurrency by market cap, created in 2009 as a decentralized digital currency operating without central authority.', 'cryptocurrency', 'beginner', 4, 'Bitcoin reached $69,000 in 2021, making early investors millionaires.', 'Bitcoin pioneered blockchain technology and remains the dominant cryptocurrency.'),

('Cryptocurrency', 'Digital or virtual currency using cryptography for security, operating on decentralized networks based on blockchain technology.', 'cryptocurrency', 'beginner', 4, 'Bitcoin, Ethereum, and Ripple are popular cryptocurrencies traded globally.', 'Cryptocurrencies represent a new asset class with potential for high returns and high risk.'),

('Blockchain', 'A distributed ledger technology recording transactions across multiple computers, making records immutable and transparent.', 'cryptocurrency', 'intermediate', 5, 'Bitcoin blockchain records every transaction ever made, visible to everyone but impossible to alter.', 'Blockchain enables trustless transactions and has applications beyond cryptocurrency.'),

('Wallet', 'A digital tool for storing, sending, and receiving cryptocurrencies, containing private keys for accessing your crypto assets.', 'cryptocurrency', 'beginner', 3, 'MetaMask and Ledger are popular crypto wallets for storing Bitcoin and Ethereum.', 'Proper wallet security is crucial as lost keys mean permanently lost cryptocurrency.'),

('Mining', 'The process of validating cryptocurrency transactions and adding them to the blockchain, rewarded with new coins.', 'cryptocurrency', 'intermediate', 4, 'Bitcoin miners use powerful computers to solve complex problems, earning Bitcoin as reward.', 'Mining secures blockchain networks but consumes significant energy.'),

('Altcoin', 'Any cryptocurrency other than Bitcoin, including Ethereum, Ripple, Litecoin, and thousands of others.', 'cryptocurrency', 'beginner', 3, 'Ethereum is the second-largest altcoin, known for smart contract functionality.', 'Altcoins offer diverse features and investment opportunities beyond Bitcoin.'),

('DeFi', 'Decentralized Finance - financial services like lending, borrowing, and trading built on blockchain without traditional intermediaries.', 'cryptocurrency', 'advanced', 5, 'Uniswap and Aave enable crypto lending and trading without banks or brokers.', 'DeFi promises to democratize finance but comes with technical complexity and risks.'),

('Ethereum', 'The second-largest cryptocurrency platform enabling smart contracts and decentralized applications (dApps).', 'cryptocurrency', 'intermediate', 4, 'Ethereum powers NFTs, DeFi applications, and thousands of tokens built on its blockchain.', 'Ethereum''s smart contract capability makes it the foundation for blockchain innovation.');

COMMIT;
