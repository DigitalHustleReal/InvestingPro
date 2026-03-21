
import React from 'react';
import { Metadata } from 'next';
import { FinancialHealthCalculator } from '@/components/calculators/FinancialHealthCalculator';
import { Badge } from "@/components/ui/badge";
import FinancialDisclaimer from '@/components/legal/FinancialDisclaimer';
import SocialShareButtons from '@/components/common/SocialShareButtons';

// Prevent prerendering to avoid circular import issues
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Financial Health Score Calculator | Free Financial Checkup',
  description: 'Check your financial fitness with our free Financial Health Score calculator. Analyze your savings, debt, insurance, and investments to get a personalized score.',
  keywords: 'financial health score, financial checkup, personal finance calculator, financial wellness, savings ratio calculator',
  openGraph: {
    title: 'Financial Health Score Calculator | Free Financial Checkup',
    description: 'Check your financial fitness with our free Financial Health Score calculator. Analyze your savings, debt, insurance, and investments to get a personalized score.',
    type: 'website',
  }
};

export default function FinancialHealthPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Financial Health Score</h1>
        <p className="text-lg text-slate-600 mb-6">
          Understanding your financial health is the first step towards wealth creation. 
          Use this tool to get a comprehensive assessment of your financial wellbeing based on key metrics like savings rate, emergency fund, and debt levels.
        </p>
        <div className="flex gap-2">
            <Badge variant="secondary" className="bg-success-50 text-success-700">Free Tool</Badge>
            <Badge variant="secondary" className="bg-secondary-50 text-secondary-700">Instant Report</Badge>
        </div>
      </div>
      
      <FinancialHealthCalculator />

      <div className="mt-12 prose prose-slate dark:prose-invert max-w-none">
        <h2>What affects your Financial Health Score?</h2>
        <p>
            Our proprietary scoring model evaluates four critical pillars of personal finance:
        </p>
        <ul>
            <li><strong>Savings Rate (20%):</strong> How much of your income you save for the future. We recommend at least 20%.</li>
            <li><strong>Emergency Fund (20%):</strong> Do you have enough liquidity to handle unexpected expenses? Ideally 6 months of expenses.</li>
            <li><strong>Debt Management (20%):</strong> Is your debt under control? Your EMI should ideally be less than 30% of your income.</li>
            <li><strong>Protection & Assets (40%):</strong> Do you have insurance and are you building net worth?</li>
        </ul>
      </div>

            {/* Share & Disclaimer */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <SocialShareButtons
                    title="Financial Health Score Calculator | InvestingPro"
                    url="https://investingpro.in/calculators/financial-health-score"
                    description="Free financial health score calculator - use this free tool from InvestingPro"
                />
                <FinancialDisclaimer variant="compact" className="mt-4" />
            </div>
    </div>
  );
}