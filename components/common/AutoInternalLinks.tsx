"use client";

import React from 'react';
import Link from 'next/link';
import { use } from 'react';
import { generateInternalLinks, LinkingContext } from '@/lib/linking/engine';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calculator, BookOpen, TrendingUp, Layers } from 'lucide-react';

interface AutoInternalLinksProps {
    context: LinkingContext;
}

/**
 * Automated Internal Links Component
 * 
 * Automatically generates and displays internal links based on deterministic rules
 * No manual linking required
 */
export default function AutoInternalLinks({ context }: AutoInternalLinksProps) {
    // Wrap in try-catch to prevent crashes from async errors
    let links: any[] = [];
    try {
        const linksPromise = React.useMemo(() => generateInternalLinks(context), [context]);
        links = use(linksPromise);
    } catch (error) {
        // Silently fail - internal links are optional
        console.warn('AutoInternalLinks: Failed to generate links', error);
        return null;
    }

    if (!links || links.length === 0) {
        return null;
    }

    // Group links by type
    const groupedLinks = links.reduce((acc, link) => {
        if (!acc[link.type]) {
            acc[link.type] = [];
        }
        acc[link.type].push(link);
        return acc;
    }, {} as Record<string, typeof links>);

    const typeIcons = {
        pillar: TrendingUp,
        calculator: Calculator,
        explainer: FileText,
        glossary: BookOpen,
        subcategory: Layers,
    };

    const typeLabels = {
        pillar: 'Related Guides',
        calculator: 'Calculators',
        explainer: 'Related Articles',
        glossary: 'Glossary Terms',
        subcategory: 'Subcategories',
    };

    return (
        <div className="space-y-6 mt-12 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">Related Content</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(groupedLinks).map(([type, typeLinks]) => {
                    const Icon = typeIcons[type as keyof typeof typeIcons] || FileText;
                    const label = typeLabels[type as keyof typeof typeLabels] || 'Related';

                    return (
                        <Card key={type} className="border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Icon className="w-5 h-5 text-teal-600" />
                                    <h3 className="font-bold text-slate-900">{label}</h3>
                                </div>
                                <ul className="space-y-2">
                                    {typeLinks.map((link, idx) => (
                                        <li key={idx}>
                                            <Link
                                                href={link.url}
                                                className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center gap-2 group"
                                            >
                                                <span className="group-hover:underline">{link.text}</span>
                                                <Badge 
                                                    variant="outline" 
                                                    className="text-xs border-teal-200 text-teal-600"
                                                >
                                                    {type}
                                                </Badge>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

