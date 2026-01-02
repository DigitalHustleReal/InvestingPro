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
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'number':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'emotional':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'power-word':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    const getScoreColor = (score?: number) => {
        if (!score) return 'text-gray-500';
        if (score >= 80) return 'text-green-600 dark:text-green-400';
        if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
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
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Semantic Title Generator
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Original Title Display */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Label className="text-xs text-gray-500 mb-1">Original Title</Label>
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
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <p
                                                        className="font-medium cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                                                        onClick={() => handleTitleClick(variation.title_text)}
                                                    >
                                                        {variation.title_text}
                                                    </p>
                                                    <Badge className={getVariationBadgeColor(variation.variation_type)}>
                                                        {variation.variation_type}
                                                    </Badge>
                                                </div>
                                                <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
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
                                                    <Check className="w-4 h-4 text-green-600" />
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
                                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg mt-2">
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

