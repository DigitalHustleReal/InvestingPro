"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
    Home, 
    TrendingUp, 
    Calculator as CalcIcon, 
    ArrowRight,
    Info,
    CheckCircle2
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export function HomeLoanVsSIPCalculator() {
    // Inputs
    const [loanAmount, setLoanAmount] = useState(5000000); // 50L
    const [interestRate, setInterestRate] = useState(8.5);
    const [tenor, setTenor] = useState(20);
    const [sipAmount, setSipAmount] = useState(25000);
    const [sipReturn, setSipReturn] = useState(12);

    // Calculations
    const results = useMemo(() => {
        const monthlyRate = interestRate / 12 / 100;
        const totalMonths = tenor * 12;
        
        // EMI Calculation
        const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        
        // Final Loan Interest
        const totalPayment = emi * totalMonths;
        const totalInterest = totalPayment - loanAmount;

        // SIP Wealth Calculation
        const monthlyReturn = sipReturn / 12 / 100;
        const sipWealth = sipAmount * ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn) * (1 + monthlyReturn);

        // Chart Projection (Yearly)
        const labels = Array.from({ length: tenor + 1 }, (_, i) => `Yr ${i}`);
        const interestData = [0];
        const wealthData = [0];

        for (let y = 1; y <= tenor; y++) {
            const months = y * 12;
            const interestAtY = (totalInterest / tenor) * y; 
            interestData.push(interestAtY);
            const wealthAtY = sipAmount * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn) * (1 + monthlyReturn);
            wealthData.push(wealthAtY);
        }

        return {
            emi: Math.round(emi),
            totalInterest: Math.round(totalInterest),
            sipWealth: Math.round(sipWealth),
            interestData,
            wealthData,
            labels
        };
    }, [loanAmount, interestRate, tenor, sipAmount, sipReturn]);

    const chartData = {
        labels: results.labels,
        datasets: [
            {
                label: 'Cost of Loan (Interest Only)',
                data: results.interestData,
                borderColor: '#0ea5e9', // secondary-500
                backgroundColor: 'rgba(14, 165, 233, 0.1)', // secondary-500 with opacity
                fill: true,
                tension: 0.4
            },
            {
                label: 'Wealth Created by SIP',
                data: results.wealthData,
                borderColor: '#0d9488',
                backgroundColor: 'rgba(13, 148, 136, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Controls */}
            <div className="lg:col-span-4 space-y-6">
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center gap-2 font-bold text-slate-900 border-b pb-4">
                            <Home className="w-5 h-5 text-slate-400" /> Loan Details
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Loan Amount (₹)</label>
                            <Input 
                                type="number" 
                                value={loanAmount} 
                                onChange={(e) => setLoanAmount(Number(e.target.value))} 
                            />
                            <Slider 
                                value={[loanAmount]} 
                                min={100000} 
                                max={20000000} 
                                step={100000}
                                onValueChange={(val) => setLoanAmount(val[0])}
                                className="mt-4"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Interest Rate (%)</label>
                            <Input 
                                type="number" 
                                value={interestRate} 
                                onChange={(e) => setInterestRate(Number(e.target.value))} 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Tenor (Years)</label>
                            <Input 
                                type="number" 
                                value={tenor} 
                                onChange={(e) => setTenor(Number(e.target.value))} 
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center gap-2 font-bold text-slate-900 border-b pb-4">
                            <TrendingUp className="w-5 h-5 text-primary-600" /> SIP Alternative
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Monthly SIP Amount (₹)</label>
                            <Input 
                                type="number" 
                                value={sipAmount} 
                                onChange={(e) => setSipAmount(Number(e.target.value))} 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Expected Return (%)</label>
                            <Input 
                                type="number" 
                                value={sipReturn} 
                                onChange={(e) => setSipReturn(Number(e.target.value))} 
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Results */}
            <div className="lg:col-span-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-white dark:bg-slate-800 border-none shadow-sm">
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-slate-900 mb-1">₹{results.emi.toLocaleString()}</div>
                            <div className="text-xs text-slate-400">Monthly EMI</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-rose-50 border-none shadow-sm">
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-rose-600 mb-1">₹{results.totalInterest.toLocaleString()}</div>
                            <div className="text-xs text-rose-500">Total Interest Outflow</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-primary-600 text-white border-none shadow-sm">
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold mb-1">₹{results.sipWealth.toLocaleString()}</div>
                            <div className="text-xs opacity-80">SIP Wealth Maturity</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-6">Wealth Projection Over {tenor} Years</h3>
                        <div className="h-[300px]">
                            <Line 
                                data={chartData} 
                                options={{ 
                                    maintainAspectRatio: false,
                                    plugins: { legend: { position: 'bottom' } },
                                    scales: {
                                        y: {
                                            ticks: { callback: (value) => '₹' + (Number(value) / 100000).toFixed(1) + 'L' }
                                        }
                                    }
                                }} 
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Verdict Box */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-500 rounded-lg">
                                <CalcIcon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold">Our Insightful Verdict</h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            If you invest ₹{sipAmount.toLocaleString()} per month at {sipReturn}% instead of prepaying your {interestRate}% loan, 
                            you create a surplus of <span className="text-primary-400 font-bold">₹{(results.sipWealth - results.totalInterest).toLocaleString()}</span>. 
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-primary-400 uppercase tracking-widest">
                                <CheckCircle2 className="w-3 h-3" /> Wealth Creator
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                                <Info className="w-3 h-3" /> Opportunity Cost Analysis
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
