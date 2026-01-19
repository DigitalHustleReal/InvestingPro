"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import KeywordResearch from './KeywordResearch';

interface KeywordResearchQuickAccessProps {
    articleId?: string;
    primaryKeyword: string;
    onKeywordSelect?: (keyword: string) => void;
}

/**
 * Quick Access Keyword Research Component
 * Compact version that can be expanded to show full keyword research
 */
export default function KeywordResearchQuickAccess({
    articleId,
    primaryKeyword,
    onKeywordSelect
}: KeywordResearchQuickAccessProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="space-y-2">
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="w-full justify-between"
            >
                <div className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    <span>Research Keywords</span>
                    <Sparkles className="w-3 h-3 text-secondary-500" />
                </div>
                {expanded ? (
                    <ChevronUp className="w-4 h-4" />
                ) : (
                    <ChevronDown className="w-4 h-4" />
                )}
            </Button>
            
            {expanded && (
                <div className="border rounded-lg p-3 bg-slate-50 dark:bg-muted dark:bg-muted">
                    <KeywordResearch
                        articleId={articleId}
                        primaryKeyword={primaryKeyword}
                        onKeywordSelect={onKeywordSelect}
                    />
                </div>
            )}
        </div>
    );
}

