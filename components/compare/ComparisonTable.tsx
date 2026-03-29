"use client";

import { CreditCard, Loan, MutualFund } from "@/types";
import { Button } from "@/components/ui/Button";
import { X, Check, Minus, Star, TrendingUp, Trophy } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { calculateProductScore } from "@/lib/products/scoring-rules";
import { FinancialProduct } from "@/types";

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

    // Helper to find winner
    const getWinnerId = (rowKey: string, criteria: 'max' | 'min'): string | null => {
        let bestId: string | null = null;
        let bestVal: number | null = null;

        for (const p of products) {
            let val: number | undefined;
            
            if (rowKey === 'interestRate' && 'interestRateMin' in p) {
                // For loans, compare min interest rate
                val = (p as Loan).interestRateMin; 
            } else if (typeof (p as any)[rowKey] === 'number') {
                val = (p as any)[rowKey];
            } else if (rowKey === 'score' && typeof (p as any).score === 'object') {
                 // Handle nested score object if necessary, though current usage suggests score is calculated or top-level.
                 // Actually calculating score in render loop, so we might need to pre-calc or just skip complex logic here for now/
                 // Let's assume score is mapped to a top-level property or simple logic for now. 
                 // The render block calculates score. Let's rely on simple numeric fields for now.
                 // If score is calculated on the fly, we can't easily compare here without duplicating logic.
                 // Let's skip score for now or rely on pre-calculated.
            }

            if (val !== undefined && !isNaN(val)) {
                if (bestVal === null) {
                    bestVal = val;
                    bestId = p.id;
                } else {
                    if (criteria === 'max' && val > bestVal) {
                        bestVal = val;
                        bestId = p.id;
                    } else if (criteria === 'min' && val < bestVal) {
                        bestVal = val;
                        bestId = p.id;
                    }
                }
            }
        }
        return bestId;
    };


    // Define comparison rows based on product type
    const getComparisonRows = () => {
        if (productType === 'credit_card') {
            return [
                { label: "Pro Score", key: "score", format: (v: any) => v, highlight: true, winner: 'max' },
                { label: "Annual Fee", key: "annualFee", format: (v: any) => formatCurrency(v), winner: 'min' },
                { label: "Joining Fee", key: "joiningFee", format: (v: any) => formatCurrency(v), winner: 'min' },
                { label: "Reward Rate", key: "rewardRate", winner: 'max' },
                { label: "Lounge Access", key: "loungeAccess" }, // Boolean or string, harder to compare automatically
                { label: "Welcome Offer", key: "welcomeOffer" },
                { label: "Min Credit Score", key: "minCreditScore", winner: 'min' }, // Lower requirement is better? Or depends. usually lower is "easier"
            ];
        } else if (productType === 'loan') {
            return [
                { label: "Pro Score", key: "score", format: (v: any) => v, highlight: true, winner: 'max' },
                { label: "Interest Rate", key: "interestRate", format: (p: any) => `${p.interestRateMin}% - ${p.interestRateMax}%`, winner: 'min' },
                { label: "Processing Fee", key: "processingFee", winner: 'min' },
                { label: "Max Tenure", key: "maxTenureMonths", format: (v: any) => `${v / 12} Years`, winner: 'max' },
                { label: "Max Amount", key: "maxAmount", winner: 'max' },
                { label: "Prepayment Charges", key: "prepaymentCharges" },
            ];
        } else if (productType === 'mutual_fund') {
            return [
                { label: "Pro Score", key: "score", format: (v: any) => v, highlight: true, winner: 'max' },
                { label: "3Y Returns", key: "returns3Y", format: (v: any) => formatPercentage(v), highlight: true, winner: 'max' },
                { label: "5Y Returns", key: "returns5Y", format: (v: any) => formatPercentage(v), winner: 'max' },
                { label: "Expense Ratio", key: "expenseRatio", format: (v: any) => formatPercentage(v), winner: 'min' },
                { label: "Risk Level", key: "riskLevel", format: (v: any) => v.replace('_', ' ').toUpperCase() },
                { label: "AUM", key: "aum", winner: 'max' },
                { label: "Fund Manager", key: "manager" },
            ];
        }
        return [];
    };

    const rows = getComparisonRows();

    return (
        {/* Mobile scroll hint — visible on small screens only */}
        <p className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 sm:hidden">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 12h8m-8 5h4" /></svg>
            Scroll right to compare all products
        </p>
        <div className="w-full overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="bg-card dark:bg-slate-900 rounded-xl shadow-lg border border-border dark:border-slate-800 overflow-hidden min-w-[640px] sm:min-w-[800px]">
                {/* Header Row */}
                <div className="grid grid-cols-4 bg-muted/50 border-b border-border">
                    <div className="p-6 font-bold text-card-foreground border-r border-border">
                        Compare Features
                    </div>
                    {products.map((product) => (
                        <div key={product.id} className="p-6 relative border-r border-border last:border-r-0">
                            {onRemove && (
                                <button
                                    onClick={() => onRemove(product.id)}
                                    className="absolute top-2 right-2 p-1 rounded-full bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center bg-accent/10 px-2 py-0.5 rounded text-accent-foreground text-xs font-bold border border-accent/20">
                                    {product.rating} <Star className="w-3 h-3 ml-0.5 fill-accent text-accent" />
                                </div>
                                {product.isPopular && (
                                    <span className="text-xs bg-success/10 text-success-foreground px-2 py-0.5 rounded font-bold">
                                        POPULAR
                                    </span>
                                )}
                            </div>
                            <h3 className="font-bold text-card-foreground mb-1">{product.name}</h3>
                            <p className="text-xs text-muted-foreground">{product.provider}</p>
                        </div>
                    ))}
                </div>

                {/* Comparison Rows */}
                {rows.map((row, idx) => {
                     const winnerId = row.winner ? getWinnerId(row.key, row.winner as 'max' | 'min') : null;

                     return (
                        <div
                            key={row.label}
                            className={`grid grid-cols-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0 ${
                                row.highlight ? 'bg-primary-50/50 dark:bg-primary-900/10' : idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/40'
                            }`}
                        >
                            <div className="p-4 font-semibold text-muted-foreground text-sm border-r border-border flex items-center">
                                {row.label}
                            </div>
                            {products.map((product) => {
                                let value;
                                let displayValue;

                                if (row.key === 'score') {
                                    const score = calculateProductScore(product as FinancialProduct);
                                    value = score.overall;
                                    displayValue = <span className="font-bold text-lg text-success flex items-center gap-1"><Trophy className="w-4 h-4" /> {score.overall}/10</span>;
                                }

                                // Determine render value
                                const renderedValue = displayValue || (row.format
                                    ? (row.key === 'interestRate' ? row.format(product) : row.format((product as any)[row.key]))
                                    : (product as any)[row.key]);
                                
                                const isWinner = winnerId === product.id;

                                return (
                                    <div key={product.id} className={`p-4 text-sm border-r border-border last:border-r-0 flex items-center ${isWinner ? 'bg-success/10 font-semibold' : 'text-card-foreground'}`}>
                                        {renderedValue !== undefined && renderedValue !== null ? (
                                            <div className="flex items-center gap-2">
                                                <span>{renderedValue}</span>
                                                {isWinner && <Check className="w-4 h-4 text-success" />}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground italic">Not specified</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}

                {/* Pros/Cons Section (for Credit Cards) */}
                {productType === 'credit_card' && (
                    <>
                        <div className="grid grid-cols-4 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/30 dark:bg-emerald-900/10">
                            <div className="p-4 font-semibold text-slate-900 dark:text-slate-100 text-sm border-r border-slate-100 dark:border-slate-800 flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-600" /> Pros
                            </div>
                            {products.map((product) => (
                                <div key={product.id} className="p-4 text-xs text-card-foreground border-r border-border last:border-r-0">
                                    <ul className="space-y-1">
                                        {(product as CreditCard).pros?.slice(0, 3).map((pro, i) => (
                                            <li key={i} className="flex items-start gap-1">
                                                <Check className="w-3 h-3 text-success flex-shrink-0 mt-0.5" />
                                                <span>{pro}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-4 bg-red-50/30 dark:bg-red-900/10">
                            <div className="p-4 font-semibold text-slate-900 dark:text-slate-100 text-sm border-r border-slate-100 dark:border-slate-800 flex items-center gap-2">
                                <Minus className="w-4 h-4 text-red-600" /> Cons
                            </div>
                            {products.map((product) => (
                                <div key={product.id} className="p-4 text-xs text-card-foreground border-r border-border last:border-r-0">
                                    <ul className="space-y-1">
                                        {(product as CreditCard).cons?.slice(0, 2).map((con, i) => (
                                            <li key={i} className="flex items-start gap-1">
                                                <Minus className="w-3 h-3 text-destructive flex-shrink-0 mt-0.5" />
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
                <div className="grid grid-cols-4 bg-muted/30">
                    <div className="p-4 border-r border-border"></div>
                    {products.map((product) => (
                        <div key={product.id} className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                            <Button className="w-full bg-primary-700 hover:bg-primary-800 text-white font-bold shadow-md hover:shadow-lg transition-all h-10">
                                Apply Now
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ComparisonTable;
