import type { Metadata } from "next";
import { GSTSuite } from "@/components/calculators/GSTSuite";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, Calendar, ExternalLink } from "lucide-react";
import SocialShareButtons from "@/components/common/SocialShareButtons";

export const metadata: Metadata = {
  title: "GST Suite for Small Business India 2026 — Invoice + GSTR + Composition | InvestingPro",
  description:
    "Free GST toolkit for small businesses: multi-item invoice calculator with CGST/SGST/IGST, monthly GSTR-3B filing estimator with ITC calculation, and Composition Scheme eligibility checker.",
  keywords:
    "GST invoice calculator India, GSTR-3B calculator, ITC calculation India, GST composition scheme eligibility, multi item GST calculator, small business GST tool India 2026",
  openGraph: {
    title: "GST Suite for Small Business India 2026 — Invoice + GSTR + Composition | InvestingPro",
    description: "Free GST toolkit: multi-item invoice, GSTR-3B estimator, and composition scheme checker. For Indian small businesses.",
    url: "https://investingpro.in/calculators/gst-suite",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/gst-suite" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Input Tax Credit (ITC) and how does it reduce GST payable?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Input Tax Credit (ITC) lets you offset the GST you paid on purchases against the GST you collected on sales. Example: You collected ₹18,000 GST on sales and paid ₹10,000 GST on purchases. ITC = ₹10,000. Net GST payable to government = ₹18,000 - ₹10,000 = ₹8,000. This prevents double-taxation and is one of the key features of India's GST system.",
      },
    },
    {
      "@type": "Question",
      name: "What is GSTR-1 and GSTR-3B and what is the difference?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GSTR-1 is the outward sales return — you declare all sales invoices. Filed by 11th of next month (monthly filers with turnover > ₹5 Cr) or quarterly (QRMP filers). GSTR-3B is the summary return where you actually pay tax. It covers outward supplies, ITC claimed, and net tax paid. Filed by 20th/22nd/24th depending on turnover and state. GSTR-3B must be filed even if there are no transactions.",
      },
    },
    {
      "@type": "Question",
      name: "Who is eligible for the GST Composition Scheme?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Composition Scheme eligibility: Turnover up to ₹1.5 Cr (goods traders, restaurants) or ₹50 lakh (service providers). Must be intra-state supplier only. Cannot supply through e-commerce platforms. Cannot be a casual taxable person or non-resident. Cannot supply non-taxable goods like alcohol. Cannot issue tax invoices or claim ITC. Tax rate: 1% (goods), 5% (restaurants), 6% (services). File Form CMP-01/02 to opt in.",
      },
    },
    {
      "@type": "Question",
      name: "When should I use IGST vs CGST + SGST on an invoice?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use CGST + SGST for intra-state transactions (supplier and recipient in the same state). Each is half the GST rate — 18% GST = 9% CGST + 9% SGST. Use IGST for inter-state transactions (supplier and recipient in different states). 18% GST = 18% IGST. The total tax is the same; only the split changes. For exports: use IGST at 0% (zero-rated) or supply under LUT without payment of IGST.",
      },
    },
    {
      "@type": "Question",
      name: "What is the HSN/SAC code and is it mandatory on GST invoices?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HSN (Harmonised System of Nomenclature) codes are for goods; SAC (Services Accounting Code) codes are for services. Mandatory on invoices: 4-digit HSN if turnover ₹5 Cr–₹50 Cr; 6-digit HSN if turnover > ₹50 Cr; turnover < ₹5 Cr is optional but recommended. HSN codes determine the applicable GST rate. Incorrect HSN can lead to notices from GST authorities.",
      },
    },
  ],
};

export default function GSTSuitePage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://investingpro.in/" },
      { "@type": "ListItem", position: 2, name: "Calculators", item: "https://investingpro.in/calculators" },
      { "@type": "ListItem", position: 3, name: "GST Suite", item: "https://investingpro.in/calculators/gst-suite" },
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
            <Receipt className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">Invoice • GSTR-3B • Composition Scheme • ITC</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Small Business GST Suite
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-4">
            Three GST tools in one: multi-item invoice calculator with CGST/SGST/IGST breakdown,
            monthly GSTR-3B filing estimator with ITC calculation, and Composition Scheme
            eligibility checker. Free for all Indian small businesses.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 mb-4">
            <span className="font-semibold text-primary-600">3 tools in one</span>
            <span className="hidden sm:inline">•</span>
            <span>All GST rates (0–28%)</span>
            <span className="hidden sm:inline">•</span>
            <span>ITC auto-calculated</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Updated {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </span>
          </div>
          <div className="flex justify-center">
            <SocialShareButtons
              title="Small Business GST Suite India 2026 — Invoice + GSTR + Composition"
              url="https://investingpro.in/calculators/gst-suite"
              description="Free GST tools for small businesses. Multi-item invoice, GSTR-3B estimator, composition scheme checker."
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <FinancialDisclaimer variant="compact" className="mb-6" />
        <GSTSuite />
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
          <CardHeader><CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Official GST Resources</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "GST Portal", desc: "File returns, pay tax, register", url: "https://www.gst.gov.in/" },
                { name: "GST Council", desc: "Official rate changes and notifications", url: "https://gstcouncil.gov.in/" },
                { name: "CBIC GST", desc: "Circulars, notifications, FAQs", url: "https://cbic-gst.gov.in/" },
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
                { name: "GST Calculator (Basic)", url: "/calculators/gst" },
                { name: "Income Tax Calculator", url: "/calculators/tax" },
                { name: "Business Loan EMI", url: "/calculators/emi" },
                { name: "Gratuity Calculator", url: "/calculators/gratuity" },
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
