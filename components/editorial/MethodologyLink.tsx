import React from 'react';
import { Info, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface MethodologyLinkProps {
    variant?: 'text' | 'button' | 'badge';
    className?: string;
}

export function MethodologyLink({ variant = 'text', className = '' }: MethodologyLinkProps) {
    if (variant === 'button') {
        return (
            <Link
                href="/methodology"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors ${className}`}
            >
                <Info className="w-4 h-4" />
                <span>Our Review Process</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Link>
        );
    }

    if (variant === 'badge') {
        return (
            <Link
                href="/methodology"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 hover:border-primary-300 dark:hover:border-primary-700 text-primary-700 dark:text-primary-300 text-xs font-semibold transition-colors ${className}`}
            >
                <Info className="w-3.5 h-3.5" />
                <span>Methodology</span>
            </Link>
        );
    }

    // Text variant (default)
    return (
        <Link
            href="/methodology"
            className={`inline-flex items-center gap-1.5 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors ${className}`}
        >
            <Info className="w-4 h-4" />
            <span>Our Review Process</span>
        </Link>
    );
}
