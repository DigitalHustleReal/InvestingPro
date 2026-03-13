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

function AdminArticlesContent() {
    const searchParams = useSearchParams();
    const initialStatus = searchParams.get('status') || 'all';
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
    const queryClient = useQueryClient();
    const router = useRouter();
    
    // Fetch all articles (including drafts, reviews, trashed, etc.)
    const { data: articles = [], isLoading } = useQuery({
        queryKey: ['articles', 'admin'],
        queryFn: async () => {
            try {
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
    
    /**
     * handleDelete:
     * - permanent=false (default): soft-delete → Move to Trash
     * - permanent=true: hard-delete → Delete Forever
     * 
     * When called from Trash view ("Delete Permanently"), permanent=true is passed.
     * When called from normal view ("Trash"), it defaults to soft-delete.
     */
    const handleDelete = async (id: string, permanent = false) => {
        try {
            await api.entities.Article.delete(id, permanent);
            // Force immediate refetch so the UI reflects the deletion right away
            await queryClient.refetchQueries({ queryKey: ['articles', 'admin'] });
            toast.success(permanent ? 'Article permanently deleted' : 'Article moved to trash');
        } catch (error: any) {
            toast.error('Failed to delete: ' + error.message);
        }
    };

    /**
     * handlePublish: Routes through admin PATCH API which uses service-role
     * client to bypass the get_user_role() trigger.
     */
    const handlePublish = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/articles/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    metadata: {
                        status: 'published',
                        published_at: new Date().toISOString(),
                    }
                })
            });
            if (!response.ok) {
                const err = await response.json().catch(() => ({ message: 'Failed to publish' }));
                throw new Error(err.error?.message || err.message || 'Failed to publish');
            }
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
            await queryClient.refetchQueries({ queryKey: ['articles', 'admin'] });
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
                    onDelete={(id) => handleDelete(id, statusFilter === 'trash')}
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
