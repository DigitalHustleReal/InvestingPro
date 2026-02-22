/**
 * Calculator Math Utilities
 * 
 * Pure functions with zero dependencies — safe to test in Node.js without React.
 * These formulas mirror what the calculator components use internally.
 */

// ─── SIP ────────────────────────────────────────────────────────────────────

export interface SIPResult {
  futureValue: number;
  totalInvested: number;
  returns: number;
  returnPercentage: number;
}

/**
 * Calculate SIP (Systematic Investment Plan) returns.
 * Formula: FV = P × [(1 + r)^n − 1] / r × (1 + r)
 *
 * @param monthlyInvestment  Monthly investment amount in INR
 * @param annualReturnPct    Expected annual return (e.g. 12 for 12%)
 * @param years              Investment duration in years
 */
export function calculateSIP(
  monthlyInvestment: number,
  annualReturnPct: number,
  years: number
): SIPResult {
  const monthlyRate = annualReturnPct / 12 / 100;
  const months = years * 12;

  const futureValue =
    monthlyInvestment *
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
    (1 + monthlyRate);

  const totalInvested = monthlyInvestment * months;
  const returns = futureValue - totalInvested;

  return {
    futureValue: Math.round(futureValue),
    totalInvested: Math.round(totalInvested),
    returns: Math.round(returns),
    returnPercentage: parseFloat(((returns / totalInvested) * 100).toFixed(2)),
  };
}

// ─── EMI ────────────────────────────────────────────────────────────────────

export interface EMIResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
}

/**
 * Calculate EMI (Equated Monthly Instalment).
 * Formula: EMI = P × r × (1 + r)^n / [(1 + r)^n − 1]
 *
 * @param principal       Loan amount in INR
 * @param annualRatePct   Annual interest rate (e.g. 10.5 for 10.5%)
 * @param tenureMonths    Loan tenure in months
 */
export function calculateEMI(
  principal: number,
  annualRatePct: number,
  tenureMonths: number
): EMIResult {
  const monthlyRate = annualRatePct / 12 / 100;

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;

  return {
    emi: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
  };
}

// ─── PPF ────────────────────────────────────────────────────────────────────

export interface PPFResult {
  maturityAmount: number;
  totalInvested: number;
  totalInterest: number;
}

/**
 * Calculate PPF (Public Provident Fund) maturity amount.
 * PPF compounds annually. Interest is calculated on the minimum balance
 * between the 5th and last day of each month (simplified: annual compounding).
 *
 * @param annualInvestment  Yearly deposit in INR (₹500 – ₹1,50,000)
 * @param annualRatePct     Interest rate (current: 7.1%)
 * @param years             Lock-in period (minimum 15 years)
 */
export function calculatePPF(
  annualInvestment: number,
  annualRatePct: number,
  years: number
): PPFResult {
  const r = annualRatePct / 100;
  let balance = 0;

  for (let y = 0; y < years; y++) {
    balance = (balance + annualInvestment) * (1 + r);
  }

  const totalInvested = annualInvestment * years;
  const totalInterest = balance - totalInvested;

  return {
    maturityAmount: Math.round(balance),
    totalInvested: Math.round(totalInvested),
    totalInterest: Math.round(totalInterest),
  };
}

// ─── FD ─────────────────────────────────────────────────────────────────────

export interface FDResult {
  maturityAmount: number;
  totalInterest: number;
}

/**
 * Calculate FD (Fixed Deposit) maturity value with quarterly compounding.
 * Formula: A = P × (1 + r/4)^(4×t)
 *
 * @param principal       Initial deposit amount
 * @param annualRatePct   Annual interest rate (e.g. 7.0 for 7%)
 * @param years           Tenure in years
 */
export function calculateFD(
  principal: number,
  annualRatePct: number,
  years: number
): FDResult {
  const r = annualRatePct / 100;
  const maturityAmount = principal * Math.pow(1 + r / 4, 4 * years);
  const totalInterest = maturityAmount - principal;

  return {
    maturityAmount: Math.round(maturityAmount),
    totalInterest: Math.round(totalInterest),
  };
}
