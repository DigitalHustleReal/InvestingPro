"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { api } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    FolderOpen, 
    Calendar,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    created_at?: string;
}

/**
 * Categories Management Page
 * 
 * Full-featured CRUD interface for managing article categories
 * - List view with search and sort
 * - Create new categories
 * - Edit existing categories
 * - Delete categories with confirmation
 */
export default function CategoriesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', slug: '', description: '' });
    const queryClient = useQueryClient();

    // Fetch categories
    const { data: categoriesData, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error fetching categories:', error);
                return [];
            }
            return Array.isArray(data) ? data as Category[] : [];
        },
        initialData: [],
    });

    // Ensure categories is always an array
    const categories = Array.isArray(categoriesData) ? categoriesData : [];

    // Filter categories based on search
    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Create mutation
    const createMutation = useMutation({
        mutationFn: async (data: { name: string; slug: string; description?: string }) => {
            const supabase = createClient();
            const { data: result, error } = await supabase
                .from('categories')
                .insert([data])
                .select()
                .single();
            
            if (error) throw error;
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setIsCreateDialogOpen(false);
            setFormData({ name: '', slug: '', description: '' });
        },
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<Category> }) => {
            const supabase = createClient();
            const { data: result, error } = await supabase
                .from('categories')
                .update(data)
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setIsEditDialogOpen(false);
            setSelectedCategory(null);
            setFormData({ name: '', slug: '', description: '' });
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const supabase = createClient();
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setIsDeleteDialogOpen(false);
            setSelectedCategory(null);
        },
    });

    // Auto-generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            slug: formData.slug || generateSlug(name),
        });
    };

    const handleCreate = () => {
        if (!formData.name.trim() || !formData.slug.trim()) {
            toast.error('Please fill in name and slug');
            return;
        }
        createMutation.mutate({
            name: formData.name.trim(),
            slug: formData.slug.trim(),
            description: formData.description.trim() || undefined,
        });
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = () => {
        if (!selectedCategory || !formData.name.trim() || !formData.slug.trim()) {
            toast.error('Please fill in name and slug');
            return;
        }
        updateMutation.mutate({
            id: selectedCategory.id,
            data: {
                name: formData.name.trim(),
                slug: formData.slug.trim(),
                description: formData.description.trim() || undefined,
            },
        });
    };

    const handleDeleteClick = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!selectedCategory) return;
        deleteMutation.mutate(selectedCategory.id);
    };

    // Count articles per category
    const getArticleCount = async (categoryId: string) => {
        try {
            const articles = await api.entities.Article.list('-created_date', 1000);
            return articles.filter((a: any) => a.category_id === categoryId).length;
        } catch {
            return 0;
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col bg-slate-50 min-h-screen">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
                            <p className="text-sm text-slate-600 mt-1">
                                Manage article categories and organization
                            </p>
                        </div>
                        <Button
                            onClick={() => {
                                setFormData({ name: '', slug: '', description: '' });
                                setIsCreateDialogOpen(true);
                            }}
                            className="bg-teal-600 hover:bg-teal-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Category
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search categories..."
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <Card className="p-6 md:p-8 text-center max-w-md mx-auto">
                            <FolderOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                {searchQuery ? 'No categories found' : 'No categories yet'}
                            </h3>
                            <p className="text-sm text-slate-600 mb-6">
                                {searchQuery
                                    ? 'Try adjusting your search terms'
                                    : 'Create your first category to organize articles'}
                            </p>
                            {!searchQuery && (
                                <Button
                                    onClick={() => setIsCreateDialogOpen(true)}
                                    className="bg-teal-600 hover:bg-teal-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Category
                                </Button>
                            )}
                        </Card>
                    ) : (
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCategories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <FolderOpen className="w-4 h-4 text-slate-400" />
                                                    {category.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                                                    {category.slug}
                                                </code>
                                            </TableCell>
                                            <TableCell className="max-w-md">
                                                <p className="text-sm text-slate-600 truncate">
                                                    {category.description || (
                                                        <span className="text-slate-400 italic">No description</span>
                                                    )}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                {category.created_at ? (
                                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(category.created_at).toLocaleDateString()}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 text-sm">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(category)}
                                                        className="h-8 w-8"
                                                    >
                                                        <Edit className="w-4 h-4 text-slate-600" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteClick(category)}
                                                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    )}

                    {/* Stats */}
                    {categories.length > 0 && (
                        <div className="mt-6">
                            <Badge variant="outline" className="text-sm">
                                {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'} total
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Create Dialog */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Category</DialogTitle>
                            <DialogDescription>
                                Add a new category to organize your articles.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="create-name">Name *</Label>
                                <Input
                                    id="create-name"
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="e.g., Mutual Funds"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="create-slug">Slug *</Label>
                                <Input
                                    id="create-slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="e.g., mutual-funds"
                                    className="mt-1 font-mono text-sm"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    URL-friendly version (auto-generated from name)
                                </p>
                            </div>
                            <div>
                                <Label htmlFor="create-description">Description</Label>
                                <Textarea
                                    id="create-description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of this category..."
                                    rows={3}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsCreateDialogOpen(false)}
                                disabled={createMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreate}
                                disabled={createMutation.isPending}
                                className="bg-teal-600 hover:bg-teal-700"
                            >
                                {createMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Category'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>
                                Update category information.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="edit-name">Name *</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="e.g., Mutual Funds"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-slug">Slug *</Label>
                                <Input
                                    id="edit-slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="e.g., mutual-funds"
                                    className="mt-1 font-mono text-sm"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                    id="edit-description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of this category..."
                                    rows={3}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                                disabled={updateMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdate}
                                disabled={updateMutation.isPending}
                                className="bg-teal-600 hover:bg-teal-700"
                            >
                                {updateMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Category'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-red-600">
                                <AlertCircle className="w-5 h-5" />
                                Delete Category
                            </DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                                disabled={deleteMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDeleteConfirm}
                                disabled={deleteMutation.isPending}
                                variant="destructive"
                            >
                                {deleteMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete Category'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
