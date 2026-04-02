"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SIPCalculatorWidgetProps {
  fundName: string;
  returns3Y: number;
  returns5Y: number;
  minSIP: number;
  historicalSIPReturns?: Array<{
    period_years: number;
    total_invested: number;
    current_value: number;
    returns_percent: number;
  }>;
  className?: string;
}

export default function SIPCalculatorWidget({
  fundName,
  returns3Y,
  returns5Y,
  minSIP = 500,
  historicalSIPReturns,
  className,
}: SIPCalculatorWidgetProps) {
  const [mode, setMode] = useState<'sip' | 'lumpsum'>('sip');
  const [amount, setAmount] = useState(5000);
  const presets = [500, 1000, 2500, 5000, 10000, 25000];

  const rate = returns5Y || returns3Y || 12; // Use best available return data

  const projections = useMemo(() => {
    const periods = [1, 3, 5, 10, 15, 20];
    return periods.map(years => {
      if (mode === 'sip') {
        const r = rate / 12 / 100;
        const n = years * 12;
        const invested = amount * n;
        const value = r === 0 ? invested : Math.round(amount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));
        return { years, invested, value, gain: value - invested };
      } else {
        const invested = amount;
        const value = Math.round(amount * Math.pow(1 + rate / 100, years));
        return { years, invested, value, gain: value - invested };
      }
    });
  }, [amount, rate, mode]);

  const formatINR = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
    return `₹${n.toLocaleString('en-IN')}`;
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <IndianRupee className="w-5 h-5 text-green-600" />
          Return Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mode toggle */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-4">
          <button
            onClick={() => setMode('sip')}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-md transition-all",
              mode === 'sip' ? "bg-white shadow-sm text-green-700" : "text-gray-500"
            )}
          >
            Monthly SIP
          </button>
          <button
            onClick={() => setMode('lumpsum')}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-md transition-all",
              mode === 'lumpsum' ? "bg-white shadow-sm text-green-700" : "text-gray-500"
            )}
          >
            One-time
          </button>
        </div>

        {/* Amount presets */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">
            {mode === 'sip' ? 'Monthly investment' : 'Investment amount'}
          </p>
          <div className="flex flex-wrap gap-2">
            {presets.map(p => (
              <button
                key={p}
                onClick={() => setAmount(p)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-lg border transition-all",
                  amount === p
                    ? "bg-green-50 border-green-600 text-green-700 font-semibold"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                )}
              >
                ₹{p.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Assumption */}
        <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
          <p className="text-xs text-gray-500">
            Based on <span className="font-semibold text-gray-700">{rate}% CAGR</span>
            {' '}({returns5Y ? '5Y' : returns3Y ? '3Y' : 'estimated'} returns)
          </p>
        </div>

        {/* Results table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-gray-500 font-medium">Period</th>
                <th className="text-right py-2 text-gray-500 font-medium">Invested</th>
                <th className="text-right py-2 text-gray-500 font-medium">Value</th>
                <th className="text-right py-2 text-gray-500 font-medium">Gain</th>
              </tr>
            </thead>
            <tbody>
              {projections.map(p => (
                <tr key={p.years} className="border-b border-gray-50">
                  <td className="py-2.5 font-medium text-gray-900">{p.years}Y</td>
                  <td className="py-2.5 text-right text-gray-500 tabular-nums">{formatINR(p.invested)}</td>
                  <td className="py-2.5 text-right font-semibold text-gray-900 tabular-nums">{formatINR(p.value)}</td>
                  <td className={cn("py-2.5 text-right font-semibold tabular-nums", p.gain >= 0 ? "text-green-600" : "text-red-500")}>
                    +{formatINR(p.gain)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Historical SIP returns if available */}
        {historicalSIPReturns && historicalSIPReturns.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-700 mb-2">Actual ₹500/mo SIP Returns (Historical)</p>
            <div className="grid grid-cols-2 gap-2">
              {historicalSIPReturns.map(s => (
                <div key={s.period_years} className="bg-green-50 rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-gray-500">{s.period_years}Y SIP</p>
                  <p className="text-sm font-bold text-green-700 tabular-nums">{formatINR(s.current_value)}</p>
                  <p className={cn("text-[10px] font-semibold", s.returns_percent >= 0 ? "text-green-600" : "text-red-500")}>
                    {s.returns_percent >= 0 ? '+' : ''}{s.returns_percent}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-[10px] text-gray-400 mt-3 leading-relaxed">
          Projections are illustrative. Mutual fund investments are subject to market risks. Past performance does not guarantee future returns.
        </p>
      </CardContent>
    </Card>
  );
}
