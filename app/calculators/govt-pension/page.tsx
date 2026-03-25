import type { Metadata } from "next";
import { GovtPensionCalculator } from "@/components/calculators/GovtPensionCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar, ExternalLink } from "lucide-react";
import SocialShareButtons from "@/components/common/SocialShareButtons";

export const metadata: Metadata = {
  title: "Government Employee Pension Calculator India 2026 — OPS vs NPS | InvestingPro",
  description:
    "Calculate your government pension under Old Pension Scheme (OPS) and New Pension Scheme (NPS). 7th Pay Commission pay matrix, commutation, DA, gratuity, CGHS benefits. Free tool for central and state govt employees.",
  keywords:
    "government employee pension calculator, OPS vs NPS calculator India, 7th pay commission pension, central government pension calculator, old pension scheme calculator, NPS pension calculator govt employee",
  openGraph: {
    title: "Government Employee Pension Calculator — OPS vs NPS 2026 | InvestingPro",
    description:
      "Compare Old Pension Scheme and NPS for government employees. 7th Pay Commission based. DA, commutation, gratuity included.",
    url: "https://investingpro.in/calculators/govt-pension",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/govt-pension" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the formula for government pension in India (OPS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Under OPS (Old Pension Scheme), basic pension = 50% of last drawn basic pay for 33 years of qualifying service. For less than 33 years, it is proportionally reduced. Minimum pension is ₹9,000/month. Dearness Allowance (DA) is paid on top of basic pension and revised twice a year to offset inflation.",
      },
    },
    {
      "@type": "Question",
      name: "What is commutation of pension and should I opt for it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Commutation allows you to receive up to 40% of your pension as a lump sum at retirement. The lump sum = commuted portion × commutation factor (based on age) × 12. In return, your monthly pension reduces by the commuted amount for ~15 years (when it is deemed recovered). After 15 years, full pension resumes. If you need capital for a specific purpose, commutation makes sense. If you don't need the lump sum, avoid commuting — the monthly loss over 15 years often exceeds the lump sum received.",
      },
    },
    {
      "@type": "Question",
      name: "How is NPS pension calculated for government employees?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NPS corpus = accumulated contributions (employee 10% + employer 14% of basic+DA) invested over the service period. At retirement: 60% of corpus is tax-free lump sum; 40% is used to buy an annuity. Monthly pension = annuity corpus × annuity rate (typically 5.5-7% p.a.) / 12. Unlike OPS, NPS pension is not inflation-indexed and depends on market returns.",
      },
    },
    {
      "@type": "Question",
      name: "Is OPS better than NPS for government employees?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OPS offers guaranteed, inflation-linked monthly income (via DA revision) for life — zero market risk. NPS offers higher lump sum potential but pension amount is market-dependent. For employees who value security and predictable income: OPS wins. For younger employees with a long accumulation phase and who prefer higher lump sum: NPS may deliver more. Several states have reverted to OPS — the debate is ongoing politically.",
      },
    },
  ],
};

export default function GovtPensionPage() {
  const breadcrumbs = [
    { label: "Home", url: "/" },
    { label: "Calculators", url: "/calculators" },
    { label: "Govt Pension Calculator", url: "/calculators/govt-pension" },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, i) => ({
      "@type": "ListItem", position: i + 1, name: b.label,
      item: `https://investingpro.in${b.url}`,
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-6">
        <AutoBreadcrumbs />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-4 py-1.5 mb-4">
            <Building2 className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">7th Pay Commission • OPS vs NPS</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Government Employee Pension Calculator
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-4">
            Calculate your exact pension under Old Pension Scheme (OPS) and New Pension Scheme (NPS).
            Includes DA, commutation, gratuity, CGHS benefits — based on 7th Pay Commission pay matrix.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 mb-4">
            <span className="font-semibold text-primary-600">All 16 pay levels covered</span>
            <span className="hidden sm:inline">•</span>
            <span>OPS vs NPS side-by-side comparison</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Updated {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </span>
          </div>
          <div className="flex justify-center">
            <SocialShareButtons
              title="Government Employee Pension Calculator — OPS vs NPS India"
              url="https://investingpro.in/calculators/govt-pension"
              description="Calculate your govt pension under OPS and NPS. 7th Pay Commission based. Free tool."
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <FinancialDisclaimer variant="compact" className="mb-6" />
        <GovtPensionCalculator />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6">
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">FAQ</CardTitle>
          </CardHeader>
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
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Official Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "CPC 7th Pay Commission", desc: "Official Pay Matrix & Rules", url: "https://www.7thpaycommission.in/" },
                { name: "PCDA (Pensions)", desc: "Principal CDA Pensions Allahabad", url: "https://pcdapension.nic.in/" },
                { name: "NPS Trust", desc: "NPS corpus & scheme details", url: "https://www.npstrust.org.in/" },
              ].map((link) => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 hover:shadow-md transition-all">
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
                { name: "Defence Pension", url: "/calculators/defence-pension" },
                { name: "EPS-95 Pension", url: "/calculators/eps95-pension" },
                { name: "Gratuity Calculator", url: "/calculators/gratuity" },
                { name: "NPS Calculator", url: "/calculators/nps" },
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
