"use client";

import React, { useMemo, useState } from 'react';
import { useCompare } from '@/components/products/CompareContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Star, Check, X, ChevronLeft, Plus, TrendingUp, TrendingDown, Award, Minus, Info } from 'lucide-react';
import Link from 'next/link';
import EmptyState from '@/components/common/EmptyState';
import ComparisonPDFButton from '@/components/products/ComparisonPDFButton';
import { getFeatureExplanation, getComparisonDirection } from '@/lib/products/feature-explanations';

// Helper to determine if a value is better (higher or lower depending on context)
function compareValues(key: string, values: (string | number | undefined)[]): ('best' | 'worst' | 'neutral')[] {
    const direction = getComparisonDirection(key);
    
    const numericValues = values.map(v => {
        if (v === undefined || v === null || v === '-') return null;
        const num = typeof v === 'number' ? v : parseFloat(String(v).replace(/[^\d.-]/g, ''));
        return isNaN(num) ? null : num;
    });

    // If not all numeric, can't compare
    if (numericValues.every(v => v === null)) {
        return values.map(() => 'neutral');
    }

    const validValues = numericValues.filter(v => v !== null) as number[];
    if (validValues.length === 0) return values.map(() => 'neutral');

    const max = Math.max(...validValues);
    const min = Math.min(...validValues);

    return numericValues.map(v => {
        if (v === null) return 'neutral';
        if (direction === 'lower') {
            if (v === min) return 'best';
            if (v === max) return 'worst';
        } else if (direction === 'higher') {
            if (v === max) return 'best';
            if (v === min) return 'worst';
        }
        return 'neutral';
    });
}

export default function ComparePage() {
    const { selectedProducts, removeFromCompare } = useCompare();

    // Calculate best product based on trust_score
    const recommendedProduct = useMemo(() => {
        if (selectedProducts.length === 0) return null;
        return selectedProducts.reduce((best, current) => 
            (current.trust_score || 0) > (best.trust_score || 0) ? current : best
        );
    }, [selectedProducts]);

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

                {/* Smart Recommendation Widget */}
                {recommendedProduct && selectedProducts.length > 1 && (
                    <div className="mb-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                                <Award className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1">Our Recommendation</h3>
                                <p className="text-teal-50 text-sm mb-3">
                                    Based on trust score and overall features, we recommend:
                                </p>
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                            src={recommendedProduct.image_url} 
                                            alt={recommendedProduct.name}
                                            className="h-10 object-contain bg-white rounded-lg p-1"
                                        />
                                        <div>
                                            <div className="font-bold">{recommendedProduct.name}</div>
                                            <div className="text-xs text-teal-100">Trust Score: {recommendedProduct.trust_score}/100</div>
                                        </div>
                                    </div>
                                    <Link href={recommendedProduct.affiliate_link || '#'} target="_blank" rel="noopener noreferrer">
                                        <Button size="sm" className="bg-white text-teal-600 hover:bg-teal-50 font-bold">
                                            Apply Now
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto pb-6" id="comparison-table">
                    <div className="min-w-[800px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        {/* Header Row (Product Cards) */}
                        <div className="grid grid-cols-[200px_repeat(4,1fr)] bg-slate-50/50 border-b border-slate-200">
                            <div className="p-6 flex flex-col justify-end font-semibold text-slate-500">
                                Product Details
                            </div>
                            {selectedProducts.map(p => (
                                <div key={p.id} className="p-6 relative border-l border-slate-100 flex flex-col items-center text-center">
                                    {/* Best Badge */}
                                    {p.id === recommendedProduct?.id && (
                                        <div className="absolute top-2 left-2">
                                            <Badge className="bg-teal-500 text-white border-0 text-[10px] font-bold">
                                                <Award className="w-3 h-3 mr-1" />
                                                BEST
                                            </Badge>
                                        </div>
                                    )}
                                    <button 
                                        onClick={() => removeFromCompare(p.id)}
                                        className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={p.image_url} alt={p.name} className="h-24 object-contain mb-4" />
                                    <h3 className="font-bold text-slate-900 mb-1">{p.name}</h3>
                                    <Badge variant="secondary" className="mb-2 text-[10px]">{p.provider_name}</Badge>
                                    <div className="flex items-center text-amber-500 text-sm font-bold gap-1 mb-4">
                                        <Star className="w-4 h-4 fill-current" /> {p.rating}
                                    </div>
                                    <Link href={p.affiliate_link || '#'} target="_blank" rel="noopener noreferrer" className="w-full">
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

                        {/* Feature Rows with Highlighting */}
                        <div className="divide-y divide-slate-100">
                            {featureKeys.map(key => {
                                const values = selectedProducts.map(p => p.features[key]);
                                const comparisons = compareValues(key, values);
                                const explanation = getFeatureExplanation(key);
                                
                                return (
                                    <div key={key} className="grid grid-cols-[200px_repeat(4,1fr)] hover:bg-slate-50/50 transition-colors group/row">
                                        <div className="p-4 px-6 text-sm font-medium text-slate-500 capitalize flex items-center gap-2">
                                            <span>{key.replace(/_/g, ' ')}</span>
                                            {explanation && (
                                                <div className="relative group/tooltip">
                                                    <Info className="w-3.5 h-3.5 text-slate-400 hover:text-teal-600 cursor-help" />
                                                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block z-50 w-72 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl">
                                                        <div className="font-bold mb-1">{explanation.title}</div>
                                                        <div className="text-slate-300 leading-relaxed">{explanation.description}</div>
                                                        <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {selectedProducts.map((p, idx) => {
                                            const comparison = comparisons[idx];
                                            const value = p.features[key] || '-';
                                            
                                            return (
                                                <div 
                                                    key={p.id} 
                                                    className={`p-4 px-6 border-l border-slate-100 text-sm font-medium text-center flex items-center justify-center gap-2 ${
                                                        comparison === 'best' ? 'bg-emerald-50 text-emerald-700' :
                                                        comparison === 'worst' ? 'bg-rose-50 text-rose-700' :
                                                        'text-slate-900'
                                                    }`}
                                                >
                                                    {comparison === 'best' && <TrendingUp className="w-4 h-4 text-emerald-600" />}
                                                    {comparison === 'worst' && <TrendingDown className="w-4 h-4 text-rose-600" />}
                                                    {comparison === 'neutral' && value !== '-' && <Minus className="w-4 h-4 text-slate-300" />}
                                                    <span>{value}</span>
                                                </div>
                                            );
                                        })}
                                        {Array.from({ length: 4 - selectedProducts.length }).map((_, i) => (
                                            <div key={i} className="border-l border-slate-100" />
                                        ))}
                                    </div>
                                );
                            })}

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
