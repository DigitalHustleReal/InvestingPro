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

// v3 Bold Redesign: square corners, mono tracking-wider uppercase.
// Action-green for conversion prominence, authority-green on hover.
const variantStyles = {
  default:
    "bg-action-green hover:bg-authority-green text-canvas font-mono font-semibold uppercase tracking-wider rounded-sm px-6 py-3 text-[12px] transition-colors flex items-center justify-center gap-2 w-full",
  compact:
    "bg-action-green hover:bg-authority-green text-canvas font-mono font-semibold uppercase tracking-wider rounded-sm px-4 py-2 text-[11px] transition-colors flex items-center justify-center gap-1.5 w-full",
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
        APPLY NOW <ExternalLink className="w-3.5 h-3.5" />
      </TrackedAffiliateLink>
      {providerName && (
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-60 text-center leading-tight">
          on {providerName}&apos;s website
        </span>
      )}
    </div>
  );
}
