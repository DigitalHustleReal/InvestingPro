"use client";

import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { EMBEDDABLE_CALCULATORS, trackWidgetEmbed } from '@/lib/linkable-assets/embeddable-widget';

// Dynamically import calculators to reduce bundle size
const calculatorComponents: Record<string, any> = {
  'sip': dynamic(() => import('@/components/calculators/SIPCalculatorWithInflation').then(mod => mod.SIPCalculatorWithInflation)),
  'emi': dynamic(() => import('@/components/calculators/EMICalculatorEnhanced').then(mod => mod.EMICalculatorEnhanced)),
  'fd': dynamic(() => import('@/components/calculators/FDCalculator').then(mod => mod.FDCalculator)),
  'ppf': dynamic(() => import('@/components/calculators/PPFCalculator').then(mod => mod.PPFCalculator)),
  'nps': dynamic(() => import('@/components/calculators/NPSCalculator').then(mod => mod.NPSCalculator)),
  'tax': dynamic(() => import('@/components/calculators/TaxCalculator').then(mod => mod.TaxCalculator)),
  'lumpsum': dynamic(() => import('@/components/calculators/LumpsumCalculatorWithInflation').then(mod => mod.LumpsumCalculatorWithInflation)),
  'retirement': dynamic(() => import('@/components/calculators/RetirementCalculator').then(mod => mod.RetirementCalculator)),
  'compound-interest': dynamic(() => import('@/components/calculators/CompoundInterestCalculator').then(mod => mod.CompoundInterestCalculator)),
  'gst': dynamic(() => import('@/components/calculators/GSTCalculator').then(mod => mod.GSTCalculator)),
  'swp': dynamic(() => import('@/components/calculators/SWPCalculator').then(mod => mod.SWPCalculator)),
  'goal-planning': dynamic(() => import('@/components/calculators/GoalPlanningCalculator').then(mod => mod.GoalPlanningCalculator)),
  'financial-health-score': dynamic(() => import('@/components/calculators/FinancialHealthCalculator').then(mod => mod.FinancialHealthCalculator)),
};

export default function EmbedCalculatorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const slug = params.slug as string;
  const theme = searchParams.get('theme') || 'light';
  const showBranding = searchParams.get('branding') !== 'false';
  const primaryColor = searchParams.get('color');
  const borderRadius = searchParams.get('radius');

  const calculatorInfo = EMBEDDABLE_CALCULATORS[slug];
  const CalculatorComponent = calculatorComponents[slug];

  // Track embed impression
  useEffect(() => {
    const referrer = typeof document !== 'undefined' ? document.referrer : '';
    trackWidgetEmbed(slug, referrer, 'impression');
  }, [slug]);

  // Apply theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Apply custom color
  useEffect(() => {
    if (primaryColor) {
      document.documentElement.style.setProperty('--primary-color', `#${primaryColor}`);
    }
  }, [primaryColor]);

  if (!calculatorInfo || !CalculatorComponent) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Calculator Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The requested calculator does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
      style={{ borderRadius: borderRadius ? `${borderRadius}px` : undefined }}
    >
      {/* Calculator */}
      <div className="p-4">
        <CalculatorComponent embedded={true} />
      </div>

      {/* Branding */}
      {showBranding && (
        <div className={`text-center py-3 border-t ${
          theme === 'dark' 
            ? 'border-gray-700 bg-gray-800/50' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          <a 
            href="https://investingpro.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`text-xs font-medium ${
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Powered by <span className="text-primary-500">InvestingPro.in</span>
          </a>
        </div>
      )}
    </div>
  );
}
