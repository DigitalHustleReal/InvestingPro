"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, TrendingUp } from "lucide-react";
import { NAVIGATION_CONFIG } from "@/lib/navigation/config";

interface ContextualProductsProps {
    categorySlug: string;
}

export default function ContextualProducts({ categorySlug }: ContextualProductsProps) {
    // Find the category in navigation config
    const category = NAVIGATION_CONFIG.find(cat => cat.slug === categorySlug);
    
    if (!category) return null;

    // Get "Best" intent collections for this category
    const bestIntent = category.intents.find(intent => intent.slug === 'best');
    const collections = bestIntent?.collections || [];

    // If no collections, show generic options
    if (collections.length === 0) {
        return null;
    }

    // Limit to 8 products for grid layout
    const displayCollections = collections.slice(0, 8);

    return (
        <div className="bg-slate-50 py-16">
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
                            {displayCollections.map((collection, index) => (
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
                                <Link href={`/${categorySlug}/${bestIntent.slug}`}>
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
        </div>
    );
}

