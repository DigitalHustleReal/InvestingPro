"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ExternalLink, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface BrokenLink {
    link: {
        url: string;
        anchorText: string;
        type: 'internal' | 'external';
        articleId: string;
    };
    statusCode?: number;
    error: string;
    lastChecked: string;
    severity: 'critical' | 'warning';
    canRepair: boolean;
    repairSuggestion?: string;
}

interface BrokenLinkReportProps {
    articleId: string;
}

/**
 * Broken Link Report Component
 * 
 * Shows broken links in an article and allows:
 * - Checking all links
 * - Auto-repairing internal links
 * - Viewing broken link details
 */
export default function BrokenLinkReport({ articleId }: BrokenLinkReportProps) {
    const [brokenLinks, setBrokenLinks] = useState<BrokenLink[]>([]);
    const [checking, setChecking] = useState(false);
    const [repairing, setRepairing] = useState(false);
    const [lastChecked, setLastChecked] = useState<string | null>(null);

    const checkLinks = async () => {
        if (!articleId) return;

        setChecking(true);
        try {
            const response = await fetch(`/api/admin/articles/${articleId}/links/check`);
            if (!response.ok) {
                throw new Error('Failed to check links');
            }

            const data = await response.json();
            setBrokenLinks(data.brokenLinks || []);
            setLastChecked(new Date().toISOString());
            
            if (data.totalBroken === 0) {
                toast.success('All links are working!');
            } else {
                toast.warning(`Found ${data.totalBroken} broken link(s)`);
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to check links');
        } finally {
            setChecking(false);
        }
    };

    const repairLinks = async () => {
        if (!articleId) return;

        setRepairing(true);
        try {
            const response = await fetch(`/api/admin/articles/${articleId}/links/repair`, {
                method: 'POST'
            });
            
            if (!response.ok) {
                throw new Error('Failed to repair links');
            }

            const data = await response.json();
            
            if (data.repaired > 0) {
                toast.success(`Repaired ${data.repaired} link(s)`);
                // Re-check links after repair
                await checkLinks();
            } else {
                toast.info('No repairable links found');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to repair links');
        } finally {
            setRepairing(false);
        }
    };

    const internalBroken = brokenLinks.filter(l => l.link.type === 'internal').length;
    const externalBroken = brokenLinks.filter(l => l.link.type === 'external').length;
    const repairable = brokenLinks.filter(l => l.canRepair).length;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-wt-text-muted dark:text-wt-text-muted uppercase tracking-wider flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Link Health
                </h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={checkLinks}
                    disabled={checking || !articleId}
                    className="h-7 text-xs"
                >
                    <RefreshCw className={`w-3 h-3 mr-1 ${checking ? 'animate-spin' : ''}`} />
                    Check Links
                </Button>
            </div>

            {lastChecked && (
                <p className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70 dark:text-wt-text-muted dark:text-wt-text-muted">
                    Last checked: {new Date(lastChecked).toLocaleString('en-IN')}
                </p>
            )}

            {brokenLinks.length === 0 && lastChecked && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                            All links are working!
                        </p>
                    </div>
                </div>
            )}

            {brokenLinks.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-warning-600 dark:text-warning-400" />
                        <span className="text-sm font-semibold text-wt-text dark:text-wt-text/95 dark:text-wt-text/95">
                            {brokenLinks.length} Broken Link{brokenLinks.length !== 1 ? 's' : ''}
                        </span>
                        {repairable > 0 && (
                            <Badge variant="outline" className="text-xs">
                                {repairable} repairable
                            </Badge>
                        )}
                    </div>

                    {repairable > 0 && (
                        <Button
                            onClick={repairLinks}
                            disabled={repairing}
                            className="w-full bg-wt-gold hover:bg-wt-gold-hover text-wt-text dark:text-wt-text text-sm"
                        >
                            {repairing ? 'Repairing...' : `Auto-Repair ${repairable} Link(s)`}
                        </Button>
                    )}

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {brokenLinks.map((brokenLink, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border ${
                                    brokenLink.severity === 'critical'
                                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                        : 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${
                                                    brokenLink.link.type === 'internal'
                                                        ? 'border-wt-border-light text-wt-gold'
                                                        : 'border-wt-border text-wt-text'
                                                }`}
                                            >
                                                {brokenLink.link.type === 'internal' ? 'Internal' : 'External'}
                                            </Badge>
                                            {brokenLink.severity === 'critical' && (
                                                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                            )}
                                        </div>
                                        <p className="text-sm font-semibold text-wt-text dark:text-wt-text/95 dark:text-wt-text/95 truncate">
                                            {brokenLink.link.anchorText || brokenLink.link.url}
                                        </p>
                                        <p className="text-xs text-wt-text-muted/50 dark:text-wt-text-muted/50 dark:text-wt-text-muted dark:text-wt-text-muted truncate mt-1">
                                            {brokenLink.link.url}
                                        </p>
                                        <p className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70 dark:text-wt-text-muted/70 dark:text-wt-text-muted/70 mt-1">
                                            Error: {brokenLink.error}
                                            {brokenLink.statusCode && ` (HTTP ${brokenLink.statusCode})`}
                                        </p>
                                        {brokenLink.repairSuggestion && (
                                            <p className="text-xs text-wt-gold dark:text-wt-gold mt-1">
                                                💡 {brokenLink.repairSuggestion}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70 dark:text-wt-text-muted dark:text-wt-text-muted space-y-1">
                        <p>
                            Internal: {internalBroken} broken | External: {externalBroken} broken
                        </p>
                        <p>
                            External links cannot be auto-repaired and may need manual review.
                        </p>
                    </div>
                </div>
            )}

            {!lastChecked && (
                <p className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70 dark:text-wt-text-muted dark:text-wt-text-muted">
                    Click "Check Links" to scan for broken links in this article.
                </p>
            )}
        </div>
    );
}
