"use client";

import React from 'react';
import { useCompare } from '@/components/products/CompareContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Star, Check, X, ChevronLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import EmptyState from '@/components/common/EmptyState';
import ComparisonPDFButton from '@/components/products/ComparisonPDFButton';

export default function ComparePage() {
    const { selectedProducts, removeFromCompare } = useCompare();

    if (selectedProducts.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 pt-20 px-4">
                <div className="max-w-2xl mx-auto">
                    <Link href="/products" className="text-teal-600 hover:underline mb-8 inline-flex items-center">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Products
                    </Link>
                    <EmptyState 
                        title="No Products Selected" 
                        description="Browse products and click 'Compare' to see them side-by-side." 
                    />
                    <div className="mt-6 text-center">
                        <Link href="/products">
                            <Button>Browse Products</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Dynamic Feature Keys
    const featureKeys = Array.from(new Set(selectedProducts.flatMap(p => Object.keys(p.features))));

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Compare Products</h1>
                        <p className="text-slate-600">Analyzing {selectedProducts.length} items side-by-side.</p>
                    </div>
                    <ComparisonPDFButton 
                        targetId="comparison-table" 
                        productNames={selectedProducts.map(p => p.name)} 
                    />
                </div>

                <div className="overflow-x-auto pb-6" id="comparison-table">
                    <div className="min-w-[800px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        {/* Header Row (Product Cards) */}
                        <div className="grid grid-cols-[200px_repeat(4,1fr)] bg-slate-50/50 border-b border-slate-200">
                            <div className="p-6 flex flex-col justify-end font-semibold text-slate-500">
                                Product Details
                            </div>
                            {selectedProducts.map(p => (
                                <div key={p.id} className="p-6 relative border-l border-slate-100 flex flex-col items-center text-center">
                                    <button 
                                        onClick={() => removeFromCompare(p.id)}
                                        className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <img src={p.image_url} alt={p.name} className="h-24 object-contain mb-4" />
                                    <h3 className="font-bold text-slate-900 mb-1">{p.name}</h3>
                                    <Badge variant="secondary" className="mb-2 text-[10px]">{p.provider_name}</Badge>
                                    <div className="flex items-center text-amber-500 text-sm font-bold gap-1 mb-4">
                                        <Star className="w-4 h-4 fill-current" /> {p.rating}
                                    </div>
                                    <Link href={p.affiliate_link || '#'} className="w-full">
                                        <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700">Apply Now</Button>
                                    </Link>
                                </div>
                            ))}
                            {/* Empty Slots */}
                            {Array.from({ length: 4 - selectedProducts.length }).map((_, i) => (
                                <div key={i} className="p-6 border-l border-slate-100 flex flex-col items-center justify-center text-slate-300 bg-slate-50/30">
                                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center mb-2">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <span className="text-sm">Add Product</span>
                                </div>
                            ))}
                        </div>

                        {/* Feature Rows */}
                        <div className="divide-y divide-slate-100">
                            {featureKeys.map(key => (
                                <div key={key} className="grid grid-cols-[200px_repeat(4,1fr)] hover:bg-slate-50/50 transition-colors">
                                    <div className="p-4 px-6 text-sm font-medium text-slate-500 capitalize flex items-center">
                                        {key.replace(/_/g, ' ')}
                                    </div>
                                    {selectedProducts.map(p => (
                                        <div key={p.id} className="p-4 px-6 border-l border-slate-100 text-sm text-slate-900 font-medium text-center flex items-center justify-center">
                                            {p.features[key] || '-'}
                                        </div>
                                    ))}
                                    {Array.from({ length: 4 - selectedProducts.length }).map((_, i) => (
                                        <div key={i} className="border-l border-slate-100" />
                                    ))}
                                </div>
                            ))}

                            {/* Pros Row */}
                            <div className="grid grid-cols-[200px_repeat(4,1fr)] hover:bg-slate-50/50">
                                <div className="p-4 px-6 text-sm font-medium text-slate-500 flex items-center">
                                    Pros
                                </div>
                                {selectedProducts.map(p => (
                                    <div key={p.id} className="p-4 px-6 border-l border-slate-100 text-sm text-slate-600 text-left">
                                        <ul className="space-y-1">
                                            {p.pros.map((pro, i) => (
                                                <li key={i} className="flex items-start gap-1.5">
                                                    <Check className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                                                    <span className="leading-tight">{pro}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                                {Array.from({ length: 4 - selectedProducts.length }).map((_, i) => (
                                    <div key={i} className="border-l border-slate-100" />
                                ))}
                            </div>

                            {/* Cons Row */}
                            <div className="grid grid-cols-[200px_repeat(4,1fr)] hover:bg-slate-50/50">
                                <div className="p-4 px-6 text-sm font-medium text-slate-500 flex items-center">
                                    Cons
                                </div>
                                {selectedProducts.map(p => (
                                    <div key={p.id} className="p-4 px-6 border-l border-slate-100 text-sm text-slate-600 text-left">
                                        <ul className="space-y-1">
                                            {p.cons.map((con, i) => (
                                                <li key={i} className="flex items-start gap-1.5">
                                                    <X className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                                                    <span className="leading-tight">{con}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                                {Array.from({ length: 4 - selectedProducts.length }).map((_, i) => (
                                    <div key={i} className="border-l border-slate-100" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
