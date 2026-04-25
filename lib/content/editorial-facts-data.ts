/**
 * Static fallback for editorial_facts — mirrors what's in the DB so that
 * `getEditorialFacts()` in `./editorial-facts.ts` can keep serving data
 * if Supabase is unreachable or the seed hasn't run.
 *
 * Keep in sync with the `editorial_facts` table + its seed migration
 * (`create_editorial_facts_and_hubs`).
 *
 * Architectural principle (locked 2026-04-25): public content routes
 * through the CMS first; this file exists only for resilience.
 */

export type EditorialFact = {
  headline: string;
  value: string;
  note: string;
};

export const EDITORIAL_FACTS_STATIC: EditorialFact[] = [
  {
    headline: "₹10,000 / month SIP at 12% for 20 years",
    value: "₹99.9 L",
    note: "That's the power of compounding. Calculator: /calculators/sip",
  },
  {
    headline: "Old vs new regime — at ₹12 L income, deductions > ₹2.5 L",
    value: "Old wins",
    note: "Below that threshold, new regime is cheaper. Run it yourself.",
  },
  {
    headline: "LTCG threshold jumped post-Budget 2024 from ₹1 L to",
    value: "₹1.25 L",
    note: "Equity LTCG above this now taxed at 12.5%, not 10%.",
  },
];
