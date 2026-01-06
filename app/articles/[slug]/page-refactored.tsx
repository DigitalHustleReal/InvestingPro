/**
 * WordPress-style Public Article Page
 * 
 * GUARANTEES:
 * - Slug always resolves if published
 * - Preview mode bypasses status check
 * - No conditional fetching
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { articleService } from '@/lib/cms/article-service';
import SEOHead from '@/components/common/SEOHead';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, User, Eye, Share2 } from 'lucide-react';
import Link from 'next/link';
import ArticleRenderer from '@/components/articles/ArticleRenderer';
import { generateSchema } from '@/lib/linking/schema';
import { generateCanonicalUrl } from '@/lib/linking/canonical';
import { generateBreadcrumbSchema } from '@/lib/linking/breadcrumbs';

export default function ArticleDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params?.slug as string;
    const previewToken = searchParams?.get('preview');
    
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (slug) {
            loadArticle();
        }
    }, [slug, previewToken]);

    const loadArticle = async () => {
        try {
            // CRITICAL: Use article service (guaranteed slug resolution)
            const articleData = await articleService.getBySlug(slug, previewToken || undefined);
            
            if (!articleData) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            // Preview mode: Show banner
            if (previewToken && articleData.status !== 'published') {
                // Valid preview - show article
                setArticle(articleData);
            } else if (!previewToken && articleData.status !== 'published') {
                // Not preview and not published = 404
                setNotFound(true);
                setLoading(false);
                return;
            } else {
                // Published article
                setArticle(articleData);
            }

            // Increment views (only for published, non-preview)
            if (!previewToken && articleData.status === 'published') {
                try {
                    await articleService.saveArticle(
                        articleData.id!,
                        {
                            body_markdown: articleData.body_markdown,
                            body_html: articleData.body_html,
                            content: articleData.content,
                        },
                        {
                            views: (articleData.views || 0) + 1,
                        } as any
                    );
                } catch (error) {
                    // Non-critical - just log
                    console.error('Failed to increment views:', error);
                }
            }
        } catch (error) {
            console.error('Error loading article:', error);
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner text="Loading article..." />
            </div>
        );
    }

    if (notFound || !article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Article Not Found</h1>
                <p className="text-slate-600 mb-6">
                    The article you're looking for doesn't exist or hasn't been published yet.
                </p>
                <div className="flex gap-4">
                    <Link href="/articles">
                        <Button>Browse All Articles</Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline">Go Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Generate SEO data
    const breadcrumbs = [
        { label: 'Home', url: '/' },
        { label: 'Articles', url: '/articles' },
        { label: article.title, url: `/articles/${article.slug}` },
    ];

    const structuredData = generateSchema(article);
    const canonicalUrl = generateCanonicalUrl(`/articles/${article.slug}`);
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

    return (
        <div className="min-h-screen bg-white">
            <SEOHead
                title={article.seo_title || `${article.title} | InvestingPro`}
                description={article.seo_description || article.excerpt}
                url={canonicalUrl}
                structuredData={[structuredData, breadcrumbSchema]}
            />

            {/* Preview Banner */}
            {previewToken && article.status !== 'published' && (
                <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 text-center">
                    <p className="text-sm text-yellow-800">
                        <strong>PREVIEW MODE</strong> - This article is {article.status}. 
                        <Link href={`/admin/articles/${article.id}/edit`} className="ml-2 underline">
                            Edit Article
                        </Link>
                    </p>
                </div>
            )}

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <Badge className="mb-4 bg-teal-50 text-teal-700 border-teal-100">
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
                        {article.read_time && (
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                {article.read_time} min read
                            </span>
                        )}
                        <span className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-slate-400" />
                            {article.views || 0} views
                        </span>
                    </div>
                </div>

                {/* Featured Image */}
                {article.featured_image && (
                    <div className="relative aspect-video w-full mb-12 rounded-3xl overflow-hidden shadow-2xl">
                        <img
                            src={article.featured_image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Content - Using Shared Renderer */}
                <ArticleRenderer
                    body_html={article.body_html}
                    body_markdown={article.body_markdown}
                    content={article.content}
                />

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                    <div className="mt-16 pt-8 border-t">
                        <p className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Tags</p>
                        <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-600">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="mt-16 pt-8 border-t">
                    <div className="flex justify-between">
                        <Link href="/articles">
                            <Button variant="outline">← All Articles</Button>
                        </Link>
                        <Link href={`/category/${article.category}`}>
                            <Button variant="outline">
                                More in {article.category?.replace(/-/g, ' ')} →
                            </Button>
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
}



