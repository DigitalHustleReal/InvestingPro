"use client";

import React from 'react';
import { Info, Shield, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DisclosureBlockProps {
    type?: 'affiliate' | 'ad' | 'sponsored' | 'general';
    position?: 'top' | 'bottom' | 'inline';
    compact?: boolean;
}

/**
 * Clear Disclosure Block Component
 * 
 * Displays transparent disclosure about monetization
 * Required by FTC and trust best practices
 */
export default function DisclosureBlock({
    type = 'affiliate',
    position = 'bottom',
    compact = false
}: DisclosureBlockProps) {
    const disclosures = {
        affiliate: {
            title: 'Affiliate Disclosure',
            content: 'InvestingPro.in may earn a commission when you apply for financial products through our affiliate links. This commission does not affect our editorial independence, product rankings, or the information we provide. We only recommend products we believe are valuable for our readers.',
            icon: ExternalLink,
        },
        ad: {
            title: 'Advertising Disclosure',
            content: 'InvestingPro.in displays advertisements from trusted partners. These ads are clearly marked and do not influence our editorial content, product comparisons, or rankings. We maintain strict editorial independence.',
            icon: Info,
        },
        sponsored: {
            title: 'Sponsored Content Disclosure',
            content: 'Some content on InvestingPro.in may be sponsored by partners. Sponsored content is clearly labeled and does not affect our independent research, product rankings, or editorial recommendations.',
            icon: Shield,
        },
        general: {
            title: 'Transparency Disclosure',
            content: 'InvestingPro.in is an independent research and education platform. We may earn commissions from affiliate links and display advertisements, but these never influence our editorial content, product rankings, or recommendations.',
            icon: Shield,
        },
    };

    const disclosure = disclosures[type];
    const Icon = disclosure.icon;

    if (compact) {
        return (
            <div className="text-xs text-slate-600 border-t border-slate-200 pt-4 mt-6">
                <div className="flex items-start gap-2">
                    <Icon className="w-3 h-3 mt-0.5 text-slate-400 shrink-0" />
                    <p>
                        <strong className="font-semibold text-slate-700">{disclosure.title}:</strong>{' '}
                        {disclosure.content}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Card className={`border-slate-200 bg-slate-50 ${position === 'top' ? 'mb-6' : 'mt-6'}`}>
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-slate-900 mb-2 text-sm">
                            {disclosure.title}
                        </h3>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            {disclosure.content}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

