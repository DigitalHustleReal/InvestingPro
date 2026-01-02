"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { ArrowRight, TrendingUp } from "lucide-react";
import { NAVIGATION_CONFIG } from "@/lib/navigation/config";

interface HomeContextualProductsProps {
    selectedCategory?: string | null;
}

export default function HomeContextualProducts({ selectedCategory }: HomeContextualProductsProps) {
    // If no category selected, show all categories overview
    if (!selectedCategory) {
        return (
            <section className="bg-slate-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                            Explore Financial Products
                        </h2>
                        <p className="text-xl text-slate-600">
                            Compare top picks side-by-side across all categories
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {NAVIGATION_CONFIG.filter(cat => cat.slug !== 'tools').map((category) => {
                            const bestIntent = category.intents.find(intent => intent.slug === 'best');
                            const topCollections = bestIntent?.collections.slice(0, 3) || [];

                            return (
                                <Card key={category.slug} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <TrendingUp className="w-5 h-5 text-teal-600" />
                                            <h3 className="text-lg font-bold text-slate-900">{category.name}</h3>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-4">{category.description}</p>
                                        <div className="space-y-2 mb-4">
                                            {topCollections.map((collection) => (
                                                <Link
                                                    key={collection.href}
                                                    href={collection.href}
                                                    className="block text-sm text-teal-600 hover:text-teal-700 font-medium"
                                                >
                                                    {collection.name} →
                                                </Link>
                                            ))}
                                        </div>
                                        <Link href={`/${category.slug}`}>
                                            <Button variant="outline" className="w-full">
                                                View All {category.name}
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }

    // If category selected, show products for that category
    const category = NAVIGATION_CONFIG.find(cat => cat.slug === selectedCategory);
    if (!category) return null;

    const bestIntent = category.intents.find(intent => intent.slug === 'best');
    const collections = bestIntent?.collections || [];

    if (collections.length === 0) return null;

    const displayCollections = collections.slice(0, 8);

    return (
        <section className="bg-slate-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="border-0 shadow-xl bg-white">
                    <CardContent className="p-8 lg:p-6 md:p-8">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                                Want to view more options?
                            </h2>
                            <p className="text-xl text-slate-600 mb-2">
                                Easily compare top picks side-by-side
                            </p>
                            <p className="text-lg text-slate-500">
                                What product or service are you looking for?
                            </p>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {displayCollections.map((collection) => (
                                <Link
                                    key={collection.href}
                                    href={collection.href}
                                    className="group"
                                >
                                    <div className="h-full p-6 bg-slate-50 hover:bg-teal-50 border-2 border-slate-200 hover:border-teal-500 rounded-xl transition-all duration-200 group-hover:shadow-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <TrendingUp className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-tight">
                                            {collection.name.toUpperCase()}
                                        </h3>
                                        {collection.description && (
                                            <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                                                {collection.description}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* View All CTA */}
                        {bestIntent && (
                            <div className="text-center pt-4 border-t border-slate-200">
                                <Link href={`/${category.slug}/${bestIntent.slug}`}>
                                    <Button 
                                        variant="outline"
                                        className="bg-white hover:bg-teal-50 border-slate-300 hover:border-teal-500 text-slate-700 hover:text-teal-700 font-semibold px-8 py-6 text-base rounded-xl"
                                    >
                                        View All {category.name} Options
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

