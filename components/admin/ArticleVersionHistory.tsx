/**
 * Article Version History Component
 * 
 * Displays version history for an article with ability to:
 * - View all versions
 * - Compare versions
 * - Rollback to previous version
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, RotateCcw, Eye, GitCompare, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import type { ArticleVersion, VersionHistory } from '@/lib/cms/version-service';
import { VersionComparison } from './VersionComparison';
import { RollbackDialog } from './RollbackDialog';

interface ArticleVersionHistoryProps {
    articleId: string;
    onVersionRestored?: () => void;
}

export default function ArticleVersionHistory({ articleId, onVersionRestored }: ArticleVersionHistoryProps) {
    const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
    const [compareVersion1, setCompareVersion1] = useState<number | null>(null);
    const [compareVersion2, setCompareVersion2] = useState<number | null>(null);
    const [showRollbackDialog, setShowRollbackDialog] = useState(false);
    const [rollbackVersion, setRollbackVersion] = useState<number | null>(null);
    const queryClient = useQueryClient();

    // Fetch version history
    const { data: versionHistory, isLoading, error, refetch } = useQuery<VersionHistory>({
        queryKey: ['article-versions', articleId],
        queryFn: async () => {
            const response = await fetch(`/api/admin/articles/${articleId}/versions`);
            if (!response.ok) {
                throw new Error('Failed to fetch version history');
            }
            return response.json();
        },
        enabled: !!articleId,
    });

    // Rollback mutation
    const rollbackMutation = useMutation({
        mutationFn: async (versionNumber: number) => {
            const response = await fetch(`/api/admin/articles/${articleId}/versions/${versionNumber}/restore`, {
                method: 'POST',
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to restore version');
            }
            return response.json();
        },
        onSuccess: () => {
            toast.success('Article restored to previous version');
            queryClient.invalidateQueries({ queryKey: ['article', articleId] });
            queryClient.invalidateQueries({ queryKey: ['article-versions', articleId] });
            setShowRollbackDialog(false);
            setRollbackVersion(null);
            onVersionRestored?.();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to restore version');
        },
    });

    const handleRollback = (versionNumber: number) => {
        setRollbackVersion(versionNumber);
        setShowRollbackDialog(true);
    };

    const handleCompare = (version1: number, version2: number) => {
        setCompareVersion1(version1);
        setCompareVersion2(version2);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400 dark:text-gray-500" />
                <span className="ml-2 text-gray-500 dark:text-gray-400">Loading version history...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-500">Failed to load version history</p>
                <Button
                    onClick={() => refetch()}
                    variant="outline"
                    className="mt-4"
                >
                    Retry
                </Button>
            </div>
        );
    }

    if (!versionHistory || versionHistory.versions.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No version history available</p>
                <p className="text-sm mt-1">Versions will be created when you save changes</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Version History</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {versionHistory.total} version{versionHistory.total !== 1 ? 's' : ''} total
                    </p>
                </div>
                {compareVersion1 && compareVersion2 && (
                    <Button
                        onClick={() => {
                            setCompareVersion1(null);
                            setCompareVersion2(null);
                        }}
                        variant="outline"
                        size="sm"
                    >
                        Close Comparison
                    </Button>
                )}
            </div>

            {/* Version Comparison View */}
            {compareVersion1 && compareVersion2 && (
                <VersionComparison
                    articleId={articleId}
                    version1={compareVersion1}
                    version2={compareVersion2}
                    onClose={() => {
                        setCompareVersion1(null);
                        setCompareVersion2(null);
                    }}
                />
            )}

            {/* Version List */}
            {!compareVersion1 && !compareVersion2 && (
                <div className="space-y-2">
                    {versionHistory.versions.map((version, index) => {
                        const isLatest = index === 0;
                        const previousVersion = versionHistory.versions[index + 1];

                        return (
                            <div
                                key={version.id}
                                className={`p-4 rounded-lg border transition-colors ${
                                    isLatest
                                        ? 'bg-wt-gold-subtle bg-wt-gold-subtle border-wt-border-light border-wt-border'
                                        : 'bg-white dark:bg-muted dark:bg-muted border-wt-border dark:border-wt-border dark:border-wt-border hover:border-wt-border dark:hover:border-wt-border/70 dark:border-wt-border/70'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                Version {version.version_number}
                                            </span>
                                            {isLatest && (
                                                <span className="px-2 py-0.5 text-xs font-medium bg-wt-gold-subtle dark:bg-primary-900 text-wt-gold text-wt-text-muted rounded">
                                                    Current
                                                </span>
                                            )}
                                            {version.content_preview?.status && (
                                                <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                                    version.content_preview.status === 'published'
                                                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                                        : 'bg-wt-card dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                }`}>
                                                    {version.content_preview.status}
                                                </span>
                                            )}
                                        </div>

                                        {version.content_preview?.title && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                {version.content_preview.title}
                                            </p>
                                        )}

                                        {version.change_summary && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                {version.change_summary}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                                            </span>
                                            {version.created_by_name && (
                                                <span>by {version.created_by_name}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        {!isLatest && previousVersion && (
                                            <Button
                                                onClick={() => handleCompare(version.version_number, previousVersion.version_number)}
                                                variant="outline"
                                                size="sm"
                                                className="gap-1"
                                            >
                                                <GitCompare className="w-3 h-3" />
                                                Compare
                                            </Button>
                                        )}
                                        {!isLatest && (
                                            <Button
                                                onClick={() => handleRollback(version.version_number)}
                                                variant="outline"
                                                size="sm"
                                                className="gap-1"
                                            >
                                                <RotateCcw className="w-3 h-3" />
                                                Restore
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => {
                                                window.open(`/admin/articles/${articleId}/versions/${version.version_number}`, '_blank');
                                            }}
                                            variant="ghost"
                                            size="sm"
                                            className="gap-1"
                                        >
                                            <Eye className="w-3 h-3" />
                                            View
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Rollback Confirmation Dialog */}
            {showRollbackDialog && rollbackVersion && (
                <RollbackDialog
                    articleId={articleId}
                    versionNumber={rollbackVersion}
                    onConfirm={() => {
                        rollbackMutation.mutate(rollbackVersion);
                    }}
                    onCancel={() => {
                        setShowRollbackDialog(false);
                        setRollbackVersion(null);
                    }}
                    isRestoring={rollbackMutation.isPending}
                />
            )}

            {/* Load More */}
            {versionHistory.has_more && (
                <div className="text-center pt-4">
                    <Button
                        onClick={() => {
                            // TODO: Implement pagination
                            refetch();
                        }}
                        variant="outline"
                        size="sm"
                    >
                        Load More Versions
                    </Button>
                </div>
            )}
        </div>
    );
}
