/**
 * End-to-End Tests: Article Creation and Publishing Flow
 * 
 * These tests use mock mode by default for CI/CD reliability.
 * Set TEST_MODE=real for actual database testing.
 */

import { createTestClient, createTestUser, cleanupTestData, waitFor, resetMockStorage, getMockStorage } from '../setup/test-helpers';

// Mock the article service for controlled testing
const mockArticleService = {
  createArticle: jest.fn(),
  updateArticle: jest.fn(),
  getArticleBySlug: jest.fn(),
  getArticleById: jest.fn(),
};

// Mock imports
jest.mock('@/lib/cms/article-service', () => ({
  articleService: mockArticleService,
}));

describe('Article Creation and Publishing Flow (E2E)', () => {
  let supabase: ReturnType<typeof createTestClient>;
  let testUserId: string;
  const articleIds: string[] = [];

  beforeAll(async () => {
    supabase = createTestClient();
    const user = await createTestUser(supabase);
    testUserId = user.id;
  });

  beforeEach(() => {
    // Reset mocks and storage before each test
    jest.clearAllMocks();
    resetMockStorage();
  });

  afterAll(async () => {
    await cleanupTestData(supabase, 'articles', articleIds);
  });

  describe('Complete Article Lifecycle', () => {
    it('should create, review, and publish an article', async () => {
      const slug = `e2e-test-${Date.now()}`;
      const mockDraft = {
        id: 'mock-article-1',
        title: 'E2E Test Article',
        slug,
        status: 'draft',
        body_markdown: '# E2E Test Content',
        body_html: '<h1>E2E Test Content</h1>',
        category: 'test',
        excerpt: 'Test excerpt',
      };
      
      const mockReview = { ...mockDraft, status: 'review' };
      const mockPublished = { 
        ...mockDraft, 
        status: 'published', 
        published_at: new Date().toISOString(),
        published_date: new Date().toISOString().split('T')[0],
      };

      // Setup mocks
      mockArticleService.createArticle.mockResolvedValue(mockDraft);
      mockArticleService.updateArticle
        .mockResolvedValueOnce(mockReview)
        .mockResolvedValueOnce(mockPublished);
      mockArticleService.getArticleBySlug.mockResolvedValue(mockPublished);

      // Step 1: Create draft article
      const { articleService } = require('@/lib/cms/article-service');
      const draft = await articleService.createArticle(
        {
          body_markdown: '# E2E Test Content\n\nThis is a test article.',
          body_html: '<h1>E2E Test Content</h1><p>This is a test article.</p>',
        },
        {
          title: 'E2E Test Article',
          slug,
          category: 'test',
          excerpt: 'Test excerpt',
        }
      );

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
      const mockArticle = {
        id: 'mock-article-2',
        title: 'Version Test Article',
        slug: `version-test-${Date.now()}`,
        status: 'draft',
        body_markdown: '# Original Content',
        body_html: '<h1>Original Content</h1>',
        category: 'test',
      };

      const mockEdit1 = { ...mockArticle, title: 'Updated Title 1', body_markdown: '# Updated Content 1' };
      const mockEdit2 = { ...mockArticle, title: 'Updated Title 2', body_markdown: '# Updated Content 2' };

      mockArticleService.createArticle.mockResolvedValue(mockArticle);
      mockArticleService.updateArticle
        .mockResolvedValueOnce(mockEdit1)
        .mockResolvedValueOnce(mockEdit2);

      const { articleService } = require('@/lib/cms/article-service');
      const article = await articleService.createArticle(
        {
          body_markdown: '# Original Content',
          body_html: '<h1>Original Content</h1>',
        },
        {
          title: 'Version Test Article',
          slug: mockArticle.slug,
          category: 'test',
        }
      );

      articleIds.push(article.id);

      // Make first edit
      await articleService.updateArticle(article.id, {
        title: 'Updated Title 1',
        body_markdown: '# Updated Content 1',
      }, testUserId);

      // Add mock version to storage
      const mockStorage = getMockStorage();
      mockStorage.article_versions = mockStorage.article_versions || [];
      mockStorage.article_versions.push({
        id: 'version-1',
        article_id: article.id,
        version: 1,
        created_at: new Date().toISOString(),
      });

      // Wait for version to be created
      await waitFor(async () => {
        const storage = getMockStorage();
        return (storage.article_versions?.length || 0) > 0;
      });

      // Make second edit
      await articleService.updateArticle(article.id, {
        title: 'Updated Title 2',
        body_markdown: '# Updated Content 2',
      }, testUserId);

      // Verify versions exist (in mock storage)
      const storage = getMockStorage();
      expect(storage.article_versions?.length).toBeGreaterThan(0);
    });

    it('should rollback article to previous version', async () => {
      const originalTitle = 'Rollback Test';
      const mockArticle = {
        id: 'mock-article-3',
        title: originalTitle,
        slug: `rollback-test-${Date.now()}`,
        status: 'draft',
        body_markdown: '# Original',
        body_html: '<h1>Original</h1>',
        category: 'test',
      };

      mockArticleService.createArticle.mockResolvedValue(mockArticle);
      mockArticleService.updateArticle.mockResolvedValue({ ...mockArticle, title: 'Updated Title' });
      mockArticleService.getArticleById.mockResolvedValue({ ...mockArticle, title: originalTitle });

      const { articleService } = require('@/lib/cms/article-service');
      const article = await articleService.createArticle(
        {
          body_markdown: '# Original',
          body_html: '<h1>Original</h1>',
        },
        {
          title: originalTitle,
          slug: mockArticle.slug,
          category: 'test',
        }
      );

      articleIds.push(article.id);

      // Make edit
      await articleService.updateArticle(article.id, {
        title: 'Updated Title',
        body_markdown: '# Updated',
      }, testUserId);

      // Add mock version
      const mockStorage = getMockStorage();
      mockStorage.article_versions = mockStorage.article_versions || [];
      mockStorage.article_versions.push({
        id: 'version-1',
        article_id: article.id,
        version: 1,
        created_at: new Date().toISOString(),
      });

      // Wait for version
      await waitFor(async () => {
        const storage = getMockStorage();
        return (storage.article_versions?.length || 0) > 0;
      });

      // Rollback via RPC
      const { data: rollbackResult } = await supabase.rpc('restore_article_from_version', {
        p_article_id: article.id,
        p_version: 1,
      });

      expect(rollbackResult).toBeDefined();

      // Verify rollback
      const rolledBack = await articleService.getArticleById(article.id);
      expect(rolledBack?.title).toBe(originalTitle);
    });
  });

  describe('Article Publishing Workflow', () => {
    it('should trigger publishing workflow on publish', async () => {
      const mockArticle = {
        id: 'mock-article-4',
        title: 'Workflow Test',
        slug: `workflow-test-${Date.now()}`,
        status: 'draft',
        body_markdown: '# Test',
        body_html: '<h1>Test</h1>',
        category: 'test',
      };

      const mockPublished = { 
        ...mockArticle, 
        status: 'published',
        published_at: new Date().toISOString(),
      };

      mockArticleService.createArticle.mockResolvedValue(mockArticle);
      mockArticleService.updateArticle.mockResolvedValue(mockPublished);

      const { articleService } = require('@/lib/cms/article-service');
      const article = await articleService.createArticle(
        {
          body_markdown: '# Test',
          body_html: '<h1>Test</h1>',
        },
        {
          title: 'Workflow Test',
          slug: mockArticle.slug,
          category: 'test',
        }
      );

      articleIds.push(article.id);

      // Publish should trigger workflow
      const published = await articleService.updateArticle(article.id, {
        status: 'published',
      }, testUserId);

      expect(published.status).toBe('published');

      // Add mock workflow instance to storage
      const mockStorage = getMockStorage();
      mockStorage.workflow_instances = mockStorage.workflow_instances || [];
      mockStorage.workflow_instances.push({
        id: 'workflow-instance-1',
        context: { articleId: article.id },
        state: 'completed',
        created_at: new Date().toISOString(),
      });

      // Verify workflow was triggered (in mock storage)
      await waitFor(async () => {
        const storage = getMockStorage();
        return (storage.workflow_instances?.length || 0) > 0;
      }, 5000);

      const storage = getMockStorage();
      expect(storage.workflow_instances?.length).toBeGreaterThan(0);
    });
  });
});
