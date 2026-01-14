/**
 * Critical User Flows Test Script
 * 
 * Tests critical user flows to ensure the platform is deployment-ready
 * Run with: tsx scripts/test-critical-flows.ts
 */

import { createClient } from '@supabase/supabase-js';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  message: string;
  duration?: number;
}

class FlowTester {
  private supabase: any;
  private results: TestResult[] = [];

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async test(name: string, fn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    try {
      await fn();
      this.results.push({
        name,
        status: 'pass',
        message: 'Test passed',
        duration: Date.now() - startTime,
      });
    } catch (error: any) {
      this.results.push({
        name,
        status: 'fail',
        message: error.message,
        duration: Date.now() - startTime,
      });
    }
  }

  skip(name: string, reason: string): void {
    this.results.push({
      name,
      status: 'skip',
      message: reason,
    });
  }

  getResults(): TestResult[] {
    return this.results;
  }

  // Test: Database Connection
  async testDatabaseConnection() {
    await this.test('Database Connection', async () => {
      const { error } = await this.supabase.from('_test').select('*').limit(1);
      if (error && !error.message.includes('does not exist')) {
        throw new Error(`Connection failed: ${error.message}`);
      }
    });
  }

  // Test: Fetch Published Articles
  async testFetchPublishedArticles() {
    await this.test('Fetch Published Articles', async () => {
      const { data, error } = await this.supabase
        .from('articles')
        .select('id, title, slug, status')
        .eq('status', 'published')
        .limit(10);

      if (error) {
        throw new Error(`Failed to fetch articles: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned');
      }

      console.log(`      Found ${data.length} published articles`);
    });
  }

  // Test: Fetch Products
  async testFetchProducts() {
    await this.test('Fetch Active Products', async () => {
      const { data, error } = await this.supabase
        .from('products')
        .select('id, name, product_type, is_active')
        .eq('is_active', true)
        .limit(10);

      if (error) {
        throw new Error(`Failed to fetch products: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned');
      }

      console.log(`      Found ${data.length} active products`);
    });
  }

  // Test: Fetch Glossary Terms
  async testFetchGlossaryTerms() {
    await this.test('Fetch Glossary Terms', async () => {
      const { data, error } = await this.supabase
        .from('glossary_terms')
        .select('id, term, slug, status')
        .eq('status', 'published')
        .limit(10);

      if (error) {
        throw new Error(`Failed to fetch glossary: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned');
      }

      console.log(`      Found ${data.length} glossary terms`);
    });
  }

  // Test: Check Categories
  async testFetchCategories() {
    await this.test('Fetch Categories', async () => {
      const { data, error } = await this.supabase
        .from('categories')
        .select('id, name, slug')
        .limit(10);

      if (error) {
        throw new Error(`Failed to fetch categories: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned');
      }

      console.log(`      Found ${data.length} categories`);
    });
  }

  // Test: API Health Check
  async testAPIHealth() {
    await this.test('API Health Check', async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      
      try {
        const response = await fetch(`${baseUrl}/api/health`);
        
        if (!response.ok) {
          throw new Error(`Health check failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error('Health check returned unsuccessful');
        }

        console.log(`      API is healthy`);
      } catch (error: any) {
        if (error.message.includes('fetch failed') || error.code === 'ECONNREFUSED') {
          throw new Error('Cannot connect to API (server not running?)');
        }
        throw error;
      }
    });
  }

  // Test: CMS Health Check
  async testCMSHealth() {
    await this.test('CMS Health Check', async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      
      try {
        const response = await fetch(`${baseUrl}/api/cms/health`);
        
        if (!response.ok) {
          throw new Error(`CMS health check failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error('CMS health check returned unsuccessful');
        }

        console.log(`      CMS is healthy: ${data.health.overall}`);
      } catch (error: any) {
        if (error.message.includes('fetch failed') || error.code === 'ECONNREFUSED') {
          throw new Error('Cannot connect to API (server not running?)');
        }
        throw error;
      }
    });
  }

  // Test: Authentication (Anonymous)
  async testAnonymousAuth() {
    await this.test('Anonymous User Access', async () => {
      // Verify anonymous users can access public data
      const { data, error } = await this.supabase
        .from('articles')
        .select('id')
        .eq('status', 'published')
        .limit(1);

      if (error && error.message.includes('permission denied')) {
        throw new Error('RLS policies may be too restrictive');
      }

      if (error && !error.message.includes('does not exist')) {
        throw new Error(`Unexpected error: ${error.message}`);
      }

      console.log(`      Anonymous users can access public content`);
    });
  }

  // Test: Image Service Configuration
  async testImageServiceConfig() {
    await this.test('Image Service Configuration', async () => {
      const cloudinaryName = process.env.CLOUDINARY_CLOUD_NAME;
      const cloudinaryKey = process.env.CLOUDINARY_API_KEY;

      if (!cloudinaryName || !cloudinaryKey) {
        throw new Error('Cloudinary not configured');
      }

      if (cloudinaryName.includes('your_') || cloudinaryKey.includes('your_')) {
        throw new Error('Cloudinary has placeholder values');
      }

      console.log(`      Cloudinary configured: ${cloudinaryName}`);
    });
  }

  // Test: AI Service Configuration
  async testAIServiceConfig() {
    await this.test('AI Service Configuration', async () => {
      const openaiKey = process.env.OPENAI_API_KEY;

      if (!openaiKey) {
        throw new Error('OpenAI API key not configured');
      }

      if (openaiKey.includes('...') || openaiKey.length < 20) {
        throw new Error('OpenAI API key appears invalid');
      }

      console.log(`      AI service configured`);
    });
  }
}

async function main() {
  console.log('\n');
  console.log('═'.repeat(70));
  console.log('  InvestingPro Critical User Flows Test');
  console.log('═'.repeat(70));
  console.log('\n');

  const tester = new FlowTester();

  console.log('🧪 Running tests...\n');

  // Run all tests
  await tester.testDatabaseConnection();
  await tester.testFetchPublishedArticles();
  await tester.testFetchProducts();
  await tester.testFetchGlossaryTerms();
  await tester.testFetchCategories();
  await tester.testAPIHealth();
  await tester.testCMSHealth();
  await tester.testAnonymousAuth();
  await tester.testImageServiceConfig();
  await tester.testAIServiceConfig();

  // Print results
  const results = tester.getResults();
  
  console.log('\n');
  console.log('═'.repeat(70));
  console.log('📊 Test Results');
  console.log('═'.repeat(70));
  console.log('\n');

  for (const result of results) {
    const icon = 
      result.status === 'pass' ? '✓' :
      result.status === 'fail' ? '✗' :
      '○';
    
    const color = 
      result.status === 'pass' ? '\x1b[32m' :  // Green
      result.status === 'fail' ? '\x1b[31m' :  // Red
      '\x1b[33m';  // Yellow

    const reset = '\x1b[0m';
    
    console.log(`${color}${icon} ${result.name}${reset}`);
    
    if (result.status === 'fail') {
      console.log(`   Error: ${result.message}`);
    } else if (result.status === 'skip') {
      console.log(`   Skipped: ${result.message}`);
    }
    
    if (result.duration !== undefined) {
      console.log(`   Duration: ${result.duration}ms`);
    }
    
    console.log('');
  }

  // Summary
  const passed = results.filter((r) => r.status === 'pass').length;
  const failed = results.filter((r) => r.status === 'fail').length;
  const skipped = results.filter((r) => r.status === 'skip').length;
  const total = results.length;

  console.log('═'.repeat(70));
  console.log('Summary:');
  console.log(`   Total: ${total}`);
  console.log(`   Passed: ${passed}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Skipped: ${skipped}`);
  console.log('═'.repeat(70));
  console.log('\n');

  if (failed > 0) {
    console.log('❌ Some tests failed. Please review and fix issues before deployment.\n');
    process.exit(1);
  } else {
    console.log('✅ All tests passed! Platform is ready for deployment.\n');
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('Test script failed:', error);
  process.exit(1);
});
