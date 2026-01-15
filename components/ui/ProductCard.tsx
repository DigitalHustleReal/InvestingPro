import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Star, ChevronRight, Info } from "lucide-react";
import { FinancialProduct, CreditCard, Loan, MutualFund } from "@/types";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import BestForBadge from "@/components/products/BestForBadge";
import AffiliateDisclosure from '@/components/common/AffiliateDisclosure';

interface ProductCardProps {
    product: FinancialProduct;
    showCompare?: boolean;
}

export function ProductCard({ product, showCompare = true }: ProductCardProps) {
    const isCreditCard = product.category === 'credit_card';
    const isLoan = product.category === 'loan';
    const isFund = product.category === 'mutual_fund';

    // Helper to get key metrics based on type
    const metrics = [];

    if (isCreditCard) {
        const cc = product as CreditCard;
        metrics.push({ label: "Annual Fee", value: formatCurrency(cc.annualFee) });
        metrics.push({ label: "Reward Rate", value: cc.rewardRate });
        if (cc.minCreditScore) metrics.push({ label: "Min Credit Score", value: cc.minCreditScore });
    } else if (isLoan) {
        const loan = product as Loan;
        metrics.push({ label: "Interest Rate", value: `${loan.interestRateMin}% - ${loan.interestRateMax}%` });
        metrics.push({ label: "Processing Fee", value: loan.processingFee });
        metrics.push({ label: "Max Tenure", value: `${loan.maxTenureMonths / 12} Years` });
    } else if (isFund) {
        const mf = product as MutualFund;
        metrics.push({ label: "3Y Returns", value: formatPercentage(mf.returns3Y), isHighlight: true });
        metrics.push({ label: "Expense Ratio", value: formatPercentage(mf.expenseRatio) });
        metrics.push({ label: "Risk", value: mf.riskLevel.replace('_', ' '), isCapitalize: true });
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 p-6 relative group overflow-hidden min-h-[180px] flex flex-col">
            {product.isPopular && (
                <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAR
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-6">
                {/* Left: Identity */}
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">{product.provider}</p>
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                            <Link href={product.applyLink || '#'}>{product.name}</Link>
                        </h3>
                            {/* Best For Badge */}
                            {product.bestFor && (
                                <div className="mt-2">
                                    <BestForBadge category={product.bestFor} size="sm" />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center bg-accent-50 px-2 py-1 rounded text-accent-700 text-sm font-bold border border-accent-100">
                            {product.rating} <Star className="w-3 h-3 ml-1 fill-accent-500 text-accent-500" />
                        </div>
                    </div>

                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                    {/* Pros / Highlights */}
                    {(product as any).features && (
                        <ul className="space-y-1 mb-4 hidden md:block">
                            {(product as any).features.slice(0, 3).map((feat: string, i: number) => (
                                <li key={i} className="flex items-start text-xs text-slate-500 font-medium">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-500 mr-1.5 flex-shrink-0 mt-0.5" />
                                    {feat}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Middle: Metrics */}
                <div className="md:w-1/3 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                        {metrics.map((m, i) => (
                            <div key={i}>
                                <p className="text-xs text-slate-400 mb-0.5">{m.label}</p>
                                <p className={`font-bold text-slate-900 ${m.isHighlight ? 'text-primary-600 text-lg' : ''} ${m.isCapitalize ? 'capitalize' : ''}`}>
                                    {m.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="md:w-1/5 flex flex-col justify-center gap-3 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                    <div className="flex flex-col gap-1">
                        <DecisionCTA
                            text={product.category === 'credit_card' ? "Apply Instantly" : 
                                  product.category === 'mutual_fund' ? "Start SIP Now" :
                                  product.category === 'loan' ? "Check Eligibility" :
                                  product.category === 'insurance' ? "Get Protected" :
                                  "Apply Now"}
                            href={product.applyLink || `/${(product.category || 'credit_card').replace('_', '-')}s/${product.id}`}
                            productId={product.id}
                            variant="primary"
                            className="w-full"
                            isExternal={!!product.applyLink}
                        />
                        {/* Affiliate Disclosure - FTC Compliance */}
                        <AffiliateDisclosure 
                            variant="button" 
                            hasAffiliateLink={!!product.applyLink}
                        />
                    </div>
                    
                    <DecisionCTA
                        text="Compare Details"
                        href={`/${(product.category || 'credit_card').replace('_', '-')}s/${product.id}`}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs h-9"
                        showIcon={false}
                    />

                    {showCompare && (
                        <div className="flex items-center justify-center gap-2 mt-1">
                            <input type="checkbox" id={`cmp-${product.id}`} className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                            <label htmlFor={`cmp-${product.id}`} className="text-xs text-slate-500 cursor-pointer select-none">Add to Compare</label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
