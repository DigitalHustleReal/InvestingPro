/**
 * Indian financial abbreviations that stay in English across every
 * locale.
 *
 * Rule (locked 2026-04-25 PM, see brainstorm.md):
 *   Indian readers code-switch — "मेरा SIP कितना return देगा?" is how
 *   people actually speak. Forced translation ("मेरा सिस्टमेटिक
 *   इन्वेस्टमेंट प्लान कितना रिटर्न देगा?") sounds robotic and hurts
 *   recognition.
 *
 *   Therefore: when generating or translating content into any locale
 *   (hi, te, ta, kn, bn, mr, gu), preserve every term in this list as
 *   the English form.
 *
 * Sources for the list: Indian financial regulators (RBI, SEBI, IRDAI,
 * PFRDA), Income Tax Act, common banking + investing vernacular.
 */

export const PRESERVED_ABBREVIATIONS: ReadonlyArray<string> = [
  // Investments + retirement
  "SIP",
  "SWP",
  "STP",
  "NAV",
  "AUM",
  "XIRR",
  "CAGR",
  "ELSS",
  "ULIP",
  "MF",
  "AMC",
  "ETF",
  "REIT",
  "INVIT",
  "NPS",
  "EPF",
  "VPF",
  "PPF",
  "SCSS",
  "SSY",
  "APY",
  "PMVVY",
  "NSC",
  "KVP",
  "NFO",
  "FMP",
  "NDS-OM",
  "T-Bill",

  // Banking + payments
  "FD",
  "RD",
  "CASA",
  "MCLR",
  "RLLR",
  "EBLR",
  "BPLR",
  "REPO",
  "CRR",
  "SLR",
  "DICGC",
  "RTGS",
  "NEFT",
  "IMPS",
  "UPI",
  "AePS",
  "BHIM",
  "NACH",
  "ECS",
  "IFSC",
  "MICR",

  // Identity + KYC
  "PAN",
  "TAN",
  "Aadhaar",
  "KYC",
  "eKYC",
  "CKYC",
  "FATCA",
  "CIBIL",
  "CRIF",
  "Equifax",
  "Experian",
  "DIN",
  "DSC",
  "UAN",
  "PRAN",

  // Tax
  "GST",
  "CGST",
  "SGST",
  "IGST",
  "UTGST",
  "TDS",
  "TCS",
  "ITR",
  "AIS",
  "TIS",
  "26AS",
  "STCG",
  "LTCG",
  "AMT",
  "MAT",

  // Lending + cards
  "EMI",
  "NBFC",
  "MFI",
  "LTV",
  "FOIR",
  "DSA",
  "DSB",
  "EMI",
  "DBT",
  "BNPL",
  "DIY",

  // Markets + indices
  "NSE",
  "BSE",
  "MCX",
  "NCDEX",
  "NIFTY",
  "SENSEX",
  "BANKNIFTY",
  "VIX",
  "F&O",
  "FII",
  "DII",
  "QIB",
  "ASBA",
  "ASM",
  "GSM",
  "T+1",

  // Insurance + pensions
  "IRDAI",
  "CSR",
  "IDV",
  "NCB",
  "PED",
  "PMJJBY",
  "PMSBY",
  "PMJAY",
  "ESIC",
  "EPFO",
  "EPS",

  // Regulators + bodies
  "RBI",
  "SEBI",
  "PFRDA",
  "AMFI",
  "FSDC",
  "FIU",
  "CBDT",
  "CBIC",
  "MoF",
  "DPIIT",
  "MCA",

  // Currency + units
  "INR",
  "USD",
  "EUR",
  "GBP",
  "AED",
  "SGD",
  "JPY",
];

/**
 * Lowercase set for fast lookup. Use when checking if a token in
 * generated content should be preserved as English.
 */
export const PRESERVED_ABBREVIATIONS_SET: ReadonlySet<string> = new Set(
  PRESERVED_ABBREVIATIONS.map((s) => s.toLowerCase()),
);

/**
 * Check if a token (single word) should be preserved as English in
 * any non-English locale. Case-insensitive.
 */
export function isPreservedAbbreviation(token: string): boolean {
  if (!token) return false;
  return PRESERVED_ABBREVIATIONS_SET.has(token.toLowerCase());
}
