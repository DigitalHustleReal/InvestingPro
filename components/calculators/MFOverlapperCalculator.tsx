"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/utils/currency";
import {
  GitMerge,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import {
  FUND_DATABASE,
  calculateMFOverlap,
  type OverlapResult,
} from "@/lib/calculators/mf-overlap";

const MAX_FUNDS = 5;

const CATEGORY_COLORS: Record<string, string> = {
  "Large Cap": "bg-blue-100 text-blue-700",
  "Flexi Cap": "bg-purple-100 text-purple-700",
  "Mid Cap": "bg-amber-100 text-amber-700",
  "Small Cap": "bg-orange-100 text-orange-700",
  ELSS: "bg-green-100 text-green-700",
  Index: "bg-slate-100 text-slate-700",
};

const VERDICT_CONFIG = {
  excellent: { color: "text-green-600", bg: "bg-green-50 border-green-200", icon: CheckCircle, label: "Excellent" },
  good: { color: "text-blue-600", bg: "bg-blue-50 border-blue-200", icon: CheckCircle, label: "Good" },
  fair: { color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: AlertTriangle, label: "Fair" },
  poor: { color: "text-red-600", bg: "bg-red-50 border-red-200", icon: XCircle, label: "High Overlap" },
};

// Group funds by subcategory for the picker
const fundsByCategory = FUND_DATABASE.reduce<Record<string, typeof FUND_DATABASE>>((acc, f) => {
  if (!acc[f.subcategory]) acc[f.subcategory] = [];
  acc[f.subcategory].push(f);
  return acc;
}, {});

export function MFOverlapperCalculator() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredFunds = useMemo(() => {
    if (!searchQuery) return FUND_DATABASE;
    const q = searchQuery.toLowerCase();
    return FUND_DATABASE.filter(
      (f) => f.name.toLowerCase().includes(q) || f.fundHouse.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const result = useMemo<OverlapResult | null>(() => {
    if (selectedIds.length < 2) return null;
    return calculateMFOverlap(selectedIds);
  }, [selectedIds]);

  const toggleFund = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < MAX_FUNDS
        ? [...prev, id]
        : prev
    );
  };

  const verdictCfg = result ? VERDICT_CONFIG[result.verdict] : null;
  const VerdictIcon = verdictCfg?.icon ?? Info;

  return (
    <div className="space-y-6">
      {/* Fund Picker */}
      <Card className="border-0 shadow-lg rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <GitMerge className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Select Mutual Funds
              </CardTitle>
              <p className="text-sm text-slate-500">
                Pick 2–5 funds to check overlap.{" "}
                <span className="font-semibold text-primary-600">
                  {selectedIds.length}/{MAX_FUNDS} selected
                </span>
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by fund name or AMC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>
        </CardHeader>

        <CardContent>
          {/* Selected chips */}
          {selectedIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedIds.map((id) => {
                const fund = FUND_DATABASE.find((f) => f.id === id)!;
                return (
                  <span
                    key={id}
                    onClick={() => toggleFund(id)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-primary-600 text-white rounded-full text-xs font-medium cursor-pointer hover:bg-primary-700 transition-colors"
                  >
                    {fund.name.split(" ").slice(0, 3).join(" ")}
                    <XCircle className="w-3.5 h-3.5" />
                  </span>
                );
              })}
              {selectedIds.length > 0 && (
                <button
                  onClick={() => setSelectedIds([])}
                  className="px-3 py-1 border border-slate-300 rounded-full text-xs text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          )}

          {/* Fund grid */}
          <div className="space-y-4">
            {Object.entries(
              filteredFunds.reduce<Record<string, typeof FUND_DATABASE>>((acc, f) => {
                if (!acc[f.subcategory]) acc[f.subcategory] = [];
                acc[f.subcategory].push(f);
                return acc;
              }, {})
            ).map(([category, funds]) => (
              <div key={category}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {category}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {funds.map((fund) => {
                    const isSelected = selectedIds.includes(fund.id);
                    const isDisabled = !isSelected && selectedIds.length >= MAX_FUNDS;
                    return (
                      <button
                        key={fund.id}
                        onClick={() => !isDisabled && toggleFund(fund.id)}
                        disabled={isDisabled}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-xl border text-left transition-all",
                          isSelected
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-950"
                            : isDisabled
                            ? "border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed"
                            : "border-slate-200 hover:border-primary-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-primary-700"
                        )}
                      >
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors",
                            isSelected
                              ? "border-primary-600 bg-primary-600"
                              : "border-slate-300"
                          )}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">
                            {fund.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">{fund.fundHouse}</p>
                          <span
                            className={cn(
                              "inline-block text-xs px-1.5 py-0.5 rounded mt-1 font-medium",
                              CATEGORY_COLORS[fund.subcategory] ?? "bg-slate-100 text-slate-600"
                            )}
                          >
                            {fund.subcategory}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {selectedIds.length < 2 && (
            <p className="text-center text-sm text-slate-400 mt-6 py-4 border-t">
              Select at least 2 funds to see the overlap analysis
            </p>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && verdictCfg && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Verdict Banner */}
          <Card className={cn("border rounded-2xl shadow-lg", verdictCfg.bg)}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <VerdictIcon className={cn("w-8 h-8 flex-shrink-0 mt-0.5", verdictCfg.color)} />
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-xl font-bold text-slate-900">
                      {verdictCfg.label} — {result.overallOverlapPct}% overlap
                    </h3>
                    <Badge
                      className={cn(
                        "text-sm font-bold",
                        result.diversificationScore >= 80
                          ? "bg-green-600"
                          : result.diversificationScore >= 60
                          ? "bg-blue-600"
                          : result.diversificationScore >= 40
                          ? "bg-amber-600"
                          : "bg-red-600"
                      )}
                    >
                      Diversification: {result.diversificationScore}/100
                    </Badge>
                  </div>
                  <p className="text-slate-700 mt-2">{result.suggestion}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pairwise Overlap */}
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Fund Pair Overlap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.pairwiseOverlap.map((pair, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 truncate pr-4">
                        {pair.fund1.split(" ").slice(0, 3).join(" ")} ↔{" "}
                        {pair.fund2.split(" ").slice(0, 3).join(" ")}
                      </span>
                      <span className="font-bold text-slate-900 flex-shrink-0">
                        {pair.overlapPct}%
                        <span className="text-xs text-slate-400 ml-1">
                          ({pair.commonStocks} stocks)
                        </span>
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          pair.overlapPct < 20
                            ? "bg-green-500"
                            : pair.overlapPct < 40
                            ? "bg-blue-500"
                            : pair.overlapPct < 60
                            ? "bg-amber-500"
                            : "bg-red-500"
                        )}
                        style={{ width: `${Math.min(pair.overlapPct, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Holdings */}
          {result.commonHoldings.length > 0 && (
            <Card className="border-0 shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Shared Holdings
                  <Badge variant="secondary">{result.commonHoldings.length} stocks</Badge>
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Stocks held by 2+ of your selected funds
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-2 text-xs font-semibold text-slate-400 uppercase">
                          Stock
                        </th>
                        <th className="text-center py-2 text-xs font-semibold text-slate-400 uppercase">
                          In # Funds
                        </th>
                        <th className="text-right py-2 text-xs font-semibold text-slate-400 uppercase">
                          Avg Weight
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {(showAll ? result.commonHoldings : result.commonHoldings.slice(0, 8)).map(
                        (h, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 font-medium text-slate-800 dark:text-white">
                              {h.name}
                            </td>
                            <td className="py-2.5 text-center">
                              <span
                                className={cn(
                                  "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                                  h.fundsHolding.length === result.funds.length
                                    ? "bg-red-100 text-red-700"
                                    : "bg-amber-100 text-amber-700"
                                )}
                              >
                                {h.fundsHolding.length}
                              </span>
                            </td>
                            <td className="py-2.5 text-right text-slate-600">
                              {h.avgWeight}%
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                  {result.commonHoldings.length > 8 && (
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="mt-3 flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {showAll ? (
                        <>
                          Show less <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Show all {result.commonHoldings.length} stocks{" "}
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Concentration Risk */}
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Concentration Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Top Stock</p>
                  <p className="text-sm font-bold text-slate-900 leading-tight">
                    {result.concentrationRisk.topStock}
                  </p>
                  <p className="text-lg font-bold text-primary-600 mt-1">
                    {result.concentrationRisk.topStockMaxWeight}%
                  </p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Top 3 Weight</p>
                  <p className="text-lg font-bold text-slate-900">
                    {result.concentrationRisk.top3StocksWeight}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">of portfolio</p>
                </div>
                <div className="text-center p-4 rounded-xl"
                  style={{
                    background: result.concentrationRisk.riskLevel === "low"
                      ? "#f0fdf4"
                      : result.concentrationRisk.riskLevel === "moderate"
                      ? "#fffbeb"
                      : "#fef2f2",
                  }}
                >
                  <p className="text-xs text-slate-500 mb-1">Risk Level</p>
                  <p
                    className={cn(
                      "text-lg font-bold capitalize",
                      result.concentrationRisk.riskLevel === "low"
                        ? "text-green-600"
                        : result.concentrationRisk.riskLevel === "moderate"
                        ? "text-amber-600"
                        : "text-red-600"
                    )}
                  >
                    {result.concentrationRisk.riskLevel}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <p className="text-xs text-slate-400 text-center px-4">
            Holdings data is based on recent AMFI disclosures. Actual fund portfolios change monthly.
            This tool is for educational purposes only — not investment advice.
          </p>
        </div>
      )}
    </div>
  );
}
