/**
 * /unsubscribe — newsletter opt-out page.
 *
 * One-click unsubscribe with email confirmation. The DELETE endpoint
 * at /api/newsletter accepts an `?email=` query param. We pre-fill
 * from the URL when the link comes from a newsletter footer.
 *
 * UX: clean confirmation screen + minimal copy. We show the unsubscribe
 * action immediately on form submit; no "Are you sure?" double-confirm
 * because that's user-hostile. After unsubscribe, we briefly say "We're
 * sorry to see you go" and offer a one-click re-subscribe.
 */

import { Metadata } from "next";
import { Suspense } from "react";
import UnsubscribeClient from "./UnsubscribeClient";

export const metadata: Metadata = {
  title: "Unsubscribe — InvestingPro Newsletter",
  description: "Manage your InvestingPro newsletter subscription.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="max-w-[640px] mx-auto px-6 py-16 sm:py-24">
        <Suspense
          fallback={
            <div className="text-center text-ink-60 font-mono text-[12px] uppercase tracking-wider">
              Loading…
            </div>
          }
        >
          <UnsubscribeClient searchParamsPromise={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
