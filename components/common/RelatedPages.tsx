import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getGroupedRelatedLinks } from '@/lib/linking/internal-links';
import {
    CreditCard,
    BookOpen,
    IndianRupee,
    LayoutGrid,
    Wrench,
    GitCompareArrows,
    ArrowRight,
} from 'lucide-react';

interface RelatedPagesProps {
    currentSlug: string;
    category: string;
    maxLinks?: number;
}

const GROUP_ICONS: Record<string, typeof CreditCard> = {
    'Related Cards': CreditCard,
    'Categories': LayoutGrid,
    'Salary Brackets': IndianRupee,
    'Guides': BookOpen,
    'Tools': Wrench,
    'Comparisons': GitCompareArrows,
};

/**
 * RelatedPages — server-compatible component that displays contextual
 * internal links grouped by type. Used on credit card pages, guides,
 * and listing pages to improve crawlability and topical authority.
 */
export default function RelatedPages({
    currentSlug,
    category,
    maxLinks = 6,
}: RelatedPagesProps) {
    const grouped = getGroupedRelatedLinks(currentSlug, category, maxLinks);
    const groupEntries = Object.entries(grouped);

    if (groupEntries.length === 0) {
        return null;
    }

    return (
        <section
            className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800"
            aria-label="Related pages"
        >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Explore More
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupEntries.map(([groupLabel, links]) => {
                    const Icon = GROUP_ICONS[groupLabel] || CreditCard;

                    return links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded-xl"
                        >
                            <Card
                                className={cn(
                                    'h-full border border-slate-200 dark:border-slate-700',
                                    'transition-all duration-200',
                                    'hover:border-green-300 dark:hover:border-green-700',
                                    'hover:shadow-md',
                                    'group-focus-visible:border-green-500',
                                )}
                            >
                                <CardContent className="p-4 flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={cn(
                                                'flex items-center justify-center w-7 h-7 rounded-md',
                                                'bg-green-50 dark:bg-green-900/30',
                                                'text-green-700 dark:text-green-400',
                                            )}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </span>
                                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                            {groupLabel}
                                        </span>
                                    </div>

                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors leading-snug">
                                        {link.title}
                                    </h3>

                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                        {link.description}
                                    </p>

                                    <span className="mt-auto flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        View
                                        <ArrowRight className="w-3 h-3" />
                                    </span>
                                </CardContent>
                            </Card>
                        </Link>
                    ));
                })}
            </div>
        </section>
    );
}
