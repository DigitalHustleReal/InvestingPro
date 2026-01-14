/**
 * k6 Load Test: Article Pages
 * Tests article page performance under load
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const articleDuration = new Trend('article_duration');

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 100 },
    { duration: '2m', target: 100 },
    { duration: '30s', target: 200 },  // 10x load
    { duration: '2m', target: 200 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
    errors: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const ARTICLE_SLUGS = __ENV.ARTICLE_SLUGS ? __ENV.ARTICLE_SLUGS.split(',') : [
  'best-credit-cards',
  'mutual-fund-investment-guide',
  'tax-saving-investments',
];

export default function () {
  const slug = ARTICLE_SLUGS[Math.floor(Math.random() * ARTICLE_SLUGS.length)];
  const response = http.get(`${BASE_URL}/article/${slug}`, {
    tags: { name: 'Article' },
  });

  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 2s': (r) => r.timings.duration < 2000,
    'has content': (r) => r.body.includes('article') || r.body.length > 1000,
  });

  errorRate.add(!success);
  articleDuration.add(response.timings.duration);

  sleep(1);
}
