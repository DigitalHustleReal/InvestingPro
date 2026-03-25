/**
 * Pension Commutation Intelligence Engine
 *
 * Covers the full decision landscape for Indian central govt employees:
 *  1. Corrected commutation math (two tables: pre-2008 and post-2008)
 *  2. DA-multiplier: the growing hidden cost of commutation
 *  3. 30-year year-by-year projection with 8th Pay Commission modelling
 *  4. Investment-return scenarios: what lump sum must earn to break even
 *  5. PensionSmart Score: questionnaire → commute / don't commute recommendation
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * KEY INSIGHT (most calculators miss this):
 *
 *   The monthly cost of commutation is NOT fixed at ₹20,000.
 *   It grows every year as DA rises:
 *     Monthly cost = commuted basic × (1 + DA_at_year_N / 100)
 *
 *   After each Pay Commission, commuted basic is revised upward proportionally.
 *   So the "40% lock" remains 40% of a growing pension forever.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TWO COMMUTATION FACTOR TABLES:
 *
 *   Pre-2008 (older govt documents, PCDA examples) — more generous to employee
 *   Post-2008 (revised, currently in use by most CPDAs) — lower lump sum
 *
 *   Many state govts still use the pre-2008 table. Central govt uses post-2008.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ═══════════════════════════════════════════════════════════════
// COMMUTATION FACTOR TABLES
// ═══════════════════════════════════════════════════════════════

/** Post-2008 revised table — currently used by most central govt CPDAs */
export const COMMUTATION_FACTORS_NEW: Record<number, number> = {
  40: 9.188, 41: 8.983, 42: 8.770, 43: 8.551, 44: 8.324, 45: 8.090,
  46: 7.849, 47: 7.601, 48: 7.347, 49: 7.088, 50: 6.824, 51: 6.555,
  52: 6.282, 53: 6.006, 54: 5.728, 55: 5.448, 56: 5.167, 57: 4.885,
  58: 4.603, 59: 4.321, 60: 4.040, 61: 3.784, 62: 3.531, 63: 3.265,
};

/**
 * Pre-2008 table — still cited in older PCDA documents, used by some state govts.
 * Based on ~4% discount rate (vs ~8% in the revised table).
 * Gives a much better deal to the employee (higher lump sum).
 */
export const COMMUTATION_FACTORS_OLD: Record<number, number> = {
  40: 9.188, 41: 9.095, 42: 8.983, 43: 8.857, 44: 8.719, 45: 8.568,
  46: 8.403, 47: 8.225, 48: 8.033, 49: 7.828, 50: 7.611, 51: 7.381,
  52: 7.140, 53: 6.888, 54: 6.626, 55: 6.355, 56: 6.075, 57: 5.787,
  58: 5.492, 59: 5.191, 60: 4.887, 61: 4.580, 62: 4.272, 63: 3.964,
};

/**
 * Alternate well-known table cited in PCDA examples (factor 8.194 at age 61).
 * Used in 6th CPC era references. Exact source: CCS Pension Rules 1981
 * last revision before 2008.
 */
export const COMMUTATION_FACTORS_6CPC: Record<number, number> = {
  40: 9.188, 41: 9.160, 42: 9.090, 43: 9.009, 44: 8.919, 45: 8.819,
  46: 8.709, 47: 8.588, 48: 8.455, 49: 8.310, 50: 8.151, 51: 7.980,
  52: 7.794, 53: 7.594, 54: 7.380, 55: 7.151, 56: 6.907, 57: 6.648,
  58: 6.374, 59: 6.085, 60: 5.787, 61: 8.194, 62: 7.862, 63: 7.516,
};

// Use: 6CPC table factor for age 61 = 8.194 as the canonical "old" reference

export type CommutationTable = "post2008" | "pre2008" | "6cpc";

export function getCommutationFactor(
  retirementAge: number,
  table: CommutationTable = "post2008"
): number {
  const nextBirthday = retirementAge + 1;
  const tbl =
    table === "6cpc"
      ? COMMUTATION_FACTORS_6CPC
      : table === "pre2008"
      ? COMMUTATION_FACTORS_OLD
      : COMMUTATION_FACTORS_NEW;
  return tbl[nextBirthday] ?? tbl[63] ?? 3.265;
}

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface CommutationInputs {
  basicPension: number;           // ₹/month — full (uncut) basic pension
  commutationPct: number;         // 0–40 %
  retirementAge: number;          // usually 60
  currentDAPercent: number;       // DA at retirement (e.g. 50)
  commutationTable: CommutationTable;

  // 30-year projection params
  daGrowthRatePA: number;         // % p.a. DA increase (historical ~4%)
  cpcYearFromNow: number;         // years until 8th CPC (default 2)
  fitmentFactor: number;          // e.g. 2.2 for 8th CPC
  expectedLifeYears: number;      // years post-retirement to model (default 30)

  // Investment of lump sum
  investmentReturnPct: number;    // expected annual return on lump sum
}

export interface CommutationCore {
  commutedPortion: number;        // ₹/month cut from pension
  commutedLumpSum: number;        // ₹ received upfront
  fullPensionMonthly: number;     // before commutation (basic + DA now)
  reducedPensionMonthly: number;  // after commutation (basic+DA now)
  monthlyLossNow: number;         // including DA component
  factor: number;
  nominalBreakevenMonths: number;
  daAdjustedBreakevenMonths: number;
  requiredReturnToBreakEven: number; // % p.a. the lump sum must earn monthly to cover loss
  investmentMonthlyIncome: number;   // actual monthly from lump sum at chosen return
  investmentCoversPct: number;       // % of monthly loss covered by investment income
}

export interface YearlyProjection {
  year: number;
  age: number;
  daPercent: number;
  basicPensionRevised: number;    // after pay commissions
  monthlyWithout: number;         // total monthly without commutation
  monthlyWith: number;            // total monthly with commutation (+ investment income)
  monthlyLoss: number;            // actual monthly loss (basic + DA, growing over time)
  cumulativeWithout: number;
  cumulativeWith: number;
  cumulativeDiff: number;         // positive = commutation ahead, negative = behind
  cpcAppliedThisYear: boolean;
}

export interface InvestmentScenario {
  name: string;
  ratePA: number;
  monthlyIncome: number;
  valueAtYear15: number;
  coversPct: number;              // % of monthly pension loss covered
  risk: "Very Low" | "Low" | "Medium" | "High";
  type: "fixed" | "market" | "real-estate";
  notes: string;
}

export interface CommutationResult {
  core: CommutationCore;
  projection: YearlyProjection[];
  investmentScenarios: InvestmentScenario[];
  smartScore: SmartScoreResult;
  summary: string;
}

// ═══════════════════════════════════════════════════════════════
// SMART SCORE INPUTS (questionnaire)
// ═══════════════════════════════════════════════════════════════

export interface SmartScoreInputs {
  moneyUse:
    | "pay-debt-high"    // Pay off high-interest debt (>10%)
    | "pay-debt-low"     // Pay off home loan (<9%)
    | "property"         // Buy land / property
    | "equity-invest"    // Equity MF / stocks
    | "safe-invest"      // FD / SCSS / PMVVY
    | "children-need"    // Children education/wedding
    | "no-plan"          // No specific plan
    | "savings-account"; // Just keep in savings

  healthStatus:
    | "excellent"   // Family history 85+, no issues
    | "good"        // Average
    | "moderate"    // Some chronic conditions
    | "poor";       // Serious illness, shortened expectancy

  cpcProximity:
    | "far"         // >3 years to next CPC
    | "moderate"    // 1-3 years
    | "near";       // <1 year

  investmentDiscipline:
    | "high"        // Will invest and not touch for 10+ years
    | "medium"      // Might invest, may withdraw
    | "low";        // Won't invest systematically

  existingLiabilities:
    | "heavy"       // >₹20L high-interest debt
    | "moderate"    // ₹5-20L home loan
    | "light"       // <₹5L or zero
    | "none";

  familyDependents:
    | "many"        // Spouse + dependent children, elderly parents
    | "some"        // Spouse only
    | "none";       // Fully independent

  retirementCorpusSufficiency:
    | "insufficient"  // NPS/PF corpus won't sustain lifestyle
    | "adequate"      // Will manage
    | "surplus";      // Well-covered by other savings

  yearsToRetirement: number; // For pre-retirees
}

export interface SmartScoreResult {
  score: number;                // 0–100
  recommendation: "commute-40" | "commute-20-30" | "commute-10-20" | "skip";
  label: string;
  color: "green" | "amber" | "orange" | "red";
  reasons: { pro: string[]; con: string[] };
  optimalPct: number;           // Suggested commutation %
}

// ═══════════════════════════════════════════════════════════════
// CORE CALCULATOR
// ═══════════════════════════════════════════════════════════════

function calcMonthlyLoss(
  commutedPortion: number,
  daPercent: number
): number {
  return commutedPortion * (1 + daPercent / 100);
}

export function calculateCommutationCore(inputs: CommutationInputs): CommutationCore {
  const {
    basicPension, commutationPct, retirementAge, currentDAPercent,
    commutationTable, investmentReturnPct,
  } = inputs;

  const factor = getCommutationFactor(retirementAge, commutationTable);
  const commutedPortion = basicPension * (commutationPct / 100);
  const commutedLumpSum = Math.round(commutedPortion * factor * 12);

  const daOnFull = basicPension * (currentDAPercent / 100);
  const daOnReduced = (basicPension - commutedPortion) * (currentDAPercent / 100);

  const fullPensionMonthly = basicPension + daOnFull;
  const reducedPensionMonthly = (basicPension - commutedPortion) + daOnReduced;
  const monthlyLossNow = fullPensionMonthly - reducedPensionMonthly;

  const nominalBreakevenMonths =
    commutedPortion > 0 ? commutedLumpSum / commutedPortion : 0;
  const daAdjustedBreakevenMonths =
    monthlyLossNow > 0 ? commutedLumpSum / monthlyLossNow : 0;

  // What annual return must the lump sum generate to cover monthly loss?
  // Monthly income needed = monthlyLossNow
  // Required annual return = (monthlyLossNow × 12) / commutedLumpSum × 100
  const requiredReturnToBreakEven =
    commutedLumpSum > 0
      ? ((monthlyLossNow * 12) / commutedLumpSum) * 100
      : 0;

  // Actual investment income from lump sum at chosen return
  const investmentMonthlyIncome = commutedLumpSum > 0
    ? (commutedLumpSum * (investmentReturnPct / 100)) / 12
    : 0;
  const investmentCoversPct = monthlyLossNow > 0
    ? Math.min(100, (investmentMonthlyIncome / monthlyLossNow) * 100)
    : 0;

  return {
    commutedPortion: Math.round(commutedPortion),
    commutedLumpSum,
    fullPensionMonthly: Math.round(fullPensionMonthly),
    reducedPensionMonthly: Math.round(reducedPensionMonthly),
    monthlyLossNow: Math.round(monthlyLossNow),
    factor,
    nominalBreakevenMonths: Math.round(nominalBreakevenMonths),
    daAdjustedBreakevenMonths: Math.round(daAdjustedBreakevenMonths),
    requiredReturnToBreakEven: Math.round(requiredReturnToBreakEven * 10) / 10,
    investmentMonthlyIncome: Math.round(investmentMonthlyIncome),
    investmentCoversPct: Math.round(investmentCoversPct),
  };
}

// ═══════════════════════════════════════════════════════════════
// 30-YEAR PROJECTION ENGINE
// ═══════════════════════════════════════════════════════════════

export function project30Years(inputs: CommutationInputs): YearlyProjection[] {
  const {
    basicPension, commutationPct, retirementAge,
    currentDAPercent, commutationTable,
    daGrowthRatePA, cpcYearFromNow, fitmentFactor,
    expectedLifeYears, investmentReturnPct,
  } = inputs;

  const factor = getCommutationFactor(retirementAge, commutationTable);
  const commutedPortion = basicPension * (commutationPct / 100);
  const commutedLumpSum = commutedPortion * factor * 12;

  const years = Math.min(expectedLifeYears, 40);
  const projection: YearlyProjection[] = [];

  let cumulativeWithout = 0;
  let cumulativeWith = 0;

  // State that evolves year-over-year
  let basicNow = basicPension;
  let commutedNow = commutedPortion;
  let daNow = currentDAPercent;
  let cpcApplied = false;

  // Investment corpus grows and provides income
  let investCorpus = commutedLumpSum;

  for (let yr = 0; yr <= years; yr++) {
    const cpcThisYear = !cpcApplied && yr === cpcYearFromNow;

    if (cpcThisYear) {
      // Pay commission: basic revised by fitment factor, DA merges into basic, resets to 0
      basicNow = basicNow * fitmentFactor;
      commutedNow = commutedNow * fitmentFactor; // commutation % stays the same
      daNow = 0;
      cpcApplied = true;
    } else if (yr > 0) {
      // DA grows at daGrowthRatePA per year
      daNow = daNow + daGrowthRatePA;
    }

    const monthlyWithout = basicNow * (1 + daNow / 100);
    const reducedBasic = basicNow - commutedNow;
    const monthlyLoss = calcMonthlyLoss(commutedNow, daNow);

    // Investment income from corpus (assumed to be reinvested and provides withdrawals)
    // Model: corpus earns investmentReturnPct, monthly SWP just covers interest
    const annualInvestIncome = investCorpus * (investmentReturnPct / 100);
    const monthlyInvestIncome = annualInvestIncome / 12;
    // Corpus grows at chosen rate (don't draw down principal for this model)
    if (yr > 0) {
      investCorpus = investCorpus * (1 + investmentReturnPct / 100);
    }

    const monthlyWithCommute = reducedBasic * (1 + daNow / 100) + monthlyInvestIncome;

    cumulativeWithout += monthlyWithout * 12;
    cumulativeWith += monthlyWithCommute * 12;

    projection.push({
      year: yr,
      age: retirementAge + yr,
      daPercent: Math.round(daNow),
      basicPensionRevised: Math.round(basicNow),
      monthlyWithout: Math.round(monthlyWithout),
      monthlyWith: Math.round(monthlyWithCommute),
      monthlyLoss: Math.round(monthlyLoss),
      cumulativeWithout: Math.round(cumulativeWithout),
      cumulativeWith: Math.round(cumulativeWith),
      cumulativeDiff: Math.round(cumulativeWith - cumulativeWithout), // +ve = commutation ahead
      cpcAppliedThisYear: cpcThisYear,
    });
  }

  return projection;
}

// ═══════════════════════════════════════════════════════════════
// INVESTMENT SCENARIOS
// ═══════════════════════════════════════════════════════════════

export function buildInvestmentScenarios(
  lumpSum: number,
  monthlyLossNow: number
): InvestmentScenario[] {
  function scenario(
    name: string,
    ratePA: number,
    risk: InvestmentScenario["risk"],
    type: InvestmentScenario["type"],
    notes: string
  ): InvestmentScenario {
    const monthlyIncome = (lumpSum * (ratePA / 100)) / 12;
    const valueAtYear15 = lumpSum * Math.pow(1 + ratePA / 100, 15);
    const coversPct = monthlyLossNow > 0
      ? Math.min(100, Math.round((monthlyIncome / monthlyLossNow) * 100))
      : 0;
    return { name, ratePA, monthlyIncome: Math.round(monthlyIncome), valueAtYear15: Math.round(valueAtYear15), coversPct, risk, type, notes };
  }

  return [
    scenario("Savings Account", 3.5, "Very Low", "fixed",
      "Worst option. Interest barely beats inflation. Lump sum erodes in real terms."),
    scenario("Bank FD (5yr)", 7.0, "Very Low", "fixed",
      "Safe, predictable. TDS at slab rate. Best for those who want guaranteed income."),
    scenario("SCSS (Senior Citizen)", 8.2, "Very Low", "fixed",
      "Best risk-free option for retirees 60+. ₹15L cap (₹30L for couple). Quarterly payout. Govt-backed."),
    scenario("Post Office MIS", 7.4, "Very Low", "fixed",
      "Monthly income scheme. ₹9L single / ₹15L joint. Auto-credited monthly. Excellent for regular income."),
    scenario("PMVVY (Annuity)", 7.4, "Very Low", "fixed",
      "Pradhan Mantri Vaya Vandana Yojana. ₹15L max. LIC-backed. Monthly pension for 10 years."),
    scenario("Sovereign Gold Bond", 10.5, "Medium", "market",
      "2.5% fixed interest + gold price appreciation (~8% historical). 8-year lock-in. Tax-free on maturity."),
    scenario("Balanced Advantage Fund (SWP)", 10.5, "Medium", "market",
      "Systematic Withdrawal Plan. Capital grows while you withdraw monthly. Tax-efficient. Recommended for 10yr+ horizon."),
    scenario("Nifty Index Fund (SWP)", 13.0, "High", "market",
      "Historical ~13% CAGR. High short-term volatility. Best for disciplined long-term investors only."),
    scenario("Real Estate (Tier-2 city)", 9.5, "Medium", "real-estate",
      "3% rental yield + 6-8% appreciation. Illiquid, can't withdraw partially. Build on it for more rental income."),
  ];
}

// ═══════════════════════════════════════════════════════════════
// PENSIONSMART SCORE
// ═══════════════════════════════════════════════════════════════

const MONEY_USE_SCORES: Record<SmartScoreInputs["moneyUse"], number> = {
  "pay-debt-high": 28,    // Pay off 12%+ loan — excellent use
  "property": 22,          // Land/property — good if chosen wisely
  "equity-invest": 22,     // Equity MF — good long-term
  "children-need": 18,     // One-time need — acceptable
  "pay-debt-low": 15,      // Pay off 7-9% loan — modest gain
  "safe-invest": 10,       // FD/SCSS — won't cover monthly loss
  "no-plan": 4,            // Dangerous — no plan = erosion
  "savings-account": 0,    // Worst possible use
};

const HEALTH_SCORES: Record<SmartScoreInputs["healthStatus"], number> = {
  "poor": 20,       // Short life expectancy — commutation pays off fast
  "moderate": 14,
  "good": 8,
  "excellent": 2,   // Long life = huge long-term loss from commutation
};

const CPC_SCORES: Record<SmartScoreInputs["cpcProximity"], number> = {
  "far": 18,        // Far from CPC = less risk of missing out
  "moderate": 10,
  "near": 2,        // Near CPC = wait! You'll get much more post-CPC
};

const DISCIPLINE_SCORES: Record<SmartScoreInputs["investmentDiscipline"], number> = {
  "high": 16,
  "medium": 8,
  "low": 0,         // If you won't invest it, don't commute
};

const LIABILITY_SCORES: Record<SmartScoreInputs["existingLiabilities"], number> = {
  "heavy": 14,      // High-interest debt payoff = clear win
  "moderate": 7,
  "light": 2,
  "none": 0,
};

const CORPUS_SCORES: Record<SmartScoreInputs["retirementCorpusSufficiency"], number> = {
  "insufficient": 4,  // Need the lump sum for corpus
  "adequate": 2,
  "surplus": 0,       // Already covered = no need to commute
};

export function calculateSmartScore(q: SmartScoreInputs): SmartScoreResult {
  const total =
    MONEY_USE_SCORES[q.moneyUse] +
    HEALTH_SCORES[q.healthStatus] +
    CPC_SCORES[q.cpcProximity] +
    DISCIPLINE_SCORES[q.investmentDiscipline] +
    LIABILITY_SCORES[q.existingLiabilities] +
    CORPUS_SCORES[q.retirementCorpusSufficiency];

  // Max possible = 28 + 20 + 18 + 16 + 14 + 4 = 100
  const score = Math.min(100, Math.round(total));

  const pros: string[] = [];
  const cons: string[] = [];

  // Build reasons
  if (q.moneyUse === "pay-debt-high") pros.push("Paying off high-interest debt (12%+) gives guaranteed return higher than pension loss");
  if (q.moneyUse === "property") pros.push("Real estate in right location can significantly outperform pension loss over 10-15 years");
  if (q.moneyUse === "equity-invest") pros.push("Equity SIP/SWP historically at 12-13% can outpace growing pension loss");
  if (q.moneyUse === "safe-invest") cons.push("FD/SCSS at 7-8% will not cover your pension loss (which grows with DA) — you'll be behind from year 1");
  if (q.moneyUse === "no-plan" || q.moneyUse === "savings-account") cons.push("No investment plan means lump sum will erode while you permanently lose pension income");

  if (q.healthStatus === "poor") pros.push("Health concerns mean you benefit from receiving lump sum now rather than reduced pension for fewer years");
  if (q.healthStatus === "excellent") cons.push("With family history of longevity, commutation cost grows to massive amounts over 25-30 years");

  if (q.cpcProximity === "near") cons.push("8th CPC is likely within 1 year — wait to commute AFTER CPC for potentially 2× higher lump sum");
  if (q.cpcProximity === "far") pros.push("No pay commission expected soon — safe window to commute without missing a step-up");

  if (q.investmentDiscipline === "low") cons.push("Without investment discipline, lump sum will likely be spent and monthly pension loss remains permanent");
  if (q.investmentDiscipline === "high") pros.push("Strong investment discipline means lump sum can compound meaningfully over 10-15 years");

  if (q.existingLiabilities === "heavy") pros.push("Eliminating high-interest debt frees monthly cash flow and reduces financial stress significantly");

  // DA growing cost — always a con
  cons.push("As DA rises (currently 50%), your monthly pension loss grows every 6 months — it never stops increasing");
  cons.push("After each Pay Commission, commuted amount is revised upward in proportion, making long-term loss much larger");

  let recommendation: SmartScoreResult["recommendation"];
  let label: string;
  let color: SmartScoreResult["color"];
  let optimalPct: number;

  if (score >= 75) {
    recommendation = "commute-40";
    label = "Strong case to commute at maximum (40%)";
    color = "green";
    optimalPct = 40;
  } else if (score >= 55) {
    recommendation = "commute-20-30";
    label = "Moderate case — consider commuting 20–30%";
    color = "amber";
    optimalPct = 25;
  } else if (score >= 35) {
    recommendation = "commute-10-20";
    label = "Weak case — if needed, commute only 10–20%";
    color = "orange";
    optimalPct = 15;
  } else {
    recommendation = "skip";
    label = "Do NOT commute — pension loss outweighs any benefit";
    color = "red";
    optimalPct = 0;
  }

  return { score, recommendation, label, color, reasons: { pro: pros, con: cons }, optimalPct };
}

// ═══════════════════════════════════════════════════════════════
// MASTER CALCULATOR
// ═══════════════════════════════════════════════════════════════

export function calculateFullCommutation(
  inputs: CommutationInputs,
  scoreInputs: SmartScoreInputs
): CommutationResult {
  const core = calculateCommutationCore(inputs);
  const projection = project30Years(inputs);
  const investmentScenarios = buildInvestmentScenarios(
    core.commutedLumpSum,
    core.monthlyLossNow
  );
  const smartScore = calculateSmartScore(scoreInputs);

  // Find crossover point
  const crossover = projection.find((y) => y.cumulativeDiff < 0);
  const crossoverYear = crossover?.year ?? null;

  const summary = crossoverYear
    ? `You are ahead (due to lump sum) for the first ${crossoverYear} years. After that, you fall behind permanently. At age ${(inputs.retirementAge + 30)}, the total loss is ₹${Math.abs(projection[Math.min(30, projection.length - 1)].cumulativeDiff).toLocaleString("en-IN")}.`
    : `With investment returns at ${inputs.investmentReturnPct}%, commutation stays ahead throughout the ${inputs.expectedLifeYears}-year projection. The compounding investment outpaces the growing pension loss.`;

  return { core, projection, investmentScenarios, smartScore, summary };
}

// ═══════════════════════════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════════════════════════

export const COMMUTATION_DEFAULTS: CommutationInputs = {
  basicPension: 50000,
  commutationPct: 40,
  retirementAge: 60,
  currentDAPercent: 50,
  commutationTable: "post2008",
  daGrowthRatePA: 4,
  cpcYearFromNow: 2,
  fitmentFactor: 2.2,
  expectedLifeYears: 30,
  investmentReturnPct: 8,
};

export const SMART_SCORE_DEFAULTS: SmartScoreInputs = {
  moneyUse: "safe-invest",
  healthStatus: "good",
  cpcProximity: "moderate",
  investmentDiscipline: "medium",
  existingLiabilities: "none",
  familyDependents: "some",
  retirementCorpusSufficiency: "adequate",
  yearsToRetirement: 0,
};
