"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import SEOScoreCalculator from '@/components/admin/SEOScoreCalculator';
import { SocialPostManager } from '@/components/admin/SocialPostManager';
import CategorySelect from '@/components/admin/CategorySelect';
import { Loader2, Save, Eye, Send, Sparkles, Calendar, Search, Wand2, Languages, Clock } from 'lucide-react';
import { toast } from 'sonner';
import type { ArticleCategory, ArticleLanguage, ArticleStatus, ContentType } from '@/types/article';
import KeywordResearchQuickAccess from './KeywordResearchQuickAccess';
import SubCategorySelect from './SubCategorySelect';
import FeaturedImageSelector from './FeaturedImageSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArticleVersionHistory from './ArticleVersionHistory';
import ArticleScheduling from './ArticleScheduling';
import BrokenLinkReport from './BrokenLinkReport';
import ValidationReport from './ValidationReport';

/**
 * ArticleInspector - Right-side inspector panel for article editing
 * 
 * Provides:
 * - SEO scoring and metadata
 * - Category, tags, language selection
 * - Publishing controls
 * - AI generation status
 * - Schema-driven fields (intent, keywords)
 */
interface ArticleInspectorProps {
    article: {
        id?: string;
        title?: string;
        content?: string;
        excerpt?: string;
        category?: ArticleCategory;
        language?: ArticleLanguage;
        tags?: string[];
        status?: ArticleStatus;
        seo_title?: string;
        seo_description?: string;
        ai_generated?: boolean;
        content_type?: ContentType;
        // Schema-driven fields
        primary_keyword?: string;
        secondary_keywords?: string[];
        search_intent?: 'informational' | 'commercial' | 'transactional';
        [key: string]: any; // Allow additional fields
    };
    onSave: (metadata: any) => void | Promise<void>;
    onPublish?: () => void | Promise<void>;
    onPreview?: () => void | Promise<void>;
    saving?: boolean;
}

export default function ArticleInspector({
    article,
    onSave,
    onPublish,
    onPreview,
    saving = false
}: ArticleInspectorProps) {
    const queryClient = useQueryClient();
    
    // Local state for form fields
    const [category, setCategory] = useState<ArticleCategory>(article.category || 'investing-basics');
    const [subCategory, setSubCategory] = useState(article.editorial_notes?.sub_category || '');
    const [language, setLanguage] = useState<ArticleLanguage>(article.language || 'en');
    const [status, setStatus] = useState<ArticleStatus>(article.status || 'draft');
    const [excerpt, setExcerpt] = useState(article.excerpt || '');

    // Sync excerpt when article prop changes
    React.useEffect(() => {
        if (article.excerpt !== undefined) {
            setExcerpt(article.excerpt);
        }
    }, [article.excerpt]);
    const [seoTitle, setSeoTitle] = useState(article.seo_title || article.title || '');
    const [seoDescription, setSeoDescription] = useState(article.seo_description || article.excerpt || '');
    const [tags, setTags] = useState<string[]>(article.tags || []);
    const [tagInput, setTagInput] = useState('');
    const [featuredImage, setFeaturedImage] = useState(article.featured_image || '');
    
    // Schema-driven fields
    const [primaryKeyword, setPrimaryKeyword] = useState(article.primary_keyword || '');
    const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>(article.secondary_keywords || []);
    const [secondaryKeywordInput, setSecondaryKeywordInput] = useState('');
    const [searchIntent, setSearchIntent] = useState<'informational' | 'commercial' | 'transactional' | ''>(
        article.search_intent || ''
    );
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [isAutoCategorizing, setIsAutoCategorizing] = useState(false);
    const [isAutoTagging, setIsAutoTagging] = useState(false);
    const [targetLang, setTargetLang] = useState('hi');

    // Auto-categorize handler
    const handleAutoCategorize = async () => {
        setIsAutoCategorizing(true);
        try {
            const res = await fetch('/api/auto-categorize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: article.title,
                    excerpt,
                    content: article.content
                })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);
            
            setCategory(json.category as ArticleCategory);
            toast.success(`Auto-categorized as: ${json.category}`);
        } catch (e: any) {
            toast.error("Auto-categorization failed: " + e.message);
        } finally {
            setIsAutoCategorizing(false);
        }
    };

    // Auto-tag handler
    const handleAutoTag = async () => {
        setIsAutoTagging(true);
        try {
            const res = await fetch('/api/auto-tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: article.title,
                    excerpt,
                    content: article.content,
                    maxTags: 5
                })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);
            
            setTags(json.tags);
            toast.success(`Generated ${json.tags.length} tags!`);
        } catch (e: any) {
            toast.error("Auto-tagging failed: " + e.message);
        } finally {
            setIsAutoTagging(false);
        }
    };

    const handleTranslate = async () => {
        setIsTranslating(true);
        try {
            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    articleId: article.id,
                    targetLang
                })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);
            
            toast.success(json.message || `Translation created!`);
        } catch (e: any) {
            toast.error("Translation failed: " + e.message);
        } finally {
            setIsTranslating(false);
        }
    };

    const handleAutoOptimize = async () => {
        setIsOptimizing(true);
        try {
            const res = await fetch('/api/admin/editor-tools', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    action: 'optimize-seo',
                    title: article.title || seoTitle,
                    content: article.content 
                })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);
            
            const data = json.data;
            setSeoTitle(data.seo_title);
            setSeoDescription(data.meta_description);
            setPrimaryKeyword(data.primary_keyword);
            setSecondaryKeywords(data.secondary_keywords || []);
            setSearchIntent(data.search_intent);
            
            toast.success("SEO Metadata Optimized by AI!");
        } catch (e: any) {
            toast.error("Optimization failed: " + e.message);
        } finally {
            setIsOptimizing(false);
        }
    };

    // Extract keywords from tags if primary keyword not set
    const keywordsForSEO = useMemo(() => {
        const allKeywords: string[] = [];
        if (primaryKeyword) allKeywords.push(primaryKeyword);
        if (secondaryKeywords.length > 0) allKeywords.push(...secondaryKeywords);
        if (tags.length > 0) allKeywords.push(...tags);
        return [...new Set(allKeywords)]; // Remove duplicates
    }, [primaryKeyword, secondaryKeywords, tags]);

    // Handle tag input with validation
    const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase();
            
            // Validation: prevent duplicates
            if (tags.includes(newTag)) {
                toast.error(`Tag "${newTag}" already exists`);
                return;
            }
            
            // Validation: max 10 tags
            if (tags.length >= 10) {
                toast.error('Maximum 10 tags allowed');
                return;
            }
            
            // Validation: tag format (alphanumeric and hyphens, max 30 chars)
            if (!/^[a-z0-9-]+$/.test(newTag)) {
                toast.error('Tags can only contain letters, numbers, and hyphens');
                return;
            }
            
            if (newTag.length > 30) {
                toast.error('Tag must be 30 characters or less');
                return;
            }
            
            setTags([...tags, newTag]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    // Handle secondary keyword input
    const handleSecondaryKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && secondaryKeywordInput.trim()) {
            e.preventDefault();
            const newKeyword = secondaryKeywordInput.trim().toLowerCase();
            if (!secondaryKeywords.includes(newKeyword) && newKeyword !== primaryKeyword) {
                setSecondaryKeywords([...secondaryKeywords, newKeyword]);
            }
            setSecondaryKeywordInput('');
        }
    };

    const removeSecondaryKeyword = (keywordToRemove: string) => {
        setSecondaryKeywords(secondaryKeywords.filter(k => k !== keywordToRemove));
    };

    // Handle save with all metadata
    const handleSave = async () => {
        await onSave({
            category,
            language,
            status,
            excerpt,
            featured_image: featuredImage,
            seo_title: seoTitle || article.title,
            meta_description: seoDescription || excerpt,
            tags,
            primary_keyword: primaryKeyword,
            secondary_keywords: secondaryKeywords,
            search_intent: searchIntent || undefined,
            editorial_notes: {
                ...article.editorial_notes,
                sub_category: subCategory
            }
        });
    };

    const handlePublish = async () => {
        if (onPublish) {
            await onPublish();
        } else {
            await onSave({ status: 'published' });
        }
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-surface-dark border-l border-slate-200 dark:border-slate-800 transition-colors duration-300">
            {/* Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-surface-darker/50">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-foreground/95 dark:text-foreground/95 uppercase tracking-wider">
                    Inspector
                </h2>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                <Tabs defaultValue="metadata" className="w-full">
                    <TabsList className="w-full justify-start rounded-none border-b border-slate-200 dark:border-border dark:border-border bg-transparent h-auto p-0">
                        <TabsTrigger 
                            value="metadata" 
                            className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 dark:data-[state=active]:border-primary-400"
                        >
                            Metadata
                        </TabsTrigger>
                        <TabsTrigger 
                            value="versions" 
                            className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 dark:data-[state=active]:border-primary-400"
                        >
                            <Clock className="w-4 h-4 mr-2" />
                            Versions
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="metadata" className="px-6 py-6 space-y-6 mt-0">
                {/* Publishing Controls */}
                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">
                        Publishing
                    </h3>
                    <div className="space-y-2">
                        <div>
                            <Label htmlFor="status" className="text-slate-700 dark:text-foreground/80 dark:text-foreground/80">Status</Label>
                            <Select value={status} onValueChange={(v: string) => setStatus(v as ArticleStatus)}>
                                <SelectTrigger id="status" className="bg-white dark:bg-surface-darker border-slate-200 dark:border-border dark:border-border text-slate-900 dark:text-foreground/90 dark:text-foreground/90">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-surface-darker border-slate-200 dark:border-border dark:border-border text-slate-900 dark:text-foreground/90 dark:text-foreground/90">
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2">
                            {/* 1. SAVE - Most frequent action */}
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 bg-secondary-600 hover:bg-secondary-700 text-foreground dark:text-foreground"
                                size="sm"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save
                                    </>
                                )}
                            </Button>

                            {/* 2. PREVIEW - Check before publishing */}
                            {onPreview && (
                                <Button
                                    onClick={onPreview}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 border-border dark:border-border text-foreground/80 dark:text-foreground/80 hover:bg-muted dark:bg-muted hover:text-foreground dark:text-foreground"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Preview
                                </Button>
                            )}

                            {/* 3. PUBLISH - Final step */}
                            {onPublish && (
                                <Button
                                    onClick={handlePublish}
                                    disabled={saving || status === 'published'}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 border-success-900 text-success-400 hover:bg-success-900/20"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Publish
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Article Scheduling */}
                {article.id && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                        <ArticleScheduling
                            articleId={article.id}
                            currentStatus={status}
                            scheduledPublishAt={(article as any).scheduled_publish_at}
                            onScheduled={() => {
                                // Refresh article data after scheduling
                                queryClient.invalidateQueries({ queryKey: ['article', article.id] });
                            }}
                        />
                    </div>
                )}

                {/* AI Status */}
                {article.ai_generated && (
                    <div className="space-y-2 p-3 bg-accent-50 border-accent-200 dark:bg-amber-950/30 dark:border-accent-900/50 border rounded-lg">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-accent-600 dark:text-accent-500" />
                            <span className="text-sm font-medium text-accent-800 dark:text-accent-400">AI Generated</span>
                        </div>
                        <p className="text-xs text-accent-700 dark:text-accent-200/70">
                            This content was generated with AI assistance. Please review before publishing.
                        </p>
                    </div>
                )}

                {/* Featured Image */}
                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">
                        Featured Media
                    </h3>
                    <FeaturedImageSelector 
                        imageUrl={featuredImage}
                        onImageSelect={setFeaturedImage}
                        articleTitle={article.title}
                        articleCategory={category}
                        keywords={[primaryKeyword, ...secondaryKeywords].filter(Boolean)}
                    />
                </div>

                {/* Category & Language */}
                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">
                        Classification
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <Label htmlFor="category" className="text-slate-700 dark:text-foreground/80 dark:text-foreground/80">Category</Label>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-primary-900/20 hover:text-secondary-700 dark:hover:text-secondary-300"
                                    onClick={handleAutoCategorize}
                                    disabled={isAutoCategorizing}
                                >
                                    {isAutoCategorizing ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <Wand2 className="w-3 h-3 mr-1"/>}
                                    Auto
                                </Button>
                            </div>
                            <CategorySelect
                                value={category}
                                onValueChange={(v: string) => setCategory(v as ArticleCategory)}
                            />
                        </div>
                        <div>
                             <Label htmlFor="sub-category" className="text-slate-700 dark:text-foreground/80 dark:text-foreground/80">Topic / Sub-Category</Label>
                             <SubCategorySelect
                                categorySlug={category}
                                value={subCategory}
                                onValueChange={setSubCategory}
                                className="mt-1 bg-white dark:bg-surface-darker border-slate-200 dark:border-border dark:border-border text-slate-900 dark:text-foreground/90 dark:text-foreground/90"
                             />
                        </div>
                        <div>
                            <Label htmlFor="language" className="text-slate-700 dark:text-foreground/80 dark:text-foreground/80">Language</Label>
                            <Select value={language} onValueChange={(v: string) => setLanguage(v as ArticleLanguage)}>
                                <SelectTrigger id="language" className="bg-white dark:bg-surface-darker border-slate-200 dark:border-border dark:border-border text-slate-900 dark:text-foreground/90 dark:text-foreground/90">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-surface-darker border-slate-200 dark:border-border dark:border-border text-slate-900 dark:text-foreground/90 dark:text-foreground/90">
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="hi">Hindi</SelectItem>
                                    <SelectItem value="ta">Tamil</SelectItem>
                                    <SelectItem value="te">Telugu</SelectItem>
                                    <SelectItem value="bn">Bengali</SelectItem>
                                    <SelectItem value="mr">Marathi</SelectItem>
                                    <SelectItem value="gu">Gujarati</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Schema-Driven Fields: Keywords & Intent */}
                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">
                        SEO Keywords & Intent
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <Label htmlFor="primary-keyword" className="text-slate-700 dark:text-foreground/80 dark:text-foreground/80">Primary Keyword</Label>
                            <Input
                                id="primary-keyword"
                                value={primaryKeyword}
                                onChange={(e) => setPrimaryKeyword(e.target.value)}
                                placeholder="e.g., mutual funds"
                                className="mt-1 bg-white dark:bg-surface-darker border-slate-200 dark:border-border dark:border-border text-slate-900 dark:text-foreground/90 dark:text-foreground/90 placeholder:text-muted-foreground dark:text-muted-foreground dark:placeholder:text-muted-foreground/50 dark:text-muted-foreground/50"
                            />
                            {primaryKeyword && (
                                <div className="mt-2">
                                    <KeywordResearchQuickAccess
                                        articleId={article.id}
                                        primaryKeyword={primaryKeyword}
                                        onKeywordSelect={(keyword) => {
                                            if (!secondaryKeywords.includes(keyword)) {
                                                setSecondaryKeywords([...secondaryKeywords, keyword]);
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="secondary-keywords" className="text-slate-700 dark:text-foreground/80 dark:text-foreground/80">Secondary Keywords</Label>
                            <Input
                                id="secondary-keywords"
                                value={secondaryKeywordInput}
                                onChange={(e) => setSecondaryKeywordInput(e.target.value)}
                                onKeyDown={handleSecondaryKeywordKeyDown}
                                placeholder="Press Enter to add"
                                className="mt-1 bg-white dark:bg-surface-darker border-slate-200 dark:border-border dark:border-border text-slate-900 dark:text-foreground/90 dark:text-foreground/90 placeholder:text-muted-foreground dark:text-muted-foreground dark:placeholder:text-muted-foreground/50 dark:text-muted-foreground/50"
                            />
                            {secondaryKeywords.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {secondaryKeywords.map((kw) => (
                                        <Badge key={kw} variant="outline" className="text-xs border-slate-200 dark:border-border dark:border-border text-slate-700 dark:text-foreground/80 dark:text-foreground/80 bg-slate-100 dark:bg-surface-darker">
                                            {kw}
                                            <button
                                                onClick={() => removeSecondaryKeyword(kw)}
                                                className="ml-1 hover:text-danger-400"
                                                aria-label={`Remove keyword ${kw}`}
                                            >
                                                ×
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="search-intent" className="text-slate-700 dark:text-foreground/80 dark:text-foreground/80">Search Intent</Label>
                            <Select
                                value={searchIntent}
                                onValueChange={(v: string) => setSearchIntent(v as 'informational' | 'commercial' | 'transactional' | '')}
                            >
                                <SelectTrigger id="search-intent" className="bg-white dark:bg-surface-darker border-slate-200 dark:border-border dark:border-border text-slate-900 dark:text-foreground/90 dark:text-foreground/90">
                                    <SelectValue placeholder="Select intent" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-surface-darker border-slate-200 dark:border-border dark:border-border text-slate-900 dark:text-foreground/90 dark:text-foreground/90">
                                    <SelectItem value="informational">Informational</SelectItem>
                                    <SelectItem value="commercial">Commercial</SelectItem>
                                    <SelectItem value="transactional">Transactional</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-muted-foreground/70 dark:text-muted-foreground/70 dark:text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">
                            Tags
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-primary-900/20 hover:text-secondary-700 dark:hover:text-secondary-300"
                            onClick={handleAutoTag}
                            disabled={isAutoTagging}
                        >
                            {isAutoTagging ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <Wand2 className="w-3 h-3 mr-1"/>}
                            Generate
                        </Button>
                    </div>
                    <div>
                        <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagInputKeyDown}
                            placeholder="Press Enter to add tag"
                            className="bg-white dark:bg-surface-darker border-slate-200 dark:border-border dark:border-border text-slate-900 dark:text-foreground/90 dark:text-foreground/90 placeholder:text-muted-foreground dark:text-muted-foreground dark:placeholder:text-muted-foreground/50 dark:text-muted-foreground/50"
                            aria-label="Add tag"
                            aria-describedby="tags-help"
                        />
                        <p id="tags-help" className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                            Press Enter to add. Maximum 10 tags.
                        </p>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {tags.map((tag) => (
                                        <Badge key={tag} variant="outline" className="text-xs border-slate-200 dark:border-border dark:border-border text-slate-700 dark:text-foreground/80 dark:text-foreground/80 bg-slate-100 dark:bg-surface-darker">
                                            {tag}
                                            <button
                                                onClick={() => removeTag(tag)}
                                                className="ml-1 hover:text-danger-600 dark:hover:text-danger-400"
                                                aria-label={`Remove tag ${tag}`}
                                            >
                                                ×
                                            </button>
                                        </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-muted-foreground/70 dark:text-muted-foreground/70 dark:text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">
                        Excerpt
                    </h3>
                    <Textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Brief summary of the article..."
                        rows={3}
                        maxLength={300}
                        className={`resize-none bg-white dark:bg-surface-darker border-slate-200 dark:border-border dark:border-border text-slate-900 dark:text-foreground/90 dark:text-foreground/90 placeholder:text-muted-foreground dark:text-muted-foreground dark:placeholder:text-muted-foreground/50 dark:text-muted-foreground/50 ${
                            excerpt.length > 300 ? 'border-warning-500 dark:border-warning-500' : ''
                        }`}
                        aria-label="Article excerpt"
                        aria-describedby="excerpt-char-count"
                    />
                    <div id="excerpt-char-count" className="flex items-center justify-between">
                        <p className={`text-xs ${excerpt.length > 300 ? 'text-warning-600 dark:text-warning-400' : 'text-muted-foreground/70 dark:text-muted-foreground/70'}`}>
                            {excerpt.length}/300 characters
                        </p>
                        {excerpt.length > 300 && (
                            <span className="text-xs text-warning-600 dark:text-warning-400" role="alert">
                                Exceeds recommended length
                            </span>
                        )}
                    </div>
                </div>

                {/* SEO Metadata */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">
                            SEO Metadata
                        </h3>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-secondary-400 hover:bg-primary-900/20 hover:text-secondary-300"
                            onClick={handleAutoOptimize}
                            disabled={isOptimizing}
                        >
                            {isOptimizing ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <Wand2 className="w-3 h-3 mr-1"/>}
                            Auto-Fix
                        </Button>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <Label htmlFor="seo-title" className="text-slate-700 dark:text-foreground/80 dark:text-foreground/80">SEO Title</Label>
                            <Input
                                id="seo-title"
                                value={seoTitle}
                                onChange={(e) => setSeoTitle(e.target.value)}
                                placeholder={article.title || 'SEO title'}
                                maxLength={70}
                                className={`mt-1 bg-white dark:bg-surface-darker border-slate-200 dark:border-border dark:border-border text-slate-900 dark:text-foreground/90 dark:text-foreground/90 placeholder:text-muted-foreground dark:text-muted-foreground dark:placeholder:text-muted-foreground/50 dark:text-muted-foreground/50 ${
                                    seoTitle.length > 60 ? 'border-warning-500 dark:border-warning-500' : ''
                                }`}
                                aria-label="SEO title"
                                aria-describedby="seo-title-char-count"
                            />
                            <div className="flex items-center justify-between mt-1">
                                <p className={`text-xs ${seoTitle.length > 60 ? 'text-warning-600 dark:text-warning-400' : 'text-muted-foreground/70 dark:text-muted-foreground/70'}`}>
                                    {seoTitle.length}/60 characters
                                </p>
                                {seoTitle.length > 60 && (
                                    <span className="text-xs text-warning-600 dark:text-warning-400" role="alert">
                                        May be truncated in search results
                                    </span>
                                )}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="seo-description" className="text-slate-700 dark:text-foreground/80 dark:text-foreground/80">Meta Description</Label>
                            <Textarea
                                id="seo-description"
                                value={seoDescription}
                                onChange={(e) => setSeoDescription(e.target.value)}
                                placeholder="Meta description for search engines..."
                                rows={3}
                                maxLength={165}
                                className={`resize-none mt-1 bg-white dark:bg-surface-darker border-slate-200 dark:border-border dark:border-border text-slate-900 dark:text-foreground/90 dark:text-foreground/90 placeholder:text-muted-foreground dark:text-muted-foreground dark:placeholder:text-muted-foreground/50 dark:text-muted-foreground/50 ${
                                    seoDescription.length > 160 ? 'border-warning-500 dark:border-warning-500' : ''
                                }`}
                                aria-label="Meta description"
                                aria-describedby="seo-description-char-count"
                            />
                            <div className="flex items-center justify-between mt-1">
                                <p className={`text-xs ${seoDescription.length > 160 ? 'text-warning-600 dark:text-warning-400' : 'text-muted-foreground/70 dark:text-muted-foreground/70'}`}>
                                    {seoDescription.length}/160 characters
                                </p>
                                {seoDescription.length > 160 && (
                                    <span className="text-xs text-warning-600 dark:text-warning-400" role="alert">
                                        May be truncated in search results
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Translation Tool */}
                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-muted-foreground/70 dark:text-muted-foreground/70 dark:text-muted-foreground dark:text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Languages className="w-4 h-4" />
                        Translate
                    </h3>
                    <div className="flex gap-2">
                         <Select value={targetLang} onValueChange={setTargetLang}>
                            <SelectTrigger className="flex-1 bg-white dark:bg-surface-darker border-slate-200 dark:border-border dark:border-border text-slate-900 dark:text-foreground/90 dark:text-foreground/90">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-surface-darker border-slate-200 dark:border-border dark:border-border text-slate-900 dark:text-foreground/90 dark:text-foreground/90">
                                <SelectItem value="hi">Hindi (à¤¹à¤¿à¤‚à¤¦à¥€)</SelectItem>
                                <SelectItem value="te">Telugu (à°¤à±†à°²à±à°—à±)</SelectItem>
                                <SelectItem value="mr">Marathi (à¤®à¤°à¤¾à¤ à¥€)</SelectItem>
                                <SelectItem value="ta">Tamil (à®¤à®®à®¿à®´à¯)</SelectItem>
                                <SelectItem value="bn">Bengali (à¦¬à¦¾à¦‚à¦²à¦¾)</SelectItem>
                                <SelectItem value="gu">Gujarati (àª—à«àªœàª°àª¾àª¤à«€)</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button 
                            size="sm"
                            variant="default"
                            onClick={handleTranslate}
                            disabled={isTranslating}
                            className="bg-primary-600 hover:bg-primary-700 text-foreground dark:text-foreground"
                        >
                             {isTranslating ? <Loader2 className="w-4 h-4 animate-spin"/> : "Go"}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70">
                        Creates a new draft article in the selected language.
                    </p>
                </div>

                {/* Social Media Distribution */}
                <div className="pt-4 border-t border-slate-800">
                    <SocialPostManager articleId={article.id || ''} />
                </div>

                {/* Validation Report */}
                {article.id && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                        <ValidationReport
                            articleId={article.id}
                            title={article.title}
                            content={article.content}
                            category={category}
                        />
                    </div>
                )}

                {/* Broken Link Report */}
                {article.id && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                        <BrokenLinkReport articleId={article.id} />
                    </div>
                )}

                {/* SEO Score Calculator */}
                {article.title && article.content && (
                    <div>
                        <SEOScoreCalculator
                            title={article.title}
                            content={article.content}
                            metaDescription={seoDescription}
                            keywords={keywordsForSEO}
                        />
                    </div>
                )}
                    </TabsContent>

                    <TabsContent value="versions" className="px-6 py-6 mt-0">
                        {article.id ? (
                            <ArticleVersionHistory 
                                articleId={article.id}
                                onVersionRestored={() => {
                                    // Refresh article data after version restore
                                    window.location.reload();
                                }}
                            />
                        ) : (
                            <div className="text-center text-muted-foreground dark:text-muted-foreground py-8">
                                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>Save the article to see version history</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
