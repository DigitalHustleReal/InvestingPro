"use client";

import React from "react";
import TrackedAffiliateLink from "@/components/monetization/TrackedAffiliateLink";
import { ExternalLink } from "lucide-react";
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
  variant?: "default" | "compact";
  className?: string;
}

const variantStyles = {
  default:
    "bg-green-600 hover:bg-green-700 text-white font-semibold uppercase tracking-wide rounded-sm px-6 py-3 text-sm transition-colors",
  compact:
    "bg-green-600 hover:bg-green-700 text-white font-semibold uppercase tracking-wide rounded-sm px-4 py-2 text-xs transition-colors",
};

/**
 * Client-side Apply Now CTA that wraps TrackedAffiliateLink.
 * NerdWallet-style: uppercase text, square corners, provider attribution subtext.
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
  variant = "default",
  className,
}: ApplyNowCTAProps) {
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
        APPLY NOW <ExternalLink className="w-4 h-4 ml-2 inline-block" />
      </TrackedAffiliateLink>
      {providerName && (
        <span className="text-[11px] text-gray-500 dark:text-gray-400 text-center leading-tight">
          on {providerName}&apos;s website
        </span>
      )}
    </div>
  );
}
