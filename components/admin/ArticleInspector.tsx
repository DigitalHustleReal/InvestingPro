"use client";

import React, { useState, useMemo } from 'react';
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
import CategorySelect from '@/components/admin/CategorySelect';
import { Loader2, Save, Eye, Send, Sparkles, Calendar, Search, Wand2, Languages } from 'lucide-react';
import { toast } from 'sonner';
import type { ArticleCategory, ArticleLanguage, ArticleStatus, ContentType } from '@/types/article';
import KeywordResearchQuickAccess from './KeywordResearchQuickAccess';
import SubCategorySelect from './SubCategorySelect';
import FeaturedImageSelector from './FeaturedImageSelector';

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
    // Local state for form fields
    const [category, setCategory] = useState<ArticleCategory>(article.category || 'investing-basics');
    const [subCategory, setSubCategory] = useState(article.editorial_notes?.sub_category || '');
    const [language, setLanguage] = useState<ArticleLanguage>(article.language || 'en');
    const [status, setStatus] = useState<ArticleStatus>(article.status || 'draft');
    const [excerpt, setExcerpt] = useState(article.excerpt || '');
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
    const [targetLang, setTargetLang] = useState('hi');

    const handleTranslate = async () => {
        setIsTranslating(true);
        try {
            const res = await fetch('/api/admin/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    articleId: article.id,
                    targetLang,
                    title: article.title,
                    content: article.content 
                })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);
            
            toast.success(`Translation Created! Title: ${json.translated_title}`);
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

    // Handle tag input
    const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase();
            if (!tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
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
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="border-b border-slate-200 px-6 py-4 bg-slate-50">
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                    Inspector
                </h2>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {/* Publishing Controls */}
                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Publishing
                    </h3>
                    <div className="space-y-2">
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select value={status} onValueChange={(v: string) => setStatus(v as ArticleStatus)}>
                                <SelectTrigger id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1"
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
                            {onPublish && (
                                <Button
                                    onClick={handlePublish}
                                    disabled={saving || status === 'published'}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Publish
                                </Button>
                            )}
                            {onPreview && (
                                <Button
                                    onClick={onPreview}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Preview
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* AI Status */}
                {article.ai_generated && (
                    <div className="space-y-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-900">AI Generated</span>
                        </div>
                        <p className="text-xs text-amber-700">
                            This content was generated with AI assistance. Please review before publishing.
                        </p>
                    </div>
                )}

                {/* Featured Image */}
                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Featured Media
                    </h3>
                    <FeaturedImageSelector 
                        imageUrl={featuredImage}
                        onImageSelect={setFeaturedImage}
                    />
                </div>

                {/* Category & Language */}
                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Classification
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <CategorySelect
                                value={category}
                                onValueChange={(v: string) => setCategory(v as ArticleCategory)}
                            />
                        </div>
                        <div>
                             <Label htmlFor="sub-category">Topic / Sub-Category</Label>
                             <SubCategorySelect
                                categorySlug={category}
                                value={subCategory}
                                onValueChange={setSubCategory}
                                className="mt-1"
                             />
                        </div>
                        <div>
                            <Label htmlFor="language">Language</Label>
                            <Select value={language} onValueChange={(v: string) => setLanguage(v as ArticleLanguage)}>
                                <SelectTrigger id="language">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
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
                    <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        SEO Keywords & Intent
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <Label htmlFor="primary-keyword">Primary Keyword</Label>
                            <Input
                                id="primary-keyword"
                                value={primaryKeyword}
                                onChange={(e) => setPrimaryKeyword(e.target.value)}
                                placeholder="e.g., mutual funds"
                                className="mt-1"
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
                            <Label htmlFor="secondary-keywords">Secondary Keywords</Label>
                            <Input
                                id="secondary-keywords"
                                value={secondaryKeywordInput}
                                onChange={(e) => setSecondaryKeywordInput(e.target.value)}
                                onKeyDown={handleSecondaryKeywordKeyDown}
                                placeholder="Press Enter to add"
                                className="mt-1"
                            />
                            {secondaryKeywords.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {secondaryKeywords.map((kw) => (
                                        <Badge key={kw} variant="outline" className="text-xs">
                                            {kw}
                                            <button
                                                onClick={() => removeSecondaryKeyword(kw)}
                                                className="ml-1 hover:text-red-600"
                                            >
                                                ×
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="search-intent">Search Intent</Label>
                            <Select
                                value={searchIntent}
                                onValueChange={(v: string) => setSearchIntent(v as 'informational' | 'commercial' | 'transactional' | '')}
                            >
                                <SelectTrigger id="search-intent">
                                    <SelectValue placeholder="Select intent" />
                                </SelectTrigger>
                                <SelectContent>
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
                    <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Tags
                    </h3>
                    <div>
                        <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagInputKeyDown}
                            placeholder="Press Enter to add tag"
                        />
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                        <button
                                            onClick={() => removeTag(tag)}
                                            className="ml-1 hover:text-red-600"
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
                    <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Excerpt
                    </h3>
                    <Textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Brief summary of the article..."
                        rows={3}
                        className="resize-none"
                    />
                </div>

                {/* SEO Metadata */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            SEO Metadata
                        </h3>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-purple-600 hover:bg-purple-50"
                            onClick={handleAutoOptimize}
                            disabled={isOptimizing}
                        >
                            {isOptimizing ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <Wand2 className="w-3 h-3 mr-1"/>}
                            Auto-Fix
                        </Button>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <Label htmlFor="seo-title">SEO Title</Label>
                            <Input
                                id="seo-title"
                                value={seoTitle}
                                onChange={(e) => setSeoTitle(e.target.value)}
                                placeholder={article.title || 'SEO title'}
                                className="mt-1"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                {seoTitle.length}/60 characters
                            </p>
                        </div>
                        <div>
                            <Label htmlFor="seo-description">Meta Description</Label>
                            <Textarea
                                id="seo-description"
                                value={seoDescription}
                                onChange={(e) => setSeoDescription(e.target.value)}
                                placeholder="Meta description for search engines..."
                                rows={3}
                                className="resize-none mt-1"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                {seoDescription.length}/160 characters
                            </p>
                        </div>
                    </div>
                </div>

                {/* Translation Tool */}
                <div className="space-y-3 pt-4 border-t border-slate-200">
                    <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <Languages className="w-4 h-4" />
                        Translate
                    </h3>
                    <div className="flex gap-2">
                         <Select value={targetLang} onValueChange={setTargetLang}>
                            <SelectTrigger className="flex-1">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                                <SelectItem value="te">Telugu (తెలుగు)</SelectItem>
                                <SelectItem value="mr">Marathi (मराठी)</SelectItem>
                                <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                                <SelectItem value="bn">Bengali (বাংলা)</SelectItem>
                                <SelectItem value="gu">Gujarati (ગુજરાતી)</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button 
                            size="sm"
                            variant="default"
                            onClick={handleTranslate}
                            disabled={isTranslating}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                             {isTranslating ? <Loader2 className="w-4 h-4 animate-spin"/> : "Go"}
                        </Button>
                    </div>
                    <p className="text-xs text-slate-500">
                        Creates a new draft article in the selected language.
                    </p>
                </div>

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
            </div>
        </div>
    );
}
