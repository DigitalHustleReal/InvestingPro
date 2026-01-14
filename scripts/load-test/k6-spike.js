/**
 * k6 Spike Test
 * Tests system behavior under sudden traffic spikes
 * 
 * Usage: k6 run scripts/load-test/k6-spike.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '10s', target: 100 },  // Normal load
    { duration: '1m', target: 100 },
    { duration: '10s', target: 500 },  // Spike to 500 users
    { duration: '1m', target: 500 },
    { duration: '10s', target: 100 },  // Back to normal
    { duration: '1m', target: 100 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'], // Allow higher latency during spike
    http_req_failed: ['rate<0.05'],     // Allow up to 5% errors during spike
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/`);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
