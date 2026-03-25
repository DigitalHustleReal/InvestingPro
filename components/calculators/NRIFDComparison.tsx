"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Globe, TrendingUp, Shield, CheckCircle, AlertTriangle, Info, Trophy } from "lucide-react";
import {
  calculateNRIFD,
  NRI_FD_DEFAULTS,
  DEFAULT_FX_RATES,
  CURRENCY_LABELS,
  type NRIFDInputs,
  type NRIFDCurrency,
  type TDTAACountry,
  type FDAccountResult,
} from "@/lib/calculators/nri-fd";

const CURRENCIES: NRIFDCurrency[] = ["USD", "GBP", "EUR", "CAD", "AUD", "SGD"];

const DTAA_COUNTRIES: TDTAACountry[] = [
  "None (30% TDS)", "USA", "UK", "Canada", "Australia",
  "UAE", "Singapore", "Germany", "Netherlands", "France", "Japan",
];

const TENURES = [
  { months: 12, label: "1 Year" },
  { months: 24, label: "2 Years" },
  { months: 36, label: "3 Years" },
  { months: 48, label: "4 Years" },
  { months: 60, label: "5 Years" },
];

function formatINR(v: number) {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`;
  return `₹${v.toLocaleString("en-IN")}`;
}

function AccountCard({
  result,
  currency,
  isWinner,
}: {
  result: FDAccountResult;
  currency: NRIFDCurrency;
  isWinner: boolean;
}) {
  const colorMap = {
    FCNR: { border: "border-blue-200", bg: "bg-blue-50 dark:bg-blue-950", badge: "bg-blue-100 text-blue-800", head: "text-blue-900 dark:text-blue-100", accent: "text-blue-700" },
    NRE: { border: "border-green-200", bg: "bg-green-50 dark:bg-green-950", badge: "bg-green-100 text-green-800", head: "text-green-900 dark:text-green-100", accent: "text-green-700" },
    NRO: { border: "border-amber-200", bg: "bg-amber-50 dark:bg-amber-950", badge: "bg-amber-100 text-amber-800", head: "text-amber-900 dark:text-amber-100", accent: "text-amber-700" },
  };
  const c = colorMap[result.accountType];

  return (
    <Card className={cn("rounded-2xl shadow-md relative overflow-hidden", c.bg, "border-2", isWinner ? "border-primary-400 ring-2 ring-primary-300" : c.border)}>
      {isWinner && (
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            <Trophy className="w-3 h-3" /> Best
          </div>
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {result.accountType === "FCNR" && <Shield className="w-5 h-5 text-blue-600" />}
          {result.accountType === "NRE" && <TrendingUp className="w-5 h-5 text-green-600" />}
          {result.accountType === "NRO" && <Globe className="w-5 h-5 text-amber-600" />}
          <CardTitle className={cn("text-lg font-bold", c.head)}>
            {result.accountType} FD
          </CardTitle>
        </div>
        <p className={cn("text-xs", c.accent)}>
          {result.accountType === "FCNR" && "Foreign currency deposit — no INR risk"}
          {result.accountType === "NRE" && "INR deposit — zero tax in India"}
          {result.accountType === "NRO" && "INR deposit — for India-sourced income"}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Interest Rate", value: `${result.interestRatePct}% p.a.` },
            { label: "Tax in India", value: result.isTaxFreeInIndia ? "Zero" : `${Math.round((result.tdsINR / result.grossInterestINR) * 100)}% TDS` },
            { label: "Net Interest", value: formatINR(result.netInterestINR) },
            { label: `Maturity (${currency})`, value: `${currency} ${result.maturityForeign.toLocaleString()}` },
          ].map((item) => (
            <div key={item.label} className="text-center p-2.5 bg-white/50 dark:bg-slate-800/50 rounded-lg">
              <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
              <p className={cn("text-sm font-bold", result.isTaxFreeInIndia && item.label === "Tax in India" ? "text-green-600" : "text-slate-900 dark:text-white")}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Maturity highlight */}
        <div className={cn("p-3 rounded-xl text-center border", isWinner ? "border-primary-200 bg-primary-50 dark:bg-primary-900" : "border-slate-200 bg-white/40 dark:bg-slate-800/40")}>
          <p className="text-xs text-slate-500 mb-0.5">Maturity Value (INR)</p>
          <p className={cn("text-xl font-bold", isWinner ? "text-primary-700" : "text-slate-900 dark:text-white")}>{formatINR(result.maturityINR)}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            <span className={cn("font-semibold", result.effectiveReturnPct > 0 ? "text-green-600" : "text-red-500")}>
              {result.effectiveReturnPct}% p.a.
            </span>{" "}
            effective in {currency} terms
          </p>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <div className={cn("flex gap-1.5 text-xs rounded-lg p-2", result.isTaxFreeInIndia ? "bg-green-100/60 text-green-800" : "bg-amber-100/60 text-amber-800")}>
            {result.isTaxFreeInIndia ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> : <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
            <span>{result.taxNote}</span>
          </div>
          <div className="flex gap-1.5 text-xs bg-blue-100/60 text-blue-800 rounded-lg p-2">
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>{result.repatriationNote}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function NRIFDComparison() {
  const [inputs, setInputs] = useState<NRIFDInputs>(NRI_FD_DEFAULTS);
  const set = <K extends keyof NRIFDInputs>(k: K) => (v: NRIFDInputs[K]) =>
    setInputs((p) => ({ ...p, [k]: v }));

  // When currency changes, auto-update the default FX rate
  const handleCurrencyChange = (c: NRIFDCurrency) => {
    setInputs((p) => ({ ...p, currency: c, currentExchangeRate: DEFAULT_FX_RATES[c] }));
  };

  const r = useMemo(() => calculateNRIFD(inputs), [inputs]);
  const { currency } = inputs;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <Card className="border-0 shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                NRI FD Comparison — FCNR vs NRE vs NRO
              </CardTitle>
              <p className="text-sm text-slate-500">Compare all 3 account types side-by-side with tax and currency impact</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Currency */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              Your Currency
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {CURRENCIES.map((c) => (
                <button key={c} onClick={() => handleCurrencyChange(c)}
                  className={cn(
                    "py-2 px-3 rounded-lg text-sm font-bold border transition-all",
                    inputs.currency === c
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  )}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Principal */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Principal ({currency})
                </label>
                <span className="text-sm font-bold text-primary-600">
                  {currency} {inputs.principalForeign.toLocaleString()}
                </span>
              </div>
              <input type="range" min={1000} max={500000} step={1000}
                value={inputs.principalForeign}
                onChange={(e) => set("principalForeign")(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary-600" />
              <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                <span>{currency} 1,000</span><span>{currency} 5,00,000</span>
              </div>
            </div>

            {/* FX Rate */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {currency}/INR Rate
                </label>
                <span className="text-sm font-bold text-primary-600">
                  ₹{inputs.currentExchangeRate}
                </span>
              </div>
              <input type="range" min={50} max={200} step={0.5}
                value={inputs.currentExchangeRate}
                onChange={(e) => set("currentExchangeRate")(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary-600" />
            </div>

            {/* INR depreciation */}
            <div>
              <div className="flex justify-between mb-1.5">
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Expected INR Change p.a.
                  </label>
                  <p className="text-xs text-slate-400">+ve = INR weakens vs {currency}</p>
                </div>
                <span className={cn("text-sm font-bold", inputs.expectedINRDepreciation > 0 ? "text-red-500" : "text-green-600")}>
                  {inputs.expectedINRDepreciation > 0 ? "+" : ""}{inputs.expectedINRDepreciation}%
                </span>
              </div>
              <input type="range" min={-5} max={10} step={0.5}
                value={inputs.expectedINRDepreciation}
                onChange={(e) => set("expectedINRDepreciation")(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary-600" />
              <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                <span>INR strengthens</span><span>INR weakens</span>
              </div>
            </div>
          </div>

          {/* Tenure */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              Deposit Tenure
            </label>
            <div className="flex flex-wrap gap-2">
              {TENURES.map((t) => (
                <button key={t.months} onClick={() => set("tenureMonths")(t.months)}
                  className={cn(
                    "py-2 px-4 rounded-lg text-sm font-semibold border transition-all",
                    inputs.tenureMonths === t.months
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  )}>
                  {t.label}
                </button>
              ))}
            </div>
            {inputs.tenureMonths > 60 && (
              <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                FCNR is only available up to 5 years. NRE/NRO rate used for the FCNR row.
              </p>
            )}
          </div>

          {/* DTAA */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              Country of Residence (for NRO DTAA TDS rate)
            </label>
            <select
              value={inputs.dtaaCountry}
              onChange={(e) => set("dtaaCountry")(e.target.value as TDTAACountry)}
              className="w-full sm:w-72 px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 dark:border-slate-700"
            >
              {DTAA_COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Three account cards */}
      <div className="grid md:grid-cols-3 gap-5">
        <AccountCard result={r.fcnr} currency={currency} isWinner={r.winner === "FCNR"} />
        <AccountCard result={r.nre} currency={currency} isWinner={r.winner === "NRE"} />
        <AccountCard result={r.nro} currency={currency} isWinner={r.winner === "NRO"} />
      </div>

      {/* Currency risk note */}
      <Card className={cn("border rounded-2xl shadow-sm",
        inputs.expectedINRDepreciation > 3
          ? "border-amber-200 bg-amber-50 dark:bg-amber-950"
          : "border-blue-200 bg-blue-50 dark:bg-blue-950"
      )}>
        <CardContent className="p-4 flex gap-3">
          <Info className={cn("w-5 h-5 flex-shrink-0 mt-0.5", inputs.expectedINRDepreciation > 3 ? "text-amber-600" : "text-blue-600")} />
          <div>
            <p className={cn("text-sm font-semibold", inputs.expectedINRDepreciation > 3 ? "text-amber-800" : "text-blue-800")}>
              Currency Risk Analysis
            </p>
            <p className={cn("text-xs mt-0.5 leading-relaxed", inputs.expectedINRDepreciation > 3 ? "text-amber-700" : "text-blue-700")}>
              {r.currencyRiskNote}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Comparison table */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Head-to-Head Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Feature</th>
                  {(["FCNR", "NRE", "NRO"] as const).map((acct) => (
                    <th key={acct} className={cn(
                      "px-4 py-3 text-center text-xs font-bold uppercase tracking-wider",
                      r.winner === acct ? "text-primary-700 bg-primary-50" : "text-slate-500"
                    )}>
                      {acct} {r.winner === acct && "🏆"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {r.comparisonTable.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300">{row.label}</td>
                    <td className={cn("px-4 py-3 text-sm text-center", r.winner === "FCNR" ? "font-bold text-primary-700" : "text-slate-600 dark:text-slate-400")}>{row.fcnr}</td>
                    <td className={cn("px-4 py-3 text-sm text-center", r.winner === "NRE" ? "font-bold text-primary-700" : "text-slate-600 dark:text-slate-400")}>{row.nre}</td>
                    <td className={cn("px-4 py-3 text-sm text-center", r.winner === "NRO" ? "font-bold text-primary-700" : "text-slate-600 dark:text-slate-400")}>{row.nro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Verdict */}
      <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800">
        <CardContent className="p-5 flex gap-4">
          <Trophy className="w-8 h-8 text-amber-300 flex-shrink-0" />
          <div>
            <p className="text-white font-bold mb-1">InvestingPro Recommendation: {r.winner}</p>
            <p className="text-primary-100 text-sm leading-relaxed">{r.winnerReason}</p>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-slate-400 text-center px-4">
        Rates are indicative (2026 avg). Actual rates vary by bank and are revised periodically.
        Consult a CA or authorised dealer for FEMA compliance and exact tax implications.
      </p>
    </div>
  );
}
