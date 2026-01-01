/**
 * Markdown ↔ HTML Conversion Utilities
 * 
 * WHY separate utilities:
 * - Conversion logic is complex and testable
 * - Can be used outside editor context
 * - Supports regeneration of content
 * - Handles edge cases consistently
 * 
 * CONVERSION FLOW:
 * - Markdown → HTML (for editor loading)
 * - HTML → Markdown (for storage)
 * - TipTap → HTML (for storage)
 * 
 * NOTE: Markdown is PRIMARY, HTML is DERIVED
 */

import { Editor } from '@tiptap/core';
import TurndownService from 'turndown';
import { marked } from 'marked';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import HardBreak from '@tiptap/extension-hard-break';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { SemanticImage } from '@/components/admin/extensions/SemanticImage';

// Configure Turndown for HTML → Markdown
const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
});

// Configure marked for Markdown → HTML
marked.setOptions({
    breaks: true,
    gfm: true,
});

/**
 * Convert Markdown to HTML
 * 
 * WHY this approach:
 * - TipTap editor works with HTML natively
 * - Marked library handles markdown parsing reliably
 * - Preserves all formatting and structure
 * - Used when loading body_markdown (PRIMARY)
 */
export function markdownToHTML(markdown: string): string {
    if (!markdown?.trim()) {
        return '';
    }

    try {
        const html = marked.parse(markdown) as string;
        return html || '';
    } catch (error) {
        console.error('Error converting markdown to HTML:', error);
        return '';
    }
}

/**
 * Convert HTML to Markdown
 * 
 * WHY this approach:
 * - Turndown handles HTML to markdown conversion
 * - Preserves formatting (headings, lists, links, etc.)
 * - Handles edge cases (tables, images, etc.)
 * - Used when saving (HTML → Markdown for storage)
 */
export function htmlToMarkdown(html: string): string {
    if (!html?.trim()) {
        return '';
    }

    try {
        const markdown = turndownService.turndown(html);
        return markdown || '';
    } catch (error) {
        console.error('Error converting HTML to markdown:', error);
        return '';
    }
}

/**
 * Convert TipTap Editor to HTML
 * 
 * WHY this approach:
 * - TipTap's getHTML() is reliable
 * - Preserves all formatting
 * - HTML is DERIVED from markdown (not primary)
 * - Used when saving (TipTap → HTML for storage)
 */
export function tiptapToHTML(editor: Editor): string {
    try {
        return editor.getHTML();
    } catch (error) {
        console.error('Error converting TipTap to HTML:', error);
        return '';
    }
}

