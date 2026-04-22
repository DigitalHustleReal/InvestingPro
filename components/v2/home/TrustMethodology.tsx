import Link from "next/link";
import {
  TrendingUp,
  FileSearch,
  Users,
  ShieldCheck,
  Eye,
  Scale,
} from "lucide-react";

// Brainstorm Phase 2 §7: "How We Rate" — 6 weighted criteria cards.
// This is the editorial methodology showcase — builds E-E-A-T trust,
// anchors every product verdict on the platform. Each card links to the
// methodology doc where the weighting math is fully disclosed.

const CRITERIA = [
  {
    number: "01",
    icon: TrendingUp,
    label: "Rates & Returns",
    weight: "25%",
    desc: "We benchmark every product against its category median. A rate in the top quartile earns full marks; below-average rates are penalised.",
  },
  {
    number: "02",
    icon: FileSearch,
    label: "Features & Fit",
    weight: "20%",
    desc: "Breadth of useful features, not vanity specs. Does the product solve a real problem for Indian households, or just pad a feature sheet?",
  },
  {
    number: "03",
    icon: Users,
    label: "Customer Experience",
    weight: "20%",
    desc: "App ratings, support response times, grievance redressal, complaint-to-customer ratios. Public data from BOB / SEBI / RBI where available.",
  },
  {
    number: "04",
    icon: ShieldCheck,
    label: "Eligibility & Access",
    weight: "15%",
    desc: "Minimum income, credit score, documentation burden. Products that exclude most Indians score lower than inclusive equivalents.",
  },
  {
    number: "05",
    icon: Eye,
    label: "Transparency",
    weight: "10%",
    desc: "Hidden charges, fine print, clarity of T&Cs. Products that bury their costs or use misleading marketing lose points here.",
  },
  {
    number: "06",
    icon: Scale,
    label: "Regulatory Standing",
    weight: "10%",
    desc: "RBI/SEBI/IRDAI compliance history, penalty record, licensing status. Fresh regulatory action drops the score by a full tier.",
  },
];

export default function TrustMethodology() {
  return (
    <section className="py-16 md:py-20 surface-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-10">
          <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-3">
            How We Rate
          </div>
          <h2 className="font-display font-black text-[32px] sm:text-[44px] leading-[1.08] tracking-tight text-ink">
            Every rating.{" "}
            <em className="italic text-indian-gold">Six criteria.</em>
          </h2>
          <p className="text-sm text-ink-60 mt-3 leading-relaxed">
            We publish the full weighted methodology behind every product score.
            No black box. No paid placement. No editorial shortcuts — every
            opinion on this platform can be traced back to these six criteria.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CRITERIA.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.number}
                className="group bg-white border-2 border-ink/10 rounded-sm p-6 hover:border-ink/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-indian-gold/10 rounded-sm flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indian-gold" />
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60">
                      Weight
                    </div>
                    <div className="font-mono text-[18px] font-bold text-ink tabular-nums">
                      {c.weight}
                    </div>
                  </div>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60 mb-1">
                  Criterion {c.number}
                </div>
                <h3 className="font-display font-bold text-lg text-ink mb-2 leading-snug">
                  {c.label}
                </h3>
                <p className="text-[13px] text-ink-60 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 pt-8 border-t border-ink/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-mono text-[11px] text-ink-60 leading-relaxed max-w-xl">
            Weights are fixed per product category — we re-publish if they ever
            change. Last methodology review:{" "}
            <strong className="text-ink">April 2026</strong>.
          </p>
          <Link
            href="/about/methodology"
            className="font-mono text-[11px] uppercase tracking-wider text-indian-gold hover:underline whitespace-nowrap"
          >
            Read full methodology &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
