"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IndianRupee, Percent, Receipt, Info, CheckCircle2, Calculator } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function GSTCalculator() {
    const [amount, setAmount] = useState(10000);
    const [gstRate, setGstRate] = useState(18); // Default 18%
    const [calculationType, setCalculationType] = useState<'exclusive' | 'inclusive'>('exclusive');

    // GST rates in India
    const gstRates = [
        { value: 0, label: '0% (Exempt)' },
        { value: 5, label: '5%' },
        { value: 12, label: '12%' },
        { value: 18, label: '18% (Standard)' },
        { value: 28, label: '28% (Luxury)' },
    ];

    const calculateGST = () => {
        if (calculationType === 'exclusive') {
            // GST exclusive: Amount is base, add GST
            const baseAmount = amount;
            const gstAmount = (baseAmount * gstRate) / 100;
            const totalAmount = baseAmount + gstAmount;
            
            return {
                baseAmount,
                gstAmount,
                totalAmount,
                cgst: gstAmount / 2, // CGST is half of GST
                sgst: gstAmount / 2, // SGST is half of GST
                igst: gstAmount, // IGST for inter-state
            };
        } else {
            // GST inclusive: Amount includes GST, extract base
            const totalAmount = amount;
            const baseAmount = (totalAmount * 100) / (100 + gstRate);
            const gstAmount = totalAmount - baseAmount;
            
            return {
                baseAmount,
                gstAmount,
                totalAmount,
                cgst: gstAmount / 2,
                sgst: gstAmount / 2,
                igst: gstAmount,
            };
        }
    };

    const result = calculateGST();

    const formatCurrency = (num: number) => {
        return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const chartData = [
        { name: 'Base Amount', value: result.baseAmount, color: '#0ea5e9' }, // secondary-500
        { name: 'GST', value: result.gstAmount, color: '#10b981' }, // success-500
    ];

    return (
        <div className="space-y-6">
            {/* Input Section */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1 flex items-center gap-6 md:p-8">
                                    <Calculator className="w-5 h-5 text-primary-600" />
                                    GST Calculator
                                </CardTitle>
                                <CardDescription>Calculate GST for goods and services in India</CardDescription>
                            </div>
                            <Badge variant="secondary" className="bg-primary-50 text-primary-700 border-primary-200">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Free
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Calculation Type */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700">Calculation Type</Label>
                            <Select value={calculationType} onValueChange={(value: 'exclusive' | 'inclusive') => setCalculationType(value)}>
                                <SelectTrigger className="h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="exclusive">GST Exclusive (Add GST to amount)</SelectItem>
                                    <SelectItem value="inclusive">GST Inclusive (Extract GST from amount)</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-slate-500">
                                {calculationType === 'exclusive' 
                                    ? 'Enter the base amount, GST will be added'
                                    : 'Enter the total amount including GST, base amount will be calculated'}
                            </p>
                        </div>

                        {/* Amount Input */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <IndianRupee className="w-4 h-4" />
                                {calculationType === 'exclusive' ? 'Base Amount' : 'Total Amount (Including GST)'}
                            </Label>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                                className="h-12 text-lg font-semibold"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        {/* GST Rate */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Percent className="w-4 h-4" />
                                GST Rate
                            </Label>
                            <Select value={gstRate.toString()} onValueChange={(value: string) => setGstRate(Number(value))}>
                                <SelectTrigger className="h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {gstRates.map((rate) => (
                                        <SelectItem key={rate.value} value={rate.value.toString()}>
                                            {rate.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Info Card */}
                        <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                <div className="text-sm text-secondary-800">
                                    <p className="font-semibold mb-1">GST Breakdown:</p>
                                    <ul className="space-y-1 text-xs">
                                        <li>• <strong>CGST:</strong> Central GST (half of GST rate)</li>
                                        <li>• <strong>SGST:</strong> State GST (half of GST rate)</li>
                                        <li>• <strong>IGST:</strong> Integrated GST (for inter-state transactions)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Card */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl bg-gradient-to-br from-primary-50 to-success-50">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-6 md:p-8">
                            <Receipt className="w-5 h-5 text-primary-600" />
                            GST Calculation Results
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Main Results */}
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 md:p-8 border-2 border-primary-200">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    {calculationType === 'exclusive' ? 'Base Amount' : 'Base Amount (Excluding GST)'}
                                </div>
                                <div className="text-3xl font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(result.baseAmount)}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border-2 border-primary-200">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    GST Amount ({gstRate}%)
                                </div>
                                <div className="text-3xl font-bold text-primary-600">
                                    {formatCurrency(result.gstAmount)}
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-primary-600 to-success-600 rounded-xl p-4 text-white">
                                <div className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">
                                    Total Amount
                                </div>
                                <div className="text-3xl font-bold">
                                    {formatCurrency(result.totalAmount)}
                                </div>
                            </div>
                        </div>

                        {/* GST Breakdown */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200">
                            <div className="text-sm font-bold text-slate-700 mb-3">GST Breakdown</div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">CGST ({gstRate / 2}%):</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(result.cgst)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">SGST ({gstRate / 2}%):</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(result.sgst)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                    <span className="text-slate-600">IGST ({gstRate}%):</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(result.igst)}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-lg">Amount Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px'
                                }}
                                formatter={(value: any) => formatCurrency(Number(value))}
                            />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}

