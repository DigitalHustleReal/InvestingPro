import type { Metadata } from "next";
import { EPS95Calculator } from "@/components/calculators/EPS95Calculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar, ExternalLink } from "lucide-react";
import SocialShareButtons from "@/components/common/SocialShareButtons";

export const metadata: Metadata = {
  title: "EPS-95 Pension Calculator India 2026 — Employee Pension Scheme EPFO | InvestingPro",
  description:
    "Calculate your EPS-95 monthly pension from EPFO. Enter years of service, pensionable salary, and service before 1995. Includes higher pension option (Supreme Court 2022 ruling). Free tool for private sector employees.",
  keywords:
    "EPS 95 pension calculator, employee pension scheme calculator, EPFO pension calculator India, EPS pension amount calculator, higher pension EPS 95, private sector pension India 2026",
  openGraph: {
    title: "EPS-95 Pension Calculator India 2026 — EPFO Employee Pension | InvestingPro",
    description: "Calculate your EPS-95 monthly pension. Includes higher pension option post Supreme Court 2022 ruling. Free EPFO pension calculator.",
    url: "https://investingpro.in/calculators/eps95-pension",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/eps95-pension" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How is EPS-95 pension calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "EPS-95 pension formula: Monthly Pension = (Pensionable Salary × Pensionable Service) / 70. Pensionable salary is capped at ₹15,000 unless you opted for higher pension. Pensionable service = total years of EPS contribution. Minimum pension is ₹1,000/month guaranteed by the government. You need at least 10 years of EPS contribution to be eligible for pension.",
      },
    },
    {
      "@type": "Question",
      name: "What is the higher pension option under EPS-95?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Supreme Court in November 2022 allowed employees to opt for higher pension based on their actual basic salary instead of the ₹15,000 cap. This significantly increases the monthly pension — for example, someone with ₹50,000 basic salary and 25 years of service would get ₹17,857/month instead of ₹5,357/month. However, employees must pay arrears of the additional contribution to EPFO. The deadline has passed — check EPFO portal for current options.",
      },
    },
    {
      "@type": "Question",
      name: "Can I withdraw EPS if I have less than 10 years of service?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. If you have less than 10 years of EPS contribution, you can withdraw the EPS balance (not entitled to monthly pension). The withdrawal amount is based on a table provided by EPFO. TDS is deducted if service is less than 5 years. Use Form 10C for EPS withdrawal.",
      },
    },
    {
      "@type": "Question",
      name: "When does EPS-95 pension start and what about family pension?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "EPS pension starts from age 58 (normal retirement). Early pension from age 50 is available at a reduced rate (3% per year before 58). You can defer to 60 for 4% higher pension per year. Family pension = 50% of member's pension for spouse after member's death. Children pension = 25% of member's pension for two children below 25 years.",
      },
    },
  ],
};

export default function EPS95Page() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://investingpro.in/" },
      { "@type": "ListItem", position: 2, name: "Calculators", item: "https://investingpro.in/calculators" },
      { "@type": "ListItem", position: 3, name: "EPS-95 Pension", item: "https://investingpro.in/calculators/eps95-pension" },
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
            <Briefcase className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">EPFO • Private Sector • Higher Pension Option</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            EPS-95 Pension Calculator
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-4">
            Calculate your monthly pension from EPFO&apos;s Employee Pension Scheme 1995.
            Includes higher pension option post Supreme Court 2022 ruling, past service pension,
            and family pension. For all private sector EPFO members.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 mb-4">
            <span className="font-semibold text-primary-600">Higher Pension Option included</span>
            <span className="hidden sm:inline">•</span>
            <span>Past service (pre-1995) calculation</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Updated {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </span>
          </div>
          <div className="flex justify-center">
            <SocialShareButtons
              title="EPS-95 Pension Calculator India — EPFO Employee Pension"
              url="https://investingpro.in/calculators/eps95-pension"
              description="Calculate your monthly EPS-95 pension from EPFO. Free tool for private sector employees."
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <FinancialDisclaimer variant="compact" className="mb-6" />
        <EPS95Calculator />
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
                { name: "EPFO Member Portal", desc: "Check your pension passbook & balance", url: "https://unifiedportal-mem.epfindia.gov.in/" },
                { name: "EPFO Official", desc: "Employee Provident Fund Organisation", url: "https://www.epfindia.gov.in/" },
                { name: "UAN Helpdesk", desc: "UAN activation & EPFO grievances", url: "https://uanmembers.epfoservices.in/" },
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
                { name: "Gratuity Calculator", url: "/calculators/gratuity" },
                { name: "Govt Pension (OPS/NPS)", url: "/calculators/govt-pension" },
                { name: "FIRE Calculator", url: "/calculators/fire" },
                { name: "SIP Calculator", url: "/calculators/sip" },
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
