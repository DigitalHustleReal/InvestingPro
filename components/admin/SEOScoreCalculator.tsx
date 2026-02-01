"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface SEOScoreCalculatorProps {
    title: string;
    content: string;
    metaDescription?: string;
    keywords?: string[];
}

/**
 * SEO Score Calculator Component
 * Analyzes content and provides SEO score with recommendations
 */
export default function SEOScoreCalculator({
    title,
    content,
    metaDescription = '',
    keywords = []
}: SEOScoreCalculatorProps) {
    const analysis = useMemo(() => {
        const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
        const charCount = content.length;
        const titleLength = title.length;
        const metaLength = metaDescription.length;
        
        // Calculate scores
        let score = 0;
        const checks: Array<{ label: string; passed: boolean; message: string }> = [];

        // Title checks (20 points)
        if (titleLength >= 30 && titleLength <= 60) {
            score += 20;
            checks.push({ label: 'Title Length', passed: true, message: `Title is ${titleLength} characters (optimal: 30-60)` });
        } else {
            checks.push({ 
                label: 'Title Length', 
                passed: false, 
                message: `Title is ${titleLength} characters (should be 30-60)` 
            });
        }

        // Meta description checks (20 points)
        if (metaLength >= 120 && metaLength <= 160) {
            score += 20;
            checks.push({ label: 'Meta Description', passed: true, message: `Meta description is ${metaLength} characters (optimal: 120-160)` });
        } else if (metaLength === 0) {
            checks.push({ label: 'Meta Description', passed: false, message: 'Meta description is missing' });
        } else {
            checks.push({ 
                label: 'Meta Description', 
                passed: false, 
                message: `Meta description is ${metaLength} characters (should be 120-160)` 
            });
        }

        // Content length checks (20 points)
        if (wordCount >= 300 && wordCount <= 3000) {
            score += 20;
            checks.push({ label: 'Content Length', passed: true, message: `Content is ${wordCount} words (good for SEO)` });
        } else if (wordCount < 300) {
            checks.push({ label: 'Content Length', passed: false, message: `Content is only ${wordCount} words (aim for 300+)` });
        } else {
            checks.push({ label: 'Content Length', passed: true, message: `Content is ${wordCount} words (comprehensive)` });
        }

        // Heading structure (15 points)
        const h2Count = (content.match(/<h2[^>]*>/gi) || []).length;
        const h3Count = (content.match(/<h3[^>]*>/gi) || []).length;
        if (h2Count >= 2) {
            score += 15;
            checks.push({ label: 'Heading Structure', passed: true, message: `Has ${h2Count} H2 headings and ${h3Count} H3 headings` });
        } else {
            checks.push({ label: 'Heading Structure', passed: false, message: `Only ${h2Count} H2 headings (aim for 2+)` });
        }

        // Keyword usage (15 points)
        if (keywords.length > 0) {
            const keywordInTitle = keywords.some(kw => title.toLowerCase().includes(kw.toLowerCase()));
            const keywordInContent = keywords.some(kw => content.toLowerCase().includes(kw.toLowerCase()));
            if (keywordInTitle && keywordInContent) {
                score += 15;
                checks.push({ label: 'Keyword Usage', passed: true, message: 'Keywords found in title and content' });
            } else if (keywordInContent) {
                score += 10;
                checks.push({ label: 'Keyword Usage', passed: false, message: 'Keywords found in content but not in title' });
            } else {
                checks.push({ label: 'Keyword Usage', passed: false, message: 'Keywords not found in content' });
            }
        } else {
            checks.push({ label: 'Keyword Usage', passed: false, message: 'No keywords specified' });
        }

        // Image alt text (10 points)
        const imageCount = (content.match(/<img[^>]*>/gi) || []).length;
        const imagesWithAlt = (content.match(/<img[^>]*alt=["'][^"']+["'][^>]*>/gi) || []).length;
        if (imageCount === 0) {
            checks.push({ label: 'Image Alt Text', passed: true, message: 'No images to check' });
        } else if (imagesWithAlt === imageCount) {
            score += 10;
            checks.push({ label: 'Image Alt Text', passed: true, message: `All ${imageCount} images have alt text` });
        } else {
            checks.push({ label: 'Image Alt Text', passed: false, message: `${imagesWithAlt}/${imageCount} images have alt text` });
        }

        // Readability (bonus points)
        const avgSentenceLength = wordCount / (content.split(/[.!?]+/).length || 1);
        if (avgSentenceLength >= 15 && avgSentenceLength <= 20) {
            score += 5;
            checks.push({ label: 'Readability', passed: true, message: 'Sentence length is optimal' });
        } else {
            checks.push({ label: 'Readability', passed: false, message: `Average sentence length: ${avgSentenceLength.toFixed(1)} words (aim for 15-20)` });
        }

        // Link structure (bonus points)
        const linkCount = (content.match(/<a[^>]*href=["'][^"']+["'][^>]*>/gi) || []).length;
        if (linkCount >= 2) {
            score += 5;
            checks.push({ label: 'Internal Links', passed: true, message: `Has ${linkCount} links (good for SEO)` });
        } else {
            checks.push({ label: 'Internal Links', passed: false, message: `Only ${linkCount} links (aim for 2+)` });
        }

        return {
            score: Math.min(100, score),
            wordCount,
            charCount,
            titleLength,
            metaLength,
            h2Count,
            h3Count,
            imageCount,
            linkCount,
            checks
        };
    }, [title, content, metaDescription, keywords]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-wt-gold';
        if (score >= 60) return 'text-wt-gold';
        return 'text-danger-600';
    };

    const getScoreBadge = (score: number) => {
        if (score >= 80) return 'bg-wt-gold-subtle text-wt-gold';
        if (score >= 60) return 'bg-accent-100 text-accent-800';
        return 'bg-danger-100 text-danger-800';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>SEO Score</span>
                    <Badge className={getScoreBadge(analysis.score)}>
                        {analysis.score}/100
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-wt-text-muted/50 dark:text-wt-text-muted/50">Overall Score</span>
                        <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                            {analysis.score}
                        </span>
                    </div>
                    <Progress value={analysis.score} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-wt-text-muted/50 dark:text-wt-text-muted/50">Words:</span>
                        <span className="ml-2 font-medium">{analysis.wordCount}</span>
                    </div>
                    <div>
                        <span className="text-wt-text-muted/50 dark:text-wt-text-muted/50">Characters:</span>
                        <span className="ml-2 font-medium">{analysis.charCount.toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="text-wt-text-muted/50 dark:text-wt-text-muted/50">H2 Headings:</span>
                        <span className="ml-2 font-medium">{analysis.h2Count}</span>
                    </div>
                    <div>
                        <span className="text-wt-text-muted/50 dark:text-wt-text-muted/50">Links:</span>
                        <span className="ml-2 font-medium">{analysis.linkCount}</span>
                    </div>
                </div>

                <div className="space-y-2 pt-2 border-t">
                    <h4 className="text-sm font-semibold">SEO Checks</h4>
                    {analysis.checks.map((check, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                            {check.passed ? (
                                <CheckCircle2 className="w-4 h-4 text-wt-gold mt-0.5 flex-shrink-0" />
                            ) : (
                                <XCircle className="w-4 h-4 text-danger-600 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                                <span className="font-medium">{check.label}:</span>
                                <span className="ml-2 text-wt-text-muted/50 dark:text-wt-text-muted/50">{check.message}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {analysis.score < 80 && (
                    <div className="pt-2 border-t">
                        <div className="flex items-start gap-2 text-sm text-accent-700 bg-accent-50 p-3 rounded">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                                <strong>Improve SEO:</strong> Focus on the failed checks above to increase your score.
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
















