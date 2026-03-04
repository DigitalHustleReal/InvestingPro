
import * as cheerio from 'cheerio';
import { logger } from '@/lib/logger';
import { GOLDEN_KEYWORDS, GoldenKeyword } from './golden-keywords';

/**
 * Content Enrichment Utility
 * 
 * Handles:
 * 1. Shortcode expansion (e.g. [sip-calculator] -> Widget placeholder)
 * 2. Automated Internal Linking (Golden Keywords)
 * 3. Responsive Table Wrapping
 */

export class AutoLinker {
    private keywords: GoldenKeyword[];

    constructor() {
        // Sort by priority (desc) then length (desc) to match longest/most important first
        this.keywords = [...GOLDEN_KEYWORDS].sort((a, b) => {
            if (b.priority !== a.priority) return b.priority - a.priority;
            return b.keyword.length - a.keyword.length;
        });
    }

    public injectLinks(html: string): string {
        if (!html) return '';
        const $ = cheerio.load(html, { xmlMode: false }); // Use HTML mode
        
        // Track linked keywords to prevent duplicate links
        const linkedKeywords = new Set<string>();

        // Traverse text nodes
        $('body').find('*').contents().each((_, node) => {
            if (node.type === 'text') {
                const parent = node.parent as any;
                const parentTag = parent.tagName?.toLowerCase();

                if (['a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'script', 'style', 'code', 'pre', 'button'].includes(parentTag)) {
                    return;
                }

                let text = node.data || '';
                if (!text.trim()) return;

                // Identification Phase: Find all valid non-overlapping matches in this node
                const matches: { start: number; end: number; html: string; keyword: string }[] = [];

                for (const item of this.keywords) {
                    if (linkedKeywords.has(item.keyword)) continue;

                    const variants = [item.keyword, ...(item.variants || [])];
                    const pattern = new RegExp(`\\b(${variants.join('|')})\\b`, 'i');
                    
                    const match = pattern.exec(text);
                    if (match) {
                        const start = match.index;
                        const end = start + match[0].length;
                        
                        // Check for overlap with existing scheduled matches
                        const isOverlap = matches.some(m => 
                            (start >= m.start && start < m.end) || 
                            (end > m.start && end <= m.end) ||
                            (start <= m.start && end >= m.end)
                        );

                        if (!isOverlap) {
                            const matchedText = match[0];
                            const linkHtml = `<a href="${item.url}" class="text-primary hover:underline font-medium" title="Learn more about ${item.keyword}">${matchedText}</a>`;
                            
                            matches.push({ start, end, html: linkHtml, keyword: item.keyword });
                            linkedKeywords.add(item.keyword); // Mark as used
                        }
                    }
                }

                // Application Phase: Apply matches from end to start to preserve indices
                if (matches.length > 0) {
                    matches.sort((a, b) => b.start - a.start);
                    
                    let newHtml = text;
                    matches.forEach(m => {
                        const before = newHtml.substring(0, m.start);
                        const after = newHtml.substring(m.end);
                        newHtml = before + m.html + after;
                    });
                    
                    $(node).replaceWith(newHtml);
                }
            }
        });

        // Return the body HTML
        return $('body').html() || '';
    }
}

// Singleton instance
const autoLinker = new AutoLinker();

export function injectInternalLinks(html: string): string {
    return autoLinker.injectLinks(html);
}

export function enrichContent(html: string): string {
    if (!html) return '';
    
    let enriched = html;

    // 1. Calculator Shortcodes & Widgets
    enriched = enriched.replace(
        /\[sip-calculator\]/gi, 
        '<div data-widget="sip-calculator" class="my-8 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-center text-slate-500">Loading Calculator...</div>'
    );
     enriched = enriched.replace(
        /\[auto-calculator\]/gi, 
        '<div data-widget="auto-calculator" class="my-8 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-center text-slate-500">Loading Suggested Tool...</div>'
    );

    // 2. Automagic Internal Linking
    try {
        enriched = autoLinker.injectLinks(enriched);
    } catch (e) {
        logger.error("AutoLinker failed", e);
        // Fallback: return original (widget-enriched) html
    }

    // 3. Fallback for Static Links (Affiliates etc - Legacy)
    const LEGACY_LINKS = [
        { key: 'Zerodha', url: 'https://zerodha.com/?c=DEMO', rel: 'nofollow noopener' },
        { key: 'Contact Us', url: '/contact', rel: '' }
    ];

    LEGACY_LINKS.forEach(link => {
        // Only link if not already linked (simple check)
        if (!enriched.includes(`href="${link.url}"`)) {
            const regex = new RegExp(`\\b(${link.key})\\b(?!([^<]+)?>)`, 'gi'); 
            enriched = enriched.replace(regex, (match) => {
                return `<a href="${link.url}" class="text-primary hover:underline" ${link.rel ? `rel="${link.rel}" target="_blank"` : ''}>${match}</a>`;
            });
        }
    });
    
    // 4. Responsive Tables
    enriched = enriched.replace(/<table/gi, '<div class="overflow-x-auto w-full my-8 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"><table');
    enriched = enriched.replace(/<\/table>/gi, '</table></div>');
    
    return enriched;
}
