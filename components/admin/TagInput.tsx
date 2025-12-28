"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { createClient } from '@/lib/supabase/client';

interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    className?: string;
}

/**
 * TagInput - Autocomplete tag input component
 * 
 * Features:
 * - Autocomplete from existing tags
 * - Tag chips with remove
 * - Inline tag creation
 * - Keyboard navigation
 */
export default function TagInput({
    value = [],
    onChange,
    placeholder = "Type to add tags...",
    className = "",
}: TagInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Fetch existing tags
    const { data: existingTags = [] } = useQuery({
        queryKey: ['tags-for-autocomplete'],
        queryFn: async () => {
            try {
                // Try to fetch from tags table
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('tags')
                    .select('name, slug')
                    .order('name', { ascending: true });
                
                if (!error && data && Array.isArray(data)) {
                    return data.map((tag: any) => tag.name);
                }

                // Fallback: Extract from articles
                const articles = await api.entities.Article.list('-created_date', 1000);
                const tagSet = new Set<string>();
                
                articles.forEach((article: any) => {
                    if (article.tags && Array.isArray(article.tags)) {
                        article.tags.forEach((tagName: string) => {
                            if (tagName && tagName.trim()) {
                                tagSet.add(tagName.trim());
                            }
                        });
                    }
                });

                return Array.from(tagSet).sort();
            } catch (error) {
                console.error('Error fetching tags:', error);
                return [];
            }
        },
        initialData: [],
    });

    // Filter suggestions based on input
    const filteredSuggestions = existingTags.filter(
        (tag: string) =>
            tag.toLowerCase().includes(inputValue.toLowerCase()) &&
            !value.includes(tag) &&
            inputValue.length > 0
    );

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setShowSuggestions(newValue.length > 0);
        setFocusedIndex(-1);
    };

    // Add tag
    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !value.includes(trimmedTag)) {
            onChange([...value, trimmedTag]);
            setInputValue('');
            setShowSuggestions(false);
            setFocusedIndex(-1);
        }
    };

    // Remove tag
    const removeTag = (tagToRemove: string) => {
        onChange(value.filter(tag => tag !== tagToRemove));
    };

    // Handle key down
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
            // Remove last tag on backspace when input is empty
            removeTag(value[value.length - 1]);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusedIndex(prev => 
                prev < filteredSuggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setFocusedIndex(-1);
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (tag: string) => {
        addTag(tag);
        inputRef.current?.focus();
    };

    // Handle create new tag
    const handleCreateNew = () => {
        if (inputValue.trim()) {
            addTag(inputValue);
        }
    };

    // Click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`}>
            {/* Input with tags */}
            <div className="flex flex-wrap gap-2 p-2 border border-slate-300 rounded-lg bg-white focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-200">
                {/* Existing tags */}
                {value.map((tag, idx) => (
                    <Badge
                        key={idx}
                        variant="outline"
                        className="bg-teal-50 text-teal-700 border-teal-200 px-2 py-1 text-sm flex items-center gap-1"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-teal-900 focus:outline-none"
                            aria-label={`Remove ${tag}`}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </Badge>
                ))}

                {/* Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(inputValue.length > 0)}
                    placeholder={value.length === 0 ? placeholder : ''}
                    className="flex-1 min-w-[120px] border-0 outline-none bg-transparent text-sm"
                />
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && (filteredSuggestions.length > 0 || inputValue.trim()) && (
                <div
                    ref={suggestionsRef}
                    className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                    {/* Existing suggestions */}
                    {filteredSuggestions.map((tag: string, idx: number) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => handleSuggestionClick(tag)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 focus:bg-slate-100 focus:outline-none ${
                                idx === focusedIndex ? 'bg-slate-100' : ''
                            }`}
                        >
                            {tag}
                        </button>
                    ))}

                    {/* Create new tag option */}
                    {inputValue.trim() && !value.includes(inputValue.trim()) && (
                        <button
                            type="button"
                            onClick={handleCreateNew}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-teal-50 focus:bg-teal-50 focus:outline-none border-t border-slate-200 flex items-center gap-2 ${
                                focusedIndex === filteredSuggestions.length ? 'bg-teal-50' : ''
                            }`}
                        >
                            <Plus className="w-4 h-4 text-teal-600" />
                            <span className="text-teal-700 font-medium">
                                Create "{inputValue.trim()}"
                            </span>
                        </button>
                    )}
                </div>
            )}

            {/* Helper text */}
            <p className="text-xs text-slate-500 mt-1">
                Press Enter to add tag, Backspace to remove
            </p>
        </div>
    );
}










