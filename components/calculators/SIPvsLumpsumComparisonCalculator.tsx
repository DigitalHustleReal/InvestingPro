"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Clock,
  TrendingUp,
  BarChart3,
  Activity,
} from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { VSComparisonLayout } from "./shared/VSComparisonLayout";
import { AIInsight } from "./shared/AIInsight";
import { TrustStrip } from "./shared/TrustStrip";
import { PopularCalculators } from "./shared/PopularCalculators";
import { formatINR } from "./shared/charts";

type VolatilityLevel = "low" | "medium" | "high";

const VOLATILITY_LABELS: Record<VolatilityLevel, string> = {
  low: "Low (Large Cap / Index)",
  medium: "Medium (Flexi / Mid Cap)",
  high: "High (Small Cap / Sectoral)",
};

// Volatility impact: standard deviation of monthly returns
const VOLATILITY_SD: Record<VolatilityLevel, number> = {
  low: 0.04,
  medium: 0.06,
  high: 0.09,
};

function calcLumpsum(
  amount: number,
  annualRate: number,
  years: number,
): number {
  return amount * Math.pow(1 + annualRate / 100, years);
}

function calcSIP(monthly: number, annualRate: number, years: number): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

// Risk-adjusted return using Sharpe-like ratio (simplified)
function riskAdjustedCAGR(
  finalValue: number,
  invested: number,
  years: number,
  sd: number,
): number {
  const cagr = (Math.pow(finalValue / invested, 1 / years) - 1) * 100;
  // Penalize by volatility: effective return = CAGR - 0.5 * variance
  return Math.round((cagr - 0.5 * sd * sd * 10000) * 100) / 100;
}

// Simulate best/worst case using +/- 1.5 SD shift on annual return
function scenarioReturn(
  baseRate: number,
  sd: number,
  direction: "best" | "worst",
): number {
  const shift = sd * Math.sqrt(12) * 100 * 1.5; // annualized
  return direction === "best"
    ? baseRate + shift
    : Math.max(1, baseRate - shift);
}

export function SIPvsLumpsumComparisonCalculator() {
  const [totalAmount, setTotalAmount] = useState(1000000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [volatility, setVolatility] = useState<VolatilityLevel>("medium");

  const monthlySIP = totalAmount / (years * 12);
  const sd = VOLATILITY_SD[volatility];

  const result = useMemo(() => {
    const lumpsumFV = Math.round(
      calcLumpsum(totalAmount, expectedReturn, years),
    );
    const sipFV = Math.round(calcSIP(monthlySIP, expectedReturn, years));

    const lumpsumGain = lumpsumFV - totalAmount;
    const sipGain = sipFV - totalAmount;

    // Risk-adjusted returns
    const lumpsumRiskAdj = riskAdjustedCAGR(lumpsumFV, totalAmount, years, sd);
    const sipRiskAdj = riskAdjustedCAGR(sipFV, totalAmount, years, sd * 0.6); // SIP has lower effective volatility

    // Best case / worst case
    const bestRate = scenarioReturn(expectedReturn, sd, "best");
    const worstRate = scenarioReturn(expectedReturn, sd, "worst");

    const lumpsumBest = Math.round(calcLumpsum(totalAmount, bestRate, years));
    const lumpsumWorst = Math.round(calcLumpsum(totalAmount, worstRate, years));
    const sipBest = Math.round(calcSIP(monthlySIP, bestRate, years));
    const sipWorst = Math.round(calcSIP(monthlySIP, worstRate, years));

    // Rupee cost averaging benefit = SIP worst case vs Lumpsum worst case (relative)
    const rcaBenefit =
      sipWorst > lumpsumWorst
        ? Math.round(((sipWorst - lumpsumWorst) / lumpsumWorst) * 100 * 100) /
          100
        : 0;

    // Downside protection: how much less SIP loses in worst case vs lumpsum
    const lumpsumWorstLoss = totalAmount - lumpsumWorst;
    const sipWorstLoss = totalAmount - sipWorst;
    const downsideProtection =
      lumpsumWorstLoss > 0 && sipWorstLoss < lumpsumWorstLoss
        ? Math.round(
            ((lumpsumWorstLoss - sipWorstLoss) / lumpsumWorstLoss) * 100,
          )
        : 0;

    // CAGR
    const lumpsumCAGR =
      Math.round((Math.pow(lumpsumFV / totalAmount, 1 / years) - 1) * 10000) /
      100;
    const sipCAGR =
      Math.round((Math.pow(sipFV / totalAmount, 1 / years) - 1) * 10000) / 100;

    const diff = Math.abs(lumpsumFV - sipFV);
    const winner =
      lumpsumFV > sipFV ? "lumpsum" : lumpsumFV < sipFV ? "sip" : "tie";

    return {
      lumpsumFV,
      sipFV,
      lumpsumGain,
      sipGain,
      lumpsumCAGR,
      sipCAGR,
      lumpsumRiskAdj,
      sipRiskAdj,
      lumpsumBest,
      lumpsumWorst,
      sipBest,
      sipWorst,
      rcaBenefit,
      downsideProtection,
      diff,
      winner,
    };
  }, [totalAmount, years, expectedReturn, monthlySIP, sd]);

  const comparisonMetrics = useMemo(
    () => [
      {
        label: "Final Corpus",
        optionA: formatINR(result.sipFV),
        optionB: formatINR(result.lumpsumFV),
        winner:
          result.sipFV > result.lumpsumFV
            ? ("A" as const)
            : result.lumpsumFV > result.sipFV
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Total Returns",
        optionA: formatINR(result.sipGain),
        optionB: formatINR(result.lumpsumGain),
        winner:
          result.sipGain > result.lumpsumGain
            ? ("A" as const)
            : result.lumpsumGain > result.sipGain
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "CAGR",
        optionA: `${result.sipCAGR}%`,
        optionB: `${result.lumpsumCAGR}%`,
        winner:
          result.sipCAGR > result.lumpsumCAGR
            ? ("A" as const)
            : result.lumpsumCAGR > result.sipCAGR
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Risk-Adj Return",
        optionA: `${result.sipRiskAdj}%`,
        optionB: `${result.lumpsumRiskAdj}%`,
        winner:
          result.sipRiskAdj > result.lumpsumRiskAdj
            ? ("A" as const)
            : result.lumpsumRiskAdj > result.sipRiskAdj
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Best Case",
        optionA: formatINR(result.sipBest),
        optionB: formatINR(result.lumpsumBest),
        winner:
          result.sipBest > result.lumpsumBest
            ? ("A" as const)
            : result.lumpsumBest > result.sipBest
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Worst Case",
        optionA: formatINR(result.sipWorst),
        optionB: formatINR(result.lumpsumWorst),
        winner:
          result.sipWorst > result.lumpsumWorst
            ? ("A" as const)
            : result.lumpsumWorst > result.sipWorst
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Timing Risk",
        optionA: "Low (averaging)",
        optionB: "High (all at once)",
        winner: "A" as const,
      },
      {
        label: "Discipline",
        optionA: "Auto-debit monthly",
        optionB: "One-time decision",
        winner: "A" as const,
      },
    ],
    [result],
  );

  const verdict = useMemo(() => {
    if (result.winner === "lumpsum") {
      return {
        winner: "B" as const,
        title: `Lumpsum wins by ${formatINR(result.diff)} in a steady ${expectedReturn}% market`,
        description: `All ${formatINR(totalAmount)} compounds from Day 1 in lumpsum, giving ${formatINR(result.diff)} more than SIP. But in ${volatility} volatility, SIP's risk-adjusted return (${result.sipRiskAdj}%) is ${result.sipRiskAdj > result.lumpsumRiskAdj ? "better" : "close to"} lumpsum (${result.lumpsumRiskAdj}%). If you can handle short-term drops, lumpsum wins. Otherwise, SIP or STP is safer.`,
      };
    } else if (result.winner === "sip") {
      return {
        winner: "A" as const,
        title: `SIP wins by ${formatINR(result.diff)} with rupee cost averaging`,
        description: `SIP beats lumpsum here due to averaging. Monthly installments of ${formatINR(monthlySIP)} spread your risk across ${years * 12} months. In ${volatility} volatility markets, SIP's risk-adjusted return of ${result.sipRiskAdj}% beats lumpsum's ${result.lumpsumRiskAdj}%.`,
      };
    }
    return {
      winner: "tie" as const,
      title: "Both strategies deliver similar returns",
      description: `At ${expectedReturn}% returns, SIP and lumpsum are neck-and-neck. Consider STP — invest lumpsum in liquid fund, transfer ${formatINR(monthlySIP)}/mo to equity. Best of both worlds.`,
    };
  }, [result, expectedReturn, totalAmount, volatility, monthlySIP, years]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    if (result.winner === "lumpsum") {
      ins.push(
        `Market steadily upar ja raha hai toh lumpsum best — ${formatINR(totalAmount)} Day 1 se compound hota hai aur ${formatINR(result.diff)} zyada milta hai. Par agar invest karne ke baad market gir gaya toh tension hogi!`,
      );
      ins.push(
        `SIP ka fayda: worst case mein SIP ${formatINR(result.sipWorst)} deta hai vs lumpsum ${formatINR(result.lumpsumWorst)}. Market gir raha hai toh SIP best — averaging ka magic kaam karta hai.`,
      );
    } else {
      ins.push(
        `Rupee cost averaging ki wajah se SIP ${formatINR(result.diff)} zyada de raha hai. Jab market girta hai toh SIP mein zyada units milte hain — yeh averaging ka power hai.`,
      );
    }
    ins.push(
      `Confused ho? STP karo — ${formatINR(totalAmount)} liquid fund mein daalo, phir ${formatINR(monthlySIP)}/mo equity mein transfer. Idle money bhi kamati hai aur averaging bhi milta hai.`,
    );
    if (volatility === "high") {
      ins.push(
        `High volatility select kiya hai — small/sectoral funds mein SIP better hai. Ek saath paisa lagaane ka risk bahut zyada hai. SIP karo aur bhool jao!`,
      );
    }
    return ins;
  }, [result, totalAmount, monthlySIP, volatility]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Inputs */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Investment Details
          </h2>
          <div className="space-y-4">
            <SliderInput
              label="Total Amount to Invest"
              icon={IndianRupee}
              value={totalAmount}
              onChange={setTotalAmount}
              min={100000}
              max={10000000}
              step={50000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Investment Horizon"
              icon={Clock}
              value={years}
              onChange={setYears}
              min={1}
              max={30}
              step={1}
              formatDisplay={(v) => `${v} years`}
            />
            <SliderInput
              label="Expected Return (p.a.)"
              icon={TrendingUp}
              value={expectedReturn}
              onChange={setExpectedReturn}
              min={8}
              max={18}
              step={0.5}
              formatDisplay={(v) => `${v}%`}
            />

            {/* Volatility Selector */}
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-gray-600 flex items-center gap-2">
                <Activity size={15} className="text-green-600" />
                Market Volatility
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["low", "medium", "high"] as VolatilityLevel[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setVolatility(v)}
                    className={`text-xs font-medium py-2 px-2 rounded-lg border transition-all ${
                      volatility === v
                        ? "bg-green-50 border-green-300 text-green-700 ring-2 ring-green-200"
                        : "bg-white border-gray-200 text-gray-500 hover:border-green-200"
                    }`}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-400">
                {VOLATILITY_LABELS[volatility]}
              </p>
            </div>
          </div>

          <div className="mt-5 p-3 bg-green-50 border border-green-100 rounded-xl space-y-1">
            <p className="text-xs text-green-800">
              <strong>SIP Amount:</strong> {formatINR(monthlySIP)}/month x{" "}
              {years * 12} months
            </p>
            <p className="text-xs text-green-800">
              <strong>Lumpsum:</strong> {formatINR(totalAmount)} on Day 1
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          <VSComparisonLayout
            titleA="SIP (Monthly)"
            titleB="Lumpsum (Day 1)"
            colorA="#166534"
            colorB="#d97706"
            valueA={formatINR(result.sipFV)}
            valueLabelA="Final Corpus"
            valueB={formatINR(result.lumpsumFV)}
            valueLabelB="Final Corpus"
            metrics={comparisonMetrics}
            verdict={verdict}
          />

          {/* Rupee Cost Averaging Insight */}
          {result.rcaBenefit > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-xs font-bold text-green-800 mb-1">
                Rupee Cost Averaging Benefit
              </p>
              <p className="text-sm text-green-700">
                In worst-case scenario, SIP protects{" "}
                <strong>{result.downsideProtection}%</strong> of your downside.
                SIP worst case ({formatINR(result.sipWorst)}) vs Lumpsum worst
                case ({formatINR(result.lumpsumWorst)}) — SIP gives{" "}
                <strong>{result.rcaBenefit}%</strong> more in falling markets.
              </p>
            </div>
          )}

          <AIInsight insights={insights} />
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators
          currentSlug="sip-vs-lumpsum-comparison"
          variant="strip"
        />
      </div>
    </div>
  );
}
