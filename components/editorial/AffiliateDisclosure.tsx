import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AffiliateDisclosureProps {
    variant?: 'inline' | 'footer' | 'product';
    compact?: boolean;
}

export function AffiliateDisclosure({ variant = 'inline', compact = false }: AffiliateDisclosureProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (variant === 'footer') {
        return (
            <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-3">
                    <Shield className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                            How We Make Money
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                            We're an independent comparison platform supported by affiliate commissions. 
                            When you apply for a product through our links, we may earn a fee.
                        </p>
                        <div className="space-y-1.5 mb-4">
                            <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <span className="text-primary-600 dark:text-primary-400 font-bold">✓</span>
                                <span>Our recommendations are NEVER influenced by commissions</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <span className="text-primary-600 dark:text-primary-400 font-bold">✓</span>
                                <span>We analyze 500+ products, only recommend the best</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <span className="text-primary-600 dark:text-primary-400 font-bold">✓</span>
                                <span>Our editorial team has ZERO access to commercial deals</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <span className="text-primary-600 dark:text-primary-400 font-bold">✓</span>
                                <span>We clearly mark 'Partner' vs 'Non-Partner' products</span>
                            </div>
                        </div>
                        <Link 
                            href="/how-we-make-money" 
                            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                        >
                            Read Full Disclosure
                            <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'product' && compact) {
        return (
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-left bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 flex-1">
                        <Shield className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white mb-1">
                                Affiliate Disclosure
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                {isExpanded 
                                    ? "We may earn a commission if you apply through our links, but this never influences our recommendations."
                                    : "We may earn a commission. Click to learn more."
                                }
                            </p>
                        </div>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    )}
                </div>
                
                {isExpanded && (
                    <div className="mt-3 pl-6 space-y-1">
                        <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                            <span className="text-primary-600">✓</span>
                            <span>Editorial independence guaranteed</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                            <span className="text-primary-600">✓</span>
                            <span>We analyze all products equally</span>
                        </div>
                        <Link 
                            href="/how-we-make-money" 
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 mt-2"
                        >
                            Full Disclosure
                            <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>
                )}
            </button>
        );
    }

    // Inline variant (default)
    return (
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 text-sm">
            <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                <div>
                    <span className="font-semibold text-primary-900 dark:text-primary-200">Disclosure: </span>
                    <span className="text-primary-800 dark:text-primary-300">
                        We may earn affiliate commissions from products on this page, but our recommendations are independent. 
                    </span>
                    <Link 
                        href="/how-we-make-money" 
                        className="text-primary-700 dark:text-primary-400 font-semibold hover:underline ml-1"
                    >
                        Learn more →
                    </Link>
                </div>
            </div>
        </div>
    );
}
