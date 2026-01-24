// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

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

// DO NOT override Env vars for Integration tests. 
// We want to use the real .env.local values loaded by Next.js
process.env.NODE_ENV = 'test';
