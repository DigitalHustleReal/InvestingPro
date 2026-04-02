"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ExternalLink, Loader2, Shield, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import DecisionCTA from '@/components/common/DecisionCTA';

interface ApplicationFlowProps {
    productId: string;
    productName: string;
    productType: 'credit_card' | 'mutual_fund' | 'loan' | 'insurance';
    affiliateLink: string;
    isOpen: boolean;
    onClose: () => void;
    onConversion?: (event: { type: string; productId?: string }) => void;
}

/**
 * Instant Application Flow Component
 * 
 * Provides a one-click application flow with:
 * - Affiliate tracking
 * - Conversion tracking
 * - Trust signals
 * - Decision-focused messaging
 */
export default function ApplicationFlow({
    productId,
    productName,
    productType,
    affiliateLink,
    isOpen,
    onClose,
    onConversion
}: ApplicationFlowProps) {
    const [step, setStep] = useState<'ready' | 'redirecting' | 'complete'>('ready');
    const [hasClicked, setHasClicked] = useState(false);

    const handleApply = () => {
        setHasClicked(true);
        setStep('redirecting');
        
        // Track conversion
        if (onConversion) {
            onConversion({
                type: 'application_started',
                productId
            });
        }

        // Track client-side analytics if available
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'application_started', {
                product_id: productId,
                product_type: productType,
                product_name: productName
            });
        }

        // Redirect after brief delay to show feedback
        setTimeout(() => {
            window.open(affiliateLink, '_blank', 'noopener,noreferrer');
            setStep('complete');
            
            // Auto-close after 2 seconds
            setTimeout(() => {
                onClose();
                setStep('ready');
                setHasClicked(false);
            }, 2000);
        }, 500);
    };

    const getProductTypeLabel = () => {
        switch (productType) {
            case 'credit_card': return 'Credit Card';
            case 'mutual_fund': return 'Mutual Fund';
            case 'loan': return 'Loan';
            case 'insurance': return 'Insurance';
            default: return 'Product';
        }
    };

    const getCtaText = () => {
        switch (productType) {
            case 'credit_card': return 'Apply Instantly';
            case 'mutual_fund': return 'Start SIP Now';
            case 'loan': return 'Check Eligibility';
            case 'insurance': return 'Get Protected';
            default: return 'Apply Now';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                        Apply for {productName}
                    </DialogTitle>
                </DialogHeader>

                {step === 'ready' && (
                    <div className="space-y-6 py-4">
                        {/* Trust Signals */}
                        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 border border-primary-200 dark:border-primary-800">
                            <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                        Secure Application Process
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        You'll be redirected to the official {getProductTypeLabel().toLowerCase()} provider's website. 
                                        Your application is secure and protected.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* What Happens Next */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-slate-900 dark:text-white">What happens next:</h4>
                            <ul className="space-y-2">
                                {[
                                    "You'll be redirected to the official application page",
                                    "Complete the application form on their website",
                                    "Get instant approval (if eligible)",
                                    "Receive confirmation via email/SMS"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 shrink-0" />
                                        <span className="text-slate-700 dark:text-slate-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* CTA */}
                        <div className="pt-4">
                            <DecisionCTA
                                text={getCtaText()}
                                href={affiliateLink}
                                productId={productId}
                                variant="primary"
                                size="lg"
                                className="w-full h-14 text-lg font-bold"
                                isExternal={true}
                                showIcon={true}
                                onConversion={onConversion}
                            />
                        </div>

                        {/* Disclaimer */}
                        <p className="text-xs text-slate-500 dark:text-slate-600 text-center">
                            By clicking "{getCtaText()}", you'll be redirected to the official provider's website. 
                            InvestingPro earns a commission if you complete the application.
                        </p>
                    </div>
                )}

                {step === 'redirecting' && (
                    <div className="py-12 text-center">
                        <Loader2 className="w-12 h-12 text-primary-600 dark:text-primary-400 animate-spin mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            Redirecting You...
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Opening the official application page in a new tab.
                        </p>
                    </div>
                )}

                {step === 'complete' && (
                    <div className="py-12 text-center">
                        <CheckCircle2 className="w-16 h-16 text-success-600 dark:text-success-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            Application Page Opened
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Complete your application on the official provider's website.
                        </p>
                        <Button onClick={onClose} variant="outline">
                            Close
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
