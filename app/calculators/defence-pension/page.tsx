import type { Metadata } from "next";
import { DefencePensionCalculator } from "@/components/calculators/DefencePensionCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Calendar, ExternalLink } from "lucide-react";
import SocialShareButtons from "@/components/common/SocialShareButtons";

export const metadata: Metadata = {
  title: "Defence Pension Calculator India 2026 — Army Navy Air Force OROP | InvestingPro",
  description:
    "Calculate Army, Navy, Air Force pension. Includes OROP, disability pension, war injury pension, ex-servicemen benefits (ECHS, CSD canteen). All ranks from Sepoy to General. Free calculator.",
  keywords:
    "defence pension calculator India, army pension calculator, navy pension calculator, air force pension calculator, OROP calculator India, military pension India, ex servicemen pension, disability pension defence",
  openGraph: {
    title: "Defence Pension Calculator India 2026 — Army Navy Air Force OROP | InvestingPro",
    description: "Calculate defence pension for all ranks. OROP, disability pension, ECHS, CSD canteen benefits included.",
    url: "https://investingpro.in/calculators/defence-pension",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/defence-pension" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How is defence pension calculated in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Defence pension = 50% of last drawn total pay (Basic Pay + Military Service Pay) for 33 qualifying years. For less than 33 years, it is proportionally reduced. Minimum service: 15 years for PBOR, 20 years for officers. DA is paid on top of service pension and revised twice a year. Plus disability element if applicable.",
      },
    },
    {
      "@type": "Question",
      name: "What is OROP (One Rank One Pension)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OROP means defence personnel of the same rank and same length of service receive the same pension, regardless of when they retired. Before OROP, officers retiring later got higher pension due to regular pay revisions. OROP equalizes this and is revised periodically. The most recent OROP revision was implemented in 2022 with ₹8,450 crore in arrears paid to retirees.",
      },
    },
    {
      "@type": "Question",
      name: "What is ECHS and how much does it save?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ex-Servicemen Contributory Health Scheme (ECHS) provides free medical treatment to ex-servicemen and their dependents at ECHS polyclinics and empanelled hospitals. The one-time contribution is nominal (₹30,000-₹67,000 depending on rank). This saves ex-servicemen an estimated ₹5,000-₹15,000/month compared to private health insurance for equivalent coverage.",
      },
    },
    {
      "@type": "Question",
      name: "What is disability pension in the Indian defence forces?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Disability pension has two components: (1) Service pension (as calculated normally), and (2) Disability element = 30% of pay for 100% disability, proportionally reduced for lower percentages. War injury pension is 1.5x the disability element. If disability is 20% or more but attributed to service, the soldier is eligible. Disability pension is exempt from income tax.",
      },
    },
  ],
};

export default function DefencePensionPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://investingpro.in/" },
      { "@type": "ListItem", position: 2, name: "Calculators", item: "https://investingpro.in/calculators" },
      { "@type": "ListItem", position: 3, name: "Defence Pension", item: "https://investingpro.in/calculators/defence-pension" },
    ],
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
            <Shield className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">Army · Navy · Air Force · OROP · Disability</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Defence Pension Calculator India
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-4">
            Calculate pension for all Army, Navy, and Air Force ranks — from Sepoy to General.
            Includes OROP, disability pension, war injury pension, ECHS, CSD canteen, and
            ex-servicemen benefits. Zero competition tool.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 mb-4">
            <span className="font-semibold text-primary-600">15 ranks covered</span>
            <span className="hidden sm:inline">•</span>
            <span>OROP + Disability + Gallantry awards</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Updated {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </span>
          </div>
          <div className="flex justify-center">
            <SocialShareButtons
              title="Defence Pension Calculator India — Army Navy Air Force OROP"
              url="https://investingpro.in/calculators/defence-pension"
              description="Calculate defence pension for all ranks. OROP, disability pension, ECHS benefits. Free tool."
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <FinancialDisclaimer variant="compact" className="mb-6" />
        <DefencePensionCalculator />
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
                { name: "PCDA (Pensions)", desc: "Principal Controller of Defence Accounts", url: "https://pcdapension.nic.in/" },
                { name: "ECHS", desc: "Ex-Servicemen Contributory Health Scheme", url: "https://www.echs.gov.in/" },
                { name: "Sainik Welfare", desc: "Kendriya Sainik Board Secretariat", url: "https://ksb.gov.in/" },
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
                { name: "Govt Pension (OPS/NPS)", url: "/calculators/govt-pension" },
                { name: "EPS-95 Pension", url: "/calculators/eps95-pension" },
                { name: "Gratuity Calculator", url: "/calculators/gratuity" },
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
