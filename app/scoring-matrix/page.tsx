import type { Metadata } from "next";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Shield, Scale, Eye } from "lucide-react";
import { ScoringMatrixPage } from "./ScoringMatrixClient";

export const metadata: Metadata = {
  title: "InvestingPro Scoring Matrix — How Every Score Is Calculated | InvestingPro",
  description:
    "Full transparency: see every formula, weight, and factor used to score credit cards, mutual funds, loans, FDs, demat accounts, and insurance. Live calculator included.",
  keywords:
    "investingpro scoring matrix, how are credit cards ranked India, best credit card ranking formula, mutual fund scoring India, transparent financial product comparison, unbiased ranking India 2026",
  openGraph: {
    title: "InvestingPro Scoring Matrix — Every Formula, Every Weight, Zero Hidden Variables",
    description:
      "6 product categories. Every scoring formula. Live credit card calculator. We show you exactly how scores are computed — then you decide.",
    url: "https://investingpro.in/scoring-matrix",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/scoring-matrix" },
};

const schemaMarkup = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "InvestingPro Scoring Matrix",
  url: "https://investingpro.in/scoring-matrix",
  description:
    "Complete transparent scoring framework for all product categories on InvestingPro.in — credit cards, mutual funds, loans, fixed deposits, demat accounts, and term insurance.",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://investingpro.in/" },
      { "@type": "ListItem", position: 2, name: "Scoring Matrix", item: "https://investingpro.in/scoring-matrix" },
    ],
  },
};

export default function ScoringMatrixPageRoute() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-700 pt-24 pb-16">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AutoBreadcrumbs className="mb-6 justify-center [&_*]:text-green-200 [&_a]:text-green-300" />

          <Badge className="mb-4 bg-amber-400/20 border-amber-400/40 text-amber-300 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">
            100% Transparent — No Exceptions
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5">
            InvestingPro Scoring Matrix
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            Every formula. Every weight. Every factor — published for every product category we cover.
            No black boxes. No pay-to-rank. Includes a live score calculator.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: Scale, label: "6 scoring formulas" },
              { icon: Eye, label: "All weights public" },
              { icon: Shield, label: "Affiliate = zero ranking influence" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white"
              >
                <Icon className="h-4 w-4 text-amber-300 shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ScoringMatrixPage />
      </div>
    </div>
  );
}
