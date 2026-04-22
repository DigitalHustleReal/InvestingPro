import React from "react";
import type { Metadata } from "next";
import { AtalPensionYojanaCalculator } from "@/components/calculators/AtalPensionYojanaCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Atal Pension Yojana (APY) Calculator 2026 — Monthly Contribution + Tax Benefits | InvestingPro",
  description:
    "Free APY calculator with official government contribution chart. See monthly contribution for ₹1000-₹5000 pension, total payout, corpus at 60, and 80CCD(1B) tax benefits. Compare all pension options.",
  keywords:
    "APY calculator, Atal Pension Yojana calculator, APY contribution chart 2026, APY pension scheme, government pension calculator India, 80CCD tax benefit, APY monthly contribution, APY eligibility",
  openGraph: {
    title: "Atal Pension Yojana (APY) Calculator 2026",
    description:
      "Calculate APY monthly contribution with official rates. Compare pension options and see tax benefits under 80CCD(1B).",
    url: "https://investingpro.in/calculators/atal-pension-yojana",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/atal-pension-yojana",
  },
};

export default function AtalPensionYojanaPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Atal Pension Yojana (APY) Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/atal-pension-yojana",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who is eligible for Atal Pension Yojana (APY)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Any Indian citizen aged 18-40 years with a savings bank account can join APY. The subscriber should not be an income tax payer (condition relaxed in 2022 for existing subscribers). Both salaried (unorganized sector) and self-employed individuals are eligible. One APY account per person is allowed.",
        },
      },
      {
        "@type": "Question",
        name: "What are the pension amounts available under APY?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "APY offers 5 fixed monthly pension options: ₹1,000, ₹2,000, ₹3,000, ₹4,000, and ₹5,000 per month. The pension starts at age 60 and continues for life. After the subscriber's death, the spouse receives the same pension amount. After both deaths, the corpus (₹1.7L to ₹8.5L) is returned to the nominee.",
        },
      },
      {
        "@type": "Question",
        name: "What tax benefits are available for APY contributions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "APY contributions qualify for tax deduction under Section 80CCD(1B) of the Income Tax Act — an additional ₹50,000 deduction over and above the ₹1.5 lakh limit of Section 80C. This means if you are in the 30% tax bracket, you can save up to ₹15,000 per year in taxes. The pension received after 60 is taxable as per your income tax slab.",
        },
      },
      {
        "@type": "Question",
        name: "Can I nominate someone in APY? What happens after death?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, nomination is mandatory in APY. Your spouse is the default nominee. After the subscriber's death, the spouse receives the same guaranteed monthly pension for life. After both subscriber and spouse pass away, the accumulated corpus (₹1.7 lakh for ₹1K pension to ₹8.5 lakh for ₹5K pension) is paid to the nominee.",
        },
      },
      {
        "@type": "Question",
        name: "Can I withdraw from APY before age 60?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Premature exit before age 60 is allowed only in exceptional circumstances — death of the subscriber or terminal illness. Voluntary exit is permitted but only the accumulated contributions with actual returns (not guaranteed pension) are returned. Penalty may apply for voluntary exit. It is best to stay invested till 60 for guaranteed benefits.",
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
          <h1 className="font-display font-black text-[32px] sm:text-[40px] text-ink tracking-tight leading-[1.1]">
            Atal Pension Yojana (APY) Calculator
          </h1>
          <p className="text-sm text-ink-60 mt-1.5 max-w-2xl">
            Calculate your APY monthly contribution with official government
            rates. Compare all 5 pension options, see total payout till 60, and
            claim extra ₹50,000 tax deduction under 80CCD(1B). Guaranteed
            pension for life — for you and your spouse.
          </p>
        </div>
        <AtalPensionYojanaCalculator />
        <div className="mt-10">
          <h2 className="text-xl font-display font-bold text-ink mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {(faqSchema.mainEntity || []).map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-4 text-sm font-medium text-ink hover:bg-gray-50 transition-colors">
                  {faq.name}
                  <span className="text-ink-60 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="px-4 pb-4 text-sm text-ink-60 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.acceptedAnswer.text}
                </div>
              </details>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <SocialShareButtons
            url="https://investingpro.in/calculators/atal-pension-yojana"
            title="Atal Pension Yojana (APY) Calculator — Monthly Contribution + Tax Benefits"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "government-schemes",
              slug: "atal-pension-yojana",
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
