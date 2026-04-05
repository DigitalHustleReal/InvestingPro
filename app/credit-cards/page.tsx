import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Shield, CalendarDays } from "lucide-react";
import { getCreditCardsServer } from "@/lib/products/get-credit-cards-server";
import CreditCardsClient from "./CreditCardsClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Best Credit Cards in India (2026) — Compare & Apply | InvestingPro",
  description:
    "Compare credit cards from every major Indian bank. Filter by rewards, cashback, travel, annual fee, and network. Independent ratings — no paid placements.",
  openGraph: {
    title: "Best Credit Cards in India (2026) — Compare & Apply",
    description:
      "Compare credit cards from 50+ banks. Independent research, AI-powered scoring, instant apply.",
    url: "https://investingpro.in/credit-cards",
    type: "website",
  },
};

export default async function CreditCardsPage() {
  let assets: any[] = [];
  try {
    assets = await getCreditCardsServer();
  } catch (error) {
    console.error("[CreditCardsPage] Failed to load credit cards:", error);
    assets = [];
  }

  const cardCount = assets.length > 0 ? assets.length : 500;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Best Credit Cards in India 2026",
      description:
        "Compare and apply for the best credit cards in India. Filter by rewards, cashback, travel, annual fee, and network. Independent ratings — no paid placements.",
      url: "https://investingpro.in/credit-cards",
      numberOfItems: cardCount,
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
            name: "Credit Cards",
            item: "https://investingpro.in/credit-cards",
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
          name: "What is the best credit card in India right now?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It depends on your spending pattern. For cashback, the SBI Cashback Card offers 5% on online purchases. For travel, the HDFC Regalia Gold gives 12 airport lounge visits/year.",
          },
        },
        {
          "@type": "Question",
          name: "Will applying for a credit card hurt my credit score?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Each application triggers a hard inquiry, which can temporarily lower your score by 5-10 points. We recommend applying for 1-2 cards at a time.",
          },
        },
        {
          "@type": "Question",
          name: "What credit score do I need for a credit card?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most premium cards require 750+. Cards for good credit start at 700+. Some secured cards accept 650+.",
          },
        },
        {
          "@type": "Question",
          name: "Are lifetime free credit cards really free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The card itself has no annual fee, but you may still pay interest on unpaid balances, forex markup, and late payment fees.",
          },
        },
        {
          "@type": "Question",
          name: "How does InvestingPro rate credit cards?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We evaluate cards on 23 data points including rewards value, annual fees, interest rates, welcome bonuses, and benefits. No bank pays for higher placement.",
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

      {/* ── Hero ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 pt-6 pb-8">
          {/* Breadcrumbs */}
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
              <li className="text-gray-700 font-medium">Credit Cards</li>
            </ol>
          </nav>

          {/* Title row */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-[32px] font-bold text-[--v2-ink] tracking-tight leading-tight">
                Best Credit Cards in India
              </h1>
              <p className="text-[15px] text-gray-500 mt-2 max-w-xl leading-relaxed">
                Compare {cardCount}+ credit cards. Filter by rewards, fees, and
                network. Ranked by real outcomes — not what pays us most.
              </p>
            </div>
            <div className="flex items-center gap-5 text-[12px] text-gray-500 flex-shrink-0 mt-1">
              <span className="flex items-center gap-1.5">
                <Shield size={13} className="text-green-600" />
                Independent ratings
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={13} className="text-green-600" />
                Updated daily
              </span>
            </div>
          </div>

          {/* Quick filter pills — NerdWallet pattern */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { label: "All Cards", href: "/credit-cards", active: true },
              { label: "Rewards", href: "/credit-cards?filter=rewards" },
              { label: "Cashback", href: "/credit-cards?filter=cashback" },
              { label: "Travel", href: "/credit-cards?filter=travel" },
              { label: "No Annual Fee", href: "/credit-cards?filter=no-fee" },
              { label: "Fuel", href: "/credit-cards?filter=fuel" },
              { label: "Shopping", href: "/credit-cards?filter=shopping" },
              { label: "Premium", href: "/credit-cards?filter=premium" },
            ].map((pill) => (
              <Link
                key={pill.label}
                href={pill.href}
                className={`inline-flex items-center px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                  pill.active
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                {pill.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="bg-gray-50 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-8">
          <CreditCardsClient initialAssets={assets as any} />
        </div>
      </section>

      {/* ── Related tools ── */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-[--v2-ink] mb-5">
            Related Tools
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Rewards Calculator",
                desc: "Estimate annual rewards from your spending",
                href: "/calculators?type=rewards",
              },
              {
                label: "EMI Calculator",
                desc: "Calculate card EMI for big purchases",
                href: "/calculators/emi",
              },
              {
                label: "Compare Cards",
                desc: "Side-by-side feature comparison",
                href: "/credit-cards/compare",
              },
              {
                label: "Find Your Card",
                desc: "Personalized recommendation quiz",
                href: "/credit-cards/find-your-card",
              },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-sm transition-all group"
              >
                <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                  {tool.label}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {tool.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular comparisons ── */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-[--v2-ink] mb-5">
            Popular Card Comparisons
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                title: "SBI Cashback vs Amazon Pay ICICI",
                desc: "Best no-fee cashback card for online spending",
                href: "/credit-cards/compare/sbi-cashback-vs-amazon-pay",
              },
              {
                title: "HDFC Regalia vs Infinia",
                desc: "Premium travel card showdown — is 5x the fee worth it?",
                href: "/credit-cards/compare/hdfc-regalia-vs-infinia",
              },
              {
                title: "Axis Ace vs HDFC Millennia",
                desc: "Best entry-level rewards card under ₹1,000",
                href: "/credit-cards/compare/axis-ace-vs-hdfc-millennia",
              },
              {
                title: "Rewards vs Cashback Cards",
                desc: "Points or direct savings — which saves more?",
                href: "/credit-cards/compare/rewards-vs-cashback",
              },
              {
                title: "Travel vs Fuel Cards",
                desc: "Best card for frequent travelers vs daily commuters",
                href: "/credit-cards/compare/travel-vs-fuel",
              },
              {
                title: "Lifetime Free vs Paid Cards",
                desc: "When the annual fee actually pays for itself",
                href: "/credit-cards/compare/free-vs-paid",
              },
            ].map((comp) => (
              <Link
                key={comp.href}
                href={comp.href}
                className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-sm transition-all group"
              >
                <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded mt-0.5 flex-shrink-0">
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

      {/* ── How we rate ── */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-[--v2-ink] mb-5">
            How We Rate Credit Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              {
                num: "23",
                label: "Data points per card",
                desc: "Rewards value, fees, interest, benefits, eligibility, and more",
              },
              {
                num: "Daily",
                label: "Update frequency",
                desc: "Rates and benefits scraped from bank websites and RBI data",
              },
              {
                num: "₹0",
                label: "Paid placements",
                desc: "No bank pays for higher ranking. Editorial is independent of commercial.",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 bg-gray-50 rounded-xl border border-gray-100"
              >
                <p className="text-2xl font-black text-green-600">{stat.num}</p>
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
            When you apply through our links, we may earn an affiliate
            commission. This never influences our ratings. See our{" "}
            <Link
              href="/methodology"
              className="text-green-600 font-medium hover:text-green-700"
            >
              methodology
            </Link>{" "}
            and{" "}
            <Link
              href="/how-we-make-money"
              className="text-green-600 font-medium hover:text-green-700"
            >
              how we make money
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── FAQ — with schema markup ── */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-[--v2-ink] mb-5">
            Credit Card FAQs
          </h2>
          <div className="space-y-2">
            {[
              {
                q: "What is the best credit card in India right now?",
                a: "It depends on your spending pattern. For cashback, the SBI Cashback Card offers 5% on online purchases. For travel, the HDFC Regalia Gold gives 12 airport lounge visits/year. Use our filters above to find the best card for your needs.",
              },
              {
                q: "Will applying for a credit card hurt my credit score?",
                a: "Each application triggers a hard inquiry, which can temporarily lower your score by 5-10 points. We recommend applying for 1-2 cards at a time and spacing applications 3-6 months apart.",
              },
              {
                q: "What credit score do I need for a credit card?",
                a: "Most premium cards require 750+. Cards for good credit start at 700+. Some secured cards accept 650+. If you are new to credit, consider a secured card or a card specifically designed for beginners.",
              },
              {
                q: "Are lifetime free credit cards really free?",
                a: "The card itself has no annual fee, but you may still pay interest on unpaid balances (typically 36-42% APR), forex markup on international transactions (1.5-3.5%), and late payment fees. Always read the fine print.",
              },
              {
                q: "How do credit card rewards work?",
                a: "Most cards earn reward points or cashback on purchases. Points can be redeemed for flights, products, or statement credits. Cashback is directly credited to your statement. The effective reward rate typically ranges from 0.5% to 5% depending on the card and spending category.",
              },
              {
                q: "How does InvestingPro rate credit cards?",
                a: "We evaluate cards on 23 data points including rewards value, annual fees, interest rates, welcome bonuses, travel benefits, and eligibility requirements. Our editorial team reviews every card independently. No bank pays for higher placement.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors list-none">
                  {faq.q}
                  <ChevronRight
                    size={16}
                    className="text-gray-400 transition-transform group-open:rotate-90 flex-shrink-0 ml-4"
                  />
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Next steps CTAs ── */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-[--v2-ink] mb-5">
            Not sure yet?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/credit-cards/find-your-card"
              className="p-5 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors text-center"
            >
              <p className="text-sm font-semibold text-green-800">
                Take the Card Finder Quiz
              </p>
              <p className="text-xs text-green-600 mt-1">
                3 questions, 30 seconds
              </p>
            </Link>
            <Link
              href="/credit-cards/compare"
              className="p-5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-center"
            >
              <p className="text-sm font-semibold text-gray-900">
                Compare Cards Side-by-Side
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Pick 2-3 cards and see the difference
              </p>
            </Link>
            <Link
              href="/credit-cards/guides"
              className="p-5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-center"
            >
              <p className="text-sm font-semibold text-gray-900">
                Read the Credit Card Guide
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Everything you need to know
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
