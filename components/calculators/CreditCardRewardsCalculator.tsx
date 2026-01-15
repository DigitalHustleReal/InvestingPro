'use client';

import React, { useState, useMemo } from 'react';
import { CreditCard, TrendingUp, Calculator, Sparkles, Award, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';

interface SpendingCategories {
  travel: number;
  dining: number;
  shopping: number;
  bills: number;
  others: number;
}

interface CardReward {
  cardName: string;
  provider: string;
  annualFee: number;
  rewardRates: {
    travel: number;
    dining: number;
    shopping: number;
    bills: number;
    others: number;
    default: number;
  };
  welcomeBonus?: number;
}

// Sample card data (in production, this would come from API)
const SAMPLE_CARDS: CardReward[] = [
  {
    cardName: 'HDFC Regalia',
    provider: 'HDFC Bank',
    annualFee: 2500,
    rewardRates: {
      travel: 4,
      dining: 4,
      shopping: 2,
      bills: 1,
      others: 2,
      default: 2
    },
    welcomeBonus: 5000
  },
  {
    cardName: 'SBI SimplyCLICK',
    provider: 'SBI',
    annualFee: 499,
    rewardRates: {
      travel: 2,
      dining: 5,
      shopping: 10,
      bills: 1,
      others: 1,
      default: 1
    },
    welcomeBonus: 2000
  },
  {
    cardName: 'Axis Magnus',
    provider: 'Axis Bank',
    annualFee: 10000,
    rewardRates: {
      travel: 12,
      dining: 5,
      shopping: 3,
      bills: 1,
      others: 3,
      default: 3
    },
    welcomeBonus: 25000
  }
];

export default function CreditCardRewardsCalculator() {
  const [spending, setSpending] = useState<SpendingCategories>({
    travel: 5000,
    dining: 3000,
    shopping: 8000,
    bills: 2000,
    others: 2000
  });

  const updateSpending = (category: keyof SpendingCategories, value: number) => {
    setSpending(prev => ({ ...prev, [category]: value }));
  };

  // Calculate rewards for each card
  const cardResults = useMemo(() => {
    return SAMPLE_CARDS.map(card => {
      const monthlyRewards = 
        (spending.travel * card.rewardRates.travel / 100) +
        (spending.dining * card.rewardRates.dining / 100) +
        (spending.shopping * card.rewardRates.shopping / 100) +
        (spending.bills * card.rewardRates.bills / 100) +
        (spending.others * card.rewardRates.others / 100);

      const annualRewards = (monthlyRewards * 12) + (card.welcomeBonus || 0);
      const netBenefit = annualRewards - card.annualFee;

      return {
        ...card,
        monthlyRewards,
        annualRewards,
        netBenefit
      };
    }).sort((a, b) => b.netBenefit - a.netBenefit);
  }, [spending]);

  const totalMonthlySpending = Object.values(spending).reduce((a, b) => a + b, 0);

  const formatCurrency = (value: number) => {
    return `â‚¹${value.toLocaleString('en-IN')}`;
  };

  const categories: Array<{ key: keyof SpendingCategories; label: string; icon: any; color: string }> = [
    { key: 'travel', label: 'Travel', icon: 'âœˆï¸', color: 'from-blue-500 to-cyan-500' },
    { key: 'dining', label: 'Dining', icon: 'ðŸ½ï¸', color: 'from-orange-500 to-danger-500' },
    { key: 'shopping', label: 'Shopping', icon: 'ðŸ›ï¸', color: 'from-purple-500 to-pink-500' },
    { key: 'bills', label: 'Bills', icon: 'ðŸ“±', color: 'from-success-500 to-success-500' },
    { key: 'others', label: 'Others', icon: 'ðŸ’³', color: 'from-slate-500 to-slate-500' }
  ];

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 rounded-3xl border-2 border-primary-500/20 dark:border-primary-500/30 shadow-2xl shadow-primary-900/10 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-500 dark:to-secondary-500 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Credit Card Rewards Calculator</h2>
        </div>
        <p className="text-primary-50 text-sm">Find out which card earns you the most rewards based on your spending</p>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Spending Inputs */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-primary-600" />
                Monthly Spending by Category
              </h3>
              <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Monthly Spending</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalMonthlySpending)}</p>
              </div>
            </div>

            <div className="space-y-4">
              {categories.map(cat => (
                <div key={cat.key}>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <span className="mr-2">{cat.icon}</span>
                    {cat.label}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">â‚¹</span>
                    <input
                      type="number"
                      value={spending[cat.key]}
                      onChange={(e) => updateSpending(cat.key, Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                      min="0"
                      step="100"
                    />
                  </div>
                  <input
                    type="range"
                    value={spending[cat.key]}
                    onChange={(e) => updateSpending(cat.key, Number(e.target.value))}
                    min="0"
                    max="50000"
                    step="500"
                    className="w-full mt-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Card Recommendations */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-primary-600" />
              Top Recommended Cards
            </h3>

            <div className="space-y-4">
              {cardResults.map((card, index) => (
                <Card
                  key={card.cardName}
                  className={cn(
                    "relative overflow-hidden transition-all hover:shadow-lg",
                    index === 0 && "border-2 border-primary-500 shadow-xl shadow-primary-500/20"
                  )}
                >
                  {index === 0 && (
                    <div className="absolute top-0 right-0">
                      <Badge className="rounded-tl-none rounded-br-none bg-gradient-to-r from-primary-600 to-blue-600 text-white border-0">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Best Match
                      </Badge>
                    </div>
                  )}
                  
                  <div className="p-5">
                    {/* Card Info */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{card.cardName}</h4>
                          <p className="text-xs text-slate-500">{card.provider}</p>
                        </div>
                        {index === 0 && (
                          <div className="text-2xl">ðŸ†</div>
                        )}
                      </div>
                    </div>

                    {/* Rewards Breakdown */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mb-1">Annual Rewards</p>
                        <p className="text-sm font-bold text-success-600 dark:text-emerald-400">{formatCurrency(Math.round(card.annualRewards))}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mb-1">Annual Fee</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{formatCurrency(card.annualFee)}</p>
                      </div>
                      <div className={cn(
                        "rounded-lg p-3",
                        card.netBenefit > 0 
                          ? "bg-success-50 dark:bg-emerald-900/20" 
                          : "bg-danger-50 dark:bg-danger-900/20"
                      )}>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mb-1">Net Benefit</p>
                        <p className={cn(
                          "text-sm font-bold",
                          card.netBenefit > 0 
                            ? "text-success-700 dark:text-emerald-400" 
                            : "text-danger-700 dark:text-danger-400"
                        )}>
                          {card.netBenefit > 0 ? '+' : ''}{formatCurrency(Math.round(card.netBenefit))}
                        </p>
                      </div>
                    </div>

                    {/* Action */}
                    <Button 
                      size="sm" 
                      className={cn(
                        "w-full",
                        index === 0 
                          ? "bg-primary-600 hover:bg-secondary-600 text-white" 
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white"
                      )}
                    >
                      {index === 0 ? 'Apply Now' : 'View Details'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="p-4 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-xl">
              <p className="text-xs text-accent-900 dark:text-accent-200">
                <strong className="font-semibold">Note:</strong> Calculations are based on standard reward rates. Actual rewards may vary based on offer periods, exclusions, and redemption value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
