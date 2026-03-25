import type { Metadata } from "next";
import { MFOverlapperCalculator } from "@/components/calculators/MFOverlapperCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ExternalLink, GitMerge } from "lucide-react";
import SocialShareButtons from "@/components/common/SocialShareButtons";

export const metadata: Metadata = {
  title: "Mutual Fund Overlap Calculator India 2026 — Check Portfolio Overlap | InvestingPro",
  description:
    "Find hidden overlap in your mutual fund portfolio. Compare 2–5 Indian mutual funds to detect duplicate holdings, measure diversification score, and avoid over-concentration. Free tool, no registration needed.",
  keywords:
    "mutual fund overlap calculator, portfolio overlap India, MF overlap check, fund diversification checker, mutual fund portfolio analysis, duplicate holdings MF India",
  openGraph: {
    title: "Mutual Fund Overlap Calculator India 2026 | InvestingPro",
    description:
      "Check if your mutual funds are actually diversified. Compare holdings across 2–5 funds instantly.",
    url: "https://investingpro.in/calculators/mf-overlapper",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mutual Fund Overlap Calculator India 2026 | InvestingPro",
    description:
      "Check if your mutual funds are actually diversified. Compare holdings across 2–5 funds instantly.",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/mf-overlapper",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "Mutual Fund Overlap Calculator",
  description:
    "Free tool to detect mutual fund portfolio overlap in India. Compare up to 5 funds, identify duplicate stock holdings, and measure diversification.",
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
      name: "What is mutual fund overlap?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mutual fund overlap occurs when two or more funds you own hold the same underlying stocks. High overlap means you're not truly diversified — you're just paying multiple expense ratios for essentially the same portfolio.",
      },
    },
    {
      "@type": "Question",
      name: "How much overlap is acceptable?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An overlap below 20-25% is generally acceptable. Above 40-50% means significant duplication. Above 60% means you should consolidate or replace one fund with a different category (e.g., add a Mid Cap or International fund to reduce large-cap concentration).",
      },
    },
    {
      "@type": "Question",
      name: "Which fund combinations have the most overlap in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Large Cap funds and ELSS funds based on Nifty 50/Sensex tend to have the highest mutual overlap in India — all holding HDFC Bank, Reliance, ICICI Bank, Infosys. Index funds vs active large cap funds typically show 60-80% overlap.",
      },
    },
    {
      "@type": "Question",
      name: "How do I reduce overlap in my portfolio?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Replace a duplicate large cap fund with a Mid Cap, Small Cap, International, or Flexi Cap fund. Parag Parikh Flexi Cap (includes US stocks), SBI Small Cap, or HDFC Mid-Cap are popular choices that reduce Nifty-heavy overlap.",
      },
    },
  ],
};

export default function MFOverlapperPage() {
  const breadcrumbs = [
    { label: "Home", url: "/" },
    { label: "Calculators", url: "/calculators" },
    { label: "MF Overlapper", url: "/calculators/mf-overlapper" },
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
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-4 py-1.5 mb-4">
            <GitMerge className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">India&apos;s First MF Overlap Tool</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Mutual Fund Overlap Calculator
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-4">
            Find out if your SIP investments are truly diversified — or if you&apos;re paying for the same
            stocks twice. Compare up to 5 mutual funds and get a Diversification Score instantly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 mb-4">
            <span className="font-semibold text-primary-600">18 popular Indian funds</span>
            <span className="hidden sm:inline">•</span>
            <span>Covers Large, Mid, Small Cap, ELSS, Flexi Cap &amp; Index</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Updated {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </span>
          </div>
          <div className="flex justify-center">
            <SocialShareButtons
              title="Mutual Fund Overlap Calculator India — Check if your funds overlap"
              url="https://investingpro.in/calculators/mf-overlapper"
              description="Free tool to detect MF portfolio overlap in India. Compare up to 5 funds, find duplicate holdings."
            />
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <FinancialDisclaimer variant="compact" className="mb-6" />
        <MFOverlapperCalculator />
      </div>

      {/* FAQ & SEO content */}
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

        {/* External links */}
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Official Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "AMFI", desc: "Monthly fund portfolio disclosures", url: "https://www.amfiindia.com/" },
                { name: "SEBI", desc: "MF regulation & investor protection", url: "https://www.sebi.gov.in/" },
                { name: "MFCentral", desc: "Unified MF portfolio view", url: "https://www.mfcentral.com/" },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 hover:shadow-md transition-all group"
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
