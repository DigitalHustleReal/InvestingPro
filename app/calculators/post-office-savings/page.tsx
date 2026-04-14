import React from "react";
import type { Metadata } from "next";
import { PostOfficeSavingsCalculator } from "@/components/calculators/PostOfficeSavingsCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Post Office Savings Calculator 2026 — PPF, SSY, NSC, MIS, SCSS Rates | InvestingPro",
  description:
    "Free post office savings scheme calculator. Compare PPF, SSY, NSC, MIS, SCSS, KVP, RD, and TD rates side by side. Calculate maturity value, interest earned, and tax benefits for all 8 schemes.",
  keywords:
    "post office savings calculator, PPF calculator, SSY calculator, NSC calculator, MIS calculator, SCSS calculator, KVP calculator, post office interest rate 2026, post office scheme comparison",
  openGraph: {
    title: "Post Office Savings Calculator 2026 — All 8 Schemes Compared",
    description:
      "Compare all post office savings schemes — PPF, SSY, SCSS, NSC, KVP, MIS, TD, RD. See rates, maturity value, and tax benefits.",
    url: "https://investingpro.in/calculators/post-office-savings",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/post-office-savings",
  },
};

export default function PostOfficeSavingsPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Post Office Savings Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/post-office-savings",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which post office scheme gives highest interest rate in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SCSS (Senior Citizen Savings Scheme) and SSY (Sukanya Samriddhi Yojana) offer the highest rate at 8.2%. Next is NSC at 7.7%, KVP at 7.5%, MIS at 7.4%, PPF at 7.1%, TD (1Y) at 6.9%, and RD at 6.7%. Rates are revised quarterly by the government.",
        },
      },
      {
        "@type": "Question",
        name: "Which post office schemes are tax-free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Only PPF and Sukanya Samriddhi Yojana (SSY) have EEE (Exempt-Exempt-Exempt) tax status — meaning investment, interest, and maturity all are tax-free. All other schemes (NSC, SCSS, MIS, KVP, TD, RD) have taxable interest at your income tax slab rate.",
        },
      },
      {
        "@type": "Question",
        name: "What is the maximum deposit limit in post office schemes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PPF: ₹1.5L/year. SSY: ₹1.5L/year. SCSS: ₹30L total. MIS: ₹9L (single) or ₹15L (joint). NSC: No upper limit. KVP: No upper limit. TD: No upper limit. RD: Minimum ₹100/month, no max.",
        },
      },
      {
        "@type": "Question",
        name: "Which post office schemes give Section 80C benefit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PPF, SSY, NSC, SCSS, and 5-Year Time Deposit qualify for Section 80C deduction up to ₹1.5 lakh. MIS, KVP, RD, and 1-3 year TD do NOT qualify for 80C. For maximum tax saving, invest ₹1.5L in PPF or SSY (both tax-free + 80C).",
        },
      },
      {
        "@type": "Question",
        name: "Is post office FD better than bank FD?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Post office TD rates (6.9% for 1Y) are similar to SBI FD rates but lower than small finance bank FDs (8-9%). Advantage of post office: sovereign guarantee (safer than bank DICGC ₹5L limit), 80C benefit on 5Y TD, available in every village. Disadvantage: less flexible, no online access in many branches.",
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
            Post Office Savings Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Calculate returns for all 8 post office savings schemes — PPF, SSY,
            SCSS, NSC, KVP, MIS, TD, and RD. Compare interest rates, tax
            benefits, and maturity values. Government-guaranteed, zero-risk
            investments.
          </p>
        </div>
        <PostOfficeSavingsCalculator />
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
            url="https://investingpro.in/calculators/post-office-savings"
            title="Post Office Savings Calculator — All 8 Schemes Compared"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "government-schemes",
              slug: "post-office-savings",
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
