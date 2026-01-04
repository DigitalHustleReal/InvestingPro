"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, FileText, TrendingUp, ArrowRight, Loader2, Clock, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResult {
    id: string;
    type: 'article' | 'product' | 'tool';
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    url: string;
    image_url?: string;
    featured_image?: string;
    provider?: string;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

const SUGGESTIONS = [
    { label: 'Credit Cards', query: 'credit card' },
    { label: 'Mutual Funds', query: 'mutual fund' },
    { label: 'SIP Calculator', query: 'sip' },
    { label: 'Market Outlook', query: 'market outlook' }
];

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
            setTimeout(() => inputRef.current?.focus(), 100);
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
            if (!isOpen) return;

            if (e.key === 'Escape') {
                onClose();
            }

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
                    navigateToResult(item.url);
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
            const response = await fetch('/api/search?type=trending&limit=4');
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

    const navigateToResult = (url: string) => {
        router.push(url);
        onClose();
    };

    if (!isOpen) return null;

    const displayItems = results.length > 0 ? results : trending;
    const showSuggestions = results.length === 0 && query.length < 2 && trending.length === 0;

    const getIcon = (item: SearchResult) => {
        if (item.type === 'product') return <TrendingUp className="w-5 h-5 text-emerald-400" />;
        if (item.type === 'tool') return <Loader2 className="w-5 h-5 text-amber-400" />;
        return <FileText className="w-5 h-5 text-indigo-400" />;
    };

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Palette */}
            <div className="fixed left-1/2 top-[12%] -translate-x-1/2 w-[95%] max-w-2xl z-[101] animate-in zoom-in-95 slide-in-from-top-8 fade-in duration-300">
                <div className="bg-slate-900/90 border border-white/10 rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl overflow-hidden ring-1 ring-white/5">
                    
                    {/* Search Input */}
                    <div className="relative flex items-center gap-4 px-6 py-5 border-b border-white/10 group">
                        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        
                        <Search className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search products, articles, or tools..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 bg-transparent text-white text-xl placeholder-slate-500 focus:outline-none font-light"
                        />
                        
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                        ) : (
                            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-500">
                                <span>ESC</span>
                            </div>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                        {/* Suggestions Header */}
                        {!query && trending.length > 0 && (
                            <div className="px-6 pt-4 pb-2">
                                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Trending Now</h3>
                            </div>
                        )}

                        {query.length < 2 && results.length === 0 && (
                            <div className="px-4 pb-4">
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {SUGGESTIONS.map((s) => (
                                        <button
                                            key={s.label}
                                            onClick={() => setQuery(s.query)}
                                            className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 text-left transition-all group/s"
                                        >
                                            <div className="text-xs font-semibold text-slate-300 group-hover/s:text-white transition-colors">{s.label}</div>
                                            <div className="text-[10px] text-slate-500 mt-0.5">Quick Search</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {displayItems.length > 0 ? (
                            <div className="px-2 pb-2">
                                {displayItems.map((item, index) => (
                                    <button
                                        key={item.id}
                                        onClick={() => navigateToResult(item.url)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={cn(
                                            "w-full text-left px-4 py-3 rounded-xl flex items-start gap-4 transition-all duration-200 group/item",
                                            selectedIndex === index 
                                                ? "bg-indigo-500/10 ring-1 ring-indigo-500/20" 
                                                : "hover:bg-white/5"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300",
                                            selectedIndex === index ? "bg-indigo-500/20 scale-110" : "bg-white/5",
                                            item.type === 'product' && selectedIndex === index && "bg-emerald-500/20",
                                            item.type === 'tool' && selectedIndex === index && "bg-amber-500/20"
                                        )}>
                                            {item.image_url || item.featured_image ? (
                                                <img 
                                                    src={item.image_url || item.featured_image} 
                                                    alt="" 
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                            ) : getIcon(item)}
                                        </div>

                                        <div className="flex-1 min-w-0 py-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-100 group-hover/item:text-white transition-colors">
                                                    {item.title}
                                                </span>
                                                <span className={cn(
                                                    "text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold",
                                                    item.type === 'product' ? "bg-emerald-500/10 text-emerald-400" :
                                                    item.type === 'tool' ? "bg-amber-500/10 text-amber-400" :
                                                    "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                                )}>
                                                    {item.type}
                                                </span>
                                            </div>
                                            
                                            {item.provider && (
                                                <div className="text-[10px] text-indigo-400/80 font-medium mt-0.5">{item.provider}</div>
                                            )}

                                            <div className="text-xs text-slate-500 line-clamp-1 mt-1 font-light leading-relaxed">
                                                {item.excerpt}
                                            </div>
                                        </div>

                                        <div className={cn(
                                            "w-8 h-8 rounded-full border border-white/5 flex items-center justify-center transition-all duration-300 opacity-0 group-hover/item:opacity-100",
                                            selectedIndex === index && "translate-x-0 opacity-100 bg-indigo-500/20 border-indigo-500/30"
                                        )}>
                                            <ArrowRight className={cn(
                                                "w-4 h-4",
                                                selectedIndex === index ? "text-indigo-400" : "text-slate-600"
                                            )} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : query.length >= 2 && !isLoading ? (
                            <div className="py-20 text-center animate-in fade-in zoom-in-95 duration-500">
                                <Search className="w-12 h-12 mx-auto mb-4 text-slate-700 stroke-[1]" />
                                <p className="text-lg font-light text-slate-300">Nothing found for "{query}"</p>
                                <p className="text-sm text-slate-500 mt-2">Try searching for 'hdfc', 'sip', or 'mutual funds'</p>
                            </div>
                        ) : null}
                    </div>

                    {/* Footer Nav Hints */}
                    <div className="px-6 py-4 bg-black/20 border-t border-white/5 backdrop-blur-md flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                <kbd className="flex items-center justify-center w-5 h-5 rounded border border-white/10 bg-white/5 text-slate-400">↑↓</kbd>
                                <span>Navigate</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                <kbd className="flex items-center justify-center w-8 h-5 rounded border border-white/10 bg-white/5 text-slate-400">↵</kbd>
                                <span>Select</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-[10px] text-slate-300 font-medium px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
                            <Clock className="w-3 h-3" />
                            <span>Quick Access</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
