export default function TrustBar() {
  const DATA_POINTS = [
    { label: "Best Savings Rate", value: "7.25% p.a.", positive: true },
    { label: "Cheapest Home Loan", value: "8.35% p.a.", positive: true },
    { label: "Top FD Rate", value: "9.10% p.a.", positive: true },
    { label: "Articles Published", value: "228+", positive: true },
    { label: "Calculators", value: "75 free", positive: true },
  ];

  return (
    <div className="bg-ink dark:bg-gray-950 border-b border-ink/80 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-8 py-3 overflow-x-auto scrollbar-hide">
          <span className="text-[10px] uppercase tracking-wider text-amber-400 whitespace-nowrap flex-shrink-0">
            Live Data
          </span>
          {DATA_POINTS.map((point) => (
            <div
              key={point.label}
              className="flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            >
              <span className="text-[13px] text-white/50">{point.label}</span>
              <span
                className={`text-[13px] font-medium ${
                  point.positive ? "text-green-400" : "text-red-400"
                }`}
              >
                {point.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
