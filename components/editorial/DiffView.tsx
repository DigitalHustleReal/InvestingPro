"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, ExternalLink, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import * as diff from 'diff';

interface DraftArticle {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    category: string;
    ai_metadata?: any;
    [key: string]: any;
}

interface DiffViewProps {
    draft: DraftArticle;
    onClose: () => void;
}

export default function DiffView({ draft, onClose }: DiffViewProps) {
    const [viewMode, setViewMode] = useState<'diff' | 'preview' | 'sources'>('diff');

    const aiMetadata = draft.ai_metadata || {};
    const dataSources = aiMetadata.data_sources || [];
    const confidence = aiMetadata.confidence || {};
    const changeLog = aiMetadata.change_log || [];
    const forbiddenPhrases = aiMetadata.forbidden_phrases_found || [];

    // For diff view, we'd compare against a previous version if available
    // For now, show the current content with highlights
    const renderDiff = () => {
        // In a real implementation, you'd compare against a previous version
        // For now, we'll show the content with risk indicators
        return (
            <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="text-sm font-bold text-slate-700 mb-2">Title:</div>
                    <div className="text-base text-slate-900">{draft.title}</div>
                </div>

                {draft.excerpt && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="text-sm font-bold text-slate-700 mb-2">Excerpt:</div>
                        <div className="text-sm text-slate-700">{draft.excerpt}</div>
                    </div>
                )}

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="text-sm font-bold text-slate-700 mb-2">Content:</div>
                    <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{draft.content}</ReactMarkdown>
                    </div>
                </div>

                {forbiddenPhrases.length > 0 && (
                    <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
                        <div className="text-sm font-bold text-rose-700 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Forbidden Phrases Detected:
                        </div>
                        <ul className="list-disc list-inside text-sm text-rose-600 space-y-1">
                            {forbiddenPhrases.map((phrase: string, idx: number) => (
                                <li key={idx}>{phrase}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    const renderPreview = () => {
        return (
            <div className="space-y-4">
                <article className="prose prose-lg max-w-none">
                    <h1>{draft.title}</h1>
                    {draft.excerpt && <p className="text-xl text-slate-600">{draft.excerpt}</p>}
                    <ReactMarkdown>{draft.content}</ReactMarkdown>
                </article>
            </div>
        );
    };

    const renderSources = () => {
        return (
            <div className="space-y-6">
                {/* Confidence Scores */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-700 mb-3">Confidence Scores</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-slate-500 mb-1">Overall</div>
                            <div className="text-lg font-bold text-slate-900">
                                {Math.round((confidence.overall || 0) * 100)}%
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 mb-1">Data Quality</div>
                            <div className="text-lg font-bold text-slate-900">
                                {Math.round((confidence.data_quality || 0) * 100)}%
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 mb-1">Factual Accuracy</div>
                            <div className="text-lg font-bold text-slate-900">
                                {Math.round((confidence.factual_accuracy || 0) * 100)}%
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 mb-1">Completeness</div>
                            <div className="text-lg font-bold text-slate-900">
                                {Math.round((confidence.completeness || 0) * 100)}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Sources */}
                <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-3">Data Sources ({dataSources.length})</h3>
                    <div className="space-y-3">
                        {dataSources.length === 0 ? (
                            <div className="text-sm text-slate-500 p-4 bg-accent-50 rounded-lg border border-accent-200">
                                No data sources listed
                            </div>
                        ) : (
                            dataSources.map((source: any, idx: number) => (
                                <div key={idx} className="p-4 bg-white rounded-lg border border-slate-200">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <div className="font-bold text-slate-900 mb-1">
                                                {source.source_name || source.name || 'Unknown Source'}
                                            </div>
                                            <div className="text-xs text-slate-500 mb-2">
                                                Type: {source.source_type || 'unknown'}
                                            </div>
                                            {source.source_url && (
                                                <a
                                                    href={source.source_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                    {source.source_url}
                                                </a>
                                            )}
                                        </div>
                                        {source.confidence && (
                                            <Badge className="bg-secondary-100 text-secondary-700 text-xs">
                                                {Math.round(source.confidence * 100)}%
                                            </Badge>
                                        )}
                                    </div>
                                    {source.last_verified && (
                                        <div className="text-xs text-slate-400">
                                            Verified: {new Date(source.last_verified).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Change Log */}
                {changeLog.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-slate-700 mb-3">Change Log</h3>
                        <div className="space-y-2">
                            {changeLog.map((log: any, idx: number) => (
                                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-slate-900">
                                            {log.change_type || log.event}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {new Date(log.timestamp || log.generated_at).toLocaleString()}
                                        </span>
                                    </div>
                                    {log.changed_by && (
                                        <div className="text-xs text-slate-500 mb-1">
                                            By: {log.changed_by}
                                        </div>
                                    )}
                                    {log.changes && Array.isArray(log.changes) && (
                                        <ul className="list-disc list-inside text-xs text-slate-600 mt-1">
                                            {log.changes.map((change: string, cIdx: number) => (
                                                <li key={cIdx}>{change}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold text-slate-900">
                            {draft.title}
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="diff">Diff View</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="sources">Sources & Metadata</TabsTrigger>
                    </TabsList>

                    <TabsContent value="diff" className="mt-4">
                        {renderDiff()}
                    </TabsContent>

                    <TabsContent value="preview" className="mt-4">
                        {renderPreview()}
                    </TabsContent>

                    <TabsContent value="sources" className="mt-4">
                        {renderSources()}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

