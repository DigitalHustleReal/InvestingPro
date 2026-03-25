import type { Metadata } from "next";
import { NRIFDComparison } from "@/components/calculators/NRIFDComparison";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Calendar, ExternalLink } from "lucide-react";
import SocialShareButtons from "@/components/common/SocialShareButtons";

export const metadata: Metadata = {
  title: "NRI FD Calculator India 2026 — FCNR vs NRE vs NRO Comparison | InvestingPro",
  description:
    "Compare FCNR, NRE, and NRO fixed deposits side-by-side. Calculate returns in USD/GBP/EUR with Indian tax impact (TDS, DTAA), currency risk, and repatriation limits. Best NRI FD calculator India.",
  keywords:
    "NRI FD calculator India, FCNR vs NRE vs NRO comparison, NRE FD interest rate 2026, FCNR deposit calculator, NRO FD tax calculator India, best NRI fixed deposit India, NRI FD comparison tool",
  openGraph: {
    title: "NRI FD Calculator India 2026 — FCNR vs NRE vs NRO | InvestingPro",
    description: "Compare FCNR, NRE, NRO FDs with tax impact, currency risk, and DTAA benefit. Best NRI fixed deposit comparison tool.",
    url: "https://investingpro.in/calculators/nri-fd",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/nri-fd" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the difference between FCNR, NRE, and NRO deposits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FCNR (Foreign Currency Non-Resident) is held in foreign currency — no INR conversion risk, but interest is taxable in India at 30%. NRE (Non-Resident External) is held in INR — interest is completely tax-free in India, fully repatriable. Best for NRIs parking foreign earnings. NRO (Non-Resident Ordinary) is held in INR — interest taxable at 30% TDS (reducible via DTAA), repatriation capped at USD 1M/year. Suitable for India-sourced income like rent or dividends.",
      },
    },
    {
      "@type": "Question",
      name: "Is NRE FD interest tax-free in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. NRE FD interest is fully exempt from Indian income tax under Section 10(4)(ii) of the Income Tax Act. No TDS is deducted. However, this income may be taxable in your country of residence (USA, UK, etc.) — check your local tax laws. NRO interest, in contrast, is taxable in India at 30% TDS.",
      },
    },
    {
      "@type": "Question",
      name: "When should I choose FCNR over NRE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Choose FCNR when: (1) You expect the Indian Rupee to depreciate significantly (3%+ per year) — FCNR protects you from INR weakening since your principal stays in USD/GBP/EUR. (2) You need certainty about the foreign-currency value of your deposit at maturity. (3) You're not sure you want exposure to INR. Choose NRE when you expect INR to stay stable or appreciate, and you want higher Indian interest rates with zero Indian tax.",
      },
    },
    {
      "@type": "Question",
      name: "What is DTAA benefit for NRO FD?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "India has Double Tax Avoidance Agreements (DTAA) with 90+ countries. Under DTAA, the TDS rate on NRO FD interest can be reduced from 30% to 10-15% for residents of USA, UK, Canada, Australia, Singapore, UAE, etc. To claim DTAA benefit, submit Form 10F + Tax Residency Certificate to your bank before interest credit. This can significantly improve NRO returns.",
      },
    },
    {
      "@type": "Question",
      name: "Can NRE FD principal be repatriated freely?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Both NRE FD principal and interest can be freely repatriated (sent abroad) without any limit. NRO FD repatriation is capped at USD 1 million per financial year after paying applicable taxes and obtaining a CA certificate (Form 15CB and 15CA). FCNR principal and interest are also fully repatriable.",
      },
    },
  ],
};

export default function NRIFDPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://investingpro.in/" },
      { "@type": "ListItem", position: 2, name: "Calculators", item: "https://investingpro.in/calculators" },
      { "@type": "ListItem", position: 3, name: "NRI FD Comparison", item: "https://investingpro.in/calculators/nri-fd" },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-6"><AutoBreadcrumbs /></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-4 py-1.5 mb-4">
            <Globe className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">FCNR • NRE • NRO • DTAA • Currency Risk</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            NRI FD Comparison — FCNR vs NRE vs NRO
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-4">
            Compare all three NRI fixed deposit options side-by-side. Calculates exact returns
            in your foreign currency after Indian tax, TDS, DTAA benefits, and INR depreciation.
            USD, GBP, EUR, CAD, AUD, SGD supported.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 mb-4">
            <span className="font-semibold text-primary-600">6 currencies</span>
            <span className="hidden sm:inline">•</span>
            <span>11 DTAA countries</span>
            <span className="hidden sm:inline">•</span>
            <span>Currency risk analysis</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Updated {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </span>
          </div>
          <div className="flex justify-center">
            <SocialShareButtons
              title="NRI FD Calculator India — FCNR vs NRE vs NRO Comparison"
              url="https://investingpro.in/calculators/nri-fd"
              description="Compare FCNR, NRE, NRO FDs with tax, DTAA, and currency risk analysis. Free tool."
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <FinancialDisclaimer variant="compact" className="mb-6" />
        <NRIFDComparison />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6">
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader><CardTitle className="text-xl font-bold text-slate-900 dark:text-white">FAQ</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i}>
                <p className="font-semibold text-slate-900 dark:text-white mb-1">{faq.name}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader><CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Official Resources</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "RBI NRI Guidelines", desc: "FEMA rules for NRI accounts", url: "https://www.rbi.org.in/Scripts/NRIPage.aspx" },
                { name: "Income Tax India", desc: "Section 10(4) NRE exemption", url: "https://incometaxindia.gov.in/" },
                { name: "FEMA FAQ", desc: "Foreign exchange rules for NRIs", url: "https://www.rbi.org.in/commonperson/English/Scripts/FAQs.aspx?Id=548" },
              ].map((link) => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all">
                  <ExternalLink className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{link.name}</p>
                    <p className="text-xs text-slate-500">{link.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader><CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Related Calculators</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "FD Calculator", url: "/calculators/fd" },
                { name: "Tax Calculator", url: "/calculators/tax" },
                { name: "SWP Calculator", url: "/calculators/swp" },
                { name: "FIRE Calculator", url: "/calculators/fire" },
              ].map((link) => (
                <a key={link.name} href={link.url}
                  className="p-3 bg-slate-50 hover:bg-primary-50 border border-slate-200 hover:border-primary-300 rounded-xl text-sm font-medium text-slate-700 hover:text-primary-700 text-center transition-all">
                  {link.name}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
