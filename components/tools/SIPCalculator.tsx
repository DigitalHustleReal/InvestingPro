"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SIPCalculator() {
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
    const [expectedReturn, setExpectedReturn] = useState(12);
    const [timePeriod, setTimePeriod] = useState(10);

    const results = useMemo(() => {
        const months = timePeriod * 12;
        const rate = expectedReturn / 12 / 100;
        
        const investedAmount = monthlyInvestment * months;
        const totalValue = monthlyInvestment * (Math.pow(1 + rate, months) - 1) * (1 + rate) / rate;
        const estimatedReturns = totalValue - investedAmount;

        return {
            investedAmount: Math.round(investedAmount),
            estimatedReturns: Math.round(estimatedReturns),
            totalValue: Math.round(totalValue)
        };
    }, [monthlyInvestment, expectedReturn, timePeriod]);

    const chartData = {
        labels: ['Invested Amount', 'Est. Returns'],
        datasets: [
            {
                data: [results.investedAmount, results.estimatedReturns],
                backgroundColor: ['#e2e8f0', '#0d9488'], // Slate-200, primary-600
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        cutout: '70%',
        plugins: {
            legend: {
                display: false
            }
        }
    };

    return (
        <Card className="max-w-md mx-auto my-8 border-primary-100 dark:border-primary-900/50 shadow-md dark:bg-slate-900">
            <CardHeader className="bg-primary-50/50 dark:bg-primary-900/10 border-b border-primary-100 dark:border-primary-900/20 pb-4">
                <CardTitle className="text-xl text-primary-900 dark:text-primary-100 flex items-center gap-6 md:p-8">
                    📊 SIP Calculator
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 dark:text-slate-200">
                {/* Inputs */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Monthly Investment</Label>
                            <span className="font-semibold text-primary-700">₹{monthlyInvestment.toLocaleString()}</span>
                        </div>
                        <Slider 
                            value={[monthlyInvestment]} 
                            onValueChange={(v) => setMonthlyInvestment(v[0])} 
                            max={100000} step={500} 
                            className="py-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Expected Return (p.a)</Label>
                            <span className="font-semibold text-primary-700">{expectedReturn}%</span>
                        </div>
                        <Slider 
                            value={[expectedReturn]} 
                            onValueChange={(v) => setExpectedReturn(v[0])} 
                            max={30} step={0.5} 
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Time Period</Label>
                            <span className="font-semibold text-primary-700">{timePeriod} Years</span>
                        </div>
                        <Slider 
                            value={[timePeriod]} 
                            onValueChange={(v) => setTimePeriod(v[0])} 
                            max={40} step={1} 
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-2 gap-4 items-center pt-4 border-t border-slate-100">
                     <div className="w-32 h-32 mx-auto">
                        <Doughnut data={chartData} options={chartOptions} />
                     </div>
                     <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Invested</span>
                            <span className="font-medium">₹{results.investedAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Returns</span>
                            <span className="font-medium text-primary-600">+₹{results.estimatedReturns.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                            <span className="font-bold text-slate-900 dark:text-white">Total Value</span>
                            <span className="font-bold text-primary-700 dark:text-primary-400">₹{results.totalValue.toLocaleString()}</span>
                        </div>
                     </div>
                </div>
            </CardContent>
        </Card>
    );
}
