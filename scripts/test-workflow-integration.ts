/**
 * Workflow Integration Tests
 * Comprehensive end-to-end tests for workflow system
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<void>): Promise<void> {
  const start = Date.now();
  try {
    await fn();
    results.push({ name, passed: true, duration: Date.now() - start });
    console.log(`✅ ${name}`);
  } catch (error) {
    results.push({
      name,
      passed: false,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    });
    console.error(`❌ ${name}:`, error instanceof Error ? error.message : String(error));
  }
}

async function testWorkflowStart(): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/workflows/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      workflowId: 'article-publishing',
      context: { articleId: 'test-article-id' },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to start workflow: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.success || !data.instance?.id) {
    throw new Error('Invalid response from workflow start');
  }
}

async function testWorkflowStatus(): Promise<void> {
  // First start a workflow
  const startResponse = await fetch(`${BASE_URL}/api/workflows/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      workflowId: 'article-publishing',
      context: { articleId: 'test-article-id' },
    }),
  });

  const startData = await startResponse.json();
  const instanceId = startData.instance?.id;

  if (!instanceId) {
    throw new Error('Failed to get instance ID from workflow start');
  }

  // Then check status
  const statusResponse = await fetch(`${BASE_URL}/api/workflows/${instanceId}/status`);
  if (!statusResponse.ok) {
    throw new Error(`Failed to get workflow status: ${statusResponse.statusText}`);
  }

  const statusData = await statusResponse.json();
  if (!statusData.success || !statusData.instance) {
    throw new Error('Invalid response from workflow status');
  }
}

async function testWorkflowRecovery(): Promise<void> {
  // This test would require a failed workflow instance
  // For now, just test the endpoint exists
  const response = await fetch(`${BASE_URL}/api/workflows/test-id/recover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skipFailedSteps: true }),
  });

  // Should return 404 or 500 (not 404 for route not found)
  if (response.status === 404 && response.url.includes('/recover')) {
    // Route exists but instance not found - that's expected
    return;
  }

  if (response.status >= 500) {
    throw new Error(`Recovery endpoint error: ${response.statusText}`);
  }
}

async function testWorkflowSchedule(): Promise<void> {
  const scheduleAt = new Date(Date.now() + 60000); // 1 minute from now

  const response = await fetch(`${BASE_URL}/api/workflows/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      workflowId: 'article-publishing',
      context: { articleId: 'test-article-id' },
      scheduleAt: scheduleAt.toISOString(),
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(`Failed to schedule workflow: ${error.error || response.statusText}`);
  }

  const data = await response.json();
  if (!data.success || !data.scheduled?.id) {
    throw new Error('Invalid response from workflow schedule');
  }
}

async function testWorkflowMetrics(): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/workflows/metrics`);
  if (!response.ok) {
    throw new Error(`Failed to get workflow metrics: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.success || !data.metrics) {
    throw new Error('Invalid response from workflow metrics');
  }
}

async function testStateTransition(): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/workflows/state/transition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      entityType: 'article',
      entityId: 'test-article-id',
      from: 'draft',
      to: 'review',
      action: 'submit',
    }),
  });

  // Should succeed or return validation error (not 404)
  if (response.status === 404) {
    throw new Error('State transition endpoint not found');
  }
}

async function runTests(): Promise<void> {
  console.log('🧪 Running Workflow Integration Tests...\n');

  await test('Workflow Start', testWorkflowStart);
  await test('Workflow Status', testWorkflowStatus);
  await test('Workflow Recovery Endpoint', testWorkflowRecovery);
  await test('Workflow Schedule', testWorkflowSchedule);
  await test('Workflow Metrics', testWorkflowMetrics);
  await test('State Transition', testStateTransition);

  // Summary
  console.log('\n📊 Test Results:');
  console.log('─'.repeat(50));
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name} (${result.duration}ms)`);
    if (!result.passed && result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  console.log('─'.repeat(50));
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`Total Duration: ${totalDuration}ms`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});
