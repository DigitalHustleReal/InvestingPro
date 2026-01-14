/**
 * Test Workflow System
 * Script to test workflow execution and state transitions
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { workflowService } from '../lib/workflows/workflow-service';
import { ARTICLE_PUBLISHING_WORKFLOW } from '../lib/workflows/definitions/article-publishing';
import { CONTENT_GENERATION_WORKFLOW } from '../lib/workflows/definitions/content-generation';
import { workflowMonitor } from '../lib/workflows/workflow-monitor';
import { logger } from '../lib/logger';

async function testWorkflowSystem() {
  console.log('🧪 Testing Workflow System...\n');

  try {
    // Test 1: Start Article Publishing Workflow
    console.log('📝 Test 1: Starting Article Publishing Workflow...');
    const articleInstance = await workflowService.startWorkflow(
      ARTICLE_PUBLISHING_WORKFLOW,
      { articleId: 'test-article-id-123' }
    );
    console.log(`✅ Workflow started: ${articleInstance.id}`);
    console.log(`   State: ${articleInstance.state}`);
    console.log(`   Workflow: ${articleInstance.workflowId}\n`);

    // Test 2: Get Workflow Status
    console.log('📊 Test 2: Getting Workflow Status...');
    const status = await workflowService.getInstanceStatus(articleInstance.id);
    if (status) {
      console.log(`✅ Status retrieved:`);
      console.log(`   State: ${status.state}`);
      console.log(`   Completed Steps: ${status.completedSteps.length}`);
      console.log(`   Failed Steps: ${status.failedSteps.length}\n`);
    }

    // Test 3: Get Execution History
    console.log('📜 Test 3: Getting Execution History...');
    const history = await workflowService.getExecutionHistory(articleInstance.id);
    console.log(`✅ History retrieved: ${history.length} entries\n`);

    // Test 4: State Transition
    console.log('🔄 Test 4: Testing State Transition...');
    try {
      await workflowService.transitionContentState(
        'article',
        'test-article-id-123',
        'draft',
        'review',
        'submit',
        'test-user-id'
      );
      console.log('✅ State transition successful\n');
    } catch (error) {
      console.log(`⚠️  State transition test (expected if article doesn't exist): ${error instanceof Error ? error.message : String(error)}\n`);
    }

    // Test 5: Get Valid Next States
    console.log('🎯 Test 5: Getting Valid Next States...');
    const nextStates = workflowService.getValidNextStates('draft');
    console.log(`✅ Valid next states from 'draft': ${nextStates.join(', ')}\n`);

    // Test 6: Get Valid Actions
    console.log('⚡ Test 6: Getting Valid Actions...');
    const actions = workflowService.getValidActions('draft');
    console.log(`✅ Valid actions from 'draft': ${actions.join(', ')}\n`);

    // Test 7: Debug Workflow
    console.log('🐛 Test 7: Debugging Workflow...');
    const debugInfo = await workflowMonitor.debugWorkflow(articleInstance.id);
    console.log(`✅ Debug info retrieved:`);
    console.log(`   Issues: ${debugInfo.issues.length}`);
    console.log(`   Recommendations: ${debugInfo.recommendations.length}\n`);

    // Test 8: Get Metrics
    console.log('📈 Test 8: Getting Workflow Metrics...');
    const metrics = await workflowMonitor.getMetrics();
    console.log(`✅ Metrics retrieved:`);
    console.log(`   Total: ${metrics.total}`);
    console.log(`   Success Rate: ${metrics.successRate.toFixed(2)}%`);
    console.log(`   Failure Rate: ${metrics.failureRate.toFixed(2)}%\n`);

    // Test 9: Get Active Workflows
    console.log('🔄 Test 9: Getting Active Workflows...');
    const active = await workflowMonitor.getActiveWorkflows();
    console.log(`✅ Active workflows: ${active.length}\n`);

    // Test 10: Get Failed Workflows
    console.log('❌ Test 10: Getting Failed Workflows...');
    const failed = await workflowMonitor.getFailedWorkflows(10);
    console.log(`✅ Failed workflows: ${failed.length}\n`);

    console.log('✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error instanceof Error ? error.message : String(error));
    console.error(error);
    process.exit(1);
  }
}

// Run tests
testWorkflowSystem()
  .then(() => {
    console.log('\n🎉 Workflow system test complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test script error:', error);
    process.exit(1);
  });
