/**
 * Version Comparison Component
 * 
 * Shows side-by-side comparison of two article versions
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Loader2, FileText, FileDiff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDistanceToNow } from 'date-fns';

interface VersionComparisonProps {
    articleId: string;
    version1: number;
    version2: number;
    onClose: () => void;
}

interface VersionContent {
    title: string;
    body_markdown: string;
    excerpt?: string;
    category?: string;
    tags?: string[];
    created_at: string;
}

export function VersionComparison({ articleId, version1, version2, onClose }: VersionComparisonProps) {
    const [activeTab, setActiveTab] = useState<'content' | 'metadata'>('content');

    // Fetch both versions
    const { data: version1Data, isLoading: loading1 } = useQuery<VersionContent>({
        queryKey: ['article-version', articleId, version1],
        queryFn: async () => {
            const response = await fetch(`/api/admin/articles/${articleId}/versions/${version1}`);
            if (!response.ok) throw new Error('Failed to fetch version');
            return response.json();
        },
    });

    const { data: version2Data, isLoading: loading2 } = useQuery<VersionContent>({
        queryKey: ['article-version', articleId, version2],
        queryFn: async () => {
            const response = await fetch(`/api/admin/articles/${articleId}/versions/${version2}`);
            if (!response.ok) throw new Error('Failed to fetch version');
            return response.json();
        },
    });

    const isLoading = loading1 || loading2;

    // Simple diff calculation (highlight differences)
    const getDiff = (text1: string, text2: string): { added: string[]; removed: string[] } => {
        const lines1 = text1.split('\n');
        const lines2 = text2.split('\n');
        const added: string[] = [];
        const removed: string[] = [];

        // Simple line-by-line comparison
        const maxLines = Math.max(lines1.length, lines2.length);
        for (let i = 0; i < maxLines; i++) {
            if (i >= lines1.length) {
                added.push(lines2[i]);
            } else if (i >= lines2.length) {
                removed.push(lines1[i]);
            } else if (lines1[i] !== lines2[i]) {
                removed.push(lines1[i]);
                added.push(lines2[i]);
            }
        }

        return { added, removed };
    };

    if (isLoading) {
        return (
            <div className="p-8 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400 mx-auto mb-2" />
                <p className="text-slate-400">Loading versions...</p>
            </div>
        );
    }

    if (!version1Data || !version2Data) {
        return (
            <div className="p-8 text-center text-red-500">
                <p>Failed to load versions</p>
            </div>
        );
    }

    const contentDiff = getDiff(version1Data.body_markdown || '', version2Data.body_markdown || '');

    return (
        <div className="border rounded-lg bg-white dark:bg-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                    <FileDiff className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                        Comparing Version {version1} vs Version {version2}
                    </h3>
                </div>
                <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                >
                    <X className="w-4 h-4" />
                    Close
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('content')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'content'
                            ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                >
                    <FileText className="w-4 h-4 inline mr-1" />
                    Content
                </button>
                <button
                    onClick={() => setActiveTab('metadata')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'metadata'
                            ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                >
                    Metadata
                </button>
            </div>

            {/* Comparison Content */}
            <div className="p-4">
                {activeTab === 'content' ? (
                    <div className="grid grid-cols-2 gap-4">
                        {/* Version 1 */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-slate-900 dark:text-white">
                                    Version {version1} (Older)
                                </h4>
                                <span className="text-xs text-slate-500">
                                    {formatDistanceToNow(new Date(version1Data.created_at), { addSuffix: true })}
                                </span>
                            </div>
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm">
                                <div className="font-semibold text-red-700 dark:text-red-400 mb-2">Title:</div>
                                <div className="text-slate-900 dark:text-white mb-4">{version1Data.title}</div>
                                
                                {contentDiff.removed.length > 0 && (
                                    <>
                                        <div className="font-semibold text-red-700 dark:text-red-400 mb-2">Removed:</div>
                                        <div className="space-y-1">
                                            {contentDiff.removed.map((line, idx) => (
                                                <div key={idx} className="text-red-800 dark:text-red-300 line-through">
                                                    {line}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                                
                                <div className="font-semibold text-slate-700 dark:text-slate-300 mb-2 mt-4">Content:</div>
                                <div className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                                    {version1Data.body_markdown}
                                </div>
                            </div>
                        </div>

                        {/* Version 2 */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-slate-900 dark:text-white">
                                    Version {version2} (Newer)
                                </h4>
                                <span className="text-xs text-slate-500">
                                    {formatDistanceToNow(new Date(version2Data.created_at), { addSuffix: true })}
                                </span>
                            </div>
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-sm">
                                <div className="font-semibold text-green-700 dark:text-green-400 mb-2">Title:</div>
                                <div className="text-slate-900 dark:text-white mb-4">{version2Data.title}</div>
                                
                                {contentDiff.added.length > 0 && (
                                    <>
                                        <div className="font-semibold text-green-700 dark:text-green-400 mb-2">Added:</div>
                                        <div className="space-y-1">
                                            {contentDiff.added.map((line, idx) => (
                                                <div key={idx} className="text-green-800 dark:text-green-300">
                                                    {line}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                                
                                <div className="font-semibold text-slate-700 dark:text-slate-300 mb-2 mt-4">Content:</div>
                                <div className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                                    {version2Data.body_markdown}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {/* Version 1 Metadata */}
                        <div>
                            <h4 className="font-medium text-slate-900 dark:text-white mb-3">Version {version1} Metadata</h4>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Category:</span>
                                    <span className="ml-2 text-slate-900 dark:text-white">{version1Data.category || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Tags:</span>
                                    <span className="ml-2 text-slate-900 dark:text-white">
                                        {version1Data.tags?.join(', ') || 'None'}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Excerpt:</span>
                                    <p className="mt-1 text-slate-900 dark:text-white">{version1Data.excerpt || 'No excerpt'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Version 2 Metadata */}
                        <div>
                            <h4 className="font-medium text-slate-900 dark:text-white mb-3">Version {version2} Metadata</h4>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Category:</span>
                                    <span className="ml-2 text-slate-900 dark:text-white">{version2Data.category || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Tags:</span>
                                    <span className="ml-2 text-slate-900 dark:text-white">
                                        {version2Data.tags?.join(', ') || 'None'}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Excerpt:</span>
                                    <p className="mt-1 text-slate-900 dark:text-white">{version2Data.excerpt || 'No excerpt'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
