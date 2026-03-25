import type { Metadata } from "next";
import { PensionCommutationAdvisor } from "@/components/calculators/PensionCommutationAdvisor";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, ExternalLink } from "lucide-react";
import SocialShareButtons from "@/components/common/SocialShareButtons";

export const metadata: Metadata = {
  title: "Pension Commutation Calculator India 2026 — Should You Commute? 30-Year Projection | InvestingPro",
  description:
    "India's most detailed pension commutation advisor for central govt employees. Calculate lump sum, DA-adjusted breakeven, 30-year cumulative projection with 8th Pay Commission modelling, 9 investment scenarios, and a PensionSmart Score questionnaire.",
  keywords:
    "pension commutation calculator India, should I commute pension, OPS commutation lump sum, pension commutation breakeven, 8th pay commission pension, government employee pension calculator India 2026, pension commutation factor table",
  openGraph: {
    title: "Pension Commutation Calculator India 2026 — 30-Year Projection + PensionSmart Score",
    description:
      "Should you commute your pension? DA-adjusted breakeven, 8th CPC impact, investment scenarios, PensionSmart Score. The most detailed commutation tool in India.",
    url: "https://investingpro.in/calculators/pension-commutation",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/pension-commutation" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is pension commutation for central govt employees in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pension commutation means converting part of your monthly pension into a lump sum upfront. Under CCS Pension Rules, a central govt employee can commute up to 40% of their basic pension. The lump sum = commuted portion × commutation factor × 12. The commuted amount is restored after 15 years from the date of retirement (or commutation date, whichever is later). The key trade-off: you get a large sum now but receive a permanently reduced monthly pension for 15 years.",
      },
    },
    {
      "@type": "Question",
      name: "How is the commutation lump sum calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Formula: Lump sum = (Basic Pension × Commutation %) × Factor × 12. The commutation factor depends on your age at the next birthday after retirement. For a 60-year-old (factor at 61 = 3.784 in the post-2008 table): if basic pension = ₹50,000 and commutation = 40%, then commuted portion = ₹20,000, lump sum = ₹20,000 × 3.784 × 12 = ₹9,08,160. The post-2008 revised table gives lower lump sums than the pre-2008 (6th CPC) table. Some state governments still use the older table.",
      },
    },
    {
      "@type": "Question",
      name: "What is the DA multiplier effect in pension commutation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The real monthly loss is NOT just the commuted pension amount. It grows as DA rises. Formula: Monthly loss = Commuted basic × (1 + DA%). Example: You commuted ₹20,000/month. At 50% DA, actual monthly loss = ₹20,000 × 1.50 = ₹30,000. As DA rises to 100%, loss = ₹20,000 × 2.00 = ₹40,000. Most pension advisors quote only the nominal loss. This calculator shows the full growing cost year by year, making the breakeven longer than the commonly cited 12–15 years.",
      },
    },
    {
      "@type": "Question",
      name: "How does the 8th Pay Commission affect commutation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "After each Pay Commission, your basic pension is revised by the fitment factor (e.g., 2.2× for the expected 8th CPC). Crucially, since your commuted portion was 40% of your pre-revision basic pension, after revision it becomes 40% of the new (higher) basic. So the commuted portion also increases proportionally. DA resets to 0 after each CPC. Both your pension and your monthly loss from commutation increase by the same fitment factor — commutation doesn't become less painful after a pay revision.",
      },
    },
    {
      "@type": "Question",
      name: "When does commuted pension get restored?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Commuted pension is restored 15 years from the date of commutation (for those who retired after 1.4.1985). If you commuted at retirement (age 60), restoration happens at age 75. After restoration, your full basic pension is reinstated. Note: DA arrears during the 15-year commutation period are calculated on the full (un-commuted) basic pension, so you don't lose DA on the commuted portion — only the basic is reduced.",
      },
    },
    {
      "@type": "Question",
      name: "Should I commute my pension? What does the PensionSmart Score measure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Commutation makes financial sense when: (1) You have a clear, high-return use for the lump sum (pay off 12%+ loan, equity investment), (2) You have shorter life expectancy, (3) The next Pay Commission is far away, and (4) You're disciplined about investing. Commutation is risky when: you'll park money in a savings account, you're in excellent health, the CPC is imminent (pension hike will increase your loss), or you have no investment plan. The PensionSmart Score (0–100) weighs 7 factors and recommends an optimal commutation percentage, not a binary yes/no.",
      },
    },
  ],
};

export default function PensionCommutationPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://investingpro.in/" },
      { "@type": "ListItem", position: 2, name: "Calculators", item: "https://investingpro.in/calculators" },
      { "@type": "ListItem", position: 3, name: "Pension Commutation Advisor", item: "https://investingpro.in/calculators/pension-commutation" },
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
            <BarChart3 className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">OPS • Commutation • 8th CPC • PensionSmart Score</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Pension Commutation Advisor
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-4">
            India&apos;s most detailed commutation tool for central govt employees. Calculate the
            real cost using DA-adjusted breakeven, model the 8th Pay Commission impact,
            compare 9 investment scenarios, and get a personalised PensionSmart Score.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 mb-4">
            <span className="font-semibold text-primary-600">4 tools in one</span>
            <span className="hidden sm:inline">•</span>
            <span>DA multiplier modelled</span>
            <span className="hidden sm:inline">•</span>
            <span>8th CPC aware</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Updated {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </span>
          </div>
          <div className="flex justify-center">
            <SocialShareButtons
              title="Pension Commutation Advisor — 30-Year Projection + PensionSmart Score"
              url="https://investingpro.in/calculators/pension-commutation"
              description="India's most detailed pension commutation tool. DA-adjusted breakeven, 8th CPC modelling, 9 investment scenarios."
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <FinancialDisclaimer variant="compact" className="mb-6" />
        <PensionCommutationAdvisor />
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
                { name: "CCS Pension Rules 1981", desc: "Commutation rules under Schedule IV", url: "https://doppw.gov.in/en/ccs-pension-rules" },
                { name: "CPAO Circulars", desc: "Central Pension Accounting Office", url: "https://cpao.nic.in/" },
                { name: "7th CPC Pension Calculator", desc: "Official pay commission reference", url: "https://7cpc.india.gov.in/" },
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
                { name: "Govt Pension (OPS vs NPS)", url: "/calculators/govt-pension" },
                { name: "Defence Pension + OROP", url: "/calculators/defence-pension" },
                { name: "EPS-95 Pension", url: "/calculators/eps95-pension" },
                { name: "Gratuity + Leave Encashment", url: "/calculators/gratuity" },
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
