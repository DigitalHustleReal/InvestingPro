"use client";

import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';

/**
 * Citation System Components
 * 
 * Provides inline citation markers and citation list display
 * to improve content trustworthiness and E-E-A-T signals.
 */

export interface Citation {
    id: number;
    title: string;
    url: string;
    source: string;
    accessDate?: string;
    type?: 'website' | 'pdf' | 'article' | 'report';
}

interface CitationMarkerProps {
    citationId: number;
    onClick?: () => void;
}

/**
 * Inline Citation Marker [1]
 * 
 * Usage: <CitationMarker citationId={1} />
 */
export function CitationMarker({ citationId, onClick }: CitationMarkerProps) {
    return (
        <sup className="citation-marker">
            <button
                onClick={onClick}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-xs ml-0.5 cursor-pointer"
                aria-label={`View citation ${citationId}`}
            >
                [{citationId}]
            </button>
        </sup>
    );
}

interface CitationListProps {
    citations: Citation[];
    title?: string;
    className?: string;
}

/**
 * Citation List Component
 * 
 * Displays all citations at the end of content
 * 
 * Usage:
 * <CitationList citations={[
 *   { id: 1, title: "RBI Guidelines", url: "...", source: "Reserve Bank of India" }
 * ]} />
 */
export function CitationList({ citations, title = "Sources & Citations", className = "" }: CitationListProps) {
    if (!citations || citations.length === 0) {
        return null;
    }

    return (
        <div className={`citations-list border-t border-slate-200 dark:border-slate-800 pt-8 mt-12 ${className}`}>
            <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {title}
                </h3>
            </div>
            
            <ol className="space-y-4">
                {citations.map((citation) => (
                    <li
                        key={citation.id}
                        id={`citation-${citation.id}`}
                        className="text-sm text-slate-700 dark:text-slate-300 scroll-mt-20"
                    >
                        <div className="flex gap-3">
                            <span className="font-semibold text-primary-600 dark:text-primary-400 shrink-0">
                                [{citation.id}]
                            </span>
                            <div className="flex-1">
                                <div className="mb-1">
                                    <span className="font-medium">{citation.title}</span>
                                    {citation.source && (
                                        <span className="text-slate-600 dark:text-slate-400">
                                            {' '}— {citation.source}
                                        </span>
                                    )}
                                </div>
                                <a
                                    href={citation.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline inline-flex items-center gap-1 break-all"
                                >
                                    {citation.url}
                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                                {citation.accessDate && (
                                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                        Accessed: {citation.accessDate}
                                    </div>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ol>
            
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Note:</strong> All sources are verified for accuracy and credibility. 
                    Citations are updated regularly to ensure information remains current.
                </p>
            </div>
        </div>
    );
}

interface SourceCardProps {
    citation: Citation;
    showNumber?: boolean;
}

/**
 * Source Card Component
 * 
 * Displays a single source in card format
 * Useful for featured sources or key references
 */
export function SourceCard({ citation, showNumber = true }: SourceCardProps) {
    const getTypeIcon = () => {
        switch (citation.type) {
            case 'pdf':
                return '📄';
            case 'article':
                return '📰';
            case 'report':
                return '📊';
            default:
                return '🌐';
        }
    };

    return (
        <div className="source-card border border-slate-200 dark:border-slate-800 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
            <div className="flex gap-3">
                {showNumber && (
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 shrink-0">
                        [{citation.id}]
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2">
                        <span className="text-xl">{getTypeIcon()}</span>
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                            {citation.title}
                        </h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {citation.source}
                    </p>
                    <a
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline inline-flex items-center gap-1"
                    >
                        View Source
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>
        </div>
    );
}

/**
 * Inline Source Attribution
 * 
 * For attributing data directly in text
 * Example: "According to RBI data <InlineSource source="RBI" />"
 */
export function InlineSource({ source, url }: { source: string; url?: string }) {
    if (url) {
        return (
            <span className="inline-source">
                (<a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                    {source}
                </a>)
            </span>
        );
    }
    
    return (
        <span className="inline-source text-slate-700 dark:text-slate-300 font-medium">
            ({source})
        </span>
    );
}
