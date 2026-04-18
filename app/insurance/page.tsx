import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import InsuranceClient from "./InsuranceClient";
import { getInsuranceServer } from "@/lib/products/get-insurance-server";
import { AdvertiserDisclosure } from "@/components/common/AdvertiserDisclosure";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Best Insurance Plans in India (2026) — Compare & Buy",
  description:
    "Compare term life, health, car, and travel insurance from 20+ insurers. Check claim settlement ratios. Independent ratings.",
  openGraph: {
    title: "Best Insurance Plans in India (2026)",
    url: "https://investingpro.in/insurance",
  },
};

export default async function InsurancePage() {
  let initialPlans: any[] = [];
  try {
    initialPlans = await getInsuranceServer();
  } catch {
    initialPlans = [];
  }
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Best Insurance Plans India 2026",
      description:
        "Compare term life, health, car, and travel insurance from 20+ insurers. Check claim settlement ratios. Independent ratings — no paid placements.",
      url: "https://investingpro.in/insurance",
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
            name: "Insurance",
            item: "https://investingpro.in/insurance",
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
          name: "What is the best term insurance plan in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Plans with high claim settlement ratios (>98%) and low premiums. LIC, HDFC Life, and ICICI Prudential consistently rank well.",
          },
        },
        {
          "@type": "Question",
          name: "How much health insurance cover do I need?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Minimum ₹10L for individuals, ₹25L for families in metros. Factor in medical inflation of 14% annually.",
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
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-8">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-300">
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
              <li className="text-gray-900 font-medium">Insurance</li>
            </ol>
          </nav>
          <AdvertiserDisclosure variant="expandable" className="mb-3" />

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-[1.1]">
                Best Insurance Plans in India
              </h1>
              <p className="text-base text-gray-500 mt-3 max-w-xl leading-relaxed">
                Compare term, health, life, car, and travel insurance. We track
                claim settlement ratios so you can choose with confidence.
              </p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0 mt-1">
              <span className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5">
                CSR verified
              </span>
              <span className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5">
                Updated quarterly
              </span>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              "All Plans",
              "Term Life",
              "Health",
              "Life",
              "Car",
              "Travel",
              "Bike",
            ].map((p, i) => (
              <Link
                key={p}
                href={
                  i === 0
                    ? "/insurance"
                    : `/insurance?type=${p.toLowerCase().replace(" ", "-")}`
                }
                className={`inline-flex items-center px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors rounded-full ${i === 0 ? "bg-green-700 text-white rounded-full" : "bg-gray-100 text-gray-600 hover:bg-gray-100"}`}
              >
                {p}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <InsuranceClient initialPlans={initialPlans} />
        </div>
      </section>
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Related Tools
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Coverage Calculator",
                desc: "Find how much coverage you need",
                href: "/calculators/insurance",
              },
              {
                label: "Compare Plans",
                desc: "Side-by-side insurer comparison",
                href: "/insurance/compare",
              },
              {
                label: "Claim Settlement Data",
                desc: "Which insurers actually pay claims",
                href: "/insurance/claims",
              },
              {
                label: "Insurance Guide",
                desc: "Everything you need to know",
                href: "/insurance/guides",
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

      {/* Popular comparisons + How we rate + FAQs */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Popular Comparisons
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
            {[
              {
                title: "Term vs Whole Life Insurance",
                desc: "Pure protection vs savings — what makes sense at your age?",
                href: "/insurance/compare/term-vs-whole-life",
              },
              {
                title: "LIC vs HDFC Life Term Plan",
                desc: "CSR, premium, and claim speed compared head-to-head",
                href: "/insurance/compare/lic-vs-hdfc-life",
              },
              {
                title: "Health Insurance: Star vs ICICI Lombard",
                desc: "Network hospitals, room limits, and no-claim bonus",
                href: "/insurance/compare/star-vs-icici-lombard",
              },
              {
                title: "Individual vs Family Floater",
                desc: "When a family plan saves money — and when it doesn't",
                href: "/insurance/compare/individual-vs-floater",
              },
              {
                title: "Company Insurance vs Own Policy",
                desc: "Why employer cover alone isn't enough",
                href: "/insurance/guides/company-vs-own",
              },
              {
                title: "ULIPs vs Term + Mutual Fund",
                desc: "Insurance + investment combo vs buying separately",
                href: "/insurance/compare/ulip-vs-term-mf",
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
                  <p className="text-xs text-gray-500 mt-0.5">{comp.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            How We Compare
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            {[
              {
                num: "98%+",
                label: "CSR threshold",
                desc: "We highlight plans with excellent claim settlement ratios",
              },
              {
                num: "20+",
                label: "Insurers tracked",
                desc: "IRDAI-regulated companies with public claims data",
              },
              {
                num: "Quarterly",
                label: "Data refresh",
                desc: "CSR, network hospitals, and premiums updated from IRDAI filings",
              },
              {
                num: "₹0",
                label: "Paid placements",
                desc: "No insurer pays for higher ranking. CSR and claims data drive all rankings.",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="p-4 bg-white border border-gray-200 rounded-xl"
              >
                <p className="text-2xl font-bold text-gray-900">{s.num}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {s.label}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-6">FAQs</h2>
          <div className="space-y-2">
            {[
              {
                q: "What is term insurance and do I need it?",
                a: "Term insurance is pure life cover — it pays your family if you die during the policy term. If anyone depends on your income, you need it. It is the most affordable form of life insurance.",
              },
              {
                q: "How much health insurance cover should I have?",
                a: "Minimum ₹10L for individuals, ₹25L+ for families in metros. Medical inflation runs at 14% annually — what costs ₹5L today will cost ₹20L in 10 years.",
              },
              {
                q: "What is claim settlement ratio and why does it matter?",
                a: "CSR tells you what percentage of claims an insurer actually pays. Look for 95%+ CSR. We track this data for every insurer on our platform.",
              },
              {
                q: "Should I buy insurance online or through an agent?",
                a: "Online plans are typically 10-30% cheaper (no agent commission). The coverage is identical. We recommend buying directly from the insurer website.",
              },
              {
                q: "Is health insurance tax deductible?",
                a: "Yes. Premiums up to ₹25,000 (₹50,000 for senior citizens) qualify for Section 80D deduction. This applies to self, spouse, children, and parents.",
              },
              {
                q: "How does InvestingPro rate insurance plans?",
                a: "We evaluate on premium value, claim settlement ratio, network hospitals, coverage limits, exclusions, and customer reviews. No insurer pays for higher placement.",
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
                <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-200 pt-3">
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
