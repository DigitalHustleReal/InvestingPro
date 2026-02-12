"use client";

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import {
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ChevronRight } from "lucide-react";
import { NAVIGATION_CONFIG, EDITORIAL_INTENTS } from "@/lib/navigation/config";

interface NavbarDesktopItemProps {
    category: typeof NAVIGATION_CONFIG[0];
    pathname: string;
    onCategoryClick: (slug: string) => void;
}

const DROPDOWN_CLOSE_DELAY = 250;

/**
 * NavbarDesktopItem - Performance optimized component for individual category dropdowns.
 * Isolates hover and intent state to prevent full Navbar re-renders.
 */
const NavbarDesktopItem = React.memo(function NavbarDesktopItem({ 
    category, 
    pathname, 
    onCategoryClick 
}: NavbarDesktopItemProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeIntentIndex, setActiveIntentIndex] = useState(0);
    
    // Stable handlers to prevent unnecessary child re-renders
    const handleMouseEnter = useCallback(() => {
        setIsDropdownOpen(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setTimeout(() => {
            setIsDropdownOpen(false);
        }, DROPDOWN_CLOSE_DELAY);
    }, []);

    const handleIntentHover = useCallback((index: number) => {
        setActiveIntentIndex(index);
    }, []);

    const activeIntent = category.intents[activeIntentIndex] || category.intents[0];
    const isCurrentPath = pathname.startsWith(`/${category.slug}`);

    return (
        <NavigationMenuItem className="navigation-menu-item">
            <NavigationMenuTrigger 
                className={`gap-1 text-slate-700 dark:text-slate-300 hover:text-secondary-600 dark:hover:text-secondary-400 data-[state=open]:text-secondary-600 dark:data-[state=open]:text-secondary-400 font-semibold text-base tracking-tight font-sans bg-transparent hover:bg-transparent focus:bg-transparent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-2 ${
                    (isCurrentPath || isDropdownOpen)
                    ? 'text-secondary-600 dark:text-secondary-400 font-bold' 
                    : ''
                }`}
                onClick={() => onCategoryClick(category.slug)}
                onMouseEnter={handleMouseEnter}
            >
                {category.name}
            </NavigationMenuTrigger>
            
            <NavigationMenuContent 
                isOpen={isDropdownOpen}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div 
                    className="w-[900px] p-6 bg-white dark:bg-slate-900 shadow-xl rounded-xl border border-slate-100 dark:border-slate-800"
                    onMouseLeave={() => {
                        setActiveIntentIndex(0);
                        handleMouseLeave();
                    }}
                >
                    <div className="grid grid-cols-3 gap-8">
                        {/* Column 1: Intents */}
                        <div className="border-r border-slate-100 dark:border-slate-800 pr-6">
                            <nav className="space-y-1">
                                {category.intents.map((intent, index) => {
                                    const isActive = activeIntentIndex === index;
                                    return (
                                        <Link
                                            key={intent.slug}
                                            href={`/${category.slug}/${intent.slug}`}
                                            onMouseEnter={() => handleIntentHover(index)}
                                            className={`group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                                                isActive 
                                                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
                                                    : 'text-slate-600 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold">{intent.name}</span>
                                                {intent.description && (
                                                    <span className={`text-[11px] mt-0.5 line-clamp-1 ${isActive ? 'text-primary-600/80 dark:text-primary-400/70' : 'text-slate-600 dark:text-slate-500'}`}>
                                                        {intent.description}
                                                    </span>
                                                )}
                                            </div>
                                            {isActive && <ChevronRight className="w-4 h-4 text-primary-500" />}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Column 2: Collections */}
                        <div className="pr-6">
                            <div className="animate-in fade-in zoom-in-95 duration-200">
                                <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                                    {activeIntent.name}
                                    <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                                </h4>
                                <nav className="space-y-1">
                                    {activeIntent.collections.map((collection) => (
                                        <Link
                                            key={collection.href}
                                            href={collection.href}
                                            className="flex items-center justify-between group px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all font-medium"
                                        >
                                            <span>{collection.name}</span>
                                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-primary-500 transition-opacity" />
                                        </Link>
                                    ))}
                                    {activeIntent.collections.length > 0 && (
                                        <Link
                                            href={`/${category.slug}/${activeIntent.slug}`}
                                            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-bold px-3 mt-4"
                                        >
                                            View all {activeIntent.name.toLowerCase()}
                                            <ChevronRight className="w-3 h-3" />
                                        </Link>
                                    )}
                                </nav>
                            </div>
                        </div>

                        {/* Column 3: Featured/Tools */}
                        <div className="pl-6 border-l border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 -my-6 -mr-6 p-6">
                            {activeIntent.slug === EDITORIAL_INTENTS.CALCULATORS ? (
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Top Tools</h4>
                                    <nav className="space-y-2">
                                        <Link href="/calculators/sip" className="block p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">SIP Calculator</div>
                                            <div className="text-[11px] text-slate-500 dark:text-slate-600">Estimate your returns</div>
                                        </Link>
                                        <Link href="/calculators/emi" className="block p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">EMI Calculator</div>
                                            <div className="text-[11px] text-slate-500 dark:text-slate-600">Plan your loans</div>
                                        </Link>
                                    </nav>
                                </div>
                            ) : (
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Featured Guide</h4>
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <Link 
                                            href={`/${category.slug}/${activeIntent.slug}`}
                                            className="block text-sm font-bold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 mb-2 leading-snug"
                                        >
                                            {activeIntent.slug === EDITORIAL_INTENTS.GUIDES 
                                                ? `The Ultimate Guide to ${category.name}` 
                                                : `Best ${category.name} Analysis 2026`}
                                        </Link>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-600 leading-relaxed mb-3">
                                            Expert insights and data-driven recommendations.
                                        </p>
                                        <Link
                                            href={`/${category.slug}/${activeIntent.slug}`}
                                            className="inline-flex items-center text-[10px] text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-bold uppercase tracking-wider"
                                        >
                                            Read Review <ChevronRight className="w-3 h-3 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </NavigationMenuContent>
        </NavigationMenuItem>
    );
});

export default NavbarDesktopItem;
