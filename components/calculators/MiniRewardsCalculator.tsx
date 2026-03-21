"use client";

import React, { useState } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MiniRewardsCalculatorProps {
  annualFee: number;
  rewardRate?: number; // percentage
  className?: string;
}

export default function MiniRewardsCalculator({ 
  annualFee, 
  rewardRate = 1.5,
  className 
}: MiniRewardsCalculatorProps) {
  const [monthlySpend, setMonthlySpend] = useState(20000);

  const annualSpend = monthlySpend * 12;
  const rewardsEarned = (annualSpend * rewardRate) / 100;
  const netValue = rewardsEarned - annualFee;
  const isWorthIt = netValue > 0;

  return (
    <div className={cn(
      "bg-gradient-to-br from-success-50 to-white dark:from-success-950/20 dark:to-slate-900 border border-success-200 dark:border-success-800/30 rounded-2xl p-6",
      className
    )}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-success-600 dark:text-success-400" />
        <h3 className="font-bold text-slate-900 dark:text-white">Rewards Calculator</h3>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        See if this card's rewards justify the annual fee
      </p>

      {/* Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Monthly Spend (₹)
        </label>
        <input
          type="range"
          min="5000"
          max="100000"
          step="5000"
          value={monthlySpend}
          onChange={(e) => setMonthlySpend(parseInt(e.target.value))}
          aria-label="Monthly spending amount"
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-success-600"
        />
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-600 mt-1">
          <span>₹5k</span>
          <span className="font-bold text-slate-900 dark:text-white">₹{(monthlySpend / 1000).toFixed(0)}k</span>
          <span>₹1L</span>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3 p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Annual Spend</span>
          <span className="font-semibold text-slate-900 dark:text-white">₹{annualSpend.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Rewards Earned</span>
          <span className="font-semibold text-success-600 dark:text-success-400">+₹{rewardsEarned.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Annual Fee</span>
          <span className="font-semibold text-danger-600 dark:text-danger-400">-₹{annualFee.toLocaleString('en-IN')}</span>
        </div>
        <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-900 dark:text-white">Net Value</span>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-lg font-black",
                isWorthIt ? "text-success-600 dark:text-success-400" : "text-danger-600 dark:text-danger-400"
              )}>
                {isWorthIt ? '+' : ''}₹{netValue.toLocaleString('en-IN')}
              </span>
              {isWorthIt && <TrendingUp className="w-4 h-4 text-success-600 dark:text-success-400" />}
            </div>
          </div>
        </div>
      </div>

      {/* Verdict */}
      <div className={cn(
        "mt-4 p-3 rounded-lg text-sm font-medium text-center",
        isWorthIt 
          ? "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400"
          : "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400"
      )}>
        {isWorthIt 
          ? `✅ Worth it! You'll save ₹${netValue.toLocaleString('en-IN')}/year`
          : `⚠️ Spend ₹${Math.ceil((annualFee / (rewardRate / 100) - annualSpend) / 1000)}k more to break even`
        }
      </div>
    </div>
  );
}
