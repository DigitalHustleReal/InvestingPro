import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, BookOpen } from "lucide-react";
import GlossaryClient from "./GlossaryClient";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Financial Glossary — 200+ Terms Explained Simply | InvestingPro",
  description:
    "Plain-English definitions for financial terms. SIP, NAV, CAGR, expense ratio, CIBIL score, 80C, NPS, ELSS — every term explained with examples.",
  openGraph: {
    title: "Financial Glossary — InvestingPro",
    url: "https://investingpro.in/glossary",
  },
};

export default function GlossaryPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "InvestingPro Financial Glossary",
    description:
      "Plain-English definitions for 200+ financial terms relevant to Indian investors.",
    url: "https://investingpro.in/glossary",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 pt-6 pb-8">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-1.5 text-[13px] text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-green-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight size={12} />
              </li>
              <li className="text-gray-700 font-medium">Glossary</li>
            </ol>
          </nav>
          <h1 className="text-2xl md:text-[32px] font-bold text-[--v2-ink] tracking-tight leading-tight">
            Financial Glossary
          </h1>
          <p className="text-[15px] text-gray-500 mt-2 max-w-xl leading-relaxed">
            Plain-English definitions for every financial term you'll encounter.
            Search or browse by category.
          </p>
        </div>
      </section>
      <section className="bg-gray-50 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-8">
          <GlossaryClient />
        </div>
      </section>
    </>
  );
}
