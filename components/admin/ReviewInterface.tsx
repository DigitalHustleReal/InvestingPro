"use client";

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
    CheckCircle2, 
    XCircle, 
    ExternalLink, 
    FileJson, 
    Type, 
    AlertTriangle, 
    Globe,
    History
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface ReviewInterfaceProps {
    article: any;
    sourceData?: any; // processing logs, scraper data, etc.
    onAction: (action: 'approve' | 'reject', notes?: string) => void;
}

export default function ReviewInterface({ article, sourceData, onAction }: ReviewInterfaceProps) {
    const [activeTab, setActiveTab] = useState('preview');
    const [reviewNotes, setReviewNotes] = useState('');
    const supabase = createClient();

    // Mock highlighting logic (for v1 demo)
    // In production, this would use regex to find numbers in content and match with sourceData
    const highlightNumbers = (text: string) => {
        if (!text) return null;
        // Simple regex to bold numbers (e.g. ₹10,000, 50%, 12.5)
        const parts = text.split(/([₹$€£]?\d+(?:,\d{3})*(?:\.\d+)?%?)/g);
        return parts.map((part, i) => {
            if (part.match(/[₹$€£]?\d+(?:,\d{3})*(?:\.\d+)?%?/)) {
                return <span key={i} className="bg-yellow-100 dark:bg-yellow-900/40 px-0.5 rounded text-yellow-800 dark:text-yellow-200 font-mono font-bold cursor-help" title="Verify this number">{part}</span>;
            }
            return part;
        });
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-4">
            {/* Left Panel: Content Preview */}
            <div className="flex-1 flex flex-col bg-white bg-wt-card rounded-xl border border-wt-border border-wt-border overflow-hidden shadow-sm">
                <div className="p-4 border-b border-wt-border border-wt-border flex justify-between items-center bg-wt-surface-hover bg-wt-card/50">
                    <div className="flex items-center gap-2">
                        <Type className="h-4 w-4 text-wt-text-muted" />
                        <h3 className="font-semibold text-wt-text">Content Preview</h3>
                        <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">
                            {article.status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-wt-text-muted">
                        <History className="h-3 w-3" />
                        Last edit: {format(new Date(article.updated_at), 'MMM d, HH:mm')}
                    </div>
                </div>
                
                <ScrollArea className="flex-1 p-8">
                    <div className="max-w-3xl mx-auto prose dark:prose-invert">
                        <h1>{article.title}</h1>
                        {article.featured_image && (
                            <img 
                                src={article.featured_image} 
                                alt="Featured" 
                                className="w-full h-48 object-cover rounded-lg mb-6"
                            />
                        )}
                        <div className="bg-wt-card bg-wt-surface p-4 rounded-lg mb-6 text-sm italic border-l-4 border-wt-border dark:border-wt-border">
                            {article.excerpt}
                        </div>
                        
                        <div className="whitespace-pre-wrap font-sans text-wt-text leading-relaxed">
                             {/* Render content with highlighting */}
                             {article.content ? highlightNumbers(article.content) : <span className="text-wt-text-dim italic">No content...</span>}
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* Right Panel: Source & Verification */}
            <div className="w-full lg:w-[400px] flex flex-col gap-4">
                {/* Source Data Explorer */}
                <Card className="flex-1 flex flex-col overflow-hidden bg-wt-surface-hover bg-wt-surface border-wt-border border-wt-border">
                    <Tabs defaultValue="source" className="flex-1 flex flex-col">
                        <div className="p-3 border-b border-wt-border border-wt-border">
                            <TabsList className="w-full grid grid-cols-2">
                                <TabsTrigger value="source" className="flex items-center gap-2">
                                    <FileJson className="h-3 w-3" /> Data Source
                                </TabsTrigger>
                                <TabsTrigger value="citations" className="flex items-center gap-2">
                                    <Globe className="h-3 w-3" /> Citations
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        
                        <TabsContent value="source" className="flex-1 p-0 m-0 overflow-hidden">
                            <ScrollArea className="h-full p-4">
                                {sourceData ? (
                                    <pre className="text-xs font-mono text-wt-text-muted whitespace-pre-wrap break-all">
                                        {JSON.stringify(sourceData, null, 2)}
                                    </pre>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-48 text-wt-text-dim p-8 text-center bg-wt-card/50 bg-wt-card/50 rounded-lg m-4 border-2 border-dashed border-wt-border border-wt-border">
                                        <AlertTriangle className="h-8 w-8 mb-2 opacity-50" />
                                        <p className="text-sm">No source data linked.</p>
                                        <p className="text-xs mt-1">This article was likely created manually or predates the pipeline tracking system.</p>
                                    </div>
                                )}
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="citations" className="flex-1 p-4 m-0">
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wide text-wt-text-dim">Linked Sources</h4>
                                {article.citations && article.citations.length > 0 ? (
                                    article.citations.map((cite: any, i: number) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-white bg-wt-card rounded border border-wt-border border-wt-border text-sm">
                                            <Globe className="h-4 w-4 text-wt-gold mt-0.5 shrink-0" />
                                            <div className="break-all">
                                                <div className="font-medium text-wt-text">{cite.text || "Untitled Source"}</div>
                                                <a href={cite.url} target="_blank" className="text-xs text-wt-gold hover:underline flex items-center gap-1 mt-1">
                                                    {cite.url} <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-wt-text-muted italic">No citations recorded.</p>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </Card>

                {/* Review Controls */}
                <Card className="p-4 bg-white bg-wt-card border-wt-border border-wt-border shadow-lg">
                    <h3 className="font-bold text-wt-text mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        Editorial Decision
                    </h3>
                    
                    <div className="space-y-3">
                        <textarea
                            className="w-full h-24 p-3 rounded-lg border border-wt-border dark:border-wt-border bg-wt-surface-hover bg-wt-surface text-sm focus:ring-2 focus:ring-wt-gold outline-none resize-none"
                            placeholder="Add notes for the author or audit log..."
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                        />
                        
                        <div className="grid grid-cols-2 gap-3">
                            <Button 
                                variant="outline" 
                                className="border-red-200 hover:bg-red-50 text-red-700 hover:text-red-800 dark:border-red-900/30 dark:hover:bg-red-900/20 dark:text-red-400"
                                onClick={() => onAction('reject', reviewNotes)}
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Request Changes
                            </Button>
                            <Button 
                                className="bg-wt-green hover:bg-wt-green/90 text-white"
                                onClick={() => onAction('approve', reviewNotes)}
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Approve & Publish
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
