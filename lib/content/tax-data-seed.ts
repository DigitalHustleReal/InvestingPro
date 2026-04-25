/**
 * Static fallback mirrors for tax_data table. Consumed by
 * `./tax-data.ts` when Supabase is unreachable or the seed hasn't run.
 *
 * Keep in sync with:
 *   - tax_data table (migration `create_tax_data`)
 *   - The REGIME_SLABS/DEDUCTIONS/KEY_DATES arrays that USED to live in
 *     app/taxes/page.tsx (now sourced from DB)
 */

export type TaxDeduction = {
  section: string;
  cap: string;
  covers: string;
};

export type TaxRegimeSlab = {
  income_range: string;
  rate_old: string;
  rate_new: string;
};

export type TaxKeyDate = {
  date_label: string;
  event: string;
};

/** FY 2026-27 — updated annually after Budget. */
export const TAX_REGIME_SLABS_STATIC: TaxRegimeSlab[] = [
  { income_range: "Up to ₹3 L", rate_old: "Nil", rate_new: "Nil" },
  { income_range: "₹3 L – ₹6 L", rate_old: "5%", rate_new: "5%" },
  { income_range: "₹6 L – ₹9 L", rate_old: "20%", rate_new: "10%" },
  { income_range: "₹9 L – ₹12 L", rate_old: "20%", rate_new: "15%" },
  { income_range: "₹12 L – ₹15 L", rate_old: "30%", rate_new: "20%" },
  { income_range: "Above ₹15 L", rate_old: "30%", rate_new: "30%" },
];

export const TAX_DEDUCTIONS_STATIC: TaxDeduction[] = [
  {
    section: "80C",
    cap: "₹1.5 L",
    covers: "PPF, ELSS, EPF, tax-saver FD, life insurance, home-loan principal",
  },
  {
    section: "80D",
    cap: "₹25–₹1 L",
    covers: "Self + family + senior-parent health insurance premiums",
  },
  {
    section: "80CCD(1B)",
    cap: "₹50,000",
    covers: "Over-and-above NPS contribution on top of 80C",
  },
  {
    section: "80E",
    cap: "No cap",
    covers: "Education-loan interest for higher studies",
  },
  {
    section: "80G",
    cap: "50–100%",
    covers: "Donations to approved charitable institutions",
  },
  {
    section: "24(b)",
    cap: "₹2 L",
    covers: "Home-loan interest on self-occupied property",
  },
];

export const TAX_KEY_DATES_STATIC: TaxKeyDate[] = [
  { date_label: "15 Jun 2026", event: "Advance tax — 1st instalment (15%)" },
  { date_label: "15 Sep 2026", event: "Advance tax — 2nd instalment (45%)" },
  { date_label: "15 Dec 2026", event: "Advance tax — 3rd instalment (75%)" },
  { date_label: "31 Jul 2026", event: "ITR filing deadline — non-audit cases" },
  { date_label: "15 Mar 2027", event: "Advance tax — final instalment (100%)" },
  { date_label: "31 Oct 2026", event: "ITR filing — audit cases" },
];
