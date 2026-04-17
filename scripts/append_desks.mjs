import { readFileSync, writeFileSync } from "fs";

const filePath =
  "C:/Users/shivp/Desktop/InvestingPro_App/lib/data/team.ts";

let content = readFileSync(filePath, "utf-8");

const OLD_END = `    quote:
      "A credit card is a financial tool, not a status symbol. We help you pick the one that actually saves you money.",
  },
];`;

const NEW_END = `    quote:
      "A credit card is a financial tool, not a status symbol. We help you pick the one that actually saves you money.",
  },

  // Investment Desk
  {
    id: "investment-desk",
    name: "InvestingPro Investment Desk",
    slug: "investment-desk",
    role: "Investment Research",
    image: "/logo.png",
    location: "India",
    shortBio:
      "Our investment desk covers mutual funds, SIP, NPS, PPF, equities, and gold. Every guide includes real return calculations, risk ratings, and historical performance data sourced from AMFI, SEBI, and PFRDA.",
    fullBio:
      "The InvestingPro Investment Desk produces all investment-related content on the platform. We analyze mutual fund categories, SIP strategies, NPS tier allocation, PPF interest mechanics, and equity investing fundamentals. Our guides are data-driven: we run actual SIP simulations, compute XIRR for real portfolios, and compare fund performance across 1/3/5/10-year horizons using AMFI-verified NAV data. We do not recommend specific funds without disclosing our methodology.",
    story:
      "India has 10 crore+ mutual fund folios but most investors do not understand what they own. Our investment desk was built to bridge that gap — clear explanations of complex products, grounded in numbers, with no product-push.",
    expertise: [
      "Mutual Fund Analysis (Equity, Debt, Hybrid)",
      "SIP & Lumpsum Return Calculations",
      "NPS & EPFO Retirement Planning",
      "PPF & Small Savings Schemes",
      "Stock Market Education",
      "Gold & Sovereign Gold Bonds",
    ],
    expertiseTags: ["Mutual funds", "SIP, NPS, PPF", "Stocks & gold"],
    categories: [
      "mutual_funds",
      "mutual_fund",
      "sip",
      "nps",
      "ppf",
      "stocks",
      "equity",
      "gold",
      "investments",
      "investing",
      "elss",
      "demat",
    ],
    education: [
      "NAV and return data sourced from AMFI",
      "NPS content verified against PFRDA guidelines",
      "PPF rates aligned with Ministry of Finance notifications",
    ],
    experience: [
      "20+ mutual fund and investment guides published",
      "SIP calculators validated against AMFI return data",
      "NPS and PPF guides with real INR examples",
    ],
    social: {
      email: "contact@investingpro.in",
    },
    quote:
      "The best investment is the one you understand. We make sure you understand every option before you commit.",
  },

  // Lending Desk
  {
    id: "lending-desk",
    name: "InvestingPro Lending Desk",
    slug: "lending-desk",
    role: "Loans & EMI Research",
    image: "/logo.png",
    location: "India",
    shortBio:
      "Our lending desk covers home loans, personal loans, car loans, and EMI planning. All interest rate data is sourced from RBI MCLR/RLLR disclosures and bank websites, updated regularly.",
    fullBio:
      "The InvestingPro Lending Desk produces all loan-related content on the platform. We compare home loan interest rates across banks and NBFCs, calculate real EMIs at different tenures, explain the MCLR vs RLLR difference, and walk through loan eligibility criteria. Our guides help readers understand the true cost of borrowing — including processing fees, prepayment penalties, and insurance add-ons that lenders bundle with loans.",
    story:
      "A home loan is the largest financial commitment most Indians make — yet most people sign the papers without reading the fine print. Our lending desk was created to change that: plain-language explanations of every loan term, with full cost breakdowns.",
    expertise: [
      "Home Loan Rates & EMI Calculation",
      "Personal Loan Comparison",
      "Car Loan Analysis",
      "MCLR & RLLR Interest Rate Mechanics",
      "Loan Eligibility & Credit Assessment",
    ],
    expertiseTags: ["Home loans", "Personal loans", "Car loans, EMI planning"],
    categories: [
      "loans",
      "home_loans",
      "personal_loans",
      "car_loans",
      "loan",
      "emi",
      "mortgage",
      "nbfc",
    ],
    education: [
      "Interest rates sourced from RBI MCLR/RLLR disclosures",
      "EMI calculations verified with amortization schedules",
      "Processing fee data from bank PDS documents",
    ],
    experience: [
      "15+ loan comparison guides published",
      "EMI calculators validated for multiple loan types",
      "MCLR vs RLLR explainer updated quarterly",
    ],
    social: {
      email: "contact@investingpro.in",
    },
    quote:
      "The interest rate headline is just the beginning. We show you the full cost of every loan before you sign.",
  },

  // Insurance Desk
  {
    id: "insurance-desk",
    name: "InvestingPro Insurance Desk",
    slug: "insurance-desk",
    role: "Insurance Analysis",
    image: "/logo.png",
    location: "India",
    shortBio:
      "Our insurance desk covers term life, health, car, and travel insurance. We compare real premiums, claim settlement ratios from IRDAI, and policy exclusions — not insurer marketing material.",
    fullBio:
      "The InvestingPro Insurance Desk produces all insurance-related content on the platform. We analyze term insurance plans across premium, sum assured, claim settlement ratio, and policy exclusions. For health insurance, we evaluate room rent limits, co-payment clauses, restoration benefits, and network hospital counts. Our guides use IRDAI Annual Report data for claim ratios and are not sponsored by any insurer.",
    story:
      "Insurance in India is sold on fear and commission, not on logic. Most people either over-insure with expensive ULIPs or under-insure with inadequate coverage. Our insurance desk was created to make policy selection data-driven and transparent.",
    expertise: [
      "Term Life Insurance Comparison",
      "Health Insurance Analysis",
      "Car & Two-Wheeler Insurance",
      "IRDAI Claim Settlement Ratios",
      "Policy Exclusions & Fine Print",
    ],
    expertiseTags: ["Term & health insurance", "Car insurance", "Claim ratios"],
    categories: [
      "insurance",
      "term_insurance",
      "health_insurance",
      "car_insurance",
      "life_insurance",
      "ulip",
    ],
    education: [
      "Claim settlement ratios from IRDAI Annual Report",
      "Premium data from insurer websites and aggregators",
      "Policy exclusions verified from actual policy wordings",
    ],
    experience: [
      "10+ insurance comparison guides published",
      "Claim ratio comparisons updated annually",
      "Health insurance guide covering top 20 insurers",
    ],
    social: {
      email: "contact@investingpro.in",
    },
    quote:
      "The right insurance policy is invisible when you need it least and invaluable when you need it most. Pick it with data, not fear.",
  },

  // Banking Desk
  {
    id: "banking-desk",
    name: "InvestingPro Banking Desk",
    slug: "banking-desk",
    role: "Banking & Deposits Research",
    image: "/logo.png",
    location: "India",
    shortBio:
      "Our banking desk covers FD rates, savings accounts, RD, and digital banking. All interest rates are verified from bank websites and RBI data releases.",
    fullBio:
      "The InvestingPro Banking Desk produces all banking-related content on the platform. We track FD interest rates across PSU banks, private banks, small finance banks, and NBFCs. Our guides compare effective yields (with quarterly compounding), explain TDS on FD interest, and cover the DICGC Rs 5 lakh insurance guarantee. We also cover digital banking features, savings account interest rates, and recurring deposit mechanics.",
    story:
      "Fixed deposits are India's most popular investment — and the most misunderstood. Most investors do not know their post-tax FD yield, or that small finance banks offer significantly higher rates with the same DICGC guarantee as SBI. Our banking desk exists to close that information gap.",
    expertise: [
      "FD Rate Comparison (Banks + NBFCs)",
      "Savings Account Interest Rates",
      "Recurring Deposit Calculations",
      "DICGC Insurance Coverage",
      "Digital Banking Features",
    ],
    expertiseTags: ["FD rates", "Savings accounts", "RD & digital banking"],
    categories: [
      "fixed_deposits",
      "fixed_deposit",
      "fd",
      "savings_account",
      "rd",
      "recurring_deposit",
      "digital_banking",
    ],
    education: [
      "FD rates sourced from bank websites and RBI DBIE data",
      "TDS calculations verified against Income Tax Act provisions",
      "DICGC coverage rules from DICGC official circulars",
    ],
    experience: [
      "FD rate tracker updated weekly",
      "10+ banking and deposit guides published",
      "Small finance bank FD analysis with risk assessment",
    ],
    social: {
      email: "contact@investingpro.in",
    },
    quote:
      "The safest investment is not the one with the lowest risk label. It is the one whose risk you fully understand.",
  },
];

/**
 * Resolve the right editorial desk for a given article category.
 * Falls back to the general Editorial Team if no match is found.
 */
export function getDeskForCategory(category?: string | null): TeamMember {
  const fallback = TEAM_MEMBERS.find((m) => m.id === "editorial-team")!;
  if (!category) return fallback;
  const normalized = category.toLowerCase().trim();
  return (
    TEAM_MEMBERS.find((m) => m.categories.includes(normalized)) ?? fallback
  );
}`;

if (!content.includes(OLD_END)) {
  console.error("ERROR: Could not find end marker. File ends with:");
  console.error(JSON.stringify(content.slice(-300)));
  process.exit(1);
}

const newContent = content.replace(OLD_END, NEW_END);
writeFileSync(filePath, newContent, "utf-8");
console.log("SUCCESS — wrote", newContent.length, "chars");
