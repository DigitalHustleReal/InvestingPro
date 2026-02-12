"use client";

import { CreditCard, Loan, MutualFund } from "@/types";
import { Button } from "@/components/ui/Button";
import { X, Check, Minus, Star, TrendingUp } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/utils";

interface ComparisonTableProps {
    products: (CreditCard | Loan | MutualFund)[];
    onRemove?: (productId: string) => void;
}

export function ComparisonTable({ products, onRemove }: ComparisonTableProps) {
    if (products.length === 0) {
        return (
            <div className="bg-slate-50 rounded-xl p-12 text-center border-2 border-dashed border-slate-300">
                <p className="text-slate-500 text-lg">Select products to compare</p>
            </div>
        );
    }

    const productType = products[0].category;

    // Define comparison rows based on product type
    const getComparisonRows = () => {
        if (productType === 'credit_card') {
            return [
                { label: "Annual Fee", key: "annualFee", format: (v: any) => formatCurrency(v) },
                { label: "Joining Fee", key: "joiningFee", format: (v: any) => formatCurrency(v) },
                { label: "Reward Rate", key: "rewardRate" },
                { label: "Lounge Access", key: "loungeAccess" },
                { label: "Welcome Offer", key: "welcomeOffer" },
                { label: "Min Credit Score", key: "minCreditScore" },
            ];
        } else if (productType === 'loan') {
            return [
                { label: "Interest Rate", key: "interestRate", format: (p: any) => `${p.interestRateMin}% - ${p.interestRateMax}%` },
                { label: "Processing Fee", key: "processingFee" },
                { label: "Max Tenure", key: "maxTenureMonths", format: (v: any) => `${v / 12} Years` },
                { label: "Max Amount", key: "maxAmount" },
                { label: "Prepayment Charges", key: "prepaymentCharges" },
            ];
        } else if (productType === 'mutual_fund') {
            return [
                { label: "3Y Returns", key: "returns3Y", format: (v: any) => formatPercentage(v), highlight: true },
                { label: "5Y Returns", key: "returns5Y", format: (v: any) => formatPercentage(v) },
                { label: "Expense Ratio", key: "expenseRatio", format: (v: any) => formatPercentage(v) },
                { label: "Risk Level", key: "riskLevel", format: (v: any) => v.replace('_', ' ').toUpperCase() },
                { label: "AUM", key: "aum" },
                { label: "Fund Manager", key: "manager" },
            ];
        }
        return [];
    };

    const rows = getComparisonRows();

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 bg-slate-50 border-b border-slate-200">
                <div className="p-6 font-bold text-slate-900 border-r border-slate-200">
                    Compare Features
                </div>
                {products.map((product) => (
                    <div key={product.id} className="p-6 relative border-r border-slate-200 last:border-r-0">
                        {onRemove && (
                            <button
                                onClick={() => onRemove(product.id)}
                                className="absolute top-2 right-2 p-1 rounded-full bg-slate-200 hover:bg-danger-100 text-slate-600 hover:text-danger-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center bg-accent-50 px-2 py-0.5 rounded text-accent-700 text-xs font-bold border border-accent-100">
                                {product.rating} <Star className="w-3 h-3 ml-0.5 fill-accent-500 text-accent-500" />
                            </div>
                            {product.isPopular && (
                                <span className="text-xs bg-success-100 text-success-700 px-2 py-0.5 rounded font-bold">
                                    POPULAR
                                </span>
                            )}
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">{product.name}</h3>
                        <p className="text-xs text-slate-500">{product.provider}</p>
                    </div>
                ))}
            </div>

            {/* Comparison Rows */}
            {rows.map((row, idx) => (
                <div
                    key={row.label}
                    className={`grid grid-cols-1 md:grid-cols-4 border-b border-slate-100 last:border-b-0 ${row.highlight ? 'bg-success-50/30' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                        }`}
                >
                    <div className="p-4 font-semibold text-slate-700 text-sm border-r border-slate-200 flex items-center">
                        {row.label}
                    </div>
                    {products.map((product) => {
                        const value = row.format
                            ? (row.key === 'interestRate' ? row.format(product) : row.format((product as any)[row.key]))
                            : (product as any)[row.key];

                        return (
                            <div key={product.id} className="p-4 text-sm text-slate-900 border-r border-slate-200 last:border-r-0 flex items-center">
                                {value !== undefined && value !== null ? (
                                    <span className={row.highlight ? 'font-bold text-success-600 text-base' : ''}>
                                        {value}
                                    </span>
                                ) : (
                                    <span className="text-slate-600 italic">Not specified</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}

            {/* Pros/Cons Section (for Credit Cards) */}
            {productType === 'credit_card' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 border-b border-slate-200 bg-success-50/30">
                        <div className="p-4 font-semibold text-slate-700 text-sm border-r border-slate-200">
                            ✅ Pros
                        </div>
                        {products.map((product) => (
                            <div key={product.id} className="p-4 text-xs text-slate-700 border-r border-slate-200 last:border-r-0">
                                <ul className="space-y-1">
                                    {(product as CreditCard).pros?.slice(0, 3).map((pro, i) => (
                                        <li key={i} className="flex items-start gap-1">
                                            <Check className="w-3 h-3 text-success-600 flex-shrink-0 mt-0.5" />
                                            <span>{pro}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 bg-danger-50/30">
                        <div className="p-4 font-semibold text-slate-700 text-sm border-r border-slate-200">
                            ⚠️ Cons
                        </div>
                        {products.map((product) => (
                            <div key={product.id} className="p-4 text-xs text-slate-700 border-r border-slate-200 last:border-r-0">
                                <ul className="space-y-1">
                                    {(product as CreditCard).cons?.slice(0, 2).map((con, i) => (
                                        <li key={i} className="flex items-start gap-1">
                                            <Minus className="w-3 h-3 text-danger-600 flex-shrink-0 mt-0.5" />
                                            <span>{con}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Action Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 bg-slate-50">
                <div className="p-4 border-r border-slate-200"></div>
                {products.map((product) => (
                    <div key={product.id} className="p-4 border-r border-slate-200 last:border-r-0">
                        <Button className="w-full bg-secondary-600 hover:bg-secondary-700 text-white font-semibold">
                            Apply Now
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
