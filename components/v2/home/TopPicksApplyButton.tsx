"use client";

import Link from "next/link";
import { trackAffiliateClick } from "@/lib/analytics/posthog-service";

// Client-side "Apply Now" button for TopPicks cards.
// Extracted so the parent TopPicks can stay an async server component
// while this wrapper handles click-time affiliate tracking.

interface Props {
  href: string;
  productName: string;
  productId: string;
  position: number;
}

export default function TopPicksApplyButton({
  href,
  productName,
  productId,
  position,
}: Props) {
  return (
    <Link
      href={href}
      onClick={() => {
        trackAffiliateClick(productId, productName, "credit_cards");
      }}
      className="px-4 py-2 bg-action-green text-canvas text-[11px] uppercase tracking-wider rounded-sm hover:bg-authority-green transition-colors"
      data-analytics="toppicks_apply_now"
      data-position={position}
    >
      Apply Now
    </Link>
  );
}
