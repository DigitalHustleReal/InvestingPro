import type { Metadata } from "next";
import { FIRECalculator } from "@/components/calculators/FIRECalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ExternalLink, Flame } from "lucide-react";
import SocialShareButtons from "@/components/common/SocialShareButtons";

export const metadata: Metadata = {
  title: "FIRE Calculator India 2026 — Financial Independence Retire Early | InvestingPro",
  description:
    "India's only FIRE calculator built for Indian inflation (6%), healthcare inflation (12%), and realistic Nifty returns. Calculate your FIRE corpus, Coast FIRE, Lean/Regular/Fat FIRE. Free, no registration.",
  keywords:
    "FIRE calculator India, financial independence retire early India, FIRE corpus calculator, coast FIRE calculator India, lean FIRE fat FIRE India, retirement corpus calculator India 2026",
  openGraph: {
    title: "FIRE Calculator India 2026 — Financial Independence Retire Early | InvestingPro",
    description:
      "India-specific FIRE calculator. Accounts for 6% inflation, 12% healthcare inflation, and ₹-adjusted withdrawal rates. Find your FIRE number now.",
    url: "https://investingpro.in/calculators/fire",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIRE Calculator India 2026 | InvestingPro",
    description:
      "India's only FIRE calculator with correct inflation rates, healthcare costs, and ₹ withdrawal assumptions.",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/fire",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "FIRE Calculator India",
  description:
    "India-specific Financial Independence Retire Early (FIRE) calculator accounting for 6% general inflation, 12% healthcare inflation, and Nifty 50 long-term returns.",
  provider: { "@type": "Organization", name: "InvestingPro", url: "https://investingpro.in" },
  serviceType: "FinancialCalculator",
  areaServed: { "@type": "Country", name: "India" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is FIRE and does it work in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FIRE (Financial Independence, Retire Early) is the goal of building enough wealth to live off investment returns without working. It absolutely works in India — but you need India-specific numbers. India's inflation (6%) and healthcare inflation (12%) are significantly higher than the US, so the safe withdrawal rate and corpus calculations differ from western tools.",
      },
    },
    {
      "@type": "Question",
      name: "How much corpus do I need to retire early in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The formula is: Annual expenses at retirement ÷ Safe Withdrawal Rate. For example, if you spend ₹60,000/month today and plan to retire in 20 years, inflation will push that to ~₹1.9 lakh/month. Annual expenses = ₹22.8 lakh. At 4% withdrawal rate: corpus needed = ₹5.7 crore. Use this FIRE calculator for your personalized number.",
      },
    },
    {
      "@type": "Question",
      name: "What is Coast FIRE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Coast FIRE is the amount you need to have invested TODAY such that — without adding any more money — it will grow to your full FIRE number by your retirement age. Once you hit your Coast number, you can stop aggressive saving and just 'coast' to retirement.",
      },
    },
    {
      "@type": "Question",
      name: "What is a safe withdrawal rate for India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The '4% rule' originated from US stock market data. For India, a 3.5–4.5% withdrawal rate is considered reasonable. Use 3.5% if you're retiring before 45 (very long retirement horizon). Use 4% for retirement at 45–55. Use 4.5–5% for retirement at 55–60. Our calculator defaults to 4% — you can adjust it.",
      },
    },
    {
      "@type": "Question",
      name: "What's the difference between Lean FIRE, Regular FIRE, and Fat FIRE in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Lean FIRE (₹30K/month): Covers basic needs in Tier 2/3 cities — frugal lifestyle. Regular FIRE: Maintains your current lifestyle. Fat FIRE (₹1.5–2L/month): Comfortable lifestyle with travel, dining out, private healthcare, and a generous buffer. The required corpus varies dramatically — from ₹1 crore (Lean) to ₹6+ crore (Fat FIRE in metros).",
      },
    },
  ],
};

export default function FIRECalculatorPage() {
  const breadcrumbs = [
    { label: "Home", url: "/" },
    { label: "Calculators", url: "/calculators" },
    { label: "FIRE Calculator", url: "/calculators/fire" },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.label,
      item: `https://investingpro.in${b.url}`,
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-6">
        <AutoBreadcrumbs />
      </div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-4">
            <Flame className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">India-Specific FIRE Calculator</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            FIRE Calculator — Financial Independence, Retire Early
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-4">
            The only FIRE calculator built for India — with correct 6% inflation, 12% healthcare
            inflation, and Nifty-adjusted returns. Find your FIRE corpus, Coast FIRE number, and
            Lean / Regular / Fat FIRE variants.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 mb-4">
            <span className="font-semibold text-amber-600">India-specific inflation rates</span>
            <span className="hidden sm:inline">•</span>
            <span>Healthcare inflation modeled separately</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Updated {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </span>
          </div>
          <div className="flex justify-center">
            <SocialShareButtons
              title="FIRE Calculator India — Financial Independence Retire Early"
              url="https://investingpro.in/calculators/fire"
              description="India's only FIRE calculator with correct inflation rates (6% general, 12% healthcare). Find your FIRE number."
            />
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <FinancialDisclaimer variant="compact" className="mb-6" />
        <FIRECalculator />
      </div>

      {/* FAQ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6">
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i}>
                <p className="font-semibold text-slate-900 dark:text-white mb-1">{faq.name}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {faq.acceptedAnswer.text}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Related calculators */}
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Related Calculators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "SIP Calculator", url: "/calculators/sip" },
                { name: "SWP Calculator", url: "/calculators/swp" },
                { name: "Lumpsum Calculator", url: "/calculators/lumpsum" },
                { name: "NPS Calculator", url: "/calculators/nps" },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  className="p-3 bg-slate-50 hover:bg-primary-50 border border-slate-200 hover:border-primary-300 rounded-xl text-sm font-medium text-slate-700 hover:text-primary-700 text-center transition-all"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Official Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "SEBI", desc: "Investor education & registration", url: "https://www.sebi.gov.in/" },
                { name: "NPS Trust", desc: "National Pension System", url: "https://www.npstrust.org.in/" },
                { name: "AMFI", desc: "Mutual fund performance data", url: "https://www.amfiindia.com/" },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 hover:shadow-md transition-all"
                >
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
      </div>
    </div>
  );
}
