// Content brief generator for calendar entries
import type { CalendarEntry } from "./calendar-data";

export interface ContentBrief {
  uniqueAngle: string;
  suggestedH2s: string[];
  suggestedFAQs: string[];
  internalLinks: { text: string; url: string }[];
  competitorGaps: string[];
  schemaType: string;
}

// Brief templates per category
const BRIEF_TEMPLATES: Record<string, Partial<ContentBrief>> = {
  "credit-cards": {
    schemaType: "Product + FAQPage",
    competitorGaps: [
      "Most sites don't show real approval odds",
      "Missing reward value calculations",
      "No spending-pattern based recommendations",
    ],
  },
  "mutual-funds": {
    schemaType: "FinancialProduct + FAQPage",
    competitorGaps: [
      "Competitors show only 1Y returns, not risk-adjusted",
      "Missing expense ratio impact analysis",
      "No goal-based fund matching",
    ],
  },
  loans: {
    schemaType: "FinancialProduct + FAQPage",
    competitorGaps: [
      "Most sites have outdated interest rates",
      "Missing EMI breakdowns with prepayment",
      "No bank-wise processing fee comparison",
    ],
  },
  insurance: {
    schemaType: "Product + FAQPage",
    competitorGaps: [
      "Competitors lack claim settlement ratio trends",
      "Missing premium vs coverage value analysis",
      "No network hospital count comparison",
    ],
  },
  tax: {
    schemaType: "HowTo + FAQPage",
    competitorGaps: [
      "Most guides are generic, not salary-bracket specific",
      "Missing interactive calculator integration",
      "No regime comparison at specific income levels",
    ],
  },
  banking: {
    schemaType: "FinancialProduct + FAQPage",
    competitorGaps: [
      "Outdated interest rate tables",
      "Missing digital banking feature comparison",
      "No real user experience data",
    ],
  },
  investing: {
    schemaType: "FinancialProduct + FAQPage",
    competitorGaps: [
      "Missing brokerage cost calculators",
      "No platform UX comparison",
      "Competitors don't compare mobile app features",
    ],
  },
};

// Internal link suggestions per category
const INTERNAL_LINKS: Record<string, { text: string; url: string }[]> = {
  "credit-cards": [
    { text: "Credit Card Comparison Tool", url: "/credit-cards" },
    { text: "CIBIL Score Simulator", url: "/tools/cibil-simulator" },
    { text: "EMI Calculator", url: "/calculators/emi" },
  ],
  "mutual-funds": [
    { text: "Mutual Fund Explorer", url: "/mutual-funds" },
    { text: "SIP Calculator", url: "/calculators/sip" },
    { text: "Goal Planner", url: "/mutual-funds/goal-planner" },
  ],
  loans: [
    { text: "Loan Comparison", url: "/loans" },
    { text: "EMI Calculator", url: "/calculators/emi" },
    { text: "Eligibility Checker", url: "/loans/eligibility-checker" },
  ],
  insurance: [
    { text: "Insurance Plans", url: "/insurance" },
    { text: "Premium Calculator", url: "/calculators/insurance-premium" },
    { text: "Health Insurance Comparison", url: "/insurance" },
  ],
  tax: [
    { text: "Tax Calculator", url: "/calculators/income-tax" },
    { text: "ELSS Funds", url: "/mutual-funds?category=elss" },
    { text: "PPF Calculator", url: "/calculators/ppf" },
  ],
  banking: [
    { text: "Fixed Deposit Comparison", url: "/fixed-deposits" },
    { text: "FD Calculator", url: "/calculators/fd" },
    { text: "Banking Products", url: "/banking" },
  ],
  investing: [
    { text: "Demat Account Comparison", url: "/demat-accounts" },
    { text: "Risk Profiler", url: "/risk-profiler" },
    { text: "Portfolio Tracker", url: "/portfolio" },
  ],
};

export function generateBrief(entry: CalendarEntry): ContentBrief {
  const template = BRIEF_TEMPLATES[entry.category] || BRIEF_TEMPLATES.investing;
  const links = INTERNAL_LINKS[entry.category] || INTERNAL_LINKS.investing;

  // Generate H2s based on content type
  const suggestedH2s = generateH2s(entry);
  const suggestedFAQs = generateFAQs(entry);

  return {
    uniqueAngle: getUniqueAngle(entry),
    suggestedH2s,
    suggestedFAQs,
    internalLinks: links,
    competitorGaps: template.competitorGaps || [],
    schemaType: template.schemaType || "Article + FAQPage",
  };
}

function generateH2s(entry: CalendarEntry): string[] {
  if (entry.type === "pillar") {
    return [
      `What Makes the Best ${entry.title.split(" - ")[0]}`,
      "How We Evaluate and Rank",
      "Top Picks at a Glance",
      "Detailed Comparison Table",
      "How to Choose the Right Option",
      "Common Mistakes to Avoid",
      "Expert Tips for Maximizing Value",
      "Frequently Asked Questions",
    ];
  }
  if (entry.type === "comparison") {
    return [
      "Quick Comparison Summary",
      "Feature-by-Feature Breakdown",
      "Cost Analysis",
      "When to Choose Each Option",
      "Real-World Scenarios",
      "Our Recommendation",
    ];
  }
  if (entry.type === "guide") {
    return [
      "What You Need to Know",
      "Step-by-Step Process",
      "Eligibility and Requirements",
      "Tips from Financial Experts",
      "Common Pitfalls to Avoid",
      "Next Steps",
    ];
  }
  // cluster / news
  return [
    "Key Highlights",
    "Detailed Analysis",
    "What This Means for You",
    "How to Take Action",
    "Bottom Line",
  ];
}

function generateFAQs(entry: CalendarEntry): string[] {
  const keyword = entry.targetKeyword;
  return [
    `What is the best ${keyword} for beginners?`,
    `How do I compare ${keyword} options?`,
    `Is ${keyword} worth it in 2026?`,
    `What are the risks of ${keyword}?`,
    `How much can I save with the right ${keyword}?`,
  ];
}

function getUniqueAngle(entry: CalendarEntry): string {
  const angles: Record<string, string> = {
    pillar:
      "Comprehensive, data-driven analysis with proprietary scoring methodology and interactive comparison tools that competitors lack.",
    comparison:
      "Side-by-side analysis using real Indian consumer scenarios with calculator integrations showing exact savings.",
    guide:
      "Step-by-step walkthrough with expert insights, common mistake warnings, and links to our free calculators.",
    cluster:
      "Focused deep-dive with latest 2026 data, covering angles that pillar pages can't explore in detail.",
    news: "Timely analysis with practical implications for Indian consumers and actionable next steps.",
  };
  return angles[entry.type] || angles.cluster;
}
