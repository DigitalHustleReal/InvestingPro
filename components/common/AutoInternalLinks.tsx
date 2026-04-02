"use client";

import React, { Suspense } from 'react';
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
    // Create promise outside of try/catch to avoid React hook violations
    const linksPromise = React.useMemo(
        () => generateInternalLinks(context).catch((error) => {
            console.warn('AutoInternalLinks: Failed to generate links', error);
            return []; // Return empty array on error
        }),
        [context]
    );

    return (
        <Suspense fallback={null}>
            <LinksDisplay promise={linksPromise} />
        </Suspense>
    );
}

/**
 * Separate component to use() the promise
 * This keeps use() outside of try/catch blocks
 */
function LinksDisplay({ promise }: { promise: Promise<any[]> }) {
    // Safe to use() here - errors are handled in promise.catch() above
    const links = use(promise);

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
        <div className="space-y-6 mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Related Content</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(groupedLinks).map(([type, typeLinks]) => {
                    const Icon = typeIcons[type as keyof typeof typeIcons] || FileText;
                    const label = typeLabels[type as keyof typeof typeLabels] || 'Related';

                    return (
                        <Card key={type} className="border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Icon className="w-5 h-5 text-primary-600" />
                                    <h3 className="font-bold text-gray-900">{label}</h3>
                                </div>
                                <ul className="space-y-2">
                                    {(typeLinks as any[]).map((link: any, idx: number) => (
                                        <li key={idx}>
                                            <Link
                                                href={link.url}
                                                className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-2 group"
                                            >
                                                <span className="group-hover:underline">{link.text}</span>
                                                <Badge 
                                                    variant="outline" 
                                                    className="text-xs border-primary-200 text-primary-600"
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
