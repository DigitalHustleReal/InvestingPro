/**
 * News Article Templates
 *
 * Category-specific context injections for the AI writer.
 * Each template provides:
 *   - Mandatory article structure (headline → callout → data → impact → action → CTA)
 *   - Category-specific data tables and formulas
 *   - Internal calculator + listing page links
 *   - Compliance notes (SEBI disclaimer, source citation)
 */

export interface NewsEventData {
  headline: string;
  summary: string;
  category: string;
  source_name: string;
  source_url: string;
  detected_at: string;
  keywords: string[];
  serp_context?: string;
}

type TemplateFn = (data: NewsEventData) => string;

const dateStr = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const TEMPLATES: Record<string, TemplateFn> = {
  da_announcement: (d) => `
BREAKING NEWS CONTEXT — DA ANNOUNCEMENT
Source: ${d.source_name} | URL: ${d.source_url}
Event: ${d.headline}
Date: ${dateStr(d.detected_at)}

MANDATORY ARTICLE STRUCTURE:
1. OPENING (first 2 sentences): State exact DA% before → after, effective date, beneficiary count (~50L central govt employees + ~65L pensioners)
2. [GOLD CALLOUT BOX shortcode]: Before DA% | After DA% | Effective Date | Source
3. DATA STRIP (monospace): Pay Matrix Level 1–7 → show monthly DA change in ₹
4. SECTION "What this means for your salary": Net salary increase calculation for a Level 6 employee (approx ₹35,700 basic)
5. HRA trigger: If DA crosses 25% → HRA increases from 8/16/24% to 9/18/27%. If crosses 50% → further revision.
6. PF impact: Employee PF = 12% of (basic + DA) → DA hike increases PF contribution
7. Pensioners: DR (Dearness Relief) increases by same % as DA
8. INTERNAL CTA: Link to /calculators/salary with text "Calculate your revised take-home salary"
9. SECTION "What to do": Review SIP amount post-salary hike, check NPS contribution, consider PPF top-up
10. SOURCE CITATION: Official PIB/DoPT circular URL

SEBI DISCLAIMER: Always include standard disclaimer at bottom.
`,

  repo_rate: (d) => `
BREAKING NEWS CONTEXT — RBI RATE DECISION
Source: ${d.source_name} | URL: ${d.source_url}
Event: ${d.headline}
Date: ${dateStr(d.detected_at)}

MANDATORY ARTICLE STRUCTURE:
1. OPENING: New repo rate (X%), direction (hike/cut/hold), MPC vote count (e.g., 4-2 majority), effective immediately
2. [GOLD CALLOUT BOX]: Repo Rate | Reverse Repo | SDF | MSF | Bank Rate — before and after
3. HOME LOAN EMI TABLE: For ₹30L loan, 20yr tenure — EMI change per 25bps step:
   | Rate  | EMI/month | Change vs prev |
   | 6.50% | ₹X        | —              |
   | 6.75% | ₹X        | +₹Y/month      |
4. FD RATE FORECAST: FD rates historically lag repo by 4-8 weeks. Which banks may revise?
5. SECTION "What to do": Floating rate borrowers → recalculate EMI. FD investors → lock in now or wait?
6. INTERNAL LINKS: /calculators/emi (EMI recalculation), /fixed-deposits (best FD rates), /calculators/fd
7. EQUITY IMPACT: Rate cuts = growth positive for mid/small caps. Rate hikes = short-term pressure on markets.
8. SOURCE CITATION: RBI press release URL

SEBI/RBI DISCLAIMER: Based on RBI monetary policy committee announcement. Not investment advice.
`,

  lpg: (d) => `
BREAKING NEWS CONTEXT — LPG PRICE CHANGE
Source: ${d.source_name} | URL: ${d.source_url}
Event: ${d.headline}
Date: ${dateStr(d.detected_at)}

MANDATORY ARTICLE STRUCTURE:
1. OPENING: New price for 14.2kg domestic cylinder in Delhi (reference city), effective date
2. [GOLD CALLOUT BOX]: Delhi | Mumbai | Kolkata | Chennai — new price, old price, change ₹
3. HOUSEHOLD IMPACT: Average 2 cylinders/month → annual change = ₹X × 24 = ₹Y/year
4. PMUY SECTION: Ujjwala beneficiaries get ₹300 subsidy — net price = ₹Z
5. COMMERCIAL CYLINDER: 19kg commercial cylinder price (for small businesses/restaurants)
6. WHY IT CHANGED: Link to crude oil price movement / refinery costs / govt subsidy decision
7. BUDGET TIP: 5 ways to reduce LPG consumption (induction cooktops, pressure cooker efficiency, etc.)
8. INTERNAL CTA: /calculators/budget — "Track your monthly household expenses"
9. SOURCE CITATION: IOCL/HPCL official price revision circular

`,

  fuel_price: (d) => `
BREAKING NEWS CONTEXT — FUEL PRICE CHANGE
Source: ${d.source_name} | URL: ${d.source_url}
Event: ${d.headline}
Date: ${dateStr(d.detected_at)}

MANDATORY ARTICLE STRUCTURE:
1. OPENING: New petrol + diesel prices in Delhi, Mumbai, Chennai, Kolkata
2. [GOLD CALLOUT BOX]: City-wise price table — Petrol | Diesel | Change ₹
3. MONTHLY IMPACT: Average car (15km/L, 1,500km/month) → fuel bill change = ₹X/month
4. TWO-WHEELER: Average bike (45km/L, 1,000km/month) → change = ₹Y/month
5. CNG UPDATE: Current CNG price in Delhi and Mumbai (if changed)
6. TAX BREAKDOWN: Show what % is excise duty + state VAT (typically 55-60% of retail price)
7. CRUDE OIL CONTEXT: International crude price (Brent $/barrel) that drove this
8. BUDGET TIP: Carpooling, fuel-efficient driving, electric vehicle consideration
9. INTERNAL CTA: /calculators/budget — "Calculate impact on your monthly budget"
`,

  gold_silver: (d) => `
BREAKING NEWS CONTEXT — GOLD/SILVER PRICE
Source: ${d.source_name} | URL: ${d.source_url}
Event: ${d.headline}
Date: ${dateStr(d.detected_at)}

MANDATORY ARTICLE STRUCTURE:
1. OPENING: Current MCX gold price (₹/10g) + silver (₹/kg), % change from previous day/week
2. [GOLD CALLOUT BOX]: MCX Gold (10g) | Int'l Gold ($/oz) | MCX Silver (1kg) | INR/USD impact
3. WHY IT MOVED: Trigger (USD strength/weakness, US inflation data, geopolitical, Fed signals)
4. INVESTMENT COMPARISON TABLE:
   | Method          | Liquidity | Returns | Tax              | Risk |
   | Physical gold   | Low       | Price-linked | LTCG 20% (3yr)  | Theft |
   | Sovereign Gold Bond | Medium | Price + 2.5% interest | Tax-free at maturity | Nil |
   | Gold ETF        | High      | Price-linked | LTCG 20% (3yr)  | Market |
   | Gold MF FoF     | High      | Price-linked | LTCG 20% (3yr)  | Market |
5. SGB OPPORTUNITY: Current SGB series details, price, interest rate, tax advantage
6. JEWELLERY BUYERS: MCX price + making charges (10-25%) + GST 3% = actual jewellery cost
7. INTERNAL CTA: /calculators/gold — "Calculate returns on gold investment"
8. SOURCE CITATION: MCX website URL
`,

  tax_change: (d) => `
BREAKING NEWS CONTEXT — TAX RULE CHANGE
Source: ${d.source_name} | URL: ${d.source_url}
Event: ${d.headline}
Date: ${dateStr(d.detected_at)}

MANDATORY ARTICLE STRUCTURE:
1. OPENING: What changed, which section of IT Act, effective from AY/FY
2. [GOLD CALLOUT BOX]: Old rule → New rule, Effective date, Who is affected
3. IMPACT TABLE: For income levels ₹8L / ₹12L / ₹20L / ₹30L — how much tax changes?
4. OLD vs NEW REGIME: Does this change which regime is better? Show breakeven point.
5. ACTIONABLE STEPS:
   a. If salaried: Submit revised Form 12BB to employer, revise advance tax
   b. If business owner: Revise advance tax challan (due dates: Jun/Sep/Dec/Mar)
   c. Investments: Should you buy more ELSS / NPS / 80C instruments now?
6. INTERNAL CTA: /calculators/income-tax — "Recalculate your tax liability"
7. SOURCE CITATION: Official IT department / CBDT circular URL

DISCLAIMER: Consult a chartered accountant for personalized tax advice.
`,

  budget: (d) => `
BREAKING NEWS CONTEXT — UNION BUDGET
Source: ${d.source_name} | URL: ${d.source_url}
Event: ${d.headline}
Date: ${dateStr(d.detected_at)}

MANDATORY ARTICLE STRUCTURE:
1. OPENING: Key headline numbers (fiscal deficit target, GDP growth, revenue/expenditure)
2. [GOLD CALLOUT BOX]: Fiscal Deficit | Total Expenditure | Capital Expenditure | Revenue Deficit
3. PERSONAL FINANCE IMPACT (top 5 changes affecting retail investors):
   - Income tax changes (new slabs, exemptions, deductions)
   - Investment-related changes (LTCG, STCG, Section 80C, NPS)
   - Insurance changes (80D limits, premium deductions)
   - Loan/housing changes (housing loan deduction, affordable housing)
   - Savings changes (PPF, SSY, NSC changes if any)
4. WINNERS AND LOSERS: Taxpayer categories that benefit vs pay more
5. MARKET IMPACT: Sectors to watch (infrastructure, housing, EV, etc.)
6. INTERNAL LINKS: Multiple calculator links (income tax, SIP, home loan EMI)
7. SOURCE CITATION: Union Budget official website

`,

  mutual_fund: (d) => `
BREAKING NEWS CONTEXT — MUTUAL FUND / SEBI REGULATION
Source: ${d.source_name} | URL: ${d.source_url}
Event: ${d.headline}
Date: ${dateStr(d.detected_at)}

MANDATORY ARTICLE STRUCTURE:
1. OPENING: What SEBI/AMFI announced, effective date, which fund categories affected
2. [GOLD CALLOUT BOX]: Key change summary — old rule → new rule
3. AFFECTED FUND CATEGORIES: List fund types impacted (equity, debt, hybrid, thematic)
4. INVESTOR IMPACT:
   - SIP investors: Continue / review / switch?
   - Lump sum investors: Any lock-in / exit load changes?
   - Existing folio holders: Grandfathered or impacted?
5. WHAT TO DO: Practical 3-step action plan
6. INTERNAL LINKS: /mutual-funds listing for affected categories
7. CALCULATOR CTA: /calculators/sip — "Recalculate your SIP targets"

SEBI DISCLAIMER: Mutual fund investments are subject to market risks. Read all scheme-related documents carefully.
`,

  ipo: (d) => `
BREAKING NEWS CONTEXT — IPO
Source: ${d.source_name} | URL: ${d.source_url}
Event: ${d.headline}
Date: ${dateStr(d.detected_at)}

MANDATORY ARTICLE STRUCTURE:
1. OPENING: Company name, IPO size (₹Cr), price band, open/close dates
2. [GOLD CALLOUT BOX]: Price Band | Lot Size | Min Investment | GMP (if available)
3. COMPANY OVERVIEW: Business model, revenue, profit/loss (last 2 years)
4. SUBSCRIPTION STATUS: Category-wise subscription (QIB/HNI/Retail)
5. SHOULD YOU APPLY? InvestingPro verdict with reasoning (based on valuation, industry, financials)
6. GMP ANALYSIS: If GMP > 10% = oversubscription likely, if < 0 = weak sentiment
7. ALLOTMENT & LISTING: Expected allotment date, listing date, exchange
8. INTERNAL LINK: /ipo page for more IPOs
`,

  insurance_regulation: (d) => `
BREAKING NEWS CONTEXT — INSURANCE REGULATION
Source: ${d.source_name} | URL: ${d.source_url}
Event: ${d.headline}
Date: ${dateStr(d.detected_at)}

MANDATORY ARTICLE STRUCTURE:
1. OPENING: What IRDAI changed, circular number, effective date
2. [GOLD CALLOUT BOX]: Key rule change — old → new
3. PREMIUM IMPACT: Estimate for standard ₹1Cr term plan (30yr, non-smoker, ₹10,000/yr benchmark)
4. EXISTING POLICYHOLDERS: Are they grandfathered or affected by new rules?
5. NEW BUYERS: Should you buy NOW before change, or wait for better products?
6. CLAIM SETTLEMENT: Any change in claim settlement ratios or process?
7. INTERNAL LINK: /insurance comparison pages
8. SOURCE CITATION: IRDAI circular URL
`,

  epfo: (d) => `
BREAKING NEWS CONTEXT — EPFO/PF
Source: ${d.source_name} | URL: ${d.source_url}
Event: ${d.headline}
Date: ${dateStr(d.detected_at)}

MANDATORY ARTICLE STRUCTURE:
1. OPENING: What changed (interest rate / withdrawal rule / EPS / EDLI), effective date
2. [GOLD CALLOUT BOX]: Old rule → New rule, Effective date, Who is affected
3. INTEREST CALCULATION: On ₹5L PF balance — how much more/less interest at new rate?
4. WITHDRAWAL IMPACT: Any change in withdrawal rules (Form 31, 19, 10C eligibility)
5. EPS PENSION: If EPS rules changed — impact on higher pension benefit
6. WHAT TO DO: Check EPF passbook, update nominee, link UAN with Aadhaar
7. INTERNAL CTA: /calculators/epf — "Calculate your EPF maturity amount"
8. SOURCE CITATION: EPFO official notification URL
`,

  pension: (d) => `
BREAKING NEWS CONTEXT — PENSION SCHEME
Source: ${d.source_name} | URL: ${d.source_url}
Event: ${d.headline}
Date: ${dateStr(d.detected_at)}

MANDATORY ARTICLE STRUCTURE:
1. OPENING: What changed in NPS/OPS/UPS, who is affected (central/state/private employees)
2. [GOLD CALLOUT BOX]: Key change — old → new
3. COMPARISON TABLE: NPS vs OPS vs UPS — contribution, guaranteed pension, flexibility
4. PENSION AMOUNT: For ₹50,000 basic salary at retirement — pension under each scheme
5. TAX BENEFITS: 80CCD(1), 80CCD(1B), 80CCD(2) — how much can you save?
6. WHAT TO DO: Should NPS subscribers continue / increase contribution?
7. INTERNAL CTA: /calculators/nps — "Plan your retirement corpus"
`,

  banking: (d) => `
BREAKING NEWS CONTEXT — BANKING/FD RATES
Source: ${d.source_name} | URL: ${d.source_url}
Event: ${d.headline}
Date: ${dateStr(d.detected_at)}

MANDATORY ARTICLE STRUCTURE:
1. OPENING: Which bank changed what rate (FD/savings/RD), new rate, effective date
2. [GOLD CALLOUT BOX]: Old Rate → New Rate | Effective Date | Which tenures affected
3. COMPARISON: Where does this bank rank vs top 5 FD providers now?
4. SENIOR CITIZEN RATE: Most banks offer 0.25-0.5% extra — new rate for seniors
5. TAX CALCULATOR: ₹5L FD at new rate for 1yr — interest earned, TDS @ 10%, net return
6. SHOULD YOU BOOK NOW? If rate cut: Lock in before further cuts. If rate hike: Wait for more?
7. INTERNAL LINKS: /fixed-deposits comparison, /calculators/fd
`,
};

const defaultTemplate: TemplateFn = (d) => `
BREAKING NEWS CONTEXT — PERSONAL FINANCE
Source: ${d.source_name} | URL: ${d.source_url}
Event: ${d.headline}
Date: ${dateStr(d.detected_at)}

MANDATORY ARTICLE STRUCTURE:
1. OPENING: What changed, who is affected, from when
2. [GOLD CALLOUT BOX]: Key facts — Before | After | Effective Date | Source
3. READER MONEY IMPACT: Specific ₹ numbers for a typical Indian household
4. DATA TABLE: Where applicable, before/after comparison
5. WHAT TO DO: 3-5 concrete, actionable steps for readers
6. INTERNAL LINK: Relevant InvestingPro calculator or product listing page
7. SOURCE CITATION: Official source URL

SEBI DISCLAIMER: Include standard disclaimer at bottom.
`;

export function getNewsArticleContext(event: NewsEventData): string {
  const templateFn = TEMPLATES[event.category] ?? defaultTemplate;
  const baseContext = templateFn(event);

  const serpSection = event.serp_context
    ? `\nCOMPETITOR SERP INSIGHTS:\n${event.serp_context}\n`
    : '';

  const rawNewsSection = event.summary
    ? `\nRAW NEWS CONTENT:\n${event.summary}\n`
    : '';

  return `${baseContext}${serpSection}${rawNewsSection}
KEYWORDS TO WEAVE IN: ${event.keywords.join(', ')}

ARTICLE REQUIREMENTS:
- Minimum 700 words (news speed ≠ thin content)
- Tone: Authoritative, data-backed, reader-centric ("your EMI", "your salary", "your portfolio")
- Audience: Indian salaried professionals, retail investors, first-gen investors
- MUST include at least one InvestingPro internal calculator link
- MUST include at least one InvestingPro product listing link
- MUST include official source name and URL in article body
- MUST include SEBI disclaimer if article touches investments

OUTPUT JSON:
{
  "title": "Headline (H1): What Changed + Impact on Reader's Money",
  "content": "Full markdown article with shortcodes",
  "excerpt": "2-sentence summary for card preview",
  "seo_title": "Under 60 chars — include the key change + year",
  "seo_description": "Under 160 chars — include the change, impact, and a number",
  "tags": ["category", "keyword1", "keyword2"],
  "schema_faq": [{"question": "...", "answer": "..."}]
}
`;
}
