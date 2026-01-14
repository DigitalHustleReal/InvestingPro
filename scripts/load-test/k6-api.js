/**
 * k6 Load Test: API Endpoints
 * Tests API performance under load
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const apiDuration = new Trend('api_duration');

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 200 },
    { duration: '2m', target: 200 },
    { duration: '30s', target: 500 },  // 10x load
    { duration: '2m', target: 500 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],  // API should be faster
    http_req_failed: ['rate<0.01'],
    errors: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

const API_ENDPOINTS = [
  '/api/entities/MutualFund/list',
  '/api/entities/CreditCard/list',
  '/api/entities/Loan/list',
  '/api/workflows/metrics',
];

export default function () {
  const endpoint = API_ENDPOINTS[Math.floor(Math.random() * API_ENDPOINTS.length)];
  const response = http.get(`${BASE_URL}${endpoint}`, {
    tags: { name: 'API' },
  });

  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
    'has JSON response': (r) => {
      try {
        JSON.parse(r.body);
        return true;
      } catch {
        return false;
      }
    },
  });

  errorRate.add(!success);
  apiDuration.add(response.timings.duration);

  sleep(0.5);
}
