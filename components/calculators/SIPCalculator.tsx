"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

export function SIPCalculator() {
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
    const [years, setYears] = useState(10);
    const [expectedReturn, setExpectedReturn] = useState(12);

    const calculateSIP = () => {
        const monthlyRate = expectedReturn / 12 / 100;
        const months = years * 12;
        const investedAmount = monthlyInvestment * months;
        const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);

        return {
            investedAmount,
            estimatedReturns: futureValue - investedAmount,
            totalValue: futureValue
        };
    };

    const result = calculateSIP();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">SIP Calculator</h3>

            <div className="space-y-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Investment
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="500"
                            max="100000"
                            step="500"
                            value={monthlyInvestment}
                            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <span className="text-lg font-bold text-blue-600 min-w-[100px] text-right">
                            ₹{monthlyInvestment.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Period (Years)
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="1"
                            max="30"
                            step="1"
                            value={years}
                            onChange={(e) => setYears(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <span className="text-lg font-bold text-blue-600 min-w-[100px] text-right">
                            {years} Yr
                        </span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Return (p.a)
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="1"
                            max="30"
                            step="0.5"
                            value={expectedReturn}
                            onChange={(e) => setExpectedReturn(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <span className="text-lg font-bold text-blue-600 min-w-[100px] text-right">
                            {expectedReturn}%
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Invested Amount</p>
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(result.investedAmount)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Est. Returns</p>
                    <p className="text-sm font-bold text-green-600">+{formatCurrency(result.estimatedReturns)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Total Value</p>
                    <p className="text-lg font-bold text-blue-700">{formatCurrency(result.totalValue)}</p>
                </div>
            </div>
        </div>
    );
}
