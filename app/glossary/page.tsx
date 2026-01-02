"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import SEOHead from "@/components/common/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, BookOpen } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import PageErrorBoundary from "@/components/common/PageErrorBoundary";
import EmptyState from "@/components/common/EmptyState";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function GlossaryPage() {
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch all glossary terms from Supabase
    const { data: allTerms = [], isLoading } = useQuery({
        queryKey: ['glossary-terms'],
        queryFn: () => api.entities.Glossary.list(),
        initialData: []
    });

    // Fetch categories
    const { data: categories = [] } = useQuery({
        queryKey: ['glossary-categories'],
        queryFn: () => api.entities.Glossary.getAllCategories(),
        initialData: []
    });

    // Filter terms by search query
    const filteredTerms = allTerms.filter((term: any) =>
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.full_form?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group by category
    const categorizedTerms = filteredTerms.reduce((acc: any, term: any) => {
        const category = term.category || 'general';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(term);
        return acc;
    }, {} as Record<string, any[]>);

    // Format category name for display
    const formatCategoryName = (category: string) => {
        return category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <PageErrorBoundary pageName="Glossary Index">
            <div className="min-h-screen bg-slate-50">
                <SEOHead
                    title="Financial Terms Glossary - InvestingPro"
                    description="Comprehensive glossary of financial terms and definitions for Indian investors. Understand key concepts in investing, banking, loans, and insurance."
                    structuredData={{
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "name": "Financial Terms Glossary",
                        "description": "Comprehensive glossary of financial terms and definitions",
                        "url": "https://investingpro.in/glossary"
                    }}
                />

                {/* Header */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white pt-28 pb-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 mb-4">
                            <BookOpen className="w-8 h-8 text-teal-400" />
                            <span className="text-teal-400 font-bold text-sm uppercase tracking-widest">Glossary</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Financial Terms Glossary</h1>
                        <p className="text-xl text-slate-300 max-w-3xl">
                            Clear, factual explanations of financial terms and concepts relevant to Indian investors, 
                            borrowers, and savers. All definitions are sourced from verified, official sources.
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="relative max-w-2xl mb-12">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search for a term..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 py-6 text-lg border-slate-300 focus:border-teal-500"
                        />
                    </div>

                    {isLoading ? (
                        <LoadingSpinner text="Loading glossary terms..." />
                    ) : filteredTerms.length === 0 ? (
                        <EmptyState
                            title="No terms found"
                            description={searchQuery 
                                ? `No terms found matching "${searchQuery}". Try a different search term.`
                                : "No glossary terms available yet. Terms will appear here once they are added to the database."
                            }
                        />
                    ) : (
                        <>
                            {/* Categories */}
                            <div className="space-y-12">
                                {Object.entries(categorizedTerms).map(([category, terms]) => {
                                    const termsArray = terms as any[];
                                    return (
                                        <div key={category}>
                                            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                                {formatCategoryName(category)}
                                            </h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {termsArray.map((item: any) => (
                                                <Link
                                                    key={item.id || item.slug}
                                                    href={`/glossary/${item.slug}`}
                                                    className="block p-6 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-slate-50 hover:shadow-md transition-all"
                                                >
                                                    <h3 className="font-bold text-slate-900 mb-2 text-lg">
                                                        {item.term}
                                                        {item.full_form && (
                                                            <span className="text-slate-500 text-sm ml-2">
                                                                ({item.full_form})
                                                            </span>
                                                        )}
                                                    </h3>
                                                    {item.definition && (
                                                        <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                                                            {item.definition.substring(0, 100)}...
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-teal-600 font-medium">View definition →</p>
                                                </Link>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Stats */}
                            <div className="mt-12 pt-8 border-t border-slate-200">
                                <p className="text-sm text-slate-600 text-center">
                                    {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''} found
                                    {searchQuery && ` matching "${searchQuery}"`}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </PageErrorBoundary>
    );
}




