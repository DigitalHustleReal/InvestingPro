/**
 * Citation Management Utilities
 * 
 * Parse, validate, and format citations from content
 */

import type { Citation } from '@/components/content/Citations';

/**
 * Parse citations from markdown content
 * 
 * Supports formats:
 * - [1] Inline citation
 * - [citation 1] Named citation
 * - (source: RBI) Inline source
 */
export function parseCitations(content: string): {
    citationMarkers: number[];
    inlineSources: string[];
} {
    const citationMarkers: number[] = [];
    const inlineSources: string[] = [];
    
    // Find numbered citations [1], [2], etc.
    const numberPattern = /\[(\d+)\]/g;
    let match;
    while ((match = numberPattern.exec(content)) !== null) {
        const num = parseInt(match[1], 10);
        if (!citationMarkers.includes(num)) {
            citationMarkers.push(num);
        }
    }
    
    // Find inline sources (source: X)
    const sourcePattern = /\(source:\s*([^)]+)\)/gi;
    while ((match = sourcePattern.exec(content)) !== null) {
        const source = match[1].trim();
        if (!inlineSources.includes(source)) {
            inlineSources.push(source);
        }
    }
    
    return {
        citationMarkers: citationMarkers.sort((a, b) => a - b),
        inlineSources
    };
}

/**
 * Validate citation numbering
 * 
 * Ensures citations are sequential and all referenced
 */
export function validateCitationNumbering(
    content: string,
    citations: Citation[]
): {
    valid: boolean;
    errors: string[];
    warnings: string[];
} {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    const { citationMarkers } = parseCitations(content);
    
    // Check if citations are sequential
    for (let i = 0; i < citationMarkers.length; i++) {
        const expected = i + 1;
        if (citationMarkers[i] !== expected) {
            errors.push(`Citation numbering not sequential: found [${citationMarkers[i]}], expected [${expected}]`);
        }
    }
    
    // Check if all citations in content have corresponding citation objects
    for (const marker of citationMarkers) {
        if (!citations.find(c => c.id === marker)) {
            errors.push(`Citation [${marker}] referenced in content but not defined in citation list`);
        }
    }
    
    // Check if all citation objects are used in content
    for (const citation of citations) {
        if (!citationMarkers.includes(citation.id)) {
            warnings.push(`Citation [${citation.id}] defined but not used in content`);
        }
    }
    
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Generate citation list from URLs
 * 
 * Helper to quickly create citation objects
 */
export function generateCitationList(sources: Array<{
    title: string;
    url: string;
    source: string;
}>): Citation[] {
    return sources.map((source, index) => ({
        id: index + 1,
        title: source.title,
        url: source.url,
        source: source.source,
        accessDate: new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }));
}

/**
 * Format citation in different styles
 */
export function formatCitation(
    citation: Citation,
    style: 'APA' | 'MLA' | 'Chicago' = 'APA'
): string {
    const accessDate = citation.accessDate || new Date().toLocaleDateString();
    
    switch (style) {
        case 'APA':
            return `${citation.source}. ${citation.title}. Retrieved ${accessDate}, from ${citation.url}`;
        
        case 'MLA':
            return `"${citation.title}." ${citation.source}. Web. ${accessDate}. <${citation.url}>`;
        
        case 'Chicago':
            return `${citation.source}. "${citation.title}." Accessed ${accessDate}. ${citation.url}.`;
        
        default:
            return `${citation.title} - ${citation.source}. ${citation.url}`;
    }
}

/**
 * Extract citation count from content
 */
export function getCitationCount(content: string): number {
    const { citationMarkers } = parseCitations(content);
    return citationMarkers.length;
}

/**
 * Check if content has sufficient citations
 */
export function hasSufficientCitations(
    content: string,
    minCitations: number = 3
): {
    sufficient: boolean;
    count: number;
    required: number;
} {
    const count = getCitationCount(content);
    
    return {
        sufficient: count >= minCitations,
        count,
        required: minCitations
    };
}
