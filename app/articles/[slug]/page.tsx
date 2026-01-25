/**
 * WordPress-style Public Article Page
 * 
 * GUARANTEES:
 * - Slug always resolves if published
 * - Preview mode bypasses status check
 * - No conditional fetching
 * 
 * TODO: Migrate to Server Component with ISR
 * - Add: export const revalidate = 3600
 * - Add: generateStaticParams() for top 100 articles
 * - Extract client components: BookmarkButton, Share, etc.
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
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
import DraggableTableOfContents from '@/components/blog/DraggableTableOfContents';
import './article-content.css';
import { AuthorBadge } from '@/components/articles/AuthorBadge';
import { AdvertiserDisclosure } from '@/components/common/AdvertiserDisclosure';
// Engagement Components
import { BookmarkButton, NewsletterWidget } from '@/components/engagement';
import RelatedArticles from '@/components/articles/RelatedArticles';
import ContextualCTA from '@/components/monetization/ContextualCTA';
import ContextualProducts from '@/components/products/ContextualProducts';
import TopPicksSidebar from '@/components/products/TopPicksSidebar';
import LeadMagnet from '@/components/monetization/LeadMagnet';
import SeamlessCTA from '@/components/articles/SeamlessCTA';
import { ReadingProgressBar } from '@/components/articles/ReadingProgressBar';

export default function ArticleDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params?.slug as string;
    const previewToken = searchParams?.get('preview');
    
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);

    // Reading Progress Logic
    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight;
            setReadingProgress(Math.min(Math.max(scrollPercent * 100, 0), 100));
        };

        window.addEventListener('scroll', updateProgress);
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    useEffect(() => {
        if (slug) {
            loadArticle();
        }
    }, [slug, previewToken]);

    const loadArticle = async () => {
        try {
            // Use client-safe Supabase client (no server-only imports)
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();
            
            let query = supabase
                .from('articles')
                .select('*, author:authors!author_id(*)') // specific inner/left join hint if needed, or just authors(*)
                .eq('slug', slug);

            // Preview mode: fetch any status if user is authenticated
            if (previewToken) {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    setNotFound(true);
                    setLoading(false);
                    return;
                }
                // In preview mode, fetch regardless of status
            } else {
                // Public mode: only fetch published articles
                query = query.eq('status', 'published').not('published_at', 'is', null);
            }

            const { data: articleData, error } = await query.single();
            
            if (error || !articleData) {
                // Try fallback fetch without join if join failed (e.g. FK matching issue)
                 if (error && error.code === 'PGRST200') {
                    // Start over without join
                     const { data: simpleData, error: simpleError } = await supabase
                        .from('articles')
                        .select('*')
                        .eq('slug', slug)
                        .single();
                        
                     if (!simpleError && simpleData) {
                         // Fetch author separately
                         if (simpleData.author_id) {
                             const { data: authorData } = await supabase
                                .from('authors')
                                .select('*')
                                .eq('id', simpleData.author_id)
                                .single();
                             simpleData.author = authorData;
                         } else if (simpleData.author_name) {
                              const { data: authorData } = await supabase
                                .from('authors')
                                .select('*')
                                .eq('name', simpleData.author_name)
                                .single();
                             simpleData.author = authorData;
                         }
                         setArticle(simpleData);
                         setLoading(false);
                         return;
                     }
                 }
                 
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
            if (!previewToken && articleData.status === 'published' && articleData.id) {
                try {
                    const { createClient } = await import('@/lib/supabase/client');
                    const supabase = createClient();
                    await supabase
                        .from('articles')
                        .update({ views: (articleData.views || 0) + 1 })
                        .eq('id', articleData.id);
                } catch (error) {
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
            <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
                <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
                <p className="text-muted-foreground mb-6">
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

    const structuredData = article.schema_markup ? article.schema_markup.articleSchema : generateSchema(article);
    const faqSchema = article.schema_markup?.faqSchema;
    const canonicalUrl = generateCanonicalUrl(`/articles/${article.slug}`);
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

    // Lead Magnet Determination
    const getLeadMagnet = () => {
        if (article.category === 'credit-cards') {
            return {
                title: "Credit Card Rewards Tracker (Excel)",
                description: "The ultimate spreadsheet to track your rewards, milestone benefits, and avoid expiry of points.",
                type: 'excel' as const
            };
        }
        if (article.category === 'loans') {
            return {
                title: "EMI Comparison & Prepayment Calculator",
                description: "Find out how much you can save in interest by making small regular prepayments.",
                type: 'excel' as const
            };
        }
        return {
            title: "Master Personal Finance Dashboard",
            description: "Manage your income, expenses, and track your Net Worth in one professional Google Sheet.",
            type: 'google-sheet' as const
        };
    };

    const magnet = getLeadMagnet();

    return (
        <div className="min-h-screen bg-background relative">
            {/* Reading Progress Bar (UI/UX Phase 3) */}
            <ReadingProgressBar targetId="article-content" height={2} />

            <SEOHead
                title={article.seo_title || `${article.title} | InvestingPro`}
                description={article.seo_description || article.excerpt}
                url={canonicalUrl}
                structuredData={[structuredData, breadcrumbSchema, faqSchema].filter(Boolean)}
            />

            {/* Preview Banner */}
            {previewToken && article.status !== 'published' && (
                <div className="bg-accent/10 border-b border-accent/20 px-4 py-2 text-center relative z-50">
                    <p className="text-sm text-accent-foreground flex items-center justify-center gap-2">
                        <strong>PREVIEW MODE</strong> - This article is {article.status}. 
                        {article.id ? (
                            <a 
                                href={`/admin/articles/${article.id}/edit`} 
                                className="ml-2 underline font-bold hover:text-accent"
                            >
                                Edit Article ✏️
                            </a>
                        ) : (
                            <span className="text-destructive text-xs ml-2">(ID Missing)</span>
                        )}
                    </p>
                </div>
            )}

            {/* Layout Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <DraggableTableOfContents />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content Column */}
                    <article className="lg:col-span-8">
                        {/* Header */}
                        <div className="mb-8">
                            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                                {article.category?.replace(/-/g, ' ')}
                            </Badge>
                            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
                                {article.title}
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                {article.excerpt}
                            </p>

                            <div className="flex flex-wrap items-center gap-y-4 gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
                                <AuthorBadge 
                                    name={article.author?.name || article.author_name || 'InvestingPro Team'} 
                                    role={article.author?.role || article.author_role}
                                    avatarUrl={article.author?.photo_url || article.author_avatar}
                                    slug={article.author?.slug}
                                    bio={article.author?.bio}
                                    credentials={article.author?.credentials}
                                    size="md"
                                    showRole={true}
                                />

                                {article.published_date && (
                                    <span className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground/70" />
                                        {new Date(article.published_date).toLocaleDateString('en-IN', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </span>
                                )}
                                <span className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground/70" />
                                    {article.read_time || '5'} min read
                                </span>
                                <span className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-muted-foreground/70" />
                                    {article.views || 0} views
                                </span>

                                <div className="flex items-center gap-2 ml-auto">
                                    <BookmarkButton articleId={article.id} variant="icon" size="md" />
                                    <button 
                                        onClick={() => navigator.share?.({ title: article.title, url: window.location.href })}
                                        className="w-10 h-10 rounded-xl bg-muted text-muted-foreground hover:text-primary hover:bg-muted/80 flex items-center justify-center transition-colors"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
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
                        <AdvertiserDisclosure className="mb-8" />
                        <div id="article-content">
                            <ArticleRenderer
                                body_html={article.body_html}
                                body_markdown={article.body_markdown}
                                content={article.content}
                            />
                        </div>

                        {/* Seamless Actions */}
                        <SeamlessCTA category={article.category} />

                        {/* Lead Magnet Injection */}
                        <LeadMagnet 
                            title={magnet.title}
                            description={magnet.description}
                            type={magnet.type}
                            downloadUrl="#"
                        />

                        {/* Contextual Products Block */}
                        <ContextualProducts category={article.category} />

                        {/* Tags */}
                        {article.tags && article.tags.length > 0 && (
                            <div className="mt-16 pt-8 border-t border-border">
                                <p className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Tags</p>
                                <div className="flex flex-wrap gap-2">
                                    {article.tags.map((tag: string, idx: number) => (
                                        <Badge key={idx} variant="secondary" className="bg-muted text-muted-foreground font-medium">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Related Content */}
                        <div className="mt-16 space-y-12">
                            <RelatedArticles articleId={article.id} />
                            <NewsletterWidget variant="inline" />
                        </div>

                        {/* Navigation */}
                        <div className="mt-16 pt-8 border-t flex justify-between">
                            <Link href="/articles">
                                <Button variant="outline">← All Articles</Button>
                            </Link>
                            <Link href={`/category/${article.category}`}>
                                <Button variant="outline">More in {article.category?.replace(/-/g, ' ')} →</Button>
                            </Link>
                        </div>
                    </article>

                    {/* Sidebar Column */}
                    <aside className="lg:col-span-4 hidden lg:block">
                        <TopPicksSidebar category={article.category} />
                    </aside>
                </div>
            </div>
        </div>
    );
}
