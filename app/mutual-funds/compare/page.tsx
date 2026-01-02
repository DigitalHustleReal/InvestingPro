import { getMutualFundById } from "@/lib/supabase/mock";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Check, X, Minus } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/utils";

export default async function CompareMutualFunds({ searchParams }: { searchParams: Promise<{ funds?: string }> }) {
    const params = await searchParams;
    const fundIds = params.funds?.split(',') || [];

    // Fetch selected funds
    const selectedFunds = await Promise.all(
        fundIds.map(id => getMutualFundById(id))
    );

    // Filter out undefined results
    const funds = selectedFunds.filter(f => f !== undefined);

    // If no funds selected, show empty state (or default comparison)
    if (funds.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">No Funds Selected</h1>
                <p className="text-gray-500 mb-8">Please select mutual funds to compare.</p>
                <Link href="/">
                    <Button>Browse Funds</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">Compare Funds</h1>
                    </div>

                    {/* Sticky Fund Names Header */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="hidden md:block text-gray-400 font-medium self-end pb-2">
                            Comparison Metrics
                        </div>
                        {funds.map(fund => (
                            <div key={fund!.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100 relative">
                                <Link href={`/mutual-funds/${fund!.id}`} className="hover:underline">
                                    <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{fund!.name}</h3>
                                </Link>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                        {fund!.rating}.0 ★
                                    </span>
                                </div>
                            </div>
                        ))}
                        {/* Add Placeholder for up to 3 funds */}
                        {[...Array(3 - funds.length)].map((_, i) => (
                            <div key={i} className="hidden md:flex items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4">
                                <span className="text-sm text-gray-400">Add Fund</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    {/* Basic Info Row */}
                    <div className="divide-y divide-gray-100">
                        <ComparisonRow label="Provider" funds={funds} render={(f) => f.provider} />
                        <ComparisonRow label="Category" funds={funds} render={(f) => <span className="capitalize">{f.category.replace('_', ' ')}</span>} />
                        <ComparisonRow label="Risk Level" funds={funds} render={(f) => (
                            <span className={`font-medium ${f.risk_level === 'very_high' ? 'text-red-600' : 'text-orange-500'} capitalize`}>
                                {f.risk_level.replace('_', ' ')}
                            </span>
                        )} />
                    </div>

                    {/* Returns Section */}
                    <div className="bg-gray-50 px-6 py-3 border-y border-gray-200 font-bold text-gray-900 text-sm uppercase tracking-wide">
                        Returns Performance
                    </div>
                    <div className="divide-y divide-gray-100">
                        <ComparisonRow label="1 Year Return" funds={funds} render={(f) => <span className="text-emerald-600 font-bold">{formatPercentage(f.returns_1y)}</span>} />
                        <ComparisonRow label="3 Year Return" funds={funds} render={(f) => <span className="text-emerald-600 font-bold">{formatPercentage(f.returns_3y)}</span>} />
                        <ComparisonRow label="5 Year Return" funds={funds} render={(f) => <span className="text-emerald-600 font-bold">{formatPercentage(f.returns_5y)}</span>} />
                    </div>

                    {/* Fees Section */}
                    <div className="bg-gray-50 px-6 py-3 border-y border-gray-200 font-bold text-gray-900 text-sm uppercase tracking-wide">
                        Fees & Investment
                    </div>
                    <div className="divide-y divide-gray-100">
                        <ComparisonRow label="Expense Ratio" funds={funds} render={(f) => formatPercentage(f.expense_ratio)} />
                        <ComparisonRow label="Min Investment" funds={funds} render={(f) => formatCurrency(f.min_investment)} />
                    </div>

                    {/* Action Section */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50">
                        <div className="hidden md:block"></div>
                        {funds.map(fund => (
                            <div key={fund!.id}>
                                <Button className="w-full bg-primary-600 hover:bg-emerald-700">Invest Now</Button>
                            </div>
                        ))}
                        {[...Array(3 - funds.length)].map((_, i) => <div key={i} className="hidden md:block"></div>)}
                    </div>

                </div>
            </div>
        </div>
    );
}

function ComparisonRow({ label, funds, render }: { label: string, funds: any[], render: (f: any) => React.ReactNode }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="font-medium text-gray-500 text-sm flex items-center">{label}</div>
            {funds.map(fund => (
                <div key={fund.id} className="text-gray-900 text-sm flex items-center">
                    <span className="md:hidden font-medium text-gray-500 mr-2">{label}:</span>
                    {render(fund)}
                </div>
            ))}
            {[...Array(3 - funds.length)].map((_, i) => <div key={i} className="hidden md:block"></div>)}
        </div>
    );
}
