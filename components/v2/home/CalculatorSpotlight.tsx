import Link from "next/link";
import { TrendingUp, Home, Receipt } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CALCS: {
  icon: LucideIcon;
  name: string;
  desc: string;
  label: string;
  val: string;
  valSub: string;
  href: string;
}[] = [
  {
    icon: TrendingUp,
    name: "SIP Calculator",
    desc: "Monthly SIP growth with inflation, tax, and step-up projection.",
    label: "₹10K/mo · 20yr · 12%",
    val: "₹75.8L",
    valSub: "Real: ₹24.1L after inflation",
    href: "/calculators/sip",
  },
  {
    icon: Home,
    name: "EMI Calculator",
    desc: "Loan EMI with prepayment savings and rate sensitivity analysis.",
    label: "₹50L · 8.5% · 20yr",
    val: "₹43,391",
    valSub: "/month · ₹54.1L total interest",
    href: "/calculators/emi",
  },
  {
    icon: Receipt,
    name: "Tax Calculator",
    desc: "Old vs New regime with deduction finder. Updated Budget 2026.",
    label: "₹12L salary · both regimes",
    val: "Save ₹23K",
    valSub: "New Regime wins at this salary",
    href: "/calculators/tax",
  },
];

export default function CalculatorSpotlight() {
  return (
    <section className="py-16 md:py-20 bg-white dark:bg-gray-950/50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Free Tools
            </div>
            <h2 className="text-[28px] sm:text-[40px] font-medium leading-[1.08] tracking-tight text-ink dark:text-white">
              Run the numbers{" "}
              <em className="italic text-authority-green">before you commit</em>
            </h2>
          </div>
          <Link
            href="/calculators"
            className="hidden sm:inline-flex text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
          >
            All 75 calculators &rarr;
          </Link>
        </div>

        <div className="grid gap-0 grid-cols-1 sm:grid-cols-3 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
          {CALCS.map((calc, i) => {
            const Icon = calc.icon;
            return (
              <Link
                key={calc.name}
                href={calc.href}
                className={`group p-6 ${
                  i < CALCS.length - 1
                    ? "border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-white/10"
                    : ""
                } hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors`}
              >
                <Icon className="w-6 h-6 text-green-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-green-600 transition-colors">
                  {calc.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-white/60 leading-relaxed mb-5">
                  {calc.desc}
                </p>

                {/* Live result preview */}
                <div className="border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-white/[0.02] p-4">
                  <div className="text-[10px] text-gray-400 dark:text-white/40 uppercase tracking-wider mb-2">
                    {calc.label}
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    {calc.val}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-white/50 mt-1">
                    {calc.valSub}
                  </div>
                </div>

                <div className="mt-4 text-sm font-semibold text-green-600 group-hover:text-green-700 transition-colors">
                  Open calculator &rarr;
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
