/**
 * Pension Calculators — India (Zero-competition segment tools)
 *
 * Covers:
 * 1. Government Employee Pension — OPS vs NPS comparison (7th Pay Commission)
 * 2. Defence Pension — Army / Navy / Air Force + OROP
 * 3. EPS-95 — Private sector Employee Pension Scheme 1995
 * 4. Gratuity + Leave Encashment
 */

// ═══════════════════════════════════════════════════════════════════════
// 1. GOVERNMENT EMPLOYEE PENSION (OPS vs NPS)
// ═══════════════════════════════════════════════════════════════════════

export interface GovtPensionInputs {
  basicPay: number;            // Current basic pay (₹/month)
  daPercent: number;           // Dearness Allowance % (currently ~50% for central govt)
  yearsOfService: number;      // Total qualifying service (years)
  retirementAge: number;       // Retirement age (usually 60)
  currentAge: number;          // Current age
  pensionScheme: "OPS" | "NPS" | "BOTH";

  // NPS specific
  employeeContribPct: number;  // Employee NPS contribution % (10% mandated)
  employerContribPct: number;  // Employer contribution % (14% for central govt)
  expectedReturnPct: number;   // Expected NPS corpus return (default 10%)
  annuityRatePct: number;      // Annuity rate on mandatory 40% (default 6%)
  annuityPct: number;          // % of corpus used for annuity (min 40%)

  // OPS specific
  commutationPct: number;      // % of pension commuted (max 40%)
}

export interface GovtPensionResult {
  ops: OPSResult;
  nps: NPSResult;
  comparison: {
    monthlyIncomeAdvantage: "OPS" | "NPS" | "equal";
    monthlyDiff: number;
    lumpSumAdvantage: "OPS" | "NPS" | "equal";
    lumpSumDiff: number;
    verdict: string;
  };
}

export interface OPSResult {
  basicPension: number;          // 50% of last basic pay (full service)
  reducedPension: number;        // Pro-rated if <33 years
  daPension: number;             // DA on pension (current rate)
  totalMonthlyPension: number;   // Basic pension + DA
  familyPension: number;         // 30% of basic pay
  commutedAmount: number;        // Lump sum received on commutation
  reducedPensionAfterCommute: number; // Pension after commutation
  commutationRepaid: boolean;    // Commutation recovered after ~15 years
  gratuityAmount: number;        // Retirement gratuity
  cghs: boolean;                 // CGHS coverage for life
}

export interface NPSResult {
  totalCorpus: number;           // Projected NPS corpus at retirement
  lumpSumAmount: number;         // Tax-free lump sum (60% of corpus)
  annuityCorpus: number;         // Amount going into annuity (40% of corpus)
  monthlyPension: number;        // Monthly pension from annuity
  totalMonthlyIncome: number;    // Pension (no separate DA like OPS)
  gratuityAmount: number;        // Retirement gratuity (same as OPS)
  taxNote: string;
}

// 7th Pay Commission commutation factors (age at next birthday)
const COMMUTATION_FACTORS: Record<number, number> = {
  40: 9.188, 41: 8.983, 42: 8.770, 43: 8.551, 44: 8.324, 45: 8.090,
  46: 7.849, 47: 7.601, 48: 7.347, 49: 7.088, 50: 6.824, 51: 6.555,
  52: 6.282, 53: 6.006, 54: 5.728, 55: 5.448, 56: 5.167, 57: 4.885,
  58: 4.603, 59: 4.321, 60: 4.040, 61: 3.784, 62: 3.531,
};

function getCommutationFactor(retirementAge: number): number {
  const nextBirthday = retirementAge + 1;
  return COMMUTATION_FACTORS[nextBirthday] ?? COMMUTATION_FACTORS[61];
}

export function calculateGovtPension(inputs: GovtPensionInputs): GovtPensionResult {
  const {
    basicPay, daPercent, yearsOfService, retirementAge, currentAge,
    employeeContribPct, employerContribPct, expectedReturnPct,
    annuityRatePct, annuityPct, commutationPct,
  } = inputs;

  const yearsToRetirement = retirementAge - currentAge;
  const emoluments = basicPay * (1 + daPercent / 100); // Basic + DA

  // ── OPS ────────────────────────────────────────────────────────────
  // Qualifying service capped at 33 years for full pension
  const cappedService = Math.min(yearsOfService, 33);
  const fullPensionService = 33;

  // Basic pension = 50% of basic pay for 33 years; prorated below
  const basicPension = (basicPay * 0.5 * cappedService) / fullPensionService;
  // Minimum guaranteed pension = ₹9,000/month (7th CPC)
  const reducedPension = Math.max(basicPension, 9000);
  const daPension = reducedPension * (daPercent / 100);
  const totalMonthlyPension = reducedPension + daPension;
  const familyPension = basicPay * 0.3; // 30% of last basic pay

  // Commutation
  const commutedPortion = reducedPension * (commutationPct / 100);
  const factor = getCommutationFactor(retirementAge);
  const commutedAmount = Math.round(commutedPortion * factor * 12);
  const reducedPensionAfterCommute = reducedPension - commutedPortion;

  // Retirement gratuity: 1/4 of emoluments × every 6 months (max 16.5 × ½ yr = ₹20L cap)
  const halfYearUnits = Math.min(yearsOfService * 2, 33); // max 33 units = 16.5 years
  const gratuityOPS = Math.min((emoluments / 4) * halfYearUnits, 2000000);

  const ops: OPSResult = {
    basicPension: Math.round(basicPension),
    reducedPension: Math.round(reducedPension),
    daPension: Math.round(daPension),
    totalMonthlyPension: Math.round(totalMonthlyPension),
    familyPension: Math.round(familyPension),
    commutedAmount: Math.round(commutedAmount),
    reducedPensionAfterCommute: Math.round(reducedPensionAfterCommute),
    commutationRepaid: true, // commutation amount recovered ~15 years
    gratuityAmount: Math.round(gratuityOPS),
    cghs: true,
  };

  // ── NPS ────────────────────────────────────────────────────────────
  const monthlyRate = expectedReturnPct / 12 / 100;
  const months = yearsToRetirement * 12;
  const monthlyContrib = emoluments * ((employeeContribPct + employerContribPct) / 100);

  // Future value of NPS corpus
  const totalCorpus =
    monthlyRate === 0
      ? monthlyContrib * months
      : (monthlyContrib * (Math.pow(1 + monthlyRate, months) - 1)) / monthlyRate;

  const annuityCorpus = totalCorpus * (annuityPct / 100);
  const lumpSumAmount = totalCorpus - annuityCorpus; // tax-free
  const monthlyPension = (annuityCorpus * (annuityRatePct / 100)) / 12;

  // Same gratuity formula as OPS (max ₹20L)
  const gratuityNPS = Math.min((emoluments / 4) * Math.min(yearsOfService * 2, 33), 2000000);

  const nps: NPSResult = {
    totalCorpus: Math.round(totalCorpus),
    lumpSumAmount: Math.round(lumpSumAmount),
    annuityCorpus: Math.round(annuityCorpus),
    monthlyPension: Math.round(monthlyPension),
    totalMonthlyIncome: Math.round(monthlyPension),
    gratuityAmount: Math.round(gratuityNPS),
    taxNote: "NPS lump sum (60%) is tax-free. Annuity income is taxable as per income tax slab.",
  };

  // ── Comparison ─────────────────────────────────────────────────────
  const monthlyDiff = Math.abs(ops.totalMonthlyPension - nps.totalMonthlyIncome);
  const opsBetter = ops.totalMonthlyPension > nps.totalMonthlyIncome;
  const opsLumpSum = ops.commutedAmount + ops.gratuityAmount;
  const npsLumpSum = nps.lumpSumAmount + nps.gratuityAmount;
  const lumpDiff = Math.abs(opsLumpSum - npsLumpSum);
  const npsLumpBetter = npsLumpSum > opsLumpSum;

  return {
    ops,
    nps,
    comparison: {
      monthlyIncomeAdvantage: opsBetter ? "OPS" : nps.totalMonthlyIncome > ops.totalMonthlyPension ? "NPS" : "equal",
      monthlyDiff,
      lumpSumAdvantage: npsLumpBetter ? "NPS" : opsLumpSum > npsLumpSum ? "OPS" : "equal",
      lumpSumDiff: lumpDiff,
      verdict: opsBetter
        ? `OPS gives ₹${Math.round(monthlyDiff).toLocaleString("en-IN")} more per month. NPS gives ₹${Math.round(lumpDiff).toLocaleString("en-IN")} ${npsLumpBetter ? "more" : "less"} as lump sum.`
        : `NPS gives ₹${Math.round(monthlyDiff).toLocaleString("en-IN")} more per month with a significantly larger lump sum corpus.`,
    },
  };
}

export const GOVT_PENSION_DEFAULTS: GovtPensionInputs = {
  basicPay: 56100,        // Level 10 (Group A entry)
  daPercent: 50,
  yearsOfService: 30,
  retirementAge: 60,
  currentAge: 35,
  pensionScheme: "BOTH",
  employeeContribPct: 10,
  employerContribPct: 14,
  expectedReturnPct: 10,
  annuityRatePct: 6,
  annuityPct: 40,
  commutationPct: 40,
};

// ═══════════════════════════════════════════════════════════════════════
// 2. DEFENCE PENSION
// ═══════════════════════════════════════════════════════════════════════

export type DefenceRank =
  | "Sepoy/Constable" | "Naik/Lance Corporal" | "Havildar/Corporal"
  | "Naib Subedar" | "Subedar" | "Subedar Major"
  | "Lieutenant" | "Captain" | "Major" | "Lieutenant Colonel"
  | "Colonel" | "Brigadier" | "Major General" | "Lieutenant General" | "General";

export type DefenceService = "Army" | "Navy" | "Air Force" | "Para Military";

export interface DefencePensionInputs {
  service: DefenceService;
  rank: DefenceRank;
  basicPay: number;          // Last drawn basic pay
  mspdaPay: number;          // Military Service Pay + DA (₹/month)
  yearsOfService: number;    // Qualifying service (min 15 for PBOR, 20 for officers)
  retirementAge: number;
  currentAge: number;
  daPercent: number;
  disabilityPercent: number; // 0-100 % disability (0 = no disability pension)
  isWarInjury: boolean;      // War injury gets higher rate
  hasGallantryAward: boolean; // VrC, MVC, PVC — additional pension
  orpEnabled: boolean;       // OROP benefit
}

export interface DefencePensionResult {
  servicePension: number;        // Monthly service pension
  daPension: number;             // DA on pension
  disabilityElement: number;     // Additional disability pension/month
  totalMonthlyPension: number;
  familyPension: number;         // 60% of service pension (enhanced for 7 years)
  retirementGratuity: number;
  exServicemenBenefits: string[];
  orpNote: string;
  echs: boolean;                 // Ex-Servicemen Contributory Health Scheme
  canteenCard: boolean;          // CSD canteen access (saves 15-20% on goods)
  estimatedMonthlySavingECHS: number; // Healthcare savings via ECHS vs private
}

const DEFENCE_MIN_SERVICE: Record<string, number> = {
  officer: 20,
  pbor: 15, // Personnel Below Officer Rank
};

const DISABILITY_RATES: Record<number, number> = {
  100: 0.30, 75: 0.225, 50: 0.15, 25: 0.075,
};

function getDisabilityElement(basicPay: number, mspdaPay: number, disabilityPct: number, isWar: boolean): number {
  if (disabilityPct === 0) return 0;
  const roundedPct = disabilityPct >= 100 ? 100 : disabilityPct >= 75 ? 75 : disabilityPct >= 50 ? 50 : 25;
  const rate = isWar ? (DISABILITY_RATES[roundedPct] ?? 0) * 1.5 : (DISABILITY_RATES[roundedPct] ?? 0);
  return (basicPay + mspdaPay) * rate;
}

export function calculateDefencePension(inputs: DefencePensionInputs): DefencePensionResult {
  const {
    basicPay, mspdaPay, yearsOfService, daPercent,
    disabilityPercent, isWarInjury, hasGallantryAward,
  } = inputs;

  const totalPay = basicPay + mspdaPay;
  const cappedService = Math.min(yearsOfService, 33);

  // Service pension = 50% of total pay (basic + MSP) for 33 years; prorated below
  const servicePension = Math.max((totalPay * 0.5 * cappedService) / 33, 9000);
  const daPension = servicePension * (daPercent / 100);

  // Disability element
  const disabilityElement = getDisabilityElement(basicPay, mspdaPay, disabilityPercent, isWarInjury);
  const disabilityDA = disabilityElement * (daPercent / 100);

  // Gallantry award: PVC ₹10,000, MVC ₹5,000, VrC ₹3,500/month extra
  const gallantryBonus = hasGallantryAward ? 5000 : 0;

  const totalMonthlyPension = Math.round(servicePension + daPension + disabilityElement + disabilityDA + gallantryBonus);
  const familyPension = Math.round(servicePension * 0.6); // 60% enhanced (first 7 years or till 67)

  // Retirement gratuity (same formula as central govt, max ₹20L for defence)
  const gratuity = Math.min((totalPay / 4) * Math.min(yearsOfService * 2, 33), 2000000);

  const exServicemenBenefits: string[] = [
    "ECHS (Ex-Servicemen Contributory Health Scheme) — covers self + spouse + dependent children",
    "CSD Canteen card — 15-20% savings on FMCG, electronics, liquor",
    "Priority in govt job reservations (10-14.5% quota)",
    "Property tax exemption in many states",
    "Railway concession (50% for ex-servicemen)",
    "Free plot / housing priority under DDA/Army Welfare Housing",
  ];
  if (hasGallantryAward) {
    exServicemenBenefits.push("Gallantry award monthly honorarium (₹3,500–₹10,000 extra)");
  }
  if (disabilityPercent >= 50) {
    exServicemenBenefits.push("Disability pension — exempt from Income Tax under Sec 80DD");
  }

  return {
    servicePension: Math.round(servicePension),
    daPension: Math.round(daPension),
    disabilityElement: Math.round(disabilityElement + disabilityDA),
    totalMonthlyPension,
    familyPension,
    retirementGratuity: Math.round(gratuity),
    exServicemenBenefits,
    orpNote: "OROP ensures you get the same pension as personnel of equal rank and length of service who retired later. Your pension is revised periodically (last OROP revision: 2022).",
    echs: true,
    canteenCard: true,
    estimatedMonthlySavingECHS: 8000, // ₹8K/month estimated savings vs private healthcare
  };
}

export const DEFENCE_PENSION_DEFAULTS: DefencePensionInputs = {
  service: "Army",
  rank: "Major",
  basicPay: 69400,
  mspdaPay: 15500 + 34700,  // MSP ₹15,500 + DA ~50%
  yearsOfService: 20,
  retirementAge: 54,
  currentAge: 35,
  daPercent: 50,
  disabilityPercent: 0,
  isWarInjury: false,
  hasGallantryAward: false,
  orpEnabled: true,
};

// ═══════════════════════════════════════════════════════════════════════
// 3. EPS-95 — EMPLOYEE PENSION SCHEME (Private Sector)
// ═══════════════════════════════════════════════════════════════════════

export interface EPS95Inputs {
  basicSalary: number;          // Current basic + DA (₹/month)
  pensionableSalary: number;    // Capped at ₹15,000 (or higher for higher pension option)
  yearsOfService: number;       // Total EPS-covered service (min 10 for pension)
  higherPensionOption: boolean; // Post Supreme Court 2022 ruling
  pastServiceBefore1995: number; // Years before EPS-95 started (Nov 1995)
  currentAge: number;
  retirementAge: number;        // Usually 58
}

export interface EPS95Result {
  monthlyPension: number;
  pastServicePension: number;   // For service before Nov 1995
  totalMonthlyPension: number;
  eligibility: boolean;         // Min 10 years service
  minimumPensionNote: string;
  higherPensionBenefit: number; // Extra if opted for higher pension
  familyPension: number;        // 50% of pension
  withdrawalAmount: number;     // EPS withdrawal if <10 years service
  taxNote: string;
}

// Past service table (₹/month per year of service before 1995)
const PAST_SERVICE_RATES: Record<number, number> = {
  1: 85, 2: 85, 3: 85, 4: 85, 5: 85,
  6: 95, 7: 95, 8: 95, 9: 95,
  10: 95, 11: 95, 12: 95, 13: 95, 14: 95, 15: 95,
  16: 120, 17: 120, 18: 120, 19: 120, 20: 120,
  21: 150, 22: 150, 23: 150, 24: 150, 25: 150,
};

export function calculateEPS95(inputs: EPS95Inputs): EPS95Result {
  const {
    pensionableSalary, yearsOfService, higherPensionOption,
    pastServiceBefore1995, basicSalary,
  } = inputs;

  const eligible = yearsOfService >= 10;

  if (!eligible) {
    // Less than 10 years — withdrawal only
    const withdrawalAmount = Math.round(pensionableSalary * yearsOfService * 1.02);
    return {
      monthlyPension: 0,
      pastServicePension: 0,
      totalMonthlyPension: 0,
      eligibility: false,
      minimumPensionNote: "Minimum 10 years of EPS contribution required for pension eligibility. You can withdraw the EPS balance.",
      higherPensionBenefit: 0,
      familyPension: 0,
      withdrawalAmount,
      taxNote: "EPS withdrawal before 10 years: subject to TDS if service < 5 years.",
    };
  }

  // EPS-95 pension formula: (Pensionable Salary × Pensionable Service) / 70
  // Pensionable salary capped at ₹15,000 (unless higher pension option opted)
  const cappedSalary = higherPensionOption ? Math.min(pensionableSalary, basicSalary) : Math.min(pensionableSalary, 15000);
  const monthlyPension = Math.max((cappedSalary * yearsOfService) / 70, 1000); // Min ₹1,000

  // Higher pension benefit (approx — based on actual basic salary vs ₹15K cap)
  const standardPension = Math.max((15000 * yearsOfService) / 70, 1000);
  const higherPensionBenefit = higherPensionOption ? monthlyPension - standardPension : 0;

  // Past service pension (before Nov 1995)
  const pastYears = Math.min(pastServiceBefore1995, 25);
  const pastServicePension = pastYears > 0
    ? (PAST_SERVICE_RATES[pastYears] ?? 85) * (cappedSalary / 6500)
    : 0;

  const totalMonthlyPension = Math.round(monthlyPension + pastServicePension);
  const familyPension = Math.round(totalMonthlyPension * 0.5); // 50% for spouse

  return {
    monthlyPension: Math.round(monthlyPension),
    pastServicePension: Math.round(pastServicePension),
    totalMonthlyPension,
    eligibility: true,
    minimumPensionNote: "Government guarantees minimum ₹1,000/month. If your calculated pension is lower, you receive ₹1,000.",
    higherPensionBenefit: Math.round(higherPensionBenefit),
    familyPension,
    withdrawalAmount: 0,
    taxNote: "EPS pension is fully taxable as income. No TDS at source — pay as per your tax slab.",
  };
}

export const EPS95_DEFAULTS: EPS95Inputs = {
  basicSalary: 30000,
  pensionableSalary: 15000,
  yearsOfService: 25,
  higherPensionOption: false,
  pastServiceBefore1995: 0,
  currentAge: 50,
  retirementAge: 58,
};

// ═══════════════════════════════════════════════════════════════════════
// 4. GRATUITY + LEAVE ENCASHMENT
// ═══════════════════════════════════════════════════════════════════════

export type EmploymentType = "govt-central" | "govt-state" | "private-covered" | "private-uncovered";

export interface GratuityInputs {
  basicSalary: number;      // Basic + DA (₹/month)
  yearsOfService: number;   // Completed years (or years + months for uncovered)
  employmentType: EmploymentType;

  // Leave encashment
  earnedLeaveDays: number;  // EL balance (max 300 for central govt)
  halfPayLeaveDays: number; // HPL balance (for govt employees)
}

export interface GratuityResult {
  gratuity: number;
  taxExemptGratuity: number;  // ₹20 lakh limit (₹25L proposed)
  taxableGratuity: number;
  gratuityNote: string;

  leaveEncashment: number;
  taxExemptLeave: number;     // ₹25 lakh for govt (₹3L for private — old limit)
  taxableLeave: number;
  leaveNote: string;

  totalBenefit: number;
  totalTaxFree: number;
  totalTaxable: number;
}

export function calculateGratuity(inputs: GratuityInputs): GratuityResult {
  const { basicSalary, yearsOfService, employmentType, earnedLeaveDays, halfPayLeaveDays } = inputs;

  let gratuity = 0;
  let taxExemptLimit = 2000000; // ₹20 lakh (Payment of Gratuity Act)
  let gratuityNote = "";

  const dailySalary = basicSalary / 26; // Working days per month

  if (employmentType === "govt-central" || employmentType === "govt-state") {
    // Govt formula: ¼ of monthly emoluments × every 6 months of service (max ₹20L)
    const halfYears = Math.min(yearsOfService * 2, 33); // capped at 33 = 16.5 years
    gratuity = (basicSalary / 4) * halfYears;
    taxExemptLimit = 2000000;
    gratuityNote = "Central/state govt employees: ¼ of pay × completed 6-month periods (max 33). Tax-exempt up to ₹20 lakh.";
  } else if (employmentType === "private-covered") {
    // Payment of Gratuity Act 1972: 15 days' salary × years (for 5+ years)
    if (yearsOfService >= 5) {
      gratuity = (basicSalary / 26) * 15 * yearsOfService;
      gratuityNote = "Gratuity Act formula: (Basic+DA / 26) × 15 × years. Eligible after 5 years. Tax-exempt up to ₹20 lakh.";
    } else {
      gratuityNote = "Minimum 5 years of service required under Payment of Gratuity Act.";
    }
  } else {
    // Private — not covered by Act: ½ month salary × years (employer discretion)
    gratuity = (basicSalary / 2) * yearsOfService;
    gratuityNote = "Not covered under Payment of Gratuity Act. Formula: ½ month salary × years. Tax-exempt up to ₹20 lakh.";
  }

  gratuity = Math.min(Math.round(gratuity), 3000000); // hard cap ₹30L (max reported)
  const taxExemptGratuity = Math.min(gratuity, taxExemptLimit);
  const taxableGratuity = Math.max(0, gratuity - taxExemptGratuity);

  // ── Leave Encashment ──────────────────────────────────────────────
  let leaveEncashment = 0;
  let taxExemptLeave = 0;
  let leaveNote = "";
  const TAX_EXEMPT_LEAVE_GOVT = 2500000; // ₹25 lakh
  const TAX_EXEMPT_LEAVE_PRIVATE = 300000; // ₹3 lakh (old limit, being revised)

  if (employmentType === "govt-central" || employmentType === "govt-state") {
    // Govt: EL encashment = (Basic + DA) / 30 × EL days (max 300)
    const cappedEL = Math.min(earnedLeaveDays, 300);
    leaveEncashment = (basicSalary / 30) * cappedEL;
    taxExemptLeave = Math.min(leaveEncashment, TAX_EXEMPT_LEAVE_GOVT);
    leaveNote = "Central govt: EL encashment at retirement fully tax-exempt up to ₹25 lakh. Maximum 300 EL days encashable.";
  } else {
    // Private: daily salary × earned leave days
    leaveEncashment = dailySalary * earnedLeaveDays;
    taxExemptLeave = Math.min(
      leaveEncashment,
      TAX_EXEMPT_LEAVE_PRIVATE,
      dailySalary * 10 * 30, // 10 months' salary (whichever is least)
      basicSalary * 10,
    );
    leaveNote = "Private sector: EL encashment exempt up to ₹3 lakh (or 10 months' salary, whichever is less). Taxable slab applies beyond.";
  }

  leaveEncashment = Math.round(leaveEncashment);
  taxExemptLeave = Math.round(taxExemptLeave);
  const taxableLeave = Math.max(0, leaveEncashment - taxExemptLeave);

  return {
    gratuity,
    taxExemptGratuity,
    taxableGratuity,
    gratuityNote,
    leaveEncashment,
    taxExemptLeave,
    taxableLeave,
    leaveNote,
    totalBenefit: gratuity + leaveEncashment,
    totalTaxFree: taxExemptGratuity + taxExemptLeave,
    totalTaxable: taxableGratuity + taxableLeave,
  };
}

export const GRATUITY_DEFAULTS: GratuityInputs = {
  basicSalary: 50000,
  yearsOfService: 25,
  employmentType: "private-covered",
  earnedLeaveDays: 120,
  halfPayLeaveDays: 0,
};
