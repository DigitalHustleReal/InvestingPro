'use client';

import React, { useState, useMemo } from 'react';
import { Shield, Users, TrendingUp, Calculator, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function InsuranceCoverageCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [dependents, setDependents] = useState(2);
  const [existingLoans, setExistingLoans] = useState(1000000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(30000);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);

  // Calculate recommended coverage using HLV method
  const result = useMemo(() => {
    const yearsToRetire = Math.max(retirementAge - currentAge, 1);
    const annualIncome = monthlyIncome * 12;
    const annualExpenses = monthlyExpenses * 12;
    const annualSavings = Math.max(annualIncome - annualExpenses, 0);

    // Future income potential (simplified, not accounting for inflation adjustment)
    const futureValue = annualSavings * yearsToRetire;

    // Total coverage = Future income potential + Existing loans + Dependent support
    const dependentSupport = dependents * 500000; // ₹5L per dependent
    const recommendedCoverage = futureValue + existingLoans + dependentSupport;

    // Estimate premium (rough approximation based on age)
    let premiumRate = 0.005; // 0.5% for age 20-30
    if (currentAge > 30 && currentAge <= 40) premiumRate = 0.008;
    else if (currentAge > 40 && currentAge <= 50) premiumRate = 0.012;
    else if (currentAge > 50) premiumRate = 0.018;

    const estimatedAnnualPremium = recommendedCoverage * premiumRate;

    return {
      recommendedCoverage: Math.round(recommendedCoverage),
      estimatedAnnualPremium: Math.round(estimatedAnnualPremium),
      futureValue: Math.round(futureValue),
      dependentSupport,
      coverageBreakdown: {
        futureIncome: futureValue,
        loans: existingLoans,
        dependents: dependentSupport
      }
    };
  }, [monthlyIncome, dependents, existingLoans, monthlyExpenses, currentAge, retirementAge]);

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 rounded-3xl border-2 border-primary-500/20 dark:border-primary-500/30 shadow-2xl shadow-primary-900/10 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-500 dark:to-secondary-500 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Insurance Coverage Calculator</h2>
        </div>
        <p className="text-primary-50 text-sm">Calculate how much life insurance you need to protect your family</p>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary-600" />
              Your Financial Profile
            </h3>

            {/* Monthly Income */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Monthly Income
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  min="10000"
                  step="5000"
                />
              </div>
              <input
                type="range"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                min="10000"
                max="500000"
                step="5000"
                className="w-full mt-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>

            {/* Monthly Expenses */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Monthly Expenses
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  min="5000"
                  step="2500"
                />
              </div>
              <input
                type="range"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                min="5000"
                max="300000"
                step="2500"
                className="w-full mt-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>

            {/* Number of Dependents */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Number of Dependents
              </label>
              <input
                type="number"
                value={dependents}
                onChange={(e) => setDependents(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                min="0"
                max="10"
              />
            </div>

            {/* Existing Loans */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Existing Loans/Liabilities
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  value={existingLoans}
                  onChange={(e) => setExistingLoans(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  min="0"
                  step="100000"
                />
              </div>
            </div>

            {/* Age Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Current Age
                </label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  min="18"
                  max="65"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Retirement Age
                </label>
                <input
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  min="50"
                  max="70"
                />
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success-600" />
              Your Protection Plan
            </h3>

            {/* Recommended Coverage - Hero Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 dark:from-primary-500 dark:to-secondary-500 text-white shadow-xl shadow-primary-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5" />
                <p className="text-xs font-bold uppercase tracking-wider opacity-90">Recommended Coverage</p>
              </div>
              <p className="text-4xl font-bold mb-2">{formatCurrency(result.recommendedCoverage)}</p>
              <p className="text-sm opacity-75">To protect your family's future</p>
            </div>

            {/* Coverage Breakdown */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Coverage Breakdown</p>
              
              <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Future Income Replacement</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(result.coverageBreakdown.futureIncome)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Existing Loans</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(result.coverageBreakdown.loans)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Dependent Support ({dependents})</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(result.coverageBreakdown.dependents)}</span>
                </div>
              </div>

              {/* Estimated Premium */}
              <div className="p-5 bg-success-50 dark:bg-success-900/20 border-2 border-success-200 dark:border-success-800 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-success-600 dark:text-success-400" />
                  <p className="text-xs font-semibold text-success-700 dark:text-success-400 uppercase tracking-wider">Estimated Annual Premium</p>
                </div>
                <p className="text-2xl font-bold text-success-700 dark:text-success-300">{formatCurrency(result.estimatedAnnualPremium)}</p>
                <p className="text-xs text-success-600 dark:text-success-500 mt-1">Based on your age group</p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-accent-600 dark:text-accent-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-accent-900 dark:text-accent-200">
                  <strong className="font-semibold">Note:</strong> This is an estimate using the Human Life Value (HLV) method. Actual coverage needs and premiums vary based on health, lifestyle, and policy type.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
