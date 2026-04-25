export interface TeamMember {
  id: string;
  name: string;
  slug: string;
  role: string;
  image: string;
  shortBio: string;
  fullBio: string;
  story: string;
  expertise: string[];
  /** Short expertise tags shown in bylines (max 3–4) */
  expertiseTags: string[];
  /** Article categories that auto-map to this desk */
  categories: string[];
  education: string[];
  experience: string[];
  location: string;
  social: {
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
  quote: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "editorial-team",
    name: "InvestingPro Editorial Team",
    slug: "editorial-team",
    role: "Research & Analysis",
    image: "/logo.png",
    location: "India",
    shortBio:
      "Our editorial team researches, writes, and fact-checks every article on InvestingPro. We cross-reference official sources including RBI circulars, SEBI guidelines, Income Tax Act provisions, and product issuer terms before publishing.",
    fullBio:
      "The InvestingPro Editorial Team is responsible for all financial content published on investingpro.in. Every article goes through a multi-step process: primary research from official sources, data verification against issuer websites and government portals, editorial review for accuracy and clarity, and a final fact-check before publishing. We do not accept sponsored content or paid editorial placements. Our revenue comes from affiliate partnerships, which are clearly disclosed and never influence our editorial recommendations.",
    story:
      "InvestingPro was started with a simple observation: most Indian personal finance content is either too complex (written for CAs) or too shallow (clickbait listicles). We set out to create research-grade financial guides written in plain language that any educated Indian can understand and act on. Every comparison table uses real data. Every calculation is verifiable. Every recommendation is backed by numbers, not opinions.",
    expertise: [
      "Credit Card Analysis",
      "Mutual Fund Research",
      "Tax Planning (Income Tax Act)",
      "Loan & Mortgage Comparison",
      "Insurance Analysis",
      "Fixed Deposit Rates",
      "Retirement Planning",
      "Stock Market Education",
    ],
    expertiseTags: ["General finance", "Personal finance", "Budgeting"],
    categories: [
      "general",
      "personal_finance",
      "budgeting",
      "financial_planning",
    ],
    education: [
      "Our team follows SEBI-compliant research methodology",
      "Content is fact-checked against official government and regulatory sources",
      "All financial calculations are independently verified",
    ],
    experience: [
      "2,500+ financial products researched and compared",
      "75+ financial calculators built and validated",
      "50+ in-depth financial guides published",
      "101 glossary terms covering Indian finance terminology",
    ],
    social: {
      email: "contact@investingpro.in",
    },
    quote:
      "We believe every Indian deserves access to clear, honest, data-driven financial information — without the jargon and without the sales pitch.",
  },
  {
    id: "tax-desk",
    name: "InvestingPro Tax Desk",
    slug: "tax-desk",
    role: "Tax Planning & Compliance",
    image: "/logo.png",
    location: "India",
    shortBio:
      "Our tax desk specializes in Indian income tax planning — Section 80C, ITR filing, HRA exemption, old vs new regime analysis. All tax content is verified against the Income Tax Act and latest Finance Act amendments.",
    fullBio:
      "The InvestingPro Tax Desk produces all tax-related content on the platform. We cover every aspect of individual taxation in India — from Section 80C investment planning to ITR filing procedures, HRA exemption calculations, and old vs new regime comparisons. Our guides include real INR calculations for different salary levels, making complex tax concepts actionable. All content references specific sections of the Income Tax Act 1961 and is updated after every Finance Act amendment and CBDT notification.",
    story:
      "Tax season in India means panic. Every January-March, millions of salaried Indians rush to make investments they do not understand, just to save tax. Our tax desk was created to change this. We publish comprehensive, year-round tax planning guides with salary-based examples so people can plan proactively, not reactively.",
    expertise: [
      "Section 80C, 80D, 80CCD",
      "ITR Filing (ITR-1, ITR-2, ITR-3, ITR-4)",
      "HRA Exemption Calculation",
      "Old vs New Tax Regime Analysis",
      "Capital Gains Tax",
      "TDS Rules & Compliance",
    ],
    expertiseTags: [
      "Tax planning",
      "ITR filing",
      "Section 80C, HRA, capital gains",
    ],
    categories: [
      "tax_planning",
      "income_tax",
      "tax",
      "itr",
      "hra",
      "capital_gains",
      "tax_saving",
      "gst",
    ],
    education: [
      "Content verified against Income Tax Act 1961",
      "Updated after every Finance Act amendment",
      "Salary-based examples calculated and cross-checked",
    ],
    experience: [
      "10+ comprehensive tax guides published",
      "4 salary-level tax calculation scenarios per guide",
      "FAQ sections based on real taxpayer questions",
    ],
    social: {
      email: "contact@investingpro.in",
    },
    quote:
      "Tax planning is not about finding loopholes. It is about understanding what the law already allows you to save — and using it fully.",
  },
  {
    id: "credit-team",
    name: "InvestingPro Credit Team",
    slug: "credit-team",
    role: "Credit & Banking Analysis",
    image: "/logo.png",
    location: "India",
    shortBio:
      "Our credit team analyzes credit cards, CIBIL scores, and banking products. Every card review includes real reward rate calculations, fee-to-benefit analysis, and comparison with alternatives.",
    fullBio:
      "The InvestingPro Credit Team evaluates credit cards, CIBIL scores, savings accounts, and banking products for the Indian market. Our approach is data-driven: we calculate actual reward values per rupee spent, compare annual fee vs benefits earned, and run break-even analyses for every card we recommend. We also produce educational content on CIBIL scores, credit utilization, and responsible credit management — topics where misinformation is rampant.",
    story:
      "Credit cards in India are sold on hype — airport lounges, reward points, lifestyle benefits. But very few people calculate whether the card actually pays for its annual fee. Our credit team was built to do exactly that math, so readers can make decisions based on value, not marketing.",
    expertise: [
      "Credit Card Reward Analysis",
      "CIBIL Score & Credit Reports",
      "Savings Account Comparison",
      "Fee-to-Benefit Calculations",
      "Banking Product Research",
    ],
    expertiseTags: ["Credit cards", "CIBIL score", "Banking products"],
    categories: [
      "credit_card",
      "credit_cards",
      "cibil",
      "banking",
      "savings_account",
      "loans",
    ],
    education: [
      "Reward rates verified from official card terms and conditions",
      "CIBIL content aligned with TransUnion CIBIL guidelines",
      "Interest rates sourced from bank websites and RBI data",
    ],
    experience: [
      "80+ credit cards analyzed with reward calculations",
      "11 in-depth credit card guides published",
      "CIBIL score educational content covering 300-900 range",
    ],
    social: {
      email: "contact@investingpro.in",
    },
    quote:
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
 *
 * Categories in the DB appear in both hyphen (`mutual-funds`) and
 * underscore (`mutual_fund`) forms depending on origin (glossary vs
 * articles vs products). We normalize both sides to underscore before
 * matching, so a single category arg resolves the same desk regardless
 * of where it came from.
 */
export function getDeskForCategory(category?: string | null): TeamMember {
  const fallback = TEAM_MEMBERS.find((m) => m.id === "editorial-team")!;
  if (!category) return fallback;
  const normalize = (s: string) => s.toLowerCase().trim().replace(/-/g, "_");
  const target = normalize(category);
  return (
    TEAM_MEMBERS.find((m) =>
      m.categories.some((c) => normalize(c) === target),
    ) ?? fallback
  );
}
