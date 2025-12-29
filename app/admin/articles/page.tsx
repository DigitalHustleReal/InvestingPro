"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { FileText, Plus, Calendar, Eye } from 'lucide-react';

/**
 * Articles List Page
 * 
 * Overview of all articles with quick actions
 */
export default function ArticlesPage() {
    const [selectedStatus, setSelectedStatus] = useState<'all' | 'draft' | 'review' | 'published'>('all');

    const { data: articles = [], isLoading, error } = useQuery({
        queryKey: ['admin-articles'],
        queryFn: async () => {
            try {
                // Fetch from server-side API route (uses service_role, bypasses RLS)
                const response = await fetch('/api/admin/articles');
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('Admin articles API error:', {
                        status: response.status,
                        statusText: response.statusText,
                        error: errorData
                    });
                    throw new Error(`Failed to fetch articles: ${response.status} ${response.statusText}`);
                }
                
                const data = await response.json();
                console.log('Admin articles fetched:', data.articles?.length || 0);
                return data.articles || [];
            } catch (err) {
                console.error('Error fetching admin articles:', err);
                throw err;
            }
        },
        initialData: []
    });

    // Client-side filtering by status
    const filteredArticles = selectedStatus === 'all' 
        ? articles 
        : articles.filter((article: any) => (article.status || 'draft') === selectedStatus);

    const getStatusBadge = (status: string) => {
        const variants: Record<string, string> = {
            published: 'bg-green-100 text-green-700',
            draft: 'bg-slate-100 text-slate-700',
            review: 'bg-amber-100 text-amber-700',
        };
        return variants[status] || 'bg-slate-100 text-slate-700';
    };

    return (
        <AdminLayout>
            <div className="h-full flex flex-col bg-slate-50">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Articles</h1>
                            <p className="text-sm text-slate-600 mt-1">Manage your editorial content</p>
                        </div>
                        <Link href="/admin/articles/new">
                            <Button className="bg-teal-600 hover:bg-teal-700">
                                <Plus className="w-4 h-4 mr-2" />
                                New Article
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="bg-white border-b border-slate-200 px-8 py-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedStatus('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedStatus === 'all'
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            All
                            <span className="ml-2 text-xs opacity-75">
                                ({articles.length})
                            </span>
                        </button>
                        <button
                            onClick={() => setSelectedStatus('draft')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedStatus === 'draft'
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            Draft
                            <span className="ml-2 text-xs opacity-75">
                                ({articles.filter((a: any) => (a.status || 'draft') === 'draft').length})
                            </span>
                        </button>
                        <button
                            onClick={() => setSelectedStatus('review')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedStatus === 'review'
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            Review
                            <span className="ml-2 text-xs opacity-75">
                                ({articles.filter((a: any) => (a.status || 'draft') === 'review').length})
                            </span>
                        </button>
                        <button
                            onClick={() => setSelectedStatus('published')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedStatus === 'published'
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            Published
                            <span className="ml-2 text-xs opacity-75">
                                ({articles.filter((a: any) => (a.status || 'draft') === 'published').length})
                            </span>
                        </button>
                    </div>
                </div>

                {/* Articles List */}
                <div className="flex-1 overflow-y-auto p-8">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">
                                Error loading articles: {error instanceof Error ? error.message : 'Unknown error'}
                            </p>
                            <p className="text-xs text-red-600 mt-1">
                                Check browser console for details. Make sure RLS policies are configured correctly.
                            </p>
                        </div>
                    )}
                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-slate-600">Loading articles...</p>
                        </div>
                    ) : filteredArticles.length === 0 ? (
                        <Card className="p-12 text-center max-w-md mx-auto">
                            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No articles yet</h3>
                            <p className="text-sm text-slate-600 mb-6">
                                {selectedStatus === 'all' 
                                    ? 'Get started by creating your first article.'
                                    : `No ${selectedStatus} articles found.`
                                }
                            </p>
                            {selectedStatus === 'all' && (
                                <Link href="/admin/articles/new">
                                    <Button className="bg-teal-600 hover:bg-teal-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Article
                                    </Button>
                                </Link>
                            )}
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {filteredArticles.map((article: any) => (
                                <Link key={article.id} href={`/admin/articles/${article.id}/edit`}>
                                    <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-slate-900">
                                                        {article.title || 'Untitled'}
                                                    </h3>
                                                    <Badge className={getStatusBadge(article.status || 'draft')}>
                                                        {article.status || 'draft'}
                                                    </Badge>
                                                </div>
                                                {article.excerpt && (
                                                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                                                        {article.excerpt}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                                    {article.category && (
                                                        <span className="font-medium text-slate-700">
                                                            {article.category}
                                                        </span>
                                                    )}
                                                    {(article.updated_at || article.created_at) && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            <span>
                                                                Updated {new Date(article.updated_at || article.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {article.views !== undefined && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Eye className="w-3.5 h-3.5" />
                                                            <span>{article.views || 0} views</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
















