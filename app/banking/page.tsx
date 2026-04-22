import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Shield,
  CalendarDays,
  Building2,
  PiggyBank,
  Landmark,
  Wallet,
  ArrowRight,
} from "lucide-react";
import SavingsAccountsClient from "./SavingsAccountsClient";
import { getSavingsAccountsServer } from "@/lib/products/get-savings-accounts-server";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Banking — Compare Savings Accounts, FDs & RDs",
  description:
    "Compare savings account interest rates, fixed deposit rates, and recurring deposits from 50+ banks. Find the best rates for regular and senior citizens.",
  openGraph: {
    title: "Banking — InvestingPro",
    url: "https://investingpro.in/banking",
  },
};

const BANKING_PRODUCTS = [
  {
    label: "Savings Accounts",
    desc: "Compare interest rates, min balance, and features",
    href: "/banking?type=savings",
    icon: Wallet,
    rate: "Up to 7% p.a.",
    badge: "Popular",
  },
  {
    label: "Fixed Deposits",
    desc: "Best FD rates from banks and NBFCs",
    href: "/fixed-deposits",
    icon: PiggyBank,
    rate: "Up to 8.35%",
    badge: "Popular",
  },
  {
    label: "Recurring Deposits",
    desc: "Monthly savings with guaranteed returns",
    href: "/banking?type=rd",
    icon: Building2,
    rate: "Up to 7.5%",
  },
  {
    label: "Current Accounts",
    desc: "Business banking accounts compared",
    href: "/banking?type=current",
    icon: Landmark,
    rate: "Zero balance options",
  },
  {
    label: "Senior Citizen FDs",
    desc: "Extra 0.5% rates for 60+ age",
    href: "/fixed-deposits?filter=senior",
    icon: PiggyBank,
    rate: "+0.50% bonus",
  },
  {
    label: "Tax-Saving FDs",
    desc: "5-year FD with Section 80C benefit",
    href: "/fixed-deposits?filter=tax-saving",
    icon: Shield,
    rate: "80C deduction",
  },
];

export default async function BankingPage() {
  let initialAccounts: any[] = [];
  try {
    initialAccounts = await getSavingsAccountsServer();
  } catch {
    initialAccounts = [];
  }
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Banking Products India 2026",
      url: "https://investingpro.in/banking",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Which bank gives the highest savings account interest rate?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Small finance banks like AU SFB (7%) and Equitas SFB (7%) offer the highest rates. Among large banks, Kotak offers up to 6%.",
          },
        },
        {
          "@type": "Question",
          name: "Are FDs safe in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Bank FDs up to ₹5L per depositor per bank are insured by DICGC (RBI subsidiary). Corporate FDs are not covered.",
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
              <li className="text-gray-700 font-medium">Banking</li>
            </ol>
          </nav>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-display font-bold text-ink tracking-tight leading-tight">
                Banking Products
              </h1>
              <p className="text-base text-ink-60 mt-2 max-w-xl leading-relaxed">
                Compare savings accounts, fixed deposits, and recurring
                deposits. Find the best rates from 50+ banks. Independent
                ratings — DICGC insured.
              </p>
            </div>
            <div className="flex items-center gap-5 text-[12px] text-ink-60 flex-shrink-0 mt-1">
              <span className="flex items-center gap-1.5">
                <Shield size={13} className="text-action-green" />
                DICGC insured
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={13} className="text-action-green" />
                Rates updated daily
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Product categories grid */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {BANKING_PRODUCTS.map((product) => {
              const Icon = product.icon;
              return (
                <Link
                  key={product.label}
                  href={product.href}
                  className="flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-sm transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Icon size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-display font-semibold text-ink group-hover:text-authority-green transition-colors">
                        {product.label}
                      </p>
                      {product.badge && (
                        <span className="text-[9px] font-bold text-action-green bg-green-50 px-1.5 py-0.5 rounded uppercase">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-60 mt-0.5 leading-relaxed">
                      {product.desc}
                    </p>
                    <p className="text-xs font-semibold text-action-green mt-1.5">
                      {product.rate}
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
      </section>

      {/* Savings Accounts listing */}
      {initialAccounts.length > 0 && (
        <section className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
            <h2 className="text-lg font-display font-bold text-ink mb-5">
              Compare Savings Account Rates
            </h2>
            <SavingsAccountsClient initialAccounts={initialAccounts} />
          </div>
        </section>
      )}

      {/* Related tools */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-display font-bold text-ink mb-5">
            Banking Tools
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "FD Calculator",
                desc: "Calculate maturity amount",
                href: "/calculators/fd",
              },
              {
                label: "RD Calculator",
                desc: "Recurring deposit returns",
                href: "/calculators/rd",
              },
              {
                label: "Compare FD Rates",
                desc: "Side-by-side comparison",
                href: "/fixed-deposits/compare",
              },
              {
                label: "Compound Interest",
                desc: "Power of compounding",
                href: "/calculators/compound-interest",
              },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-sm transition-all group"
              >
                <p className="text-sm font-display font-semibold text-ink group-hover:text-authority-green transition-colors">
                  {t.label}
                </p>
                <p className="text-xs text-ink-60 mt-1 leading-relaxed">
                  {t.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-display font-bold text-ink mb-5">Banking FAQs</h2>
          <div className="space-y-2">
            {[
              {
                q: "Which bank gives the highest savings account interest rate?",
                a: "Small finance banks like AU SFB (7%) and Equitas SFB (7%) offer the highest savings account rates. Among large banks, Kotak (6%) and IndusInd (6%) lead. Check minimum balance requirements before opening.",
              },
              {
                q: "Is my money safe in a bank FD?",
                a: "Bank FDs up to ₹5L per depositor per bank are insured by DICGC (an RBI subsidiary). This covers both principal and interest. Corporate FDs from NBFCs are NOT covered by DICGC.",
              },
              {
                q: "What is the difference between FD and RD?",
                a: "FD: one-time lump sum deposit for a fixed tenure. RD: fixed monthly deposit for a tenure. FD gives slightly higher effective returns due to compounding on the full amount from day one.",
              },
              {
                q: "Can I open a savings account online?",
                a: "Yes. Most banks offer video KYC-based online account opening. You need PAN + Aadhaar. Account is typically active within 24-48 hours.",
              },
              {
                q: "What is sweep-in FD?",
                a: "Sweep-in FD automatically transfers excess savings above a threshold into FDs, earning higher interest. When you need money, it auto-breaks the FD. Best of both worlds — liquidity + higher returns.",
              },
              {
                q: "How does InvestingPro compare banking products?",
                a: "We track interest rates, minimum balance requirements, fees, digital features, and customer service from 50+ banks daily. No bank pays for higher placement.",
              },
            ].map((f, i) => (
              <details
                key={i}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-ink hover:bg-gray-50 transition-colors list-none">
                  {f.q}
                  <ChevronRight
                    size={16}
                    className="text-ink-60 transition-transform group-open:rotate-90 flex-shrink-0 ml-4"
                  />
                </summary>
                <div className="px-5 pb-4 text-sm text-ink-60 leading-relaxed border-t border-gray-100 pt-3">
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
