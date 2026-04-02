"use client";

import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { checkCreditCardEligibility, EligibilityInput, EligibilityResult } from '@/lib/eligibility/rules';

interface InlineCheckerProps {
  productType?: 'credit_card' | 'loan';
  cardType?: 'premium' | 'standard' | 'entry';
  className?: string;
}

export default function InlineChecker({ 
  productType = 'credit_card', 
  cardType = 'standard',
  className 
}: InlineCheckerProps) {
  const [formData, setFormData] = useState<Partial<EligibilityInput>>({
    income: undefined,
    creditScore: undefined,
    age: undefined,
    employmentType: 'salaried',
    existingCards: 0
  });

  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.income || !formData.creditScore || !formData.age) {
      return;
    }

    const input: EligibilityInput = {
      income: formData.income,
      creditScore: formData.creditScore,
      age: formData.age,
      employmentType: formData.employmentType || 'salaried',
      existingCards: formData.existingCards || 0
    };

    const eligibilityResult = checkCreditCardEligibility(input, cardType);
    setResult(eligibilityResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setShowResult(false);
    setResult(null);
  };

  return (
    <div className={cn(
      "bg-gradient-to-br from-primary-50 to-white dark:from-primary-950/20 dark:to-gray-900 border border-primary-200 dark:border-primary-800/30 rounded-2xl p-6 shadow-lg",
      className
    )}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h3 className="font-bold text-gray-900 dark:text-white">Check Eligibility</h3>
      </div>

      {!showResult ? (
        <>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Get instant eligibility results in 10 seconds
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Annual Income */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Annual Income (₹)
              </label>
              <input
                type="number"
                placeholder="e.g., 500000"
                value={formData.income || ''}
                onChange={(e) => setFormData({ ...formData, income: parseInt(e.target.value) || undefined })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            {/* Credit Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Credit Score
              </label>
              <input
                type="number"
                placeholder="e.g., 750"
                min="300"
                max="900"
                value={formData.creditScore || ''}
                onChange={(e) => setFormData({ ...formData, creditScore: parseInt(e.target.value) || undefined })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-600 mt-1">
                Don't know? <a href="/credit-score" className="text-primary-600 hover:underline">Check here</a>
              </p>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Age
              </label>
              <input
                type="number"
                placeholder="e.g., 30"
                min="18"
                max="70"
                value={formData.age || ''}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || undefined })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Employment Type
              </label>
              <select
                value={formData.employmentType}
                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="salaried">Salaried</option>
                <option value="self-employed">Self-Employed</option>
                <option value="student">Student</option>
                <option value="retired">Retired</option>
              </select>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold">
              Check Eligibility
            </Button>
          </form>

          <p className="text-xs text-gray-500 dark:text-gray-600 mt-4 text-center">
            This is an indicative check. Final approval depends on bank's assessment.
          </p>
        </>
      ) : (
        <>
          {/* Result Display */}
          <div className="space-y-4">
            {/* Status Icon & Message */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              {result?.eligible ? (
                <CheckCircle2 className="w-6 h-6 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-danger-600 dark:text-danger-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-white mb-1">
                  {result?.message}
                </p>
                {result?.confidence && (
                  <span className={cn(
                    "text-xs font-semibold px-2 py-1 rounded-full",
                    result.confidence === 'high' && "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400",
                    result.confidence === 'medium' && "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400",
                    result.confidence === 'low' && "bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400"
                  )}>
                    {result.confidence.toUpperCase()} CONFIDENCE
                  </span>
                )}
              </div>
            </div>

            {/* Reasons */}
            {result?.reasons && result.reasons.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Why?</p>
                <ul className="space-y-2">
                  {result.reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <AlertCircle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {result?.recommendations && result.recommendations.length > 0 && (
              <div className="p-3 bg-primary-50 dark:bg-primary-950/30 rounded-lg border border-primary-200 dark:border-primary-800/30">
                <p className="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-2">💡 Recommendations</p>
                <ul className="space-y-1">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={handleReset} variant="outline" className="flex-1">
                Check Again
              </Button>
              {result?.eligible && (
                <Button className="flex-1 bg-success-600 hover:bg-success-700 text-white">
                  Apply Now
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
