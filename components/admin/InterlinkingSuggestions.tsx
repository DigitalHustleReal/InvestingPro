"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Loader2, Link as LinkIcon, Check, ExternalLink, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Suggestion {
    articleId: string;
    title: string;
    slug: string;
    anchorText: string;
    context: string;
    relevanceReason: string;
}

interface InterlinkingSuggestionsProps {
    articleId: string;
    content: string;
    title: string;
    category: string;
    onApplyLink: (anchorText: string, slug: string, articleId: string) => void;
}

export default function InterlinkingSuggestions({ 
    articleId, 
    content, 
    title, 
    category,
    onApplyLink 
}: InterlinkingSuggestionsProps) {
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [appliedLinks, setAppliedLinks] = useState<string[]>([]);

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/interlinking/suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ articleId, content, title, category })
            });

            if (!response.ok) throw new Error('Failed to fetch suggestions');
            
            const data = await response.json();
            setSuggestions(data.suggestions || []);
            
            if (data.suggestions?.length === 0) {
                toast.info('No semantic link opportunities found.');
            } else {
                toast.success(`Found ${data.suggestions?.length} link suggestions!`);
            }
        } catch (error) {
            toast.error('Failed to get suggestions');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = (suggestion: Suggestion) => {
        onApplyLink(suggestion.anchorText, suggestion.slug, suggestion.articleId);
        setAppliedLinks([...appliedLinks, `${suggestion.articleId}-${suggestion.anchorText}`]);
        toast.success(`Requested link for "${suggestion.anchorText}"`);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Internal Linking Suggestions</h4>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchSuggestions} 
                    disabled={loading}
                    className="h-7 text-[10px] gap-1.5 border-amber-200 bg-amber-50/50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/10 dark:border-amber-900/30 dark:text-amber-400"
                >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    Scan Content
                </Button>
            </div>

            {suggestions.length > 0 && (
                <div className="space-y-3">
                    {suggestions.map((s, i) => {
                        const isApplied = appliedLinks.includes(`${s.articleId}-${s.anchorText}`);
                        
                        return (
                            <div key={i} className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 space-y-2 group transition-all hover:border-primary/30">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <LinkIcon className="w-3 h-3 text-primary" />
                                            <span className="text-xs font-semibold truncate dark:text-gray-200">{s.title}</span>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                                            "...{s.context}..."
                                        </p>
                                    </div>
                                    <Button 
                                        size="sm" 
                                        variant={isApplied ? "ghost" : "default"}
                                        className={`h-7 px-2 ${isApplied ? 'text-green-600' : ''}`}
                                        onClick={() => handleApply(s)}
                                        disabled={isApplied}
                                    >
                                        {isApplied ? <Check className="w-3 h-3" /> : 'Apply'}
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between pb-1">
                                    <div className="flex items-center gap-2 text-[10px]">
                                        <span className="font-bold text-primary">Anchor:</span>
                                        <Badge variant="secondary" className="text-[9px] py-0 px-1 font-mono uppercase bg-gray-100 dark:bg-gray-800">{s.anchorText}</Badge>
                                    </div>
                                    <span className="text-[9px] text-muted-foreground/60">{s.relevanceReason}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && suggestions.length === 0 && (
                <div className="text-center py-6 px-4 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50/30 dark:bg-gray-900/20">
                    <p className="text-[11px] text-muted-foreground">Click 'Scan' to find internal link opportunities using AI.</p>
                </div>
            )}
        </div>
    );
}
