import { logger } from "@/lib/logger";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Star,
  TrendingUp,
  Percent,
  IndianRupee,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  PieChart,
  BarChart3,
  AlertTriangle,
  ExternalLink,
  Target,
  Award,
} from "lucide-react";
import DifferentiationCard from "@/components/products/DifferentiationCard";
import { scoreMutualFund } from "@/lib/products/scoring-rules";
import { MutualFund } from "@/types";
import DecisionFramework from "@/components/common/DecisionFramework";
import DecisionCTA from "@/components/common/DecisionCTA";
import AffiliateDisclosure from "@/components/common/AffiliateDisclosure";
import ComplianceDisclaimer from "@/components/common/ComplianceDisclaimer";
import TableOfContents from "@/components/content/TableOfContents";
import NAVChart from "@/components/mutual-funds/NAVChart";
import SIPCalculatorWidget from "@/components/mutual-funds/SIPCalculatorWidget";
import CompareSimilarFunds from "@/components/mutual-funds/CompareSimilarFunds";
import FundStructuredData from "@/components/mutual-funds/FundStructuredData";
import Link from "next/link";

interface MutualFundDetail {
  id: string;
  name: string;
  amc: string;
  category: string;
  subCategory: string;
  nav: number;
  rating: number;
  riskLevel: "low" | "moderate" | "high" | "very_high";
  expenseRatio: number;
  exitLoad: string;
  minInvestment: number;
  sipMinInvestment: number;

  returns: {
    "1Y": number;
    "3Y": number;
    "5Y": number;
    "10Y"?: number;
    sinceInception: number;
  };

  aum: number;
  launchDate: string;
  benchmarkName: string;
  benchmarkReturns: {
    "1Y": number;
    "3Y": number;
    "5Y": number;
  };

  description: string;
  applyLink: string;

  // Detailed features
  investmentObjective: string;
  portfolioHoldings: {
    topStocks?: { name: string; weight: number }[];
    sectorAllocation?: { sector: string; weight: number }[];
    assetAllocation: { type: string; weight: number }[];
  };

  keyFeatures: string[];
  suitableFor: string[];
  taxBenefits?: string;

  pros: string[];
  cons: string[];

  fundManager: {
    name: string;
    experience: number;
  };
}

import { createServiceClient } from "@/lib/supabase/service";
import {
  fetchFundHistory,
  parseNAVHistory,
} from "@/lib/data-sources/mfapi-client";

async function getMutualFundData(
  slug: string,
): Promise<MutualFundDetail | null> {
  const supabase = createServiceClient();

  // Fetch from products table (category = 'mutual_fund')
  const { data: product, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, category, provider_name, provider_slug, description, image_url, rating, features, key_features, pros, cons, affiliate_link, official_link, is_active, trust_score, verification_status, updated_at, best_for",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !product) return null;

  // Extract enriched data from features JSONB
  const f = product.features || ({} as Record<string, any>);
  const riskMap: Record<string, "low" | "moderate" | "high" | "very_high"> = {
    Low: "low",
    "Low to Moderate": "low",
    Moderate: "moderate",
    "Moderately High": "high",
    High: "very_high",
    "Very High": "very_high",
  };

  const category = f.category || product.best_for || "Equity";
  const isEquity = category.startsWith("Equity");
  const isDebt = category.startsWith("Debt");
  const isELSS = category.includes("ELSS");

  const returns1Y = f.returns_1y != null ? Number(f.returns_1y) : 0;
  const returns3Y = f.returns_3y != null ? Number(f.returns_3y) : 0;
  const returns5Y = f.returns_5y != null ? Number(f.returns_5y) : 0;
  const returnsSI =
    f.returns_since_inception != null ? Number(f.returns_since_inception) : 0;

  const sipReturns = f.sip_returns || [];
  const riskMetrics = f.risk_metrics || {};

  return {
    id: product.id,
    name: product.name,
    amc: product.provider_name || f.fund_house || "",
    category: category,
    subCategory: f.sub_category || category,
    nav: Number(f.nav) || 0,
    rating: Number(product.rating) || 4,
    riskLevel: riskMap[f.risk_level] || "high",
    expenseRatio: Number(f.expense_ratio) || 0,
    exitLoad:
      f.exit_load || (isEquity ? "1% if redeemed within 1 year" : "Nil"),
    minInvestment: Number(f.min_lumpsum) || 5000,
    sipMinInvestment: Number(f.min_sip) || 500,

    returns: {
      "1Y": returns1Y,
      "3Y": returns3Y,
      "5Y": returns5Y,
      "10Y": f.returns_10y != null ? Number(f.returns_10y) : undefined,
      sinceInception: returnsSI,
    },

    aum: Number(f.aum_crores) || 0,
    launchDate: f.launch_date || "",
    benchmarkName:
      f.benchmark || (isEquity ? "Nifty 50 TRI" : "CRISIL Composite Bond"),
    benchmarkReturns: {
      "1Y": isEquity ? 8.5 : 7.2,
      "3Y": isEquity ? 14.2 : 6.8,
      "5Y": isEquity ? 13.8 : 7.0,
    },

    description:
      product.description ||
      `${product.name} is a ${category} fund managed by ${product.provider_name}.`,
    applyLink: product.affiliate_link || "#",

    investmentObjective: `To provide long-term capital appreciation by investing in a diversified portfolio of ${
      isEquity
        ? "equity and equity-related securities"
        : isDebt
          ? "fixed income instruments"
          : "a mix of equity and debt instruments"
    }. The fund follows a ${category} investment strategy managed by ${product.provider_name}.`,

    portfolioHoldings: {
      topStocks: [],
      sectorAllocation: [],
      assetAllocation: isEquity
        ? [
            { type: "Equity", weight: 95 },
            { type: "Debt", weight: 2 },
            { type: "Cash", weight: 3 },
          ]
        : isDebt
          ? [
              { type: "Debt", weight: 90 },
              { type: "Cash", weight: 10 },
            ]
          : [
              { type: "Equity", weight: 65 },
              { type: "Debt", weight: 30 },
              { type: "Cash", weight: 5 },
            ],
    },

    keyFeatures: [
      returns3Y
        ? `${returns3Y}% CAGR over 3 years`
        : `NAV: ₹${(Number(f.nav) || 0).toFixed(2)}`,
      `${category} category fund`,
      `Managed by ${product.provider_name}`,
      `Min SIP: ₹${Number(f.min_sip) || 500}/month`,
      f.scheme_code ? `AMFI Code: ${f.scheme_code}` : "",
      riskMetrics.max_drawdown
        ? `Max drawdown: ${riskMetrics.max_drawdown}%`
        : "",
    ].filter(Boolean),

    suitableFor: isEquity
      ? [
          "Long-term wealth creation (5+ years)",
          "SIP investors building corpus",
          "Goal-based investing (retirement, education)",
        ]
      : isDebt
        ? [
            "Conservative investors seeking stability",
            "Short to medium-term parking of funds",
            "Regular income seekers",
          ]
        : [
            "Balanced risk-return seekers",
            "First-time mutual fund investors",
            "Medium-term financial goals",
          ],

    taxBenefits: isELSS
      ? "Tax deduction up to ₹1.5L under Section 80C. 3-year lock-in period. LTCG above ₹1.25L taxed at 12.5%."
      : isEquity
        ? "Equity taxation: STCG (<1yr) at 20%. LTCG (>1yr) above ₹1.25L at 12.5%."
        : "Debt taxation: All gains taxed at income tax slab rate regardless of holding period.",

    pros:
      product.pros ||
      (isEquity
        ? [
            "Market-linked growth potential",
            "Professional fund management",
            "Diversified portfolio reduces risk",
          ]
        : [
            "Lower volatility than equity",
            "Regular income potential",
            "Capital preservation focus",
          ]),

    cons:
      product.cons ||
      (isEquity
        ? [
            "Market risk — NAV can decline in short term",
            "No guaranteed returns",
            "Requires 5+ year investment horizon",
          ]
        : [
            "Lower returns than equity long-term",
            "Interest rate risk affects NAV",
            "Inflation may erode real returns",
          ]),

    fundManager: {
      name: f.fund_manager || "Fund Management Team",
      experience: 10,
    },

    // Pass enriched data for SIP, Risk, and Chart sections
    __sipReturns: sipReturns,
    __riskMetrics: riskMetrics,
    __navHistory: await (async () => {
      // Fetch NAV history for chart from mfapi.in (cached via ISR)
      const schemeCode = f.scheme_code;
      if (!schemeCode) return [];
      try {
        const apiData = await fetchFundHistory(schemeCode);
        const history = parseNAVHistory(apiData.data);
        // Return last 5 years of data for the chart
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
        return history.filter((p) => p.date >= fiveYearsAgo);
      } catch {
        return [];
      }
    })(),
    // Fetch similar funds from same category
    __similarFunds: await (async () => {
      try {
        const { data: similar } = await supabase
          .from("products")
          .select("slug, name, provider_name, features")
          .eq("category", "mutual_fund")
          .eq("is_active", true)
          .neq("slug", slug)
          .limit(100);

        if (!similar) return [];

        // Filter to same fund category and sort by 3Y returns
        return similar
          .filter((s: any) => {
            const sf = s.features || {};
            return sf.category === category;
          })
          .map((s: any) => {
            const sf = s.features || {};
            return {
              slug: s.slug,
              name: s.name,
              provider: s.provider_name || sf.fund_house || "",
              returns1Y: sf.returns_1y != null ? Number(sf.returns_1y) : null,
              returns3Y: sf.returns_3y != null ? Number(sf.returns_3y) : null,
              nav: Number(sf.nav) || 0,
              riskLevel: sf.risk_level || "",
              category: sf.category || "",
            };
          })
          .sort((a: any, b: any) => (b.returns3Y || 0) - (a.returns3Y || 0))
          .slice(0, 10);
      } catch {
        return [];
      }
    })(),
  } as MutualFundDetail;
}

/**
 * Generate static params for all active mutual funds
 * This pre-generates all product pages at build time for better SEO
 */
export async function generateStaticParams() {
  try {
    const supabase = createServiceClient();
    const { data: funds, error } = await supabase
      .from("products")
      .select("slug")
      .eq("category", "mutual_fund")
      .eq("is_active", true)
      .not("slug", "is", null)
      .limit(50);

    if (error) {
      logger.error(
        "[generateStaticParams] Error fetching mutual funds:",
        error as Error,
      );
      return [];
    }

    if (!funds || funds.length === 0) {
      logger.warn("[generateStaticParams] No active mutual funds found");
      return [];
    }

    logger.info(
      `[generateStaticParams] Generating ${funds.length} mutual fund pages`,
    );
    return funds.map((fund) => ({ slug: fund.slug }));
  } catch (error) {
    logger.error(
      "[generateStaticParams] Failed to generate static params:",
      error as Error,
    );
    return [];
  }
}

// Force static generation with ISR (Incremental Static Regeneration)
export const dynamic = "force-static";
// Revalidate every hour to keep NAV and returns data fresh
export const revalidate = 3600; // 1 hour

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fund = await getMutualFundData(slug);

  if (!fund) {
    return {
      title: "Mutual Fund Not Found - InvestingPro",
    };
  }

  return {
    title: `${fund.name} Review - Returns, NAV, SIP & Invest Online | InvestingPro`,
    description: `${fund.description} 3Y Returns: ${fund.returns["3Y"]}%. Expense Ratio: ${fund.expenseRatio}%. Rating: ${fund.rating}/5. Invest via SIP from ₹${fund.sipMinInvestment}.`,
    keywords: `${fund.name}, ${fund.amc}, ${fund.category} fund, mutual fund investment, SIP, NAV, ${fund.name.toLowerCase()} review`,
  };
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "low":
      return "bg-green-100 text-green-600 border-green-600";
    case "moderate":
      return "bg-amber-100 text-amber-600 border-amber-600";
    case "high":
      return "bg-amber-100 text-amber-600 border-amber-600";
    case "very_high":
      return "bg-red-100 text-red-600 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getReturnColor = (value: number) => {
  if (value >= 15) return "text-green-600";
  if (value >= 10) return "text-green-600";
  if (value >= 5) return "text-amber-600";
  return "text-red-600";
};

export default async function MutualFundDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fund = await getMutualFundData(slug);

  if (!fund) {
    notFound();
  }

  // SIP calculator helper
  const calcSIP = (monthly: number, rate: number, years: number) => {
    const r = rate / 12 / 100;
    const n = years * 12;
    if (r === 0) return monthly * n;
    return Math.round(monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* JSON-LD Structured Data for SEO */}
      <FundStructuredData
        fund={fund}
        slug={slug}
        faqs={[
          {
            question: `Is ${fund.name} a good investment?`,
            answer: `${fund.name} has delivered ${fund.returns["3Y"]}% returns over 3 years with a ${fund.riskLevel} risk profile. It's rated ${fund.rating}/5.`,
          },
          {
            question: `What is the minimum SIP amount for ${fund.name}?`,
            answer: `The minimum SIP amount is ₹${fund.sipMinInvestment}/month. For lumpsum investment, the minimum is ₹${fund.minInvestment.toLocaleString()}.`,
          },
          {
            question: `What is the expense ratio of ${fund.name}?`,
            answer: `The expense ratio is ${fund.expenseRatio}%. This is the annual fee charged by ${fund.amc} for managing the fund.`,
          },
          {
            question: "Should I choose Direct or Regular plan?",
            answer:
              "Direct plans have 0.5-1% lower expense ratios (no distributor commission). Over 10+ years, this difference compounds significantly. InvestingPro recommends Direct plans.",
          },
          {
            question: `How are returns from ${fund.name} taxed?`,
            answer:
              fund.taxBenefits ||
              "Equity funds: LTCG above ₹1.25L taxed at 12.5% (held >1yr). Short-term (<1yr): 20%.",
          },
        ]}
      />
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-1.5 text-[13px] text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-gray-700 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li className="text-gray-300">/</li>
              <li>
                <Link
                  href="/mutual-funds"
                  className="hover:text-gray-700 transition-colors"
                >
                  Mutual Funds
                </Link>
              </li>
              <li className="text-gray-300">/</li>
              <li className="text-gray-700">{fund.name}</li>
            </ol>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Fund Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 text-green-600 mb-3">
                <PieChart className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase">
                  {fund.amc}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {fund.name}
              </h1>

              {/* Pre-Launch Critical: Affiliate Disclosure above the fold */}
              <div className="mb-6">
                <AffiliateDisclosure
                  variant="inline"
                  hasAffiliateLink={true}
                  className="bg-gray-50 border-gray-200 text-gray-700 rounded-lg p-3 max-w-fit"
                />
              </div>

              <p className="text-lg text-green-600 mb-4">{fund.description}</p>

              {/* Category & Rating */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="bg-green-50 px-4 py-2 rounded-lg">
                  <span className="text-sm text-green-600">Category: </span>
                  <span className="font-semibold">{fund.subCategory}</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-500 px-4 py-2 rounded-lg">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{fund.rating}/5</span>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg border ${getRiskColor(fund.riskLevel)}`}
                >
                  <span className="text-sm font-semibold capitalize">
                    {fund.riskLevel.replace("_", " ")} Risk
                  </span>
                </div>
              </div>

              {/* Returns */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(fund.returns).map(([period, value]) => (
                  <div
                    key={period}
                    className="bg-gray-50 rounded-lg p-3 text-center"
                  >
                    <p className="text-sm text-green-600 mb-1">
                      {period === "sinceInception" ? "Since Inception" : period}
                    </p>
                    <p
                      className={`text-2xl font-bold ${value >= 15 ? "text-green-600" : "text-gray-900"}`}
                    >
                      {value}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Invest Card */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-50 border border-gray-200">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <p className="text-sm text-green-600">Current NAV</p>
                    <p className="text-3xl font-bold">₹{fund.nav.toFixed(2)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <p className="text-green-600">Lumpsum</p>
                      <p className="font-semibold">
                        ₹{fund.minInvestment.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-green-600">SIP</p>
                      <p className="font-semibold">
                        ₹{fund.sipMinInvestment}/month
                      </p>
                    </div>
                  </div>

                  <DecisionCTA
                    text="Start SIP Now"
                    href={fund.applyLink}
                    productId={fund.id}
                    variant="primary"
                    size="lg"
                    className="w-full h-14 text-lg font-bold mb-2"
                    isExternal={!!fund.applyLink}
                    showIcon={true}
                  />
                  <p className="text-xs text-green-600 text-center">
                    Start SIP or make lumpsum investment
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* NAV Chart — Interactive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <NAVChart
          fundName={fund.name}
          navHistory={((fund as any).__navHistory || []).map((p: any) => ({
            date: p.dateStr || p.date,
            nav: p.nav,
          }))}
          currentNAV={fund.nav}
        />
      </div>

      {/* Decision Framework */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <DecisionFramework
          productId={fund.id}
          productName={fund.name}
          category="mutual-funds"
          affiliateLink={fund.applyLink}
          variant="compact"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Investment Objective */}
            <Card id="investment-objective">
              <CardHeader>
                <CardTitle className="flex items-center gap-6 md:p-8">
                  <Target className="w-6 h-6 text-green-600" />
                  Investment Objective
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{fund.investmentObjective}</p>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card id="key-features">
              <CardHeader>
                <CardTitle className="flex items-center gap-6 md:p-8">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {fund.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Portfolio Holdings */}
            <Card id="portfolio-holdings">
              <CardHeader>
                <CardTitle className="flex items-center gap-6 md:p-8">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                  Portfolio Holdings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Asset Allocation */}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">
                    Asset Allocation
                  </h3>
                  <div className="space-y-2">
                    {fund.portfolioHoldings.assetAllocation.map(
                      (asset, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">
                              {asset.type}
                            </span>
                            <span className="text-sm font-semibold">
                              {asset.weight}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all"
                              style={{ width: `${asset.weight}%` }}
                            />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Top Holdings */}
                {fund.portfolioHoldings.topStocks && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3">
                      Top 5 Holdings
                    </h3>
                    <div className="space-y-2">
                      {fund.portfolioHoldings.topStocks.map((stock, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-100 rounded"
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {stock.name}
                          </span>
                          <span className="text-sm font-semibold text-green-600">
                            {stock.weight}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sector Allocation */}
                {fund.portfolioHoldings.sectorAllocation && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">
                      Sector Allocation
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {fund.portfolioHoldings.sectorAllocation.map(
                        (sector, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-100 rounded border border-gray-200"
                          >
                            <p className="text-xs text-gray-500">
                              {sector.sector}
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {sector.weight}%
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pros & Cons */}
            <div
              id="pros-cons"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <Card className="border-green-600 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-600 flex items-center gap-6 md:p-8">
                    <CheckCircle2 className="w-5 h-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {fund.pros.map((pro, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-gray-700"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                        <span className="text-sm">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-100/30">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-6 md:p-8">
                    <XCircle className="w-5 h-5" />
                    Limitations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {fund.cons.map((con, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-gray-700"
                      >
                        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-1" />
                        <span className="text-sm">{con}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Fund Details */}
            <Card id="fund-details">
              <CardHeader>
                <CardTitle>Fund Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Expense Ratio</p>
                    <p className="font-semibold text-gray-900">
                      {fund.expenseRatio}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Exit Load</p>
                    <p className="font-semibold text-gray-900">
                      {fund.exitLoad}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">AUM</p>
                    <p className="font-semibold text-gray-900">
                      ₹{(fund.aum / 100).toFixed(0)} Cr
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fund Manager</p>
                    <p className="font-semibold text-gray-900">
                      {fund.fundManager.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {fund.fundManager.experience} years experience
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Table of Contents */}
            <TableOfContents
              items={[
                {
                  id: "investment-objective",
                  text: "Investment Objective",
                  level: 2,
                },
                { id: "key-features", text: "Key Features", level: 2 },
                {
                  id: "portfolio-holdings",
                  text: "Portfolio Holdings",
                  level: 2,
                },
                { id: "pros-cons", text: "Strengths & Limitations", level: 2 },
                { id: "fund-details", text: "Fund Details", level: 2 },
                {
                  id: "compare-funds",
                  text: "Compare Similar Funds",
                  level: 2,
                },
              ]}
            />

            {/* Differentiation Score Card */}
            <DifferentiationCard
              score={scoreMutualFund({
                id: fund.id,
                slug: slug,
                name: fund.name,
                category: "mutual_fund",
                provider: fund.amc,
                description: fund.description,
                rating: fund.rating,
                reviewsCount: 0,
                applyLink: fund.applyLink,
                riskLevel: fund.riskLevel,
                fundCategory: (fund.subCategory
                  ?.toLowerCase()
                  .includes("equity")
                  ? "equity"
                  : "debt") as any, // Simple map
                subCategory: fund.subCategory,
                returns1Y: fund.returns["1Y"],
                returns3Y: fund.returns["3Y"],
                returns5Y: fund.returns["5Y"],
                expenseRatio: fund.expenseRatio,
                exitLoad: fund.exitLoad,
                aum: (fund.aum / 100).toFixed(0) + " Cr",
                manager: fund.fundManager.name,
              })}
              productName={fund.name}
            />

            {/* Invest CTA (Sticky) */}
            <div className="sticky top-6">
              <Card className="bg-white border-b border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Start Investing</h3>
                  <p className="text-sm text-green-600 mb-4">
                    SIP from ₹{fund.sipMinInvestment}/month
                  </p>
                  <a
                    href={fund.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-white text-green-600 hover:bg-gray-100 font-semibold py-6 mb-3">
                      Invest Now <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <p className="text-xs text-green-600 text-center">
                    Zero commission • Instant investment
                  </p>
                </CardContent>
              </Card>

              {/* Suitable For */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-6 md:p-8">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    Suitable For
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {fund.suitableFor.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Tax Benefits */}
              {fund.taxBenefits && (
                <Card className="bg-blue-100 border-blue-600">
                  <CardHeader>
                    <CardTitle className="text-base text-blue-600">
                      Tax Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-600">{fund.taxBenefits}</p>
                  </CardContent>
                </Card>
              )}

              {/* Risk Warning & Full Compliance Disclosure */}
              <ComplianceDisclaimer
                variant="compact"
                className="bg-amber-50 border-amber-200 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Returns vs Benchmark */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" /> Returns vs
              Benchmark ({fund.benchmarkName})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">
                      Period
                    </th>
                    <th className="text-right py-3 px-4 text-gray-500 font-medium">
                      {fund.name}
                    </th>
                    <th className="text-right py-3 px-4 text-gray-500 font-medium">
                      {fund.benchmarkName}
                    </th>
                    <th className="text-right py-3 px-4 text-gray-500 font-medium">
                      Difference
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(["1Y", "3Y", "5Y"] as const).map((period) => {
                    const fundReturn = fund.returns[period];
                    const benchReturn = fund.benchmarkReturns[period];
                    const diff = fundReturn - benchReturn;
                    return (
                      <tr key={period} className="border-b border-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {period}
                        </td>
                        <td
                          className={`py-3 px-4 text-right font-bold tabular-nums ${fundReturn >= 0 ? "text-green-600" : "text-red-500"}`}
                        >
                          {fundReturn}%
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600 tabular-nums">
                          {benchReturn}%
                        </td>
                        <td
                          className={`py-3 px-4 text-right font-semibold tabular-nums ${diff >= 0 ? "text-green-600" : "text-red-500"}`}
                        >
                          {diff >= 0 ? "+" : ""}
                          {diff.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive SIP Calculator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <SIPCalculatorWidget
          fundName={fund.name}
          returns3Y={fund.returns["3Y"]}
          returns5Y={fund.returns["5Y"] || 0}
          minSIP={fund.sipMinInvestment}
          historicalSIPReturns={(fund as any).__sipReturns}
        />
      </div>

      {/* Risk Explainer — Plain English */}
      {(fund as any).__riskMetrics?.max_drawdown > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Risk in Plain English
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const rm = (fund as any).__riskMetrics || {};
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Worst Drop: {rm.max_drawdown}%
                          </p>
                          <p className="text-xs text-gray-500">
                            {rm.max_drawdown_date
                              ? `Occurred on ${rm.max_drawdown_date}`
                              : "Historical maximum drawdown"}
                          </p>
                        </div>
                      </div>
                      {rm.recovery_days && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              Recovery: {Math.round(rm.recovery_days / 30)}{" "}
                              months
                            </p>
                            <p className="text-xs text-gray-500">
                              Time to recover from the worst drop
                            </p>
                          </div>
                        </div>
                      )}
                      {rm.negative_years > 0 && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <BarChart3 className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              Negative Years: {rm.negative_years} out of{" "}
                              {rm.total_years}
                            </p>
                            <p className="text-xs text-gray-500">
                              Number of calendar years with negative returns
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      {rm.best_1y_return > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs text-gray-500 mb-2">
                            Rolling 1-Year Return Range
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-red-500">
                              Worst: {rm.worst_1y_return}%
                            </span>
                            <span className="text-sm font-semibold text-green-600">
                              Best: {rm.best_1y_return}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-gradient-to-r from-red-400 via-amber-400 to-green-500 h-2 rounded-full"
                              style={{ width: "100%" }}
                            />
                          </div>
                        </div>
                      )}
                      {rm.volatility_1y && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Annualized Volatility
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {rm.volatility_1y}%
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {rm.volatility_1y < 10
                              ? "Low volatility — relatively stable"
                              : rm.volatility_1y < 20
                                ? "Moderate volatility — expect fluctuations"
                                : "High volatility — significant price swings"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* How to Invest */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Card>
          <CardHeader>
            <CardTitle>How to Invest in {fund.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                {
                  step: "1",
                  title: "Complete KYC",
                  desc: "PAN + Aadhaar verification (one-time, 2 min)",
                },
                {
                  step: "2",
                  title: "Choose Plan",
                  desc: "Direct plan recommended (lower expense ratio)",
                },
                {
                  step: "3",
                  title: "Set SIP Amount",
                  desc: `Minimum ₹${fund.sipMinInvestment}/month`,
                },
                {
                  step: "4",
                  title: "Start Investing",
                  desc: "Auto-debit from bank account every month",
                },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-2">
                    {s.step}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {s.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compare Similar Funds */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <CompareSimilarFunds
          currentFund={{
            name: fund.name,
            slug: slug,
            returns1Y: fund.returns["1Y"],
            returns3Y: fund.returns["3Y"],
          }}
          similarFunds={(fund as any).__similarFunds || []}
        />
      </div>

      {/* FAQ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {[
            {
              q: `Is ${fund.name} a good investment?`,
              a: `${fund.name} has delivered ${fund.returns["3Y"]}% returns over 3 years with a ${fund.riskLevel} risk profile. It's rated ${fund.rating}/5. Whether it's good for you depends on your investment horizon (we recommend 5+ years for equity funds) and risk tolerance.`,
            },
            {
              q: `What is the minimum SIP amount for ${fund.name}?`,
              a: `The minimum SIP amount is ₹${fund.sipMinInvestment}/month. For lumpsum investment, the minimum is ₹${fund.minInvestment.toLocaleString()}.`,
            },
            {
              q: `What is the expense ratio of ${fund.name}?`,
              a: `The expense ratio is ${fund.expenseRatio}%. This is the annual fee charged by ${fund.amc} for managing the fund. We recommend comparing with similar funds in the ${fund.category} category.`,
            },
            {
              q: "Should I choose Direct or Regular plan?",
              a: "Direct plans have 0.5-1% lower expense ratios (no distributor commission). Over 10+ years, this difference compounds to lakhs. We always recommend Direct plans for informed investors.",
            },
            {
              q: `Can I withdraw from ${fund.name} anytime?`,
              a: `Yes, you can redeem your investment anytime. Exit load: ${fund.exitLoad}. Redemption amount is typically credited within 1-3 business days.`,
            },
            {
              q: "How are returns taxed?",
              a:
                fund.taxBenefits ||
                "Equity funds: LTCG above ₹1.25L taxed at 12.5% (held >1yr). Short-term (<1yr): 20%. Debt funds: taxed at slab rate.",
            },
          ].map((f, i) => (
            <details
              key={i}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors list-none">
                {f.q}
                <span className="text-gray-400 transition-transform group-open:rotate-90 flex-shrink-0 ml-4">
                  ›
                </span>
              </summary>
              <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Your Investment Journey with {fund.name}
          </h2>
          <p className="text-green-600 mb-8">
            Build wealth systematically through SIP or invest lumpsum
          </p>
          <a href={fund.applyLink} target="_blank" rel="noopener noreferrer">
            <Button className="bg-green-600 hover:bg-green-600 text-white font-semibold px-12 py-6 text-lg">
              Invest Now <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
