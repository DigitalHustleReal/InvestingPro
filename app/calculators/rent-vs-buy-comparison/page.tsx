import React from "react";
import type { Metadata } from "next";
import { RentVsBuyComparisonCalculator } from "@/components/calculators/RentVsBuyComparisonCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import { TrustStrip } from "@/components/calculators/shared/TrustStrip";
import { PopularCalculators } from "@/components/calculators/shared/PopularCalculators";

export const metadata: Metadata = {
  title:
    "Rent vs Buy Comparison Calculator 2026 — Side-by-Side Net Wealth Analysis | InvestingPro",
  description:
    "Compare renting + investing vs buying property in India. Price-to-rent ratio, break-even year, stamp duty impact, EMI vs rent analysis over 10/15/20 years with net wealth comparison.",
  keywords:
    "rent vs buy calculator India, rent or buy house India 2026, price to rent ratio India, rent vs buy comparison, should I buy a house India, rent vs EMI calculator, property vs SIP, rent vs buy net wealth, home loan vs investment",
  openGraph: {
    title: "Rent vs Buy Comparison Calculator 2026 — Which Builds More Wealth?",
    description:
      "Side-by-side comparison: rent + invest vs buy property. Price-to-rent ratio, break-even analysis, stamp duty impact over 10/15/20 years.",
    url: "https://investingpro.in/calculators/rent-vs-buy-comparison",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/rent-vs-buy-comparison",
  },
};

export default function RentVsBuyComparisonPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Rent vs Buy Comparison Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/rent-vs-buy-comparison",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the price-to-rent ratio and how do I use it?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Price-to-rent ratio = Property price / Annual rent. Below 15x means buying is favourable (property is reasonably priced). 15-20x is a toss-up — depends on your situation. Above 20x means renting is better (property is overpriced relative to rental yields). In metros like Mumbai and Bangalore, ratios are typically 25-35x, making renting more financially sensible. In tier-2 cities, ratios can be 12-18x, making buying attractive.",
        },
      },
      {
        "@type": "Question",
        name: "How much does stamp duty really cost in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Stamp duty + registration charges together cost 5-8% of property value depending on state. Maharashtra: 6% stamp duty + 1% registration. Karnataka: 5.6% + 1%. Delhi: 4-6% + 1%. This is dead money — you never get it back. On an Rs 80 lakh flat, that's Rs 5-6 lakh gone on day one. This calculator factors in 7% (stamp duty + registration) as the India average.",
        },
      },
      {
        "@type": "Question",
        name: "Should I buy a house if my EMI is equal to my rent?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "EMI = rent is misleading because buying has additional costs: property tax (0.1-0.3% of property value per year), maintenance (1% per year), home insurance, and repairs. Your true monthly buying cost is typically 20-30% higher than just EMI. Plus, you're losing the opportunity cost of the down payment + stamp duty which could be invested. Always compare total cost of ownership, not just EMI vs rent.",
        },
      },
      {
        "@type": "Question",
        name: "What return can I expect from property appreciation in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "India-wide property appreciation averages 4-6% per year over long periods (NHB RESIDEX data). Premium locations in metros may see 6-8%, but many areas see just 2-4% or even negative real returns. After adjusting for maintenance, property tax, and depreciation of the building (land appreciates, building depreciates), effective returns are often 2-4%. Compare this with Nifty 50 at 12-14% CAGR — equity significantly outperforms real estate over 15+ years.",
        },
      },
      {
        "@type": "Question",
        name: "Is buying a house a good investment in India in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Buying a house is primarily a lifestyle decision, not purely a financial one. Financially, renting + investing in equity/mutual funds almost always wins over 15-20 years in Indian metros where price-to-rent ratios exceed 20x. However, buying provides emotional security, stability, no landlord hassle, and forced savings discipline. If you plan to live in the house for 10+ years, the location has good appreciation potential (5%+), and your EMI is under 40% of income, buying can work. For pure wealth creation, equity SIP wins.",
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
        <TrustStrip />
        <div className="mt-4 mb-6">
          <h1 className="font-display font-black text-[32px] sm:text-[40px] text-ink tracking-tight leading-[1.1]">
            Rent vs Buy Comparison Calculator
          </h1>
          <p className="text-sm text-ink-60 mt-1.5 max-w-2xl">
            Side-by-side net wealth comparison: renting + investing vs buying
            property. Includes price-to-rent ratio, stamp duty impact,
            break-even year, and 10/15/20 year projections with Indian costs.
          </p>
        </div>
        <RentVsBuyComparisonCalculator />
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
            url="https://investingpro.in/calculators/rent-vs-buy-comparison"
            title="Rent vs Buy — Which Builds More Wealth in India?"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "real-estate",
              slug: "rent-vs-buy-comparison",
            }}
          />
        </div>
        <div className="mt-8">
          <PopularCalculators
            currentSlug="rent-vs-buy-comparison"
            variant="strip"
          />
        </div>
        <FinancialDisclaimer />
      </div>
    </>
  );
}
