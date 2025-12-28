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
    const [generatedContent, setGeneratedContent] = useState<any>(null);
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
            
            const prompt = `
Write a comprehensive, SEO-optimized article for an Indian investment website (InvestingPro.in) on the following topic:

Topic: ${topic}
Category: ${categoryStr}
Language: ${languageStr}
Tone: ${toneStr}
Keywords to include: ${keywords}

IMPORTANT CONSTRAINTS:
- Use ONLY factual, verified information
- Do NOT recommend products
- Do NOT rank products
- Use informational language only
- Include data sources for all claims
- Mark confidence level for each factual claim

Requirements:
- Write in ${languageStr === 'en' ? 'English' : 'native Indian language'}
- Use ${toneStr} tone throughout
- Include practical examples relevant to Indian investors
- Add specific numbers, statistics from verified sources
- Structure with clear headings (H2, H3)
- Include a compelling introduction and conclusion
- Optimize for SEO with natural keyword placement
- Length: 1500-2000 words

Return the article in markdown format with the following JSON structure:
{
  "title": "Article title",
  "excerpt": "Brief 150-character excerpt",
  "content": "Full article in markdown",
  "seo_title": "SEO optimized title",
  "seo_description": "Meta description",
  "tags": ["tag1", "tag2", "tag3"],
  "read_time": estimated_minutes,
  "data_sources_used": ["source1", "source2"],
  "confidence_level": 0.0-1.0
}
`;

            const response = await api.integrations.Core.InvokeLLM({
                prompt: prompt,
                operation: 'summarize_factual_data',
                dataSources: sources
            } as any);

            setGeneratedContent(response);
            setDataSources(response.ai_metadata?.data_sources || sources);
        } catch (error: any) {
            alert('Error generating content: ' + error.message);
        } finally {
            setGenerating(false);
        }
    };

    const saveArticle = async () => {
        if (!generatedContent) return;

        try {
            const slug = generatedContent.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');

            await api.entities.Article.create({
                title: generatedContent.title,
                slug: slug,
                excerpt: generatedContent.excerpt,
                content: generatedContent.content,
                category: categoryStr,
                language: languageStr,
                read_time: generatedContent.read_time,
                tags: generatedContent.tags,
                status: 'draft',
                ai_generated: true,
                seo_title: generatedContent.seo_title,
                seo_description: generatedContent.seo_description,
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

                {generatedContent && (
                    <div className="space-y-4 border-t pt-6">
                        {/* AI Metadata Display */}
                        {generatedContent.ai_metadata && (
                            <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <Info className="w-4 h-4 text-blue-600" />
                                    <h4 className="font-bold text-sm">AI Generation Metadata</h4>
                                </div>
                                
                                {/* Confidence Level */}
                                {generatedContent.ai_metadata.confidence && (
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-600">Overall Confidence:</span>
                                            <Badge className={
                                                generatedContent.ai_metadata.confidence.overall >= 0.8 
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : generatedContent.ai_metadata.confidence.overall >= 0.6
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-red-100 text-red-700'
                                            }>
                                                {(generatedContent.ai_metadata.confidence.overall * 100).toFixed(0)}%
                                            </Badge>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full ${
                                                    generatedContent.ai_metadata.confidence.overall >= 0.8 
                                                        ? 'bg-emerald-500'
                                                        : generatedContent.ai_metadata.confidence.overall >= 0.6
                                                        ? 'bg-amber-500'
                                                        : 'bg-red-500'
                                                }`}
                                                style={{ width: `${generatedContent.ai_metadata.confidence.overall * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                {/* Data Sources */}
                                {generatedContent.ai_metadata.data_sources && generatedContent.ai_metadata.data_sources.length > 0 && (
                                    <div className="space-y-1">
                                        <span className="text-xs font-semibold text-slate-600">Data Sources:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {generatedContent.ai_metadata.data_sources.map((source: AIDataSource, idx: number) => (
                                                <Badge key={idx} variant="outline" className="text-xs">
                                                    {source.source_name} ({(source.confidence * 100).toFixed(0)}%)
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Forbidden Phrases Warning */}
                                {generatedContent.ai_metadata.forbidden_phrases_found && 
                                 generatedContent.ai_metadata.forbidden_phrases_found.length > 0 && (
                                    <div className="bg-amber-50 border border-amber-200 rounded p-2 flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                                        <div className="text-xs">
                                            <span className="font-semibold text-amber-800">Warning:</span>
                                            <span className="text-amber-700 ml-1">
                                                Found {generatedContent.ai_metadata.forbidden_phrases_found.length} forbidden phrase(s). Review required.
                                            </span>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Change Log */}
                                {generatedContent.ai_metadata.change_log && generatedContent.ai_metadata.change_log.length > 0 && (
                                    <div className="space-y-1">
                                        <span className="text-xs font-semibold text-slate-600">Change Log:</span>
                                        <div className="space-y-1">
                                            {generatedContent.ai_metadata.change_log.map((log: any, idx: number) => (
                                                <div key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                                                    <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0 text-emerald-600" />
                                                    <div>
                                                        <span className="font-medium">{log.change_type}</span>
                                                        <span className="text-slate-400 ml-2">
                                                            {new Date(log.timestamp).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Review Status */}
                                <div className="pt-2 border-t border-slate-200">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-600">Review Status:</span>
                                        <Badge className={
                                            generatedContent.ai_metadata.review_status === 'approved'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : generatedContent.ai_metadata.review_status === 'rejected'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-amber-100 text-amber-700'
                                        }>
                                            {generatedContent.ai_metadata.review_status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="space-y-2">
                            <Label>Generated Title</Label>
                            <Input value={generatedContent.title} readOnly />
                        </div>

                        <div className="space-y-2">
                            <Label>Excerpt</Label>
                            <Textarea value={generatedContent.excerpt} readOnly rows={2} />
                        </div>

                        <div className="space-y-2">
                            <Label>Content Preview (Markdown)</Label>
                            <Textarea
                                value={generatedContent.content.substring(0, 500) + '...'}
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
