"use client";

import Link from "next/link";

export default function TrustMethodology() {
  return (
    <section className="border-t border-gray-200 dark:border-white/10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-center sm:text-left text-gray-500 dark:text-white/60 text-sm">
            Every product on this platform is rated using{" "}
            <strong className="text-gray-900 dark:text-white">
              6 weighted criteria
            </strong>{" "}
            — interest rates, features, customer experience, eligibility,
            transparency, and regulatory standing.
          </p>
          <Link
            href="/about/methodology"
            className="flex-shrink-0 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors whitespace-nowrap"
          >
            See full methodology &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
