"use client";

import Link from "next/link";
import { Shield, Award, BarChart3, Users } from "lucide-react";

const TRUST_PILLARS = [
  {
    icon: Shield,
    title: "Independent Research",
    description:
      "Every product is scored by our transparent algorithm. No bank or AMC can pay for a higher ranking.",
    link: "/editorial-methodology",
    linkText: "Our methodology",
  },
  {
    icon: Award,
    title: "No Paid Rankings",
    description:
      "Affiliate commissions fund the platform but never influence rankings, scores, or recommendations.",
    link: "/how-we-make-money",
    linkText: "How we make money",
  },
  {
    icon: Users,
    title: "Expert Reviewed",
    description:
      "Every article is reviewed by certified financial experts — CAs, CFAs, and former banking executives.",
    link: "/authors",
    linkText: "Meet our team",
  },
  {
    icon: BarChart3,
    title: "Data-Driven",
    description:
      "Data sourced from AMFI, RBI, SEBI, and official bank websites. Updated daily. Cross-verified.",
    link: "/about-our-data",
    linkText: "About our data",
  },
];

export default function TrustMethodology() {
  return (
    <section className="py-12 md:py-16 px-4 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2">
            Trust & Transparency
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            How We Earn Your Trust
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Financial decisions are too important for biased advice. Here is
            exactly how we keep our content honest.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_PILLARS.map((pillar) => (
            <Link
              key={pillar.title}
              href={pillar.link}
              className="group p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                <pillar.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-[15px] group-hover:text-primary-600 transition-colors">
                {pillar.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                {pillar.description}
              </p>
              <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 group-hover:underline">
                {pillar.linkText} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
