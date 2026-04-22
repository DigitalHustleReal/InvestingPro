"use client";

import React from "react";
import Link from "next/link";
import { Calculator, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CALCULATORS = [
  { name: "SIP Calculator", slug: "sip", tag: "Popular" },
  { name: "EMI Calculator", slug: "emi", tag: "Popular" },
  { name: "FD Calculator", slug: "fd" },
  { name: "Lumpsum Calculator", slug: "lumpsum" },
  { name: "PPF Calculator", slug: "ppf" },
  { name: "NPS Calculator", slug: "nps" },
  { name: "SWP Calculator", slug: "swp" },
  { name: "Tax Calculator", slug: "tax" },
  { name: "Gratuity Calculator", slug: "gratuity", tag: "New" },
  { name: "EPF Calculator", slug: "epf", tag: "New" },
  { name: "HRA Calculator", slug: "hra", tag: "New" },
  { name: "Salary Calculator", slug: "salary", tag: "New" },
  { name: "TDS Calculator", slug: "tds", tag: "New" },
  { name: "Home Loan EMI", slug: "home-loan-emi", tag: "New" },
  { name: "Personal Loan EMI", slug: "personal-loan-emi", tag: "New" },
  { name: "CAGR Calculator", slug: "cagr", tag: "New" },
  { name: "Step-Up SIP", slug: "step-up-sip", tag: "New" },
  { name: "Lumpsum vs SIP", slug: "lumpsum-vs-sip", tag: "VS" },
  { name: "PO FD vs Bank FD", slug: "po-fd-vs-bank-fd", tag: "VS" },
  { name: "SIP vs RD", slug: "sip-vs-rd", tag: "VS" },
  { name: "Compound Interest", slug: "compound-interest" },
  { name: "RD Calculator", slug: "rd" },
  { name: "SSY Calculator", slug: "ssy" },
  { name: "SCSS Calculator", slug: "scss" },
  { name: "Goal Planning", slug: "goal-planning" },
  { name: "Retirement Calculator", slug: "retirement" },
  { name: "GST Calculator", slug: "gst" },
];

interface PopularCalculatorsProps {
  currentSlug?: string;
  variant?: "sidebar" | "strip";
}

export function PopularCalculators({
  currentSlug,
  variant = "sidebar",
}: PopularCalculatorsProps) {
  const filtered = CALCULATORS.filter((c) => c.slug !== currentSlug);

  if (variant === "strip") {
    return (
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
          <Calculator size={15} className="text-action-green" />
          More Calculators
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {filtered.slice(0, 15).map((c) => (
            <Link
              key={c.slug}
              href={`/calculators/${c.slug}`}
              className="flex-shrink-0 px-3 py-2 bg-white border border-ink/10 rounded-sm text-xs font-medium text-gray-700 hover:border-green-300 hover:text-authority-green hover:bg-action-green/10 transition-all whitespace-nowrap"
            >
              {c.name}
              {c.tag && (
                <span
                  className={cn(
                    "ml-1.5 text-[9px] font-bold px-1 py-0.5 rounded",
                    c.tag === "New"
                      ? "bg-green-100 text-authority-green"
                      : c.tag === "VS"
                        ? "bg-indian-gold/20 text-indian-gold"
                        : "bg-amber-100 text-amber-700",
                  )}
                >
                  {c.tag}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Sidebar variant (Groww-style)
  return (
    <div className="bg-white border border-ink/10 rounded-sm p-4 shadow-none">
      <h3 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
        <Calculator size={15} className="text-action-green" />
        Popular Calculators
      </h3>
      <div className="space-y-0.5">
        {filtered.slice(0, 12).map((c) => (
          <Link
            key={c.slug}
            href={`/calculators/${c.slug}`}
            className="flex items-center justify-between py-2 px-2.5 rounded-sm text-sm text-ink-60 hover:bg-action-green/10 hover:text-authority-green transition-all group"
          >
            <span>{c.name}</span>
            <div className="flex items-center gap-1.5">
              {c.tag && (
                <span
                  className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded",
                    c.tag === "New"
                      ? "bg-green-100 text-authority-green"
                      : c.tag === "VS"
                        ? "bg-indian-gold/20 text-indian-gold"
                        : "bg-amber-100 text-amber-700",
                  )}
                >
                  {c.tag}
                </span>
              )}
              <ArrowRight
                size={12}
                className="text-gray-300 group-hover:text-action-green transition-colors"
              />
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/calculators"
        className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-ink/5 text-xs font-semibold text-action-green hover:text-authority-green"
      >
        All calculators <ArrowRight size={12} />
      </Link>
    </div>
  );
}
