"use client";

import Link from "next/link";

const CRITERIA = [
  {
    label: "Interest Rates & Fees",
    weight: "25%",
    desc: "Actual cost to the consumer, not advertised rates",
  },
  {
    label: "Features & Benefits",
    weight: "20%",
    desc: "Real value of rewards, perks, and tools provided",
  },
  {
    label: "Customer Experience",
    weight: "20%",
    desc: "App ratings, support quality, resolution speed",
  },
  {
    label: "Eligibility & Access",
    weight: "15%",
    desc: "How easy is it for average Indians to qualify",
  },
  {
    label: "Transparency",
    weight: "10%",
    desc: "Hidden charges, T&C clarity, disclosure quality",
  },
  {
    label: "Regulatory Standing",
    weight: "10%",
    desc: "RBI/SEBI/IRDAI compliance, claim settlement ratios",
  },
];

export default function TrustMethodology() {
  return (
    <section className="bg-[#0A1F14] text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-12">
          <div className="font-data text-[11px] uppercase tracking-[4px] text-[#D97706] mb-4">
            Our Methodology
          </div>
          <h2 className="font-display text-[32px] sm:text-[40px] font-black leading-[1.0] tracking-tight mb-4">
            Every opinion is backed by{" "}
            <span className="text-[#D97706]">disclosed criteria.</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            We don&apos;t hide behind &quot;editorial discretion.&quot;
            Here&apos;s exactly how we rate every product on this platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-white/10">
          {CRITERIA.map((item, i) => (
            <div
              key={item.label}
              className={`p-6 ${i < CRITERIA.length - 1 ? "border-b border-r border-white/10" : ""}`}
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-data text-[11px] uppercase tracking-[2px] text-white/40">
                  Criterion {i + 1}
                </span>
                <span className="font-data text-2xl font-bold text-[#16A34A]">
                  {item.weight}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold mb-1">
                {item.label}
              </h3>
              <p className="text-sm text-white/50">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-6">
          <Link
            href="/about/methodology"
            className="inline-flex items-center font-data text-[12px] uppercase tracking-[2px] text-[#D97706] hover:text-[#FBBF24] transition-colors"
          >
            Full methodology disclosed &rarr;
          </Link>
          <Link
            href="/about/editorial-standards"
            className="inline-flex items-center font-data text-[12px] uppercase tracking-[2px] text-white/40 hover:text-white transition-colors"
          >
            Editorial standards &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
