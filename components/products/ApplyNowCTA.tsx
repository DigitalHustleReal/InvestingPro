"use client";

import React from "react";
import TrackedAffiliateLink from "@/components/monetization/TrackedAffiliateLink";
import { ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplyNowCTAProps {
  href: string;
  productName: string;
  productSlug?: string;
  productId?: string;
  category?: string;
  providerName?: string;
  sourcePage: string;
  /** Visual variant */
  variant?: "hero" | "bottom" | "inline";
  className?: string;
}

const variantStyles = {
  hero: "w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-6 h-auto rounded-xl shadow-xl shadow-green-600/20 transition-all hover:scale-105 active:scale-95",
  bottom:
    "bg-green-600 hover:bg-green-500 text-white font-bold px-12 py-6 text-lg rounded-full shadow-lg hover:shadow-green-600/30 transition-all hover:-translate-y-1",
  inline:
    "bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors",
};

/**
 * Client-side Apply Now CTA that wraps TrackedAffiliateLink.
 * Use this in server components where TrackedAffiliateLink cannot be used directly.
 */
export default function ApplyNowCTA({
  href,
  productName,
  productSlug,
  productId,
  category = "credit_card",
  providerName,
  sourcePage,
  variant = "inline",
  className,
}: ApplyNowCTAProps) {
  const Icon = variant === "hero" ? ArrowRight : ExternalLink;

  const frictionCopy: Record<string, string> = {
    credit_card: "Takes 3-5 min \u00B7 No impact on CIBIL score",
    loan: "Check eligibility in 2 minutes",
    demat_account: "Free account opening \u00B7 No hidden charges",
    mutual_fund: "Start with as little as \u20B9500/month",
    insurance: "Compare quotes in 2 minutes",
    fixed_deposit: "Book online \u00B7 No paperwork",
  };

  const subText = frictionCopy[category] || "";

  return (
    <div className="flex flex-col items-center gap-1">
      <TrackedAffiliateLink
        href={href}
        productName={productName}
        productSlug={productSlug}
        productId={productId}
        category={category}
        providerName={providerName}
        sourcePage={sourcePage}
        sourceComponent="button"
        variant="button"
        showIcon={false}
        className={cn(variantStyles[variant], className)}
      >
        Apply Now <Icon className="w-5 h-5 ml-2" />
      </TrackedAffiliateLink>
      {subText && (
        <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center leading-tight">
          {subText}
        </span>
      )}
    </div>
  );
}
