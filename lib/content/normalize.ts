/**
 * Content Normalization System
 * 
 * Converts ALL article content to clean, structured HTML
 * that renders perfectly in TipTap/ProseMirror editors.
 * 
 * RULES:
 * - NO markdown symbols (#, ##, ###, **, ---, etc.)
 * - NO plaintext pretending to be headings
 * - ONLY TipTap-safe HTML elements
 * - Idempotent: load → save → reload = no changes
 */

import { marked } from 'marked';
import { logger } from '@/lib/logger';
import { processShortcodes } from './shortcodes';

/**
 * Allowed HTML elements for TipTap
 */
const ALLOWED_ELEMENTS = [
    'h1', 'h2', 'h3',
    'p',
    'ul', 'ol', 'li',
    'strong', 'em',
    'blockquote',
    'hr',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'a', // Hyperlinks allowed
];

/**
 * Normalize article body to clean HTML
 * 
 * Input: markdown, HTML, or plaintext
 * Output: Clean, structured HTML with ONLY allowed elements
 */
export function normalizeArticleBody(input: string | null | undefined): string {
    if (!input || !input.trim()) {
        return '';
    }

    const trimmed = input.trim();

    // Step 1: Convert ALL formats to clean HTML
    let html = '';
    if (isJSON(trimmed)) {
        html = jsonToHTML(trimmed);
    } else if (isMarkdown(trimmed)) {
        // Process shortcodes BEFORE markdown-to-HTML so they survive parsing
        const withShortcodes = processShortcodes(trimmed);
        html = markdownToHTML(withShortcodes);
    } else if (isHTML(trimmed)) {
        html = trimmed;
    } else {
        // Plaintext - wrap in paragraphs
        html = plaintextToHTML(trimmed);
    }

    // Step 2: Clean and normalize HTML
    html = cleanHTML(html);

    // Step 3: Ensure proper structure
    html = enforceStructure(html);

    return html;
}

/**
 * Check if content is markdown
 */
function isMarkdown(content: string): boolean {
    const markdownPatterns = [
        /^#{1,6}\s+/m,           // Headings
        /^\*\*.*\*\*/m,         // Bold
        /^\*.*\*/m,              // Italic
        /^-\s+/m,                // Lists
        /^\d+\.\s+/m,            // Numbered lists
        /^---/m,                 // Horizontal rule
        /^>/m,                   // Blockquote
    ];
    
    return markdownPatterns.some(pattern => pattern.test(content));
}

/**
 * Check if content is HTML
 */
function isHTML(content: string): boolean {
    return /<[a-z][\s\S]*>/i.test(content);
}

/**
 * Check if content is JSON
 */
function isJSON(content: string): boolean {
    try {
        const trimmed = content.trim();
        return (trimmed.startsWith('{') && trimmed.endsWith('}')) || 
               (trimmed.startsWith('[') && trimmed.endsWith(']'));
    } catch {
        return false;
    }
}

/**
 * Convert JSON structured content to HTML
 */
function jsonToHTML(jsonStr: string): string {
    try {
        const parsed = JSON.parse(jsonStr);
        
        // Handle array of sections: [{"section": "...", "details": "..."}, ...]
        if (Array.isArray(parsed)) {
            return parsed.map(item => {
                const heading = item.section || item.heading || item.title || '';
                const body = item.details || item.content || item.body || item.text || '';
                
                let html = '';
                if (heading) {
                    html += `<h2>${escapeHTML(heading)}</h2>\n`;
                }
                if (body) {
                    // Body might be markdown or plaintext
                    html += normalizeArticleBody(body);
                }
                return html;
            }).join('\n\n');
        }
        
        // Handle single object with content field
        if (typeof parsed === 'object' && parsed !== null) {
            const content = parsed.content || parsed.article || parsed.body || parsed.text;
            if (content) {
                if (typeof content === 'string') return normalizeArticleBody(content);
                if (typeof content === 'object') return jsonToHTML(JSON.stringify(content));
            }
        }
        
        return plaintextToHTML(jsonStr);
    } catch (error) {
        logger.error('Error converting JSON to HTML:', error);
        return plaintextToHTML(jsonStr);
    }
}

/**
 * Convert markdown to HTML
 */
function markdownToHTML(markdown: string): string {
    try {
        // Configure marked for clean output
        marked.setOptions({
            breaks: false,
            gfm: true,
        } as Record<string, unknown>);

        const html = marked.parse(markdown) as string;
        return html || '';
    } catch (error) {
        logger.error('Error converting markdown to HTML:', error);
        return '';
    }
}

/**
 * Convert plaintext to HTML
 */
function plaintextToHTML(text: string): string {
    // Split by double newlines (paragraphs)
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
    
    return paragraphs
        .map(p => {
            const trimmed = p.trim();
            // Detect headings (lines that are short and end without punctuation)
            if (trimmed.length < 100 && !trimmed.match(/[.!?]$/)) {
                // Could be a heading - but we'll treat as paragraph for safety
                return `<p>${escapeHTML(trimmed)}</p>`;
            }
            return `<p>${escapeHTML(trimmed)}</p>`;
        })
        .join('\n');
}

/**
 * Clean HTML to only allowed elements
 */
function cleanHTML(html: string): string {
    try {
        // Allowed classes for visual components (all CSS components in article-content.css)
        const ALLOWED_CLASSES = [
            // Core visual boxes
            'key-takeaways', 'pro-tip', 'warning-box', 'quick-verdict',
            // Metric cards
            'metrics-grid', 'metric-card', 'metric-label', 'metric-value', 'metric-description',
            // Comparison grid
            'comparison-grid', 'comparison-card',
            // Portfolio allocation
            'allocation-container', 'allocation-item', 'allocation-bar', 'allocation-bar-fill',
            'item-label', 'item-value',
            // Badges
            'badge', 'badge-success', 'badge-info', 'badge-warning',
            // Tailwind utility classes used in shortcode output
            'text-primary', 'font-medium', 'my-8', 'p-4',
        ];
        
        // Step 1: Remove most attributes but preserve allowed classes
        let cleaned = html;
        
        // Remove class attributes that are NOT in our allowed list
        cleaned = cleaned.replace(/\s+class="([^"]*)"/gi, (match, classes) => {
            const classList = classes.split(/\s+/).filter((c: string) => ALLOWED_CLASSES.includes(c));
            return classList.length > 0 ? ` class="${classList.join(' ')}"` : '';
        });
        cleaned = cleaned.replace(/\s+class='([^']*)'/gi, (match, classes) => {
            const classList = classes.split(/\s+/).filter((c: string) => ALLOWED_CLASSES.includes(c));
            return classList.length > 0 ? ` class='${classList.join(' ')}'` : '';
        });
        
        // Remove style attributes
        cleaned = cleaned.replace(/\s+style="[^"]*"/gi, '');
        cleaned = cleaned.replace(/\s+style='[^']*'/gi, '');
        
        // Remove id attributes
        cleaned = cleaned.replace(/\s+id="[^"]*"/gi, '');
        cleaned = cleaned.replace(/\s+id='[^']*'/gi, '');
        
        // Step 2: Remove invalid elements (replace with content or remove)
        // IMPORTANT: Don't remove divs that have allowed classes
        cleaned = cleaned.replace(/<div([^>]*)>(.*?)<\/div>/gi, (match, attrs, content) => {
            // Check if this div has an allowed class
            const hasAllowedClass = ALLOWED_CLASSES.some(cls => attrs.includes(`class="${cls}"`) || attrs.includes(`class='${cls}'`));
            if (hasAllowedClass) {
                return match; // Keep the div with its class
            }
            return content; // Remove div but keep content
        });
        
        // Replace span with their content
        cleaned = cleaned.replace(/<span[^>]*>(.*?)<\/span>/gi, '$1');
        
        // Remove other invalid elements but keep content
        const invalidTagPattern = new RegExp(
            `<(?!(?:${ALLOWED_ELEMENTS.join('|')}|div)\\b)[a-z]+[^>]*>(.*?)</[^>]+>`,
            'gis'
        );
        cleaned = cleaned.replace(invalidTagPattern, '$1');

        // Step 3: Clean up whitespace
        cleaned = cleaned.replace(/<p>\s*<\/p>/g, ''); // Remove empty paragraphs
        cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n'); // Normalize line breaks
        cleaned = cleaned.replace(/>\s+</g, '>\n<'); // Space between tags

        return cleaned.trim();
    } catch (error) {
        logger.error('Error cleaning HTML:', error);
        // Fallback: strip all tags except allowed ones
        return stripInvalidTags(html);
    }
}

/**
 * Strip invalid tags (fallback method)
 */
function stripInvalidTags(html: string): string {
    // Remove all tags except allowed ones
    const allowedPattern = ALLOWED_ELEMENTS.join('|');
    const regex = new RegExp(`</?(?!${allowedPattern})[^>]+>`, 'gi');
    return html.replace(regex, '');
}

/**
 * Enforce proper HTML structure
 */
function enforceStructure(html: string): string {
    // Ensure no h1 in body (h1 is for title only)
    html = html.replace(/<h1>/gi, '<h2>');
    html = html.replace(/<\/h1>/gi, '</h2>');

    // Ensure all content is wrapped in blocks
    const lines = html.split('\n');
    const structured: string[] = [];
    let inParagraph = false;
    let currentParagraph: string[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        
        if (!trimmed) {
            if (inParagraph && currentParagraph.length > 0) {
                structured.push(`<p>${currentParagraph.join(' ')}</p>`);
                currentParagraph = [];
                inParagraph = false;
            }
            continue;
        }

        // Check if it's already a block element
        if (trimmed.match(/^<(h[1-3]|p|ul|ol|li|blockquote|hr)/i)) {
            if (inParagraph && currentParagraph.length > 0) {
                structured.push(`<p>${currentParagraph.join(' ')}</p>`);
                currentParagraph = [];
            }
            inParagraph = false;
            structured.push(trimmed);
        } else {
            // Text content - collect into paragraph
            inParagraph = true;
            currentParagraph.push(trimmed);
        }
    }

    // Close any open paragraph
    if (inParagraph && currentParagraph.length > 0) {
        structured.push(`<p>${currentParagraph.join(' ')}</p>`);
    }

    return structured.join('\n');
}

/**
 * Escape HTML entities
 */
function escapeHTML(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Validate normalized HTML
 */
export function validateNormalizedHTML(html: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for markdown symbols
    if (/#{1,6}\s/.test(html)) {
        errors.push('Contains markdown headings (#)');
    }
    if (/\*\*.*\*\*/.test(html)) {
        errors.push('Contains markdown bold (**)');
    }
    if (/^-\s+/m.test(html)) {
        errors.push('Contains markdown lists (-)');
    }

    // Check for invalid HTML elements
    const invalidElements = html.match(/<(?!(h[1-3]|p|ul|ol|li|strong|em|blockquote|hr)\b)[a-z]+/gi);
    if (invalidElements) {
        errors.push(`Contains invalid elements: ${invalidElements.join(', ')}`);
    }

    // Check for attributes
    if (/<[^>]+\s+class=/i.test(html)) {
        errors.push('Contains class attributes');
    }
    if (/<[^>]+\s+style=/i.test(html)) {
        errors.push('Contains style attributes');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

