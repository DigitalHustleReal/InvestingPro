import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowRight, LinkIcon } from 'lucide-react';

interface InternalLink {
    href: string;
    title: string;
    description?: string;
}

interface InternalLinkBlockProps {
    links: InternalLink[];
    /** Optional heading override (default: "Related on InvestingPro") */
    heading?: string;
    className?: string;
}

/**
 * InternalLinkBlock — a subtle green-tinted callout box for embedding
 * contextual internal links within long-form content (guides, articles).
 *
 * Server-compatible. No client interactivity required.
 */
export default function InternalLinkBlock({
    links,
    heading = 'Related on InvestingPro',
    className,
}: InternalLinkBlockProps) {
    if (!links || links.length === 0) {
        return null;
    }

    return (
        <aside
            className={cn(
                'my-8 rounded-xl border border-green-200 dark:border-green-800/50',
                'bg-green-50/60 dark:bg-green-950/30',
                'px-5 py-4',
                className,
            )}
            aria-label={heading}
        >
            <div className="flex items-center gap-2 mb-3">
                <LinkIcon className="w-4 h-4 text-green-700 dark:text-green-400" />
                <span className="text-sm font-semibold text-green-800 dark:text-green-300">
                    {heading}
                </span>
            </div>

            <ul className="space-y-2">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className={cn(
                                'group flex items-start gap-2 rounded-lg px-3 py-2 -mx-1',
                                'transition-colors duration-150',
                                'hover:bg-green-100/80 dark:hover:bg-green-900/30',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600',
                            )}
                        >
                            <ArrowRight className="w-3.5 h-3.5 mt-0.5 text-green-600 dark:text-green-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                            <div>
                                <span className="text-sm font-medium text-green-800 dark:text-green-300 group-hover:text-green-900 dark:group-hover:text-green-200 transition-colors">
                                    {link.title}
                                </span>
                                {link.description && (
                                    <p className="text-xs text-green-700/70 dark:text-green-400/60 mt-0.5 leading-relaxed">
                                        {link.description}
                                    </p>
                                )}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
