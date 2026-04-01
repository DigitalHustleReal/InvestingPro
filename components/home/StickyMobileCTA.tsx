"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * StickyMobileCTA Component
 * 
 * A sticky CTA that appears on mobile devices after scrolling past the hero section.
 * Improves conversion by keeping the primary action accessible.
 */
export default function StickyMobileCTA() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling past hero section (~600px)
            const scrollY = window.scrollY;
            const heroHeight = 600;
            
            if (scrollY > heroHeight && !isDismissed) {
                setIsVisible(true);
            } else if (scrollY <= heroHeight) {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isDismissed]);

    const handleDismiss = () => {
        setIsDismissed(true);
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
                >
                    {/* Gradient fade effect at top */}
                    <div className="h-4 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
                    
                    {/* CTA Container */}
                    <div className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 px-4 py-3 shadow-lg shadow-slate-900/10">
                        <div className="flex items-center gap-3">
                            {/* Main CTA */}
                            <Link href="/credit-cards" className="flex-1">
                                <Button className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary-500/25 group">
                                    Start Comparing
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            
                            {/* Secondary CTA */}
                            <Link href="/calculators">
                                <Button 
                                    variant="outline" 
                                    className="border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-3 px-4 rounded-xl"
                                >
                                    Calculators
                                </Button>
                            </Link>
                            
                            {/* Dismiss button */}
                            <button
                                onClick={handleDismiss}
                                className="p-2 text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                aria-label="Dismiss"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        {/* Context note without inflated numbers */}
                        <div className="flex items-center justify-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-600">
                            <span>Early-stage product — please double-check details on the bank or provider site before applying.</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
