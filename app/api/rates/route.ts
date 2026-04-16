import { NextResponse } from "next/server";

/**
 * GET /api/rates — Current financial rates for India
 *
 * Returns key rates that are referenced in articles.
 * Updated periodically — cached for 6 hours.
 *
 * These rates are displayed via LiveRateBadge component in articles
 * and the ContextualTicker on product pages.
 */

// Last verified: April 2026
// TODO: Replace with Supabase table + cron job to auto-update
const RATES = {
  updatedAt: "2026-04-16",
  source: "RBI, Bank websites, AMFI",
  rates: {
    // RBI rates
    rbi_repo: { value: 6.0, unit: "%", label: "RBI Repo Rate", source: "RBI" },
    rbi_reverse_repo: {
      value: 3.35,
      unit: "%",
      label: "RBI Reverse Repo",
      source: "RBI",
    },
    rbi_crr: { value: 4.0, unit: "%", label: "CRR", source: "RBI" },
    rbi_slr: { value: 18.0, unit: "%", label: "SLR", source: "RBI" },

    // FD rates (general, 1 year)
    sbi_fd_1y: {
      value: 6.8,
      unit: "%",
      label: "SBI FD (1Y)",
      source: "SBI website",
    },
    hdfc_fd_1y: {
      value: 7.0,
      unit: "%",
      label: "HDFC FD (1Y)",
      source: "HDFC website",
    },
    icici_fd_1y: {
      value: 6.9,
      unit: "%",
      label: "ICICI FD (1Y)",
      source: "ICICI website",
    },
    highest_fd: {
      value: 9.5,
      unit: "%",
      label: "Highest FD Rate",
      source: "Small finance banks",
    },

    // Loan rates
    sbi_home_loan: {
      value: 8.25,
      unit: "%",
      label: "SBI Home Loan",
      source: "SBI website",
    },
    hdfc_home_loan: {
      value: 8.35,
      unit: "%",
      label: "HDFC Home Loan",
      source: "HDFC website",
    },
    avg_personal_loan: {
      value: 11.5,
      unit: "%",
      label: "Avg Personal Loan",
      source: "Bank average",
    },

    // Small savings
    ppf_rate: {
      value: 7.1,
      unit: "%",
      label: "PPF Rate",
      source: "Ministry of Finance",
    },
    nsc_rate: {
      value: 7.7,
      unit: "%",
      label: "NSC Rate",
      source: "Ministry of Finance",
    },
    ssy_rate: {
      value: 8.2,
      unit: "%",
      label: "Sukanya Samriddhi",
      source: "Ministry of Finance",
    },
    scss_rate: {
      value: 8.2,
      unit: "%",
      label: "SCSS Rate",
      source: "Ministry of Finance",
    },
    epf_rate: {
      value: 8.25,
      unit: "%",
      label: "EPF Rate",
      source: "EPFO",
    },

    // Tax
    section_80c_limit: {
      value: 150000,
      unit: "₹",
      label: "Section 80C Limit",
      source: "Income Tax Act",
    },
    standard_deduction_old: {
      value: 50000,
      unit: "₹",
      label: "Std Deduction (Old)",
      source: "Finance Act",
    },
    standard_deduction_new: {
      value: 75000,
      unit: "₹",
      label: "Std Deduction (New)",
      source: "Finance Act",
    },
  },
};

export async function GET() {
  return NextResponse.json(RATES, {
    headers: {
      "Cache-Control": "public, max-age=21600, s-maxage=21600", // 6 hours
    },
  });
}
