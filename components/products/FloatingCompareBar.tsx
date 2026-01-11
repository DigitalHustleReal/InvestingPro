"use client";

import React from 'react';
import { useCompare } from '@/contexts/CompareContext';
import { Button } from '@/components/ui/Button';
import { X, ArrowRight, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function FloatingCompareBar() {
    const { selectedProducts, removeProduct, clearAll } = useCompare();

    if (selectedProducts.length === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-10 duration-500">
            <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 p-2 pl-4 flex items-center gap-6 min-h-[72px] backdrop-blur-md bg-opacity-95">
                {/* Info Section */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-primary-400" />
                        <span className="font-bold text-sm whitespace-nowrap">Compare Products</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{selectedProducts.length} of 4 items selected</span>
                </div>

                {/* Selected Products Lineup */}
                <div className="flex items-center gap-2 overflow-x-auto max-w-[400px] h-full no-scrollbar">
                    {selectedProducts.map(product => (
                        <div 
                            key={product.id} 
                            className="bg-slate-800 rounded-xl pr-1 pl-2 py-1 flex items-center gap-2 border border-slate-700 min-w-[120px]"
                        >
                            <img 
                                src={product.image_url} 
                                alt={product.name} 
                                className="w-8 h-8 object-contain bg-white rounded-md p-0.5" 
                            />
                            <span className="text-[11px] font-bold text-slate-200 line-clamp-1 flex-1">
                                {product.name}
                            </span>
                            <button 
                            onClick={() => removeProduct(product.id)}
                                className="p-1 hover:bg-slate-700 rounded-md transition-colors"
                            >
                                <X className="w-3 h-3 text-slate-400 hover:text-white" />
                            </button>
                        </div>
                    ))}
                    
                    {/* Placeholder slots */}
                    {Array.from({ length: 4 - selectedProducts.length }).map((_, i) => (
                        <div 
                            key={`slot-${i}`}
                            className="w-10 h-10 rounded-xl border border-dashed border-slate-700 flex items-center justify-center text-slate-600"
                        >
                            <span className="text-xs">+</span>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pr-2 border-l border-slate-700 pl-4 ml-2">
                    <button 
                        onClick={clearAll}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-200 uppercase tracking-tighter"
                    >
                        Clear All
                    </button>
                    <Link href="/compare">
                        <Button className="bg-primary-600 hover:bg-primary-500 text-white font-bold h-10 px-6 rounded-xl shadow-lg shadow-teal-900/20">
                            Compare Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
