"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, BarChart3, Clock, TrendingUp } from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';

/**
 * Explainer Page: Active Trading Tools
 * 
 * This page explains why someone would need SwingTrader
 * after learning about investments on InvestingPro.in
 * 
 * Placement: Bridge between InvestingPro (cognitive) → SwingTrader (execution)
 * 
 * CRITICAL: This is the ONLY way to link from InvestingPro to SwingTrader.
 * Never link directly from shallow educational content.
 */
export default function ActiveTradingPage() {
  return (
    <>
      <SEOHead
        title="Advanced Trading Tools - When You Need Real-Time Execution"
        description="For active traders who need real-time market data, instant execution, and advanced charting. Learn when guide-based investing transitions to active trading."
        url="/advanced-tools/active-trading"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Advanced Tools
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Tools for Active Traders
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            You've mastered the fundamentals. Now you need <strong>speed, precision, and real-time action</strong>.
          </p>
        </div>

        {/* The Transition */}
        <div className="bg-slate-50 rounded-2xl p-8 mb-12 border border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            From Education to Execution
          </h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Educational platforms teach you <em>what</em> to invest in and <em>why</em>. 
            But when you're ready to act in real-time—monitoring live prices, executing trades 
            within seconds, analyzing intraday patterns—you need execution-focused tools.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Education</h3>
              <p className="text-sm text-slate-600">Learn strategies</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Comparison</h3>
              <p className="text-sm text-slate-600">Choose brokers</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Execution</h3>
              <p className="text-sm text-slate-600">Trade in real-time</p>
            </div>
          </div>
        </div>

        {/* What SwingTrader Offers */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            What Execution Platforms Provide
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4 p-6 bg-white rounded-xl border border-slate-200">
              <Clock className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Real-Time Market Data</h3>
                <p className="text-slate-600 text-sm">
                  Live prices, order book depth, bid-ask spreads updated in milliseconds. 
                  Not historical analysis—actual market conditions as they happen.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white rounded-xl border border-slate-200">
              <Zap className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Instant Execution</h3>
                <p className="text-slate-600 text-sm">
                  One-click trading, bracket orders, stop-loss triggers. When market conditions 
                  change, you need to act immediately, not navigate through educational content.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white rounded-xl border border-slate-200">
              <BarChart3 className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Advanced Charting</h3>
                <p className="text-slate-600 text-sm">
                  Technical indicators, pattern recognition, multi-timeframe analysis. 
                  Tools built for traders who already understand the fundamentals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* When to Use */}
        <div className="bg-amber-50 rounded-2xl p-8 mb-12 border border-amber-200">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Are You Ready for Active Trading?
          </h2>
          <p className="text-slate-700 mb-4">
            Active trading platforms are for users who:
          </p>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold">→</span>
              <span>Already understand investment fundamentals</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold">→</span>
              <span>Need to monitor positions in real-time</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold">→</span>
              <span>Execute trades multiple times per day or week</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold">→</span>
              <span>Require advanced charting and technical analysis tools</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold">→</span>
              <span>Have chosen a broker and are ready to trade</span>
            </li>
          </ul>
          <div className="mt-6 p-4 bg-white rounded-lg border border-amber-200">
            <p className="text-sm text-slate-700">
              <strong>Not sure?</strong> If you're still learning about mutual funds, 
              stocks, or investment strategies, stay on <Link href="/" className="text-teal-600 hover:underline">InvestingPro.in</Link> 
              {' '}to build your foundation first.
            </p>
          </div>
        </div>

        {/* CTA - Professional, not promotional */}
        <div className="text-center bg-slate-50 rounded-2xl p-12 border border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Next Step: Execution Platform</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            For real-time market data, advanced charting, and execution tools, 
            access our dedicated trading research platform.
          </p>
          <a
            href="https://swingtrader.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
          >
            <span>Access Trading Platform</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Back to InvestingPro.in
          </Link>
        </div>
      </div>
    </>
  );
}

