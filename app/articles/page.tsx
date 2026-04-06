import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Shield, BookOpen } from "lucide-react";
import ArticlesClient from "./ArticlesClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Financial Articles & Research — InvestingPro",
  description:
    "Independent financial research, analysis, and guides for Indian investors. Credit cards, mutual funds, loans, tax planning, and market insights.",
  openGraph: {
    title: "Financial Articles & Research — InvestingPro",
    url: "https://investingpro.in/articles",
  },
};

export default function ArticlesPage() {
  return (
    <>
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-8">
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
              <li className="text-gray-700 font-medium">Articles</li>
            </ol>
          </nav>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-[32px] font-bold text-[--v2-ink] tracking-tight leading-tight">
                Research & Analysis
              </h1>
              <p className="text-[15px] text-gray-500 mt-2 max-w-xl leading-relaxed">
                Independent financial research and expert guides. No sponsored
                content — every article is editorially reviewed.
              </p>
            </div>
            <div className="flex items-center gap-5 text-[12px] text-gray-500 flex-shrink-0 mt-1">
              <span className="flex items-center gap-1.5">
                <Shield size={13} className="text-green-600" />
                Editorial independence
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen size={13} className="text-green-600" />
                Expert reviewed
              </span>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              "All Articles",
              "Credit Cards",
              "Mutual Funds",
              "Loans",
              "Insurance",
              "Tax",
              "Market Analysis",
              "Guides",
            ].map((p, i) => (
              <Link
                key={p}
                href={
                  i === 0
                    ? "/articles"
                    : `/articles?category=${p.toLowerCase().replace(" ", "-")}`
                }
                className={`inline-flex items-center px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${i === 0 ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {p}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <ArticlesClient />
        </div>
      </section>
    </>
  );
}
