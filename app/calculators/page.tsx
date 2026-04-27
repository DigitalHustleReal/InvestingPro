import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Shield,
  CalendarDays,
  TrendingUp,
  Home,
  Receipt,
  PiggyBank,
  Calculator,
  Target,
  BarChart3,
  Percent,
  Clock,
  Baby,
  Landmark,
  Armchair,
  Wallet,
  Activity,
  Coins,
  ArrowRight,
} from "lucide-react";

export const revalidate = 86400; // ISR: daily

export const metadata: Metadata = {
  title:
    "Free Financial Calculators India (2026) — SIP, EMI, Tax, FD, PPF | InvestingPro",
  description:
    "72 free financial calculators with inflation adjustment. SIP, EMI, FD, PPF, NPS, tax, retirement, and goal planning. No registration. Accurate results.",
  openGraph: {
    title: "Free Financial Calculators India (2026)",
    description: "72 free calculators for smart financial planning.",
    url: "https://investingpro.in/calculators",
  },
};

const CATEGORIES = [
  {
    title: "Investment",
    desc: "Plan your wealth creation",
    calcs: [
      {
        name: "SIP Calculator",
        desc: "Monthly SIP growth with inflation",
        href: "/calculators/sip",
        icon: TrendingUp,
        badge: "Popular",
      },
      {
        name: "Lumpsum Calculator",
        desc: "One-time investment returns",
        href: "/calculators/lumpsum",
        icon: Coins,
      },
      {
        name: "SWP Calculator",
        desc: "Systematic withdrawal plan",
        href: "/calculators/swp",
        icon: Activity,
      },
      {
        name: "Goal Planner",
        desc: "Invest by financial goal",
        href: "/calculators/goal-planning",
        icon: Target,
      },
      {
        name: "Inflation Returns",
        desc: "Real vs nominal returns",
        href: "/calculators/inflation-adjusted-returns",
        icon: Percent,
      },
      {
        name: "Portfolio Rebalancer",
        desc: "Optimal asset allocation",
        href: "/calculators/portfolio-rebalancing",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Loans & EMI",
    desc: "Calculate payments and savings",
    calcs: [
      {
        name: "EMI Calculator",
        desc: "Loan EMI with prepayment impact",
        href: "/calculators/emi",
        icon: Home,
        badge: "Popular",
      },
      {
        name: "Home Loan vs SIP",
        desc: "Prepay or invest?",
        href: "/calculators/home-loan-vs-sip",
        icon: TrendingUp,
      },
      {
        name: "Simple Interest",
        desc: "Basic interest calculation",
        href: "/calculators/simple-interest",
        icon: Calculator,
      },
      {
        name: "Compound Interest",
        desc: "Power of compounding",
        href: "/calculators/compound-interest",
        icon: Coins,
      },
    ],
  },
  {
    title: "Tax & Savings",
    desc: "Save tax, grow wealth",
    calcs: [
      {
        name: "Tax Calculator",
        desc: "Old vs New regime (Budget 2026)",
        href: "/calculators/tax",
        icon: Receipt,
        badge: "Popular",
      },
      {
        name: "GST Calculator",
        desc: "GST for goods and services",
        href: "/calculators/gst",
        icon: Percent,
      },
      {
        name: "FD Calculator",
        desc: "Fixed deposit maturity",
        href: "/calculators/fd",
        icon: PiggyBank,
      },
      {
        name: "RD Calculator",
        desc: "Recurring deposit returns",
        href: "/calculators/rd",
        icon: Clock,
      },
    ],
  },
  {
    title: "Government Schemes",
    desc: "Sovereign savings calculators",
    calcs: [
      {
        name: "PPF Calculator",
        desc: "15-year PPF maturity",
        href: "/calculators/ppf",
        icon: Landmark,
      },
      {
        name: "NPS Calculator",
        desc: "Retirement corpus + pension",
        href: "/calculators/nps",
        icon: Armchair,
      },
      {
        name: "SSY Calculator",
        desc: "Sukanya Samriddhi returns",
        href: "/calculators/ssy",
        icon: Baby,
      },
      {
        name: "SCSS Calculator",
        desc: "Senior citizen savings",
        href: "/calculators/scss",
        icon: Wallet,
      },
      {
        name: "KVP Calculator",
        desc: "Kisan Vikas Patra doubling",
        href: "/calculators/kvp",
        icon: Coins,
      },
      {
        name: "NSC Calculator",
        desc: "National Savings Certificate",
        href: "/calculators/nsc",
        icon: Landmark,
      },
      {
        name: "MIS Calculator",
        desc: "Monthly income scheme",
        href: "/calculators/mis",
        icon: Activity,
      },
    ],
  },
  {
    title: "Planning",
    desc: "Long-term financial planning",
    calcs: [
      {
        name: "Retirement Planner",
        desc: "How much you need to retire",
        href: "/calculators/retirement",
        icon: Armchair,
        badge: "Popular",
      },
      {
        name: "Financial Health Score",
        desc: "Rate your financial fitness",
        href: "/calculators/financial-health-score",
        icon: Activity,
      },
    ],
  },
];

export default function CalculatorsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Financial Calculators India",
    description:
      "72 free financial calculators for Indian investors and taxpayers.",
    url: "https://investingpro.in/calculators",
    numberOfItems: 72,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 pt-6 pb-8">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-1.5 text-[13px] text-ink-60 dark:text-ink-60">
              <li>
                <Link
                  href="/"
                  className="hover:text-action-green transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight size={12} />
              </li>
              <li className="text-gray-700 font-medium">Calculators</li>
            </ol>
          </nav>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-display font-bold text-ink tracking-tight leading-tight">
                Free Financial Calculators
              </h1>
              <p className="text-base text-ink-60 mt-2 max-w-xl leading-relaxed">
                72 calculators with inflation adjustment, tax impact, and
                shareable results. No sign-up. Run the numbers before you
                commit.
              </p>
            </div>
            <div className="flex items-center gap-5 text-[12px] text-ink-60 flex-shrink-0 mt-1">
              <span className="flex items-center gap-1.5">
                <Shield size={13} className="text-action-green" />
                100% free
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={13} className="text-action-green" />
                Updated for 2026
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator grid by category */}
      <section className="bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
          <div className="space-y-10">
            {CATEGORIES.map((cat) => (
              <div key={cat.title}>
                <div className="mb-4">
                  <h2 className="text-lg font-display font-bold text-ink">
                    {cat.title}
                  </h2>
                  <p className="text-sm text-ink-60">{cat.desc}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cat.calcs.map((calc) => {
                    const Icon = calc.icon;
                    return (
                      <Link
                        key={calc.href}
                        href={calc.href}
                        className="flex items-start gap-3.5 p-4 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-sm transition-all group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                          <Icon size={18} className="text-action-green" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-display font-semibold text-ink group-hover:text-authority-green transition-colors">
                              {calc.name}
                            </p>
                            {calc.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide bg-green-50 text-action-green">
                                {calc.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-ink-60 mt-0.5 leading-relaxed">
                            {calc.desc}
                          </p>
                        </div>
                        <ArrowRight
                          size={14}
                          className="text-gray-300 group-hover:text-action-green transition-colors mt-1 flex-shrink-0"
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-display font-bold text-ink mb-4">
            About Our Calculators
          </h2>
          <p className="text-sm text-ink-60 leading-relaxed max-w-2xl">
            Every calculator on InvestingPro accounts for inflation, taxes, and
            real-world scenarios. Results are shareable and printable. The math
            formulas are transparent — you can see exactly how we calculate
            every number. Built for Indian investors, updated for Budget 2026.
          </p>
          <p className="text-sm text-ink-60 leading-relaxed max-w-2xl mt-3">
            These tools are for educational purposes only and do not constitute
            financial advice. See our{" "}
            <Link
              href="/disclaimer"
              className="text-action-green font-medium hover:text-authority-green"
            >
              disclaimer
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
