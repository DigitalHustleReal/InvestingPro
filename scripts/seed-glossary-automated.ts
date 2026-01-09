/**
 * Automated Glossary Seeding Script
 * Run with: npx tsx scripts/seed-glossary-automated.ts
 * 
 * This is a fully automated script that seeds 100 glossary terms
 * No manual intervention required - just run and go!
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create service role client (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Category mapping
const categoryMap: Record<string, string> = {
  'Mutual Funds': 'mutual-funds',
  'Credit Cards': 'credit-cards',
  'Insurance': 'insurance',
  'Loans': 'loans',
  'Tax Planning': 'tax',
  'General Finance': 'general'
};

// 100 Glossary Terms
const GLOSSARY_TERMS = [
  // Mutual Funds (25 terms)
  { term: "NAV (Net Asset Value)", definition: "The per-unit market value of a mutual fund scheme. It represents the price at which investors buy or sell fund units. NAV is calculated by dividing the total value of all assets in the portfolio, minus liabilities, by the number of outstanding units.", category: "Mutual Funds", example: "If a mutual fund has total assets worth ₹100 crore and 10 crore units outstanding, the NAV would be ₹10 per unit.", related_terms: ["SIP", "Mutual Fund", "Unit"] },
  { term: "SIP (Systematic Investment Plan)", definition: "A disciplined investment approach where you invest a fixed amount regularly (monthly, quarterly) in a mutual fund scheme. SIP helps in rupee cost averaging and removes the need to time the market.", category: "Mutual Funds", example: "Investing ₹5,000 every month in an equity mutual fund through SIP for 10 years.", related_terms: ["NAV", "Lump Sum", "Rupee Cost Averaging"] },
  { term: "Expense Ratio", definition: "The annual fee charged by mutual funds to manage your investment, expressed as a percentage of assets. It includes fund management fees, administrative costs, and distribution expenses. Lower expense ratios mean higher returns for investors.", category: "Mutual Funds", example: "An expense ratio of 1.5% means you pay ₹1,500 annually for every ₹1 lakh invested.", related_terms: ["Direct Plan", "Regular Plan", "TER"] },
  { term: "Exit Load", definition: "A fee charged by mutual funds when you redeem your investment before a specified period. It discourages short-term trading and is typically 1% if redeemed within one year.", category: "Mutual Funds", example: "If exit load is 1% and you redeem ₹1 lakh within 1 year, you'll pay ₹1,000 as exit load.", related_terms: ["Redemption", "Lock-in Period", "NAV"] },
  { term: "ELSS (Equity Linked Savings Scheme)", definition: "A tax-saving mutual fund with a mandatory 3-year lock-in period. Investments up to ₹1.5 lakh qualify for tax deduction under Section 80C. It primarily invests in equity markets.", category: "Mutual Funds", example: "Investing ₹1.5 lakh in ELSS can save up to ₹46,800 in taxes (at 30% tax bracket).", related_terms: ["80C", "Lock-in Period", "Tax Saving"] },
  { term: "AUM (Assets Under Management)", definition: "The total market value of all assets that a mutual fund manages on behalf of investors. Higher AUM generally indicates investor confidence and better liquidity.", category: "Mutual Funds", example: "A fund with AUM of ₹10,000 crore manages investments worth that amount.", related_terms: ["Fund Size", "Liquidity", "NAV"] },
  { term: "Direct Plan", definition: "A mutual fund plan where you invest directly with the fund house without intermediaries. Direct plans have lower expense ratios (0.5-1% less) compared to regular plans, resulting in higher returns.", category: "Mutual Funds", example: "Direct plan expense ratio: 1.2% vs Regular plan: 2.0% - saving 0.8% annually.", related_terms: ["Regular Plan", "Expense Ratio", "Distributor"] },
  { term: "Large Cap Fund", definition: "Mutual funds that invest at least 80% of assets in top 100 companies by market capitalization. These are relatively stable, lower-risk equity funds suitable for conservative investors.", category: "Mutual Funds", example: "Funds investing in companies like Reliance, TCS, HDFC Bank, Infosys.", related_terms: ["Mid Cap", "Small Cap", "Market Cap"] },
  { term: "Mid Cap Fund", definition: "Funds investing primarily in companies ranked 101-250 by market capitalization. They offer higher growth potential than large caps but with increased volatility.", category: "Mutual Funds", example: "Companies like Dixon Technologies, Persistent Systems in the mid-cap range.", related_terms: ["Large Cap", "Small Cap", "Multi Cap"] },
  { term: "Small Cap Fund", definition: "Funds investing in companies ranked 251 and below by market cap. Highest risk-reward ratio among equity funds, suitable for aggressive investors with long investment horizons.", category: "Mutual Funds", example: "Emerging companies with market cap below ₹5,000 crore.", related_terms: ["Large Cap", "Mid Cap", "Volatility"] },
  { term: "Debt Fund", definition: "Mutual funds that invest in fixed-income securities like government bonds, corporate bonds, and money market instruments. Lower risk than equity funds with stable returns.", category: "Mutual Funds", example: "Liquid funds, short-term debt funds, gilt funds investing in government securities.", related_terms: ["Equity Fund", "Hybrid Fund", "Bond"] },
  { term: "Index Fund", definition: "A passive mutual fund that replicates a market index like Nifty 50 or Sensex. Low expense ratios (0.1-0.5%) and returns mirror the index performance.", category: "Mutual Funds", example: "Nifty 50 Index Fund will invest in all 50 Nifty stocks in same proportion.", related_terms: ["ETF", "Passive Investing", "Nifty 50"] },
  { term: "CAGR (Compound Annual Growth Rate)", definition: "The mean annual growth rate of an investment over a specified period longer than one year. It represents smoothed returns assuming profits are reinvested.", category: "Mutual Funds", example: "If ₹1 lakh grows to ₹2 lakh in 5 years, CAGR is approximately 14.87%.", related_terms: ["Returns", "Absolute Return", "XIRR"] },
  { term: "SWP (Systematic Withdrawal Plan)", definition: "A facility to withdraw a fixed amount regularly from your mutual fund investment. Useful for generating regular income, especially during retirement.", category: "Mutual Funds", example: "Withdrawing ₹25,000 monthly from a ₹50 lakh corpus for regular income.", related_terms: ["SIP", "Redemption", "Retirement Planning"] },
  { term: "STP (Systematic Transfer Plan)", definition: "A strategy to transfer a fixed amount periodically from one mutual fund scheme to another, typically from debt to equity funds. Helps in rupee cost averaging.", category: "Mutual Funds", example: "Transferring ₹10,000 monthly from liquid fund to equity fund over 12 months.", related_terms: ["SIP", "Asset Allocation", "Rebalancing"] },
  { term: "Dividend Option", definition: "A mutual fund payout option where profits are distributed to investors periodically. Dividends reduce NAV and are now taxable in investor's hands.", category: "Mutual Funds", example: "Fund declares 10% dividend on NAV of ₹100, you receive ₹10 per unit.", related_terms: ["Growth Option", "IDCW", "NAV"] },
  { term: "Growth Option", definition: "A mutual fund option where profits are reinvested in the scheme instead of being distributed. NAV grows over time, suitable for long-term wealth creation.", category: "Mutual Funds", example: "NAV grows from ₹10 to ₹50 over 10 years with all profits reinvested.", related_terms: ["Dividend Option", "Compounding", "NAV"] },
  { term: "Lock-in Period", definition: "The minimum duration for which your investment must remain in the fund. ELSS has 3 years, while most other funds have no lock-in but may have exit loads.", category: "Mutual Funds", example: "ELSS funds have mandatory 3-year lock-in; you cannot redeem before that.", related_terms: ["ELSS", "Exit Load", "Redemption"] },
  { term: "Folio Number", definition: "A unique account number assigned to an investor by the mutual fund company. All your investments with that fund house are tracked under this number.", category: "Mutual Funds", example: "Your folio number 12345678 tracks all your schemes with HDFC Mutual Fund.", related_terms: ["PAN", "KYC", "Investment Account"] },
  { term: "NFO (New Fund Offer)", definition: "The initial offering of a new mutual fund scheme to investors. Units are typically offered at ₹10 during NFO period before the fund starts regular operations.", category: "Mutual Funds", example: "XYZ Flexi Cap Fund NFO opens for subscription at ₹10 per unit.", related_terms: ["NAV", "Fund Launch", "Subscription"] },
  { term: "Benchmark", definition: "A standard index against which a mutual fund's performance is measured. Helps investors evaluate if the fund is outperforming or underperforming the market.", category: "Mutual Funds", example: "Large cap fund benchmarked against Nifty 50; if Nifty gives 12%, fund should aim for 13-14%.", related_terms: ["Alpha", "Beta", "Index"] },
  { term: "Alpha", definition: "The excess return generated by a fund compared to its benchmark. Positive alpha indicates outperformance and reflects the fund manager's skill.", category: "Mutual Funds", example: "If benchmark returns 10% and fund returns 13%, alpha is +3%.", related_terms: ["Beta", "Benchmark", "Risk-Adjusted Return"] },
  { term: "Beta", definition: "A measure of a fund's volatility relative to its benchmark. Beta of 1 means fund moves with market; >1 means more volatile; <1 means less volatile.", category: "Mutual Funds", example: "Beta of 1.2 means if market moves 10%, fund typically moves 12%.", related_terms: ["Alpha", "Volatility", "Risk"] },
  { term: "Sharpe Ratio", definition: "A measure of risk-adjusted returns. Higher Sharpe ratio indicates better returns per unit of risk taken. Ratio above 1 is considered good.", category: "Mutual Funds", example: "Fund A: 15% return, Sharpe 1.5 vs Fund B: 18% return, Sharpe 0.8 - Fund A is better risk-adjusted.", related_terms: ["Risk-Adjusted Return", "Standard Deviation", "Alpha"] },
  { term: "Standard Deviation", definition: "A statistical measure of a fund's volatility. Higher standard deviation means higher volatility and risk. Helps assess consistency of returns.", category: "Mutual Funds", example: "Fund with SD of 15% is more volatile than one with SD of 8%.", related_terms: ["Volatility", "Risk", "Sharpe Ratio"] },

  // Credit Cards (20 terms)
  { term: "Credit Limit", definition: "The maximum amount you can borrow on your credit card. It's determined by your income, credit score, and repayment history. Exceeding this limit may result in fees or transaction decline.", category: "Credit Cards", example: "A credit limit of ₹2 lakh means you can spend up to that amount on your card.", related_terms: ["Credit Utilization", "Available Credit", "Credit Score"] },
  { term: "APR (Annual Percentage Rate)", definition: "The yearly interest rate charged on outstanding credit card balances. In India, APR typically ranges from 24% to 48% annually (2-4% monthly).", category: "Credit Cards", example: "APR of 36% means 3% monthly interest on unpaid balances.", related_terms: ["Interest Rate", "Finance Charges", "Minimum Due"] },
  { term: "Grace Period", definition: "The interest-free period between purchase date and payment due date, typically 20-50 days. No interest is charged if you pay the full balance within this period.", category: "Credit Cards", example: "Purchase on Jan 1, statement on Jan 31, due date Feb 20 - 50 days grace period.", related_terms: ["Billing Cycle", "Due Date", "Interest-Free Period"] },
  { term: "Minimum Amount Due", definition: "The minimum payment required by the due date to avoid late fees, typically 5% of outstanding balance. Paying only minimum attracts high interest on remaining amount.", category: "Credit Cards", example: "Outstanding ₹50,000, minimum due ₹2,500 (5%). Pay full ₹50,000 to avoid interest.", related_terms: ["Outstanding Balance", "Late Fee", "Interest"] },
  { term: "Reward Points", definition: "Points earned on credit card spending that can be redeemed for cashback, vouchers, air miles, or products. Typically 1-4 points per ₹100-150 spent.", category: "Credit Cards", example: "Earn 2 points per ₹100 spent; 10,000 points = ₹2,000 voucher.", related_terms: ["Cashback", "Air Miles", "Redemption"] },
  { term: "Annual Fee", definition: "A yearly charge for maintaining your credit card. Premium cards charge ₹500-₹10,000+ annually, often waived if you meet spending thresholds.", category: "Credit Cards", example: "₹5,000 annual fee waived on spending ₹2 lakh in a year.", related_terms: ["Joining Fee", "Fee Waiver", "Lifetime Free"] },
  { term: "Credit Utilization Ratio", definition: "The percentage of your credit limit being used. Keeping it below 30% is ideal for maintaining a good credit score.", category: "Credit Cards", example: "Using ₹30,000 of ₹1 lakh limit = 30% utilization (healthy).", related_terms: ["Credit Limit", "Credit Score", "CIBIL"] },
  { term: "Cash Advance", definition: "Withdrawing cash using your credit card from ATMs. It attracts immediate interest (no grace period), higher fees (2.5-3%), and should be avoided.", category: "Credit Cards", example: "Withdraw ₹10,000 cash: Pay ₹250 fee + 3% monthly interest from day 1.", related_terms: ["ATM Withdrawal", "Finance Charges", "Interest"] },
  { term: "Balance Transfer", definition: "Moving outstanding credit card debt from one card to another, usually to benefit from lower interest rates or promotional offers.", category: "Credit Cards", example: "Transfer ₹1 lakh debt from 3.5% monthly interest card to 0% for 6 months offer.", related_terms: ["Debt Consolidation", "Interest Rate", "Processing Fee"] },
  { term: "EMI Conversion", definition: "Converting large purchases into equal monthly installments. Banks charge interest (12-18% annually) and processing fees for this facility.", category: "Credit Cards", example: "₹60,000 purchase converted to 12 EMIs of ₹5,500 at 15% interest.", related_terms: ["Installment", "Interest Rate", "Processing Fee"] },
  { term: "Contactless Payment", definition: "Tap-and-pay technology using NFC for transactions up to ₹5,000 without PIN. Faster checkout but requires card proximity to terminal.", category: "Credit Cards", example: "Tap card on POS machine for ₹500 coffee purchase - instant payment.", related_terms: ["NFC", "Tap to Pay", "UPI"] },
  { term: "Forex Markup", definition: "Additional charge (1.5-3.5%) levied on international transactions for currency conversion. Premium travel cards often have lower markup.", category: "Credit Cards", example: "$100 purchase: Pay ₹8,300 + 3.5% markup (₹290) = ₹8,590 total.", related_terms: ["International Transaction", "Currency Conversion", "Travel Card"] },
  { term: "Lounge Access", definition: "Complimentary access to airport lounges offered by premium credit cards. Typically 4-12 visits per year domestic/international.", category: "Credit Cards", example: "Premium card offers 8 domestic + 4 international lounge visits annually.", related_terms: ["Travel Benefits", "Priority Pass", "Premium Card"] },
  { term: "Fuel Surcharge Waiver", definition: "Waiver of 1% fuel surcharge at petrol pumps, typically on transactions between ₹400-₹4,000. Saves ₹100-₹1,000 monthly for regular users.", category: "Credit Cards", example: "₹4,000 fuel purchase: Save ₹40 surcharge with waiver benefit.", related_terms: ["Surcharge", "Fuel Card", "Savings"] },
  { term: "Add-on Card", definition: "Supplementary credit card issued to family members (spouse, children, parents) sharing your credit limit. Useful for tracking family expenses.", category: "Credit Cards", example: "Issue add-on card to spouse with ₹50,000 sub-limit from your ₹2 lakh limit.", related_terms: ["Supplementary Card", "Family Card", "Credit Limit"] },
  { term: "Chargeback", definition: "Reversing a credit card transaction due to fraud, billing errors, or non-delivery of goods. Banks investigate and may refund if claim is valid.", category: "Credit Cards", example: "Charged ₹10,000 for undelivered product - file chargeback to get refund.", related_terms: ["Dispute", "Fraud Protection", "Refund"] },
  { term: "Credit Shield", definition: "Insurance that pays your credit card dues in case of job loss, disability, or death. Costs 0.5-1% of outstanding balance monthly.", category: "Credit Cards", example: "₹1 lakh outstanding: Pay ₹500-₹1,000 monthly for credit shield insurance.", related_terms: ["Credit Insurance", "Payment Protection", "Premium"] },
  { term: "Revolving Credit", definition: "The ability to carry forward unpaid balance to next month by paying minimum due. Attracts high interest (24-48% annually) on carried amount.", category: "Credit Cards", example: "₹50,000 outstanding, pay ₹5,000 minimum, carry ₹45,000 at 3% monthly interest.", related_terms: ["Minimum Due", "Interest", "Outstanding Balance"] },
  { term: "Statement Date", definition: "The date when your monthly credit card statement is generated, showing all transactions and amount due. Typically 15-20 days before payment due date.", category: "Credit Cards", example: "Statement date: 1st of month, Due date: 20th - 19 days to pay.", related_terms: ["Billing Cycle", "Due Date", "Grace Period"] },
  { term: "Welcome Bonus", definition: "Reward points, vouchers, or cashback offered when you get a new credit card and meet initial spending criteria.", category: "Credit Cards", example: "Get 10,000 bonus points worth ₹2,500 on spending ₹50,000 in first 90 days.", related_terms: ["Joining Bonus", "Reward Points", "Milestone Benefits"] },

  // Insurance (15 terms)
  { term: "Premium", definition: "The amount you pay to the insurance company to keep your policy active. Can be paid monthly, quarterly, half-yearly, or annually.", category: "Insurance", example: "₹15,000 annual premium for ₹10 lakh term insurance coverage.", related_terms: ["Policy", "Coverage", "Sum Assured"] },
  { term: "Sum Assured", definition: "The guaranteed amount payable by the insurance company on maturity or death of the insured. Also called coverage amount or death benefit.", category: "Insurance", example: "₹1 crore sum assured means family gets ₹1 crore on policyholder's death.", related_terms: ["Premium", "Death Benefit", "Coverage"] },
  { term: "Claim", definition: "A formal request to the insurance company for payment based on policy terms. Must be filed with required documents within specified time.", category: "Insurance", example: "File health insurance claim with hospital bills within 30 days of discharge.", related_terms: ["Claim Settlement", "Documentation", "Reimbursement"] },
  { term: "Deductible", definition: "The amount you must pay out-of-pocket before insurance coverage kicks in. Higher deductible means lower premium.", category: "Insurance", example: "₹25,000 deductible: You pay first ₹25,000, insurance covers rest.", related_terms: ["Co-payment", "Premium", "Out-of-Pocket"] },
  { term: "Nominee", definition: "The person designated to receive insurance benefits in case of policyholder's death. Can be changed during policy term.", category: "Insurance", example: "Spouse nominated to receive ₹50 lakh term insurance payout.", related_terms: ["Beneficiary", "Sum Assured", "Death Benefit"] },
  { term: "Waiting Period", definition: "The initial period after buying insurance during which certain claims are not covered. Typically 30 days for health, 2-4 years for pre-existing diseases.", category: "Insurance", example: "30-day waiting period: Cannot claim for illness in first 30 days.", related_terms: ["Pre-existing Disease", "Coverage", "Exclusions"] },
  { term: "Rider", definition: "Additional coverage that can be added to base insurance policy for extra premium. Common riders include critical illness, accidental death, waiver of premium.", category: "Insurance", example: "Add critical illness rider for ₹2,000 extra annual premium.", related_terms: ["Add-on", "Coverage", "Premium"] },
  { term: "Maturity Benefit", definition: "The amount paid by insurance company when policy term ends. Applicable in endowment and money-back policies, not in pure term insurance.", category: "Insurance", example: "₹10 lakh maturity benefit after 20-year endowment policy term.", related_terms: ["Sum Assured", "Endowment", "Payout"] },
  { term: "Surrender Value", definition: "The amount you receive if you cancel your insurance policy before maturity. Available only after paying premiums for minimum period (usually 3 years).", category: "Insurance", example: "Paid ₹5 lakh premiums over 5 years, surrender value might be ₹3.5 lakh.", related_terms: ["Policy Lapse", "Maturity", "Premium"] },
  { term: "Co-payment", definition: "A percentage of medical expenses you must pay from your pocket, with insurance covering the rest. Common in senior citizen health policies.", category: "Insurance", example: "20% co-payment: For ₹1 lakh bill, you pay ₹20,000, insurance pays ₹80,000.", related_terms: ["Deductible", "Out-of-Pocket", "Health Insurance"] },
  { term: "Cashless Treatment", definition: "Medical treatment at network hospitals where insurance company directly settles bills. No upfront payment needed from policyholder.", category: "Insurance", example: "Get surgery at network hospital, insurance pays hospital directly.", related_terms: ["Network Hospital", "Reimbursement", "Health Insurance"] },
  { term: "Pre-existing Disease", definition: "Any medical condition you had before buying health insurance. Usually covered after 2-4 year waiting period.", category: "Insurance", example: "Diabetes diagnosed before policy: Covered after 3-year waiting period.", related_terms: ["Waiting Period", "Exclusions", "Coverage"] },
  { term: "No Claim Bonus", definition: "Discount or increased coverage offered for not making claims. In health insurance, sum assured increases 5-50% annually; in motor, premium reduces 20-50%.", category: "Insurance", example: "₹5 lakh health cover increases to ₹5.5 lakh after claim-free year.", related_terms: ["Bonus", "Premium Discount", "Loyalty Benefit"] },
  { term: "IDV (Insured Declared Value)", definition: "The current market value of your vehicle for insurance purposes. Determines premium amount and maximum claim payout for total loss.", category: "Insurance", example: "Car bought for ₹10 lakh, IDV after 3 years might be ₹6 lakh.", related_terms: ["Depreciation", "Motor Insurance", "Premium"] },
  { term: "Third Party Insurance", definition: "Mandatory motor insurance covering damages/injuries caused to others. Does not cover own vehicle damage. Cheaper than comprehensive insurance.", category: "Insurance", example: "₹2,000 annual third-party premium vs ₹15,000 comprehensive.", related_terms: ["Comprehensive Insurance", "Motor Insurance", "Liability"] },

  // Loans (15 terms)
  { term: "EMI (Equated Monthly Installment)", definition: "Fixed monthly payment towards loan repayment, including principal and interest. Remains constant throughout loan tenure unless interest rate changes.", category: "Loans", example: "₹10 lakh loan at 9% for 10 years = ₹12,668 monthly EMI.", related_terms: ["Principal", "Interest", "Tenure"] },
  { term: "Principal Amount", definition: "The original loan amount borrowed from lender, excluding interest. EMI payments gradually reduce this amount over loan tenure.", category: "Loans", example: "Borrowed ₹20 lakh for home - this is your principal amount.", related_terms: ["EMI", "Interest", "Loan Amount"] },
  { term: "Interest Rate", definition: "The percentage charged by lender on loan amount. Can be fixed (constant) or floating (changes with market rates). Expressed annually.", category: "Loans", example: "9% annual interest on home loan means 0.75% monthly interest.", related_terms: ["ROI", "Fixed Rate", "Floating Rate"] },
  { term: "Processing Fee", definition: "One-time charge levied by lender for processing loan application. Typically 0.5-2% of loan amount, non-refundable even if loan is rejected.", category: "Loans", example: "₹20 lakh loan with 1% processing fee = ₹20,000 upfront cost.", related_terms: ["Loan Charges", "Upfront Fee", "Documentation"] },
  { term: "Prepayment", definition: "Paying off loan before scheduled tenure ends. Can be full (foreclose) or partial. Some lenders charge prepayment penalty of 2-5%.", category: "Loans", example: "Prepay ₹5 lakh on ₹20 lakh loan to reduce EMI or tenure.", related_terms: ["Foreclosure", "Part Payment", "Penalty"] },
  { term: "Loan Tenure", definition: "The time period over which loan must be repaid. Longer tenure means lower EMI but higher total interest paid.", category: "Loans", example: "20-year tenure: EMI ₹9,000, total interest ₹21 lakh vs 10-year: EMI ₹15,000, interest ₹10 lakh.", related_terms: ["EMI", "Interest", "Repayment Period"] },
  { term: "Collateral", definition: "Asset pledged as security for loan. Lender can seize it if you default. Home loans use property as collateral; personal loans are unsecured.", category: "Loans", example: "House worth ₹50 lakh pledged as collateral for ₹35 lakh home loan.", related_terms: ["Secured Loan", "Mortgage", "Security"] },
  { term: "LTV (Loan to Value Ratio)", definition: "Percentage of asset value that lender will finance. Higher LTV means lower down payment but may attract higher interest rates.", category: "Loans", example: "80% LTV on ₹50 lakh property = ₹40 lakh loan, ₹10 lakh down payment.", related_terms: ["Down Payment", "Margin", "Loan Amount"] },
  { term: "CIBIL Score", definition: "Credit score (300-900) indicating creditworthiness. Score above 750 is excellent, 650-750 is good. Higher score means better loan terms and lower interest rates.", category: "Loans", example: "Score 780: Get loan at 8.5% vs Score 680: Get loan at 10%.", related_terms: ["Credit Score", "Credit History", "Creditworthiness"] },
  { term: "Debt-to-Income Ratio", definition: "Percentage of monthly income going towards debt payments. Lenders prefer DTI below 40-50% for loan approval.", category: "Loans", example: "Income ₹1 lakh, existing EMIs ₹30,000 = 30% DTI (healthy).", related_terms: ["EMI", "Income", "Loan Eligibility"] },
  { term: "Moratorium Period", definition: "Initial period during which you don't pay EMIs, common in education loans. Interest may accrue and be added to principal.", category: "Loans", example: "4-year course + 1 year job search = 5-year moratorium on education loan.", related_terms: ["Grace Period", "EMI Holiday", "Education Loan"] },
  { term: "Balance Transfer", definition: "Shifting outstanding loan from one lender to another to get lower interest rate or better terms. May involve processing fees.", category: "Loans", example: "Transfer ₹30 lakh home loan from 9.5% to 8.5% bank, save ₹3 lakh over 15 years.", related_terms: ["Refinancing", "Interest Rate", "Processing Fee"] },
  { term: "Top-up Loan", definition: "Additional loan taken on existing loan at preferential rates. Available after repaying certain percentage of original loan.", category: "Loans", example: "After 3 years of home loan, take ₹10 lakh top-up at 9.5% vs 14% personal loan.", related_terms: ["Additional Loan", "Home Loan", "Interest Rate"] },
  { term: "Guarantor", definition: "Person who agrees to repay loan if borrower defaults. Required for education loans, some personal loans. Guarantor's credit score also matters.", category: "Loans", example: "Parent acts as guarantor for child's ₹15 lakh education loan.", related_terms: ["Co-borrower", "Liability", "Default"] },
  { term: "Amortization", definition: "The process of gradually paying off loan through regular EMI payments. Early EMIs have more interest, later EMIs have more principal.", category: "Loans", example: "First EMI: ₹15,000 interest + ₹5,000 principal. Last EMI: ₹500 interest + ₹19,500 principal.", related_terms: ["EMI", "Principal", "Interest"] },

  // Tax & Regulatory (15 terms)
  { term: "Section 80C", definition: "Tax deduction up to ₹1.5 lakh on investments in ELSS, PPF, EPF, life insurance premiums, home loan principal, NSC, etc. Most popular tax-saving provision.", category: "Tax Planning", example: "Invest ₹1.5 lakh in ELSS, save ₹46,800 tax at 30% bracket.", related_terms: ["Tax Deduction", "ELSS", "PPF"] },
  { term: "LTCG (Long Term Capital Gains)", definition: "Profit from selling assets held for over specified period. Equity: >1 year, Debt: >3 years. Taxed at 10% above ₹1 lakh for equity.", category: "Tax Planning", example: "Sell shares after 2 years, profit ₹2 lakh: Pay 10% tax on ₹1 lakh = ₹10,000.", related_terms: ["STCG", "Capital Gains", "Indexation"] },
  { term: "STCG (Short Term Capital Gains)", definition: "Profit from selling assets held for short period. Equity: <1 year (15% tax), Debt: <3 years (slab rate). Higher tax than LTCG.", category: "Tax Planning", example: "Sell shares after 6 months, profit ₹1 lakh: Pay 15% tax = ₹15,000.", related_terms: ["LTCG", "Capital Gains", "Tax Rate"] },
  { term: "TDS (Tax Deducted at Source)", definition: "Tax deducted by payer before making payment. Applicable on salary, interest, rent, professional fees. Deducted amount is deposited with government.", category: "Tax Planning", example: "₹50,000 FD interest: Bank deducts 10% TDS (₹5,000), credits ₹45,000.", related_terms: ["Form 26AS", "Tax Credit", "Withholding Tax"] },
  { term: "ITR (Income Tax Return)", definition: "Annual statement filed with Income Tax Department declaring income, deductions, and tax paid. Must file by July 31 for salaried individuals.", category: "Tax Planning", example: "File ITR-1 for salary income below ₹50 lakh with no business income.", related_terms: ["Tax Filing", "Assessment Year", "Form 16"] },
  { term: "HRA (House Rent Allowance)", definition: "Tax-exempt component of salary for employees living in rented accommodation. Exemption is minimum of: actual HRA, 50% of salary (metro) or 40% (non-metro), or rent minus 10% of salary.", category: "Tax Planning", example: "Salary ₹60,000, HRA ₹20,000, rent ₹18,000: Get ₹12,000 exemption.", related_terms: ["Salary", "Tax Exemption", "Rent"] },
  { term: "Standard Deduction", definition: "Flat ₹50,000 deduction available to all salaried individuals and pensioners. No proof required, automatically reduces taxable income.", category: "Tax Planning", example: "Salary ₹10 lakh: Taxable income becomes ₹9.5 lakh after standard deduction.", related_terms: ["Tax Deduction", "Salary", "Taxable Income"] },
  { term: "Section 80D", definition: "Tax deduction for health insurance premiums. ₹25,000 for self/family, additional ₹25,000 for parents (₹50,000 if parents are senior citizens).", category: "Tax Planning", example: "Pay ₹15,000 premium for self + ₹30,000 for senior parents: Deduct ₹45,000.", related_terms: ["Health Insurance", "Tax Deduction", "Premium"] },
  { term: "Indexation", definition: "Adjusting purchase price of asset for inflation when calculating capital gains. Reduces taxable gains on debt mutual funds and property.", category: "Tax Planning", example: "Property bought for ₹50 lakh in 2015, indexed cost ₹75 lakh in 2025, sold for ₹1 crore: Taxable gain ₹25 lakh instead of ₹50 lakh.", related_terms: ["LTCG", "Inflation", "Cost Inflation Index"] },
  { term: "Rebate u/s 87A", definition: "Full tax rebate up to ₹12,500 for individuals with taxable income up to ₹5 lakh under old regime. Makes income up to ₹5 lakh tax-free.", category: "Tax Planning", example: "Taxable income ₹4.8 lakh, tax ₹10,000: Get full ₹10,000 rebate, pay zero tax.", related_terms: ["Tax Rebate", "Old Regime", "Tax Exemption"] },
  { term: "Form 16", definition: "TDS certificate issued by employer showing salary paid and tax deducted. Required for filing ITR. Contains Part A (employer details) and Part B (salary breakup).", category: "Tax Planning", example: "Download Form 16 from employer portal before filing ITR in July.", related_terms: ["TDS", "ITR", "Salary"] },
  { term: "Assessment Year", definition: "The year in which income of previous year is assessed and taxed. Always one year ahead of Financial Year.", category: "Tax Planning", example: "Income earned in FY 2024-25 is assessed in AY 2025-26.", related_terms: ["Financial Year", "ITR", "Tax Filing"] },
  { term: "PAN (Permanent Account Number)", definition: "10-character unique identifier issued by Income Tax Department. Mandatory for financial transactions above certain limits and filing ITR.", category: "Tax Planning", example: "PAN: ABCDE1234F - required for opening bank account, buying property, filing taxes.", related_terms: ["Aadhaar", "KYC", "Tax ID"] },
  { term: "NPS (National Pension System)", definition: "Government-backed retirement savings scheme. Additional ₹50,000 tax deduction under Section 80CCD(1B) over and above ₹1.5 lakh under 80C.", category: "Tax Planning", example: "Invest ₹50,000 in NPS: Save ₹15,600 tax at 30% bracket + build retirement corpus.", related_terms: ["80CCD(1B)", "Retirement", "Tax Saving"] },
  { term: "Tax Slab", definition: "Income ranges with different tax rates. New regime: 0-3L (0%), 3-7L (5%), 7-10L (10%), 10-12L (15%), 12-15L (20%), >15L (30%).", category: "Tax Planning", example: "Income ₹12 lakh in new regime: Pay ₹60,000 tax (₹20K+₹30K+₹30K+₹30K).", related_terms: ["Tax Rate", "New Regime", "Old Regime"] },

  // General Finance (10 terms)
  { term: "Inflation", definition: "The rate at which prices of goods and services increase over time, reducing purchasing power. In India, typically 4-6% annually.", category: "General Finance", example: "₹100 today will have purchasing power of ₹95 next year at 5% inflation.", related_terms: ["CPI", "Purchasing Power", "Real Returns"] },
  { term: "Compounding", definition: "Earning returns on both principal and accumulated interest. The longer you invest, the more powerful compounding becomes.", category: "General Finance", example: "₹1 lakh at 12% for 20 years becomes ₹9.6 lakh due to compounding.", related_terms: ["Interest", "Returns", "Time Value of Money"] },
  { term: "Emergency Fund", definition: "Liquid savings equal to 6-12 months of expenses kept for unexpected situations like job loss, medical emergencies. Should be in liquid funds or savings account.", category: "General Finance", example: "Monthly expenses ₹50,000: Keep ₹3-6 lakh as emergency fund.", related_terms: ["Liquidity", "Financial Planning", "Savings"] },
  { term: "Asset Allocation", definition: "Distribution of investments across different asset classes (equity, debt, gold, real estate) based on risk appetite and goals.", category: "General Finance", example: "Age 30: 70% equity, 20% debt, 10% gold. Age 50: 50% equity, 40% debt, 10% gold.", related_terms: ["Diversification", "Risk Management", "Portfolio"] },
  { term: "Liquidity", definition: "How quickly an asset can be converted to cash without significant loss. Savings account is highly liquid; real estate is illiquid.", category: "General Finance", example: "Liquid fund: Redeem today, get money tomorrow. Property: May take 6-12 months to sell.", related_terms: ["Emergency Fund", "Cash", "Redemption"] },
  { term: "Risk Appetite", definition: "Your ability and willingness to take investment risk. Depends on age, income stability, financial goals, and personality.", category: "General Finance", example: "Age 25, stable job, no dependents: High risk appetite, can invest 80% in equity.", related_terms: ["Risk Tolerance", "Investment Strategy", "Asset Allocation"] },
  { term: "Diversification", definition: "Spreading investments across different assets, sectors, and geographies to reduce risk. Don't put all eggs in one basket.", category: "General Finance", example: "Instead of only tech stocks, invest in pharma, banking, FMCG, international funds.", related_terms: ["Asset Allocation", "Risk Management", "Portfolio"] },
  { term: "Financial Goal", definition: "Specific monetary objective with defined timeline and amount. Can be short-term (<3 years), medium-term (3-7 years), or long-term (>7 years).", category: "General Finance", example: "Goal: ₹25 lakh for child's education in 10 years. Invest ₹12,000 monthly in equity funds.", related_terms: ["Goal Planning", "SIP", "Investment"] },
  { term: "Rupee Cost Averaging", definition: "Investing fixed amount regularly regardless of market levels. Automatically buy more units when prices are low, fewer when high.", category: "General Finance", example: "₹10,000 monthly SIP: Buy 100 units at ₹100, 125 units at ₹80 - average cost ₹88.89.", related_terms: ["SIP", "Market Timing", "Investment Strategy"] },
  { term: "Rebalancing", definition: "Periodically adjusting portfolio to maintain desired asset allocation. Sell outperformers, buy underperformers to manage risk.", category: "General Finance", example: "Target 60:40 equity:debt. After rally becomes 70:30. Sell 10% equity, buy debt to restore 60:40.", related_terms: ["Asset Allocation", "Portfolio Management", "Risk Management"] }
];

async function seedGlossary() {
  console.log('🌱 Starting automated glossary seeding...\n');
  console.log(`📊 Total terms to insert: ${GLOSSARY_TERMS.length}\n`);

  let successCount = 0;
  let errorCount = 0;
  const categoryCount: Record<string, number> = {};

  for (const term of GLOSSARY_TERMS) {
    try {
      const slug = term.term.toLowerCase()
        .replace(/[()]/g, '')
        .replace(/\s+/g, '-')
        .replace(/&/g, 'and');

      const category = categoryMap[term.category] || 'general';

      const { error } = await supabase
        .from('glossary_terms')
        .insert({
          term: term.term,
          category: category,
          definition: term.definition,
          slug: slug
        });

      if (error) {
        console.error(`❌ Error adding "${term.term}":`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Added: ${term.term}`);
        successCount++;
        categoryCount[term.category] = (categoryCount[term.category] || 0) + 1;
      }
    } catch (err) {
      console.error(`❌ Exception for "${term.term}":`, err);
      errorCount++;
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log('📊 GLOSSARY SEEDING COMPLETE');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Successfully added: ${successCount} terms`);
  console.log(`❌ Errors: ${errorCount} terms`);
  console.log(`📚 Total attempted: ${GLOSSARY_TERMS.length} terms\n`);

  if (Object.keys(categoryCount).length > 0) {
    console.log('📋 Terms by Category:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} terms`);
    });
  }

  console.log('');
  
  if (successCount === GLOSSARY_TERMS.length) {
    console.log('🎉 All glossary terms seeded successfully!');
    console.log('✅ MVL Content Target Met: 100+ glossary terms');
    console.log('\n📍 Next: Visit http://localhost:3000/glossary to see your terms!');
  } else if (successCount > 0) {
    console.log(`⚠️  Partial success: ${successCount}/${GLOSSARY_TERMS.length} terms added`);
    console.log('💡 Check error messages above for details');
  } else {
    console.log('❌ Seeding failed. Check error messages above.');
  }
}

// Run the seeding
seedGlossary()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
