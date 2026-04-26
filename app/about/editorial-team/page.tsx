import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  ShieldCheck,
  Newspaper,
  FileSearch,
  BarChart3,
  Scale,
  BookOpen,
  Users,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

export const metadata = {
  title: "Our Editorial Team & Process",
  description:
    "How InvestingPro researches, writes, and fact-checks financial content. Our editorial process ensures every guide is accurate, unbiased, and data-driven.",
};

// Roll-up rules: which DB article categories belong to which desk.
// Slugs include both hyphenated and underscored variants because both
// exist in the articles table.
const DESK_CATEGORIES: Record<string, string[]> = {
  tax: ["tax-planning", "tax"],
  credit_banking: [
    "banking",
    "credit-cards",
    "credit_cards",
    "personal-finance",
    "fixed-deposits",
    "fixed_deposit",
  ],
  investment: [
    "investing",
    "investing-basics",
    "mutual-funds",
    "mutual_fund",
    "stocks",
    "ipo",
    "demat_account",
    "demat-accounts",
    "retirement",
  ],
  lending_insurance: [
    "loans",
    "insurance",
    "personal-loans",
    "small_business",
    "small-business",
  ],
};

function bucketLabel(count: number): string {
  if (count < 5) return `${count} guides`;
  if (count < 10) return "5+ guides";
  return `${Math.floor(count / 5) * 5}+ guides`;
}

const PROCESS_STEPS = [
  {
    step: "1",
    title: "Primary Research",
    desc: "We research from official sources — RBI circulars, SEBI guidelines, Income Tax Act, IRDAI filings, and product issuer websites. Never secondary blogs.",
  },
  {
    step: "2",
    title: "Data Collection & Verification",
    desc: "Interest rates, reward points, fees, and tax slabs are cross-checked against at least two independent sources. Calculations are run independently.",
  },
  {
    step: "3",
    title: "Writing & INR Examples",
    desc: "Guides are written in plain English with real ₹ calculations. Every comparison includes salary-based or income-based scenarios Indian readers can relate to.",
  },
  {
    step: "4",
    title: "Editorial Review",
    desc: "A second team member reviews for accuracy, completeness, and clarity. Misleading claims, unsupported comparisons, and jargon are flagged and revised.",
  },
  {
    step: "5",
    title: "Fact-Check & Publish",
    desc: "Final fact-check against current data. Last-updated date is set. Article is published with source references, internal links, and FAQ schema for rich results.",
  },
  {
    step: "6",
    title: "Ongoing Updates",
    desc: "Published articles are reviewed when underlying data changes — new FD rates, budget amendments, product launches. Updated articles show the revision date prominently.",
  },
];

export default async function EditorialTeamPage() {
  // Fetch live counts per category to compute real per-desk totals
  let totalArticles = 228;
  const deskCounts: Record<string, number> = {
    tax: 0,
    credit_banking: 0,
    investment: 0,
    lending_insurance: 0,
  };
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data, count } = await supabase
      .from("articles")
      .select("category", { count: "exact" })
      .eq("status", "published");
    if (count) totalArticles = count;
    if (data) {
      for (const row of data as { category: string }[]) {
        for (const [desk, cats] of Object.entries(DESK_CATEGORIES)) {
          if (cats.includes(row.category)) {
            deskCounts[desk]++;
            break;
          }
        }
      }
    }
  } catch {
    // Conservative fallback to ground-truth counts as of 2026-04-26
    deskCounts.tax = 22;
    deskCounts.credit_banking = 58;
    deskCounts.investment = 70;
    deskCounts.lending_insurance = 72;
  }

  const DESKS = [
    {
      name: "Tax Desk",
      focus: "Income Tax, Section 80C, ITR Filing, HRA, Tax Regime Analysis",
      articles: bucketLabel(deskCounts.tax),
      approach:
        "Every tax article references specific sections of the Income Tax Act 1961 and is updated after Finance Act amendments. We include salary-based INR calculations for 4+ income levels.",
      icon: Scale,
    },
    {
      name: "Credit & Banking Team",
      focus: "Credit Cards, CIBIL Scores, Savings Accounts, Banking Products",
      articles: bucketLabel(deskCounts.credit_banking),
      approach:
        "Card reward rates verified from official T&C documents. Fee-to-benefit break-even calculated for every recommendation. CIBIL content aligned with TransUnion guidelines.",
      icon: BarChart3,
    },
    {
      name: "Investment Research",
      focus: "Mutual Funds, SIP, ELSS, Index Funds, Stocks, IPOs",
      articles: bucketLabel(deskCounts.investment),
      approach:
        "Fund recommendations backed by historical NAV data. SIP calculations use compound interest formulas validated against AMC calculators. No fund house sponsorships.",
      icon: FileSearch,
    },
    {
      name: "Lending & Insurance Desk",
      focus: "Home Loans, Personal Loans, Term Insurance, Health Insurance",
      articles: bucketLabel(deskCounts.lending_insurance),
      approach:
        "Interest rates sourced from bank websites and RBI data. EMI calculations independently verified. Insurance comparisons based on IRDAI-filed product brochures.",
      icon: BookOpen,
    },
  ];

  const articleDisplay =
    totalArticles >= 100
      ? `${Math.floor(totalArticles / 10) * 10}+`
      : `${totalArticles}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <Badge
              variant="outline"
              className="mb-4 bg-primary/5 text-primary border-primary/20"
            >
              InvestingPro Editorial
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              How We Research & Write
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Every article on InvestingPro is researched from official sources,
              verified with real data, and written in plain language with INR
              examples. We do not accept sponsored editorial content.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-primary" />
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Editorial Independence
              </h3>
              <p className="text-xs text-gray-500">
                No paid placements in articles
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="h-7 w-7 text-primary" />
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Fact-Checked
              </h3>
              <p className="text-xs text-gray-500">Against official sources</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Newspaper className="h-7 w-7 text-primary" />
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                {articleDisplay} Articles Published
              </h3>
              <p className="text-xs text-gray-500">
                Across all finance categories
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Users className="h-7 w-7 text-primary" />
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Specialist Desks
              </h3>
              <p className="text-xs text-gray-500">
                Tax, Credit, Investments, Lending
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Editorial Process */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Our 6-Step Editorial Process
          </h2>
          <div className="space-y-6">
            {PROCESS_STEPS.map((step) => (
              <div key={step.step} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Specialist Desks */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Our Specialist Desks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DESKS.map((desk) => (
              <Card
                key={desk.name}
                className="border-gray-200 dark:border-gray-800"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <desk.icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{desk.name}</CardTitle>
                  </div>
                  <p className="text-xs text-gray-500">{desk.focus}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                    {desk.approach}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {desk.articles}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Sources We Use */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Sources We Reference
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="bg-white dark:bg-gray-900 border rounded-lg p-3 text-center">
              RBI Circulars & Notifications
            </div>
            <div className="bg-white dark:bg-gray-900 border rounded-lg p-3 text-center">
              SEBI Guidelines & Advisories
            </div>
            <div className="bg-white dark:bg-gray-900 border rounded-lg p-3 text-center">
              Income Tax Act 1961
            </div>
            <div className="bg-white dark:bg-gray-900 border rounded-lg p-3 text-center">
              IRDAI Product Brochures
            </div>
            <div className="bg-white dark:bg-gray-900 border rounded-lg p-3 text-center">
              Bank & NBFC Websites
            </div>
            <div className="bg-white dark:bg-gray-900 border rounded-lg p-3 text-center">
              AMFI & NAV Data
            </div>
            <div className="bg-white dark:bg-gray-900 border rounded-lg p-3 text-center">
              TransUnion CIBIL
            </div>
            <div className="bg-white dark:bg-gray-900 border rounded-lg p-3 text-center">
              CBDT Notifications
            </div>
            <div className="bg-white dark:bg-gray-900 border rounded-lg p-3 text-center">
              Finance Act Amendments
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 bg-primary/5 border border-primary/10 rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Found an Error?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We take accuracy seriously. If you find incorrect data, outdated
            rates, or misleading information in any of our articles, please let
            us know and we will correct it promptly.
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
          >
            Report a Correction
          </a>
        </div>
      </div>
    </div>
  );
}
