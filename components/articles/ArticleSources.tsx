"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Source {
  label: string;
  url: string;
}

function getDefaultSources(category: string): Source[] {
  const cat = category.toLowerCase().replace(/-/g, "_");

  if (
    cat.includes("tax") ||
    cat.includes("income_tax") ||
    cat.includes("80c") ||
    cat.includes("itr")
  ) {
    return [
      {
        label: "Income Tax Department, Government of India — incometax.gov.in",
        url: "https://www.incometax.gov.in",
      },
      {
        label:
          "Central Board of Direct Taxes (CBDT) — circulars and notifications",
        url: "https://www.incometax.gov.in/iec/foportal/help/rules/cbdt-circular-notification",
      },
      {
        label: "Reserve Bank of India — rbi.org.in",
        url: "https://www.rbi.org.in",
      },
      {
        label: "Ministry of Finance, Government of India — finmin.nic.in",
        url: "https://finmin.nic.in",
      },
    ];
  }

  if (cat.includes("credit_card") || cat.includes("creditcard")) {
    return [
      {
        label:
          "RBI Master Circular — Credit Card and Debit Card Issuance and Conduct Directions, 2022",
        url: "https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=12300",
      },
      {
        label: "Reserve Bank of India — rbi.org.in",
        url: "https://www.rbi.org.in",
      },
      {
        label: "Individual bank T&Cs published on respective bank websites",
        url: "https://www.rbi.org.in",
      },
    ];
  }

  if (
    cat.includes("mutual_fund") ||
    cat.includes("mutual fund") ||
    cat.includes("mf") ||
    cat.includes("sip") ||
    cat.includes("elss")
  ) {
    return [
      {
        label: "SEBI Mutual Fund Regulations, 1996 (as amended) — sebi.gov.in",
        url: "https://www.sebi.gov.in/legal/regulations/nov-2014/sebi-mutual-funds-regulations-1996_28683.html",
      },
      {
        label: "AMFI — Association of Mutual Funds in India — amfiindia.com",
        url: "https://www.amfiindia.com",
      },
      {
        label: "Reserve Bank of India — rbi.org.in",
        url: "https://www.rbi.org.in",
      },
    ];
  }

  if (
    cat.includes("insurance") ||
    cat.includes("term_insurance") ||
    cat.includes("life_insurance") ||
    cat.includes("health_insurance")
  ) {
    return [
      {
        label:
          "IRDAI Annual Report — Insurance Regulatory and Development Authority of India",
        url: "https://irdai.gov.in/annual-reports",
      },
      {
        label: "IRDAI — Claim Settlement Ratio data — irdai.gov.in",
        url: "https://irdai.gov.in",
      },
      {
        label: "Insurance Information Bureau of India — iib.gov.in",
        url: "https://iib.gov.in",
      },
    ];
  }

  if (
    cat.includes("loan") ||
    cat.includes("home_loan") ||
    cat.includes("personal_loan") ||
    cat.includes("mclr")
  ) {
    return [
      {
        label: "RBI — Monetary Policy and Lending Rate Data — rbi.org.in",
        url: "https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx",
      },
      {
        label: "RBI — MCLR rates published by scheduled commercial banks",
        url: "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx",
      },
      {
        label: "Reserve Bank of India — rbi.org.in",
        url: "https://www.rbi.org.in",
      },
    ];
  }

  if (
    cat.includes("fixed_deposit") ||
    cat.includes("fd") ||
    cat.includes("bank") ||
    cat.includes("savings") ||
    cat.includes("ppf") ||
    cat.includes("nps")
  ) {
    return [
      {
        label: "RBI — Interest Rates on Deposits — rbi.org.in",
        url: "https://www.rbi.org.in/Scripts/bs_viewcontent.aspx?Id=2009",
      },
      {
        label:
          "DICGC — Deposit Insurance and Credit Guarantee Corporation — dicgc.org.in",
        url: "https://www.dicgc.org.in",
      },
      {
        label: "Reserve Bank of India — rbi.org.in",
        url: "https://www.rbi.org.in",
      },
      {
        label: "Ministry of Finance, Government of India — finmin.nic.in",
        url: "https://finmin.nic.in",
      },
    ];
  }

  if (
    cat.includes("demat") ||
    cat.includes("stock") ||
    cat.includes("equity") ||
    cat.includes("ipo") ||
    cat.includes("trading")
  ) {
    return [
      {
        label: "SEBI — Securities and Exchange Board of India — sebi.gov.in",
        url: "https://www.sebi.gov.in",
      },
      {
        label: "NSE India — National Stock Exchange — nseindia.com",
        url: "https://www.nseindia.com",
      },
      {
        label: "BSE India — Bombay Stock Exchange — bseindia.com",
        url: "https://www.bseindia.com",
      },
      {
        label: "Reserve Bank of India — rbi.org.in",
        url: "https://www.rbi.org.in",
      },
    ];
  }

  // Default / general finance
  return [
    {
      label: "Reserve Bank of India — rbi.org.in",
      url: "https://www.rbi.org.in",
    },
    {
      label: "SEBI — Securities and Exchange Board of India — sebi.gov.in",
      url: "https://www.sebi.gov.in",
    },
    {
      label: "Ministry of Finance, Government of India — finmin.nic.in",
      url: "https://finmin.nic.in",
    },
  ];
}

interface ArticleSourcesProps {
  category: string;
  customSources?: string[];
  className?: string;
}

export default function ArticleSources({
  category,
  customSources,
  className,
}: ArticleSourcesProps) {
  const [open, setOpen] = useState(false);

  const defaultSources = getDefaultSources(category || "");
  const allSources = [
    ...defaultSources,
    ...(customSources || []).map((s) => ({ label: s, url: "" })),
  ];

  return (
    <div
      className={cn(
        "mt-10 border-2 border-ink/10 rounded-sm overflow-hidden bg-canvas",
        className,
      )}
    >
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-ink/5 transition-colors"
        aria-expanded={open}
        aria-controls="article-sources-body"
      >
        <span className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-indian-gold border border-indian-gold/30 px-1.5 py-0.5">
            Primary Sources
          </span>
          <span className="font-display font-bold text-[15px] text-ink">
            Article Sources
          </span>
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-ink-60 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-ink-60 shrink-0" />
        )}
      </button>

      {/* Expandable body */}
      {open && (
        <div
          id="article-sources-body"
          className="px-5 pb-5 pt-3 border-t border-ink/10"
        >
          <p className="text-[13px] text-ink-60 mb-4 leading-relaxed">
            InvestingPro content is based on data from official regulatory
            sources, bank websites, and government publications. We cite primary
            sources wherever possible.
          </p>

          <ol className="space-y-2.5">
            {allSources.map((source, index) => (
              <li
                key={index}
                className="flex gap-3 text-[13px] text-ink-60 leading-relaxed"
              >
                <span className="font-mono shrink-0 text-ink/50 w-6 text-right text-[11px] pt-0.5">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink hover:text-authority-green hover:underline transition-colors"
                  >
                    {source.label}
                  </a>
                ) : (
                  <span>{source.label}</span>
                )}
              </li>
            ))}
          </ol>

          <div className="mt-5 pt-4 border-t border-ink/10">
            <Link
              href="/about/editorial-standards"
              className="font-mono text-[11px] uppercase tracking-wider text-indian-gold hover:underline"
            >
              Read our editorial standards &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
