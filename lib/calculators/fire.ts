/**
 * FIRE Calculator — India-specific
 * Financial Independence, Retire Early
 *
 * Key India adjustments vs western tools:
 * - General inflation: 6% (vs 2-3% US)
 * - Healthcare inflation: 12-15% (vs 4% US)
 * - Safe Withdrawal Rate: 3.5-5% (slightly higher than 4% US rule due to higher nominal returns)
 * - Expected equity returns: 12% nominal (Nifty 50 long-term avg)
 */

export interface FIREInputs {
  currentAge: number;
  retirementAge: number;
  monthlyExpenses: number;          // Current monthly expenses (₹)
  currentSavings: number;           // Existing corpus/savings (₹)
  monthlySavings: number;           // Additional monthly savings till retirement (₹)
  expectedReturnPct: number;        // Expected portfolio return % p.a. (default 11%)
  inflationPct: number;             // General inflation % p.a. (default 6%)
  healthcareInflationPct: number;   // Healthcare inflation % (default 12%)
  healthcareExpensePct: number;     // % of expenses that is healthcare (default 15%)
  withdrawalRatePct: number;        // Safe Withdrawal Rate % (default 4%)
  postRetirementReturnPct: number;  // Conservative return during retirement (default 8%)
}

export interface FIREResult {
  // Target corpus
  fireCorpus: number;               // Total corpus needed (₹)
  inflationAdjustedExpenses: number; // Monthly expenses at retirement in today's ₹

  // Current trajectory
  projectedCorpusAtRetirement: number;  // What you'll have if you keep saving
  corpusShortfall: number;              // Gap (negative = surplus)
  isOnTrack: boolean;

  // FIRE variants
  leanFire: FIREVariant;
  regularFire: FIREVariant;
  fatFire: FIREVariant;

  // Coast FIRE
  coastFire: CoastFIREResult;

  // Retirement phases
  phases: RetirementPhase[];

  // Sensitivity
  yearsToFire: number;
  ageAtFire: number;
  safeMonthlyWithdrawal: number;    // What you can safely withdraw/month at target corpus
}

export interface FIREVariant {
  label: "Lean FIRE" | "Regular FIRE" | "Fat FIRE";
  description: string;
  monthlyBudget: number;            // ₹/month (today's value)
  corpusNeeded: number;             // ₹
  achievableAge: number | null;     // Age when reachable given current savings rate
}

export interface CoastFIREResult {
  coastCorpus: number;              // Corpus needed today to coast to FIRE number without more savings
  currentSavings: number;
  alreadyCoasting: boolean;
  yearsToCoastCorpus: number | null;
}

export interface RetirementPhase {
  label: string;
  ageRange: string;
  monthlyBudget: number;
  note: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function fv(rate: number, nper: number, pmt: number, pv = 0): number {
  // Future value of periodic payments + present value
  if (rate === 0) return pv + pmt * nper;
  return pv * Math.pow(1 + rate, nper) + pmt * ((Math.pow(1 + rate, nper) - 1) / rate);
}

function inflatedValue(amount: number, inflationPct: number, years: number): number {
  return amount * Math.pow(1 + inflationPct / 100, years);
}

// ─── Core Calculation ────────────────────────────────────────────────────────

export function calculateFIRE(inputs: FIREInputs): FIREResult {
  const {
    currentAge,
    retirementAge,
    monthlyExpenses,
    currentSavings,
    monthlySavings,
    expectedReturnPct,
    inflationPct,
    healthcareInflationPct,
    healthcareExpensePct,
    withdrawalRatePct,
    postRetirementReturnPct,
  } = inputs;

  const yearsToRetirement = retirementAge - currentAge;
  const monthlyReturn = expectedReturnPct / 12 / 100;

  // ── Inflation-adjusted monthly expenses at retirement ──
  const healthcareExpenses = monthlyExpenses * (healthcareExpensePct / 100);
  const nonHealthcareExpenses = monthlyExpenses - healthcareExpenses;

  const inflatedHealthcare = inflatedValue(healthcareExpenses, healthcareInflationPct, yearsToRetirement);
  const inflatedOther = inflatedValue(nonHealthcareExpenses, inflationPct, yearsToRetirement);
  const inflationAdjustedExpenses = inflatedHealthcare + inflatedOther;
  const annualExpensesAtRetirement = inflationAdjustedExpenses * 12;

  // ── FIRE corpus (25x rule adjusted for India) ──
  const fireCorpus = annualExpensesAtRetirement / (withdrawalRatePct / 100);
  const safeMonthlyWithdrawal = Math.round((fireCorpus * (withdrawalRatePct / 100)) / 12);

  // ── Projected corpus at planned retirement age ──
  const projectedCorpusAtRetirement = Math.round(
    fv(monthlyReturn, yearsToRetirement * 12, monthlySavings, currentSavings)
  );
  const corpusShortfall = fireCorpus - projectedCorpusAtRetirement;
  const isOnTrack = projectedCorpusAtRetirement >= fireCorpus;

  // ── Years to FIRE (find when corpus reaches target) ──
  let yearsToFire = yearsToRetirement;
  let corpus = currentSavings;
  for (let y = 0; y <= 50; y++) {
    corpus = fv(monthlyReturn, 12, monthlySavings, corpus);
    // Recalculate fire target for that year
    const futureExpenses = inflatedValue(monthlyExpenses, inflationPct, y + 1) * 12;
    const futureTarget = futureExpenses / (withdrawalRatePct / 100);
    if (corpus >= futureTarget) {
      yearsToFire = y + 1;
      break;
    }
  }

  // ── FIRE variants (based on today's ₹ values) ──
  const leanBudget = 30000;
  const regularBudget = monthlyExpenses;
  const fatBudget = Math.max(monthlyExpenses * 2, 150000);

  function variantCorpus(budget: number): number {
    const inflated = inflatedValue(budget, inflationPct, yearsToRetirement) * 12;
    return inflated / (withdrawalRatePct / 100);
  }

  function ageToReachCorpus(targetCorpus: number): number | null {
    let c = currentSavings;
    for (let y = 0; y <= 50; y++) {
      c = fv(monthlyReturn, 12, monthlySavings, c);
      if (c >= targetCorpus) return currentAge + y + 1;
    }
    return null;
  }

  const leanFire: FIREVariant = {
    label: "Lean FIRE",
    description: "Frugal lifestyle — covers essentials only",
    monthlyBudget: leanBudget,
    corpusNeeded: Math.round(variantCorpus(leanBudget)),
    achievableAge: ageToReachCorpus(variantCorpus(leanBudget)),
  };

  const regularFire: FIREVariant = {
    label: "Regular FIRE",
    description: "Current lifestyle maintained in retirement",
    monthlyBudget: regularBudget,
    corpusNeeded: Math.round(variantCorpus(regularBudget)),
    achievableAge: ageToReachCorpus(variantCorpus(regularBudget)),
  };

  const fatFire: FIREVariant = {
    label: "Fat FIRE",
    description: "Comfortable lifestyle with generous buffer",
    monthlyBudget: fatBudget,
    corpusNeeded: Math.round(variantCorpus(fatBudget)),
    achievableAge: ageToReachCorpus(variantCorpus(fatBudget)),
  };

  // ── Coast FIRE ──
  // Coast corpus = target FIRE corpus discounted back to today
  const coastCorpus = Math.round(
    fireCorpus / Math.pow(1 + expectedReturnPct / 100, yearsToRetirement)
  );
  const alreadyCoasting = currentSavings >= coastCorpus;
  let yearsToCoastCorpus: number | null = null;
  if (!alreadyCoasting) {
    let c = currentSavings;
    for (let y = 0; y <= 30; y++) {
      c = fv(monthlyReturn, 12, monthlySavings, c);
      // Recalculate coast target for that year
      const remainingYears = yearsToRetirement - (y + 1);
      if (remainingYears <= 0) break;
      const target = fireCorpus / Math.pow(1 + expectedReturnPct / 100, remainingYears);
      if (c >= target) {
        yearsToCoastCorpus = y + 1;
        break;
      }
    }
  }

  // ── Retirement phases ──
  const phases: RetirementPhase[] = [
    {
      label: "Active Retirement",
      ageRange: `${retirementAge}–${retirementAge + 15}`,
      monthlyBudget: Math.round(inflationAdjustedExpenses * 1.1),
      note: "Travel, hobbies, dining — spend a bit more while healthy",
    },
    {
      label: "Steady Phase",
      ageRange: `${retirementAge + 15}–${retirementAge + 25}`,
      monthlyBudget: Math.round(inflationAdjustedExpenses),
      note: "Expenses stabilize; slower pace of life",
    },
    {
      label: "Healthcare Heavy",
      ageRange: `${retirementAge + 25}+`,
      monthlyBudget: Math.round(inflationAdjustedExpenses * 1.3),
      note: "Healthcare costs rise sharply — buffer essential",
    },
  ];

  return {
    fireCorpus: Math.round(fireCorpus),
    inflationAdjustedExpenses: Math.round(inflationAdjustedExpenses),
    projectedCorpusAtRetirement,
    corpusShortfall: Math.round(corpusShortfall),
    isOnTrack,
    leanFire,
    regularFire,
    fatFire,
    coastFire: { coastCorpus, currentSavings, alreadyCoasting, yearsToCoastCorpus },
    phases,
    yearsToFire,
    ageAtFire: currentAge + yearsToFire,
    safeMonthlyWithdrawal,
  };
}

export const FIRE_DEFAULTS: FIREInputs = {
  currentAge: 30,
  retirementAge: 50,
  monthlyExpenses: 60000,
  currentSavings: 500000,
  monthlySavings: 30000,
  expectedReturnPct: 11,
  inflationPct: 6,
  healthcareInflationPct: 12,
  healthcareExpensePct: 15,
  withdrawalRatePct: 4,
  postRetirementReturnPct: 8,
};
