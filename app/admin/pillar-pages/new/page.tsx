"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ArticleInspector from '@/components/admin/ArticleInspector';
import TipTapEditorWithMedia from '@/components/admin/TipTapEditorWithMedia';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { Save, Loader2, Target } from 'lucide-react';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

/**
 * New Pillar Page - Editor-first CMS experience
 * 
 * Layout:
 * - Full-height editor canvas
 * - Title input (separate from editor)
 * - TipTap rich text editor
 * - Inspector panel on the right
 * - Pillar-specific fields in inspector
 */
export default function NewPillarPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const createMutation = useMutation({
        mutationFn: (data: any) => api.entities.Article.create(data),
        onSuccess: (article: any) => {
            setSaving(false);
            setLastSaved(new Date());
            router.push(`/admin/pillar-pages/${article.id}/edit`);
        },
        onError: (error: any) => {
            setSaving(false);
            logger.error('Failed to create pillar page', error);
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

            await createMutation.mutateAsync({
                title,
                slug,
                content,
                excerpt,
                content_type: 'pillar', // Set content type to pillar
                status: metadata.status || 'draft',
                seo_title: metadata.seo_title || title,
                meta_description: metadata.meta_description || excerpt,
                category: metadata.category,
                tags: metadata.tags || [],
                featured_image: metadata.featured_image,
                // Pillar-specific fields
                pillar_primary_topic: metadata.pillar_primary_topic || title,
                pillar_subtopics: metadata.pillar_subtopics || [],
                pillar_related_categories: metadata.pillar_related_categories || [],
                pillar_related_articles: metadata.pillar_related_articles || [],
            });
        } catch (error) {
            // Error handled in mutation
        }
    };

    const handlePublish = () => {
        handleSave({ status: 'published' });
    };

    const handlePreview = () => {
        toast.info('Save the pillar page first to preview it. After saving, you can preview it from the edit page.');
    };

    // Auto-save indicator (mocked - could implement actual auto-save)
    const autosaveIndicator = lastSaved ? (
        <div className="flex items-center gap-2 text-xs text-slate-500">
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

