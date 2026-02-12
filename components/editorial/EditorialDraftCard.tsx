"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    CheckCircle2,
    XCircle,
    Eye,
    AlertTriangle,
    Clock,
    Shield,
    ExternalLink,
    GitCompare,
    Sparkles,
    FileText
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { logger } from "@/lib/logger";

type RiskLevel = 'low' | 'medium' | 'high';

interface DraftArticle {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    category: string;
    status: string;
    ai_generated: boolean;
    ai_metadata?: any;
    created_at: string;
    updated_at: string;
    [key: string]: any;
}

interface EditorialDraftCardProps {
    draft: DraftArticle & { risk: RiskLevel };
    selected: boolean;
    onSelect: () => void;
    onViewDiff: () => void;
}

export default function EditorialDraftCard({
    draft,
    selected,
    onSelect,
    onViewDiff
}: EditorialDraftCardProps) {
    const queryClient = useQueryClient();

    const approveMutation = useMutation({
        mutationFn: async () => {
            await api.entities.Article.update(draft.id, {
                status: 'published',
                human_reviewed: true,
                reviewed_at: new Date().toISOString(),
                published_at: new Date().toISOString(),
                ai_metadata: {
                    ...draft.ai_metadata,
                    review_status: 'approved',
                    change_log: [
                        ...(draft.ai_metadata?.change_log || []),
                        {
                            timestamp: new Date().toISOString(),
                            change_type: 'approved',
                            changed_by: 'editor',
                            changes: ['Approved and published']
                        }
                    ]
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['editorial-drafts'] });
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            logger.info('Article approved', { id: draft.id, title: draft.title });
        }
    });

    const rejectMutation = useMutation({
        mutationFn: async () => {
            await api.entities.Article.update(draft.id, {
                status: 'archived',
                human_reviewed: true,
                reviewed_at: new Date().toISOString(),
                ai_metadata: {
                    ...draft.ai_metadata,
                    review_status: 'rejected',
                    change_log: [
                        ...(draft.ai_metadata?.change_log || []),
                        {
                            timestamp: new Date().toISOString(),
                            change_type: 'rejected',
                            changed_by: 'editor',
                            changes: ['Rejected by editor']
                        }
                    ]
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['editorial-drafts'] });
            logger.info('Article rejected', { id: draft.id, title: draft.title });
        }
    });

    const handleApprove = () => {
        if (confirm(`Approve and publish "${draft.title}"?`)) {
            approveMutation.mutate();
        }
    };

    const handleReject = () => {
        if (confirm(`Reject "${draft.title}"?`)) {
            rejectMutation.mutate();
        }
    };

    const riskColors = {
        high: 'bg-danger-100 text-danger-700 border-danger-300',
        medium: 'bg-accent-100 text-accent-700 border-accent-300',
        low: 'bg-primary-100 text-primary-700 border-primary-300'
    };

    const confidence = draft.ai_metadata?.confidence?.overall || 0;
    const dataSources = draft.ai_metadata?.data_sources || [];
    const forbiddenPhrases = draft.ai_metadata?.forbidden_phrases_found || [];
    const timeAgo = getTimeAgo(new Date(draft.created_at));

    return (
        <Card className={`border-2 transition-all ${selected ? 'border-primary-500 bg-primary-50/30' : 'border-slate-200'}`}>
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div className="pt-1">
                        <Checkbox
                            checked={selected}
                            onCheckedChange={onSelect}
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-slate-900 truncate">
                                        {draft.title}
                                    </h3>
                                    <Badge className={`${riskColors[draft.risk]} text-xs font-bold`}>
                                        <Shield className="w-3 h-3 mr-1" />
                                        {draft.risk.toUpperCase()} RISK
                                    </Badge>
                                    {draft.ai_generated && (
                                        <Badge className="bg-secondary-100 text-secondary-700 border-0 text-xs">
                                            <Sparkles className="w-3 h-3 mr-1" />
                                            AI
                                        </Badge>
                                    )}
                                </div>
                                {draft.excerpt && (
                                    <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                                        {draft.excerpt}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-4">
                            <span className="capitalize font-medium">{draft.category.replace(/-/g, ' ')}</span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {timeAgo}
                            </span>
                            <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {Math.ceil((draft.content?.length || 0) / 1000)}k chars
                            </span>
                            {confidence > 0 && (
                                <span className={`font-bold ${confidence < 0.6 ? 'text-danger-600' : confidence < 0.8 ? 'text-accent-600' : 'text-primary-600'}`}>
                                    {Math.round(confidence * 100)}% confidence
                                </span>
                            )}
                        </div>

                        {/* Risk Indicators */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {forbiddenPhrases.length > 0 && (
                                <Badge className="bg-danger-100 text-danger-700 border-danger-300 text-xs">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    {forbiddenPhrases.length} forbidden phrase(s)
                                </Badge>
                            )}
                            {dataSources.length > 0 && (
                                <Badge className="bg-secondary-100 text-secondary-700 border-secondary-300 text-xs">
                                    {dataSources.length} source(s)
                                </Badge>
                            )}
                            {dataSources.length === 0 && (
                                <Badge className="bg-accent-100 text-accent-700 border-accent-300 text-xs">
                                    No sources listed
                                </Badge>
                            )}
                        </div>

                        {/* Data Sources Preview */}
                        {dataSources.length > 0 && (
                            <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="text-xs font-bold text-slate-700 mb-2">Data Sources:</div>
                                <div className="space-y-1">
                                    {dataSources.slice(0, 3).map((source: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                                            <ExternalLink className="w-3 h-3" />
                                            <span className="truncate">{source.source_name || source.name || 'Unknown'}</span>
                                            {source.confidence && (
                                                <span className="text-slate-600">
                                                    ({Math.round(source.confidence * 100)}%)
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                    {dataSources.length > 3 && (
                                        <div className="text-xs text-slate-600">
                                            +{dataSources.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="bg-white"
                                onClick={onViewDiff}
                            >
                                <GitCompare className="w-4 h-4 mr-1.5" />
                                View Diff
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="bg-white"
                                onClick={() => window.open(`/article/${draft.slug}`, '_blank')}
                            >
                                <Eye className="w-4 h-4 mr-1.5" />
                                Preview
                            </Button>
                            <div className="flex-1" />
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-danger-200 text-danger-600 hover:bg-danger-50"
                                onClick={handleReject}
                                disabled={rejectMutation.isPending}
                            >
                                <XCircle className="w-4 h-4 mr-1.5" />
                                Reject
                            </Button>
                            <Button
                                size="sm"
                                className="bg-primary-600 hover:bg-primary-700 text-white"
                                onClick={handleApprove}
                                disabled={approveMutation.isPending}
                            >
                                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                Approve
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
}

