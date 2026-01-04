/**
 * Visual Generator Utility
 * 
 * Auto-generates standardized visuals for:
 * - Hero graphics per category
 * - Explainer diagrams
 * - Calculator visuals
 * - SEO images
 */

import { CategoryHeroProps, ExplainerDiagramProps, CalculatorVisualProps } from './types';

/**
 * Generate hero graphic for category
 */
export function generateCategoryHero(props: CategoryHeroProps): string {
    // Returns SVG data URL for use in img src
    // In production, this would generate actual SVG
    return generateCategorySVG(props);
}

/**
 * Generate explainer diagram
 */
export function generateExplainerDiagram(props: ExplainerDiagramProps): string {
    return generateExplainerSVG(props);
}

/**
 * Generate calculator visual
 */
export function generateCalculatorVisual(props: CalculatorVisualProps): string {
    return generateCalculatorSVG(props);
}

/**
 * Generate SEO image (OG image)
 */
export function generateSEOImage(title: string, category?: string): string {
    // Generate a simple SVG-based OG image
    const svg = `
        <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
            <rect width="1200" height="630" fill="#0f172a"/>
            <rect width="1200" height="6" fill="#10b981" y="0"/>
            <text x="600" y="300" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="bold" fill="#f1f5f9" text-anchor="middle">${escapeXml(title)}</text>
            <text x="600" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="#94a3b8" text-anchor="middle">InvestingPro.in</text>
            <rect x="0" y="580" width="1200" height="50" fill="#1e293b"/>
            <text x="600" y="610" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#64748b" text-anchor="middle">Research • Education • Discovery</text>
        </svg>
    `.trim();
    
    // Use encodeURIComponent for browser compatibility
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Generate category-specific SVG
 */
function generateCategorySVG(props: CategoryHeroProps): string {
    const colors = getCategoryColorScheme(props.category);
    
    const svg = `
        <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:0.6" />
                </linearGradient>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${colors.grid}" stroke-width="1" opacity="0.2"/>
                </pattern>
            </defs>
            <rect width="800" height="400" fill="#0f172a"/>
            <rect width="800" height="400" fill="url(#grid)"/>
            <rect x="0" y="0" width="800" height="4" fill="${colors.primary}"/>
            <text x="400" y="200" font-family="system-ui" font-size="36" font-weight="bold" fill="#f1f5f9" text-anchor="middle">${escapeXml(props.title)}</text>
        </svg>
    `.trim();
    
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Generate explainer SVG
 */
function generateExplainerSVG(props: ExplainerDiagramProps): string {
    // Simplified SVG for explainer diagrams
    const svg = `
        <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="400" fill="#ffffff"/>
            <rect width="800" height="4" fill="#10b981"/>
            <text x="400" y="200" font-family="system-ui" font-size="32" font-weight="bold" fill="#0f172a" text-anchor="middle">${escapeXml(props.title)}</text>
        </svg>
    `.trim();
    
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Generate calculator SVG
 */
function generateCalculatorSVG(props: CalculatorVisualProps): string {
    const svg = `
        <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="400" fill="#ffffff"/>
            <rect width="800" height="4" fill="#10b981"/>
            <text x="400" y="200" font-family="system-ui" font-size="28" font-weight="bold" fill="#0f172a" text-anchor="middle">${props.calculatorType} Calculator</text>
        </svg>
    `.trim();
    
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Get color scheme for category
 */
function getCategoryColorScheme(category: string): {
    primary: string;
    secondary: string;
    grid: string;
} {
    const schemes: Record<string, { primary: string; secondary: string; grid: string }> = {
        'credit-cards': { primary: '#6366f1', secondary: '#8b5cf6', grid: '#475569' },
        'loans': { primary: '#10b981', secondary: '#0d9488', grid: '#475569' },
        'banking': { primary: '#3b82f6', secondary: '#06b6d4', grid: '#475569' },
        'investing': { primary: '#14b8a6', secondary: '#10b981', grid: '#475569' },
        'insurance': { primary: '#f59e0b', secondary: '#f97316', grid: '#475569' }, // Amber/Orange instead of red/pink
        'small-business': { primary: '#f59e0b', secondary: '#f97316', grid: '#475569' },
    };
    
    return schemes[category] || { primary: '#64748b', secondary: '#475569', grid: '#334155' };
}

