"use client";

import React from 'react';
import { HomeLoanVsSIPCalculator } from '@/components/calculators/HomeLoanVsSIPCalculator';
import SEOHead from '@/components/common/SEOHead';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function HomeLoanVsSIPPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 md:px-8">
            <SEOHead 
                title="Home Loan vs SIP Calculator (2026) | Prepay or Invest?"
                description="Should you prepay your home loan or invest in SIP? Our advanced calculator helps you decide by comparing interest outflows vs potential equity returns."
            />

            <div className="max-w-6xl mx-auto">
                <Link href="/calculators" className="inline-flex items-center text-sm text-slate-500 hover:text-teal-600 mb-8 font-medium transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Tools
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Home Loan vs <span className="text-teal-600">SIP Analysis</span></h1>
                    <p className="text-lg text-slate-500 max-w-2xl">
                        Optimize your financial journey. Use this tool to realize the opportunity cost of prepaying low-interest loans versus long-term wealth creation.
                    </p>
                </div>

                <div className="bg-white p-6 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm">
                    <HomeLoanVsSIPCalculator />
                </div>

                <div className="mt-16 prose prose-slate max-w-none">
                    <h2 className="text-2xl font-bold text-slate-900 border-b pb-4">Understanding the "Prepay vs Invest" Dilemma</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
                        <div>
                            <h3 className="text-xl font-bold text-teal-600 mb-4">Case for Prepayment</h3>
                            <p className="text-slate-600">
                                Prepaying a loan gives you a <strong>guaranteed return</strong> equal to the loan interest rate. 
                                It reduces your debt burden and gives you psychological peace of mind. If your loan interest rate 
                                is high (e.g. &gt;10%), prepayment is usually the safer bet.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-primary-600 mb-4">Case for SIP</h3>
                            <p className="text-slate-600">
                                Investing in equity SIPs historically yields 12-15% over long periods (10+ years). 
                                If your loan rate is low (8-9%) and you are disciplined, you create a <strong>positive arbitrage</strong> 
                                which can significantly increase your terminal net worth.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
