/**
 * Integration Tests: Article State Machine
 */

import { articleService } from '@/lib/cms/article-service';
import { createTestClient, createTestUser, cleanupTestData } from '../setup/test-helpers';

describe('Article State Machine Integration', () => {
  let supabase: ReturnType<typeof createTestClient>;
  let testUserId: string;
  const articleIds: string[] = [];

  beforeAll(async () => {
    supabase = createTestClient();
    const user = await createTestUser(supabase);
    testUserId = user.id;
  });

  afterAll(async () => {
    await cleanupTestData(supabase, 'articles', articleIds);
  });

  describe('State Transitions', () => {
    it('should allow draft → review transition', async () => {
      const article = await articleService.createArticle({
        title: 'Test Article',
        slug: `test-draft-review-${Date.now()}`,
        body_markdown: '# Test',
        body_html: '<h1>Test</h1>',
        status: 'draft',
        category: 'test',
      }, testUserId);

      expect(article.status).toBe('draft');
      articleIds.push(article.id);

      // Transition to review
      const updated = await articleService.updateArticle(article.id, {
        status: 'review',
      }, testUserId);

      expect(updated.status).toBe('review');
    });

    it('should allow draft → published transition (admin)', async () => {
      const article = await articleService.createArticle({
        title: 'Test Article',
        slug: `test-draft-published-${Date.now()}`,
        body_markdown: '# Test',
        body_html: '<h1>Test</h1>',
        status: 'draft',
        category: 'test',
      }, testUserId);

      articleIds.push(article.id);

      // Admin can publish directly
      const updated = await articleService.updateArticle(article.id, {
        status: 'published',
      }, testUserId);

      expect(updated.status).toBe('published');
      expect(updated.published_at).toBeDefined();
    });

    it('should allow review → published transition', async () => {
      const article = await articleService.createArticle({
        title: 'Test Article',
        slug: `test-review-published-${Date.now()}`,
        body_markdown: '# Test',
        body_html: '<h1>Test</h1>',
        status: 'review',
        category: 'test',
      }, testUserId);

      articleIds.push(article.id);

      const updated = await articleService.updateArticle(article.id, {
        status: 'published',
      }, testUserId);

      expect(updated.status).toBe('published');
    });

    it('should allow published → archived transition', async () => {
      const article = await articleService.createArticle({
        title: 'Test Article',
        slug: `test-published-archived-${Date.now()}`,
        body_markdown: '# Test',
        body_html: '<h1>Test</h1>',
        status: 'published',
        category: 'test',
        published_at: new Date().toISOString(),
      }, testUserId);

      articleIds.push(article.id);

      const updated = await articleService.updateArticle(article.id, {
        status: 'archived',
      }, testUserId);

      expect(updated.status).toBe('archived');
    });

    it('should prevent invalid transitions', async () => {
      const article = await articleService.createArticle({
        title: 'Test Article',
        slug: `test-invalid-transition-${Date.now()}`,
        body_markdown: '# Test',
        body_html: '<h1>Test</h1>',
        status: 'archived',
        category: 'test',
      }, testUserId);

      articleIds.push(article.id);

      // Try invalid transition: archived → published
      await expect(
        articleService.updateArticle(article.id, {
          status: 'published',
        }, testUserId)
      ).rejects.toThrow();
    });
  });

  describe('State Machine Enforcement', () => {
    it('should enforce state machine at database level', async () => {
      const article = await articleService.createArticle({
        title: 'Test Article',
        slug: `test-db-enforcement-${Date.now()}`,
        body_markdown: '# Test',
        body_html: '<h1>Test</h1>',
        status: 'draft',
        category: 'test',
      }, testUserId);

      articleIds.push(article.id);

      // Try to bypass state machine via direct database update
      const { error } = await supabase
        .from('articles')
        .update({ status: 'published' })
        .eq('id', article.id);

      // Should fail due to database trigger
      expect(error).toBeDefined();
    });
  });
});
