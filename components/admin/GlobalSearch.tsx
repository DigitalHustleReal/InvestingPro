"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, X, FileText, Tag, Folder, Clock, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchResult {
    id: string;
    type: 'article' | 'category' | 'tag';
    title: string;
    description?: string;
    url: string;
    metadata?: {
        status?: string;
        category?: string;
        updated_at?: string;
    };
}

/**
 * Global Search Component for CMS
 * 
 * Features:
 * - Search articles, categories, tags
 * - Real-time search results
 * - Keyboard shortcuts (Cmd/Ctrl+K)
 * - Quick navigation
 */
export default function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Search articles
    const { data: articlesData } = useQuery({
        queryKey: ['search-articles', query],
        queryFn: async () => {
            if (!query.trim()) return [];
            try {
                const allArticles = await api.entities.Article.list();
                if (!Array.isArray(allArticles)) return [];
                const searchTerm = query.toLowerCase();
                return allArticles.filter((article: any) => 
                    article?.title?.toLowerCase().includes(searchTerm) ||
                    article?.content?.toLowerCase().includes(searchTerm) ||
                    article?.excerpt?.toLowerCase().includes(searchTerm)
                ).slice(0, 5);
            } catch (error) {
                console.error('Search articles error:', error);
                return [];
            }
        },
        enabled: query.length > 0,
    });
    const articles = Array.isArray(articlesData) ? articlesData : [];

    // Search categories
    const { data: categoriesData } = useQuery({
        queryKey: ['search-categories', query],
        queryFn: async () => {
            if (!query.trim()) return [];
            try {
                const supabase = await import('@/lib/supabase/client').then(m => m.createClient());
                const { data } = await supabase
                    .from('categories')
                    .select('*')
                    .ilike('name', `%${query}%`)
                    .limit(5)
                    .catch(() => ({ data: [] }));
                return Array.isArray(data) ? data : [];
            } catch (error) {
                console.error('Search categories error:', error);
                return [];
            }
        },
        enabled: query.length > 0,
    });
    const categories = Array.isArray(categoriesData) ? categoriesData : [];

    // Combine results - ensure arrays before mapping
    const safeArticles = Array.isArray(articles) ? articles : [];
    const safeCategories = Array.isArray(categories) ? categories : [];
    
    const results: SearchResult[] = [
        ...safeArticles.map((article: any) => ({
            id: article.id,
            type: 'article' as const,
            title: article.title,
            description: article.excerpt,
            url: `/admin/articles/${article.id}/edit`,
            metadata: {
                status: article.status,
                category: article.category,
                updated_at: article.updated_at,
            }
        })),
        ...safeCategories.map((cat: any) => ({
            id: cat.id || cat.slug,
            type: 'category' as const,
            title: cat.name,
            description: cat.description,
            url: `/admin/categories`,
            metadata: {}
        }))
    ];

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd/Ctrl+K to open search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
                setTimeout(() => inputRef.current?.focus(), 100);
            }

            // Escape to close
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
                setQuery('');
            }

            // Arrow keys to navigate
            if (isOpen && results.length > 0) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedIndex(prev => Math.max(prev - 1, 0));
                } else if (e.key === 'Enter' && results[selectedIndex]) {
                    e.preventDefault();
                    handleSelectResult(results[selectedIndex]);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex]);

    // Reset selected index when query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    const handleSelectResult = (result: SearchResult) => {
        router.push(result.url);
        setIsOpen(false);
        setQuery('');
    };

    const getResultIcon = (type: string) => {
        switch (type) {
            case 'article':
                return <FileText className="w-4 h-4" />;
            case 'category':
                return <Folder className="w-4 h-4" />;
            case 'tag':
                return <Tag className="w-4 h-4" />;
            default:
                return <FileText className="w-4 h-4" />;
        }
    };

    const getStatusBadge = (status?: string) => {
        if (!status) return null;
        const colors: Record<string, string> = {
            published: 'bg-emerald-100 text-emerald-800',
            draft: 'bg-slate-100 text-slate-800',
            review: 'bg-amber-100 text-amber-800',
        };
        return (
            <Badge className={`text-xs ${colors[status] || 'bg-slate-100 text-slate-800'}`}>
                {status}
            </Badge>
        );
    };

    if (!isOpen) {
        return (
            <Button
                variant="outline"
                className="relative w-full sm:w-64 justify-start text-slate-500"
                onClick={() => setIsOpen(true)}
            >
                <Search className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Search...</span>
                <span className="hidden sm:inline ml-auto text-xs text-slate-400">
                    ⌘K
                </span>
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50"
                onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                }}
            />

            {/* Search Modal */}
            <Card className="relative w-full max-w-2xl shadow-2xl">
                <CardContent className="p-0">
                    {/* Search Input */}
                    <div className="flex items-center gap-2 p-4 border-b">
                        <Search className="w-5 h-5 text-slate-400" />
                        <Input
                            ref={inputRef}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search articles, categories, tags..."
                            className="border-0 focus-visible:ring-0 text-base"
                            autoFocus
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setIsOpen(false);
                                setQuery('');
                            }}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Results */}
                    <div className="max-h-96 overflow-y-auto">
                        {query.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <Search className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                <p className="text-sm">Start typing to search...</p>
                                <p className="text-xs mt-2 text-slate-400">
                                    Press <kbd className="px-2 py-1 bg-slate-100 rounded">Esc</kbd> to close
                                </p>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                <p className="text-sm">No results found</p>
                                <p className="text-xs mt-2 text-slate-400">
                                    Try a different search term
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {results.map((result, idx) => (
                                    <button
                                        key={result.id}
                                        onClick={() => handleSelectResult(result)}
                                        className={`
                                            w-full p-4 text-left hover:bg-slate-50 transition-colors
                                            ${idx === selectedIndex ? 'bg-slate-50' : ''}
                                        `}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 text-slate-400">
                                                {getResultIcon(result.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-medium text-slate-900 truncate">
                                                        {result.title}
                                                    </h4>
                                                    {result.metadata?.status && getStatusBadge(result.metadata.status)}
                                                </div>
                                                {result.description && (
                                                    <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                                                        {result.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                                    {result.metadata?.category && (
                                                        <span className="flex items-center gap-1">
                                                            <Folder className="w-3 h-3" />
                                                            {result.metadata.category}
                                                        </span>
                                                    )}
                                                    {result.metadata?.updated_at && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(result.metadata.updated_at).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {results.length > 0 && (
                        <div className="p-3 border-t bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center gap-4">
                                <span>
                                    <kbd className="px-1.5 py-0.5 bg-white border rounded">↑↓</kbd> Navigate
                                </span>
                                <span>
                                    <kbd className="px-1.5 py-0.5 bg-white border rounded">Enter</kbd> Select
                                </span>
                                <span>
                                    <kbd className="px-1.5 py-0.5 bg-white border rounded">Esc</kbd> Close
                                </span>
                            </div>
                            <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

