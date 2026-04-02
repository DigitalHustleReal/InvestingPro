"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient as api } from '@/lib/api-client';
import {
    Sparkles,
    Play,
    CheckCircle2,
    Clock,
    TrendingUp,
    FileText,
    ClipboardCheck,
    Rss,
    Zap,
    AlertCircle,
    RefreshCw,
    Search,
    BookOpen,
    Layers,
    Target,
    Copy,
    Save,
    Eye,
    ArrowDown,
    ArrowRight,
    Star,
    Filter,
    X,
    Calculator,
    CreditCard,
    Shield
} from "lucide-react";

// Niche Templates Library
const NICHE_TEMPLATES = [
    {
        id: 'mutual-fund-guide',
        name: 'Mutual Fund Guide',
        category: 'mutual-funds',
        description: 'Comprehensive guide comparing mutual funds with performance analysis',
        icon: TrendingUp,
        prompt: 'Write a comprehensive guide about {topic} covering types, benefits, risks, and top recommendations for Indian investors.',
        structure: ['Introduction', 'Types & Categories', 'Benefits', 'Risks', 'How to Choose', 'Top Recommendations', 'Conclusion']
    },
    {
        id: 'sip-calculator-explained',
        name: 'SIP Calculator Explained',
        category: 'investing-basics',
        description: 'Educational article explaining SIP calculations with examples',
        icon: Calculator,
        prompt: 'Explain {topic} in detail, including how it works, formula, examples, and benefits for long-term wealth creation.',
        structure: ['What is SIP?', 'How SIP Works', 'SIP Formula', 'Real Examples', 'Benefits', 'FAQs']
    },
    {
        id: 'credit-card-comparison',
        name: 'Credit Card Comparison',
        category: 'credit-cards',
        description: 'Detailed comparison of credit cards with pros/cons',
        icon: CreditCard,
        prompt: 'Create a detailed comparison of {topic}, including features, fees, rewards, eligibility, and who should choose it.',
        structure: ['Overview', 'Key Features', 'Fees & Charges', 'Rewards Program', 'Eligibility', 'Pros & Cons', 'Verdict']
    },
    {
        id: 'tax-saving-guide',
        name: 'Tax Saving Guide',
        category: 'tax-planning',
        description: 'Complete guide on tax-saving investments under Section 80C',
        icon: Shield,
        prompt: 'Write a comprehensive tax-saving guide about {topic}, covering eligibility, limits, benefits, and how to maximize savings.',
        structure: ['Introduction', 'Eligibility', 'Investment Limits', 'Tax Benefits', 'Best Options', 'How to Invest', 'FAQs']
    },
    {
        id: 'loan-emi-calculator',
        name: 'Loan EMI Calculator Guide',
        category: 'loans',
        description: 'Guide explaining loan EMI calculations with examples',
        icon: Calculator,
        prompt: 'Explain {topic} including how EMI is calculated, factors affecting it, prepayment options, and tips to reduce EMI.',
        structure: ['What is EMI?', 'EMI Formula', 'Factors Affecting EMI', 'Prepayment Benefits', 'Tips to Reduce EMI', 'FAQs']
    },
    {
        id: 'retirement-planning',
        name: 'Retirement Planning',
        category: 'retirement',
        description: 'Complete retirement planning guide for Indian investors',
        icon: Target,
        prompt: 'Create a comprehensive retirement planning guide covering {topic}, including calculations, investment options, and strategies.',
        structure: ['Retirement Goals', 'How Much to Save', 'Investment Options', 'Tax Benefits', 'Withdrawal Strategy', 'FAQs']
    },
    {
        id: 'insurance-comparison',
        name: 'Insurance Comparison',
        category: 'insurance',
        description: 'Compare insurance policies with coverage analysis',
        icon: Shield,
        prompt: 'Compare {topic} policies, covering types, coverage, premiums, claim process, and which one to choose.',
        structure: ['Types of Insurance', 'Coverage Comparison', 'Premium Analysis', 'Claim Process', 'Which to Choose', 'FAQs']
    },
    {
        id: 'stock-investing-basics',
        name: 'Stock Investing Basics',
        category: 'stocks',
        description: 'Beginner-friendly guide to stock investing',
        icon: TrendingUp,
        prompt: 'Write a beginner-friendly guide about {topic}, covering basics, how to start, risks, and strategies for Indian markets.',
        structure: ['What are Stocks?', 'How Stock Market Works', 'How to Start', 'Risks', 'Strategies', 'FAQs']
    }
];

// Prompts Library
const PROMPTS_LIBRARY = [
    {
        id: 'seo-optimized-article',
        name: 'SEO-Optimized Article',
        category: 'content',
        prompt: 'Write a comprehensive, SEO-optimized article about {topic} for an Indian financial website. Include H2/H3 headings, keyword-rich content, and actionable insights. Target word count: {wordCount}.',
        variables: ['topic', 'wordCount']
    },
    {
        id: 'product-comparison',
        name: 'Product Comparison',
        category: 'comparison',
        prompt: 'Create a detailed comparison of {product1} vs {product2}, covering features, pricing, pros/cons, and which one to choose based on different user needs.',
        variables: ['product1', 'product2']
    },
    {
        id: 'how-to-guide',
        name: 'How-To Guide',
        category: 'tutorial',
        prompt: 'Write a step-by-step how-to guide about {topic} for Indian investors. Include prerequisites, detailed steps, examples, and common mistakes to avoid.',
        variables: ['topic']
    },
    {
        id: 'faq-section',
        name: 'FAQ Section',
        category: 'content',
        prompt: 'Generate a comprehensive FAQ section about {topic} with 15-20 questions covering common queries, concerns, and detailed answers.',
        variables: ['topic']
    },
    {
        id: 'case-study',
        name: 'Case Study',
        category: 'analysis',
        prompt: 'Write a detailed case study about {topic}, including background, analysis, results, and key takeaways for readers.',
        variables: ['topic']
    },
    {
        id: 'news-analysis',
        name: 'News Analysis',
        category: 'news',
        prompt: 'Analyze the financial news about {topic} and provide expert insights, market impact, and implications for Indian investors.',
        variables: ['topic']
    },
    {
        id: 'calculator-explanation',
        name: 'Calculator Explanation',
        category: 'educational',
        prompt: 'Explain {calculator} in detail, including what it is, how it works, formula, examples, and when to use it.',
        variables: ['calculator']
    },
    {
        id: 'investment-strategy',
        name: 'Investment Strategy',
        category: 'strategy',
        prompt: 'Create a comprehensive investment strategy guide for {goal}, including asset allocation, risk management, and timeline recommendations.',
        variables: ['goal']
    }
];

export default function AIContentWriterPage() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('auto-generator');
    
    // Auto Generator States
    const [autoGenerating, setAutoGenerating] = useState(false);
    const [autoStep, setAutoStep] = useState(0);
    const [autoProgress, setAutoProgress] = useState(0);
    const [generatedArticles, setGeneratedArticles] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    // Template States
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [templateInputs, setTemplateInputs] = useState<Record<string, string>>({});
    
    // Prompt States
    const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
    const [promptInputs, setPromptInputs] = useState<Record<string, string>>({});
    
    // Review Queue
    const { data: reviewArticles = [] } = useQuery({
        queryKey: ['review-articles'],
        queryFn: async () => {
            const articles = await api.entities.Article.filter({
                status: 'draft',
                ai_generated: true
            });
            return Array.isArray(articles) ? articles : [];
        }
    });

    // One-Click Auto Generator
    const runAutoGenerator = async () => {
        setAutoGenerating(true);
        setError(null);
        setAutoStep(0);
        setAutoProgress(0);
        setGeneratedArticles([]);

        try {
            // Step 1: Scrape Trending Data
            setAutoStep(1);
            setAutoProgress(20);
            const trendingResponse = await fetch('/api/scraper/trending', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!trendingResponse.ok) {
                const errorData = await trendingResponse.json().catch(() => ({ error: 'Failed to scrape trending data' }));
                throw new Error(errorData.error || 'Trending data scraping failed');
            }

            const trendingData = await trendingResponse.json();
            const topics = trendingData.topics || trendingData || [];

            // Step 2: Auto-Generate Articles
            setAutoStep(2);
            setAutoProgress(40);
            
            const articlesToGenerate = topics.slice(0, 5); // Generate top 5 trending topics
            const generated: any[] = [];

            for (let i = 0; i < articlesToGenerate.length; i++) {
                const topic = articlesToGenerate[i];
                setAutoProgress(40 + (i + 1) * 10);

                try {
                    const generateResponse = await fetch('/api/articles/generate-initial', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            topic: topic.keyword || topic.name || topic,
                            category: 'investing-basics',
                            language: 'en',
                            tone: 'informative',
                            template: 'seo-optimized-article'
                        })
                    });

                    if (generateResponse.ok) {
                        const article = await generateResponse.json();
                        generated.push({
                            ...article,
                            topic: topic.keyword || topic.name || topic,
                            generated_at: new Date().toISOString()
                        });
                    }
                } catch (err) {
                    console.error(`Failed to generate article for topic ${i + 1}:`, err);
                }
            }

            setGeneratedArticles(generated);

            // Step 3: Save to Review Queue
            setAutoStep(3);
            setAutoProgress(90);

            for (const article of generated) {
                try {
                    await api.entities.Article.create({
                        title: article.title || `Article about ${article.topic}`,
                        slug: article.slug || article.topic.toLowerCase().replace(/\s+/g, '-'),
                        content: article.content || article.body || '',
                        category: article.category || 'investing-basics',
                        status: 'draft',
                        ai_generated: true,
                        language: 'en',
                        excerpt: article.excerpt || article.description || ''
                    });
                } catch (err) {
                    console.error('Failed to save article:', err);
                }
            }

            // Step 4: Complete
            setAutoStep(4);
            setAutoProgress(100);
            
            // Refresh review queue
            queryClient.invalidateQueries({ queryKey: ['review-articles'] });

        } catch (err: any) {
            setError(err.message || 'Auto generation failed');
            console.error('Auto generator error:', err);
        } finally {
            setAutoGenerating(false);
        }
    };

    // Approve Article
    const approveArticle = async (articleId: string) => {
        try {
            await api.entities.Article.update(articleId, {
                status: 'published',
                published_date: new Date().toISOString()
            });
            queryClient.invalidateQueries({ queryKey: ['review-articles'] });
        } catch (err) {
            console.error('Failed to approve article:', err);
        }
    };

    const autoSteps = [
        { id: 1, title: 'Scrape Trending Data', icon: TrendingUp },
        { id: 2, title: 'Auto-Generate Articles', icon: Sparkles },
        { id: 3, title: 'Save to Review Queue', icon: ClipboardCheck },
        { id: 4, title: 'Display in Review Tab', icon: Eye },
        { id: 5, title: 'Approve → Save to Articles', icon: CheckCircle2 }
    ];

    return (
        <AdminLayout>
            <div className="h-full flex flex-col bg-gray-50">
                <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <h1 className="text-2xl font-bold text-gray-900">AI Content Writer</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Professional-grade content creation platform - Templates, Prompts, Auto-Generator
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                            <TabsList className="bg-white border p-1 rounded-xl flex-wrap">
                                <TabsTrigger value="auto-generator">One-Click Auto Generator</TabsTrigger>
                                <TabsTrigger value="templates">Niche Templates</TabsTrigger>
                                <TabsTrigger value="prompts">Prompts Library</TabsTrigger>
                                <TabsTrigger value="review">Review Queue</TabsTrigger>
                                <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                            </TabsList>

                            {/* One-Click Auto Generator */}
                            <TabsContent value="auto-generator">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>One-Click Auto Generator</CardTitle>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Fully automated content generation workflow
                                        </p>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Workflow Steps */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-gray-900">Automated Workflow</h3>
                                            <div className="space-y-3">
                                                {autoSteps.map((step, index) => {
                                                    const StepIcon = step.icon;
                                                    const isActive = autoStep === step.id;
                                                    const isCompleted = autoStep > step.id;
                                                    
                                                    return (
                                                        <div key={step.id} className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                                isCompleted
                                                                    ? 'bg-primary-500 text-white'
                                                                    : isActive
                                                                    ? 'bg-secondary-500 text-white'
                                                                    : 'bg-gray-200 text-gray-600'
                                                            }`}>
                                                                {isCompleted ? (
                                                                    <CheckCircle2 className="w-5 h-5" />
                                                                ) : (
                                                                    <StepIcon className="w-5 h-5" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="font-semibold text-gray-900">{step.title}</h4>
                                                                    {isActive && (
                                                                        <Badge className="bg-secondary-100 text-secondary-700 border-0">
                                                                            Running...
                                                                        </Badge>
                                                                    )}
                                                                    {isCompleted && (
                                                                        <Badge className="bg-primary-100 text-primary-700 border-0">
                                                                            Complete
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {index < autoSteps.length - 1 && (
                                                                <ArrowDown className="w-5 h-5 text-gray-600 absolute left-5 mt-12" />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Progress */}
                                            {autoGenerating && (
                                                <div className="space-y-2 mt-4">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600">
                                                            {autoStep === 1 && "Scraping trending topics..."}
                                                            {autoStep === 2 && "Generating articles..."}
                                                            {autoStep === 3 && "Saving to review queue..."}
                                                            {autoStep === 4 && "Complete!"}
                                                        </span>
                                                        <span className="font-semibold text-gray-900">{autoProgress}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-secondary-500 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${autoProgress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Error */}
                                            {error && (
                                                <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg flex items-start gap-3">
                                                    <AlertCircle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-rose-900 mb-1">Error</p>
                                                        <p className="text-sm text-danger-700">{error}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Generated Articles Preview */}
                                            {generatedArticles.length > 0 && (
                                                <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                                                    <p className="font-semibold text-primary-900 mb-2">
                                                        Generated {generatedArticles.length} articles
                                                    </p>
                                                    <div className="space-y-2">
                                                        {generatedArticles.map((article, idx) => (
                                                            <div key={idx} className="text-sm text-primary-700">
                                                                • {article.title || article.topic}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Run Button */}
                                            <Button
                                                onClick={runAutoGenerator}
                                                disabled={autoGenerating}
                                                className="w-full bg-primary-600 hover:bg-primary-700 text-white h-12 text-lg font-semibold mt-6"
                                                size="lg"
                                            >
                                                {autoGenerating ? (
                                                    <>
                                                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                                        Generating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Zap className="w-5 h-5 mr-2" />
                                                        Run One-Click Auto Generator
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Niche Templates */}
                            <TabsContent value="templates">
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Niche Templates Library</CardTitle>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Pre-built templates for financial content
                                            </p>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {NICHE_TEMPLATES.map((template) => {
                                                    const TemplateIcon = template.icon;
                                                    return (
                                                        <Card
                                                            key={template.id}
                                                            className={`cursor-pointer transition-all hover:border-secondary-500 ${
                                                                selectedTemplate === template.id ? 'border-secondary-500 bg-secondary-50' : ''
                                                            }`}
                                                            onClick={() => setSelectedTemplate(template.id)}
                                                        >
                                                            <CardContent className="p-6 md:p-8">
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center flex-shrink-0">
                                                                        <TemplateIcon className="w-5 h-5 text-primary-600" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                                                                        <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                                                                        <Badge variant="outline" className="text-xs">
                                                                            {template.category}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Template Editor */}
                                    {selectedTemplate && (
                                        <Card>
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <CardTitle>
                                                        {NICHE_TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                                                    </CardTitle>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedTemplate(null)}
                                                    >
                                                        <X className="w-4 h-4 mr-2" />
                                                        Close
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div>
                                                    <Label>Topic</Label>
                                                    <Input
                                                        placeholder="Enter topic (e.g., SIP Investment)"
                                                        value={templateInputs.topic || ''}
                                                        onChange={(e) => setTemplateInputs({ ...templateInputs, topic: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Template Structure</Label>
                                                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                                        <ul className="space-y-2">
                                                            {NICHE_TEMPLATES.find(t => t.id === selectedTemplate)?.structure.map((section, idx) => (
                                                                <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                                                    <ArrowRight className="w-4 h-4 text-gray-600" />
                                                                    {section}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                                <Button className="w-full">
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                    Generate with Template
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </TabsContent>

                            {/* Prompts Library */}
                            <TabsContent value="prompts">
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Prompts Library</CardTitle>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Pre-built prompts for different content types
                                            </p>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {PROMPTS_LIBRARY.map((prompt) => (
                                                    <Card
                                                        key={prompt.id}
                                                        className={`cursor-pointer transition-all hover:border-secondary-500 ${
                                                            selectedPrompt === prompt.id ? 'border-secondary-500 bg-secondary-50' : ''
                                                        }`}
                                                        onClick={() => setSelectedPrompt(prompt.id)}
                                                    >
                                                        <CardContent className="p-6 md:p-8">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <h4 className="font-semibold text-gray-900">{prompt.name}</h4>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {prompt.category}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-gray-600 line-clamp-2">{prompt.prompt}</p>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Prompt Editor */}
                                    {selectedPrompt && (
                                        <Card>
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <CardTitle>
                                                        {PROMPTS_LIBRARY.find(p => p.id === selectedPrompt)?.name}
                                                    </CardTitle>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedPrompt(null)}
                                                    >
                                                        <X className="w-4 h-4 mr-2" />
                                                        Close
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div>
                                                    <Label>Prompt Template</Label>
                                                    <Textarea
                                                        className="mt-2 font-mono text-sm"
                                                        rows={4}
                                                        value={PROMPTS_LIBRARY.find(p => p.id === selectedPrompt)?.prompt || ''}
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    {PROMPTS_LIBRARY.find(p => p.id === selectedPrompt)?.variables.map((variable) => (
                                                        <div key={variable}>
                                                            <Label>{variable.charAt(0).toUpperCase() + variable.slice(1)}</Label>
                                                            <Input
                                                                placeholder={`Enter ${variable}`}
                                                                value={promptInputs[variable] || ''}
                                                                onChange={(e) => setPromptInputs({ ...promptInputs, [variable]: e.target.value })}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <Button className="w-full">
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                    Generate with Prompt
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </TabsContent>

                            {/* Review Queue */}
                            <TabsContent value="review">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Review Queue</CardTitle>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {reviewArticles.length} articles pending review
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {Array.isArray(reviewArticles) && reviewArticles.length > 0 ? (
                                                reviewArticles.map((article: any) => (
                                                    <Card key={article.id} className="border-gray-200">
                                                        <CardContent className="p-6">
                                                            <div className="flex items-start justify-between mb-4">
                                                                <div className="flex-1">
                                                                    <h4 className="font-semibold text-gray-900 mb-2">{article.title}</h4>
                                                                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                                                                        <Badge variant="outline">{article.category}</Badge>
                                                                        <span className="flex items-center gap-1">
                                                                            <Clock className="w-4 h-4" />
                                                                            {new Date(article.created_at || article.created_date).toLocaleDateString()}
                                                                        </span>
                                                                        {article.ai_generated && (
                                                                            <Badge className="bg-secondary-100 text-secondary-700 border-0">
                                                                                <Sparkles className="w-3 h-3 mr-1" />
                                                                                AI Generated
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    {article.excerpt && (
                                                                        <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => window.open(`/admin/articles/${article.id}/edit`, '_blank')}
                                                                >
                                                                    <Eye className="w-4 h-4 mr-2" />
                                                                    Review
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-primary-600 hover:bg-primary-700"
                                                                    onClick={() => approveArticle(article.id)}
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                                    Approve & Publish
                                                                </Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))
                                            ) : (
                                                <div className="text-center py-12">
                                                    <ClipboardCheck className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                                    <p className="text-gray-600">No articles in review queue</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Pipeline Tab (Keep existing) */}
                            <TabsContent value="pipeline">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Content Pipeline</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600">Use the One-Click Auto Generator for automated pipeline execution.</p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
