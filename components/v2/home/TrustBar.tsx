// TrustBar — live market data ticker, not a vanity-inventory brag.
// Data points are things users actually care about: live rates + tax dates.
// Updated weekly or via external feed (future).

export default function TrustBar() {
  const DATA_POINTS = [
    { label: "Best Savings", value: "7.25% p.a.", positive: true },
    { label: "Cheapest Home Loan", value: "8.35% p.a.", positive: true },
    { label: "Top FD Rate", value: "9.10% p.a.", positive: true },
    { label: "Repo Rate", value: "6.50%", positive: true },
    { label: "ITR deadline", value: "31 Jul", positive: true },
  ];

  return (
    <div className="surface-ink border-b border-canvas-15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-8 py-3 overflow-x-auto scrollbar-hide">
          <span className="font-mono text-[10px] uppercase tracking-wider text-indian-gold whitespace-nowrap flex-shrink-0">
            Live Data
          </span>
          {DATA_POINTS.map((point) => (
            <div
              key={point.label}
              className="flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            >
              <span className="font-mono text-[11px] uppercase tracking-wider text-canvas-70">
                {point.label}
              </span>
              <span
                className={`font-mono text-[13px] font-semibold tabular-nums ${
                  point.positive ? "text-action-green" : "text-warning-red"
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
