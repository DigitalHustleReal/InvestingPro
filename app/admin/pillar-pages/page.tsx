"use client";

import React from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Target, Plus, Calendar, Eye } from 'lucide-react';

/**
 * Pillar Pages List Page
 * 
 * Overview of all pillar pages with quick actions
 */
export default function PillarPagesPage() {
    const { data: articles = [], isLoading } = useQuery({
        queryKey: ['pillar-pages'],
        queryFn: async () => {
            // Filter articles to only show pillar pages
            const allArticles = await api.entities.Article.list('-created_date', 100);
            return allArticles.filter((article: any) => article.content_type === 'pillar');
        },
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
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Target className="w-6 h-6 text-teal-600" />
                                Pillar Pages
                            </h1>
                            <p className="text-sm text-slate-600 mt-1">
                                Comprehensive hub pages that serve as the foundation for content clusters
                            </p>
                        </div>
                        <Link href="/admin/pillar-pages/new">
                            <Button className="bg-teal-600 hover:bg-teal-700">
                                <Plus className="w-4 h-4 mr-2" />
                                New Pillar Page
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Pillar Pages List */}
                <div className="flex-1 overflow-y-auto p-8">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-slate-600">Loading pillar pages...</p>
                        </div>
                    ) : articles.length === 0 ? (
                        <Card className="p-6 md:p-8 text-center max-w-md mx-auto">
                            <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No pillar pages yet</h3>
                            <p className="text-sm text-slate-600 mb-6">
                                Pillar pages are comprehensive hub pages that serve as the foundation for content clusters.
                                Create your first pillar page to get started.
                            </p>
                            <Link href="/admin/pillar-pages/new">
                                <Button className="bg-teal-600 hover:bg-teal-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Pillar Page
                                </Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {articles.map((article: any) => (
                                <Link key={article.id} href={`/admin/pillar-pages/${article.id}/edit`}>
                                    <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Target className="w-4 h-4 text-teal-600" />
                                                    <h3 className="text-lg font-semibold text-slate-900">
                                                        {article.title || 'Untitled'}
                                                    </h3>
                                                    <Badge className={getStatusBadge(article.status || 'draft')}>
                                                        {article.status || 'draft'}
                                                    </Badge>
                                                    <Badge className="bg-teal-100 text-teal-700">
                                                        Pillar
                                                    </Badge>
                                                </div>
                                                {article.excerpt && (
                                                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                                                        {article.excerpt}
                                                    </p>
                                                )}
                                                {article.pillar_primary_topic && (
                                                    <div className="mb-2">
                                                        <span className="text-xs text-slate-500">Primary Topic: </span>
                                                        <span className="text-xs font-medium text-slate-700">
                                                            {article.pillar_primary_topic}
                                                        </span>
                                                    </div>
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
                                                    {article.pillar_related_articles && article.pillar_related_articles.length > 0 && (
                                                        <div className="text-teal-600">
                                                            {article.pillar_related_articles.length} related articles
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

