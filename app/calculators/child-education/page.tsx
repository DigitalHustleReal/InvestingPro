import React from "react";
import type { Metadata } from "next";
import { ChildEducationCalculator } from "@/components/calculators/ChildEducationCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Child Education Cost Calculator India 2026 — IIT/IIM/Abroad Planner | InvestingPro",
  description:
    "Free child education cost calculator for India. Plan for IIT, IIM, MBBS, or abroad education. See future cost with education inflation, monthly SIP needed, and lumpsum investment required. Compare goals side-by-side.",
  keywords:
    "child education calculator India, education cost planner, IIT fees calculator, IIM cost calculator, abroad education cost, education SIP calculator, Sukanya Samriddhi, child education fund, education inflation India 2026",
  openGraph: {
    title:
      "Child Education Cost Calculator India 2026 — IIT/IIM/Abroad Planner",
    description:
      "Plan your child's education fund. Calculate future cost with inflation, SIP needed, and compare IIT/IIM/Abroad goals.",
    url: "https://investingpro.in/calculators/child-education",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/child-education",
  },
};

export default function ChildEducationPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Child Education Cost Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/child-education",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does IIT education cost in India in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "IIT B.Tech total cost in 2026 is approximately ₹10-12 lakh for 4 years (tuition + hostel + living). With education inflation of 10% per year, this could be ₹25-30 lakh in 10 years. SC/ST students get fee waivers. Private IITs and NITs cost ₹15-20 lakh.",
        },
      },
      {
        "@type": "Question",
        name: "How much SIP is needed for child's education in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For IIT (₹10L current cost), starting SIP at child's age 5: ~₹3,500-4,500/month in equity mutual funds (12% returns). For IIM MBA (₹25L), start at age 5: ~₹5,000-7,000/month. For abroad undergrad (₹40L), ~₹12,000-15,000/month. Starting earlier dramatically reduces the monthly amount needed.",
        },
      },
      {
        "@type": "Question",
        name: "Is Sukanya Samriddhi Yojana good for education planning?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sukanya Samriddhi Yojana (SSY) offers 8.2% interest (2026), tax-free returns under Section 80C (up to ₹1.5L/year), and guaranteed government backing. It's excellent for risk-free education savings for daughters. However, it matures at age 21 and allows 50% withdrawal at age 18 for education. For higher returns, combine SSY with equity mutual fund SIPs.",
        },
      },
      {
        "@type": "Question",
        name: "What is education inflation rate in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Education inflation in India runs 8-12% per year — much higher than general CPI inflation (5-6%). IIT/IIM fees have increased 10-15% annually. Private medical colleges see 12-15% inflation. Abroad education costs rise 5-8% in local currency, but INR depreciation adds another 3-4%. Always plan with 10% education inflation minimum.",
        },
      },
      {
        "@type": "Question",
        name: "When should I start saving for my child's education?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Start as early as possible — ideally from birth or age 1. Starting at birth vs age 10 can reduce your monthly SIP by 60-70% due to compounding. For a ₹40L abroad education goal, starting at birth needs ~₹5,000/month SIP, but starting at age 10 needs ~₹18,000/month. Even ₹1,000/month from day one grows significantly over 18 years.",
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
            Child Education Cost Calculator
          </h1>
          <p className="text-sm text-ink-60 mt-1.5 max-w-2xl">
            Plan your child&apos;s education fund for IIT, IIM, MBBS, or abroad
            studies. See future costs with education inflation and calculate the
            exact SIP or lumpsum needed today. Start early — every year of delay
            doubles the effort.
          </p>
        </div>
        <ChildEducationCalculator />
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
            url="https://investingpro.in/calculators/child-education"
            title="Child Education Cost Calculator — IIT/IIM/Abroad Planner"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "planning",
              slug: "child-education",
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
