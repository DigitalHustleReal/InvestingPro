// Core Product Interface
export interface Product {
  id: string;
  slug: string; // for SEO friendly URLs
  name: string;
  provider: string; // Bank or Institution Name
  providerLogo?: string;
  description: string;
  rating: number; // 0 to 5
  reviewsCount: number;
  applyLink: string;
  isPopular?: boolean;
  isSponsored?: boolean;
  bestFor?: string; // NEW: Category ID from BEST_FOR_CATEGORIES (e.g., 'travel-rewards')
}

// ------------------------------------------
// CREDIT CARDS
// ------------------------------------------
export interface CreditCard extends Product {
  category: 'credit_card';
  type: 'travel' | 'shopping' | 'cashback' | 'lifetime_free' | 'premium' | 'rewards';

  // Fees
  joiningFee: number;
  annualFee: number;
  annualFeeWaiverCondition?: string; // e.g. "Spend 2L in a year"

  // Rewards
  rewardRate: string; // e.g. "5%" or "4 points per Rs.150"
  welcomeOffer?: string;

  // Detailed Features
  features: string[];
  pros: string[];
  cons: string[];

  // Specifics
  minCreditScore?: number;
  minIncome?: string; // e.g. "Rs. 25,000/month"
  loungeAccess?: string; // e.g. "4 Domestic / year"
}

// ------------------------------------------
// LOANS (Personal, Home)
// ------------------------------------------
export interface Loan extends Product {
  category: 'loan';
  loanType: 'personal' | 'home' | 'car' | 'education';

  // Interest
  interestRateMin: number;
  interestRateMax: number;
  interestRateType: 'fixed' | 'floating';

  // Fees & Charges
  processingFee: string; // e.g. "Up to 2%"
  prepaymentCharges?: string;

  // Terms
  maxTenureMonths: number;
  maxAmount: string; // e.g. "Up to 40 Lakhs"

  // Eligibility
  minSalary?: number;
  minAge?: number;
}

// ------------------------------------------
// INSURANCE
// ------------------------------------------
export interface Insurance extends Product {
  category: 'insurance';
  insuranceType: 'term' | 'health' | 'motor';

  // Coverage
  minCoverageAmt: number;
  maxCoverageAmt: number;

  // Costs
  premiumStartPrice: number; // e.g. "Rs 500/month"

  // Health Specific
  cashlessHospitals?: number;
  waitingPeriod?: string; // e.g. "2 Years for pre-existing"
  claimSettlementRatio: number; // e.g. 98.5
}

// ------------------------------------------
// MUTUAL FUNDS
// ------------------------------------------
export interface MutualFund extends Product {
  category: 'mutual_fund';
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
  fundCategory: 'equity' | 'debt' | 'hybrid' | 'elss';
  subCategory?: string; // e.g. "Large Cap"

  // Returns
  returns1Y: number;
  returns3Y: number;
  returns5Y: number;

  // Fees
  expenseRatio: number;
  exitLoad?: string;

  // Info
  aum: string; // Asset Under Management e.g "20,000 Cr"
  manager: string;
}

// Union Type for Helper Functions
export type FinancialProduct = CreditCard | Loan | Insurance | MutualFund;
