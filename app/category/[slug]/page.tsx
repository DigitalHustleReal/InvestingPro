"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { articleService } from '@/lib/cms/article-service';
import SEOHead from '@/components/common/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Search, Clock, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import EmptyState from '@/components/common/EmptyState';

interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    category: string;
    read_time?: number;
    published_at: string;
    published_date?: string;
    featured_image?: string;
    author_name?: string;
}

export default function CategoryPage() {
    const params = useParams();
    const categorySlug = params?.slug as string;
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Fetch published articles for this category only - use articleService
    const { data: articles = [], isLoading } = useQuery({
        queryKey: ['articles', 'category', categorySlug],
        queryFn: async () => {
            const publishedArticles = await articleService.listPublishedArticles(500);
            // Filter by category
            const categoryArticles = publishedArticles.filter(a => a.category === categorySlug);
            // Map to Article interface
            return categoryArticles.map(a => ({
                id: a.id!,
                title: a.title,
                slug: a.slug,
                excerpt: a.excerpt || '',
                category: a.category,
                read_time: a.read_time,
                published_at: a.published_at || '',
                published_date: a.published_date || '',
                featured_image: a.featured_image,
                author_name: a.author_name || 'Admin',
            })) as Article[];
        },
        enabled: !!categorySlug,
        staleTime: 60 * 1000, // Cache for 1 minute
    });

    // Filter articles by search term
    const filteredArticles = articles.filter((article) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            article.title?.toLowerCase().includes(searchLower) ||
            article.excerpt?.toLowerCase().includes(searchLower)
        );
    });

    // Pagination
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

    // Format category name for display
    const categoryName = categorySlug
        ?.replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase()) || 'Category';

    return (
        <div className="min-h-screen bg-white">
            <SEOHead
                title={`${categoryName} Articles | InvestingPro`}
                description={`Explore articles about ${categoryName.toLowerCase()} on InvestingPro.`}
            />

            {/* Header */}
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="mb-4">
                        <Link href="/articles">
                            <Button variant="ghost" size="sm" className="mb-4">
                                ← All Articles
                            </Button>
                        </Link>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                        {categoryName}
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl">
                        {paginatedArticles.length > 0 
                            ? `${articles.length} article${articles.length !== 1 ? 's' : ''} about ${categoryName.toLowerCase()}`
                            : `Articles about ${categoryName.toLowerCase()}`
                        }
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Search */}
                <div className="mb-8">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Articles Grid */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="text-slate-600">Loading articles...</div>
                    </div>
                ) : paginatedArticles.length === 0 ? (
                    <EmptyState
                        title={`No ${categoryName.toLowerCase()} articles found`}
                        description={searchTerm
                            ? "Try adjusting your search."
                            : "No published articles in this category yet."}
                    />
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {paginatedArticles.map((article) => (
                                <Link key={article.id} href={`/articles/${article.slug}`}>
                                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                                        {article.featured_image && (
                                            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                                                <img
                                                    src={article.featured_image}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Badge variant="outline" className="text-xs">
                                                    {article.category?.replace(/-/g, ' ')}
                                                </Badge>
                                            </div>
                                            <h2 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                                                {article.title}
                                            </h2>
                                            {article.excerpt && (
                                                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                                                    {article.excerpt}
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between text-xs text-slate-500">
                                                <div className="flex items-center gap-4">
                                                    {article.read_time && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {article.read_time} min
                                                        </span>
                                                    )}
                                                    {article.published_date && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(article.published_date).toLocaleDateString('en-IN', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    )}
                                                </div>
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <span className="flex items-center px-4 text-slate-600">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

