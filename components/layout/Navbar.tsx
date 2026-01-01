"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, X, ChevronDown, ChevronRight, Search } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import Logo from "@/components/common/Logo";
import { NAVIGATION_CONFIG, EDITORIAL_INTENTS } from "@/lib/navigation/config";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useSearch } from "@/components/search/SearchProvider";
import { NotificationBell } from "@/components/engagement";

// Search Button Component (Desktop)
function SearchButtonComponent({ isHomePage }: { isHomePage: boolean }) {
    const { openSearch } = useSearch();
    
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={openSearch}
            className={`hidden lg:flex ${isHomePage ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'}`}
            aria-label="Search (⌘K)"
        >
            <Search className="w-5 h-5" />
        </Button>
    );
}

// Mobile Search Button
function MobileSearchButton() {
    const { openSearch } = useSearch();
    
    return (
        <button 
            onClick={openSearch}
            className="w-full flex items-center gap-3 h-10 pl-4 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors text-sm text-left"
        >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search products, calculators, guides...</span>
        </button>
    );
}

interface NavbarProps {
    initialConfig?: typeof NAVIGATION_CONFIG;
}

export default function Navbar({ initialConfig }: NavbarProps = {}) {
    // Use passed config or fallback to static
    const config = initialConfig || NAVIGATION_CONFIG;

    // Mobile menu state
    const [isOpen, setIsOpen] = useState(false);
    
    // Track active intent per category for hover-driven dropdowns
    const [activeIntents, setActiveIntents] = useState<Record<string, number>>({});
    
    // Track expanded categories in mobile menu
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    
    // Track open dropdowns (for click-to-open)
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

    const pathname = usePathname();
    const isHomePage = pathname === "/";
    
    // Close dropdowns when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.navigation-menu-item')) {
                setOpenDropdowns({});
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    // Filter out Tools category from navigation (moved to footer)
    const navigationCategories = config.filter(cat => cat.slug !== 'tools');
    
    // Toggle dropdown on click - only one open at a time
    const toggleDropdown = (categorySlug: string) => {
        setOpenDropdowns(prev => {
            const isCurrentlyOpen = prev[categorySlug];
            // If clicking the same category, close it. Otherwise, open only this one.
            if (isCurrentlyOpen) {
                return {};
            } else {
                return { [categorySlug]: true };
            }
        });
    };
    
    // Open dropdown on hover - close others first, only one open at a time
    const handleMouseEnter = (categorySlug: string) => {
        setOpenDropdowns({ [categorySlug]: true });
    };
    
    // Close dropdown when mouse leaves
    const handleMouseLeave = (categorySlug: string) => {
        // Small delay to allow moving to dropdown content
        setTimeout(() => {
            setOpenDropdowns(prev => {
                // Only close if this is the currently open dropdown
                if (prev[categorySlug]) {
                    const newState = { ...prev };
                    delete newState[categorySlug];
                    return newState;
                }
                return prev;
            });
        }, 100);
    };
    
    const toggleCategory = (categorySlug: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categorySlug]: !prev[categorySlug]
        }));
    };

    // Set active intent for a category (defaults to first intent)
    const setActiveIntent = (categorySlug: string, intentIndex: number) => {
        setActiveIntents(prev => ({ ...prev, [categorySlug]: intentIndex }));
    };

    // Get active intent for a category
    const getActiveIntent = (categorySlug: string, intents: typeof NAVIGATION_CONFIG[0]['intents']) => {
        const activeIndex = activeIntents[categorySlug] ?? 0;
        return intents[activeIndex] || intents[0];
    };

    return (
        <header className={`sticky top-0 z-50 ${isHomePage ? 'bg-slate-900/95' : 'bg-white border-b border-slate-200'} backdrop-blur-md transition-colors duration-200`}>
            <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 lg:h-20">
                    {/* Logo */}
                    <Logo 
                        variant={isHomePage ? 'dark' : 'default'}
                        size="md"
                        showText={true}
                    />

                    {/* Desktop Navigation - Hidden on mobile/tablet */}
                    <div className="hidden lg:flex items-center gap-6 ml-8">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {navigationCategories.map((category) => {
                                    const isDropdownOpen = openDropdowns[category.slug] || false;
                                    return (
                                        <NavigationMenuItem key={category.slug} className="navigation-menu-item">
                                            <NavigationMenuTrigger 
                                                className={`${isHomePage 
                                                    ? 'text-white hover:border-white' 
                                                    : 'text-slate-700 hover:border-teal-600'
                                                }`}
                                                onClick={() => toggleDropdown(category.slug)}
                                                onMouseEnter={() => handleMouseEnter(category.slug)}
                                            >
                                                {category.name}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent 
                                                isOpen={isDropdownOpen}
                                                onMouseEnter={() => handleMouseEnter(category.slug)}
                                                onMouseLeave={() => handleMouseLeave(category.slug)}
                                            >
                                                <div 
                                                    className="w-[900px] p-6"
                                                    onMouseLeave={() => {
                                                        setActiveIntents(prev => ({ ...prev, [category.slug]: 0 }));
                                                        handleMouseLeave(category.slug);
                                                    }}
                                                >
                                                <div className="grid grid-cols-3 gap-8">
                                                    {/* Left Column: Intent List */}
                                                    <div className="border-r border-slate-200 pr-6">
                                                        <nav className="space-y-0" role="list">
                                                            {category.intents.map((intent, index) => {
                                                                const isActive = (activeIntents[category.slug] ?? 0) === index;
                                                                return (
                                                                    <div
                                                                        key={intent.slug}
                                                                        role="listitem"
                                                                        onMouseEnter={() => setActiveIntent(category.slug, index)}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'ArrowDown' && index < category.intents.length - 1) {
                                                                                e.preventDefault();
                                                                                setActiveIntent(category.slug, index + 1);
                                                                                const nextElement = e.currentTarget.nextElementSibling?.querySelector('a') as HTMLElement;
                                                                                nextElement?.focus();
                                                                            } else if (e.key === 'ArrowUp' && index > 0) {
                                                                                e.preventDefault();
                                                                                setActiveIntent(category.slug, index - 1);
                                                                                const prevElement = e.currentTarget.previousElementSibling?.querySelector('a') as HTMLElement;
                                                                                prevElement?.focus();
                                                                            }
                                                                        }}
                                                                        className="py-2.5"
                                                                    >
                                                                        <Link
                                                                            href={`/${category.slug}/${intent.slug}`}
                                                                            onFocus={() => setActiveIntent(category.slug, index)}
                                                                            className={`block text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded px-1 -mx-1 ${
                                                                                isActive 
                                                                                    ? 'text-teal-600' 
                                                                                    : 'text-slate-700 hover:text-teal-600'
                                                                            }`}
                                                                        >
                                                                            {intent.name}
                                                                        </Link>
                                                                        {intent.description && (
                                                                            <p className="text-xs text-slate-500 mt-0.5">
                                                                                {intent.description}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </nav>
                                                    </div>

                                                    {/* Middle Column: Collections for Active Intent */}
                                                    <div className="pr-6">
                                                        {(() => {
                                                            const activeIntent = getActiveIntent(category.slug, category.intents);
                                                            return (
                                                                <div>
                                                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                                                        {activeIntent.name}
                                                                    </h4>
                                                                    <nav className="space-y-1" role="list">
                                                                        {activeIntent.collections.map((collection) => (
                                                                            <Link
                                                                                key={collection.href}
                                                                                href={collection.href}
                                                                                className="block text-sm text-slate-700 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded px-1 -mx-1 py-1.5"
                                                                                role="listitem"
                                                                            >
                                                                                {collection.name}
                                                                            </Link>
                                                                        ))}
                                                                        {activeIntent.collections.length > 0 && (
                                                                            <Link
                                                                                href={`/${category.slug}/${activeIntent.slug}`}
                                                                                className="block text-xs text-slate-500 hover:text-teal-600 font-medium mt-3 pt-2 border-t border-slate-200"
                                                                            >
                                                                                View all {activeIntent.name.toLowerCase()} →
                                                                            </Link>
                                                                        )}
                                                                    </nav>
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>

                                                    {/* Right Panel: Editorial Highlight or Calculators */}
                                                    <div className="pl-6 border-l border-slate-200">
                                                        {(() => {
                                                            const activeIntent = getActiveIntent(category.slug, category.intents);
                                                            const hasCalculators = activeIntent.slug === EDITORIAL_INTENTS.CALCULATORS;
                                                            
                                                            if (hasCalculators) {
                                                                // Show calculator links
                                                                return (
                                                                    <div>
                                                                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                                                            Popular Calculators
                                                                        </h4>
                                                                        <nav className="space-y-1" role="list">
                                                                            <Link href="/calculators/sip" className="block text-sm text-slate-700 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded px-1 -mx-1 py-1.5" role="listitem">
                                                                                SIP Calculator
                                                                            </Link>
                                                                            <Link href="/calculators/emi" className="block text-sm text-slate-700 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded px-1 -mx-1 py-1.5" role="listitem">
                                                                                EMI Calculator
                                                                            </Link>
                                                                            <Link href="/calculators/fd" className="block text-sm text-slate-700 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded px-1 -mx-1 py-1.5" role="listitem">
                                                                                FD Calculator
                                                                            </Link>
                                                                            <Link href="/calculators" className="block text-xs text-slate-500 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded px-1 -mx-1 font-medium mt-3 pt-2 border-t border-slate-200">
                                                                                All Calculators →
                                                                            </Link>
                                                                        </nav>
                                                                    </div>
                                                                );
                                                            } else {
                                                                // Show editorial highlight
                                                                return (
                                                                    <div>
                                                                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                                                            Featured Guide
                                                                        </h4>
                                                                        <div className="space-y-2">
                                                                            <Link 
                                                                                href={`/${category.slug}/${activeIntent.slug}`}
                                                                                className="block text-sm font-semibold text-slate-900 hover:text-teal-600"
                                                                            >
                                                                                {category.name} {activeIntent.name} Guide
                                                                            </Link>
                                                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                                                Expert insights and comprehensive analysis to help you make informed decisions.
                                                                            </p>
                                                                            <Link
                                                                                href={`/${category.slug}/${activeIntent.slug}`}
                                                                                className="inline-block text-xs text-teal-600 hover:text-teal-700 font-medium mt-2"
                                                                            >
                                                                                Read Guide →
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                );
                                })}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Search Button - Opens Command Palette */}
                    <SearchButtonComponent isHomePage={isHomePage} />

                    {/* Notification Bell */}
                    <div className="hidden lg:flex">
                        <NotificationBell />
                    </div>

                    {/* CTA Button - Hidden on mobile/tablet */}
                    <div className="hidden lg:flex items-center gap-3">
                        {/* Language Switcher hidden - will be reintroduced when multilingual content is ready */}
                        <LanguageSwitcher />
                        
                        {/* Profile and Admin links removed - will be accessible after login implementation */}
                        {/* Profile link will be shown after user authentication */}
                        {/* Admin link should be accessed via direct URL only */}
                        
                        <Link href="/mutual-funds">
                            <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-lg shadow-teal-500/25">
                                Compare Products
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className={isHomePage ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'}
                                    aria-label="Open menu"
                                >
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-full sm:w-96 p-0 bg-white flex flex-col h-full">
                                <div className="flex flex-col h-full overflow-hidden">
                                    {/* Mobile Menu Header */}
                                <div className="flex items-center p-4 border-b border-slate-200 sticky top-0 bg-white z-10">
                                    <Logo 
                                        variant="default"
                                        size="md"
                                        showText={true}
                                    />
                                </div>

                                {/* Mobile Search - Opens Command Palette */}
                                <div className="p-4 border-b border-slate-200">
                                    <MobileSearchButton />
                                </div>

                                {/* Mobile Navigation */}
                                <div className="flex-1 overflow-y-auto min-h-0">
                                    <nav className="p-4 space-y-2">
                                        {navigationCategories.map((category) => {
                                            const isExpanded = expandedCategories[category.slug];
                                            return (
                                                <div key={category.slug} className="border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                                                    {/* Category Header - Collapsible */}
                                                    <button
                                                        onClick={() => toggleCategory(category.slug)}
                                                        className="w-full flex items-center justify-between py-3 text-left group"
                                                        aria-expanded={isExpanded}
                                                    >
                                                        <span className="text-base font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">
                                                            {category.name}
                                                        </span>
                                                        {isExpanded ? (
                                                            <ChevronDown className="w-5 h-5 text-slate-400" />
                                                        ) : (
                                                            <ChevronRight className="w-5 h-5 text-slate-400" />
                                                        )}
                                                    </button>

                                                    {/* Category Content - Collapsible */}
                                                    {isExpanded && (
                                                        <div className="pl-2 space-y-4 pb-2">
                                                            {category.intents.map((intent) => (
                                                                <div key={intent.slug}>
                                                                    <Link
                                                                        href={`/${category.slug}/${intent.slug}`}
                                                                        onClick={() => setIsOpen(false)}
                                                                        className="block mb-2 group"
                                                                    >
                                                                        <span className="text-sm font-semibold text-slate-700 group-hover:text-teal-600 transition-colors">
                                                                            {intent.name}
                                                                        </span>
                                                                        {intent.description && (
                                                                            <p className="text-xs text-slate-500 mt-0.5">
                                                                                {intent.description}
                                                                            </p>
                                                                        )}
                                                                    </Link>
                                                                    <ul className="space-y-1 ml-2 mt-1">
                                                                        {intent.collections.slice(0, 4).map((collection) => (
                                                                            <li key={collection.href}>
                                                                                <Link
                                                                                    href={collection.href}
                                                                                    onClick={() => setIsOpen(false)}
                                                                                    className="text-sm text-slate-600 hover:text-teal-600 hover:font-medium transition-all block py-1.5"
                                                                                >
                                                                                    {collection.name}
                                                                                </Link>
                                                                            </li>
                                                                        ))}
                                                                        {intent.collections.length > 4 && (
                                                                            <li>
                                                                                <Link
                                                                                    href={`/${category.slug}/${intent.slug}`}
                                                                                    onClick={() => setIsOpen(false)}
                                                                                    className="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
                                                                                >
                                                                                    View all {intent.name.toLowerCase()} →
                                                                                </Link>
                                                                            </li>
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </nav>
                                </div>

                                {/* Mobile Menu Footer */}
                                <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
                                    <Link href="/mutual-funds" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-lg shadow-teal-500/25">
                                            Compare Products
                                        </Button>
                                    </Link>
                                    <Link href="/calculators" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full">
                                            Calculators
                                        </Button>
                                    </Link>
                                    <div className="pt-2 border-t border-slate-200">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Language</p>
                                        <LanguageSwitcher isMobile={true} />
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                    </div>
                </div>
            </nav>
        </header>
    );
}
