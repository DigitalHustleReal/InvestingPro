/**
 * SIP Calculator Widget - Week 3, Task 3.3
 * Purpose: Interactive Systematic Investment Plan calculator with visualization
 * 
 * Features:
 * - Monthly investment input
 * - Duration slider (years)
 * - Expected return input
 * - Real-time calculation
 * - Growth visualization
 * - Results breakdown
 */

"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { formatINR, formatPercentage } from "@/lib/utils/currency";
import { TrendingUp, Calendar, Percent, IndianRupee } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SIPCalculatorProps {
  className?: string;
}

export function SIPCalculator({ className }: SIPCalculatorProps) {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);

  // Calculate SIP results
  const results = useMemo(() => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = years * 12;
    
    // Future Value formula: FV = P × [(1 + r)^n - 1] / r × (1 + r)
    const futureValue = monthlyInvestment * 
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
      (1 + monthlyRate);
    
    const totalInvested = monthlyInvestment * months;
    const returns = futureValue - totalInvested;
    
    return {
      futureValue: Math.round(futureValue),
      totalInvested: Math.round(totalInvested),
      returns: Math.round(returns),
      returnPercentage: ((returns / totalInvested) * 100).toFixed(1),
    };
  }, [monthlyInvestment, years, expectedReturn]);

  return (
    <Card className={cn("p-6 md:p-8", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-stone-900">SIP Calculator</h3>
          <p className="text-sm text-stone-600">Plan your wealth creation journey</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs Section */}
        <div className="space-y-6">
          {/* Monthly Investment */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-stone-900 mb-2">
              <IndianRupee className="w-4 h-4" />
              Monthly Investment
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  className="flex-1 px-4 py-2 border border-stone-300 rounded-lg font-mono text-lg font-semibold focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
                <span className="text-stone-600 font-medium">/month</span>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-stone-900 mb-2">
              <Calendar className="w-4 h-4" />
              Investment Duration
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="30"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  min="1"
                  max="30"
                  className="flex-1 px-4 py-2 border border-stone-300 rounded-lg font-mono text-lg font-semibold focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
                <span className="text-stone-600 font-medium">years</span>
              </div>
            </div>
          </div>

          {/* Expected Return */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-stone-900 mb-2">
              <Percent className="w-4 h-4" />
              Expected Annual Return
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  min="1"
                  max="30"
                  step="0.5"
                  className="flex-1 px-4 py-2 border border-stone-300 rounded-lg font-mono text-lg font-semibold focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
                <span className="text-stone-600 font-medium">% p.a.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Future Value - Hero Metric */}
          <div className="bg-gradient-to-br from-primary-600 to-emerald-600 text-white rounded-xl p-6">
            <p className="text-sm font-medium opacity-90 mb-1">Maturity Value</p>
            <p className="text-4xl font-bold font-mono mb-2">
              {formatINR(results.futureValue, { compact: true })}
            </p>
            <p className="text-sm opacity-75">
              after {years} {years === 1 ? 'year' : 'years'}
            </p>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            {/* Total Invested */}
            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg border border-stone-200">
              <div>
                <p className="text-xs text-stone-600 mb-1">Amount Invested</p>
                <p className="text-xl font-bold font-mono text-stone-900">
                  {formatINR(results.totalInvested, { compact: true })}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            {/* Estimated Returns */}
            <div className="flex items-center justify-between p-4 bg-success-50 rounded-lg border border-success-200">
              <div>
                <p className="text-xs text-success-700 mb-1">Estimated Returns</p>
                <p className="text-xl font-bold font-mono text-success-700">
                  {formatINR(results.returns, { compact: true })}
                </p>
                <p className="text-xs text-success-600 mt-1">
                  +{results.returnPercentage}% gain
                </p>
              </div>
              <div className="w-12 h-12 bg-success-200 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success-700" />
              </div>
            </div>
          </div>

          {/* Composition Bar */}
          <div className="pt-4">
            <p className="text-xs font-semibold text-stone-700 mb-2">Investment Composition</p>
            <div className="h-8 flex rounded-lg overflow-hidden">
              <div
                className="bg-blue-500 flex items-center justify-center text-white text-xs font-semibold"
                style={{
                  width: `${(results.totalInvested / results.futureValue) * 100}%`,
                }}
              >
                {((results.totalInvested / results.futureValue) * 100).toFixed(0)}%
              </div>
              <div
                className="bg-success-500 flex items-center justify-center text-white text-xs font-semibold"
                style={{
                  width: `${(results.returns / results.futureValue) * 100}%`,
                }}
              >
                {((results.returns / results.futureValue) * 100).toFixed(0)}%
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-stone-600">
              <span>• Your Investment</span>
              <span>Returns •</span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-900">
              <strong className="font-semibold">Note:</strong> Returns are indicative and not guaranteed. 
              Actual returns may vary based on market conditions.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
