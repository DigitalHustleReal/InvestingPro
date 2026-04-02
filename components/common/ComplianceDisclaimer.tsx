"use client";

import React from 'react';
import { AlertTriangle, Shield, Info } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ComplianceDisclaimerProps {
    variant?: 'compact' | 'full' | 'inline';
    className?: string;
    showIcon?: boolean;
}

/**
 * Compliance Disclaimer Component
 * Displays SEBI and regulatory disclaimers
 * Required on all product pages for legal compliance
 */
export default function ComplianceDisclaimer({
    variant = 'compact',
    className,
    showIcon = true
}: ComplianceDisclaimerProps) {
    const baseStyles = "text-xs text-gray-600 dark:text-gray-400 leading-relaxed";
    
    if (variant === 'inline') {
        return (
            <p className={cn(baseStyles, className)}>
                <strong className="text-gray-800 dark:text-gray-300">Not SEBI registered.</strong> Decision support only. Educational purpose. 
                <Link href="/disclaimer" className="text-primary-600 dark:text-primary-400 hover:underline ml-1">
                    Full disclaimer
                </Link>
            </p>
        );
    }

    if (variant === 'compact') {
        return (
            <div className={cn("bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-4", className)}>
                <div className="flex items-start gap-3">
                    {showIcon && (
                        <AlertTriangle className="w-4 h-4 text-warning-500 mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1 space-y-2">
                        <p className={cn(baseStyles)}>
                            <strong className="text-gray-800 dark:text-gray-300">Important:</strong> InvestingPro.in is <strong>NOT a SEBI registered investment advisor</strong>. 
                            We provide decision support and educational content only. All financial decisions are made at your own risk.
                        </p>
                        <p className={cn(baseStyles)}>
                            <strong>Fair Use:</strong> Brand names/logos are property of their owners, used here for comparison under Fair Use.
                        </p>
                        <p className={cn(baseStyles)}>
                            <strong>AI Logic:</strong> "Smart Advisor" recommendations are simulated algorithmic suggestions, not personalized advice.
                        </p>
                        <p className={cn(baseStyles)}>
                            Please consult a SEBI-registered investment advisor before making any financial decisions.
                        </p>
                        <Link 
                            href="/disclaimer" 
                            className="text-primary-600 dark:text-primary-400 hover:underline text-xs font-medium inline-flex items-center gap-1"
                        >
                            Read full disclaimer
                            <Info className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Full variant
    return (
        <div className={cn("bg-gray-50 dark:bg-gray-900/50 border-2 border-warning-200 dark:border-warning-800 rounded-xl p-6", className)}>
            <div className="flex items-start gap-4">
                {showIcon && (
                    <div className="p-2 bg-warning-100 dark:bg-warning-900/30 rounded-lg shrink-0">
                        <Shield className="w-5 h-5 text-warning-600 dark:text-warning-400" />
                    </div>
                )}
                <div className="flex-1 space-y-3">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-warning-500" />
                        Compliance & Regulatory Disclaimer
                    </h4>
                    <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        <p>
                            <strong className="text-gray-800 dark:text-gray-300">Not SEBI Registered:</strong> InvestingPro.in is <strong>NOT</strong> a SEBI registered investment advisor (RIA), financial advisor, or stockbroker. We are an independent research, education, and discovery platform.
                        </p>
                        <p>
                            <strong className="text-gray-800 dark:text-gray-300">Decision Support Only:</strong> Our content, tools, calculators, and product comparisons are provided for informational and educational purposes only. They are designed to help you make informed decisions, not to provide personalized investment advice.
                        </p>
                        <p>
                            <strong className="text-gray-800 dark:text-gray-300">Educational Purpose:</strong> All information on this platform is for research, education, and discovery purposes. Nothing on this website constitutes a recommendation to buy, sell, or hold any security, financial product, or investment.
                        </p>
                        <p>
                            <strong className="text-gray-800 dark:text-gray-300">Your Responsibility:</strong> All financial decisions are made at your own risk. Past performance does not guarantee future results. You should conduct your own research and consult with a qualified, SEBI-registered financial advisor before making any investment decisions.
                        </p>
                    </div>
                    <Link 
                        href="/disclaimer" 
                        className="text-primary-600 dark:text-primary-400 hover:underline text-xs font-semibold inline-flex items-center gap-1 mt-3"
                    >
                        Read complete terms of service and disclaimer
                        <Info className="w-3 h-3" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
