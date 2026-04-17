import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Shield,
  TrendingUp,
  PiggyBank,
  Building2,
  BarChart3,
  Landmark,
  ArrowRight,
  Calculator,
} from "lucide-react";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Investing — Mutual Funds, PPF, NPS, Stocks",
  description:
    "Compare mutual funds, PPF, NPS, ELSS, and stocks. Independent research, free calculators, zero commission. Build wealth with data, not guesswork.",
  openGraph: {
    title: "Investing — InvestingPro",
    url: "https://investingpro.in/investing",
  },
};

const INVEST_CATEGORIES = [
  {
    label: "Mutual Funds",
    desc: "Compare funds by returns, risk, and expense ratio",
    href: "/mutual-funds",
    icon: TrendingUp,
    color: "text-blue-600 bg-blue-50",
    stat: "All categories",
    badge: "Popular",
  },
  {
    label: "PPF & NPS",
    desc: "Government-backed savings for tax saving and retirement",
    href: "/ppf-nps",
    icon: Building2,
    color: "text-green-600 bg-green-50",
    stat: "7 schemes",
  },
  {
    label: "ELSS Funds",
    desc: "Tax-saving mutual funds with 3-year lock-in under 80C",
    href: "/mutual-funds?type=elss",
    icon: Shield,
    color: "text-purple-600 bg-purple-50",
    stat: "80C deduction",
  },
  {
    label: "Index Funds",
    desc: "Low-cost funds tracking Nifty 50, Sensex, and more",
    href: "/mutual-funds?type=index",
    icon: BarChart3,
    color: "text-amber-600 bg-amber-50",
    stat: "0.1-0.5% expense",
  },
  {
    label: "Stocks & IPOs",
    desc: "Research stocks, track IPOs, compare brokers",
    href: "/stocks",
    icon: Landmark,
    color: "text-red-600 bg-red-50",
    stat: "Live data",
  },
  {
    label: "Gold Investments",
    desc: "Gold ETFs, Sovereign Gold Bonds, and digital gold",
    href: "/investing?type=gold",
    icon: PiggyBank,
    color: "text-amber-600 bg-amber-50",
    stat: "Hedge inflation",
  },
];

const TOOLS = [
  {
    label: "SIP Calculator",
    desc: "Monthly SIP growth projection",
    href: "/calculators/sip",
  },
  {
    label: "PPF Calculator",
    desc: "15-year maturity projection",
    href: "/calculators/ppf",
  },
  {
    label: "NPS Calculator",
    desc: "Retirement corpus estimate",
    href: "/calculators/nps",
  },
  {
    label: "Retirement Planner",
    desc: "How much you need to retire",
    href: "/calculators/retirement",
  },
  {
    label: "Goal Planning",
    desc: "SIP needed for your goal",
    href: "/calculators/goal-planning",
  },
  {
    label: "Overlap Checker",
    desc: "Check MF portfolio duplication",
    href: "/mutual-funds/overlap-checker",
  },
];

export default function InvestingPage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Investing in India 2026",
      url: "https://investingpro.in/investing",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How should a beginner start investing in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Start with a monthly SIP of ₹500-5000 in a Nifty 50 index fund. Complete KYC, choose a direct plan, and stay invested for 5+ years. Add PPF for guaranteed tax-free returns.",
          },
        },
        {
          "@type": "Question",
          name: "What is the best investment for tax saving?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ELSS mutual funds offer the highest potential returns with only 3-year lock-in under Section 80C. PPF gives guaranteed 7.1% with 15-year lock-in. NPS gives additional ₹50K deduction under 80CCD(1B).",
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

      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-8">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-1.5 text-[13px] text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-green-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight size={12} />
              </li>
              <li className="text-gray-700 font-medium">Investing</li>
            </ol>
          </nav>
          <h1 className="text-2xl md:text-[32px] font-bold text-[--v2-ink] tracking-tight leading-tight">
            Investing in India
          </h1>
          <p className="text-[15px] text-gray-500 mt-2 max-w-xl leading-relaxed">
            Compare mutual funds, government schemes, and stocks. Build wealth
            with independent research and free tools — no commission, no bias.
          </p>
        </div>
      </section>

      {/* Investment categories */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-[--v2-ink] mb-5">
            Explore Investment Options
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INVEST_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-sm transition-all group"
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.color}`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                        {cat.label}
                      </p>
                      {cat.badge && (
                        <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded uppercase">
                          {cat.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {cat.desc}
                    </p>
                    <p className="text-xs font-semibold text-green-600 mt-1.5">
                      {cat.stat}
                    </p>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-gray-300 group-hover:text-green-500 transition-colors mt-1 flex-shrink-0"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Investing tools */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-[--v2-ink] mb-5">
            Free Investing Tools
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-sm transition-all group text-center"
              >
                <Calculator size={18} className="text-green-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                  {tool.label}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Beginner's guide */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-[--v2-ink] mb-5">
            How to Start Investing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            {[
              {
                step: "1",
                title: "Set a Goal",
                desc: "Retirement? Home? Education? Your goal decides your strategy.",
              },
              {
                step: "2",
                title: "Assess Risk",
                desc: "Long horizon (10yr+) → equity. Short (1-3yr) → debt/FD.",
              },
              {
                step: "3",
                title: "Start SIP",
                desc: "Even ₹500/month in an index fund. Consistency beats timing.",
              },
              {
                step: "4",
                title: "Review Yearly",
                desc: "Rebalance if any asset drifts 10%+ from target allocation.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white rounded-xl border border-gray-200 p-5 text-center"
              >
                <div className="w-8 h-8 rounded-full bg-green-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">
                  {s.step}
                </div>
                <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-[--v2-ink] mb-5">
            Investing FAQs
          </h2>
          <div className="space-y-2">
            {[
              {
                q: "How should a beginner start investing in India?",
                a: "Start with a monthly SIP of ₹500-5000 in a Nifty 50 index fund. Complete KYC (PAN + Aadhaar), choose a direct plan (lower fees), and stay invested for 5+ years. Add PPF for guaranteed tax-free returns.",
              },
              {
                q: "What is the best investment for tax saving?",
                a: "ELSS mutual funds: highest potential returns, 3-year lock-in, 80C deduction up to ₹1.5L. PPF: guaranteed 7.1%, 15-year lock-in, fully tax-free (EEE). NPS: additional ₹50K under 80CCD(1B), market-linked returns.",
              },
              {
                q: "How much should I invest monthly?",
                a: "Common rule: 20% of post-tax income. But start with whatever you can — even ₹500/month. Increase by 10% annually (step-up SIP). The key is consistency, not amount.",
              },
              {
                q: "Is investing in stocks risky?",
                a: "Individual stocks can be volatile. Index funds reduce this through diversification. Over 10+ years, diversified equity has historically returned 12-15% CAGR, beating inflation by 6-8%.",
              },
              {
                q: "What is asset allocation?",
                a: "Dividing your money across asset classes — equity (stocks/MFs), debt (FDs/bonds), and gold. Rule of thumb: 100 minus your age = equity %. A 30-year-old might hold 70% equity, 25% debt, 5% gold.",
              },
              {
                q: "SIP vs lump sum — which is better?",
                a: "SIP reduces timing risk (rupee cost averaging). Lump sum works better in rising markets. For most investors, monthly SIP is recommended — it builds discipline and averages out volatility.",
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
    </>
  );
}
