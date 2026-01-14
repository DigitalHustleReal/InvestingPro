"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ArticleInspector from '@/components/admin/ArticleInspector';
import ArticleEditor from '@/components/admin/ArticleEditor';
import { Input } from '@/components/ui/input';
import { articleService, type ArticleData } from '@/lib/cms/article-service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, CheckCheck, Eye, ArrowLeft, Save, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { PreviewPane } from '@/components/admin/preview/PreviewPane';
import Link from 'next/link';

export default function EditArticlePage() {
    const router = useRouter();
    const params = useParams();
    const queryClient = useQueryClient();
    const id = params?.id as string;

    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [editorContent, setEditorContent] = useState<{ markdown: string; html: string } | null>(null);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isProofreading, setIsProofreading] = useState(false);
    const [editorKey, setEditorKey] = useState(0);
    const [showPreview, setShowPreview] = useState(false);

    const handleProofread = async () => {
        if (!editorContent?.markdown) return;
        
        if (!confirm("This will replace current content with AI-polished version. Continue?")) return;

        setIsProofreading(true);
        try {
            const res = await fetch('/api/admin/editor-tools', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    action: 'proofread',
                    content: editorContent.markdown 
                })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);
            
            // Update editor content
            // We force remount to apply new content
            const newContent = json.polished_content;
            
            // Update article query data locally to reflect change
            queryClient.setQueryData(['article', id], (old: any) => ({
                ...old,
                body_markdown: newContent,
                content: newContent
            }));
            
            setEditorKey(prev => prev + 1);
            toast.success("Content Proofread & Polished!");
        } catch (e: any) {
            toast.error("Proofreading failed: " + e.message);
        } finally {
            setIsProofreading(false);
        }
    };

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
            
            // Update local state with server response
            if (article) {
                // Refresh article data
                await queryClient.invalidateQueries({ queryKey: ['article', id] });
            }
            
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
            
            setLastSaved(new Date());
            
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
        // Ensure metadata is an object if called without args
        const meta = typeof metadata === 'object' ? metadata : {};
        await saveMutation.mutateAsync(meta);
    };

    const handlePublish = async (metadata: any = {}) => {
        if (!title.trim()) {
            toast.error('Please enter a title');
            return;
        }

        if (!editorContent) {
            toast.error('No content to publish');
            return;
        }

        setSaving(true);
        // Ensure metadata is an object if called without args
        const meta = typeof metadata === 'object' ? metadata : {};
        await publishMutation.mutateAsync(meta);
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
                        category: (article.category as any) || 'investing-basics',
                        language: (article.language as any) || 'en',
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
            <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                {/* Header */}
                <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md px-8 py-4 transition-colors duration-300">
                    <div className="max-w-5xl mx-auto w-full">
                        <div className="flex items-center gap-2 mb-4">
                            <Link
                                href="/admin/articles"
                                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Articles
                            </Link>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Add title..."
                                    className="text-3xl font-bold border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto py-2 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowPreview(true)}
                                    className="gap-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                    Preview
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="gap-2 bg-teal-600 hover:bg-teal-700 text-white"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            {article?.status === 'published' ? 'Update' : 'Save Draft'}
                                        </>
                                    )}
                                </Button>
                                {article?.status !== 'published' && (
                                    <Button
                                        onClick={handlePublish}
                                        disabled={publishMutation.isPending || saving}
                                        className="gap-2 bg-secondary-600 hover:bg-secondary-700 text-white"
                                    >
                                        {publishMutation.isPending ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Publishing...
                                            </>
                                        ) : (
                                            <>
                                                <Globe className="w-4 h-4" />
                                                Publish
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                    <div className="max-w-5xl mx-auto px-8 py-8">
                        <ArticleEditor
                            key={editorKey}
                            initialContent={{
                                body_markdown: article.body_markdown,
                                body_html: article.body_html,
                                content: article.content,
                            }}
                            onChange={(content) => {
                                setEditorContent(content);
                            }}
                            placeholder="Start writing or type / to insert a block..."
                            editable={true}
                        />
                    </div>
                </div>

                {/* Live Preview Pane */}
                <PreviewPane
                    content={editorContent?.markdown || article.body_markdown || ''}
                    title={title}
                    isOpen={showPreview}
                    onClose={() => setShowPreview(false)}
                />
            </div>
        </AdminLayout>
    );
}
