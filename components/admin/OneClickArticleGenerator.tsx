"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
    Sparkles,
    Zap,
    FileText,
    Search,
    TrendingUp,
    CheckCircle2,
    Loader2,
    ArrowRight,
    Eye,
    Save,
    Send,
    Target,
    BarChart3,
    Globe,
    Tag,
    Image as ImageIcon,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { structuredToMarkdown } from '@/types/structured-content';
import { Checkbox } from '@/components/ui/checkbox';
import { usePipeline } from '@/hooks/usePipeline';

import type { StructuredContent } from '@/types/structured-content';

interface GeneratedArticle {
    title: string;
    slug: string;
    content?: string; // Legacy format (markdown/HTML string)
    structured_content?: StructuredContent; // New structured format
    excerpt: string;
    seo_title: string;
    meta_description: string;
    keywords: string[];
    category: string;
    tags: string[];
    read_time: number;
    word_count: number;
    seo_score: number;
    status: 'draft' | 'published';
}

/**
 * OneClickArticleGenerator - Comprehensive AI Article Generator
 * 
 * Features:
 * - One-click complete SEO-optimized article generation
 * - Built-in SEO optimization
 * - Direct integration with editor
 * - One-click publish option
 * - Focused on financial content (InvestingPro)
 */
export default function OneClickArticleGenerator() {
    const router = useRouter();
    const [topic, setTopic] = useState('');
    const [category, setCategory] = useState('investing-basics');
    const [targetKeywords, setTargetKeywords] = useState('');
    const [targetAudience, setTargetAudience] = useState('general');
    const [contentLength, setContentLength] = useState('comprehensive');
    const [generating, setGenerating] = useState(false);
    const [generatedArticle, setGeneratedArticle] = useState<GeneratedArticle | null>(null);
    const [step, setStep] = useState<'input' | 'generating' | 'review' | 'publishing'>('input');
    const [runInBackground, setRunInBackground] = useState(false);
    const { triggerPipeline } = usePipeline();

    // Fetch categories
    const { data: categories = [] } = useQuery({
        queryKey: ['categories-for-generator'],
        queryFn: async () => {
            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('categories')
                    .select('*')
                    .order('name', { ascending: true });
                
                if (error) {
                    return [
                        { id: 'mutual-funds', name: 'Mutual Funds', slug: 'mutual-funds' },
                        { id: 'stocks', name: 'Stocks', slug: 'stocks' },
                        { id: 'insurance', name: 'Insurance', slug: 'insurance' },
                        { id: 'loans', name: 'Loans', slug: 'loans' },
                        { id: 'credit-cards', name: 'Credit Cards', slug: 'credit-cards' },
                        { id: 'tax-planning', name: 'Tax Planning', slug: 'tax-planning' },
                        { id: 'retirement', name: 'Retirement', slug: 'retirement' },
                        { id: 'investing-basics', name: 'Investing Basics', slug: 'investing-basics' },
                    ];
                }
                return Array.isArray(data) ? data : [];
            } catch (error) {
                return [];
            }
        },
        initialData: [],
    });

    // Generate comprehensive SEO-optimized article
    const generateArticle = async () => {
        if (!topic.trim()) {
            toast.error('Please enter a topic');
            return;
        }

        setGenerating(true);

        // Background Pipeline Mode
        if (runInBackground) {
            try {
                const keywords = targetKeywords.split(',').map(k => k.trim()).filter(Boolean);
                const wordCount = contentLength === 'comprehensive' ? 2000 : contentLength === 'detailed' ? 1500 : 1000;

                await triggerPipeline('generate_article', {
                    topic,
                    category,
                    targetKeywords: keywords,
                    targetAudience,
                    contentLength,
                    wordCount
                });
                
                toast.success('Article generation queued! Check the Automation tab to track progress.');
                reset(); // Reset form
            } catch (error: any) {
                // Error handled by hook
            } finally {
                setGenerating(false);
            }
            return;
        }

        setStep('generating');

        try {
            // Build comprehensive prompt for SEO-optimized article
            const keywords = targetKeywords.split(',').map(k => k.trim()).filter(Boolean);
            const wordCount = contentLength === 'comprehensive' ? 2000 : contentLength === 'detailed' ? 1500 : 1000;

            const prompt = `You are a senior financial content writer for InvestingPro.in, India's leading financial comparison platform (NerdWallet of India).

Generate a complete, SEO-optimized article about "${topic}" with the following requirements:

**Topic:** ${topic}
**Category:** ${category}
**Target Audience:** ${targetAudience === 'general' ? 'General Indian investors' : targetAudience === 'beginner' ? 'Beginner Indian investors' : 'Advanced Indian investors'}
**Target Keywords:** ${keywords.length > 0 ? keywords.join(', ') : 'Auto-generate relevant keywords'}
**Word Count:** ${wordCount} words
**Content Length:** ${contentLength}

**SEO Requirements:**
1. Create an SEO-optimized title (60 characters max, include primary keyword)
2. Write a compelling meta description (155 characters max, include primary keyword)
3. Use H2 and H3 headings naturally (include keywords where appropriate)
4. Include target keywords naturally throughout (keyword density 1-2%)
5. Use internal linking opportunities (mention related topics)
6. Include FAQ section with schema-ready format
7. Add relevant tags (5-8 tags)

**Content Structure:**
1. **Introduction** (150-200 words)
   - Hook that addresses reader's pain point
   - Brief overview of topic
   - What they'll learn

2. **Main Content** (${wordCount - 400} words)
   - Clear H2/H3 headings
   - Practical examples for Indian investors
   - Data-driven insights
   - Actionable advice
   - Use bullet points and numbered lists where appropriate

3. **FAQ Section** (5-8 questions)
   - Common questions about the topic
   - Detailed, helpful answers
   - Include schema markup hints

4. **Conclusion** (100-150 words)
   - Summarize key points
   - Call to action (e.g., "Use our calculator", "Compare products")
   - Next steps

**Writing Style:**
- Authoritative but accessible (like NerdWallet)
- Data-driven and factual
- Focus on Indian market context
- No financial advice (informational only)
- Use examples relevant to Indian investors
- Include specific numbers, statistics, and data points

**CRITICAL: You MUST respond with valid JSON only. No markdown, no code blocks, just pure JSON.**

**Output Format (JSON):**
{
  "title": "SEO-optimized title (60 chars max)",
  "seo_title": "SEO title for meta tag (60 chars max)",
  "meta_description": "Meta description (155 chars max)",
  "content": "Full article in HTML format with proper headings (<h2>, <h3>), paragraphs (<p>), lists (<ul>, <ol>), and formatting. Use proper HTML tags.",
  "excerpt": "150-character excerpt for preview",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "tags": ["tag1", "tag2", "tag3"],
  "read_time": estimated_minutes,
  "word_count": actual_word_count,
  "seo_score": 0-100
}

**IMPORTANT:**
- Return ONLY valid JSON
- Content must be in HTML format with proper tags
- Title must be 60 characters or less
- Meta description must be 155 characters or less
- Include at least 3 keywords
- Include at least 3 tags
- Word count must match content length requirement`;

            // Call AI service
            const response = await fetch('/api/articles/generate-comprehensive', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    category,
                    targetKeywords: keywords,
                    targetAudience,
                    contentLength,
                    wordCount,
                    prompt,
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
                // Validate article has content (either structured or plain)
                const hasContent = data.article.content || 
                                 (data.article.structured_content && data.article.structured_content.sections?.length > 0);
                
                if (!hasContent) {
                    throw new Error('Generated article has no content. Please try again.');
                }
                
                setGeneratedArticle(data.article);
                setStep('review');
                toast.success('Article generated successfully! Review and edit if needed.');
            } else {
                throw new Error(data.error || 'Article generation failed');
            }
        } catch (error: any) {
            console.error('Article generation error:', error);
            toast.error(`Generation failed: ${error.message || 'Unknown error. Please check your OpenAI API key and try again.'}`);
            setStep('input');
        } finally {
            setGenerating(false);
        }
    };

    // Save as draft and open in editor
    const saveAndEdit = async () => {
        if (!generatedArticle) return;

        setStep('publishing');
        try {
            // Validate required fields
            if (!generatedArticle.title) {
                throw new Error('Article title is required');
            }

            // Convert structured content to markdown if available
            let content = generatedArticle.content;
            if (generatedArticle.structured_content) {
                content = structuredToMarkdown(generatedArticle.structured_content);
            }

            if (!content || content.trim().length === 0) {
                throw new Error('Article content is required');
            }

            const article = await api.entities.Article.create({
                title: generatedArticle.title,
                slug: generatedArticle.slug,
                content: content,
                excerpt: generatedArticle.excerpt || generatedArticle.meta_description?.substring(0, 150),
                seo_title: generatedArticle.seo_title || generatedArticle.title,
                seo_description: generatedArticle.meta_description || generatedArticle.excerpt,
                category: generatedArticle.category || 'investing-basics',
                tags: generatedArticle.tags || [],
                status: 'draft',
                ai_generated: true,
                // Add fields for review queue
                is_user_submission: false, // AI-generated
                submission_status: 'pending', // Enforce strict review workflow
            });

            if (!article || !article.id) {
                throw new Error('Article creation failed: No article returned');
            }

            toast.success('Article saved! Opening editor...');
            router.push(`/admin/articles/${article.id}/edit`);
        } catch (error: any) {
            console.error('Article creation error:', error);
            toast.error(`Failed to save: ${error.message || 'Unknown error'}`);
            setStep('review');
        }
    };

    // Publish directly
    const publishDirectly = async () => {
        if (!generatedArticle) return;

        setStep('publishing');
        try {
            // Validate required fields
            if (!generatedArticle.title) {
                throw new Error('Article title is required');
            }

            // Convert structured content to markdown if available
            let content = generatedArticle.content;
            if (generatedArticle.structured_content) {
                content = structuredToMarkdown(generatedArticle.structured_content);
            }

            if (!content || content.trim().length === 0) {
                throw new Error('Article content is required');
            }

            const article = await api.entities.Article.create({
                title: generatedArticle.title,
                slug: generatedArticle.slug,
                content: content,
                excerpt: generatedArticle.excerpt || generatedArticle.meta_description?.substring(0, 150),
                seo_title: generatedArticle.seo_title || generatedArticle.title,
                seo_description: generatedArticle.meta_description || generatedArticle.excerpt,
                category: generatedArticle.category || 'investing-basics',
                tags: generatedArticle.tags || [],
                status: 'published',
                published_date: new Date().toISOString(),
                published_at: new Date().toISOString(), // Also set published_at for compatibility
                ai_generated: true,
                // Add fields for review queue
                is_user_submission: false,
                submission_status: 'approved', // Auto-approve published AI content
            });

            if (!article || !article.id) {
                throw new Error('Article creation failed: No article returned');
            }

            toast.success('Article published successfully!');
            router.push(`/admin/articles/${article.id}/edit`);
        } catch (error: any) {
            console.error('Article publish error:', error);
            toast.error(`Failed to publish: ${error.message || 'Unknown error'}`);
            setStep('review');
        }
    };

    // Reset and start over
    const reset = () => {
        setTopic('');
        setTargetKeywords('');
        setGeneratedArticle(null);
        setStep('input');
    };

    return (
        <div className="space-y-6">
            {/* Input Step */}
            {step === 'input' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-6 md:p-8">
                            <Zap className="w-6 h-6 text-primary-600" />
                            One-Click SEO Article Generator
                        </CardTitle>
                        <p className="text-sm text-slate-600 mt-2">
                            Generate complete, SEO-optimized articles in one click. Perfect for financial content.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Topic Input */}
                        <div>
                            <Label htmlFor="topic" className="text-base font-semibold">
                                Article Topic / Keyword *
                            </Label>
                            <Input
                                id="topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Best SIP Plans for 2025, Credit Card Comparison Guide"
                                className="mt-2 text-lg"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        generateArticle();
                                    }
                                }}
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Enter the main topic or primary keyword for your article
                            </p>
                        </div>

                        {/* Category */}
                        <div>
                            <Label htmlFor="category" className="text-base font-semibold">
                                Category
                            </Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="mt-2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.length > 0 ? (
                                        categories.map((cat: any) => (
                                            <SelectItem key={cat.id || cat.slug} value={cat.slug || cat.name}>
                                                {cat.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <>
                                            <SelectItem value="mutual-funds">Mutual Funds</SelectItem>
                                            <SelectItem value="stocks">Stocks</SelectItem>
                                            <SelectItem value="insurance">Insurance</SelectItem>
                                            <SelectItem value="loans">Loans</SelectItem>
                                            <SelectItem value="credit-cards">Credit Cards</SelectItem>
                                            <SelectItem value="tax-planning">Tax Planning</SelectItem>
                                            <SelectItem value="retirement">Retirement</SelectItem>
                                            <SelectItem value="investing-basics">Investing Basics</SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Target Keywords */}
                        <div>
                            <Label htmlFor="keywords" className="text-base font-semibold">
                                Target Keywords (Optional)
                            </Label>
                            <Input
                                id="keywords"
                                value={targetKeywords}
                                onChange={(e) => setTargetKeywords(e.target.value)}
                                placeholder="e.g., SIP investment, mutual funds, tax saving"
                                className="mt-2"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Comma-separated keywords. Leave empty for auto-generation.
                            </p>
                        </div>

                        {/* Target Audience */}
                        <div>
                            <Label htmlFor="audience" className="text-base font-semibold">
                                Target Audience
                            </Label>
                            <Select value={targetAudience} onValueChange={setTargetAudience}>
                                <SelectTrigger className="mt-2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">General Investors</SelectItem>
                                    <SelectItem value="beginner">Beginner Investors</SelectItem>
                                    <SelectItem value="advanced">Advanced Investors</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Content Length */}
                        <div>
                            <Label htmlFor="length" className="text-base font-semibold">
                                Content Length
                            </Label>
                            <Select value={contentLength} onValueChange={setContentLength}>
                                <SelectTrigger className="mt-2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="comprehensive">Comprehensive (2000 words)</SelectItem>
                                    <SelectItem value="detailed">Detailed (1500 words)</SelectItem>
                                    <SelectItem value="standard">Standard (1000 words)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Background Option */}
                        <div className="flex items-center space-x-2 py-2">
                            <Checkbox 
                                id="background-mode" 
                                checked={runInBackground} 
                                onCheckedChange={(checked) => setRunInBackground(checked as boolean)}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label 
                                    htmlFor="background-mode" 
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Generate in Background (Pipeline)
                                </Label>
                                <p className="text-xs text-slate-500">
                                    Recommended for comprehensive articles. You can close this window and track progress in Automation tab.
                                </p>
                            </div>
                        </div>

                        {/* Generate Button */}
                        <Button
                            onClick={generateArticle}
                            disabled={!topic.trim() || generating}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white h-12 text-lg font-semibold"
                            size="lg"
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    {runInBackground ? 'Start Background Generation' : 'Generate Complete SEO Article'}
                                </>
                            )}
                        </Button>

                        <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t">
                            <CheckCircle2 className="w-4 h-4 text-primary-600" />
                            <span>Includes: Title, Meta Description, Content, Keywords, Tags, SEO Analysis</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Generating Step */}
            {step === 'generating' && (
                <Card>
                    <CardContent className="p-6 md:p-8 text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Generating Your Article</h3>
                        <p className="text-slate-600 mb-4">
                            Creating a complete, SEO-optimized article about "{topic}"
                        </p>
                        <div className="space-y-2 max-w-md mx-auto">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <CheckCircle2 className="w-4 h-4 text-primary-600" />
                                <span>Analyzing topic and keywords...</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <CheckCircle2 className="w-4 h-4 text-primary-600" />
                                <span>Writing SEO-optimized content...</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Optimizing for search engines...</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Review Step */}
            {step === 'review' && generatedArticle && (
                <div className="space-y-6">
                    {/* Success Message */}
                    <Card className="bg-primary-50 border-primary-200">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6 text-primary-600" />
                                <div>
                                    <h3 className="font-semibold text-primary-900">Article Generated Successfully!</h3>
                                    <p className="text-sm text-primary-700">
                                        Review the article below. You can edit, save as draft, or publish directly.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Article Preview */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-2xl mb-2">{generatedArticle.title}</CardTitle>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <Badge variant="outline">{generatedArticle.category}</Badge>
                                        <Badge variant="outline">{generatedArticle.read_time} min read</Badge>
                                        <Badge variant="outline">{generatedArticle.word_count} words</Badge>
                                        <Badge className="bg-primary-100 text-primary-700 border-0">
                                            SEO Score: {generatedArticle.seo_score}/100
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* SEO Meta */}
                            <div className="bg-slate-50 p-6 md:p-8 rounded-lg space-y-2">
                                <div>
                                    <Label className="text-xs text-slate-600">SEO Title</Label>
                                    <p className="text-sm font-semibold text-slate-900">{generatedArticle.seo_title}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-slate-600">Meta Description</Label>
                                    <p className="text-sm text-slate-700">{generatedArticle.meta_description}</p>
                                </div>
                            </div>

                            {/* Keywords & Tags */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Label className="text-xs text-slate-600 mb-2 block">Keywords</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {generatedArticle.keywords.map((keyword, idx) => (
                                            <Badge key={idx} variant="outline" className="text-xs">
                                                {keyword}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <Label className="text-xs text-slate-600 mb-2 block">Tags</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {generatedArticle.tags.map((tag, idx) => (
                                            <Badge key={idx} variant="outline" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Content Preview */}
                            <div>
                                <Label className="text-xs text-slate-600 mb-2 block">Content Preview</Label>
                                <div 
                                    className="prose prose-slate max-w-none bg-white p-4 rounded-lg border border-slate-200 max-h-96 overflow-y-auto"
                                    dangerouslySetInnerHTML={{ 
                                        __html: generatedArticle.structured_content
                                            ? structuredToMarkdown(generatedArticle.structured_content).substring(0, 2000) + '...'
                                            : (generatedArticle.content || '').substring(0, 2000) + '...'
                                    }}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t">
                                <Button
                                    onClick={saveAndEdit}
                                    disabled={step === 'publishing'}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    {step === 'publishing' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save & Edit in Editor
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={publishDirectly}
                                    disabled={step === 'publishing'}
                                    className="flex-1 bg-primary-600 hover:bg-primary-700"
                                >
                                    {step === 'publishing' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            Publish Directly
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={reset}
                                    variant="ghost"
                                    disabled={step === 'publishing'}
                                >
                                    <ArrowRight className="w-4 h-4 mr-2" />
                                    Generate Another
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Publishing Step */}
            {step === 'publishing' && (
                <Card>
                    <CardContent className="p-6 md:p-8 text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Processing...</h3>
                        <p className="text-slate-600">Saving your article...</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

