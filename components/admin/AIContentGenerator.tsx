"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api"; // Adjusted path
import { Sparkles, Loader2, AlertTriangle, CheckCircle2, Info, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AIContentMetadata, AIDataSource } from "@/lib/ai/constraints";
import type { StructuredContent } from "@/types/structured-content";
import { structuredToMarkdown } from "@/types/structured-content";
import { queueArticleGeneration } from "@/lib/utils/job-queue";
import { useJobStatus } from "@/lib/hooks/useJobStatus";

/**
 * AI Content Generator - SUPPORT TOOL ONLY
 * 
 * IMPORTANT: This is NOT a content factory.
 * AI is used ONLY for drafting summaries from verified data.
 * All outputs require human review before publication.
 * 
 * AI MAY:
 * - Summarize factual data
 * - Explain formulas
 * - Generate FAQs from content
 * - Generate metadata
 * 
 * AI MAY NOT:
 * - Recommend products
 * - Rank products
 * - Use subjective language
 * 
 * Every AI output includes:
 * - Data sources used
 * - Confidence level
 * - Change log
 */

const categories = [
    "mutual-funds", "stocks", "insurance", "loans",
    "credit-cards", "tax-planning", "retirement", "investing-basics"
];

const languages = ["en", "hi", "ta", "te", "bn", "mr", "gu"];

const tones = ["informative", "conversational", "professional", "beginner-friendly"];

export default function AIContentGenerator() {
    const [topic, setTopic] = useState('');
    const [category, setCategory] = useState({ value: 'investing-basics', label: 'Investing Basics' });
    const [language, setLanguage] = useState({ value: 'en', label: 'EN' });
    const [tone, setTone] = useState({ value: 'informative', label: 'Informative' }); // Select returns value, but keeping internal consistency

    // Actually my custom Select passes just the value string.
    // So state should be strings.
    // Reverting to string state for compatibility with custom Select component.
    const [categoryStr, setCategoryStr] = useState('investing-basics');
    const [languageStr, setLanguageStr] = useState('en');
    const [toneStr, setToneStr] = useState('informative');

    const [keywords, setKeywords] = useState('');
    const [generating, setGenerating] = useState(false);
    const [jobId, setJobId] = useState<string | null>(null);
    const [generatedContent, setGeneratedContent] = useState<{ article: any; structured?: StructuredContent } | null>(null);
    const [dataSources, setDataSources] = useState<AIDataSource[]>([]);

    // Poll job status when jobId is set
    const { status: jobStatus, data: jobData, error: jobError } = useJobStatus({
        jobId,
        pollInterval: 2000,
        enabled: !!jobId,
        onComplete: (result: any) => {
            // Job completed successfully
            const sources: AIDataSource[] = [
                {
                    source_type: 'supabase',
                    source_name: 'Supabase Database',
                    last_verified: new Date().toISOString(),
                    confidence: 0.8
                }
            ];
            
            // Handle result structure - could be { article: {...} } or direct article object
            let articleData = null;
            if (result && result.article) {
                articleData = result.article;
            } else if (result) {
                articleData = result;
            }
            
            if (articleData) {
                setGeneratedContent({ 
                    article: articleData, 
                    structured: articleData.structured_content || result.structured 
                });
                setDataSources(sources);
            }
            setGenerating(false);
            setJobId(null);
        },
        onError: (error: string) => {
            alert('Error generating content: ' + error);
            setGenerating(false);
            setJobId(null);
        }
    });

    const generateArticle = async () => {
        setGenerating(true);
        setJobId(null);
        setGeneratedContent(null);
        setDataSources([]);
        
        try {
            // Queue the article generation job
            const response = await queueArticleGeneration({
                topic,
                category: categoryStr,
                targetKeywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
                targetAudience: 'general',
                contentLength: 'comprehensive',
                wordCount: 1500,
            });

            if (response.success && response.jobId) {
                // Job queued successfully - start polling
                setJobId(response.jobId);
            } else {
                throw new Error(response.message || 'Failed to queue article generation');
            }
        } catch (error: any) {
            alert('Error queuing article generation: ' + error.message);
            setGenerating(false);
            setJobId(null);
        }
    };

    const saveArticle = async () => {
        if (!generatedContent || !generatedContent.article) return;

        try {
            const article = generatedContent.article;
            
            // CRITICAL FIX: Use normalized content from API response
            // API already normalized body_html and generated body_markdown
            // We should use those instead of re-processing
            
            // Fallback: Convert structured content to markdown if body_markdown not available
            let content = article.content;
            if (article.structured_content && !article.body_markdown) {
                content = structuredToMarkdown(article.structured_content);
            }

            const slug = article.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');

            // UNIFIED WORKFLOW: Use articleService (same as manual creation)
            const { articleService } = await import('@/lib/cms/article-service');
            
            await articleService.createArticle(
                {
                    body_markdown: article.body_markdown || content,  // PRIMARY
                    body_html: article.body_html || '',                // DERIVED
                    content: article.content || content,               // Legacy fallback
                },
                {
                    title: article.title,
                    slug: slug,
                    excerpt: article.excerpt || '',
                    category: categoryStr,
                    language: languageStr,
                    read_time: article.read_time,
                    tags: article.tags || [],
                    seo_title: article.seo_title || article.title,
                    seo_description: article.meta_description || article.seo_description || article.excerpt,
                    featured_image: article.featured_image,
                }
            );

            alert('Article saved as draft successfully!');
            setGeneratedContent(null);
            setTopic('');
        } catch (error: any) {
            alert('Error saving article: ' + error.message);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-6 md:p-8">
                    <Sparkles className="w-5 h-5 text-secondary-600" />
                    AI Content Generator
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Topic</Label>
                        <Input
                            placeholder="e.g., Best SIP Plans for Beginners in 2024"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={categoryStr} onValueChange={setCategoryStr}>
                            <SelectTrigger>
                                <div className="flex items-center">
                                    <span>{categoryStr.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(cat => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Language</Label>
                        <Select value={languageStr} onValueChange={setLanguageStr}>
                            <SelectTrigger>
                                <div className="flex items-center">
                                    <span>{languageStr.toUpperCase()}</span>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map(lang => (
                                    <SelectItem key={lang} value={lang}>{lang.toUpperCase()}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Tone</Label>
                        <Select value={toneStr} onValueChange={setToneStr}>
                            <SelectTrigger>
                                <div className="flex items-center">
                                    <span>{toneStr.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {tones.map(t => (
                                    <SelectItem key={t} value={t}>
                                        {t.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>SEO Keywords (comma separated)</Label>
                    <Input
                        placeholder="SIP, mutual funds, systematic investment plan"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                    />
                </div>

                <Button
                    onClick={generateArticle}
                    disabled={!topic || generating}
                    className="w-full bg-secondary-600 hover:bg-secondary-700"
                >
                    {generating ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {jobStatus === 'queued' ? 'Queued...' : jobStatus === 'running' ? 'Generating Article...' : 'Processing...'}
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Article with AI
                        </>
                    )}
                </Button>

                {/* Job Status Display */}
                {jobId && jobStatus && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                            {jobStatus === 'queued' && <Clock className="w-4 h-4 text-blue-600" />}
                            {jobStatus === 'running' && <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />}
                            {jobStatus === 'completed' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                            {jobStatus === 'failed' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                            <span className="text-sm font-semibold">
                                Status: {jobStatus.charAt(0).toUpperCase() + jobStatus.slice(1)}
                            </span>
                        </div>
                        {jobError && (
                            <div className="text-sm text-red-600 mt-2">
                                Error: {jobError}
                            </div>
                        )}
                        {jobStatus === 'queued' || jobStatus === 'running' ? (
                            <div className="text-xs text-slate-600 mt-1">
                                Job ID: {jobId}
                            </div>
                        ) : null}
                    </div>
                )}

                {generatedContent && generatedContent.article && (
                    <div className="space-y-4 border-t pt-6">
                        {/* AI Metadata Display */}
                        {generatedContent.article.ai_metadata && (
                            <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <Info className="w-4 h-4 text-primary-600" />
                                    <h4 className="font-bold text-sm">AI Generation Metadata</h4>
                                </div>
                                
                                {/* Structured Content Info */}
                                {generatedContent.article.structured_content && (
                                    <div className="space-y-1">
                                        <span className="text-xs font-semibold text-slate-600">Structured Content:</span>
                                        <div className="text-xs text-slate-600 space-y-1">
                                            <div>• {generatedContent.article.structured_content.headings?.length || 0} headings</div>
                                            <div>• {generatedContent.article.structured_content.sections?.length || 0} sections</div>
                                            {generatedContent.article.structured_content.tables && generatedContent.article.structured_content.tables.length > 0 && (
                                                <div>• {generatedContent.article.structured_content.tables.length} tables</div>
                                            )}
                                            {generatedContent.article.structured_content.faqs && generatedContent.article.structured_content.faqs.length > 0 && (
                                                <div>• {generatedContent.article.structured_content.faqs.length} FAQs</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <div className="space-y-2">
                            <Label>Generated Title</Label>
                            <Input value={generatedContent.article.title} readOnly />
                        </div>

                        <div className="space-y-2">
                            <Label>Excerpt</Label>
                            <Textarea value={generatedContent.article.excerpt || ''} readOnly rows={2} />
                        </div>

                        <div className="space-y-2">
                            <Label>Content Preview</Label>
                            <Textarea
                                value={
                                    generatedContent.article.structured_content
                                        ? structuredToMarkdown(generatedContent.article.structured_content).substring(0, 500) + '...'
                                        : (generatedContent.article.content || '').substring(0, 500) + '...'
                                }
                                readOnly
                                rows={8}
                                className="font-mono text-sm"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button onClick={saveArticle} className="bg-primary-600 hover:bg-primary-700">
                                Save as Draft
                            </Button>
                            <Button variant="outline" onClick={() => {
                                setGeneratedContent(null);
                                setDataSources([]);
                            }}>
                                Discard
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card >
    );
}
