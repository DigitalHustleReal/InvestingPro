"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { articleService } from '@/lib/cms/article-service';
import { logger } from "@/lib/logger";
import SEOHead from "@/components/common/SEOHead";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, User, Eye, Share2, ArrowLeft } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
// AutoInternalLinks removed from preview - causes async client component errors
import { generateSchema } from '@/lib/linking/schema';
import { generateCanonicalUrl } from '@/lib/linking/canonical';
import { generateBreadcrumbSchema } from '@/lib/linking/breadcrumbs';
import { markdownToHTML } from '@/lib/editor/markdown';
import { normalizeArticleBody } from '@/lib/content/normalize';
import ArticleRenderer from '@/components/articles/ArticleRenderer';

interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    body_markdown?: string;
    body_html?: string;
    author_name: string;
    published_date: string;
    read_time: number;
    views: number;
    category: string;
    status: string;
    featured_image?: string;
    seo_title?: string;
    seo_description?: string;
    tags?: string[];
}

export default function PreviewArticlePage() {
    const params = useParams();
    const id = params?.id as string;
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadArticle();
        }
    }, [id]);

    const loadArticle = async () => {
        try {
            // Preview route: fetch by ID (works for draft, review, published)
            // Use articleService for unified workflow
            const articleData = await articleService.getById(id);
            if (articleData) {
                console.log('📄 Preview: Article loaded', {
                    id: articleData.id,
                    title: articleData.title,
                    status: articleData.status,
                    hasBodyHtml: !!articleData.body_html,
                    hasBodyMarkdown: !!articleData.body_markdown,
                    hasContent: !!articleData.content,
                });
                setArticle(articleData);
            } else {
                console.error('❌ Preview: Article not found', { id });
            }
        } catch (error) {
            logger.error('Error loading article for preview', error as Error, { id });
            console.error('❌ Preview: Error loading article', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner text="Loading preview..." />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Article Not Found</h1>
                <Link href="/admin/articles">
                    <Button>Back to Admin</Button>
                </Link>
            </div>
        );
    }

    // Use body_html if available, else body_markdown, else content
    const articleContent = article.body_html || article.body_markdown || article.content || '';
    
    // Debug: Log content availability
    console.log('📝 Preview: Content check', {
        hasBodyHtml: !!article.body_html,
        hasBodyMarkdown: !!article.body_markdown,
        hasContent: !!article.content,
        articleContentLength: articleContent.length,
        bodyHtmlPreview: article.body_html?.substring(0, 100),
        bodyMarkdownPreview: article.body_markdown?.substring(0, 100),
        contentPreview: article.content?.substring(0, 100),
    });

    const structuredData = generateSchema(article);
    const canonicalUrl = generateCanonicalUrl(`/article/${article.slug}`);
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: article.category?.replace(/-/g, ' ') || 'Article', url: `/${article.category}` },
        { name: article.title, url: `/article/${article.slug}` },
    ]);

    return (
        <>
            <SEOHead
                title={article.seo_title || article.title}
                description={article.seo_description || article.excerpt}
                canonicalUrl={canonicalUrl}
                structuredData={[structuredData, breadcrumbSchema]}
            />

            <div className="min-h-screen bg-white">
                {/* Preview Banner */}
                <div className="bg-amber-100 border-b border-amber-200 px-4 py-2">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-amber-800 font-semibold text-sm">PREVIEW MODE</span>
                            <Badge variant="outline" className="bg-white">
                                {article.status}
                            </Badge>
                        </div>
                        <Link href={`/admin/articles/${article.id}/edit`}>
                            <Button size="sm" variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Editor
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Article Content */}
                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <AutoBreadcrumbs />

                    <div className="mb-8">
                        <Badge className="mb-4 bg-blue-100 text-blue-700 border-0">
                            {article.category?.replace(/-/g, ' ')}
                        </Badge>
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                            {article.title}
                        </h1>
                        <p className="text-xl text-slate-500 mb-8 leading-relaxed">
                            {article.excerpt}
                        </p>

                        <div className="flex flex-wrap items-center gap-y-4 gap-6 text-sm text-slate-500 mb-8 pb-8 border-b">
                            <span className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                    <User className="w-4 h-4 text-slate-400" />
                                </div>
                                <span className="font-semibold text-slate-900">{article.author_name}</span>
                            </span>
                            {article.published_date && (
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    {new Date(article.published_date).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            )}
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                {article.read_time} min read
                            </span>
                            <span className="flex items-center gap-2">
                                <Eye className="w-4 h-4 text-slate-400" />
                                {article.views || 0} views
                            </span>
                        </div>
                    </div>

                    {/* Article Content - Using Shared Renderer */}
                    <ArticleRenderer
                        body_html={article.body_html}
                        body_markdown={article.body_markdown}
                        content={article.content}
                        className="prose prose-slate max-w-none dark:prose-invert"
                    />

                    {/* AutoInternalLinks removed from preview to avoid async client component errors */}
                    {/* Preview focuses on content display, not full article features */}
                </article>
            </div>
        </>
    );
}

