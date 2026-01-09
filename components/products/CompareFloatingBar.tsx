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
                    className="fixed bottom-0 sm:bottom-6 inset-x-0 sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-3xl px-0 sm:px-4 pointer-events-none"
                >
                    <div className="bg-slate-950/95 sm:bg-slate-900/95 backdrop-blur-xl text-slate-50 p-4 sm:p-3 sm:pl-5 rounded-t-3xl sm:rounded-2xl shadow-2xl pointer-events-auto flex flex-col sm:flex-row items-center justify-between border-t sm:border border-slate-700/50 ring-1 ring-white/10 gap-4 sm:gap-0">
                        {/* Status + Thumbnails */}
                        <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-6">
                            <div className="flex items-center gap-2 text-sm font-bold text-primary-400">
                                <Layers className="w-5 h-5" />
                                <span className="whitespace-nowrap">Compare ({selectedProducts.length}/4)</span>
                            </div>
                            
                            {/* Thumbnails */}
                            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar sm:overflow-visible py-1">
                                {selectedProducts.map(p => (
                                    <div key={p.id} className="relative group shrink-0">
                                        <div className="w-12 h-9 sm:w-10 sm:h-7 bg-white rounded-lg border border-slate-600 flex items-center justify-center p-1 overflow-hidden shadow-inner">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={p.image_url} alt={p.name} className="w-full h-full object-contain" />
                                        </div>
                                        <button 
                                            onClick={() => removeFromCompare(p.id)} 
                                            className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 rounded-full p-1.5 shadow-lg shadow-rose-500/20 transition-transform hover:scale-110 flex items-center justify-center"
                                            aria-label={`Remove ${p.name}`}
                                        >
                                            <X className="w-3 h-3 text-white font-black" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center w-full sm:w-auto gap-3">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={clearCompare} 
                                className="flex-1 sm:flex-none text-slate-400 hover:text-white hover:bg-white/5 text-xs h-12 sm:h-8 font-semibold"
                            >
                                Clear All
                            </Button>
                            <Link href="/compare" className="flex-[2] sm:flex-none">
                                <Button className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-slate-950 font-black h-12 sm:h-9 px-8 sm:px-4 rounded-xl sm:rounded-lg shadow-xl shadow-teal-500/20 flex items-center justify-center">
                                    Compare Now <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
