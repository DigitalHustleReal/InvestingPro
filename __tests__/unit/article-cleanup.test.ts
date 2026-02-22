/**
 * Unit Tests: Empty Article Cleanup Logic
 *
 * Tests the filter logic used by the empty-article cleanup API.
 * No DB, no network — tests pure JavaScript filtering behaviour.
 */

// ── Types matching the handler ────────────────────────────────────────────────

interface MockArticle {
  id: string;
  title: string | null;
  content: string | null;
  status: string | null;
  created_at: string;
}

/** Mirror of handler logic — pull out so it's testable */
const EMPTY_THRESHOLD_CHARS = 300;

function isEmptyArticle(a: MockArticle): boolean {
  const trimmed = (a.content || '').trim();
  return trimmed.length < EMPTY_THRESHOLD_CHARS;
}

function selectEmptyArticles(rows: MockArticle[]): MockArticle[] {
  // Never touch published — same guard as the API
  return rows
    .filter(a => a.status !== 'published')
    .filter(isEmptyArticle);
}

// ── Fixtures ─────────────────────────────────────────────────────────────────

const RICH_CONTENT = 'A'.repeat(EMPTY_THRESHOLD_CHARS); // exactly @ threshold — NOT empty
const THIN_CONTENT = 'A'.repeat(EMPTY_THRESHOLD_CHARS - 1); // one char below — IS empty

function article(overrides: Partial<MockArticle> = {}): MockArticle {
  return {
    id:         'test-id',
    title:      'Test Article',
    content:    RICH_CONTENT,
    status:     'draft',
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('empty article filter logic', () => {

  // ── isEmptyArticle ──────────────────────────────────────────────────────────

  describe('isEmptyArticle', () => {
    it('returns true for null content', () => {
      expect(isEmptyArticle(article({ content: null }))).toBe(true);
    });

    it('returns true for empty string content', () => {
      expect(isEmptyArticle(article({ content: '' }))).toBe(true);
    });

    it('returns true for whitespace-only content', () => {
      expect(isEmptyArticle(article({ content: '   \n\t  ' }))).toBe(true);
    });

    it('returns true for content below threshold', () => {
      expect(isEmptyArticle(article({ content: THIN_CONTENT }))).toBe(true);
    });

    it('returns false for content at exactly the threshold', () => {
      expect(isEmptyArticle(article({ content: RICH_CONTENT }))).toBe(false);
    });

    it('returns false for content above the threshold', () => {
      expect(isEmptyArticle(article({ content: 'A'.repeat(500) }))).toBe(false);
    });

    it('trims whitespace before checking length', () => {
      // Padded with spaces — actual content chars are below threshold
      const paddedThin = ' '.repeat(200) + 'B'.repeat(50) + ' '.repeat(200);
      expect(isEmptyArticle(article({ content: paddedThin }))).toBe(true);
    });
  });

  // ── selectEmptyArticles ─────────────────────────────────────────────────────

  describe('selectEmptyArticles', () => {
    it('returns empty array when all articles have rich content', () => {
      const rows = [
        article({ id: '1', content: 'A'.repeat(500) }),
        article({ id: '2', content: 'B'.repeat(400) }),
      ];
      expect(selectEmptyArticles(rows)).toHaveLength(0);
    });

    it('returns empty articles from a mixed list', () => {
      const rows = [
        article({ id: '1', content: RICH_CONTENT }),   // OK
        article({ id: '2', content: THIN_CONTENT }),   // empty
        article({ id: '3', content: null }),            // empty
      ];
      const result = selectEmptyArticles(rows);
      expect(result).toHaveLength(2);
      expect(result.map(r => r.id)).toContain('2');
      expect(result.map(r => r.id)).toContain('3');
    });

    it('NEVER selects published articles regardless of content', () => {
      const rows = [
        article({ id: 'pub', content: null, status: 'published' }),   // published + empty → must skip
        article({ id: 'drft', content: null, status: 'draft' }),      // draft + empty   → must include
      ];
      const result = selectEmptyArticles(rows);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('drft');
    });

    it('selects articles with status "pending" if content is thin', () => {
      const rows = [
        article({ id: 'p', content: THIN_CONTENT, status: 'pending' }),
      ];
      expect(selectEmptyArticles(rows)).toHaveLength(1);
    });

    it('selects articles with null status if content is thin', () => {
      const rows = [
        article({ id: 'n', content: THIN_CONTENT, status: null }),
      ];
      expect(selectEmptyArticles(rows)).toHaveLength(1);
    });

    it('returns empty array for an empty input', () => {
      expect(selectEmptyArticles([])).toHaveLength(0);
    });
  });
});
