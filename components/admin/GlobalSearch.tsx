/**
 * Global Search Component
 * 
 * Command palette-style search (Cmd+K)
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, FileText, Package, Tag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchResult {
    id: string;
    type: 'article' | 'product' | 'category' | 'user';
    title: string;
    subtitle?: string;
    href: string;
}

export function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Open on Cmd+K or /
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === '/' && !e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== 'INPUT') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Search results (mock - should connect to real search API)
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        // TODO: Implement real search API call
        // For now, show placeholder results
        const mockResults: SearchResult[] = [
            {
                id: '1',
                type: 'article',
                title: `Article matching "${query}"`,
                subtitle: 'Article',
                href: `/admin/articles/1/edit`,
            },
        ];

        setResults(mockResults);
        setSelectedIndex(0);
    }, [query]);

    // Handle navigation
    const handleSelect = (result: SearchResult) => {
        router.push(result.href);
        setIsOpen(false);
        setQuery('');
    };

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
            }
            if (e.key === 'Enter' && results[selectedIndex]) {
                e.preventDefault();
                handleSelect(results[selectedIndex]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex]);

    const getIcon = (type: SearchResult['type']) => {
        switch (type) {
            case 'article':
                return FileText;
            case 'product':
                return Package;
            case 'category':
                return Tag;
            case 'user':
                return User;
            default:
                return Search;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden">
                <div className="p-4 border-b border-white/10">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                            ref={inputRef}
                            type="text"
                            placeholder="Search articles, products, categories..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-10 bg-slate-900 border-white/10 text-white placeholder:text-slate-500"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 bg-white/5 border border-white/10 rounded-md">
                                Esc
                            </kbd>
                        </div>
                    </div>
                </div>

                {results.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                        {results.map((result, index) => {
                            const Icon = getIcon(result.type);
                            return (
                                <button
                                    key={result.id}
                                    onClick={() => handleSelect(result)}
                                    className={cn(
                                        'w-full flex items-center gap-3 p-3 text-left hover:bg-white/5 transition-colors',
                                        index === selectedIndex && 'bg-primary-500/10 border-l-2 border-primary-500'
                                    )}
                                >
                                    <Icon className="w-4 h-4 text-slate-500" />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-white">{result.title}</div>
                                        {result.subtitle && (
                                            <div className="text-xs text-slate-500">{result.subtitle}</div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                ) : query ? (
                    <div className="p-8 text-center text-slate-500">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No results found for &quot;{query}&quot;</p>
                    </div>
                ) : (
                    <div className="p-8 text-center text-slate-500">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Start typing to search...</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default GlobalSearch;
