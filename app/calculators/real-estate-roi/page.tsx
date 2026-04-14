import React from "react";
import type { Metadata } from "next";
import { RealEstateROICalculator } from "@/components/calculators/RealEstateROICalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Real Estate ROI Calculator India 2026 — Property vs Equity SIP Comparison | InvestingPro",
  description:
    "Free real estate ROI calculator for India. Calculate net rental yield, capital gains, total cost of ownership (stamp duty + EMI + maintenance). Compare property returns with equity SIP. City-wise scenarios for Mumbai, Bangalore, Tier-2.",
  keywords:
    "real estate ROI calculator India, property investment calculator, rental yield calculator India, property vs SIP comparison, real estate vs mutual funds, stamp duty calculator, property appreciation calculator, home loan vs SIP",
  openGraph: {
    title: "Real Estate ROI Calculator India 2026",
    description:
      "Calculate property ROI with rental yield, appreciation & compare with equity SIP returns.",
    url: "https://investingpro.in/calculators/real-estate-roi",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/real-estate-roi",
  },
};

export default function RealEstateROIPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Real Estate ROI Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/real-estate-roi",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the average rental yield in Indian cities?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mumbai: 2-2.5% (lowest in India due to sky-high prices). Delhi NCR: 2.5-3%. Bangalore: 3-4% (best among metros for tech hubs). Pune/Hyderabad: 3-4%. Tier-2 cities (Jaipur, Lucknow, Coimbatore): 5-7%. Commercial property: 6-9% but higher ticket size. These are gross yields — net yield after maintenance, vacancy, and tax is 30-40% lower.",
        },
      },
      {
        "@type": "Question",
        name: "Is buying property better than investing in mutual funds in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pure returns: Nifty 50 has given 12-14% CAGR over 15+ years vs property appreciation of 5-8% in most cities. However, property offers leverage (you buy ₹1Cr property with ₹20L down payment), rental income, and tax benefits on home loan. After accounting for stamp duty, maintenance, loan interest, and illiquidity, equity SIPs often outperform on a like-for-like basis. Property wins only if you get a great deal in a high-growth area.",
        },
      },
      {
        "@type": "Question",
        name: "What are the hidden costs of buying property in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Stamp duty: 5-7% (varies by state, Maharashtra 6%, Karnataka 5.6%). Registration: 1%. GST on under-construction: 5% (no ITC). Brokerage: 1-2%. Home loan processing: 0.5-1%. Annual maintenance: ₹3,000-15,000/month for society charges. Property tax: ₹5,000-50,000/year. Home insurance: ₹5,000-15,000/year. Interior and furnishing: ₹5-15 lakh. Total hidden cost can be 15-25% of property price.",
        },
      },
      {
        "@type": "Question",
        name: "How much property appreciation can I expect in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Realistic appreciation: Tier-1 metros 4-6% per year (Mumbai, Delhi barely 3-4% in last 5 years). Growing IT hubs: 6-8% (parts of Bangalore, Hyderabad). Tier-2 growth corridors: 8-12% (but risky, builder delays, low liquidity). New infrastructure areas (metro, highway): 10-15% short-term bump. Overall, Indian real estate has underperformed Nifty in the last decade. Do not assume 15-20% appreciation — those days are gone for most markets.",
        },
      },
      {
        "@type": "Question",
        name: "What is a good net rental yield for Indian property investment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A net rental yield above 3% is decent for India. Above 5% is excellent (mostly Tier-2 cities or commercial). Below 2% (most of Mumbai) means you are buying purely for appreciation. For context: FD post-tax gives 4.9%, debt funds give 5-6%, and dividend stocks give 3-6%. If your net rental yield is below 3%, you need strong appreciation (7%+) to justify the investment over financial assets.",
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
            Real Estate ROI Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Calculate your property&apos;s true ROI including rental yield,
            appreciation, stamp duty, loan interest, and maintenance. Compare
            with equity SIP returns to make a data-driven decision. No emotional
            buying — know the real numbers.
          </p>
        </div>
        <RealEstateROICalculator />
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
            url="https://investingpro.in/calculators/real-estate-roi"
            title="Real Estate ROI Calculator — Property vs Equity SIP"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "loans",
              slug: "real-estate-roi",
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
