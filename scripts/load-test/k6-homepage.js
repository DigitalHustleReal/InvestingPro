/**
 * k6 Load Test: Homepage
 * Tests homepage performance under load
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const homepageDuration = new Trend('homepage_duration');

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up to 10 users
    { duration: '1m', target: 10 },    // Stay at 10 users
    { duration: '30s', target: 50 },    // Ramp up to 50 users
    { duration: '1m', target: 50 },    // Stay at 50 users
    { duration: '30s', target: 100 },  // Ramp up to 100 users (10x)
    { duration: '2m', target: 100 },   // Stay at 100 users
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
    http_req_failed: ['rate<0.01'],    // Error rate should be less than 1%
    errors: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Test homepage
  const response = http.get(`${BASE_URL}/`, {
    tags: { name: 'Homepage' },
  });

  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 2s': (r) => r.timings.duration < 2000,
    'has title': (r) => r.body.includes('<title>'),
  });

  errorRate.add(!success);
  homepageDuration.add(response.timings.duration);

  sleep(1);
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'load-test-results.json': JSON.stringify(data),
  };
}

function textSummary(data, options) {
  // Simple text summary
  return `
Load Test Summary:
==================
Duration: ${data.state.testRunDurationMs / 1000}s
Requests: ${data.metrics.http_reqs.values.count}
Failed: ${data.metrics.http_req_failed.values.rate * 100}%
P95 Duration: ${data.metrics.http_req_duration.values['p(95)']}ms
Errors: ${data.metrics.errors.values.rate * 100}%
`;
}
