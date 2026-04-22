"use client";

import React, { useCallback } from "react";
import {
  trackAffiliateClick,
  AffiliateClickData,
} from "@/lib/tracking/affiliate-tracker";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

// Tracked affiliate link — fires click tracking (PostHog + Supabase)
// without blocking the navigation. Non-blocking pattern ensures the
// user's redirect is instant even if tracking is slow.
// v3 Bold Redesign tokens throughout.

interface TrackedAffiliateLinkProps {
  href: string;
  productName: string;
  productId?: string;
  productSlug?: string;
  category?: string;
  providerName?: string;
  sourcePage: string;
  sourceComponent?:
    | "product_card"
    | "comparison_table"
    | "article_cta"
    | "sidebar"
    | "button"
    | "link";
  articleId?: string;
  affiliateNetwork?: string;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  variant?: "default" | "button" | "card" | "text";
  onTrack?: (clickId: string | null) => void;
}

// v3 tokens — indian-gold links, action-green CTA, sharp corners
const variantStyles = {
  default:
    "text-indian-gold hover:underline inline-flex items-center gap-1",
  button:
    "inline-flex items-center justify-center gap-2 px-6 py-3 bg-action-green hover:bg-authority-green text-canvas font-mono uppercase tracking-wider font-semibold rounded-sm transition-colors",
  card: "block w-full p-4 bg-white border-2 border-ink/10 rounded-sm hover:border-ink/30 transition-all",
  text: "text-ink hover:text-indian-gold underline-offset-2 hover:underline",
};

export default function TrackedAffiliateLink({
  href,
  productName,
  productId,
  productSlug,
  category,
  providerName,
  sourcePage,
  sourceComponent = "link",
  articleId,
  affiliateNetwork = "direct",
  children,
  className,
  showIcon = true,
  variant = "default",
  onTrack,
}: TrackedAffiliateLinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // DO NOT preventDefault — let the browser navigate normally.
      // Firing tracking async means the user's redirect isn't blocked
      // by a Supabase insert round trip.
      const clickData: AffiliateClickData = {
        productId,
        productSlug,
        productName,
        category,
        providerName,
        sourcePage,
        sourceComponent,
        articleId,
        affiliateLink: href,
        affiliateNetwork,
      };

      // Fire-and-forget: track in background. Catch prevents unhandled
      // rejection if Supabase is slow/down — won't block navigation.
      trackAffiliateClick(clickData)
        .then((clickId) => {
          if (onTrack) onTrack(clickId);
        })
        .catch(() => {
          /* swallow — never block the user's click */
        });

      // Middle-click / cmd-click should also be tracked; default browser
      // behaviour (new tab) handles those naturally since we don't
      // preventDefault.
    },
    [
      href,
      productId,
      productSlug,
      productName,
      category,
      providerName,
      sourcePage,
      sourceComponent,
      articleId,
      affiliateNetwork,
      onTrack,
    ],
  );

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(variantStyles[variant], className)}
      target="_blank"
      rel="noopener noreferrer sponsored"
      data-product={productSlug || productId}
      data-source={sourcePage}
      data-affiliate-network={affiliateNetwork}
    >
      {children}
      {showIcon && variant !== "card" && (
        <ExternalLink className="w-4 h-4 shrink-0" />
      )}
    </a>
  );
}

export function AffiliateButton({
  href,
  productName,
  sourcePage,
  children,
  className,
}: {
  href: string;
  productName: string;
  sourcePage: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TrackedAffiliateLink
      href={href}
      productName={productName}
      sourcePage={sourcePage}
      sourceComponent="button"
      variant="button"
      className={className}
    >
      {children}
    </TrackedAffiliateLink>
  );
}
