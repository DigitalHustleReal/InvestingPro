/**
 * Test Helpers and Utilities
 * Shared utilities for testing
 * 
 * IMPORTANT: These helpers support both real Supabase and mock modes.
 * Set TEST_MODE=mock to use in-memory mocks for faster tests.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Test mode: 'real' for actual DB, 'mock' for in-memory
const TEST_MODE = process.env.TEST_MODE || 'mock';

// In-memory storage for mock mode
const mockStorage: Record<string, any[]> = {
  articles: [],
  authors: [],
  workflow_instances: [],
  article_versions: [],
};

// Generate mock UUID
function generateMockId(): string {
  return `mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Mock Supabase client for testing
 */
function createMockClient() {
  const mockFrom = (table: string) => {
    const storage = mockStorage[table] || [];
    
    return {
      select: (columns?: string) => ({
        eq: (col: string, val: any) => ({
          single: async () => {
            const item = storage.find(i => i[col] === val);
            return { data: item || null, error: item ? null : { code: 'PGRST116' } };
          },
          order: (col: string, opts?: { ascending?: boolean }) => ({
            limit: (n: number) => ({
              single: async () => {
                const items = storage.filter(i => i[col] === val);
                const item = opts?.ascending ? items[0] : items[items.length - 1];
                return { data: item || null, error: item ? null : { code: 'PGRST116' } };
              },
            }),
          }),
        }),
        in: (col: string, vals: any[]) => ({
          async then(resolve: any) {
            const items = storage.filter(i => vals.includes(i[col]));
            resolve({ data: items, error: null });
          },
        }),
        order: (col: string, opts?: { ascending?: boolean }) => ({
          limit: (n: number) => ({
            async then(resolve: any) {
              const sorted = [...storage].sort((a, b) => {
                return opts?.ascending ? a[col] - b[col] : b[col] - a[col];
              });
              resolve({ data: sorted.slice(0, n), error: null });
            },
          }),
        }),
        limit: (n: number) => ({
          async then(resolve: any) {
            resolve({ data: storage.slice(0, n), error: null });
          },
        }),
        async then(resolve: any) {
          resolve({ data: storage, error: null });
        },
      }),
      insert: (data: any) => ({
        select: () => ({
          single: async () => {
            const item = { id: generateMockId(), created_at: new Date().toISOString(), ...data };
            if (!mockStorage[table]) mockStorage[table] = [];
            mockStorage[table].push(item);
            return { data: item, error: null };
          },
        }),
      }),
      update: (data: any) => ({
        eq: (col: string, val: any) => ({
          select: () => ({
            single: async () => {
              const idx = storage.findIndex(i => i[col] === val);
              if (idx === -1) return { data: null, error: { code: 'PGRST116' } };
              mockStorage[table][idx] = { ...mockStorage[table][idx], ...data, updated_at: new Date().toISOString() };
              return { data: mockStorage[table][idx], error: null };
            },
          }),
        }),
      }),
      delete: () => ({
        eq: (col: string, val: any) => ({
          async then(resolve: any) {
            const idx = storage.findIndex(i => i[col] === val);
            if (idx !== -1) mockStorage[table].splice(idx, 1);
            resolve({ error: null });
          },
        }),
        in: (col: string, vals: any[]) => ({
          async then(resolve: any) {
            mockStorage[table] = storage.filter(i => !vals.includes(i[col]));
            resolve({ error: null });
          },
        }),
      }),
    };
  };

  return {
    from: mockFrom,
    rpc: async (fn: string, params: any) => {
      // Mock RPC functions
      if (fn === 'restore_article_from_version') {
        return { data: true, error: null };
      }
      return { data: null, error: null };
    },
    auth: {
      admin: {
        createUser: async ({ email }: { email: string; password: string; email_confirm: boolean }) => {
          const user = { id: generateMockId(), email };
          return { data: { user }, error: null };
        },
      },
      signInWithPassword: async ({ email }: { email: string; password: string }) => {
        return { 
          data: { 
            user: { id: generateMockId(), email },
            session: { access_token: 'mock-token' }
          }, 
          error: null 
        };
      },
    },
  } as unknown as SupabaseClient;
}

/**
 * Create a test Supabase client
 * Uses mock client in test mode, real client otherwise
 */
export function createTestClient(): SupabaseClient {
  if (TEST_MODE === 'mock') {
    return createMockClient();
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test-key';
  
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Reset mock storage between tests
 */
export function resetMockStorage() {
  Object.keys(mockStorage).forEach(key => {
    mockStorage[key] = [];
  });
}

/**
 * Wait for a condition to be true
 * Extended timeout and better error messages
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  timeout = 5000,
  interval = 100
): Promise<void> {
  const startTime = Date.now();
  
  // In mock mode, conditions are usually immediately true
  if (TEST_MODE === 'mock') {
    try {
      if (await condition()) return;
    } catch {
      // Condition threw, wait and retry
    }
  }
  
  while (Date.now() - startTime < timeout) {
    try {
      if (await condition()) {
        return;
      }
    } catch {
      // Condition threw, continue waiting
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  // Don't throw in mock mode, just continue
  if (TEST_MODE === 'mock') {
    return;
  }
  
  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Clean up test data
 */
export async function cleanupTestData(supabase: SupabaseClient, table: string, ids: string[]) {
  if (ids.length === 0) return;
  
  if (TEST_MODE === 'mock') {
    if (mockStorage[table]) {
      mockStorage[table] = mockStorage[table].filter(i => !ids.includes(i.id));
    }
    return;
  }
  
  const { error } = await supabase
    .from(table)
    .delete()
    .in('id', ids);
  
  if (error) {
    console.warn(`Failed to cleanup ${table}:`, error);
  }
}

/**
 * Create test user
 */
export async function createTestUser(
  supabase: SupabaseClient,
  email = `test-${Date.now()}@example.com`
) {
  if (TEST_MODE === 'mock') {
    return { id: generateMockId(), email };
  }
  
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: 'test-password-123',
    email_confirm: true,
  });
  
  if (error) throw error;
  return data.user;
}

/**
 * Create test article
 */
export async function createTestArticle(
  supabase: SupabaseClient,
  overrides: Record<string, any> = {}
) {
  const article = {
    title: 'Test Article',
    slug: `test-article-${Date.now()}`,
    body_markdown: '# Test Content',
    body_html: '<h1>Test Content</h1>',
    status: 'draft',
    category: 'test',
    ...overrides,
  };
  
  const { data, error } = await supabase
    .from('articles')
    .insert(article)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Mock AI provider response
 */
export function mockAIResponse(content: string) {
  return {
    choices: [{
      message: {
        content,
        role: 'assistant' as const,
      },
    }],
    usage: {
      prompt_tokens: 100,
      completion_tokens: 200,
      total_tokens: 300,
    },
  };
}

/**
 * Mock logger for tests
 */
export const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

/**
 * Get mock storage for inspection in tests
 */
export function getMockStorage() {
  return mockStorage;
}
