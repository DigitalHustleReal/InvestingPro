interface FAQItem {
  question: string;
  answer: string;
}

// Credit Cards FAQs
export const CREDIT_CARD_FAQS: FAQItem[] = [
  {
    question: "What credit score do I need to get a credit card in India?",
    answer:
      "Most credit cards require a minimum credit score of 700-750. Premium cards may require 750+. If you're new to credit, consider secured credit cards or entry-level cards with lower requirements.",
  },
  {
    question: "How do I choose the best credit card for my needs?",
    answer:
      "Consider your spending patterns: cashback cards for everyday purchases, travel cards for frequent flyers, fuel cards for commuters, and shopping cards for online purchases. Compare annual fees, reward rates, and benefits that match your lifestyle.",
  },
  {
    question: "What is the difference between joining fee and annual fee?",
    answer:
      "Joining fee is a one-time charge when you first get the card. Annual fee is charged every year to maintain the card. Many cards waive the annual fee if you spend above a certain threshold (e.g., ₹1.5 lakhs/year).",
  },
  {
    question: "Can I get a credit card with no annual fee?",
    answer:
      "Yes! Many banks offer lifetime free credit cards with no joining or annual fees. Popular options include HDFC MoneyBack, SBI SimplyCLICK, and ICICI Amazon Pay. These cards still offer rewards and benefits.",
  },
  {
    question: "How long does credit card approval take?",
    answer:
      "Instant approval is possible if you meet eligibility criteria. Physical card delivery takes 7-10 business days. Some banks offer instant virtual cards that you can use immediately after approval.",
  },
  {
    question: "What documents are required to apply for a credit card?",
    answer:
      "You'll need: PAN card, Aadhaar card, income proof (salary slips/ITR), address proof, and recent passport-size photographs. Salaried individuals may need 3-6 months of bank statements.",
  },
  {
    question: "Can I have multiple credit cards from different banks?",
    answer:
      "Yes, you can hold multiple credit cards. In fact, having 2-3 cards can improve your credit utilization ratio and provide diverse benefits. Just ensure you can manage payments responsibly.",
  },
  {
    question: "What is a credit card reward rate?",
    answer:
      "Reward rate indicates how many reward points you earn per ₹100-150 spent. For example, 1% cashback means ₹1 back for every ₹100 spent. Premium cards offer 2-5% rewards on specific categories.",
  },
  {
    question: "Are credit card rewards taxable in India?",
    answer:
      "As of 2024, reward points and cashback are generally not taxable. However, welcome bonuses and gifts worth over ₹50,000 may be taxable. Consult a tax advisor for specific cases.",
  },
  {
    question: "How can I improve my chances of credit card approval?",
    answer:
      "Maintain a good credit score (750+), have stable income, keep existing credit utilization below 30%, avoid multiple applications in short time, and ensure all documents are accurate and up-to-date.",
  },
];

// Credit Card Detail Page FAQs (Product-Specific)
export const getCreditCardDetailFAQs = (
  cardName: string,
  provider: string,
): FAQItem[] => [
  {
    question: `What is the eligibility criteria for ${cardName}?`,
    answer: `To apply for ${cardName}, you typically need: minimum age 21 years, minimum income of ₹3-5 lakhs/year (varies by card), good credit score (700+), and valid KYC documents. ${provider} may have specific requirements.`,
  },
  {
    question: `How do I apply for ${cardName}?`,
    answer: `You can apply online through our affiliate partner link (instant approval possible), visit ${provider} branch, or call their customer service. Online applications are fastest and often come with exclusive offers.`,
  },
  {
    question: `What are the fees for ${cardName}?`,
    answer: `Check the fees table above for joining fee, annual fee, and other charges. Many cards waive annual fees if you meet minimum spending criteria. Always read the terms and conditions.`,
  },
  {
    question: `Can I get ${cardName} if I'm self-employed?`,
    answer: `Yes, self-employed individuals can apply by providing ITR for last 2-3 years, business proof, and bank statements. Income requirements may be slightly higher than salaried applicants.`,
  },
  {
    question: `How long does it take to receive ${cardName}?`,
    answer: `After approval, physical card delivery takes 7-10 business days. Some applicants receive instant virtual cards for immediate use. Track your application status through ${provider}'s website or app.`,
  },
];

// Loans FAQs
export const LOAN_FAQS: FAQItem[] = [
  {
    question: "What is the difference between secured and unsecured loans?",
    answer:
      "Secured loans require collateral (home, car, gold) and offer lower interest rates. Unsecured loans (personal loans) don't need collateral but have higher interest rates due to increased risk for lenders.",
  },
  {
    question: "How is my loan eligibility calculated?",
    answer:
      "Lenders consider your income, credit score, existing EMIs, age, employment stability, and debt-to-income ratio. Generally, your total EMIs shouldn't exceed 50-60% of your monthly income.",
  },
  {
    question: "What is a good interest rate for personal loans in India?",
    answer:
      "Personal loan interest rates range from 10-24% per annum. Rates below 12% are considered excellent, 12-16% are good, and above 18% are high. Your credit score significantly impacts the rate offered.",
  },
  {
    question: "Can I prepay my loan without penalty?",
    answer:
      "For floating rate loans, RBI mandates zero prepayment charges. For fixed rate loans, banks may charge 2-5% penalty. Always check your loan agreement for specific prepayment terms.",
  },
  {
    question: "How does loan tenure affect my EMI?",
    answer:
      "Longer tenure = lower EMI but higher total interest. Shorter tenure = higher EMI but lower total interest. Use our EMI calculator to find the optimal balance for your budget.",
  },
  {
    question: "What documents are required for a personal loan?",
    answer:
      "You'll need: PAN card, Aadhaar card, 3-6 months salary slips, 6 months bank statements, employment proof, and address proof. Self-employed need ITR and business proof.",
  },
  {
    question: "Can I get a loan with a low credit score?",
    answer:
      "Loans are possible with scores below 700 but expect higher interest rates, lower loan amounts, or need for a co-applicant/guarantor. Consider improving your score before applying.",
  },
  {
    question: "What is the maximum loan amount I can get?",
    answer:
      "Personal loans typically range from ₹50,000 to ₹40 lakhs. Your eligibility depends on income (usually 10-20x monthly salary), credit score, and existing liabilities.",
  },
  {
    question: "How long does loan approval take?",
    answer:
      "Digital lenders offer instant approval (minutes to hours). Traditional banks take 2-7 business days. Disbursement happens within 24-48 hours after approval for most lenders.",
  },
  {
    question: "What is loan insurance and do I need it?",
    answer:
      "Loan insurance covers your EMIs in case of death, disability, or job loss. It's optional but recommended for large loans. Premium is typically 0.5-1% of loan amount annually.",
  },
];

// Insurance FAQs
export const INSURANCE_FAQS: FAQItem[] = [
  {
    question:
      "What is the difference between term insurance and whole life insurance?",
    answer:
      "Term insurance provides coverage for a specific period (10-40 years) with no maturity benefit. Whole life insurance covers you for life and includes savings component, but premiums are 5-10x higher.",
  },
  {
    question: "How much life insurance coverage do I need?",
    answer:
      "A common rule is 10-15x your annual income. Consider your liabilities (loans, future expenses), dependents' needs, and inflation. Our insurance calculator can help determine the right amount.",
  },
  {
    question: "Can I buy insurance online?",
    answer:
      "Yes! Online insurance is 20-30% cheaper due to lower distribution costs. The process is paperless, instant, and equally valid. Medical tests may still be required for high coverage amounts.",
  },
  {
    question: "What is a waiting period in health insurance?",
    answer:
      "Initial waiting period (30 days) applies to all illnesses except accidents. Pre-existing diseases have 2-4 year waiting periods. Specific illnesses (hernia, cataract) have 1-2 year waiting.",
  },
  {
    question: "Do I need both health and life insurance?",
    answer:
      "Yes, they serve different purposes. Life insurance protects your family's financial future if you pass away. Health insurance covers medical expenses. Both are essential for comprehensive protection.",
  },
  {
    question: "Can I claim tax benefits on insurance premiums?",
    answer:
      "Yes! Life insurance premiums qualify for ₹1.5 lakh deduction under Section 80C. Health insurance premiums get ₹25,000 (₹50,000 for senior citizens) under Section 80D.",
  },
  {
    question: "What is a no-claim bonus in insurance?",
    answer:
      "Health insurance offers 5-10% premium discount or increased coverage for each claim-free year, up to 50%. This incentivizes preventive care and rewards healthy policyholders.",
  },
  {
    question: "Should I buy insurance from an agent or online?",
    answer:
      "Online is cheaper and faster. Agents provide personalized advice and claim assistance. For simple term plans, go online. For complex needs (ULIPs, endowment), consider agent guidance.",
  },
  {
    question: "What happens if I miss a premium payment?",
    answer:
      "You get a grace period (15-30 days). If unpaid, policy lapses. You can revive it within 2-5 years by paying dues with interest. Some policies offer automatic premium payment from bank account.",
  },
  {
    question: "Can I have multiple health insurance policies?",
    answer:
      "Yes, you can have multiple policies. Claims are settled proportionately or sequentially. Having 2 policies can provide higher coverage and better claim settlement options.",
  },
];

// Mutual Funds FAQs
export const MUTUAL_FUND_FAQS: FAQItem[] = [
  {
    question: "What is the minimum amount to invest in mutual funds?",
    answer:
      "You can start with as low as ₹500 for SIP (Systematic Investment Plan) or ₹5,000 for lump sum in most funds. Some funds have even lower minimums of ₹100 for SIP.",
  },
  {
    question: "What is the difference between SIP and lump sum investment?",
    answer:
      "SIP invests fixed amount monthly, averaging out market volatility (rupee cost averaging). Lump sum invests entire amount at once. SIP is better for regular income earners; lump sum for windfall gains.",
  },
  {
    question: "Are mutual funds safe?",
    answer:
      "Mutual funds are regulated by SEBI and relatively safe, but not risk-free. Equity funds have higher risk/return, debt funds are lower risk. Diversification and long-term investing reduce risk significantly.",
  },
  {
    question: "What is an expense ratio in mutual funds?",
    answer:
      "Expense ratio is the annual fee charged by fund house (0.5-2.5% of assets). Lower is better. Direct plans have 0.5-1% lower expense ratio than regular plans, significantly impacting long-term returns.",
  },
  {
    question: "How are mutual fund returns taxed?",
    answer:
      "Equity funds: LTCG (>1 year) taxed at 10% above ₹1 lakh, STCG at 15%. Debt funds: LTCG (>3 years) at 20% with indexation, STCG at slab rate. Tax rules updated in Budget 2024.",
  },
  {
    question: "What is NAV in mutual funds?",
    answer:
      "Net Asset Value is the per-unit price of the fund, calculated daily after market close. It's the price at which you buy/sell units. NAV = (Total Assets - Liabilities) / Total Units.",
  },
  {
    question: "Can I withdraw my mutual fund investment anytime?",
    answer:
      "Open-ended funds allow withdrawal anytime (may have exit load if withdrawn before 1 year). ELSS has 3-year lock-in. Closed-ended funds can only be withdrawn at maturity or sold on exchange.",
  },
  {
    question: "What is the difference between growth and dividend option?",
    answer:
      "Growth option reinvests profits, compounding your returns. Dividend option pays out profits periodically (now taxable in investor's hands). Growth is better for long-term wealth creation.",
  },
  {
    question: "How do I choose the right mutual fund?",
    answer:
      "Consider your goals, risk tolerance, and time horizon. Equity funds for >5 years, debt funds for 1-3 years, hybrid for moderate risk. Check fund performance, expense ratio, and fund manager track record.",
  },
  {
    question: "What is the difference between direct and regular mutual funds?",
    answer:
      "Direct plans have no distributor commission, resulting in 0.5-1% lower expense ratio. You invest directly with AMC. Regular plans involve distributors/advisors. Direct plans give 1-2% higher returns over time.",
  },
];

// Tax FAQs
export const TAX_FAQS: FAQItem[] = [
  {
    question: "Old vs new tax regime — which saves more in 2026?",
    answer:
      "Depends on your deductions. New regime is default with lower slabs (3-30%) but no deductions. Old regime has higher slabs (5-30%) but allows ₹1.5L (80C), ₹50K (NPS), ₹50K (standard), ₹25K-₹1L (80D), HRA, and home-loan interest. Rule of thumb: if your deductions exceed ~₹2.5 lakh on a ₹12L income, old regime saves more. Below that, new regime is cheaper. Use our old-vs-new calculator to compare exact rupee outcomes for your salary.",
  },
  {
    question: "What is HRA exemption and how is it calculated?",
    answer:
      "House Rent Allowance exemption (Section 10(13A)) reduces taxable income for salaried employees paying rent. Exemption is the LEAST of three: (1) Actual HRA received, (2) 50% of basic salary for metro cities (40% for non-metro), (3) Rent paid minus 10% of basic. Available only under old regime. You'll need rent receipts and your landlord's PAN if rent exceeds ₹1 lakh per year. Even paying rent to parents qualifies if they declare it as income.",
  },
  {
    question: "What is LTCG tax on mutual funds?",
    answer:
      "Long-Term Capital Gains tax on equity mutual funds (held over 12 months) is 12.5% above ₹1.25 lakh per financial year — Budget 2024 raised the threshold from ₹1 lakh and the rate from 10%. Debt fund LTCG is now slab-rate (no indexation) for purchases after April 2023. STCG (under 12 months for equity) is 20%. Index funds, ELSS, and equity-oriented hybrid funds follow equity rules.",
  },
  {
    question: "How do I file ITR online for FY 2026-27?",
    answer:
      "Login to incometax.gov.in with your PAN. Pre-filled data pulls Form 16, AIS, and 26AS automatically. Choose ITR-1 (salary up to ₹50L, no capital gains) or ITR-2 (salary + capital gains). Verify deductions claimed under 80C, 80D, etc. Add other income (FD interest, dividends, rental). E-verify via Aadhaar OTP, net banking, or Demat account. Deadline is 31 July 2026 for non-audit cases. Late filing attracts ₹1,000-₹5,000 penalty.",
  },
  {
    question: "What is Section 80C and how much tax does it save?",
    answer:
      "Section 80C allows up to ₹1.5 lakh deduction from taxable income for specific investments and expenses — only under the old regime. Eligible: PPF, ELSS mutual funds, EPF, life insurance premiums, home-loan principal, NSC, tax-saving FD (5-year lock-in), and tuition fees for two children. Maximum tax saved at 30% slab is ₹46,800. Stack with 80CCD(1B) for an extra ₹50K NPS deduction.",
  },
];

// Banking FAQs (savings, FDs, RDs, schemes)
export const BANKING_FAQS: FAQItem[] = [
  {
    question: "Which bank gives the highest FD rate in India?",
    answer:
      "Small finance banks like Suryoday, Unity, and Jana typically lead with 8.5-9.25% rates for senior citizens on 1-3 year tenures. Among large banks, IndusInd, Yes Bank, and IDFC First offer 7.5-8% for senior citizens. PSU banks (SBI, PNB) offer 7-7.5%. All deposits up to ₹5 lakh per bank are insured by DICGC. Higher rates often come with longer lock-ins or smaller bank credit risk — compare effective post-tax returns.",
  },
  {
    question: "What is the best savings account interest rate?",
    answer:
      "Standard savings account rates are 2.5-3% at major banks. Higher rates of 4-7% are offered on balances above thresholds: IDFC First (4-7%), RBL Bank (5.5-7%), Bandhan (6-7.85%), and Equitas (7%). Auto-sweep accounts move excess to FD automatically for higher returns. Compare zero-balance vs minimum-balance accounts based on your average monthly balance and whether you need free unlimited transactions.",
  },
  {
    question: "NRE vs NRO account — which one for NRIs?",
    answer:
      "NRE (Non-Resident External) accounts hold foreign earnings converted to INR — fully repatriable, interest is tax-free in India. NRO (Non-Resident Ordinary) accounts hold income earned in India (rent, dividends) — repatriation is capped at $1M/year, interest is taxable at 30%. NRIs typically need both: NRE for offshore savings, NRO for Indian income. FCNR deposits are an alternative for foreign currency without conversion risk.",
  },
  {
    question: "How is FD interest taxed in India?",
    answer:
      "FD interest is fully taxable as 'Income from Other Sources' at your slab rate. Banks deduct TDS at 10% if interest exceeds ₹40,000 per year (₹50,000 for seniors). Submit Form 15G (under 60) or 15H (60+) if your total income is below the taxable limit. Tax-saving FDs (5-year lock-in) qualify for ₹1.5L 80C deduction but interest is still taxable. Senior citizens get an extra ₹50K exemption on bank interest under Section 80TTB.",
  },
  {
    question: "RD vs SIP — which gives better returns?",
    answer:
      "Recurring Deposits offer fixed 6-7% returns, fully guaranteed but taxable. Equity SIPs in mutual funds historically average 12-15% over 7+ years but carry market risk and short-term volatility. For goals under 3 years, RD is safer. For 5+ year goals, SIP wins after taxes — at 12% versus 6.5%, ₹10K monthly for 10 years grows to ₹23L (SIP) vs ₹17L (RD). Combine both for balance: RD for emergency, SIP for wealth.",
  },
];

// Investing FAQs (mutual funds, stocks, NPS, retirement)
export const INVESTING_FAQS: FAQItem[] = [
  {
    question: "How much should I invest monthly to build ₹1 crore?",
    answer:
      "At 12% expected annual returns (typical equity SIP), you need ₹10,000/month for 20 years, ₹16,000/month for 15 years, or ₹26,000/month for 10 years. For ₹2 crore, double these. The compounding curve is steep in later years — ₹10K SIP at 12% reaches ₹23L by year 10 and ₹99L by year 20. Start early; even ₹2,000 extra monthly added in year 1 versus year 5 makes a ₹15L+ difference at the 20-year mark.",
  },
  {
    question: "What is SIP and how does it work?",
    answer:
      "Systematic Investment Plan automates a fixed monthly investment into mutual funds — typically ₹500-₹50,000 per month. Auto-debit triggers on a chosen date; the fund issues units at that day's NAV. Benefits: rupee-cost averaging (buys more units when markets dip), discipline, and compounding. Most funds allow you to start, stop, pause, or top-up SIPs anytime. Step-up SIPs increase the contribution annually (e.g. +10%) to match salary growth.",
  },
  {
    question: "NPS vs PPF vs ELSS — which gives best returns?",
    answer:
      "ELSS (equity-linked savings) leads with 12-15% historical returns and the shortest lock-in (3 years), but carries market risk. NPS averages 9-12% across mixed equity-debt allocations with lock-in until 60 — best for retirement-only goals; offers an extra ₹50K deduction under 80CCD(1B). PPF gives a guaranteed 7.1% (currently) tax-free return with a 15-year lock-in. Stack: ELSS for 80C + growth, NPS for retirement, PPF for safe long-term parking.",
  },
  {
    question: "Are mutual funds safe to invest in?",
    answer:
      "Mutual funds are SEBI-regulated and structurally safer than direct equity, but not risk-free. Equity funds can drop 30-50% in market crashes (recovered historically over 3-5 years). Debt funds carry credit and interest-rate risk. Liquid funds are the safest, near-FD returns. Diversify across categories: large-cap for stability, mid/small-cap for growth, debt for downside protection. Only invest money you don't need for at least 3 years in equity funds; 5+ years is ideal.",
  },
  {
    question: "How does compounding work in mutual funds?",
    answer:
      "Compounding means returns earn returns. ₹1 lakh growing at 12% becomes ₹3.1L in 10 years, ₹9.6L in 20 years, and ₹29.9L in 30 years — the curve accelerates because each year's return is added to the principal for next year. The 'rule of 72' shortcut: divide 72 by your return rate to get years to double (12% → ~6 years). Reinvesting dividends, choosing growth option (vs. dividend payout), and avoiding withdrawals are critical to capturing the full compounding effect.",
  },
];

// Cross-cutting personal-finance FAQs
export const LEARN_FAQS: FAQItem[] = [
  {
    question: "What is the 50/30/20 budget rule?",
    answer:
      "Allocate after-tax income as: 50% to needs (rent, EMI, groceries, utilities, insurance), 30% to wants (dining, travel, subscriptions, hobbies), 20% to savings + debt repayment. For Indian middle-class households, 50/30/20 often shifts to 60/20/20 due to housing costs. Track spending for one month before applying — most people find 5-10% leakage in 'wants' that can be redirected to investments without reducing quality of life.",
  },
  {
    question: "How much emergency fund do I need?",
    answer:
      "Build 6 months of essential expenses — rent, EMI, groceries, utilities, insurance premiums. For a household spending ₹50,000/month essentially, target ₹3 lakh. Park it in a sweep-in savings account or liquid mutual fund (instant access, 4-7% returns) — never in equity or locked products. Self-employed and single-income households should target 9-12 months. Build it before aggressive investing — it prevents you from selling equity at a loss during job loss or medical emergencies.",
  },
  {
    question: "Where should a beginner start investing in India?",
    answer:
      "Step 1: Build 6-month emergency fund in a liquid fund. Step 2: Buy ₹1 crore term insurance + ₹10L health insurance. Step 3: Start ELSS SIP for 80C tax saving + equity exposure (₹4,500/month maxes 80C over the year). Step 4: Add an index fund SIP (Nifty 50 or Nifty Next 50) — low cost, market-matching returns. Step 5: After 6-12 months, add 1-2 active flexi-cap or large-and-midcap funds. Avoid stock-picking until you've completed steps 1-5.",
  },
  {
    question: "How can I improve my CIBIL score?",
    answer:
      "Pay credit card and EMI bills on time — payment history is 35% of the score. Keep credit utilization under 30% of card limit (use ₹30K of a ₹1L limit, not ₹90K). Don't close old credit cards — credit history length matters. Avoid multiple loan applications in short windows (each triggers a hard inquiry, dropping score 5-10 points). Check your CIBIL report quarterly for free at cibil.com — dispute errors within 30 days. Most scores improve 50-100 points over 6-12 months of disciplined behavior.",
  },
  {
    question: "How much should I save for retirement?",
    answer:
      "Target 25-30x your annual expenses by retirement (the '4% rule' — withdraw 4% annually for it to last 30+ years). For ₹50K/month spend (₹6L/year), that's ₹1.5-1.8 crore. Account for inflation: today's ₹50K becomes ₹2L in 30 years at 5% inflation. Combine NPS (compulsory annuity at 60) + EPF + equity mutual funds + PPF. Start by 30 if possible — starting at 25 vs 35 with the same contribution can mean ₹1 crore more by 60, due to compounding.",
  },
];

// Category-specific FAQ getter — accepts both DB-category and URL-category values.
export const getCategoryFAQs = (category: string): FAQItem[] => {
  const c = category.toLowerCase().trim();
  // Credit cards
  if (c === "credit_card" || c === "credit-cards" || c === "credit_cards") {
    return CREDIT_CARD_FAQS;
  }
  // Loans (incl. small_business which we route under /loans/)
  if (
    c === "loan" ||
    c === "loans" ||
    c === "personal-loans" ||
    c === "personal_loans" ||
    c === "small-business" ||
    c === "small_business"
  ) {
    return LOAN_FAQS;
  }
  if (c === "insurance") return INSURANCE_FAQS;
  if (
    c === "taxes" ||
    c === "tax" ||
    c === "tax-planning" ||
    c === "taxation"
  ) {
    return TAX_FAQS;
  }
  if (
    c === "banking" ||
    c === "fixed-deposits" ||
    c === "fixed_deposit" ||
    c === "savings-accounts" ||
    c === "post-office-savings"
  ) {
    return BANKING_FAQS;
  }
  if (
    c === "investing" ||
    c === "investing-basics" ||
    c === "mutual-funds" ||
    c === "mutual_fund" ||
    c === "demat-accounts" ||
    c === "demat_account" ||
    c === "stocks" ||
    c === "ipo" ||
    c === "retirement"
  ) {
    return INVESTING_FAQS;
  }
  if (c === "learn" || c === "personal-finance" || c === "tools") {
    return LEARN_FAQS;
  }
  // Fallback to a sensible cross-cutting set rather than whichever was first
  return LEARN_FAQS;
};
