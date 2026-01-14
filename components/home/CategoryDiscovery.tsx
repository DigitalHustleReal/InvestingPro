"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { getHomepageCategories } from '@/lib/navigation/utils';

export default function CategoryDiscovery() {
    // Memoize categories to avoid recomputation on every render
    const categories = React.useMemo(() => getHomepageCategories(), []);
    
    return (
        <section className="relative py-16 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Explore by Category</h2>
                    <p className="text-slate-600 dark:text-slate-400">Everything you need to manage your wealth.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {categories.map((cat, i) => (
                        <Link href={cat.href} key={i}>
                            <Card className="group h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 relative overflow-hidden">
                                <CardContent className="p-6 flex flex-col items-center text-center h-full relative z-10">
                                    {/* Premium Icon Container with Alternating Colors */}
                                    <div className={`
                                        w-14 h-14 rounded-2xl flex items-center justify-center mb-5 
                                        transition-all duration-300 group-hover:scale-110 shadow-inner
                                        
                                        /* Light Mode: Blue (Default) -> Teal (Hover) */
                                        bg-secondary-50 group-hover:bg-primary-50
                                        
                                        /* Dark Mode: Teal (Default) -> Blue (Hover) */
                                        dark:bg-primary-900/20 dark:group-hover:bg-secondary-900/20
                                    `}>
                                        <cat.icon className={`
                                            w-7 h-7 drop-shadow-sm transition-colors duration-300
                                            
                                            /* Light Mode: Blue (Default) -> Teal (Hover) */
                                            text-secondary-600 group-hover:text-primary-600
                                            
                                            /* Dark Mode: Teal (Default) -> Blue (Hover) */
                                            dark:text-primary-400 dark:group-hover:text-secondary-400
                                        `} />
                                    </div>
                                    
                                    {/* Title with matching transitions */}
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-secondary-400 transition-colors">
                                        {cat.title}
                                    </h3>
                                    
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-1">
                                        {cat.description}
                                    </p>

                                    {/* Hover Indicator Strip (Teal in Light, Blue in Dark) */}
                                    <div className="absolute overflow-hidden inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary-500 dark:via-secondary-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
