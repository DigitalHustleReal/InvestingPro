import { BarChart3, FileText, Calculator, Shield } from "lucide-react";

const STATS = [
  {
    icon: BarChart3,
    num: "1,000+",
    label: "Products compared",
    desc: "Credit cards, loans, mutual funds, insurance, FDs, and demat accounts",
  },
  {
    icon: FileText,
    num: "228",
    label: "Researched articles",
    desc: "In-depth guides, reviews, and comparisons by our editorial team",
  },
  {
    icon: Calculator,
    num: "75",
    label: "Free calculators",
    desc: "SIP, EMI, tax, retirement, and 70+ more financial tools",
  },
  {
    icon: Shield,
    num: "₹0",
    label: "Paid placements",
    desc: "Rankings based on data, not who pays us. Methodology always disclosed.",
  },
];

export default function TrustStats() {
  return (
    <section className="py-16 md:py-20 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-[28px] sm:text-[40px] font-medium leading-[1.08] tracking-tight text-ink">
            Why millions{" "}
            <em className="italic text-authority-green">trust us</em>
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Independent research. Transparent methodology. No conflicts of
            interest.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-1">
                  {stat.num}
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-2">
                  {stat.label}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {stat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
