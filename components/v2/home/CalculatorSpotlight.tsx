import Link from "next/link";
import { TrendingUp, Home, Receipt } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CALCS: {
  icon: LucideIcon;
  iconBg: string;
  name: string;
  desc: string;
  label: string;
  sub: string;
  val: string;
  valSub: string;
  valColor?: string;
  href: string;
}[] = [
  {
    icon: TrendingUp,
    iconBg: "bg-green-50 text-green-700",
    name: "SIP Calculator",
    desc: "Monthly SIP growth with inflation, tax, and step-up projection.",
    label: "₹10K/mo · 20yr · 12%",
    sub: "with inflation + LTCG",
    val: "₹75.8L",
    valSub: "Real: ₹24.1L",
    href: "/calculators/sip",
  },
  {
    icon: Home,
    iconBg: "bg-blue-50 text-blue-700",
    name: "EMI Calculator",
    desc: "Loan EMI with prepayment savings and rate sensitivity.",
    label: "₹50L · 8.5% · 20yr",
    sub: "with prepayment impact",
    val: "₹43,391",
    valSub: "/month",
    href: "/calculators/emi",
  },
  {
    icon: Receipt,
    iconBg: "bg-orange-50 text-orange-700",
    name: "Tax Calculator",
    desc: "Old vs New regime with deduction finder. Budget 2026.",
    label: "₹12L · both regimes",
    sub: "updated Budget 2026",
    val: "Save ₹23K",
    valSub: "New Regime",
    valColor: "text-green-600",
    href: "/calculators/tax",
  },
];

export default function CalculatorSpotlight() {
  return (
    <section className="relative py-12 md:py-16 px-4 lg:px-8 bg-gray-50 overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(22,163,74,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,.02) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-2 mb-7">
          <div>
            <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
              Free Tools
            </div>
            <h2 className="text-2xl md:text-[28px] font-bold text-[--v2-ink] tracking-tight">
              Run the numbers <span className="text-green-600">first</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              25 calculators with tax impact, inflation, and shareable results.
            </p>
          </div>
          <Link
            href="/calculators"
            className="text-[13px] text-green-600 font-medium hover:text-green-700 transition-colors"
          >
            All 25 calculators →
          </Link>
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          {CALCS.map((calc) => (
            <div
              key={calc.name}
              className="bg-white border border-gray-200 rounded-xl p-5 transition-all duration-200 hover:border-green-500 hover:shadow-md hover:-translate-y-0.5"
            >
              <div
                className={`w-10 h-10 rounded-[10px] flex items-center justify-center mb-3 ${calc.iconBg}`}
              >
                <calc.icon size={20} />
              </div>
              <h3 className="text-[15px] font-semibold text-[--v2-ink] mb-1">
                {calc.name}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3.5">
                {calc.desc}
              </p>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-500">{calc.label}</div>
                  <div className="text-[9px] text-gray-500 mt-0.5">
                    {calc.sub}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-serif text-[22px] ${calc.valColor || "text-[--v2-ink]"}`}
                  >
                    {calc.val}
                  </div>
                  <div className="text-[10px] text-green-600">
                    {calc.valSub}
                  </div>
                </div>
              </div>
              <Link
                href={calc.href}
                className="block mt-3 text-xs text-green-600 font-medium"
              >
                Open calculator →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
