import React from "react";
import type { Metadata } from "next";
import { StepUpSIPCalculator } from "@/components/calculators/StepUpSIPCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Step-Up SIP Calculator India 2026 — Calculate Increasing SIP Returns | InvestingPro",
  description:
    "Free step-up SIP calculator to calculate returns when you increase SIP amount annually. Compare step-up vs regular SIP, see how salary increments compound your wealth. Goal-based mode available.",
  keywords:
    "step up SIP calculator, increasing SIP calculator, SIP with annual increment, step up SIP vs regular SIP, SIP top up calculator, salary hike SIP, growing SIP returns",
  openGraph: {
    title: "Step-Up SIP Calculator India 2026",
    description:
      "Calculate step-up SIP returns with annual increment. Compare vs regular SIP. Goal-based mode.",
    url: "https://investingpro.in/calculators/step-up-sip",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/step-up-sip" },
};

export default function StepUpSIPPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Step-Up SIP Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    description:
      "Calculate returns on step-up (increasing) SIP with annual increment. Compare with regular SIP.",
    url: "https://investingpro.in/calculators/step-up-sip",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a step-up SIP?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A step-up SIP (also called top-up SIP) automatically increases your monthly SIP amount by a fixed percentage every year. For example, ₹5,000/mo with 10% step-up becomes ₹5,500 in Year 2, ₹6,050 in Year 3, and so on. This aligns your investments with salary growth and dramatically increases final corpus.",
        },
      },
      {
        "@type": "Question",
        name: "How much more does step-up SIP give vs regular SIP?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A ₹5,000/mo SIP with 10% step-up at 12% returns for 20 years gives approximately ₹1.03 Cr vs ₹49.9L from regular SIP — that's 107% more wealth. The advantage grows exponentially with time and step-up rate.",
        },
      },
      {
        "@type": "Question",
        name: "What step-up percentage should I choose?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Match your step-up rate to your expected salary increment: 5% for conservative careers, 10% for average IT/corporate jobs, 15% for fast-growth startups. Never set step-up higher than your actual salary growth — you'll struggle to maintain it.",
        },
      },
      {
        "@type": "Question",
        name: "Can I do step-up SIP in mutual funds?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Most fund houses and platforms (Groww, Zerodha Coin, Kuvera) offer step-up SIP facility. You set the annual increment percentage when starting the SIP. Some platforms call it 'top-up SIP'. Check with your platform for exact process.",
        },
      },
      {
        "@type": "Question",
        name: "Is step-up SIP better than lumpsum investing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Step-up SIP is better for salaried individuals who get regular income and annual increments. It combines rupee-cost averaging (SIP benefit) with increasing allocation (salary-linked). Lumpsum is better only if you have a large amount available today and markets are at a correction.",
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
            Step-Up SIP Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Calculate returns when you increase your SIP amount annually. See
            how matching SIP to salary increments can dramatically grow your
            wealth. Compare step-up vs regular SIP.
          </p>
        </div>
        <StepUpSIPCalculator />
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
            url="https://investingpro.in/calculators/step-up-sip"
            title="Step-Up SIP Calculator — Growing SIP Returns"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "mutual-funds",
              slug: "step-up-sip",
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
