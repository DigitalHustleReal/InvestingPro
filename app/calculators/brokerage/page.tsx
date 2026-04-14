import React from "react";
import type { Metadata } from "next";
import { BrokerageCalculator } from "@/components/calculators/BrokerageCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Brokerage Calculator India 2026 — Zerodha vs Groww vs Traditional | InvestingPro",
  description:
    "Free brokerage calculator with full charge breakdown — STT, exchange charges, GST, stamp duty, SEBI fees. Compare flat-fee vs traditional brokers. See how much you save per trade.",
  keywords:
    "brokerage calculator, brokerage charges calculator India, Zerodha brokerage calculator, Groww charges, STT calculator, trading charges India, demat charges calculator, intraday brokerage",
  openGraph: {
    title: "Brokerage Calculator India 2026 — Full Charge Breakdown",
    description:
      "Calculate exact brokerage + STT + GST + stamp duty per trade. Compare Zerodha, Groww, and traditional brokers.",
    url: "https://investingpro.in/calculators/brokerage",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/brokerage" },
};

export default function BrokerageCalculatorPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Brokerage Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/brokerage",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are the brokerage charges in Zerodha in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Zerodha charges zero brokerage on equity delivery trades. For intraday and F&O, it's ₹20 per order or 0.03% (whichever is lower). Additional charges include STT, exchange transaction charges, GST (18% on brokerage + exchange charges), stamp duty, and SEBI fees.",
        },
      },
      {
        "@type": "Question",
        name: "How is STT calculated on stock trades?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "STT (Securities Transaction Tax) rates: Equity Delivery — 0.1% on both buy and sell. Intraday — 0.025% on sell side only. Futures — 0.0125% on sell side. Options — 0.0625% on sell side (on premium). STT is a government tax and cannot be avoided.",
        },
      },
      {
        "@type": "Question",
        name: "Which is the cheapest broker in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For delivery trades, Zerodha and Groww offer zero brokerage. For intraday/F&O, all discount brokers charge ₹20/order (Zerodha, Groww, Upstox, Angel One). The real difference is in platform quality, research tools, and customer support. For high-volume traders, some brokers offer unlimited trading plans at ₹899-999/month.",
        },
      },
      {
        "@type": "Question",
        name: "What charges are included besides brokerage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Beyond brokerage, every trade attracts: STT (govt tax), Exchange Transaction Charges (₹3.45 per lakh for NSE), GST (18% on brokerage + exchange charges), Stamp Duty (state-wise, 0.015% for delivery), SEBI Charges (₹10 per crore), and DP charges (₹15.93 per sell transaction for delivery). These statutory charges apply regardless of your broker.",
        },
      },
      {
        "@type": "Question",
        name: "Is Groww cheaper than Zerodha?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Both Groww and Zerodha have identical brokerage: zero for delivery, ₹20 for intraday/F&O. The difference is in account opening (Groww: free, Zerodha: ₹200) and annual maintenance (Groww: free, Zerodha: ₹300/year). For active traders, the cost difference is negligible — choose based on platform features.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <AutoBreadcrumbs />
        <div className="mt-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Brokerage Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Calculate exact trading charges including brokerage, STT, exchange
            fees, GST, stamp duty, and SEBI charges. Compare flat-fee brokers
            (Zerodha, Groww) vs traditional brokers and see your yearly savings.
          </p>
        </div>
        <BrokerageCalculator />
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {(faqSchema.mainEntity || []).map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-4 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                  {faq.name}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.acceptedAnswer.text}
                </div>
              </details>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <SocialShareButtons
            url="https://investingpro.in/calculators/brokerage"
            title="Brokerage Calculator — Compare Trading Charges"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "trading",
              slug: "brokerage",
            }}
          />
        </div>
        <div className="mt-8">
          <FinancialDisclaimer />
        </div>
      </div>
    </>
  );
}
