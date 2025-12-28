"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ArticleInspector from '@/components/admin/ArticleInspector';
import TipTapEditorWithMedia from '@/components/admin/TipTapEditorWithMedia';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Loader2, Target } from 'lucide-react';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

/**
 * Edit Pillar Page - Editor-first CMS experience
 * 
 * Layout:
 * - Full-height editor canvas
 * - Title input (separate from editor)
 * - TipTap rich text editor
 * - Inspector panel on the right
 * - Pillar-specific fields in inspector
 */
export default function EditPillarPage() {
    const router = useRouter();
    const params = useParams();
    const queryClient = useQueryClient();
    const id = params?.id as string;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Fetch existing pillar page
    const { data: pillarPage, isLoading } = useQuery({
        queryKey: ['pillar-page', id],
        queryFn: async () => {
            const articles = await api.entities.Article.filter({ id });
            if (articles.length === 0) {
                throw new Error('Pillar page not found');
            }
            const page = articles[0];
            if (page.content_type !== 'pillar') {
                throw new Error('This is not a pillar page');
            }
            return page;
        },
        enabled: !!id,
    });

    // Initialize form with fetched data
    useEffect(() => {
        if (pillarPage) {
            setTitle(pillarPage.title || '');
            setContent(pillarPage.content || '');
            setExcerpt(pillarPage.excerpt || '');
        }
    }, [pillarPage]);

    const updateMutation = useMutation({
        mutationFn: (data: any) => api.entities.Article.update(id, data),
        onSuccess: () => {
            setSaving(false);
            setLastSaved(new Date());
            queryClient.invalidateQueries({ queryKey: ['pillar-page', id] });
            queryClient.invalidateQueries({ queryKey: ['pillar-pages'] });
            toast.success('Pillar page saved successfully');
        },
        onError: (error: any) => {
            setSaving(false);
            logger.error('Failed to update pillar page', error);
            toast.error('Failed to save pillar page. Please try again.');
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
                content_type: 'pillar', // Ensure content type is pillar
                status: metadata.status || pillarPage?.status || 'draft',
                seo_title: metadata.seo_title || title,
                meta_description: metadata.meta_description || excerpt,
                category: metadata.category || pillarPage?.category,
                tags: metadata.tags || pillarPage?.tags || [],
                featured_image: metadata.featured_image || pillarPage?.featured_image,
                // Pillar-specific fields
                pillar_primary_topic: metadata.pillar_primary_topic || pillarPage?.pillar_primary_topic || title,
                pillar_subtopics: metadata.pillar_subtopics || pillarPage?.pillar_subtopics || [],
                pillar_related_categories: metadata.pillar_related_categories || pillarPage?.pillar_related_categories || [],
                pillar_related_articles: metadata.pillar_related_articles || pillarPage?.pillar_related_articles || [],
            });
        } catch (error) {
            // Error handled in mutation
        }
    };

    const handlePublish = () => {
        handleSave({ status: 'published' });
    };

    const handlePreview = () => {
        if (pillarPage?.slug) {
            window.open(`/article/${pillarPage.slug}`, '_blank');
        } else {
            toast.info('Save the pillar page first to preview it.');
        }
    };

    // Auto-save indicator
    const autosaveIndicator = lastSaved ? (
        <div className="flex items-center gap-2 text-xs text-slate-500">
            <Save className="w-3 h-3" />
            <span>Saved {lastSaved.toLocaleTimeString()}</span>
        </div>
    ) : null;

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
            </AdminLayout>
        );
    }

    if (!pillarPage) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center h-full">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Pillar Page Not Found</h1>
                    <button
                        onClick={() => router.push('/admin/pillar-pages')}
                        className="text-teal-600 hover:text-teal-700"
                    >
                        Back to Pillar Pages
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
                        ...pillarPage,
                        title,
                        content,
                    }}
                    onSave={handleSave}
                    onPublish={handlePublish}
                    onPreview={handlePreview}
                    saving={saving}
                />
            }
        >
            <div className="flex flex-col bg-white min-h-screen">
                {/* Header Bar */}
                <div className="border-b border-slate-200 px-8 py-4 flex items-center justify-between bg-white">
                    <div className="flex-1 flex items-center gap-3">
                        <Target className="w-6 h-6 text-teal-600" />
                        <div className="flex-1">
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Pillar page title..."
                                className="text-3xl font-bold border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {autosaveIndicator}
                        {saving && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Saving...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Editor Canvas */}
                <div className="flex-1 min-h-0">
                    <TipTapEditorWithMedia
                        content={content}
                        onChange={setContent}
                        placeholder="Start writing your pillar page content..."
                        className="h-full"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}

