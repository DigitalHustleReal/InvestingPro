import React from "react";
import type { Metadata } from "next";
import { PMKisanCalculator } from "@/components/calculators/PMKisanCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "PM Kisan Calculator 2026 — Calculate Total Benefit + Investment Growth | InvestingPro",
  description:
    "Free PM-KISAN calculator: see how ₹6,000/year grows if invested in SIP, PPF, or FD. Check eligibility, total benefit over 10-20 years, and wealth creation from PM Kisan money.",
  keywords:
    "PM Kisan calculator, PM-KISAN benefit calculator, PM Kisan SIP calculator, PM Kisan scheme 2026, farmer scheme calculator India, PM Kisan eligibility, PM Kisan investment growth",
  openGraph: {
    title: "PM Kisan Calculator India 2026",
    description:
      "Calculate PM-KISAN total benefit and see how investing ₹6,000/year in SIP can build wealth for farmers.",
    url: "https://investingpro.in/calculators/pm-kisan",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/pm-kisan" },
};

export default function PMKisanPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PM Kisan Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/pm-kisan",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who is eligible for PM-KISAN scheme?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Small and marginal farmer families with cultivable land up to 2 hectares are eligible. The benefit is ₹6,000 per year in 3 installments of ₹2,000 each. Institutional landholders, former/current constitutional post holders, and income tax payers are excluded.",
        },
      },
      {
        "@type": "Question",
        name: "How much money do farmers get from PM-KISAN per year?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Farmers receive ₹6,000 per year under PM-KISAN, paid in 3 equal installments of ₹2,000 each. The installments are credited in April-July, August-November, and December-March periods directly to the farmer's Aadhaar-linked bank account via DBT.",
        },
      },
      {
        "@type": "Question",
        name: "Can PM-KISAN money be invested in SIP?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, PM-KISAN money can be invested in SIP (Systematic Investment Plan). Investing ₹500/month (equivalent of ₹2,000 every 4 months) in an equity mutual fund SIP at 12% returns can grow to over ₹1.2 lakh in 10 years, significantly more than the ₹60,000 received.",
        },
      },
      {
        "@type": "Question",
        name: "Is PM-KISAN benefit taxable?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, PM-KISAN benefit of ₹6,000/year is not taxable. It is a government welfare scheme benefit and is exempt from income tax. However, if you invest this money and earn returns (e.g., FD interest, mutual fund gains), those returns may be taxable as per normal tax rules.",
        },
      },
      {
        "@type": "Question",
        name: "How to check PM-KISAN payment status?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Visit pmkisan.gov.in and click 'Beneficiary Status'. Enter your Aadhaar number, mobile number, or account number to check payment status. You can also check via the PM-KISAN mobile app. Payments are typically credited within the first month of each installment period.",
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
            PM Kisan Calculator
          </h1>
          <p className="text-sm text-ink-60 mt-1.5 max-w-2xl">
            Calculate your total PM-KISAN benefit and see how investing
            ₹6,000/year in SIP, PPF, or savings account can build real wealth
            over time. ₹6,000 seems small — but compounding makes it powerful.
          </p>
        </div>
        <PMKisanCalculator />
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
            url="https://investingpro.in/calculators/pm-kisan"
            title="PM Kisan Calculator — Investment Growth from ₹6,000/Year"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "government-schemes",
              slug: "pm-kisan",
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
