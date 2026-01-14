/**
 * Test Helpers and Utilities
 * Shared utilities for testing
 */

import { createClient } from '@supabase/supabase-js';

/**
 * Create a test Supabase client
 */
export function createTestClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test-key';
  
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Wait for a condition to be true
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  timeout = 5000,
  interval = 100
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Clean up test data
 */
export async function cleanupTestData(supabase: ReturnType<typeof createTestClient>, table: string, ids: string[]) {
  if (ids.length === 0) return;
  
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
  supabase: ReturnType<typeof createTestClient>,
  email = `test-${Date.now()}@example.com`
) {
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
  supabase: ReturnType<typeof createTestClient>,
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
