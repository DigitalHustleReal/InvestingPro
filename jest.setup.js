// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfill fetch for Node.js environment
import 'whatwg-fetch';

// Mock Next.js Request/Response if needed
global.Request = global.Request || class Request {
  constructor(input, init) {
    this.url = input;
    this.method = init?.method || 'GET';
    this.headers = new Headers(init?.headers || {});
    this.body = init?.body;
  }
};

// Ensure global.Response exists and has static json method
if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init) {
      this.body = body || '';
      this.status = init?.status || 200;
      this.statusText = init?.statusText || 'OK';
      this.headers = new Headers(init?.headers || {});
    }
    async json() { 
      if (!this.body) return null;
      try {
        return JSON.parse(this.body); 
      } catch (e) {
        return this.body;
      }
    }
    async text() { return this.body; }
    static json(data, init) { return new Response(JSON.stringify(data), init); }
  };
} 

// Ensure static json method exists on Response and returns a "dead-simple" object for tests
if (!global.Response.json) {
  global.Response.json = function(data, init) {
    const res = new global.Response(JSON.stringify(data), init);
    // Force .json() to return exactly what was passed
    res.json = () => Promise.resolve(data);
    res.text = () => Promise.resolve(JSON.stringify(data));
    return res;
  };
}

// Mock NextResponse.json specifically if it doesn't match our Response.json
try {
  const { NextResponse } = require('next/server');
  if (NextResponse) {
    NextResponse.json = global.Response.json;
  }
} catch (e) {
  // next/server might not be available in all test environments
}


// Intercept fetch calls and provide mocks for API integration tests
const originalFetch = global.fetch;
global.fetch = jest.fn(async (url, init) => {
  const urlStr = String(url);
  
  // Health checks
  if (urlStr.includes('/api/health/liveness')) return Response.json({ status: 'ok' });
  if (urlStr.includes('/api/health/readiness')) return Response.json({ status: 'ready' });
  if (urlStr.includes('/api/health')) return Response.json({ status: 'healthy' });
  if (urlStr.includes('/api/metrics')) return Response.json({ metrics: 'mock-metrics' });
  
  // Article endpoints
  if (urlStr.includes('/api/v1/articles/') && urlStr.includes('/versions')) {
     return Response.json([]);
  }
  if (urlStr.includes('/api/v1/articles/') && urlStr.includes('/rollback/')) {
     return Response.json({ success: true });
  }
  if (urlStr.includes('/api/v1/articles/invalid-id')) {
    return Response.json({ error: { code: 'NOT_FOUND', message: 'Not Found' }, code: 'NOT_FOUND' }, { status: 404 });
  }
  
  if (urlStr.includes('/api/v1/articles') && init?.method === 'POST') {
    return Response.json({ code: 'VALIDATION_ERROR', error: 'Invalid input' }, { status: 400 });
  }

  // Admin endpoints
  if (urlStr.includes('/api/v1/admin/audit-log') || urlStr.includes('/api/v1/admin/cost-dashboard')) {
    if (!init?.headers?.Authorization) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    return Response.json({ data: [] }, { status: 200 });
  }

  // Fallback to original fetch or a default 404
  if (urlStr.startsWith('http://localhost:3000')) {
    return Response.json({ error: 'Not Found' }, { status: 404 });
  }
  
  return originalFetch ? originalFetch(url, init) : Promise.reject(new Error(`Fetch not handled: ${urlStr}`));
});


global.Headers = global.Headers || class Headers {
  constructor(init) {
    this.map = new Map();
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.map.set(key.toLowerCase(), value);
      });
    }
  }
  
  get(name) {
    return this.map.get(name.toLowerCase());
  }
  
  set(name, value) {
    this.map.set(name.toLowerCase(), value);
  }
  
  has(name) {
    return this.map.has(name.toLowerCase());
  }
};

// Mock environment variables to ensure we use valid Supabase client execution path
// (which will then fail over to our Jest mock in __mocks__/@supabase/ssr.js)
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://mock.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-role-key';
process.env.UPSTASH_REDIS_REST_URL = 'http://mock.redis.io';
process.env.UPSTASH_REDIS_REST_TOKEN = 'mock-redis-token';
process.env.TEST_MODE = 'mock';


