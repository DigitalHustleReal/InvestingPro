/**
 * Unit Tests: Services
 */

import { normalizeArticleBody } from '@/lib/content/normalize';
import { htmlToMarkdown } from '@/lib/editor/markdown';

describe('Service Unit Tests', () => {
  describe('Content Normalization', () => {
    it('should normalize HTML content', () => {
      const html = '<h1>Test Title</h1><p>Test content</p>';
      const normalized = normalizeArticleBody(html);
      
      expect(normalized).toBeDefined();
      expect(typeof normalized).toBe('string');
    });

    it('should handle empty content', () => {
      const normalized = normalizeArticleBody('');
      expect(normalized).toBe('');
    });

    it('should handle null/undefined content', () => {
      const normalized1 = normalizeArticleBody(null as any);
      const normalized2 = normalizeArticleBody(undefined as any);
      
      expect(normalized1).toBeDefined();
      expect(normalized2).toBeDefined();
    });
  });

  describe('Markdown Conversion', () => {
    it('should convert HTML to markdown', () => {
      const html = '<h1>Title</h1><p>Content</p>';
      const markdown = htmlToMarkdown(html);
      
      expect(markdown).toBeDefined();
      expect(typeof markdown).toBe('string');
    });

    it('should handle empty HTML', () => {
      const markdown = htmlToMarkdown('');
      expect(markdown).toBe('');
    });
  });
});
