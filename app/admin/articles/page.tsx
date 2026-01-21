"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '@/lib/api-client'; // Use client-safe API instead of articleService
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import DarkThemeCMS from '@/components/admin/DarkThemeCMS';
import { createClient } from '@supabase/supabase-js';
import { ArticleListSkeleton } from '@/components/loading/ArticleCardSkeleton';

export default function AdminArticlesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const queryClient = useQueryClient();
    const router = useRouter();
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Fetch all articles (including drafts, reviews, etc.)
    const { data: articles = [], isLoading } = useQuery({
        queryKey: ['articles', 'admin'],
        queryFn: async () => {
            try {
                // Pass true to include all statuses (not just published)
                return await api.entities.Article.list(undefined, 500, true);
            } catch (error: any) {
                console.error('Failed to load articles:', error);
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
            const { error } = await supabase
                .from('articles')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            
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
                body_markdown: (article as any).body_markdown || '',
                body_html: (article as any).body_html || '',
                content: (article as any).content || '',
                title: article.title,
                slug: article.slug,
                excerpt: (article as any).excerpt || '',
                category: (article as any).category || 'investing-basics',
            });

            queryClient.invalidateQueries({ queryKey: ['articles'] });
            toast.success('Article published!');
        } catch (error: any) {
            toast.error('Failed to publish: ' + error.message);
        }
    };

    // Bulk Operations
    const handleBulkPublish = async (ids: string[]) => {
        const { error } = await supabase
            .from('articles')
            .update({ status: 'published', published_at: new Date().toISOString() })
            .in('id', ids);
        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ['articles'] });
    };

    const handleBulkArchive = async (ids: string[]) => {
        const { error } = await supabase
            .from('articles')
            .update({ status: 'archived' })
            .in('id', ids);
        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ['articles'] });
    };

    const handleBulkDelete = async (ids: string[]) => {
        const { error } = await supabase
            .from('articles')
            .delete()
            .in('id', ids);
        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ['articles'] });
    };

    return (
        <AdminLayout>
            <div className="p-8">
                <DarkThemeCMS
                    articles={Array.isArray(articles) ? (articles as any[]) : []}
                    isLoading={isLoading}
                    onNewArticle={handleNewArticle}
                    onGenerate={handleGenerate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPublish={handlePublish}
                    onBulkPublish={handleBulkPublish}
                    onBulkArchive={handleBulkArchive}
                    onBulkDelete={handleBulkDelete}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterStatus={statusFilter}
                    onFilterChange={setStatusFilter}
                />
            </div>
        </AdminLayout>
    );
}
