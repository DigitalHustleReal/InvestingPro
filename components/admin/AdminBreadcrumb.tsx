'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

// Route to label mapping
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
    'seo': 'SEO Health',
    'experiments': 'Experiments',
    'products': 'Products',
    'affiliates': 'Affiliates',
    'ads': 'Ads',
    'settings': 'Settings',
    'vault': 'Secure Vault',
    'design-system': 'Design System',
    'users': 'Users',
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
        <nav className="flex items-center gap-1.5 text-sm mb-6" aria-label="Breadcrumb">
            <Link 
                href="/admin" 
                className="flex items-center gap-1 text-muted-foreground/70 dark:text-muted-foreground/70 hover:text-primary-600 transition-colors"
            >
                <Home className="w-4 h-4" />
            </Link>
            
            {items.slice(1).map((item, index) => (
                <div key={index} className="flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
                    {item.href ? (
                        <Link 
                            href={item.href} 
                            className="text-muted-foreground/70 dark:text-muted-foreground/70 hover:text-primary-600 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-slate-900 font-medium">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
