"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Copy, Check, TrendingUp } from 'lucide-react';

interface SemanticTitleGeneratorProps {
    articleId?: string;
    originalTitle: string;
    primaryKeyword?: string;
    onTitleSelect?: (title: string) => void;
}

interface TitleVariation {
    title_text: string;
    variation_type: 'semantic' | 'question' | 'number' | 'emotional' | 'power-word' | 'original';
    seo_score?: number;
    click_through_score?: number;
    length_score?: number;
    keyword_density?: number;
}

export default function SemanticTitleGenerator({
    articleId,
    originalTitle,
    primaryKeyword = '',
    onTitleSelect
}: SemanticTitleGeneratorProps) {
    const [generating, setGenerating] = useState(false);
    const [variations, setVariations] = useState<TitleVariation[]>([]);
    const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
    const [copiedTitle, setCopiedTitle] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!originalTitle.trim() || !primaryKeyword.trim()) {
            alert('Both original title and primary keyword are required');
            return;
        }

        setGenerating(true);
        try {
            const response = await fetch('/api/titles/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    original_title: originalTitle,
                    primary_keyword: primaryKeyword,
                    count: 10,
                    article_id: articleId
                })
            });

            const data = await response.json();
            if (data.success && data.variations) {
                setVariations(data.variations);
            } else {
                console.error('Title generation failed:', data.error);
            }
        } catch (error) {
            console.error('Error generating title variations:', error);
        } finally {
            setGenerating(false);
        }
    };

    const handleTitleClick = (title: string) => {
        setSelectedTitle(title);
        if (onTitleSelect) {
            onTitleSelect(title);
        }
    };

    const handleCopy = async (title: string) => {
        await navigator.clipboard.writeText(title);
        setCopiedTitle(title);
        setTimeout(() => setCopiedTitle(null), 2000);
    };

    const getVariationBadgeColor = (type: string) => {
        switch (type) {
            case 'question':
                return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200';
            case 'number':
                return 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200';
            case 'emotional':
                return 'bg-secondary-100 text-secondary-800 dark:bg-primary-900 dark:text-secondary-200';
            case 'power-word':
                return 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200';
            default:
                return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
        }
    };

    const getScoreColor = (score?: number) => {
        if (!score) return 'text-slate-500';
        if (score >= 80) return 'text-success-600 dark:text-success-400';
        if (score >= 60) return 'text-accent-600 dark:text-accent-400';
        return 'text-danger-600 dark:text-danger-400';
    };

    // Sort variations by combined score (SEO + CTR)
    const sortedVariations = [...variations].sort((a, b) => {
        const scoreA = (a.seo_score || 0) + (a.click_through_score || 0);
        const scoreB = (b.seo_score || 0) + (b.click_through_score || 0);
        return scoreB - scoreA;
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-6 md:p-8">
                    <Sparkles className="w-5 h-5" />
                    Semantic Title Generator
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Original Title Display */}
                <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Label className="text-xs text-slate-500 mb-1">Original Title</Label>
                    <p className="font-medium">{originalTitle}</p>
                </div>

                {/* Generate Button */}
                <Button
                    onClick={handleGenerate}
                    disabled={!originalTitle.trim() || !primaryKeyword.trim() || generating}
                    className="w-full"
                >
                    {generating ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating Variations...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Title Variations
                        </>
                    )}
                </Button>

                {/* Variations List */}
                {variations.length > 0 && (
                    <div className="space-y-3">
                        <Label>Generated Variations ({variations.length})</Label>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {sortedVariations.map((variation, index) => {
                                const isSelected = selectedTitle === variation.title_text;
                                const isCopied = copiedTitle === variation.title_text;

                                return (
                                    <div
                                        key={index}
                                        className={`p-4 border rounded-lg transition-all ${
                                            isSelected
                                                ? 'border-secondary-500 bg-secondary-50 dark:bg-primary-950'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-secondary-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <p
                                                        className="font-medium cursor-pointer hover:text-primary-600 dark:hover:text-secondary-400"
                                                        onClick={() => handleTitleClick(variation.title_text)}
                                                    >
                                                        {variation.title_text}
                                                    </p>
                                                    <Badge className={getVariationBadgeColor(variation.variation_type)}>
                                                        {variation.variation_type}
                                                    </Badge>
                                                </div>
                                                <div className="flex gap-4 text-xs text-slate-600 dark:text-slate-400">
                                                    {variation.seo_score !== undefined && (
                                                        <div className="flex items-center gap-1">
                                                            <TrendingUp className="w-3 h-3" />
                                                            <span className={getScoreColor(variation.seo_score)}>
                                                                SEO: {variation.seo_score}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {variation.click_through_score !== undefined && (
                                                        <div className={getScoreColor(variation.click_through_score)}>
                                                            CTR: {variation.click_through_score}
                                                        </div>
                                                    )}
                                                    {variation.length_score !== undefined && (
                                                        <div className={getScoreColor(variation.length_score)}>
                                                            Length: {variation.length_score}
                                                        </div>
                                                    )}
                                                    {variation.keyword_density !== undefined && (
                                                        <div>
                                                            Density: {(variation.keyword_density * 100).toFixed(1)}%
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleCopy(variation.title_text)}
                                                className="shrink-0"
                                            >
                                                {isCopied ? (
                                                    <Check className="w-4 h-4 text-success-600" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Selected Title Display */}
                        {selectedTitle && (
                            <div className="pt-4 border-t">
                                <Label>Selected Title</Label>
                                <div className="p-3 bg-secondary-50 dark:bg-primary-950 rounded-lg mt-2">
                                    <p className="font-medium">{selectedTitle}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

