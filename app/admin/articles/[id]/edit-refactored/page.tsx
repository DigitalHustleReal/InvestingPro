/**
 * WordPress-style Article Edit Page
 * 
 * GUARANTEES:
 * - Editor loads ONLY after content is fetched
 * - Save does NOT change status
 * - Publish is atomic operation
 * - UI updates optimistically
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ArticleInspector from '@/components/admin/ArticleInspector';
import ArticleEditor from '@/components/admin/ArticleEditor';
import { Input } from '@/components/ui/input';
import { articleService, type ArticleData } from '@/lib/cms/article-service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EditArticlePage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const id = params?.id as string;

    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [editorContent, setEditorContent] = useState<{ markdown: string; html: string } | null>(null);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // CRITICAL: Fetch article BEFORE editor mounts
    const { data: article, isLoading, error } = useQuery({
        queryKey: ['article', id],
        queryFn: async () => {
            const articleData = await articleService.getById(id);
            if (!articleData) {
                throw new Error('Article not found');
            }
            return articleData;
        },
        enabled: !!id,
        retry: 1,
    });

    // Initialize form when article loads
    useEffect(() => {
        if (article) {
            setTitle(article.title || '');
            setExcerpt(article.excerpt || '');
            // Editor will load content via initialContent prop
        }
    }, [article]);

    // Save mutation (does NOT change status)
    const saveMutation = useMutation({
        mutationFn: async (metadata: Partial<ArticleData>) => {
            if (!editorContent) {
                throw new Error('No content to save');
            }
            
            return await articleService.saveArticle(
                id,
                {
                    body_markdown: editorContent.markdown,
                    body_html: editorContent.html,
                    content: editorContent.markdown, // Legacy
                },
                {
                    title,
                    slug: article?.slug || '',
                    excerpt,
                    ...metadata,
                }
            );
        },
        onMutate: async () => {
            // Optimistic update
            await queryClient.cancelQueries({ queryKey: ['article', id] });
            await queryClient.cancelQueries({ queryKey: ['articles', 'admin'] });
            
            const previousArticle = queryClient.getQueryData(['article', id]);
            const previousArticles = queryClient.getQueryData(['articles', 'admin']);
            
            return { previousArticle, previousArticles };
        },
        onSuccess: async (result) => {
            setSaving(false);
            setLastSaved(new Date());
            
            // Invalidate and refetch
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['article', id] }),
                queryClient.invalidateQueries({ queryKey: ['articles', 'admin'] }),
            ]);
            
            router.refresh();
            toast.success('Article saved successfully');
        },
        onError: (error, variables, context) => {
            // Rollback
            if (context?.previousArticle) {
                queryClient.setQueryData(['article', id], context.previousArticle);
            }
            if (context?.previousArticles) {
                queryClient.setQueryData(['articles', 'admin'], context.previousArticles);
            }
            
            setSaving(false);
            toast.error(error instanceof Error ? error.message : 'Failed to save article');
        },
    });

    // Publish mutation (atomic operation)
    const publishMutation = useMutation({
        mutationFn: async (metadata: Partial<ArticleData>) => {
            if (!editorContent) {
                throw new Error('No content to publish');
            }
            
            return await articleService.publishArticle(
                id,
                {
                    body_markdown: editorContent.markdown,
                    body_html: editorContent.html,
                    content: editorContent.markdown,
                },
                {
                    title,
                    slug: article?.slug || '',
                    excerpt,
                    ...metadata,
                }
            );
        },
        onMutate: async () => {
            // Optimistic update
            await queryClient.cancelQueries({ queryKey: ['article', id] });
            await queryClient.cancelQueries({ queryKey: ['articles', 'admin'] });
            await queryClient.cancelQueries({ queryKey: ['articles', 'public'] });
            
            const previousArticle = queryClient.getQueryData(['article', id]);
            const previousArticles = queryClient.getQueryData(['articles', 'admin']);
            
            // Optimistically update to published
            if (previousArticle) {
                queryClient.setQueryData(['article', id], {
                    ...previousArticle,
                    status: 'published',
                    published_at: new Date().toISOString(),
                });
            }
            
            return { previousArticle, previousArticles };
        },
        onSuccess: async (result) => {
            setSaving(false);
            setLastSaved(new Date());
            
            // CRITICAL: Revalidate public routes
            try {
                await fetch('/api/revalidate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        paths: [
                            `/articles/${result.slug}`,
                            `/article/${result.slug}`,
                            `/category/${article?.category || 'investing-basics'}`,
                            `/articles`,
                            `/`,
                        ],
                        tags: [
                            `article-${result.id}`,
                            `article-${result.slug}`,
                            `blog-articles`,
                            `homepage-content`,
                        ],
                    }),
                });
            } catch (revalidateError) {
                console.error('Revalidation failed:', revalidateError);
            }
            
            // Invalidate all queries
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['article', id] }),
                queryClient.invalidateQueries({ queryKey: ['articles', 'admin'] }),
                queryClient.invalidateQueries({ queryKey: ['articles', 'public'] }),
                queryClient.invalidateQueries({ queryKey: ['articles', 'category'] }),
            ]);
            
            router.refresh();
            toast.success(`Article published! Available at /articles/${result.slug}`);
        },
        onError: (error, variables, context) => {
            // Rollback
            if (context?.previousArticle) {
                queryClient.setQueryData(['article', id], context.previousArticle);
            }
            if (context?.previousArticles) {
                queryClient.setQueryData(['articles', 'admin'], context.previousArticles);
            }
            
            setSaving(false);
            toast.error(error instanceof Error ? error.message : 'Failed to publish article');
        },
    });

    const handleSave = async (metadata: any) => {
        if (!title.trim()) {
            toast.error('Please enter a title');
            return;
        }

        if (!editorContent) {
            toast.error('No content to save');
            return;
        }

        setSaving(true);
        await saveMutation.mutateAsync(metadata);
    };

    const handlePublish = async (metadata: any) => {
        if (!title.trim()) {
            toast.error('Please enter a title');
            return;
        }

        if (!editorContent) {
            toast.error('No content to publish');
            return;
        }

        setSaving(true);
        await publishMutation.mutateAsync(metadata);
    };

    const handlePreview = () => {
        if (!article?.slug) {
            toast.error('Please save the article first to generate a slug');
            return;
        }
        // Preview uses same route with preview token
        window.open(`/articles/${article.slug}?preview=true`, '_blank');
    };

    // CRITICAL: Don't render editor until article is loaded
    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
            </AdminLayout>
        );
    }

    if (error || !article) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Article Not Found</h1>
                    <p className="text-slate-600 mb-6">The article you're looking for doesn't exist.</p>
                    <button
                        onClick={() => router.push('/admin/articles')}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                        Back to Articles
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout
            showInspector={true}
            inspectorContent={
                <ArticleInspector
                    article={{
                        ...article,
                        title,
                        excerpt,
                        body_markdown: editorContent?.markdown || article.body_markdown,
                        body_html: editorContent?.html || article.body_html,
                        content: editorContent?.markdown || article.content,
                    }}
                    onSave={handleSave}
                    onPublish={handlePublish}
                    onPreview={handlePreview}
                    saving={saving}
                />
            }
        >
            <div className="flex flex-col h-screen">
                {/* Header */}
                <div className="border-b border-slate-200 p-6 bg-slate-50">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Article Title"
                                className="text-2xl font-bold border-0 bg-transparent px-0 focus-visible:ring-0"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            {lastSaved && (
                                <span className="text-sm text-slate-500">
                                    Saved {lastSaved.toLocaleTimeString()}
                                </span>
                            )}
                            {saving && (
                                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Editor - CRITICAL: Only mount after article is loaded */}
                <div className="flex-1 overflow-auto p-6">
                    <ArticleEditor
                        initialContent={{
                            body_markdown: article.body_markdown,
                            body_html: article.body_html,
                            content: article.content,
                        }}
                        onChange={(content) => {
                            setEditorContent(content);
                        }}
                        placeholder="Start writing..."
                        editable={true}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}



