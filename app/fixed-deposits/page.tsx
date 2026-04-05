import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Shield, CalendarDays } from "lucide-react";
import FixedDepositsClient from "./FixedDepositsClient";
import { getFixedDepositsServer } from "@/lib/products/get-fixed-deposits-server";

export const revalidate = 3600;
export const metadata: Metadata = {
  title:
    "Best Fixed Deposit Rates in India (2026) — Compare FDs | InvestingPro",
  description:
    "Compare FD interest rates from 50+ banks and NBFCs. Find highest rates for regular and senior citizens. Tax-saving FDs, short-term, and corporate FDs.",
  openGraph: {
    title: "Best Fixed Deposit Rates in India (2026)",
    url: "https://investingpro.in/fixed-deposits",
  },
};

export default async function FixedDepositsPage() {
  let initialFDs: any[] = [];
  try {
    initialFDs = await getFixedDepositsServer();
  } catch {
    initialFDs = [];
  }
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Best FD Rates India 2026",
      description:
        "Compare FD interest rates from 50+ banks and NBFCs. Find highest rates for regular and senior citizens. Tax-saving FDs, short-term, and corporate FDs.",
      url: "https://investingpro.in/fixed-deposits",
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
            name: "Fixed Deposits",
            item: "https://investingpro.in/fixed-deposits",
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
          name: "Which bank gives the highest FD rate in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Small finance banks and NBFCs like Shriram Finance (8.35%), Unity SFB (8.25%) offer the highest rates. Among large banks, SBI offers up to 7.10%.",
          },
        },
        {
          "@type": "Question",
          name: "Is FD interest taxable?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. FD interest is taxed at your income tax slab rate. TDS of 10% is deducted if annual interest exceeds ₹40,000 (₹50,000 for seniors).",
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
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 pt-6 pb-8">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-1.5 text-[13px] text-gray-600 dark:text-gray-300">
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
              <li className="text-gray-700 font-medium">Fixed Deposits</li>
            </ol>
          </nav>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-[32px] font-bold text-[--v2-ink] tracking-tight leading-tight">
                Best Fixed Deposit Rates in India
              </h1>
              <p className="text-[15px] text-gray-500 mt-2 max-w-xl leading-relaxed">
                Compare FD rates from 50+ banks. Senior citizen rates,
                tax-saving FDs, and corporate deposits — all in one place.
              </p>
            </div>
            <div className="flex items-center gap-5 text-[12px] text-gray-500 flex-shrink-0 mt-1">
              <span className="flex items-center gap-1.5">
                <Shield size={13} className="text-green-600" />
                RBI-regulated banks
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={13} className="text-green-600" />
                Rates updated daily
              </span>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              "All FDs",
              "Highest Rate",
              "Senior Citizen",
              "Tax Saving",
              "Short Term",
              "Corporate",
              "Small Finance",
            ].map((p, i) => (
              <Link
                key={p}
                href={
                  i === 0
                    ? "/fixed-deposits"
                    : `/fixed-deposits?filter=${p.toLowerCase().replace(" ", "-")}`
                }
                className={`inline-flex items-center px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${i === 0 ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {p}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-gray-50 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-8">
          <FixedDepositsClient initialFDs={initialFDs} />
        </div>
      </section>
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-[--v2-ink] mb-5">
            Related Tools
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "FD Calculator",
                desc: "Calculate maturity amount and interest",
                href: "/calculators/fd",
              },
              {
                label: "Compare FD Rates",
                desc: "Side-by-side bank comparison",
                href: "/fixed-deposits/compare",
              },
              {
                label: "RD Calculator",
                desc: "Recurring deposit returns",
                href: "/calculators/rd",
              },
              {
                label: "Tax-Saving FDs",
                desc: "5-year FDs with 80C benefit",
                href: "/fixed-deposits?filter=tax-saving",
              },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-sm transition-all group"
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
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-[--v2-ink] mb-5">FD FAQs</h2>
          <div className="space-y-2">
            {[
              {
                q: "Which bank gives the highest FD rate in India?",
                a: "Small finance banks like Unity SFB (8.25%) and NBFCs like Shriram Finance (8.35%) offer the highest rates. Among large banks, SBI offers up to 7.10%. Rates vary by tenure and deposit amount.",
              },
              {
                q: "Is FD interest taxable in India?",
                a: "Yes. FD interest is added to your taxable income and taxed at your slab rate. TDS of 10% is deducted if annual interest exceeds ₹40,000 (₹50,000 for senior citizens). Submit Form 15G/15H to avoid TDS if your total income is below taxable limit.",
              },
              {
                q: "What happens if I break my FD early?",
                a: "Most banks charge a penalty of 0.5-1% on the applicable rate. Some banks have no-penalty FDs. Always check premature withdrawal terms before investing.",
              },
              {
                q: "Are corporate FDs safe?",
                a: "Corporate FDs from AAA-rated companies are generally safe but not insured by DICGC (unlike bank FDs up to ₹5L). Always check credit rating before investing in corporate FDs.",
              },
              {
                q: "What is the difference between cumulative and non-cumulative FDs?",
                a: "Cumulative FDs pay interest at maturity (interest compounds). Non-cumulative FDs pay interest monthly/quarterly/annually. Cumulative gives higher effective returns due to compounding.",
              },
              {
                q: "How does InvestingPro compare FD rates?",
                a: "We track rates from 50+ banks and NBFCs daily. We compare regular rates, senior citizen rates, tenure options, and premature withdrawal penalties. No bank pays for higher placement.",
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
