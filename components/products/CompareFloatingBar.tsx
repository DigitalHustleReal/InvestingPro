"use client";

import React from 'react';
import { useCompare } from './CompareContext';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { X, ArrowRight, Layers } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function CompareFloatingBar() {
    const { selectedProducts, removeFromCompare, clearCompare } = useCompare();

    return (
        <AnimatePresence>
            {selectedProducts.length > 0 && (
                <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4 pointer-events-none"
                >
                    <div className="bg-slate-900/95 backdrop-blur-md text-slate-50 p-3 pl-5 rounded-2xl shadow-2xl pointer-events-auto flex items-center justify-between border border-slate-700/50 ring-1 ring-white/10">
                        {/* Status */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-sm font-medium text-teal-400">
                                <Layers className="w-4 h-4" />
                                <span>Compare ({selectedProducts.length}/4)</span>
                            </div>
                            
                            {/* Thumbnails */}
                            <div className="flex items-center gap-2">
                                {selectedProducts.map(p => (
                                    <div key={p.id} className="relative group shrink-0">
                                        <div className="w-10 h-7 bg-white rounded border border-slate-600 flex items-center justify-center p-0.5 overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={p.image_url} alt={p.name} className="w-full h-full object-contain" />
                                        </div>
                                        <button 
                                            onClick={() => removeFromCompare(p.id)} 
                                            className="absolute -top-1.5 -right-1.5 bg-rose-500 hover:bg-rose-600 rounded-full p-0.5 shadow-sm transition-transform hover:scale-110"
                                        >
                                            <X className="w-2 h-2 text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={clearCompare} 
                                className="text-slate-400 hover:text-white hover:bg-white/5 text-xs h-8"
                            >
                                Clear All
                            </Button>
                            <Link href="/compare">
                                <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold h-9 px-4 rounded-lg shadow-lg shadow-teal-500/20">
                                    Compare Now <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
