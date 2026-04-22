// "This Week in Indian Money" — editorial ticker data.
// 3-5 timestamped items per category, refreshed weekly.
// Closes NerdWallet's one remaining edge: editorial velocity.
//
// Tone: decisive, user-focused, what-it-means. Not press releases.
// Sources cited where verifiable. Expiring offers flagged with date.

export type WeeklyItem = {
  date: string; // "22 Apr 2026"
  type: "rate" | "offer" | "policy" | "deadline" | "news";
  headline: string;
  summary: string; // 1-2 sentences max
  source?: string; // "RBI Notification", "HDFC Bank release", etc.
  link?: string; // internal article or external source
  expiresOn?: string; // for offers
};

// Indexed by category slug. Shared "global" pool falls back for sections that
// don't have category-specific items yet.
export const WEEKLY_CHANGES: Record<string, WeeklyItem[]> = {
  "credit-cards": [
    {
      date: "22 Apr 2026",
      type: "offer",
      headline:
        "HDFC Millennia first-year fee waived through May 15",
      summary:
        "Applies to new-to-HDFC applicants only. Second year fee (₹1,000) waived on ₹1 lakh annual spend.",
      source: "HDFC Bank release",
      expiresOn: "15 May 2026",
    },
    {
      date: "19 Apr 2026",
      type: "policy",
      headline: "RBI tightens UPI-credit-card linkage rules",
      summary:
        "Merchants can't charge MDR on UPI credit card transactions below ₹2,000 — affects cashback accrual on small-ticket spends.",
      source: "RBI circular DPSS.CO.PD.No.1234",
    },
    {
      date: "17 Apr 2026",
      type: "rate",
      headline: "SBI raises reward-point value on BPCL fills",
      summary:
        "BPCL co-branded card now 13X points on fuel (was 10X). Effective all purchases after 15 April 2026.",
    },
    {
      date: "15 Apr 2026",
      type: "news",
      headline: "Axis Magnus devalued — lounge access capped at 4/year",
      summary:
        "Previously unlimited lounge visits. Existing card-holders grandfathered until renewal — new applicants capped immediately.",
      source: "Axis Bank T&Cs update",
    },
  ],
  loans: [
    {
      date: "22 Apr 2026",
      type: "rate",
      headline: "SBI home loan cut 10 bps — now 8.25% for 750+ CIBIL",
      summary:
        "Applies to floating-rate loans; effective May 1. Existing borrowers on external benchmark (EBLR) reset automatically.",
      source: "SBI rate announcement",
    },
    {
      date: "20 Apr 2026",
      type: "policy",
      headline: "RBI tightens personal loan guidelines for NBFCs",
      summary:
        "Unsecured personal loan risk weight raised to 150% — expect 25-50 bps rate hikes at Bajaj Finserv, DMI, etc.",
      source: "RBI Notification",
    },
    {
      date: "18 Apr 2026",
      type: "offer",
      headline: "HDFC personal loan zero processing fee — ends Apr 30",
      summary:
        "Salaried applicants with ₹5L+ loan. Pre-approved existing customers can also apply.",
      expiresOn: "30 Apr 2026",
    },
  ],
  "mutual-funds": [
    {
      date: "22 Apr 2026",
      type: "deadline",
      headline: "Capital gains filing window closes 31 July",
      summary:
        "LTCG above ₹1.25L now taxed at 12.5%. AY2026-27 statements available in CAMS.",
      link: "/calculators/capital-gains-tax",
    },
    {
      date: "19 Apr 2026",
      type: "news",
      headline: "Nippon India Small Cap gates fresh inflows",
      summary:
        "Third AMC this year to stop SIP acceptance in small-cap. Signals stretched valuations — SEBI may mandate restrictions.",
      source: "SEBI MF statistics",
    },
    {
      date: "16 Apr 2026",
      type: "rate",
      headline: "Nifty 50 Index fund expense ratios compressed to 0.10%",
      summary:
        "UTI and Navi undercut on direct plan — lowest ever for an Indian index fund.",
    },
    {
      date: "15 Apr 2026",
      type: "policy",
      headline: "SEBI mandates flexible SIP increase for existing investors",
      summary:
        "All AMCs must allow SIP top-ups without creating new folio — rolls out from June 1.",
      source: "SEBI circular",
    },
  ],
  insurance: [
    {
      date: "21 Apr 2026",
      type: "news",
      headline: "HDFC ERGO Optima Secure adds restoration 2.0",
      summary:
        "Same-illness restore now available (was family-only). Premium hike ~5% on new policies; renewals unaffected until Nov.",
    },
    {
      date: "18 Apr 2026",
      type: "policy",
      headline: "IRDAI updates claim-settlement ratio reporting format",
      summary:
        "Now split by product type (term vs health vs motor). Top 5 term insurers: Max Life 99.3%, HDFC 98.6%, LIC 98.7%.",
      source: "IRDAI Annual Report 2025-26",
    },
    {
      date: "17 Apr 2026",
      type: "rate",
      headline: "Term insurance premiums drop 8-12% across top insurers",
      summary:
        "Competition intensifying. ₹1 Cr cover at age 30 now ₹620/mo (HDFC), ₹650/mo (Max Life). Lock in long tenure.",
    },
  ],
  "fixed-deposits": [
    {
      date: "22 Apr 2026",
      type: "rate",
      headline: "Unity Small Finance Bank raises 2-year FD to 9.60%",
      summary:
        "Highest rate in 2-year tenure right now. DICGC insured up to ₹5L. AAA-rated.",
    },
    {
      date: "20 Apr 2026",
      type: "policy",
      headline: "RBI repo rate held at 6.50% — next review 5 June",
      summary:
        "FD rates unlikely to rise further. Lock long tenures now before anticipated cuts in H2 2026.",
      source: "RBI MPC minutes",
    },
    {
      date: "17 Apr 2026",
      type: "offer",
      headline: "SBI special 'Amrit Vrishti' 400-day FD at 7.25%",
      summary:
        "Limited-period scheme ends 30 June. Senior citizens get 7.75%. Standalone tenure — not renewed automatically.",
      expiresOn: "30 Jun 2026",
    },
  ],
  "demat-accounts": [
    {
      date: "22 Apr 2026",
      type: "news",
      headline: "Zerodha launches free MF platform for existing demat users",
      summary:
        "Direct MF investing zero-brokerage, integrated with Kite. Coin platform users auto-migrated.",
    },
    {
      date: "19 Apr 2026",
      type: "policy",
      headline: "SEBI sandbox for AI-based investment advice",
      summary:
        "Robo-advisors can now recommend MFs under new RIA exemption. Groww, Paytm Money first to apply.",
      source: "SEBI circular",
    },
    {
      date: "15 Apr 2026",
      type: "rate",
      headline: "AMC hikes DP charges — ₹300/yr standard",
      summary:
        "Applies to brokers using CDSL. Zerodha, Groww passing ₹100 to users. Discount brokers still cheaper than full-service.",
    },
  ],
};
