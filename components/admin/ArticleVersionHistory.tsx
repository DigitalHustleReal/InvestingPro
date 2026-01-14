'use client';

/**
 * Article Version History Component
 * 
 * Displays version history and allows rollback
 */

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Clock, RotateCcw, Eye, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ArticleVersion {
    id: string;
    version_number: number;
    created_at: string;
    created_by?: string;
    created_by_name?: string;
    change_summary?: string;
    content_preview?: {
        title?: string;
        status?: string;
        updated_at?: string;
    };
}

interface VersionHistory {
    versions: ArticleVersion[];
    total: number;
    has_more: boolean;
}

interface ArticleVersionHistoryProps {
    articleId: string;
    onRollback?: () => void;
}

export default function ArticleVersionHistory({
    articleId,
    onRollback,
}: ArticleVersionHistoryProps) {
    const [history, setHistory] = useState<VersionHistory | null>(null);
    const [loading, setLoading] = useState(true);
    const [rollingBack, setRollingBack] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadVersionHistory();
    }, [articleId]);

    const loadVersionHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Using direct fetch since API client might not have this endpoint yet
            const response = await fetch(`/api/v1/articles/${articleId}/versions`);
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error?.message || 'Failed to load version history');
            }

            setHistory(result.data);
        } catch (err) {
            logger.error('Failed to load version history', err as Error);
            setError(err instanceof Error ? err.message : 'Failed to load version history');
        } finally {
            setLoading(false);
        }
    };

    const handleRollback = async (versionNumber: number) => {
        if (!confirm(`Are you sure you want to rollback to version ${versionNumber}? This will create a new version with the restored content.`)) {
            return;
        }

        try {
            setRollingBack(versionNumber);
            setError(null);

            const response = await fetch(
                `/api/v1/articles/${articleId}/rollback/${versionNumber}`,
                { method: 'POST' }
            );
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error?.message || 'Failed to rollback');
            }

            // Reload history
            await loadVersionHistory();
            
            // Notify parent
            onRollback?.();

            // Show success message
            alert(`Successfully rolled back to version ${versionNumber}`);
        } catch (err) {
            logger.error('Failed to rollback article', err as Error);
            setError(err instanceof Error ? err.message : 'Failed to rollback');
        } finally {
            setRollingBack(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <LoadingSpinner text="Loading version history..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
                <Button
                    onClick={loadVersionHistory}
                    className="mt-2"
                    variant="outline"
                    size="sm"
                >
                    Retry
                </Button>
            </div>
        );
    }

    if (!history || history.versions.length === 0) {
        return (
            <div className="p-8 text-center text-slate-500">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No version history available</p>
                <p className="text-sm mt-2">Versions will be created automatically when you edit articles</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Version History</h3>
                <span className="text-sm text-slate-500">
                    {history.total} version{history.total !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="space-y-2">
                {history.versions.map((version) => (
                    <div
                        key={version.id}
                        className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-semibold text-slate-900">
                                        Version {version.version_number}
                                    </span>
                                    {version.version_number === history.versions[0]?.version_number && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                            <CheckCircle className="w-3 h-3" />
                                            Current
                                        </span>
                                    )}
                                </div>

                                <div className="text-sm text-slate-600 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>
                                            {formatDistanceToNow(new Date(version.created_at), {
                                                addSuffix: true,
                                            })}
                                        </span>
                                    </div>

                                    {version.created_by_name && (
                                        <div>
                                            Created by: {version.created_by_name}
                                        </div>
                                    )}

                                    {version.change_summary && (
                                        <div className="mt-2 text-slate-700">
                                            {version.change_summary}
                                        </div>
                                    )}

                                    {version.content_preview && (
                                        <div className="mt-2 text-xs text-slate-500">
                                            <div>Title: {version.content_preview.title || 'N/A'}</div>
                                            <div>Status: {version.content_preview.status || 'N/A'}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                                {version.version_number !== history.versions[0]?.version_number && (
                                    <Button
                                        onClick={() => handleRollback(version.version_number)}
                                        disabled={rollingBack === version.version_number}
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2"
                                    >
                                        {rollingBack === version.version_number ? (
                                            <>
                                                <LoadingSpinner text="" className="w-4 h-4" />
                                                Rolling back...
                                            </>
                                        ) : (
                                            <>
                                                <RotateCcw className="w-4 h-4" />
                                                Rollback
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {history.has_more && (
                <div className="text-center pt-4">
                    <Button
                        onClick={loadVersionHistory}
                        variant="outline"
                        size="sm"
                    >
                        Load More
                    </Button>
                </div>
            )}
        </div>
    );
}
