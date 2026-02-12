"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp } from "lucide-react";
import Link from "next/link";
import { NAVIGATION_CONFIG } from "@/lib/navigation/config";

interface HomeHeroProps {
    selectedCategory?: string | null;
    onCategorySelect?: (category: string | null) => void;
}

export default function HomeHero({ selectedCategory: propSelectedCategory, onCategorySelect }: HomeHeroProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [internalCategory, setInternalCategory] = useState<string | null>(null);
    
    // Use prop if provided, otherwise use internal state
    const selectedCategory = propSelectedCategory !== undefined ? propSelectedCategory : internalCategory;
    
    const handleCategorySelect = (categorySlug: string) => {
        const newCategory = selectedCategory === categorySlug ? null : categorySlug;
        if (onCategorySelect) {
            onCategorySelect(newCategory);
        } else {
            setInternalCategory(newCategory);
        }
    };
    
    // Filter out Tools category
    const categories = NAVIGATION_CONFIG.filter(cat => cat.slug !== 'tools');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to search results or category page
            if (selectedCategory) {
                window.location.href = `/${selectedCategory}?search=${encodeURIComponent(searchQuery)}`;
            } else {
                window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
            }
        }
    };

    return (
        <section className="relative bg-gradient-to-br from-primary-600 via-success-600 to-primary-700 text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                {/* Main Hero Content */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        Find your perfect financial product in minutes
                    </h1>
                    <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
                        Compare credit cards, loans, investments, insurance, and banking products from top Indian providers. Make informed decisions with unbiased data.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-3xl mx-auto mb-8">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-700 dark:text-primary-500" />
                        <Input
                            type="text"
                            placeholder="Search products, calculators, guides..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-16 pl-14 pr-4 bg-white text-slate-900 placeholder:text-slate-600 focus:ring-2 focus:ring-primary-500 rounded-xl text-lg shadow-xl"
                        />
                        <Button
                            type="submit"
                            size="lg"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-8 bg-primary-700 hover:bg-primary-800 text-white font-semibold rounded-lg"
                        >
                            Search
                        </Button>
                    </form>
                </div>

                {/* Category Tabs */}
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                        <span className="text-sm font-semibold text-white/80 px-2">Browse by category:</span>
                        {categories.map((category) => (
                            <button
                                key={category.slug}
                                onClick={() => handleCategorySelect(category.slug)}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                                    selectedCategory === category.slug
                                        ? 'bg-white text-primary-700 shadow-lg'
                                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-center">
                    <div>
                        <div className="text-3xl font-bold mb-1">10,000+</div>
                        <div className="text-sm text-white/80">Products Compared</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold mb-1">5,000+</div>
                        <div className="text-sm text-white/80">Active Users</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold mb-1">100%</div>
                        <div className="text-sm text-white/80">Unbiased Data</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

