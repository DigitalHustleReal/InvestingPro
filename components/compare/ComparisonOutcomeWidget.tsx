"use client";

import { Crown, CheckCircle2, TrendingUp, IndianRupee, Plane } from "lucide-react";
import { RichProduct } from "@/types/rich-product";

interface ComparisonOutcomeWidgetProps {
    products: RichProduct[];
}

export default function ComparisonOutcomeWidget({ products }: ComparisonOutcomeWidgetProps) {
    // Only show "Head-to-Head" winner if exactly 2 products
    if (products.length !== 2) return null;

    const [p1, p2] = products;

    // Helper to extract numeric values safely
    const getFee = (p: RichProduct) => {
        const fee = p.specs?.annualFee ?? p.specs?.annual_fee ?? 0;
        return typeof fee === 'number' ? fee : parseInt(String(fee).replace(/[^0-9]/g, '') || '0');
    };
    // Reward Rate is often a string description "4%". We need a proxy or manual rating. 
    // Using 'rating' as proxy for "Quality" if reward rate parsing is hard.
    // Or check rewardRate string? 
    // Let's use 'rating.overall' used in RichProduct (which maps to card.rating)
    const p1Rating = p1.rating?.overall || 0;
    const p2Rating = p2.rating?.overall || 0;

    const p1Fee = getFee(p1);
    const p2Fee = getFee(p2);

    // Determine Winners
    const feeWinner = p1Fee < p2Fee ? p1 : (p2Fee < p1Fee ? p2 : null);
    const ratingWinner = p1Rating > p2Rating ? p1 : (p2Rating > p1Rating ? p2 : null);
    
    // Overall Winner Logic: High Rating > Low Fee (usually)
    // If rating diff is > 0.2, rating wins. Else lower fee wins.
    const overallWinner = 
        Math.abs(p1Rating - p2Rating) >= 0.2 
        ? ratingWinner 
        : (feeWinner || p1); // Default to p1 if tie

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-lg mb-8">
            <div className="bg-primary-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Crown className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                   <h3 className="font-bold text-lg">Quick Verdict: {overallWinner?.name} Wins</h3>
                </div>
                <div className="text-sm font-medium opacity-90 hidden sm:block">
                    Based on features & fees
                </div>
            </div>
            
            <div className="p-6 grid md:grid-cols-2 gap-8 relative">
                {/* Visual Separator */}
                <div className="absolute left-1/2 top-4 bottom-4 w-px bg-gray-100 dark:bg-gray-800 hidden md:block"></div>

                {/* Winner 1 Breakdown */}
                <div>
                   <div className="flex items-center gap-3 mb-4">
                       {/* Image placeholder or Provider Logo */}
                       <div className="bg-gray-100 dark:bg-gray-800 w-12 h-8 rounded flex items-center justify-center text-xs font-bold text-gray-500">
                          {p1.provider_name?.substring(0,3)}
                       </div>
                       <h4 className={`font-bold text-lg ${overallWinner?.id === p1.id ? 'text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>
                           {p1.name} {overallWinner?.id === p1.id && '(Winner)'}
                       </h4>
                   </div>
                   
                   <ul className="space-y-3">
                       {p1.id === feeWinner?.id && (
                           <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                               <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                               Lower Annual Fee (<span className="font-semibold">₹{p1Fee}</span>)
                           </li>
                       )}
                       {p1.id === ratingWinner?.id && (
                           <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                               <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                               Higher Rated ({p1Rating}/5)
                           </li>
                       )}
                       {/* Mock Attribute: Lounge */}
                       <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                           <Plane className="w-4 h-4 text-blue-500" />
                           {(p1 as any).loungeAccess || p1.specs?.lounge_access || 'Lounge info'}
                       </li>
                   </ul>
                </div>

                {/* Winner 2 Breakdown */}
                <div>
                   <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gray-100 dark:bg-gray-800 w-12 h-8 rounded flex items-center justify-center text-xs font-bold text-gray-500">
                          {p2.provider_name?.substring(0,3)}
                       </div>
                       <h4 className={`font-bold text-lg ${overallWinner?.id === p2.id ? 'text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>
                           {p2.name} {overallWinner?.id === p2.id && '(Winner)'}
                       </h4>
                   </div>

                   <ul className="space-y-3">
                       {p2.id === feeWinner?.id && (
                           <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                               <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                               Lower Annual Fee (<span className="font-semibold">₹{p2Fee}</span>)
                           </li>
                       )}
                       {p2.id === ratingWinner?.id && (
                           <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                               <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                               Higher Rated ({p2Rating}/5)
                           </li>
                       )}
                       <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                           <Plane className="w-4 h-4 text-blue-500" />
                           {(p2 as any).loungeAccess || p2.specs?.lounge_access || 'Lounge info'}
                       </li>
                   </ul>
                </div>
            </div>

            {/* Final Call */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-t border-gray-200 dark:border-gray-800 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Our Pick:</strong> Choose <span className="text-gray-900 dark:text-white font-bold">{overallWinner?.name}</span> if you spend over ₹20k/month. 
                    Choose <span className="text-gray-900 dark:text-white font-bold">{overallWinner?.id === p1.id ? p2.name : p1.name}</span> for lower maintenance.
                </p>
            </div>
        </div>
    );
}
