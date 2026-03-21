import React from 'react';
import { Metadata } from 'next';
import PortfolioRebalancingCalculator from '@/components/calculators/PortfolioRebalancingCalculator';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import { Calculator } from 'lucide-react';
import FinancialDisclaimer from '@/components/legal/FinancialDisclaimer';
import SocialShareButtons from '@/components/common/SocialShareButtons';

export const metadata: Metadata = {
  title: 'Portfolio Rebalancing Calculator - Asset Allocation Tool | InvestingPro',
  description: 'Optimize your investment portfolio with our free rebalancing calculator. Determine exactly how much Equity, Debt, or Gold to buy or sell to maintain your target asset allocation.',
  keywords: 'portfolio rebalancing, asset allocation calculator, investment portfolio tool, equity debt split, rebalance portfolio india',
};

export default function RebalancingPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AutoBreadcrumbs />
        
        <div className="mb-10 text-center max-w-2xl mx-auto">
           <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-4">
              <Calculator className="w-8 h-8 text-primary-600 dark:text-primary-400" />
           </div>
           <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
             Portfolio Rebalancing Tool
           </h1>
           <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
             Maintain your risk discipline. Our tool calculates exactly what you need to buy or sell to get your portfolio back on track.
           </p>
        </div>

        <PortfolioRebalancingCalculator />
        
        {/* Content Section for SEO */}
        <div className="mt-16 prose prose-slate dark:prose-invert max-w-4xl mx-auto">
            <h2>What is Portfolio Rebalancing?</h2>
            <p>
                Portfolio rebalancing is the process of realigning the weightings of a portfolio of assets. It involves periodically buying or selling assets in a portfolio to maintain an original or desired level of asset allocation or risk.
            </p>
            <h3>When should you rebalance?</h3>
            <ul>
                <li><strong>Time-based:</strong> Every 6 months or 1 year.</li>
                <li><strong>Threshold-based:</strong> When an asset class deviates by more than 5% from its target.</li>
            </ul>
        </div>
      </div>

            {/* Share & Disclaimer */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <SocialShareButtons
                    title="Portfolio Rebalancing Calculator | InvestingPro"
                    url="https://investingpro.in/calculators/portfolio-rebalancing"
                    description="Free portfolio rebalancing calculator - use this free tool from InvestingPro"
                />
                <FinancialDisclaimer variant="compact" className="mt-4" />
            </div>
    </div>
  );
}