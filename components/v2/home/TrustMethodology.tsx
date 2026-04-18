"use client";

import Link from "next/link";

export default function TrustMethodology() {
  return (
    <section className="border-y-2 border-[#0A1F14]/10 dark:border-white/10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-center sm:text-left text-[#0A1F14]/60 dark:text-white/60 text-sm">
            Every product on this platform is rated using{" "}
            <strong className="text-[#0A1F14] dark:text-white">
              6 weighted criteria
            </strong>{" "}
            — interest rates, features, customer experience, eligibility,
            transparency, and regulatory standing.
          </p>
          <Link
            href="/about/methodology"
            className="flex-shrink-0 font-data text-[11px] uppercase tracking-[2px] text-[#D97706] hover:text-[#B45309] transition-colors whitespace-nowrap"
          >
            See full methodology &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
