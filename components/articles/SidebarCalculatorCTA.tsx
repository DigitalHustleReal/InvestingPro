import Link from "next/link";
import { Calculator, ArrowRight } from "lucide-react";

const CATEGORY_CALCULATORS: Record<
  string,
  { label: string; href: string; desc: string }[]
> = {
  "tax-planning": [
    {
      label: "Income Tax Calculator",
      href: "/calculators/tax",
      desc: "Compare old vs new regime",
    },
    {
      label: "PPF Calculator",
      href: "/calculators/ppf",
      desc: "Project maturity amount",
    },
  ],
  tax: [
    {
      label: "Income Tax Calculator",
      href: "/calculators/tax",
      desc: "Compare old vs new regime",
    },
    {
      label: "HRA Calculator",
      href: "/calculators/hra",
      desc: "Calculate HRA exemption",
    },
  ],
  "mutual-funds": [
    {
      label: "SIP Calculator",
      href: "/calculators/sip",
      desc: "Project your SIP returns",
    },
    {
      label: "CAGR Calculator",
      href: "/calculators/cagr",
      desc: "Calculate growth rate",
    },
  ],
  "credit-cards": [
    {
      label: "Credit Card Calculator",
      href: "/calculators/credit-card",
      desc: "Compare rewards value",
    },
  ],
  loans: [
    {
      label: "Home Loan EMI",
      href: "/calculators/home-loan-emi",
      desc: "Calculate your EMI",
    },
    {
      label: "Loan Comparison",
      href: "/calculators/loan-comparison",
      desc: "Compare loan offers",
    },
  ],
  "fixed-deposits": [
    {
      label: "FD Calculator",
      href: "/calculators/fd",
      desc: "Calculate FD maturity",
    },
  ],
  insurance: [
    {
      label: "Term Insurance",
      href: "/calculators/term-insurance",
      desc: "Estimate cover needed",
    },
  ],
  retirement: [
    {
      label: "Retirement Calculator",
      href: "/calculators/retirement",
      desc: "Plan your retirement",
    },
    {
      label: "PPF Calculator",
      href: "/calculators/ppf",
      desc: "Project PPF maturity",
    },
  ],
};

export default function SidebarCalculatorCTA({
  category,
}: {
  category?: string;
}) {
  const calcs = CATEGORY_CALCULATORS[category || ""] || [
    {
      label: "SIP Calculator",
      href: "/calculators/sip",
      desc: "Plan your investments",
    },
    {
      label: "Tax Calculator",
      href: "/calculators/tax",
      desc: "Save on taxes",
    },
  ];

  return (
    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold text-primary uppercase tracking-wider">
          Free Calculators
        </span>
      </div>
      <div className="space-y-2">
        {calcs.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="flex items-center justify-between p-2.5 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-colors group"
          >
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                {calc.label}
              </div>
              <div className="text-[11px] text-gray-500">{calc.desc}</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
