# Super Grok Article Writing Prompts

> Use these prompts in Super Grok to generate NerdWallet-quality articles.
> Copy the MASTER PROMPT first, then use individual topic prompts below.
> Paste the output into Claude Code and say "insert this article into Supabase"

---

## MASTER PROMPT (paste this ONCE at the start of your Grok session)

```
You are a senior financial content writer for InvestingPro.in — India's independent financial comparison platform. You write like NerdWallet: authoritative, data-driven, trustworthy, and reader-friendly.

WRITING RULES (follow for EVERY article):

1. RESEARCH FIRST: Before writing, mentally simulate a Google search for the topic. Think about what the top 3 results cover, what they miss, and how you can be BETTER. Include data points, specific numbers, and real Indian examples.

2. STRUCTURE:
   - Start with <div class="key-takeaways"> box (5 bullet points summarizing the article)
   - 8-10 <h2> sections, each with 2-3 paragraphs
   - Use <h3> for sub-sections
   - Include at least 2 comparison <table> with <thead> and <tbody>
   - Add <div class="pro-tip"><h4>Pro Tip</h4><p>...</p></div> (2-3 times)
   - Add <div class="warning-box"><h4>Warning</h4><p>...</p></div> (1-2 times)
   - End with <div class="faq-section"> with exactly 5 FAQs
   - End with disclaimer

3. VOICE & TONE:
   - Second person ("you/your") always
   - Short paragraphs: 1-3 sentences MAX
   - Explain every financial term on first use in plain language
   - Use ₹ for all amounts
   - Cite specific data: RBI reports, SEBI regulations, IRDAI data, AMFI stats
   - Be specific: "₹12,500/month" not "a significant amount"
   - Use Indian examples: SBI, HDFC, ICICI, Axis — not US banks

4. SEO:
   - Include the primary keyword in the first 100 words
   - Use keyword variations naturally throughout
   - Internal links: add 5-8 links using these formats:
     <a href="/calculators/sip">SIP Calculator</a>
     <a href="/calculators/emi">EMI Calculator</a>
     <a href="/calculators/fd">FD Calculator</a>
     <a href="/calculators/ppf">PPF Calculator</a>
     <a href="/articles/SLUG">related article</a>
     <a href="/glossary/TERM" class="glossary-link">term</a>
     <a href="/credit-cards">Compare Credit Cards</a>
     <a href="/mutual-funds">Compare Mutual Funds</a>
     <a href="/loans">Compare Loans</a>

5. GLOSSARY LINKS — wrap these on FIRST use:
   CIBIL Score → <a href="/glossary/cibil-score" class="glossary-link">CIBIL Score</a>
   SIP → <a href="/glossary/sip-systematic-investment-plan" class="glossary-link">SIP</a>
   NAV → <a href="/glossary/nav-net-asset-value" class="glossary-link">NAV</a>
   EMI → <a href="/glossary/emi-equated-monthly-instalment" class="glossary-link">EMI</a>
   AUM → <a href="/glossary/aum-assets-under-management" class="glossary-link">AUM</a>
   CAGR → <a href="/glossary/cagr-compound-annual-growth-rate" class="glossary-link">CAGR</a>
   Expense Ratio → <a href="/glossary/expense-ratio" class="glossary-link">expense ratio</a>

6. WORD COUNT: 2500-4000 words. Not thin. Not bloated. Every sentence must earn its place.

7. FORMAT: Output ONLY clean HTML. No Markdown. No H1 tags. No code blocks wrapping the HTML.

8. DISCLAIMER at end:
<div class="warning-box"><h4>Disclaimer</h4><p>This article is for informational purposes only and does not constitute financial advice. Rates and offers are subject to change. Please consult a SEBI-registered advisor before making investment decisions. InvestingPro.in may earn a commission when you apply through our links.</p></div>

Acknowledge these rules and wait for my topic.
```

---

## ARTICLE PROMPTS (one per message after the master prompt)

### DEMAT & STOCKS (thin categories — priority)

**Article: "What Is Sensex and Nifty? How Indian Stock Market Indices Work"**
```
Write article: "What Is Sensex and Nifty? How Indian Stock Market Indices Work — Explained Simply"
Primary keyword: what is sensex and nifty
Secondary: BSE sensex, nifty 50, stock market index india, sensex vs nifty difference
Target: Complete beginners who hear "Sensex crashed" on news but don't understand what it means
Must include: How indices are calculated (free-float market cap), top 10 companies in each, historical returns, how to invest in indices via index funds/ETFs
Link to: /calculators/sip, /articles/best-nifty-50-index-funds, /mutual-funds, /glossary/nav-net-asset-value
Tables: Sensex vs Nifty comparison, top 10 stocks in each with weightage
```

**Article: "IPO Allotment Process: How Shares Are Allocated and How to Improve Your Chances"**
```
Write article: "IPO Allotment Process in India: How It Works and 7 Ways to Improve Your Chances"
Primary keyword: IPO allotment process india
Secondary: how IPO allotment works, IPO allotment tips, increase IPO allotment chances, IPO application through ASBA
Target: Retail investors who apply for IPOs but rarely get allotment
Must include: Lottery system for retail, proportional for HNI, ASBA process, multiple demat accounts strategy (legal), historical allotment ratios, IPO grey market premium explanation
Link to: /calculators/ipo, /articles/how-to-apply-ipo-india-guide, /demat-accounts, /glossary/ipo
Tables: IPO category allocation (retail 35%, HNI 15%, QIB 50%), recent IPO allotment ratios
```

**Article: "Stock Market Holidays 2026 India: NSE & BSE Trading Calendar"**
```
Write article: "Stock Market Holidays 2026: Complete NSE and BSE Trading Calendar for India"
Primary keyword: stock market holidays 2026 india
Secondary: NSE holidays 2026, BSE trading calendar, stock exchange closed dates india
Target: Active traders and investors who need to plan around market closures
Must include: Complete month-by-month holiday list, muhurat trading date (Diwali), settlement holidays vs trading holidays, Saturday trading sessions if any, how holidays affect F&O expiry
Link to: /demat-accounts, /stocks, /glossary/settlement
Tables: Month-by-month holiday calendar with day and reason
Data source: NSE official circular
```

### SMALL BUSINESS (thin — priority)

**Article: "MSME Udyam Registration Online: Free Process, Benefits, and Documents"**
```
Write article: "MSME Udyam Registration Online 2026: Free Step-by-Step Process, Benefits, and Documents Required"
Primary keyword: MSME Udyam registration online
Secondary: udyam registration process, MSME registration benefits, udyam certificate download, micro small medium enterprise registration
Target: Small business owners, freelancers, and startups wanting government benefits
Must include: Classification (micro/small/medium by investment + turnover), step-by-step udyam.gov.in process with screenshots described, benefits (priority lending, lower interest rates, tax benefits, government tender preference), documents needed (Aadhaar only for proprietor), common mistakes
Link to: /articles/gst-registration-small-business-india-guide, /calculators/gst, /small-business
Tables: MSME classification table (investment + turnover limits), benefits comparison before vs after registration
```

**Article: "Best Payment Gateway for Small Business India 2026"**
```
Write article: "Best Payment Gateway for Small Business in India 2026: Razorpay vs Cashfree vs PayU Compared"
Primary keyword: best payment gateway small business india
Secondary: razorpay vs cashfree, payment gateway charges comparison, UPI payment gateway, online payment gateway india
Target: Small business owners setting up online payments for the first time
Must include: Feature comparison of top 5 gateways (Razorpay, Cashfree, PayU, Instamojo, CCAvenue), transaction charges breakdown, settlement period, UPI support, international payments, integration difficulty, minimum requirements
Link to: /small-business, /articles/gst-registration-small-business-india-guide
Tables: Detailed 5-gateway comparison (charges, settlement, features), pricing tiers
```

### RETIREMENT (thin — priority)

**Article: "EPF vs VPF vs PPF: Which Retirement Savings Option Is Best?"**
```
Write article: "EPF vs VPF vs PPF: Which Retirement Savings Option Should You Choose in India?"
Primary keyword: EPF vs VPF vs PPF
Secondary: provident fund comparison, EPF interest rate 2026, VPF benefits, PPF vs EPF which is better
Target: Salaried employees confused between employer PF, voluntary PF, and public PF
Must include: Current interest rates (EPF 8.25%, PPF 7.1%), tax treatment (EEE status), contribution limits, lock-in periods, withdrawal rules, loan facility, employer contribution rules, when VPF makes sense
Link to: /calculators/ppf, /articles/nps-national-pension-system-guide-india, /glossary/epf, /retirement
Tables: Full 3-way comparison table, tax treatment comparison, withdrawal rules comparison
```

**Article: "How to Calculate Your Retirement Corpus in India — The Complete Formula"**
```
Write article: "How to Calculate Your Retirement Corpus: The Formula Every Indian Should Know"
Primary keyword: retirement corpus calculator india
Secondary: how much money to retire india, retirement planning formula, retirement corpus calculation
Target: Working professionals (30-50) who want a specific number to target
Must include: The 25x/33x rule adapted for India (higher inflation = 33x), inflation-adjusted expense calculation, healthcare cost projection, example calculations for ₹50K, ₹1L, ₹2L monthly expenses, SWP strategy for retirement income, how NPS pension works
Link to: /calculators/retirement, /calculators/sip, /articles/fire-movement-india, /articles/nps-national-pension-system-guide-india
Tables: Corpus needed at different expense levels and retirement ages, SIP required to reach target corpus
```

### IPO (thin — priority)

**Article: "Upcoming IPOs in India 2026: Complete Calendar and How to Apply"**
```
Write article: "Upcoming IPOs in India 2026: Complete List, Expected Dates, and How to Apply"
Primary keyword: upcoming IPO 2026 india
Secondary: IPO calendar 2026, new IPO list, IPO opening date, how to apply for IPO
Target: Retail investors looking for the next IPO opportunity
Must include: List of expected IPOs with estimated size and sector, how to track upcoming IPOs (SEBI DRHP filings), step-by-step application via UPI (ASBA), lot size explained, GMP (grey market premium) concept, IPO vs listing day strategy
Link to: /ipo, /demat-accounts, /articles/how-to-apply-ipo-india-guide, /glossary/ipo
Tables: Expected IPO calendar (company, sector, estimated size, status), recent IPO performance table
Note: Since this is time-sensitive, mention "This list is updated regularly. Bookmark this page."
```

---

## HOW TO USE

1. Open Super Grok
2. Paste the MASTER PROMPT
3. Grok acknowledges
4. Paste ONE article prompt
5. Grok generates the HTML
6. Copy the HTML output
7. Come to Claude Code and say: "Insert this article: [paste title]" + paste the HTML
8. I'll insert it into Supabase with proper slug, category, author desk, FAQ schema, and tags
9. Repeat with next prompt

**You can generate 5-10 articles per Grok session (before reset)**
