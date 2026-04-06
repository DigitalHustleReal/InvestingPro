import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Shield, CalendarDays } from "lucide-react";
import DematAccountsClient from "./DematAccountsClient";
import { getDematAccountsServer } from "@/lib/products/get-demat-accounts-server";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Best Demat Accounts in India (2026) — Compare Brokers | InvestingPro",
  description:
    "Compare demat accounts from discount and full-service brokers. Brokerage charges, platform features, AMC fees. Independent ratings.",
  openGraph: {
    title: "Best Demat Accounts in India (2026)",
    url: "https://investingpro.in/demat-accounts",
  },
};

export default async function DematAccountsPage() {
  let initialBrokers: any[] = [];
  try {
    initialBrokers = await getDematAccountsServer();
  } catch {
    initialBrokers = [];
  }
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Best Demat Accounts India 2026",
      description:
        "Compare demat accounts from discount and full-service brokers. Brokerage charges, platform features, AMC fees. Independent ratings — no paid placements.",
      url: "https://investingpro.in/demat-accounts",
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
            name: "Demat Accounts",
            item: "https://investingpro.in/demat-accounts",
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
          name: "What is a demat account?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A demat (dematerialized) account holds your shares and securities in electronic form. You need one to buy stocks, mutual funds, bonds, and ETFs in India.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between discount and full-service brokers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Discount brokers (Zerodha, Groww) charge flat ₹20/trade or zero brokerage. Full-service brokers (ICICI Direct, HDFC Securities) charge percentage-based fees but offer research and advisory.",
          },
        },
        {
          "@type": "Question",
          name: "How much does a demat account cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Account opening is free at most brokers. Annual AMC (maintenance charge) ranges from ₹0 to ₹750. Trading charges vary — ₹0 to ₹20 per trade for delivery.",
          },
        },
        {
          "@type": "Question",
          name: "Can I have multiple demat accounts?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. You can have demat accounts with multiple brokers. There is no legal limit. Some investors use different brokers for trading vs long-term investing.",
          },
        },
        {
          "@type": "Question",
          name: "What documents do I need to open a demat account?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "PAN card, Aadhaar (for eKYC), bank account details, and a recent photograph. Most brokers offer instant digital account opening.",
          },
        },
        {
          "@type": "Question",
          name: "How does InvestingPro compare demat accounts?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We evaluate brokerage charges, AMC fees, platform features, mobile app quality, research tools, and customer support. No broker pays for higher placement.",
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
              <li className="text-gray-700 font-medium">Demat Accounts</li>
            </ol>
          </nav>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-[32px] font-bold text-[--v2-ink] tracking-tight leading-tight">
                Best Demat Accounts in India
              </h1>
              <p className="text-[15px] text-gray-500 mt-2 max-w-xl leading-relaxed">
                Compare brokerage charges, platform features, and account
                opening fees across discount and full-service brokers.
              </p>
            </div>
            <div className="flex items-center gap-5 text-[12px] text-gray-500 flex-shrink-0 mt-1">
              <span className="flex items-center gap-1.5">
                <Shield size={13} className="text-green-600" />
                SEBI-registered brokers
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={13} className="text-green-600" />
                Updated monthly
              </span>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              "All Brokers",
              "Discount",
              "Full Service",
              "Zero Brokerage",
              "Best for Beginners",
              "Best for Trading",
            ].map((p, i) => (
              <Link
                key={p}
                href={
                  i === 0
                    ? "/demat-accounts"
                    : `/demat-accounts?type=${p.toLowerCase().replace(/ /g, "-")}`
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
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <DematAccountsClient initialBrokers={initialBrokers} />
        </div>
      </section>
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-[--v2-ink] mb-5">
            Related Tools
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Brokerage Calculator",
                desc: "Compare actual trading costs",
                href: "/calculators/brokerage",
              },
              {
                label: "Compare Brokers",
                desc: "Side-by-side feature comparison",
                href: "/demat-accounts/compare",
              },
              {
                label: "IPO Calendar",
                desc: "Upcoming IPOs and allotment status",
                href: "/stocks/ipo",
              },
              {
                label: "Demat Guide",
                desc: "Everything about demat accounts",
                href: "/demat-accounts/guide",
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
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-[--v2-ink] mb-5">
            Demat Account FAQs
          </h2>
          <div className="space-y-2">
            {[
              {
                q: "What is a demat account?",
                a: "A demat (dematerialized) account holds your shares and securities in electronic form. You need one to buy stocks, mutual funds, bonds, and ETFs in India.",
              },
              {
                q: "What is the difference between discount and full-service brokers?",
                a: "Discount brokers (Zerodha, Groww) charge flat ₹20/trade or zero brokerage. Full-service brokers (ICICI Direct, HDFC Securities) charge percentage-based fees but offer research and advisory.",
              },
              {
                q: "How much does a demat account cost?",
                a: "Account opening is free at most brokers. Annual AMC (maintenance charge) ranges from ₹0 to ₹750. Trading charges vary — ₹0 to ₹20 per trade for delivery.",
              },
              {
                q: "Can I have multiple demat accounts?",
                a: "Yes. You can have demat accounts with multiple brokers. There is no legal limit. Some investors use different brokers for trading vs long-term investing.",
              },
              {
                q: "What documents do I need to open a demat account?",
                a: "PAN card, Aadhaar (for eKYC), bank account details, and a recent photograph. Most brokers offer instant digital account opening.",
              },
              {
                q: "How does InvestingPro compare demat accounts?",
                a: "We evaluate brokerage charges, AMC fees, platform features, mobile app quality, research tools, and customer support. No broker pays for higher placement.",
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
