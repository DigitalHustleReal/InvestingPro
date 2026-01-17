/**
 * Rollback Confirmation Dialog
 * 
 * Confirms rollback action before restoring article to previous version
 */

"use client";

import React from 'react';
import { AlertTriangle, RotateCcw, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface RollbackDialogProps {
    articleId: string;
    versionNumber: number;
    onConfirm: () => void;
    onCancel: () => void;
    isRestoring: boolean;
}

export function RollbackDialog({
    articleId,
    versionNumber,
    onConfirm,
    onCancel,
    isRestoring
}: RollbackDialogProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full mx-4 border border-slate-200 dark:border-slate-700">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Restore Article Version
                        </h3>
                    </div>
                    <button
                        onClick={onCancel}
                        disabled={isRestoring}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Are you sure you want to restore this article to <strong>Version {versionNumber}</strong>?
                    </p>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-yellow-800 dark:text-yellow-300">
                                <p className="font-medium mb-1">This action will:</p>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li>Restore the article content to Version {versionNumber}</li>
                                    <li>Create a new version with the current content</li>
                                    <li>Preserve all version history</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        You can always restore to a different version later if needed.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
                    <Button
                        onClick={onCancel}
                        variant="outline"
                        disabled={isRestoring}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isRestoring}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white gap-2"
                    >
                        {isRestoring ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Restoring...
                            </>
                        ) : (
                            <>
                                <RotateCcw className="w-4 h-4" />
                                Restore Version
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
