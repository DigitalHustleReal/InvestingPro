import type { Metadata } from "next";
import { GratuityCalculator } from "@/components/calculators/GratuityCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Calendar, ExternalLink } from "lucide-react";
import SocialShareButtons from "@/components/common/SocialShareButtons";

export const metadata: Metadata = {
  title: "Gratuity Calculator India 2026 + Leave Encashment — All Sectors | InvestingPro",
  description:
    "Calculate gratuity and leave encashment for central government, state government, and private sector employees. Includes tax exemption (₹20 lakh), Payment of Gratuity Act formula, and EL encashment rules. Free tool.",
  keywords:
    "gratuity calculator India 2026, leave encashment calculator, gratuity formula India, payment of gratuity act calculator, government employee gratuity calculator, private sector gratuity, EL encashment tax exemption",
  openGraph: {
    title: "Gratuity + Leave Encashment Calculator India 2026 | InvestingPro",
    description: "Calculate gratuity and leave encashment for govt and private sector. Tax exemption, formula, all sectors covered.",
    url: "https://investingpro.in/calculators/gratuity",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/gratuity" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the gratuity formula in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Under the Payment of Gratuity Act 1972: Gratuity = (Basic + DA / 26) × 15 × years of service. This gives 15 days' salary per year of service. For government employees: Gratuity = (Basic + DA / 4) × completed half-years (maximum 33 half-years = 16.5 years). Gratuity is tax-exempt up to ₹20 lakh.",
      },
    },
    {
      "@type": "Question",
      name: "How many years of service required for gratuity?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Under Payment of Gratuity Act: minimum 5 years of continuous service. For the 5th year, even if you work for more than 6 months (i.e., 4 years 7 months), it counts as 5 years — so you qualify. Central/state government employees follow their own service rules which may differ.",
      },
    },
    {
      "@type": "Question",
      name: "Is gratuity tax-free in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Gratuity is tax-exempt up to ₹20 lakh for employees covered under the Payment of Gratuity Act. For government employees, gratuity is fully tax-exempt (no upper limit). Amount above ₹20 lakh is added to income and taxed at applicable slab rate.",
      },
    },
    {
      "@type": "Question",
      name: "How is leave encashment taxed at retirement?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Government employees: leave encashment at retirement is fully tax-exempt up to ₹25 lakh. Private sector employees: exempt up to the least of — (a) ₹25 lakh (post Budget 2023), (b) actual leave encashment, (c) 10 months' salary, (d) cash equivalent of leave due. Leave encashment during service (before retirement) is fully taxable.",
      },
    },
  ],
};

export default function GratuityPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://investingpro.in/" },
      { "@type": "ListItem", position: 2, name: "Calculators", item: "https://investingpro.in/calculators" },
      { "@type": "ListItem", position: 3, name: "Gratuity Calculator", item: "https://investingpro.in/calculators/gratuity" },
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
            <Gift className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">Gratuity Act • Govt Rules • Leave Encashment</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Gratuity + Leave Encashment Calculator
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-4">
            Calculate terminal benefits for retirement or resignation. Covers central government,
            state government, and private sector employees under the Payment of Gratuity Act.
            Includes tax-exempt calculation (₹20 lakh gratuity + ₹25 lakh leave encashment).
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 mb-4">
            <span className="font-semibold text-primary-600">All 4 employment types</span>
            <span className="hidden sm:inline">•</span>
            <span>Tax exemption calculated automatically</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Updated {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </span>
          </div>
          <div className="flex justify-center">
            <SocialShareButtons
              title="Gratuity + Leave Encashment Calculator India 2026"
              url="https://investingpro.in/calculators/gratuity"
              description="Calculate gratuity and leave encashment for all sectors. Tax exemption included. Free tool."
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <FinancialDisclaimer variant="compact" className="mb-6" />
        <GratuityCalculator />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6">
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
                { name: "Payment of Gratuity Act", desc: "Ministry of Labour & Employment", url: "https://labour.gov.in/" },
                { name: "Income Tax — Exempt Income", desc: "Section 10(10) gratuity exemption", url: "https://incometaxindia.gov.in/" },
                { name: "EPFO", desc: "Gratuity & EPF services", url: "https://www.epfindia.gov.in/" },
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
                { name: "EPS-95 Pension", url: "/calculators/eps95-pension" },
                { name: "Govt Pension (OPS/NPS)", url: "/calculators/govt-pension" },
                { name: "FIRE Calculator", url: "/calculators/fire" },
                { name: "Tax Calculator", url: "/calculators/tax" },
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
