"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, TrendingUp, Shield } from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';

/**
 * Explainer Page: Broker Comparison
 * 
 * This page explains why someone would need BestStockBrokers.org
 * after learning about investments on InvestingPro.in
 * 
 * Placement: Bridge between InvestingPro (cognitive) → BestStockBrokers (vendor resolution)
 */
export default function BrokerComparisonPage() {
  return (
    <>
      <SEOHead
        title="Compare Stock Brokers - When Guide-Based Investing Isn't Enough"
        description="After understanding your investment options, choose the right broker. Compare fees, tools, and reliability across India's top stock brokers."
        url="/advanced-tools/broker-comparison"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            Advanced Tools
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            When Guide-Based Investing Isn't Enough
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            You've learned about mutual funds, stocks, and investment strategies. 
            Now it's time to choose <strong>who you'll trust</strong> as your intermediary.
          </p>
        </div>

        {/* The Gap */}
        <div className="bg-slate-50 rounded-2xl p-8 mb-12 border border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            The Gap Between Knowledge and Action
          </h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Understanding <em>what</em> to invest in is only half the journey. The other half 
            is choosing <em>where</em> to execute those investments. Every broker has different:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900">Fee structures</strong>
                <span className="text-slate-600"> - Zero brokerage vs. percentage-based vs. flat fees</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900">Platform reliability</strong>
                <span className="text-slate-600"> - Uptime, execution speed, customer support</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900">Tool sophistication</strong>
                <span className="text-slate-600"> - Research tools, charting, portfolio analytics</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900">Account types</strong>
                <span className="text-slate-600"> - Demat, trading, margin, commodity accounts</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Why BestStockBrokers */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Why Broker Comparison Is Separate
          </h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Broker comparison requires a different analytical framework than investment education. 
            It focuses on:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <Shield className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">Infrastructure Trust</h3>
              <p className="text-sm text-slate-600">
                Who can you trust with your money? Regulatory compliance, security audits, 
                and historical reliability matter more than marketing.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <TrendingUp className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">Fee Transparency</h3>
              <p className="text-sm text-slate-600">
                Hidden charges, AMC fees, transaction costs—these compound over time. 
                A dedicated comparison platform surfaces what matters.
              </p>
            </div>
          </div>
        </div>

        {/* When to Use */}
        <div className="bg-primary-50 rounded-2xl p-8 mb-12 border border-primary-200">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            When Is Broker Comparison Needed?
          </h2>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start gap-3">
              <span className="text-primary-600 font-bold">✓</span>
              <span>You've decided <strong>what</strong> to invest in (stocks, mutual funds, etc.)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 font-bold">✓</span>
              <span>You're choosing <strong>infrastructure</strong>, not strategy</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 font-bold">✓</span>
              <span>You need to compare fees, tools, and reliability side-by-side</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 font-bold">✓</span>
              <span>You're ready to open a demat or trading account</span>
            </li>
          </ul>
        </div>

        {/* CTA - Professional, not promotional */}
        <div className="text-center bg-slate-50 rounded-2xl p-12 border border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Next Step: Broker Selection</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            For detailed broker comparisons, fee analysis, and platform reliability metrics, 
            access our dedicated broker research platform.
          </p>
          <a
            href="https://beststockbrokers.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
          >
            <span>Access Broker Research</span>
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

