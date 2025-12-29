"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ArticleInspector from '@/components/admin/ArticleInspector';
import TipTapEditorWithMedia from '@/components/admin/TipTapEditorWithMedia';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Loader2, FileText } from 'lucide-react';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

/**
 * Edit Article Page - Editor-first CMS experience
 * 
 * Layout:
 * - Full-height editor canvas
 * - Title input (separate from editor)
 * - TipTap rich text editor
 * - Inspector panel on the right
 */
export default function EditArticlePage() {
    const router = useRouter();
    const params = useParams();
    const queryClient = useQueryClient();
    const id = params?.id as string;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Fetch existing article
    const { data: article, isLoading } = useQuery({
        queryKey: ['article', id],
        queryFn: async () => {
            const articles = await api.entities.Article.filter({ id });
            if (articles.length === 0) {
                throw new Error('Article not found');
            }
            return articles[0];
        },
        enabled: !!id,
    });

    // Initialize form with fetched data
    useEffect(() => {
        if (article) {
            setTitle(article.title || '');
            setContent(article.content || '');
            setExcerpt(article.excerpt || '');
        }
    }, [article]);

    const updateMutation = useMutation({
        mutationFn: (data: any) => api.entities.Article.update(id, data),
        onSuccess: () => {
            setSaving(false);
            setLastSaved(new Date());
            queryClient.invalidateQueries({ queryKey: ['article', id] });
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            toast.success('Article saved successfully');
        },
        onError: (error: unknown) => {
            setSaving(false);
            const errorMessage = error instanceof Error ? error.message : 'Failed to update article';
            logger.error('Failed to update article', error instanceof Error ? error : new Error(String(error)));
            toast.error('Failed to save article. Please try again.');
        },
    });

    const handleSave = async (metadata: any) => {
        if (!title.trim()) {
            toast.error('Please enter a title');
            return;
        }

        setSaving(true);
        try {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');

            await updateMutation.mutateAsync({
                title,
                slug,
                content,
                excerpt,
                status: metadata.status || article?.status || 'draft',
                seo_title: metadata.seo_title || title,
                meta_description: metadata.meta_description || excerpt,
                keywords: metadata.keywords || article?.keywords || [],
                category: metadata.category || article?.category || 'investing-basics',
                tags: metadata.tags || article?.tags || [],
                featured_image: metadata.featured_image || article?.featured_image || null,
            });
        } catch (error) {
            // Error handling is done in mutation onError
        }
    };

    const handlePublish = async (metadata: any) => {
        await handleSave({ ...metadata, status: 'published' });
    };

    const handlePreview = () => {
        if (article?.slug) {
            window.open(`/articles/${article.slug}`, '_blank');
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="h-full flex items-center justify-center bg-slate-50">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400 mb-4" />
                        <p className="text-slate-600">Loading article...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!article) {
        return (
            <AdminLayout>
                <div className="h-full flex items-center justify-center bg-slate-50">
                    <div className="text-center">
                        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600">Article not found</p>
                        <button
                            onClick={() => router.push('/admin/articles')}
                            className="mt-4 text-blue-600 hover:underline"
                        >
                            Back to Articles
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="h-full flex flex-col bg-white">
                {/* Header */}
                <div className="border-b border-slate-200 px-6 py-4 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/admin/articles')}
                            className="text-slate-600 hover:text-slate-900"
                        >
                            ← Back
                        </button>
                        <div>
                            <h1 className="text-lg font-semibold text-slate-900">Edit Article</h1>
                            {lastSaved && (
                                <p className="text-xs text-slate-500">
                                    Saved {lastSaved.toLocaleTimeString()}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleSave({})}
                            disabled={saving}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 inline-block animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 inline-block mr-2" />
                                    Save
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Editor Canvas */}
                    <div className="flex-1 flex flex-col min-h-0 border-r border-slate-200">
                        {/* Title Input */}
                        <div className="border-b border-slate-200 p-6 bg-slate-50">
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Article Title"
                                className="text-2xl font-bold border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>

                        {/* Editor Canvas */}
                        <div className="flex-1 min-h-0 p-6 overflow-y-auto">
                            <TipTapEditorWithMedia
                                content={content}
                                onChange={setContent}
                                placeholder="Start writing your article..."
                                className="h-full"
                            />
                        </div>
                    </div>

                    {/* Inspector Panel */}
                    <div className="w-96 bg-white border-l border-slate-200 overflow-y-auto">
                        <ArticleInspector
                            article={article}
                            onSave={handleSave}
                            onPublish={handlePublish}
                            onPreview={handlePreview}
                            saving={saving}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
