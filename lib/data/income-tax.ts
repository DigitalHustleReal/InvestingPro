/**
 * Income Tax Data — FY 2025-26
 * Source: incometax.gov.in · Finance Bill 2025
 * Both regimes, all deductions, surcharge, cess.
 */

export interface TaxSlab {
  min: number;
  max: number | null;
  rate: number; // percentage
}

export interface TaxResult {
  regime: 'old' | 'new';
  taxableIncome: number;
  basicTax: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  takeHome: number;
}

/** New Regime slabs — FY 2025-26 (Finance Bill 2025 — revised) */
export const NEW_REGIME_SLABS: TaxSlab[] = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400001, max: 800000, rate: 5 },
  { min: 800001, max: 1200000, rate: 10 },
  { min: 1200001, max: 1600000, rate: 15 },
  { min: 1600001, max: 2000000, rate: 20 },
  { min: 2000001, max: 2400000, rate: 25 },
  { min: 2400001, max: null, rate: 30 },
];

/** Old Regime slabs — FY 2025-26 (below 60 years) */
export const OLD_REGIME_SLABS: TaxSlab[] = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250001, max: 500000, rate: 5 },
  { min: 500001, max: 1000000, rate: 20 },
  { min: 1000001, max: null, rate: 30 },
];

/** Standard Deduction — both regimes */
export const STANDARD_DEDUCTION_OLD = 50000;
export const STANDARD_DEDUCTION_NEW = 75000;

/** New regime: Tax rebate u/s 87A — zero tax if taxable income ≤ ₹12L */
export const NEW_REGIME_87A_LIMIT = 1200000;
export const NEW_REGIME_87A_REBATE = 60000; // max rebate

/** Old regime: 87A rebate if taxable income ≤ ₹5L */
export const OLD_REGIME_87A_LIMIT = 500000;
export const OLD_REGIME_87A_REBATE = 12500;

export interface DeductionInputs {
  section80C: number;        // Max 1,50,000
  section80D: number;        // Health insurance premium — max 25K (self) + 25K (parents)
  hra: number;               // HRA exemption (computed separately)
  homeLoanInterest: number;  // Section 24(b) — max 2,00,000 (self-occupied)
  nps80CCD1B: number;        // Extra NPS — max 50,000
  other80: number;           // 80E, 80G, 80TTA etc.
}

export function computeTax(
  grossIncome: number,
  deductions: DeductionInputs,
  regime: 'old' | 'new'
): TaxResult {
  const stdDed = regime === 'new' ? STANDARD_DEDUCTION_NEW : STANDARD_DEDUCTION_OLD;

  let taxableIncome = grossIncome - stdDed;

  if (regime === 'old') {
    const totalDed =
      Math.min(deductions.section80C, 150000) +
      Math.min(deductions.section80D, 50000) +
      deductions.hra +
      Math.min(deductions.homeLoanInterest, 200000) +
      Math.min(deductions.nps80CCD1B, 50000) +
      deductions.other80;
    taxableIncome = Math.max(0, taxableIncome - totalDed);
  }

  taxableIncome = Math.max(0, taxableIncome);

  const slabs = regime === 'new' ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;
  let basicTax = 0;

  for (const slab of slabs) {
    if (taxableIncome <= slab.min) break;
    const upper = slab.max ?? Infinity;
    const taxable = Math.min(taxableIncome, upper) - slab.min;
    basicTax += (taxable * slab.rate) / 100;
  }

  // 87A Rebate
  if (regime === 'new' && taxableIncome <= NEW_REGIME_87A_LIMIT) {
    basicTax = Math.max(0, basicTax - Math.min(basicTax, NEW_REGIME_87A_REBATE));
  }
  if (regime === 'old' && taxableIncome <= OLD_REGIME_87A_LIMIT) {
    basicTax = Math.max(0, basicTax - Math.min(basicTax, OLD_REGIME_87A_REBATE));
  }

  // Surcharge
  let surchargeRate = 0;
  if (taxableIncome > 50000000) surchargeRate = 0.25;
  else if (taxableIncome > 20000000) surchargeRate = 0.15;
  else if (taxableIncome > 10000000) surchargeRate = 0.15;
  else if (taxableIncome > 5000000) surchargeRate = 0.1;
  const surcharge = basicTax * surchargeRate;

  // Health & Education Cess: 4% on (tax + surcharge)
  const cess = (basicTax + surcharge) * 0.04;
  const totalTax = basicTax + surcharge + cess;
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  return {
    regime,
    taxableIncome,
    basicTax,
    surcharge,
    cess,
    totalTax,
    effectiveRate,
    takeHome: grossIncome - totalTax,
  };
}

/** Breakeven analysis: at what deduction level does old regime beat new? */
export function computeBreakeven(grossIncome: number): number {
  const newResult = computeTax(grossIncome, {
    section80C: 0, section80D: 0, hra: 0,
    homeLoanInterest: 0, nps80CCD1B: 0, other80: 0,
  }, 'new');

  // Binary search for deduction amount where old = new
  let lo = 0, hi = 500000;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const old = computeTax(grossIncome, {
      section80C: Math.min(mid * 0.6, 150000),
      section80D: Math.min(mid * 0.1, 50000),
      hra: 0,
      homeLoanInterest: 0,
      nps80CCD1B: Math.min(mid * 0.1, 50000),
      other80: mid * 0.2,
    }, 'old');
    if (old.totalTax < newResult.totalTax) hi = mid;
    else lo = mid;
  }
  return Math.round(lo);
}

export const TAX_DEDUCTIONS_GUIDE = [
  { section: '80C', limit: 150000, what: 'EPF, PPF, ELSS, LIC, NSC, FD(5yr), principal repayment', regimes: 'old only' },
  { section: '80D', limit: 75000, what: 'Health insurance premium (₹25K self + ₹50K parents senior)', regimes: 'old only' },
  { section: '24(b)', limit: 200000, what: 'Home loan interest (self-occupied property)', regimes: 'old only' },
  { section: '80CCD(1B)', limit: 50000, what: 'NPS contribution (extra, over 80C)', regimes: 'old only' },
  { section: '80TTA', limit: 10000, what: 'Savings bank interest income', regimes: 'old only' },
  { section: '80E', limit: null, what: 'Education loan interest — no upper limit', regimes: 'old only' },
  { section: 'Standard Deduction', limit: 75000, what: '₹75,000 flat (new regime) / ₹50,000 (old regime)', regimes: 'both' },
  { section: 'HRA', limit: null, what: 'Actual / 50% salary / rent minus 10% salary — least of three', regimes: 'old only' },
];
