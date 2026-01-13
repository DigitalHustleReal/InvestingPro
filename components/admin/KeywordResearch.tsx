"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Sparkles, TrendingUp, ArrowRight, X } from 'lucide-react';

interface KeywordResearchProps {
    articleId?: string;
    primaryKeyword?: string;
    onKeywordSelect?: (keyword: string) => void;
}

interface KeywordData {
    keyword_text: string;
    search_volume?: number;
    competition_score?: number;
    difficulty_score?: number;
    keyword_type?: 'long-tail' | 'semantic' | 'alternative' | 'lsi';
}

interface KeywordResearchResult {
    primary_keyword: string;
    long_tail_keywords: KeywordData[];
    semantic_keywords: KeywordData[];
    alternative_keywords: KeywordData[];
    lsi_keywords: KeywordData[];
}

export default function KeywordResearch({
    articleId,
    primaryKeyword: initialPrimaryKeyword = '',
    onKeywordSelect
}: KeywordResearchProps) {
    const [primaryKeyword, setPrimaryKeyword] = useState(initialPrimaryKeyword);
    const [researching, setResearching] = useState(false);
    const [researchResult, setResearchResult] = useState<KeywordResearchResult | null>(null);
    const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
    const [activeTab, setActiveTab] = useState<'long-tail' | 'semantic' | 'alternative' | 'lsi'>('long-tail');

    const handleResearch = async () => {
        if (!primaryKeyword.trim()) return;

        setResearching(true);
        try {
            const response = await fetch('/api/keywords/research', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    primary_keyword: primaryKeyword.trim(),
                    article_id: articleId
                })
            });

            const data = await response.json();
            if (data.success && data.research) {
                setResearchResult(data.research);
            } else {
                console.error('Keyword research failed:', data.error);
            }
        } catch (error) {
            console.error('Error performing keyword research:', error);
        } finally {
            setResearching(false);
        }
    };

    const handleKeywordClick = (keyword: string) => {
        const newSelected = new Set(selectedKeywords);
        if (newSelected.has(keyword)) {
            newSelected.delete(keyword);
        } else {
            newSelected.add(keyword);
        }
        setSelectedKeywords(newSelected);
        if (onKeywordSelect) {
            onKeywordSelect(keyword);
        }
    };

    const getKeywordsForTab = (): KeywordData[] => {
        if (!researchResult) return [];
        
        switch (activeTab) {
            case 'long-tail':
                return researchResult.long_tail_keywords || [];
            case 'semantic':
                return researchResult.semantic_keywords || [];
            case 'alternative':
                return researchResult.alternative_keywords || [];
            case 'lsi':
                return researchResult.lsi_keywords || [];
            default:
                return [];
        }
    };

    const KeywordCard = ({ keyword }: { keyword: KeywordData }) => {
        const isSelected = selectedKeywords.has(keyword.keyword_text);
        
        return (
            <div
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                        ? 'border-secondary-500 bg-secondary-50 dark:bg-primary-950'
                        : 'border-slate-200 dark:border-slate-700 hover:border-secondary-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                onClick={() => handleKeywordClick(keyword.keyword_text)}
            >
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="font-medium text-sm">{keyword.keyword_text}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {keyword.search_volume !== undefined && (
                                <Badge variant="outline" className="text-xs">
                                    Volume: {keyword.search_volume.toLocaleString()}
                                </Badge>
                            )}
                            {keyword.competition_score !== undefined && (
                                <Badge variant="outline" className="text-xs">
                                    Competition: {keyword.competition_score}/100
                                </Badge>
                            )}
                            {keyword.difficulty_score !== undefined && (
                                <Badge variant="outline" className="text-xs">
                                    Difficulty: {keyword.difficulty_score}/100
                                </Badge>
                            )}
                        </div>
                    </div>
                    {isSelected && (
                        <div className="ml-2 text-secondary-500">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-6 md:p-8">
                    <Search className="w-5 h-5" />
                    Keyword Research
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Primary Keyword Input */}
                <div className="space-y-2">
                    <Label htmlFor="primary-keyword">Primary Keyword</Label>
                    <div className="flex gap-2">
                        <Input
                            id="primary-keyword"
                            value={primaryKeyword}
                            onChange={(e) => setPrimaryKeyword(e.target.value)}
                            placeholder="Enter primary keyword (e.g., mutual funds)"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleResearch();
                                }
                            }}
                        />
                        <Button
                            onClick={handleResearch}
                            disabled={!primaryKeyword.trim() || researching}
                        >
                            {researching ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Researching...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Research
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Research Results */}
                {researchResult && (
                    <div className="space-y-4">
                        {/* Tabs */}
                        <div className="flex gap-2 border-b">
                            <button
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'long-tail'
                                        ? 'border-secondary-500 text-primary-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                                onClick={() => setActiveTab('long-tail')}
                            >
                                Long-Tail ({researchResult.long_tail_keywords?.length || 0})
                            </button>
                            <button
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'semantic'
                                        ? 'border-secondary-500 text-primary-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                                onClick={() => setActiveTab('semantic')}
                            >
                                Semantic ({researchResult.semantic_keywords?.length || 0})
                            </button>
                            <button
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'alternative'
                                        ? 'border-secondary-500 text-primary-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                                onClick={() => setActiveTab('alternative')}
                            >
                                Alternatives ({researchResult.alternative_keywords?.length || 0})
                            </button>
                            <button
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'lsi'
                                        ? 'border-secondary-500 text-primary-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                                onClick={() => setActiveTab('lsi')}
                            >
                                LSI ({researchResult.lsi_keywords?.length || 0})
                            </button>
                        </div>

                        {/* Keywords Grid */}
                        <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                            {getKeywordsForTab().map((keyword, index) => (
                                <KeywordCard key={index} keyword={keyword} />
                            ))}
                            {getKeywordsForTab().length === 0 && (
                                <p className="text-sm text-slate-500 text-center py-8">
                                    No keywords found in this category
                                </p>
                            )}
                        </div>

                        {/* Selected Keywords Summary */}
                        {selectedKeywords.size > 0 && (
                            <div className="pt-4 border-t">
                                <div className="flex items-center justify-between mb-2">
                                    <Label>Selected Keywords ({selectedKeywords.size})</Label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedKeywords(new Set())}
                                    >
                                        Clear All
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {Array.from(selectedKeywords).map((keyword) => (
                                        <Badge
                                            key={keyword}
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            {keyword}
                                            <X
                                                className="w-3 h-3 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const newSelected = new Set(selectedKeywords);
                                                    newSelected.delete(keyword);
                                                    setSelectedKeywords(newSelected);
                                                }}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

