"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    FolderOpen, 
    Calendar,
    AlertCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { AdminPageHeader, ContentSection, StatCard, StatusBadge, ActionButton, EmptyState } from '@/components/admin/AdminUIKit';

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    created_at?: string;
}

export default function CategoriesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', slug: '', description: '' });
    const queryClient = useQueryClient();

    const { data: categoriesData, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) return [];
            return Array.isArray(data) ? data as Category[] : [];
        },
        initialData: [],
    });

    const categories = Array.isArray(categoriesData) ? categoriesData : [];
    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const createMutation = useMutation({
        mutationFn: async (data: { name: string; slug: string; description?: string }) => {
            const supabase = createClient();
            const { error } = await supabase.from('categories').insert([data]);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setIsCreateDialogOpen(false);
            setFormData({ name: '', slug: '', description: '' });
            toast.success('Category created!');
        },
        onError: (err: any) => toast.error(err.message)
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<Category> }) => {
            const supabase = createClient();
            const { error } = await supabase.from('categories').update(data).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setIsEditDialogOpen(false);
            setSelectedCategory(null);
            setFormData({ name: '', slug: '', description: '' });
            toast.success('Category updated!');
        },
        onError: (err: any) => toast.error(err.message)
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const supabase = createClient();
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setIsDeleteDialogOpen(false);
            setSelectedCategory(null);
            toast.success('Category deleted!');
        },
        onError: (err: any) => toast.error(err.message)
    });

    const generateSlug = (name: string) => name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

    const handleNameChange = (name: string) => {
        setFormData({ ...formData, name, slug: formData.slug || generateSlug(name) });
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setFormData({ name: category.name, slug: category.slug, description: category.description || '' });
        setIsEditDialogOpen(true);
    };

    return (
        <AdminLayout>
            <div className="p-8 space-y-8">
                <AdminPageHeader
                    title="Categories"
                    subtitle="Organize your content with categories"
                    icon={FolderOpen}
                    iconColor="blue"
                    actions={
                        <ActionButton 
                            onClick={() => { setFormData({ name: '', slug: '', description: '' }); setIsCreateDialogOpen(true); }}
                            icon={Plus}
                        >
                            New Category
                        </ActionButton>
                    }
                />

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total Categories" value={categories.length} icon={FolderOpen} color="blue" />
                    <StatCard label="With Description" value={categories.filter(c => c.description).length} icon={FolderOpen} color="teal" />
                </div>

                {/* Search */}
                <ContentSection>
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search categories..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/50"
                        />
                    </div>
                </ContentSection>

                {/* Table */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-secondary-500/30 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <ContentSection>
                        <EmptyState
                            icon={FolderOpen}
                            title={searchQuery ? 'No categories found' : 'No categories yet'}
                            description={searchQuery ? 'Try a different search term' : 'Create your first category to organize articles'}
                            action={!searchQuery && <ActionButton onClick={() => setIsCreateDialogOpen(true)} icon={Plus}>Create Category</ActionButton>}
                        />
                    </ContentSection>
                ) : (
                    <ContentSection>
                        <div className="overflow-x-auto -mx-6">
                            <table className="w-full min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                        <th className="px-4 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Slug</th>
                                        <th className="px-4 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">Description</th>
                                        <th className="px-4 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">Created</th>
                                        <th className="px-4 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredCategories.map((category) => (
                                        <tr key={category.id} className="group hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-secondary-500/20 flex items-center justify-center">
                                                        <FolderOpen className="w-4 h-4 text-secondary-400" />
                                                    </div>
                                                    <span className="font-medium text-white">{category.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <code className="text-xs bg-white/5 px-2 py-1 rounded text-slate-400 border border-white/10">
                                                    {category.slug}
                                                </code>
                                            </td>
                                            <td className="px-4 py-4 hidden md:table-cell max-w-xs">
                                                <p className="text-sm text-slate-400 truncate">
                                                    {category.description || <span className="text-slate-600 italic">No description</span>}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4 hidden sm:table-cell">
                                                {category.created_at ? (
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(category.created_at).toLocaleDateString()}
                                                    </div>
                                                ) : 'â€”'}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(category)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => { setSelectedCategory(category); setIsDeleteDialogOpen(true); }} className="p-2 hover:bg-rose-500/20 rounded-lg text-slate-400 hover:text-rose-400 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </ContentSection>
                )}

                {/* Create Dialog */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent className="bg-slate-900 border-slate-700 text-white">
                        <DialogHeader>
                            <DialogTitle>Create Category</DialogTitle>
                            <DialogDescription className="text-slate-400">Add a new category to organize your articles.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label className="text-slate-300">Name *</Label>
                                <Input value={formData.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g., Mutual Funds" className="mt-1 bg-slate-800/50 border-slate-600 text-white" />
                            </div>
                            <div>
                                <Label className="text-slate-300">Slug *</Label>
                                <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="e.g., mutual-funds" className="mt-1 bg-slate-800/50 border-slate-600 text-white font-mono text-sm" />
                            </div>
                            <div>
                                <Label className="text-slate-300">Description</Label>
                                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description..." rows={3} className="mt-1 bg-slate-800/50 border-slate-600 text-white" />
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <button onClick={() => setIsCreateDialogOpen(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm">Cancel</button>
                            <button onClick={() => createMutation.mutate({ name: formData.name, slug: formData.slug, description: formData.description || undefined })} disabled={createMutation.isPending} className="px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg text-sm disabled:opacity-50">
                                {createMutation.isPending ? 'Creating...' : 'Create'}
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="bg-slate-900 border-slate-700 text-white">
                        <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label className="text-slate-300">Name *</Label>
                                <Input value={formData.name} onChange={(e) => handleNameChange(e.target.value)} className="mt-1 bg-slate-800/50 border-slate-600 text-white" />
                            </div>
                            <div>
                                <Label className="text-slate-300">Slug *</Label>
                                <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="mt-1 bg-slate-800/50 border-slate-600 text-white font-mono text-sm" />
                            </div>
                            <div>
                                <Label className="text-slate-300">Description</Label>
                                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="mt-1 bg-slate-800/50 border-slate-600 text-white" />
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <button onClick={() => setIsEditDialogOpen(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm">Cancel</button>
                            <button onClick={() => selectedCategory && updateMutation.mutate({ id: selectedCategory.id, data: { name: formData.name, slug: formData.slug, description: formData.description || undefined } })} disabled={updateMutation.isPending} className="px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg text-sm disabled:opacity-50">
                                {updateMutation.isPending ? 'Updating...' : 'Update'}
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="bg-slate-900 border-slate-700 text-white">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-rose-400">
                                <AlertCircle className="w-5 h-5" />
                                Delete Category
                            </DialogTitle>
                            <DialogDescription className="text-slate-400">
                                Are you sure you want to delete "{selectedCategory?.name}"? This cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2">
                            <button onClick={() => setIsDeleteDialogOpen(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm">Cancel</button>
                            <button onClick={() => selectedCategory && deleteMutation.mutate(selectedCategory.id)} disabled={deleteMutation.isPending} className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm disabled:opacity-50">
                                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
