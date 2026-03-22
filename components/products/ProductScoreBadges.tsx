"use client";

import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { 
    Plane, 
    ShoppingBag, 
    Wallet, 
    TrendingUp, 
    Shield, 
    Star,
    Zap,
    Percent,
    Clock,
    Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductScoreBadgesProps {
    category: 'credit_card' | 'loan' | 'mutual_fund' | string;
    tags: string[];
    score?: number;
    showScore?: boolean;
    size?: 'sm' | 'md' | 'lg';
    maxBadges?: number;
    className?: string;
}

// Badge styling and icons based on tag
const badgeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    // Credit Card tags
    'Best for Travel': { icon: Plane, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
    'Top for Shopping': { icon: ShoppingBag, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
    'Low Cost Gem': { icon: Wallet, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    'Lifetime Free': { icon: Zap, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
    
    // Loan tags
    'Low Interest Rate': { icon: Percent, color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
    'Minimal Fees': { icon: Wallet, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    'Flexible Tenure': { icon: Clock, color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
    'Home Buyer Choice': { icon: Award, color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
    'Quick Approval': { icon: Zap, color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
    
    // Mutual Fund tags
    'High Returns': { icon: TrendingUp, color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
    'Low Expense': { icon: Percent, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    'Top Rated': { icon: Star, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
    'Safe Bet': { icon: Shield, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
    
    // Generic
    'Best Overall': { icon: Award, color: 'text-primary-700', bg: 'bg-primary-50 border-primary-200' },
    'Best Value': { icon: Wallet, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    'Most Popular': { icon: Star, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
    "Editor's Choice": { icon: Award, color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200' },
};

const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
};

const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
};

export default function ProductScoreBadges({
    category,
    tags,
    score,
    showScore = false,
    size = 'sm',
    maxBadges = 3,
    className
}: ProductScoreBadgesProps) {
    const displayTags = useMemo(() => tags.slice(0, maxBadges), [tags, maxBadges]);

    if (displayTags.length === 0 && !showScore) return null;

    return (
        <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
            {/* Overall Score Badge (optional) */}
            {showScore && score !== undefined && (
                <Badge 
                    className={cn(
                        "font-bold border",
                        sizeClasses[size],
                        score >= 8 ? 'bg-green-50 border-green-200 text-green-700' :
                        score >= 6 ? 'bg-amber-50 border-amber-200 text-amber-700' :
                        'bg-slate-50 border-slate-200 text-slate-700'
                    )}
                >
                    <Star className={cn(iconSizes[size], 'fill-current')} />
                    {score.toFixed(1)}/10
                </Badge>
            )}

            {/* Tag Badges */}
            {displayTags.map((tag, index) => {
                const config = badgeConfig[tag] || { 
                    icon: Award, 
                    color: 'text-slate-700', 
                    bg: 'bg-slate-50 border-slate-200' 
                };
                const Icon = config.icon;

                return (
                    <Badge
                        key={index}
                        className={cn(
                            "font-semibold border transition-all hover:scale-105",
                            sizeClasses[size],
                            config.bg,
                            config.color
                        )}
                    >
                        <Icon className={iconSizes[size]} />
                        {tag}
                    </Badge>
                );
            })}
        </div>
    );
}

// Helper function to calculate product tags (can be called from server or client)
export function calculateProductTags(product: any, category: string): string[] {
    const tags: string[] = [];

    if (category === 'credit_card') {
        // Travel benefit detection
        if (product.loungeAccess && !product.loungeAccess.toLowerCase().includes('nil')) {
            tags.push('Best for Travel');
        }
        // Shopping benefit detection
        if (product.type?.toLowerCase().includes('shopping') || 
            product.rewards?.some((r: string) => r.toLowerCase().includes('shopping'))) {
            tags.push('Top for Shopping');
        }
        // Fee detection
        if (product.annualFee === 0 || 
            product.annual_fee?.toLowerCase().includes('free') ||
            product.annual_fee?.toLowerCase().includes('0')) {
            tags.push('Lifetime Free');
        }
        // Low cost
        if (product.annualFee && product.annualFee < 500) {
            tags.push('Low Cost Gem');
        }
    }

    if (category === 'loan') {
        // Interest rate detection
        const rate = product.interestRateMin || parseFloat(product.interest_rate || '15');
        if (rate < 10) {
            tags.push('Low Interest Rate');
        }
        // Processing fee detection
        const fee = product.processingFee || product.processing_fee || '';
        if (fee.includes('0') || fee.toLowerCase().includes('nil')) {
            tags.push('Minimal Fees');
        }
        // Tenure detection
        if (product.maxTenureMonths && product.maxTenureMonths >= 84) {
            tags.push('Flexible Tenure');
        }
        // Loan type
        if (product.loanType === 'home' || product.type?.toLowerCase().includes('home')) {
            tags.push('Home Buyer Choice');
        }
    }

    if (category === 'mutual_fund') {
        // Returns detection
        const returns3y = product.returns_3y || product.returns3Y || 0;
        if (returns3y >= 15) {
            tags.push('High Returns');
        }
        // Expense ratio detection
        const expense = product.expense_ratio || product.expenseRatio || 2;
        if (expense < 1) {
            tags.push('Low Expense');
        }
        // Rating detection
        const rating = product.rating || 0;
        if (rating >= 4.5) {
            tags.push('Top Rated');
        }
        // Risk detection
        const risk = (product.risk || product.riskLevel || '').toLowerCase();
        if (risk.includes('low')) {
            tags.push('Safe Bet');
        }
    }

    return tags.slice(0, 3);
}
