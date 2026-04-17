"use client";

import React, { useState } from "react";
import { Info, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

interface AdvertiserDisclosureProps {
  className?: string;
  variant?: "inline" | "expandable";
}

export function AdvertiserDisclosure({
  className = "",
  variant = "inline",
}: AdvertiserDisclosureProps) {
  const [expanded, setExpanded] = useState(false);

  if (variant === "expandable") {
    return (
      <div className={className}>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="inline-flex items-center gap-1 text-xs text-gray-500 border border-gray-200 rounded px-2 py-1 hover:bg-gray-50 transition-colors"
          aria-expanded={expanded}
        >
          Advertiser disclosure
          {expanded ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
        {expanded && (
          <p className="mt-2 text-xs text-gray-500 leading-relaxed max-w-2xl">
            Many of the products featured on this page are from our partners who
            compensate us when you click to their website or apply for a
            product. This does not influence our ratings or recommendations. Our
            opinions are our own.{" "}
            <Link
              href="/how-we-make-money"
              className="text-green-600 hover:text-green-700 underline underline-offset-2"
            >
              Learn more
            </Link>
          </p>
        )}
      </div>
    );
  }

  // Default: inline variant (original behavior)
  return (
    <div
      className={`flex items-start gap-2 p-3 bg-gray-50/50 border border-gray-100 rounded-lg text-xs text-gray-500 ${className}`}
    >
      <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-600" />
      <p>
        <span className="font-semibold text-gray-600">
          Advertiser Disclosure:
        </span>{" "}
        InvestingPro.in is an independent comparison platform. We may receive
        compensation when you click on links to products from our partners (like
        Banks or AMCs). However, our reviews, ratings, and comparisons are based
        on objective analysis and are never influenced by compensation.
      </p>
    </div>
  );
}
