/**
 * k6 Load Testing Script
 * Basic load test for InvestingPro App
 * 
 * Usage: k6 run scripts/load-test/k6-basic.js
 * 
 * Install k6: https://k6.io/docs/getting-started/installation/
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const apiLatency = new Trend('api_latency');

// Test configuration
export const options = {
  stages: [
    { duration: '1m', target: 10 },   // Ramp up to 10 users
    { duration: '3m', target: 10 },   // Stay at 10 users
    { duration: '1m', target: 50 },    // Ramp up to 50 users
    { duration: '3m', target: 50 },   // Stay at 50 users
    { duration: '1m', target: 100 },  // Ramp up to 100 users
    { duration: '3m', target: 100 },   // Stay at 100 users
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
    http_req_failed: ['rate<0.01'],     // Error rate should be less than 1%
    errors: ['rate<0.01'],
  },
};

// Base URL - change this to your deployment URL
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Test scenarios
  const scenarios = [
    testHomepage,
    testArticlePage,
    testAPIEndpoints,
    testSearch,
  ];

  // Randomly pick a scenario
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  scenario();
}

function testHomepage() {
  const startTime = Date.now();
  const res = http.get(`${BASE_URL}/`);
  
  const duration = Date.now() - startTime;
  apiLatency.add(duration);
  
  const success = check(res, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage loads in <2s': (r) => r.timings.duration < 2000,
  });

  if (!success) {
    errorRate.add(1);
  } else {
    errorRate.add(0);
  }

  sleep(1);
}

function testArticlePage() {
  // Test article page - adjust slug as needed
  const articleSlugs = [
    'mutual-funds-guide',
    'credit-cards-comparison',
    'tax-planning-basics',
  ];
  
  const slug = articleSlugs[Math.floor(Math.random() * articleSlugs.length)];
  const startTime = Date.now();
  const res = http.get(`${BASE_URL}/article/${slug}`);
  
  const duration = Date.now() - startTime;
  apiLatency.add(duration);
  
  const success = check(res, {
    'article page status is 200': (r) => r.status === 200,
    'article loads in <2s': (r) => r.timings.duration < 2000,
  });

  if (!success) {
    errorRate.add(1);
  } else {
    errorRate.add(0);
  }

  sleep(1);
}

function testAPIEndpoints() {
  const endpoints = [
    '/api/entities/Article/list',
    '/api/entities/MutualFund/list',
    '/api/entities/CreditCard/list',
  ];

  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const startTime = Date.now();
  const res = http.get(`${BASE_URL}${endpoint}`);
  
  const duration = Date.now() - startTime;
  apiLatency.add(duration);
  
  const success = check(res, {
    'API status is 200': (r) => r.status === 200,
    'API responds in <500ms': (r) => r.timings.duration < 500,
  });

  if (!success) {
    errorRate.add(1);
  } else {
    errorRate.add(0);
  }

  sleep(0.5);
}

function testSearch() {
  const queries = ['mutual funds', 'credit cards', 'insurance', 'loans'];
  const query = queries[Math.floor(Math.random() * queries.length)];
  
  const startTime = Date.now();
  const res = http.get(`${BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
  
  const duration = Date.now() - startTime;
  apiLatency.add(duration);
  
  const success = check(res, {
    'search status is 200': (r) => r.status === 200,
    'search responds in <500ms': (r) => r.timings.duration < 500,
  });

  if (!success) {
    errorRate.add(1);
  } else {
    errorRate.add(0);
  }

  sleep(1);
}
