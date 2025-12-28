"use client";

import React from 'react';
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
    const { data: articles = [], isLoading } = useQuery({
        queryKey: ['articles'],
        queryFn: () => api.entities.Article.list('-created_date', 100),
        initialData: []
    });

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

                {/* Articles List */}
                <div className="flex-1 overflow-y-auto p-8">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-slate-600">Loading articles...</p>
                        </div>
                    ) : articles.length === 0 ? (
                        <Card className="p-12 text-center max-w-md mx-auto">
                            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No articles yet</h3>
                            <p className="text-sm text-slate-600 mb-6">
                                Get started by creating your first article.
                            </p>
                            <Link href="/admin/articles/new">
                                <Button className="bg-teal-600 hover:bg-teal-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Article
                                </Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {articles.map((article: any) => (
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
                                                    {article.created_at && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            <span>
                                                                {new Date(article.created_at).toLocaleDateString()}
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











