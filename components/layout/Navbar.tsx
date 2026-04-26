"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, X, ChevronDown, ChevronRight, Search, User } from "lucide-react";
import Logo from "@/components/common/Logo";
import {
  NAVIGATION_CONFIG,
  EDITORIAL_INTENTS,
  NAVBAR_PRIORITY_SLUGS,
} from "@/lib/navigation/config";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useSearch } from "@/components/search/SearchProvider";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useNavigation } from "@/contexts/NavigationContext";
import NavbarDesktopItem from "./NavbarDesktopItem";

// Constants
const DROPDOWN_CLOSE_DELAY = 250; // ms - Standard UX timing for dropdown hover

// Unified Search Button Component - Enhanced for prominence (UI/UX Quick Win #1)
function SearchButton({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  const { openSearch } = useSearch();

  if (variant === "mobile") {
    return (
      <button
        onClick={openSearch}
        className="w-full flex items-center gap-3 h-11 pl-4 pr-3 border-2 border-ink/10 bg-canvas hover:border-ink transition-colors text-left"
      >
        <Search className="w-4 h-4 text-ink-60 flex-shrink-0" />
        <span className="flex-1 font-mono text-[12px] text-ink-60">
          Search products, guides…
        </span>
        <kbd className="px-2 py-0.5 text-[10px] bg-ink/5 border border-ink/10 text-ink-60 font-mono">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <button
      onClick={openSearch}
      className="hidden lg:flex items-center gap-2 h-9 w-48 xl:w-56 px-3 bg-canvas border-2 border-ink/10 hover:border-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indian-gold focus-visible:ring-offset-2"
      aria-label="Search products and guides"
    >
      <Search className="w-4 h-4 text-ink-60 flex-shrink-0" />
      <span className="font-mono text-[12px] text-ink-60 flex-1 text-left truncate">
        Search…
      </span>
      <kbd className="hidden xl:inline-flex px-1.5 py-0.5 text-[10px] bg-ink/5 border border-ink/10 text-ink-60 font-mono">
        ⌘K
      </kbd>
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
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Filter and reorder categories by priority — config is the single source of truth
  const navigationCategories = React.useMemo(
    () =>
      NAVBAR_PRIORITY_SLUGS.map((slug) =>
        config.find((c) => c.slug === slug),
      ).filter((c): c is (typeof NAVIGATION_CONFIG)[0] => c !== undefined),
    [config],
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
    setExpandedCategories((prev) => ({
      ...prev,
      [categorySlug]: !prev[categorySlug],
    }));
  };

  return (
    <header className="sticky top-0 z-50 bg-canvas border-b-2 border-ink/10">
      <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-[72px]">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo variant="default" size="md" showText={true} />
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
                            className="hidden lg:flex text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 rounded-xl"
                            aria-label="Search products and guides"
                        >
                            <Search className="w-5 h-5" />
                        </Button> */}

            {/* CTA Button - Hidden on mobile/tablet */}
            <div className="hidden lg:flex items-center gap-3 ml-2">
              {/* Icon-only Login Button */}
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-10 h-10 text-ink hover:text-indian-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indian-gold focus-visible:ring-offset-2"
                aria-label="Sign In"
                title="Sign In"
              >
                <User className="w-5 h-5" />
              </Link>

              <Link
                href="/compare"
                className="inline-flex items-center justify-center font-mono text-[11px] uppercase tracking-wider px-5 h-10 bg-ink text-canvas hover:bg-indian-gold hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indian-gold focus-visible:ring-offset-2"
              >
                Compare Now
              </Link>
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-3 ml-1">
            <ThemeToggle />

            {/* Direct Mobile Search Icon */}
            <button
              onClick={openSearch}
              className="w-10 h-10 inline-flex items-center justify-center text-ink hover:text-indian-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indian-gold focus-visible:ring-offset-2"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="w-10 h-10 inline-flex items-center justify-center text-ink hover:text-indian-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indian-gold focus-visible:ring-offset-2"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetContent
                side="right"
                className="w-full sm:w-96 p-0 bg-canvas flex flex-col h-full border-l-2 border-ink/10"
              >
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between p-4 border-b-2 border-ink/10 sticky top-0 bg-canvas z-10">
                    <Logo variant="default" size="md" showText={true} />
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-10 h-10 inline-flex items-center justify-center text-ink-60 hover:text-ink transition-colors"
                      aria-label="Close menu"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Mobile Search - Opens Command Palette */}
                  <div className="p-4 border-b-2 border-ink/10">
                    <SearchButton variant="mobile" />
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex-1 overflow-y-auto min-h-0">
                    <nav className="p-4 space-y-1">
                      {navigationCategories.map((category) => {
                        const isExpanded = expandedCategories[category.slug];
                        return (
                          <div
                            key={category.slug}
                            className="border-b border-ink/10 last:border-0 pb-2 last:pb-0"
                          >
                            {/* Category Header - Collapsible */}
                            <button
                              onClick={() => toggleCategory(category.slug)}
                              className="w-full flex items-center justify-between py-3 text-left group"
                              aria-expanded={isExpanded}
                            >
                              <span className="font-display text-[18px] font-bold text-ink group-hover:text-indian-gold transition-colors">
                                {category.name}
                              </span>
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5 text-ink-60" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-ink-60" />
                              )}
                            </button>

                            {/* Category Content - Collapsible */}
                            {isExpanded && (
                              <div className="pl-2 space-y-4 pb-3">
                                {category.intents.map((intent) => (
                                  <div key={intent.slug}>
                                    <Link
                                      href={`/${category.slug}/${intent.slug}`}
                                      onClick={() => setIsOpen(false)}
                                      className="block mb-2 group"
                                    >
                                      <span className="font-mono text-[10px] uppercase tracking-wider text-indian-gold group-hover:underline">
                                        {intent.name}
                                      </span>
                                      {intent.description && (
                                        <p className="text-[12px] text-ink-60 mt-0.5">
                                          {intent.description}
                                        </p>
                                      )}
                                    </Link>
                                    <ul className="space-y-0 ml-2 mt-1">
                                      {intent.collections
                                        .slice(0, 4)
                                        .map((collection) => (
                                          <li key={collection.href}>
                                            <Link
                                              href={collection.href}
                                              onClick={() => setIsOpen(false)}
                                              className="text-[14px] text-ink-80 hover:text-indian-gold transition-colors block py-2.5 min-h-[44px] flex items-center"
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
                                            className="font-mono text-[11px] uppercase tracking-wider text-indian-gold hover:underline"
                                          >
                                            View all {intent.name.toLowerCase()}{" "}
                                            &rarr;
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
                  <div className="p-4 border-t-2 border-ink/10 bg-canvas space-y-3">
                    <Link
                      href="/compare"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center font-mono text-[11px] uppercase tracking-wider px-5 h-11 leading-[44px] bg-ink text-canvas hover:bg-indian-gold hover:text-ink transition-colors"
                    >
                      Compare Now
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center font-mono text-[11px] uppercase tracking-wider px-5 h-11 leading-[44px] border-2 border-ink/15 text-ink hover:border-ink transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/methodology"
                      onClick={() => setIsOpen(false)}
                      className="block text-center py-2 font-mono text-[11px] uppercase tracking-wider text-indian-gold hover:underline"
                    >
                      How we rate products &rarr;
                    </Link>
                    <div className="pt-3 border-t border-ink/10">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-60 mb-2">
                        Language
                      </p>
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
