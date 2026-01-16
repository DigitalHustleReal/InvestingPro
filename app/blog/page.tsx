"use client";

import React, { useState, useCallback } from 'react';
import { useQuery } from "@tanstack/react-query";
import SEOHead from "@/components/common/SEOHead";
import Pagination from "@/components/common/Pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Search, Clock, Calendar, Eye, User, ArrowRight, Loader2, X } from "lucide-react";
import Link from 'next/link';
import PageErrorBoundary from "@/components/common/PageErrorBoundary";
import ComplianceDisclaimer from "@/components/common/ComplianceDisclaimer";

// Debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    React.useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function BlogPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Debounce search to avoid too many API calls
    const debouncedSearch = useDebounce(searchTerm, 300);

    // Server-side pagination query
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['blog-articles', currentPage, selectedCategory, debouncedSearch],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: itemsPerPage.toString(),
                ...(selectedCategory !== 'all' && { category: selectedCategory }),
                ...(debouncedSearch && { search: debouncedSearch })
            });
            const response = await fetch(`/api/articles/public?${params}`);
            if (!response.ok) {
                throw new Error('Failed to fetch articles');
            }
            return response.json();
        },
        staleTime: 60000, // Cache for 1 minute
        placeholderData: (previousData) => previousData, // Keep previous data while loading
    });

    const articles = data?.articles || [];
    const totalItems = data?.total || 0;
    const totalPages = data?.totalPages || 0;

    // Reset to page 1 when filters change
    const handleCategoryChange = useCallback((cat: string) => {
        setSelectedCategory(cat);
        setCurrentPage(1);
    }, []);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    }, []);

    const categories = [
        'all',
        'mutual-funds',
        'stocks',
        'credit-cards',
        'insurance',
        'tax-planning',
        'investing-basics'
    ];

    // Featured article only on first page with no search
    const featuredArticle = currentPage === 1 && !debouncedSearch ? articles[0] : null;
    const displayArticles = featuredArticle ? articles.slice(1) : articles;

    return (
        <PageErrorBoundary pageName="Blog Page">
            <div className="min-h-screen bg-slate-50">
                <SEOHead
                    title="Investment Blog - Tips, Guides & Market Updates | InvestingPro"
                    description="Stay updated with the latest investment tips, financial guides, and market analysis. Expert articles on mutual funds, stocks, insurance, and more."
                />
            
            
            {/* Hero */}
            <div className="bg-slate-900 border-b border-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-[128px]" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500 rounded-full blur-[128px]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                    <div className="max-w-3xl">
                        <Badge className="mb-4 bg-primary-500/10 text-primary-400 border-primary-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Knowledge Hub</Badge>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
                            Unlock Your <span className="text-primary-400">Financial Potential</span>
                        </h1>
                        <p className="text-xl text-slate-400 mb-10 leading-relaxed font-medium">
                            Deep dives, market analysis, and simplified financial guides to empower your investment journey.
                        </p>
                        <div className="relative group max-w-2xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-400 transition-colors" strokeWidth={2} />
                            <Input
                                placeholder="Search articles, guides, strategies..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="pl-12 h-16 bg-white/5 border-slate-700 text-white placeholder:text-slate-500 rounded-2xl focus:bg-white/10 transition-all outline-none text-lg"
                                aria-label="Search blog articles"
                            />
                            {debouncedSearch && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                    aria-label="Clear search"
                                >
                                    <X className="w-5 h-5" strokeWidth={2} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-12">
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "outline"}
                            onClick={() => handleCategoryChange(cat)}
                            className={`rounded-full px-6 transition-all ${selectedCategory === cat
                                ? "bg-primary-600 hover:bg-primary-700 border-0 shadow-lg shadow-primary-500/30"
                                : "bg-white hover:bg-slate-100 border-slate-200 text-slate-600"
                                }`}
                        >
                            {cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Button>
                    ))}
                </div>

                {/* Featured Article */}
                {featuredArticle && (
                    <div className="mb-16">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Latest Highlight</h2>
                        <Link href={`/article/${featuredArticle.slug}`}>
                            <Card className="overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border-slate-200 group">
                                <div className="grid md:grid-cols-2">
                                    <div className="h-64 md:h-auto overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-600 transition-transform duration-700 group-hover:scale-110" />
                                        {featuredArticle.featured_image && (
                                            <img
                                                src={featuredArticle.featured_image}
                                                alt={featuredArticle.title || 'Featured article image'}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-black/20" />
                                    </div>
                                    <CardContent className="p-8 md:p-6 md:p-8 flex flex-col justify-center bg-white">
                                        <Badge className="w-fit mb-4 bg-primary-100 text-primary-700 border-0 text-[10px] uppercase font-bold tracking-wider">{featuredArticle.category?.replace(/-/g, ' ')}</Badge>
                                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 group-hover:text-primary-600 transition-colors leading-tight">
                                            {featuredArticle.title}
                                        </h2>
                                        <p className="text-slate-500 text-lg mb-8 line-clamp-2 leading-relaxed font-medium">
                                            {featuredArticle.excerpt}
                                        </p>
                                        <div className="flex items-center gap-6 text-xs text-slate-400 font-bold uppercase tracking-tight mb-8">
                                            <span className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                                                {new Date(featuredArticle.published_date || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                                                {featuredArticle.read_time} min read
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Eye className="w-3.5 h-3.5 text-primary-500" strokeWidth={2} aria-hidden="true" />
                                                {featuredArticle.views || 0} views
                                            </span>
                                        </div>
                                        <div className="flex items-center text-primary-600 font-bold text-sm uppercase tracking-widest gap-2">
                                            Read Strategy <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        </Link>
                    </div>
                )}

                {/* Article Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        // Loading skeleton
                        Array.from({ length: 9 }).map((_, i) => (
                            <Card key={i} className="h-full animate-pulse">
                                <div className="h-56 bg-slate-200" />
                                <CardContent className="p-6">
                                    <div className="h-6 bg-slate-200 rounded mb-3" />
                                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        displayArticles.map((article: any) => (
                            <Link key={article.id} href={`/article/${article.slug}`}>
                                <Card className="h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200 group bg-white shadow-sm overflow-hidden">
                                    <div className="h-56 relative overflow-hidden bg-slate-100">
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-400 to-slate-600 opacity-20" />
                                        {article.featured_image && (
                                            <img
                                                src={article.featured_image}
                                                alt={article.title || 'Article featured image'}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border-0 text-[10px] font-bold shadow-sm">
                                                {article.category?.replace(/-/g, ' ')}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardContent className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                                            {article.excerpt}
                                        </p>
                                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <User className="w-3 h-3 text-slate-400" aria-hidden="true" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-900 uppercase tracking-tighter">
                                                    {article.author_name}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {article.read_time} MIN
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>

                {!isLoading && articles.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No articles found</h3>
                        <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-16 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => {
                                setCurrentPage(page);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            itemsPerPage={itemsPerPage}
                            totalItems={totalItems}
                        />
                    </div>
                )}

                {/* Compliance Disclaimer */}
                <div className="mt-16">
                    <ComplianceDisclaimer variant="compact" />
                </div>
            </div>
        </div>
        </PageErrorBoundary>
    );
}
