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
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Search, User, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AuthorSelectProps {
    value?: string;
    onValueChange: (authorId: string, authorName: string) => void;
    roleFilter?: 'author' | 'editor' | 'all';
    placeholder?: string;
    className?: string;
}

export default function AuthorSelect({
    value,
    onValueChange,
    roleFilter = 'all',
    placeholder = "Select team member...",
    className = "",
}: AuthorSelectProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const supabase = createClient();

    // Fetch authors/editors
    const { data: authors = [], isLoading } = useQuery({
        queryKey: ['authors-for-select', roleFilter],
        queryFn: async () => {
            // Select all columns to avoid 400 errors for missing columns (slug, role vs editor_type)
            const query = supabase
                .from('authors')
                .select('*')
                .eq('is_active', true);
            
            // Client-side filtering is safer if we are unsure of the 'role' column name (e.g. editor_type)
            // if (roleFilter !== 'all') {
            //    query = query.eq('role', roleFilter);
            // }

            const { data, error } = await query.order('name', { ascending: true });
            
            if (error) {
                console.error('Error fetching authors:', error);
                return [];
            }
            
            // Map/Normalize data
            return (data || []).map((author: any) => ({
                ...author,
                // Polyfill 'role' from 'editor_type' if needed
                role: author.role || author.editor_type || 'author',
                // Ensure array for credentials
                credentials: Array.isArray(author.credentials) ? author.credentials : []
            })).filter((author: any) => {
                // Client-side role filtering
                if (roleFilter === 'all') return true;
                return author.role === roleFilter || author.editor_type === roleFilter;
            });
        }
    });

    // Filter authors based on search
    const filteredAuthors = authors.filter((author: any) =>
        author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedAuthor = authors.find((a: any) => a.id === value);

    const handleSelect = (id: string) => {
        const author = authors.find((a: any) => a.id === id);
        if (author) {
            onValueChange(author.id, author.name);
        }
    };

    return (
        <div className={cn("space-y-1", className)}>
            <Select value={value} onValueChange={handleSelect}>
                <SelectTrigger className="w-full bg-white dark:bg-surface-darker border-wt-border hover:border-wt-gold/50 transition-colors h-12">
                    <SelectValue placeholder={placeholder}>
                        {selectedAuthor && (
                            <div className="flex items-center gap-2 text-left">
                                <Avatar className="h-6 w-6 border border-wt-border">
                                    <AvatarImage src={selectedAuthor.photo_url || ""} alt={selectedAuthor.name} />
                                    <AvatarFallback className="bg-primary-500/10 text-[10px] text-primary-600">
                                        {selectedAuthor.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium line-clamp-1">{selectedAuthor.name}</span>
                                </div>
                            </div>
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-surface-darker border-wt-border max-h-[400px] w-[300px]">
                    {/* Search Field */}
                    <div className="flex items-center px-3 py-2 border-b border-wt-border sticky top-0 bg-white dark:bg-surface-darker z-10">
                        <Search className="w-4 h-4 mr-2 text-muted-foreground/50" />
                        <Input
                            placeholder="Search experts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-8 border-none focus-visible:ring-0 px-0 bg-transparent"
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                    </div>

                    <div className="py-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="px-4 py-8 text-center text-xs text-muted-foreground animate-pulse">
                                Loading editorial team...
                            </div>
                        ) : filteredAuthors.length > 0 ? (
                            filteredAuthors.map((author: any) => (
                                <SelectItem 
                                    key={author.id} 
                                    value={author.id}
                                    className="focus:bg-primary-500/5 dark:focus:bg-primary-500/10 cursor-pointer py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border border-wt-border shadow-sm">
                                            <AvatarImage src={author.photo_url || ""} />
                                            <AvatarFallback className="bg-primary-500/10 text-primary-600 font-bold">
                                                {author.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-bold text-slate-900 dark:text-white truncate">{author.name}</span>
                                                {author.is_ai_persona && (
                                                    <Badge variant="outline" className="text-[10px] py-0 h-4 bg-primary-500/5 border-primary-500/20 text-primary-600">AI</Badge>
                                                )}
                                                {author.role === 'editor' && (
                                                    <ShieldCheck className="w-3 h-3 text-secondary-500" />
                                                )}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
                                                {author.title || (author.role === 'editor' ? 'Senior Editor' : 'Contributor')}
                                            </span>
                                            {author.credentials && author.credentials.length > 0 && (
                                                <span className="text-[9px] text-primary-600/70 font-medium truncate mt-0.5">
                                                    {author.credentials[0]}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </SelectItem>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center">
                                <User className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                                <p className="text-xs text-muted-foreground">No matching experts found</p>
                            </div>
                        )}
                    </div>
                </SelectContent>
            </Select>
        </div>
    );
}
