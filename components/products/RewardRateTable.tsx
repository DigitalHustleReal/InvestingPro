"use client";

import { Gift, TrendingUp, Info } from "lucide-react";

interface RewardRateTableProps {
  categories: { name: string; rate: string }[];
  pointsPerRupee: number;
  redemptionValue: string;
  annualFee: number;
}

function parseRate(rate: string): number {
  // Extract multiplier from strings like "10X", "5x rewards", "2X points", etc.
  const match = rate.match(/(\d+(?:\.\d+)?)\s*[xX]/i);
  if (match) return parseFloat(match[1]);
  // Try plain number
  const numMatch = rate.match(/(\d+(?:\.\d+)?)/);
  if (numMatch) return parseFloat(numMatch[1]);
  return 1;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function RewardRateTable({
  categories,
  pointsPerRupee,
  redemptionValue,
  annualFee,
}: RewardRateTableProps) {
  // Parse redemption value — e.g., "₹0.25 per point" or "0.25"
  const redemptionMatch = redemptionValue.match(/(\d+(?:\.\d+)?)/);
  const redemptionPerPoint = redemptionMatch
    ? parseFloat(redemptionMatch[1])
    : 0.25;

  // Find the best rate row
  const rates = categories.map((cat) => parseRate(cat.rate));
  const maxRate = Math.max(...rates);

  // Calculate annual fee break-even based on the best rate
  // Break-even = annualFee / (bestPoints per ₹150 * redemptionPerPoint / 150)
  const bestPointsPer150 = maxRate * pointsPerRupee;
  const bestValuePer150 = bestPointsPer150 * redemptionPerPoint;
  const breakEvenSpend =
    bestValuePer150 > 0 ? annualFee / (bestValuePer150 / 150) : 0;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Desktop Table */}
      <div className="hidden sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-50 border-b border-green-100">
              <th className="text-left px-5 py-3.5 font-bold text-green-900 text-xs uppercase tracking-wider">
                Category
              </th>
              <th className="text-left px-5 py-3.5 font-bold text-green-900 text-xs uppercase tracking-wider">
                Reward Rate
              </th>
              <th className="text-right px-5 py-3.5 font-bold text-green-900 text-xs uppercase tracking-wider">
                Points / ₹150
              </th>
              <th className="text-right px-5 py-3.5 font-bold text-green-900 text-xs uppercase tracking-wider">
                Est. Value
              </th>
              <th className="text-right px-5 py-3.5 font-bold text-green-900 text-xs uppercase tracking-wider">
                Cap
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat, i) => {
              const multiplier = parseRate(cat.rate);
              const pointsPer150 = multiplier * pointsPerRupee;
              const estimatedValue = pointsPer150 * redemptionPerPoint;
              const isBest = multiplier === maxRate;

              return (
                <tr
                  key={i}
                  className={
                    isBest
                      ? "bg-green-50/60 border-l-4 border-l-green-500"
                      : "hover:bg-gray-50 border-l-4 border-l-transparent"
                  }
                >
                  <td className="px-5 py-4 font-semibold text-gray-900 flex items-center gap-2">
                    {cat.name}
                    {isBest && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        Best
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 font-bold text-green-700">
                    {cat.rate}
                  </td>
                  <td className="px-5 py-4 text-right text-gray-700 font-medium tabular-nums">
                    {pointsPer150.toFixed(pointsPer150 % 1 === 0 ? 0 : 1)}
                  </td>
                  <td className="px-5 py-4 text-right text-gray-700 font-medium tabular-nums">
                    {formatCurrency(estimatedValue)}
                  </td>
                  <td className="px-5 py-4 text-right text-gray-500 text-xs">
                    Check T&C
                  </td>
                </tr>
              );
            })}
          </tbody>
          {annualFee > 0 && (
            <tfoot>
              <tr className="bg-amber-50 border-t-2 border-amber-200">
                <td colSpan={5} className="px-5 py-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong className="text-gray-900">
                        Annual Fee Break-even:
                      </strong>{" "}
                      Spend {formatCurrency(breakEvenSpend)} in the best
                      category to earn rewards equal to the{" "}
                      {formatCurrency(annualFee)} annual fee
                    </span>
                  </div>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Mobile Stacked Cards */}
      <div className="sm:hidden divide-y divide-gray-100">
        <div className="bg-green-50 px-4 py-3 flex items-center gap-2">
          <Gift className="w-4 h-4 text-green-700" />
          <span className="font-bold text-green-900 text-sm">
            Reward Rate Breakdown
          </span>
        </div>
        {categories.map((cat, i) => {
          const multiplier = parseRate(cat.rate);
          const pointsPer150 = multiplier * pointsPerRupee;
          const estimatedValue = pointsPer150 * redemptionPerPoint;
          const isBest = multiplier === maxRate;

          return (
            <div
              key={i}
              className={`px-4 py-4 ${isBest ? "bg-green-50/60 border-l-4 border-l-green-500" : "border-l-4 border-l-transparent"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900 text-sm">
                  {cat.name}
                </span>
                {isBest && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    Best
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-gray-500 mb-0.5">Rate</p>
                  <p className="font-bold text-green-700">{cat.rate}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-0.5">Pts/₹150</p>
                  <p className="font-medium text-gray-800 tabular-nums">
                    {pointsPer150.toFixed(pointsPer150 % 1 === 0 ? 0 : 1)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-0.5">Value</p>
                  <p className="font-medium text-gray-800 tabular-nums">
                    {formatCurrency(estimatedValue)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        {annualFee > 0 && (
          <div className="bg-amber-50 px-4 py-3 border-t-2 border-amber-200">
            <div className="flex items-start gap-2 text-xs">
              <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">
                <strong>Break-even:</strong> Spend{" "}
                {formatCurrency(breakEvenSpend)} in best category to cover the{" "}
                {formatCurrency(annualFee)} fee
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
