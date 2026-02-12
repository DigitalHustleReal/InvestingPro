/**
 * Centralized Admin Navigation Configuration
 * 
 * Single source of truth for all admin navigation:
 * - Categories
 * - Sections
 * - Routes
 * - Icons
 * - Breadcrumbs
 */

import {
    FileText,
    Tag,
    Image as ImageIcon,
    LayoutDashboard,
    Calendar,
    Zap,
    CheckSquare,
    DollarSign,
    Megaphone,
    Rss,
    File,
    BarChart3,
    Activity,
    Package,
    Factory,
    FlaskConical,
    Shield,
    Users,
    Sparkles,
    Wallet,
    PlayCircle,
    HeartPulse,
    Settings,
    Mail,
    TrendingUp,
    Palette,
    UserCheck,
    Workflow,
    Bot,
    Database,
    LineChart
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    badge?: number;
    description?: string;
}

export interface NavSection {
    title: string;
    items: NavItem[];
}

export interface Category {
    id: string;
    label: string;
    icon: LucideIcon;
    paths: string[];
    defaultPath: string;
    sections: string[]; // Section titles that belong to this category
}

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

// ============================================================================
// NAVIGATION SECTIONS
// ============================================================================

export const NAV_SECTIONS: Record<string, NavSection> = {
    OVERVIEW: {
        title: 'OVERVIEW',
        items: [
            { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        ],
    },
    CONTENT: {
        title: 'CONTENT',
        items: [
            { label: 'Articles', href: '/admin/articles', icon: FileText },
            { label: 'Pillar Pages', href: '/admin/pillar-pages', icon: File },
            { label: 'Authors', href: '/admin/authors', icon: Users },
            { label: 'Categories', href: '/admin/categories', icon: Tag },
            { label: 'Tags', href: '/admin/tags', icon: Tag },
            { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
        ],
    },
    PLANNING: {
        title: 'PLANNING',
        items: [
            { label: 'Content Calendar', href: '/admin/content-calendar', icon: Calendar },
        ],
    },
    AUTOMATION: {
        title: 'AUTOMATION',
        items: [
            { label: 'Content Factory', href: '/admin/content-factory', icon: Factory },
            { label: 'Automation Hub', href: '/admin/automation', icon: Rss },
            { label: 'Workflows', href: '/admin/workflows', icon: Workflow },
            { label: 'AI Personas', href: '/admin/ai-personas', icon: Users },
            { label: 'Pipeline Monitor', href: '/admin/pipeline-monitor', icon: Activity },
            { label: 'Review Queue', href: '/admin/review-queue', icon: CheckSquare },
        ],
    },
    PIPELINE: {
        title: 'PIPELINE',
        items: [
            { label: 'Pipeline Dashboard', href: '/admin/cms', icon: Sparkles },
            { label: 'Budget', href: '/admin/cms/budget', icon: Wallet },
            { label: 'Generation', href: '/admin/cms/generation', icon: PlayCircle },
            { label: 'Health', href: '/admin/cms/health', icon: HeartPulse },
            { label: 'Scrapers', href: '/admin/cms/scrapers', icon: Rss },
        ],
    },
    INSIGHTS: {
        title: 'INSIGHTS',
        items: [
            { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
            { label: 'Metrics', href: '/admin/metrics', icon: Activity },
            { label: 'SEO Health', href: '/admin/seo', icon: Activity },
            { label: 'SEO Rankings', href: '/admin/seo/rankings', icon: BarChart3 },
            { label: 'Experiments', href: '/admin/seo/experiments', icon: FlaskConical },
        ],
    },
    MONETIZATION: {
        title: 'MONETIZATION',
        items: [
            { label: 'Revenue Dashboard', href: '/admin/revenue', icon: DollarSign },
            { label: 'Revenue Intelligence', href: '/admin/revenue/intelligence', icon: TrendingUp },
            { label: 'Product Catalog', href: '/admin/products', icon: Package },
            { label: 'Product Analytics', href: '/admin/product-analytics', icon: BarChart3 },
            { label: 'Affiliates', href: '/admin/affiliates', icon: DollarSign },
            { label: 'Ads', href: '/admin/ads', icon: Megaphone },
        ],
    },
    SYSTEM: {
        title: 'SYSTEM',
        items: [
            { label: 'Users', href: '/admin/users', icon: Users },
            { label: 'Autonomy', href: '/admin/autonomy', icon: Bot },
            { label: 'Design System', href: '/admin/design-system', icon: Palette },
            { label: 'Editorial QA', href: '/admin/editorial-qa', icon: UserCheck },
            { label: 'Email Dashboard', href: '/admin/email-dashboard', icon: Mail },
            { label: 'Growth Dashboard', href: '/admin/growth-dashboard', icon: TrendingUp },
            { label: 'Performance', href: '/admin/performance-dashboard', icon: Activity },
            { label: 'Social Dashboard', href: '/admin/social-dashboard', icon: Users },
            { label: 'Pipeline Health', href: '/admin/pipeline', icon: LineChart },
            { label: 'Data Accuracy', href: '/admin/data-accuracy', icon: Database },
            { label: 'Ops Health', href: '/admin/ops-health', icon: HeartPulse },
        ],
    },
    SETTINGS: {
        title: 'SETTINGS',
        items: [
            { label: 'General', href: '/admin/settings', icon: Settings },
            { label: 'Secure Vault', href: '/admin/settings/vault', icon: Shield },
            { label: 'User Guide', href: '/admin/guide', icon: FileText },
        ],
    },
};

// ============================================================================
// CATEGORIES
// ============================================================================

export const CATEGORIES: Category[] = [
    {
        id: 'overview',
        label: 'Overview',
        icon: LayoutDashboard,
        defaultPath: '/admin',
        sections: ['OVERVIEW'],
        paths: ['/admin', '/admin/content-calendar'],
    },
    {
        id: 'content',
        label: 'Content',
        icon: FileText,
        defaultPath: '/admin/articles',
        sections: ['CONTENT', 'PLANNING'],
        paths: [
            '/admin/articles',
            '/admin/pillar-pages',
            '/admin/authors',
            '/admin/categories',
            '/admin/tags',
            '/admin/media',
            '/admin/content-calendar',
        ],
    },
    {
        id: 'automation',
        label: 'Automation',
        icon: Zap,
        defaultPath: '/admin/content-factory',
        sections: ['AUTOMATION'],
        paths: [
            '/admin/content-factory',
            '/admin/automation',
            '/admin/automation/batch',
            '/admin/workflows',
            '/admin/ai-personas',
            '/admin/pipeline-monitor',
            '/admin/review-queue',
        ],
    },
    {
        id: 'cms',
        label: 'CMS Pipeline',
        icon: Sparkles,
        defaultPath: '/admin/cms',
        sections: ['PIPELINE'],
        paths: [
            '/admin/cms',
            '/admin/cms/budget',
            '/admin/cms/generation',
            '/admin/cms/health',
            '/admin/cms/scrapers',
        ],
    },
    {
        id: 'insights',
        label: 'Insights',
        icon: BarChart3,
        defaultPath: '/admin/analytics',
        sections: ['INSIGHTS'],
        paths: [
            '/admin/analytics',
            '/admin/metrics',
            '/admin/seo',
            '/admin/seo/experiments',
            '/admin/seo/rankings',
        ],
    },
    {
        id: 'monetization',
        label: 'Monetization',
        icon: DollarSign,
        defaultPath: '/admin/revenue',
        sections: ['MONETIZATION'],
        paths: [
            '/admin/revenue',
            '/admin/revenue/intelligence',
            '/admin/products',
            '/admin/product-analytics',
            '/admin/affiliates',
            '/admin/ads',
        ],
    },
    {
        id: 'system',
        label: 'System',
        icon: Settings,
        defaultPath: '/admin/design-system',
        sections: ['SYSTEM'],
        paths: [
            '/admin/users',
            '/admin/autonomy',
            '/admin/autonomy/settings',
            '/admin/design-system',
            '/admin/editorial-qa',
            '/admin/email-dashboard',
            '/admin/growth-dashboard',
            '/admin/performance-dashboard',
            '/admin/social-dashboard',
            '/admin/pipeline',
            '/admin/data-accuracy',
            '/admin/ops-health',
        ],
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        defaultPath: '/admin/settings',
        sections: ['SETTINGS'],
        paths: [
            '/admin/settings',
            '/admin/settings/vault',
            '/admin/guide',
        ],
    },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the active category based on current pathname.
 * Uses most-specific match: /admin/articles -> content, not overview.
 */
export function getActiveCategory(pathname: string | null): string {
    if (!pathname) return 'overview';
    
    const normalized = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    if (normalized === '/admin') return 'overview';
    
    let bestMatch: { categoryId: string; pathLength: number } | null = null;
    
    for (const category of CATEGORIES) {
        for (const path of category.paths) {
            if (path === '/admin') continue; // avoid matching /admin for everything
            if (normalized === path || normalized.startsWith(path + '/')) {
                const len = path.length;
                if (!bestMatch || len > bestMatch.pathLength) {
                    bestMatch = { categoryId: category.id, pathLength: len };
                }
            }
        }
    }
    
    return bestMatch?.categoryId ?? 'overview';
}

/**
 * Get sections for a specific category
 */
export function getCategorySections(categoryId: string): NavSection[] {
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (!category) return [];
    
    return category.sections
        .map(sectionTitle => NAV_SECTIONS[sectionTitle])
        .filter(Boolean);
}

/**
 * Get all navigation sections (for when filtering is disabled)
 */
export function getAllSections(): NavSection[] {
    return Object.values(NAV_SECTIONS);
}

/**
 * Generate breadcrumbs from pathname
 */
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Admin', href: '/admin' }
    ];
    
    if (!pathname || pathname === '/admin' || pathname === '/admin/') {
        return breadcrumbs;
    }
    
    // Remove /admin prefix and split
    const parts = pathname.replace('/admin/', '').split('/').filter(Boolean);
    
    // Build breadcrumbs
    let currentPath = '/admin';
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        currentPath += `/${part}`;
        
        // Try to find a matching nav item for better labels
        let label = part.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        // Check if this is a known route
        for (const section of Object.values(NAV_SECTIONS)) {
            const item = section.items.find(item => item.href === currentPath);
            if (item) {
                label = item.label;
                break;
            }
        }
        
        // Last item shouldn't be a link
        breadcrumbs.push({
            label,
            href: i === parts.length - 1 ? undefined : currentPath
        });
    }
    
    return breadcrumbs;
}

/**
 * Get category by ID
 */
export function getCategoryById(categoryId: string): Category | undefined {
    return CATEGORIES.find(c => c.id === categoryId);
}

/**
 * Get all routes mapped to categories (for validation)
 */
export function getAllMappedRoutes(): string[] {
    return CATEGORIES.flatMap(c => c.paths);
}

/**
 * Validate that all nav items are mapped to categories
 */
export function validateNavigation(): { valid: boolean; unmappedRoutes: string[] } {
    const allRoutes = getAllMappedRoutes();
    const navRoutes = Object.values(NAV_SECTIONS).flatMap(section => 
        section.items.map(item => item.href)
    );
    
    const unmappedRoutes = navRoutes.filter(route => !allRoutes.includes(route));
    
    return {
        valid: unmappedRoutes.length === 0,
        unmappedRoutes
    };
}
