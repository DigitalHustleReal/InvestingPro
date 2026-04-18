import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  TrendingUp,
  BarChart3,
  PiggyBank,
  Layers,
  ArrowRight,
} from "lucide-react";
import MutualFundsClient from "./MutualFundsClient";
import { getMutualFundsServer } from "@/lib/products/get-mutual-funds-server";
import ContextualTicker from "@/components/common/ContextualTicker";
import { AdvertiserDisclosure } from "@/components/common/AdvertiserDisclosure";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Best Mutual Funds in India (2026) — Compare & Invest",
  description:
    "Compare mutual funds across equity, debt, hybrid, and index categories. Track NAV, returns, expense ratios. Independent ratings — no paid placements.",
  openGraph: {
    title: "Best Mutual Funds in India (2026)",
    description:
      "Compare mutual funds across all categories. Independent research.",
    url: "https://investingpro.in/mutual-funds",
  },
};

export default async function MutualFundsPage() {
  let initialFunds: any[] = [];
  try {
    initialFunds = await getMutualFundsServer();
  } catch {
    initialFunds = [];
  }
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Best Mutual Funds in India 2026",
      description:
        "Compare mutual funds across equity, debt, hybrid, and index categories. Track NAV, returns, expense ratios. Independent ratings — no paid placements.",
      url: "https://investingpro.in/mutual-funds",
      publisher: {
        "@type": "Organization",
        name: "InvestingPro",
        url: "https://investingpro.in",
        logo: {
          "@type": "ImageObject",
          url: "https://investingpro.in/logo.png",
        },
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://investingpro.in",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Mutual Funds",
            item: "https://investingpro.in/mutual-funds",
          },
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the best mutual fund to invest in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "For long-term wealth, Nifty 50 index funds have averaged 12% returns. For tax saving, ELSS funds offer 80C deduction up to ₹1.5L.",
          },
        },
        {
          "@type": "Question",
          name: "Is SIP better than lump sum?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SIP reduces timing risk through rupee cost averaging. Lump sum works better in rising markets. For most investors, SIP is recommended.",
          },
        },
        {
          "@type": "Question",
          name: "How are mutual funds taxed in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Equity: LTCG above ₹1.25L taxed at 12.5% (held >1yr). Debt: taxed at slab rate. ELSS qualifies for 80C.",
          },
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <ContextualTicker category="mutual-funds" />

      {/* ── Hero ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-8">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-1.5 text-sm text-gray-500">
              <li>
                <Link
                  href="/"
                  className="hover:text-gray-900 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight size={14} />
              </li>
              <li className="text-gray-900 font-medium">Mutual Funds</li>
            </ol>
          </nav>
          <AdvertiserDisclosure variant="expandable" className="mb-3" />

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                Best Mutual Funds in India
              </h1>
              <p className="text-base text-gray-500 mt-3 max-w-xl leading-relaxed">
                Compare mutual funds by returns, expense ratio, and risk grade.
                Ranked by real performance — not what pays us most.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 mt-1">
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                40+ AMCs
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                NAV daily
              </span>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              "All Funds",
              "Equity",
              "Debt",
              "Hybrid",
              "Index",
              "ELSS",
              "Large Cap",
              "Mid Cap",
              "Small Cap",
              "Flexi Cap",
            ].map((p, i) => (
              <Link
                key={p}
                href={
                  i === 0
                    ? "/mutual-funds"
                    : `/mutual-funds?type=${p.toLowerCase().replace(" ", "-")}`
                }
                className={`inline-flex items-center px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded-full ${i === 0 ? "bg-green-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"}`}
              >
                {p}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category highlights ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                icon: TrendingUp,
                label: "Equity Funds",
                sub: "Higher returns, higher risk",
                href: "/mutual-funds?type=equity",
                color: "text-green-700 bg-green-50",
              },
              {
                icon: PiggyBank,
                label: "Debt Funds",
                sub: "Stable returns, lower risk",
                href: "/mutual-funds?type=debt",
                color: "text-green-700 bg-green-50",
              },
              {
                icon: Layers,
                label: "Hybrid Funds",
                sub: "Mix of equity + debt",
                href: "/mutual-funds?type=hybrid",
                color: "text-amber-600 bg-amber-50",
              },
              {
                icon: BarChart3,
                label: "Index Funds",
                sub: "Low cost, market returns",
                href: "/mutual-funds?type=index",
                color: "text-amber-600 bg-amber-50",
              },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="flex items-center gap-3 p-3.5 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group"
                >
                  <div
                    className={`w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-lg ${cat.color}`}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                      {cat.label}
                    </p>
                    <p className="text-xs text-gray-500">{cat.sub}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <MutualFundsClient initialFunds={initialFunds} />
        </div>
      </section>

      {/* ── Portfolio Overlap Checker ── */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center gap-6 p-6 border border-gray-200 rounded-xl bg-gray-50">
            <div className="flex-1">
              <span className="text-xs text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full font-medium mb-2 inline-block">
                Free Tool
              </span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Mutual Fund Overlap Checker
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                Holding 3+ funds? Check if they invest in the same stocks. Avoid
                paying multiple expense ratios for the same exposure.
              </p>
            </div>
            <Link
              href="/mutual-funds/overlap-checker"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors flex-shrink-0"
            >
              Check Overlap
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Related Tools ── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Related Tools
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              {
                label: "SIP Calculator",
                desc: "See how ₹10K/month grows",
                href: "/calculators/sip",
              },
              {
                label: "Compare Funds",
                desc: "Side-by-side comparison",
                href: "/mutual-funds/compare",
              },
              {
                label: "Goal Planner",
                desc: "SIP needed for your goal",
                href: "/mutual-funds/goal-planner",
              },
              {
                label: "Find Your Fund",
                desc: "Personalized pick",
                href: "/mutual-funds/find-your-fund",
              },
              {
                label: "Overlap Checker",
                desc: "Portfolio duplication",
                href: "/mutual-funds/overlap-checker",
              },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group"
              >
                <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                  {t.label}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {t.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular comparisons ── */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Popular Comparisons
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Index Funds vs Active Funds",
                desc: "10 years of data — when does active actually win?",
                href: "/mutual-funds/compare/index-vs-active",
              },
              {
                title: "ELSS vs PPF vs NPS",
                desc: "Best tax-saving investment under 80C",
                href: "/mutual-funds/compare/elss-vs-ppf-vs-nps",
              },
              {
                title: "Large Cap vs Flexi Cap",
                desc: "Stability vs growth — which to choose?",
                href: "/mutual-funds/compare/large-cap-vs-flexi-cap",
              },
              {
                title: "Direct vs Regular Plans",
                desc: "How much do distributor fees actually cost you?",
                href: "/mutual-funds/compare/direct-vs-regular",
              },
              {
                title: "SIP vs Lump Sum",
                desc: "Timing the market vs time in the market",
                href: "/mutual-funds/compare/sip-vs-lumpsum",
              },
              {
                title: "Debt Funds vs FDs",
                desc: "After-tax returns compared across tenures",
                href: "/mutual-funds/compare/debt-vs-fd",
              },
            ].map((comp) => (
              <Link
                key={comp.href}
                href={comp.href}
                className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group"
              >
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 mt-0.5 flex-shrink-0 rounded">
                  VS
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                    {comp.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {comp.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How We Rate ── */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            How We Rate
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                num: "40+",
                label: "AMCs tracked",
                desc: "Across equity, debt, hybrid, and thematic categories",
              },
              {
                num: "5",
                label: "Return periods",
                desc: "1yr, 3yr, 5yr, 7yr, and 10yr returns compared",
              },
              {
                num: "Daily",
                label: "NAV updates",
                desc: "Net Asset Value refreshed every market day",
              },
              {
                num: "₹0",
                label: "Paid placements",
                desc: "No AMC pays for higher ranking. Editorial is independent.",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 bg-gray-50 border border-gray-200 rounded-xl"
              >
                <p className="text-2xl font-bold text-gray-900">{stat.num}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {stat.label}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
            We evaluate funds on returns (1-10yr), expense ratio, Sharpe ratio,
            fund manager consistency, AUM stability, and category rank. When you
            invest through our links, we may earn a commission. This never
            influences ratings.{" "}
            <Link
              href="/methodology"
              className="text-green-700 hover:underline font-medium"
            >
              Methodology disclosed →
            </Link>{" "}
            ·{" "}
            <Link
              href="/how-we-make-money"
              className="text-green-700 hover:underline font-medium"
            >
              How we make money →
            </Link>
          </p>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "What is the best mutual fund to invest in India?",
                a: "It depends on your goals and risk tolerance. For long-term wealth creation, index funds tracking Nifty 50 have averaged 12% annual returns. For tax saving, ELSS funds offer Section 80C deduction up to ₹1.5L. For stability, debt funds or hybrid funds are better.",
              },
              {
                q: "Is SIP better than lump sum investment?",
                a: "SIP reduces timing risk through rupee cost averaging — you buy more units when prices are low. Lump sum works better in consistently rising markets. For most investors, monthly SIP is the recommended approach as it builds discipline.",
              },
              {
                q: "How are mutual funds taxed in India?",
                a: "Equity funds held >1 year: LTCG above ₹1.25L taxed at 12.5%. Short-term (<1yr): 20%. Debt funds: taxed at your income tax slab rate regardless of holding period. ELSS qualifies for 80C deduction up to ₹1.5L with a 3-year lock-in.",
              },
              {
                q: "What is expense ratio and why does it matter?",
                a: "Expense ratio is the annual fee charged by the fund house for managing your money. A 1% vs 0.1% difference means lakhs over 20 years. Index funds typically have the lowest ratios (0.1-0.5%). Always compare expense ratios within the same category.",
              },
              {
                q: "How do I choose between direct and regular plans?",
                a: "Direct plans have 0.5-1% lower expense ratios (no distributor commission) and deliver higher returns over time. Regular plans include distributor fees. The fund itself is identical — only the fee structure differs. We always recommend direct plans.",
              },
              {
                q: 'What does "risk grade" mean for mutual funds?',
                a: "SEBI mandates risk labels: Low, Low to Moderate, Moderate, Moderately High, High, Very High. This is based on the fund's portfolio volatility. Equity funds are typically High/Very High. Debt funds range from Low to Moderate. Match your risk grade to your investment horizon.",
              },
              {
                q: "How does InvestingPro rate mutual funds?",
                a: "We evaluate funds on returns across 5 time periods (1yr to 10yr), expense ratio, risk-adjusted performance (Sharpe ratio), fund manager track record, and AUM stability. Ratings update daily with NAV changes. No AMC pays for higher placement.",
              },
            ].map((f, i) => (
              <details
                key={i}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors list-none">
                  {f.q}
                  <ChevronRight
                    size={16}
                    className="text-gray-400 transition-transform group-open:rotate-90 flex-shrink-0 ml-4"
                  />
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Next steps ── */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Not sure where to start?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/calculators/sip"
              className="p-5 bg-green-700 hover:bg-green-800 transition-colors text-center rounded-xl"
            >
              <p className="text-sm font-semibold text-white">
                Try the SIP Calculator
              </p>
              <p className="text-xs text-white/70 mt-1">
                See how ₹10K/month grows
              </p>
            </Link>
            <Link
              href="/mutual-funds/compare"
              className="p-5 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-center"
            >
              <p className="text-sm font-semibold text-gray-900">
                Compare Funds Side-by-Side
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Pick 2-3 funds and see the difference
              </p>
            </Link>
            <Link
              href="/mutual-funds/find-your-fund"
              className="p-5 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-center"
            >
              <p className="text-sm font-semibold text-gray-900">
                Find Your Fund
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Personalized recommendation quiz
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
