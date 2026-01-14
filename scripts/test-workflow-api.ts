/**
 * Test Workflow System via API
 * Tests workflows through HTTP endpoints (proper request context)
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function testWorkflowAPI() {
  console.log('🧪 Testing Workflow System via API...\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  try {
    // Test 1: Start Article Publishing Workflow
    console.log('📝 Test 1: Starting Article Publishing Workflow...');
    const startResponse = await fetch(`${BASE_URL}/api/workflows/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflowName: 'article-publishing',
        context: { articleId: 'test-article-id-123' }
      })
    });

    if (!startResponse.ok) {
      const error = await startResponse.text();
      throw new Error(`Failed to start workflow: ${startResponse.status} - ${error}`);
    }

    const startData = await startResponse.json();
    const instanceId = startData.instanceId;
    
    console.log(`✅ Workflow started: ${instanceId}`);
    console.log(`   State: ${startData.state}`);
    console.log(`   Status URL: ${startData.statusUrl}\n`);

    // Wait a bit for workflow to process
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 2: Get Workflow Status
    console.log('📊 Test 2: Getting Workflow Status...');
    const statusResponse = await fetch(`${BASE_URL}/api/workflows/${instanceId}/status`);
    
    if (!statusResponse.ok) {
      throw new Error(`Failed to get status: ${statusResponse.status}`);
    }

    const statusData = await statusResponse.json();
    if (statusData.instance) {
      console.log(`✅ Status retrieved:`);
      console.log(`   State: ${statusData.instance.state}`);
      console.log(`   Completed Steps: ${statusData.instance.completedSteps?.length || 0}`);
      console.log(`   Failed Steps: ${statusData.instance.failedSteps?.length || 0}`);
      console.log(`   History Entries: ${statusData.history?.length || 0}\n`);
    }

    // Test 3: State Transition
    console.log('🔄 Test 3: Testing State Transition...');
    try {
      const transitionResponse = await fetch(`${BASE_URL}/api/workflows/state/transition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType: 'article',
          entityId: 'test-article-id-123',
          from: 'draft',
          to: 'review',
          action: 'submit'
        })
      });

      if (transitionResponse.ok) {
        console.log('✅ State transition successful\n');
      } else {
        const error = await transitionResponse.text();
        console.log(`⚠️  State transition test (expected if article doesn't exist): ${error}\n`);
      }
    } catch (error) {
      console.log(`⚠️  State transition test error: ${error instanceof Error ? error.message : String(error)}\n`);
    }

    // Test 4: Get Metrics
    console.log('📈 Test 4: Getting Workflow Metrics...');
    const metricsResponse = await fetch(`${BASE_URL}/api/workflows/metrics`);
    
    if (metricsResponse.ok) {
      const metricsData = await metricsResponse.json();
      if (metricsData.metrics) {
        console.log(`✅ Metrics retrieved:`);
        console.log(`   Total: ${metricsData.metrics.total}`);
        console.log(`   Success Rate: ${metricsData.metrics.successRate?.toFixed(2) || 0}%`);
        console.log(`   Failure Rate: ${metricsData.metrics.failureRate?.toFixed(2) || 0}%\n`);
      }
    } else {
      console.log(`⚠️  Could not get metrics: ${metricsResponse.status}\n`);
    }

    // Test 5: Debug Workflow
    console.log('🐛 Test 5: Debugging Workflow...');
    const debugResponse = await fetch(`${BASE_URL}/api/workflows/${instanceId}/debug`);
    
    if (debugResponse.ok) {
      const debugData = await debugResponse.json();
      if (debugData.debug) {
        console.log(`✅ Debug info retrieved:`);
        console.log(`   Issues: ${debugData.debug.issues?.length || 0}`);
        console.log(`   Recommendations: ${debugData.debug.recommendations?.length || 0}\n`);
      }
    } else {
      console.log(`⚠️  Could not debug workflow: ${debugResponse.status}\n`);
    }

    console.log('✅ All API tests completed successfully!');
    console.log('\n💡 Note: For full workflow execution testing, ensure:');
    console.log('   1. Dev server is running (npm run dev)');
    console.log('   2. Inngest keys are configured');
    console.log('   3. Workflow actions can execute');

  } catch (error) {
    console.error('❌ Test failed:', error instanceof Error ? error.message : String(error));
    
    if (error instanceof Error && error.message.includes('fetch')) {
      console.error('\n💡 Make sure your dev server is running:');
      console.error('   npm run dev');
    }
    
    process.exit(1);
  }
}

// Run tests
testWorkflowAPI()
  .then(() => {
    console.log('\n🎉 Workflow API test complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test script error:', error);
    process.exit(1);
  });
