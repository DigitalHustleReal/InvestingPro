/**
 * Navigation Utilities
 * 
 * Helper functions for working with NAVIGATION_CONFIG
 * Used across Navbar, Footer, Homepage, and other components
 */

import { NAVIGATION_CONFIG, NavigationCategory, EDITORIAL_INTENTS } from './config';
import { 
    CreditCard, Landmark, TrendingUp, Shield, Calculator, 
    BookOpen, Gem, Building2, Banknote, PieChart, Newspaper
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Icon mapping for categories
const CATEGORY_ICONS: Record<string, LucideIcon> = {
    'credit-cards': CreditCard,
    'loans': Landmark,
    'insurance': Shield,
    'investing': TrendingUp,
    'banking': Building2,
    'calculators': Calculator,
    'mutual-funds': TrendingUp,
    'fixed-deposits': Landmark,
    'ppf-nps': Banknote,
    'taxes': Calculator,
    'small-business': Gem,
    'blog': BookOpen,
    'personal-finance': PieChart,
};

/**
 * Get category by slug
 */
export function getCategoryBySlug(slug: string): NavigationCategory | undefined {
    return NAVIGATION_CONFIG.find(cat => cat.slug === slug);
}

/**
 * Get all categories
 */
export function getAllCategories(): NavigationCategory[] {
    return NAVIGATION_CONFIG;
}

/**
 * Get icon for a category slug
 */
export function getCategoryIcon(slug: string): LucideIcon {
    return CATEGORY_ICONS[slug] || TrendingUp; // Default icon
}

/**
 * Footer Link Interface
 */
export interface FooterLink {
    name: string;
    href: string;
}

/**
 * Footer Links Structure
 */
export interface FooterLinks {
    products: FooterLink[];
    calculators: FooterLink[];
    comparisons: FooterLink[];
    resources: FooterLink[];
}

/**
 * Get comparison pages from NAVIGATION_CONFIG
 * Extracts all collections from Compare intents
 */
export function getComparisonPages(): FooterLink[] {
    const comparisons: FooterLink[] = [];
    
    NAVIGATION_CONFIG.forEach(category => {
        const compareIntent = category.intents.find(
            intent => intent.slug === EDITORIAL_INTENTS.COMPARE
        );
        
        if (compareIntent) {
            // Add all comparison collections
            compareIntent.collections.forEach(collection => {
                // Skip generic "Compare [Category]" links, focus on specific comparisons
                if (collection.name.toLowerCase().includes('vs') || 
                    collection.name.toLowerCase().includes('comparison') ||
                    collection.slug !== 'all') {
                    comparisons.push({
                        name: collection.name,
                        href: collection.href
                    });
                }
            });
        }
    });
    
    return comparisons;
}

/**
 * Generate footer links from NAVIGATION_CONFIG
 * 
 * Products: Main categories
 * Calculators: All calculators from all categories
 * Comparisons: High-value comparison pages from Compare intents
 * Resources: Guides from all categories
 */
export function getFooterLinks(): FooterLinks {
    // Products: Main categories (prioritized)
    const productCategories = ['credit-cards', 'insurance', 'loans', 'investing', 'banking', 'mutual-funds', 'fixed-deposits', 'ppf-nps'];
    const products: FooterLink[] = productCategories
        .map(slug => {
            const category = getCategoryBySlug(slug);
            return category ? { name: category.name, href: `/${category.slug}` } : null;
        })
        .filter((link): link is FooterLink => link !== null);

    // Calculators: Extract from all categories' calculator intents
    const calculators: FooterLink[] = [];
    const calculatorCategories = ['investing', 'loans', 'banking', 'taxes', 'small-business', 'insurance'];
    
    calculatorCategories.forEach(categorySlug => {
        const category = getCategoryBySlug(categorySlug);
        if (category) {
            const calculatorsIntent = category.intents.find(
                intent => intent.slug === EDITORIAL_INTENTS.CALCULATORS
            );
            if (calculatorsIntent) {
                calculatorsIntent.collections.forEach(calc => {
                    calculators.push({ name: calc.name, href: calc.href });
                });
            }
        }
    });

    // Also add calculators from the main calculators category
    const calculatorsCategory = getCategoryBySlug('calculators');
    if (calculatorsCategory) {
        const calculatorsIntent = calculatorsCategory.intents.find(
            intent => intent.slug === EDITORIAL_INTENTS.CALCULATORS
        );
        if (calculatorsIntent) {
            calculatorsIntent.collections.forEach(calc => {
                // Avoid duplicates
                if (!calculators.find(c => c.href === calc.href)) {
                    calculators.push({ name: calc.name, href: calc.href });
                }
            });
        }
    }

    // Comparisons: Extract from Compare intents
    const comparisons = getComparisonPages();

    // Resources: Guides from all categories
    const resources: FooterLink[] = [];
    const categorySlugsWithGuides = ['credit-cards', 'loans', 'investing', 'insurance'];
    categorySlugsWithGuides.forEach(slug => {
        const category = getCategoryBySlug(slug);
        if (category) {
            const guidesIntent = category.intents.find(intent => intent.slug === EDITORIAL_INTENTS.GUIDES);
            if (guidesIntent && guidesIntent.collections.length > 0) {
                resources.push({
                    name: `${category.name} Guides`,
                    href: `/${category.slug}/${EDITORIAL_INTENTS.GUIDES}`
                });
            }
        }
    });
    
    // Add glossary and general guides
    resources.push({ name: 'Glossary', href: '/glossary' });
    resources.push({ name: 'All Guides', href: '/guides' });
    resources.push({ name: 'Blog', href: '/blog' });
    resources.push({ name: 'Methodology', href: '/methodology' });

    return { products, calculators, comparisons, resources };
}

/**
 * Homepage Category Interface
 */
export interface HomepageCategory {
    title: string;
    icon: LucideIcon;
    description: string;
    href: string;
}

/**
 * Generate homepage categories from NAVIGATION_CONFIG
 * Returns prioritized categories for homepage display
 */
export function getHomepageCategories(): HomepageCategory[] {
    // Prioritized categories for homepage
    const prioritySlugs = ['credit-cards', 'loans', 'insurance', 'mutual-funds', 'calculators', 'banking', 'fixed-deposits', 'taxes', 'small-business'];
    
    return prioritySlugs
        .map(slug => {
            const category = getCategoryBySlug(slug);
            if (!category) return null;
            
            return {
                title: category.name,
                icon: getCategoryIcon(slug),
                description: category.description,
                href: `/${category.slug}`
            };
        })
        .filter((cat): cat is HomepageCategory => cat !== null);
}
