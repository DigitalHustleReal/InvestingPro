"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { apiClient as api } from '@/lib/api-client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Tag as TagIcon, 
    Calendar,
    AlertCircle,
    FileText,
    Hash
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { AdminPageHeader, ContentSection, StatCard, EmptyState, ActionButton } from '@/components/admin/AdminUIKit';

interface Tag {
    id: string;
    name: string;
    slug: string;
    created_at?: string;
}

export default function TagsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
    const [formData, setFormData] = useState({ name: '', slug: '' });
    const [tagUsageCounts, setTagUsageCounts] = useState<Record<string, number>>({});
    const queryClient = useQueryClient();

    const { data: tagsData, isLoading } = useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const supabase = createClient();
            const { data, error } = await supabase.from('tags').select('*').order('created_at', { ascending: false });
            if (!error && data) return data as Tag[];
            
            // Fallback: extract from articles
            const articles = await api.entities.Article.list('-created_date', 1000);
            const tagMap = new Map<string, Tag>();
            articles.forEach((article: any) => {
                if (article.tags && Array.isArray(article.tags)) {
                    article.tags.forEach((tagName: string) => {
                        if (tagName) {
                            const slug = tagName.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
                            tagMap.set(slug, { id: slug, name: tagName, slug });
                        }
                    });
                }
            });
            return Array.from(tagMap.values());
        },
        initialData: [],
    });

    const { data: articles = [] } = useQuery({
        queryKey: ['articles-for-tag-counts'],
        queryFn: () => api.entities.Article.list('-created_date', 1000),
        initialData: [],
    });

    useEffect(() => {
        if (articles && Array.isArray(articles)) {
            const counts: Record<string, number> = {};
            articles.forEach((article: any) => {
                if (article.tags && Array.isArray(article.tags)) {
                    article.tags.forEach((tagName: string) => {
                        if (tagName) {
                            const slug = tagName.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
                            counts[slug] = (counts[slug] || 0) + 1;
                        }
                    });
                }
            });
            setTagUsageCounts(counts);
        }
    }, [articles]);

    const tags = Array.isArray(tagsData) ? tagsData : [];
    const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const totalUsage = Object.values(tagUsageCounts).reduce((a, b) => a + b, 0);

    const generateSlug = (name: string) => name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');

    const handleCreate = async (): Promise<void> => {
        if (!formData.name.trim()) {
            toast.error('Name required');
            return;
        }
        const supabase = createClient();
        await supabase.from('tags').insert([{ name: formData.name, slug: formData.slug || generateSlug(formData.name) }]);
        queryClient.invalidateQueries({ queryKey: ['tags'] });
        setIsCreateDialogOpen(false);
        setFormData({ name: '', slug: '' });
        toast.success('Tag created!');
    };

    const handleUpdate = async () => {
        if (!selectedTag || !formData.name.trim()) return;
        const supabase = createClient();
        await supabase.from('tags').update({ name: formData.name, slug: formData.slug }).eq('id', selectedTag.id);
        queryClient.invalidateQueries({ queryKey: ['tags'] });
        setIsEditDialogOpen(false);
        toast.success('Tag updated!');
    };

    const handleDelete = async () => {
        if (!selectedTag) return;
        const supabase = createClient();
        await supabase.from('tags').delete().eq('id', selectedTag.id);
        queryClient.invalidateQueries({ queryKey: ['tags'] });
        setIsDeleteDialogOpen(false);
        toast.success('Tag deleted!');
    };

    return (
        <AdminLayout>
            <div className="p-8 space-y-8">
                <AdminPageHeader
                    title="Tags"
                    subtitle="Label and organize your content with tags"
                    icon={Hash}
                    iconColor="amber"
                    actions={
                        <ActionButton onClick={() => { setFormData({ name: '', slug: '' }); setIsCreateDialogOpen(true); }} icon={Plus}>
                            New Tag
                        </ActionButton>
                    }
                />

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total Tags" value={tags.length} icon={TagIcon} color="amber" />
                    <StatCard label="Total Usage" value={totalUsage} icon={FileText} color="teal" />
                </div>

                {/* Search */}
                <ContentSection>
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 dark:text-muted-foreground/70" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search tags..."
                            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 dark:bg-muted/50 border border-border dark:border-border rounded-lg text-foreground dark:text-foreground placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-500/50"
                        />
                    </div>
                </ContentSection>

                {/* Table */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-accent-500/30 border-t-accent-500 rounded-full animate-spin" />
                    </div>
                ) : filteredTags.length === 0 ? (
                    <ContentSection>
                        <EmptyState
                            icon={TagIcon}
                            title={searchQuery ? 'No tags found' : 'No tags yet'}
                            description={searchQuery ? 'Try a different search' : 'Create tags to organize your articles'}
                            action={!searchQuery && <ActionButton onClick={() => setIsCreateDialogOpen(true)} icon={Plus}>Create Tag</ActionButton>}
                        />
                    </ContentSection>
                ) : (
                    <ContentSection>
                        <div className="overflow-x-auto -mx-6">
                            <table className="w-full min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-border dark:border-border">
                                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground/70 dark:text-muted-foreground/70 uppercase">Name</th>
                                        <th className="px-4 py-4 text-left text-xs font-medium text-muted-foreground/70 dark:text-muted-foreground/70 uppercase">Slug</th>
                                        <th className="px-4 py-4 text-left text-xs font-medium text-muted-foreground/70 dark:text-muted-foreground/70 uppercase">Usage</th>
                                        <th className="px-4 py-4 text-left text-xs font-medium text-muted-foreground/70 dark:text-muted-foreground/70 uppercase hidden sm:table-cell">Created</th>
                                        <th className="px-4 py-4 text-right text-xs font-medium text-muted-foreground/70 dark:text-muted-foreground/70 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredTags.map((tag) => {
                                        const usage = tagUsageCounts[tag.slug] || 0;
                                        return (
                                            <tr key={tag.id} className="group hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center">
                                                            <TagIcon className="w-4 h-4 text-accent-400" />
                                                        </div>
                                                        <span className="font-medium text-foreground dark:text-foreground">{tag.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <code className="text-xs bg-white/5 px-2 py-1 rounded text-muted-foreground dark:text-muted-foreground border border-border dark:border-border">
                                                        {tag.slug}
                                                    </code>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {usage > 0 ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-primary-500/20 text-primary-400 border border-primary-500/30">
                                                            <FileText className="w-3 h-3" />
                                                            {usage} article{usage !== 1 ? 's' : ''}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground/50 dark:text-muted-foreground/50 text-sm">Not used</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 hidden sm:table-cell">
                                                    {tag.created_at ? (
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground/70 dark:text-muted-foreground/70">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(tag.created_at).toLocaleDateString()}
                                                        </div>
                                                    ) : '—'}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => { setSelectedTag(tag); setFormData({ name: tag.name, slug: tag.slug }); setIsEditDialogOpen(true); }} className="p-2 hover:bg-white/10 rounded-lg text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:text-foreground transition-colors">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => { setSelectedTag(tag); setIsDeleteDialogOpen(true); }} className="p-2 hover:bg-danger-500/20 rounded-lg text-muted-foreground dark:text-muted-foreground hover:text-danger-400 transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </ContentSection>
                )}

                {/* Create Dialog */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent className="bg-surface-darker dark:bg-surface-darker border-border dark:border-border text-foreground dark:text-foreground">
                        <DialogHeader>
                            <DialogTitle>Create Tag</DialogTitle>
                            <DialogDescription className="text-muted-foreground dark:text-muted-foreground">Add a new tag to label articles.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label className="text-foreground/80 dark:text-foreground/80">Name *</Label>
                                <Input value={formData.name} onChange={(e) => setFormData({ name: e.target.value, slug: formData.slug || generateSlug(e.target.value) })} placeholder="e.g., Investment Tips" className="mt-1 bg-muted/50 dark:bg-muted/50 border-border/70 dark:border-border/70 text-foreground dark:text-foreground" />
                            </div>
                            <div>
                                <Label className="text-foreground/80 dark:text-foreground/80">Slug</Label>
                                <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="Auto-generated" className="mt-1 bg-muted/50 dark:bg-muted/50 border-border/70 dark:border-border/70 text-foreground dark:text-foreground font-mono text-sm" />
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <button onClick={() => setIsCreateDialogOpen(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-foreground dark:text-foreground rounded-lg text-sm">Cancel</button>
                            <button onClick={handleCreate} className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-foreground dark:text-foreground rounded-lg text-sm">Create</button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="bg-surface-darker dark:bg-surface-darker border-border dark:border-border text-foreground dark:text-foreground">
                        <DialogHeader>
                            <DialogTitle>Edit Tag</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label className="text-foreground/80 dark:text-foreground/80">Name *</Label>
                                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1 bg-muted/50 dark:bg-muted/50 border-border/70 dark:border-border/70 text-foreground dark:text-foreground" />
                            </div>
                            <div>
                                <Label className="text-foreground/80 dark:text-foreground/80">Slug</Label>
                                <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="mt-1 bg-muted/50 dark:bg-muted/50 border-border/70 dark:border-border/70 text-foreground dark:text-foreground font-mono text-sm" />
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <button onClick={() => setIsEditDialogOpen(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-foreground dark:text-foreground rounded-lg text-sm">Cancel</button>
                            <button onClick={handleUpdate} className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-foreground dark:text-foreground rounded-lg text-sm">Update</button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="bg-surface-darker dark:bg-surface-darker border-border dark:border-border text-foreground dark:text-foreground">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-rose-400">
                                <AlertCircle className="w-5 h-5" />
                                Delete Tag
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground dark:text-muted-foreground">
                                Delete "{selectedTag?.name}"? 
                                {tagUsageCounts[selectedTag?.slug || ''] > 0 && (
                                    <span className="block mt-1 text-accent-400">
                                        Warning: Used in {tagUsageCounts[selectedTag?.slug || '']} articles.
                                    </span>
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2">
                            <button onClick={() => setIsDeleteDialogOpen(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-foreground dark:text-foreground rounded-lg text-sm">Cancel</button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-danger-500 hover:bg-danger-600 text-foreground dark:text-foreground rounded-lg text-sm">Delete</button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
