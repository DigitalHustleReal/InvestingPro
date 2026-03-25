/**
 * NRI Fixed Deposit Comparison — FCNR vs NRE vs NRO
 *
 * Three account types for Non-Resident Indians:
 *
 * FCNR (Foreign Currency Non-Resident)
 *   — Deposit in foreign currency (USD/GBP/EUR/CAD/AUD/JPY/SGD)
 *   — No INR conversion risk for principal
 *   — Interest taxable in India; TDS applicable
 *   — Fully repatriable (principal + interest)
 *   — Tenure: 1–5 years only
 *
 * NRE (Non-Resident External)
 *   — Deposit in INR (converted from foreign currency on deposit)
 *   — Interest FULLY TAX-FREE in India (Sec 10(4)(ii))
 *   — Fully repatriable
 *   — Subject to INR depreciation/appreciation risk
 *   — Tenure: 1 year to 10 years
 *
 * NRO (Non-Resident Ordinary)
 *   — Deposit in INR (for India-sourced income: rent, dividends, etc.)
 *   — Interest TAXABLE at 30% + surcharge + cess (TDS 30%)
 *   — DTAA benefit possible (reduces TDS to 10-15% for many countries)
 *   — Repatriation limited to USD 1 million per year (net of taxes)
 *   — Tenure: 7 days to 10 years
 */

// ═══════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════

export type NRIFDCurrency = "USD" | "GBP" | "EUR" | "CAD" | "AUD" | "SGD";
export type NRIFDAccountType = "FCNR" | "NRE" | "NRO";
export type TDTAACountry =
  | "None (30% TDS)"
  | "USA"
  | "UK"
  | "Canada"
  | "Australia"
  | "UAE"
  | "Singapore"
  | "Germany"
  | "Netherlands"
  | "France"
  | "Japan";

export interface NRIFDInputs {
  principalForeign: number;    // Principal in foreign currency
  currency: NRIFDCurrency;
  currentExchangeRate: number; // Current INR per foreign currency unit
  tenureMonths: number;        // 12–60 for FCNR; 12–120 for NRE/NRO
  dtaaCountry: TDTAACountry;   // For NRO TDS reduction
  expectedINRDepreciation: number; // % p.a. INR depreciation vs foreign currency (+ve = INR weakens)

  // Override rates (or use bank defaults)
  fcnrRateOverride?: number;   // % p.a.
  nreRateOverride?: number;    // % p.a.
  nroRateOverride?: number;    // % p.a.
}

export interface FDAccountResult {
  accountType: NRIFDAccountType;
  principalForeign: number;
  principalINR: number;
  interestRatePct: number;
  grossInterestINR: number;
  tdsINR: number;
  netInterestINR: number;
  maturityINR: number;

  // Foreign currency equivalent at maturity (accounting for INR movement)
  maturityForeign: number;
  effectiveReturnPct: number;   // Net annualised return in foreign currency terms
  isTaxFreeInIndia: boolean;
  isRepatriable: boolean;
  repatriationNote: string;
  taxNote: string;
}

export interface NRIFDResult {
  fcnr: FDAccountResult;
  nre: FDAccountResult;
  nro: FDAccountResult;
  winner: NRIFDAccountType;
  winnerReason: string;
  currencyRiskNote: string;
  comparisonTable: {
    label: string;
    fcnr: string;
    nre: string;
    nro: string;
  }[];
}

// ═══════════════════════════════════════════════════════════════════
// Bank rates (2026 indicative — user can override)
// ═══════════════════════════════════════════════════════════════════

/** FCNR (USD) indicative rates by tenure band */
const FCNR_USD_RATES: Record<number, number> = {
  12: 5.10, 24: 5.35, 36: 5.50, 48: 5.60, 60: 5.75,
};

/** NRE / NRO FD rates (same as domestic FD for tenures ≥1 year) */
const NRE_NRO_RATES: Record<number, number> = {
  12: 7.00, 24: 7.00, 36: 7.00, 48: 6.80, 60: 6.75,
  72: 6.50, 84: 6.50, 96: 6.50, 108: 6.50, 120: 6.50,
};

/** DTAA TDS rates on interest income (%) */
const DTAA_TDS_RATES: Record<TDTAACountry, number> = {
  "None (30% TDS)": 30,
  USA: 15,
  UK: 15,
  Canada: 15,
  Australia: 15,
  UAE: 12.5,    // India-UAE DTAA
  Singapore: 15,
  Germany: 10,
  Netherlands: 10,
  France: 10,
  Japan: 10,
};

function getBandedRate(
  tenureMonths: number,
  table: Record<number, number>
): number {
  const bands = Object.keys(table)
    .map(Number)
    .sort((a, b) => a - b);
  for (let i = bands.length - 1; i >= 0; i--) {
    if (tenureMonths >= bands[i]) return table[bands[i]];
  }
  return table[bands[0]];
}

// ═══════════════════════════════════════════════════════════════════
// Core calculation
// ═══════════════════════════════════════════════════════════════════

export function calculateNRIFD(inputs: NRIFDInputs): NRIFDResult {
  const {
    principalForeign,
    currency,
    currentExchangeRate,
    tenureMonths,
    dtaaCountry,
    expectedINRDepreciation,
    fcnrRateOverride,
    nreRateOverride,
    nroRateOverride,
  } = inputs;

  const years = tenureMonths / 12;
  const principalINR = principalForeign * currentExchangeRate;

  // Exchange rate at maturity (accounting for INR depreciation)
  // Positive depreciation = INR weakens = 1 USD buys more INR at maturity
  const fxAtMaturity =
    currentExchangeRate * Math.pow(1 + expectedINRDepreciation / 100, years);

  // ── FCNR ─────────────────────────────────────────────────────────
  const fcnrRate =
    fcnrRateOverride ??
    getBandedRate(Math.min(tenureMonths, 60), FCNR_USD_RATES); // cap 60m

  // FCNR: principal stays in foreign currency
  // Simple interest for <1yr, compound annual for ≥1yr
  const fcnrGrossForeign =
    years <= 1
      ? principalForeign * (fcnrRate / 100) * years
      : principalForeign * (Math.pow(1 + fcnrRate / 100, years) - 1);

  const fcnrMaturityForeign = principalForeign + fcnrGrossForeign;
  const fcnrGrossINR = fcnrGrossForeign * fxAtMaturity; // interest converted at maturity rate
  const fcnrTDS = fcnrGrossINR * 0.30; // 30% TDS on FCNR interest
  const fcnrNetInterestINR = fcnrGrossINR - fcnrTDS;
  const fcnrPrincipalINRAtMaturity = principalForeign * fxAtMaturity;
  const fcnrMaturityINR = fcnrPrincipalINRAtMaturity + fcnrNetInterestINR;

  // Effective return in foreign currency terms (after Indian tax)
  const fcnrEffective =
    ((fcnrMaturityForeign * (fcnrNetInterestINR / (fcnrNetInterestINR + fcnrTDS)) +
      principalForeign * (fxAtMaturity - currentExchangeRate) / fxAtMaturity) /
      principalForeign -
      1) *
    (1 / years) *
    100;

  const fcnr: FDAccountResult = {
    accountType: "FCNR",
    principalForeign,
    principalINR: Math.round(principalINR),
    interestRatePct: fcnrRate,
    grossInterestINR: Math.round(fcnrGrossINR),
    tdsINR: Math.round(fcnrTDS),
    netInterestINR: Math.round(fcnrNetInterestINR),
    maturityINR: Math.round(fcnrMaturityINR),
    maturityForeign: Math.round(fcnrMaturityForeign * 100) / 100,
    effectiveReturnPct: Math.round(fcnrEffective * 100) / 100,
    isTaxFreeInIndia: false,
    isRepatriable: true,
    repatriationNote:
      "Fully repatriable — principal and interest can be freely transferred abroad.",
    taxNote:
      "FCNR interest is taxable in India at 30%. TDS deducted by bank. File ITR to claim any refund if treaty rate is lower.",
  };

  // ── NRE ──────────────────────────────────────────────────────────
  const nreRate =
    nreRateOverride ?? getBandedRate(tenureMonths, NRE_NRO_RATES);

  const nreGrossINR =
    years <= 1
      ? principalINR * (nreRate / 100) * years
      : principalINR * (Math.pow(1 + nreRate / 100, years) - 1);

  const nreMaturityINR = principalINR + nreGrossINR; // ZERO tax in India
  // Convert maturity back to foreign currency at maturity FX rate
  const nreMaturityForeign = nreMaturityINR / fxAtMaturity;
  // Effective return in foreign currency = growth in foreign currency terms
  const nreEffective = ((nreMaturityForeign / principalForeign) ** (1 / years) - 1) * 100;

  const nre: FDAccountResult = {
    accountType: "NRE",
    principalForeign,
    principalINR: Math.round(principalINR),
    interestRatePct: nreRate,
    grossInterestINR: Math.round(nreGrossINR),
    tdsINR: 0,
    netInterestINR: Math.round(nreGrossINR),
    maturityINR: Math.round(nreMaturityINR),
    maturityForeign: Math.round(nreMaturityForeign * 100) / 100,
    effectiveReturnPct: Math.round(nreEffective * 100) / 100,
    isTaxFreeInIndia: true,
    isRepatriable: true,
    repatriationNote:
      "Fully repatriable — principal and interest can be transferred abroad at any time.",
    taxNote:
      "NRE interest is completely tax-free in India under Section 10(4)(ii). No TDS deducted. Subject to tax in country of residence.",
  };

  // ── NRO ──────────────────────────────────────────────────────────
  const nroRate =
    nroRateOverride ?? getBandedRate(tenureMonths, NRE_NRO_RATES);

  const tdsPct = DTAA_TDS_RATES[dtaaCountry] ?? 30;
  const nroGrossINR =
    years <= 1
      ? principalINR * (nroRate / 100) * years
      : principalINR * (Math.pow(1 + nroRate / 100, years) - 1);

  const nroTDS = nroGrossINR * (tdsPct / 100);
  const nroNetInterestINR = nroGrossINR - nroTDS;
  const nroMaturityINR = principalINR + nroNetInterestINR;
  const nroMaturityForeign = nroMaturityINR / fxAtMaturity;
  const nroEffective = ((nroMaturityForeign / principalForeign) ** (1 / years) - 1) * 100;

  const nro: FDAccountResult = {
    accountType: "NRO",
    principalForeign,
    principalINR: Math.round(principalINR),
    interestRatePct: nroRate,
    grossInterestINR: Math.round(nroGrossINR),
    tdsINR: Math.round(nroTDS),
    netInterestINR: Math.round(nroNetInterestINR),
    maturityINR: Math.round(nroMaturityINR),
    maturityForeign: Math.round(nroMaturityForeign * 100) / 100,
    effectiveReturnPct: Math.round(nroEffective * 100) / 100,
    isTaxFreeInIndia: false,
    isRepatriable: true,
    repatriationNote:
      "Repatriation capped at USD 1 million per financial year (net of taxes). Requires CA certificate (Form 15CB + 15CA).",
    taxNote: `NRO interest taxed at ${tdsPct}% TDS${dtaaCountry !== "None (30% TDS)" ? ` (DTAA rate for ${dtaaCountry})` : ""}. File ITR to claim slab-rate benefit if lower.`,
  };

  // ── Winner ────────────────────────────────────────────────────────
  const results = [fcnr, nre, nro].sort(
    (a, b) => b.effectiveReturnPct - a.effectiveReturnPct
  );
  const winner = results[0].accountType;
  const depNote =
    expectedINRDepreciation > 0
      ? `With INR depreciating ${expectedINRDepreciation}% p.a., FCNR's currency protection becomes more valuable.`
      : expectedINRDepreciation < 0
      ? `With INR appreciating ${Math.abs(expectedINRDepreciation)}% p.a., NRE/NRO give better foreign-currency returns.`
      : "With stable INR, NRE's higher INR rate and zero tax gives best returns.";

  const winnerReasons: Record<NRIFDAccountType, string> = {
    NRE: "NRE wins: highest interest rate in India with zero tax. Best for NRIs who don't need the funds in India.",
    FCNR: "FCNR wins: currency protection outweighs lower rate. Best when you expect INR to depreciate significantly.",
    NRO: "NRO wins in this scenario, but typically only suitable for NRIs with India-sourced income to park.",
  };

  const comparisonTable = [
    {
      label: "Interest Rate",
      fcnr: `${fcnrRate}% p.a.`,
      nre: `${nreRate}% p.a.`,
      nro: `${nroRate}% p.a.`,
    },
    {
      label: "Tax in India",
      fcnr: "30% TDS on interest",
      nre: "Zero tax (Sec 10(4)(ii))",
      nro: `${tdsPct}% TDS${dtaaCountry !== "None (30% TDS)" ? ` (DTAA)` : ""}`,
    },
    {
      label: "Maturity (INR)",
      fcnr: `₹${fcnr.maturityINR.toLocaleString("en-IN")}`,
      nre: `₹${nre.maturityINR.toLocaleString("en-IN")}`,
      nro: `₹${nro.maturityINR.toLocaleString("en-IN")}`,
    },
    {
      label: `Maturity (${currency})`,
      fcnr: `${currency} ${fcnr.maturityForeign.toLocaleString()}`,
      nre: `${currency} ${nre.maturityForeign.toLocaleString()}`,
      nro: `${currency} ${nro.maturityForeign.toLocaleString()}`,
    },
    {
      label: `Effective Return (${currency})`,
      fcnr: `${fcnr.effectiveReturnPct}% p.a.`,
      nre: `${nre.effectiveReturnPct}% p.a.`,
      nro: `${nro.effectiveReturnPct}% p.a.`,
    },
    {
      label: "Repatriation",
      fcnr: "Unlimited",
      nre: "Unlimited",
      nro: "USD 1M/year",
    },
    {
      label: "Currency Risk",
      fcnr: "None (stays in " + currency + ")",
      nre: "Yes (INR FD, convert out at maturity)",
      nro: "Yes (INR FD, convert out at maturity)",
    },
  ];

  return {
    fcnr,
    nre,
    nro,
    winner,
    winnerReason: winnerReasons[winner],
    currencyRiskNote: depNote,
    comparisonTable,
  };
}

export const NRI_FD_DEFAULTS: NRIFDInputs = {
  principalForeign: 10000,           // USD 10,000
  currency: "USD",
  currentExchangeRate: 84.5,         // USD/INR
  tenureMonths: 24,
  dtaaCountry: "USA",
  expectedINRDepreciation: 3,        // 3% p.a. historical average
};

/** Exchange rates (approximate — user sees these as defaults) */
export const DEFAULT_FX_RATES: Record<NRIFDCurrency, number> = {
  USD: 84.5,
  GBP: 107.0,
  EUR: 91.5,
  CAD: 62.0,
  AUD: 54.5,
  SGD: 63.0,
};

export const CURRENCY_LABELS: Record<NRIFDCurrency, string> = {
  USD: "US Dollar (USD)",
  GBP: "British Pound (GBP)",
  EUR: "Euro (EUR)",
  CAD: "Canadian Dollar (CAD)",
  AUD: "Australian Dollar (AUD)",
  SGD: "Singapore Dollar (SGD)",
};
