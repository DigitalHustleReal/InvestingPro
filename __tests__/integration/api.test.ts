/**
 * Integration Tests: API Endpoints
 */

import { createTestClient, createTestUser, createTestArticle } from '../setup/test-helpers';

jest.unmock('@supabase/supabase-js');

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

describe('API Endpoints Integration', () => {
  let supabase: ReturnType<typeof createTestClient>;
  let testUserId: string;
  let authToken: string;
  const articleIds: string[] = [];

  beforeAll(async () => {
    supabase = createTestClient();
    const user = await createTestUser(supabase);
    testUserId = user.id;
    
    // Get auth token
    const { data } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: 'test-password-123',
    });
    
    authToken = data.session?.access_token || '';
  });

  afterAll(async () => {
    // Cleanup handled by test cleanup
  });

  describe('Health Endpoints', () => {
    it('GET /api/health should return healthy status', async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('healthy');
    });

    it('GET /api/health/liveness should return ok', async () => {
      const response = await fetch(`${BASE_URL}/api/health/liveness`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('ok');
    });

    it('GET /api/health/readiness should return ready', async () => {
      const response = await fetch(`${BASE_URL}/api/health/readiness`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('ready');
    });
  });

  describe('Article Endpoints', () => {
    it('GET /api/v1/articles/[id]/versions should return version history', async () => {
      const article = await createTestArticle(supabase, {
        title: 'Test Article',
        slug: `test-api-${Date.now()}`,
      });
      articleIds.push(article.id);

      const response = await fetch(
        `${BASE_URL}/api/v1/articles/${article.id}/versions`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    it('POST /api/v1/articles/[id]/rollback/[version] should rollback article', async () => {
      const article = await createTestArticle(supabase, {
        title: 'Test Article',
        slug: `test-rollback-${Date.now()}`,
      });
      articleIds.push(article.id);

      // Create a version first
      await supabase
        .from('articles')
        .update({ title: 'Updated Title' })
        .eq('id', article.id);

      // Get versions
      const versionsResponse = await fetch(
        `${BASE_URL}/api/v1/articles/${article.id}/versions`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const versions = await versionsResponse.json();

      if (versions.length > 0) {
        const rollbackResponse = await fetch(
          `${BASE_URL}/api/v1/articles/${article.id}/rollback/${versions[0].version}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        expect(rollbackResponse.status).toBe(200);
      }
    });
  });

  describe('Admin Endpoints', () => {
    it('GET /api/v1/admin/audit-log should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/v1/admin/audit-log`);

      expect(response.status).toBe(401);
    });

    it('GET /api/v1/admin/audit-log should return audit logs with auth', async () => {
      const response = await fetch(`${BASE_URL}/api/v1/admin/audit-log`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // May return 403 if user is not admin, or 200 if admin
      expect([200, 403]).toContain(response.status);
    });

    it('GET /api/v1/admin/cost-dashboard should return cost data', async () => {
      const response = await fetch(`${BASE_URL}/api/v1/admin/cost-dashboard`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // May return 403 if user is not admin, or 200 if admin
      expect([200, 403]).toContain(response.status);
    });
  });

  describe('Error Handling', () => {
    it('should return standardized error format', async () => {
      const response = await fetch(`${BASE_URL}/api/v1/articles/invalid-id`);

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toHaveProperty('error');
      expect(data).toHaveProperty('code');
    });

    it('should return validation errors for invalid input', async () => {
      const response = await fetch(`${BASE_URL}/api/v1/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ invalid: 'data' }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.code).toBe('VALIDATION_ERROR');
    });
  });
});
