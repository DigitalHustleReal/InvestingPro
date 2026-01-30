'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

// Route to label mapping (full admin route coverage for breadcrumbs)
const routeLabels: Record<string, string> = {
    'admin': 'Dashboard',
    'articles': 'Articles',
    'new': 'New',
    'edit': 'Edit',
    'pillar-pages': 'Pillar Pages',
    'authors': 'Authors',
    'categories': 'Categories',
    'tags': 'Tags',
    'media': 'Media Library',
    'content-factory': 'Content Factory',
    'automation': 'Automation Hub',
    'review-queue': 'Review Queue',
    'content-calendar': 'Content Calendar',
    'analytics': 'Analytics',
    'metrics': 'Metrics',
    'seo': 'SEO',
    'experiments': 'Experiments',
    'rankings': 'Rankings',
    'products': 'Products',
    'affiliates': 'Affiliates',
    'ads': 'Ads',
    'revenue': 'Revenue',
    'intelligence': 'Intelligence',
    'settings': 'Settings',
    'vault': 'Secure Vault',
    'guide': 'User Guide',
    'design-system': 'Design System',
    'users': 'Users',
    'cms': 'CMS',
    'budget': 'Budget',
    'generation': 'Generation',
    'health': 'Health',
    'scrapers': 'Scrapers',
    'workflows': 'Workflows',
    'pipeline-monitor': 'Pipeline Monitor',
    'ai-personas': 'AI Personas',
    'ops-health': 'Ops Health',
    'performance-dashboard': 'Performance',
    'growth-dashboard': 'Growth',
    'social-dashboard': 'Social',
    'editorial-qa': 'Editorial QA',
    'email-dashboard': 'Email',
    'product-analytics': 'Product Analytics',
    'autonomy': 'Autonomy',
    'data-accuracy': 'Data Accuracy',
    'pipeline': 'Pipeline Health',
    'batch': 'Batch',
    'intelligence': 'Intelligence',
};

export function AdminBreadcrumb() {
    const pathname = usePathname();
    
    if (!pathname) return null;
    
    const segments = pathname.split('/').filter(Boolean);
    
    // Build breadcrumb items
    const items: BreadcrumbItem[] = segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;
        const isUUID = segment.match(/^[0-9a-f-]{36}$/i);
        
        let label = routeLabels[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        
        // Handle UUIDs - show as "Item #" or omit
        if (isUUID) {
            label = 'Current Item';
        }
        
        return {
            label,
            href: isLast ? undefined : href,
        };
    });

    if (items.length <= 1) return null;

    return (
        <nav className="flex items-center gap-1.5 text-sm text-admin-pro-text-muted" aria-label="Breadcrumb">
            <Link href="/admin" className="hover:text-admin-pro-accent transition-colors">
                <Home className="w-4 h-4" />
            </Link>
            {items.slice(1).map((item, index) => (
                <div key={index} className="flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-admin-pro-text-dim" />
                    {item.href ? (
                        <Link href={item.href} className="hover:text-admin-pro-accent transition-colors">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-admin-pro-text font-medium">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
