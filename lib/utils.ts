import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a slug or category into a properly capitalized display name.
 * Handles Indian finance abbreviations: HRA, HDFC, SBI, IPO, ELSS, etc.
 */
const CAPS: Record<string, string> = {
  hra: "HRA",
  hdfc: "HDFC",
  icici: "ICICI",
  sbi: "SBI",
  ipo: "IPO",
  itr: "ITR",
  nps: "NPS",
  ppf: "PPF",
  epf: "EPF",
  elss: "ELSS",
  emi: "EMI",
  fd: "FD",
  cibil: "CIBIL",
  gst: "GST",
  nsc: "NSC",
  scss: "SCSS",
  ssy: "SSY",
  tds: "TDS",
  pan: "PAN",
  upi: "UPI",
  rbi: "RBI",
  sebi: "SEBI",
  irdai: "IRDAI",
  amfi: "AMFI",
  nav: "NAV",
  aum: "AUM",
  cagr: "CAGR",
  ulip: "ULIP",
  sip: "SIP",
  swp: "SWP",
  nbfc: "NBFC",
  kyc: "KYC",
  lic: "LIC",
  ltcg: "LTCG",
  stcg: "STCG",
  "80c": "80C",
  "80d": "80D",
  "80e": "80E",
  "80g": "80G",
  "80ccd": "80CCD",
  "80gg": "80GG",
  india: "India",
  vs: "vs",
};

export function formatSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => CAPS[w.toLowerCase()] || w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function slugifyTerm(term: string): string {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}
export function formatCompactNumber(number: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number);
}
