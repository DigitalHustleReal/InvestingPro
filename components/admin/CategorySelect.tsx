"use client";

import React, { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Plus, X } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface CategorySelectProps {
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
}

export default function CategorySelect({
    value,
    onValueChange,
    className = "",
}: CategorySelectProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategorySlug, setNewCategorySlug] = useState('');
    const queryClient = useQueryClient();

    // Fetch categories
    const { data: categories = [] } = useQuery({
        queryKey: ['categories-for-select'],
        queryFn: async () => {
            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('categories')
                    .select('*')
                    .order('name', { ascending: true });
                
                if (error) {
                    console.error('Error fetching categories:', error);
                    return [];
                }
                return Array.isArray(data) ? data : [];
            } catch (error) {
                console.error('Error fetching categories:', error);
                return [];
            }
        },
        initialData: [],
    });

    // Filter categories based on search
    const filteredCategories = categories.filter((cat: any) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
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
        setNewCategoryName(name);
        if (!newCategorySlug) {
            setNewCategorySlug(generateSlug(name));
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim() || !newCategorySlug.trim()) {
            toast.error('Please fill in name and slug');
            return;
        }

        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('categories')
                .insert([{
                    name: newCategoryName.trim(),
                    slug: newCategorySlug.trim(),
                }])
                .select()
                .single();

            if (error) {
                toast.error('Failed to create category');
                return;
            }

            toast.success('Category created!');
            queryClient.invalidateQueries({ queryKey: ['categories-for-select'] });
            queryClient.invalidateQueries({ queryKey: ['categories-for-inspector'] });
            onValueChange(data.slug);
            setIsCreateDialogOpen(false);
            setNewCategoryName('');
            setNewCategorySlug('');
        } catch (error: any) {
            toast.error('Failed to create category');
        }
    };

    return (
        <>
            <div className={className}>
                <Select value={value} onValueChange={onValueChange}>
                    <SelectTrigger className="w-full bg-white dark:bg-surface-darker border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-surface-darker border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200">
                        {/* Search input */}
                        <div className="px-2 pb-2">
                            <Input
                                placeholder="Search categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-8 bg-slate-50 dark:bg-surface-dark border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                            />
                        </div>
                        
                        {/* Create new button */}
                        <div className="px-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCreateDialogOpen(true);
                                }}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create New Category
                            </Button>
                        </div>

                        {/* Categories list */}
                        <div className="max-h-[200px] overflow-y-auto">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((cat: any) => (
                                    <SelectItem 
                                        key={cat.id || cat.slug} 
                                        value={cat.slug || cat.name}
                                        className="text-slate-900 dark:text-slate-200 focus:bg-slate-100 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-white cursor-pointer"
                                    >
                                        {cat.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="px-2 py-4 text-sm text-slate-500 text-center">
                                    {searchQuery ? 'No categories found' : 'No categories'}
                                </div>
                            )}
                        </div>
                    </SelectContent>
                </Select>
            </div>

            {/* Create Category Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="bg-white dark:bg-surface-darker border-slate-200 dark:border-slate-700 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-slate-900 dark:text-slate-100">Create New Category</DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400">
                            Add a new category to organize your articles.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="create-cat-name" className="text-slate-700 dark:text-slate-300">Name *</Label>
                            <Input
                                id="create-cat-name"
                                value={newCategoryName}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="e.g., Mutual Funds"
                                className="mt-1 bg-white dark:bg-surface-dark border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            />
                        </div>
                        <div>
                            <Label htmlFor="create-cat-slug" className="text-slate-700 dark:text-slate-300">Slug *</Label>
                            <Input
                                id="create-cat-slug"
                                value={newCategorySlug}
                                onChange={(e) => setNewCategorySlug(e.target.value)}
                                placeholder="e.g., mutual-funds"
                                className="mt-1 font-mono text-sm bg-white dark:bg-surface-dark border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                URL-friendly version (auto-generated from name)
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsCreateDialogOpen(false);
                                setNewCategoryName('');
                                setNewCategorySlug('');
                            }}
                            className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleCreateCategory} className="bg-primary-600 hover:bg-indigo-700 text-white">
                            Create Category
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
















