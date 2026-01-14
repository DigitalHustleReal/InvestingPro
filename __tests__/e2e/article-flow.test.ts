/**
 * End-to-End Tests: Article Creation and Publishing Flow
 */

import { articleService } from '@/lib/cms/article-service';
import { createTestClient, createTestUser, cleanupTestData, waitFor } from '../setup/test-helpers';

describe('Article Creation and Publishing Flow (E2E)', () => {
  let supabase: ReturnType<typeof createTestClient>;
  let testUserId: string;
  let articleIds: string[] = [];

  beforeAll(async () => {
    supabase = createTestClient();
    const user = await createTestUser(supabase);
    testUserId = user.id;
  });

  afterAll(async () => {
    await cleanupTestData(supabase, 'articles', articleIds);
  });

  describe('Complete Article Lifecycle', () => {
    it('should create, review, and publish an article', async () => {
      // Step 1: Create draft article
      const draft = await articleService.createArticle({
        title: 'E2E Test Article',
        slug: `e2e-test-${Date.now()}`,
        body_markdown: '# E2E Test Content\n\nThis is a test article.',
        body_html: '<h1>E2E Test Content</h1><p>This is a test article.</p>',
        status: 'draft',
        category: 'test',
        excerpt: 'Test excerpt',
      }, testUserId);

      expect(draft.status).toBe('draft');
      expect(draft.id).toBeDefined();
      articleIds.push(draft.id);

      // Step 2: Submit for review
      const inReview = await articleService.updateArticle(draft.id, {
        status: 'review',
      }, testUserId);

      expect(inReview.status).toBe('review');

      // Step 3: Publish article
      const published = await articleService.updateArticle(draft.id, {
        status: 'published',
      }, testUserId);

      expect(published.status).toBe('published');
      expect(published.published_at).toBeDefined();
      expect(published.published_date).toBeDefined();

      // Step 4: Verify article is publicly accessible
      const publicArticle = await articleService.getArticleBySlug(draft.slug);
      expect(publicArticle).toBeDefined();
      expect(publicArticle?.status).toBe('published');
    });

    it('should handle article versioning during edits', async () => {
      // Create article
      const article = await articleService.createArticle({
        title: 'Version Test Article',
        slug: `version-test-${Date.now()}`,
        body_markdown: '# Original Content',
        body_html: '<h1>Original Content</h1>',
        status: 'published',
        category: 'test',
        published_at: new Date().toISOString(),
      }, testUserId);

      articleIds.push(article.id);

      // Make first edit
      const edit1 = await articleService.updateArticle(article.id, {
        title: 'Updated Title 1',
        body_markdown: '# Updated Content 1',
      }, testUserId);

      // Wait for version to be created
      await waitFor(async () => {
        const { data } = await supabase
          .from('article_versions')
          .select('version')
          .eq('article_id', article.id)
          .order('version', { ascending: false })
          .limit(1)
          .single();
        return data !== null;
      });

      // Make second edit
      const edit2 = await articleService.updateArticle(article.id, {
        title: 'Updated Title 2',
        body_markdown: '# Updated Content 2',
      }, testUserId);

      // Verify versions exist
      const { data: versions } = await supabase
        .from('article_versions')
        .select('version')
        .eq('article_id', article.id)
        .order('version', { ascending: false });

      expect(versions?.length).toBeGreaterThan(0);
    });

    it('should rollback article to previous version', async () => {
      // Create article
      const article = await articleService.createArticle({
        title: 'Rollback Test',
        slug: `rollback-test-${Date.now()}`,
        body_markdown: '# Original',
        body_html: '<h1>Original</h1>',
        status: 'published',
        category: 'test',
        published_at: new Date().toISOString(),
      }, testUserId);

      articleIds.push(article.id);

      const originalTitle = article.title;

      // Make edit
      await articleService.updateArticle(article.id, {
        title: 'Updated Title',
        body_markdown: '# Updated',
      }, testUserId);

      // Wait for version
      await waitFor(async () => {
        const { data } = await supabase
          .from('article_versions')
          .select('version')
          .eq('article_id', article.id)
          .limit(1)
          .single();
        return data !== null;
      });

      // Get version
      const { data: version } = await supabase
        .from('article_versions')
        .select('version')
        .eq('article_id', article.id)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (version) {
        // Rollback
        const { data: rollbackResult } = await supabase.rpc('restore_article_from_version', {
          p_article_id: article.id,
          p_version: version.version,
        });

        expect(rollbackResult).toBeDefined();

        // Verify rollback
        const rolledBack = await articleService.getArticleById(article.id);
        expect(rolledBack?.title).toBe(originalTitle);
      }
    });
  });

  describe('Article Publishing Workflow', () => {
    it('should trigger publishing workflow on publish', async () => {
      const article = await articleService.createArticle({
        title: 'Workflow Test',
        slug: `workflow-test-${Date.now()}`,
        body_markdown: '# Test',
        body_html: '<h1>Test</h1>',
        status: 'draft',
        category: 'test',
      }, testUserId);

      articleIds.push(article.id);

      // Publish should trigger workflow
      const published = await articleService.updateArticle(article.id, {
        status: 'published',
      }, testUserId);

      expect(published.status).toBe('published');

      // Verify workflow was triggered (check workflow_instances)
      await waitFor(async () => {
        const { data } = await supabase
          .from('workflow_instances')
          .select('id')
          .eq('context->>articleId', article.id)
          .limit(1)
          .single();
        return data !== null;
      }, 10000);
    });
  });
});
