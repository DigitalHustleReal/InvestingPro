// Content Calendar data model and 30-day calendar builder

export type ContentCategory =
  | "credit-cards"
  | "mutual-funds"
  | "loans"
  | "insurance"
  | "tax"
  | "banking"
  | "investing";

export type ContentStatus = "planned" | "in-progress" | "review" | "published";

export type ContentType =
  | "pillar"
  | "cluster"
  | "comparison"
  | "guide"
  | "news";

export interface CalendarEntry {
  id: string;
  title: string;
  slug: string;
  category: ContentCategory;
  type: ContentType;
  status: ContentStatus;
  date: string; // YYYY-MM-DD
  targetKeyword: string;
  secondaryKeywords: string[];
  wordCountTarget: number;
  priority: "high" | "medium" | "low";
  cluster: string;
  contentBrief: string;
  searchIntent?:
    | "informational"
    | "commercial"
    | "transactional"
    | "navigational";
}

export const CATEGORY_COLORS: Record<
  ContentCategory,
  { bg: string; text: string; border: string }
> = {
  "credit-cards": {
    bg: "bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-500/20",
  },
  "mutual-funds": {
    bg: "bg-green-500/10",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-500/20",
  },
  loans: {
    bg: "bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500/20",
  },
  insurance: {
    bg: "bg-purple-500/10",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-500/20",
  },
  tax: {
    bg: "bg-red-500/10",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-500/20",
  },
  banking: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-700 dark:text-cyan-400",
    border: "border-cyan-500/20",
  },
  investing: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/20",
  },
};

export const STATUS_COLORS: Record<
  ContentStatus,
  { bg: string; text: string }
> = {
  planned: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-600 dark:text-gray-400",
  },
  "in-progress": {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-400",
  },
  review: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
  },
  published: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400",
  },
};

export const TYPE_LABELS: Record<ContentType, string> = {
  pillar: "Pillar",
  cluster: "Cluster",
  comparison: "Comparison",
  guide: "Guide",
  news: "News",
};

export const CATEGORY_LABELS: Record<ContentCategory, string> = {
  "credit-cards": "Credit Cards",
  "mutual-funds": "Mutual Funds",
  loans: "Loans",
  insurance: "Insurance",
  tax: "Tax",
  banking: "Banking",
  investing: "Investing",
};

// 30-day content calendar with topic clusters for topical authority
export function buildCalendar(): CalendarEntry[] {
  const today = new Date();
  const entries: CalendarEntry[] = [];

  const topics: Omit<CalendarEntry, "id" | "date">[] = [
    // Week 1: Credit Cards cluster
    {
      title: "Best Credit Cards in India 2026 - Complete Guide",
      slug: "best-credit-cards-india-2026",
      category: "credit-cards",
      type: "pillar",
      status: "planned",
      targetKeyword: "best credit cards in India",
      secondaryKeywords: [
        "top credit cards 2026",
        "credit card comparison India",
      ],
      wordCountTarget: 4000,
      priority: "high",
      cluster: "Credit Cards",
      contentBrief:
        "Comprehensive guide covering top credit cards across categories - rewards, travel, cashback, fuel, and lifetime free options.",
    },
    {
      title: "Best Lifetime Free Credit Cards",
      slug: "best-lifetime-free-credit-cards",
      category: "credit-cards",
      type: "cluster",
      status: "planned",
      targetKeyword: "lifetime free credit cards India",
      secondaryKeywords: [
        "no annual fee credit cards",
        "free credit cards 2026",
      ],
      wordCountTarget: 2500,
      priority: "high",
      cluster: "Credit Cards",
      contentBrief:
        "Ranked list of credit cards with zero annual fee forever, covering eligibility, benefits, and application process.",
    },
    {
      title: "Credit Card vs Debit Card - Which to Use When",
      slug: "credit-card-vs-debit-card",
      category: "credit-cards",
      type: "comparison",
      status: "planned",
      targetKeyword: "credit card vs debit card",
      secondaryKeywords: [
        "difference between credit and debit card",
        "which card is better",
      ],
      wordCountTarget: 2000,
      priority: "medium",
      cluster: "Credit Cards",
      contentBrief:
        "Side-by-side comparison with use-case scenarios for Indian consumers.",
    },

    // Week 1-2: Mutual Funds cluster
    {
      title: "Best Mutual Funds to Invest in 2026",
      slug: "best-mutual-funds-2026",
      category: "mutual-funds",
      type: "pillar",
      status: "planned",
      targetKeyword: "best mutual funds 2026",
      secondaryKeywords: [
        "top mutual funds India",
        "mutual fund recommendations",
      ],
      wordCountTarget: 4500,
      priority: "high",
      cluster: "Mutual Funds",
      contentBrief:
        "Data-driven guide to top performing mutual funds across equity, debt, hybrid, and index categories with 1Y/3Y/5Y returns.",
    },
    {
      title: "SIP vs Lumpsum - Which Investment Strategy Wins",
      slug: "sip-vs-lumpsum-investment-strategy",
      category: "mutual-funds",
      type: "comparison",
      status: "planned",
      targetKeyword: "SIP vs lumpsum investment",
      secondaryKeywords: ["SIP benefits", "lumpsum vs SIP returns"],
      wordCountTarget: 2500,
      priority: "high",
      cluster: "Mutual Funds",
      contentBrief:
        "Math-backed comparison with historical data showing when SIP outperforms lumpsum and vice versa.",
    },
    {
      title: "How to Choose the Right Mutual Fund",
      slug: "how-to-choose-mutual-fund",
      category: "mutual-funds",
      type: "guide",
      status: "planned",
      targetKeyword: "how to choose mutual fund",
      secondaryKeywords: [
        "mutual fund selection criteria",
        "choosing mutual funds for beginners",
      ],
      wordCountTarget: 3000,
      priority: "medium",
      cluster: "Mutual Funds",
      contentBrief:
        "Step-by-step framework for selecting mutual funds based on goals, risk tolerance, time horizon, and expense ratio.",
    },

    // Week 2: Tax cluster
    {
      title: "Income Tax Saving Guide - Section 80C to 80U",
      slug: "income-tax-saving-guide-80c-80u",
      category: "tax",
      type: "pillar",
      status: "planned",
      targetKeyword: "tax saving options India",
      secondaryKeywords: ["section 80C deductions", "tax saving investments"],
      wordCountTarget: 4000,
      priority: "high",
      cluster: "Tax Planning",
      contentBrief:
        "Complete guide to all tax deductions under sections 80C through 80U with examples and optimal tax-saving strategy.",
    },
    {
      title: "Old vs New Tax Regime - Which Saves More",
      slug: "old-vs-new-tax-regime-comparison",
      category: "tax",
      type: "comparison",
      status: "planned",
      targetKeyword: "old vs new tax regime",
      secondaryKeywords: [
        "new tax regime calculator",
        "which tax regime is better",
      ],
      wordCountTarget: 2500,
      priority: "high",
      cluster: "Tax Planning",
      contentBrief:
        "Calculator-backed comparison at every salary bracket showing which regime saves more tax.",
    },

    // Week 2-3: Loans cluster
    {
      title: "Best Home Loan Interest Rates in India 2026",
      slug: "best-home-loan-interest-rates-2026",
      category: "loans",
      type: "pillar",
      status: "planned",
      targetKeyword: "home loan interest rates India",
      secondaryKeywords: ["cheapest home loan", "home loan comparison"],
      wordCountTarget: 3500,
      priority: "high",
      cluster: "Home Loans",
      contentBrief:
        "Bank-by-bank comparison of home loan rates with processing fees, eligibility criteria, and EMI calculations.",
    },
    {
      title: "Personal Loan vs Credit Card EMI",
      slug: "personal-loan-vs-credit-card-emi",
      category: "loans",
      type: "comparison",
      status: "planned",
      targetKeyword: "personal loan vs credit card EMI",
      secondaryKeywords: [
        "which is cheaper personal loan or EMI",
        "credit card EMI charges",
      ],
      wordCountTarget: 2000,
      priority: "medium",
      cluster: "Personal Loans",
      contentBrief:
        "Cost comparison showing when a personal loan beats credit card EMI and vice versa, with real bank rate examples.",
    },
    {
      title: "Home Loan Balance Transfer Guide",
      slug: "home-loan-balance-transfer-guide",
      category: "loans",
      type: "guide",
      status: "planned",
      targetKeyword: "home loan balance transfer",
      secondaryKeywords: [
        "transfer home loan to another bank",
        "home loan refinancing",
      ],
      wordCountTarget: 2500,
      priority: "medium",
      cluster: "Home Loans",
      contentBrief:
        "Step-by-step process for transferring home loan with savings calculator and list of banks offering lowest rates.",
    },

    // Week 3: Insurance cluster
    {
      title: "Best Health Insurance Plans in India 2026",
      slug: "best-health-insurance-plans-2026",
      category: "insurance",
      type: "pillar",
      status: "planned",
      targetKeyword: "best health insurance India",
      secondaryKeywords: ["health insurance comparison", "mediclaim policy"],
      wordCountTarget: 4000,
      priority: "high",
      cluster: "Health Insurance",
      contentBrief:
        "Comprehensive comparison of top health insurance plans with coverage, premiums, claim settlement ratio, and network hospitals.",
    },
    {
      title: "Term Insurance vs Whole Life Insurance",
      slug: "term-vs-whole-life-insurance",
      category: "insurance",
      type: "comparison",
      status: "planned",
      targetKeyword: "term insurance vs whole life insurance",
      secondaryKeywords: ["which insurance is better", "term plan comparison"],
      wordCountTarget: 2500,
      priority: "medium",
      cluster: "Life Insurance",
      contentBrief:
        "Clear comparison with premium calculations showing why term insurance offers better value for most Indians.",
    },

    // Week 3-4: Banking & Investing cluster
    {
      title: "Best Savings Accounts in India 2026",
      slug: "best-savings-accounts-india-2026",
      category: "banking",
      type: "pillar",
      status: "planned",
      targetKeyword: "best savings account India",
      secondaryKeywords: [
        "highest interest savings account",
        "zero balance savings account",
      ],
      wordCountTarget: 3000,
      priority: "medium",
      cluster: "Banking",
      contentBrief:
        "Ranked comparison of savings accounts by interest rate, minimum balance, digital features, and debit card benefits.",
    },
    {
      title: "Best Fixed Deposit Rates 2026",
      slug: "best-fixed-deposit-rates-2026",
      category: "banking",
      type: "cluster",
      status: "planned",
      targetKeyword: "best FD rates 2026",
      secondaryKeywords: [
        "fixed deposit interest rates",
        "highest FD rates India",
      ],
      wordCountTarget: 2500,
      priority: "medium",
      cluster: "Banking",
      contentBrief:
        "Updated table of FD rates across major banks and small finance banks, with tax implications and comparison tools.",
    },
    {
      title: "NPS vs PPF vs ELSS - Best Tax Saving Investment",
      slug: "nps-vs-ppf-vs-elss",
      category: "investing",
      type: "comparison",
      status: "planned",
      targetKeyword: "NPS vs PPF vs ELSS",
      secondaryKeywords: [
        "best tax saving investment",
        "section 80C comparison",
      ],
      wordCountTarget: 3000,
      priority: "high",
      cluster: "Tax Planning",
      contentBrief:
        "Head-to-head comparison of the three most popular tax-saving instruments with returns, lock-in, and tax treatment analysis.",
    },

    // Week 4: Additional cluster content
    {
      title: "How to Improve CIBIL Score Fast",
      slug: "how-to-improve-cibil-score",
      category: "credit-cards",
      type: "guide",
      status: "planned",
      targetKeyword: "how to improve CIBIL score",
      secondaryKeywords: ["increase credit score India", "CIBIL score tips"],
      wordCountTarget: 2500,
      priority: "medium",
      cluster: "Credit Cards",
      contentBrief:
        "Actionable steps to improve CIBIL score from 600 to 750+ with timeline expectations and common mistakes to avoid.",
    },
    {
      title: "Best Demat Accounts in India 2026",
      slug: "best-demat-accounts-2026",
      category: "investing",
      type: "pillar",
      status: "planned",
      targetKeyword: "best demat account India",
      secondaryKeywords: ["demat account comparison", "cheapest demat account"],
      wordCountTarget: 3500,
      priority: "high",
      cluster: "Investing",
      contentBrief:
        "Feature-by-feature comparison of top brokers including Zerodha, Groww, Angel One, Upstox with brokerage, platforms, and support.",
    },
    {
      title: "Mutual Fund Expense Ratio Explained",
      slug: "mutual-fund-expense-ratio-explained",
      category: "mutual-funds",
      type: "cluster",
      status: "planned",
      targetKeyword: "mutual fund expense ratio",
      secondaryKeywords: ["what is expense ratio", "low expense ratio funds"],
      wordCountTarget: 2000,
      priority: "medium",
      cluster: "Mutual Funds",
      contentBrief:
        "Clear explanation of how expense ratio impacts returns with examples showing the difference over 10-20 year horizons.",
    },
    {
      title: "Education Loan in India - Complete Guide",
      slug: "education-loan-guide-india",
      category: "loans",
      type: "guide",
      status: "planned",
      targetKeyword: "education loan India",
      secondaryKeywords: [
        "student loan interest rates",
        "education loan eligibility",
      ],
      wordCountTarget: 3000,
      priority: "medium",
      cluster: "Education Loans",
      contentBrief:
        "End-to-end guide covering eligibility, documents, interest rates, collateral requirements, and repayment options.",
    },
  ];

  // Distribute topics across 30 days (skipping weekends for publishing cadence)
  let dayOffset = 0;
  for (let i = 0; i < topics.length; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);

    // Skip weekends
    while (date.getDay() === 0 || date.getDay() === 6) {
      dayOffset++;
      date.setDate(today.getDate() + dayOffset);
    }

    const dateStr = date.toISOString().split("T")[0];
    const topic = topics[i];
    // Infer search intent from content type
    const searchIntent =
      topic.type === "comparison" || topic.type === "pillar"
        ? "commercial"
        : topic.type === "guide"
          ? "informational"
          : topic.type === "news"
            ? "navigational"
            : ("informational" as const);

    entries.push({
      ...topic,
      id: `cal-${i + 1}`,
      date: dateStr,
      searchIntent,
    });

    // Space entries ~1.5 days apart
    dayOffset += i % 3 === 0 ? 2 : 1;
  }

  return entries;
}
