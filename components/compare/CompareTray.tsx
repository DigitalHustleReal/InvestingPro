"use client";

import React from 'react';
import { useCompare } from '@/contexts/CompareContext';
import { Button } from "@/components/ui/Button";
import { X, ArrowRight, Layers } from "lucide-react";
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export function CompareTray() {
    const { selectedProducts, removeProduct, clearAll } = useCompare();
    
    // Don't render if no products selected
    // We use AnimatePresence in parent usually, or handled here via conditional rendering with exit animation
    if (selectedProducts.length === 0) return null;

    return (
        <AnimatePresence>
            {selectedProducts.length > 0 && (
                <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none"
                >
                    <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-6 pointer-events-auto max-w-2xl w-full border border-white/10 backdrop-blur-md">
                        
                        {/* Count Indicator */}
                         <div className="flex items-center gap-3">
                            <div className="bg-primary-500 text-slate-900 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-primary-500/20">
                                {selectedProducts.length}
                            </div>
                            <div>
                                <h3 className="font-bold text-sm leading-tight">Ready to Compare</h3>
                                <p className="text-xs text-slate-400">Select up to 4 items</p>
                            </div>
                        </div>

                        {/* Selected Thumbnails (Hidden on mobile usually, distinct on desktop) */}
                        <div className="hidden sm:flex -space-x-2">
                            {selectedProducts.map((p) => (
                                <div key={p.id} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-white overflow-hidden relative" title={p.name}>
                                    {/* Fallback to initials if no image, or generic icon */}
                                    <div className="w-full h-full flex items-center justify-center text-slate-900 text-[10px] font-bold bg-slate-100">
                                        {p.name.substring(0, 2).toUpperCase()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex-1" />

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                             <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-slate-400 hover:text-white hover:bg-white/10 h-10 rounded-lg px-3"
                                onClick={clearAll}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Clear
                            </Button>
                            
                            <Link href="/credit-cards/compare"> 
                                {/* Note: Comparison link is generic here, ideally dynamic based on category */}
                                <Button className="h-12 px-6 rounded-xl bg-primary-500 hover:bg-primary-400 text-slate-900 font-bold shadow-xl shadow-primary-500/20 transition-all hover:scale-105 active:scale-95">
                                    Compare Now
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
