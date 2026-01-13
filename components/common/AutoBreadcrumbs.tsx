"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbs } from '@/lib/linking/breadcrumbs';

/**
 * Automated Breadcrumb Component
 * 
 * Automatically generates breadcrumbs from URL path
 * No manual configuration needed
 */
export default function AutoBreadcrumbs() {
    const pathname = usePathname();
    const breadcrumbs = generateBreadcrumbs(pathname || '/');

    if (breadcrumbs.length <= 1) {
        return null; // Don't show breadcrumbs on home page
    }

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    
                    return (
                        <li key={crumb.url} className="flex items-center gap-2">
                            {index === 0 ? (
                                <Link 
                                    href={crumb.url}
                                    className="text-slate-600 hover:text-primary-600 transition-colors"
                                    aria-label="Home"
                                >
                                    <Home className="w-4 h-4" />
                                </Link>
                            ) : (
                                <>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                    {isLast ? (
                                        <span className="text-slate-900 font-medium" aria-current="page">
                                            {crumb.label}
                                        </span>
                                    ) : (
                                        <Link 
                                            href={crumb.url}
                                            className="text-slate-600 hover:text-primary-600 transition-colors"
                                        >
                                            {crumb.label}
                                        </Link>
                                    )}
                                </>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

