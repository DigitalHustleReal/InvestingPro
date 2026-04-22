import React from "react";
import type { Metadata } from "next";
import { CryptoTaxCalculator } from "@/components/calculators/CryptoTaxCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Crypto Tax Calculator India 2026 — Calculate 30% Tax + 1% TDS on Crypto | InvestingPro",
  description:
    "Free crypto tax calculator for India. Calculate 30% flat tax on crypto gains, 1% TDS, health & education cess, and net profit. Section 115BBH rules explained. No loss set-off allowed.",
  keywords:
    "crypto tax calculator India, cryptocurrency tax India 2026, 30% crypto tax, 1% TDS crypto, Section 115BBH, Bitcoin tax India, crypto capital gains tax, VDA tax calculator",
  openGraph: {
    title: "Crypto Tax Calculator India 2026",
    description:
      "Calculate 30% flat tax on crypto gains with 1% TDS and cess. Know your exact crypto tax liability.",
    url: "https://investingpro.in/calculators/crypto-tax",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/crypto-tax" },
};

export default function CryptoTaxPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Crypto Tax Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/crypto-tax",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the crypto tax rate in India 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "India levies a flat 30% tax on all crypto/VDA gains under Section 115BBH, plus 4% health & education cess (effective 31.2%). This applies regardless of your income slab — whether you earn ₹5L or ₹50L, crypto gains are taxed at flat 30%. Additionally, 1% TDS is deducted on crypto transactions above ₹10,000 under Section 194S.",
        },
      },
      {
        "@type": "Question",
        name: "Can I offset crypto losses against other income in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Under Section 115BBH, crypto/VDA losses CANNOT be set off against any other income — not even other crypto gains. If you lose ₹5L on Bitcoin and gain ₹3L on Ethereum, you still pay 30% tax on the ₹3L Ethereum gain. Losses also cannot be carried forward to future years. This is the harshest part of India's crypto tax regime.",
        },
      },
      {
        "@type": "Question",
        name: "What is 1% TDS on crypto in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Under Section 194S, a 1% TDS (Tax Deducted at Source) is applied on all crypto/VDA transfers exceeding ₹10,000 per transaction. This is deducted by the exchange or buyer. The TDS can be claimed as a credit when filing your Income Tax Return (ITR). Note: TDS is on the total transaction value, not just the profit.",
        },
      },
      {
        "@type": "Question",
        name: "Can I deduct transaction fees from crypto tax?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Under Section 115BBH, the ONLY deduction allowed is the cost of acquisition (purchase price). Transaction fees, exchange commissions, gas fees, internet costs, and hardware expenses CANNOT be deducted from crypto gains. This makes India's crypto tax among the most restrictive globally.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to pay crypto tax even if I don't withdraw to bank?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Tax liability arises on 'transfer' of crypto — which includes selling for INR, exchanging for another crypto, or using crypto for payment. Even crypto-to-crypto swaps are taxable events. You don't need to withdraw to your bank account for tax to apply. Each swap/sale is a separate taxable event.",
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
            Crypto Tax Calculator India
          </h1>
          <p className="text-sm text-ink-60 mt-1.5 max-w-2xl">
            Calculate your exact crypto tax under India's 30% flat tax regime
            (Section 115BBH). Includes 1% TDS calculation, cess, and net profit
            analysis. No loss set-off, no deductions except cost of acquisition.
          </p>
        </div>
        <CryptoTaxCalculator />
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
            url="https://investingpro.in/calculators/crypto-tax"
            title="Crypto Tax Calculator India — 30% Tax + 1% TDS"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "tax",
              slug: "crypto-tax",
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
