/**
 * Auto-Author: Category-based author persona assignment for articles.
 * Each category maps to a specialist desk/persona for E-E-A-T credibility.
 */

export interface ArticleAuthor {
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  expertise: string;
}

const AUTHORS: Record<string, ArticleAuthor> = {
  "credit-cards": {
    name: "InvestingPro Card Desk",
    slug: "card-desk",
    bio: "Our credit card analysis team reviews 80+ cards across Indian banks, scoring them on 23 data points including rewards, fees, lounge access, and insurance benefits.",
    avatar: "",
    expertise: "Credit Cards & Rewards",
  },
  "mutual-funds": {
    name: "InvestingPro MF Research",
    slug: "mf-research",
    bio: "Our mutual fund research team tracks 2,000+ schemes across AMCs, analysing rolling returns, expense ratios, portfolio overlap, and fund manager track records.",
    avatar: "",
    expertise: "Mutual Funds & SIPs",
  },
  tax: {
    name: "InvestingPro Tax Desk",
    slug: "tax-desk",
    bio: "Our tax advisory team simplifies ITR filing, Section 80C/80D deductions, capital gains rules, and new vs old regime decisions for Indian taxpayers.",
    avatar: "",
    expertise: "Income Tax & Tax Planning",
  },
  loans: {
    name: "InvestingPro Lending Desk",
    slug: "lending-desk",
    bio: "Our lending analysis team compares home loans, personal loans, and education loans across 30+ Indian banks and NBFCs, covering interest rates, processing fees, and eligibility.",
    avatar: "",
    expertise: "Loans & EMI Planning",
  },
  "fixed-deposits": {
    name: "InvestingPro FD Desk",
    slug: "fd-desk",
    bio: "Our fixed deposit research team monitors rates across 50+ banks and corporate FDs, tracking senior citizen specials, premature withdrawal penalties, and tax-saver options.",
    avatar: "",
    expertise: "Fixed Deposits & Debt Instruments",
  },
  "investing-basics": {
    name: "InvestingPro Education Desk",
    slug: "education-desk",
    bio: "Our financial education team creates beginner-friendly guides on saving, budgeting, compounding, and building your first investment portfolio in India.",
    avatar: "",
    expertise: "Financial Literacy & Investing Basics",
  },
  insurance: {
    name: "InvestingPro Insurance Desk",
    slug: "insurance-desk",
    bio: "Our insurance analysis team reviews term life, health, motor, and ULIP plans from 40+ Indian insurers, focusing on claim settlement ratios, exclusions, and real-world value.",
    avatar: "",
    expertise: "Life & Health Insurance",
  },
};

// Aliases: map alternate category slugs to the canonical author key
const CATEGORY_ALIASES: Record<string, string> = {
  "credit-card": "credit-cards",
  cards: "credit-cards",
  "mutual-fund": "mutual-funds",
  mf: "mutual-funds",
  sip: "mutual-funds",
  loan: "loans",
  "home-loan": "loans",
  "personal-loan": "loans",
  "education-loan": "loans",
  fd: "fixed-deposits",
  "fixed-deposit": "fixed-deposits",
  "corporate-fd": "fixed-deposits",
  "tax-planning": "tax",
  "income-tax": "tax",
  itr: "tax",
  basics: "investing-basics",
  beginner: "investing-basics",
  "financial-literacy": "investing-basics",
  "demat-accounts": "investing-basics",
  demat: "investing-basics",
  ppf: "investing-basics",
  nps: "investing-basics",
  "life-insurance": "insurance",
  "health-insurance": "insurance",
  "term-insurance": "insurance",
  "motor-insurance": "insurance",
};

const DEFAULT_AUTHOR: ArticleAuthor = {
  name: "InvestingPro Editorial",
  slug: "editorial",
  bio: "The InvestingPro editorial team covers personal finance, banking, and investment topics for the Indian market with data-driven analysis and actionable advice.",
  avatar: "",
  expertise: "Personal Finance",
};

/**
 * Get the appropriate author persona for a given article category.
 * Falls back to a generic editorial persona for unknown categories.
 */
export function getAuthorForCategory(category: string): ArticleAuthor {
  const key = category.toLowerCase().trim();

  // Direct match
  if (AUTHORS[key]) {
    return AUTHORS[key];
  }

  // Alias match
  const aliasKey = CATEGORY_ALIASES[key];
  if (aliasKey && AUTHORS[aliasKey]) {
    return AUTHORS[aliasKey];
  }

  // Partial match: check if category contains a known key
  for (const authorKey of Object.keys(AUTHORS)) {
    if (key.includes(authorKey) || authorKey.includes(key)) {
      return AUTHORS[authorKey];
    }
  }

  return DEFAULT_AUTHOR;
}

/**
 * Get all available author personas.
 */
export function getAllAuthors(): ArticleAuthor[] {
  return Object.values(AUTHORS);
}
