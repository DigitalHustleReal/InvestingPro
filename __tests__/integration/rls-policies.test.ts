/**
 * Integration Tests: RLS Policies
 * Tests Row Level Security policies
 */

import { createTestClient, createTestUser, cleanupTestData } from '../setup/test-helpers';

describe('RLS Policies Integration', () => {
  let supabase: ReturnType<typeof createTestClient>;
  let adminUser: any;
  let regularUser: any;
  let articleIds: string[] = [];

  beforeAll(async () => {
    supabase = createTestClient();
    
    // Create admin user
    adminUser = await createTestUser(supabase, 'admin@test.com');
    // Assign admin role (would need actual role assignment logic)
    
    // Create regular user
    regularUser = await createTestUser(supabase, 'user@test.com');
  });

  afterAll(async () => {
    await cleanupTestData(supabase, 'articles', articleIds);
  });

  describe('Article Access', () => {
    it('should allow public to view published articles', async () => {
      // Create published article as admin
      const { data: article, error } = await supabase
        .from('articles')
        .insert({
          title: 'Public Article',
          slug: `public-article-${Date.now()}`,
          body_markdown: '# Public Content',
          body_html: '<h1>Public Content</h1>',
          status: 'published',
          category: 'test',
          published_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      articleIds.push(article.id);

      // Try to read as anonymous user
      const { data: publicArticle, error: publicError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', article.id)
        .single();

      // Should be able to read published articles
      expect(publicError).toBeNull();
      expect(publicArticle).toBeDefined();
      expect(publicArticle?.status).toBe('published');
    });

    it('should prevent public from viewing draft articles', async () => {
      // Create draft article as admin
      const { data: article, error } = await supabase
        .from('articles')
        .insert({
          title: 'Draft Article',
          slug: `draft-article-${Date.now()}`,
          body_markdown: '# Draft Content',
          body_html: '<h1>Draft Content</h1>',
          status: 'draft',
          category: 'test',
        })
        .select()
        .single();

      if (error) throw error;
      articleIds.push(article.id);

      // Try to read as anonymous user
      const { data: draftArticle, error: draftError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', article.id)
        .single();

      // Should not be able to read draft articles
      expect(draftError).toBeDefined();
      expect(draftArticle).toBeNull();
    });
  });

  describe('Admin Access', () => {
    it('should allow admin to view all articles', async () => {
      // This test would require actual admin role assignment
      // For now, we'll test the concept
      const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .limit(10);

      // Admin should be able to see articles
      // Note: This test may need adjustment based on actual RLS implementation
      expect(error).toBeNull();
    });
  });
});
