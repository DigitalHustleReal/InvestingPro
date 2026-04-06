import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Database,
  BarChart3,
  UserCheck,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Scale,
  CreditCard,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "Editorial Methodology — How We Research & Rate Products | InvestingPro",
  description:
    "Learn about our 5-step editorial process, credit card scoring methodology, mutual fund rating system, data sources (AMFI, RBI), and our independence commitment. No paid rankings. Ever.",
  openGraph: {
    title: "Editorial Methodology | InvestingPro India",
    description:
      "Our 5-step research process, scoring methodology, and independence commitment — transparent and data-driven.",
    url: "https://investingpro.in/editorial-methodology",
    type: "website",
  },
};

const REVIEW_STEPS = [
  {
    step: 1,
    title: "Research",
    icon: Database,
    description:
      "Our research analysts identify the topic, scope, and relevant products. We gather primary data from authoritative sources — RBI circulars, SEBI notifications, AMFI factsheets, and official bank/NBFC product pages.",
    detail:
      "Each research brief includes the target audience, key questions to answer, and competitive benchmarks. We never start writing until the data foundation is complete.",
  },
  {
    step: 2,
    title: "Data Collection",
    icon: BarChart3,
    description:
      "All data points are collected, timestamped, and attributed to their source. For product comparisons, we scrape and manually verify fees, interest rates, rewards, and eligibility criteria from official provider websites.",
    detail:
      "We maintain an internal database that tracks 23+ data points per credit card and 18+ data points per mutual fund. Data is cross-referenced against at least two independent sources.",
  },
  {
    step: 3,
    title: "Analysis & Scoring",
    icon: Target,
    description:
      "Products are scored using our transparent, weighted methodology (detailed below). Scores are computed algorithmically — no manual overrides, no paid placements. The algorithm weighs cost, value, eligibility, and user experience.",
    detail:
      "Our scoring model is reviewed quarterly by the editorial board. Weight adjustments are documented and disclosed on this page.",
  },
  {
    step: 4,
    title: "Expert Review",
    icon: UserCheck,
    description:
      "A certified subject matter expert (CFA, CA, or ex-banker) reviews all claims, calculations, and recommendations. The reviewer checks for accuracy, balance, and regulatory compliance (RBI/SEBI/IRDAI guidelines).",
    detail:
      "The reviewer must sign off with their name and credentials. If disagreements arise, the Editor-in-Chief makes the final call.",
  },
  {
    step: 5,
    title: "Publication & Monitoring",
    icon: FileCheck,
    description:
      'Content is published with clear author attribution, "Last Updated" date, and a "Reviewed by" badge. Post-publication, automated monitors flag when underlying data changes (rate cuts, fee revisions, product discontinuations).',
    detail:
      "We aim to update affected content within 48 hours of a material change. Content older than 6 months is flagged for mandatory re-review.",
  },
];

const CREDIT_CARD_CRITERIA = [
  {
    name: "Annual Fee vs. Value",
    weight: 25,
    description:
      "Net cost after accounting for fee waivers, first-year offers, and reward redemption value.",
  },
  {
    name: "Rewards Rate & Redemption",
    weight: 20,
    description:
      "Effective earn rate, category multipliers, and ease of redemption (cashback, miles, points).",
  },
  {
    name: "Welcome & Milestone Benefits",
    weight: 15,
    description:
      "Sign-up bonus value, spend-based milestones, and anniversary gifts.",
  },
  {
    name: "Lounge Access & Travel",
    weight: 10,
    description:
      "Domestic and international lounge visits, travel insurance, forex markup.",
  },
  {
    name: "Interest Rate & Charges",
    weight: 10,
    description:
      "Purchase APR, cash advance fee, late payment charges, overlimit fees.",
  },
  {
    name: "Eligibility & Accessibility",
    weight: 10,
    description:
      "Income requirements, credit score thresholds, application process simplicity.",
  },
  {
    name: "Additional Features",
    weight: 10,
    description:
      "Fuel surcharge waiver, EMI conversion, add-on cards, digital experience (app quality).",
  },
];

const MF_CRITERIA = [
  {
    name: "Risk-Adjusted Returns (Sharpe Ratio)",
    weight: 25,
    description:
      "Returns per unit of risk taken, measured over 1Y, 3Y, and 5Y horizons.",
  },
  {
    name: "Consistency of Performance",
    weight: 20,
    description:
      "Rolling returns analysis — how often the fund beats its benchmark across all 3Y windows.",
  },
  {
    name: "Expense Ratio",
    weight: 15,
    description:
      "Total expense ratio relative to category average. Lower is better, especially for index and debt funds.",
  },
  {
    name: "Fund Manager Track Record",
    weight: 15,
    description:
      "Manager tenure, AUM managed, performance across market cycles.",
  },
  {
    name: "Portfolio Quality & Concentration",
    weight: 10,
    description:
      "Top-10 holding concentration, sector diversification, credit quality (for debt funds).",
  },
  {
    name: "AMC Reputation & Governance",
    weight: 10,
    description:
      "AMC AUM, regulatory history, investor grievance resolution, process transparency.",
  },
  {
    name: "Exit Load & Liquidity",
    weight: 5,
    description:
      "Exit load structure, redemption processing time, minimum investment amount.",
  },
];

const DATA_SOURCES = [
  {
    name: "AMFI (Association of Mutual Funds in India)",
    url: "https://www.amfiindia.com",
    use: "NAV data, scheme information, AUM, fund factsheets",
  },
  {
    name: "RBI (Reserve Bank of India)",
    url: "https://www.rbi.org.in",
    use: "Repo rate, bank license data, lending rate guidelines, monetary policy",
  },
  {
    name: "SEBI (Securities and Exchange Board of India)",
    url: "https://www.sebi.gov.in",
    use: "Mutual fund regulations, investor protection guidelines",
  },
  {
    name: "Official Bank & NBFC Websites",
    url: "#",
    use: "Credit card fees, loan interest rates, FD rates, product terms & conditions",
  },
  {
    name: "BSE/NSE",
    url: "https://www.bseindia.com",
    use: "Index performance, benchmark returns for fund comparison",
  },
  {
    name: "IRDAI",
    url: "https://www.irdai.gov.in",
    use: "Insurance product regulations, claim settlement ratios",
  },
  {
    name: "Ministry of Finance / NSDL",
    url: "https://www.incometax.gov.in",
    use: "Tax slab data, Section 80C limits, NPS rules",
  },
];

export default function EditorialMethodologyPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Editorial Methodology",
    description:
      "How InvestingPro researches, scores, and reviews financial products.",
    url: "https://investingpro.in/editorial-methodology",
    publisher: {
      "@type": "Organization",
      name: "InvestingPro India",
      url: "https://investingpro.in",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero */}
        <div className="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-950/10 pointer-events-none" />
          <div className="container mx-auto px-4 py-16 relative">
            <div className="max-w-3xl mx-auto text-center">
              <Badge
                variant="outline"
                className="mb-4 bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/50 dark:text-primary-400"
              >
                Transparency First
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                Editorial Methodology
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                How we research, score, and review every financial product on
                InvestingPro. Our process is designed to be transparent,
                reproducible, and free from commercial influence.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          {/* Independence Statement */}
          <Card className="border-2 border-primary-100 dark:border-primary-900">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <Scale className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    No Paid Rankings. Ever.
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    InvestingPro earns revenue through affiliate commissions
                    when you apply for a product through our links. However,
                    this <strong>never</strong> influences our rankings, scores,
                    or editorial recommendations. Our editorial team operates
                    independently from the business team. No advertiser can pay
                    to appear higher in our comparisons.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    If a product is objectively better but we have no affiliate
                    relationship with the provider, it still ranks higher. If a
                    partner product is mediocre, we say so. Our credibility is
                    our most valuable asset.
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/how-we-make-money"
                      className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      Read how we make money →
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5-Step Review Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <ShieldCheck className="w-6 h-6 text-primary-600" />
                Our 5-Step Review Process
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Every article, comparison, and product review goes through this
                process before publication.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {REVIEW_STEPS.map((item) => (
                  <div key={item.step} className="flex gap-5">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <item.icon className="w-4 h-4 text-primary-600" />
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {item.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Credit Card Rating Methodology */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <CreditCard className="w-6 h-6 text-primary-600" />
                Credit Card Scoring Methodology
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Each credit card is scored out of 100 based on the following
                weighted criteria.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {CREDIT_CARD_CRITERIA.map((criterion) => (
                  <div key={criterion.name}>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {criterion.name}
                      </h4>
                      <Badge variant="secondary" className="text-xs font-bold">
                        {criterion.weight}%
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mb-1.5">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${criterion.weight}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {criterion.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>How to read our scores:</strong> 90-100 = Exceptional,
                  80-89 = Excellent, 70-79 = Very Good, 60-69 = Good, Below 60 =
                  Below Average. Scores are recalculated when underlying data
                  changes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mutual Fund Rating Methodology */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <TrendingUp className="w-6 h-6 text-primary-600" />
                Mutual Fund Rating Methodology
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Funds are rated within their category (Large Cap, Mid Cap, etc.)
                using these weighted criteria.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MF_CRITERIA.map((criterion) => (
                  <div key={criterion.name}>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {criterion.name}
                      </h4>
                      <Badge variant="secondary" className="text-xs font-bold">
                        {criterion.weight}%
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mb-1.5">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${criterion.weight}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {criterion.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Note:</strong> Past performance does not guarantee
                  future results. Our ratings are analytical tools, not
                  investment advice. Always consider your own risk tolerance and
                  financial goals before investing.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Database className="w-6 h-6 text-primary-600" />
                Data Sources
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                We use only authoritative, primary data sources. Here is a
                complete list.
              </p>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {DATA_SOURCES.map((source) => (
                  <div key={source.name} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                          {source.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {source.use}
                        </p>
                      </div>
                      {source.url !== "#" && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium whitespace-nowrap"
                        >
                          Visit →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Update Frequency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Clock className="w-6 h-6 text-primary-600" />
                Update Frequency Commitments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    type: "Product Data (fees, rates)",
                    freq: "Daily",
                    detail: "Automated monitoring + manual verification weekly",
                  },
                  {
                    type: "Credit Card Comparisons",
                    freq: "Within 48 hours",
                    detail: "Updated when banks announce changes",
                  },
                  {
                    type: "Mutual Fund NAV & Returns",
                    freq: "Daily",
                    detail: "Sourced from AMFI each trading day",
                  },
                  {
                    type: "RBI Rate Changes",
                    freq: "Same day",
                    detail: "Updated immediately after policy announcements",
                  },
                  {
                    type: "Guides & Articles",
                    freq: "Quarterly review",
                    detail: "All articles reviewed every 3 months minimum",
                  },
                  {
                    type: "Calculator Logic",
                    freq: "Monthly verification",
                    detail: "Math validated against known benchmarks",
                  },
                ].map((item) => (
                  <div
                    key={item.type}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">
                          {item.type}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] border-primary-200 text-primary-600"
                        >
                          {item.freq}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Related Pages */}
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/authors"
              className="p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 transition-colors bg-white dark:bg-gray-900"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Our Team
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Meet the experts behind our research.
              </p>
            </Link>
            <Link
              href="/about-our-data"
              className="p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 transition-colors bg-white dark:bg-gray-900"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                About Our Data
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Data sources and freshness guarantees.
              </p>
            </Link>
            <Link
              href="/corrections"
              className="p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 transition-colors bg-white dark:bg-gray-900"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Corrections Policy
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                How we handle errors and updates.
              </p>
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              <strong>Important:</strong> InvestingPro.in is not registered with
              SEBI as an investment advisor. All information on this platform is
              for educational and informational purposes only. Users should
              consult with qualified financial advisors before making financial
              decisions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
