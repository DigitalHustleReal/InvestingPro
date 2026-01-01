"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, FileText, TrendingUp, ArrowRight, Loader2, Clock, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResult {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    tags: string[];
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [trending, setTrending] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            fetchTrending();
        } else {
            setQuery('');
            setResults([]);
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Open with Cmd/Ctrl + K
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (!isOpen) {
                    // This assumes parent manages open state
                }
            }

            if (!isOpen) return;

            // Close with Escape
            if (e.key === 'Escape') {
                onClose();
            }

            // Navigate results
            const items = results.length > 0 ? results : trending;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                const item = items[selectedIndex];
                if (item) {
                    navigateToArticle(item.slug);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, trending, selectedIndex, onClose]);

    // Debounced search
    useEffect(() => {
        if (!query || query.length < 2) {
            setResults([]);
            return;
        }

        const timer = setTimeout(() => {
            performSearch();
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const fetchTrending = async () => {
        try {
            const response = await fetch('/api/search?type=trending&limit=5');
            const data = await response.json();
            setTrending(data.results || []);
        } catch (error) {
            console.error('Failed to fetch trending', error);
        }
    };

    const performSearch = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`);
            const data = await response.json();
            setResults(data.results || []);
            setSelectedIndex(0);
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToArticle = (slug: string) => {
        router.push(`/articles/${slug}`);
        onClose();
    };

    if (!isOpen) return null;

    const displayItems = results.length > 0 ? results : trending;
    const showTrending = results.length === 0 && query.length < 2;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Palette */}
            <div className="fixed left-1/2 top-[15%] -translate-x-1/2 w-full max-w-2xl z-50 animate-in slide-in-from-top-4 fade-in duration-300">
                <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
                    {/* Search Input */}
                    <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5">
                        <Search className="w-5 h-5 text-slate-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search articles, guides, topics..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 bg-transparent text-white text-lg placeholder-slate-500 focus:outline-none"
                        />
                        {isLoading && <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />}
                        <button 
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Results */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {showTrending && trending.length > 0 && (
                            <div className="px-4 py-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">
                                    <TrendingUp className="w-3 h-3" />
                                    Trending
                                </div>
                            </div>
                        )}

                        {displayItems.length > 0 ? (
                            <div className="px-2 pb-2">
                                {displayItems.map((item, index) => (
                                    <button
                                        key={item.id}
                                        onClick={() => navigateToArticle(item.slug)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={cn(
                                            "w-full text-left px-4 py-3 rounded-xl flex items-start gap-4 transition-colors",
                                            selectedIndex === index 
                                                ? "bg-indigo-500/20 text-white" 
                                                : "text-slate-300 hover:bg-white/5"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                                            selectedIndex === index 
                                                ? "bg-indigo-500/30" 
                                                : "bg-white/5"
                                        )}>
                                            <FileText className={cn(
                                                "w-5 h-5",
                                                selectedIndex === index ? "text-indigo-400" : "text-slate-500"
                                            )} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold line-clamp-1">{item.title}</div>
                                            <div className="text-xs text-slate-500 line-clamp-1 mt-1">
                                                {item.excerpt}
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 capitalize">
                                                    {item.category?.replace(/-/g, ' ')}
                                                </span>
                                            </div>
                                        </div>
                                        <ArrowRight className={cn(
                                            "w-4 h-4 flex-shrink-0 mt-3 transition-transform",
                                            selectedIndex === index ? "text-indigo-400 translate-x-1" : "text-slate-600"
                                        )} />
                                    </button>
                                ))}
                            </div>
                        ) : query.length >= 2 && !isLoading ? (
                            <div className="py-12 text-center text-slate-500">
                                <Search className="w-8 h-8 mx-auto mb-3 text-slate-600" />
                                <p className="text-sm font-medium">No results found for "{query}"</p>
                                <p className="text-xs mt-1">Try different keywords</p>
                            </div>
                        ) : null}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↑</kbd>
                                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↓</kbd>
                                to navigate
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↵</kbd>
                                to open
                            </span>
                        </div>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">esc</kbd>
                            to close
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
