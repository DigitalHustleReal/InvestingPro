"use client";

import React from 'react';
import { CalculatorVisualProps } from '@/lib/visuals/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

/**
 * Auto-generated Calculator Visual
 * 
 * Generates chart-based and table-based visuals for calculators:
 * - Bar charts for comparisons
 * - Line charts for projections
 * - Pie charts for breakdowns
 * - Tables for detailed data
 */
export default function CalculatorVisual({
    calculatorType,
    inputData,
    resultData,
    showChart = true,
    showTable = true
}: CalculatorVisualProps) {
    return (
        <div className="space-y-6">
            {showChart && (
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <CalculatorChart 
                        calculatorType={calculatorType}
                        inputData={inputData}
                        resultData={resultData}
                    />
                </div>
            )}
            
            {showTable && resultData?.breakdown && (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <CalculatorTable 
                        calculatorType={calculatorType}
                        data={resultData.breakdown}
                    />
                </div>
            )}
        </div>
    );
}

/**
 * Calculator Chart Generator
 */
function CalculatorChart({ calculatorType, inputData, resultData }: any) {
    switch (calculatorType) {
        case 'emi':
            return <EMIChart inputData={inputData} resultData={resultData} />;
        case 'sip':
            return <SIPChart inputData={inputData} resultData={resultData} />;
        case 'fd':
            return <FDChart inputData={inputData} resultData={resultData} />;
        case 'tax':
            return <TaxChart inputData={inputData} resultData={resultData} />;
        case 'retirement':
            return <RetirementChart inputData={inputData} resultData={resultData} />;
        default:
            return <GenericChart data={resultData} />;
    }
}

/**
 * EMI Calculator Chart - Shows principal vs interest breakdown
 */
function EMIChart({ inputData, resultData }: any) {
    const data = [
        { name: 'Principal', value: resultData?.principal || 0, fill: '#10b981' },
        { name: 'Interest', value: resultData?.totalInterest || 0, fill: '#0d9488' },
    ];
    
    return (
        <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry: any) => `${entry.name}: ${entry.percent ? (entry.percent * 100).toFixed(1) : 0}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

/**
 * SIP Calculator Chart - Shows growth over time
 */
function SIPChart({ inputData, resultData }: any) {
    const projection = resultData?.projection || [];
    
    return (
        <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Investment Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={projection}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#f8fafc', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                        }} 
                    />
                    <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

/**
 * FD Calculator Chart - Shows maturity amount
 */
function FDChart({ inputData, resultData }: any) {
    const data = [
        { name: 'Principal', amount: inputData?.principal || 0 },
        { name: 'Interest', amount: resultData?.interest || 0 },
        { name: 'Maturity', amount: resultData?.maturityAmount || 0 },
    ];
    
    return (
        <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Fixed Deposit Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#f8fafc', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                        }}
                        formatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`}
                    />
                    <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

/**
 * Tax Calculator Chart - Shows tax breakdown
 */
function TaxChart({ inputData, resultData }: any) {
    const data = resultData?.taxBreakdown || [
        { bracket: '0-2.5L', tax: 0 },
        { bracket: '2.5-5L', tax: resultData?.tax5 || 0 },
        { bracket: '5-10L', tax: resultData?.tax20 || 0 },
        { bracket: '10L+', tax: resultData?.tax30 || 0 },
    ];
    
    return (
        <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Tax by Income Bracket</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="bracket" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#f8fafc', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                        }}
                        formatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`}
                    />
                    <Bar dataKey="tax" fill="#0d9488" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

/**
 * Retirement Calculator Chart - Shows corpus growth
 */
function RetirementChart({ inputData, resultData }: any) {
    const projection = resultData?.projection || [];
    
    return (
        <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Retirement Corpus Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={projection}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="age" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#f8fafc', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                        }}
                        formatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="corpus" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

/**
 * Generic Chart
 */
function GenericChart({ data }: any) {
    const chartData = data?.chartData || [{ name: 'Value', value: 0 }];
    
    return (
        <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Results</h3>
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
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

/**
 * Calculator Table - Detailed breakdown table
 */
function CalculatorTable({ calculatorType, data }: any) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
    }
    
    const headers = Object.keys(data[0]);
    
    return (
        <div>
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Detailed Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            {headers.map((header, idx) => (
                                <th
                                    key={idx}
                                    className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider"
                                >
                                    {header.replace(/_/g, ' ')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {data.map((row: any, rowIdx: number) => (
                            <tr key={rowIdx} className="hover:bg-slate-50 transition-colors">
                                {headers.map((header, colIdx) => (
                                    <td
                                        key={colIdx}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-slate-700"
                                    >
                                        {typeof row[header] === 'number'
                                            ? row[header].toLocaleString('en-IN', { 
                                                style: 'currency', 
                                                currency: 'INR',
                                                maximumFractionDigits: 0
                                            })
                                            : row[header]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

