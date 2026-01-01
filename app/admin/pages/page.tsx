"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { articleService } from '@/lib/cms/article-service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import WordPressStylePages from '@/components/admin/WordPressStylePages';

export default function AdminPagesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const queryClient = useQueryClient();
    const router = useRouter();
    
    // Fetch all pages (pages are items with content_type = 'pillar' or 'category-page')
    // EXCLUDE articles (content_type = 'article' or null/undefined)
    const { data: pages = [], isLoading, error: pagesError } = useQuery({
        queryKey: ['pages', 'admin'],
        queryFn: async () => {
            try {
                // Get all articles and filter for pages ONLY
                const allArticles = await articleService.listArticles(500);
                
                // Filter for pages ONLY (content_type is 'pillar' or 'category-page')
                // EXCLUDE articles (content_type = 'article' or null/undefined defaults to 'article')
                const pagesList = allArticles.filter((article: any) => {
                    const contentType = article.content_type || article.contentType || 'article';
                    // Only include pillar pages and category pages
                    // EXCLUDE articles
                    return contentType === 'pillar' || contentType === 'category-page';
                });
                
                return pagesList;
            } catch (error: any) {
                console.error('Failed to load pages:', error);
                // Fallback to API method
                try {
                    const allArticles = await api.entities.Article.list('-created_date', 500);
                    return allArticles.filter((article: any) => {
                        const contentType = article.content_type || article.contentType || 'article';
                        // Only include pillar pages and category pages
                        // EXCLUDE articles
                        return contentType === 'pillar' || contentType === 'category-page';
                    });
                } catch (apiError: any) {
                    console.error('API method also failed:', apiError);
                    toast.error('Failed to load pages');
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

    // Show error if pages failed to load
    useEffect(() => {
        if (pagesError) {
            console.error('Pages query error:', pagesError);
            toast.error('Failed to load pages. Check console for details.');
        }
    }, [pagesError]);

    const handleNewPage = () => {
        // Redirect to pillar-pages/new for now (can create separate page creation later)
        router.push('/admin/pillar-pages/new');
    };

    const handleEdit = (id: string) => {
        // Use pillar-pages edit route (since pages are stored as pillar/category-page content types)
        router.push(`/admin/pillar-pages/${id}/edit`);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this page?')) {
            return;
        }
        try {
            // Use articleService or API to delete
            await api.entities.Article.delete(id);
            queryClient.invalidateQueries({ queryKey: ['pages', 'admin'] });
            queryClient.invalidateQueries({ queryKey: ['articles', 'admin'] });
            toast.success('Page deleted successfully');
        } catch (error: any) {
            toast.error('Failed to delete page: ' + error.message);
        }
    };

    const handleView = (id: string) => {
        const page = pages.find((p: any) => p.id === id);
        if (page) {
            if (page.status === 'published') {
                window.open(`/${page.slug}`, '_blank');
            } else {
                window.open(`/${page.slug}?preview=true`, '_blank');
            }
        }
    };

    const handlePublish = async (id: string) => {
        try {
            const page = pages.find((p: any) => p.id === id);
            if (!page) {
                toast.error('Page not found');
                return;
            }

            // Use articleService to publish
            await articleService.publishArticle(
                id,
                {
                    body_markdown: page.body_markdown || '',
                    body_html: page.body_html || '',
                    content: page.content || page.body_markdown || '',
                },
                {
                    title: page.title,
                    slug: page.slug,
                    excerpt: page.excerpt || '',
                    category: page.category || 'investing-basics',
                }
            );

            queryClient.invalidateQueries({ queryKey: ['pages', 'admin'] });
            queryClient.invalidateQueries({ queryKey: ['articles', 'admin'] });
            queryClient.invalidateQueries({ queryKey: ['articles', 'public'] });
            toast.success('Page published successfully!');
        } catch (error: any) {
            toast.error('Failed to publish page: ' + error.message);
        }
    };

    return (
        <AdminLayout>
            <div className="p-8">
                <WordPressStylePages
                    pages={Array.isArray(pages) ? pages : []}
                    isLoading={isLoading}
                    onNewPage={handleNewPage}
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

