/**
 * Load Tests: API Endpoints
 * 
 * Run with: npm run test:load
 * 
 * Note: These tests simulate load and should be run separately from unit/integration tests
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Increase timeout for load tests
jest.setTimeout(30000);

describe('API Load Tests', () => {
  const CONCURRENT_REQUESTS = 50;
  const REQUESTS_PER_ENDPOINT = 100;

  // Clean up after all tests
  afterAll(async () => {
    // Give time for any pending requests to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  describe('Health Endpoint Load', () => {
    it('should handle concurrent health checks', async () => {
      const requests = Array(REQUESTS_PER_ENDPOINT)
        .fill(null)
        .map(() => fetch(`${BASE_URL}/api/health`).catch(e => {
          console.error('Fetch error:', e);
          return new Response(JSON.stringify({ status: 'error' }), { status: 500 });
        }));

      const responses = await Promise.all(requests);
      const results = await Promise.all(responses.map(r => r.json().catch(() => ({ status: 'error' }))));

      const successCount = results.filter(r => r.status === 'healthy').length;
      const avgResponseTime = responses.reduce((sum, r) => {
        // Note: Response time measurement would need custom fetch wrapper
        return sum;
      }, 0) / responses.length;

      expect(successCount).toBeGreaterThan(REQUESTS_PER_ENDPOINT * 0.95); // 95% success rate
      console.log(`Health endpoint: ${successCount}/${REQUESTS_PER_ENDPOINT} successful`);
    }, 30000); // 30 second timeout for this test
  });

  describe('Concurrent Request Handling', () => {
    it('should handle concurrent requests without errors', async () => {
      const endpoints = [
        '/api/health',
        '/api/health/liveness',
        '/api/health/readiness',
        '/api/metrics',
      ];

      const allRequests = endpoints.flatMap(endpoint =>
        Array(CONCURRENT_REQUESTS)
          .fill(null)
          .map(() => fetch(`${BASE_URL}${endpoint}`).catch(e => {
            console.error(`Fetch error for ${endpoint}:`, e);
            return new Response(JSON.stringify({ error: true }), { status: 500 });
          }))
      );

      const responses = await Promise.all(allRequests);
      const errors = responses.filter(r => !r.ok);

      expect(errors.length).toBeLessThan(allRequests.length * 0.05); // Less than 5% errors
      console.log(`Concurrent requests: ${errors.length}/${allRequests.length} errors`);
    }, 30000);
  });

  describe('Response Time', () => {
    it('should respond within acceptable time limits', async () => {
      const startTime = Date.now();
      const response = await fetch(`${BASE_URL}/api/health`).catch(e => {
        console.error('Fetch error:', e);
        return new Response(JSON.stringify({ error: true }), { status: 500 });
      });
      const endTime = Date.now();

      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(1000); // Less than 1 second
      console.log(`Response time: ${responseTime}ms`);
    }, 10000);
  });
});
