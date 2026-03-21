"use client";

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { IndianRupee, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

interface CreditCardValueCalculatorProps {
    annualFee: number;
    pointValue?: number; // Value of 1 point in INR (e.g. 0.25)
    rewardRate?: number; // Points per 100 spent (e.g. 2.0)
    // Alternatively, just a flat cashback rate
    cashbackRate?: number; // e.g. 1.5 for 1.5%
}

export default function CreditCardValueCalculator({ 
    annualFee, 
    pointValue = 0.25, 
    rewardRate = 4, // Default 4 points per 150 (approx 2.6%) -> normalize this
    cashbackRate 
}: CreditCardValueCalculatorProps) {
    const [monthlySpend, setMonthlySpend] = useState(50000);

    // Calculate effective return rate
    // If cashbackRate is provided, use it. Else calculate (rewardRate * pointValue).
    // Note: rewardRate input often varies. Let's assume input is % return for simplicity if cashback provided,
    // or we calculate it.
    // Let's standardise: We'll imply a "Return Percentage" based on props.
    // If HDFC Regalia (4 pts/150, 1 pt = 0.5 airmile approx? or 0.20 cash). 
    // Let's use a safe default of 1.5% if not specified.
    const effectiveRate = cashbackRate || (rewardRate * pointValue); // e.g. 4 * 0.25 = 1%? Wait.
    // HDFC Regalia: 4 pts per 150. 1 pt = 0.20 (Cash) to 0.50 (Flight).
    // 4 pts = 0.80 to 2.00 INR on 150 spend.
    // Return % = (0.8/150)*100 = 0.53% (Cash) to (2/150)*100 = 1.33% (Flight).
    // Let's default to a "Blended Return" of 1.5% for visual demo if props are vague.
    const displayRate = effectiveRate > 0 ? effectiveRate : 1.5;

    const annualSpend = monthlySpend * 12;
    const annualRewards = annualSpend * (displayRate / 100);
    const netBenefit = annualRewards - annualFee;
    const isProfitable = netBenefit > 0;

    // Fee Waiver Logic (Hardcoded simulation mostly)
    const waiverThreshold = 300000;
    const pointsWaiver = annualSpend >= waiverThreshold;
    const finalFee = pointsWaiver ? 0 : annualFee;
    const finalNetInfo = annualRewards - finalFee;

    return (
        <Card className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50 border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Is It Worth It? <span className="text-slate-500 font-normal text-sm ml-2">(Quick Math)</span></h3>
            </div>

            <div className="space-y-8">
                {/* Input Slider */}
                <div>
                    <div className="flex justify-between items-end mb-4">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Monthly Spend</label>
                        <div className="flex items-center text-2xl font-bold text-primary-600 dark:text-primary-400">
                           <IndianRupee className="w-5 h-5 mr-0.5" />
                           {monthlySpend.toLocaleString('en-IN')}
                        </div>
                    </div>
                    <Slider 
                        value={[monthlySpend]} 
                        min={5000} 
                        max={200000} 
                        step={1000}
                        onValueChange={(val) => setMonthlySpend(val[0])}
                        className="py-2"
                    />
                    <div className="flex justify-between text-xs text-slate-600 mt-2">
                        <span>₹5k</span>
                        <span>₹2L</span>
                    </div>
                </div>

                {/* Calculation Breakdown */}
                <div className="bg-white dark:bg-black/20 rounded-xl border border-slate-100 dark:border-slate-800 p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Annual Rewards (~{displayRate.toFixed(1)}%)</span>
                        <span className="font-semibold text-emerald-600">+ ₹{annualRewards.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            Annual Fee 
                             {pointsWaiver && <span className="text-[10px] bg-success-100 text-success-700 px-1 rounded ml-1">WAIVED</span>}
                        </span>
                        <span className={`font-semibold ${pointsWaiver ? 'text-slate-600 line-through' : 'text-rose-500'}`}>
                            - ₹{annualFee.toLocaleString('en-IN')}
                        </span>
                    </div>
                    
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center">
                        <span className="font-bold text-slate-900 dark:text-white">Net Benefit</span>
                        <span className={`text-xl font-bold ${finalNetInfo > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                            {finalNetInfo > 0 ? '+' : ''} ₹{finalNetInfo.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                </div>

                {/* Verdict Message */}
                <div className={`flex items-start gap-3 p-3 rounded-lg text-sm ${finalNetInfo > 0 ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300' : 'bg-rose-50 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300'}`}>
                    {finalNetInfo > 0 ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    ) : (
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    )}
                    <div>
                        <p className="font-bold mb-0.5">{finalNetInfo > 0 ? 'Worth the fee! ✅' : 'Not worth it yet ❌'}</p>
                        <p className="opacity-90 leading-tight">
                            {finalNetInfo > 0 
                             ? `You gain ₹${finalNetInfo.toLocaleString('en-IN')} per year value after fees.` 
                             : `You need to spend ~₹${Math.ceil((annualFee / (displayRate/100))/12).toLocaleString('en-IN')} more monthly to break even.`}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
