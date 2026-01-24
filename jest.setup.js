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

global.Response = global.Response || class Response {
  constructor(body, init) {
    this.body = body;
    this.status = init?.status || 200;
    this.statusText = init?.statusText || 'OK';
    this.headers = new Headers(init?.headers || {});
  }
  
  async json() {
    return JSON.parse(this.body);
  }
  
  async text() {
    return this.body;
  }
};

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
