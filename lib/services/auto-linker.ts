/**
 * Automatic Glossary Interlinking Service
 * 
 * Intelligently detects and links glossary terms across all platform content:
 * - Articles
 * - Product descriptions
 * - Calculator descriptions
 * - Any HTML content
 * 
 * Features:
 * - First occurrence linking only (not spammy)
 * - Skip code blocks, existing links, headings
 * - Add hover tooltips with definitions
 * - Fast lookup with indexed terms
 */

import { createClient } from '@/lib/supabase/client';
import * as cheerio from 'cheerio';

interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  category: string;
}

interface GlossaryIndex {
  [key: string]: GlossaryTerm;
}

export class AutoLinker {
  private glossaryIndex: GlossaryIndex = {};
  private initialized: boolean = false;

  /**
   * Initialize the glossary index
   * Call this once at startup or periodically to refresh
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    const supabase = createClient();
    const { data: terms } = await supabase
      .from('glossary_terms')
      .select('term, slug, definition, category')
      .eq('status', 'published');

    if (!terms) return;

    // Build fast lookup index
    terms.forEach(term => {
      // Index by lowercase term
      const key = term.term.toLowerCase();
      this.glossaryIndex[key] = term;

      // Also index acronyms separately if they exist
      // e.g., "SIP (Systematic Investment Plan)" -> index both "sip" and "systematic investment plan"
      const acronymMatch = term.term.match(/^([A-Z]+)\s*\(/);
      if (acronymMatch) {
        const acronym = acronymMatch[1].toLowerCase();
        this.glossaryIndex[acronym] = term;
      }

      // Index full form if it exists in parentheses
      const fullFormMatch = term.term.match(/\(([^)]+)\)/);
      if (fullFormMatch) {
        const fullForm = fullFormMatch[1].toLowerCase();
        this.glossaryIndex[fullForm] = term;
      }
    });

    this.initialized = true;
    console.log(`✅ AutoLinker initialized with ${Object.keys(this.glossaryIndex).length} term variations`);
  }

  /**
   * Link glossary terms in HTML content
   * 
   * @param html - HTML content to process
   * @param options - Linking options
   * @returns HTML with glossary terms linked
   */
  linkContent(html: string, options: {
    maxLinksPerTerm?: number;
    skipSelectors?: string[];
    addTooltips?: boolean;
  } = {}): string {
    const {
      maxLinksPerTerm = 1, // Link first occurrence only by default
      skipSelectors = ['code', 'pre', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      addTooltips = true
    } = options;

    if (!this.initialized) {
      console.warn('AutoLinker not initialized. Call initialize() first.');
      return html;
    }

    const $ = cheerio.load(html);
    const linkedTerms = new Map<string, number>(); // Track how many times each term is linked

    // Process text nodes in paragraphs, list items, and table cells
    $('p, li, td, div').each((_, elem) => {
      const $elem = $(elem);
      
      // Skip if this element or its parents match skip selectors
      if (skipSelectors.some(selector => $elem.is(selector) || $elem.parents(selector).length > 0)) {
        return;
      }

      let html = $elem.html() || '';
      
      // Sort terms by length (longest first) to avoid partial matches
      const sortedTerms = Object.keys(this.glossaryIndex).sort((a, b) => b.length - a.length);

      sortedTerms.forEach(termKey => {
        const term = this.glossaryIndex[termKey];
        const linkCount = linkedTerms.get(term.slug) || 0;

        // Skip if we've already linked this term enough times
        if (linkCount >= maxLinksPerTerm) return;

        // Create regex for word boundary matching (case-insensitive)
        const regex = new RegExp(`\\b(${this.escapeRegex(termKey)})\\b`, 'gi');
        
        // Check if term exists in the text
        if (!regex.test(html)) return;

        // Reset regex
        regex.lastIndex = 0;

        // Replace with link
        const tooltipAttr = addTooltips 
          ? `data-tooltip="${this.escapeHtml(term.definition.substring(0, 150))}..." data-tooltip-category="${term.category}"`
          : '';

        html = html.replace(regex, (match) => {
          // Don't replace if already inside a link or other HTML tag
          const beforeMatch = html.substring(0, html.indexOf(match));
          const openTags = (beforeMatch.match(/<[^>]+>/g) || []).length;
          const closeTags = (beforeMatch.match(/<\/[^>]+>/g) || []).length;
          
          // If we're inside a tag, skip
          if (openTags !== closeTags) return match;

          linkedTerms.set(term.slug, (linkedTerms.get(term.slug) || 0) + 1);

          return `<a href="/glossary/${term.slug}" class="glossary-link" ${tooltipAttr}>${match}</a>`;
        });
      });

      $elem.html(html);
    });

    return $.html();
  }

  /**
   * Escape special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Escape HTML for attributes
   */
  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Get glossary term by slug
   */
  getTerm(slug: string): GlossaryTerm | undefined {
    return Object.values(this.glossaryIndex).find(term => term.slug === slug);
  }

  /**
   * Search for terms matching a query
   */
  searchTerms(query: string, limit: number = 10): GlossaryTerm[] {
    const lowerQuery = query.toLowerCase();
    const results: GlossaryTerm[] = [];
    const seen = new Set<string>();

    Object.values(this.glossaryIndex).forEach(term => {
      if (seen.has(term.slug)) return;
      
      if (term.term.toLowerCase().includes(lowerQuery) || 
          term.definition.toLowerCase().includes(lowerQuery)) {
        results.push(term);
        seen.add(term.slug);
      }
    });

    return results.slice(0, limit);
  }

  /**
   * Get all terms for a category
   */
  getTermsByCategory(category: string): GlossaryTerm[] {
    const results: GlossaryTerm[] = [];
    const seen = new Set<string>();

    Object.values(this.glossaryIndex).forEach(term => {
      if (seen.has(term.slug)) return;
      
      if (term.category === category) {
        results.push(term);
        seen.add(term.slug);
      }
    });

    return results;
  }
}

// Singleton instance
let autoLinkerInstance: AutoLinker | null = null;

/**
 * Get the singleton AutoLinker instance
 */
export async function getAutoLinker(): Promise<AutoLinker> {
  if (!autoLinkerInstance) {
    autoLinkerInstance = new AutoLinker();
    await autoLinkerInstance.initialize();
  }
  return autoLinkerInstance;
}

/**
 * Convenience function to link content
 */
export async function linkGlossaryTerms(html: string, options?: Parameters<AutoLinker['linkContent']>[1]): Promise<string> {
  const linker = await getAutoLinker();
  return linker.linkContent(html, options);
}
