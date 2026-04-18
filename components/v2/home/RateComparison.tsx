"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";

const TABS = [
  {
    label: "Best Deposit Rates",
    cards: [
      {
        title: "Fixed Deposit",
        rate: "9.10%",
        sub: "p.a. · 1 year tenure",
        provider: "Shriram Finance",
        avg: "7.00%",
        better: true,
        href: "/fixed-deposits",
        cta: "Compare FD Rates",
      },
      {
        title: "Savings Account",
        rate: "7.25%",
        sub: "p.a. · no lock-in",
        provider: "AU Small Finance Bank",
        avg: "3.50%",
        better: true,
        href: "/banking",
        cta: "Compare Savings",
      },
      {
        title: "Recurring Deposit",
        rate: "7.50%",
        sub: "p.a. · 12 months",
        provider: "Unity SFB",
        avg: "6.00%",
        better: true,
        href: "/fixed-deposits?filter=rd",
        cta: "Compare RD Rates",
      },
    ],
  },
  {
    label: "Cheapest Loan Rates",
    cards: [
      {
        title: "Home Loan",
        rate: "8.35%",
        sub: "p.a. · 20 year tenure",
        provider: "SBI",
        avg: "9.25%",
        better: true,
        href: "/loans?type=home",
        cta: "Compare Home Loans",
      },
      {
        title: "Personal Loan",
        rate: "10.49%",
        sub: "p.a. · no collateral",
        provider: "HDFC Bank",
        avg: "14.00%",
        better: true,
        href: "/loans?type=personal",
        cta: "Compare Personal Loans",
      },
      {
        title: "Car Loan",
        rate: "8.70%",
        sub: "p.a. · new car",
        provider: "Bank of Baroda",
        avg: "9.50%",
        better: true,
        href: "/loans?type=car",
        cta: "Compare Car Loans",
      },
    ],
  },
];

export default function RateComparison() {
  const [activeTab, setActiveTab] = useState(0);
  const tab = TABS[activeTab];

  return (
    <section className="py-16 md:py-20 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-[28px] sm:text-[34px] font-bold leading-tight tracking-tight text-gray-900">
              Find smarter rates today
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Live rates from top Indian banks and NBFCs. Updated daily.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1 self-start">
            {TABS.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 text-[13px] font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === i
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rate cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tab.cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-green-300 hover:shadow-md transition-all"
            >
              <div className="text-sm font-semibold text-gray-900 mb-1">
                {card.title}
              </div>
              <div className="text-[40px] font-black text-green-600 leading-none mb-1">
                {card.rate}
              </div>
              <div className="text-xs text-gray-400 mb-4">{card.sub}</div>

              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div>
                  <div className="text-[11px] text-gray-400">Best from</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {card.provider}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-gray-400">Avg. market</div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-400">
                    {card.avg}
                    {card.better && (
                      <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 mt-4 text-sm font-semibold text-green-600 group-hover:text-green-700 transition-colors">
                {card.cta} <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
