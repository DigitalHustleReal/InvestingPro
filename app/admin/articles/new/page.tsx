"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ArticleInspector from '@/components/admin/ArticleInspector';
import ArticleEditor from '@/components/admin/ArticleEditor';
import { PreviewModal } from '@/components/preview/PreviewModal';
import { Input } from '@/components/ui/input';
import type { ArticleData } from '@/lib/cms/article-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Loader2 } from 'lucide-react';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

/**
 * New Article Page - Editor-first CMS experience
 * 
 * Layout:
 * - Full-height editor canvas
 * - Title input (separate from editor)
 * - TipTap rich text editor
 * - Inspector panel on the right
 * - Preview modal
 */
export default function NewArticlePage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [bodyMarkdown, setBodyMarkdown] = useState<string>('');
    const [bodyHtml, setBodyHtml] = useState<string>('');
    const [excerpt, setExcerpt] = useState('');
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [articleId, setArticleId] = useState<string | null>(null); // Track if article was already created
    const [showPreview, setShowPreview] = useState(false);
    const [currentMetadata, setCurrentMetadata] = useState<any>({});

    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            // Use API route instead of server-only service
            const response = await fetch('/api/admin/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: {
                        body_markdown: data.body_markdown || '',
                        body_html: data.body_html || '',
                        content: data.content || data.body_markdown || '',
                    },
                    metadata: {
                        title: data.title,
                        slug: data.slug,
                        excerpt: data.excerpt || '',
                        category: data.category || 'investing-basics',
                        tags: data.tags || [],
                        seo_title: data.seo_title || data.title,
                        seo_description: data.meta_description || data.excerpt,
                        featured_image: data.featured_image,
                        read_time: data.read_time,
                        language: data.language || 'en',
                    },
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create article');
            }

            return await response.json();
        },
        onSuccess: (result) => {
            setSaving(false);
            setLastSaved(new Date());
            
            // Invalidate queries
            queryClient.invalidateQueries({ queryKey: ['articles', 'admin'] });
            
            if (result && result.id) {
                setArticleId(result.id); // Store article ID
                // Redirect to edit page immediately
                router.push(`/admin/articles/${result.id}/edit`);
            } else {
                toast.error('Article created but ID not returned. Please refresh the page.');
            }
        },
        onError: (error: any) => {
            setSaving(false);
            logger.error('Failed to create article', error);
            
            // Handle duplicate slug/409 error specifically
            let errorMessage = error?.message || error?.error?.message || 'Failed to save article. Please try again.';
            const isConflict = errorMessage.includes('duplicate key') || 
                             errorMessage.includes('articles_slug_key') ||
                             errorMessage.includes('409') ||
                             error?.status === 409;
            
            if (isConflict) {
                errorMessage = 'An article with this title already exists. Redirecting to edit page...';
                toast.error(errorMessage);
                // Try to find the existing article by slug and redirect
                const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                // Redirect will happen after a short delay to show the message
                setTimeout(() => {
                    router.push(`/admin/articles?slug=${slug}`);
                }, 1500);
            } else {
                toast.error(errorMessage);
            }
            console.error('Article creation error:', error);
        },
    });
    
    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            if (!articleId) throw new Error('Article ID not found');
            
            // Use API route instead of server-only service
            const response = await fetch(`/api/admin/articles/${articleId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: {
                        body_markdown: data.body_markdown || '',
                        body_html: data.body_html || '',
                        content: data.content || data.body_markdown || '',
                    },
                    metadata: {
                        title: data.title,
                        slug: data.slug,
                        excerpt: data.excerpt || '',
                        category: data.category || 'investing-basics',
                        tags: data.tags || [],
                        seo_title: data.seo_title || data.title,
                        seo_description: data.meta_description || data.excerpt,
                        featured_image: data.featured_image,
                        read_time: data.read_time,
                        language: data.language || 'en',
                    },
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update article');
            }

            return await response.json();
        },
        onSuccess: (result) => {
            setSaving(false);
            setLastSaved(new Date());
            
            // Invalidate queries
            queryClient.invalidateQueries({ queryKey: ['articles', 'admin'] });
            queryClient.invalidateQueries({ queryKey: ['article', articleId] });
            
            toast.success('Article updated successfully');
            // Redirect to edit page if not already there
            if (result && result.id && !window.location.pathname.includes('/edit')) {
                router.push(`/admin/articles/${result.id}/edit`);
            }
        },
        onError: (error: any) => {
            setSaving(false);
            logger.error('Failed to update article', error);
            const errorMessage = error?.message || error?.error?.message || 'Failed to save article. Please try again.';
            toast.error(errorMessage);
            console.error('Article update error:', error);
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

            const saveData = {
                title,
                slug,
                body_markdown: bodyMarkdown, // PRIMARY
                body_html: bodyHtml, // DERIVED
                excerpt,
                status: metadata.status || 'draft',
                seo_title: metadata.seo_title || title,
                meta_description: metadata.meta_description || excerpt,
                category: metadata.category,
                tags: metadata.tags || [],
                featured_image: metadata.featured_image,
            };

            // Store current metadata for preview
            setCurrentMetadata(metadata);

            // If article was already created, update it instead of creating new one
            if (articleId) {
                await updateMutation.mutateAsync(saveData);
            } else {
                await createMutation.mutateAsync(saveData);
            }
        } catch (error) {
            // Error handled in mutation
        }
    };

    const handlePublish = () => {
        handleSave({ status: 'published' });
    };

    const handlePreview = () => {
        if (!title.trim()) {
            toast.error('Please add a title before previewing');
            return;
        }
        setShowPreview(true);
    };

    // Auto-save indicator (mocked - could implement actual auto-save)
    const autosaveIndicator = lastSaved ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground/70 dark:text-muted-foreground/70">
            <Save className="w-3 h-3" />
            <span>Saved {lastSaved.toLocaleTimeString()}</span>
        </div>
    ) : null;

    return (
        <AdminLayout
            showInspector={true}
            inspectorContent={
                <ArticleInspector
                    article={{
                        title,
                        body_markdown: bodyMarkdown,
                        body_html: bodyHtml,
                        content: bodyMarkdown || bodyHtml, // Legacy fallback
                    }}
                    onSave={handleSave}
                    onPublish={handlePublish}
                    onPreview={handlePreview}
                    saving={saving}
                />
            }
        >
            <div className="flex flex-col bg-slate-50 dark:bg-surface-darkest dark:bg-surface-darkest min-h-screen transition-colors duration-300">
                {/* Header Bar */}
                <div className="border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between bg-white dark:bg-surface-darker/50 dark:bg-surface-darker/50 backdrop-blur-md transition-colors duration-300">
                    <div className="flex-1">
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Article title..."
                            className="text-3xl font-bold border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto bg-transparent text-slate-900 dark:text-foreground dark:text-foreground placeholder:text-muted-foreground dark:text-muted-foreground dark:placeholder:text-muted-foreground/50 dark:text-muted-foreground/50"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        {autosaveIndicator}
                        {saving && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Saving...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Editor Canvas */}
                <div className="flex-1 min-h-0">
                    <ArticleEditor
                        initialContent={{
                            body_markdown: bodyMarkdown,
                            body_html: bodyHtml,
                            content: bodyMarkdown || bodyHtml,
                        }}
                        onChange={(content) => {
                            setBodyMarkdown(content.markdown);
                            setBodyHtml(content.html);
                        }}
                        placeholder="Start writing your article..."
                        editable={true}
                    />
                </div>
            </div>

            {/* Preview Modal */}
            <PreviewModal
                article={{
                    title,
                    content: bodyMarkdown,
                    excerpt,
                    featured_image: currentMetadata.featured_image,
                    category: currentMetadata.category,
                    tags: currentMetadata.tags || [],
                    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    seo_title: currentMetadata.seo_title,
                    seo_description: currentMetadata.meta_description
                }}
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
            />
        </AdminLayout>
    );
}

