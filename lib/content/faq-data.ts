import { FAQItem } from '@/components/common/FAQAccordion';

// Credit Cards FAQs
export const CREDIT_CARD_FAQS: FAQItem[] = [
  {
    question: "What credit score do I need to get a credit card in India?",
    answer: "Most credit cards require a minimum credit score of 700-750. Premium cards may require 750+. If you're new to credit, consider secured credit cards or entry-level cards with lower requirements."
  },
  {
    question: "How do I choose the best credit card for my needs?",
    answer: "Consider your spending patterns: cashback cards for everyday purchases, travel cards for frequent flyers, fuel cards for commuters, and shopping cards for online purchases. Compare annual fees, reward rates, and benefits that match your lifestyle."
  },
  {
    question: "What is the difference between joining fee and annual fee?",
    answer: "Joining fee is a one-time charge when you first get the card. Annual fee is charged every year to maintain the card. Many cards waive the annual fee if you spend above a certain threshold (e.g., ₹1.5 lakhs/year)."
  },
  {
    question: "Can I get a credit card with no annual fee?",
    answer: "Yes! Many banks offer lifetime free credit cards with no joining or annual fees. Popular options include HDFC MoneyBack, SBI SimplyCLICK, and ICICI Amazon Pay. These cards still offer rewards and benefits."
  },
  {
    question: "How long does credit card approval take?",
    answer: "Instant approval is possible if you meet eligibility criteria. Physical card delivery takes 7-10 business days. Some banks offer instant virtual cards that you can use immediately after approval."
  },
  {
    question: "What documents are required to apply for a credit card?",
    answer: "You'll need: PAN card, Aadhaar card, income proof (salary slips/ITR), address proof, and recent passport-size photographs. Salaried individuals may need 3-6 months of bank statements."
  },
  {
    question: "Can I have multiple credit cards from different banks?",
    answer: "Yes, you can hold multiple credit cards. In fact, having 2-3 cards can improve your credit utilization ratio and provide diverse benefits. Just ensure you can manage payments responsibly."
  },
  {
    question: "What is a credit card reward rate?",
    answer: "Reward rate indicates how many reward points you earn per ₹100-150 spent. For example, 1% cashback means ₹1 back for every ₹100 spent. Premium cards offer 2-5% rewards on specific categories."
  },
  {
    question: "Are credit card rewards taxable in India?",
    answer: "As of 2024, reward points and cashback are generally not taxable. However, welcome bonuses and gifts worth over ₹50,000 may be taxable. Consult a tax advisor for specific cases."
  },
  {
    question: "How can I improve my chances of credit card approval?",
    answer: "Maintain a good credit score (750+), have stable income, keep existing credit utilization below 30%, avoid multiple applications in short time, and ensure all documents are accurate and up-to-date."
  }
];

// Credit Card Detail Page FAQs (Product-Specific)
export const getCreditCardDetailFAQs = (cardName: string, provider: string): FAQItem[] => [
  {
    question: `What is the eligibility criteria for ${cardName}?`,
    answer: `To apply for ${cardName}, you typically need: minimum age 21 years, minimum income of ₹3-5 lakhs/year (varies by card), good credit score (700+), and valid KYC documents. ${provider} may have specific requirements.`
  },
  {
    question: `How do I apply for ${cardName}?`,
    answer: `You can apply online through our affiliate partner link (instant approval possible), visit ${provider} branch, or call their customer service. Online applications are fastest and often come with exclusive offers.`
  },
  {
    question: `What are the fees for ${cardName}?`,
    answer: `Check the fees table above for joining fee, annual fee, and other charges. Many cards waive annual fees if you meet minimum spending criteria. Always read the terms and conditions.`
  },
  {
    question: `Can I get ${cardName} if I'm self-employed?`,
    answer: `Yes, self-employed individuals can apply by providing ITR for last 2-3 years, business proof, and bank statements. Income requirements may be slightly higher than salaried applicants.`
  },
  {
    question: `How long does it take to receive ${cardName}?`,
    answer: `After approval, physical card delivery takes 7-10 business days. Some applicants receive instant virtual cards for immediate use. Track your application status through ${provider}'s website or app.`
  }
];

// Loans FAQs
export const LOAN_FAQS: FAQItem[] = [
  {
    question: "What is the difference between secured and unsecured loans?",
    answer: "Secured loans require collateral (home, car, gold) and offer lower interest rates. Unsecured loans (personal loans) don't need collateral but have higher interest rates due to increased risk for lenders."
  },
  {
    question: "How is my loan eligibility calculated?",
    answer: "Lenders consider your income, credit score, existing EMIs, age, employment stability, and debt-to-income ratio. Generally, your total EMIs shouldn't exceed 50-60% of your monthly income."
  },
  {
    question: "What is a good interest rate for personal loans in India?",
    answer: "Personal loan interest rates range from 10-24% per annum. Rates below 12% are considered excellent, 12-16% are good, and above 18% are high. Your credit score significantly impacts the rate offered."
  },
  {
    question: "Can I prepay my loan without penalty?",
    answer: "For floating rate loans, RBI mandates zero prepayment charges. For fixed rate loans, banks may charge 2-5% penalty. Always check your loan agreement for specific prepayment terms."
  },
  {
    question: "How does loan tenure affect my EMI?",
    answer: "Longer tenure = lower EMI but higher total interest. Shorter tenure = higher EMI but lower total interest. Use our EMI calculator to find the optimal balance for your budget."
  },
  {
    question: "What documents are required for a personal loan?",
    answer: "You'll need: PAN card, Aadhaar card, 3-6 months salary slips, 6 months bank statements, employment proof, and address proof. Self-employed need ITR and business proof."
  },
  {
    question: "Can I get a loan with a low credit score?",
    answer: "Loans are possible with scores below 700 but expect higher interest rates, lower loan amounts, or need for a co-applicant/guarantor. Consider improving your score before applying."
  },
  {
    question: "What is the maximum loan amount I can get?",
    answer: "Personal loans typically range from ₹50,000 to ₹40 lakhs. Your eligibility depends on income (usually 10-20x monthly salary), credit score, and existing liabilities."
  },
  {
    question: "How long does loan approval take?",
    answer: "Digital lenders offer instant approval (minutes to hours). Traditional banks take 2-7 business days. Disbursement happens within 24-48 hours after approval for most lenders."
  },
  {
    question: "What is loan insurance and do I need it?",
    answer: "Loan insurance covers your EMIs in case of death, disability, or job loss. It's optional but recommended for large loans. Premium is typically 0.5-1% of loan amount annually."
  }
];

// Insurance FAQs
export const INSURANCE_FAQS: FAQItem[] = [
  {
    question: "What is the difference between term insurance and whole life insurance?",
    answer: "Term insurance provides coverage for a specific period (10-40 years) with no maturity benefit. Whole life insurance covers you for life and includes savings component, but premiums are 5-10x higher."
  },
  {
    question: "How much life insurance coverage do I need?",
    answer: "A common rule is 10-15x your annual income. Consider your liabilities (loans, future expenses), dependents' needs, and inflation. Our insurance calculator can help determine the right amount."
  },
  {
    question: "Can I buy insurance online?",
    answer: "Yes! Online insurance is 20-30% cheaper due to lower distribution costs. The process is paperless, instant, and equally valid. Medical tests may still be required for high coverage amounts."
  },
  {
    question: "What is a waiting period in health insurance?",
    answer: "Initial waiting period (30 days) applies to all illnesses except accidents. Pre-existing diseases have 2-4 year waiting periods. Specific illnesses (hernia, cataract) have 1-2 year waiting."
  },
  {
    question: "Do I need both health and life insurance?",
    answer: "Yes, they serve different purposes. Life insurance protects your family's financial future if you pass away. Health insurance covers medical expenses. Both are essential for comprehensive protection."
  },
  {
    question: "Can I claim tax benefits on insurance premiums?",
    answer: "Yes! Life insurance premiums qualify for ₹1.5 lakh deduction under Section 80C. Health insurance premiums get ₹25,000 (₹50,000 for senior citizens) under Section 80D."
  },
  {
    question: "What is a no-claim bonus in insurance?",
    answer: "Health insurance offers 5-10% premium discount or increased coverage for each claim-free year, up to 50%. This incentivizes preventive care and rewards healthy policyholders."
  },
  {
    question: "Should I buy insurance from an agent or online?",
    answer: "Online is cheaper and faster. Agents provide personalized advice and claim assistance. For simple term plans, go online. For complex needs (ULIPs, endowment), consider agent guidance."
  },
  {
    question: "What happens if I miss a premium payment?",
    answer: "You get a grace period (15-30 days). If unpaid, policy lapses. You can revive it within 2-5 years by paying dues with interest. Some policies offer automatic premium payment from bank account."
  },
  {
    question: "Can I have multiple health insurance policies?",
    answer: "Yes, you can have multiple policies. Claims are settled proportionately or sequentially. Having 2 policies can provide higher coverage and better claim settlement options."
  }
];

// Mutual Funds FAQs
export const MUTUAL_FUND_FAQS: FAQItem[] = [
  {
    question: "What is the minimum amount to invest in mutual funds?",
    answer: "You can start with as low as ₹500 for SIP (Systematic Investment Plan) or ₹5,000 for lump sum in most funds. Some funds have even lower minimums of ₹100 for SIP."
  },
  {
    question: "What is the difference between SIP and lump sum investment?",
    answer: "SIP invests fixed amount monthly, averaging out market volatility (rupee cost averaging). Lump sum invests entire amount at once. SIP is better for regular income earners; lump sum for windfall gains."
  },
  {
    question: "Are mutual funds safe?",
    answer: "Mutual funds are regulated by SEBI and relatively safe, but not risk-free. Equity funds have higher risk/return, debt funds are lower risk. Diversification and long-term investing reduce risk significantly."
  },
  {
    question: "What is an expense ratio in mutual funds?",
    answer: "Expense ratio is the annual fee charged by fund house (0.5-2.5% of assets). Lower is better. Direct plans have 0.5-1% lower expense ratio than regular plans, significantly impacting long-term returns."
  },
  {
    question: "How are mutual fund returns taxed?",
    answer: "Equity funds: LTCG (>1 year) taxed at 10% above ₹1 lakh, STCG at 15%. Debt funds: LTCG (>3 years) at 20% with indexation, STCG at slab rate. Tax rules updated in Budget 2024."
  },
  {
    question: "What is NAV in mutual funds?",
    answer: "Net Asset Value is the per-unit price of the fund, calculated daily after market close. It's the price at which you buy/sell units. NAV = (Total Assets - Liabilities) / Total Units."
  },
  {
    question: "Can I withdraw my mutual fund investment anytime?",
    answer: "Open-ended funds allow withdrawal anytime (may have exit load if withdrawn before 1 year). ELSS has 3-year lock-in. Closed-ended funds can only be withdrawn at maturity or sold on exchange."
  },
  {
    question: "What is the difference between growth and dividend option?",
    answer: "Growth option reinvests profits, compounding your returns. Dividend option pays out profits periodically (now taxable in investor's hands). Growth is better for long-term wealth creation."
  },
  {
    question: "How do I choose the right mutual fund?",
    answer: "Consider your goals, risk tolerance, and time horizon. Equity funds for >5 years, debt funds for 1-3 years, hybrid for moderate risk. Check fund performance, expense ratio, and fund manager track record."
  },
  {
    question: "What is the difference between direct and regular mutual funds?",
    answer: "Direct plans have no distributor commission, resulting in 0.5-1% lower expense ratio. You invest directly with AMC. Regular plans involve distributors/advisors. Direct plans give 1-2% higher returns over time."
  }
];

// Category-specific FAQ getter
export const getCategoryFAQs = (category: string): FAQItem[] => {
  switch (category.toLowerCase()) {
    case 'credit_card':
    case 'credit-cards':
      return CREDIT_CARD_FAQS;
    case 'loan':
    case 'loans':
      return LOAN_FAQS;
    case 'insurance':
      return INSURANCE_FAQS;
    case 'mutual_fund':
    case 'mutual-funds':
      return MUTUAL_FUND_FAQS;
    default:
      return CREDIT_CARD_FAQS; // Fallback
  }
};
