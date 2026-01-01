"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { articleService } from '@/lib/cms/article-service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import WordPressStyleCMS from '@/components/admin/WordPressStyleCMS';

export default function AdminArticlesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const queryClient = useQueryClient();
    const router = useRouter();
    
    // Fetch all articles using articleService (unified workflow)
    const { data: articles = [], isLoading, error: articlesError } = useQuery({
        queryKey: ['articles', 'admin'],
        queryFn: async () => {
            try {
                // Try articleService first
                const articles = await articleService.listArticles(500);
                return articles;
            } catch (error: any) {
                console.error('articleService failed, falling back to API:', error);
                // Fallback to API method
                try {
                    return await api.entities.Article.list('-created_date', 500);
                } catch (apiError: any) {
                    console.error('API method also failed:', apiError);
                    toast.error('Failed to load articles');
                    return [];
                }
            }
        },
        staleTime: 30_000,
        gcTime: 5 * 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        retry: 1,
    });

    // Show error if articles failed to load
    useEffect(() => {
        if (articlesError) {
            console.error('Articles query error:', articlesError);
            toast.error('Failed to load articles. Check console for details.');
        }
    }, [articlesError]);

    const handleNewArticle = () => {
        router.push('/admin/articles/new');
    };

    const handleEdit = (id: string) => {
        router.push(`/admin/articles/${id}/edit`);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article?')) {
            return;
        }
        try {
            // Use articleService to delete
            await articleService.deleteArticle(id);
            queryClient.invalidateQueries({ queryKey: ['articles', 'admin'] });
            toast.success('Article deleted successfully');
        } catch (error: any) {
            toast.error('Failed to delete article: ' + error.message);
        }
    };

    const handleView = (id: string) => {
        const article = articles.find(a => a.id === id);
        if (article) {
            if (article.status === 'published') {
                window.open(`/articles/${article.slug}`, '_blank');
            } else {
                window.open(`/articles/${article.slug}?preview=true`, '_blank');
            }
        }
    };

    const handlePublish = async (id: string) => {
        try {
            const article = articles.find(a => a.id === id);
            if (!article) {
                toast.error('Article not found');
                return;
            }

            // Use articleService to publish
            await articleService.publishArticle(
                id,
                {
                    body_markdown: article.body_markdown || '',
                    body_html: article.body_html || '',
                    content: article.content || article.body_markdown || '',
                },
                {
                    title: article.title,
                    slug: article.slug,
                    excerpt: article.excerpt || '',
                    category: article.category || 'investing-basics',
                }
            );

            queryClient.invalidateQueries({ queryKey: ['articles', 'admin'] });
            queryClient.invalidateQueries({ queryKey: ['articles', 'public'] });
            toast.success('Article published successfully!');
        } catch (error: any) {
            toast.error('Failed to publish article: ' + error.message);
        }
    };

    const handleGenerate = () => {
        router.push('/admin/generator');
    };

    return (
        <AdminLayout>
            <div className="p-8">
                <WordPressStyleCMS
                    articles={Array.isArray(articles) ? (articles as any[]) : []}
                    isLoading={isLoading}
                    onNewArticle={handleNewArticle}
                    onGenerate={handleGenerate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    onPublish={handlePublish}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterStatus={statusFilter}
                    onFilterChange={setStatusFilter}
                />
            </div>
        </AdminLayout>
    );
}
