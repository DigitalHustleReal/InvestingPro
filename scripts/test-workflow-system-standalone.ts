/**
 * Test Workflow System (Standalone)
 * Script to test workflow execution and state transitions
 * Uses standalone Supabase client (no Next.js request context)
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

// Create standalone Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Import workflow types and utilities
import { 
  WorkflowDefinition, 
  WorkflowInstance,
  WorkflowExecutionHistory,
  ContentState
} from '../lib/workflows/types';
import { workflowExecutor } from '../lib/workflows/workflow-engine';
import { contentStateMachine } from '../lib/workflows/state-machine';
import { ARTICLE_PUBLISHING_WORKFLOW } from '../lib/workflows/definitions/article-publishing';
import { CONTENT_GENERATION_WORKFLOW } from '../lib/workflows/definitions/content-generation';

// Helper functions to work directly with database
async function saveWorkflowInstance(instance: WorkflowInstance): Promise<void> {
  const { error } = await supabase
    .from('workflow_instances')
    .upsert({
      id: instance.id,
      workflow_id: instance.workflowId,
      workflow_version: instance.workflowVersion,
      state: instance.state,
      current_step: instance.currentStep,
      completed_steps: instance.completedSteps,
      failed_steps: instance.failedSteps,
      context: instance.context,
      result: instance.result,
      error: instance.error,
      started_at: instance.startedAt,
      completed_at: instance.completedAt,
      metadata: instance.metadata,
      updated_at: new Date().toISOString()
    });

  if (error) {
    throw new Error(`Failed to save workflow instance: ${error.message}`);
  }
}

async function getWorkflowInstance(instanceId: string): Promise<WorkflowInstance | null> {
  const { data, error } = await supabase
    .from('workflow_instances')
    .select('*')
    .eq('id', instanceId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    workflowId: data.workflow_id,
    workflowVersion: data.workflow_version,
    state: data.state as WorkflowInstance['state'],
    currentStep: data.current_step,
    completedSteps: data.completed_steps || [],
    failedSteps: data.failed_steps || [],
    context: data.context || {},
    result: data.result,
    error: data.error,
    startedAt: data.started_at,
    completedAt: data.completed_at,
    metadata: data.metadata || {}
  };
}

async function getWorkflowHistory(instanceId: string): Promise<WorkflowExecutionHistory[]> {
  const { data, error } = await supabase
    .from('workflow_execution_history')
    .select('*')
    .eq('workflow_instance_id', instanceId)
    .order('timestamp', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map(item => ({
    id: item.id,
    workflowInstanceId: item.workflow_instance_id,
    stepId: item.step_id,
    state: item.state as WorkflowExecutionHistory['state'],
    input: item.input,
    output: item.output,
    error: item.error,
    duration: item.duration,
    retryAttempt: item.retry_attempt || 0,
    timestamp: item.timestamp,
    metadata: item.metadata || {}
  }));
}

async function getWorkflowMetrics() {
  const { data, error } = await supabase
    .from('workflow_instances')
    .select('state, started_at, completed_at');

  if (error || !data) {
    return {
      total: 0,
      byState: {
        pending: 0,
        running: 0,
        completed: 0,
        failed: 0,
        cancelled: 0,
        paused: 0
      },
      averageDuration: 0,
      successRate: 0,
      failureRate: 0
    };
  }

  const total = data.length;
  const byState: Record<string, number> = {
    pending: 0,
    running: 0,
    completed: 0,
    failed: 0,
    cancelled: 0,
    paused: 0
  };

  let totalDuration = 0;
  let completedCount = 0;
  let failedCount = 0;

  data.forEach(instance => {
    const state = instance.state;
    byState[state] = (byState[state] || 0) + 1;

    if (instance.completed_at && instance.started_at) {
      const duration = new Date(instance.completed_at).getTime() - new Date(instance.started_at).getTime();
      totalDuration += duration;
      completedCount++;
    }

    if (state === 'failed') {
      failedCount++;
    }
  });

  const averageDuration = completedCount > 0 ? totalDuration / completedCount : 0;
  const successRate = total > 0 ? ((total - failedCount) / total) * 100 : 0;
  const failureRate = total > 0 ? (failedCount / total) * 100 : 0;

  return {
    total,
    byState,
    averageDuration,
    successRate,
    failureRate
  };
}

async function testWorkflowSystem() {
  console.log('🧪 Testing Workflow System (Standalone)...\n');

  try {
    // Test 1: Start Article Publishing Workflow
    console.log('📝 Test 1: Starting Article Publishing Workflow...');
    const articleInstance = await workflowExecutor.execute(
      ARTICLE_PUBLISHING_WORKFLOW,
      { articleId: 'test-article-id-123' }
    );
    
    // Save instance to database
    await saveWorkflowInstance(articleInstance);
    
    console.log(`✅ Workflow started: ${articleInstance.id}`);
    console.log(`   State: ${articleInstance.state}`);
    console.log(`   Workflow: ${articleInstance.workflowId}\n`);

    // Test 2: Get Workflow Status
    console.log('📊 Test 2: Getting Workflow Status...');
    const status = await getWorkflowInstance(articleInstance.id);
    if (status) {
      console.log(`✅ Status retrieved:`);
      console.log(`   State: ${status.state}`);
      console.log(`   Completed Steps: ${status.completedSteps.length}`);
      console.log(`   Failed Steps: ${status.failedSteps.length}\n`);
    }

    // Test 3: Get Execution History
    console.log('📜 Test 3: Getting Execution History...');
    const history = await getWorkflowHistory(articleInstance.id);
    console.log(`✅ History retrieved: ${history.length} entries\n`);

    // Test 4: State Transition (just validation, not actual transition)
    console.log('🔄 Test 4: Testing State Transition Validation...');
    try {
      const canTransition = contentStateMachine.canTransition(
        'draft' as ContentState,
        'review' as ContentState,
        'submit',
        { title: 'Test', content: 'Test content' }
      );
      if (canTransition) {
        console.log('✅ State transition validation successful\n');
      } else {
        console.log('⚠️  State transition validation failed (check conditions)\n');
      }
    } catch (error) {
      console.log(`⚠️  State transition test error: ${error instanceof Error ? error.message : String(error)}\n`);
    }

    // Test 5: Get Valid Next States
    console.log('🎯 Test 5: Getting Valid Next States...');
    const nextStates = contentStateMachine.getValidNextStates('draft' as ContentState);
    console.log(`✅ Valid next states from 'draft': ${nextStates.join(', ')}\n`);

    // Test 6: Get Valid Actions
    console.log('⚡ Test 6: Getting Valid Actions...');
    const actions = contentStateMachine.getValidActions('draft' as ContentState);
    console.log(`✅ Valid actions from 'draft': ${actions.join(', ')}\n`);

    // Test 7: Debug Workflow (simplified)
    console.log('🐛 Test 7: Checking Workflow Status...');
    const debugStatus = await getWorkflowInstance(articleInstance.id);
    if (debugStatus) {
      const issues: string[] = [];
      if (debugStatus.failedSteps.length > 0) {
        issues.push(`Failed steps: ${debugStatus.failedSteps.join(', ')}`);
      }
      console.log(`✅ Debug info retrieved:`);
      console.log(`   Issues: ${issues.length}`);
      console.log(`   State: ${debugStatus.state}\n`);
    }

    // Test 8: Get Metrics
    console.log('📈 Test 8: Getting Workflow Metrics...');
    const metrics = await getWorkflowMetrics();
    console.log(`✅ Metrics retrieved:`);
    console.log(`   Total: ${metrics.total}`);
    console.log(`   Success Rate: ${metrics.successRate.toFixed(2)}%`);
    console.log(`   Failure Rate: ${metrics.failureRate.toFixed(2)}%\n`);

    // Test 9: Get Active Workflows
    console.log('🔄 Test 9: Getting Active Workflows...');
    const { data: activeData } = await supabase
      .from('workflow_instances')
      .select('*')
      .in('state', ['pending', 'running', 'paused']);
    console.log(`✅ Active workflows: ${activeData?.length || 0}\n`);

    // Test 10: Get Failed Workflows
    console.log('❌ Test 10: Getting Failed Workflows...');
    const { data: failedData } = await supabase
      .from('workflow_instances')
      .select('*')
      .eq('state', 'failed')
      .limit(10);
    console.log(`✅ Failed workflows: ${failedData?.length || 0}\n`);

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
