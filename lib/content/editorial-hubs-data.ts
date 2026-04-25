/**
 * Static fallback for editorial_hubs — mirrors DB rows so
 * `getEditorialHubs()` stays resilient if Supabase is unreachable.
 *
 * Keep in sync with the `editorial_hubs` table + its seed migration
 * (`create_editorial_facts_and_hubs`).
 *
 * `placement` groups rows for a given page surface:
 *   - "not-found-calculators" — 6 curated calcs on /not-found
 *   - "not-found-hubs"        — 3 category shortcuts on /not-found
 * Future placements can reuse this same table (homepage, footer, etc.).
 */

export type EditorialHub = {
  placement: string;
  href: string;
  title: string;
  tagline: string;
  accent: string | null;
};

export const EDITORIAL_HUBS_STATIC: EditorialHub[] = [
  // /not-found — curated calculators
  {
    placement: "not-found-calculators",
    href: "/calculators/sip",
    title: "SIP calculator",
    tagline: "Project mutual-fund returns",
    accent: "₹",
  },
  {
    placement: "not-found-calculators",
    href: "/calculators/emi",
    title: "EMI calculator",
    tagline: "Loan monthly payment",
    accent: "₹",
  },
  {
    placement: "not-found-calculators",
    href: "/calculators/hra",
    title: "HRA exemption",
    tagline: "Metro vs non-metro, 3-part rule",
    accent: "₹",
  },
  {
    placement: "not-found-calculators",
    href: "/calculators/old-vs-new-tax",
    title: "Old vs new regime",
    tagline: "Find out which saves more",
    accent: "%",
  },
  {
    placement: "not-found-calculators",
    href: "/calculators/fd",
    title: "FD calculator",
    tagline: "Maturity + interest payout",
    accent: "₹",
  },
  {
    placement: "not-found-calculators",
    href: "/calculators/ltcg",
    title: "LTCG calculator",
    tagline: "Post-2024 ₹1.25L threshold",
    accent: "%",
  },
  // /not-found — curated hubs
  {
    placement: "not-found-hubs",
    href: "/credit-cards",
    title: "Credit cards",
    tagline: "Compare rewards, cashback, premium and no-fee cards",
    accent: null,
  },
  {
    placement: "not-found-hubs",
    href: "/investing/learn",
    title: "Investing guides",
    tagline: "Mutual funds, stocks, NPS, PPF — explained with examples",
    accent: null,
  },
  {
    placement: "not-found-hubs",
    href: "/taxes",
    title: "Tax planning",
    tagline: "Old vs new regime, 80C optimizer, LTCG rules",
    accent: null,
  },
];

export function getStaticEditorialHubs(placement: string): EditorialHub[] {
  return EDITORIAL_HUBS_STATIC.filter((h) => h.placement === placement);
}
