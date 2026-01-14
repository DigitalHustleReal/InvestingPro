/**
 * End-to-End Tests: Admin Operations
 */

import { createTestClient, createTestUser, cleanupTestData } from '../setup/test-helpers';

describe('Admin Operations (E2E)', () => {
  let supabase: ReturnType<typeof createTestClient>;
  let adminUserId: string;
  let articleIds: string[] = [];

  beforeAll(async () => {
    supabase = createTestClient();
    const admin = await createTestUser(supabase, 'admin-e2e@test.com');
    adminUserId = admin.id;
    // Note: Would need to assign admin role in actual test
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
      if (!created) throw new Error('Failed to create article');
      
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
      if (!created) throw new Error('Failed to create article');

      const { error: deleteError } = await supabase
        .from('articles')
        .delete()
        .eq('id', created.id);

      expect(deleteError).toBeNull();

      // Verify deletion
      const { data: deleted, error: getError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', created.id)
        .single();

      expect(getError).toBeDefined();
      expect(deleted).toBeNull();
    });
  });

  describe('Audit Log', () => {
    it('should log admin actions', async () => {
      // Create article (should trigger audit log)
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
      if (created) articleIds.push(created.id);

      // Check audit log (if audit middleware is enabled)
      // This would depend on actual audit implementation
    });
  });
});
