"use client";

import React from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { apiClient as api } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';
import { Target, Plus, Calendar, Eye, FileText, Layers } from 'lucide-react';
import { AdminPageHeader, ContentSection, StatCard, StatusBadge, ActionButton, EmptyState } from '@/components/admin/AdminUIKit';

export default function PillarPagesPage() {
    const { data: articles = [], isLoading } = useQuery({
        queryKey: ['pillar-pages'],
        queryFn: async () => {
            const allArticles = await api.entities.Article.list('-created_date', 100);
            return allArticles.filter((article: any) => article.content_type === 'pillar' || article.content_type === 'category-page');
        },
        initialData: []
    });

    const pillarPages = articles.filter((a: any) => a.content_type === 'pillar');
    const categoryPages = articles.filter((a: any) => a.content_type === 'category-page');

    const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'danger' => {
        switch (status) {
            case 'published': return 'success';
            case 'review': return 'warning';
            default: return 'default';
        }
    };

    return (
        <AdminLayout>
            <div className="p-8 space-y-8">
                <AdminPageHeader
                    title="Pillar Pages"
                    subtitle="Comprehensive hub pages that serve as the foundation for content clusters"
                    icon={Target}
                    iconColor="teal"
                    actions={
                        <Link href="/admin/pillar-pages/new">
                            <ActionButton icon={Plus}>New Pillar Page</ActionButton>
                        </Link>
                    }
                />

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total Pages" value={articles.length} icon={Layers} color="teal" />
                    <StatCard label="Pillar Pages" value={pillarPages.length} icon={Target} color="purple" />
                    <StatCard label="Category Pages" value={categoryPages.length} icon={FileText} color="blue" />
                    <StatCard label="Published" value={articles.filter((a: any) => a.status === 'published').length} icon={Eye} color="teal" />
                </div>

                {/* Pages List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                    </div>
                ) : articles.length === 0 ? (
                    <ContentSection>
                        <EmptyState
                            icon={Target}
                            title="No pillar pages yet"
                            description="Create comprehensive hub pages that serve as the foundation for content clusters"
                            action={
                                <Link href="/admin/pillar-pages/new">
                                    <ActionButton icon={Plus}>Create Pillar Page</ActionButton>
                                </Link>
                            }
                        />
                    </ContentSection>
                ) : (
                    <div className="space-y-4">
                        {articles.map((article: any) => (
                            <Link key={article.id} href={`/admin/pillar-pages/${article.id}/edit`}>
                                <ContentSection>
                                    <div className="flex flex-col md:flex-row items-start gap-4 hover:opacity-90 transition-opacity cursor-pointer -m-6 p-6">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                                            article.content_type === 'pillar' 
                                                ? 'bg-gradient-to-br from-primary-500/20 to-success-500/20 border border-primary-500/30'
                                                : 'bg-gradient-to-br from-secondary-500/20 to-cyan-500/20 border border-secondary-500/30'
                                        }`}>
                                            {article.content_type === 'pillar' 
                                                ? <Target className="w-6 h-6 text-primary-400" />
                                                : <FileText className="w-6 h-6 text-secondary-400" />
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <h3 className="text-lg font-semibold text-white">
                                                    {article.title || 'Untitled'}
                                                </h3>
                                                <StatusBadge variant={getStatusVariant(article.status || 'draft')}>
                                                    {article.status || 'draft'}
                                                </StatusBadge>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    article.content_type === 'pillar'
                                                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                                        : 'bg-secondary-500/20 text-secondary-400 border border-secondary-500/30'
                                                }`}>
                                                    {article.content_type === 'pillar' ? 'Pillar' : 'Category'}
                                                </span>
                                            </div>
                                            {article.excerpt && (
                                                <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                                                    {article.excerpt}
                                                </p>
                                            )}
                                            {article.pillar_primary_topic && (
                                                <div className="mb-2">
                                                    <span className="text-xs text-slate-500">Primary Topic: </span>
                                                    <span className="text-xs font-medium text-slate-300">
                                                        {article.pillar_primary_topic}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                {article.created_at && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                                {article.views !== undefined && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Eye className="w-3.5 h-3.5" />
                                                        <span>{article.views || 0} views</span>
                                                    </div>
                                                )}
                                                {article.pillar_related_articles && article.pillar_related_articles.length > 0 && (
                                                    <div className="text-primary-400">
                                                        {article.pillar_related_articles.length} related articles
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </ContentSection>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
