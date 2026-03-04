"use client";

import React, { useState, Suspense } from 'react';
import { logger } from '@/lib/logger';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageContainer from '@/components/admin/AdminPageContainer';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '@/lib/api-client';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import ArticlesTable from '@/components/admin/ArticlesTable';
import { createClient } from '@/lib/supabase/client';

function AdminArticlesContent() {
    const searchParams = useSearchParams();
    const initialStatus = searchParams.get('status') || 'all';
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
    const queryClient = useQueryClient();
    const router = useRouter();
    const supabase = createClient();
    
    // Fetch all articles (including drafts, reviews, etc.)
    const { data: articles = [], isLoading } = useQuery({
        queryKey: ['articles', 'admin'],
        queryFn: async () => {
            try {
                // Pass true to include all statuses AND includeDeleted=true to see trashed articles
                return await api.entities.Article.list(undefined, 500, true);
            } catch (error: any) {
                logger.error('Failed to load articles:', error);
                toast.error('Failed to load articles');
                return [];
            }
        },
        staleTime: 30_000,
        refetchOnMount: true,
    });

    const handleNewArticle = () => router.push('/admin/articles/new');
    const handleGenerate = () => router.push('/admin/content-factory');
    const handleEdit = (id: string) => router.push(`/admin/articles/${id}/edit`);
    
    const handleDelete = async (id: string) => {
        try {
            await api.entities.Article.delete(id);
            queryClient.invalidateQueries({ queryKey: ['articles', 'admin'] });
            toast.success('Article deleted');
        } catch (error: any) {
            toast.error('Failed to delete: ' + error.message);
        }
    };

    const handlePublish = async (id: string) => {
        try {
            const article = articles.find((a: any) => a.id === id);
            if (!article) return;

            // Use API route for publish operation
            await api.entities.Article.update(id, {
                status: 'published',
                published_at: new Date().toISOString(),
                // Keep other fields
                title: article.title,
                slug: article.slug,
            });

            queryClient.invalidateQueries({ queryKey: ['articles'] });
            toast.success('Article published!');
        } catch (error: any) {
            toast.error('Failed to publish: ' + error.message);
        }
    };

    // Bulk Operations
    const handleBulkPublish = async (ids: string[]) => {
        try {
            await api.entities.Article.bulkAction('publish', ids);
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            toast.success(`Published ${ids.length} articles`);
        } catch (error: any) {
            toast.error('Failed to bulk publish: ' + error.message);
        }
    };

    const handleBulkArchive = async (ids: string[]) => {
        try {
            await api.entities.Article.bulkAction('archive', ids);
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            toast.success(`Archived ${ids.length} articles`);
        } catch (error: any) {
            toast.error('Failed to bulk archive: ' + error.message);
        }
    };

    const handleBulkDelete = async (ids: string[]) => {
        try {
            await api.entities.Article.bulkAction('delete', ids);
            queryClient.invalidateQueries({ queryKey: ['articles', 'admin'] });
            toast.success(`Deleted ${ids.length} articles`);
        } catch (error: any) {
            toast.error('Failed to bulk delete: ' + error.message);
        }
    };

    const handleRestore = async (id: string) => {
        try {
            await api.entities.Article.bulkAction('restore', [id]);
            queryClient.invalidateQueries({ queryKey: ['articles', 'admin'] });
            toast.success('Article restored');
        } catch (error: any) {
            toast.error('Failed to restore article: ' + error.message);
        }
    };

    const handleBulkRestore = async (ids: string[]) => {
        try {
            await api.entities.Article.bulkAction('restore', ids);
            queryClient.invalidateQueries({ queryKey: ['articles', 'admin'] });
            toast.success(`Restored ${ids.length} articles`);
        } catch (error: any) {
            toast.error('Failed to bulk restore: ' + error.message);
        }
    };

    return (
        <AdminLayout>
            <AdminPageContainer>
                <ArticlesTable
                    articles={Array.isArray(articles) ? (articles as any[]) : []}
                    isLoading={isLoading}
                    onNewArticle={handleNewArticle}
                    onGenerate={handleGenerate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onBulkDelete={handleBulkDelete}
                    onRestore={handleRestore}
                    onBulkRestore={handleBulkRestore}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterStatus={statusFilter}
                    onFilterChange={setStatusFilter}
                />
            </AdminPageContainer>
        </AdminLayout>
    );
}

export default function AdminArticlesPage() {
    return (
        <Suspense fallback={null}>
            <AdminArticlesContent />
        </Suspense>
    );
}
