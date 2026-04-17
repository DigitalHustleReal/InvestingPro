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
        "mt-8 border border-border rounded-lg overflow-hidden bg-muted/30",
        className,
      )}
    >
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-muted/50 transition-colors"
        aria-expanded={open}
        aria-controls="article-sources-body"
      >
        <span className="text-sm font-semibold text-foreground">
          Article Sources
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {/* Expandable body */}
      {open && (
        <div
          id="article-sources-body"
          className="px-5 pb-5 pt-1 border-t border-border"
        >
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            InvestingPro content is based on data from official regulatory
            sources, bank websites, and government publications. We cite primary
            sources wherever possible.
          </p>

          <ol className="space-y-2">
            {allSources.map((source, index) => (
              <li
                key={index}
                className="flex gap-2 text-xs text-muted-foreground"
              >
                <span className="shrink-0 font-semibold text-foreground/60 w-5 text-right">
                  {index + 1}.
                </span>
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    {source.label}
                  </a>
                ) : (
                  <span>{source.label}</span>
                )}
              </li>
            ))}
          </ol>

          <div className="mt-4 pt-3 border-t border-border/50">
            <Link
              href="/about/editorial-standards"
              className="text-xs text-primary hover:underline font-medium"
            >
              Read our editorial standards →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
