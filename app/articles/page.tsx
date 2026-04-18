import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ArticlesClient from "./ArticlesClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Financial Articles & Research",
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
      <section className="bg-white border-b-2 border-[--v2-ink]/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-8">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-1.5 font-data text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-[--v2-ink] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight size={10} />
              </li>
              <li className="text-[--v2-ink] font-medium">Articles</li>
            </ol>
          </nav>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-3xl md:text-[42px] font-black text-[--v2-ink] tracking-tight leading-[1.1]">
                Research & Analysis
              </h1>
              <p className="text-[15px] text-gray-500 mt-3 max-w-xl leading-relaxed">
                Independent financial research and expert guides. No sponsored
                content — every article is editorially reviewed.
              </p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0 mt-1">
              <span className="font-data text-[10px] uppercase tracking-widest text-gray-500 border border-[--v2-ink]/10 px-3 py-1.5">
                228+ articles
              </span>
              <span className="font-data text-[10px] uppercase tracking-widest text-gray-500 border border-[--v2-ink]/10 px-3 py-1.5">
                Expert reviewed
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[--v2-canvas] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <ArticlesClient />
        </div>
      </section>
    </>
  );
}
