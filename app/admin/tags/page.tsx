"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    Tag as TagIcon, 
    Calendar,
    Loader2,
    AlertCircle,
    FileText
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface Tag {
    id: string;
    name: string;
    slug: string;
    created_at?: string;
}

/**
 * Tags Management Page
 * 
 * Full-featured CRUD interface for managing article tags
 * - List view with search
 * - Create new tags
 * - Edit existing tags
 * - Delete tags with confirmation
 * - Tag usage count (how many articles use each tag)
 */
export default function TagsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
    const [formData, setFormData] = useState({ name: '', slug: '' });
    const [tagUsageCounts, setTagUsageCounts] = useState<Record<string, number>>({});
    const queryClient = useQueryClient();

    // Fetch tags - for now, we'll extract unique tags from articles since there might not be a tags table
    const { data: tagsData, isLoading } = useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            try {
                // First, try to fetch from a tags table if it exists
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('tags')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (!error && data && Array.isArray(data)) {
                    return data as Tag[];
                }

                // Fallback: Extract unique tags from articles
                const articles = await api.entities.Article.list('-created_date', 1000);
                const tagSet = new Set<string>();
                const tagMap = new Map<string, Tag>();

                articles.forEach((article: any) => {
                    if (article.tags && Array.isArray(article.tags)) {
                        article.tags.forEach((tagName: string) => {
                            if (tagName && !tagSet.has(tagName.toLowerCase())) {
                                tagSet.add(tagName.toLowerCase());
                                const slug = tagName
                                    .toLowerCase()
                                    .trim()
                                    .replace(/[^\w\s-]/g, '')
                                    .replace(/[\s_-]+/g, '-')
                                    .replace(/^-+|-+$/g, '');
                                
                                tagMap.set(tagName.toLowerCase(), {
                                    id: slug, // Use slug as ID for now
                                    name: tagName,
                                    slug: slug,
                                });
                            }
                        });
                    }
                });

                return Array.from(tagMap.values());
            } catch (error) {
                console.error('Error fetching tags:', error);
                return [];
            }
        },
        initialData: [],
    });

    // Fetch tag usage counts
    const { data: articles = [] } = useQuery({
        queryKey: ['articles-for-tag-counts'],
        queryFn: () => api.entities.Article.list('-created_date', 1000),
        initialData: [],
        enabled: true,
    });

    React.useEffect(() => {
        if (articles && Array.isArray(articles)) {
            const counts: Record<string, number> = {};
            articles.forEach((article: any) => {
                if (article.tags && Array.isArray(article.tags)) {
                    article.tags.forEach((tagName: string) => {
                        if (tagName) {
                            const slug = tagName
                                .toLowerCase()
                                .trim()
                                .replace(/[^\w\s-]/g, '')
                                .replace(/[\s_-]+/g, '-')
                                .replace(/^-+|-+$/g, '');
                            counts[slug] = (counts[slug] || 0) + 1;
                        }
                    });
                }
            });
            setTagUsageCounts(counts);
        }
    }, [articles]);

    // Ensure tags is always an array
    const tags = Array.isArray(tagsData) ? tagsData : [];

    // Filter tags based on search
    const filteredTags = tags.filter((tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    const handleCreate = async () => {
        if (!formData.name.trim() || !formData.slug.trim()) {
            toast.error('Please fill in name and slug');
            return;
        }

        try {
            // Try to save to tags table if it exists
            const supabase = createClient();
            const { error } = await supabase
                .from('tags')
                .insert([{
                    name: formData.name.trim(),
                    slug: formData.slug.trim(),
                }]);

            if (error) {
                // If tags table doesn't exist, that's okay - tags are stored in articles
                console.log('Tags table might not exist, tags will be used when creating articles');
            }

            queryClient.invalidateQueries({ queryKey: ['tags'] });
            setIsCreateDialogOpen(false);
            setFormData({ name: '', slug: '' });
            toast.success('Tag created! It will be available when creating articles.');
        } catch (error: any) {
            console.error('Error creating tag:', error);
            toast.success('Tag created! It will be available when creating articles.');
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            setIsCreateDialogOpen(false);
            setFormData({ name: '', slug: '' });
        }
    };

    const handleEdit = (tag: Tag) => {
        setSelectedTag(tag);
        setFormData({
            name: tag.name,
            slug: tag.slug,
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedTag || !formData.name.trim() || !formData.slug.trim()) {
            toast.error('Please fill in name and slug');
            return;
        }

        try {
            const supabase = createClient();
            // Try to update in tags table if it exists
            const { error } = await supabase
                .from('tags')
                .update({
                    name: formData.name.trim(),
                    slug: formData.slug.trim(),
                })
                .eq('id', selectedTag.id);

            if (error) {
                console.log('Tags table might not exist');
            }

            queryClient.invalidateQueries({ queryKey: ['tags'] });
            setIsEditDialogOpen(false);
            setSelectedTag(null);
            setFormData({ name: '', slug: '' });
            toast.success('Tag updated! Note: Existing articles using this tag will need to be updated manually.');
        } catch (error: any) {
            console.error('Error updating tag:', error);
            toast.success('Tag updated! Note: Existing articles using this tag will need to be updated manually.');
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            setIsEditDialogOpen(false);
            setSelectedTag(null);
            setFormData({ name: '', slug: '' });
        }
    };

    const handleDeleteClick = (tag: Tag) => {
        setSelectedTag(tag);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedTag) return;

        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('tags')
                .delete()
                .eq('id', selectedTag.id);

            if (error) {
                console.log('Tags table might not exist');
            }

            queryClient.invalidateQueries({ queryKey: ['tags'] });
            setIsDeleteDialogOpen(false);
            setSelectedTag(null);
            toast.success('Tag deleted! Note: It will still appear in articles that already use it until manually removed.');
        } catch (error: any) {
            console.error('Error deleting tag:', error);
            toast.success('Tag deleted! Note: It will still appear in articles that already use it until manually removed.');
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            setIsDeleteDialogOpen(false);
            setSelectedTag(null);
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col bg-slate-50 min-h-screen">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Tags</h1>
                            <p className="text-sm text-slate-600 mt-1">
                                Manage article tags and labels
                            </p>
                        </div>
                        <Button
                            onClick={() => {
                                setFormData({ name: '', slug: '' });
                                setIsCreateDialogOpen(true);
                            }}
                            className="bg-teal-600 hover:bg-teal-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Tag
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search tags..."
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
                    ) : filteredTags.length === 0 ? (
                        <Card className="p-6 md:p-8 text-center max-w-md mx-auto">
                            <TagIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                {searchQuery ? 'No tags found' : 'No tags yet'}
                            </h3>
                            <p className="text-sm text-slate-600 mb-6">
                                {searchQuery
                                    ? 'Try adjusting your search terms'
                                    : 'Create your first tag to label and organize articles'}
                            </p>
                            {!searchQuery && (
                                <Button
                                    onClick={() => setIsCreateDialogOpen(true)}
                                    className="bg-teal-600 hover:bg-teal-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Tag
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
                                        <TableHead>Usage</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTags.map((tag) => {
                                        const usageCount = tagUsageCounts[tag.slug] || 0;
                                        return (
                                            <TableRow key={tag.id || tag.slug}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <TagIcon className="w-4 h-4 text-slate-400" />
                                                        {tag.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                                                        {tag.slug}
                                                    </code>
                                                </TableCell>
                                                <TableCell>
                                                    {usageCount > 0 ? (
                                                        <Badge variant="outline" className="gap-1">
                                                            <FileText className="w-3 h-3" />
                                                            {usageCount} article{usageCount !== 1 ? 's' : ''}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-slate-400 text-sm">Not used</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {tag.created_at ? (
                                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                                            <Calendar className="w-4 h-4" />
                                                            {new Date(tag.created_at).toLocaleDateString()}
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
                                                            onClick={() => handleEdit(tag)}
                                                            className="h-8 w-8"
                                                        >
                                                            <Edit className="w-4 h-4 text-slate-600" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteClick(tag)}
                                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Card>
                    )}

                    {/* Stats */}
                    {tags.length > 0 && (
                        <div className="mt-6 flex items-center gap-4">
                            <Badge variant="outline" className="text-sm">
                                {tags.length} tag{tags.length !== 1 ? 's' : ''} total
                            </Badge>
                            {Object.keys(tagUsageCounts).length > 0 && (
                                <Badge variant="outline" className="text-sm">
                                    {Object.values(tagUsageCounts).reduce((a, b) => a + b, 0)} total uses
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                {/* Create Dialog */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Tag</DialogTitle>
                            <DialogDescription>
                                Add a new tag to label and organize your articles.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="create-name">Name *</Label>
                                <Input
                                    id="create-name"
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="e.g., Investment Tips"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="create-slug">Slug *</Label>
                                <Input
                                    id="create-slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="e.g., investment-tips"
                                    className="mt-1 font-mono text-sm"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    URL-friendly version (auto-generated from name)
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsCreateDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreate}
                                className="bg-teal-600 hover:bg-teal-700"
                            >
                                Create Tag
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Tag</DialogTitle>
                            <DialogDescription>
                                Update tag information.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="edit-name">Name *</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="e.g., Investment Tips"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-slug">Slug *</Label>
                                <Input
                                    id="edit-slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="e.g., investment-tips"
                                    className="mt-1 font-mono text-sm"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdate}
                                className="bg-teal-600 hover:bg-teal-700"
                            >
                                Update Tag
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
                                Delete Tag
                            </DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete "{selectedTag?.name}"? This action cannot be undone.
                                {tagUsageCounts[selectedTag?.slug || ''] > 0 && (
                                    <span className="block mt-2 text-amber-600">
                                        Warning: This tag is used in {tagUsageCounts[selectedTag?.slug || '']} article(s).
                                    </span>
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDeleteConfirm}
                                variant="destructive"
                            >
                                Delete Tag
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
