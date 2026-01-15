"use client";

import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    CheckCircle2,
    XCircle,
    Eye,
    AlertTriangle,
    FileText,
    Filter,
    Search,
    Clock,
    Shield,
    ExternalLink,
    GitCompare,
    Sparkles
} from "lucide-react";
import EditorialDraftCard from "@/components/editorial/EditorialDraftCard";
import DiffView from "@/components/editorial/DiffView";
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

export default function EditorialDashboard() {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [selectedDraft, setSelectedDraft] = useState<DraftArticle | null>(null);
    const [showDiff, setShowDiff] = useState(false);

    const queryClient = useQueryClient();

    // Fetch pending drafts (AI-generated content awaiting review)
    const { data: drafts = [], isLoading } = useQuery({
        queryKey: ['editorial-drafts'],
        queryFn: async () => {
            const articles = await api.entities.Article.filter({
                ai_generated: true,
                status: 'draft'
            });
            return articles.filter((a: any) => 
                !a.human_reviewed || 
                (a.ai_metadata?.review_status === 'pending' || !a.ai_metadata?.review_status)
            );
        },
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    // Calculate risk level for each draft
    const draftsWithRisk = useMemo(() => {
        return drafts.map((draft: DraftArticle) => {
            const risk = calculateRiskLevel(draft);
            return { ...draft, risk };
        });
    }, [drafts]);

    // Filter drafts
    const filteredDrafts = useMemo(() => {
        let filtered = draftsWithRisk;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((d: DraftArticle & { risk: RiskLevel }) =>
                d.title.toLowerCase().includes(query) ||
                d.excerpt?.toLowerCase().includes(query) ||
                d.category.toLowerCase().includes(query)
            );
        }

        // Risk filter
        if (riskFilter !== 'all') {
            filtered = filtered.filter((d: DraftArticle & { risk: RiskLevel }) => d.risk === riskFilter);
        }

        // Category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter((d: DraftArticle) => d.category === categoryFilter);
        }

        return filtered.sort((a: DraftArticle & { risk: RiskLevel }, b: DraftArticle & { risk: RiskLevel }) => {
            // Sort by risk (high first), then by date (newest first)
            const riskOrder: Record<RiskLevel, number> = { high: 3, medium: 2, low: 1 };
            if (riskOrder[a.risk] !== riskOrder[b.risk]) {
                return riskOrder[b.risk] - riskOrder[a.risk];
            }
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
    }, [draftsWithRisk, searchQuery, riskFilter, categoryFilter]);

    // Batch approve mutation
    const batchApproveMutation = useMutation({
        mutationFn: async (ids: string[]) => {
            const promises = ids.map(id =>
                api.entities.Article.update(id, {
                    status: 'published',
                    human_reviewed: true,
                    reviewed_at: new Date().toISOString(),
                    published_at: new Date().toISOString(),
                    ai_metadata: {
                        ...drafts.find((d: DraftArticle) => d.id === id)?.ai_metadata,
                        review_status: 'approved',
                        change_log: [
                            ...(drafts.find((d: DraftArticle) => d.id === id)?.ai_metadata?.change_log || []),
                            {
                                timestamp: new Date().toISOString(),
                                change_type: 'approved',
                                changed_by: 'editor',
                                changes: ['Approved and published']
                            }
                        ]
                    }
                })
            );
            await Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['editorial-drafts'] });
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            setSelectedIds(new Set());
            logger.info('Batch approved articles', { count: selectedIds.size });
        }
    });

    // Batch reject mutation
    const batchRejectMutation = useMutation({
        mutationFn: async (ids: string[]) => {
            const promises = ids.map(id =>
                api.entities.Article.update(id, {
                    status: 'archived',
                    human_reviewed: true,
                    reviewed_at: new Date().toISOString(),
                    ai_metadata: {
                        ...drafts.find((d: DraftArticle) => d.id === id)?.ai_metadata,
                        review_status: 'rejected',
                        change_log: [
                            ...(drafts.find((d: DraftArticle) => d.id === id)?.ai_metadata?.change_log || []),
                            {
                                timestamp: new Date().toISOString(),
                                change_type: 'rejected',
                                changed_by: 'editor',
                                changes: ['Rejected in batch review']
                            }
                        ]
                    }
                })
            );
            await Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['editorial-drafts'] });
            setSelectedIds(new Set());
            logger.info('Batch rejected articles', { count: selectedIds.size });
        }
    });

    const handleSelectAll = () => {
        if (selectedIds.size === filteredDrafts.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredDrafts.map((d: any) => d.id)));
        }
    };

    const handleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleBatchApprove = () => {
        if (selectedIds.size === 0) return;
        if (confirm(`Approve and publish ${selectedIds.size} article(s)?`)) {
            batchApproveMutation.mutate(Array.from(selectedIds));
        }
    };

    const handleBatchReject = () => {
        if (selectedIds.size === 0) return;
        if (confirm(`Reject ${selectedIds.size} article(s)?`)) {
            batchRejectMutation.mutate(Array.from(selectedIds));
        }
    };

    const categories = useMemo(() => {
        const cats = new Set(drafts.map((d: DraftArticle) => d.category));
        return Array.from(cats).sort();
    }, [drafts]);

    const stats = useMemo(() => {
        const total = draftsWithRisk.length;
        const high = draftsWithRisk.filter((d: any) => d.risk === 'high').length;
        const medium = draftsWithRisk.filter((d: any) => d.risk === 'medium').length;
        const low = draftsWithRisk.filter((d: any) => d.risk === 'low').length;
        return { total, high, medium, low };
    }, [draftsWithRisk]);

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Editorial Dashboard</h1>
                            <p className="text-slate-600">Review and approve AI-generated content</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge className="bg-primary-100 text-primary-700 text-sm font-bold px-4 py-2">
                                {stats.total} Drafts
                            </Badge>
                            <Badge className="bg-danger-100 text-danger-700 text-sm font-bold px-4 py-2">
                                {stats.high} High Risk
                            </Badge>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardContent className="p-6 md:p-8">
                                <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                                <div className="text-xs text-slate-500 font-medium">Total Drafts</div>
                            </CardContent>
                        </Card>
                        <Card className="border-rose-200 bg-rose-50">
                            <CardContent className="p-6 md:p-8">
                                <div className="text-2xl font-bold text-rose-700">{stats.high}</div>
                                <div className="text-xs text-rose-600 font-medium">High Risk</div>
                            </CardContent>
                        </Card>
                        <Card className="border-accent-200 bg-accent-50">
                            <CardContent className="p-6 md:p-8">
                                <div className="text-2xl font-bold text-accent-700">{stats.medium}</div>
                                <div className="text-xs text-accent-600 font-medium">Medium Risk</div>
                            </CardContent>
                        </Card>
                        <Card className="border-primary-200 bg-primary-50">
                            <CardContent className="p-6 md:p-8">
                                <div className="text-2xl font-bold text-primary-700">{stats.low}</div>
                                <div className="text-xs text-primary-600 font-medium">Low Risk</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Filters and Actions */}
                <Card className="mb-6">
                    <CardContent className="p-6 md:p-8">
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Search */}
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        placeholder="Search drafts..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Risk Filter */}
                            <select
                                value={riskFilter}
                                onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'all')}
                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                            >
                                <option value="all">All Risk Levels</option>
                                <option value="high">High Risk</option>
                                <option value="medium">Medium Risk</option>
                                <option value="low">Low Risk</option>
                            </select>

                            {/* Category Filter */}
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat.replace(/-/g, ' ')}</option>
                                ))}
                            </select>

                            {/* Batch Actions */}
                            {selectedIds.size > 0 && (
                                <div className="flex items-center gap-2 ml-auto">
                                    <span className="text-sm text-slate-600 font-medium">
                                        {selectedIds.size} selected
                                    </span>
                                    <Button
                                        size="sm"
                                        className="bg-primary-600 hover:bg-primary-700 text-white"
                                        onClick={handleBatchApprove}
                                        disabled={batchApproveMutation.isPending}
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                        Approve All
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-danger-200 text-danger-600 hover:bg-danger-50"
                                        onClick={handleBatchReject}
                                        disabled={batchRejectMutation.isPending}
                                    >
                                        <XCircle className="w-4 h-4 mr-1.5" />
                                        Reject All
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Draft Queue */}
                {isLoading ? (
                    <Card>
                        <CardContent className="p-6 md:p-8 text-center">
                            <div className="text-slate-500">Loading drafts...</div>
                        </CardContent>
                    </Card>
                ) : filteredDrafts.length === 0 ? (
                    <Card>
                        <CardContent className="p-6 md:p-8 text-center">
                            <CheckCircle2 className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">All Caught Up!</h3>
                            <p className="text-slate-500">No drafts pending review.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {/* Select All */}
                        <div className="flex items-center gap-2 px-2">
                            <Checkbox
                                checked={selectedIds.size === filteredDrafts.length && filteredDrafts.length > 0}
                                onCheckedChange={handleSelectAll}
                            />
                            <span className="text-sm text-slate-600 font-medium">
                                Select all ({filteredDrafts.length})
                            </span>
                        </div>

                        {/* Draft Cards */}
                        {filteredDrafts.map((draft: DraftArticle & { risk: RiskLevel }) => (
                            <EditorialDraftCard
                                key={draft.id}
                                draft={draft}
                                selected={selectedIds.has(draft.id)}
                                onSelect={() => handleSelect(draft.id)}
                                onViewDiff={() => {
                                    setSelectedDraft(draft);
                                    setShowDiff(true);
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Diff View Modal */}
                {showDiff && selectedDraft && (
                    <DiffView
                        draft={selectedDraft}
                        onClose={() => {
                            setShowDiff(false);
                            setSelectedDraft(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
}

/**
 * Calculate risk level based on AI metadata
 */
function calculateRiskLevel(draft: DraftArticle): RiskLevel {
    const metadata = draft.ai_metadata;
    if (!metadata) return 'medium';

    // High risk factors
    const forbiddenPhrases = metadata.forbidden_phrases_found || [];
    const confidence = metadata.confidence?.overall || 0.5;
    const dataSources = metadata.data_sources || [];
    const hasLowConfidence = confidence < 0.6;
    const hasForbiddenPhrases = forbiddenPhrases.length > 0;
    const hasFewSources = dataSources.length < 2;

    // Medium risk factors
    const hasMediumConfidence = confidence >= 0.6 && confidence < 0.8;
    const hasWarnings = metadata.warnings?.length > 0;

    if (hasForbiddenPhrases || hasLowConfidence || (hasFewSources && hasLowConfidence)) {
        return 'high';
    }

    if (hasMediumConfidence || hasWarnings || hasFewSources) {
        return 'medium';
    }

    return 'low';
}

