"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, X, ChevronDown, ChevronRight, Search, User } from "lucide-react";
import Logo from "@/components/common/Logo";
import { NAVIGATION_CONFIG, EDITORIAL_INTENTS } from "@/lib/navigation/config";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useSearch } from "@/components/search/SearchProvider";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useNavigation } from "@/contexts/NavigationContext";
import NavbarDesktopItem from "./NavbarDesktopItem";


// Constants
const DROPDOWN_CLOSE_DELAY = 250; // ms - Standard UX timing for dropdown hover

// Unified Search Button Component - Enhanced for prominence (UI/UX Quick Win #1)
function SearchButton({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
    const { openSearch } = useSearch();
    
    if (variant === 'mobile') {
        return (
            <button 
                onClick={openSearch}
                className="w-full flex items-center gap-3 h-12 pl-4 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 text-sm text-left shadow-sm hover:shadow-md"
            >
                <Search className="w-4 h-4 text-primary-700 dark:text-primary-500 flex-shrink-0" />
                <span className="flex-1">Search products, guides...</span>
                <kbd className="px-2 py-0.5 text-xs bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-slate-400">⌘K</kbd>
            </button>
        );
    }
    
    return (
        <button
            onClick={openSearch}
            className="hidden lg:flex items-center gap-2 h-9 w-48 xl:w-56 px-3 
                       bg-slate-50 dark:bg-slate-800/50 
                       border border-slate-200 dark:border-slate-700 
                       hover:border-primary-700 dark:hover:border-primary-600 
                       hover:bg-white dark:hover:bg-slate-800
                       rounded-lg transition-all duration-200 
                       shadow-sm hover:shadow-md
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2"
            aria-label="Search products and guides"
        >
            <Search className="w-4 h-4 text-primary-700 dark:text-primary-500 flex-shrink-0" />
            <span className="text-sm text-slate-600 dark:text-slate-400 flex-1 text-left truncate">Search...</span>
            <kbd className="hidden xl:inline-flex px-1.5 py-0.5 text-[10px] bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 font-mono">⌘K</kbd>
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
    
    // Track expanded categories in mobile menu
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    const pathname = usePathname();
    const router = useRouter();
    const { openSearch } = useSearch();
    const isHomePage = pathname === "/";
    const { setActiveCategory } = useNavigation();
    
    // Close dropdowns when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Dropdowns are now handled by isolated sub-components
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    // Lock body scroll when mobile menu is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);
    
    // Filter and reorder categories based on high-intent search volume (memoized for performance)
    const PRIORITY_SLUGS = ['credit-cards', 'insurance', 'loans', 'investing', 'calculators'];
    
    const navigationCategories = React.useMemo(() => 
        PRIORITY_SLUGS
            .map(slug => config.find(c => c.slug === slug))
            .filter((c): c is typeof NAVIGATION_CONFIG[0] => c !== undefined),
        [config]
    );

    // Navigate to category page on click, open menu on hover
    const handleCategoryClick = (categorySlug: string) => {
        // Navigate to category page
        router.push(`/${categorySlug}`);
    };
    
    // Auto-close mobile menu when pathname changes (navigation occurs)
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);
    
    const toggleCategory = (categorySlug: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categorySlug]: !prev[categorySlug]
        }));
    };

    return (
        <header className="sticky top-0 z-50 bg-white/75 dark:bg-slate-950/75 border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md transition-all duration-300 shadow-sm dark:shadow-slate-900/10 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/60">
            <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 lg:h-[72px]">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Logo 
                            variant="default"
                            size="md"
                            showText={true}
                        />
                    </div>

                    {/* Desktop Navigation - Hidden on mobile/tablet */}
                    <div className="hidden lg:flex items-center gap-4 xl:gap-6 ml-auto">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {navigationCategories.map((category) => (
                                    <NavbarDesktopItem 
                                        key={category.slug}
                                        category={category}
                                        pathname={pathname}
                                        onCategoryClick={handleCategoryClick}
                                    />
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Utility Area - Search, Login, CTA */}
                    <div className="flex items-center gap-3">
                        <div className="hidden lg:block">
                            <ThemeToggle />
                        </div>
                        
                        {/* Icon-only Search Button - Removed (redundant with search bar) */}
                        {/* <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={openSearch}
                            className="hidden lg:flex text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-xl"
                            aria-label="Search products and guides"
                        >
                            <Search className="w-5 h-5" />
                        </Button> */}

                        {/* CTA Button - Hidden on mobile/tablet */}
                        <div className="hidden lg:flex items-center gap-3 ml-2">
                            {/* Icon-only Login Button */}
                            <Link href="/login" className="inline-flex items-center justify-center">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-xl"
                                    aria-label="Sign In"
                                    title="Sign In"
                                >
                                    <User className="w-5 h-5" />
                                </Button>
                            </Link>
                            
                            <Button asChild variant="default" className="bg-primary-700 hover:bg-primary-800 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-primary-900/20 transition-all duration-200 h-10 px-5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                                <Link href="/compare">
                                    Get Started
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="lg:hidden flex items-center gap-3 ml-1">
                        <ThemeToggle />
                        
                        {/* Direct Mobile Search Icon */}
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={openSearch}
                            className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-2 rounded-xl"
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5" />
                        </Button>

                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-primary-600 hover:bg-primary-50 hover:text-primary-700 dark:text-primary-500"
                            aria-label="Open menu"
                            onClick={() => setIsOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </Button>
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetContent side="right" className="w-full sm:w-96 p-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl flex flex-col h-full border-l border-slate-200/60 dark:border-slate-800/60 shadow-2xl">
                                <div className="flex flex-col h-full overflow-hidden">
                                    {/* Mobile Menu Header */}
                                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
                                    <Logo 
                                        variant="default"
                                        size="md"
                                        showText={true}
                                    />
                                    <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => setIsOpen(false)}
                                        className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                                        aria-label="Close menu"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                {/* Mobile Search - Opens Command Palette */}
                                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                                    <SearchButton variant="mobile" />
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
                                                        <span className="text-base font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
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
                                                                        <span className="text-sm font-semibold text-slate-700 group-hover:text-primary-600 transition-colors">
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
                                                                                    className="text-sm text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:font-medium transition-all block py-3 min-h-[44px] flex items-center"
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
                                                                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
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
                                        <Button variant="default" className="w-full bg-primary-700 hover:bg-primary-800 text-white font-bold shadow-lg hover:shadow-xl hover:shadow-primary-900/20 transition-all h-10 rounded-lg">
                                            Get Started
                                        </Button>
                                    </Link>
                                    <Link href="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full h-10 font-semibold text-slate-600 hover:text-primary-600 border-slate-200">
                                            Log In
                                        </Button>
                                    </Link>
                                    <Link href="/methodology" onClick={() => setIsOpen(false)} className="block text-center py-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                                        ⭐ How We Rate Products
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
