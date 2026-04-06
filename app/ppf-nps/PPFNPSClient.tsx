"use client";

import React, { useState, useMemo } from "react";
import {
  PiggyBank,
  Shield,
  TrendingUp,
  Calculator,
  Clock,
  Landmark,
  ArrowRight,
  Lock,
  Percent,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Static fallback data (used when DB is empty)
const STATIC_SCHEMES = [
  {
    id: "ppf",
    slug: "ppf",
    name: "Public Provident Fund (PPF)",
    rate: "7.1%",
    tenure: "15 years",
    tax: "EEE (Exempt-Exempt-Exempt)",
    minInvest: "₹500/year",
    maxInvest: "₹1.5L/year",
    lock: "15 years (partial from 7th year)",
    section: "80C",
    icon: PiggyBank,
    risk: "Zero Risk",
    color: "bg-green-50 text-green-700",
  },
  {
    id: "nps",
    slug: "nps",
    name: "National Pension System (NPS)",
    rate: "9-12% (market-linked)",
    tenure: "Till 60 years",
    tax: "EET (partially taxable at withdrawal)",
    minInvest: "₹1,000/year",
    maxInvest: "No limit",
    lock: "Till age 60",
    section: "80CCD(1B) + 80C",
    icon: Landmark,
    risk: "Moderate",
    color: "bg-green-50 text-green-700",
  },
  {
    id: "ssy",
    slug: "sukanya-samriddhi-yojana",
    name: "Sukanya Samriddhi Yojana (SSY)",
    rate: "8.2%",
    tenure: "21 years",
    tax: "EEE",
    minInvest: "₹250/year",
    maxInvest: "₹1.5L/year",
    lock: "21 years (partial from 18)",
    section: "80C",
    icon: Shield,
    risk: "Zero Risk",
    color: "bg-green-50 text-green-700",
  },
  {
    id: "scss",
    slug: "senior-citizen-savings-scheme",
    name: "Senior Citizen Savings Scheme",
    rate: "8.2%",
    tenure: "5 years",
    tax: "Taxable",
    minInvest: "₹1,000",
    maxInvest: "₹30L",
    lock: "5 years",
    section: "80C",
    icon: Clock,
    risk: "Zero Risk",
    color: "bg-amber-50 text-amber-700",
  },
  {
    id: "kvp",
    slug: "kisan-vikas-patra",
    name: "Kisan Vikas Patra (KVP)",
    rate: "7.5%",
    tenure: "115 months (doubles)",
    tax: "Taxable",
    minInvest: "₹1,000",
    maxInvest: "No limit",
    lock: "30 months",
    section: "None",
    icon: TrendingUp,
    risk: "Zero Risk",
    color: "bg-green-50 text-green-700",
  },
  {
    id: "nsc",
    slug: "national-savings-certificate",
    name: "National Savings Certificate (NSC)",
    rate: "7.7%",
    tenure: "5 years",
    tax: "Taxable (reinvested interest deductible)",
    minInvest: "₹1,000",
    maxInvest: "No limit",
    lock: "5 years",
    section: "80C",
    icon: Landmark,
    risk: "Zero Risk",
    color: "bg-green-50 text-green-700",
  },
  {
    id: "mis",
    slug: "post-office-monthly-income-scheme",
    name: "Post Office Monthly Income Scheme",
    rate: "7.4%",
    tenure: "5 years",
    tax: "Taxable",
    minInvest: "₹1,000",
    maxInvest: "₹9L (single) / ₹15L (joint)",
    lock: "5 years (partial from 1yr)",
    section: "None",
    icon: Calculator,
    risk: "Zero Risk",
    color: "bg-green-50 text-green-700",
  },
];

function formatCurrency(num: number | null): string {
  if (!num) return "N/A";
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
  return `₹${num.toLocaleString("en-IN")}`;
}

function getSchemeIcon(slug: string) {
  const map: Record<string, any> = {
    ppf: PiggyBank,
    nps: Landmark,
    "sukanya-samriddhi-yojana": Shield,
    ssy: Shield,
    "senior-citizen-savings-scheme": Clock,
    scss: Clock,
    "kisan-vikas-patra": TrendingUp,
    kvp: TrendingUp,
    "national-savings-certificate": Landmark,
    nsc: Landmark,
    "post-office-monthly-income-scheme": Calculator,
    mis: Calculator,
    "atal-pension-yojana": Shield,
    "pm-vaya-vandana-yojana": Clock,
    "pradhan-mantri-jan-dhan-yojana": PiggyBank,
    "mahila-samman-savings-certificate": Shield,
  };
  return map[slug] || PiggyBank;
}

interface PPFNPSClientProps {
  initialSchemes?: any[];
}

export default function PPFNPSClient({
  initialSchemes = [],
}: PPFNPSClientProps) {
  const [selected, setSelected] = useState<string | null>(null);

  // Merge DB data with static fallback — DB data takes priority
  const schemes = useMemo(() => {
    if (initialSchemes.length === 0) return STATIC_SCHEMES;

    // Map DB schemes to the display format
    const dbSchemes = initialSchemes.map((gs: any) => ({
      id: gs.slug || gs.id,
      slug: gs.slug,
      name: gs.name,
      rate: gs.current_interest_rate ? `${gs.current_interest_rate}%` : "N/A",
      tenure: gs.maturity_period || "N/A",
      tax: gs.tax_on_returns || "N/A",
      minInvest: gs.min_investment
        ? formatCurrency(gs.min_investment) + "/year"
        : "N/A",
      maxInvest: gs.max_investment
        ? formatCurrency(gs.max_investment) + "/year"
        : "No limit",
      lock: gs.lock_in_period || "N/A",
      section: gs.tax_benefit || "None",
      icon: getSchemeIcon(gs.slug),
      risk: gs.risk_level || "Zero Risk",
      color:
        gs.risk_level === "Moderate"
          ? "bg-amber-50 text-amber-700"
          : "bg-green-50 text-green-700",
      // Extra DB fields
      description: gs.description,
      best_for: gs.best_for,
      pros: gs.pros,
      cons: gs.cons,
      official_link: gs.official_link,
    }));

    // Add any static schemes not in DB (by slug match)
    const dbSlugs = new Set(dbSchemes.map((s: any) => s.slug));
    const missingStatic = STATIC_SCHEMES.filter(
      (s) => !dbSlugs.has(s.slug) && !dbSlugs.has(s.id),
    );

    return [...dbSchemes, ...missingStatic];
  }, [initialSchemes]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        {schemes.length} government-backed savings schemes compared
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {schemes.map((scheme: any) => {
          const Icon = scheme.icon;
          const isOpen = selected === scheme.id;
          return (
            <div
              key={scheme.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-green-500 hover:shadow-sm transition-all"
            >
              <button
                onClick={() => setSelected(isOpen ? null : scheme.id)}
                className="w-full text-left p-4 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${scheme.color}`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {scheme.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-[12px] text-gray-500">
                      <span className="font-semibold text-green-600">
                        {scheme.rate}
                      </span>
                      <span>{scheme.tenure}</span>
                      <Badge className="text-[9px] bg-gray-100 text-gray-600 border-0">
                        {scheme.risk}
                      </Badge>
                    </div>
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-3">
                  {scheme.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {scheme.description}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: "Interest Rate",
                        value: scheme.rate,
                        icon: Percent,
                      },
                      {
                        label: "Lock-in",
                        value: scheme.lock,
                        icon: Lock,
                      },
                      {
                        label: "Min Investment",
                        value: scheme.minInvest,
                        icon: Calculator,
                      },
                      {
                        label: "Max Investment",
                        value: scheme.maxInvest,
                        icon: TrendingUp,
                      },
                      {
                        label: "Tax Treatment",
                        value: scheme.tax,
                        icon: Shield,
                      },
                      {
                        label: "Section",
                        value: scheme.section,
                        icon: Landmark,
                      },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="text-[10px] text-gray-400 uppercase font-medium">
                          {item.label}
                        </p>
                        <p className="text-sm text-gray-900 font-medium mt-0.5">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Pros/cons from DB */}
                  {scheme.pros && scheme.pros.length > 0 && (
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-medium mb-1">
                        Pros
                      </p>
                      <ul className="space-y-0.5">
                        {scheme.pros.slice(0, 3).map((p: string, i: number) => (
                          <li
                            key={i}
                            className="text-xs text-gray-600 flex items-start gap-1"
                          >
                            <span className="text-green-500 mt-0.5">+</span> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/calculators/${scheme.slug || scheme.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700"
                    >
                      Open{" "}
                      {scheme.name.includes("(")
                        ? scheme.name.split("(")[0].trim()
                        : scheme.name}{" "}
                      Calculator <ArrowRight size={12} />
                    </Link>
                    {scheme.official_link && (
                      <a
                        href={scheme.official_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700"
                      >
                        Official Site <ArrowRight size={12} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
