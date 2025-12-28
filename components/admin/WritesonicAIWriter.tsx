"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { structuredToMarkdown } from "@/types/structured-content";
import {
    Sparkles,
    Loader2,
    FileText,
    ShoppingBag,
    HelpCircle,
    Type,
    FileCheck,
    PenTool,
    Expand,
    RefreshCw,
    Search,
    Copy,
    Save,
    TrendingUp,
    BookOpen,
    Target,
    Zap,
    CheckCircle2,
    AlertCircle,
    Info
} from "lucide-react";

// Content Types
const CONTENT_TYPES = [
    { id: 'blog-post', label: 'Blog Post', icon: FileText, description: 'Full-length articles with SEO optimization' },
    { id: 'product-description', label: 'Product Description', icon: ShoppingBag, description: 'Compelling product copy' },
    { id: 'faq', label: 'FAQ Section', icon: HelpCircle, description: 'Comprehensive Q&A sections' },
    { id: 'headlines', label: 'Headlines', icon: Type, description: '10+ SEO-optimized headlines' },
    { id: 'meta-description', label: 'Meta Description', icon: FileCheck, description: '5 variations for SEO' },
    { id: 'introduction', label: 'Introduction', icon: PenTool, description: 'Compelling article intros' },
    { id: 'conclusion', label: 'Conclusion', icon: CheckCircle2, description: 'Strong closing sections' },
    { id: 'expand', label: 'Expand Content', icon: Expand, description: 'Enhance existing content' },
    { id: 'rewrite', label: 'Rewrite Content', icon: RefreshCw, description: 'Improve tone and readability' },
    { id: 'seo-optimize', label: 'SEO Optimize', icon: Search, description: 'Optimize existing content for search' },
];

// Content Frameworks
const FRAMEWORKS = [
    { value: 'none', label: 'No Framework' },
    { value: 'aida', label: 'AIDA (Attention, Interest, Desire, Action)' },
    { value: 'pas', label: 'PAS (Problem, Agitate, Solution)' },
    { value: 'bab', label: 'BAB (Before, After, Bridge)' },
    { value: 'how-to', label: 'How-To Guide' },
    { value: 'comparison', label: 'Comparison' },
    { value: 'list', label: 'List Article (Top 10, Best 5)' },
    { value: 'case-study', label: 'Case Study' },
];

// Content Styles
const CONTENT_STYLES = [
    { value: 'investopedia', label: 'Investopedia', description: 'Educational, authoritative' },
    { value: 'nerdwallet', label: 'NerdWallet', description: 'Practical, comparison-focused' },
    { value: 'hybrid', label: 'Hybrid', description: 'Best of both' },
];

// Tones
const TONES = [
    'Professional', 'Conversational', 'Friendly', 'Expert', 
    'Beginner-Friendly', 'Persuasive', 'Informative'
];

// Languages
const LANGUAGES = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' },
];

// Categories
const CATEGORIES = [
    'mutual-funds', 'stocks', 'insurance', 'loans',
    'credit-cards', 'tax-planning', 'retirement', 'investing-basics'
];

export default function WritesonicAIWriter() {
    const [contentStyle, setContentStyle] = useState('hybrid');
    const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
    const [showTemplates, setShowTemplates] = useState(false);
    const [bulkMode, setBulkMode] = useState(false);
    
    // Input states
    const [topic, setTopic] = useState('');
    const [existingContent, setExistingContent] = useState('');
    const [keywords, setKeywords] = useState('');
    const [tone, setTone] = useState('Professional');
    const [category, setCategory] = useState('investing-basics');
    const [language, setLanguage] = useState('en');
    const [framework, setFramework] = useState('none');
    const [wordCount, setWordCount] = useState('1500');
    
    // Generation states
    const [generating, setGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<any>(null);
    const [seoScore, setSeoScore] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const calculateSEOScore = (content: string, keywords: string): number => {
        if (!content || !keywords) return 0;
        const keywordList = keywords.toLowerCase().split(',').map(k => k.trim());
        let score = 0;
        
        // Keyword presence (40 points)
        const contentLower = content.toLowerCase();
        keywordList.forEach(keyword => {
            if (contentLower.includes(keyword)) {
                score += 40 / keywordList.length;
            }
        });
        
        // Content length (20 points)
        if (content.length > 1500) score += 20;
        else if (content.length > 1000) score += 15;
        else if (content.length > 500) score += 10;
        
        // Headings (20 points)
        const headingMatches = (content.match(/^#{1,3}\s/gm) || []).length;
        if (headingMatches >= 3) score += 20;
        else if (headingMatches >= 2) score += 15;
        else if (headingMatches >= 1) score += 10;
        
        // Readability (20 points) - simple check
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;
        if (avgSentenceLength >= 10 && avgSentenceLength <= 20) score += 20;
        else if (avgSentenceLength >= 8 && avgSentenceLength <= 25) score += 15;
        else score += 10;
        
        return Math.min(100, Math.round(score));
    };

    const generateContent = async () => {
        if (!selectedContentType) {
            toast.error('Please select a content type');
            return;
        }

        if (!topic.trim() && !existingContent.trim()) {
            toast.error('Please enter a topic or existing content');
            return;
        }

        setGenerating(true);
        setGeneratedContent(null);
        setSeoScore(null);

        try {
            let prompt = '';
            const basePrompt = `You are a financial content expert writing for InvestingPro.in, an Indian financial comparison platform.`;

            // Content style
            const stylePrompt = contentStyle === 'investopedia' 
                ? 'Write in an educational, authoritative style like Investopedia. Use technical terms appropriately and provide educational depth.'
                : contentStyle === 'nerdwallet'
                ? 'Write in a practical, comparison-focused style like NerdWallet. Focus on actionable advice and comparisons.'
                : 'Write in a balanced style that combines educational depth with practical advice.';

            // Framework prompt
            let frameworkPrompt = '';
            if (framework !== 'none') {
                switch (framework) {
                    case 'aida':
                        frameworkPrompt = 'Structure using AIDA: Attention (hook), Interest (benefits), Desire (value), Action (CTA).';
                        break;
                    case 'pas':
                        frameworkPrompt = 'Structure using PAS: Problem (identify issue), Agitate (amplify pain), Solution (provide answer).';
                        break;
                    case 'bab':
                        frameworkPrompt = 'Structure using BAB: Before (current state), After (desired state), Bridge (how to get there).';
                        break;
                    case 'how-to':
                        frameworkPrompt = 'Structure as a step-by-step how-to guide with clear instructions.';
                        break;
                    case 'comparison':
                        frameworkPrompt = 'Structure as a comparison article with pros/cons and recommendations.';
                        break;
                    case 'list':
                        frameworkPrompt = 'Structure as a list article (e.g., Top 10, Best 5) with numbered items.';
                        break;
                    case 'case-study':
                        frameworkPrompt = 'Structure as a case study with real-world examples and analysis.';
                        break;
                }
            }

            // Content type specific prompts
            switch (selectedContentType) {
                case 'blog-post':
                    // Use structured JSON API endpoint for blog posts
                    // This will be handled separately below
                    prompt = `${basePrompt} ${stylePrompt} ${frameworkPrompt}
Write a comprehensive blog post on: ${topic}
Category: ${category}
Tone: ${tone}
Language: ${language}
Word Count: ${wordCount} words
Keywords to include: ${keywords}

Requirements:
- SEO-optimized with natural keyword placement
- Clear headings (H2, H3)
- Practical examples relevant to Indian investors
- Actionable insights
- Compelling introduction and conclusion`;
                    break;
                case 'headlines':
                    prompt = `${basePrompt}
Generate 10 SEO-optimized headline variations for: ${topic}
Keywords: ${keywords}
Tone: ${tone}
Each headline should be:
- 50-70 characters
- Include primary keyword
- Compelling and click-worthy
- SEO-friendly`;
                    break;
                case 'faq':
                    prompt = `${basePrompt} ${stylePrompt}
Generate 8-10 comprehensive FAQs about: ${topic}
Category: ${category}
Each FAQ should have:
- Clear, specific question
- Detailed, helpful answer (100-200 words)
- Relevant to Indian context`;
                    break;
                case 'meta-description':
                    prompt = `${basePrompt}
Generate 5 SEO-optimized meta descriptions (150-160 characters) for: ${topic}
Keywords: ${keywords}
Each should be unique and compelling`;
                    break;
                case 'introduction':
                    prompt = `${basePrompt} ${stylePrompt}
Write a compelling introduction (150-200 words) for an article about: ${topic}
Tone: ${tone}
Should hook the reader and introduce the topic`;
                    break;
                case 'conclusion':
                    prompt = `${basePrompt} ${stylePrompt}
Write a strong conclusion (150-200 words) for an article about: ${topic}
Tone: ${tone}
Should summarize key points and provide a call-to-action`;
                    break;
                case 'expand':
                    prompt = `${basePrompt} ${stylePrompt}
Expand and enhance this content with more depth, examples, and details:
${existingContent}
Target: ${wordCount} words
Add statistics, examples, and actionable insights`;
                    break;
                case 'rewrite':
                    prompt = `${basePrompt}
Rewrite this content to improve tone (${tone}) and readability:
${existingContent}
Make it more engaging and professional`;
                    break;
                case 'seo-optimize':
                    prompt = `${basePrompt}
Optimize this content for SEO:
${existingContent}
Keywords: ${keywords}
Improve keyword placement, add headings, enhance readability`;
                    break;
                case 'product-description':
                    prompt = `${basePrompt} ${stylePrompt}
Write a compelling product description for: ${topic}
Tone: ${tone}
Include features, benefits, and value proposition`;
                    break;
            }

            // For blog-post, use structured JSON API endpoint
            if (selectedContentType === 'blog-post') {
                try {
                    const apiResponse = await fetch('/api/articles/generate-comprehensive', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            topic,
                            category,
                            targetKeywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
                            targetAudience: 'general',
                            contentLength: wordCount >= 2000 ? 'comprehensive' : wordCount >= 1500 ? 'detailed' : 'standard',
                            wordCount: parseInt(wordCount),
                            language,
                            tone,
                        }),
                    });

                    if (!apiResponse.ok) {
                        throw new Error(`API error: ${apiResponse.status}`);
                    }

                    const data = await apiResponse.json();
                    if (data.success && data.article) {
                        // Store the full article response (includes structured_content)
                        const preview = data.article.structured_content 
                            ? structuredToMarkdown(data.article.structured_content)
                            : data.article.content || '';
                        
                        setGeneratedContent({
                            type: 'structured',
                            article: data.article,
                            preview: preview
                        });
                    } else {
                        throw new Error(data.error || 'Article generation failed');
                    }
                } catch (error: any) {
                    toast.error('Error generating article: ' + error.message);
                    setGenerating(false);
                    return;
                }
            } else {
                // For other content types, use direct API call
                const response = await api.integrations.Core.InvokeLLM({
                    prompt: prompt,
                    operation: 'summarize_factual_data', // Using allowed operation
                    dataSources: []
                });

                // Handle response - API returns structured object with content property
                let content = '';
                if (response && typeof response === 'object') {
                    // Extract content from structured response
                    if (selectedContentType === 'headlines') {
                        // For headlines, try to parse as array or extract from content
                        if (Array.isArray(response.content)) {
                            content = response.content.join('\n\n');
                        } else if (response.content) {
                            // If content is a string, use it directly
                            content = response.content;
                        } else if (response.title) {
                            // Sometimes response has title instead
                            content = response.title;
                        } else {
                            // Fallback: stringify the whole response
                            content = JSON.stringify(response, null, 2);
                        }
                    } else {
                        // For other content types, extract content field
                        content = response.content || response.text || response.title || JSON.stringify(response, null, 2);
                    }
                } else if (typeof response === 'string') {
                    content = response;
                } else {
                    content = JSON.stringify(response, null, 2);
                }

                setGeneratedContent({
                    type: 'simple',
                    content: content
                });
            }
            
            // Calculate SEO score for relevant content types (after content is set)
            // This will be recalculated when generatedContent changes
        } catch (error: any) {
            toast.error('Error generating content: ' + error.message);
        } finally {
            setGenerating(false);
        }
    };

    const handleCopy = () => {
        if (generatedContent) {
            const contentToCopy = typeof generatedContent === 'object' && generatedContent.type === 'structured'
                ? generatedContent.preview
                : (typeof generatedContent === 'object' ? generatedContent.content : generatedContent || '');
            navigator.clipboard.writeText(contentToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSave = async () => {
        if (!generatedContent || !topic) {
            toast.error('Please generate content first');
            return;
        }

        // Only blog-post can be saved as article
        if (selectedContentType !== 'blog-post') {
            toast.error('Only blog posts can be saved as articles');
            return;
        }

        try {
            // Handle structured content
            if (typeof generatedContent === 'object' && generatedContent.type === 'structured' && generatedContent.article) {
                const article = generatedContent.article;
                
                const content = article.structured_content
                    ? structuredToMarkdown(article.structured_content)
                    : article.content || '';

                await api.entities.Article.create({
                    title: article.title || topic,
                    slug: article.slug || topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
                    excerpt: article.excerpt || '',
                    content: content,
                    category: category,
                    language: language,
                    status: 'draft',
                    ai_generated: true,
                    seo_title: article.seo_title,
                    seo_description: article.meta_description,
                    tags: article.tags || [],
                });
            } else {
                // Fallback for non-structured content
                const content = typeof generatedContent === 'object' ? generatedContent.content : generatedContent || '';
                const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                await api.entities.Article.create({
                    title: topic,
                    slug: slug,
                    excerpt: content.substring(0, 150),
                    content: content,
                    category: category,
                    language: language,
                    status: 'draft',
                    ai_generated: true,
                });
            }
            toast.success('Article saved as draft successfully!');
        } catch (error: any) {
            toast.error('Error saving article: ' + error.message);
        }
    };

    const selectedType = CONTENT_TYPES.find(t => t.id === selectedContentType);

    // Calculate SEO score when content changes
    useEffect(() => {
        if (generatedContent && ['blog-post', 'seo-optimize', 'expand'].includes(selectedContentType || '')) {
            const contentForScore = typeof generatedContent === 'object' && generatedContent.type === 'structured'
                ? generatedContent.preview
                : (typeof generatedContent === 'object' ? generatedContent.content : generatedContent || '');
            const score = calculateSEOScore(contentForScore, keywords);
            setSeoScore(score);
        }
    }, [generatedContent, selectedContentType, keywords]);

    return (
        <div className="space-y-6">
            {/* Content Style Selector */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        Content Style
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        {CONTENT_STYLES.map((style) => (
                            <button
                                key={style.value}
                                onClick={() => setContentStyle(style.value)}
                                className={`p-4 rounded-lg border-2 transition-all text-left ${
                                    contentStyle === style.value
                                        ? 'border-purple-600 bg-purple-50'
                                        : 'border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                <div className="font-semibold text-slate-900 mb-1">{style.label}</div>
                                <div className="text-sm text-slate-600">{style.description}</div>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Content Type Selector */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-blue-600" />
                            Content Type
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowTemplates(!showTemplates)}
                            >
                                {showTemplates ? 'Hide' : 'Show'} Templates
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setBulkMode(!bulkMode)}
                            >
                                {bulkMode ? 'Single' : 'Bulk'} Mode
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {CONTENT_TYPES.map((type) => {
                            const Icon = type.icon;
                            return (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedContentType(type.id)}
                                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                                        selectedContentType === type.id
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-slate-200 hover:border-slate-300'
                                    }`}
                                    title={type.description}
                                >
                                    <Icon className={`w-6 h-6 mx-auto mb-2 ${
                                        selectedContentType === type.id ? 'text-blue-600' : 'text-slate-500'
                                    }`} />
                                    <div className={`text-sm font-medium ${
                                        selectedContentType === type.id ? 'text-blue-900' : 'text-slate-700'
                                    }`}>
                                        {type.label}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Input Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Input</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {bulkMode ? (
                        <div className="space-y-2">
                            <Label>Topics (one per line)</Label>
                            <Textarea
                                placeholder="Best SIP Plans for Retirement&#10;Credit Card Benefits Explained&#10;Tax Saving Investment Options"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                rows={6}
                            />
                        </div>
                    ) : (
                        <>
                            {['expand', 'rewrite', 'seo-optimize'].includes(selectedContentType || '') ? (
                                <div className="space-y-2">
                                    <Label>Existing Content</Label>
                                    <Textarea
                                        placeholder="Paste your existing content here..."
                                        value={existingContent}
                                        onChange={(e) => setExistingContent(e.target.value)}
                                        rows={8}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label>Topic</Label>
                                    <Input
                                        placeholder="e.g., Best SIP Plans for Retirement in 2024"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList>
                            <TabsTrigger value="basic">Basic</TabsTrigger>
                            <TabsTrigger value="advanced">Advanced</TabsTrigger>
                        </TabsList>
                        <TabsContent value="basic" className="space-y-4 mt-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Keywords (comma separated)</Label>
                                    <Input
                                        placeholder="SIP, mutual funds, retirement planning"
                                        value={keywords}
                                        onChange={(e) => setKeywords(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tone</Label>
                                    <Select value={tone} onValueChange={setTone}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TONES.map(t => (
                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map(cat => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {selectedContentType === 'blog-post' && (
                                    <div className="space-y-2">
                                        <Label>Word Count</Label>
                                        <Select value={wordCount} onValueChange={setWordCount}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="500">500 words</SelectItem>
                                                <SelectItem value="1000">1000 words</SelectItem>
                                                <SelectItem value="1500">1500 words</SelectItem>
                                                <SelectItem value="2000">2000 words</SelectItem>
                                                <SelectItem value="2500">2500+ words</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="advanced" className="space-y-4 mt-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Framework</Label>
                                    <Select value={framework} onValueChange={setFramework}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {FRAMEWORKS.map(f => (
                                                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Language</Label>
                                    <Select value={language} onValueChange={setLanguage}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {LANGUAGES.map(lang => (
                                                <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <Button
                        onClick={generateContent}
                        disabled={!selectedContentType || generating || (!topic.trim() && !existingContent.trim())}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                        {generating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate Content
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Generated Content */}
            {generatedContent && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Generated Content</CardTitle>
                            <div className="flex gap-2">
                                {seoScore !== null && (
                                    <Badge className={
                                        seoScore >= 80 ? 'bg-emerald-100 text-emerald-700' :
                                        seoScore >= 60 ? 'bg-amber-100 text-amber-700' :
                                        'bg-red-100 text-red-700'
                                    }>
                                        SEO: {seoScore}/100
                                    </Badge>
                                )}
                                <Button variant="outline" size="sm" onClick={handleCopy}>
                                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                                <Button size="sm" onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                                    <Save className="w-4 h-4 mr-2" />
                                    Save as Draft
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="prose max-w-none">
                            <pre className="whitespace-pre-wrap font-sans text-sm bg-slate-50 p-4 rounded-lg border">
                                {typeof generatedContent === 'object' && generatedContent.type === 'structured'
                                    ? generatedContent.preview
                                    : (typeof generatedContent === 'object' ? generatedContent.content : generatedContent || '')}
                            </pre>
                        </div>
                        {seoScore !== null && seoScore < 80 && (
                            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                                    <div>
                                        <div className="font-semibold text-amber-900 mb-1">SEO Recommendations</div>
                                        <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                                            {seoScore < 60 && <li>Add more keywords naturally throughout the content</li>}
                                            {seoScore < 70 && <li>Include more headings (H2, H3) for better structure</li>}
                                            {seoScore < 80 && <li>Expand content length for better SEO performance</li>}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Model Information */}
            <Card className="bg-slate-50">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                            <div className="font-semibold text-slate-900 mb-1">AI Model Information</div>
                            <div className="text-sm text-slate-600 space-y-1">
                                <p><strong>Model:</strong> GPT-4o-mini (Financial Expert Training)</p>
                                <p><strong>Training:</strong> Specialized prompts for Indian financial content</p>
                                <p><strong>Expertise:</strong> Mutual Funds, Stocks, Insurance, Loans, Tax Planning</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
