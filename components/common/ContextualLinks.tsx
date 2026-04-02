import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getRelatedLinks } from '@/lib/linking/internal-links';
import { ChevronRight } from 'lucide-react';

interface ContextualLinksProps {
    currentSlug: string;
    category: string;
    /** Max links to show (default 5) */
    maxLinks?: number;
    /** Optional heading override */
    heading?: string;
    className?: string;
}

/**
 * ContextualLinks — a compact sidebar-style "You might also like" component.
 * Shows 3-5 text links with arrows. Designed for use alongside main content
 * on card detail pages.
 *
 * Server-compatible. No client interactivity required.
 */
export default function ContextualLinks({
    currentSlug,
    category,
    maxLinks = 5,
    heading = 'You might also like',
    className,
}: ContextualLinksProps) {
    const links = getRelatedLinks(currentSlug, category, maxLinks);

    if (links.length === 0) {
        return null;
    }

    return (
        <nav
            className={cn(
                'rounded-xl border border-slate-200 dark:border-slate-700',
                'bg-white dark:bg-slate-900',
                'p-4',
                className,
            )}
            aria-label={heading}
        >
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                {heading}
            </h3>

            <ul className="space-y-1">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className={cn(
                                'group flex items-center gap-2 rounded-lg px-2 py-1.5',
                                'text-sm text-slate-700 dark:text-slate-300',
                                'transition-colors duration-150',
                                'hover:bg-green-50 dark:hover:bg-green-950/30',
                                'hover:text-green-700 dark:hover:text-green-400',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600',
                            )}
                        >
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-green-600 dark:group-hover:text-green-500 shrink-0 transition-colors" />
                            <span className="line-clamp-1">{link.title}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
