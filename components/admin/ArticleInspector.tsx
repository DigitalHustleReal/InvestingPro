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
import { cn } from '@/lib/utils';
import { Loader2, Save, Eye, Send, Sparkles, Calendar, Search, Wand2, Languages, Clock, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { ArticleCategory, ArticleLanguage, ArticleStatus, ContentType } from '@/types/article';
import KeywordResearchQuickAccess from './KeywordResearchQuickAccess';
import SubCategorySelect from './SubCategorySelect';
import FeaturedImageSelector from './FeaturedImageSelector';
import AuthorSelect from './AuthorSelect';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import ArticleVersionHistory from './ArticleVersionHistory';
import ArticleScheduling from './ArticleScheduling';
import BrokenLinkReport from './BrokenLinkReport';
import ValidationReport from './ValidationReport';
import InterlinkingSuggestions from './InterlinkingSuggestions';
import { RepurposePanel } from './RepurposePanel';

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
    onUpdateContent?: (content: string) => void;
    saving?: boolean;
}

export default function ArticleInspector({
    article,
    onSave,
    onPublish,
    onPreview,
    onUpdateContent,
    saving = false
}: ArticleInspectorProps) {
    const queryClient = useQueryClient();
    
    // Local state for form fields
    const [category, setCategory] = useState<ArticleCategory>(article.category || 'investing-basics');
    const [subCategory, setSubCategory] = useState(article.editorial_notes?.sub_category || '');
    const [language, setLanguage] = useState<ArticleLanguage>(article.language || 'en');
    const [status, setStatus] = useState<ArticleStatus>(article.status || 'draft');
    const [excerpt, setExcerpt] = useState(article.excerpt || '');

    const handleApplyLink = (anchorText: string, slug: string, articleId: string) => {
        if (!article.content || !onUpdateContent) return;

        // Simple replacement: find first occurrence of anchorText
        // We use a regex with word boundaries to avoid partial matches
        const escapedAnchor = anchorText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedAnchor}\\b`, 'i');
        
        const linkHtml = `<a href="/articles/${slug}" class="internal-link" data-article-id="${articleId}">${anchorText}</a>`;
        const newContent = article.content.replace(regex, linkHtml);
        
        if (newContent !== article.content) {
            onUpdateContent(newContent);
        } else {
            // Fallback if word boundary fails (sometimes for non-latin or joined text)
            const fallbackRegex = new RegExp(escapedAnchor, 'i');
            const fallbackContent = article.content.replace(fallbackRegex, linkHtml);
            if (fallbackContent !== article.content) {
                onUpdateContent(fallbackContent);
            }
        }
    };
    const [authorId, setAuthorId] = useState(article.author_id || '');
    const [editorId, setEditorId] = useState(article.editor_id || '');

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
            setSeoDescription(data.seo_description || data.meta_description);
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
            seo_description: seoDescription || excerpt,
            tags,
            primary_keyword: primaryKeyword,
            secondary_keywords: secondaryKeywords,
            search_intent: searchIntent || undefined,
            editorial_notes: {
                ...article.editorial_notes,
                sub_category: subCategory
            },
            author_id: authorId || undefined,
            editor_id: editorId || undefined
        });
    };

    // Validation before publish
    const validateForPublish = (): boolean => {
        const errors: string[] = [];
        
        if (!article.title && !seoTitle) errors.push('Title is required');
        if (!category) errors.push('Category is required');
        if (!article.content || article.content.length < 100) errors.push('Content is too short (min 100 chars)');
        
        // SEO Criticals
        if (!seoTitle) errors.push('SEO Title is required');
        if (!seoDescription) errors.push('Meta Description is required');
        if (!primaryKeyword) errors.push('Primary Keyword is required for SEO');

        if (errors.length > 0) {
            toast.error('Cannot publish: ' + errors[0]);
            return false;
        }

        // Warnings (Non-blocking)
        if (seoTitle.length > 60) toast.warning('SEO Title is longer than 60 characters');
        if (seoDescription.length > 160) toast.warning('Meta Description is longer than 160 characters');

        return true;
    };

    const handlePublish = async () => {
        if (!validateForPublish()) return;

        // Ensure we save latest metadata before publishing
        await handleSave();

        if (onPublish) {
            await onPublish();
        } else {
            await onSave({ status: 'published' });
        }
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-surface-dark border-l border-wt-border border-wt-border transition-colors duration-300">
            {/* Header */}
            <div className="border-b border-wt-border px-6 py-4 bg-white dark:bg-surface-darker/50">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                    Inspector
                </h2>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                <Tabs defaultValue="metadata" className="w-full">
                    <TabsList className="w-full justify-start rounded-none border-b border-wt-border bg-transparent h-auto p-0">
                        <TabsTrigger 
                            value="metadata" 
                            className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-wt-gold dark:data-[state=active]:border-primary-400 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white data-[state=active]:text-gray-900 dark:data-[state=active]:text-white font-medium transition-colors"
                        >
                            Metadata
                        </TabsTrigger>
                        <TabsTrigger 
                            value="versions" 
                            className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-wt-gold dark:data-[state=active]:border-primary-400 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white data-[state=active]:text-gray-900 dark:data-[state=active]:text-white font-medium transition-colors"
                        >
                            Versions
                        </TabsTrigger>
                        <TabsTrigger 
                            value="repurpose" 
                            className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-wt-gold dark:data-[state=active]:border-primary-400 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white data-[state=active]:text-gray-900 dark:data-[state=active]:text-white font-medium transition-colors"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Repurpose
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="metadata" className="mt-0 pb-10">
                        <Accordion type="single" collapsible defaultValue="publishing" className="w-full">
                            {/* 1. Publishing & Schedule */}
                            <AccordionItem value="publishing" className="border-b border-wt-border">
                                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 data-[state=open]:bg-gray-50/80 dark:data-[state=open]:bg-gray-900/50 hover:no-underline group transition-colors">
                                    <div className="flex items-center gap-2">
                                        <Send className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-data-[state=open]:text-primary transition-colors" />
                                        <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-data-[state=open]:text-gray-900 dark:group-data-[state=open]:text-white transition-colors">Publishing</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 pt-2 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="status" className="text-gray-700 dark:text-gray-200 text-xs">Status</Label>
                                        <Select value={status} onValueChange={(v: string) => setStatus(v as ArticleStatus)}>
                                            <SelectTrigger id="status" className="bg-white dark:bg-surface-darker border-wt-border text-gray-900 dark:text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white dark:bg-surface-darker border-wt-border text-wt-text dark:text-wt-text/90">
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="published">Published</SelectItem>
                                                <SelectItem value="archived">Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleSave}
                                                disabled={saving}
                                                variant="secondary"
                                                className="flex-1 dark:bg-secondary-600 dark:hover:bg-secondary-500"
                                                size="sm"
                                            >
                                                {saving ? (
                                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                                                ) : (
                                                    <><Save className="w-4 h-4 mr-2" />Save</>
                                                )}
                                            </Button>

                                            {onPreview && (
                                                <Button
                                                    onClick={onPreview}
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 border-wt-border text-gray-700 hover:bg-gray-100 dark:bg-gray-800/50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Preview
                                                </Button>
                                            )}
                                        </div>

                                        {onPublish && (
                                            <Button
                                                onClick={handlePublish}
                                                disabled={saving || status === 'published'}
                                                variant="outline"
                                                size="sm"
                                                className="w-full border-green-600 text-green-700 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-900/20"
                                            >
                                                <Send className="w-4 h-4 mr-2" />
                                                Publish Final
                                            </Button>
                                        )}
                                    </div>

                                    {article.id && (
                                        <div className="pt-4 border-t border-wt-border">
                                            <ArticleScheduling
                                                articleId={article.id}
                                                currentStatus={status}
                                                scheduledPublishAt={(article as any).scheduled_publish_at}
                                                onScheduled={() => {
                                                    queryClient.invalidateQueries({ queryKey: ['article', article.id] });
                                                }}
                                            />
                                        </div>
                                    )}
                                </AccordionContent>
                            </AccordionItem>

                            {/* 2. Classification & Authors */}
                            <AccordionItem value="classification" className="border-b border-wt-border">
                                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 data-[state=open]:bg-gray-50/80 dark:data-[state=open]:bg-gray-900/50 hover:no-underline group transition-colors">
                                    <div className="flex items-center gap-2">
                                        <Search className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-data-[state=open]:text-primary transition-colors" />
                                        <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-data-[state=open]:text-gray-900 dark:group-data-[state=open]:text-white transition-colors">Classification</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 pt-2 space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <Label htmlFor="category" className="text-wt-text dark:text-wt-text/80 text-xs">Category</Label>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-secondary-600 dark:text-wt-gold hover:bg-wt-gold-subtle dark:hover:bg-primary-900/20 text-[10px]"
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
                                         <Label htmlFor="sub-category" className="text-wt-text dark:text-wt-text/80 text-xs">Topic / Sub-Category</Label>
                                         <SubCategorySelect
                                            categorySlug={category}
                                            value={subCategory}
                                            onValueChange={setSubCategory}
                                            className="mt-1 bg-white dark:bg-surface-darker border-wt-border text-sm"
                                         />
                                    </div>
                                    <div>
                                        <Label htmlFor="language" className="text-wt-text dark:text-wt-text/80 text-xs">Language</Label>
                                        <Select value={language} onValueChange={(v: string) => setLanguage(v as ArticleLanguage)}>
                                            <SelectTrigger id="language" className="bg-white dark:bg-surface-darker border-wt-border">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white dark:bg-surface-darker border-wt-border">
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
                                    <div className="pt-2 space-y-4">
                                        <div>
                                            <Label className="text-wt-text dark:text-wt-text/80 mb-1.5 block text-xs">Primary Author</Label>
                                            <AuthorSelect 
                                                value={authorId}
                                                onValueChange={(id) => setAuthorId(id)}
                                                roleFilter="author"
                                                placeholder="Assign author..."
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-wt-text dark:text-wt-text/80 mb-1.5 block text-xs">Expert Verifier (Editor)</Label>
                                            <AuthorSelect 
                                                value={editorId}
                                                onValueChange={(id) => setEditorId(id)}
                                                roleFilter="editor"
                                                placeholder="Assign verifier..."
                                            />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* 3. SEO Keywords & Intent */}
                            <AccordionItem value="seo-keywords" className="border-b border-wt-border">
                                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 data-[state=open]:bg-gray-50/80 dark:data-[state=open]:bg-gray-900/50 hover:no-underline group transition-colors">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-data-[state=open]:text-primary transition-colors" />
                                        <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-data-[state=open]:text-gray-900 dark:group-data-[state=open]:text-white transition-colors">SEO Keywords</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 pt-2 space-y-4">
                                    <div>
                                        <Label htmlFor="primary-keyword" className="text-gray-700 dark:text-gray-200 text-xs">Primary Keyword</Label>
                                        <Input
                                            id="primary-keyword"
                                            value={primaryKeyword}
                                            onChange={(e) => setPrimaryKeyword(e.target.value)}
                                            placeholder="e.g., mutual funds"
                                            className="mt-1 bg-white dark:bg-surface-darker border-wt-border text-sm"
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
                                        <Label htmlFor="secondary-keywords" className="text-wt-text dark:text-wt-text/80 text-xs">Secondary Keywords</Label>
                                        <Input
                                            id="secondary-keywords"
                                            value={secondaryKeywordInput}
                                            onChange={(e) => setSecondaryKeywordInput(e.target.value)}
                                            onKeyDown={handleSecondaryKeywordKeyDown}
                                            placeholder="Press Enter to add"
                                            className="mt-1 bg-white dark:bg-surface-darker border-wt-border text-sm"
                                        />
                                        {secondaryKeywords.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {secondaryKeywords.map((kw) => (
                                                    <Badge key={kw} variant="outline" className="text-[11px] bg-wt-card dark:bg-surface-darker">
                                                        {kw}
                                                        <button onClick={() => removeSecondaryKeyword(kw)} className="ml-1 hover:text-wt-danger">×</button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="search-intent" className="text-wt-text dark:text-wt-text/80 text-xs">Search Intent</Label>
                                        <Select value={searchIntent} onValueChange={(v: string) => setSearchIntent(v as any)}>
                                            <SelectTrigger id="search-intent" className="bg-white dark:bg-surface-darker border-wt-border text-sm">
                                                <SelectValue placeholder="Select intent" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white dark:bg-surface-darker border-wt-border">
                                                <SelectItem value="informational">Informational</SelectItem>
                                                <SelectItem value="commercial">Commercial</SelectItem>
                                                <SelectItem value="transactional">Transactional</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* 4. SEO Metadata */}
                            <AccordionItem value="seo-meta" className="border-b border-wt-border">
                                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 data-[state=open]:bg-gray-50/80 dark:data-[state=open]:bg-gray-900/50 hover:no-underline group transition-colors">
                                    <div className="flex items-center gap-2">
                                        <Search className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-data-[state=open]:text-primary transition-colors" />
                                        <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-data-[state=open]:text-gray-900 dark:group-data-[state=open]:text-white transition-colors">SEO Metadata</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 pt-2 space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">AI Optimization</span>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-6 text-amber-600 hover:bg-amber-50 dark:text-amber-400 text-[10px]"
                                            onClick={handleAutoOptimize}
                                            disabled={isOptimizing}
                                        >
                                            {isOptimizing ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <Wand2 className="w-3 h-3 mr-1"/>}
                                            Auto-Fix
                                        </Button>
                                    </div>
                                    <div>
                                        <Label htmlFor="seo-title" className="text-gray-700 dark:text-gray-200 text-xs text-xs">SEO Title</Label>
                                        <Input
                                            id="seo-title"
                                            value={seoTitle}
                                            onChange={(e) => setSeoTitle(e.target.value)}
                                            placeholder={article.title || 'SEO title'}
                                            maxLength={70}
                                            className={cn("mt-1 bg-white dark:bg-surface-darker border-wt-border text-sm", seoTitle.length > 60 && "border-warning-500")}
                                        />
                                        <p className={cn("text-[10px] mt-1", seoTitle.length > 60 ? "text-warning-600" : "text-muted-foreground")}>
                                            {seoTitle.length}/60 characters
                                        </p>
                                    </div>
                                    <div>
                                        <Label htmlFor="seo-description" className="text-gray-700 dark:text-gray-200 text-xs">Meta Description</Label>
                                        <Textarea
                                            id="seo-description"
                                            value={seoDescription}
                                            onChange={(e) => setSeoDescription(e.target.value)}
                                            placeholder="Meta description for search engines..."
                                            rows={3}
                                            maxLength={165}
                                            className={cn("resize-none mt-1 bg-white dark:bg-surface-darker border-wt-border text-sm", seoDescription.length > 160 && "border-warning-500")}
                                        />
                                        <p className={cn("text-[10px] mt-1", seoDescription.length > 160 ? "text-warning-600" : "text-muted-foreground")}>
                                            {seoDescription.length}/160 characters
                                        </p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* 5. Enhancements (Media, Tags, Excerpt) */}
                            <AccordionItem value="enhancements" className="border-b border-wt-border">
                                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 data-[state=open]:bg-gray-50/80 dark:data-[state=open]:bg-gray-900/50 hover:no-underline group transition-colors">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-data-[state=open]:text-primary transition-colors" />
                                        <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-data-[state=open]:text-gray-900 dark:group-data-[state=open]:text-white transition-colors">Enhancements</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 pt-2 space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-wt-text dark:text-wt-text/80 text-xs text-xs mb-1 block">Featured Media</Label>
                                        <FeaturedImageSelector 
                                            imageUrl={featuredImage}
                                            onImageSelect={setFeaturedImage}
                                            articleTitle={article.title}
                                            articleCategory={category}
                                            keywords={[primaryKeyword, ...secondaryKeywords].filter(Boolean)}
                                        />
                                    </div>
                                    
                                    <div className="space-y-4 pt-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-wt-text dark:text-wt-text/80 text-xs">Tags</Label>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-secondary-600 dark:text-wt-gold hover:bg-wt-gold-subtle text-[10px]"
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
                                                className="bg-white dark:bg-surface-darker border-wt-border text-sm"
                                            />
                                            {tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {tags.map((tag) => (
                                                        <Badge key={tag} variant="outline" className="text-[11px] bg-wt-card dark:bg-surface-darker">
                                                            {tag}
                                                            <button onClick={() => removeTag(tag)} className="ml-1 hover:text-wt-danger">×</button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <Label className="text-wt-text dark:text-wt-text/80 text-xs">Excerpt</Label>
                                        <Textarea
                                            value={excerpt}
                                            onChange={(e) => setExcerpt(e.target.value)}
                                            placeholder="Brief summary..."
                                            rows={3}
                                            maxLength={300}
                                            className={cn("resize-none bg-white dark:bg-surface-darker border-wt-border text-sm", excerpt.length > 300 && "border-warning-500")}
                                        />
                                        <p className={cn("text-[10px] mt-1", excerpt.length > 300 ? "text-warning-600" : "text-muted-foreground")}>
                                            {excerpt.length}/300 characters
                                        </p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* 6. Intelligence & Tools */}
                            <AccordionItem value="intelligence" className="border-b border-wt-border">
                                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 data-[state=open]:bg-gray-50/80 dark:data-[state=open]:bg-gray-900/50 hover:no-underline group transition-colors">
                                    <div className="flex items-center gap-2">
                                        <Wand2 className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-data-[state=open]:text-primary transition-colors" />
                                        <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-data-[state=open]:text-gray-900 dark:group-data-[state=open]:text-white transition-colors">Intelligence</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 pt-2 space-y-6">
                                    {article.ai_generated && (
                                        <div className="p-3 bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Sparkles className="w-4 h-4 text-amber-600" />
                                                <span className="text-xs font-medium text-amber-800 dark:text-amber-400">AI Generated</span>
                                            </div>
                                            <p className="text-[10px] text-amber-700 dark:text-amber-200/70">
                                                Content was generated with AI. Review before publishing.
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Translation Tool</h4>
                                        <div className="flex gap-2">
                                             <Select value={targetLang} onValueChange={setTargetLang}>
                                                <SelectTrigger className="flex-1 bg-white dark:bg-surface-darker border-wt-border text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="hi">Hindi</SelectItem>
                                                    <SelectItem value="te">Telugu</SelectItem>
                                                    <SelectItem value="mr">Marathi</SelectItem>
                                                    <SelectItem value="ta">Tamil</SelectItem>
                                                    <SelectItem value="bn">Bengali</SelectItem>
                                                    <SelectItem value="gu">Gujarati</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button size="sm" onClick={handleTranslate} disabled={isTranslating}>
                                                {isTranslating ? <Loader2 className="w-3 h-3 animate-spin"/> : "Go"}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-wt-border">
                                        <SocialPostManager articleId={article.id || ''} />
                                        
                                        {article.id && (
                                            <>
                                                <ValidationReport articleId={article.id} title={article.title} content={article.content} category={category} />
                                                <BrokenLinkReport articleId={article.id} />
                                            </>
                                        )}

                                        {article.title && article.content && (
                                            <SEOScoreCalculator title={article.title} content={article.content} metaDescription={seoDescription} keywords={keywordsForSEO} />
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
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
                            <div className="text-center text-wt-text-muted dark:text-wt-text-muted py-8">
                                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>Save the article to see version history</p>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="repurpose" className="px-6 py-6 mt-0">
                         <RepurposePanel 
                            articleId={article.id} 
                            title={article.title || ''} 
                            content={article.content || ''} 
                         />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
