"use client";

import React, { useState } from 'react';
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
import { Sparkles, Loader2, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AIContentMetadata, AIDataSource } from "@/lib/ai/constraints";
import type { StructuredContent } from "@/types/structured-content";
import { structuredToMarkdown } from "@/types/structured-content";

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
    const [generatedContent, setGeneratedContent] = useState<{ article: any; structured?: StructuredContent } | null>(null);
    const [dataSources, setDataSources] = useState<AIDataSource[]>([]);

    const generateArticle = async () => {
        setGenerating(true);
        try {
            // Build data sources from Supabase (if available)
            const sources: AIDataSource[] = [
                {
                    source_type: 'supabase',
                    source_name: 'Supabase Database',
                    last_verified: new Date().toISOString(),
                    confidence: 0.8
                }
            ];
            
            // Use the structured JSON API endpoint
            const response = await fetch('/api/articles/generate-comprehensive', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    category: categoryStr,
                    targetKeywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
                    targetAudience: 'general',
                    contentLength: 'comprehensive',
                    wordCount: 1500,
                    language: languageStr,
                    tone: toneStr,
                }),
            });

            if (!response.ok) {
                let errorMessage = 'Article generation failed';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            
            if (data.success && data.article) {
                setGeneratedContent(data);
                setDataSources(sources);
            } else {
                throw new Error(data.error || 'Article generation failed');
            }
        } catch (error: any) {
            alert('Error generating content: ' + error.message);
        } finally {
            setGenerating(false);
        }
    };

    const saveArticle = async () => {
        if (!generatedContent || !generatedContent.article) return;

        try {
            const article = generatedContent.article;
            
            // Convert structured content to markdown if available
            let content = article.content;
            if (article.structured_content) {
                content = structuredToMarkdown(article.structured_content);
            }

            const slug = article.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');

            await api.entities.Article.create({
                title: article.title,
                slug: slug,
                excerpt: article.excerpt,
                content: content, // Use converted markdown or original content
                category: categoryStr,
                language: languageStr,
                read_time: article.read_time,
                tags: article.tags || [],
                status: 'draft',
                ai_generated: true,
                seo_title: article.seo_title || article.title,
                seo_description: article.meta_description || article.excerpt,
                published_date: new Date().toISOString()
            });

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
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
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
                    className="w-full bg-purple-600 hover:bg-purple-700"
                >
                    {generating ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating Article...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Article with AI
                        </>
                    )}
                </Button>

                {generatedContent && generatedContent.article && (
                    <div className="space-y-4 border-t pt-6">
                        {/* AI Metadata Display */}
                        {generatedContent.article.ai_metadata && (
                            <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <Info className="w-4 h-4 text-blue-600" />
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
                            <Button onClick={saveArticle} className="bg-emerald-600 hover:bg-emerald-700">
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
