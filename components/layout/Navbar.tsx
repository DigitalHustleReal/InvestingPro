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
import { ThemeToggle } from "@/components/common/ThemeToggle";


// Search Button Component (Desktop)
function SearchButtonComponent({ isHomePage }: { isHomePage: boolean }) {
    const { openSearch } = useSearch();
    
    return (
        <Button
            variant="ghost"
            onClick={openSearch}
            className="hidden lg:flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-full transition-all"
            aria-label="Search"
        >
            <Search className="w-4 h-4" />
            <span className="text-sm font-medium">Search</span>
            <kbd className="hidden xl:inline-flex ml-2 pointer-events-none h-5 select-none items-center gap-1 rounded border bg-slate-50 dark:bg-slate-900 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
                <span className="text-xs">⌘</span>K
            </kbd>
        </Button>
    );
}

// Mobile Search Button
function MobileSearchButton() {
    const { openSearch } = useSearch();
    
    return (
        <button 
            onClick={openSearch}
            className="w-full flex items-center gap-3 h-12 pl-4 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 hover:bg-slate-100 transition-all text-sm text-left shadow-inner"
        >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search products, taxes, or guides...</span>
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
    const { openSearch } = useSearch();
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
    
    // Filter and reorder categories based on high-intent search volume
    const PRIORITY_SLUGS = ['credit-cards', 'loans', 'investing', 'insurance', 'banking', 'taxes', 'small-business', 'tools'];
    
    const navigationCategories = PRIORITY_SLUGS
        .map(slug => config.find(c => c.slug === slug))
        .filter((c): c is typeof NAVIGATION_CONFIG[0] => c !== undefined);

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
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-xl transition-all duration-200 shadow-sm dark:shadow-slate-900/20">
            <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 lg:h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Logo 
                            variant="default"
                            size="md"
                            showText={true}
                        />
                    </div>

                    {/* Desktop Navigation - Hidden on mobile/tablet */}
                    <div className="hidden lg:flex items-center gap-1 xl:gap-8 ml-auto">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {navigationCategories.map((category) => {
                                    const isDropdownOpen = openDropdowns[category.slug] || false;
                                    const displayName = category.slug === 'tools' ? 'Calculators' : category.name;
                                    
                                    return (
                                        <NavigationMenuItem key={category.slug} className="navigation-menu-item">
                                            <NavigationMenuTrigger 
                                                className={`gap-1 text-slate-700 dark:text-slate-300 hover:text-secondary-600 dark:hover:text-secondary-400 data-[state=open]:text-secondary-600 dark:data-[state=open]:text-secondary-400 font-semibold text-[15px] tracking-tight font-sans bg-transparent hover:bg-transparent focus:bg-transparent ${isDropdownOpen ? 'text-secondary-600 dark:text-secondary-400' : ''}`}
                                                onClick={() => toggleDropdown(category.slug)}
                                                onMouseEnter={() => handleMouseEnter(category.slug)}
                                            >
                                                {displayName}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent 
                                                isOpen={isDropdownOpen}
                                                onMouseEnter={() => handleMouseEnter(category.slug)}
                                                onMouseLeave={() => handleMouseLeave(category.slug)}
                                            >
                                                <div 
                                                    className="w-[900px] p-6 bg-white shadow-xl rounded-xl border border-slate-100"
                                                    onMouseLeave={() => {
                                                        setActiveIntents(prev => ({ ...prev, [category.slug]: 0 }));
                                                        handleMouseLeave(category.slug);
                                                    }}
                                                >
                                                <div className="grid grid-cols-3 gap-8">
                                                    {/* Left Column: Intent List */}
                                                    <div className="border-r border-slate-100 pr-6">
                                                        <nav className="space-y-1" role="list">
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
                                                                        className={`group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                                                                            isActive 
                                                                                ? 'bg-teal-50 text-teal-700' 
                                                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                                        }`}
                                                                    >
                                                                        <div className="flex flex-col">
                                                                            <span className="text-sm font-semibold">
                                                                                {intent.name}
                                                                            </span>
                                                                            {intent.description && (
                                                                                <span className={`text-[11px] mt-0.5 line-clamp-1 ${isActive ? 'text-teal-600/80' : 'text-slate-400'}`}>
                                                                                    {intent.description}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        {isActive && <ChevronRight className="w-4 h-4 text-teal-500" />}
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
                                                                <div className="animate-in fade-in zoom-in-95 duration-200">
                                                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                                        <div className="h-px bg-slate-200 flex-1"></div>
                                                                        {activeIntent.name}
                                                                        <div className="h-px bg-slate-200 flex-1"></div>
                                                                    </h4>
                                                                    <nav className="space-y-1" role="list">
                                                                        {activeIntent.collections.map((collection) => (
                                                                            <Link
                                                                                key={collection.href}
                                                                                href={collection.href}
                                                                                className="flex items-center justify-between group px-3 py-2 rounded-lg text-sm text-slate-700 hover:text-teal-700 hover:bg-teal-50 transition-all"
                                                                                role="listitem"
                                                                            >
                                                                                <span>{collection.name}</span>
                                                                                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-teal-500 transition-opacity" />
                                                                            </Link>
                                                                        ))}
                                                                        {activeIntent.collections.length > 0 && (
                                                                            <Link
                                                                                href={`/${category.slug}/${activeIntent.slug}`}
                                                                                className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-semibold px-3 mt-4"
                                                                            >
                                                                                View all {activeIntent.name.toLowerCase()}
                                                                                <ChevronRight className="w-3 h-3" />
                                                                            </Link>
                                                                        )}
                                                                    </nav>
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>

                                                    {/* Right Panel: Editorial Highlight or Calculators */}
                                                    <div className="pl-6 border-l border-slate-100 bg-slate-50/50 -my-6 -mr-6 p-6">
                                                        {(() => {
                                                            const activeIntent = getActiveIntent(category.slug, category.intents);
                                                            const hasCalculators = activeIntent.slug === EDITORIAL_INTENTS.CALCULATORS;
                                                            
                                                            if (hasCalculators) {
                                                                // Show calculator links
                                                                return (
                                                                    <div>
                                                                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                                                            Top Tools
                                                                        </h4>
                                                                        <nav className="space-y-2" role="list">
                                                                            <Link href="/calculators/sip" className="block p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-teal-300 hover:shadow-md transition-all">
                                                                                <div className="text-sm font-semibold text-slate-900 mb-0.5">SIP Calculator</div>
                                                                                <div className="text-xs text-slate-500">Estimate your returns</div>
                                                                            </Link>
                                                                            <Link href="/calculators/emi" className="block p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-teal-300 hover:shadow-md transition-all">
                                                                                <div className="text-sm font-semibold text-slate-900 mb-0.5">EMI Calculator</div>
                                                                                <div className="text-xs text-slate-500">Plan your loans</div>
                                                                            </Link>
                                                                        </nav>
                                                                    </div>
                                                                );
                                                            } else {
                                                                // Show editorial highlight
                                                                return (
                                                                    <div>
                                                                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                                                            Featured
                                                                        </h4>
                                                                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                                                            <Link 
                                                                                href={`/${category.slug}/${activeIntent.slug}`}
                                                                                className="block text-sm font-bold text-slate-900 hover:text-teal-600 mb-2 leading-snug"
                                                                            >
                                                                                {activeIntent.slug === EDITORIAL_INTENTS.GUIDES 
                                                                                    ? `The Ultimate Guide to ${category.name}` 
                                                                                    : `Best ${category.name} for 2026`}
                                                                            </Link>
                                                                            <p className="text-xs text-slate-500 leading-relaxed mb-3">
                                                                                Expert insights to help you choose the right financial product today.
                                                                            </p>
                                                                            <Link
                                                                                href={`/${category.slug}/${activeIntent.slug}`}
                                                                                className="inline-flex items-center text-xs text-teal-600 hover:text-teal-700 font-bold uppercase tracking-wide"
                                                                            >
                                                                                Read Now <ChevronRight className="w-3 h-3 ml-1" />
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
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <SearchButtonComponent isHomePage={isHomePage} />

                        {/* CTA Button - Hidden on mobile/tablet */}
                        <div className="hidden lg:flex items-center gap-4 ml-2">
                            <Link href="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                                Log In
                            </Link>
                            
                            <Link href="/compare">
                                <Button className="bg-secondary-600 hover:bg-secondary-700 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-600/20 transition-all h-10 px-6 rounded-lg">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="lg:hidden flex items-center gap-1 ml-1">
                        <ThemeToggle />
                        
                        {/* Direct Mobile Search Icon */}
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={openSearch}
                            className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5" />
                        </Button>

                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-slate-700 hover:bg-slate-100"
                                    aria-label="Open menu"
                                >
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-full sm:w-96 p-0 bg-white/95 backdrop-blur-xl flex flex-col h-full border-l border-slate-200/60 shadow-2xl">
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
                                    <Link href="/compare" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full bg-secondary-600 hover:bg-secondary-700 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-600/20 transition-all h-10 rounded-lg">
                                            Get Started
                                        </Button>
                                    </Link>
                                    <Link href="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full h-10 font-semibold text-slate-600 hover:text-teal-600 border-slate-200">
                                            Log In
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
