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
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-8">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-1.5 text-sm text-ink-60">
              <li>
                <Link
                  href="/"
                  className="hover:text-ink transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight size={14} />
              </li>
              <li className="text-ink font-medium">Articles</li>
            </ol>
          </nav>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display font-black text-[32px] sm:text-[44px] leading-[1.08] tracking-tight text-ink">
                Research &{" "}
                <em className="italic text-authority-green">Analysis</em>
              </h1>
              <p className="text-base text-ink-60 mt-3 max-w-xl leading-relaxed">
                Independent financial research and expert guides. No sponsored
                content — every article is editorially reviewed.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 mt-1">
              <span className="text-xs text-ink-60 bg-gray-100 px-3 py-1.5 rounded-full">
                228+ articles
              </span>
              <span className="text-xs text-ink-60 bg-gray-100 px-3 py-1.5 rounded-full">
                Expert reviewed
              </span>
            </div>
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
