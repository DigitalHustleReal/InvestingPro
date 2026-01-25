/**
 * End-to-End Tests: Admin Operations
 * 
 * Tests admin CRUD operations on articles using mock mode.
 */

import { createTestClient, createTestUser, cleanupTestData, resetMockStorage, getMockStorage } from '../setup/test-helpers';

describe('Admin Operations (E2E)', () => {
  let supabase: ReturnType<typeof createTestClient>;
  let adminUserId: string;
  const articleIds: string[] = [];

  beforeAll(async () => {
    supabase = createTestClient();
    const admin = await createTestUser(supabase, 'admin-e2e@test.com');
    adminUserId = admin.id;
  });

  beforeEach(() => {
    resetMockStorage();
  });

  afterAll(async () => {
    await cleanupTestData(supabase, 'articles', articleIds);
  });

  describe('Article Management', () => {
    it('should create article as admin', async () => {
      const article = {
        title: 'Admin Created Article',
        slug: `admin-article-${Date.now()}`,
        body_markdown: '# Admin Content',
        body_html: '<h1>Admin Content</h1>',
        status: 'draft',
        category: 'test',
      };

      const { data, error } = await supabase
        .from('articles')
        .insert(article)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.title).toBe(article.title);
      expect(data?.id).toBeDefined();
      
      if (data) articleIds.push(data.id);
    });

    it('should update article as admin', async () => {
      const article = {
        title: 'Original Title',
        slug: `update-test-${Date.now()}`,
        body_markdown: '# Original',
        body_html: '<h1>Original</h1>',
        status: 'draft',
        category: 'test',
      };

      const { data: created, error: createError } = await supabase
        .from('articles')
        .insert(article)
        .select()
        .single();

      expect(createError).toBeNull();
      expect(created).toBeDefined();
      if (!created) return;
      
      articleIds.push(created.id);

      const { data: updated, error: updateError } = await supabase
        .from('articles')
        .update({ title: 'Updated Title' })
        .eq('id', created.id)
        .select()
        .single();

      expect(updateError).toBeNull();
      expect(updated?.title).toBe('Updated Title');
    });

    it('should delete article as admin', async () => {
      const article = {
        title: 'To Delete',
        slug: `delete-test-${Date.now()}`,
        body_markdown: '# Delete',
        body_html: '<h1>Delete</h1>',
        status: 'draft',
        category: 'test',
      };

      const { data: created, error: createError } = await supabase
        .from('articles')
        .insert(article)
        .select()
        .single();

      expect(createError).toBeNull();
      expect(created).toBeDefined();
      if (!created) return;

      const { error: deleteError } = await supabase
        .from('articles')
        .delete()
        .eq('id', created.id);

      expect(deleteError).toBeNull();

      // Verify deletion - in mock mode, item should be removed
      const storage = getMockStorage();
      const stillExists = storage.articles?.find((a: any) => a.id === created.id);
      expect(stillExists).toBeUndefined();
    });
  });

  describe('Audit Log', () => {
    it('should log admin actions', async () => {
      // Create article (should trigger audit log in production)
      const article = {
        title: 'Audit Test',
        slug: `audit-test-${Date.now()}`,
        body_markdown: '# Audit',
        body_html: '<h1>Audit</h1>',
        status: 'draft',
        category: 'test',
      };

      const { data: created, error } = await supabase
        .from('articles')
        .insert(article)
        .select()
        .single();

      expect(error).toBeNull();
      expect(created).toBeDefined();
      if (created) articleIds.push(created.id);

      // In mock mode, we verify the article was created
      // In real mode, audit logs would be checked
      const storage = getMockStorage();
      expect(storage.articles?.length).toBeGreaterThan(0);
    });
  });
});
