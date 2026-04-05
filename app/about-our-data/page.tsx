import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  RefreshCcw,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Clock,
  Layers,
  FileSearch,
  Scale,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Our Data — Sources, Freshness & Scoring | InvestingPro",
  description:
    "Complete transparency about where our data comes from (AMFI, RBI, bank websites), how often it is updated, and how products are ranked and scored on InvestingPro.",
  openGraph: {
    title: "About Our Data | InvestingPro India",
    description:
      "Data sources, freshness commitments, and how we rank financial products — full transparency.",
    url: "https://investingpro.in/about-our-data",
    type: "website",
  },
};

const DATA_SOURCES = [
  {
    category: "Mutual Funds",
    sources: [
      {
        name: "AMFI India",
        url: "https://www.amfiindia.com",
        data: "NAV (daily), scheme information, AUM, fund factsheets, category classifications",
      },
      {
        name: "Value Research / Morningstar",
        url: "https://www.valueresearchonline.com",
        data: "Fund ratings cross-reference, portfolio holdings, peer comparison",
      },
      {
        name: "AMC Official Websites",
        url: "#",
        data: "Scheme information documents (SID), key information memorandums (KIM), expense ratios",
      },
    ],
    freshness:
      "NAV updated daily by 11 PM IST. Fund factsheets updated monthly.",
  },
  {
    category: "Credit Cards",
    sources: [
      {
        name: "Official Bank Websites",
        url: "#",
        data: "Annual fees, reward rates, welcome benefits, eligibility criteria, interest rates",
      },
      {
        name: "RBI MITC Guidelines",
        url: "https://www.rbi.org.in",
        data: "Most Important Terms & Conditions disclosures mandated by RBI",
      },
      {
        name: "Card Network Portals (Visa/Mastercard)",
        url: "#",
        data: "Lounge access networks, forex rates, insurance coverage details",
      },
    ],
    freshness:
      "Fees and benefits verified weekly. Updated within 48 hours of bank announcements.",
  },
  {
    category: "Loans (Home, Personal, Car)",
    sources: [
      {
        name: "Bank/NBFC Official Websites",
        url: "#",
        data: "Interest rates, processing fees, prepayment charges, eligibility criteria",
      },
      {
        name: "RBI (Reserve Bank of India)",
        url: "https://www.rbi.org.in",
        data: "Repo rate, MCLR/EBLR benchmarks, lending rate regulations",
      },
      {
        name: "NHB (National Housing Bank)",
        url: "https://www.nhb.org.in",
        data: "Housing finance company rates and regulations",
      },
    ],
    freshness:
      "Interest rates updated within 24 hours of RBI policy changes. Full refresh weekly.",
  },
  {
    category: "Fixed Deposits",
    sources: [
      {
        name: "Bank Official Websites",
        url: "#",
        data: "FD rates by tenure, senior citizen rates, special schemes",
      },
      {
        name: "RBI Deposit Rates Database",
        url: "https://www.rbi.org.in",
        data: "Benchmark rates, regulatory limits",
      },
      {
        name: "DICGC",
        url: "https://www.dicgc.org.in",
        data: "Deposit insurance coverage limits and eligible institutions",
      },
    ],
    freshness:
      "FD rates updated daily. Special scheme details updated on launch day.",
  },
  {
    category: "Insurance",
    sources: [
      {
        name: "IRDAI",
        url: "https://www.irdai.gov.in",
        data: "Claim settlement ratios, registered insurer list, regulatory guidelines",
      },
      {
        name: "Insurance Company Websites",
        url: "#",
        data: "Premium calculators, policy terms, rider details, exclusions",
      },
      {
        name: "Policy Bazaar / Insurance Aggregators",
        url: "#",
        data: "Premium cross-verification (not for rankings)",
      },
    ],
    freshness:
      "Claim settlement ratios updated annually (IRDAI data). Premium data refreshed monthly.",
  },
  {
    category: "Government Schemes (PPF, NPS, SSY)",
    sources: [
      {
        name: "Ministry of Finance",
        url: "https://www.finmin.nic.in",
        data: "PPF/NSC/SSY interest rates (quarterly announcements)",
      },
      {
        name: "PFRDA",
        url: "https://www.pfrda.org.in",
        data: "NPS fund performance, AUM, pension fund manager returns",
      },
      {
        name: "India Post / SBI",
        url: "#",
        data: "Small savings scheme operational details",
      },
    ],
    freshness:
      "Updated immediately on quarterly rate announcements. NPS returns updated monthly.",
  },
];

export default function AboutOurDataPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "About Our Data",
    description:
      "Complete transparency about InvestingPro data sources, freshness, and scoring methodology.",
    url: "https://investingpro.in/about-our-data",
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
                Data Transparency
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                About Our Data
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                We believe you deserve to know exactly where our data comes
                from, how fresh it is, and how we use it to rank and score
                financial products. Complete transparency, no exceptions.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          {/* Data Principles */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Database,
                title: "Primary Sources Only",
                description:
                  "We collect data directly from regulators (RBI, SEBI, AMFI, IRDAI) and official bank/AMC websites. We never rely on third-party aggregators for primary data.",
              },
              {
                icon: RefreshCcw,
                title: "Always Fresh",
                description:
                  "Automated monitors check for rate changes daily. Product data is verified weekly. Articles are reviewed quarterly. Stale data is our enemy.",
              },
              {
                icon: Scale,
                title: "Algorithmically Ranked",
                description:
                  "Products are scored by a transparent, weighted algorithm. No bank or AMC can pay for a higher ranking. Period.",
              },
            ].map((item) => (
              <Card key={item.title} className="text-center">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Data Sources by Category */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Data Sources by Product Category
            </h2>

            <div className="space-y-6">
              {DATA_SOURCES.map((category) => (
                <Card key={category.category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <Layers className="w-5 h-5 text-primary-600" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y divide-gray-200 dark:divide-gray-800 mb-4">
                      {category.sources.map((source) => (
                        <div
                          key={source.name}
                          className="py-3 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                                  {source.name}
                                </h4>
                                {source.url !== "#" && (
                                  <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 hover:text-primary-700"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {source.data}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                      <Clock className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-primary-900 dark:text-primary-100">
                        <strong>Freshness:</strong> {category.freshness}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How Products Are Ranked */}
          <Card className="border-2 border-primary-100 dark:border-primary-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <BarChart3 className="w-6 h-6 text-primary-600" />
                How Products Are Ranked & Scored
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Every product on InvestingPro receives a score out of 100,
                computed using our weighted scoring algorithm. The weights vary
                by product category (credit cards, mutual funds, loans, etc.)
                and are fully disclosed on our
                <Link
                  href="/editorial-methodology"
                  className="text-primary-600 hover:underline font-medium"
                >
                  {" "}
                  Editorial Methodology
                </Link>{" "}
                page.
              </p>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Key principles of our ranking system:
                </h4>
                <ul className="space-y-2">
                  {[
                    "Scores are computed algorithmically — no manual overrides or paid placements.",
                    "The scoring formula is publicly disclosed with exact weights for each criterion.",
                    "Affiliate relationships do NOT influence scores or rankings. A product with no affiliate link can still rank #1.",
                    "Products are compared within their category (e.g., Travel Cards vs. Travel Cards, not Travel vs. Cashback).",
                    "Scores are recalculated automatically when underlying data changes.",
                    "Weight adjustments are reviewed quarterly by the editorial board and documented.",
                    "Tie-breaking: when two products have the same score, the one with lower cost to the consumer ranks higher.",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <Link
                  href="/editorial-methodology"
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                >
                  View detailed scoring methodology with weights →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Data Quality Assurance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <FileSearch className="w-6 h-6 text-primary-600" />
                Data Quality Assurance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Automated Monitoring",
                    description:
                      "Our systems monitor official bank and AMC websites daily for rate changes, fee revisions, and product updates.",
                  },
                  {
                    title: "Manual Verification",
                    description:
                      "Every data point is manually verified by a team member before being used in comparisons or scores.",
                  },
                  {
                    title: "Cross-Referencing",
                    description:
                      "Each data point is verified against at least two independent sources before publication.",
                  },
                  {
                    title: "Timestamped Attribution",
                    description:
                      'All data carries a source attribution and a "last verified" timestamp in our internal database.',
                  },
                  {
                    title: "Staleness Alerts",
                    description:
                      "Content older than 90 days triggers an automatic review flag for the editorial team.",
                  },
                  {
                    title: "Reader Reports",
                    description:
                      "Readers can report inaccuracies via our corrections process. Reports are investigated within 24 hours.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.description}
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
              href="/editorial-methodology"
              className="p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 transition-colors bg-white dark:bg-gray-900"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Editorial Methodology
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Our 5-step review and scoring system.
              </p>
            </Link>
            <Link
              href="/authors"
              className="p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 transition-colors bg-white dark:bg-gray-900"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Our Team
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Meet the experts behind the data.
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
              SEBI as an investment advisor. All data and analysis is for
              educational and informational purposes only. Users should consult
              with qualified financial advisors before making financial
              decisions. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
