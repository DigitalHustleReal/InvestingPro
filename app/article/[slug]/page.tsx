"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from "@/lib/api";
import { logger } from "@/lib/logger";
import SEOHead from "@/components/common/SEOHead";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, User, Eye, Share2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import AutoInternalLinks from '@/components/common/AutoInternalLinks';
import { generateSchema } from '@/lib/linking/schema';
import { generateCanonicalUrl } from '@/lib/linking/canonical';
import { generateBreadcrumbSchema } from '@/lib/linking/breadcrumbs';

interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author_name: string;
    published_date: string;
    read_time: number;
    views: number;
    category: string;
    featured_image?: string;
    seo_title?: string;
    seo_description?: string;
    tags?: string[];
}

export default function ArticleDetail() {
    const params = useParams();
    const slug = params?.slug as string;
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            loadArticle();
        }
    }, [slug]);

    const loadArticle = async () => {
        try {
            const articles = await api.entities.Article.filter({ slug });
            if (articles.length > 0) {
                const articleData = articles[0];
                setArticle(articleData);
                // Increment views
                await api.entities.Article.update(articleData.id, { views: (articleData.views || 0) + 1 });
            }
        } catch (error) {
            logger.error('Error loading article', error as Error, { slug });
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

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Article Not Found</h1>
                <Link href="/blog">
                    <Button>Browse All Articles</Button>
                </Link>
            </div>
        );
    }

    // Generate automated schema
    const breadcrumbs = [
        { label: 'Home', url: '/' },
        { label: 'Blog', url: '/blog' },
        { label: article.title, url: `/article/${article.slug}` },
    ];

    const explainerSchema = generateSchema({
        pageType: 'explainer',
        title: article.title,
        description: article.excerpt,
        url: `/article/${article.slug}`,
        breadcrumbs,
        publishedDate: article.published_date,
        author: article.author_name,
        category: article.category,
    });

    const structuredData = [
        explainerSchema,
        generateBreadcrumbSchema(breadcrumbs),
        {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.excerpt,
            "author": {
                "@type": "Person",
                "name": article.author_name
            },
            "datePublished": article.published_date,
            "publisher": {
                "@type": "Organization",
                "name": "InvestingPro.in"
            }
        }
    ];

    // Generate canonical URL
    const canonicalUrl = generateCanonicalUrl(`/article/${article.slug}`);

    // Generate automated internal links
    const linkingContext = {
        contentType: 'explainer' as const,
        category: article.category,
        slug: article.slug,
        relatedTerms: article.tags || [],
    };

    return (
        <div className="min-h-screen bg-white">
            <SEOHead
                title={article.seo_title || `${article.title} | InvestingPro`}
                description={article.seo_description || article.excerpt}
                url={canonicalUrl}
                structuredData={structuredData}
            />

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Automated Breadcrumbs */}
                <AutoBreadcrumbs />

                {/* Header */}
                <div className="mb-8">
                    <Badge className="mb-4 bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-50">
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
                        <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {new Date(article.published_date || Date.now()).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {article.read_time} min read
                        </span>
                        <span className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-slate-400" />
                            {article.views || 0} views
                        </span>
                    </div>

                    <div className="flex gap-2 mb-8">
                        <Button variant="outline" size="sm" className="rounded-full">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </Button>
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

                {/* Content */}
                <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-a:text-teal-600 hover:prose-a:text-teal-700">
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                    <div className="mt-16 pt-8 border-t">
                        <p className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Tags</p>
                        <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-0">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Automated Internal Links */}
                <AutoInternalLinks context={linkingContext} />
            </article>
        </div>
    );
}
