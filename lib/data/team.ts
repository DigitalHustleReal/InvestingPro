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
];
