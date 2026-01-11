"use client";

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, TrendingUp, Shield, Landmark, CreditCard, PieChart, Zap, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import SEOHead from "@/components/common/SEOHead";
import Link from 'next/link';
import { api } from '@/lib/api';

interface GlossaryTerm {
    term: string;
    category: string;
    definition: string;
    slug?: string;
}

const CATEGORY_CONFIG: Record<string, { icon: any, color: string }> = {
    'Investing': { icon: TrendingUp, color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
    'Mutual Funds': { icon: PieChart, color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' },
    'Insurance': { icon: Shield, color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20' },
    'Loans': { icon: Landmark, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
    'Credit Cards': { icon: CreditCard, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
    'Economy': { icon: Zap, color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
    'Banking': { icon: Landmark, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20' },
    'Taxation': { icon: BookOpen, color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' }
};

export default function GlossaryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [terms, setTerms] = useState<GlossaryTerm[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTerms = async () => {
             setLoading(true);
             try {
                const data = await api.entities.Glossary.list();
                if (data && data.length > 0) {
                    setTerms(data);
                }
             } catch (error) {
                 console.error("Failed to fetch glossary terms", error);
             } finally {
                 setLoading(false);
             }
        };
        fetchTerms();
    }, []);

    const filteredTerms = terms.filter(item => {
        const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.definition.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    }).sort((a,b) => a.term.localeCompare(b.term));

    const categories = ["All", ...Array.from(new Set(terms.map(t => t.category)))].sort();

    // Group terms alphabetically
    const groupedTerms = filteredTerms.reduce((acc, term) => {
        const firstLetter = term.term[0].toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(term);
        return acc;
    }, {} as Record<string, GlossaryTerm[]>);

    const alphabet = Object.keys(groupedTerms).sort();

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
             <SEOHead
                title="Financial Knowledge Hub | InvestingPro"
                description="Master financial concepts with our comprehensive, expert-verified glossary. From Mutual Funds to Taxation, we decode it all."
            />

            {/* Compact Header */}
            <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-24 pb-8">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <Badge className="mb-4 bg-primary-50 text-primary-700 border-primary-100 uppercase tracking-wider px-3 py-1 text-xs">
                            Financial Encyclopedia
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                            Financial Glossary
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                            {filteredTerms.length} terms to help you understand the financial world
                        </p>

                        {/* Search Bar */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400" />
                            </div>
                            <Input
                                placeholder="Search terms..."
                                className="w-full h-12 pl-12 pr-4 rounded-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                 </div>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
                    {/* Sidebar - Category Filter */}
                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                                Categories
                            </h3>
                            <nav className="space-y-1">
                                {categories.map(cat => {
                                    const count = cat === "All" 
                                        ? terms.length 
                                        : terms.filter(t => t.category === cat).length;
                                    
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group ${
                                                activeCategory === cat
                                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                {cat !== "All" && (() => {
                                                    const Icon = CATEGORY_CONFIG[cat]?.icon || BookOpen;
                                                    return <Icon className="w-4 h-4" />;
                                                })()}
                                                {cat}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                activeCategory === cat
                                                ? 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300'
                                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                            }`}>
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Alphabet Jump Links */}
                        {alphabet.length > 0 && (
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 mt-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                                    Quick Jump
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {alphabet.map(letter => (
                                        <a
                                            key={letter}
                                            href={`#letter-${letter}`}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-200 dark:hover:border-primary-800 transition-colors"
                                        >
                                            {letter}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>

                    {/* Main Content - Alphabetical List */}
                    <div>
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="text-center">
                                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-slate-500 text-sm">Loading glossary...</p>
                                </div>
                            </div>
                        ) : filteredTerms.length > 0 ? (
                            <div className="space-y-12">
                                {alphabet.map(letter => (
                                    <div key={letter} id={`letter-${letter}`} className="scroll-mt-24">
                                        {/* Letter Header */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-2xl font-bold">
                                                {letter}
                                            </div>
                                            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                                        </div>

                                        {/* Terms List - Three Column Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                            {groupedTerms[letter].map((term) => {
                                                const termSlug = term.slug || term.term.toLowerCase()
                                                    .replace(/[()]/g, '')
                                                    .replace(/\s+/g, '-')
                                                    .replace(/&/g, 'and');
                                                
                                                return (
                                                    <Link 
                                                        key={term.term} 
                                                        href={`/glossary/${termSlug}`}
                                                        className="block group"
                                                    >
                                                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-md transition-all">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                                            {term.term}
                                                                        </h3>
                                                                        <Badge className={`text-xs px-2 py-0.5 ${CATEGORY_CONFIG[term.category]?.color || 'bg-slate-100 text-slate-600'}`}>
                                                                            {term.category}
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                                                        {term.definition}
                                                                    </p>
                                                                </div>
                                                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 flex-shrink-0 transition-colors" />
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No terms found</h3>
                                <p className="text-slate-500">Try adjusting your search or category filter</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
