"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import SmartCTA from './SmartCTA';
import { TrendingUp, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AffiliateLink {
    id: string;
    name: string;
    short_code: string;
    partner: {
        name: string;
        logo_url?: string;
        category: string;
    };
}

interface ContextualCTAProps {
    category: string;
    articleId?: string;
    placement?: 'inline' | 'sidebar' | 'end';
    className?: string;
}

export default function ContextualCTA({
    category,
    articleId,
    placement = 'inline',
    className
}: ContextualCTAProps) {
    const { data, isLoading } = useQuery({
        queryKey: ['contextual-cta', category],
        queryFn: async () => {
            const response = await fetch(`/api/admin/affiliates?type=contextual&category=${category}&limit=2`);
            if (!response.ok) return { links: [] };
            return response.json();
        },
        staleTime: 5 * 60 * 1000 // 5 minutes
    });

    if (isLoading || !data?.links || data.links.length === 0) {
        return null;
    }

    const links: AffiliateLink[] = data.links;

    // Different layouts based on placement
    if (placement === 'sidebar') {
        return (
            <div className={cn("space-y-4", className)}>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-primary-400" />
                    Recommended
                </h4>
                {links.map(link => (
                    <Card key={link.id} className="bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/5 hover:border-primary-500/30 transition-all">
                        <CardContent className="p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-3">
                                {link.partner.logo_url ? (
                                    <img src={link.partner.logo_url} alt={link.partner.name} className="w-8 h-8 rounded" />
                                ) : (
                                    <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
                                        <TrendingUp className="w-4 h-4 text-primary-400" />
                                    </div>
                                )}
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">{link.partner.name}</span>
                            </div>
                            <SmartCTA
                                variant="primary"
                                size="sm"
                                href={`/go/${link.short_code}${articleId ? `?article=${articleId}` : ''}`}
                                label={link.name}
                                icon="arrow"
                                isExternal
                                fullWidth
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (placement === 'end') {
        return (
            <Card className={cn(
                "bg-gradient-to-br from-primary-500/5 via-secondary-500/5 to-pink-500/5 border-primary-500/20",
                className
            )}>
                <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-primary-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Ready to Get Started?</h4>
                            <p className="text-sm text-slate-500">Choose from our trusted partners</p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {links.map(link => (
                            <a
                                key={link.id}
                                href={`/go/${link.short_code}${articleId ? `?article=${articleId}` : ''}`}
                                target="_blank"
                                rel="noopener noreferrer sponsored"
                                className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-primary-500/30 hover:shadow-lg transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    {link.partner.logo_url ? (
                                        <img src={link.partner.logo_url} alt={link.partner.name} className="w-10 h-10 rounded" />
                                    ) : (
                                        <div className="w-10 h-10 rounded bg-primary-500/10 flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-primary-400" />
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-semibold text-slate-900 dark:text-white">{link.partner.name}</div>
                                        <div className="text-xs text-slate-500">{link.name}</div>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                            </a>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Inline placement (default)
    return (
        <div className={cn(
            "my-8 p-6 rounded-2xl bg-gradient-to-r from-teal-500/5 to-primary-500/5 border border-teal-500/10",
            className
        )}>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-teal-500" />
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Partner Recommendation</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                        Start investing with {links[0]?.partner.name}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {links[0]?.name}
                    </p>
                </div>
                <SmartCTA
                    variant="gradient"
                    size="md"
                    href={`/go/${links[0]?.short_code}${articleId ? `?article=${articleId}` : ''}`}
                    label="Get Started"
                    icon="arrow"
                    isExternal
                />
            </div>
        </div>
    );
}
